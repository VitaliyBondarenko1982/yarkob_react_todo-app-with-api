import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 836;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (newTodo: Omit<Todo, 'id'>) =>
  client.post<Todo>('/todos', newTodo);

export const updateTodo = (todo: Todo) => {
  return client.patch<Todo>(`/todos/${todo.id}`, todo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
// https://mate.academy/students-api
// Add more methods here
