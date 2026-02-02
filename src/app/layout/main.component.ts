import { Component } from '@angular/core';
import { TodoForm } from '../todo/todo-form.component';
import { TodoList } from '../todo/todo-list.component';

@Component({
  selector: 'app-main',
  imports: [TodoForm, TodoList],
  template: `
    <div class="max-w-4xl mx-auto px-4">
      <app-todo-form />
      <h2 class="text-2xl font-semibold mt-10 my-4">Your tasks:</h2>
      <app-todo-list />
    </div>
  `,
})
export class Main {}
