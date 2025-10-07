import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { TodoTable } from "@/components/TodoTable";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Todo リスト</h1>
        <Link href="/?create=true">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            新規作成
          </Button>
        </Link>
      </div>

      <Suspense fallback={<div>読み込み中...</div>}>
        <TodoTable />
      </Suspense>
    </div>
  );
}
