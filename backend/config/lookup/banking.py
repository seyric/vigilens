"""
Vigilens
Banking Master Lookup

Contains lookup tables used by the
BankAccountGenerator.
"""

# ==========================================================
# BANKS
# ==========================================================

BANKS = [

    {
        "bank_id": "BNK001",
        "name": "State Bank of India",
        "short_name": "SBI",
        "ifsc_prefix": "SBIN"
    },

    {
        "bank_id": "BNK002",
        "name": "HDFC Bank",
        "short_name": "HDFC",
        "ifsc_prefix": "HDFC"
    },

    {
        "bank_id": "BNK003",
        "name": "ICICI Bank",
        "short_name": "ICICI",
        "ifsc_prefix": "ICIC"
    },

    {
        "bank_id": "BNK004",
        "name": "Axis Bank",
        "short_name": "AXIS",
        "ifsc_prefix": "UTIB"
    },

    {
        "bank_id": "BNK005",
        "name": "Canara Bank",
        "short_name": "Canara",
        "ifsc_prefix": "CNRB"
    },

    {
        "bank_id": "BNK006",
        "name": "Punjab National Bank",
        "short_name": "PNB",
        "ifsc_prefix": "PUNB"
    },

    {
        "bank_id": "BNK007",
        "name": "Bank of Baroda",
        "short_name": "BOB",
        "ifsc_prefix": "BARB"
    },

    {
        "bank_id": "BNK008",
        "name": "Union Bank of India",
        "short_name": "Union",
        "ifsc_prefix": "UBIN"
    },

    {
        "bank_id": "BNK009",
        "name": "Kotak Mahindra Bank",
        "short_name": "Kotak",
        "ifsc_prefix": "KKBK"
    },

    {
        "bank_id": "BNK010",
        "name": "IndusInd Bank",
        "short_name": "IndusInd",
        "ifsc_prefix": "INDB"
    }

]

# ==========================================================
# ACCOUNT TYPES
# ==========================================================

ACCOUNT_TYPES = [

    {
        "account_type_id": "AT001",
        "name": "Savings"
    },

    {
        "account_type_id": "AT002",
        "name": "Current"
    },

    {
        "account_type_id": "AT003",
        "name": "Salary"
    },

    {
        "account_type_id": "AT004",
        "name": "Fixed Deposit"
    }

]

# ==========================================================
# ACCOUNT STATUS
# ==========================================================

ACCOUNT_STATUS = [

    {
        "status_id": "AS001",
        "name": "Active"
    },

    {
        "status_id": "AS002",
        "name": "Dormant"
    },

    {
        "status_id": "AS003",
        "name": "Frozen"
    },

    {
        "status_id": "AS004",
        "name": "Closed"
    }

]