# OCR

네이버의 클로바 ocr은 최후로 남겨놓고 무료 ocr을 학습시켜 사용해보려고 한다.

무료 ocr은 `Tesseract`, `EasyOCR`, `PaddleOCR` 이렇게 셋이 유명하다.

이중 `EasyOCR`은 다른 두 OCR에 비해 한글 인식이 현저하게 미비해서 제외하였다.

`Tesseract`는 Google에서 만들었으며 유명하고 코드가 많으며 자바 환경에서 라이브러리를 추가해서 쉽게 사용할 수 있다.



`PaddleOCR`은 중국에서 만든 OCR로 `Tesseract`에 비해 한글 인식이 뛰어나고 속도가 빠르다. 하지만 파이썬 기반 라이브러리라, 파이썬으로만 사용 가능하다.

`PaddleOCR`을 Spring Boot 환경에서 실행하기 위해서는

1. Flask 또는 FastAPI 등 python으로 구현된 서버에서 PaddleOCR을 실행하고 HTTP 요청으로 통신한다.

2. Jython, JNI(Java Native Interface) 등으로 Java에서 Python을 실행한다. 하지만,
   
   - Jython은 Python 2.x버전을 기반으로 해 Python 3.x와 호환되지 않는다.
   
   - JNI는 네이티브 코드를 호출하는 강력한 표준 인터페이스이나 직접 사용은 복잡하다.
   
   - ProcessBuilder는 외부 Python 프로세스를 실행하며 상호작용은 제한적이다.
   
   - Py4J는 네트워크 소켓을 사용하여 Python과 Java를 연결한다. 설정이 간단하다.
   
   - JPype는 JNI를 내부적으로 사용하여 Python에서 Java 객체 호출 가능하며 빠르고 강력하다.
   
   - GraalVM는 JVM 상에서 여러 언어(Python 포함)를 직접 실행하며 Polyglot API 사용한다.



감기걸려서 약먹으니 머리가 안 돌아간다.

자고 내일 조금 더 알아봐야겠다...


