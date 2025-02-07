# 환경 설정
from pydantic_settings import BaseSettings, SettingsConfigDict
import os

class Settings(BaseSettings):
    OPENAI_KEY2: str

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()