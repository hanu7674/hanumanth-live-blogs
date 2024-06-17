import { addDoc, arrayUnion, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { auth, chatProfileImageUploadPath, groupChatCollection, userRef, usersRef } from '../Firebase/firebase';
import * as type from '../reducers/types';
import { getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { notify } from 'reapop';

export const handleUploadProgress = (progress) => {
    return {
      type: 'CHAT_FILE_UPLOAD_PROGRESS',
      payload: progress,
    };
  };
  export const handleChatProfileImageChange = (url) => {
    return {
      type: 'CHAT_PROFILE_IMAGE_CHANGE',
      payload: url,
    };
  };
// Action Creators
export const createGroupChat = (info) => {
  return async (dispatch) => {
    dispatch({ type: type.CREATE_GROUP_CHAT_REQUEST });
    try {
        const existingGroupChatQuery = query(
            groupChatCollection(),
            where('groupName', '==', info.groupName)
          );
    
          const existingGroupChats = await getDocs(existingGroupChatQuery);
    
          if (!existingGroupChats.empty) {
            // Group chat with the same name already exists
            dispatch(notify({ status: 'error', message: 'Group chat with the same name already exists.' }));
            dispatch({ type: type.CREATE_GROUP_CHAT_FAILURE, payload: 'Group chat with the same name already exists.' });
            return;
          }
      // Create a new group chat document
      const groupChatRef = await addDoc(groupChatCollection(), {
        ...info,
        createdAt: new Date(),
        admins: [auth.currentUser.uid]
      })
      // Update the group chat ID in each member's profile
      info?.users?.forEach(async (member) => {
        await updateDoc(userRef(member),{
          groupChats: arrayUnion(groupChatRef.id),
        });
      });
      dispatch(notify({ status: "success", message: `${info?.groupName} is created Successfully.` }));
      dispatch({ type: type.CREATE_GROUP_CHAT_SUCCESS, payload: groupChatRef.id });
    } catch (error) {
        dispatch(notify({ status: "error", message: error.message }));
      dispatch({ type: type.CREATE_GROUP_CHAT_FAILURE, payload: error.message });
    }
  };
};
export const changeChatProfileImage = (file) => {
    return (dispatch) => {
      var imageFullPath = chatProfileImageUploadPath(file.name);
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
              dispatch(handleChatProfileImageChange(url));
            })
            .catch((error) => {
              dispatch(notify({ status: "error", message: error.message }));
            });
        }
      );
    };
  };