import { CHANGE_ACTIVE_PAGE } from './actions';

export const initialState = {
  activePage: 'Dashboard',
};

const reducer = (state, action) => {
  if (action.type === CHANGE_ACTIVE_PAGE) {
    return { ...state, activePage: action.payload };
  }

  return state;
};

export default reducer;
