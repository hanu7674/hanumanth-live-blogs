
import * as authActionTypes from '../reducers/types';
import firestoreDb, { auth, todosRef } from '../Firebase/firebase';
import { Timestamp, addDoc, getDocs, query, where, } from 'firebase/firestore';
import { notify } from 'reapop';
export const getTodosRequest = () => ({
    type: authActionTypes.GET_TODOS_REQUEST
  });
  
  export const getTodosSuccess = (todos) => ({
    type: authActionTypes.GET_TODOS_SUCCESS,
    payload: todos
  });
  
  export const getTodosFailure = (error) => ({
    type: authActionTypes.GET_TODOS_ERROR,
    payload: error
  });
  export const getTodoRequest = () => ({
    type: authActionTypes.GET_TODO_REQUEST
  });
  
  export const getTodoSuccess = (todo) => ({
    type: authActionTypes.GET_TODO_SUCCESS,
    payload: todo
  });
  
  export const getTodoFailure = (error) => ({
    type: authActionTypes.GET_TODO_ERROR,
    payload: error
  });
  export const addTodoRequest = () => ({
    type: authActionTypes.ADD_TODO_REQUEST
  });
  
  export const addTodoSuccess = (todo) => ({
    type: authActionTypes.ADD_TODO_SUCCESS,
    payload: todo
  });
  
  export const addTodoFailure = (error) => ({
    type: authActionTypes.ADD_TODO_ERROR,
    payload: error
  });
  export const deleteTodoRequest = () => ({
    type: authActionTypes.DELETE_TODO_REQUEST
  });
  
  export const deleteTodoSuccess = (todo) => ({
    type: authActionTypes.DELETE_TODO_SUCCESS,
    payload: todo
  });
  
  export const deleteTodoFailure = (error) => ({
    type: authActionTypes.DELETE_TODO_ERROR,
    payload: error
  });
  export const updateTodoRequest = () => ({
    type: authActionTypes.UPDATE_TODO_REQUEST
  });
  
  export const updateTodoSuccess = (todo) => ({
    type: authActionTypes.UPDATE_TODO_SUCCESS,
    payload: todo
  });
  
  export const updateTodoFailure = (error) => ({
    type: authActionTypes.UPDATE_TODO_ERROR,
    payload: error
  });
  export const toggleCompleteTodoRequest = () => ({
    type: authActionTypes.TOGGLE_COMPLETE_TODO
  });
  
  export const toggleCompleteTodoSuccess = (todo) => ({
    type: authActionTypes.TOGGLE_COMPLETE_SUCCESS,
    payload: todo
  });
  
  export const toggleCompleteTodoFailure = (error) => ({
    type: authActionTypes.TOGGLE_COMPLETE_ERROR,
    payload: error
  });
 

export const addTodo = (form) => {
    return (dispatch, getState) => {
        dispatch(addTodoRequest());
        const formData = {
          ...form,
          createdAt: new Date(),
          user: {
            firstName: getState().auth?.user?.firstName,
            lastName: getState().auth?.user?.lastName,
            email: getState().auth?.user?.email,
            photoURL: getState().auth?.user?.photoURL,
            uid: getState().auth?.user?.id,
            phone: getState().auth?.user?.phoneNumber,
            timestamp: Timestamp.now(),
          },
        }
        addDoc(todosRef(), {...formData})
        .then(() =>{
            dispatch(addTodoSuccess(form));
            dispatch(notify({message: 'Task added! ', status: 'success',}))
        })
        .catch((error) => {
            dispatch(addTodoFailure());
            dispatch(notify({message: error.message, status: 'error'}))
        })
    }
}

export const getTodos = (uid, isAdmin) => {
    return (dispatch) =>{
        dispatch(getTodosRequest());
        if(isAdmin){
            const snapShot = getDocs(todosRef());
        snapShot.then((snapShot)=>{
            const data = []
            snapShot.forEach((doc)=>{
                data.push(doc.data());
            })
            dispatch(getTodosSuccess(data))
        })
        .catch((error) =>{
            dispatch(getTodosFailure());
            dispatch(notify({message: error.message, status: 'error'}))
        })
        }
        else{
            const q = query(todosRef(), where('userId', '==', `${uid}`));
        const snapShot = getDocs(q);
        snapShot.then((snapShot)=>{
            const data = []
            snapShot.forEach((doc)=>{
                data.push(doc.data());
            })
            dispatch(getTodosSuccess(data))
        })
        .catch((error) =>{
            dispatch(getTodosFailure());
            dispatch(notify({message: error.message, status: 'error'}))
        })
        }
        
    }
}