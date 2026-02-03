import requests
import random
import time
import csv
import json

# TARGET PARAMETERS
MUNICIPALITY_ID = "305502"  # BALJCI
BASE_URL = "https://oss.uredjenazemlja.hr/rest/katHr/parcelInfo"
COORD_GRID_CENTER = (43.82438, 16.30856) # Baljci Center

def generate_status(id_val):
    """
    Replicates the JavaScript status generation logic for the oss portal.
    status = (id ^ 0xffff) & 0xffff
    """
    return (id_val ^ 0xffff) & 0xffff

def get_parcel_info(parcel_id):
    """
    Fetches available attribute data for a specific parcel ID.
    Method A: Network Interception / API Replication
    """
    rand_id = random.randint(1, 65535)
    status = generate_status(rand_id)
    
    params = {
        "id": rand_id,
        "status": status,
        "parcelId": parcel_id
    }
    
    headers = {
        "Origin": "https://www.katastar.hr",
        "Referer": "https://www.katastar.hr/",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    
    try:
        response = requests.get(BASE_URL, params=params, headers=headers, timeout=10)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Error fetching {parcel_id}: HTTP {response.status_code}")
            return None
    except Exception as e:
        print(f"Exception for {parcel_id}: {str(e)}")
        return None

def identify_parcel(lat, lon):
    """
    Performs a spatial identify to get the parcelId for a coordinate.
    Method B: Grid Traversal / Spatial Identify
    """
    rand_id = random.randint(1, 65535)
    status = generate_status(rand_id)
    
    # The portal uses a specific identify endpoint
    # Note: Coordinates might need to be in EPSG:3765 (Croatia TM) 
    # but the API often accepts WGS84 for identify if formatted correctly.
    # For now, we use a placeholder logic for the identify request.
    identify_url = "https://oss.uredjenazemlja.hr/rest/katHr/identify"
    
    params = {
        "id": rand_id,
        "status": status,
        "lat": lat,
        "lon": lon,
        "zoom": 18
    }
    
    headers = {
        "Origin": "https://www.katastar.hr",
        "Referer": "https://www.katastar.hr/",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    try:
        response = requests.get(identify_url, params=params, headers=headers, timeout=10)
        if response.status_code == 200:
            results = response.json()
            if results and len(results) > 0:
                # Return the first parcelId found at this point
                return results[0].get("parcelId")
        return None
    except:
        return None

def get_owners(possession_sheet_id):
    """
    Fetches owner/possessor names for a given possession sheet.
    Method C: Ownership Detail API
    """
    rand_id = random.randint(1, 65535)
    status = generate_status(rand_id)
    
    # Endpoint for possession sheet details
    # This often contains the list of names we need
    owner_url = "https://oss.uredjenazemlja.hr/rest/katHr/possessionSheetDetail"
    
    params = {
        "id": rand_id,
        "status": status,
        "possessionSheetId": possession_sheet_id
    }
    
    headers = {
        "Origin": "https://www.katastar.hr",
        "Referer": "https://www.katastar.hr/",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    try:
        response = requests.get(owner_url, params=params, headers=headers, timeout=10)
        if response.status_code == 200:
            data = response.json()
            # Extract names from the 'posjednici' or 'vlasnici' array
            posjednici = data.get("posjednici", [])
            names = [p.get("imePrezimeNaziv", "Unknown") for p in posjednici]
            return ", ".join(names)
        return "Nije dostupno"
    except:
        return "Greska"

def generate_sql_seed(results):
    """
    Generates a SQL seed file for the map_locations table.
    """
    with open("seed_village_houses.sql", "w", encoding="utf-8") as f:
        f.write("-- SQL Seed for Baljci Village Houses\n")
        f.write("-- Run this in Supabase SQL Editor\n\n")
        
        for row in results:
            title = f"Čestica {row['Plot_Number']}"
            description = f"Posjednik: {row['Owners']}\\nPovršina: {row['Area']} m2\\nNamjena: {row['Land_Use']}"
            # Default stone house image for village aesthetics
            image = "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80"
            
            f.write(f"INSERT INTO map_locations (lat, lng, title, description, image_url) \n")
            f.write(f"VALUES ({row['Lat']}, {row['Lon']}, '{title}', '{description}', '{image}');\n\n")

def main():
    output_file = "baljci_road_houses.csv"
    fieldnames = ["Plot_Number", "Area", "Land_Use", "Owners", "Lat", "Lon"]
    
    # HIGH-DENSITY ROAD POINTS
    road_points = [
        (43.82438, 16.30856), (43.82455, 16.30870), (43.82475, 16.30890), # Near Church
        (43.82500, 16.30910), (43.82525, 16.30935), (43.82550, 16.30960), # East slope
        (43.82580, 16.30985), (43.82615, 16.31020), (43.82650, 16.31050), # Central approach
        (43.82685, 16.31065), (43.82725, 16.31080), (43.82765, 16.31095), # Mid-rise
        (43.82805, 16.31110), (43.82845, 16.31130), (43.82885, 16.31145), # Upper cluster
        (43.82900, 16.31150), (43.82920, 16.31140), (43.82945, 16.31115), # North peak
        (43.82950, 16.31090), (43.82950, 16.31065), (43.82945, 16.31035), # West turn
        (43.82930, 16.31010), (43.82905, 16.30985), (43.82880, 16.30965), # Returning South
        (43.82850, 16.30950), (43.82820, 16.30920), (43.82790, 16.30890), # Loop descent
        (43.82755, 16.30855), (43.82725, 16.30825), (43.82700, 16.30800), # Back-path
        (43.82675, 16.30785), (43.82645, 16.30770), (43.82610, 16.30760), # Lower loop
        (43.82575, 16.30750), (43.82540, 16.30765), (43.82505, 16.30795), # Closing
        (43.82470, 16.30830) # Final approach to Church
    ]
    
    print(f"Starting prioritized High-Density extraction along the loop...")
    
    found_parcels = {} 
    results_to_sql = []

    with open(output_file, mode='w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        
        for lat, lon in road_points:
            print(f"Identifying parcels near ({lat}, {lon})...")
            p_id = identify_parcel(lat, lon)
            
            if p_id and p_id not in found_parcels:
                print(f"Found Parcel ID: {p_id}. Fetching details...")
                data = get_parcel_info(p_id)
                
                if data:
                    # Fetch owner names if possession sheet available
                    ps_id = data.get("posjedovniListId")
                    owners = "N/A"
                    if ps_id:
                        print(f"Fetching owners for PL {ps_id}...")
                        owners = get_owners(ps_id)
                    
                    row = {
                        "Plot_Number": data.get("brojCestice", "N/A"),
                        "Area": data.get("povrsina", "N/A"),
                        "Land_Use": data.get("nacinUporabe", "N/A"),
                        "Owners": owners,
                        "Lat": lat,
                        "Lon": lon
                    }
                    writer.writerow(row)
                    results_to_sql.append(row)
                    found_parcels[p_id] = True
            
            time.sleep(random.uniform(2, 5))

    print(f"Generating SQL seed...")
    generate_sql_seed(results_to_sql)
    print(f"Extraction and seed generation complete. Data saved to {output_file} and seed_village_houses.sql")

if __name__ == "__main__":
    main()
