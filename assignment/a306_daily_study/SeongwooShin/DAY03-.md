# 헤드리스 컴포넌트 (Headless Component)

## 개요

헤드리스 컴포넌트는 UI를 렌더링하지 않고, 오직 로직과 상태만 관리하는 컴포넌트입니다. 이 컴포넌트는 UI를 추상화하여 재사용성과 관리 용이성을 높이는 데 도움을 줍니다. UI를 처리하는 부분은 외부에서 맡기고, 헤드리스 컴포넌트는 데이터를 제공하거나 UI와의 상호작용을 처리하는 데 집중합니다.

## 특징

- **UI와 분리된 로직**: 헤드리스 컴포넌트는 UI와 상호작용하는 코드에서 분리되어, 로직만 처리합니다. 따라서 UI와 독립적으로 테스트가 가능하고, 다양한 UI에 재사용할 수 있습니다.
- **컴포넌트 재사용성**: UI 부분을 커스터마이징할 수 있는 자유를 제공하며, 여러 UI 구현에서 동일한 로직을 재사용할 수 있습니다.

- **유연한 커스터마이징**: 부모 컴포넌트에서 UI 구현을 제어할 수 있기 때문에, 다양한 디자인을 적용할 수 있습니다.

## 사용 예시

### 예시 1: 토글 버튼

```tsx
// useToggle.tsx (헤드리스 컴포넌트)
import { useState } from "react";

export const useToggle = (initialState: boolean = false) => {
  const [isToggled, setIsToggled] = useState(initialState);

  const toggle = () => setIsToggled((prevState) => !prevState);

  return {
    isToggled,
    toggle,
  };
};
```

```tsx
// ToggleButton.tsx (UI 컴포넌트)
import { useToggle } from "./useToggle";

const ToggleButton = () => {
  const { isToggled, toggle } = useToggle();

  return <button onClick={toggle}>{isToggled ? "On" : "Off"}</button>;
};

export default ToggleButton;
```

위 예시에서 `useToggle`은 헤드리스 컴포넌트로, 상태 관리와 동작 로직만 제공합니다. `ToggleButton` 컴포넌트는 이 로직을 사용하여 버튼 UI를 렌더링합니다.

### 예시 2: 드롭다운 메뉴

```tsx
// useDropdown.tsx (헤드리스 컴포넌트)
import { useState } from "react";

export const useDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen((prevState) => !prevState);

  return {
    isOpen,
    toggleDropdown,
  };
};
```

```tsx
// Dropdown.tsx (UI 컴포넌트)
import { useDropdown } from "./useDropdown";

const Dropdown = () => {
  const { isOpen, toggleDropdown } = useDropdown();

  return (
    <div>
      <button onClick={toggleDropdown}>Toggle Dropdown</button>
      {isOpen && <div className="dropdown-menu">Dropdown Content</div>}
    </div>
  );
};

export default Dropdown;
```

### 장점

1. **로직의 재사용성**: UI가 변해도 로직은 변경하지 않고 그대로 사용할 수 있습니다.
2. **유연성**: UI는 자유롭게 디자인하고, 로직을 추상화하여 여러 곳에서 동일한 로직을 사용할 수 있습니다.
3. **테스트 용이성**: UI가 없기 때문에 로직만 독립적으로 테스트하기가 용이합니다.

## 결론

헤드리스 컴포넌트는 UI와 로직을 분리하여 코드의 재사용성 및 유지보수성을 높이는 좋은 방법입니다. 로직을 별도로 관리할 수 있어 UI 변경에 영향을 주지 않으면서도, 유연한 UI를 만들 수 있습니다. 또한, 컴포넌트 간 의존성을 줄이고 독립적으로 동작할 수 있도록 돕습니다.

---

## 참고자료

https://ykss.netlify.app/translation/headless_component_a_pattern_for_composing_react_uis/?utm_source=substack&utm_medium=email
