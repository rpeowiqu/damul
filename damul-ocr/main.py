from fastapi import FastAPI, File, UploadFile
from services.ocr_service import ocr_service_execution
from services.gpt_service import gpt_service_execution
from services.kogpt2_service import kogpt_service_execution
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI() # 인스턴스 생성
print('ocr 서버 실행중...')

app.add_middleware(
    CORSMiddleware,
    allow_origins=["i12a306.p.ssafy.io:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 오류 방지용 엔드포인트
# @app.get("/")
# def root():
#     return 'Hello World!'

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


@app.post('/api/v1/ocrai')
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
        result_json = await kogpt_service_execution(extracted_text)


        # 응답
        # return extracted_text
        return result_json

    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        return {'ERROR': 'INTERNAL_SERVER_ERROR', 'DETAILS': str(error_details)}

