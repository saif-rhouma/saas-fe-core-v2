import { useContext, useReducer, createContext } from 'react';

import { CHANGE_ACTIVE_PAGE } from './actions';
import reducer, { initialState } from './reducer';

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const AppContext = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const changeActivePage = (activePage) => {
    dispatch({ type: CHANGE_ACTIVE_PAGE, payload: activePage });
  };

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <GlobalContext.Provider value={{ ...state, changeActivePage }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default AppContext;
