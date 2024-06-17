import {
  REDIRECT_FAILURE,
  REDIRECT_REQUEST,
  REDIRECT_SUCCESS,
  CLEAR_REDIRECT,
} from "./types";
const INITIAL_STATE = {
  redirectTo: null,
  isRedirecting: false,
  error: null,
};
function redirectReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case REDIRECT_REQUEST:
      return {
        ...state,
        isRedirecting: true,
      };
    case REDIRECT_SUCCESS:
      return {
        ...state,
        redirectTo: action.payload,
      };
    case REDIRECT_FAILURE:
      return {
        ...state,
        isRedirecting: false,
        error: action.payload,
      };
    case CLEAR_REDIRECT:
      return {
        redirectTo: null,
        isRedirecting: false,
        error: null,
      };
    default: {
      return state;
    }
  }
}

export default redirectReducer;
