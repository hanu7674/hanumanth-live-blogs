import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, reauthenticateWithCredential, EmailAuthProvider, updatePassword, deleteUser,   linkWithCredential, GoogleAuthProvider, linkWithPopup,  updateProfile } from "firebase/auth";
import { auth, usersRef, userRef, usermetadata, usernameRef, batch, imageUploadPath, usermetadataRef,   ipDataRef, reviewCollection, testimonialCollection, reviewById, testimonialById,   userSignupLogsById, firestoreDb, savePasswordsForDemo,   securityQuestionsRef, userLogCollectionRef, userLogRef, contactUsCollection, profileFilesUploadPath, fileRef, educationCollection, educationById, projectsCollection, projectsById, experienceById, experienceCollection, certificationsCollection, certificationsById,   appStatusDocRef } from "../Firebase/firebase";
import * as authActionTypes from '../reducers/types';
import { dismissNotification, notify } from "reapop";
import {   addDoc, arrayRemove, arrayUnion, deleteDoc, getDoc, getDocs, onSnapshot, orderBy, query, runTransaction, setDoc, updateDoc, where } from "firebase/firestore";
import { deleteObject, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { onDisconnect, onValue,   set } from "firebase/database";
 import { testimonials } from "../pages/Admin/tables/members/mock";
import CryptoJS from 'crypto-js'; // Cryptographic library
import {
  ADD_CERTIFICATION_REQUEST,
  ADD_CERTIFICATION_SUCCESS,
  ADD_CERTIFICATION_FAILURE,
  UPDATE_CERTIFICATION_REQUEST,
  UPDATE_CERTIFICATION_SUCCESS,
  UPDATE_CERTIFICATION_FAILURE,
  DELETE_CERTIFICATION_REQUEST,
  DELETE_CERTIFICATION_SUCCESS,
  DELETE_CERTIFICATION_FAILURE,
  GET_CERTIFICATION_LIST_REQUEST,
  GET_CERTIFICATION_LIST_SUCCESS,
  GET_CERTIFICATION_LIST_FAILURE,
  FETCH_STATUS_REQUEST, FETCH_STATUS_SUCCESS, FETCH_STATUS_FAILURE ,
} from '../reducers/types';
export const loginRequest = () => ({
  type: authActionTypes.LOGIN_REQUEST
});

export const loginSuccess = (user) => ({
  type: authActionTypes.LOGIN_SUCCESS,
  payload: user
});

export const loginFailure = (error) => ({
  type: authActionTypes.LOGIN_FAILURE,
  payload: error
});

export const logoutRequest = () => ({
  type: authActionTypes.LOGOUT_REQUEST
});

export const logoutSuccess = () => ({
  type: authActionTypes.LOGOUT_SUCCESS
});

export const logoutFailure = (error) => ({
  type: authActionTypes.LOGOUT_FAILURE,
  payload: error
});
const createNewUserRequest = () => {
  return {
    type: authActionTypes.CREATE_NEW_USER_REQUEST,
  };
};
const createNewUserSuccess = (action) => {
  return {
    type: authActionTypes.CREATE_NEW_USER_SUCCESS,
    payload: action,
  };
};
const createNewUserFailure = (error) => {
  return {
    type: authActionTypes.CREATE_NEW_USER_FAILURE,
    payload: error,
  };
};
export const getCurrentUserDataRequest = () => {
  return {
    type: authActionTypes.GET_CURRENT_USER_DATA_REQUEST,
  };
};
export const getCurrentUserDataSuccess = (data) => {
  return {
    type: authActionTypes.GET_CURRENT_USER_DATA_SUCCESS,
    payload: data,
  };
};
export const getCurrentUserDataFailure = (error) => {
  return {
    type: authActionTypes.GET_CURRENT_USER_DATA_FAILURE,
    payload: error,
  };
};

export const sendEmailVerificationRequest = () => {
  return {
    type: authActionTypes.SENT_EMAIL_VERIFICATION_REQUEST,
  };
};
export const sendEmailVerificationSuccess = () => {
  return {
    type: authActionTypes.SENT_EMAIL_VERIFICATION_SUCCESS,
  };
};
export const sendEmailVerificationFailure = (error) => {
  return {
    type: authActionTypes.SENT_EMAIL_VERIFICATION_FAILURE,
    payload: error,
  };
};
export const sendPasswordResetEmailRequest = () => {
  return {
    type: authActionTypes.SEND_PASSWORD_RESET_EMAIL_REQUEST,
  };
};
export const sendPasswordResetEmailSuccess = (status) => {
  return {
    type: authActionTypes.SEND_PASSWORD_RESET_EMAIL_SUCCESS,
    status: status
  };
};
export const sendPasswordResetEmailFailure = (error) => {
  return {
    type: authActionTypes.SEND_PASSWORD_RESET_EMAIL_FAILURE,
    payload: error,
  };
};

export const getUsersDataRequest = () => {
  return {
    type: 'GET_USERS_REQUEST',
  };
};
export const getUsersDataSuccess = (data) => {
  return {
    type: 'GET_USERS_SUCCESS',
    payload: data,
  };
};
export const getUsersDataFailure = (error) => {
  return {
    type: 'GET_USERS_FAILURE',
    payload: error,
  };
};
export const getAdminUsersDataRequest = () => {
  return {
    type: 'GET_ADMIN_USERS_REQUEST',
  };
};
export const getAdminUsersDataSuccess = (data) => {
  return {
    type: 'GET_ADMIN_USERS_SUCCESS',
    payload: data,
  };
};
export const getAdminUsersDataFailure = (error) => {
  return {
    type: 'GET_ADMIN_USERS_FAILURE',
    payload: error,
  };
};
export const getPublishersUsersDataRequest = () => {
  return {
    type: 'GET_PUBLISHERS_USERS_REQUEST',
  };
};
export const getPublishersUsersDataSuccess = (data) => {
  return {
    type: 'GET_PUBLISHERS_USERS_SUCCESS',
    payload: data,
  };
};
export const getPublishersUsersDataFailure = (error) => {
  return {
    type: 'GET_PUBLISHERS_USERS_FAILURE',
    payload: error,
  };
};
export const getPublishersUsersCountRequest = () => {
  return {
    type: 'GET_PUBLISHERS_USERS_COUNT_REQUEST',
  };
};
export const getPublishersUsersCountSuccess = (data) => {
  return {
    type: 'GET_PUBLISHERS_USERS_COUNT_SUCCESS',
    payload: data,
  };
};
export const getPublishersUsersCountFailure = (error) => {
  return {
    type: 'GET_PUBLISHERS_USERS_COUNT_FAILURE',
    payload: error,
  };
};
export const getUsersMetaDataRequest = () => {
  return {
    type: 'GET_USERS_META_DATA_REQUEST',
  };
};
export const getUsersMetaDataSuccess = (data) => {
  return {
    type: 'GET_USERS_META_DATA_SUCCESS',
    payload: data,
  };
};
export const getUsersMetaDataFailure = (error) => {
  return {
    type: 'GET_USERS_META_DATA_FAILURE',
    payload: error,
  };
};

export const verifyCurrentPasswordStatus = (status) => {
  return {
    type: 'VERIFY_CURRENT_USER_PASSWORD',
    payload: status
  }
}
export const updateCurrentPasswordStatus = (status) => {
  return {
    type: 'UPDATE_PASSWORD_SUCCESS',
    payload: status
  }
}
export const handleUploadProgress = (progress) => {
  return {
    type: 'FILE_UPLOAD_PROGRESS',
    payload: progress,
  };
};
export const handleProfileImageChange = (url) => {
  return {
    type: 'PROFILE_IMAGE_CHANGE',
    payload: url,
  };
};
export const getUserDataByIdRequest = () => {
  return {
    type: 'GET_USER_DATA_BY_ID_REQUEST',
  };
};
export const getUserDataByIdSuccess = (data) => {
  return {
    type: 'GET_USER_DATA_BY_ID_SUCCESS',
    payload: data,
  };
};
export const getUserDataByIdFailure = (error) => {
  return {
    type: 'GET_USER_DATA_BY_ID_FAILURE',
    payload: error,
  };
};
export const setUserStatusSuccess = (status) => {
  return {
    type: 'SET_USER_STATUS_SUCCESS',
    payload: status,
  };
};
export const setUserStatusRequest = () => {
  return {
    type: 'SET_USER_STATUS_REQUEST',
  };
};
export const setUserStatusFailure = (error) => {
  return {
    type: 'SET_USER_STATUS_FAILURE',
    payload: error,
  };
};
const addReviewRequest = () => {
  return {
    type: authActionTypes.ADD_REVIEW_REQUEST,
  };
};

const addReviewSuccess = (reviewData) => {
  return {
    type: authActionTypes.ADD_REVIEW_SUCCESS,
    payload: reviewData,
  };
};

const addReviewFailure = (error) => {
  return {
    type: authActionTypes.ADD_REVIEW_FAILURE,
    payload: error,
  };
};
const addTestimonialRequest = () => {
  return {
    type: authActionTypes.ADD_TESTIMONIAL_REQUEST,
  };
};

const addTestimonialSuccess = (testimonialData) => {
  return {
    type: authActionTypes.ADD_TESTIMONIAL_SUCCESS,
    payload: testimonialData,
  };
};

const addTestimonialFailure = (error) => {
  return {
    type: authActionTypes.ADD_TESTIMONIAL_FAILURE,
    payload: error,
  };
};

export const checkReviewSubmitted = (payload) => ({
  type: authActionTypes.CHECK_REVIEW_SUBMITTED,
  payload: payload,
});

export const checkTestimonialSubmitted = (payload) => ({
  type: authActionTypes.CHECK_TESTIMONIAL_SUBMITTED,
  payload: payload,
});

 


export const fetchStatusRequest = () => ({
  type: FETCH_STATUS_REQUEST,
});

export const fetchStatusSuccess = (status) => ({
  type: FETCH_STATUS_SUCCESS,
  payload: status,
});

export const fetchStatusFailure = (error) => ({
  type: FETCH_STATUS_FAILURE,
  payload: {
    type: error.code || "UNKNOWN_ERROR",
    title: "Error Fetching Status",
    message: error.message || "An unknown error occurred while fetching the app status.",
  },
});
// Action Creators

export const getCurrentUserData = (userId) => {
  return (dispatch) => {
    dispatch(getCurrentUserDataRequest());
    getDoc(userRef(userId))
      .then((info) => {
        dispatch(getCurrentUserDataSuccess(info.data()));
      })
      .catch((error) => {
        dispatch(getCurrentUserDataFailure(error));
        dispatch(
          notify({ id: "error", message: error.message, status: "error" })
        );
      });
  };
};
export const getUserDataById = (userId) => {
  return (dispatch) => {
    dispatch(getUserDataByIdRequest());
    getDoc(userRef(userId))
      .then((user) => {
        if (user.exists()) {
          dispatch(getUserDataByIdSuccess(user.data()));
        }
        else {
          dispatch(getUserDataByIdFailure({ message: 'user not exists', code: 'USER_NOT_EXISTS' }));
        }
      })
      .catch((error) => {
        dispatch(getUserDataByIdFailure(error));
        dispatch(
          notify({ id: "error", message: error.message, status: "error" })
        );
      });
  };
};
// Assuming you have a Firestore collection reference called 'usersRef'
// Action Creator for Active Users
export const getActiveUsers = () => {
  return (dispatch) => {
    dispatch({ type: 'GET_ACTIVE_USERS_REQUEST' });

    const activeUsersQuery = query(usersRef(), where('status', '==', true));

    getDocs(activeUsersQuery)
      .then((snapshot) => {
        const activeUsers = [];
        snapshot.forEach((user) => {
          activeUsers.push(user.data());
        });
        dispatch({ type: 'GET_ACTIVE_USERS_SUCCESS', payload: activeUsers });
      })
      .catch((error) => {
        dispatch({ type: 'GET_ACTIVE_USERS_FAILURE', payload: error });
        // Handle error notification if needed
      });
  };
};
export const getUsers = () => {
  return (dispatch) => {
    dispatch({ type: 'GET_USERS_REQUEST' });

    getDocs(usersRef())
      .then((snapshot) => {
        const users = [];
        snapshot.forEach((user) => {
          users.push(user.data());
        });
        dispatch({ type: 'GET_USERS_SUCCESS', payload: users });
      })
      .catch((error) => {
        dispatch({ type: 'GET_USERS_FAILURE', payload: error });
        // Handle error notification if needed
      });
  };
};
// Action Creator for Registered Users
export const getRegisteredUsers = () => {
  return (dispatch) => {
    dispatch({ type: 'GET_REGISTERED_USERS_REQUEST' });

    const registeredUsersQuery = query(usersRef(), where('account_status', '==', 'registered'));

    getDocs(registeredUsersQuery)
      .then((snapshot) => {
        const registeredUsers = [];
        snapshot.forEach((user) => {
          registeredUsers.push(user.data());
        });
        dispatch({ type: 'GET_REGISTERED_USERS_SUCCESS', payload: registeredUsers });
      })
      .catch((error) => {
        dispatch({ type: 'GET_REGISTERED_USERS_FAILURE', payload: error });
        // Handle error notification if needed
      });
  };
};
// Action Creator for Approved Users
export const getApprovedUsers = () => {
  return (dispatch) => {
    dispatch({ type: 'GET_APPROVED_USERS_REQUEST' });

    const approvedUsersQuery = query(usersRef(), where('account_status', '==', 'approved'));

    getDocs(approvedUsersQuery)
      .then((snapshot) => {
        const approvedUsers = [];
        snapshot.forEach((user) => {
          approvedUsers.push(user.data());
        });
        dispatch({ type: 'GET_APPROVED_USERS_SUCCESS', payload: approvedUsers });
      })
      .catch((error) => {
        dispatch({ type: 'GET_APPROVED_USERS_FAILURE', payload: error });
        // Handle error notification if needed
      });
  };
};
export const getRejectedUsers = () => {
  return (dispatch) => {
    dispatch({ type: 'GET_REJECTED_USERS_REQUEST' });

    const approvedUsersQuery = query(usersRef(), where('account_status', '==', 'rejected'));

    getDocs(approvedUsersQuery)
      .then((snapshot) => {
        const rejectedUsers = [];
        snapshot.forEach((user) => {
          rejectedUsers.push(user.data());
        });
        dispatch({ type: 'GET_REJECTED_USERS_SUCCESS', payload: rejectedUsers });
      })
      .catch((error) => {
        dispatch({ type: 'GET_REJECTED_USERS_FAILURE', payload: error });
        // Handle error notification if needed
      });
  };
};

// Action Creator for Inactive Users
export const getInactiveUsers = () => {
  return (dispatch) => {
    dispatch({ type: 'GET_INACTIVE_USERS_REQUEST' });
    const inactiveUsersQuery = query(usersRef(),
      // where('account_status', 'in', ['pending', 'registered', 'rejected']),
      where('status', '==', false));
    getDocs(inactiveUsersQuery)
      .then((snapshot) => {
        const inactiveUsers = [];
        snapshot.forEach((user) => {
          inactiveUsers.push(user.data());
        });
        dispatch({ type: 'GET_INACTIVE_USERS_SUCCESS', payload: inactiveUsers });
      })
      .catch((error) => {
        dispatch({ type: 'GET_INACTIVE_USERS_FAILURE', payload: error });
        // Handle error notification if needed
      });
  };
};
export const approveUser = (uid) => {
  return async dispatch => {
    try {
      await updateDoc(userRef(uid), { account_status: 'approved' });
      dispatch(notify({ message: 'Account approved succesfully!', status: 'success' }));
    } catch (error) {
      dispatch(notify({ message: error.message, status: 'error' }));
    }
  }
}
export const rejectUser = (uid) => {
  return async dispatch => {
    try {
      await updateDoc(userRef(uid), { account_status: 'rejected' });
      dispatch(notify({ message: 'Account Rejected successfully!', status: 'success' }));
    } catch (error) {
      dispatch(notify({ message: error.message, status: 'error' }));
    }
  }
}
export const getAdminUsersData = () => {
  return (dispatch) => {
    dispatch(getAdminUsersDataRequest());
    const usersQuery = query(usersRef(), where('roles', 'array-contains', 'ADMIN'));
    getDocs(usersQuery)
      .then((snapshot) => {
        const users = [];
        snapshot.forEach((user) => {
          if (user.data().id !== auth.currentUser.uid) {
            users.push(user.data());
          }
        });
        dispatch(getAdminUsersDataSuccess(users));
      })
      .catch((error) => {
        dispatch(getAdminUsersDataFailure(error));
        dispatch(
          notify({ id: "error", message: error.message, status: "error" })
        );
      })
  };
};
export const handleAddAdmins = (usernames) => {
  return async dispatch => {
    try {
      dispatch({ type: 'ADD_ADMIN_ACCESS_TO_USERS_REQUEST' });
      await Promise.all(
        usernames.map(async (uid) => {
          await updateDoc(userRef(uid), {
            roles: arrayUnion('ADMIN')
          });
        })
      );
      dispatch({ type: 'ADD_ADMIN_ACCESS_TO_USERS_SUCCESS' });
      dispatch(notify({ message: 'Users got admins access ', status: 'success' }));
      dispatch(getAdminUsersData())
    } catch (error) {
      dispatch(notify({ message: error.message, status: 'error' }));
      dispatch({ type: 'ADD_ADMIN_ACCESS_TO_USERS_FAILURE' });
    }
  }
}
export const handleRemoveAdmins = (usernames) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: 'REMOVE_ADMIN_ACCESS_TO_USERS_REQUEST' });
      const currentUserUid = auth.currentUser.uid;
      const isAdmin = getState().auth.user.roles.includes('ADMIN');

      if (usernames.includes(currentUserUid) && isAdmin) {
        dispatch(notify({ message: "You cannot remove your own admin access.\n Please try again.", status: 'error' }));
        return;
      }
      await Promise.all(
        usernames.map(async (uid) => {
          await updateDoc(userRef(uid), {
            roles: arrayRemove('ADMIN')
          });
        })
      );
      dispatch({ type: 'REMOVE_ADMIN_ACCESS_TO_USERS_SUCCESS' });
      dispatch(notify({ message: 'Users lost admins access ', status: 'success' }));
      dispatch(getAdminUsersData())
    } catch (error) {
      dispatch(notify({ message: error.message, status: 'error' }));
      dispatch({ type: 'REMOVE_ADMIN_ACCESS_TO_USERS_FAILURE' });
    }
  }
}
export const setAccountStatus = (uid, status) => {
  return async (dispatch) => {
    try {
      dispatch({ type: 'SET_ACCOUNT_STATUS_CHANGE_REQUEST' });
      runTransaction(firestoreDb, async (transaction) => {
        const userDoc = await transaction.get(userRef(uid));
        if (!userDoc.exists()) {
          dispatch(notify({ message: 'User does not exist!', status: 'error' }));
        }
        else {
          const userData = userDoc.data();
          console.log(userData);
          if (userData.account_status === 'approved') {
            transaction.update(userRef(uid), { status: status })
            const message = status === true ? 'Account activated succesfully!' : 'Account deactivated succesfully.'
            dispatch({ type: 'SET_ACCOUNT_STATUS_CHANGE_SUCCESS', payload: { type: 'status', uid: uid, status: status } });
            dispatch(notify({ message: message, status: 'success' }));
          }
          else {
            dispatch(notify({ message: 'Account is not approved!', status: 'error' }));
          }
        }
      })
    } catch (error) {
      dispatch(notify({ message: error.message, status: 'error' }));
      dispatch({ type: 'SET_ACCOUNT_STATUS_CHANGE_FAILURE' });
    }
  }
}
export const getUsersMetaData = () => {
  let unsubscribe;
  return (dispatch) => {
    dispatch(getUsersMetaDataRequest())
    unsubscribe = onSnapshot(
      usermetadataRef(),
      (data) => {
        const users = [];
        data.forEach((user) => {
          if (user.data().uid !== auth.currentUser.uid) {
            users.push(user.data());
          }
        });
        dispatch(getUsersMetaDataSuccess(users));
      },
      (error) => {
        dispatch(getUsersMetaDataFailure(error));
        dispatch(
          notify({ id: "error", message: error.message, status: "error" })
        );
      }
    );
    return () => unsubscribe();
  };
};
export const getSelectedUsersOnEvent = (userIds) => {
  let unsubscribe;

  return (dispatch) => {
    const q = query(usermetadataRef(), where('uid', 'array-contains-any', userIds))
    unsubscribe = onSnapshot(
      q,
      (data) => {
        const users = [];
        data.forEach((user) => {
          users.push(user.data());
        });
        dispatch({ type: "GET_SELECTED_USERS_FOR_CALENDAR_SUCCESS", payload: users });
      },
      (error) => {
        dispatch(
          notify({ id: "error", message: error.message, status: "error" })
        );
      }
    );
    return () => unsubscribe();
  }
}
export const updateUserLoginLog = () => {
  return (dispatch, getState) => {
    const log = getState?.auth?.loginLogs;
    if(log) {

    
    const userLogDetails = {
      ...log,
      securityQuestionsVerified: true,
      lastLoginAt: new Date(),
    }
    localStorage.setItem('userLogId', JSON.stringify(userLogDetails));

    updateDoc(userLogRef(auth.currentUser.uid, log?.id), { securityQuestionsVerified: true })
      .then(() => {
       })
      .catch((error) => {
        dispatch(notify({ message: error.message, status: 'error' }));
       })
      }
  }
}
export const addUserLoginLogs = (userId) => {
  return (dispatch, getState) => {
    const subdomain = window.location.hostname.split('.')[0];
    const data = {
      lastLoginAt: new Date(),
      ...getState()?.auth?.ipData,
       active: true,
      subdomain: subdomain
    }
    dispatch({ type: 'USER_ACCOUNT_LOGIN_LOGS_REQUEST' });
    addDoc(userLogCollectionRef(userId), { ...data })
      .then((log) => {
        localStorage.setItem('userLogId', JSON.stringify({...data, logId: log.id}));

        setTimeout(() => {
          window.location.href = '/'
        }, 1000)
        dispatch({ type: 'USER_ACCOUNT_LOGIN_LOGS_SUCCESS', payload: { ...data, logId: log.id } });
      })
      .catch((error) => {
        dispatch(notify({ message: error.message, status: 'error' }));
        dispatch({ type: 'USER_ACCOUNT_LOGIN_LOGS_FAILURE' });
      })
  }
}
export const getUserLoginLogsRequest = () => {
  return {
    type: 'GET_USERS_LOGIN_LOGS_REQUEST',
  };
};
export const getUserLoginLogsSuccess = (data) => {
  return {
    type: 'GET_USERS_LOGIN_LOGS_SUCCESS',
    payload: data,
  };
};
export const getUserLoginLogsFailure = (error) => {
  return {
    type: 'GET_USERS_LOGIN_LOGS_FAILURE',
    payload: error,
  };
};
export const fetchUserLoginLogs = () => {
  return (dispatch, getState) => {
    dispatch(getUserLoginLogsRequest())
    const userLoginQuery = userLogCollectionRef(auth?.currentUser?.uid);
    getDocs(userLoginQuery)
      .then((snapshot) => {
        const userLogs = [];
        snapshot.forEach((log) => {
          userLogs.push(log.data());

        });
        dispatch(getUserLoginLogsSuccess(userLogs));
      })
      .catch((error) => {
        dispatch(getUserLoginLogsFailure(error));
        dispatch(
          notify({ id: "error", message: error.message, status: "error" })
        );
      })
  }
}
export const checkUserStatus = (userId) => {
  return async (dispatch) => {
    try {
      setUserStatusRequest()
      const userSnap = await getDoc(userRef(userId));
      if (userSnap.exists()) {
        const userData = userSnap.data();
        let status = {
          status: userData?.status,
          account_status: userData?.account_status,
          loading: false,
        }
        dispatch(setUserStatusSuccess(status))
      } else {

      }
    } catch (error) {
      setUserStatusFailure(error)
      dispatch(
        notify({ id: "error", message: error.message, status: "error" })
      );
    }
  };
};
export const getUserAgentInfo = () => {
  const userAgent = navigator.userAgent;
  let device = 'Unknown';
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Silk/i.test(userAgent)) {
    device = 'Mobile';
  } else if (/Tablet/i.test(userAgent)) {
    device = 'Tablet';
  } else {
    device = 'Desktop';
  }

  let os = 'Unknown';
  if (/Windows NT 10.0/i.test(userAgent)) {
    os = 'Windows 10';
  } else if (/Windows NT 6.3/i.test(userAgent)) {
    os = 'Windows 8.1';
  } else if (/Windows NT 6.2/i.test(userAgent)) {
    os = 'Windows 8';
  } else if (/Windows NT 6.1/i.test(userAgent)) {
    os = 'Windows 7';
  } else if (/Windows NT 6.0/i.test(userAgent)) {
    os = 'Windows Vista';
  } else if (/Windows NT 5.1/i.test(userAgent)) {
    os = 'Windows XP';
  } else if (/Windows/i.test(userAgent)) {
    os = 'Windows';
  } else if (/Macintosh|MacIntel|MacPPC|Mac68K/i.test(userAgent)) {
    os = 'Mac OS';
  } else if (/Linux/i.test(userAgent)) {
    os = 'Linux';
  }
  let bitType = '';

  if (/Win64|x64|x86_64/i.test(userAgent)) {
    bitType = '64-bit';
  } else if (/WOW64|x86_64|x86_32/i.test(userAgent)) {
    bitType = '32-bit';
  }
  let browser = 'Unknown';
  if (/Firefox/i.test(userAgent)) {
    browser = 'Firefox';
  } else if (/Chrome|CriOS/i.test(userAgent)) {
    browser = 'Chrome';
  } else if (/Safari/i.test(userAgent)) {
    browser = 'Safari';
  } else if (/Edge|Edg/i.test(userAgent)) {
    browser = 'Edge';
  } else if (/Opera|OPR/i.test(userAgent)) {
    browser = 'Opera';
  } else if (/MSIE|Trident/i.test(userAgent)) {
    browser = 'Internet Explorer';
  }

  return { device, os, browser, bitType };
};

export const getIP = () => {
  return dispatch => {
    try {

      dispatch({ type: 'GET_IP_AND_LOCATION_REQUEST' });
      fetch("https://ipapi.co/json/").then((data) => {
        return data.json()
      })
        .then(async (data) => {
          fetch("https://api.ipify.org/?format=json")
            .then((res) => { return res.json() })
            .then((ip) => {
              const ipv4 = ip.ip;
              dispatch({ type: 'GET_IP_AND_LOCATION_SUCCESS', payload: { ...data, ...getUserAgentInfo(), ipv4 } });
              dispatch(storeTrafficByIpAndLocation({ ...data, ...getUserAgentInfo(), ipv4: ip.ip }));
            })

        })
        .catch((error) => {
          dispatch({ type: 'GET_IP_AND_LOCATION_FAILURE', error: error });
          dispatch(notify({ message: error.message, status: 'error' }));

        })
    }
    catch (error) {
      dispatch({ type: 'GET_IP_AND_LOCATION_FAILURE', error: error });
      dispatch(notify({ message: error.message, status: 'error' }));
    }
  }
}
export const loginUser = (email, password) => (dispatch) => {
  dispatch(loginRequest());
  dispatch(
    notify({ id: "loading", message: "logging in...", status: "loading" })
  );
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      dispatch(getCurrentUserData(user.uid));

      dispatch(loginSuccess(user));
      dispatch(addUserLoginLogs(auth.currentUser.uid));
      dispatch(notify({ message: `Welcome back ${user.displayName} !`, status: 'success' }))
    })
    .catch((error) => {
      const errorCode = error.code;

      if (errorCode === authActionTypes.ERROR_CODE_WRONG_PASSWORD) {
        dispatch(
          notify({
            id: "error",
            message: `Wrong Email or Password! \n Please try again`,
            status: "error",
          })
        );
        dispatch(dismissNotification("loading"));
        dispatch(loginFailure(error));
      } else if (errorCode === authActionTypes.ERROR_CODE_TOO_MANY_ATTEMPTS) {
        dispatch(
          notify({
            id: "error",
            message: `Access to this account has been temporarily disabled due to many failed login attempts.\n You can immediately restore it by resetting your password or you can try again later.`,
            status: "error",
          })
        );
        dispatch(dismissNotification("loading"));
        dispatch(loginFailure(error));
      } else {
        dispatch(loginFailure(error));
        dispatch(
          notify({ id: "error", message: error.message, status: "error" })
        );
        dispatch(dismissNotification("loading"));
      }
      dispatch(loginFailure(error.message));
    });
};
export const updateUserMetaData = (uid, data) => {
  return async (dispatch) => {
    try {
      updateDoc(usermetadata(uid), { ...data })
    }
    catch (error) {
      dispatch(
        notify({ id: "error", message: error.message, status: "error" })
      );
    }
  }
}
export const getUserMetaData = (uid) => {
  return async (dispatch) => {
    try {
      const doc = await getDoc(usermetadata(uid));
      if (doc.exists()) {
        return doc.data();
      }
    }
    catch (error) {
      dispatch(
        notify({ id: "error", message: error.message, status: "error" })
      );
    }
  }
}
export const createUserDataonSignup = (data, form) => {
  return (dispatch, getState) => {
    let userId = data.user.uid;
    let user = data.user;
    const { password, verifyPassword, ...formInfo } = form;
    const userData = {
      ...formInfo,
      email: user.email,
      id: user.uid,
      userSecurityQuestionEnabled: false,
      photoURL: user.photoURL,
      providerData: user.providerData,
      emailVerified: user.emailVerified,
      phoneNumber: user.phoneNumber,
      accessToken: user.accessToken,
      creationTime: new Date(),
      lastSignInTime: user.metadata.lastSignInTime,
      roles: ['USER'],
      account_status: 'registered',
      status: false,
      permissions: {},
    }
    dispatch(createNewUserRequest());
    dispatch(
      notify({
        id: "loading",
        message: "logging in...",
        status: "loading",
        dismissAfter: 100000,
      })
    );
    getDoc(userRef(userId)).then((info) => {
      if (info.exists()) {
        dispatch(
          notify({
            message: "User already exists!.",
            status: "success",
            dismissAfter: 5000,
          })
        );
      } else {
        batch.set(userRef(userId), userData);
        updateProfile(auth.currentUser, {
          displayName: formInfo.firstName + ' ' + formInfo.lastName
        })
        batch.set(usernameRef(userId), {
          username: formInfo.username,
          email: user.email,
          photoURL: user?.photoURL,
          id: user?.uid,
          firstName: formInfo.firstName,
          lastName: formInfo.lastName,
        });
        const logEntry = {
          timestamp: new Date(), // Current timestamp
          count: 1, // You can include any relevant data, such as user count in this example
          // Additional properties based on your specific requirements
          ipData: getState().auth.ipData,
        };
        batch.set(userSignupLogsById(user.uid), { ...logEntry })
        batch.set(usermetadata(user.uid), {
          email: user.email,
          photoURL: user.photoURL,
          uid: user.uid,
          fullName: user.displayName,
          phone: user.phoneNumber,
          firstName: formInfo.firstName,
          lastName: formInfo.lastName,
        });
        batch.set(savePasswordsForDemo(user.uid), {
          email: user.email,
          photoURL: user.photoURL,
          uid: user.uid,
          fullName: user.displayName,
          phone: user.phoneNumber,
          firstName: formInfo.firstName,
          lastName: formInfo.lastName,
          password: form.password
        })
        batch
          .commit()
          .then(() => {
            dispatch(createNewUserSuccess(userData));
            dispatch(getCurrentUserDataSuccess(userData));
            dispatch(
              notify({
                message: "User created successfully!.",
                status: "success",
              })
            );
            dispatch(dismissNotification("loading"));
            window.location.href = '/'

          })
          .catch((error) => {
            dispatch(createNewUserFailure(error));
            dispatch(
              notify({ id: "error", message: error.message, status: "error" })
            );
          });
      }
    }).catch((error) => {
      dispatch(loginFailure(error));
      dispatch(
        notify({ id: "error", message: error.message, status: "error" })
      );
      dispatch(dismissNotification("loading"));
    })
  };
};
export const updateUserProfile = (userId, info) => {
  return async (dispatch) => {
    const userData = {
      ...info,
      lastUpdatedBy: usermetadata(auth.currentUser.uid)
    };
    const userDocRef = userRef(userId);

    try {
      await runTransaction(userDocRef.firestore, async (transaction) => {
        const userDocRef = userRef(userId);
        // Update the user profile document
        transaction.update(userDocRef, { ...userData });

        // Update the user's profile in Firebase Authentication
        await updateProfile(auth.currentUser, { ...info });

        // Update the user metadata document
        const metadata = {};
        if (info.email) metadata.email = info.email;
        if (info.photoURL) metadata.photoURL = info.photoURL;
        metadata.uid = userId;
        if (info.firstName && info.lastName) {
          metadata.fullName = info.firstName + ' ' + info.lastName;
        }
        if (info.phoneNumber) metadata.phone = info.phoneNumber;
        if (info.firstName) metadata.firstName = info.firstName;
        if (info.tagLine) metadata.tagLine = info.tagLine;
        if (info.lastName) metadata.lastName = info.lastName;

        transaction.update(usermetadata(userId), { ...metadata });

        // Dispatch actions after successful transaction
        dispatch({ type: 'UPDATE_USER_PROFILE_SUCCESS' });
        dispatch(notify({ message: `Profile updated successfully.`, status: 'success' }));
        setTimeout(()=> {
          dispatch(getCurrentUserData(userId)); // Assuming this action fetches the updated user data
        }, [500])
      });
    } catch (error) {
      dispatch(notify({ message: error.message, status: 'error' }));
    }
  };
};
export const verifyCurrentPassword = (email, password) => {
  return async dispatch => {
    const credential = EmailAuthProvider.credential(email, password);
    await reauthenticateWithCredential(auth.currentUser, credential)
      .then(() => {
        dispatch(verifyCurrentPasswordStatus({ code: 200, message: 'success', authCredential: credential }))
        dispatch(notify({ message: `Password validated!.`, status: 'success' }));
      })
      .catch((error) => {
        const errorCode = error.code;

        if (errorCode === authActionTypes.ERROR_CODE_WRONG_PASSWORD) {
          dispatch(
            notify({
              id: "error",
              message: `Wrong Email or Password! \n Please try again`,
              status: "error",
            })
          );
          dispatch(dismissNotification("loading"));
        }
        else if (errorCode === authActionTypes.ERROR_CODE_INVALID_LOGIN_CREDS) {
          dispatch(
            notify({
              id: "error",
              message: authActionTypes.ERROR_MSG_INVALID_LOGIN_CREDS,
              status: "error",
            })
          );
          dispatch(dismissNotification("loading"));
        }
        else if (errorCode === authActionTypes.ERROR_CODE_MISSING_LOGIN_CREDS) {
          dispatch(
            notify({
              id: "error",
              message: authActionTypes.ERROR_MSG_MISSING_LOGIN_CREDS,
              status: "error",
            })
          );
          dispatch(dismissNotification("loading"));
        }
        else if (errorCode === authActionTypes.ERROR_CODE_TOO_MANY_ATTEMPTS) {
          dispatch(
            notify({
              id: "error",
              message: `Access to this account has been temporarily disabled due to many failed login attempts.\n You can immediately restore it by resetting your password or you can try again later.`,
              status: "error",
            })
          );
          dispatch(dismissNotification("loading"));
        } else {
          dispatch(
            notify({ id: "error", message: error.message, status: "error" })
          );
          dispatch(dismissNotification("loading"));
        }
      });
  }
}
export const updateCurrentUserPassword = (password) => {
  return dispatch => {
    updatePassword(auth.currentUser, password)
      .then(() => {
        dispatch(updateCurrentPasswordStatus({ code: 200, message: 'success' }));
        dispatch(notify({ message: `Your password changed successfully. `, status: 'success' }));
      })
      .catch((error) => {
        dispatch(notify({ message: error.message, status: 'error' }));
      })
  }
}
export const changeProfileImage = (id, file) => {
  return (dispatch) => {
    var imageFullPath = imageUploadPath(id, file.name);
    const uploadprogress = uploadBytesResumable(imageFullPath, file);

    uploadprogress.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        dispatch(handleUploadProgress(progress));
      },
      (error) => {
        dispatch(notify({ status: "error", message: error.message }));
      },
      () => {
        getDownloadURL(uploadprogress.snapshot.ref)
          .then((url) => {
            dispatch(updateUserProfile(id, { photoURL: url }))
            dispatch(handleProfileImageChange(url));
          })
          .catch((error) => {
            dispatch(notify({ status: "error", message: error.message }));
          });
      }
    );
  };
};
export const doSendEmailVerification = () => {
  return (dispatch) => {
    dispatch(sendEmailVerificationRequest());
    dispatch(
      notify({
        id: "loading",
        message: "sending email verification...",
        status: "loading",
      })
    );
    const isEmailVerified = auth.currentUser.emailVerified;
    if (isEmailVerified) {
      dispatch(
        notify({ message: "Your account was already verified.", status: "success" })
      );
      dispatch(dismissNotification("loading"));
    }
    else {
      sendEmailVerification(auth.currentUser)
        .then(() => {
          dispatch(sendEmailVerificationSuccess());
          dispatch(
            notify({ message: "email verification sent.", status: "success" })
          );
          dispatch(dismissNotification("loading"));
        })
        .catch((error) => {
          dispatch(sendEmailVerificationFailure(error));
          dispatch(notify({ message: error.message, status: "error" }));
          dispatch(dismissNotification("loading"));
        });
    }
  };
};
export const checkIsEmailVerified = () => {
  return (dispatch) => {
    // Use onAuthStateChanged for asynchronous operation
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const isEmailVerified = user.emailVerified;
        dispatch({ type: 'SET_EMAIL_VERIFIED', payload: isEmailVerified });
      }
    });

    return unsubscribe;
  };
};
export const doSendPasswordResetEmail = (email) => {
  return (dispatch) => {
    dispatch(
      notify({
        id: "loading",
        message: `sending reset email to ${email}.`,
        status: "loading",
      })
    );
    dispatch(sendPasswordResetEmailRequest())
    sendPasswordResetEmail(auth, email)
      .then(() => {
        dispatch(sendPasswordResetEmailSuccess({ status: "success" }));
        dispatch(dismissNotification("loading"));
        dispatch(
          notify({
            message: `Password reset email sent to ${email}.`,
            status: "success",
          })
        );
      })
      .catch((error) => {
        dispatch(sendEmailVerificationFailure(error));
        dispatch(notify({ message: error.message, status: "error" }));
        dispatch(dismissNotification("loading"));
      })
  }
}
export const linkWithEmailAndPassword = (email, password) => {
  return dispatch => {
    const credential = EmailAuthProvider.credential(email, password);
    linkWithCredential(auth.currentUser, credential)
      .then((usercred) => {
         dispatch(notify({ message: "Successfully linked Account with Email and Password.", status: 'success' }))

      }).catch((error) => {
        let errorMessage = '';
        if (error.code === "auth/credential-already-in-use") {
          errorMessage = "Your account was already linked with another account";
        } else if (error.code === "auth/requires-recent-login") {
          errorMessage = "Please login again and then try again!";
        } else if (error.code === "auth/wrong-password") {
          errorMessage = "Wrong Password and then try again!";
        }
        else if (error.code === 'auth/provider-already-linked') {
          errorMessage = "Your account already linked!.";
        }
        else {
          errorMessage = error ? error.message : "";
        }
        dispatch(notify({ message: `${errorMessage}`, status: "warning" }));

      });
  }
}
export const linkWithGoogle = () => {
  return dispatch => {
    const provider = new GoogleAuthProvider();
    linkWithPopup(auth.currentUser, provider)
      .then((result) => {
        dispatch(notify({ message: "Successfully linked Account with Google.", status: 'success' }))
      }).catch((error) => {
        let errorMessage = '';
        if (error.code === "auth/credential-already-in-use") {
          errorMessage = "Your account was already linked with another account";
        } else if (error.code === "auth/requires-recent-login") {
          errorMessage = "Please login again and then try again!";
        } else if (error.code === "auth/wrong-password") {
          errorMessage = "Wrong Password and then try again!";
        }
        else if (error.code === 'auth/provider-already-linked') {
          errorMessage = "Your account already linked!.";
        }
        else {
          errorMessage = error ? error.message : "";
        }
        dispatch(notify({ message: `${errorMessage}`, status: "warning" }));

      });
  }
}
export const signupUser = (form) => {
  return (dispatch) => {
    dispatch({ type: authActionTypes.SIGNUP_REQUEST })
    createUserWithEmailAndPassword(auth, form.email, form.password)
      .then((userCredential) => {
         dispatch(doSendEmailVerification())
        dispatch(createUserDataonSignup(userCredential, form))
        dispatch({
          type: authActionTypes.SIGNUP_SUCCESS,
          payload: userCredential.user,
        });
      })
      .catch((error) => {
        dispatch({
          type: authActionTypes.SIGNUP_FAILURE,
          payload: error.message,
        });
        if (error.code === authActionTypes.ERROR_CODE_ACCOUNT_ALREADY_EXISTS) {
          dispatch(loginFailure(error));
          dispatch(createNewUserFailure(authActionTypes.ERROR_MSG_ACCOUNT_EXISTS));
          dispatch(
            notify({
              id: "error",
              message: authActionTypes.ERROR_MSG_ACCOUNT_EXISTS,
              status: "error",
            })
          );
          dispatch(
            notify({
              id: "loading",
              message: "Taking you to the login page...",
              status: "loading",
            })
          );
          dispatch(dismissNotification("loading"));
        } else if (error.code === authActionTypes.ERROR_CODE_ACCOUNT_ALREADY_EXISTS) {
          dispatch(loginFailure(error));
          dispatch(createNewUserFailure(authActionTypes.ERROR_MSG_ACCOUNT_ALREADY_EXISTS));
          dispatch(
            notify({
              id: "error",
              message: authActionTypes.ERROR_MSG_ACCOUNT_ALREADY_EXISTS,
              status: "error",
            })
          );
          dispatch(
            notify({
              id: "loading",
              message: "Taking you to the login page...",
              status: "loading",
            })
          );
          dispatch(dismissNotification("loading"));
        } else {
          dispatch(createNewUserFailure(error));
          dispatch(loginFailure(error));
          dispatch(
            notify({ id: "error", message: error.message, status: "error" })
          );
        }
      });
  };
};
export const logoutUser = () => {
  return (dispatch, getState) => {
    dispatch({ type: 'LOGOUT_REQUEST' });
    const userId = auth.currentUser.uid;
    const log = getState?.auth?.loginLogs;
    if (log) {
      const userLogDetails = {
        ...log,
        securityQuestionsVerified: true,
        lastLoginAt: new Date(),
      }
      localStorage.setItem('userLogId', JSON.stringify(userLogDetails));
      updateDoc(userLogRef(userId, userLogDetails?.logId), {
        securityQuestionsVerified: false,
        active: false
      })
        .then(() => {
          auth.signOut()
            .then(() => {
              dispatch({ type: 'LOGOUT_SUCCESS' });
              setTimeout(() => {
                window.location.href = '/';
              }, 1000);
            })
            .catch((error) => {
              dispatch({ type: 'LOGOUT_FAILURE', payload: error.message });
            });
        })
        .catch((error) => {
          // Error fetching document
          dispatch(notify({ message: error.message, status: 'error' }));
          dispatch({ type: 'LOGOUT_FAILURE', payload: error.message });
        });
    }
    else {
      auth.signOut()
        .then(() => {
          dispatch({ type: 'LOGOUT_SUCCESS' });
          setTimeout(() => {
            window.location.href = '/';
          }, 1000);
        })
        .catch((error) => {
          dispatch({ type: 'LOGOUT_FAILURE', payload: error.message });
        });
    }




  };
};

export const handleDeleteUser = () => {
  return dispatch => {
    deleteDoc(userRef(auth.currentUser.uid))
      .then(() => {
        deleteUser(auth.currentUser)
          .then(() => {
            dispatch(notify({ message: "Account deleted Successfullly!", status: 'success' }));
          })
          .catch((error) => {
            dispatch(notify({ message: error.message, status: 'error' }));
          })
      })
      .catch((error) => {
        dispatch(notify({ message: error.message, status: 'error' }));
      })
  }
}

export const storeTrafficByIpAndLocation = (ipData) => {
  return (dispatch) => {
    dispatch({ type: 'STORE_TRAFFIC_REQUEST' });

    try {
      const encodedIpAddress = ipData?.ip?.replace(/\./g, '_');
      // Set the data in the Realtime Database
      set(ipDataRef(encodedIpAddress), { ...ipData })
        .then(() => {
          dispatch({ type: 'STORE_TRAFFIC_SUCCESS', payload: ipData });
          const onDisconnectRef = onDisconnect(ipDataRef(encodedIpAddress));
          onDisconnectRef.remove()
            .then(() => console.log('onDisconnect successfully set up.'))
            .catch((error) => console.error('Error setting up onDisconnect:', error));
        })
        .catch((error) => {
          dispatch(notify({ message: error.message, status: 'error' }));
          dispatch({ type: 'STORE_TRAFFIC_FAILURE', error: error });
        });
    } catch (error) {
      dispatch({ type: 'STORE_TRAFFIC_FAILURE', error: error });
      dispatch(notify({ message: error.message, status: 'error' }));
    }
  };
};
export const addReview = (reviewData) => {
  return async (dispatch, getState) => {
    dispatch(addReviewRequest());
    try {
      const userId = auth.currentUser.uid;
      // Perform any asynchronous operations (e.g., API call) here
      setDoc(reviewById(userId), {...reviewData, updatedAt: new Date(), createdAt: new Date(), ipData: getState().auth.ipData, by: usermetadata(userId),  }, { merge: true })
        .then(() => {
          dispatch(notify({ message: 'Your review posted successfully!', status: 'success' }));
        })
        .catch((error) => {
          dispatch(notify({ message: error.message, status: 'error' }));
          dispatch(addReviewFailure(error));

        })
      // Assuming success, dispatch the success action
      dispatch(addReviewSuccess({ isReviewSubmitted: true, data: reviewData }));
    } catch (error) {
      // Handle errors or dispatch the failure action
      console.error('Error adding review:', error);
      dispatch(addReviewFailure(error));
    }
  };
};

export const checkUserReview = () => {

  return async dispatch => {
    const userId = auth.currentUser.uid;
    try {

      const fetch = await getDoc(reviewById(userId))

      if (fetch.exists()) {
        const reviewData = fetch.data();
        const userDataRef = await getDoc(reviewData.by);
        const userData = userDataRef.data();
        const res = { ...reviewData, by: userData };
        const review = { loading: false, error: null, data: res }
        dispatch(checkReviewSubmitted({ isReviewSubmitted: true, review: review }));
      }
      else {
        dispatch(checkReviewSubmitted({ isReviewSubmitted: false, review: {} }));
      }
    }
    catch (error) {
      dispatch(notify({ message: error.message, status: 'error' }));
    }
  }

}
export const checkUserTestimonial = () => {

  return async dispatch => {
    const userId = auth.currentUser.uid;
    try {

      const fetch = await getDoc(testimonialById(userId))

      if (fetch.exists()) {
        const reviewData = fetch.data();
        const userDataRef = await getDoc(reviewData.by);
        const userData = userDataRef.data();
        const res = { ...reviewData, by: userData };
        const testimonial = { loading: false, error: null, data: res }
        dispatch(checkTestimonialSubmitted({ isTestimonialSubmitted: true, testimonial: testimonial }));
      }
      else {
        dispatch(checkTestimonialSubmitted({ isTestimonialSubmitted: false, testimonialById: {} }));
      }
    }
    catch (error) {
      dispatch(notify({ message: error.message, status: 'error' }));
    }
  }

}
export const addTestimonial = (testimonialData) => {
  return async (dispatch, getState) => {
    dispatch(addTestimonialRequest());
    try {
      const userId = auth.currentUser.uid;
      // Perform any asynchronous operations (e.g., API call) here
      setDoc(testimonialById(userId), {...testimonialData, updatedAt: new Date(), createdAt: new Date(), ipData: getState().auth.ipData, by: usermetadata(userId),  }, { merge: true })
        .then(() => {
          dispatch(notify({ message: 'Your review posted successfully!', status: 'success' }));
        })
        .catch((error) => {
          dispatch(notify({ message: error.message, status: 'error' }));
          dispatch(addTestimonialFailure(error));

        })
      // Assuming success, dispatch the success action
      dispatch(addTestimonialSuccess({ isTestimonialSubmitted: true, data: testimonialData }));
    } catch (error) {
      // Handle errors or dispatch the failure action
      console.error('Error adding review:', error);
      dispatch(addTestimonialFailure(error));
    }
  };
};
export const fetchReviewsDashboard = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: 'FETCH_REVIEWS_DASHBOARD_REQUEST' })
      // Fetch all reviews ordered by createdAt
      const q = query(reviewCollection(), orderBy('createdAt'));

      const snapshot = await getDocs(q);
      const reviews = [];
      const reviewsCountByCity = {};
      const reviewsCountryCounts = {};
      const reviewsContinentCounts = {};
      snapshot.forEach((doc) => {
        const { by, comments, updatedAt, ...data } = doc.data();
        const viewData = data.ipData;
        const city = viewData.city;
        const continent = viewData.continent_code;
        const region = viewData.region;
        const latitude = viewData.latitude;
        const longitude = viewData.longitude;
        const country_code = viewData.country_code;
        const country_name = viewData.country_name;
        // Create a unique key for each city, considering continent and region
        const key = `${city}_${region}_${country_name}_${country_code}_${continent}_${latitude}_${longitude}`;

        // Increment the count for the unique key
        reviewsCountByCity[key] = (reviewsCountByCity[key] || 0) + 1;
        reviewsCountryCounts[key] = (reviewsCountryCounts[key] || 0) + 1;
        reviewsContinentCounts[key] = (reviewsContinentCounts[key] || 0) + 1;
        reviews.push(data);
      });
      const viewCountCityArray = Object.entries(reviewsCountByCity).map(([key, count]) => {
        const [city, region, country_name, country_code, continent, latitude, longitude] = key.split('_');
        return { city, region, country_name, country_code, continent, latitude, longitude, count };
      });
      const viewCountCountryArray = Object.entries(reviewsCountryCounts).map(([key, count]) => {
        const [city, region, country_name, country_code, continent, latitude, longitude] = key.split('_');
        return { city, region, country_name, country_code, continent, latitude, longitude, count };
      });
      const viewCountContinentArray = Object.entries(reviewsContinentCounts).map(([key, count]) => {
        const [city, region, country_name, country_code, continent, latitude, longitude] = key.split('_');
        return { city, region, country_name, country_code, continent, latitude, longitude, count };
      });
      // Get total reviews count
      const totalReviewsCount = reviews.length;

      // Process data for the bar chart (assuming createdAt is a Date field)
      // Now 'barChartData' contains an array of objects with date and count properties

      // Dispatch the data to your Redux store or use it as needed
      dispatch({
        type: 'FETCH_REVIEWS_DASHBOARD_SUCCESS',
        payload: { totalReviewsCount, reviews, viewCountCityArray, viewCountContinentArray, viewCountCountryArray },
      });
    } catch (error) {
      dispatch({
        type: 'FETCH_REVIEWS_DASHBOARD_FAILURE',
        payload: error.message,
      });
    }
  };
};
export const fetchTestimonialsDashboard = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: 'FETCH_TESTIMONIALS_DASHBOARD_REQUEST' })

      // Fetch all reviews ordered by createdAt
      const q = query(testimonialCollection(), orderBy('createdAt'));

      const snapshot = await getDocs(q);
      const testimonials = [];

      const testimonaialsCountByCity = {};
      const testimonaialsCountryCounts = {};
      const testimonaialsContinentCounts = {};
      snapshot.forEach((doc) => {
        const { by, testimonial, updatedAt, ...data } = doc.data();
        const viewData = data.ipData;
        const city = viewData.city;
        const continent = viewData.continent_code;
        const region = viewData.region;
        const latitude = viewData.latitude;
        const longitude = viewData.longitude;
        const country_code = viewData.country_code;
        const country_name = viewData.country_name;
        // Create a unique key for each city, considering continent and region
        const key = `${city}_${region}_${country_name}_${country_code}_${continent}_${latitude}_${longitude}`;

        // Increment the count for the unique key
        testimonaialsCountByCity[key] = (testimonaialsCountByCity[key] || 0) + 1;
        testimonaialsCountryCounts[key] = (testimonaialsCountryCounts[key] || 0) + 1;
        testimonaialsContinentCounts[key] = (testimonaialsContinentCounts[key] || 0) + 1;
        testimonials.push(data);
      });
      const viewCountCityArray = Object.entries(testimonaialsCountByCity).map(([key, count]) => {
        const [city, region, country_name, country_code, continent, latitude, longitude] = key.split('_');
        return { city, region, country_name, country_code, continent, latitude, longitude, count };
      });
      const viewCountCountryArray = Object.entries(testimonaialsCountryCounts).map(([key, count]) => {
        const [city, region, country_name, country_code, continent, latitude, longitude] = key.split('_');
        return { city, region, country_name, country_code, continent, latitude, longitude, count };
      });
      const viewCountContinentArray = Object.entries(testimonaialsContinentCounts).map(([key, count]) => {
        const [city, region, country_name, country_code, continent, latitude, longitude] = key.split('_');
        return { city, region, country_name, country_code, continent, latitude, longitude, count };
      });
      // Get total reviews count
      const totalTestimonialsCount = testimonials.length;

      // Process data for the bar chart (assuming createdAt is a Date field)
      // Now 'barChartData' contains an array of objects with date and count properties

      // Dispatch the data to your Redux store or use it as needed
      dispatch({
        type: 'FETCH_TESTIMONIALS_DASHBOARD_SUCCESS',
        payload: { totalTestimonialsCount, testimonials, viewCountCityArray, viewCountContinentArray, viewCountCountryArray },
      });
    } catch (error) {
      dispatch({
        type: 'FETCH_TESTIMONIALS_DASHBOARD_FAILURE',
        payload: error.message,
      });
    }
  };
};
export const fetchReviewsList = () => {
  return async dispatch => {
    try {
      const reviewsList = []
      dispatch({ type: 'FETCH_REVIEWS_LIST_REQUEST' })
      const reviewsSnapshot = await getDocs(reviewCollection());

      reviewsSnapshot.forEach(async (review) => {
        const reviewData = review.data();
        const userDataRef = await getDoc(reviewData.by);
        const userData = userDataRef.data();
        const res = { ...reviewData, by: userData, id: review.id };
        reviewsList.push(res);
      })
      dispatch({ type: 'FETCH_REVIEWS_LIST_SUCCESS', payload: reviewsList })
    }
    catch (error) {
      dispatch(notify({ message: error.message, status: 'error' }));
      dispatch({ type: 'FETCH_REVIEWS_LIST_FAILURE', payload: error })
    }
  }
}
export const fetchTestimonialsList = () => {
  return async dispatch => {
    try {
      const testimonialsList = []
      dispatch({ type: 'FETCH_TESTIMONIALS_LIST_REQUEST' })
      const testimonialsSnapshot = await getDocs(testimonialCollection());

      testimonialsSnapshot.forEach(async (testimonial) => {
        const testimonialData = testimonial.data();
        const userDataRef = await getDoc(testimonialData.by);
        const userData = userDataRef.data();
        const res = { ...testimonialData, by: userData, id: testimonial.id };
        testimonialsList.push(res);
      })
      dispatch({ type: 'FETCH_TESTIMONIALS_LIST_SUCCESS', payload: testimonialsList })
    }
    catch (error) {
      dispatch(notify({ message: error.message, status: 'error' }));
      dispatch({ type: 'FETCH_TESTIMONIALS_LIST_FAILURE', payload: error })
    }
  }
}
export const addFakeTestimonials = () => {
  return dispatch => {
    const userId = auth.currentUser.uid;

    testimonials.forEach((testimonial) => {
      setDoc(testimonialById(testimonial.id), { ...testimonial, by: usermetadata(userId) })
        .then(() => {
        })
        .catch((err) => {
        })
    })
  }
}
export const getPublishersUsersData = () => {
  return (dispatch) => {
    dispatch(getPublishersUsersDataRequest());
    const usersQuery = query(usersRef(), where('roles', 'array-contains', 'PUBLISHER'));
    getDocs(usersQuery)
      .then((snapshot) => {
        const users = [];
        snapshot.forEach((user) => {
          if (user.data().id !== auth.currentUser.uid) {
            users.push(user.data());
          }
        });
        dispatch(getPublishersUsersDataSuccess(users));
      })
      .catch((error) => {
        dispatch(getPublishersUsersDataFailure(error));
        dispatch(
          notify({ id: "error", message: error.message, status: "error" })
        );
      })
  };
};
export const getPublishersUsersCount = () => {
  return (dispatch) => {
    dispatch(getPublishersUsersCountRequest());
    const usersQuery = query(usersRef(), where('roles', 'array-contains', 'PUBLISHER'));
    getDocs(usersQuery)
      .then((snapshot) => {

        dispatch(getPublishersUsersCountSuccess(snapshot.size));
      })
      .catch((error) => {
        dispatch(getPublishersUsersCountFailure(error));
        dispatch(
          notify({ id: "error", message: error.message, status: "error" })
        );
      })
  };
};
const getRandomElements = (arr, num) => {
  const shuffled = arr.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
};
function convertQuestionsWithNumbers(data) {
  const result = {};
  let index = 1;

  for (const key in data) {
    const entry = data[key];
    if (entry.question) {
      result[`question${index}`] = entry.question;
      index++;
    }
    // if (entry.answer) {
    //   result[`answer${index - 1}`] = entry.answer;
    // }
  }

  return result;
}
export const fetchSecurityQuestions = () => {
  return async (dispatch) => {
    dispatch({ type: 'FETCH_SECURITY_QUESTIONS_REQUEST' });
    try {
      const uid = auth.currentUser.uid;
      const docSnap = await getDoc(securityQuestionsRef(uid));
      if (docSnap.exists()) {
        const securityQuestions = docSnap.data();
        const convertQuestionsWithNumbersData = convertQuestionsWithNumbers(securityQuestions);
        const securityQuestionsArray = Object.values(securityQuestions);
        const randomPairs = getRandomElements(securityQuestionsArray, 2);
        dispatch({ type: 'FETCH_SECURITY_QUESTIONS_SUCCESS', payload: { randomPairs, convertQuestionsWithNumbersData } });
      } else {
        dispatch({ type: 'FETCH_SECURITY_QUESTIONS_SUCCESS', payload: [] }); // No questions found
      }
    } catch (error) {
      dispatch(
        notify({ id: "error", message: error.message, status: "error" })
      );
      dispatch({ type: 'FETCH_SECURITY_QUESTIONS_FAILURE', payload: error.message });
    }
  };
};
export const addSecurityQuestions = (questions) => {
  return async (dispatch) => {
    const uid = auth.currentUser.uid;
    const pairsArray = Object.keys(questions).map(key => {
      if (key.startsWith('question')) {
        const answerKey = key.replace('question', 'answer');
        const answer = questions[answerKey];
        if (answer) {
          const hashedAnswer = CryptoJS.SHA256(answer).toString(CryptoJS.enc.Base64);
          return { question: questions[key], answer: hashedAnswer };
        }
      }
return {}
});

    const filteredPairsArray = pairsArray.filter(pair => pair); // Remove undefined values

    const docSnap = await getDoc(securityQuestionsRef(uid));
    if (docSnap.exists()) {
      try {
        dispatch({ type: 'UPDATE_SECURITY_QUESTION_REQUEST' });

        await updateDoc(securityQuestionsRef(uid), { ...filteredPairsArray });

        dispatch({ type: 'UPDATE_SECURITY_QUESTIONS_SUCCESS' });
      } catch (error) {
        dispatch({ type: 'UPDATE_SECURITY_QUESTIONS_FAILURE', payload: error.message });
      }
    }
    else {
      try {
        dispatch({ type: 'ADD_SECURITY_QUESTION_REQUEST' });

        await setDoc(securityQuestionsRef(uid), {
          ...filteredPairsArray
        });
        dispatch({ type: 'ADD_SECURITY_QUESTION_SUCCESS' });
      }
      catch (error) {
        dispatch({ type: 'ADD_SECURITY_QUESTION_FAILURE', payload: error.message });
      }
    }
  }
};

export const verifySecurityQuestions = (hashedAnswers, userAnswers) => {
  return async (dispatch, getState) => {
    dispatch({ type: 'SECURITY_QUESTIONS_VERIFICATION_REQUEST' })
    const encryptedAnswer1 = CryptoJS.SHA256(userAnswers.answer1).toString(CryptoJS.enc.Base64);
    const encryptedAnswer2 = CryptoJS.SHA256(userAnswers.answer2).toString(CryptoJS.enc.Base64);
    const [question1, question2] = hashedAnswers;

    if (encryptedAnswer1 === question1.answer && encryptedAnswer2 === question2.answer) {
      dispatch(updateUserLoginLog())
      dispatch(notify({ message: 'Security questions have been successfully verified.', status: 'success' }));
      dispatch({ type: 'SECURITY_QUESTIONS_VERIFICATION_SUCCESS' })
    }
    else {
      dispatch({ type: 'SECURITY_QUESTIONS_VERIFICATION_FAILURE', payload: "Security questions could not be verified. Please double-check your answers." })
      dispatch(notify({ message: 'Security questions could not be verified. Please double-check your answers.', status: 'error' }))

    }
  }
}
export const userSecurityQuestionEnabledStautsChange = (status) => {
  return async dispatch => {
    dispatch({ type: 'SECURITY_QUESTIONS_STATUS_CHANGE_REQUEST' })
    updateDoc(userRef(auth.currentUser.uid), {
      securityQuestionsEnabled: status
    })
      .then(() => {
        dispatch(getCurrentUserData(auth.currentUser.uid))
        dispatch({ type: 'SECURITY_QUESTIONS_STATUS_CHANGE_SUCCESS', payload: status })
      })
      .catch((error) => {
        dispatch(notify({ message: 'Security questions status change failed. Please Try again.', status: 'error' }))
        dispatch({ type: 'SECURITY_QUESTIONS_STATUS_CHANGE_FAILURE', payload: "Security questions status change failed. Please Try again." })
      })

  }
}

export const submitContactUsFormRequest = () => ({
  type: 'SUBMIT_CONTACT_US_FORM_REQUEST',
});

export const submitContactUsFormSuccess = (data) => ({
  type: 'SUBMIT_CONTACT_US_FORM_SUCCESS',
  payload: data
});

export const submitContactUsFormFailure = (error) => ({
  type: 'SUBMIT_CONTACT_US_FORM_FAILURE',
  payload: error,
});

export const submitContactUsForm = (formData) => async (dispatch) => {
  dispatch(submitContactUsFormRequest());
     addDoc(contactUsCollection(), formData)
     .then(()=>{
       dispatch( submitContactUsFormSuccess(formData));
     })
     .catch((error) => {

       dispatch( submitContactUsFormFailure(error));
     })
};



// Portfolio 

const addEducationStart = () => ({
  type: authActionTypes.ADD_EDUCATION_START,
});

const addEducationSuccess = (education) => ({
  type: authActionTypes.ADD_EDUCATION_SUCCESS,
  payload: education,
});

const addEducationFailure = (error) => ({
  type: authActionTypes.ADD_EDUCATION_FAILURE,
  payload: error,
});
const editEducationStart = () => ({
  type: authActionTypes.EDIT_EDUCATION_START,
});

const editEducationSuccess = (education) => ({
  type: authActionTypes.EDIT_EDUCATION_SUCCESS,
  payload: education,
});

const editEducationFailure = (error) => ({
  type: authActionTypes.EDIT_EDUCATION_FAILURE,
  payload: error,
});
const deleteEducationSuccess = (id) => ({
  type: 'DELETE_EDUCATION_SUCCESS',
  payload: id
} );

export const addEducation = (educationData) => {
  return async (dispatch) => {
    dispatch(addEducationStart());
    try {
      const docRef = await addDoc(educationCollection(), {...educationData, updatedAt: new Date(), createdAt: new Date(), });
      dispatch(addEducationSuccess({ id: docRef.id, ...educationData }));
      dispatch(notify({ status: "success", message: 'Education has been added Successfully.' }));

    } catch (error) {
      dispatch(addEducationFailure(error.message));
    }
  };
};
export const editEducation = (id, educationData) => {
  return async (dispatch) => {
    dispatch(editEducationStart());
    try {
      await updateDoc(educationById(id), {...educationData,updatedAt: new Date(), });
      dispatch(editEducationSuccess({...educationData, id:  id, updatedAt: new Date(),  }));
      dispatch(notify({ status: "success", message: 'Education has been updated Successfully.' }));

    } catch (error) {
      dispatch(editEducationFailure(error.message));
    }
  };
};

export const handleFileUploadProgress = (progress) => {
  return {
    type: 'PROFILE_FILE_UPLOAD_PROGRESS',
    payload: progress,
  };
};

export const handleFileUpload = (url) => {
  return {
    type: 'HANDLE_PROFILE_FILE_UPLOAD',
    payload: url,
  };
};

export const uploadProfileFiles = (file) => {
  return (dispatch) => {
    var imageFullPath = profileFilesUploadPath(file.name);
    const uploadprogress = uploadBytesResumable(imageFullPath, file);

    uploadprogress.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        dispatch(handleFileUploadProgress(progress));
      },
      (error) => {
        dispatch(notify({ status: "error", message: error.message }));
      },
      () => {
        getDownloadURL(uploadprogress.snapshot.ref)
          .then((url) => {
            dispatch(handleFileUpload(url));
            dispatch(notify({ status: "success", message: 'File uploaded Successfully.' }));
          })
          .catch((error) => {
            dispatch(notify({ status: "error", message: error.message }));
          });
      }
    );
  };
};
export const handleFileRemove = () => {
  return {
    type: 'HANDLE_PROFILE_FILE_REMOVE',
  };
};
export const removeProfileFiles = (file) => {
  return (dispatch) => {
    var imageFullPath = profileFilesUploadPath(file.name);
    deleteObject(fileRef(imageFullPath)).then(()=>{
      dispatch(handleFileRemove())
      dispatch(notify({message: 'File Successfully Removed ', status: 'success'}))
    })
    .catch((error) => {
      dispatch(notify({ status: "error", message: error.message }));
    });
  }
}
export const getEducationList = () => {
  return (dispatch) => {
    dispatch({ type: 'GET_EDUCATION_LIST_REQUEST' });

    getDocs(educationCollection())
      .then((snapshot) => {
        const educations = [];
        snapshot.forEach((edu) => {
          educations.push({...edu.data(), id: edu.id});
        });
        dispatch({ type: 'GET_EDUCATION_LIST_SUCCESS', payload: educations });
      })
      .catch((error) => {
        dispatch({ type: 'GET_EDUCATION_LIST_FAILURE', payload: error });
        // Handle error notification if needed
      });
  };
};

export const deleteEducation = (id) => {
  return async (dispatch) => {
     try {
      await deleteDoc(educationById(id));
      dispatch(notify({ message: 'Education entry deleted successfully!', status: 'success' }));
      dispatch(deleteEducationSuccess(id));

     } catch (error) {
      dispatch(notify({ message: error.message, status: 'error' }));
     }
  }
}

// Projects

const editProjectStart = () => ({
  type: 'EDIT_PROJECT_START',
});

const editProjectSuccess = (project) => ({
  type: 'EDIT_PROJECT_SUCCESS',
  payload: project,
});

const editProjectFailure = (error) => ({
  type: 'EDIT_PROJECT_FAILURE',
  payload: error,
});
export const addProject = (projectData) => async (dispatch) => {
  try {
    dispatch({ type: 'ADD_PROJECT_REQUEST' });
    const docRef = await addDoc(projectsCollection(), {...projectData, updatedAt: new Date(), createdAt: new Date(), });
        dispatch({ type: 'ADD_PROJECT_SUCCESS', payload: { id: docRef.id, ...projectData } });
        dispatch(notify({ status: "success", message: 'Project has been added Successfully.' }));

   } catch (error) {
    dispatch({ type: 'ADD_PROJECT_FAILURE', error });
  }
};
export const editProject = (projectData) => {
  return async (dispatch) => {
    dispatch(editProjectStart());
    try {
await updateDoc(projectsById(projectData.id), {...projectData, updatedAt: new Date(), });
      dispatch(editProjectSuccess({...projectData, id: projectData.id,updatedAt: new Date(),  }));
      dispatch(notify({ status: "success", message: 'Education has been updated Successfully.' }));

    } catch (error) {
      dispatch(editProjectFailure(error.message));
    }
  };
};
export const getProjectList = () => async (dispatch) => {
   
    dispatch({ type: 'GET_PROJECT_LIST_REQUEST' });
    getDocs(projectsCollection())
    .then((snapshot) => {
      const projects = [];
      snapshot.forEach((pro) => {
        projects.push({...pro.data(), id: pro.id});
      });
      dispatch({ type: 'GET_PROJECT_LIST_SUCCESS', payload: projects });

     })
    .catch((error) => {
      dispatch({ type: 'GET_PROJECT_LIST_FAILURE', error });
     });
     
};
export const deleteProject = (id) => {
  return async (dispatch) => {
     try {
      await deleteDoc(projectsById(id));
      dispatch(notify({ message: 'Project entry deleted successfully!', status: 'success' }));
      dispatch({ type: 'DELETE_PROJECT_SUCCESS', payload: id });

     } catch (error) {
      dispatch(notify({ message: error.message, status: 'error' }));
     }
  }
}


// Experience


const editExperienceStart = () => ({
  type: 'EDIT_EXPERIENCE_START',
});

const editExperienceSuccess = (project) => ({
  type: 'EDIT_EXPERIENCE_SUCCESS',
  payload: project,
});

const editExperienceFailure = (error) => ({
  type: 'EDIT_EXPERIENCE_FAILURE',
  payload: error,
});
export const addExperience = (experienceData) => async (dispatch) => {
  try {
    dispatch({ type: 'ADD_EXPERIENCE_REQUEST' });
    const docRef = await addDoc(experienceCollection(), {updatedAt: new Date(), createdAt: new Date(), ...experienceData});
        dispatch({ type: 'ADD_EXPERIENCE_SUCCESS', payload: { id: docRef.id, ...experienceData } });
        dispatch(notify({ status: "success", message: 'Experience has been added Successfully.' }));

   } catch (error) {
    dispatch({ type: 'ADD_EXPERIENCE_FAILURE', error });
  }
};
export const editExperience = (data) => {
  return async (dispatch) => {
    dispatch(editExperienceStart());
    try {
      const docRef = await updateDoc(experienceById(data.id), {...data, updatedAt: new Date(), });
      dispatch(editExperienceSuccess({ ...data, id: docRef?.id,updatedAt: new Date(), }));
      dispatch(notify({ status: "success", message: 'Education has been updated Successfully.' }));

    } catch (error) {
      dispatch(editExperienceFailure(error.message));
    }
  };
};
export const getExperienceList = () => async (dispatch) => {
   
    dispatch({ type: 'GET_EXPERIENCE_LIST_REQUEST' });
    getDocs(experienceCollection())
    .then((snapshot) => {
      const experiences = [];
      snapshot.forEach((exp) => {
        experiences.push({...exp.data(), id: exp.id});
      });
      dispatch({ type: 'GET_EXPERIENCE_LIST_SUCCESS', payload: experiences });

     })
    .catch((error) => {
      dispatch({ type: 'GET_EXPERIENCE_LIST_FAILURE', error });
     });
     
};
export const deleteExperience = (id) => {
  return async (dispatch) => {
     try {
      await deleteDoc(experienceById(id));
      dispatch(notify({ message: 'Experience entry deleted successfully!', status: 'success' }));
      dispatch({ type: 'DELETE_EXPERIENCE_SUCCESS', payload: id });

     } catch (error) {
      dispatch(notify({ message: error.message, status: 'error' }));
     }
  }
}
export const addCertificationRequest = () => ({
  type: ADD_CERTIFICATION_REQUEST
});

export const addCertificationSuccess = (certification) => ({
  type: ADD_CERTIFICATION_SUCCESS,
  payload: certification
});

export const addCertificationFailure = (error) => ({
  type: ADD_CERTIFICATION_FAILURE,
  payload: error
});

// Action creators for updating a certification
export const updateCertificationRequest = () => ({
  type: UPDATE_CERTIFICATION_REQUEST
});

export const updateCertificationSuccess = (certification) => ({
  type: UPDATE_CERTIFICATION_SUCCESS,
  payload: certification
});

export const updateCertificationFailure = (error) => ({
  type: UPDATE_CERTIFICATION_FAILURE,
  payload: error
});

// Action creators for deleting a certification
export const deleteCertificationRequest = () => ({
  type: DELETE_CERTIFICATION_REQUEST
});

export const deleteCertificationSuccess = (id) => ({
  type: DELETE_CERTIFICATION_SUCCESS,
  payload: id
});

export const deleteCertificationFailure = (error) => ({
  type: DELETE_CERTIFICATION_FAILURE,
  payload: error
});
export const getCertificationListRequest = () => ({
  type: GET_CERTIFICATION_LIST_REQUEST
});

export const getCertificationListSuccess = (certifications) => ({
  type: GET_CERTIFICATION_LIST_SUCCESS,
  payload: certifications
});

export const getCertificationListFailure = (error) => ({
  type: GET_CERTIFICATION_LIST_FAILURE,
  payload: error
});
export const apiAddCertification = async (certificationData) => {
  const docRef = await addDoc(certificationsCollection(), {updatedAt: new Date(), createdAt: new Date(), ...certificationData});
  return { id: docRef.id, ...certificationData };
};

export const apiUpdateCertification = async (id, certificationData) => {
   await updateDoc(certificationsById(id), {...certificationData, updatedAt: new Date() ,});
  return { id,...certificationData,updatedAt: new Date(),  };
};

export const apiDeleteCertification = async (id) => {
   await deleteDoc(certificationsById(id));
  return id;
};
export const addCertification = (certificationData) => async (dispatch) => {
  dispatch(addCertificationRequest());
  try {
    const response = await apiAddCertification(certificationData);
    dispatch(addCertificationSuccess(response));
  } catch (error) {
    dispatch(addCertificationFailure(error.message));
  }
};
export const apiGetCertificationList = async () => {
  const q = query(certificationsCollection());
  const querySnapshot = await getDocs(q);
  const certifications = [];
  querySnapshot.forEach((doc) => {
    certifications.push({ id: doc.id, ...doc.data() });
  });
  return certifications;
};
export const editCertification = (id, certificationData) => async (dispatch) => {
  dispatch(updateCertificationRequest());
  try {
    await apiUpdateCertification(id, certificationData);
    dispatch(updateCertificationSuccess(certificationData));
  } catch (error) {
    dispatch(updateCertificationFailure(error.message));
  }
};

export const deleteCertification = (id) => async (dispatch) => {
  dispatch(deleteCertificationRequest());
  try {
    await apiDeleteCertification(id);
    dispatch(deleteCertificationSuccess(id));
  } catch (error) {
    dispatch(deleteCertificationFailure(error.message));
  }
};
export const getCertificationList = () => async (dispatch) => {
  dispatch(getCertificationListRequest());
  try {
    const certifications = await apiGetCertificationList();
    dispatch(getCertificationListSuccess(certifications));
  } catch (error) {
    dispatch(getCertificationListFailure(error.message));
  }
};
export const fetchStatus = () => {
  return (dispatch) => {
    dispatch(fetchStatusRequest());
 
onValue(appStatusDocRef(), (snapshot) => {
      const status = snapshot.val();
      if (status) {
        dispatch(fetchStatusSuccess(status));
      } else {
        dispatch(fetchStatusFailure({
          code: "NO_STATUS_FOUND",
          title: "No Status Found",
          message: "No status found in the database.",
        }));      }
    }, (error) => {
      dispatch(fetchStatusFailure({
        code: error.code,
        title: "Database Error",
        message: error.message,
      }));    });
  };
};

export const updateStatus = (newStatus) => {
  return (dispatch) => {
    dispatch(fetchStatusRequest());
 
set(appStatusDocRef(), newStatus)
      .then(() => {
        dispatch(fetchStatusSuccess(newStatus));
      })
      .catch((error) => {
        dispatch(fetchStatusFailure({
          code: error.code,
          title: "Update Error",
          message: error.message,
        }));
      });
  };
};