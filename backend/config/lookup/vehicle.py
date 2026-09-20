"""
Vigilens
Vehicle Master Data

Defines vehicle-related lookup data used throughout
the synthetic crime intelligence engine.
"""

# ==========================================================
# VEHICLE TYPES
# ==========================================================

VEHICLE_TYPES = [

    {
        "vehicle_type_id": "VT001",
        "name": "Motorcycle",
        "wheels": 2,
        "commercial": False
    },

    {
        "vehicle_type_id": "VT002",
        "name": "Scooter",
        "wheels": 2,
        "commercial": False
    },

    {
        "vehicle_type_id": "VT003",
        "name": "Car",
        "wheels": 4,
        "commercial": False
    },

    {
        "vehicle_type_id": "VT004",
        "name": "SUV",
        "wheels": 4,
        "commercial": False
    },

    {
        "vehicle_type_id": "VT005",
        "name": "Auto Rickshaw",
        "wheels": 3,
        "commercial": True
    },

    {
        "vehicle_type_id": "VT006",
        "name": "Bus",
        "wheels": 6,
        "commercial": True
    },

    {
        "vehicle_type_id": "VT007",
        "name": "Truck",
        "wheels": 8,
        "commercial": True
    },

    {
        "vehicle_type_id": "VT008",
        "name": "Van",
        "wheels": 4,
        "commercial": True
    }
]

# ==========================================================
# VEHICLE BRANDS
# ==========================================================

VEHICLE_BRANDS = [

    {"brand_id": "VB001", "name": "Maruti Suzuki"},
    {"brand_id": "VB002", "name": "Hyundai"},
    {"brand_id": "VB003", "name": "Tata"},
    {"brand_id": "VB004", "name": "Mahindra"},
    {"brand_id": "VB005", "name": "Honda"},
    {"brand_id": "VB006", "name": "Toyota"},
    {"brand_id": "VB007", "name": "Kia"},
    {"brand_id": "VB008", "name": "Renault"},
    {"brand_id": "VB009", "name": "Hero"},
    {"brand_id": "VB010", "name": "Bajaj"},
    {"brand_id": "VB011", "name": "TVS"},
    {"brand_id": "VB012", "name": "Royal Enfield"},
    {"brand_id": "VB013", "name": "Yamaha"},
    {"brand_id": "VB014", "name": "Ashok Leyland"},
    {"brand_id": "VB015", "name": "Eicher"}
]

# ==========================================================
# VEHICLE COLORS
# ==========================================================

VEHICLE_COLORS = [

    {"color_id": "VC001", "name": "White"},
    {"color_id": "VC002", "name": "Black"},
    {"color_id": "VC003", "name": "Silver"},
    {"color_id": "VC004", "name": "Grey"},
    {"color_id": "VC005", "name": "Blue"},
    {"color_id": "VC006", "name": "Red"},
    {"color_id": "VC007", "name": "Green"},
    {"color_id": "VC008", "name": "Yellow"},
    {"color_id": "VC009", "name": "Orange"},
    {"color_id": "VC010", "name": "Brown"}
]

# ==========================================================
# FUEL TYPES
# ==========================================================

FUEL_TYPES = [

    {"fuel_id": "F001", "name": "Petrol"},
    {"fuel_id": "F002", "name": "Diesel"},
    {"fuel_id": "F003", "name": "CNG"},
    {"fuel_id": "F004", "name": "Electric"},
    {"fuel_id": "F005", "name": "Hybrid"}
]

# ==========================================================
# REGISTRATION STATES
# ==========================================================

REGISTRATION_STATES = [

    {"state_code": "KA", "state_name": "Karnataka"},
    {"state_code": "MH", "state_name": "Maharashtra"},
    {"state_code": "TN", "state_name": "Tamil Nadu"},
    {"state_code": "AP", "state_name": "Andhra Pradesh"},
    {"state_code": "TS", "state_name": "Telangana"},
    {"state_code": "KL", "state_name": "Kerala"},
    {"state_code": "GA", "state_name": "Goa"}
]