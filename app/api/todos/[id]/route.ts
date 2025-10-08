import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateTodoApiSchema } from "@/lib/validations";
import { getSession } from "@/lib/session";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const todo = await prisma.todo_list.findFirst({
      where: {
        id: params.id,
        user_id: session.userId,
      },
    });

    if (!todo) {
      return NextResponse.json(
        { error: "Todoが見つかりません" },
        { status: 404 }
      );
    }

    return NextResponse.json(todo);
  } catch (error) {
    console.error("Failed to fetch todo:", error);
    return NextResponse.json(
      { error: "Todoの取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const body = await request.json();

    // zodでバリデーション
    const validatedData = updateTodoApiSchema.parse({
      ...body,
      id: params.id,
    });

    // そのTodoがユーザーのものか確認
    const existingTodo = await prisma.todo_list.findFirst({
      where: {
        id: params.id,
        user_id: session.userId,
      },
    });

    if (!existingTodo) {
      return NextResponse.json(
        { error: "Todoが見つかりません" },
        { status: 404 }
      );
    }

    const todo = await prisma.todo_list.update({
      where: { id: params.id },
      data: {
        todoTitle: validatedData.todoTitle,
        todoText: validatedData.todoText || "",
        endTime: validatedData.endTime,
      },
    });

    return NextResponse.json(todo);
  } catch (error) {
    console.error("Failed to update todo:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "バリデーションエラー", details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Todoの更新に失敗しました" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    // そのTodoがユーザーのものか確認
    const existingTodo = await prisma.todo_list.findFirst({
      where: {
        id: params.id,
        user_id: session.userId,
      },
    });

    if (!existingTodo) {
      return NextResponse.json(
        { error: "Todoが見つかりません" },
        { status: 404 }
      );
    }

    await prisma.todo_list.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Todoを削除しました" });
  } catch (error) {
    console.error("Failed to delete todo:", error);
    return NextResponse.json(
      { error: "Todoの削除に失敗しました" },
      { status: 500 }
    );
  }
}
