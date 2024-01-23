import requests
import pandas as pd
import json
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# API URL
api_url = "https://offlinequran.com:3001/api/chapters"

def fetch_data(url):
    """Fetch data from the API and extract specific fields."""
    response = requests.get(url, verify=False)
    if response.status_code == 200:
        data = response.json()
        # The actual list is stored under the key 'data'
        sura_list = data['data']
        extracted_data = [{"sura_number": item["sura_number"], "sura_name": item["sura_name"]} for item in sura_list]
        return extracted_data
    else:
        raise Exception(f"Failed to fetch data: {response.status_code}")

def save_to_excel(data, file_name):
    """Save data to an Excel file."""
    df = pd.DataFrame(data)
    df.to_excel(file_name, index=False)
    print(f"Data saved to {file_name}")

def save_to_json(data, file_name):
    """Save data to a JSON file."""
    with open(file_name, 'w') as json_file:
        json.dump(data, json_file, indent=4)
    print(f"Data saved to {file_name}")

def main():
    # Fetch data from API
    data = fetch_data(api_url)

    # Specify the file names for the Excel and JSON files
    excel_file_name = "chapters.xlsx"
    json_file_name = "chapters.json"

    # Save data to Excel
    save_to_excel(data, excel_file_name)

    # Save data to JSON
    save_to_json(data, json_file_name)

if __name__ == "__main__":
    main()
