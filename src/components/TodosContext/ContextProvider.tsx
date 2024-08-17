import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { Error } from '../../App';
import { deleteTodo, getTodos, updateTodo } from '../../api/todos';
import { noop } from '../../utils/noop';

export interface ITodosContext {
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  error: Error | null;
  processingTodos: Todo['id'][];
  tempTodo: Todo | null;
  setTempTodo: Dispatch<SetStateAction<Todo | null>>;
  onDeleteTodo: (id: number, successCb: VoidFunction) => void;
  onUpdateTodo: (todo: Todo, successCb?: VoidFunction) => void;
  loadTodos: VoidFunction;
  handleError: (error: Error) => void;
}

export const TodosContext = React.createContext<ITodosContext>({
  todos: [],
  setTodos: noop,
  error: null,
  processingTodos: [],
  tempTodo: null,
  setTempTodo: noop,
  onDeleteTodo: noop,
  onUpdateTodo: noop,
  loadTodos: noop,
  handleError: noop,
});

interface Props {
  children: ReactNode;
}

export const ContextProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [processingTodos, setProcessingTodos] = useState<Todo['id'][]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const handleError = useCallback((err: Error) => {
    setError(err);

    window.setTimeout(() => {
      setError(null);
    }, 3000);
  }, []);

  const updateProcessingTodos = useCallback(
    (id: number) => setProcessingTodos(prev => [...prev, id]),
    [],
  );
  const filterProcessingTodos = useCallback((id: number) => {
    setProcessingTodos(prev => prev.filter(prevId => prevId !== id));
  }, []);

  const onDeleteTodo = useCallback(
    (todoId: number, successCb: VoidFunction) => {
      updateProcessingTodos(todoId);
      deleteTodo(todoId)
        .then(() => {
          setTodos(prevTodos => prevTodos.filter(t => t.id !== todoId));
          successCb();
        })
        .catch(() => handleError(Error.DeleteTodo))
        .finally(() => filterProcessingTodos(todoId));
    },
    [handleError, filterProcessingTodos, updateProcessingTodos],
  );

  const onUpdateTodo = useCallback(
    (todo: Todo, successCb?: VoidFunction) => {
      updateProcessingTodos(todo.id);

      updateTodo(todo)
        .then(updatedTodo => {
          setTodos(prevTodos =>
            prevTodos.map(t => (t.id === todo.id ? updatedTodo : t)),
          );

          successCb?.();
        })
        .catch(() => handleError(Error.UpdateTodo))
        .finally(() => filterProcessingTodos(todo.id));
    },
    [filterProcessingTodos, handleError, updateProcessingTodos],
  );

  const loadTodos = useCallback(() => {
    getTodos()
      .then(data => setTodos(data))
      .catch(() => handleError(Error.LoadTodos));
  }, [handleError]);

  const value = useMemo(
    () => ({
      todos,
      setTodos,
      error,
      processingTodos,
      tempTodo,
      setTempTodo,
      onDeleteTodo,
      onUpdateTodo,
      loadTodos,
      handleError,
    }),
    [
      todos,
      error,
      processingTodos,
      tempTodo,
      onDeleteTodo,
      onUpdateTodo,
      loadTodos,
      handleError,
    ],
  );

  return (
    <TodosContext.Provider value={value}>{children}</TodosContext.Provider>
  );
};
