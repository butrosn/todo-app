import { Component, signal } from '@angular/core';
import { TodoStore } from './todo.store';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo-form',
  imports: [FormsModule],
  template: `
    <form class="flex gap-5 mt-10" (ngSubmit)="addTodo()">
      <input
        class="flex-1 border-b-2 border-amber-400 p-2 focus:outline-amber-400"
        type="text"
        autofocus
        placeholder="Add new task..."
        [value]="title()"
        (input)="title.set($event.target.value)"
      />

      <button
        type="submit"
        class="rounded-md hover:cursor-pointer transition duration-200 hover:bg-sky-900  py-2 px-6 text-white bg-sky-600"
      >
        Add
      </button>
    </form>
  `,
})
export class TodoForm {
  title = signal('');

  constructor(private todoStore: TodoStore) {}

  addTodo() {
    const value = this.title().trim();

    if (!value) return;

    this.todoStore.add(value);
    this.title.set('');
  }
}
