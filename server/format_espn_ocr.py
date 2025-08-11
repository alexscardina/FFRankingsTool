import re
import csv

def fix_name_ocr_errors(name):
    return re.sub(r'\bIll\b', 'III', name)

def fix_bad_espn_names(name):
    if name == 'Aaron Jones': return 'Aaron Jones Sr.'
    if name == 'Patrick Mahomes': return 'Patrick Mahomes II'
    if name == 'Hollywood Brown': return 'Marquise Brown'
    if name == 'Anthony Richardson': return 'Anthony Richardson Sr.'
    if name == 'Chigoziem Okonkwo': return 'Chig Okonkwo'
    return name

with open('raw_espn_rankings.txt', 'r') as file:
    text = file.read()

# Fix spacing like "11.(RB5)" ➜ "11. (RB5)"
text = re.sub(r'(\d+)\.\(', r'\1. (', text)

# Regex: match player rows with optional junk characters before names
pattern = r'(\d+)\.\s*\((\w{2,3})\d+\)[\s—\-=_|~‘’\'"·\xa0+]*([A-Z][a-zA-Z\.\'\- ]+?),\s+([A-Z]{2,3})'

matches = re.findall(pattern, text)
print(f"⏳ Formatting ESPN OCR text...")

# Save cleaned player data to CSV
with open('./rankings/espn-rankings.csv', 'w', newline='') as csvfile:
    
    writer = csv.writer(csvfile)
    writer.writerow(['Rank', 'Position', 'Name', 'Team'])

    for rank, position, name, team in matches:
        new_name = fix_name_ocr_errors(name)
        newer_name = fix_bad_espn_names(new_name)
        clean_name = newer_name.strip().lstrip('_').strip()
        writer.writerow([rank, position[:2], clean_name, team])

print(f"✅ ESPN OCR text formatted to ./rankings/espn-rankings.csv")
