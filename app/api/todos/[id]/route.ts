import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateTodoApiSchema } from "@/lib/validations";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const todo = await prisma.todo_list.findUnique({
      where: { id: params.id },
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
    const body = await request.json();

    // zodでバリデーション
    const validatedData = updateTodoApiSchema.parse({
      ...body,
      id: params.id,
    });

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
