import cs from 'classnames';
import React, {
  ChangeEvent,
  FormEvent,
  MutableRefObject,
  useState,
} from 'react';
import { addTodo, USER_ID } from '../api/todos';
import { Error } from '../App';
import { filterTodos, getCompletedTodos } from '../utils/filterTodos';
import { FilterType } from '../types/FilterType';
import { useTodosContext } from './TodosContext';

interface Props {
  inputRef: MutableRefObject<HTMLInputElement | null>;
  onFocusHeaderInput: VoidFunction;
}

export const Header: React.FC<Props> = ({ onFocusHeaderInput, inputRef }) => {
  const [query, setQuery] = useState('');
  const { todos, handleError, setTempTodo, setTodos, tempTodo, onUpdateTodo } =
    useTodosContext();
  const completedTodos = getCompletedTodos(todos);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const toggleAllHandler = () => {
    const activeTodos = filterTodos(FilterType.Active, todos);
    const todosForUpdate = activeTodos.length ? activeTodos : todos;

    todosForUpdate.forEach(todo =>
      onUpdateTodo({ ...todo, completed: !todo.completed }),
    );
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!query.trim()) {
      handleError(Error.EmptyTitle);

      return;
    }

    const newTodo = {
      title: query.trim(),
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({ ...newTodo, id: 0 });

    addTodo(newTodo)
      .then(resTodo => {
        setQuery('');
        setTodos([...todos, resTodo]);
      })
      .catch(() => handleError(Error.AddTodo))
      .finally(() => {
        setTempTodo(null);
        setTimeout(onFocusHeaderInput, 0);
      });
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={cs('todoapp__toggle-all', {
            active: completedTodos.length === todos.length,
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAllHandler}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={handleChange}
          disabled={!!tempTodo}
          ref={inputRef}
          autoFocus
        />
      </form>
    </header>
  );
};
