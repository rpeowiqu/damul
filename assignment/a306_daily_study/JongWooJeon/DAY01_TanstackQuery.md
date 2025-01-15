### 서버 상태 관리 라이브러리

---

- `서버 상태 관리 라이브러리`는 클라이언트 애플리케이션이 `서버에서 데이터를 효율적으로 가져오고 이를 관리하는 데 도움`을 주는 도구이다.

- **서버 상태 관리란?**
    
    ![image](https://github.com/user-attachments/assets/61f3af1c-8823-4859-9311-25d091340205)
    
    - `서버 상태`는 클라이언트 애플리케이션에서 서버와의 상호작용을 통해 얻은 데이터를 의미한다.
    - 즉, API 통신을 통해 응답 받은 데이터를 의미한다.
    - 예를 들면, 사용자 정보, 게시글, 댓글 등이 있다.
    - React는 클라이언트 측 상태를 관리하는 데는 뛰어나지만, `서버 상태를 효율적으로 관리하는 기능은 기본적으로 제공하지 않는다.`

- **서버 상태 관리 요구사항**
    - **비동기 데이터**
        - 서버에서 데이터를 가져오는 작업은 `네트워크 요청`과 `응답 시간이 포함`되므로 `비동기적`으로 처리해야 한다.
    - **캐싱**
        - `동일한 데이터`를 여러 번 요청하지 않도록 `캐싱`이 필요하다.
    - **자동 갱신**
        - `데이터가 변경`될 경우 이를 `감지`하고 `UI`가 `갱신`돼야 한다.
    - **에러 관리**
        - `네트워크 실패`나 `서버 에러`를 처리하는 `로직`이 필요하다.
    - **동기화 문제**
        - 서버 상태는 클라이언트 상태와 다를 수 있으므로 이를 `동기화`해야 한다.

- **주요 서버 상태 관리 라이브러리**
    - Tanstack Query(이전 React Query)
    - Redux Toolkit Query(RTK Query)
    - SWR(Stale-While-Revalidate)
    - Apollo Client

### 전역 상태 관리 라이브러리 vs 서버 상태 관리 라이브러리

---

- 리액트에는 Redux, Recoil, Zustand, Context API 등 상태를 전역에서 관리할 수 있는 다양한 라이브러리가 존재한다.
- 그럼에도 Tanstack Query와 같은 서버 상태 관리 라이브러리를 사용하는 이유는 무엇일까?

- **클라이언트 상태**
    - `클라이언트에서 온전히 소유`하며 제어
    - 초기값 설정이나 조작에 제약이 없음
    - `다른 사람들과 공유되지 않으며 사용자와의 상호작용`에 따라 변함
    - `항상` 클라이언트 내에서 `최신 상태`로 관리됨

- **서버 상태**
    - 클라이언트에서 제어하거나 소유 되지 않은 `원격의 공간에서 관리되고 유지`
    - `Fetching`이나 `Updating`에 `비동기 API` 필요
    - `다른 사람들과 공유되는 데이터`로 사용자가 모르는 사이에 변경될 수 있음
    - 신경 쓰지 않는다면 사용 중인 데이터가 `최신 데이터가 아닐 수 있음`

- **비동기 데이터 관리의 복잡성**
    - `전역 상태 관리 라이브러리`를 사용해서 서버 상태 관리 라이브러리가 하는 역할을 구현할 수 있지만, `설정과 코드가 복잡해지고 추가적인 미들웨어가 필요`할 수 있다.
- **캐싱 및 데이터 무효화**
    - 서버 상태는 `캐싱`이 매우 중요한데 전역 상태 관리 라이브러리는 이와 관련된 기능을 제공하지 않지만, 서버 상태 관리 라이브러리는 `캐싱`이나 `데이터 무효화 기능`을 내장하고 있다.
- **자동 갱신**
    - 실시간으로 업데이트 되는 채팅 메시지나 알림 등의 데이터는 최신 상태를 유지해야 하는데 서버 상태 라이브러리는 설정에 따라 데이터를 `주기적으로 갱신`하거나 `백그라운드에서 데이터를 가져오는 기능을 제공`한다.
- **에러 및 로딩 상태 관리**
    - 서버 상태 관리 라이브러리는 로딩, 에러, 성공 했을 때 각각 `isLoading`, `isError` 등의 값을 반환하여 유연한 처리가 가능하게 해준다.

### Tanstack Query

---

- 이전 React Query로 불렸지만, v4 업데이트가 되면서 React 뿐만 아니라 Vue, Svelte 등의 다른 프레임워크에서도 지원하게 되면서 Tanstack Query로 불리게 되었다.
- `비동기` 혹은 `서버 상태 관리`에 `효과적`이다.
- 내부적으로 `Context API`를 사용한다.
    
![image 1](https://github.com/user-attachments/assets/7585d50e-d23f-4081-8d7a-9bdd5615abc8)
    
- Tanstack Query를 이용하여 서버 상태를 관리하게 되면 타 라이브러리로 서버 상태 관리 시 복잡해질 수 있는 코드를 단 몇 줄로 줄일 수 있다.

- **기능**
    - 같은 데이터에 대한 `중복 요청을 단일 요청`으로 통합
    - `백그라운드`에서 오래된 데이터를 업데이트
    - 데이터가 얼마나 오래되었는지를 파악
    - 데이터 업데이트를 가능한 빠르게 반영
    - `페이지네이션` 및 `데이터 지연 로드`와 같은 성능을 최적화
    - 서버 상태의 메모리 및 가비지 수집 관리
    - 구조 공유를 사용하여 쿼리 결과를 메모화

- **QueryClient와 QueryClientProvider**
    - Q**ueryClient**
        
        ![image 2](https://github.com/user-attachments/assets/2e03a5e3-aed3-48ed-8b4b-422dcef745c0)
        
        - 모든 쿼리에 대한 상태 및 캐시를 가지고 있는 클래스, Tanstack Query를 사용하기 위해서는 필수적으로 생성해줘야 한다.
        - 사용 시 `캐시와 상호작용` 가능
        - defaultOptions 설정 시 모든 `query와 mutation에 기본 옵션 추가`
        - 다양한 메서드 존재(invalidateQueries가 대표적)
    
    - Q**ueryClientProvider**
        - QueryClient를 애플리케이션에 연결 및 제공
        - 최상단에 감싸주고 QueryClient 인스턴스를 `client` prop에 넣어줌

- **핵심 개념**
    - `Query Key`를 기반으로 `Query Caching`을 진행
    - 쿼리는 서버로부터 데이터를 가져오기 위해 `Promise 기반의 모든 메서드(GET과 POST 메서드 포함)와 함께 사용` 가능
    - 서버의 데이터를 `수정`하고자 한다면, query 대신 `Mutation` 사용을 권장
        - Why? Queries의 경우 `Query Key 바탕으로 Caching을 진행`하지만, `Mutations는 Caching을 진행하지 않고 서버에 사이드 이펙트를 일으킴`
        - 이러한 차이가 `Queries는 GET`, `Mutations는 POST, PATCH, DELETE`에 좀 더 적합

- **useQuery**
    - 서버에서 데이터를 받아올 때 사용하는 기능
        
        ![image 3](https://github.com/user-attachments/assets/a7695db3-0752-4370-8d9f-02278770d09d)
        
    
    - **Query 상태 흐름도**
        
        ![image 4](https://github.com/user-attachments/assets/73445f2f-2321-4bd0-ac5f-1997fcbe5217)
        
    
    - **매개변수(객체의 프로퍼티)**
        - **queryKey `(required)`**
            - 배열로 지정해 주어야 하며 이는 단일 문자열만 포함된 배열이거나 여러 문자열과 중첩된 객체로 구성된 복잡한 형태
        - **queryFn `(required)`**
            - Promise를 반환하는 함수를 넣어야 함
        - **enabled**
            - `자동`으로 query를 실행할 지에 대한 여부
        - **staleTime**
            - 데이터가 `fresh`에서 `stale` 상태로 변경되는 데 걸리는 시간, `기본 값은 0`
            - fresh 상태일 때는 쿼리 인스턴스가 새롭게 mount, 즉 스크린에서 사용되어도 fetch가 일어나지 않지만, stale 상태일 때는 fetch가 일어남
        - **retry**
            - query 동작 실패 시, 자동으로 몇 번 만큼 retry를 시도할 지 결정하는 옵션, `기본 값은 3`
        - **refetchInterval**
            - 주기적으로 `refetch` 하는 간격을 설정하는 옵션
        - **gcTime**
            - 데이터를 사용하지 않거나, `inactive 상태일 때 캐싱 된 상태로 남아있는 시간`, 기본 값은 `5분`
    - `fresh` 상태일 때는 쿼리 인스턴스가 새롭게 마운트 되며 `fetch`가 일어나지 않고, `stale` 상태일 때는 `fetch`가 일어난다.
    
    - **반환 값 데이터**
        - **data**
            - 쿼리 요청이 성공한 경우, 쿼리 함수가 리턴한 Promise에서 `resolved 된 데이터`
        - **error**
            - 쿼리 함수에 오류가 발생한 경우, 쿼리에 대한 오류 객체
        - **isSuccess**
            - 쿼리 요청이 성공하고 데이터를 이용할 수 있는 상태
        - **isError**
            - 쿼리 요청 중에 에러가 발생한 상태
        - **isPending**
            - 캐싱 된 데이터가 없고, 쿼리 시도가 아직 완료되지 않은 상태
            - 캐싱된 데이터가 없는 초기 상태, 혹은 네트워크 요청이 진행 중일 때 `true` 반환
        - **isLoading**
            - 캐싱 된 데이터가 없을 때, 로딩 여부에 따라 true/false를 반환
            - 재요청(fetch)이 있더라도 캐싱된 데이터가 있다면 `isLoading`은 `false` 반환
        - **isFetching**
            - 캐싱 된 데이터가 있더라도 쿼리가 실행되면 로딩 여부에 따라 true/false를 반환
        - **isPaused**
            - 쿼리는 fetch를 원하나 멈춘 상태
            - 보통의 경우 NetworkMode가 온라인으로 설정되어 있는데 네트워크가 끊어진 경우 쿼리는 `네트워크가 다시 연결되기 전까지 쿼리 실행을 멈추고 paused 상태`가 됨
            - 이는 네트워크 연결이 끊어졌을 때 예외 처리 시 유용함

- **useMutation**
    - POST, PATCH, DELETE 요청 등 서버에 `사이드 이펙트`를 일으키는 경우에 사용
        
        ![image 5](https://github.com/user-attachments/assets/563c0447-cf08-4652-b768-3d4935c1bbf9)
        
    
    - **매개변수(객체의 프로퍼티)**
        - **mutationFn `(required)`**
            - promise를 반환하는 함수
        - **onMutate**
            - `mutationFn이 실행되기 전`에 실행되는 `함수`
            - mutation 함수가 받을 동일한 변수가 전달 됨
            - 주로 `낙관적 업데이트`를 구현할 때 많이 사용
        - **onSuccess**
            - mutationFn이 `성공`했을 때 실행되고, `mutation의 결과를 받음`
        - **onError**
            - mutationFn이 `실패`했을 때 실행되고, `error 객체를 받음`
        - **onSettled**
            - try…catch..finally 구문의 `finally`처럼 요청이 `성공하든 에러가 발생하든 상관없이 마지막에 실행`
        
    - **반환 값 데이터**
        - **data**
            - mutation 함수가 리턴한 `Promise에서 resolved 된 데이터`
        - error
            - mutation 중 발생한 `오류 객체`
        - **isSuccess**
            - mutation이 성공하고 데이터를 이용할 수 있는 상태
        - **isPending**
            - mutation이 진행 중인 상태
        - **isError**
            - mutation 중 에러가 발생한 상태
        - **isIdle**
            - mutation이 아직 실행되지 않았거나 이전 실행 후 리셋 된 상태

- **queryClient.invalidateQueries**
    
    ![image 6](https://github.com/user-attachments/assets/74fb48c5-7f91-4694-9049-c30aa8ef3649)
    
    - `queryClient`의 메서드로 `쿼리를 무효화(stale 상태로 만듦)하고 최신화(새로운 데이터를 fetch)`
    - invalidateQueries에 옵션이 없는 경우에는 캐시 안에 있는 모든 쿼리를 무효화
    - 옵션에 `queryKey`를 넣어주면 해당 쿼리 키를 가진 모든 쿼리를 무효화

- **useSuspenseQuery**
    - React의 `Suspense for Data Fetching API`를 사용하기 위한 hook
    - **Suspense**
        - 데이터를 불러오는 동안 `fallback UI`를 대신 보여주는 기능

### 참고 자료

---

- https://www.youtube.com/watch?v=RfK15tw8H-I
- https://www.youtube.com/watch?v=n-ddI9Lt7Xs
