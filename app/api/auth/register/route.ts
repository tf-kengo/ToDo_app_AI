import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";

const registerSchema = z.object({
  userName: z
    .string()
    .min(1, "ユーザー名は必須です")
    .max(30, "ユーザー名は30文字以内で入力してください"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    // ユーザーが既に存在するかチェック
    const existingUser = await prisma.users.findFirst({
      where: {
        user_name: validatedData.userName,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "このユーザー名は既に使用されています" },
        { status: 400 }
      );
    }

    // 新しいユーザーを作成
    const user = await prisma.users.create({
      data: {
        user_name: validatedData.userName,
      },
    });

    // セッションを作成
    await createSession(user.id, user.user_name);

    return NextResponse.json({
      success: true,
      user: { id: user.id, userName: user.user_name },
    });
  } catch (error) {
    console.error("Register error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "新規登録に失敗しました" },
      { status: 500 }
    );
  }
}
