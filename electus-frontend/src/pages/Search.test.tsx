import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, expect, it, vi } from "vitest";
import Search from "./Search";

vi.mock("@/components/layout/DashboardLayout", () => ({
  DashboardLayout: ({ children }: { children: React.ReactNode }) => <main>{children}</main>,
}));
vi.mock("@/components/dashboard/CandidateDetailModal", () => ({
  CandidateDetailModal: () => null,
}));

afterEach(() => vi.unstubAllGlobals());

it("waits for submission and lists results in API rank order", async () => {
  const request = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => [
      { id: "high", reviewStatus: "reviewed", skills: ["PostgreSQL"], matchScore: 92 },
      { id: "low", reviewStatus: "reviewed", skills: ["React"], matchScore: 73 },
    ],
  });
  vi.stubGlobal("fetch", request);
  render(<QueryClientProvider client={new QueryClient()}><Search /></QueryClientProvider>);

  fireEvent.change(screen.getByRole("textbox"), { target: { value: "  NestJS & SQL  " } });
  expect(request).not.toHaveBeenCalled();
  fireEvent.submit(screen.getByRole("search"));
  await waitFor(() => expect(screen.getByText("2 candidates found")).toBeInTheDocument());
  expect(request).toHaveBeenCalledWith(expect.stringContaining("NestJS%20%26%20SQL"), expect.anything());
  expect(screen.getAllByRole("listitem").map(row => row.textContent)).toEqual([
    expect.stringContaining("PostgreSQL"),
    expect.stringContaining("React"),
  ]);
});
