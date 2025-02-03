from openai import OpenAI
import datetime
from app.config import settings
import json


def get_settings():
    return settings

OPENAI_KEY = settings.OPENAI_KEY1

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
						"ingredientStorage": ENUM('FREEZER', 'FRIDGE', 'ROOM_TEMPERATUER')// 식자재 저장 위치(냉동, 냉장, 실온)
				}, ...
		]
}
"""

SYSTEM_MSG2 = f"\n오늘 날짜는 {datetime.date.today()}입니다.\n"

SYSTEM_MSG3 = """
다음은 주의 사항입니다!

구매일의 경우 없으면 오늘로 해주세요.
가게의 경우 없으면 "없음"이라고 해주세요.

카테고리는 id는 상품명을 보고 곡물, 채소, 과일, 유제품, 육류, 달걀류(가금류의 알), 수산물, 기름, 건조식품, 양념, 기타 중 적절한 것을 골라주세요!
카테고리를 고를 때, 대부분의 긴 이름의 식품들은 기타에 포함됩니다. 명확하게 해당 카테고리가 아닐 경우 기타 카테고리로 분류해주세요.

식자재 저장 위치는 대체로 'FRIDGE'입니다. 그러나 실온이나 냉동 보관해도 되는 것이라면 'ROOMTEMP', 'FREEZER'로 해주세요.

유통기한과 소비기한은 모두 식자재 저장 위치를 기반으로 합니다!

유통기한은 상품명을 보고 구매일(없으면 오늘)을 기준으로 일반적인 유통기한을 알려주세요.

소비기한은 일반적으로 유통기한보다 조금 더 깁니다.
소비기한은 상품명을 보고 구매일(없으면 오늘)을 기준으로 일반적인 소비기한을 추천해주세요.

결과는 요구 자료 형태로 출력해야 합니다!!

다음은 주부가 입력한 영수증 데이터 입니다.

# 영수증 데이터
"""


client = OpenAI(
    api_key = OPENAI_KEY
)


async def gpt_service_execution(input_msg):
    response = client.chat.completions.create(
        model = MODEL1,
        messages = [
            {
                'role': 'system',
                'content': SYSTEM_MSG1 + SYSTEM_MSG2 + SYSTEM_MSG3
            },
            {
                'role': 'user',
                'content': input_msg
            }
        ]
    )

    # print('*************************************************')
    # print(response)
    # print(response.choices[0].message.content)
    res = response.choices[0].message.content
    res = res[7:-3].replace('\n','').replace('\t','')
    res_json = json.loads(res)
    return res_json