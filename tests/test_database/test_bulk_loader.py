from __future__ import annotations

import pandas as pd

from database.bulk_loader import BulkLoader


def test_bulk_loader_writes_dataframe(sqlite_engine) -> None:
    loader = BulkLoader(engine=sqlite_engine, chunk_size=1)
    frame = pd.DataFrame(
        [
            {
                "district_id": "district-north",
                "district_name": "North",
                "district_code": "N01",
                "region": "Metro",
                "headquarters": "North HQ",
            },
            {
                "district_id": "district-south",
                "district_name": "South",
                "district_code": "S01",
                "region": "Metro",
                "headquarters": "South HQ",
            },
        ]
    )

    result = loader.load_dataframe("districts", frame, use_copy=False)

    assert result.rows_loaded == 2
    assert result.batches == 2
    assert result.used_copy is False
