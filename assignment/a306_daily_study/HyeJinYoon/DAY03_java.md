### 목차

> [1. 자바 기본](#1-자바-기본)
> 
> [2. 배열, 다차원 배열]

# 0. 개요

자바를 마지막으로 안드로이드 스튜디오에서 사용한지 1년이 지났다.

스프링은 2년 지났다.

기억을 되살리기 위해 당분간 자바와 스프링을 공부하려 한다.

# 1. 자바 기본

- 변수 (Variable) : 
  
  - 자료를 저장하기 위한 메모리 공간(그릇)으로 **타입에 따라 크기가 달라짐**
  
  - 메모리 공간에 값(value)을 할당(assgin) 후 사용

- 형 (Type) :
  
  - 데이터의 형태
  
  - 데이터 타입에 따라 크게 2가지로 분류
  
  - 기본형 (primitive type) :
    
    - 미리 정해진 크기의 데이터 표현
    
    - 변수 자체에 값 저장
  
  - 참조형 (reference type) :
    
    - 크기가 미리 정해질 수 없는 데이터의 표현
    
    - 변수에는 실제 값을 참조할 수 있는 주소만 저장

### var 키워드

- Java는 strongly typed languate => 변수 선언 시 타입을 명시

- JavaScript는 weakly typed language => 변수에 값 할당 시 타입 결정 (가변적)

- 로컬 변수 선언 시 `var` 키워드 적용 => 변수에 값 할당 시 타입 결정
  
  - 변수 선언 시 값 할당까지 진행되어야 함
  
  - But! JavaScript 처럼 타입이 바뀌지는 않는다.

```java
public static void main(String[] args) {
    int i = 10;
    var a = 1;
    var str = "Hello";
    var list2 = new ArrayList<>();
    var list3 = new ArrayList<String>();
}
```

### 기본형 (Primitive Type)의 크기

| 구분  | Type    | bit 수 | 값                                                        |
|:---:|:-------:|:-----:|:--------------------------------------------------------:|
| 논리형 | boolean |       | true / false                                             |
| 정수형 | byte    | 8     | -2^7 ~ 2^7-1 (-128~ 127)                                 |
| 정수형 | short   | 16    | -2^15 ~ 2^15-1                                           |
| 정수형 | int     | 32    | -2^31 ~ 2^31-1                                           |
| 정수형 | long    | 64    | -2^63 ~ 2^63-1                                           |
| 실수형 | float   | 32    | float f = 0.1234567890123F; -> 0.12345679                |
| 실수형 | double  | 64    | double d = 0.1234567890123456789; -> 0.12345678901234568 |
| 문자형 | char    | 16    | \u0000 ~ \uffff (0 ~ 2^16-1)                             |

### String

- 기본형이 아닌 객체형

- `String str1 = "Hello";` : 같은 문자열 풀

- `String str2 = new String("Hello");` : 서로 다른 문자열 객체 생성

- Text Block : multi line 적용 가능 => `String str = """가나다 %d""".formatted(123);`
  
  - > 가나다123

### overflow

- 정수 계산 시 주의

- `Integer.MAX_VALUE + 1` => -2147483648 (-2^31)

- 필요한 수의 크기를 고려해서 `int` 또는 `log` 등 타입 선택

### 형 변환

- Type casting

- 변수의 형을 다른 형으로 변환 (char -> int)

- primitive는 primitive끼리, reference는 referecne끼리 형 변환 가능
  
  - boolean은 다른 기본 형과 호환되지 않음
  
  - 기본 형과 참조형의 형 변환을 위해서 Wrapper 클래스 사용

- 형 변환 방법
  
  - 형 변환 연산자(괄호)사용
  
  - 명시적 형 변환 : `int i = 300; byte b = (byte)i;`
    
    - 값의 크기, 타입의 크기가 아닌 **타입의 표현 범위**가 작아짐
    
    - 값 손실이 발생할 수 있음
  
  - 묵시적 형 변환 : `byte b = 10; int i = (int)b; int i2 = b;`
    
    - **타입의 표현 범위**가 커짐
    
    - 자료의 손실 걱정이 없음

- `wrapper class` 활용
  
  - byte -> Byte
  
  - short -> Short
  
  - int -> Integer
  
  - log -> Long
  
  - float -> Float
  
  - double -> Double
  
  - char -> Character
  
  - boolean -> Boolean

- 기본형과 달리 추가적인 속성과 기능 사용 가능
  
  - `Integer.MAX_VALUE`
  
  - `Integer.MIN_VALUE`
  
  - `Integer.compare(int a, int b)`

- 형변환 관련 메서드
  
  - `Integer.parseInt(String str)` : 문자열 -> int 값 반환
  
  - `Integer.valueOf(Integer i)` : 문자열 -> 객체형 Integer 반환
  
  - `Integer.intValue()` : 정수 객체 -> int 값 반환


