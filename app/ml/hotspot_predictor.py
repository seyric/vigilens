import pandas as pd


class HotspotPredictor:

    def __init__(self):
        self.df = pd.read_csv("data/prediction/crime_dataset.csv")

    def get_hotspots(self):

        hotspots = (
            self.df["area"]
            .value_counts()
            .reset_index()
        )

        hotspots.columns = ["Area", "Crime Count"]

        return hotspots


hotspot_predictor = HotspotPredictor()