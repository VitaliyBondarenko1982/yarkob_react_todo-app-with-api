import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useMemo,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { Error } from '../../App';

export interface ITodosContext {
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  error: Error | null;
  setError: Dispatch<SetStateAction<Error | null>>;
  processingTodos: Todo['id'][];
  setProcessingTodos: Dispatch<SetStateAction<Todo['id'][]>>;
  tempTodo: Todo | null;
  setTempTodo: Dispatch<SetStateAction<Todo | null>>;
}

export const TodosContext = React.createContext<ITodosContext>({
  todos: [],
  setTodos: () => {},
  error: null,
  setError: () => {},
  processingTodos: [],
  setProcessingTodos: () => {},
  tempTodo: null,
  setTempTodo: () => {},
});

interface Props {
  children: ReactNode;
}

export const ContextProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [processingTodos, setProcessingTodos] = useState<Todo['id'][]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const value = useMemo(
    () => ({
      todos,
      setTodos,
      error,
      setError,
      processingTodos,
      setProcessingTodos,
      tempTodo,
      setTempTodo,
    }),
    [todos, error, processingTodos, tempTodo],
  );

  return (
    <TodosContext.Provider value={value}>{children}</TodosContext.Provider>
  );
};
