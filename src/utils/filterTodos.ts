import { FilterType } from '../types/FilterType';
import { Todo } from '../types/Todo';

export const getActiveTodos = (todos: Todo[]) =>
  todos.filter(todo => !todo.completed);

export const getCompletedTodos = (todos: Todo[]) =>
  todos.filter(todo => todo.completed);

export const filterTodos = (todoState: FilterType, todos: Todo[]) => {
  if (todoState === FilterType.Active) {
    return getActiveTodos(todos);
  }

  if (todoState === FilterType.Completed) {
    return getCompletedTodos(todos);
  }

  return todos;
};
