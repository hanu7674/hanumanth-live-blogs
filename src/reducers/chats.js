import * as type from '../reducers/types';


const initialState = {
    loading: false,
    error: null,
    chats: [],
    groupProfileUrl: '',
};

export const ChatReducers = (state = initialState, action) => {
    switch (action.type) {
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

