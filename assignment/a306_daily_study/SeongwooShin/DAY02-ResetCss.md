# CSS Reset 분석 및 Tailwind CSS에서의 활용

## 리셋 CSS를 사용하는 이유

리셋 CSS는 브라우저마다 기본적으로 다르게 적용되는 스타일을 초기화하여, 일관된 디자인과 예측 가능한 레이아웃을 구현하기 위해 사용됩니다. 브라우저 간의 스타일 차이를 제거함으로써, CSS 작성 시 불필요한 조정 작업을 줄이고 개발 효율성을 높입니다.

### Tailwind CSS에서 리셋 CSS 사용법

Tailwind CSS는 `preflight`라는 초기화 스타일을 기본으로 제공합니다. 이는 리셋 CSS와 유사한 역할을 하며, 브라우저 간 스타일 차이를 줄이고 Tailwind의 유틸리티 클래스와 함께 사용할 때 최적의 결과를 제공합니다.

### Tailwind CSS에서 `preflight` 활성화

Tailwind를 설치한 후 `@tailwind base`를 통해 자동으로 적용됩니다.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

```

`@tailwind base`가 바로 `preflight` 초기화 스타일을 포함하며, 별도의 설정 없이 브라우저 기본 스타일을 초기화합니다.

### `preflight` 비활성화 방법

`tailwind.config.js`에서 다음 설정으로 기본 초기화를 비활성화할 수 있습니다.

```jsx
module.exports = {
  corePlugins: {
    preflight: false, // 기본 스타일 초기화 비활성화
  },
};

```

---

## 전체 CSS Reset 코드 분석

```css
/* box-sizing 규칙을 명시합니다. */
*,
*::before,
*::after {
  box-sizing: border-box;
}

/* 폰트 크기의 팽창을 방지합니다. */
html {
  -moz-text-size-adjust: none;
  -webkit-text-size-adjust: none;
  text-size-adjust: none;
}

/* 기본 여백을 제거하여 작성된 CSS를 더 잘 제어할 수 있습니다. */
body,
h1,
h2,
h3,
h4,
p,
figure,
blockquote,
dl,
dd {
  margin-block-end: 0;
}

/* list를 role값으로 갖는 ul, ol 요소의 기본 목록 스타일을 제거합니다. */
ul[role='list'],
ol[role='list'] {
  list-style: none;
}

/* 핵심 body의 기본값을 설정합니다. */
body {
  min-height: 100vh;
  line-height: 1.5;
}

/* 제목 요소와 상호작용하는 요소에 대해 line-height를 더 짧게 설정합니다. */
h1,
h2,
h3,
h4,
button,
input,
label {
  line-height: 1.1;
}

/* 제목에 대한 text-wrap을 balance로 설정합니다. */
h1,
h2,
h3,
h4 {
  text-wrap: balance;
}

/* 클래스가 없는 기본 a 태그 요소는 기본 스타일을 가져옵니다. */
a:not([class]) {
  text-decoration-skip-ink: auto;
  color: currentColor;
}

/* 이미지 관련 작업을 더 쉽게 합니다. */
img,
picture {
  max-width: 100%;
  display: block;
}

/* input 및 button 항목들이 글꼴을 상속하도록 합니다. */
input,
button,
textarea,
select {
  font: inherit;
}

/* 행 속성이 없는 textarea가 너무 작지 않도록 합니다. */
textarea:not([rows]) {
  min-height: 10em;
}

/* 고정된 모든 항목에는 여분의 스크롤 여백이 있어야 합니다. */
:target {
  scroll-margin-block: 5ex;
}

```

---

## 구체적인 분석

### box-sizing 규칙을 명시합니다

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}

```

- 모든 요소와 의사 요소의 크기를 `content-box` 대신 `border-box`로 설정합니다.
- 유동적인 레이아웃 환경에서 유용하게 활용됩니다.

### 폰트 크기의 팽창을 방지합니다

```css
html {
  -moz-text-size-adjust: none;
  -webkit-text-size-adjust: none;
  text-size-adjust: none;
}

```

- 폰트 크기 확대를 방지하며, 모바일 환경에서 레이아웃 왜곡을 최소화합니다.

### 기본 여백을 제거합니다

```css
body,
h1,
h2,
h3,
h4,
p,
figure,
blockquote,
dl,
dd {
  margin-block-end: 0;
}

```

- 논리적 속성을 활용하여 끝 여백만 제거하도록 설정했습니다.

### 목록 스타일 제거

```css
ul[role='list'],
ol[role='list'] {
  list-style: none;
}

```

- Safari의 특성을 고려하여 `role` 속성이 있는 경우만 스타일을 제거합니다.

### 핵심 body 설정

```css
body {
  min-height: 100vh;
  line-height: 1.5;
}

```

- `body`의 최소 높이를 100vh로 설정하고 가독성을 높이는 `line-height`를 설정합니다.

### 제목 및 상호작용 요소의 line-height 설정

```css
h1,
h2,
h3,
h4,
button,
input,
label {
  line-height: 1.1;
}

```

- 제목 및 버튼 요소의 `line-height`를 줄여 보다 깔끔한 레이아웃을 만듭니다.

### 제목에 text-wrap 적용

```css
h1,
h2,
h3,
h4 {
  text-wrap: balance;
}

```

- `text-wrap` 속성을 사용하여 제목의 텍스트 균형을 맞춥니다.

### a 태그 스타일링

```css
a:not([class]) {
  text-decoration-skip-ink: auto;
  color: currentColor;
}

```

- 텍스트 장식과 색상을 설정하여 링크의 기본 스타일을 정의합니다.

### 이미지 관련 설정

```css
img,
picture {
  max-width: 100%;
  display: block;
}

```

- 이미지 요소가 부모 요소를 초과하지 않도록 설정합니다.

### input 및 button 글꼴 상속

```css
input,
button,
textarea,
select {
  font: inherit;
}

```

- 폼 요소에 부모 글꼴을 상속하여 일관성을 유지합니다.

### textarea 크기 설정

```css
textarea:not([rows]) {
  min-height: 10em;
}

```

- `rows` 속성이 없는 textarea의 기본 높이를 설정합니다.

### 고정된 요소의 스크롤 여백 설정

```css
:target {
  scroll-margin-block: 5ex;
}

```

- 고정된 요소가 타겟팅될 때 스크롤 여백을 추가합니다.

---

## 참고 자료

- [CSS Reset 소개](https://meyerweb.com/eric/tools/css/reset/)
- [Modern CSS Reset](https://ykss.netlify.app/translation/a_more_modern_css_reset/)
- [MDN box-sizing](https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing)
- [Tailwind CSS 공식 문서](https://tailwindcss.com/docs/preflight)