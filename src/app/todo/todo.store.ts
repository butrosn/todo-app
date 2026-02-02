import { computed, effect, Injectable, signal } from '@angular/core';
import { Todo } from './todo.model';

const STORAGE_KEY = 'todos';
const REMAINING_STORAGE_TIME = 10 * 1000; // 10 sekundi
export type Filter = 'all' | 'active' | 'completed';

@Injectable({
  providedIn: 'root',
})
export class TodoStore {
  todos = signal<Todo[]>([]);
  filter = signal<Filter>('all');

  currentPage = signal(1);
  readonly ITEMS_PER_PAGE = 5;

  filteredTodos = computed(() => {
    const filter = this.filter();
    const todos = this.todos();

    if (filter === 'active') return todos.filter((t) => !t.completed);
    if (filter === 'completed') return todos.filter((t) => t.completed);

    return todos;
  });

  paginatedTodos = computed(() => {
    const start = (this.currentPage() - 1) * this.ITEMS_PER_PAGE;
    const end = start + this.ITEMS_PER_PAGE;

    return this.filteredTodos().slice(start, end);
  });

  constructor() {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      try {
        const parsed = JSON.parse(stored) as {
          data: Todo[];
          expiresAt: number;
        };

        if (Date.now() < parsed.expiresAt) {
          this.todos.set(parsed.data);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (error) {
        localStorage.removeItem(STORAGE_KEY);
        console.error('Failed to read data from localStorage', error);
      }
    }

    effect(() => {
      const payload = {
        data: this.todos(),
        expiresAt: Date.now() + REMAINING_STORAGE_TIME,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    });
  }

  add(title: string) {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title,
      completed: false,
    };

    this.todos.update((todos) => [...todos, newTodo]);
  }

  remove(id: string) {
    this.todos.update((todos) => todos.filter((todo) => todo.id !== id));
  }

  toggle(id: string) {
    this.todos.update((todos) =>
      todos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              completed: !todo.completed,
            }
          : todo,
      ),
    );
  }

  setFilter(filter: Filter) {
    this.filter.set(filter);
    this.currentPage.set(1);
  }

  updateTitle(id: string, title: string) {
    this.todos.update((todos) => todos.map((todo) => (todo.id === id ? { ...todo, title } : todo)));
  }

  clearAll() {
    this.todos.set([]);
    this.currentPage.set(1);
  }
}
