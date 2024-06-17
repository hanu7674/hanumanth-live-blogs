import { NOTIFICAIONS_FAILURE, NOTIFICAIONS_REQUEST, NOTIFICAIONS_SUCCESS, NOTIFICAION_BY_ID_FAILURE, NOTIFICAION_BY_ID_REQUEST, NOTIFICAION_BY_ID_SUCCESS } from "./types";
const INITIAL_STATE = {
    loading: true,
    notifications: [],
    notification: [],
    error: null,
}
function notificationReducer(state = INITIAL_STATE , action){

    switch(action.type){
        case NOTIFICAIONS_REQUEST: 
            return {
               ...state,
                loading: true,
                notifications: []
            }
        case NOTIFICAIONS_SUCCESS :
        return { 
            ...state,
            loading: false,
            notifications: action.payload
        };
        case NOTIFICAIONS_FAILURE:
            return {
                ...state,
                loading : false,
                notifications: [],
                error: action.payload
            }
        case NOTIFICAION_BY_ID_REQUEST: 
            return {
               ...state,
                loading: true,
                notification: []
            }
        case NOTIFICAION_BY_ID_SUCCESS :
        return { 
            ...state,
            loading: false,
            notification: action.payload
        };
        case NOTIFICAION_BY_ID_FAILURE:
            return {
                ...state,
                loading :false,
                error: action.payload,
                notification: []
            }
        default: {
            return state
        }
    }
}

export default notificationReducer;