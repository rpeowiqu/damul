from fastapi import FastAPI, File, UploadFile
from app.services.ocr_service import ocr_service_execution
from app.services.gpt_service import gpt_service_execution

app = FastAPI() # 인스턴스 생성

# 오류 방지용 엔드포인트
# @app.get("/")
# def root():
#     return 'Hello World!' + ' 동기 비동기 문제가 힘듭니다...'

@app.post('/api/v1/ocr')
async def user_ingredients_ocr(image: UploadFile = File(...)):
    try:
        image_bytes = await image.read()

        # ocr
        extracted_text = await ocr_service_execution(image_bytes)
        if not extracted_text[0]:
            return { 'ERROR' : extracted_text[1] }
        extracted_text = " ".join(extracted_text)
        print(extracted_text)

        # gpt
        result_json = await gpt_service_execution(extracted_text)


        # 응답
        # return extracted_text
        return result_json

    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        return {'ERROR': 'INTERNAL_SERVER_ERROR', 'DETAILS': str(error_details)}