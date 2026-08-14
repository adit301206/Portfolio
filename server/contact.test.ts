import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the db layer so tests don't depend on a live database.
vi.mock("./db", () => ({
  saveContactMessage: vi.fn(async () => undefined),
  listContactMessages: vi.fn(async () => []),
  countUnreadMessages: vi.fn(async () => 0),
  markContactMessageRead: vi.fn(async () => undefined),
  deleteContactMessage: vi.fn(async () => undefined),
}));

// Mock owner notifications — never hit the real channel in tests.
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn(async () => undefined),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {
      clearCookie: () => undefined,
    } as unknown as TrpcContext["res"],
  };
}

describe("contact.send", () => {
  it("accepts a valid submission and reports success", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    const result = await caller.contact.send({
      name: "Test Visitor",
      email: "visitor@example.com",
      subject: "Collaboration",
      message: "Hi Adit, I loved your portfolio! Let's work together.",
    });

    expect(result).toEqual({ success: true });
  });

  it("rejects a message shorter than 10 characters", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    await expect(
      caller.contact.send({
        name: "Test",
        email: "t@example.com",
        message: "short",
      }),
    ).rejects.toThrow();
  });

  it("rejects an invalid email address", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    await expect(
      caller.contact.send({
        name: "Test",
        email: "not-an-email",
        message: "A message longer than ten characters.",
      }),
    ).rejects.toThrow();
  });
});
