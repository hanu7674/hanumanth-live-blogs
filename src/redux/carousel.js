import {addDoc, deleteDoc, getDoc, getDocs, updateDoc, query, setDoc, orderBy} from 'firebase/firestore'
import { auth, carouselFilesUploadPath, carouselRef, carouselRefById, carouselSettingsRef, fileRef, usermetadata } from "../Firebase/firebase";
import { notify } from "reapop";
import { deleteObject, getDownloadURL, uploadBytesResumable } from 'firebase/storage';

export const handleCarouselFileUploadProgress = (progress) => {
  return {
    type: 'CAROUSEL_FILE_UPLOAD_PROGRESS',
    payload: progress,
  };
};
export const handleCarouselFileUpload = (url) => {
  return {
    type: 'HANDLE_CAROUSEL_FILE_UPLOAD',
    payload: url,
  };
};
export const handleCarouselFileRemove = () => {
  return {
    type: 'HANDLE_CAROUSEL_FILE_REMOVE',
  };
};
export const fetchCarouselSettings = () => {
    return (dispatch) => {
        dispatch({ type: 'FETCH_CAROUSEL_SETTINGS_REQUEST' });

        getDoc(carouselSettingsRef())
        .then((info)=>{
            dispatch({ type: 'FETCH_CAROUSEL_SETTINGS_SUCCESS', payload: info.data() });
        })
        .catch((error) => {
            dispatch({ type: 'FETCH_CAROUSEL_SETTINGS_ERROR', payload: error.message });
            dispatch(
              notify({ id: "error", message: error.message, status: "error" })
            );
          });
    }
}
export const saveCarouselSettings = (settings) => {
  return async(dispatch) => {
    dispatch({ type: 'SAVE_CAROUSEL_SETTINGS_REQUEST' });
    const docRef = await getDoc(carouselSettingsRef())
    if(docRef.exists()){
      updateDoc(carouselSettingsRef(), {...settings})
    .then(()=>{
        dispatch({ type: 'SAVE_CAROUSEL_SETTINGS_SUCCESS', payload: settings });
    })
    .catch((error) => {
        dispatch({ type: 'SAVE_CAROUSEL_SETTINGS_ERROR', payload: error.message });
        dispatch(
          notify({ id: "error", message: error.message, status: "error" })
        );
      });
    }
    else{
      console.log(settings);
      setDoc(carouselSettingsRef(), {...settings})
    .then((info)=>{
        dispatch({ type: 'SAVE_CAROUSEL_SETTINGS_SUCCESS', payload: settings });
    })
    .catch((error) => {
        dispatch({ type: 'SAVE_CAROUSEL_SETTINGS_ERROR', payload: error.message });
        dispatch(
          notify({ id: "error", message: error.message, status: "error" })
        );
      });
    }
    
}
}
export const addCarouselItem = (item) => {
  return (dispatch, getState) => {
    const carouselItem = {
      ...item,
      addedBy: usermetadata(auth.currentUser.uid),
      addedAt: new Date(),
      status: true,
      position: 'undefined'
    }
    const carouselItemDetails = {
      ...item,
      addedBy: {
        firstName: getState().auth?.user?.firstName, 
        lastName: getState().auth?.user?.lastName,
        email: getState().auth?.user?.email,
        photoURL: getState().auth?.user?.photoURL,
        uid: getState().auth?.user?.id,
        phone: getState().auth?.user?.phoneNumber,
      },
      addedAt: new Date(),
      status: true,
      position: 'undefined'
    }
    dispatch({ type: 'ADD_CAROUSEL_ITEM_REQUEST'});
      addDoc(carouselRef(), {...carouselItem})
      .then(() =>{
        dispatch(notify({ status: "success", message: 'Carousel Item added Successfully.' }));
        dispatch({ type: 'ADD_CAROUSEL_ITEM_SUCCESS', payload: carouselItemDetails });
      })
      .catch((error) => {
        dispatch({ type: 'ADD_CAROUSEL_ITEM_ERROR', payload: error.message });
        dispatch(
          notify({ id: "error", message: error.message, status: "error" })
        );
      });
  }
}
export const fetchCarouselItems = () => {
  return async dispatch => {
    try {
      dispatch({ type: 'FETCH_CAROUSEL_ITEMS_REQUEST' });

      const carouselSnapshot = await getDocs(query(carouselRef(), orderBy('addedAt')));
      const promises = carouselSnapshot.docs.map(async item => {
        const itemData = item.data();
        const userDataRef = await getDoc(itemData.addedBy);
        const userData = userDataRef.data();
        return { ...itemData, addedBy: userData, id: item.id };
      });

      const carouselList = await Promise.all(promises);
      dispatch({ type: 'FETCH_CAROUSEL_ITEMS_SUCCESS', payload: carouselList });
    } catch (error) {
      dispatch({ type: 'FETCH_CAROUSEL_ITEMS_ERROR', payload: error.message });
      dispatch(
        notify({ id: "error", message: error.message, status: "error" })
      );
    }
  }
}
export const editCarouselItem = (item) => {
  return  (dispatch) => {
    const {addedBy, lastUpdatedBy,rowStatus, ...carouselItem } = item;
    carouselItem.updatedAt = new Date();
    updateDoc(carouselRefById(item.id), {
      ...carouselItem,
      lastUpdatedBy: usermetadata(auth.currentUser.uid),
    }).then(()=>{
      dispatch({
        type: 'EDIT_CAROUSEL_ITEM_SUCCESS',
        payload: item,
      });

      dispatch(notify({ status: 'success', message: 'Carousel Item updated successfully.' }));

    })
    .catch((error ) => {
      dispatch({
        type: 'EDIT_CAROUSEL_ITEM_ERROR',
        payload: error.message,
      });

      dispatch(notify({ id: 'error', message: error.message, status: 'error' }));

    })
    
  };
};

export const deleteCarouselItem = (item) => {
  return async (dispatch) => {
      dispatch({ type: 'DELETE_CAROUSEL_ITEM_REQUEST' });
      deleteDoc(carouselRefById(item.id)).then(() => {
        dispatch({
        type: 'DELETE_CAROUSEL_ITEM_SUCCESS',
        payload: item.id,
      });
      dispatch(notify({ status: 'success', message: 'Carousel Item deleted successfully.' }));
      })
      .catch((error) =>{
        dispatch({
        type: 'DELETE_CAROUSEL_ITEM_ERROR',
        payload: error.message,
      });
      dispatch(notify({ id: 'error', message: error.message, status: 'error' }));
      })    
  };
};
export const uploadCarouselFiles = (file) => {
    return (dispatch) => {
      var imageFullPath = carouselFilesUploadPath(file.name);
      const uploadprogress = uploadBytesResumable(imageFullPath, file);
  
      uploadprogress.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          dispatch(handleCarouselFileUploadProgress(progress));
        },
        (error) => {
          dispatch(notify({ status: "error", message: error.message }));
        },
        () => {
          getDownloadURL(uploadprogress.snapshot.ref)
            .then((url) => {
              dispatch(handleCarouselFileUpload(url));
              dispatch(notify({ status: "success", message: 'File uploaded Successfully.' }));
            })
            .catch((error) => {
              dispatch(notify({ status: "error", message: error.message }));
            });
        }
      );
    };
};
export const removeCarouselFiles = (file) => {
  return (dispatch) => {
    var imageFullPath = carouselFilesUploadPath(file.name);
    deleteObject(fileRef(imageFullPath)).then(()=>{
      dispatch(handleCarouselFileRemove())
      dispatch(notify({message: 'File Successfully Removed ', status: 'success'}))
    })
    .catch((error) => {
      dispatch(notify({ status: "error", message: error.message }));
    });
  }
}