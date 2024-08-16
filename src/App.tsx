/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { filterTodos, TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { FilterType } from './types/FilterType';
import cs from 'classnames';
import { TodosContext } from './utils/ContextProvider';
import { Header } from './components/Header';

export enum Error {
  LoadTodos = 'Unable to load todos',
  EmptyTitle = 'Title should not be empty',
  AddTodo = 'Unable to add a todo',
  DeleteTodo = 'Unable to delete a todo',
  UpdateTodo = 'Unable to update a todo',
}

export const App: React.FC = () => {
  const { todos, setTodos, setIsToggled, setTempTodo, error, setError } =
    useContext(TodosContext);
  const [filterBy, setFilterBy] = useState<FilterType>(FilterType.All);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onFocusHeaderInput = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    getTodos()
      .then(data => setTodos(data))
      .catch(() => {
        setError(Error.LoadTodos);

        window.setTimeout(() => {
          setError(null);
        }, 3000);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (filterTodos(FilterType.Completed, todos).length === todos.length) {
      setIsToggled(true);
    } else {
      setIsToggled(false);
    }
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        {/* Add header to another component */}
        <Header
          setTempTodo={setTempTodo}
          inputRef={inputRef}
          onFocusHeaderInput={onFocusHeaderInput}
        />

        <TodoList
          filterBy={filterBy}
          onFocusHandlerInput={onFocusHeaderInput}
        />

        {/* Hide the footer if there are no todos */}
        {!!todos.length && (
          <Footer
            setFilterBy={setFilterBy}
            filterBy={filterBy}
            onFocusHeaderInput={onFocusHeaderInput}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      {/* Add errors to another components */}
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
        {/* show only one message at a time */}
        <div>
          {error}
          <br />
        </div>
      </div>
    </div>
  );
};
