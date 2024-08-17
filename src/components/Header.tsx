import cs from 'classnames';
import React, {
  ChangeEvent,
  Dispatch,
  FormEvent,
  MutableRefObject,
  SetStateAction,
  useState,
} from 'react';
import { updateTodo, USER_ID } from '../api/todos';
import { client } from '../utils/fetchClient';
import { Error } from '../App';
import { filterTodos } from '../utils/filterTodos';
import { FilterType } from '../types/FilterType';
import { Todo } from '../types/Todo';
import { useTodosContext } from './TodosContext';

interface Props {
  setTempTodo: Dispatch<SetStateAction<Todo | null>>;
  inputRef: MutableRefObject<HTMLInputElement | null>;
  onFocusHeaderInput: VoidFunction;
}

export const Header: React.FC<Props> = ({
  setTempTodo,
  onFocusHeaderInput,
  inputRef,
}) => {
  const [query, setQuery] = useState('');
  const {
    todos,
    isToggled,
    setError,
    setTodos,
    setIsToggled,
    setProcessingTodos,
    tempTodo,
  } = useTodosContext();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const toggleAllHandler = () => {
    setIsToggled(!isToggled);

    const activeTodos = filterTodos(FilterType.Active, todos);
    const todosForUpdate = activeTodos.length ? activeTodos : todos;

    todosForUpdate.forEach(todo => {
      updateTodo({ ...todo, completed: !todo.completed })
        .then(updatedTodo => {
          setTodos(prevTodos =>
            prevTodos.map(t => (t.id === todo.id ? updatedTodo : t)),
          );
        })
        .catch(() => {
          setError(Error.UpdateTodo);

          window.setTimeout(() => {
            setError(null);
          }, 3000);
        })
        .finally(() =>
          setProcessingTodos(prev => prev.filter(id => id !== todo.id)),
        );
    });
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!query.trim()) {
      setError(Error.EmptyTitle);

      window.setTimeout(() => {
        setError(null);
      }, 3000);

      return;
    }

    const newTodo = {
      title: query.trim(),
      userId: USER_ID,
      completed: false,
    };

    let newId = 0;

    if (!todos.length) {
      newId = 1;
    } else {
      const previousId = [...todos].sort((a, b) => b.id - a.id)[0].id;

      newId = previousId ? previousId + 1 : 1;
    }

    setTempTodo({ ...newTodo, id: 0 });

    client
      .post('/todos', newTodo)
      .then(() => {
        setQuery('');
        setTodos([...todos, { ...newTodo, id: newId }]);
      })
      .catch(() => {
        setError(Error.AddTodo);

        window.setTimeout(() => {
          setError(null);
        }, 3000);
      })
      .finally(() => {
        setTempTodo(null);
        setTimeout(onFocusHeaderInput, 0);
      });
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {!!todos.length && (
        <button
          type="button"
          className={cs('todoapp__toggle-all', {
            active: isToggled,
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAllHandler}
        />
      )}

      {/* Add a todo on form submit */}
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
