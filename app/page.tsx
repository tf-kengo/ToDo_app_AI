import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { TodoTable } from "@/components/TodoTable";
import { getSession } from "@/lib/session";
import Header from "@/components/Header";

export default async function HomePage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <Header userName={session.userName} />

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-hidden">
        <div className="h-full flex flex-col space-y-6">
          <div className="flex items-center justify-between flex-shrink-0">
            <h1 className="text-3xl font-bold">Todo リスト</h1>
            <Link href="/?create=true">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                新規作成
              </Button>
            </Link>
          </div>

          <div className="flex-1 overflow-hidden">
            <Suspense fallback={<div>読み込み中...</div>}>
              <TodoTable />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
