#!/usr/bin/env python3
"""
Script to update sections.json with majors and fix participant/survey counts.
"""

import json
import random
from pathlib import Path

# List of majors to use
MAJORS = [
    "BILGISAYAR MUHENDISLIGI",
    "TIP FAKULTESI",
    "MIMARLIK",
    "IKTISAT",
    "ELEKTRIK ELEKTRONIK MUHENDISLIGI",
    "MAKINE MUHENDISLIGI",
    "HEMSIRELIK",
    "TARIH",
    "SAGLIK BILIMLERI",
    "MUHENDISLIK",
    "SOSYOLOJI",
    "SIYASET BILIMI",
    "SAGLIK ENSTITUSU",
    "PSIKOLOJI",
    "SAGLIK",
    "SPOR BILIMLERI"
]


def update_sections_json(file_path):
    """Update sections.json with majors and fix participant/survey counts."""
    
    with open(file_path, 'r', encoding='utf-8') as f:
        sections = json.load(f)
    
    # Update each section
    for section in sections:
        section_id = section.get('id')
        rows_count = len(section.get('rows', []))
        
        # Fix participantCount and totalSurveys relationship
        # participantCount should match the number of rows, totalSurveys should be per participant
        section['participantCount'] = rows_count
        section['totalSurveys'] = 1  # Each row represents 1 survey per participant
        
        # Update Program names with random majors for sections 10-18
        # (section_10 already has majors, but we'll update sections 11-18)
        if section_id in ['section_10', 'section_11', 'section_12', 'section_13', 'section_14', 'section_15', 'section_16', 'section_17', 'section_18']:
            for row in section['rows']:
                row['Program'] = random.choice(MAJORS)
    
    # Write back to file
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(sections, f, ensure_ascii=False, indent=2)
    
    print(f"✓ Updated {file_path}")
    print(f"✓ Fixed participant counts and total surveys for all sections")
    print(f"✓ Updated section_10 with random majors")


def main():
    data_dir = Path(__file__).parent.parent / 'data'
    json_file = data_dir / 'sections.json'
    
    if not json_file.exists():
        print(f"Error: File not found: {json_file}")
        return
    
    update_sections_json(str(json_file))
    
    # Print summary
    with open(json_file, 'r', encoding='utf-8') as f:
        sections = json.load(f)
    
    print("\n" + "="*60)
    print("SUMMARY OF UPDATES")
    print("="*60)
    for section in sections:
        row_count = len(section['rows'])
        print(f"{section['id']}: {row_count} rows | {section['participantCount']} participants | {section['totalSurveys']} surveys/participant")


if __name__ == '__main__':
    main()
