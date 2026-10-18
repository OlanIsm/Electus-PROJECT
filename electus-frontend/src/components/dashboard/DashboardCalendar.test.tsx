import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DashboardCalendar } from "./DashboardCalendar";

describe("DashboardCalendar", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 8, 12));
  });

  afterEach(() => vi.useRealTimers());

  it("opens on the current month with Monday first and today selected", () => {
    const { container } = render(<DashboardCalendar />);
    expect(screen.getByText("September 2026")).toBeInTheDocument();
    expect(screen.getByText("8 Sept 2026")).toBeInTheDocument();
    expect(screen.getAllByRole("columnheader")[0]).toHaveTextContent("Mon");
    expect(container.querySelector(".calendar-selected")).toHaveTextContent("8");
  });

  it("navigates months in both directions and returns to today", () => {
    render(<DashboardCalendar />);
    fireEvent.click(screen.getByRole("button", { name: "Go to next month" }));
    expect(screen.getByText("October 2026")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Go to previous month" }));
    fireEvent.click(screen.getByRole("button", { name: "Go to previous month" }));
    expect(screen.getByText("August 2026")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Today", exact: true }));
    expect(screen.getByText("September 2026")).toBeInTheDocument();
  });

  it("updates the selected date without affecting candidate filters", () => {
    const { container } = render(<DashboardCalendar />);
    const day = [...container.querySelectorAll<HTMLButtonElement>(".calendar-day")]
      .find(button => button.textContent === "16");
    fireEvent.click(day!);
    expect(screen.getByText("16 Sept 2026")).toBeInTheDocument();
    expect(container.querySelector(".calendar-selected")).toHaveTextContent("16");
  });
});
