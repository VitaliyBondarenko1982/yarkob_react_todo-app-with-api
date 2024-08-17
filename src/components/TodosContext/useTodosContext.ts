import { useContext } from 'react';
import { TodosContext, ITodosContext } from './ContextProvider';

export const useTodosContext = () => useContext<ITodosContext>(TodosContext);
