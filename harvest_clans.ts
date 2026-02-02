
import fs from 'fs';
import https from 'https';

// 1. Initial List
const initialSurnames = [
    'Bašić', 'Bešević', 'Bibić', 'Džepina', 'Gegić', 'Grcić',
    'Ivić', 'Janković', 'Jošić', 'Klisurić', 'Milanković', 'Milorad',
    'Obradović', 'Radomilović', 'Romac', 'Tarle', 'Tetek', 'Tica',
    'Vidović', 'Vranković'
];

// 2. Poreklo Data (Processed and cleaned for insertion)
const porekloRawText = `
МИЛАНКОВИЋ – Лазаревдан
- 1684. Лазо Миланковић међу православцима са турске територије...
(truncating for brevity in code view, keeping logic consistent with previous step)
...
`;
// (Note: In the real execution, I will include the FULL porekloRawText variable as before, 
// just omitted here to save context window space in the display, but the file will have it all.)
// RE-INJECTING FULL TEXT for safety:
const POREKLO_FULL = `
МИЛАНКОВИЋ – Лазаревдан
- 1684. Лазо Миланковић међу православцима са турске територије (дрнишког подручја) склоњеним у Шибеник; 1711. Јован Миланковић. пок. Новака у Баљцима; 1756. Лазо Миланковић; 1948. године пописан је 131 Миланковић у Баљцима.
ЈАНКОВИЋ – Лазаревдан
- 1711. Јанко Кнежевић (вјероватно предак); око 1750. рођен Ристе, а око 1760. Тома Јанковић; 1948. године пописано је 55 Јанковића у Баљцима.
ЈОШИЋ – Лазаревдан
- 1711. Јован Јошић; 1756. Лука и Никола Јошић; 1948. године пописано је 28 Јошића у Баљцима.
КЛИСУРИЋ – Лазаревдан
- 1711. Тодор Клисурић; 1756. Божо и Миајло Кисурић; 1948. године пописано је 56 Клисурића у Баљцима.
ГЕГИЋ – Лазаревдан
- око 1730. рођен Јован Гегић; 1948. године пописана су 32 Гегића у Баљцима.
БИБИЋ (у 19. вијеку надимци Лошета, Дрљан и Амиџа) – Никољдан
- 1628. Радивој Бибић из Баљака; 1711. Сава, Никола, Јован и Стеван Бибић; 1756. Лазо, Филип, Тома, Петар, Петар звани Лошета, Илија и Боже Бибић; 1948. године пописана су 54 Бибића у Баљцима.
БЕШЕВИЋ – Никољдан
- 1711. харамбаша Јован Бешевић, Јован Бешевић пок. Милоша, Јован Бешевић пок. Обрада, Новак Бешевић, Бороје Бешевић; 1709. у Житнићу су имали посједе капетан/харамбаша Јован Баљак из Баљака и Новак Баљак из Баљака, а то су једино могли бити Бешевићи (крсна слава презимена Баљак из Житнића је исто Никољдан); Бешевићи су генерацијама били главари села Баљци; 1948. године пописана су 92 Бешевића у Баљцима.
ТАРЛАЋ (огранак Бешевића) – Никољдан
- 1756. Иван/Јован Бешевић-Тарлаћ; 1948. године пописано је 13 Тарлаћа у Баљцима.
ОБРАДОВИЋ (огранак Бешевића) – Никољдан
- 1711. Јован Бешевић пок. Обрада; 1756. Иван/Јован Бешевић-Обрадовић; 1948. године пописано је 16 Обрадовића у Баљцима.
АРАМБАШИЋ (огранак Бешевића) – Никољдан
- 1756. арамбаша Стојан Бешевић (вјероватно предак); у 19. вијеку Тодор Арамбашић; 1948. године пописано је 13 Арамбашића у Баљцима.
БАШИЋ (вјероватно огранак Бешевића)- Никољдан
- око 1720. рођен Андрија Башић; 1948. године пописана су 73 Башића у Баљцима.
ЏАЛЕТА (вјероватно огранак Бешевића или Бибића) – Никољдан
- 1757.  Симо Џалета добио кћер, а око 1740. рођен Петар Џалета; 1948. године пописан је 21 Џалета у Баљцима.
ТЕТЕК (вјероватно огранак Бибића) – Никољдан
- 1766. Лазо Тетек; 1948. године пописано је 5 Тетека у Баљцима.
ГЛИГОРИЋ – Ђурђевдан
- око 1750. Јован Глигорић, а рођени Алекса и Крстан Глигорић; 1948. године пописана су 3 Глигорића у Баљцима.
ГУТИЋ – Ђурђевдан
- око 1750. рођен Јован Гутић; 1948. године пописано је 7 Гутића у Баљцима.
ТОШИЋ – Ђурђевдан
- око 1760. рођен Стојан Тошић; 1948. године пописано је 8 Тошића у Баљцима.
БОГДАНОВИЋ (у 16. 17. и 18. вијеку)
- 1601. браћа Вушко и Радивој Богдановић; од Богдановића су настали Мудрићи, Ромци и вјероватно још нека презимена.
МУДРИЋ (раније Богдановић)
- 1709. Илија Богдановић из Баљака имао посјед у Житнићу, а презиме се наводи и као Богдановић-Мудре; крајем 18. вијека Марко Мудрић; 1948. године пописан је 1 Мудрић у Баљцима.
РОМАЦ (раније Богдановић) – Ђурђевдан
- 1711. Јован, Лука и Илија Богдановић; 1756. Јован Богдановић-Ромац; 1948. године пописана су 4 Ромца у Баљцима.
МАКСИЋ
- 1730-их рођен Марко Максић; ишчезли из села у 20. вијеку.
БАИЋ
- 1740-их Јован Баић; ишчезли из села у 20. вијеку.
БОРОЈЕВИЋ (огранак Бешевића из 18. и 19. вијека) – Никољдан
- 1711. Бороје Бешевић; 1756. Петар Бешевић-Боројевић.
ПУЂАШ (у 18. и 19. вијеку)
- 1756. Марко Пуђаш; иселили у Мирковце код Винковаца.
СИНЧЕВИЋ (постојали у 18. и 19. вијеку)
- око 1750. рођен Сава Синчевић.
КНЕЗ (постојали у 18. и 19. вијеку)
- око 1740. рођен Јаков Кнез; иселили у Славонију/Срем средином 19. вијека.
ГУГИЋ
- 1756. Иван Гугић (вјероватно доселили као ковачи/Цингано, пошто то пише за Гугића који је био у Шибенику/Варошу); 1948. године пописано је 14 Гугића у Баљцима.
ВИДОВИЋ
- дошли из сусједног села Градац крајем 19.  вијека; 1948. године пописано је 14 Видовића у Баљцима.
ЈАЈЧАНИН (у 18. и 19. вијеку)
- 1756. Мартин и Петар Јајчанин; 1835. Лука Јајчанин (у матичним књигама записивани као ковачи/Цингано).
DŽEPINA – Đurđevdan
- Porijeklom iz Drobnjaka (Tepci), takođe prisutni u Bosanskom Grahovu. U 15. vijeku se pominju u Skopskoj Crnoj Gori.
GRCIĆ
- Prezime izvedeno od etnonima "Grk". Prisutni u Dalmaciji (Drniš) i Dubrovačkom primorju od 17. vijeka.
IVIĆ – Sveti Jovan/Đurđevdan
- Prisutni u Glamoču (doselili iz Benkovca), te u Drnišu i Miljevcima.
MILORAD
- Prezime patronimskog porijekla od ličnog imena Milorad.
RADOMILOVIĆ – Nikoljdan
- Vjerovatno varijanta prezimena Radmilović. Povezuju se s Predojevićima iz Prijevora (Bileća). U Baljcima i Vrbici se pominju kao stočari.
TARLE
- Prezime starohrvatskog porijekla iz Dalmacije.
TICA – Jovanjdan/Đurđevdan
- Porijeklom iz Hercegovine (Polimlje, Zubci). Osnovali Tičevo.
VRANKOVIĆ – Đurđevdan
- Povezuju se s prezimenom Vranjković iz Knina. Prisutni u Banatu od 1920-ih.
`;

function normalize(str: string) {
    return str.toLowerCase()
        .replace(/č/g, 'c').replace(/ć/g, 'c').replace(/đ/g, 'd').replace(/š/g, 's').replace(/ž/g, 'z')
        .replace(/ч/g, 'c').replace(/ћ/g, 'c').replace(/ш/g, 's').replace(/ђ/g, 'd').replace(/ж/g, 'z');
}

function cyrillicToLatin(text: string) {
    const map: any = {
        'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Ђ': 'Đ', 'Е': 'E', 'Ж': 'Ž', 'З': 'Z', 'И': 'I',
        'Ј': 'J', 'К': 'K', 'Л': 'L', 'Љ': 'Lj', 'М': 'M', 'Н': 'N', 'Њ': 'Nj', 'О': 'O', 'П': 'P', 'Р': 'R',
        'С': 'S', 'Т': 'T', 'Ћ': 'Ć', 'У': 'U', 'Ф': 'F', 'Х': 'H', 'Ц': 'C', 'Ч': 'Č', 'Џ': 'Dž', 'Ш': 'Š',
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'ђ': 'đ', 'е': 'e', 'ж': 'ž', 'з': 'z', 'и': 'i',
        'ј': 'j', 'к': 'k', 'л': 'l', 'љ': 'lj', 'м': 'm', 'н': 'n', 'њ': 'nj', 'о': 'o', 'п': 'p', 'р': 'r',
        'с': 's', 'т': 't', 'ћ': 'ć', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'č', 'џ': 'dž', 'ш': 'š'
    };
    return text.split('').map(char => map[char] || char).join('');
}

// Parse Poreklo data into a Map
const porekloMap = new Map<string, string>();
const lines = POREKLO_FULL.split('\n');
let currentSurname = '';
let currentDescription = '';

for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const headerMatch = trimmed.match(/^([А-ШЈЉЊЋЂČĆŠĐŽA-Z\s]+)(?:\([^\)]+\))?\s*[-–]/);
    if (headerMatch) {
        if (currentSurname) porekloMap.set(normalize(currentSurname), currentDescription.trim());
        currentSurname = cyrillicToLatin(headerMatch[1]).trim();
        currentSurname = currentSurname.charAt(0).toUpperCase() + currentSurname.slice(1).toLowerCase();
        currentDescription = trimmed + '\n';
    } else {
        if (currentSurname) currentDescription += trimmed + '\n';
    }
}
if (currentSurname) porekloMap.set(normalize(currentSurname), currentDescription.trim());

// Capitalization Helper
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

// Get unique keys
const allKeys = new Set([...initialSurnames.map(normalize), ...porekloMap.keys()]);
const processedSurnames = new Set<string>();

async function fetchActaData(surname: string, lang: 'en' | 'hr' | 'de') {
    const url = `https://actacroatica.com/${lang}/surname/${encodeURIComponent(surname)}/`;
    return new Promise<string>((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(data));
            res.on('error', (err) => reject(null));
        }).on('error', (err) => reject(null));
    }).catch(() => '');
}

function extractSection(html: string, startMarkers: string[], endMarkers: string[]): string {
    if (!html) return '';
    let startIndex = -1;
    let usedStartMarker = '';

    // Try multiple start markers (languages differ)
    for (const m of startMarkers) {
        startIndex = html.indexOf(m);
        if (startIndex !== -1) {
            usedStartMarker = m;
            break;
        }
    }
    if (startIndex === -1) return '';

    const contentStart = startIndex + usedStartMarker.length;

    let contentEnd = -1;
    for (const m of endMarkers) {
        const potentialEnd = html.indexOf(m, contentStart);
        if (potentialEnd !== -1 && (contentEnd === -1 || potentialEnd < contentEnd)) {
            contentEnd = potentialEnd;
        }
    }

    if (contentEnd === -1) contentEnd = html.length; // Fallback

    let content = html.substring(contentStart, contentEnd);

    return content.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').replace(/&nbsp;/g, ' ').trim();
}

async function run() {
    let sqlOutput = `/** MEMORIAL DATA SEED (Multi-Language) */\n\nDELETE FROM clans WHERE surname = 'Genda';\n\n`;

    // Process each surname
    for (const key of allKeys) {
        if (processedSurnames.has(key)) continue;
        processedSurnames.add(key);

        let displayName = initialSurnames.find(s => normalize(s) === key) || capitalize(key);
        console.log(`Processing ${displayName}...`);

        const porekloInfoRaw = porekloMap.get(key) || '';
        const porekloInfo = cyrillicToLatin(porekloInfoRaw);

        // -- FETCH DATA FOR 3 LANGUAGES --
        const langs = ['en', 'hr', 'de'];
        const results: any = {};

        for (const lang of langs) {
            await new Promise(r => setTimeout(r, 100)); // Rate limit
            const html = await fetchActaData(displayName, lang as any);

            // Define markers per language
            let markers: any = {
                en: {
                    descStart: [`Surname ${displayName} in modern Croatia`],
                    prevStart: ['Prevalence'],
                    worldStart: ['Outside Croatia'],
                    end: ['Characteristic first names', 'Mentions in sources', 'Do you know more?']
                },
                hr: {
                    descStart: [`Prezime ${displayName} u modernoj Hrvatskoj`],
                    prevStart: ['Rasprostranjenost'],
                    worldStart: ['Izvan Hrvatske'],
                    end: ['Karakteristična imena', 'Spominjanja u izvorima', 'Znate li više?']
                },
                de: {
                    descStart: [`Nachname ${displayName} im modernen Kroatien`],
                    prevStart: ['Verbreitung'],
                    worldStart: ['Außerhalb Kroatiens'],
                    end: ['Charakteristische Vornamen', 'Erwähnungen in Quellen', 'Wissen Sie mehr?']
                }
            };

            const m = markers[lang];

            results[lang] = {
                desc: extractSection(html, m.descStart, m.prevStart) || (lang === 'en' ? 'Data collecting.' : (lang === 'de' ? 'Daten werden gesammelt.' : 'Podaci se prikupljaju.')),
                prev: extractSection(html, m.prevStart, m.worldStart) || (lang === 'en' ? 'Data missing.' : (lang === 'de' ? 'Keine Daten.' : 'Nema podataka.')),
                world: extractSection(html, m.worldStart, m.end) || (lang === 'en' ? 'Data missing.' : (lang === 'de' ? 'Keine Daten.' : 'Nema podataka.'))
            };
        }

        // -- MERGE DESCRIPTIONS --
        // HR: Poreklo (if exists) + Acta HR
        let descHR = '';
        if (porekloInfo) descHR += `[IZVOR: POREKLO.RS - BALJCI]\n${porekloInfo}\n\n`;
        if (results.hr.desc && results.hr.desc.length > 20) descHR += `[OPĆENITO]\n${results.hr.desc}`;
        if (!descHR) descHR = 'Podaci se prikupljaju.';

        // EN/DE: Just Acta (Poreklo is untranslated)
        // Optionally add a note about Poreklo availability in HR
        let descEN = results.en.desc;
        if (porekloInfo) descEN += `\n\n(Detailed local history available in Croatian section).`;

        let descDE = results.de.desc;

        const escape = (str: string) => str.replace(/'/g, "''");

        sqlOutput += `
INSERT INTO clans (
    surname, 
    prevalence_hr, world_distribution_hr, description_hr,
    prevalence_en, world_distribution_en, description_en,
    prevalence_de, world_distribution_de, description_de
)
VALUES (
    '${escape(displayName)}',
    '${escape(results.hr.prev)}', '${escape(results.hr.world)}', '${escape(descHR)}',
    '${escape(results.en.prev)}', '${escape(results.en.world)}', '${escape(descEN)}',
    '${escape(results.de.prev)}', '${escape(results.de.world)}', '${escape(descDE)}'
)
ON CONFLICT (surname) DO UPDATE SET
    prevalence_hr = EXCLUDED.prevalence_hr, world_distribution_hr = EXCLUDED.world_distribution_hr, description_hr = EXCLUDED.description_hr,
    prevalence_en = EXCLUDED.prevalence_en, world_distribution_en = EXCLUDED.world_distribution_en, description_en = EXCLUDED.description_en,
    prevalence_de = EXCLUDED.prevalence_de, world_distribution_de = EXCLUDED.world_distribution_de, description_de = EXCLUDED.description_de;
`;
    }

    fs.writeFileSync('memorial_seed_multilang.sql', sqlOutput);
    console.log('Done.');
}

run();
