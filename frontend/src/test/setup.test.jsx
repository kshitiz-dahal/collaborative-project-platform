import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

function TestComponent() {
    return <h1>SyncForge Testing Ready</h1>;
}

describe("Frontend testing setup", () => {
    it("renders a react component", () => {
        render(<TestComponent />);

        expect(
            screen.getByRole("heading", {
                name: "SyncForge Testing Ready",
            })
        ).toBeInTheDocument();
    });
});