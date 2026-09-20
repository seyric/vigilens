import pytest
from etl.extract import Extractor

def test_extractor_initialization():
    extractor = Extractor()
    assert extractor.config is not None
    assert "dag" in extractor.config

def test_execution_order():
    extractor = Extractor()
    order = extractor.get_execution_order()
    
    # Check that independent tables come first
    assert "districts" in order
    
    # Check dependency ordering
    districts_idx = order.index("districts")
    stations_idx = order.index("police_stations")
    
    assert stations_idx > districts_idx
