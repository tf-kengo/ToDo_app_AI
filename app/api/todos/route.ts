import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createTodoApiSchema } from "@/lib/validations";

export async function GET() {
  try {
    const todos = await prisma.todo_list.findMany({
      orderBy: {
        endTime: "asc",
      },
    });

    return NextResponse.json(todos);
  } catch (error) {
    console.error("Failed to fetch todos:", error);
    return NextResponse.json(
      { error: "Todoの取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // zodでバリデーション
    const validatedData = createTodoApiSchema.parse(body);

    const todo = await prisma.todo_list.create({
      data: {
        todoTitle: validatedData.todoTitle,
        todoText: validatedData.todoText || "",
        endTime: validatedData.endTime,
      },
    });

    return NextResponse.json(todo, { status: 201 });
  } catch (error) {
    console.error("Failed to create todo:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "バリデーションエラー", details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Todoの作成に失敗しました" },
      { status: 500 }
    );
  }
}
