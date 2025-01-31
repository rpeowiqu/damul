from fastapi import FastAPI, File, UploadFile
from services.ocr_service import ocr_service_execution

app = FastAPI() # 인스턴스 생성

# 오류 방지용 엔드포인트
@app.get("/")
def root():
    return 'Hello World!' + ' 동기 비동기 문제가 힘듭니다...'

@app.post('/api/v1/home/ingredients/receipt')
async def user_ingredients_ocr(image: UploadFile = File(...)):
    try:
        image_bytes = await image.read()

        # ocr
        extracted_text = await ocr_service_execution(image_bytes)
        if not extracted_text[0]:
            return { 'ERROR' : extracted_text[1] }

        # gpt

        # 응답
        return 'ok~'

    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        return {'ERROR': 'INTERNAL_SERVER_ERROR', 'DETAILS': str(error_details)}