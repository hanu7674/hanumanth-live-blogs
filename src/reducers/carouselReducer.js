import {
  FETCH_CAROUSEL_ITEMS_REQUEST,
  FETCH_CAROUSEL_ITEMS_SUCCESS,
  FETCH_CAROUSEL_ITEMS_FAILURE,
  DELETE_CAROUSEL_ITEM_REQUEST,
  DELETE_CAROUSEL_ITEM_SUCCESS,
  DELETE_CAROUSEL_ITEM_FAILURE,
  EDIT_CAROUSEL_ITEM_REQUEST,
  EDIT_CAROUSEL_ITEM_SUCCESS,
  EDIT_CAROUSEL_ITEM_FAILURE,
} from './types';
const initialState = {
    // Initial state of your carousel data
    carouselItemsStatus: null,
    progress: 0,
    carouselImageUrl: null,
    carouselItems: [],
    loading: false,
    error: null,
    carouselSettings: null,
  };
  
  const carouselReducer = (state = initialState, action) => {
    switch (action.type) {
      // Other cases...
  
      case 'ADD_CAROUSEL_ITEM_SUCCESS':
      return {
        ...state,
        loading: false,
        addItemStatus: true,
        carouselItems: [...state.carouselItems, action.payload],
      }
      case 'ADD_CAROUSEL_ITEM_REQUEST':
        return {
          ...state,
        addItemStatus: false,
        loading: true,
        error: action.payload
        }
      case 'ADD_CAROUSEL_ITEM_ERROR':
        return {
          ...state,
        addItemStatus: false,
        loading: false,
        error: action.payload
        }
      case 'CAROUSEL_FILE_UPLOAD_PROGRESS': 
        return {
          ...state,
          progress: action.payload
        }
      case 'HANDLE_CAROUSEL_FILE_UPLOAD': 
        return{
          ...state,
          carouselUrl: action.payload
        }
        case 'HANDLE_CAROUSEL_FILE_REMOVE': 
        return{
          ...state,
          carouselUrl: null,
          progress: 0,
        }
      case 'FETCH_CAROUSEL_SETTINGS_REQUEST':
        return {
          ...state,
          loading: true,
          error: null,
        };
      case 'FETCH_CAROUSEL_SETTINGS_SUCCESS':
        return {
          ...state,
          loading: false,
          carouselSettings: action.payload,
        };
      case 'FETCH_CAROUSEL_SETTINGS_ERROR':
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
        case DELETE_CAROUSEL_ITEM_SUCCESS:
      return {
        ...state,
        carouselItems: state.carouselItems.filter((item) => item.id !== action.payload),
        loading: false,
        error: null,
      };
    case EDIT_CAROUSEL_ITEM_SUCCESS:
      return {
        ...state,
        carouselItems: state.carouselItems.map((item) =>
          item.id === action.payload.id ? action.payload : item
        ),
        loading: false,
        error: null,
      };
        case DELETE_CAROUSEL_ITEM_REQUEST:
        case EDIT_CAROUSEL_ITEM_REQUEST:
        case 'FETCH_CAROUSEL_ITEMS_REQUEST':
            return {
              ...state,
              loading: true,
              error: null,
            };
          case 'FETCH_CAROUSEL_ITEMS_SUCCESS':
            return {
              ...state,
              loading: false,
              carouselItems: action.payload,
            };
          case DELETE_CAROUSEL_ITEM_FAILURE:
          case EDIT_CAROUSEL_ITEM_FAILURE:
          case 'FETCH_CAROUSEL_ITEMS_ERROR':
            return {
              ...state,
              loading: false,
              error: action.payload,
            };
      default:
        return state;
    }
  };
  
  export default carouselReducer;