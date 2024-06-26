import * as authActionTypes from '../reducers/types';
import { Timestamp,   arrayUnion,  getDoc, getDocs,   query,  setDoc, updateDoc, where } from "firebase/firestore";
import { auth, usersRef,   usermetadata,   ticketsCollection, ticketById } from "../Firebase/firebase";
import {  notify } from "reapop";
import { addNotification } from './notifications';
import { faker } from '@faker-js/faker';


export const submitFormRequest = () => ({
  type: authActionTypes.SUBMIT_FORM_REQUEST,
});

export const submitFormSuccess = (data) => ({
  type: authActionTypes.SUBMIT_FORM_SUCCESS,
  payload: data,
});

export const submitFormFailure = (error) => ({
  type: authActionTypes.SUBMIT_FORM_FAILURE,
  payload: error,
});
export const getTicketDetailsRequest = () => ({
  type: authActionTypes.GET_TICKET_DETAILS_REQUEST,
});

export const getTicketDetailsSuccess = (data) => ({
  type: authActionTypes.GET_TICKET_DETAILS_SUCCESS,
  payload: data,
});

export const getTicketDetailsFailure = (error) => ({
  type: authActionTypes.GET_TICKET_DETAILS_FAILURE,
  payload: error,
});
export const addCommentToTicketDetailsRequest = () => ({
  type: authActionTypes.ADD_COMMENT_TO_TICKET_REQUEST,
});

export const addCommentToTicketDetailsSuccess = (data) => ({
  type: authActionTypes.ADD_COMMENT_TO_TICKET_SUCCESS,
  payload: data,
});

export const addCommentToTicketDetailsFailure = (error) => ({
  type: authActionTypes.ADD_COMMENT_TO_TICKET_FAILURE,
  payload: error,
});
const defaultnotification =  {
  users: [],
  read: false,
  toAll: false,
  toAllAdmins: true,
  type: null,
  description: null,
  timestamp: Timestamp.now(),
}

const formattedString = (date) => {
  const options = {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }
  const string = new Intl.DateTimeFormat('en-US', options).format(date);
  const stringWithoutCommas = string.replace(/,/g, '');
  const dateString = stringWithoutCommas.replace(/(\d{1,2} \d{4})/g, '$1 at');
  return dateString;
}
export const submitQuery = (formData) => {
  return async (dispatch) => {
    dispatch(submitFormRequest());
    const createdBy = usermetadata(auth.currentUser.uid);
    const ticket = {
      id: faker.string.uuid(),
      createdBy: usermetadata(auth.currentUser.uid),
      subject: formData.subject,
      content: formData.content,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      status: 'Open',
      lastUpdatedBy:[
        usermetadata(auth.currentUser.uid)
      ]
    }
    const notification = {
      ...defaultnotification,
      title: `A new ticket has been created by ${auth.currentUser.displayName}`,
      shortescription: `A new ticket has been created by ${auth.currentUser.displayName}`,
      description: formData.content,
      createdBy: usermetadata(auth.currentUser.uid),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      status: 'unread'
    }
    try {
      setDoc(ticketById(ticket.id), { ...ticket })
        .then(() => {
          dispatch(notify({ message: "Your Ticket submitted Successfullly!", status: 'success' }));
          dispatch(submitFormSuccess({ticket, ...createdBy}));
          dispatch(addNotification(notification,false))
        })
        .catch((error) => {
          dispatch(notify({ message: error.message, status: 'error' }));
        })
      // dispatch(submitFormSuccess(response.data));
    } catch (error) {
      dispatch(notify({ message: error.message, status: 'error' }));
      dispatch(submitFormFailure(error.message));
    }
  };
};
export const updateTicketStatus = (id,uid, status) => {

  return async (dispatch) => {
    dispatch({ type: 'UPDATE_TICKET_STATUS_REQUEST' });
    const updatedBy = usermetadata(auth.currentUser.uid)
    const notification = {
      ...defaultnotification,
      users: [uid],
      deleted: false,
      toAllAdmins: false,
      title: `A ticket has been updated by ${auth.currentUser.displayName}`,
      shortescription: `A ticket has been updated by ${auth.currentUser.displayName}`,
      createdBy: usermetadata(auth.currentUser.uid),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      status: 'unread'
    }
    const updatedTicket = {
      id: id,
      status: status,
      updatedAt: Timestamp.now()
    }
    const comment =  `Ticket status has been changed to ${status} by ${auth.currentUser.displayName}`
    try {
      updateDoc(ticketById(id), {
        ...updatedTicket, lastUpdatedBy: usermetadata(auth.currentUser.uid)
      })
      .then(()=>{
        dispatch(addNotification(notification,false));
        dispatch(addComment(id,uid,comment))
      })
      .then(() => {
          dispatch(notify({ message: "Ticket status updated Successfullly!", status: 'success' }));
          dispatch({
            type: 'UPDATE_TICKET_STATUS_SUCCESS', payload: {
              ...updatedTicket, lastUpdatedBy: [{ ...updatedBy }]
            }
          });
        })
        .catch((error) => {
          dispatch(notify({ message: error.message, status: 'error' }));

          dispatch({ type: 'UPDATE_TICKET_STATUS_FAILURE', error: error });
        })
      // dispatch(submitFormSuccess(response.data));
    } catch (error) {
      dispatch(notify({ message: error.message, status: 'error' }));
      dispatch({ type: 'UPDATE_TICKET_STATUS_FAILURE', error: error });
    }
  };

}
export const updateTicketResolutionDue = (id,uid, due) => { 

  return async (dispatch) => {
    dispatch({ type: 'UPDATE_TICKET_STATUS_REQUEST' });
    const updatedBy = usermetadata(auth.currentUser.uid)

    const notification = {
      ...defaultnotification,
      users: [uid],
      deleted: false,
      toAllAdmins: false,
      title: `A ticket has been updated by ${auth.currentUser.displayName}`,
      shortescription: `A ticket has been updated by ${auth.currentUser.displayName}`,
      createdBy: usermetadata(auth.currentUser.uid),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      status: 'unread'
    }
    const updatedTicket = {
      due: due,
      updatedAt: Timestamp.now()
    }
    const comment =  `Ticket Resolution date has been changed to ${formattedString(due)} by ${auth.currentUser.displayName}`;
    try {
      updateDoc(ticketById(id), {
        ...updatedTicket, lastUpdatedBy: usermetadata(auth.currentUser.uid)})
      .then(()=>{
        dispatch(addNotification(notification,false));
        dispatch(addComment(id,uid, comment))
      })
      .then(() => {
          dispatch(notify({ message: "Ticket status updated Successfullly!", status: 'success' }));
          dispatch({
            type: 'UPDATE_TICKET_STATUS_SUCCESS', payload: {
              ...updatedTicket, lastUpdatedBy: [{ ...updatedBy }]
            }
          });
        })
        .catch((error) => {
          dispatch(notify({ message: error.message, status: 'error' }));

          dispatch({ type: 'UPDATE_TICKET_STATUS_FAILURE', error: error });
        })
      // dispatch(submitFormSuccess(response.data));
    } catch (error) {
      dispatch(notify({ message: error.message, status: 'error' }));
      dispatch({ type: 'UPDATE_TICKET_STATUS_FAILURE', error: error });
    }
  };

}
export const updateTicketDetails = (id,uid, form) => { 

  return async (dispatch) => {
    dispatch({ type: 'UPDATE_TICKET_DETAILS_REQUEST' });
    const updatedBy = usermetadata(auth.currentUser.uid)
    const notification = {
      ...defaultnotification,
      users: [uid],
      deleted: false,
      toAllAdmins: false,
      title: `Your ticket has been updated by ${auth.currentUser.displayName}`,
      shortescription: `Your ticket has been updated by ${auth.currentUser.displayName}`,
      createdBy: usermetadata(auth.currentUser.uid),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      status: 'unread'
    }
    const updatedTicket = {
      ...form,
      updatedAt: Timestamp.now()
    }
    const comment =  `Ticket has been modified by ${auth.currentUser.displayName}.`;
    try {

      updateDoc(ticketById(id), {
        ...updatedTicket, lastUpdatedBy: usermetadata(auth.currentUser.uid)
      })
      .then(()=>{
        dispatch(addNotification(notification,false));
        dispatch(addComment(id,uid, comment))
      })
      .then(() => {
          dispatch(notify({ message: "Ticket status updated Successfullly!", status: 'success' }));
          dispatch({
            type: 'UPDATE_TICKET_DETAILS_SUCCESS', payload: {
              ...updatedTicket, lastUpdatedBy: [{ ...updatedBy }]
            }
          });
        })
        .catch((error) => {
          dispatch(notify({ message: error.message, status: 'error' }));

          dispatch({ type: 'UPDATE_TICKET_DETAILS_FAILURE', error: error });
        })
    } catch (error) {
      dispatch(notify({ message: error.message, status: 'error' }));
      dispatch({ type: 'UPDATE_TICKET_DETAILS_FAILURE', error: error });
    }
  };

}
export const getTicketDetails = (id) => {
  return async dispatch => {
    try {
      dispatch(getTicketDetailsRequest());

      const ticketDoc = await getDoc(ticketById(id)); // Assuming 'db' is your Firestore instance

      if (ticketDoc.exists()) {
        const ticketData = ticketDoc.data();
        const createdByRef = ticketData.createdBy; // Access createdBy directly
        const commentsData = ticketData.comments || []; // Assuming comments is an array in your ticket data

        let createdByData = {};
        if (createdByRef) {
          const createdBySnapshot = await getDoc(createdByRef);
          createdByData = createdBySnapshot.data();
        }

        const commentsWithUserData = await Promise.all(
          commentsData.map(async (comment) => {
            const commentCreatedByRef = comment.by; // Assuming 'by' is the reference to the user who made the comment
            let commentCreatedByData = {};

            if (commentCreatedByRef) {
              const commentCreatedBySnapshot = await getDoc(commentCreatedByRef);
              commentCreatedByData = commentCreatedBySnapshot.data();
            }

            return {
              ...comment,
              by: commentCreatedByData,
            };
          })
        );
        // Combine ticketData and createdByData into a single object
        const { createdBy,comments, ...ticketDataWithoutCreatedBy } = ticketData;

        const ticketDetails = {
          ...ticketDataWithoutCreatedBy,
          createdBy: createdByData,
          comments: commentsWithUserData
        };
        dispatch(getTicketDetailsSuccess(ticketDetails));
      } else {
        dispatch(getTicketDetailsFailure({ message: 'Ticket not found' }));
      }
    } catch (error) {
      dispatch(getTicketDetailsFailure(error));
      dispatch(notify({ message: error.message, status: 'error' }));
    }
  };
};

export const addComment = (ticketId, uid, comment) => {
  return async (dispatch) =>{
    const by = usermetadata(auth.currentUser.uid)
    const notification = {
      ...defaultnotification,
      users: [uid],
      deleted: false,
      toAllAdmins: false,
      title: `Your ticket has got a comment by ${auth.currentUser.displayName}`,
      shortescription: `Your ticket has  got a comment by ${auth.currentUser.displayName}`,
      createdBy: usermetadata(auth.currentUser.uid),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      status: 'unread'
    }
    const commentData = {
      
      id: faker.string.uuid(),
      comment: comment,
      by: usermetadata(auth.currentUser.uid),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }
    try{
      dispatch(addCommentToTicketDetailsRequest())
        await updateDoc(ticketById(ticketId), {
          updatedAt: Timestamp.now(), comments: arrayUnion({...commentData})
        })
        .then(()=>{
          dispatch(addNotification(notification,false));
        })
        .then(()=>{
        dispatch(addCommentToTicketDetailsSuccess({...commentData,by}));
        dispatch(notify({ message: "Comment added Successfullly!", status: 'success' }));
        })
        .catch((error) => {
          dispatch(addCommentToTicketDetailsFailure(error))
          dispatch(notify({ message: error.message, status: 'error' }));
        })
    }
    catch(error){
      dispatch(notify({ message: error.message, status: 'error' }));

    }
  }
}
const fetchTicketStatusSummary = async () => {
  const querySnapshot = await getDocs(ticketsCollection());

  let statusSummary = [
      { label: 'Open', value: 'Open', color: 'blue', count: 0 },
      { label: 'Assigned', value: 'Assigned', color: 'purple', count: 0 },
      { label: 'Re-assigned', value: 'Re-assigned', color: 'teal', count: 0 },
      { label: 'Hold', value: 'Hold', color: 'yellow', count: 0 },
      { label: 'Waiting', value: 'Waiting', color: 'indigo', count: 0 },
      { label: 'Work In Progress', value: 'Work In Progress', color: 'deep-purple', count: 0 },
      { label: 'Close', value: 'Close', color: 'cyan', count: 0 },
      { label: 'Pending', value: 'Pending', color: 'pink', count: 0 },
      { label: 'Overdue', value: 'overdue', color: 'brown', count: 0 },
      { label: 'Due Today', value: 'dueToday', color: 'amber', count: 0 },
    ];

  const today = new Date(); // Current date

  querySnapshot.forEach((doc) => {
    const ticketData = doc.data();
    const ticketStatus = ticketData.status;
    const dueDate = new Date(ticketData.due);

    // Check if the ticket is overdue
    if (dueDate < today && ticketStatus !== 'Closed') {
      statusSummary.find((status) => status.value === 'overdue').count++;
    }

    // Check if the ticket is due today
    const dueDateWithoutTime = new Date(
      dueDate.getFullYear(),
      dueDate.getMonth(),
      dueDate.getDate()
    );

    if (dueDateWithoutTime.getTime() === today.getTime() && ticketStatus !== 'Closed') {
      statusSummary.find((status) => status.value === 'dueToday').count++;
    }

    // Increment count for other statuses
    const statusItem = statusSummary.find((status) => status.value === ticketStatus);
    if (statusItem) {
      statusItem.count++;
    }
  });

  return statusSummary;
};

export const getTicketsDashboardHeaderData = () => {
  return async dispatch => {
    dispatch({ type: 'FETCH_TICKETS_DASHBOARD_HEADER_DATA_REQUEST' })
    try {
      const activeUsersCountRef = await getDocs(query(usersRef(), where('status', '==', 'active')));
      const adminsCountRef = await getDocs(query(usersRef(), where('roles', 'array-contains', 'ADMIN')));
      const usersCountRef = await getDocs(usersRef());

      const ticketStatusSummary = await fetchTicketStatusSummary();
      const activeUsersCount = activeUsersCountRef.size;
      const adminsCount = adminsCountRef.size;
      const usersCount = usersCountRef.size;

      dispatch({
        type: 'FETCH_TICKETS_DASHBOARD_HEADER_DATA_SUCCESS',
        payload: {
          activeUsersCount,
          adminsCount,
          usersCount,
          ticketStatusSummary,
        },
      });
    }
    catch (error) {
      dispatch({
        type: 'FETCH_TICKETS_DASHBOARD_HEADER_DATA_ERROR',
        payload: error.message,
      });

    }
  }
}
export const fetchDashboardDataTicketsSummary = () => {
  return async dispatch => {
    try {
      dispatch({ type: 'FETCH_DASHBOARD_DATA_TICKET_SUMMARY_REQUEST' });

      const querySnapshot = await getDocs(ticketsCollection());

      const tickets = [];
      for (const docSnapshot of querySnapshot.docs) {
        // Fetching additional data from a reference (replace 'createdBy' with your actual reference field)
        const createdByRef = docSnapshot.data().createdBy;
        const createdByDoc = await getDoc(createdByRef);
        const createdByData = createdByDoc.data();
        //last updatedby
        const lastUpdatedByRef = docSnapshot.data().lastUpdatedBy[docSnapshot.data().lastUpdatedBy?.length - 1];
        const lastUpdatedByDoc = await getDoc(lastUpdatedByRef);
        const lastUpdatedByData = lastUpdatedByDoc.data();
         // Exclude createdBy field from the original document data
  const { createdBy, lastUpdatedBy, ...ticketDataWithoutCreatedBy  } = docSnapshot.data();

  // Construct the ticket object with createdBy data
  const ticket = { id: docSnapshot.id, createdBy: createdByData, lastUpdatedBy: lastUpdatedByData, ...ticketDataWithoutCreatedBy };
  
  // Push the ticket into the tickets array
  tickets.push(ticket);
      }
      dispatch({ type: 'FETCH_DASHBOARD_DATA_TICKET_SUMMARY_SUCCESS', payload: tickets });
    } catch (error) {
      dispatch({ type: 'FETCH_DASHBOARD_DATA_TICKET_SUMMARY_FAILURE' });
      dispatch(notify({ message: error.message, status: 'error' }));

      console.error('Error fetching queries:', error);
    }
  }
}