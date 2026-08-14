import { describe, expect, it, vi, beforeEach } from "vitest";
import { TRPCError } from "@trpc/server";
import type { TrpcContext } from "./_core/context";
import { appRouter } from "./routers";

// Mock the db layer so no real database is touched.
vi.mock("./db", () => ({
  listContactMessages: vi.fn(async () => [
    { id: 1, name: "Ada", email: "ada@example.com", subject: "Hi", message: "Hello world test", read: 0, createdAt: new Date() },
    { id: 2, name: "Bob", email: "bob@example.com", subject: "Yo", message: "Another message here", read: 1, createdAt: new Date() },
  ]),
  countUnreadMessages: vi.fn(async () => 1),
  markContactMessageRead: vi.fn(async () => undefined),
  deleteContactMessage: vi.fn(async () => undefined),
}));

import {
  countUnreadMessages,
  deleteContactMessage,
  listContactMessages,
  markContactMessageRead,
} from "./db";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createCtx(role: "admin" | "user", openId = "caller"): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId,
    email: `${openId}@example.com`,
    name: openId,
    loginMethod: "manus",
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => undefined } as unknown as TrpcContext["res"],
  };
}

function anonCtx(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => undefined } as unknown as TrpcContext["res"],
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("admin router security", () => {
  it("rejects anonymous callers on listMessages", async () => {
    const caller = appRouter.createCaller(anonCtx());
    await expect(caller.admin.listMessages()).rejects.toThrow();
  });

  it("rejects non-admin users on listMessages with FORBIDDEN", async () => {
    const caller = appRouter.createCaller(createCtx("user"));
    try {
      await caller.admin.listMessages();
      expect.unreachable("should have thrown");
    } catch (e) {
      expect(e).toBeInstanceOf(TRPCError);
      expect((e as TRPCError).code).toBe("FORBIDDEN");
    }
  });

  it("allows the owner admin to list messages", async () => {
    const caller = appRouter.createCaller(createCtx("admin"));
    const result = await caller.admin.listMessages();
    expect(result.messages).toHaveLength(2);
    expect(result.unread).toBe(1);
    expect(listContactMessages).toHaveBeenCalledOnce();
    expect(countUnreadMessages).toHaveBeenCalledOnce();
  });

  it("admin admin.me exposes the user", async () => {
    const caller = appRouter.createCaller(createCtx("admin", "adit"));
    const result = await caller.admin.me();
    expect(result.user.role).toBe("admin");
  });

  it("markRead and deleteMessage are admin-gated", async () => {
    const userCaller = appRouter.createCaller(createCtx("user"));
    await expect(userCaller.admin.markRead({ id: 1 })).rejects.toBeInstanceOf(TRPCError);
    await expect(userCaller.admin.deleteMessage({ id: 1 })).rejects.toBeInstanceOf(TRPCError);

    const adminCaller = appRouter.createCaller(createCtx("admin"));
    const mark = await adminCaller.admin.markRead({ id: 1 });
    expect(mark.success).toBe(true);
    expect(markContactMessageRead).toHaveBeenCalledWith(1);

    const del = await adminCaller.admin.deleteMessage({ id: 2 });
    expect(del.success).toBe(true);
    expect(deleteContactMessage).toHaveBeenCalledWith(2);
  });
});
