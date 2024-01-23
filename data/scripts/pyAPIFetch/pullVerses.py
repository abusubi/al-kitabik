import requests
import pandas as pd
import json
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Base API URL
base_url = "https://offlinequran.com:3001/api/chapter/"

def fetch_data(surah_id):
    """Fetch data for a specific Surah ID."""
    url = f"{base_url}{surah_id}"
    response = requests.get(url, verify=False)
    if response.status_code == 200:
        response_json = response.json()
        # Check if the 'success' key exists and is True
        if response_json.get('success'):
            return response_json.get('data')  # Return only the 'data' part
        else:
            print(f"Error in response: {response_json.get('error')}")
            return None
    else:
        print(f"Failed to fetch data for Surah ID {surah_id}: {response.status_code}")
        return None

def save_to_excel(data, file_name):
    """Save data to an Excel file."""
    # Flatten the nested list of dictionaries
    flattened_data = [aya for surah in data for aya in surah]  # Assuming 'data' is a list of lists
    df = pd.DataFrame(flattened_data)
    df.to_excel(file_name, index=False)
    print(f"Data saved to {file_name}")


def save_to_json(data, file_name):
    """Save data to a JSON file."""
    with open(file_name, 'w') as json_file:
        json.dump(data, json_file, indent=4)
    print(f"Data saved to {file_name}")

def main():
    # Iterate through Surah IDs from 1 to 114 (or however many you wish)
    for surah_id in range(114, 115):
        data = fetch_data(surah_id)
        if data:
            # Create a DataFrame for each Surah
            df = pd.DataFrame(data)
            # Specify the file name for each Surah
            file_name = f"{surah_id}.xlsx"
            # Save each Surah to its own Excel file
            df.to_excel(file_name, index=False)
            print(f"Surah {surah_id} saved to {file_name}")

if __name__ == "__main__":
    main()

