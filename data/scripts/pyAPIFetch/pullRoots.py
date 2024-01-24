import requests
import pandas as pd
import json
from requests.packages.urllib3.exceptions import InsecureRequestWarning

# Suppress only the single InsecureRequestWarning from urllib3
requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

def fetch_data(truerootID):
    url = f"https://offlinequran.com:3001/api/verse/{truerootID}/sentences"
    try:
        response = requests.get(url, verify=False)  # Disable SSL certificate verification
        response.raise_for_status()
        return response.json()
    except requests.HTTPError as err:
        print(f"HTTP error occurred: {err}")
    except Exception as err:
        print(f"An error occurred: {err}")
    return None

def process_and_save_data(data, truerootID):
    # Extract 'data' field from response
    items = data.get("data", [])
    
    # Check if data is a list of dictionaries
    if not all(isinstance(item, dict) for item in items):
        print(f"Data format is incorrect for truerootID {truerootID}")
        return

    # Extracting required fields
    processed_data = [{
        "indexid": item.get("indexid"),
        "wordid": item.get("wordid"),
        "word": item.get("word"),
        "rootid": item.get("rootid"),
        "rootword": item.get("rootword"),
        "meanings": item.get("meanings"),
        "sentence": item.get("sentence")
    } for item in items]

    # Convert to DataFrame and Save to Excel and JSON
    df = pd.DataFrame(processed_data)
    df.to_excel(f"{truerootID}.xlsx", index=False)
    df.to_json(f"{truerootID}.json", orient='records', lines=True, indent=4)

    print(f"Data for truerootID {truerootID} saved to {truerootID}.xlsx and {truerootID}.json")

def main():
    for truerootID in range(6236, 6237):
        data = fetch_data(truerootID)
        if data and "data" in data:
            process_and_save_data(data, truerootID)
        else:
            print(f"No data received for truerootID {truerootID}")

if __name__ == "__main__":
    main()
