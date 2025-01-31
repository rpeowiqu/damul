# OCR API 호출
from paddleocr import PaddleOCR
import cv2
import numpy as np

from PIL import Image
import io

import re   # 정규식

import json



# 속도 향상을 위한 정규식 컴파일
HANGUL_REGEX = re.compile('[ㄱ-ㅎ가-힣]+')
DIGIT_REGEX = re.compile(r'\d')
LAST_NINE_REGEX = re.compile(r'(9)(?!.*\d)')

# PaddleOCR 초기화
ocr = PaddleOCR(lang='korean', use_mp=False)  # 'korean' 언어 설정


# 9 -> g
def data_cleansing_9_to_g(ocr_res):
    if HANGUL_REGEX.search(ocr_res) and DIGIT_REGEX.search(ocr_res):
        match = LAST_NINE_REGEX.search(ocr_res)
        if match:
            return ocr_res[:match.start()] + 'g' + ocr_res[match.end():]
    return ocr_res


async def ocr_service_execution(image_bytes: bytes):
    # 이미지 로드
    image = Image.open(io.BytesIO(image_bytes))
    if image is None:   # 이미지 없을 때 error 반환
        return [0, 'image load fail']

    # 이미지 변환
    image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)

    # OCR 수행
    ocr_results = ocr.ocr(image, cls=True)

    # 텍스트 추출
    ocr_results_texts = []
    for line in ocr_results[0]:
        text, confidence = line[1]
        text = data_cleansing_9_to_g(text)  # 9 -> g
        ocr_results_texts.append(text)

    # 결과 출력
    # print("추출된 한글 텍스트:")
    # for text in ocr_results_texts:
    #     print(text)

    # print("***************results***************")
    # print(ocr_results)

    # 결과 반환
    return ocr_results_texts
    # return json.dumps({'data': ocr_results_texts})