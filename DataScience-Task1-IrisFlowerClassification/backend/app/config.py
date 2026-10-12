from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    model_dir: str = "models"
    cors_origins: str = "http://localhost:5173"

    @property
    def origins(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


settings = Settings()
