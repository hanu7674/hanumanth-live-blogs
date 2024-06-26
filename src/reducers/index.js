import { combineReducers } from 'redux';
import {reducer as notificationsReducer} from 'reapop';
import   { authReducer } from './auth';
import {todosReducer} from './todo';
import {tagsReducer} from './tag';
import carouselReducer from './carouselReducer';
import notificationReducer from './notification';
import { EventReducers } from './calendar';
import dashboardDataReducer from './dashboard';
import { ChatReducers } from './chats';
import { ticketReducer } from './tickets';
 import blogReducer from './blogs';
import redirectReducer from './redirect';
const rootReducer = combineReducers({
    notifications: notificationsReducer(),
    auth: authReducer,
    todos: todosReducer,
    chats: ChatReducers,
    carousel: carouselReducer,
  notification: notificationReducer,
  events: EventReducers,
  dashboardData: dashboardDataReducer,
  tickets: ticketReducer,
   blogs: blogReducer,
  redirect: redirectReducer,
    tag: tagsReducer
  });
  
  export default rootReducer;