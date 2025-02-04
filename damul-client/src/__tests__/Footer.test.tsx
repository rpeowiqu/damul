import "@testing-library/jest-dom"; // jest-dom matchers를 로드합니다.
import { TextEncoder, TextDecoder } from "util";
// @ts-ignore
global.TextEncoder = TextEncoder;
// @ts-ignore
global.TextDecoder = TextDecoder;

import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Footer from "../components/common/Footer";

test("Footer가 올바르게 렌더링되어 모든 탭 라벨이 보여야 합니다.", () => {
  render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>,
  );

  // 각 탭의 라벨이 화면에 있는지 확인합니다.
  const labels = ["홈", "통계", "커뮤니티", "채팅", "프로필"];
  labels.forEach((label) => {
    expect(screen.getByText(label)).toBeInTheDocument();
  });
});
