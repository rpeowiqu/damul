import App from "../App"
import { render, screen } from "@testing-library/react";

test("페이지가 제대로 뜨나요?", async () => {
  render(<App />);
  const umbutton = await screen.findByRole("button");
  expect(umbutton.innerHTML).toBe("엄준식");
});
