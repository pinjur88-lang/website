import requests
import random
import json
import time

MUNICIPALITY_ID = "305502" # Baljci

def generate_status(id_val):
    return (id_val ^ 0xffff) & 0xffff

def get_headers():
    return {
        "Accept": "application/json",
        "Origin": "https://www.katastar.hr",
        "Referer": "https://www.katastar.hr/",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

def lookup_parcel_owners(parcel_number):
    print(f"\n--- Processing Parcel {parcel_number} ---")
    
    # 1. Search for Parcel ID
    query = f"{MUNICIPALITY_ID}-{parcel_number}"
    search_url = f"https://oss.uredjenazemlja.hr/rest/katHr/searchNationalCadastralReference?query={query}"
    
    print(f"Step 1: Searching ID via {search_url}...")
    resp = requests.get(search_url, headers=get_headers())
    
    # DEBUG
    print(f"Response Code: {resp.status_code}")
    if resp.status_code != 200:
        print(f"Error Body: {resp.text[:500]}")
        return None
        
    try:
        results = resp.json()
    except Exception as e:
        print(f"JSON Parse Error: {e}")
        print(f"Response Text: {resp.text[:1000]}")
        return None
    # The API returns a list, usually the first one is correct if matches
    if not results:
        print("No results found.")
        return None
        
    # Find the matching parcel object
    target_parcel = None
    for item in results:
        # We look for type "C" (Cestica?) or matching number
        if item.get("blockNumber") == parcel_number: # blockNumber often holds the parcel number in search results
             target_parcel = item
             break
    
    if not target_parcel and results:
        target_parcel = results[0] # Fallback
        
    parcel_id = target_parcel.get("id")
    print(f"Found Internal Parcel ID: {parcel_id}")
    
    if not parcel_id:
        return None

    # 2. Get Parcel Info (to find Possession Sheet ID)
    rand_id = random.randint(1, 65535)
    status = generate_status(rand_id)
    info_url = f"https://oss.uredjenazemlja.hr/rest/katHr/parcelInfo?id={rand_id}&status={status}&parcelId={parcel_id}"
    
    print(f"Step 2: Getting Info...")
    resp = requests.get(info_url, headers=get_headers())
    
    if resp.status_code != 200:
        print(f"Info Failed: {resp.status_code}")
        return None
        
    info_data = resp.json()
    pl_id = info_data.get("posjedovniListId")
    print(f"Found Possession Sheet ID (PL): {pl_id}")
    
    if not pl_id:
        return None
        
    # 3. Get Possession Sheet (Owners)
    rand_id = random.randint(1, 65535)
    status = generate_status(rand_id)
    pl_url = f"https://oss.uredjenazemlja.hr/rest/katHr/possessionSheetDetail?id={rand_id}&status={status}&possessionSheetId={pl_id}"
    
    print(f"Step 3: Fetching Owners...")
    resp = requests.get(pl_url, headers=get_headers())
    
    if resp.status_code != 200:
        print(f"PL Failed: {resp.status_code}")
        return None
        
    pl_data = resp.json()
    owners = []
    
    # The structure usually has 'posjednici' list
    for person in pl_data.get("posjednici", []):
        name = person.get("imePrezimeNaziv", "").strip()
        share = person.get("udio", "")
        if name:
            owners.append(f"{name} ({share})")
            
    print(f"Owners Found: {owners}")
    return owners

if __name__ == "__main__":
    # Test with a known existing parcel from our previous list
    lookup_parcel_owners("1053/1")
