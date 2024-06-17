
import { notificationsCollection, notificationById, usermetadata, auth } from "../Firebase/firebase";
import { getDoc, getDocs, updateDoc, onSnapshot, query, where, Timestamp, setDoc, addDoc, arrayUnion } from 'firebase/firestore';
import { NOTIFICAIONS_FAILURE, NOTIFICAIONS_REQUEST, NOTIFICAIONS_SUCCESS, NOTIFICAION_BY_ID_FAILURE, NOTIFICAION_BY_ID_REQUEST, NOTIFICAION_BY_ID_SUCCESS } from "../reducers/types";
import { notify } from 'reapop';
export const notificationsFetchRequest = () => {
  return {
    type: NOTIFICAIONS_REQUEST,
  };
};
export const notificationsFetchSuccess = (info) => {
  return {
    type: NOTIFICAIONS_SUCCESS,
    payload: info,
  };
};
export const notificationsFetchFailure = (error) => {
  return {
    type: NOTIFICAIONS_FAILURE,
    payload: error,
  };
};
export const notificationsFetchByIdRequest = () => {
  return {
    type: NOTIFICAION_BY_ID_REQUEST,
  };
};
export const notificationsFetchByIdSuccess = (info) => {
  return {
    type: NOTIFICAION_BY_ID_SUCCESS,
    payload: info,
  };
};
export const notificationsFetchByIdFailure = (error) => {
  return {
    type: NOTIFICAION_BY_ID_FAILURE,
    payload: error,
  };
};
export const getNotifications = () => {
  return async (dispatch, getState) => {
    // const isAdmin = getState().auth?.user?.roles?.includes('ADMIN');
    dispatch(notificationsFetchRequest());
    try {
      let getAllNotificationsQuery;

      // if (isAdmin) {
      //   // Admin user gets all notifications
      //   getAllNotificationsQuery = query(notificationsCollection(),
      //     where('deleted', '==', false));
      // } else {
        // Non-admin user gets notifications based on conditions
        const currentUserId = getState().auth?.user?.id;

        getAllNotificationsQuery = query(
          notificationsCollection(),
          where('deleted', '==', false),
          where('toAll', '==', true),
          where('toAllAdmins', '==', false),
          where('users', 'array-contains', currentUserId)
        );
      // }
      getDocs(getAllNotificationsQuery).then((querySnapshot) => {
      const getAllNotificationsData = [];
        querySnapshot.forEach(async (doc) => {
          const Data = doc.data();
          if (Data.createdBy) {
            const userDataRef = await getDoc(Data.createdBy);
            const userData = userDataRef.data();
            const res = { ...Data, by: userData, id: doc.id };
            getAllNotificationsData.push(res);
          }
          else {
            getAllNotificationsData.push({ ...Data, id: Data.id })
          }
        });
        dispatch(notificationsFetchSuccess(getAllNotificationsData));
      }).catch((error) =>{
        throw Error(error)
      })
    } catch (error) {
      dispatch(notificationsFetchFailure(error));
      dispatch(notify({ status: 'error', message: error.message }));
    }
  };
};
export const appendNotification = (notification) => {
  return dispatch => {
    setDoc(notificationById(notification?.id), notification)
      .catch((error) => {
        dispatch(notify({ message: `${error?.message}`, status: "error" }));
      })
  }
}
export const addNotification = (notification, showStatus = true) => {
  return dispatch => {
    addDoc(notificationsCollection(), notification)
      .then(() => {
        if (showStatus) {
          dispatch(notify({ message: `A notification to the user has been sent`, status: "success" }));
        }

      })
      .catch((error) => {
        dispatch(notify({ message: `${error?.message}`, status: "error" }));
      })
  }
}
export const getNotificationById = (id) => {
  return (dispatch) => {
    dispatch(notificationsFetchByIdRequest());
    getDoc(notificationById(id))
      .then((data) => {
        if (data.exists() && !data.data()?.deleted) {
          dispatch(notificationsFetchByIdSuccess(data.data()));
        } else {
          dispatch(
            notificationsFetchByIdFailure({
              message: "Notification not found",
              code: "Not-found",
            })
          );
        }
      })
      .catch((error) => {
        dispatch(notificationsFetchByIdFailure(error));
      });
  };
};
export const updateNotificationById = (id, notification) => {
  return (dispatch) => {
    dispatch(notificationsFetchByIdRequest());
    updateDoc(notificationById(id), {
      ...notification,
      lastUpdatedBy: usermetadata(auth.currentUser.uid)
    })
      .then(() => {
        dispatch(notificationsFetchByIdSuccess());
        dispatch(getNotifications());
      })
      .catch((error) => {
        dispatch(notificationsFetchByIdFailure(error));
      });
  };
};