# OCR API 호출
from paddleocr import PaddleOCR
import cv2

import re   # 정규식

# 속도 향상을 위한 정규식 컴파일
HANGUL_REGEX = re.compile('[ㄱ-ㅎ가-힣]+')
DIGIT_REGEX = re.compile(r'\d')
LAST_NINE_REGEX = re.compile(r'(9)(?!.*\d)')

# 9 -> g
def data_cleansing_9_to_g(ocr_res):
    if HANGUL_REGEX.search(ocr_res) and DIGIT_REGEX.search(ocr_res):
        match = LAST_NINE_REGEX.search(ocr_res)
        if match:
            return ocr_res[:match.start()] + 'g' + ocr_res[match.end():]
    return ocr_res

# PaddleOCR 초기화
ocr = PaddleOCR(lang='korean')  # 'korean' 언어 설정

# 이미지 경로 설정
image_path = ''  # 영수증 이미지 경로

# 이미지 로드
image = cv2.imread(image_path)
if image is None:
    print("ERROR: image load fail")
    exit()

# OCR 수행
results = ocr.ocr(image_path, cls=True)

# 한글 텍스트 추출
korean_texts = []
for line in results[0]:
    text, confidence = line[1]
    text = data_cleansing_9_to_g(text)  # 9 -> g
    korean_texts.append(text)

# 결과 출력
print("추출된 한글 텍스트:")
for text in korean_texts:
    print(text)

# print("***************results***************")
# print(results)