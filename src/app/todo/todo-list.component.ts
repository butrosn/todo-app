import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { TodoStore } from './todo.store';
import { Todo } from './todo.model';
import { Filter } from './todo.store';

@Component({
  selector: 'app-todo-list',
  template: `
    <div class="flex justify-end mb-4">
      <button
        class="px-3 py-1 rounded-md bg-red-100 text-white enabled:bg-red-500 enabled:hover:bg-red-600 transition"
        (click)="confirmDeleteAll()"
        [disabled]="todoStore.todos().length === 0"
      >
        Delete all
      </button>
    </div>
    <div class="flex justify-center gap-10 my-6">
      @for (f of filters; track f.value) {
        <button
          class="px-3 py-1 rounded-md hover:cursor-pointer"
          [class.bg-blue-600]="todoStore.filter() === f.value"
          [class.text-white]="todoStore.filter() === f.value"
          (click)="todoStore.setFilter(f.value)"
        >
          {{ f.label }}
        </button>
      }
    </div>
    <!-- <div class="flex justify-center gap-10 my-6">
      <button
        class="px-3 py-1 rounded-md hover:cursor-pointer"
        [class.bg-blue-600]="todoStore.filter() === 'all'"
        [class.text-white]="todoStore.filter() === 'all'"
        (click)="todoStore.setFilter('all')"
      >
        All
      </button>
      <button
        class="px-3 py-1 rounded-md hover:cursor-pointer"
        [class.bg-blue-600]="todoStore.filter() === 'active'"
        [class.text-white]="todoStore.filter() === 'active'"
        (click)="todoStore.setFilter('active')"
      >
        Active
      </button>
      <button
        class="px-3 py-1 rounded-md hover:cursor-pointer"
        [class.bg-blue-600]="todoStore.filter() === 'completed'"
        [class.text-white]="todoStore.filter() === 'completed'"
        (click)="todoStore.setFilter('completed')"
      >
        Completed
      </button>
    </div> -->

    @if (todoStore.filteredTodos().length === 0) {
      <p class="text-center text-gray-400 mt-20">
        {{
          todoStore.filter() === 'all'
            ? 'No tasks. Add new task...'
            : todoStore.filter() === 'active'
              ? 'No active tasks.'
              : 'No completed tasks.'
        }}
      </p>
    }

    <ul class="space-y-2">
      @for (todo of todoStore.paginatedTodos(); track todo.id) {
        <li
          class="flex items-center justify-between p-3 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition"
        >
          <div class="flex w-full items-center gap-2">
            <input
              type="checkbox"
              [checked]="todo.completed"
              (change)="todoStore.toggle(todo.id)"
              [id]="'todo-' + todo.id"
            />

            <label
              class="w-full px-2"
              [for]="'todo-' + todo.id"
              [class.select-none]="todo.completed"
            >
              @if (editId === todo.id) {
                <input
                  #editInput
                  type="text"
                  class="border-b px-2 py-1 focus:border-b focus:outline-none w-full"
                  [value]="editTitle"
                  (input)="editTitle = $event.target.value"
                  (keydown.enter)="saveEdit()"
                  (keydown.escape)="cancelEdit()"
                />
              } @else {
                <span
                  (dblclick)="makeEdit(todo)"
                  [class.line-through]="todo.completed"
                  [class.text-gray-400]="todo.completed"
                  class="wrap-anywhere"
                  >{{ todo.title }}</span
                >
              }
            </label>
          </div>

          <div class="flex gap-4 ml-4">
            @if (editId !== todo.id && todoStore.filter() !== 'completed') {
              <button class="cursor-pointer text-blue-600" (click)="makeEdit(todo)">Edit</button>
            }

            <button
              class=" rounded-md bg-red-500 hover:bg-red-600 text-white p-2  transition duration-150 cursor-pointer"
              (click)="todoStore.remove(todo.id)"
            >
              Delete
            </button>
          </div>
        </li>
      }
    </ul>

    <div class="flex justify-center gap-4 my-8 items-center">
      <button
        (click)="todoStore.currentPage.set(todoStore.currentPage() - 1)"
        [disabled]="todoStore.currentPage() === 1"
        class="px-2 py-1 rounded-md bg-gray-200 disabled:opacity-50 disabled:cursor-no-drop hover:cursor-pointer"
      >
        Prev
      </button>

      <span>Page {{ todoStore.currentPage() }}</span>

      <button
        (click)="todoStore.currentPage.set(todoStore.currentPage() + 1)"
        [disabled]="
          todoStore.currentPage() * todoStore.ITEMS_PER_PAGE >= todoStore.filteredTodos().length
        "
        class="px-2 py-1 rounded-md bg-gray-200 disabled:opacity-50 disabled:cursor-no-drop hover:cursor-pointer"
      >
        Next
      </button>
    </div>
  `,
})
export class TodoList implements AfterViewChecked {
  editId: string | null = null;
  editTitle = '';

  @ViewChild('editInput') editInput!: ElementRef<HTMLInputElement>;

  constructor(public todoStore: TodoStore) {}

  filters: { label: string; value: Filter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Completed', value: 'completed' },
  ];

  makeEdit(todo: Todo) {
    this.editId = todo.id;
    this.editTitle = todo.title;
  }

  saveEdit() {
    if (!this.editId) return;

    const title = this.editTitle.trim();

    if (!title) return;

    this.todoStore.updateTitle(this.editId, title);
    this.cancelEdit();
  }

  cancelEdit() {
    this.editId = null;
    this.editTitle = '';
  }

  confirmDeleteAll() {
    if (confirm('Are you sure you want to delete all tasks?')) {
      this.todoStore.clearAll();
    }
  }

  ngAfterViewChecked() {
    if (this.editInput) {
      this.editInput.nativeElement.focus();
    }
  }
}
