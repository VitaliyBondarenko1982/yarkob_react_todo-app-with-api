import React, { Dispatch, SetStateAction } from 'react';
import { FilterType } from '../types/FilterType';
import cs from 'classnames';
import { getActiveTodos, getCompletedTodos } from '../utils/filterTodos';
import { useTodosContext } from './TodosContext';

interface Props {
  setFilterBy: Dispatch<SetStateAction<FilterType>>;
  filterBy: FilterType;
  onFocusHeaderInput: VoidFunction;
}

export const Footer: React.FC<Props> = ({
  setFilterBy,
  filterBy,
  onFocusHeaderInput,
}) => {
  const { todos, onDeleteTodo } = useTodosContext();

  const activeTodos = getActiveTodos(todos);
  const completedTodos = getCompletedTodos(todos);

  const clearCompletedHandler = () => {
    completedTodos.forEach(todo => {
      onDeleteTodo(todo.id, onFocusHeaderInput);
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cs('filter__link', {
            selected: filterBy === FilterType.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilterBy(FilterType.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cs('filter__link', {
            selected: filterBy === FilterType.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilterBy(FilterType.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cs('filter__link', {
            selected: filterBy === FilterType.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilterBy(FilterType.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedTodos.length}
        onClick={clearCompletedHandler}
      >
        Clear completed
      </button>
    </footer>
  );
};
