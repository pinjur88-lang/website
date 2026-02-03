import requests
import json
import math

def epsg3765_to_wgs84(x, y):
    # Reference point: Church Sv. Jovan
    ref_x = 484608.18
    ref_y = 4852817.06
    ref_lat = 43.82438
    ref_lon = 16.30856
    
    # Approx 1 degree Lat = 111111m
    # Approx 1 degree Lon = 111111 * cos(lat)
    dy = y - ref_y
    dx = x - ref_x
    
    lat = ref_lat + (dy / 111130.0)
    lon = ref_lon + (dx / (111320.0 * math.cos(math.radians(ref_lat))))
    
    return lat, lon

def extract_baljci_center():
    url = "https://api.uredjenazemlja.hr/services/inspire/cp/wfs"
    params = {
        "service": "WFS",
        "version": "1.1.0",
        "request": "GetFeature",
        "typeName": "cp:CadastralParcel",
        "bbox": "484200,4852500,485000,4853500,urn:ogc:def:crs:EPSG::3765",
        "maxFeatures": "200",
        "outputFormat": "application/json"
    }
    
    print(f"Fetching parcels from WFS...")
    response = requests.get(url, params=params, timeout=30)
    if response.status_code != 200:
        print(f"Error: {response.status_code}")
        return
    
    data = response.json()
    features = data.get("features", [])
    print(f"Found {len(features)} parcels.")
    
    results = []
    for f in features:
        props = f.get("properties", {})
        ref_pt = props.get("referencePoint", {}).get("coordinates", [])
        
        if ref_pt:
            x, y = ref_pt[0], ref_pt[1]
            lat, lon = epsg3765_to_wgs84(x, y)
            
            parcel_num = props.get("label", "Unknown")
            area = props.get("areaValue", {}).get("value", 0)
            
            # Note: Owners are not in WFS. We will label as "Podatak o posjedniku"
            results.append({
                "Plot_Number": parcel_num,
                "Area": area,
                "Land_Use": "Katastarska čestica",
                "Owners": "Vidi posjedovni list",
                "Lat": round(lat, 6),
                "Lon": round(lon, 6)
            })
            
    # Save to CSV
    import csv
    with open("baljci_extracted_parcels.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["Plot_Number", "Area", "Land_Use", "Owners", "Lat", "Lon"])
        writer.writeheader()
        writer.writerows(results)
        
    # Generate SQL
    with open("seed_baljci_parcels.sql", "w", encoding="utf-8") as f:
        f.write("-- Seed data for Baljci parcels\n")
        f.write("DELETE FROM map_locations WHERE title LIKE 'Čestica %';\n\n")
        for r in results:
            title = f"Čestica {r['Plot_Number']}"
            description = f"Površina: {r['Area']} m2\\n{r['Land_Use']}"
            # Placeholder image
            image = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"
            f.write(f"INSERT INTO map_locations (lat, lng, title, description, image_url) VALUES ({r['Lat']}, {r['Lon']}, '{title}', '{description}', '{image}');\n")

    print(f"Extraction complete. Saved to baljci_extracted_parcels.csv and seed_baljci_parcels.sql")

if __name__ == "__main__":
    extract_baljci_center()
