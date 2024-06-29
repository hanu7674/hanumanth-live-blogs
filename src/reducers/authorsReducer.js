import {
    FETCH_AUTHORS_REQUEST,
    FETCH_AUTHORS_SUCCESS,
    FETCH_AUTHORS_FAILURE,
    FETCH_AUTHORS_COUNT_REQUEST,
    FETCH_AUTHORS_COUNT_SUCCESS,
    FETCH_AUTHORS_COUNT_FAILURE,
    FETCH_PENDING_AUTHORS_COUNT_REQUEST,
    FETCH_PENDING_AUTHORS_COUNT_SUCCESS,
    FETCH_PENDING_AUTHORS_COUNT_FAILURE,
    FETCH_LAST_WEEK_POSTED_AUTHORS_COUNT_REQUEST,
    FETCH_LAST_WEEK_POSTED_AUTHORS_COUNT_SUCCESS,
    FETCH_LAST_WEEK_POSTED_AUTHORS_COUNT_FAILURE,
    FETCH_DASHBOARD_DATA_ON_VISITS_PAGES_REQUEST,
    FETCH_DASHBOARD_DATA_ON_VISITS_PAGES_SUCCESS,
    FETCH_DASHBOARD_DATA_ON_VISITS_PAGES_FAILURE,
    FETCH_AUTHORS_BY_TIME_RANGE_REQUEST,
    FETCH_AUTHORS_BY_TIME_RANGE_FAILURE,
    FETCH_AUTHORS_BY_TIME_RANGE_SUCCESS,
FETCH_BLOGS_BY_AUTHOR_REQUEST,
FETCH_BLOGS_BY_AUTHOR_SUCCESS,
FETCH_BLOGS_BY_AUTHOR_FAILURE,
FETCH_BLOGS_COUNT_BY_AUTHOR_REQUEST,
FETCH_BLOGS_COUNT_BY_AUTHOR_SUCCESS,
FETCH_BLOGS_COUNT_BY_AUTHOR_FAILURE,
FETCH_PENDING_BLOGS_COUNT_BY_AUTHOR_REQUEST,
FETCH_PENDING_BLOGS_COUNT_BY_AUTHOR_SUCCESS,
FETCH_PENDING_BLOGS_COUNT_BY_AUTHOR_FAILURE,
} from './types';
  
  const initialState = {
    loading: false,
    authors: [],
    authorsCount: 0,
    pendingAuthorsCount: 0,
    lastWeekPostedAuthorsCount: 0,
    dashboardData: [],
    authorsByTimeRange: [],
    error: null,
    pendingBlogsCount: 0,
  };
  
  const authorsReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_BLOGS_BY_AUTHOR_REQUEST:
    case FETCH_BLOGS_COUNT_BY_AUTHOR_REQUEST:
        case FETCH_PENDING_BLOGS_COUNT_BY_AUTHOR_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_PENDING_BLOGS_COUNT_BY_AUTHOR_SUCCESS:
        return {
            ...state,
            loading: false,
            pendingBlogsCount: action.payload,
        };
    case FETCH_BLOGS_BY_AUTHOR_SUCCESS:
      return {
        ...state,
        loading: false,
        blogs: action.payload,
      };
    case FETCH_BLOGS_COUNT_BY_AUTHOR_SUCCESS:
      return {
        ...state,
        loading: false,
        blogsCount: action.payload,
      };
    case FETCH_BLOGS_BY_AUTHOR_FAILURE:
    case FETCH_BLOGS_COUNT_BY_AUTHOR_FAILURE:
    case FETCH_PENDING_BLOGS_COUNT_BY_AUTHOR_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
      case FETCH_AUTHORS_REQUEST:
      case FETCH_AUTHORS_COUNT_REQUEST:
      case FETCH_PENDING_AUTHORS_COUNT_REQUEST:
      case FETCH_LAST_WEEK_POSTED_AUTHORS_COUNT_REQUEST:
      case FETCH_DASHBOARD_DATA_ON_VISITS_PAGES_REQUEST:
        case FETCH_AUTHORS_BY_TIME_RANGE_REQUEST:
        return {
          ...state,
          loading: true,
        };
      case FETCH_AUTHORS_SUCCESS:
        return {
          ...state,
          loading: false,
          authors: action.payload,
        };
      case FETCH_AUTHORS_COUNT_SUCCESS:
        return {
          ...state,
          loading: false,
          authorsCount: action.payload,
        };
      case FETCH_PENDING_AUTHORS_COUNT_SUCCESS:
        return {
          ...state,
          loading: false,
          pendingAuthorsCount: action.payload,
        };
      case FETCH_LAST_WEEK_POSTED_AUTHORS_COUNT_SUCCESS:
        return {
          ...state,
          loading: false,
          lastWeekPostedAuthorsCount: action.payload,
        };
      case FETCH_DASHBOARD_DATA_ON_VISITS_PAGES_SUCCESS:
        return {
          ...state,
          loading: false,
          dashboardData: action.payload,
        };
        case FETCH_AUTHORS_BY_TIME_RANGE_SUCCESS:
            return {
                ...state,
                authorsByTimeRange: action.payload,
                loading: false,
            };
      case FETCH_AUTHORS_FAILURE:
      case FETCH_AUTHORS_COUNT_FAILURE:
      case FETCH_PENDING_AUTHORS_COUNT_FAILURE:
      case FETCH_LAST_WEEK_POSTED_AUTHORS_COUNT_FAILURE:
      case FETCH_DASHBOARD_DATA_ON_VISITS_PAGES_FAILURE:
        case FETCH_AUTHORS_BY_TIME_RANGE_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      default:
        return state;
    }
  };
  
export default authorsReducer;