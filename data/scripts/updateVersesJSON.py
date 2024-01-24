import os
import json

def process_json_files(folder_path):
    for i in range(1, 115):  # Assuming files are named from 2.json to 5.json
        file_path = os.path.join(folder_path, f"{i}.json")

        if os.path.exists(file_path):
            with open(file_path, 'r') as file:
                # Read the file content and close the file
                content = file.read()

            # Adding comma after each '}' except the last one
            content = content.replace("}", "},")
            content = content.rsplit(",", 1)[0]  # Removing the last comma

            # Wrapping the content
            wrapped_content = '{"data":[' + content + ']}'

            with open(file_path, 'w') as file:
                # Write the modified content back to the file
                file.write(wrapped_content)
        else:
            print(f"File not found: {file_path}")

# Example usage
folder_path = '_pullVersesExport/exportJSONtester'  # Replace with the path to your folder
process_json_files(folder_path)
