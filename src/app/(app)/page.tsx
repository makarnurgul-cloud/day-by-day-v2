"use client";
import AddTask from "@/components/AddTask";
import MoodPicker from "@/components/MoodPicker";
import ProgressCard from "@/components/ProgressCard";
import TaskList from "@/components/TaskList";
import { useTasks } from "@/hooks/useTasks";
import { today } from "@/lib/types";
import { errBox } from "@/lib/ui";

export default function Home() {
  const name = "Nurgul";
  const d = today();
  const { tasks, error, add, toggle, remove } = useTasks(d, d);
  const done = tasks.filter((t) => t.done).length;

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <header>
        <h1 className="text-2xl font-bold md:text-3xl">Сәлем, {name}! ♡</h1>
        <p className="text-violet-600">Бүгін — өзің үшін тамаша күн.</p>
      </header>

      <div className="rounded-3xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white p-6 shadow-lg">
        <p className="text-sm opacity-80">Жеке даму күнделігі</p>
        <p className="text-3xl font-bold md:text-4xl">day by day ♡</p>
        <p className="mt-1 opacity-90">Кішкентай қадамдар — үлкен нәтижелер.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <ProgressCard done={done} total={tasks.length} />
        <MoodPicker />
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Бүгінгі тапсырмалар</h2>
       <TaskList tasks={tasks} loading={loading} error={error} onToggle={toggle} onRemove={remove} />
        <AddTask onAdd={(title, roomId) => add(title, roomId, d)} />
        {error && <p className={errBox}>{error}</p>}
      </section>
    </div>
  );
}
