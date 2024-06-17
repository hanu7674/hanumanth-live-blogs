import {
    ADD_EVENT_REQUEST,
    ADD_EVENT_SUCCESS,
    ADD_EVENT_FAILURE,
    MODIFY_EVENT_REQUEST,
    MODIFY_EVENT_SUCCESS,
    MODIFY_EVENT_FAILURE,
    DELETE_EVENT_REQUEST,
    DELETE_EVENT_SUCCESS,
    DELETE_EVENT_FAILURE,
    GET_ALL_EVENTS_REQUEST,
    GET_ALL_EVENTS_FAILURE,
    GET_ALL_EVENTS_SUCCESS,
    EDIT_EVENT_REQUEST,
    EDIT_EVENT_SUCCESS,
    EDIT_EVENT_FAILURE
  } from './types';
  
  const initialState = {
      loading: false,
      error: null,
      events: [],
      viewCountCityArray: [],
     viewCountContinentArray: [],
      viewCountCountryArray: [],
      draggableEvents: []
  };
  
  export const EventReducers = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_DRAGGABLE_EVENTS':
      return {
        ...state,
        draggableEvents: action.payload,
      };
      case 'ADD_DRAGGABLE_EVENT':
      return {
        ...state,
        draggableEvents: [...state.draggableEvents, action.payload],
      };
      case 'EDIT_DRAGGABLE_EVENT':
      return {
        ...state,
        draggableEvents: state.draggableEvents.map((event) =>
          event.id === action.payload.id ? { ...event, ...action.payload } : event
        ),
      };

    case 'DELETE_DRAGGABLE_EVENT':
      return {
        ...state,
        draggableEvents: state.draggableEvents.filter((event) => (event.id !== action.payload.id)),
      };
      case 'FETCH_EVENTS_DASHBOARD_REQUEST':
        return{ 
          ...state,
          dashboardLoading: true,
          dashboardError: null
        }
      case 'FETCH_EVENTS_DASHBOARD_SUCCESS':
          return{ 
            ...state,
            dashboardLoading: false,
            dashboardError: null,
            durationAnalysis: action.payload.durationAnalysis,
            totalEventsCount: action.payload.totalEventsCount,
            eventsbarChartData: action.payload.events,
        viewCountCityArray: action.payload.viewCountCityArray,
         viewCountContinentArray: action.payload.viewCountContinentArray,
         viewCountCountryArray: action.payload.viewCountCountryArray,
          }
      case 'FETCH_EVENTS_DASHBOARD_FAILURE':
            return{ 
              ...state,
              dashboardLoading: false,
              dashboardError: action.payload,
            dashboardData: [],

            }
      case ADD_EVENT_REQUEST:
      case GET_ALL_EVENTS_REQUEST:
      case EDIT_EVENT_REQUEST:
      case DELETE_EVENT_REQUEST:
        return {
            ...state,
            loading: true,
        error: null
        };
    case GET_ALL_EVENTS_SUCCESS:
        return{
            ...state,
              loading: false,
              error: null,
              events: action.payload
        }
      case ADD_EVENT_SUCCESS:
        return {
            ...state,
              loading: false,
              error: null,
              events: [...state.events, action.payload]
          };
      case EDIT_EVENT_SUCCESS:
        return{
            ...state,
            loading: false,
            error: null,
            events: state.events.map(
                (event) => event.id === action.payload.id ? {...action.payload} : event
            )
        }
      case DELETE_EVENT_SUCCESS:
        return {
          ...state,
            loading: false,
            error: null,
            events: state.events.filter((event) => event.id !== action.payload)

        };
      case ADD_EVENT_FAILURE:
        case GET_ALL_EVENTS_FAILURE:
      case EDIT_EVENT_FAILURE:
      case DELETE_EVENT_FAILURE:
        return {
          ...state,
            loading: false,
            error: action.payload
        };
      default:
        return state;
    }
  };