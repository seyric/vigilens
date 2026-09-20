from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from database.connection import get_db
from backend.auth.dependencies import get_current_active_user
from backend.auth.models import CurrentUser
from backend.analytics.service import analytics_service

analytics_router = APIRouter(prefix="/analytics", tags=["analytics"])

# ── Dashboard Analytics Endpoints ────────────────────────────────────────────

@analytics_router.get("/dashboard/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_active_user),
):
    """Retrieve high-level dashboard counters and KPIs scoped by user role."""
    return analytics_service.get_dashboard_stats(db=db, user=current_user)


@analytics_router.get("/dashboard/crimes-by-district")
def get_crimes_by_district(
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_active_user),
):
    """Retrieve distribution of crimes by district."""
    return analytics_service.get_crimes_by_district(db=db, user=current_user)


@analytics_router.get("/dashboard/crimes-by-category")
def get_crimes_by_category(
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_active_user),
):
    """Retrieve breakdown of crimes by category type."""
    return analytics_service.get_crimes_by_category(db=db, user=current_user)


@analytics_router.get("/dashboard/monthly-stats")
def get_monthly_stats(
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_active_user),
):
    """Retrieve monthly crime count trends."""
    return analytics_service.get_monthly_stats(db=db, user=current_user)


@analytics_router.get("/dashboard/officer-workload")
def get_officer_workload(
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_active_user),
):
    """Retrieve active caseload workload distribution across officers."""
    return analytics_service.get_officer_workload(db=db, user=current_user)


# ── GIS Analytics Endpoints ──────────────────────────────────────────────────

@analytics_router.get("/gis/heatmap")
def get_gis_heatmap(
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_active_user),
):
    """Retrieve boundary density heatmap data for map layer."""
    return analytics_service.get_gis_heatmap(db=db, user=current_user)


@analytics_router.get("/gis/clustering")
def get_gis_clustering(
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_active_user),
):
    """Retrieve geo-coordinate cluster points of crime events by police station."""
    return analytics_service.get_gis_clustering(db=db, user=current_user)


# ── Network Analytics Endpoints ──────────────────────────────────────────────

@analytics_router.get("/network/suspects")
def get_network_suspects(
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_active_user),
):
    """Retrieve suspect associate graph nodes and edges for network visualizations."""
    return analytics_service.get_network_suspects(db=db, user=current_user)

@analytics_router.get("/network/graph-data")
def get_graph_data(
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_active_user),
):
    """Retrieve full Neo4j-style graph representation of Crimes, Suspects, Vehicles, and Victims."""
    return analytics_service.get_full_graph_data(db=db, user=current_user)


# ── Search Analytics Endpoints ───────────────────────────────────────────────

@analytics_router.get("/search")
def perform_search(
    q: str = Query(..., min_length=1, description="Keywords to search for"),
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_active_user),
):
    """Search scoped cases, suspects, crimes, and officers globally by keyword."""
    return analytics_service.perform_search(db=db, user=current_user, search_text=q)
