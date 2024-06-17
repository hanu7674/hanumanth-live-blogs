import * as types from './types';

const initialState = {
  tickets: [],
  ticket: {
    comments: []
  }
}


export const ticketReducer = (state = initialState, action) => {
    const { type, payload } = action;
  

    switch (type) {
        
      case 'UPDATE_TICKET_STATUS_SUCCESS':
        const updatedItems = state.tickets.map(item =>
          item.id === payload.id ? { ...item, ...payload } : item
        );     
        return {
          ...state,
          loading: false,
          tickets: updatedItems,
        }
      case 'FETCH_DASHBOARD_DATA_TICKET_SUMMARY_SUCCESS': 
    return{
      ...state,
      loading: false,
      tickets: action.payload,
    }
    case 'UPDATE_TICKET_DETAILS_SUCCESS':
      return{
        ...state,
        loading: false,
        ticket: {...state.ticket, ...payload},
      }
    case 'GET_TICKET_DETAILS_SUCCESS':
      return{
        ...state,
        loading: false,
        ticket: action.payload
      }
    case types.ADD_COMMENT_TO_TICKET_SUCCESS:
      return{
        ...state,
        loading: false,
        ticket: {...state.ticket, comments: [...state.ticket.comments, payload]}
      }
    case types.ADD_COMMENT_TO_TICKET_REQUEST:
    case 'UPDATE_TICKET_DETAILS_REQUEST':
    case 'GET_TICKET_DETAILS_REQUEST':
    case 'FETCH_DASHBOARD_DATA_TICKET_SUMMARY_REQUEST': 
    return{
      ...state,
      loading: true,
    }
    case types.ADD_COMMENT_TO_TICKET_FAILURE:
    case 'UPDATE_TICKET_DETAILS_FAILURE':
    case 'GET_TICKET_DETAILS_FAILURE':
    case 'FETCH_DASHBOARD_DATA_TICKET_SUMMARY_FAILURE': 
    return{
      ...state,
      error: action.payload,
      loading: false,
    }
      case types.FETCH_TICKETS_DASHBOARD_HEADER_DATA_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case types.FETCH_TICKETS_DASHBOARD_HEADER_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        ticketsHeaderData: action.payload,
      };
    case types.FETCH_TICKETS_DASHBOARD_HEADER_DATA_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
      case types.SUBMIT_FORM_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case types.SUBMIT_FORM_SUCCESS:
      return {
        ...state,
        loading: false,
        supportFormInfo: action.payload,
      };
    case types.SUBMIT_FORM_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
        return state;
    }
}