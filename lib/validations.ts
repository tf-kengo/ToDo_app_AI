import { z } from "zod";

// API用のスキーマ（文字列として受信した日付を処理）
export const todoApiSchema = z.object({
  id: z.string().optional(),
  todoTitle: z
    .string()
    .min(1, "タイトルは必須です")
    .max(30, "タイトルは30文字以内で入力してください"),
  todoText: z
    .string()
    .max(100, "詳細は100文字以内で入力してください")
    .optional(),
  endTime: z
    .union([
      z.string().transform((str) => new Date(str)),
      z.date(),
      z.null(),
      z.undefined(),
    ])
    .optional()
    .nullable(),
});

// フロントエンド用のスキーマ（日付型を使用）
export const todoSchema = z.object({
  id: z.string().optional(),
  todoTitle: z
    .string()
    .min(1, "タイトルは必須です")
    .max(30, "タイトルは30文字以内で入力してください"),
  todoText: z
    .string()
    .max(100, "詳細は100文字以内で入力してください")
    .optional(),
  endTime: z.date().optional().nullable(),
});

export type TodoInput = z.infer<typeof todoSchema>;

// API用のスキーマを使用
export const createTodoApiSchema = todoApiSchema.omit({ id: true });
export const updateTodoApiSchema = todoApiSchema.required({ id: true });

// フロントエンド用のスキーマを使用
export const createTodoSchema = todoSchema.omit({ id: true });
export const updateTodoSchema = todoSchema.required({ id: true });

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
