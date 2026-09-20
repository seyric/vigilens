from app.core.constants import AVAILABLE_MODELS


class ModelManager:
    def __init__(self):
        self.models = AVAILABLE_MODELS

    def get_models(self):
        return self.models


model_manager = ModelManager()