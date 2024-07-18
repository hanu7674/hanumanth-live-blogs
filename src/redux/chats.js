import { Timestamp, addDoc, arrayRemove, arrayUnion, collection, doc, endAt, getDoc, getDocs, onSnapshot, orderBy, query, serverTimestamp, setDoc, startAt, updateDoc, where } from 'firebase/firestore';
import { auth, chatProfileImageUploadPath, chatsImageUploadPath, firestoreDb, groupChatCollection, userRef, usermetadata, usermetadataRef, usernameRef, usernamesRef, usersRef } from '../Firebase/firebase';
import * as type from '../reducers/types';
import { getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { notify } from 'reapop';
import { debounce } from 'lodash';

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
        await updateDoc(userRef(member), {
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

export const handleUserSearch = (username) => {
  return async dispatch => {
    try {
      dispatch({ type: 'HANDLE_USER_SEARCH_REQUEST' })
      const start = username;
      const end = username + '\uf8ff';
      const q = query(usernamesRef(),
        orderBy('username'),
        startAt(start),
        endAt(end));
      getDocs(q).then((results) => {
        const users = []
        results.forEach((result) => {
          const userData = result.data();
          const userName = userData.username;
          if (userName.includes(username)) {
            users.push(userData);
          }
        })
        console.log(username, users);
        dispatch({ type: 'HANDLE_USER_SEARCH_SUCCESS', payload: users })
      })
    }
    catch (error) {
      dispatch({ type: 'HANDLE_USER_SEARCH_FAILURE', payload: error })

    }
  }
}
export const handleAddUserToChat = (uid) => {
  return async dispatch => {
    const chatRef = collection(firestoreDb, "chats");
    const userChatsRef = collection(firestoreDb, "userchats");

    try {
      const newChatRef = doc(chatRef);

      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      const userChatDocRef = doc(userChatsRef, uid);
      const currentUserChatDocRef = doc(userChatsRef, auth.currentUser.uid);
      const existingChatsSnapshot = await getDoc(currentUserChatDocRef);
      let isUidPresent = false;
      if (existingChatsSnapshot.exists()) {
        const existingChatsData = existingChatsSnapshot.data();
        isUidPresent = existingChatsData.chats.some(chat => chat.receiverId === uid);
      }
      if (!isUidPresent) {
        // Proceed with adding user to chat
        const userChatDoc = await getDoc(userChatDocRef);
      if (userChatDoc.exists()) {
        await updateDoc(userChatDocRef, {
          chats: arrayUnion({
            chatId: newChatRef.id,
            lastMessage: "",
            receiverId: auth.currentUser.uid,
            updatedAt: Date.now(),
          }),
        });
      } else {
        await setDoc(userChatDocRef, {
          chats: [{
            chatId: newChatRef.id,
            lastMessage: "",
            receiverId: auth.currentUser.uid,
            updatedAt: Date.now(),
          }]
        });
      }

      const currentUserChatDoc = await getDoc(currentUserChatDocRef);
      if (currentUserChatDoc.exists()) {
        await updateDoc(currentUserChatDocRef, {
          chats: arrayUnion({
            chatId: newChatRef.id,
            lastMessage: "",
            receiverId: uid,
            updatedAt: Date.now(),
          }),
        });
      } else {
        await setDoc(currentUserChatDocRef, {
          chats: [{
            chatId: newChatRef.id,
            lastMessage: "",
            receiverId: uid,
            updatedAt: Date.now(),
          }]
        });
      }
       } else {
        console.log("User already present in chat.");
      }
      // Check if the user chat document exists before updating
      dispatch({type: 'HANDLE_CLEAR_SEARCH_USERS'})
      
    } catch (err) {
      console.log(err);
    }
  }
};

export const fetchChats = (userId) => async (dispatch) => {
  const unSub = onSnapshot(
    doc(firestoreDb, "userchats", userId),
    async (res) => {
      const items = res.data()?.chats;
      if (items?.length > 0) {
        const promises = items?.map(async (item) => {
          const userDocSnap = await getDoc(usernameRef(item.receiverId));

          const user = userDocSnap.data();
          const { lastUpdatedBy, logs, ...userData } = user;
          return { ...item, user: userData };
        });

        const chatData = await Promise.all(promises);

        dispatch({
          type: type.SET_CHATS,
          payload: chatData.sort((a, b) => b.updatedAt - a.updatedAt),
        });
      }
      else {
        dispatch({
          type: type.SET_CHATS,
          payload: [],
        });
      }
    }
  );

  return () => {
    unSub();
  };
};
export const updateChat = (userId, chats) => async (dispatch) => {
  const userChatsRef = doc(firestoreDb, "userchats", userId);

  try {
    await updateDoc(userChatsRef, {
      chats
    });
    dispatch({
      type: type.UPDATE_CHAT,
    });
  } catch (err) {
    console.log(err);
  }
};
export const fetchChat = (chatId) => (dispatch) => {
   const unSub = onSnapshot(doc(firestoreDb, "chats", chatId), (res) => {
    dispatch({
      type: type.SET_CHAT,
      payload: {id: chatId,...res.data()},
    });
  });

  return () => {
    unSub();
  };
};

 
export const sendMessage = (chatId, message, currentUserId, receiverId, url) => async (dispatch) => {
  const chatRef = doc(firestoreDb, "chats", chatId);
  const lastMessage = url ? "Sent an image." : message;
    try {
    const messageData = {
      text: message,
      createdAt: Timestamp.now(),
      senderId: auth.currentUser.uid,
      ...(url ? { url: url } : {})
    }
     await updateDoc(chatRef, {
      messages: arrayUnion(messageData),
    });

    const userIDs = [currentUserId, receiverId];

     userIDs.forEach(async (id) => {
      const userChatsRef = doc(firestoreDb, "userchats", id);
      const userChatsSnapshot = await getDoc(userChatsRef);

      if (userChatsSnapshot.exists()) {
        const userChatsData = userChatsSnapshot.data();

        const chatIndex = userChatsData.chats.findIndex(
          (c) => c.chatId === chatId
        );

        userChatsData.chats[chatIndex].lastMessage = lastMessage;
        userChatsData.chats[chatIndex].isSeen =
          id === currentUserId ? true : false;
        userChatsData.chats[chatIndex].updatedAt = Date.now();

        await updateDoc(userChatsRef, {
          chats: userChatsData.chats,
        });
      }
    });

    dispatch({
      type: type.UPDATE_CHAT_MESSAGES,
    });
  } catch (err) {
    console.log(err);
  }
};
export const uploadChatsFile = (file, chatId, receiverId) => {
  return async (dispatch) => {
    var imageFullPath = chatsImageUploadPath(auth.currentUser.uid, file.name);
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
            dispatch({type: 'CHAT_FILE_UPLOAD_SUCCESS', payload: {url: url, status: "success"}});
             
    dispatch(sendMessage(chatId, null , auth.currentUser.uid, receiverId, url));

        dispatch(notify({ status: "success", message: "File Uploaded." }));
          })
          .catch((error) => {
            dispatch({type: 'CHAT_FILE_UPLOAD_FAILURE', payload: {error: error, status: "failure"}});
            dispatch(notify({ status: "error", message: error.message }));
          });
      }
    );
  }

}
const debouncedDispatch = debounce((dispatch, payload) => {
  dispatch({
    type: 'UPDATE_BLOCK_STATUS',
    payload: payload
  });
}, 1000);
export const checkIfBlocked = (currentUserId, receiverId) => {
  return async (dispatch) => {
    const currentRef = doc(firestoreDb, 'users', currentUserId);
    const receiverRef = doc(firestoreDb, 'users', receiverId);

    const unsubscribeReceiver = onSnapshot(receiverRef, (doc) => {
      if (doc.exists()) {
        const receiverData = doc.data();
        const isBlockedByReceiver = receiverData.blocked && receiverData.blocked.includes(currentUserId);

        onSnapshot(currentRef, (doc) => {
          if (doc.exists()) {
            const currentData = doc.data();
            const isBlockedByCurrent = currentData.blocked && currentData.blocked.includes(receiverId);

            // Use the debounced function to dispatch the update
            debouncedDispatch(dispatch, { isBlockedByCurrent, isBlockedByReceiver });
          }
        });
      }
    });

    // Return a function to unsubscribe from both listeners when no longer needed
    return () => {
      unsubscribeReceiver();
    };
  };
};
export const changeBlockStatus = (userId, status) => {
  return async dispatch => {
      try {
        if(status === true){
          await updateDoc(userRef(auth.currentUser.uid), {
         blocked: arrayRemove(userId) ,
        });
        }
        else {
          await updateDoc(userRef(auth.currentUser.uid), {
            blocked: arrayUnion(userId),
           });
        }
       
        dispatch({ type: 'UPDATE_BLOCK_CHANGE_STATUS', payload:!status });
      } catch (err) {
      console.log(err);
    }
  }
}