import React, { ChangeEvent, FormEvent, KeyboardEvent, useState } from 'react';
import cs from 'classnames';
import { Todo } from '../types/Todo';
import { useTodosContext } from './TodosContext';

interface Props {
  todo: Todo;
  onFocusHandlerInput: VoidFunction;
}

export const TodoItem: React.FC<Props> = ({ todo, onFocusHandlerInput }) => {
  const { completed, title, id } = todo;

  const { processingTodos, onDeleteTodo, onUpdateTodo } = useTodosContext();
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(title);

  const successCallback = () => {
    setIsEditing(false);
    onFocusHandlerInput();
  };

  const handleDeleteTodo = () => onDeleteTodo(id, successCallback);
  const toggleTodo = () =>
    onUpdateTodo({ ...todo, completed: !completed }, successCallback);

  const updateTitle = () => {
    const trimmedTitle = updatedTitle.trim();

    if (trimmedTitle === title) {
      setIsEditing(false);

      return;
    }

    if (!trimmedTitle) {
      handleDeleteTodo();

      return;
    }

    onUpdateTodo({ ...todo, title: trimmedTitle }, successCallback);
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
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={toggleTodo}
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

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDeleteTodo}
          >
            ×
          </button>
        </>
      )}

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
