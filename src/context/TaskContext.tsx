
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

export type Category = {
  id: string;
  name: string;
  color: string;
  icon: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: string | null;
  completed: boolean;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
};

type TaskContextType = {
  tasks: Task[];
  categories: Category[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  getCategory: (id: string) => Category | undefined;
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

// Default categories
const defaultCategories: Category[] = [
  { id: '1', name: 'Haul', color: '#ff7b5c', icon: 'shopping-bag' },
  { id: '2', name: 'Vibes', color: '#7b61ff', icon: 'music' },
  { id: '3', name: 'Study', color: '#41b883', icon: 'book' },
  { id: '4', name: 'Fun', color: '#ff61a6', icon: 'party-popper' },
];

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load tasks and categories from localStorage when user changes
  useEffect(() => {
    if (user) {
      const storedTasks = localStorage.getItem(`procrastinator_tasks_${user.username}`);
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }

      const storedCategories = localStorage.getItem(`procrastinator_categories_${user.username}`);
      if (storedCategories) {
        setCategories(JSON.parse(storedCategories));
      } else {
        // If no categories exist for this user, set the default ones
        localStorage.setItem(
          `procrastinator_categories_${user.username}`,
          JSON.stringify(defaultCategories)
        );
        setCategories(defaultCategories);
      }
    } else {
      // Reset state when user logs out
      setTasks([]);
      setCategories(defaultCategories);
    }
  }, [user]);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`procrastinator_tasks_${user.username}`, JSON.stringify(tasks));
    }
  }, [tasks, user]);

  // Save categories to localStorage whenever they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`procrastinator_categories_${user.username}`, JSON.stringify(categories));
    }
  }, [categories, user]);

  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
    toast({
      title: "Task added",
      description: "Your task has been added successfully"
    });
  };

  const updateTask = (id: string, updatedFields: Partial<Task>) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              ...updatedFields,
              updatedAt: new Date().toISOString(),
            }
          : task
      )
    );
    toast({
      title: "Task updated",
      description: "Your task has been updated successfully"
    });
  };

  const deleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    toast({
      title: "Task deleted",
      description: "Your task has been deleted"
    });
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
              updatedAt: new Date().toISOString(),
            }
          : task
      )
    );
    
    // Find the task to check its new completed state
    const task = tasks.find(t => t.id === id);
    if (task) {
      toast({
        title: task.completed ? "Task uncompleted" : "Task completed",
        description: task.completed 
          ? "Your task has been marked as not completed" 
          : "Your task has been marked as completed"
      });
    }
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
    };

    setCategories((prevCategories) => [...prevCategories, newCategory]);
    toast({
      title: "Category added",
      description: "Your category has been added successfully"
    });
  };

  const updateCategory = (id: string, updatedFields: Partial<Category>) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.id === id
          ? {
              ...category,
              ...updatedFields,
            }
          : category
      )
    );
    toast({
      title: "Category updated",
      description: "Your category has been updated successfully"
    });
  };

  const deleteCategory = (id: string) => {
    // Check if there are tasks with this category
    const tasksWithCategory = tasks.filter((task) => task.categoryId === id);
    if (tasksWithCategory.length > 0) {
      toast({
        title: "Cannot delete category",
        description: "There are tasks assigned to this category",
        variant: "destructive"
      });
      return;
    }

    setCategories((prevCategories) => prevCategories.filter((category) => category.id !== id));
    toast({
      title: "Category deleted",
      description: "Your category has been deleted successfully"
    });
  };

  const getCategory = (id: string) => {
    return categories.find((category) => category.id === id);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        categories,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
        addCategory,
        updateCategory,
        deleteCategory,
        getCategory,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
