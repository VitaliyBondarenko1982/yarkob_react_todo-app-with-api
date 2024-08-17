import { TodoItem } from './Todo';
import { Todo } from '../types/Todo';
import { FilterType } from '../types/FilterType';
import React from 'react';
import { filterTodos } from '../utils/filterTodos';
import { TempTodo } from './TempTodo';
import { useTodosContext } from './TodosContext';
export { filterTodos } from '../utils/filterTodos';

interface Props {
  filterBy: FilterType;
  onFocusHandlerInput: VoidFunction;
}

export const TodoList: React.FC<Props> = ({
  filterBy,
  onFocusHandlerInput,
}) => {
  const { todos, tempTodo } = useTodosContext();

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filterTodos(filterBy, todos).map((todo: Todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onFocusHandlerInput={onFocusHandlerInput}
        />
      ))}
      {!!tempTodo && <TempTodo title={tempTodo.title} />}
    </section>
  );
};
