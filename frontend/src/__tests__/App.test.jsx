import { render, screen } from "@testing-library/react";
import App from "../App.jsx";

test("renders title", () => {
  render(<App />);
  expect(screen.getByText(/Performance Monitoring Dashboard/i)).toBeInTheDocument();
});
