import { useState } from "react";

const STORAGE_KEY = "taskCategories";
const DEFAULT_CATEGORIES = ["Work", "Study", "Personal"];

function loadCategories(): string[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

function saveCategories(categories: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
}

export function useTaskCategories() {
  const [categories, setCategoriesState] = useState<string[]>(loadCategories);

  const setCategories = (next: string[] | ((prev: string[]) => string[])) => {
    setCategoriesState((prev) => {
      const updated = typeof next === "function" ? next(prev) : next;
      saveCategories(updated);
      return updated;
    });
  };

  return { categories, setCategories };
}
