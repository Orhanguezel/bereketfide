
import json
import os

locales_dir = '/home/orhan/Documents/Projeler/vistainsaat/frontend/public/locales'
stats_tr = {
    "experience": "Yıllık Deneyim",
    "projects": "Tamamlanan Proje",
    "team": "Uzman Kadro"
}
stats_en = {
    "experience": "Years of Experience",
    "projects": "Completed Projects",
    "team": "Expert Team"
}

files = [f for f in os.listdir(locales_dir) if f.endswith('.json')]

for filename in files:
    filepath = os.path.join(locales_dir, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # tr and en already have it in some form, but let's ensure consistency
    # Actually tr.json and en.json are mostly fine now that I've updated the code.
    # But let's check for missing stats in others.
    
    if 'about' in data and 'sections' in data['about']:
        if 'stats' not in data['about']['sections']:
            # For non-tr/en, use English values as fallback
            data['about']['sections']['stats'] = stats_en
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            print(f"Updated {filename}")
        else:
            print(f"Skipping {filename}, stats already present")
    else:
        print(f"Skipping {filename}, structure doesn't match")
