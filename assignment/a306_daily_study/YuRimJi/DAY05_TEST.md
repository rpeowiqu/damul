# 스프링에서의 테스트

## 개요

스프링에서의 테스트는 다음과 같이 나눌 수 있음:

1. 단위 테스트
2. 통합 테스트
3. 성능 테스트
4. 운영 이슈 테스트

이 문서에서는 단위 테스트와 통합 테스트에 대해 다룸

## F.I.R.S.T 원칙

- **Fast**: 테스트는 빠르게 실행되어야 함
- **Independent**: 각 테스트는 독립적이어야 함
- **Repeatable**: 어떤 환경에서도 반복 가능해야 함
- **Self-validating**: 테스트는 자체적으로 검증이 가능해야 함 (성공/실패가 명확)
- **Timely**: 테스트는 실제 코드와 시간적으로 가깝게 작성되어야 함

## 스프링에서의 테스트란?

### 테스트 코드 작성 이유

테스트는 핵심 로직이 "예상대로" 흘러가는가를 파악하는 과정임. 서버의 핵심 로직은 Service 계층에 있으며, 단위 테스트는 이 Service 계층의 각 메서드들을 독립적으로 테스트하는 것임

중요한 점:
- 테스트를 하기 어려운 코드는 메서드 설계에 문제가 있다는 신호
- 테스트 실패는 메서드 로직에 문제가 있다는 의미
- 서비스 계층의 각 메서드들에서 호출되는 DB 작업의 호출 여부만 검증하면 됨

### Controller와 Mapper 계층

1. **Controller 계층**
   - 단순히 요청을 받고 전달하고, 응답을 전달하는 작업만 처리
   - 실제 비즈니스 로직은 Service 계층에서 처리

2. **Mapper 계층**
   - 주로 단순 CRUD 작업 수행
   - Service 계층에서 Mapper 호출 결과를 검증하면 충분

### 통합 테스트

통합 테스트는 전체 기능의 플로우를 테스트함. 즉, API 테스트라고 볼 수 있음. Controller 계층의 메서드들의 값을 검증하면 Controller → Service → Mapper의 전체 흐름이 검증됨

## 테스트 작성 방법

### Given/When/Then 패턴

1. **Given**: 준비
   - 테스트에 필요한 데이터 준비
   - Mocking과 Stubbing 처리

2. **When**: 실행
   - 실제 테스트할 메서드 호출

3. **Then**: 검증
   - 결과 검증
   - Mocking된 객체 호출 검증
   - assert 구문과 verify 구문 사용

### 테스트 코드 작성 팁

1. **assertAll 사용**
```java
assertAll(
    () -> assertEquals("제목", result.getTitle()),
    () -> assertEquals("내용", result.getContent()),
    () -> verify(postMapper).save(any()),
    () -> verify(fileService).upload(any()),
    () -> verify(notificationService).notify(any())
);
```

2. **@DisplayName 사용**
```java
@Test
@DisplayName("정상 케이스 - 회원가입 성공")
void signUp_Success() { }
```

3. **@Nested 활용**
```java
@Nested
@DisplayName("회원 가입 테스트")
class SignUp {
    @Test
    @DisplayName("정상 케이스 - 회원가입 성공")
    void signUp_Success() { }
    
    @Test
    @DisplayName("실패 케이스 - 중복된 이메일")
    void signUp_DuplicateEmail() { }
}
```

## 단위 테스트

### Mocking/Stubbing 패턴

단위 테스트의 핵심임. Mockito 프레임워크를 사용하여 구현함

```java
@ExtendWith(MockitoExtension.class)
class TransferServiceTest {
    @Mock
    private AccountRepository accountRepository;
    
    @InjectMocks
    private TransferService transferService;
    
    @Test
    @DisplayName("이체 성공")
    void executeTransfer_Success() {
        // given
        when(accountRepository.findById(any())).thenReturn(Optional.of(account));
        
        // when
        boolean result = transferService.transfer(dto);
        
        // then
        assertAll(
            () -> assertTrue(result),
            () -> verify(accountRepository).findById(any())
        );
    }
}
```

## 통합 테스트

### MockMvc vs TestRestTemplate

1. **MockMvc**
   - 서블릿 컨테이너를 실행하지 않고 테스트
   - MVC 동작만 시뮬레이션
   - 컨트롤러 로직, API 스펙 테스트에 적합

2. **TestRestTemplate**
   - 실제 서블릿 컨테이너 구동
   - 실제 HTTP 통신 수행
   - DB 연동, 외부 API, 전체 플로우 테스트에 적합

### Testcontainers

테스트 환경의 DB를 도커 컨테이너로 실행하여 테스트를 진행할 수 있는 라이브러리임

```java
@Testcontainers
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
class AlgorithmGuideIntegrationTest {
    @Container
    static MySQLContainer<?> mysql = 
        new MySQLContainer<>("mysql:8.0")
            .withInitScript("schema.sql")
            .withReuse(true);
    
    @Autowired
    private TestRestTemplate restTemplate;
}
```

특징:
- 모든 설정이 테스트 코드 안에서 관리됨
- 동일한 테스트 환경 보장
- CI/CD 환경과의 호환성
