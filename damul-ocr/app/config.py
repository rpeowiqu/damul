# 환경 설정
import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_KEY1 = os.getenv('OPENAI_KEY1')
OPENAI_KEY2 = os.getenv('OPENAI_KEY2')