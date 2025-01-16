# 리액트의 불필요한 리렌더링을 줄이기

저는 Melio에서 리액트 웹 애플리케이션을 개발하는 풀스택 개발자로서 프런트엔드 개발이 백엔드 개발만큼이나 복잡하다는 것을 몸소 경험했습니다. 프런트엔드 개발은 상태 관리, 반응성 보장, 성능 최적화 등의 복잡하고 어려운 과제를 갖고 있습니다.

모든 프런트엔드 프레임워크에는 내부 동작 방식, 어려운 과제, 고유한 특성이 있으며 리액트 또한 예외는 아닙니다. 유명한 `useEffect` 훅처럼 일부 메커니즘은 제대로 사용하려면 일정 수준의 이해가 필요합니다.

## useEffect를 남용하지 마세요!

`useEffect`는 리액트에서 제공하는 가장 보편적으로 사용되는 훅 중 하나입니다. 이 훅은 데이터 가져오기, 구독, 직접 변경 등을 포함한 외부 요인/서비스와 컴포넌트를 동기화시킬 수 있지만, 아주 쉽게 남용되기도 합니다. 이 글에서는 모든 개발자가 피해야 하는 몇 가지 상황과 리액트 팀이 새로운 리액트 문서(react.dev)에서 제공하는 해결책에 대해 다뤄보겠습니다.

### 잘못된 예제: 경쟁 상태 발생

```jsx
// 🔴 마지막 요청에서 response 상태값을 저장한다는 것을 보장할 수 있나요?
function RaceConditionExample() {
  const [counter, setCounter] = useState(0);
  const [response, setResponse] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const request = async (requestId) => {
      setIsLoading(true);
      await sleep(Math.random() * 3000);
      setResponse(requestId);
      setIsLoading(false);
    };
    request(counter);
  }, [counter]);

  const handleClick = () => {
    setCounter((prev) => ++prev);
  };

  return (
    <>
      <button onClick={handleClick}>Increment</button>
    </>
  );
}
```

위 코드에서는 버튼을 빠르게 연속으로 클릭할 경우, 이전 요청이 마지막 요청의 응답을 덮어쓰는 경쟁 상태가 발생할 수 있습니다.

### 해결책: 클린업 함수 사용

```jsx
// ✅ 클린업 함수로 경쟁 상태를 처리합니다
useEffect(() => {
  let ignore = false;
  const request = async (requestId) => {
    setIsLoading(true);
    await sleep(Math.random() * 3000);
    if (!ignore) {
      setResponse(requestId);
      setIsLoading(false);
    }
  };
  request(counter);

  return () => {
    ignore = true;
  };
}, [counter]);
```

클린업 함수는 이전 요청을 무시하도록 `ignore` 플래그를 설정하여 경쟁 상태를 방지합니다.

---

## 한 번 더 렌더링

다음 예제에서는 데이터를 잘못된 방식으로 전달하여 렌더링이 추가로 발생하는 경우를 살펴보겠습니다.

### 잘못된 사용 1: 추가 렌더링 발생

```jsx
function Parent() {
  const [someState, setSomeState] = useState();
  return <Child onChange={(...) => setSomeState(...)} />;
}

function Child({ onChange }) {
  const [isOn, setIsOn] = useState(false);

  useEffect(() => {
    // 🚨 추가적인 렌더링을 유발합니다
    onChange(isOn);
  }, [isOn, onChange]);

  function handleClick() {
    setIsOn(!isOn);
  }

  return <button onClick={handleClick}>Toggle</button>;
}
```

`useEffect`에서 호출되는 `onChange`는 필요하지 않습니다. `onClick` 핸들러 내에서 간단히 처리할 수 있습니다.

### 해결책

```jsx
function Parent() {
  const [someState, setSomeState] = useState();
  return <Child onChange={(...) => setSomeState(...)} />;
}

function Child({ onChange }) {
  const [isOn, setIsOn] = useState(false);

  function handleClick() {
    const newValue = !isOn;
    setIsOn(newValue);
    onChange(newValue);
  }

  return <button onClick={handleClick}>Toggle</button>;
}
```

이 방식은 동일한 결과를 제공하면서도 불필요한 렌더링을 줄입니다.

---

## 데이터 흐름을 유지하세요

리액트의 데이터는 "부모에서 자식"으로 흐르는 폭포수처럼 전달되어야 합니다. 데이터 흐름 체인을 망가뜨리는 코드는 유지보수와 디버깅이 어렵습니다.

### 잘못된 사용 2: 데이터 흐름 체인을 망가뜨리기

```jsx
function Parent() {
  const [data, setData] = useState(null);

  return <Child onFetched={setData} />;
}

function Child({ onFetched }) {
  const data = useFetchData();

  useEffect(() => {
    if (data) {
      onFetched(data);
    }
  }, [onFetched, data]);

  return <>{JSON.stringify(data)}</>;
}
```

### 해결책: 데이터 흐름 유지

```jsx
function Parent() {
  const data = useFetchData();

  return <Child data={data} />;
}

function Child({ data }) {
  return <>{JSON.stringify(data)}</>;
}
```

데이터를 부모에서 관리하여 "진실의 출처(source of truth)"를 명확히 하고, 유지보수성을 높입니다.

---

## 초기화 작업

앱 런타임 중 딱 한 번 실행해야 하는 초기화 작업에는 `useEffect` 대신 아래와 같은 방법을 사용할 수 있습니다.

### 대안 1: 플래그를 사용

```jsx
let didInit = false;

function App() {
  useEffect(() => {
    if (!didInit) {
      didInit = true;
      someOneTimeLogic();
    }
  }, []);
}
```

### 대안 2: 렌더링 전에 실행

```jsx
if (typeof window !== "undefined") {
  someOneTimeLogic();
}

function App() {
  // ...
}
```

---

## 결론

리액트에서 불필요한 리렌더링을 방지하려면 데이터 흐름을 올바르게 유지하고, `useEffect` 훅의 남용을 피하며, 클린업 함수와 적절한 초기화 방법을 사용하는 것이 중요합니다. 이를 통해 코드의 성능과 유지보수성을 향상시킬 수 있습니다.
