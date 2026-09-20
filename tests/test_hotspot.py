from app.ml.hotspot_predictor import hotspot_predictor

hotspots = hotspot_predictor.get_hotspots()

print("\n========== CRIME HOTSPOTS ==========\n")

print(hotspots)

print("\n===================================")