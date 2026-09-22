import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

function Hello() {
	return <p>hello test harness</p>;
}

describe("test harness", () => {
	it("renders and asserts with jest-dom matchers", () => {
		render(<Hello />);
		expect(screen.getByText("hello test harness")).toBeInTheDocument();
	});
});
