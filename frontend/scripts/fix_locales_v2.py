
import json
import os

locales_dir = '/home/orhan/Documents/Projeler/vistainsaat/frontend/public/locales'

# Projects keys to ensure
project_keys = {
    "results": "results",
    "images": "Images",
    "emptyStateNote": "Sample projects are shown below until the live project feed becomes available."
}

files = [f for f in os.listdir(locales_dir) if f.endswith('.json')]

for filename in files:
    if filename in ['tr.json', 'en.json']:
        continue
        
    filepath = os.path.join(locales_dir, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    changed = False
    
    # 1. Ensure projects keys
    if 'projects' in data:
        for k, v in project_keys.items():
            if k not in data['projects']:
                data['projects'][k] = v
                changed = True
    
    # 2. Re-check about stats (just in case)
    if 'about' in data and 'sections' in data['about']:
        if 'stats' not in data['about']['sections']:
            data['about']['sections']['stats'] = {
                "experience": "Years of Experience",
                "projects": "Completed Projects",
                "team": "Expert Team"
            }
            changed = True

    if changed:
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"Updated {filename}")
    else:
        print(f"No changes for {filename}")
