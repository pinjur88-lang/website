import requests
import random

def generate_status(id_val):
    return (id_val ^ 0xffff) & 0xffff

def test():
    parcel_id = "15738579"
    rand_id = random.randint(1, 65535)
    status = generate_status(rand_id)
    
    url = f"https://oss.uredjenazemlja.hr/rest/katHr/parcelInfo?id={rand_id}&status={status}&parcelId={parcel_id}"
    headers = {
        "Accept": "application/json",
        "Origin": "https://www.katastar.hr",
        "Referer": "https://www.katastar.hr/",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    
    print(f"URL: {url}")
    response = requests.get(url, headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Content: {response.text[:500]}")

if __name__ == "__main__":
    test()
