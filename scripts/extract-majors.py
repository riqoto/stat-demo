#!/usr/bin/env python3
"""
Script to extract majors from OMA CSV data files.
"""

import csv
from pathlib import Path


def extract_majors(csv_file_path):
    """
    Extract majors from a CSV file.
    
    Args:
        csv_file_path (str): Path to the CSV file
        
    Returns:
        list: List of unique majors
    """
    majors = []
    
    try:
        with open(csv_file_path, 'r', encoding='utf-8') as file:
            # Read the CSV file
            reader = csv.reader(file)
            
            # Skip header row
            next(reader, None)
            
            # Extract majors (first column of each row)
            for row in reader:
                if row:  # Check if row is not empty
                    major = row[0].strip()
                    if major:  # Check if major name is not empty
                        majors.append(major)
        
        return majors
    
    except FileNotFoundError:
        print(f"Error: File '{csv_file_path}' not found.")
        return []
    except Exception as e:
        print(f"Error reading file: {e}")
        return []


def extract_unique_majors(csv_file_path):
    """
    Extract unique majors from a CSV file (removing duplicates).
    
    Args:
        csv_file_path (str): Path to the CSV file
        
    Returns:
        list: List of unique majors
    """
    majors = extract_majors(csv_file_path)
    return list(dict.fromkeys(majors))  # Preserve order while removing duplicates


def main():
    # Get the data file path
    script_dir = Path(__file__).parent
    data_dir = script_dir.parent / 'data'
    csv_file = data_dir / 'oma_csv_13.txt'
    
    print("Extracting majors from:", csv_file)
    print("-" * 50)
    
    # Extract all majors
    all_majors = extract_majors(str(csv_file))
    print(f"\nAll majors ({len(all_majors)} total):")
    for i, major in enumerate(all_majors, 1):
        print(f"  {i}. {major}")
    
    # Extract unique majors
    unique_majors = extract_unique_majors(str(csv_file))
    print(f"\nUnique majors ({len(unique_majors)} unique):")
    for i, major in enumerate(unique_majors, 1):
        print(f"  {i}. {major}")
    
    # Export to JSON
    import json
    output_file = data_dir / 'majors.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump({
            'total_count': len(all_majors),
            'unique_count': len(unique_majors),
            'majors': unique_majors
        }, f, ensure_ascii=False, indent=2)
    
    print(f"\nMajors exported to: {output_file}")


if __name__ == '__main__':
    main()
