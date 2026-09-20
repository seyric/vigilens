"""Generate the Sprint 5 delivery layer exports."""

from __future__ import annotations

from delivery.sprint5 import Sprint5DataDeliveryLayer
from database.connection import get_session


def main() -> None:
    with get_session() as session:
        bundles = Sprint5DataDeliveryLayer(session).write_all()
    for bundle in bundles:
        print(f"{bundle.name}: {bundle.path}")


if __name__ == "__main__":
    main()
