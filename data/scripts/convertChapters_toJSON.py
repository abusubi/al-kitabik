import pandas as pd

def convert_excel_to_json(excel_file_path, json_file_path):
    # Read the Excel file. Assuming the first row is the header
    df = pd.read_excel(excel_file_path)

    # Convert the DataFrame to JSON
    json_data = df.to_json(orient='records', lines=True)

    # Write the JSON data to a file
    with open(json_file_path, 'w') as file:
        file.write(json_data)

# Looping through the files
for i in range(1, 115):  # 115 is exclusive, so it will stop at 114
    excel_file = f'_pullVersesExport/{i}.xlsx'  # Removed the leading slash
    json_file = f'{i}.json'
    convert_excel_to_json(excel_file, json_file)
