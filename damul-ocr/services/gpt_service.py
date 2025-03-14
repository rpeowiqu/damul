from openai import OpenAI
import datetime
from config import settings
import json

import re

def get_settings():
    return settings

OPENAI_KEY = settings.OPENAI_KEY2

MODEL1 = "gpt-4o-mini"
MODEL2 ="gpt-4o"

SYSTEM_MSG1 = """
요구 자료 형태 :
{
		"purchaseAt": "string", // 구매일
		"storeName": "string", // 매장
		"userIngredients": [
				{
						"ingredientName": "string", // 상품명
						"category": "string", // 카테고리
						"productPrice": number, // 가격
						"dueDate": "string", // 유통기한
						"expiration_date": "string", // 소비기한 
						"ingredientStorage": ENUM('FREEZER', 'FRIDGE', 'ROOMTEMP')// 식자재 저장 위치(냉동, 냉장, 실온)
				}, ...
		]
}
"""

# SYSTEM_MSG2 = f"\n오늘 날짜는 {datetime.date.today()}입니다.\n"

SYSTEM_MSG3 = f"""
다음은 주의 사항입니다!

먹을 수 없을 것 같은 품목은 제외해주세요!

구매일의 경우 없으면 오늘({datetime.date.today()})로 해주세요.
가게의 경우 없으면 "없음"이라고 해주세요.

카테고리는 id는 상품명을 보고 곡물, 채소, 과일, 유제품, 육류, 달걀류(가금류의 알), 수산물, 기름, 건조식품, 양념, 기타 중 적절한 것을 골라주세요!
카테고리를 고를 때, 대부분의 긴 이름의 식품들은 기타에 포함됩니다. 명확하게 해당 카테고리가 아닐 경우 기타 카테고리로 분류해주세요.

가격은 물건의 총액입니다.

식자재 저장 위치는 대체로 'FRIDGE'입니다. 그러나 실온이나 냉동 보관해도 되는 것이라면 'ROOMTEMP', 'FREEZER'로 해주세요.

소비기한과 유통기한은 동일합니다.
소비기한은 구매일로부터 [곡물:180일, 채소:3일, 과일:7일, 유제품:7일, 육류:3일, 달걀류:30일, 수산물:2일, 기름:180일, 건조식품:180일, 양념:730일, 기타:365일] 후로 해주세요.

결과는 요구 자료 형태로 출력해야 합니다!!

다음은 주부가 입력한 영수증 데이터 입니다.

# 영수증 데이터
"""


client = OpenAI(
    api_key = OPENAI_KEY
)

def clean_json_string(json_string):
    """JSON 문자열에서 ```json과 ``` 제거"""
    while json_string[0] != '{':
        json_string = json_string[1:]
    while json_string[-1] != '}':
        json_string = json_string[:-1]
    return json_string

async def gpt_service_execution(input_msg):
    response = client.chat.completions.create(
        model = MODEL1,
        messages = [
            {
                'role': 'system',
                'content': SYSTEM_MSG1 + SYSTEM_MSG3
            },
            {
                'role': 'user',
                'content': input_msg
            }
        ],
        temperature=0.0
    )

    # print('*************************************************')
    print(response)
    print(response.choices[0].message.content)
    res = response.choices[0].message.content
    res = clean_json_string(res)
    print(res)
    res_json = json.loads(res)
    return res_json