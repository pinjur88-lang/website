import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import Papa from 'papaparse';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const CSV_PATH = 'C:/Users/Tito/.gemini/antigravity/scratch/Baljci_Archive/data/processed/village_tree.csv';

async function seedGenealogy() {
    console.log(`Reading CSV from ${CSV_PATH}...`);

    if (!fs.existsSync(CSV_PATH)) {
        console.error(`File not found: ${CSV_PATH}`);
        process.exit(1);
    }

    const csvFile = fs.readFileSync(CSV_PATH, 'utf8');

    Papa.parse(csvFile, {
        header: true,
        complete: async (results) => {
            const rows = results.data;
            console.log(`Parsed ${rows.length} records.`);

            // Transform rows to match DB schema
            // CSV headers: id,name,surname,sex,father_id,mother_id,father_name,mother_name,birth_year,death_year,origin
            const validRows = rows.map((row: any) => {
                if (!row.id || !row.name) return null; // Skip empty rows

                return {
                    original_id: row.id,
                    name: row.name,
                    surname: row.surname,
                    sex: row.sex,
                    // Handle empty strings for foreign keys to avoid violating constraints (or just use null)
                    father_id: row.father_id || null,
                    mother_id: row.mother_id || null,
                    father_name: row.father_name,
                    mother_name: row.mother_name,
                    birth_year: row.birth_year,
                    death_year: row.death_year,
                    origin: row.origin
                };
            }).filter(r => r !== null);

            console.log(`Prepared ${validRows.length} valid records for insertion.`);

            // Insert in batches to avoid timeouts/limits
            const BATCH_SIZE = 100;
            for (let i = 0; i < validRows.length; i += BATCH_SIZE) {
                const batch = validRows.slice(i, i + BATCH_SIZE);
                const { error } = await supabase
                    .from('people')
                    .upsert(batch, { onConflict: 'original_id' });

                if (error) {
                    console.error(`Error inserting batch ${i}:`, error);
                } else {
                    console.log(`Inserted batch ${i} - ${i + batch.length}`);
                }
            }

            console.log('Seeding complete!');
        },
        error: (err: any) => {
            console.error("Error parsing CSV:", err);
        }
    });
}

seedGenealogy();
