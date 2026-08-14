import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { notifyOwner } from "./_core/notification";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  countUnreadMessages,
  deleteContactMessage,
  listContactMessages,
  markContactMessageRead,
  saveContactMessage,
} from "./db";

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access only" });
  }
  return next({ ctx });
});

const contactInput = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Invalid email").max(320),
  subject: z.string().max(300).optional(),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000),
});

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  contact: router({
    send: publicProcedure.input(contactInput).mutation(async ({ input }) => {
      await saveContactMessage({
        name: input.name.trim(),
        email: input.email.trim(),
        subject: input.subject?.trim() || "General inquiry",
        message: input.message.trim(),
      });
      // Alert the portfolio owner via the built-in notification channel.
      notifyOwner({
        title: `New portfolio message from ${input.name}`,
        content: `${input.email} wrote: ${input.message.slice(0, 400)}`,
      }).catch(() => undefined);
      return { success: true } as const;
    }),
    list: publicProcedure.query(async () => listContactMessages(50)),
  }),

  admin: router({
    me: protectedProcedure.query(({ ctx }) => {
      // expose current user to the client so the admin page can check role
      return { user: ctx.user } as const;
    }),
    listMessages: adminProcedure.query(async () => {
      const [messages, unread] = await Promise.all([
        listContactMessages(200),
        countUnreadMessages(),
      ]);
      return { messages, unread };
    }),
    markRead: adminProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ input }) => {
        await markContactMessageRead(input.id);
        return { success: true } as const;
      }),
    deleteMessage: adminProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ input }) => {
        await deleteContactMessage(input.id);
        return { success: true } as const;
      }),
  }),
});

export type AppRouter = typeof appRouter;
