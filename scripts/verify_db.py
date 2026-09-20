import sqlite3, os

db = sqlite3.connect('datasets/Vigilens_ai.db')
c = db.cursor()
tables = c.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").fetchall()
print(f"Tables loaded: {len(tables)}")
total = 0
for t in tables:
    count = c.execute(f"SELECT COUNT(*) FROM [{t[0]}]").fetchone()[0]
    total += count
    print(f"  {t[0]}: {count} rows")
print(f"\nTotal rows: {total}")
print(f"DB Size: {os.path.getsize('datasets/Vigilens_ai.db')/1024:.1f} KB")
db.close()
