from __future__ import annotations

from pathlib import Path

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from database.models import Base


@pytest.fixture()
def sqlite_engine(tmp_path: Path):
    engine = create_engine(f"sqlite:///{tmp_path / 'Vigilens_test.db'}", future=True)
    Base.metadata.create_all(bind=engine)
    yield engine
    Base.metadata.drop_all(bind=engine)
    engine.dispose()


@pytest.fixture()
def session(sqlite_engine):
    Session = sessionmaker(bind=sqlite_engine, autoflush=False, autocommit=False, expire_on_commit=False)
    db = Session()
    try:
        yield db
    finally:
        db.close()

