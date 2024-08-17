/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { FilterType } from './types/FilterType';
import cs from 'classnames';
import { Header } from './components/Header';
import { useTodosContext } from './components/TodosContext';

export enum Error {
  LoadTodos = 'Unable to load todos',
  EmptyTitle = 'Title should not be empty',
  AddTodo = 'Unable to add a todo',
  DeleteTodo = 'Unable to delete a todo',
  UpdateTodo = 'Unable to update a todo',
}

export const App: React.FC = () => {
  const { todos, error, loadTodos } = useTodosContext();
  const [filterBy, setFilterBy] = useState<FilterType>(FilterType.All);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onFocusHeaderInput = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header inputRef={inputRef} onFocusHeaderInput={onFocusHeaderInput} />

        <TodoList
          filterBy={filterBy}
          onFocusHandlerInput={onFocusHeaderInput}
        />

        {!!todos.length && (
          <Footer
            setFilterBy={setFilterBy}
            filterBy={filterBy}
            onFocusHeaderInput={onFocusHeaderInput}
          />
        )}
      </div>
      <div
        data-cy="ErrorNotification"
        className={cs(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !error,
          },
        )}
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        <div>
          {error}
          <br />
        </div>
      </div>
    </div>
  );
};
