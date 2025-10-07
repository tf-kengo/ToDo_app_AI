"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  createTodoSchema,
  updateTodoSchema,
  type CreateTodoInput,
  type UpdateTodoInput,
} from "@/lib/validations";
import { cn } from "@/lib/utils";

interface Todo {
  id: string;
  todoTitle: string;
  todoText: string;
  endTime: Date | null;
}

interface TodoFormProps {
  todo?: Todo;
  mode: "create" | "edit";
  open: boolean;
  onClose: () => void;
}

export function TodoForm({ todo, mode, open, onClose }: TodoFormProps) {
  const router = useRouter();
  const [showDatePicker, setShowDatePicker] = useState(!!todo?.endTime);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const schema = mode === "create" ? createTodoSchema : updateTodoSchema;

  const defaultValues = {
    ...(mode === "edit" && todo?.id ? { id: todo.id } : {}),
    todoTitle: todo?.todoTitle || "",
    todoText: todo?.todoText || "",
    endTime: todo?.endTime ? new Date(todo.endTime) : undefined,
  };

  const form = useForm<CreateTodoInput | UpdateTodoInput>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // todoが変更されたときにフォームをリセット
  useEffect(() => {
    if (todo) {
      const resetValues = {
        ...(mode === "edit" && todo.id ? { id: todo.id } : {}),
        todoTitle: todo.todoTitle || "",
        todoText: todo.todoText || "",
        endTime: todo.endTime ? new Date(todo.endTime) : undefined,
      };
      form.reset(resetValues);
      setShowDatePicker(!!todo.endTime);
    }
  }, [todo, form, mode]);

  const onSubmit = async (data: CreateTodoInput | UpdateTodoInput) => {
    setIsSubmitting(true);

    try {
      const url = mode === "create" ? "/api/todos" : `/api/todos/${todo?.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const payload = {
        ...data,
        endTime:
          showDatePicker && data.endTime
            ? new Date(
                data.endTime.getFullYear(),
                data.endTime.getMonth(),
                data.endTime.getDate(),
                12,
                0,
                0
              ).toISOString()
            : null,
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        onClose();
        router.refresh();
        // カスタムイベントを発行してTodoTableに更新を通知
        window.dispatchEvent(new CustomEvent("todoUpdated"));
      } else {
        const error = await response.json();
        console.error("TodoForm submit error:", error);
      }
    } catch (error) {
      console.error("TodoForm submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "新しいTodoを作成" : "Todoを編集"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Todoの詳細を入力してください。終了時間と詳細は任意です。"
              : "Todoの詳細を編集してください。"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="todoTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>タイトル *</FormLabel>
                  <FormControl>
                    <Input placeholder="Todoのタイトルを入力" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="todoText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>詳細</FormLabel>
                  <FormControl>
                    <Textarea placeholder="詳細な説明（任意）" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-date"
                  checked={showDatePicker}
                  onCheckedChange={(checked) => {
                    setShowDatePicker(checked);
                    if (!checked) {
                      form.setValue("endTime", undefined);
                    }
                  }}
                />
                <FormLabel htmlFor="show-date">終了時間を設定</FormLabel>
              </div>

              {showDatePicker && (
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>終了時間</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "yyyy年MM月dd日", {
                                  locale: ja,
                                })
                              ) : (
                                <span>日付を選択</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value || undefined}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                キャンセル
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "保存中..."
                  : mode === "create"
                  ? "作成"
                  : "更新"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
