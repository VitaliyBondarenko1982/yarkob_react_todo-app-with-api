import React, { ChangeEvent, FormEvent, KeyboardEvent, useState } from 'react';
import cs from 'classnames';
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
import { Error } from '../App';
import { updateTodo } from '../api/todos';
import { useTodosContext } from './TodosContext';

interface Props {
  todo: Todo;
  onFocusHandlerInput: VoidFunction;
}

export const TodoItem: React.FC<Props> = ({ todo, onFocusHandlerInput }) => {
  const { completed, title, id } = todo;

  const { setTodos, setError, setProcessingTodos, processingTodos } =
    useTodosContext();
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(title);

  const deleteTodo = (todoId: number) => {
    setProcessingTodos(prevProcessingTodos => [...prevProcessingTodos, id]);

    client
      .delete(`/todos/${todoId}`)
      .then(() => {
        setTodos(prevTodos =>
          prevTodos.filter(checkTodo => checkTodo.id !== todoId),
        );
        setIsEditing(false);
        onFocusHandlerInput();
      })
      .catch(() => {
        setError(Error.DeleteTodo);

        window.setTimeout(() => {
          setError(null);
        }, 3000);
      })
      .finally(() =>
        setProcessingTodos(prev => prev.filter(prevId => prevId !== id)),
      );
  };

  const handleUpdateTodo = (todoForUpdate: Todo) => {
    setProcessingTodos([...processingTodos, todoForUpdate.id]);

    return updateTodo(todoForUpdate)
      .then(updatedTodo => {
        setTodos(prevTodos =>
          prevTodos.map(t => (t.id === todoForUpdate.id ? updatedTodo : t)),
        );

        setIsEditing(false);
        onFocusHandlerInput();
      })
      .catch(() => {
        setError(Error.UpdateTodo);

        window.setTimeout(() => {
          setError(null);
        }, 3000);
      })
      .finally(() =>
        setProcessingTodos(prev => prev.filter(procId => procId !== id)),
      );
  };

  const updateTitle = () => {
    const trimmedTitle = updatedTitle.trim();

    if (trimmedTitle === title) {
      setIsEditing(false);

      return;
    }

    if (!trimmedTitle) {
      deleteTodo(id);

      return;
    }

    handleUpdateTodo({ ...todo, title: trimmedTitle });
  };

  const doubleClickHandler = () => {
    setIsEditing(true);
  };

  const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setUpdatedTitle(event.target.value);
  };

  const blurHandler = () => {
    setIsEditing(false);
    updateTitle();
  };

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    updateTitle();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
      setUpdatedTitle(todo.title);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cs('todo', {
        completed,
      })}
      onDoubleClick={doubleClickHandler}
    >
      <label className="todo__status-label">
        {/* This comment is made because it fixes
          "A form label must be associated with a control" error */}
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleUpdateTodo({ ...todo, completed: !completed })}
        />
      </label>

      {isEditing ? (
        <form onBlur={blurHandler} onSubmit={submitHandler}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={updatedTitle}
            autoFocus={true}
            onChange={changeHandler}
            onKeyDown={handleKeyDown}
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo(id)}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={cs('modal overlay', {
          'is-active': processingTodos.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
