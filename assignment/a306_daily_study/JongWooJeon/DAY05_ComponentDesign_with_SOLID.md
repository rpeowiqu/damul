
### SOLID 원칙이란?

---

- SOLID는 다음 `5가지 원칙`의 앞글자만 따온 단어입니다.
    - **SRP:** Single Responsibility Principle
    - **OCP:** Open/Closed Principle
    - **LSP:** Liskov Substitution Principle
    - **ISP:** Interface Segregation Principle
    - **DIP:** Dependency Inversion Principle

### SRP: Single Responsiblity Principle, 단일 책임 원칙

---

- 섣불리 코딩 기법으로 접근하면 `책임=동작` 공식으로 잘못 해석하게 된다. 즉, `단일한 동작만 가진 컴포넌트`로 쪼개야 한다고 `오해`할 수 있습니다.
- 동작으로 쪼개다 보면 그 기준이 애매하기도 하고 과할 정도로 자잘하게 컴포넌트가 쪼개질 수 있다.
- 컴포넌트를 너무 자잘하게 쪼개면 전체 로직을 한눈에 파악하기 어렵게 만들고 코드 네비게이션에 들어가는 공수를 늘어나게 만든다.
- 단일한 동작을 갖도록 코딩하는 것은 `컴포넌트`가 아니라 `순수한 함수 한정`이 되어야 합니다. 이는 SRP라는 원칙으로 도달할 아키텍처 영역이라기보다는 클린 코드의 영역으로 볼 수 있다.

> “SRP의 최종 버전은 다음과 같다. 하나의 모듈은 하나의, 오직 하나의 액터에 대해서만 책임져야 한다.” - 로버트 C. 마틴(클린 아키텍처)
> 
- 중요한 점은 SRP의 `책임`이 의미하는 것을 소프트웨어 내부의 `동작`이나 `논리`가 아니라 `조직 간 커뮤니케이션 영역`으로 봐야 한다는 점이다.
- 즉, SRP 원칙을 지킨다는 것은 컴포넌트를 설계할 때 `요구사항을 전달하는 책무 단위`로 설계한다는 것을 의미한다.
- 각 영역의 `요구사항을 명확히 파악`하고 `영역을 구분해 의존성 없는 독립적인 컴포넌트`로 만들어 각 책무의 `요구사항 변경`에도 `사이드이펙트 없이 유연하게 대처`할 수 있도록 설계하고 구현하는 것이 키포인트라 볼 수 있습니다.
- SOLID는, 특히 SRP는 이러한 지향점에 도달하기 쉽게 해주는 패턴이라 볼 수 있습니다. 또한 프로젝트 아키텍처 설계 시 명확하게 컴포넌트를 나눌 수 있는 공신력 있는 기준이 될 수 있습니다.

### OCP: Open-Closed Principle, 개방 폐쇄 원칙

---

- OCP는 요구사항이 변경될 때 `기존 코드를 변경하는 것이 아니라 새로운 코드를 추가`하는 방향을 추구하는 원칙
- **OCP를 적용하지 않은 코드**
    
    ```jsx
    sections.map((section) => {
      if(section.type === "BANNER"){
        return section.items.map((item) => <Banner item={item} />);
      } else if(type === "RECENTLY_VIEWED"){
        return section.items.map((item) => <PosterView item={item} />);
      }
    }
    ```
    
    - 이 코드는 섹션이 추가되면 else-if를 추가해야 하는 `확장에 닫혀있는(closed) 구조`이다.
- **OCP를 만족하는 코드**
    
    ```jsx
    sections.map((section) =>
      <Section section={section}>
        {section.items.map((item) => 
          <Item section={section} item={item} />
        }
      </Section>
    ```
    
    - `확장에 개방(open)` 될 수 있도록 `다형성`을 이용했습니다. 이제 섹션을 추가/삭제해도 이 코드는 변경이 없습니다.
    - 여기에 `섹션 구조의 OCP를 해결`하기 위한 패턴인 `Compositional Layout` 패턴을 이용해 개선할 수 있다.
        
        ![Image](https://github.com/user-attachments/assets/2e4bd97a-6051-45bb-897b-9b8eef9a8a54)
        

### LSP: Liskov Substitution Principle, 리스코프 치환 원칙

---

- 리스코프 치환 법칙을 설명할 땐 일반적으로 클래스의 상속을 통해 설명하고 증명하지만 아키텍처 관점에서는 좀 더 넓은 의미로 적용할 수 있습니다.
- 상속 관계를 얘기할 땐 간단하게 **`is-a`** 를 만족하는지 여부로 상속 관계인지 판별할 수 있습니다. **`사과는 과일이다`** 처럼 명확한 관계를 갖는 것이 상속 관계입니다.
- 리스코프 치환 법칙의 증명은 복잡하지만 얘기하고자 하는 것은 명확합니다. `상속(is-a)으로 이어진 관계에서 예상 못할 행동을 하지 말라.`
- **문제 예시**
    - GET method의 REST API로 정의했는데 실제 동작에선 DB 상태를 변경
    - API 응답으로 주기로 약속한 모델을 화면마다 다르게 내려줌(화면별로 필드 존재 유무가 달라지거나, nullable 여부가 달라지는)
    - Label이라 해놓고 체크 박스 기능 요구
    - 필드명이 같은 것을 기준으로 타입스크립트 인터페이스 정의를 무지성으로 상속 관계로 만듦
- 실제로 SOLID 원칙 중 `장애상황`, `버그`와 가장 밀접하게 관련된 부분이 LSP 원칙입니다. 인터페이스나 상위 정의된 부분과 실제 구현된 부분이 예상과 다르다면 잘못 사용하게 될 가능성이 매우 높아진다.

### ISP: Interface Segregation Principle, 인터페이스 분리 원칙 & DIP: Dependency Inversion Principle, 의존성 역전 원칙

---

- 컴포넌트를 설계할 때 `단일한 책무`에 맞게 쪼개져 있다면 불필요한 속성(props) 없는 독립된 컴포넌트로 구성될 수 있습니다. 하지만 컴포넌트만 있으면 페이지를 완성할 수 없습니다. 페이지를 만들려면 컴포넌트들을 조합(composition)해야 합니다.
- `인터페이스 분리 원칙(ISP)`과 `의존성 역전 법칙(DIP)`은 `컴포넌트를 조합`할 때 큰 `도움`을 주는 원칙이다.
- **컴포넌트에서 API 로딩, 에러 부분만 떼어낸 후, `children` 을 이용해 의존성을 역전시킨 코드**
    
    ```jsx
    function Fetcher({query, children}){
      const { isLoading, error, data } = query();
      if(isLoading) {
        return <Loading />
      }
      if(error){
        return <Error />
      }
      return children;
    }
    
    // ================================================================================
    function TicketInfoContainer() {
      const [{waitfreePeriod, waitfreeChargedDate, rentalTicketCount, ownTicketCount}, TicketInfoFetcher] = useFetcher(useTicketInfoQuery);
      const [{keywordInfo}, KeywordInfoFetcher] = useFetcher(useKeywordInfoQuery);
      const [{commentCount}, CommentInfoFetcher] = useFetcher(useCommentInfoQuery);
    
      return (
        <TicketInfoFetcher>
          <TicketInfo>
            <TicketInfo.WaitfreeArea waitfreePeriod={waitfreePeriod} waitfreeChargedDate={waitfreeChargedDate} />
            <TicketInfo.TicketArea rentalTicketCount={rentalTicketCount} ownTicketCount={ownTicketCount} />
            <KeywordInfoFetcher />
            <CommentInfoFetcher>
              <TicketInfo.CommentArea commentCount={commentCount} keywordInfo={keywordInfo} />
            </CommentInfoFetcher>
          </TicketInfo>
        </TicketInfoFetcher>
      )
    }
    ```
    
    - 간단한 실천으로 `내부 구현으로부터 독립된 컴포넌트`를 얻을 수 있습니다. `의존성이 역전되면 원하는 관심사만 테스트하기 쉬워집니다.`
    - **`children`** 은 리액트의 꽃이나 다름 없습니다. 의존성을 느슨하게 관리함으로써 조립(Composition)이 가능하도록 만들어 준다.

- **결론**
    - 커뮤니케이션 구조를 기반으로 컴포넌트의 네이밍부터 시작해 각각에 맞는 책임, 책무를 정의하고(**SRP**) 변경하는 요구사항을 최소한의 코드 (추가를 통한) 변경을 통해 유연하게 대응하고(**OCP**), **`is-a`**를 의도했다면 그 의도에 맞게 구현되도록 힘쓰고(**LSP**), 컴포넌트에 꼭 필요한 인터페이스만 의존할 수 있도록 구성하고(**ISP**), 필요하다면 의존성을 역전시켜 독립된 컴포넌트로 만들 수 있도록(**DIP**) 끊임없이 생각하고 개선해가는 경험과 태도가 중요하다

### 참고 자료

---

- https://fe-developers.kakaoent.com/2023/230330-frontend-solid/
