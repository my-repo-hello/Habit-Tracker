import { useState, useEffect, useCallback } from 'react';

type DayStatus = 'editable' | 'locked' | 'disabled';

export type Task = {
  id: string;
  title: string;
  order: number;
  color: string;
  created_at: string;
};

export type TaskCompletion = {
  id: string;
  task_id: string;
  date: string;
  completed: boolean;
  created_at: string;
};

export function useTasks(year: number, month: number) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completions, setCompletions] = useState<TaskCompletion[]>([]);
  const [loading, setLoading] = useState(true);

  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }, []);

  const getDayStatus = useCallback((dateStr: string): DayStatus => {
    const date = new Date(dateStr);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (targetDate.getTime() === today.getTime()) return 'editable';
    if (targetDate.getTime() <= yesterday.getTime()) return 'locked';
    return 'disabled';
  }, []);

  const fetchTasks = useCallback(async () => {
    try {
      const response = await fetch('/api/tasks', {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }, []);

  const fetchCompletions = useCallback(async () => {
    const firstDay = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const lastDay = `${year}-${String(month + 1).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`;

    try {
      const response = await fetch(`/api/completions?start=${firstDay}&end=${lastDay}`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setCompletions(data);
      }
    } catch (error) {
      console.error('Error fetching completions:', error);
    }
  }, [year, month]);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchTasks(), fetchCompletions()]).finally(() => setLoading(false));
  }, [fetchTasks, fetchCompletions]);

  const addTask = async (title: string) => {
    const maxOrder = tasks.length > 0 ? Math.max(...tasks.map(t => t.order)) : 0;
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6'];
    const color = colors[tasks.length % colors.length];

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ title, order: maxOrder + 1, color })
      });
      if (response.ok) {
        const data = await response.json();
        setTasks(prev => [...prev, data]);
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (response.ok) {
        setTasks(prev => prev.filter(t => t.id !== id));
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const toggleCompletion = async (taskId: string, date: string) => {
    const status = getDayStatus(date);
    if (status !== 'editable') return;

    const existingIndex = completions.findIndex(c => c.task_id === taskId && c.date === date);
    let originalCompletions = [...completions];

    if (existingIndex >= 0) {
      const newVal = !completions[existingIndex].completed;
      setCompletions(prev => prev.map((c, i) => i === existingIndex ? { ...c, completed: newVal } : c));
    } else {
      setCompletions(prev => [...prev, { id: 'temp', task_id: taskId, date, completed: true, created_at: new Date().toISOString() }]);
    }

    try {
      const response = await fetch('/api/completions/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ task_id: taskId, date })
      });

      if (response.ok) {
        const data = await response.json();
        setCompletions(prev => {
          const index = prev.findIndex(c => c.task_id === taskId && c.date === date);
          if (index >= 0) {
            const next = [...prev];
            next[index] = data;
            return next;
          }
          return [...prev, data];
        });
      } else {
        setCompletions(originalCompletions);
      }
    } catch (error) {
      console.error('Error toggling completion:', error);
      setCompletions(originalCompletions);
    }
  };

  const isCompleted = (taskId: string, date: string) => {
    return completions.find(c => c.task_id === taskId && c.date === date)?.completed ?? false;
  };

  return { tasks, completions, loading, addTask, deleteTask, toggleCompletion, isCompleted, getDayStatus };
}
