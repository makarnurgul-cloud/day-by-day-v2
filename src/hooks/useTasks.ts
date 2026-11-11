"use client";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Task, today } from "@/lib/types";
import { useAuth } from "@/components/AuthProvider";

export function useTasks(from: string, to: string) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase.from("tasks").select("*")
      .gte("day", from).lte("day", to).order("created_at");
    if (error) setError(error.message);
    else setTasks(data as Task[] || []);
    setLoading(false);
  }, [user, from, to]);

  useEffect(() => {
    load();
    const ch = supabase.channel("tasks-" + Math.random())
      .on("postgres_changes", { event: "*", schema: "public", table: "tasks" }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [load]);

  const add = async (title: string, roomId: string | null, day = today()) => {
    setError(null);
    const { error } = await supabase.from("tasks").insert({ title: title.trim(), room_id: roomId, day });
    if (error) setError(error.message);
    else load();
  };

  const toggle = async (t: Task) => {
    setTasks((p) => p.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)));
    const { error } = await supabase.from("tasks").update({ done: !t.done }).eq("id", t.id);
    if (error) { setError(error.message); load(); }
  };

  const remove = async (id: string) => {
    setTasks((p) => p.filter((x) => x.id !== id));
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) { setError(error.message); load(); }
  };

  return { tasks, loading, error, add, toggle, remove };
}