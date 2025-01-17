### 학습 배경
리액트의 제공 Hook을 적절하게 사용하면 더욱 완성도 높은 프론트엔드 코드를 작성할 수 있지만,
대표 Hook 중 useReducer과 useRef에 대해서 심도있게 알고있지는 않았던 것 같다.
두 Hook의 개념과 사용법을 정리하고, 그 차이점과 특징에 대해 알아보고자 한다.


# useReducer

`useReducer`은 리액트에서 제공하는 Hook으로, 복잡한 상태 로직을 다룰 때 유용하다.

## 기본 문법

```jsx
const [state, dispatch] = useReducer(reducer, initialState);
```

- `state` : 현재 상태
- `dispatch` : 상태를 변경하는 함수로, 액션을 보내는데 사용됨
- `reducer` :  상태를 변경하는 순수 함수
- `initialState` : 상태의 초기값

### reducer 함수

현재 상태와 액션을 입력받아 새로운 상태를 반환하는 함수

```jsx
function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    default:
      return state;
  }
}
```

- **`action.type`**: 액션의 종류를 정의
- **`state`**: 현재 상태를 받음
- **`return`**: 새로운 상태를 반환

## **사용 예시**

### **1) 카운터 예제**

```jsx
import React, { useReducer } from "react";

function counterReducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>Increase</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>Decrease</button>
    </div>
  );
}

export default Counter;
```

- `useReducer` 훅을 사용하여 상태 관리
- `dispatch`는 액션을 전달하여 상태 변경
- `reducer` 함수는 각 액션에 맞게 상태 업데이트

### **2) 복잡한 상태 관리**

`useReducer`는 여러 상태를 동시에 관리할 때 유용

```jsx
import React, { useReducer } from "react";

const initialState = { count: 0, name: '' };

function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'SET_NAME':
      return { ...state, name: action.name };
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <p>Count: {state.count}</p>
      <p>Name: {state.name}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>Increase Count</button>
      <input
        type="text"
        value={state.name}
        onChange={(e) => dispatch({ type: 'SET_NAME', name: e.target.value })}
        placeholder="Enter name"
      />
    </div>
  );
}

export default App;
```

- `count`와 `name`이라는 여러 상태를 `useReducer`로 관리
- 각각의 상태를 변경하는 액션을 `dispatch`로 보냄

## 주의할 점

- **상태 로직이 복잡할 때 유용**
    
    상태가 복잡하거나, 여러 액션에 따라 상태가 변화하는 경우 `useReducer`가 적합하다.
    
- **액션 이름 관리**
    
    액션의 종류가 많아지면 **액션 타입**을 관리하는 방법에 대해 고민해야 할 수 있습니다. 이때는 상수로 관리하는 방법을 고려할 수 있다.
    
- **상태 변경의 투명성**
    
    `useReducer`는 상태 업데이트가 명확하고 예측 가능하게 만들어, 상태 변경 로직을 한 곳에 집중시킬 수 있다.
    

## **useReducer vs useState**

| 특징 | `useReducer` | `useState` |
| --- | --- | --- |
| **상태 변경 방식** | **액션**을 사용하여 상태를 변경 | 직접적으로 상태 값을 변경 |
| **상태 로직 복잡성** | 복잡한 상태 로직에 적합 | 간단한 상태 로직에 적합 |
| **배열/객체 상태 관리** | 복잡한 배열이나 객체 상태를 관리하는 데 유리 | 간단한 값이나 문자열 상태 관리 |
| **상태 업데이트** | `dispatch`를 사용하여 상태를 변경 | `setState`를 사용하여 상태를 변경 |

# useRef

`useRef`는 리액트에서 재공하는 Hook으로, 주로 **DOM 요소 접근**이나 **값 저장**에 사용된다.

상태를 변화시키지 않고도 값을 저장하고 유지할 수 있기 때문에 특정 상황에서 유용하게 사용된다.

## 기본 문법

```jsx
const ref = useRef(initialValue);
```

- `useRef`는 객체를 반환한다
- 반환된 객체는 `.current`라는 프로퍼티를 갖는다
- `ref.current`에 값을 저장하거나 접근할 수 있다

## 사용 사례

### 1) DOM 요소에 접근하기

리액트 컴포넌트 내에서 DOM 요소에 직접 접근할 수 있다.

```jsx
import React, { useRef, useEffect } from "react";

function InputFocus() {
  const inputRef = useRef(null);

  useEffect(() => {
    // 컴포넌트 마운트 시 input 요소에 포커스
    inputRef.current.focus();
  }, []);

  return <input ref={inputRef} placeholder="Focus on me!" />;
}

export default InputFocus;
```

- `ref={inputRef}`를 통해 `input` 요소와 `inputRef`를 연결한다
- `inputRef.current`는 해당 `input` DOM 요소를 가리키며, 이를 통해 `focus()` 메서드를 호출할 수 있다

### 2) 상태가 아닌 값 저장하기

`useRef`는 **컴포넌트가 리렌더링 되어도 값이 유지되는 변수**로 사용된다.

```jsx
import React, { useRef, useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  const renderCount = useRef(0);

  renderCount.current += 1;

  return (
    <div>
      <p>Count: {count}</p>
      <p>Render Count: {renderCount.current}</p>
      <button onClick={() => setCount(count + 1)}>Increase Count</button>
    </div>
  );
}

export default Counter;
```

- `renderCount`는 `useRef`를 통해 값을 저장하므로 상태가 변경되지 않아 렌더링에 영향을 주지 않는다
- 리렌더링이 발생해도 `renderCount`의 값은 유지된다

### 3) 변수의 이전 값 기억하기

이전 렌더링에서의 값을 저장해 비교할 수 있다

```jsx
import React, { useRef, useEffect, useState } from "react";

function PreviousValue() {
  const [count, setCount] = useState(0);
  const prevCount = useRef(0);

  useEffect(() => {
    prevCount.current = count; // 이전 값을 저장
  }, [count]);

  return (
    <div>
      <p>Current Count: {count}</p>
      <p>Previous Count: {prevCount.current}</p>
      <button onClick={() => setCount(count + 1)}>Increase</button>
    </div>
  );
}

export default PreviousValue;
```

- 이전 `count` 값을 `prevCount.current`에 저장한다
- `useEffect`를 통해 상태가 변경될 때마다 업데이트 된다.

## 주의할 점

- **리렌더링을 발생시키지 않음**
    
    `useRef`의 값을 변경해도 컴포넌트는 리렌더링되지 않기 때문에 화면을 갱신할 필요가 있을 때는 `useState`를 사용해야함
    
- **DOM 요소에 직접 접근은 최소화**
    
    React의 철학은 **선언형 UI**이기 떄문에 DOM에 직접 접근하는 것은 권장되지 않는다.
    
    → 꼭 필요한 경우에만 사용하기
    
- **초기 값이 `null`인 경우**
    
    DOM 요소에 `ref`를 연결하려면 초기값을 `null`로 설정하는 것이 일반이다.
    

## useRef vs. useState

| 특징 | `useRef` | `useState` |
| --- | --- | --- |
| **렌더링 여부** | 값이 변경되어도 리렌더링 발생 X | 값이 변경되면 리렌더링 발생 |
| **값 유지** | 리렌더링 후에도 값 유지 | 리렌더링 후 값이 유지됨 |
| **주 용도** | DOM 접근, 변수 저장 | 상태 관리 및 UI 갱신 |

## 관통 프로젝트에서 사용한 내역

https://xuxi-log.tistory.com/135

관통 프로젝트 챗봇 채팅방을 구현할 때 최신 대화인 가장 하단으로 항상 focus 되도록 만들고자 `useRef`를 사용했다.