import pytest
import pandas as pd
from etl.validate import Validator

def test_validation_scores():
    validator = Validator()
    
    # Perfect dataset
    data = {"id": [1, 2, 3], "value": ["A", "B", "C"]}
    df = pd.DataFrame(data)
    
    valid, failed, duplicates, score = validator.validate_dataset(df, "test_perfect", "id")
    
    assert len(valid) == 3
    assert len(failed) == 0
    assert len(duplicates) == 0
    assert score == 100.0

def test_validation_duplicates():
    validator = Validator()
    
    # Dataset with a duplicate ID
    data = {"id": [1, 1, 3], "value": ["A", "B", "C"]}
    df = pd.DataFrame(data)
    
    valid, failed, duplicates, score = validator.validate_dataset(df, "test_dup", "id")
    
    assert len(duplicates) == 2  # Both records sharing the dup ID are flagged
    assert len(valid) == 1
    assert score < 100.0
