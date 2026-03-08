from pathlib import Path
import os

# =========================
# DATABASE CONFIG
# =========================

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg2://causal_user:Pulni@localhost:5432/recoverly_platform"
)

# =========================
# AUTH SETTINGS (NEW)
# =========================
SECRET_KEY = os.getenv("SECRET_KEY", "change_me_now_to_a_long_random_secret")
ACCESS_TOKEN_MINUTES = int(os.getenv("ACCESS_TOKEN_MINUTES", "60"))

# =========================
# ML ARTIFACT PATHS
# =========================

APP_ROOT = Path(__file__).resolve().parents[1]
ARTIFACTS_DIR = APP_ROOT / "ml" / "artifacts"

TFIDF_PATH = ARTIFACTS_DIR / "tfidf.pkl"
CLF_PATH = ARTIFACTS_DIR / "classifier.pkl"

# =========================
# WHISPER STT SETTINGS
# =========================

DATA_DIR = APP_ROOT / "data"
UPLOAD_DIR = DATA_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

WHISPER_MODEL_NAME = "small"
MAX_UPLOAD_MB = 25

# =========================
# API SETTINGS
# =========================

API_HOST = "0.0.0.0"
API_PORT = 8000
API_RELOAD = True

# =========================
# CORS SETTINGS
# =========================

CORS_ALLOW_ORIGINS = ["*"]