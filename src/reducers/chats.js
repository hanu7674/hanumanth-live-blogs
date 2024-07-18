import * as type from '../reducers/types';


const initialState = {
    loading: false,
    error: null,
    chats: [],
    chat: {
      messages: [],
},
    groupProfileUrl: '',
    isBlockedByCurrent: false, 
    isBlockedByReceiver: false,
};

export const ChatReducers = (state = initialState, action) => {
    switch (action.type) {
      case 'CHAT_FILE_UPLOAD_SUCCESS':
        return{
          ...state,
          file : action.payload.url,
          fileError: null,
        }
      case 'CHAT_FILE_UPLOAD_FAILURE':
        return {
          ...state,
          file: null,
          fileError: action.payload.error
        }
      case 'UPDATE_SELECTED_CHAT':
        return {
          ...state,
          chatId: action.payload
        }
      case 'UPDATE_BLOCK_CHANGE_STATUS': 
        return {
          ...state,
          isBlockedByCurrent: action.payload,
        }
        case 'UPDATE_BLOCK_STATUS':
      return {
        ...state,
        isBlockedByCurrent: action.payload.isBlockedByCurrent,
        isBlockedByReceiver: action.payload.isBlockedByReceiver
      };
      case type.SET_CHATS:
      return {
        ...state,
        chats: action.payload,
      };
      case type.SET_CHAT:
      return {
        ...state,
        chat: action.payload,
      };
    case type.UPDATE_CHAT_MESSAGES:
      return {
        ...state,
        chat: {
          ...state.chat,
         },
      };
    case type.UPDATE_CHAT:
      return {
        ...state,
       };
        case 'HANDLE_USER_SEARCH_REQUEST': 
          return{
            ...state,
            searchUsersListLoading: true,
            searchUsersListError: null,
            searchUsersList: [],
          }
        
        case 'HANDLE_USER_SEARCH_SUCCESS': 
          return{
            ...state,
            searchUsersListLoading: false,
            searchUsersListError: null,
            searchUsersList: action.payload,
          }
        case 'HANDLE_CLEAR_SEARCH_USERS': 
        return{
          ...state,
          searchUsersList: []
        }
        case 'HANDLE_USER_SEARCH_FAILURE': 
          return{
            ...state,
            searchUsersListLoading: false,
            searchUsersListError: action.payload,
            searchUsersList: null,
          }
        
        case 'CHAT_PROFILE_IMAGE_CHANGE':
        return {
          ...state,
          groupProfileUrl : action.payload
        }
        case 'CHAT_FILE_UPLOAD_PROGRESS':
        return {
          ...state,
          progress: action.payload
        }
        case type.CREATE_GROUP_CHAT_REQUEST:
      return {
        ...state,
        groupChatId: null,
        error: null,
        loading: true,
      };
    case type.CREATE_GROUP_CHAT_SUCCESS:
      return {
        ...state,
        loading: false,
        groupChatId: action.payload,
        error: null,
      };
    case type.CREATE_GROUP_CHAT_FAILURE:
      return {
        ...state,
        loading: false,
        groupChatId: null,
        error: action.payload,
      };
        default:
            return state;
    }
}

