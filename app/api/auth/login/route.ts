import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSession, deleteSession } from "@/lib/session";

const loginSchema = z.object({
  userName: z
    .string()
    .min(1, "ユーザー名は必須です")
    .max(30, "ユーザー名は30文字以内で入力してください"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = loginSchema.parse(body);

    // ユーザーを検索
    const user = await prisma.users.findFirst({
      where: {
        user_name: validatedData.userName,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "ユーザーが存在しません。新規登録を行ってください。" },
        { status: 404 }
      );
    }

    // 既存のセッションを削除してから新しいセッションを作成
    await deleteSession();
    await createSession(user.id, user.user_name);

    return NextResponse.json({
      success: true,
      user: { id: user.id, userName: user.user_name },
    });
  } catch (error) {
    console.error("Login error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "ログインに失敗しました" },
      { status: 500 }
    );
  }
}
