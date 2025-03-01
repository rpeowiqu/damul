# OCR API 호출
from paddleocr import PaddleOCR
import cv2
import numpy as np

from PIL import Image, ImageOps
import io

import re   # 정규식


# 속도 향상을 위한 정규식 컴파일
HANGUL_REGEX = re.compile('[ㄱ-ㅎ가-힣]+')
DIGIT_REGEX = re.compile(r'\d')
LAST_NINE_REGEX = re.compile(r'(9)(?!.*\d)')

# 이미지 최대 크기
MAX_IMAGE_SIZE_WIDTH = 960
MAX_IMAGE_SIZE_HEIGHT = 960

Image.MAX_IMAGE_PIXELS = None  # 이미지 크기 제한 해제

# PaddleOCR 초기화
ocr = PaddleOCR(
    lang='korean',  # 'korean' 언어 설정
    use_mp=True,   # 멀티 프로세싱 활성화 (CPU 최적화)
    enable_mkldnn=True,  # Intel CPU 최적화 라이브러리
    use_gpu=False,    # GPU 사용
    gpu_id=0,   # 사용하려는 GPU ID
    cpu_threads=10, # cpu에서 최대 사용 스레드 수
    max_batch_size=10,   # 한 번에 처리할 수 있는 최대 배치 크기
    rec_batch_num=6,    # 한 번에 처리할 배치 크기(6개의 텍스트 인식 요청을 동시에 처리 가능)
    layout=False,   # 문서 레이아웃 분석
    table=False,    # 표 인식
    use_tensorrt=False  # tensorRT 최적화 (gpu 속도 향상)
)

# 9 -> g
def data_cleansing_9_to_g(ocr_res):
    if HANGUL_REGEX.search(ocr_res) and DIGIT_REGEX.search(ocr_res):
        match = LAST_NINE_REGEX.search(ocr_res)
        if match:
            return ocr_res[:match.start()] + 'g' + ocr_res[match.end():]
    return ocr_res


# image resize
def resize_image(image):
    print("원본 이미지 크기", image.size)

    # 이미지 회전
    image = ImageOps.exif_transpose(image)
    print("회전 이미지 크기", image.size)

    width, height = image.size

    if width > height and width > MAX_IMAGE_SIZE_WIDTH:
        image = image.resize((MAX_IMAGE_SIZE_WIDTH, int(height/(width/MAX_IMAGE_SIZE_WIDTH))))
    elif height >= width and height > MAX_IMAGE_SIZE_HEIGHT:
        image = image.resize((int(width/(height/MAX_IMAGE_SIZE_HEIGHT)), MAX_IMAGE_SIZE_HEIGHT))

    print("변경된 이미지 크기", image.size)

    return image


async def ocr_service_execution(image_bytes: bytes):
    # 이미지 로드
    image = Image.open(io.BytesIO(image_bytes))
    if image is None:   # 이미지 없을 때 error 반환
        return [0, 'image load fail']
    if len(image_bytes) > 10 * 1024 * 1024: # 이미지 크기 10MB로 제한
        return [0, 'error: image size exceeds 10MB']
    # 이미지 크기 변경
    image = resize_image(image)

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