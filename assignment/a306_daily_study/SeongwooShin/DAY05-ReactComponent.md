# 리액트 컴포넌트의 유형 돌아보기

## 1. 리액트 `createClass`

**(더 이상 사용되지 않음)**  
2013년 초기 리액트는 ES5 기반으로 `createClass`를 사용해 컴포넌트를 정의했습니다.

### 장점

- 간단한 메서드 선언 방식.

### 단점

- ES6 클래스와 비교해 유연성이 부족하며, 성능 저하 가능성.

### 예제

```javascript
const MyComponent = React.createClass({
  getInitialState: function () {
    return { count: 0 };
  },
  increment: function () {
    this.setState({ count: this.state.count + 1 });
  },
  render: function () {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={this.increment}>Increment</button>
      </div>
    );
  }
});
```

---

## 2. 리액트 믹스인 (Mixins)

**(더 이상 사용되지 않음)**  
공유 가능한 로직을 `mixins`로 정의해 `createClass` 컴포넌트에 추가.

### 장점

- 로직 재사용 용이.

### 단점

- 의존 관계 복잡화, 충돌 위험.

### 예제

```javascript
const TimerMixin = {
  componentDidMount() {
    this.interval = setInterval(this.tick, 1000);
  },
  componentWillUnmount() {
    clearInterval(this.interval);
  }
};

const MyComponent = React.createClass({
  mixins: [TimerMixin],
  getInitialState() {
    return { seconds: 0 };
  },
  tick() {
    this.setState({ seconds: this.state.seconds + 1 });
  },
  render() {
    return <div>Seconds: {this.state.seconds}</div>;
  }
});
```

---

## 3. 리액트 클래스 컴포넌트

**(권장되지 않음)**  
2015년 ES6 클래스 문법이 도입되면서 `createClass`를 대체.

### 장점

- 생명주기 메서드와 상태 관리 가능.

### 단점

- 리액트 훅 이후 구식 기술로 분류됨.

### 예제

```javascript
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  increment = () => {
    this.setState({ count: this.state.count + 1 });
  };

  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={this.increment}>Increment</button>
      </div>
    );
  }
}
```

---

## 4. 리액트 고차 컴포넌트 (HOC)

**(더 이상 권장되지 않음)**  
컴포넌트를 입력으로 받아 새로운 컴포넌트를 출력하는 패턴.

### 장점

- 로직 재사용 가능.

### 단점

- 복잡성 증가, 코드 가독성 저하.

### 대안

- Render Props, 훅.

### 예제

```javascript
function withLoading(Component) {
  return function WrappedComponent({ isLoading, ...props }) {
    if (isLoading) return <div>Loading...</div>;
    return <Component {...props} />;
  };
}

function MyComponent({ data }) {
  return <div>Data: {data}</div>;
}

const MyComponentWithLoading = withLoading(MyComponent);
```

---

## 5. 리액트 함수 컴포넌트 (Function Component)

**(현재 표준)**  
단순한 함수로 정의된 컴포넌트로, 리액트 훅 등장 이후 표준으로 자리 잡음.

### 장점

- 간결함, 상태 및 부수 효과 처리 가능.

### 단점

- 복잡한 로직 구현 시 커스텀 훅 필요.

### 예제

```javascript
import React, { useState } from "react";

function MyComponent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

---

## 6. 리액트 서버 컴포넌트 (React Server Components)

**(최신)**  
서버에서 상태를 관리하고 렌더링한 결과를 클라이언트에 전달.

### 장점

- 초기 로딩 속도 개선, 클라이언트 코드 부담 감소.

### 단점

- 구현 및 디버깅 복잡도 증가.

### 예제

```javascript
// 클라이언트
import React from 'react';
import MyServerComponent from './MyServerComponent.server';

export default function App() {
  return (
    <div>
      <MyServerComponent />
    </div>
  );
}

// 서버
export default function MyServerComponent() {
  return <div>Rendered on the server</div>;
}
```

---

## 주요 변화 요약

- 과거: `createClass` → 클래스 컴포넌트.
- 현재: 함수 컴포넌트와 훅이 표준.
- 미래: 서버 컴포넌트가 리액트의 새로운 지평.
