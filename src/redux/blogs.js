import {
  TRENDING_BLOGS_REQUEST,
  TRENDING_BLOGS_FAILURE,
  TRENDING_BLOGS_SUCCESS,
  APPEND_BLOGS,
  BLOGS_LIMIT_SET,
  GET_TOTAL_BLOGS_REQUEST,
  GET_TOTAL_BLOGS_FAILURE,
  GET_TOTAL_BLOGS_SUCCESS,
  GET_BLOGS_REQUEST,
  GET_BLOGS_FAILURE,
  GET_BLOGS_SUCCESS,
  HIDE_MORE_BUTTON,
  SEARCH_BLOGS_REQUEST,
  SEARCH_BLOGS_FAILURE,
  SEARCH_BLOGS_SUCCESS,
  GET_BLOG_DETAILS_REQUEST,
  GET_BLOG_DETAILS_FAILURE,
  GET_BLOG_DETAILS_SUCCESS,
  ADD_BLOG_REQUEST,
  ADD_BLOG_FAILURE,
  ADD_BLOG_SUCCESS,
  EDIT_BLOG_REQUEST,
  EDIT_BLOG_FAILURE,
  EDIT_BLOG_SUCCESS,
  DELETE_BLOG_REQUEST,
  DELETE_BLOG_FAILURE,
  DELETE_BLOG_SUCCESS,
  ADD_DELETED_BLOG_REQUEST,
  ADD_DELETED_BLOG_FAILURE,
  ADD_DELETED_BLOG_SUCCESS,
  ADD_LIKE,
  ADD_COMMENT,
  REMOVE_LIKE,
  REMOVE_COMMENT,
  EDIT_COMMENT,
  SET_COMMENTS,
  SET_RELATED_BLOGS,
  SET_RECENT_BLOGS,
  FILE_UPLOAD_PROGRESS,
  PROFILE_IMAGE_CHANGE,

  SET_TAGS_REQUEST,
  SET_TAGS_SUCCESS,
  SET_TAGS_FAILURE,
  SET_CATEGORIES_REQUEST,
  SET_CATEGORIES_SUCCESS,
  SET_CATEGORIES_FAILURE,
  SET_BLOG_AUTHOR,
  GET_SENT_TO_REVIEW_TOTAL_BLOGS_REQUEST,
  GET_SENT_TO_REVIEW_TOTAL_BLOGS_FAILURE,
  GET_SENT_TO_REVIEW_TOTAL_BLOGS_SUCCESS,
  REDIRECT_REQUEST,
  REDIRECT_SUCCESS,
  REDIRECT_FAILURE,
  CLEAR_REDIRECT,
} from "../reducers/types";
import { auth, db, firestoreDb, storage, analytics, blogCollection, userRef, blogDoc, blogReviewDoc, notificationById, commentsRef, commentsDocRef, usernameRef, blogFilesUploadPath, fileRef, usermetadata, categories } from "../Firebase/firebase";
import {
  getDocs,
  getDoc,
  updateDoc,
  collection,
  doc,
  writeBatch,
  query,
  where,
  onSnapshot,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  orderBy,
  addDoc,
  limit,
  startAfter,
  deleteDoc,
  setDoc,
  Timestamp,
  runTransaction,
  endAt,
  endBefore,
  limitToLast,

} from "firebase/firestore";

import { notify, dismissNotification } from "reapop";
import { faker } from '@faker-js/faker'
import { appendNotification } from "./notifications";
import { deleteObject, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { getUserMetaData } from "./auth";

// create a new write batch
const batch = writeBatch(firestoreDb);



export const trendingBlogsRequest = () => {
  return {
    type: TRENDING_BLOGS_REQUEST,
  };
};
export const trendingBlogsFailure = (error) => {
  return {
    type: TRENDING_BLOGS_FAILURE,
    payload: error,
  };
};
export const trendingBlogsSuccess = (info) => {
  return {
    type: TRENDING_BLOGS_SUCCESS,
    payload: info,
  };
};
export const totalBlogsRequest = () => {
  return {
    type: GET_TOTAL_BLOGS_REQUEST,
  };
};
export const totalBlogsFailure = (error) => {
  return {
    type: GET_TOTAL_BLOGS_FAILURE,
    payload: error,
  };
};
export const totalBlogsSuccess = (list, tags, count) => {
  return {
    type: GET_TOTAL_BLOGS_SUCCESS,
    payload: { list, tags, count },
  };
};
export const totalSentToReviewBlogsRequest = () => {
  return {
    type: GET_SENT_TO_REVIEW_TOTAL_BLOGS_REQUEST,
  };
};
export const totalSentToReviewBlogsFailure = (error) => {
  return {
    type: GET_SENT_TO_REVIEW_TOTAL_BLOGS_FAILURE,
    payload: error,
  };
};
export const totalSentToReviewBlogsSuccess = (list, tags, count) => {
  return {
    type: GET_SENT_TO_REVIEW_TOTAL_BLOGS_SUCCESS,
    payload: { list, tags, count },
  };
};
export const blogsRequest = () => {
  return {
    type: GET_BLOGS_REQUEST,
  };
};
export const blogsFailure = (error) => {
  return {
    type: GET_BLOGS_FAILURE,
    payload: error,
  };
};
export const blogsSuccess = (blogs) => {
  return {
    type: GET_BLOGS_SUCCESS,
    payload: blogs,
  };
};
export const searchblogsRequest = () => {
  return {
    type: SEARCH_BLOGS_REQUEST,
  };
};
export const searchblogsFailure = (error) => {
  return {
    type: SEARCH_BLOGS_FAILURE,
    payload: error,
  };
};
export const searchblogsSuccess = (blogs) => {
  return {
    type: SEARCH_BLOGS_SUCCESS,
    payload: blogs,
  };
};
export const addBlogs = (blogs) => {
  return {
    type: APPEND_BLOGS,
    payload: blogs,
  };
};
export const blogsLimitSet = (blogslimit) => {
  return {
    type: BLOGS_LIMIT_SET,
    payload: blogslimit,
  };
};
export const hideMoreButton = (message) => {
  return {
    type: HIDE_MORE_BUTTON,
    payload: message,
  };
};

export const getBlogDetailsRequest = () => {
  return {
    type: GET_BLOG_DETAILS_REQUEST,
  };
};
export const getBlogDetailsFailure = (error) => {
  return {
    type: GET_BLOG_DETAILS_FAILURE,
    payload: error,
  };
};
export const getBlogDetailsSuccess = (blog) => {
  return {
    type: GET_BLOG_DETAILS_SUCCESS,
    payload: blog,
  };
};
export const addBlogRequest = () => {
  return {
    type: ADD_BLOG_REQUEST,
  };
};
export const addBlogFailure = (error) => {
  return {
    type: ADD_BLOG_FAILURE,
    payload: error,
  };
};
export const addBlogSuccess = (blog) => {
  return {
    type: ADD_BLOG_SUCCESS,
    payload: blog,
  };
};
export const editBlogRequest = () => {
  return {
    type: EDIT_BLOG_REQUEST,
  };
};
export const editBlogFailure = (error) => {
  return {
    type: EDIT_BLOG_FAILURE,
    payload: error,
  };
};
export const editBlogSuccess = (blog) => {
  return {
    type: EDIT_BLOG_SUCCESS,
    payload: blog,
  };
};
export const deleteBlogRequest = () => {
  return {
    type: DELETE_BLOG_REQUEST,
  };
};
export const deleteBlogFailure = (error) => {
  return {
    type: DELETE_BLOG_FAILURE,
    payload: error,
  };
};
export const deleteBlogSuccess = (blog) => {
  return {
    type: DELETE_BLOG_SUCCESS,
    payload: blog,
  };
};
export const addDeleteBlogRequest = () => {
  return {
    type: ADD_DELETED_BLOG_REQUEST,
  };
};
export const addDeleteBlogFailure = (error) => {
  return {
    type: ADD_DELETED_BLOG_FAILURE,
    payload: error,
  };
};
export const addDeleteBlogSuccess = (blog) => {
  return {
    type: ADD_DELETED_BLOG_SUCCESS,
    payload: blog,
  };
};
export const addLike = (blog) => {
  return {
    type: ADD_LIKE,
    payload: blog,
  };
};
export const addComment = (comment) => {
  return {
    type: ADD_COMMENT,
    payload: comment,
  };
};
export const removeLike = (blog) => {
  return {
    type: REMOVE_LIKE,
    payload: blog,
  };
};
export const removeComment = (comment) => {
  return {
    type: REMOVE_COMMENT,
    payload: comment,
  };
};
export const editComment = () => {
  return {
    type: EDIT_COMMENT,
  };
};
export const setComments = (comments) => {
  return {
    type: SET_COMMENTS,
    payload: comments,
  };
};
export const setTagsRequest = () => {
  return {
    type: SET_TAGS_REQUEST,
  };
};
export const setTagsSuccess = (tags) => {
  return {
    type: SET_TAGS_SUCCESS,
    payload: tags,
  };
};
export const setTagsFailure = (error) => {
  return {
    type: SET_TAGS_FAILURE,
    payload: error,
  };
};
export const setCategoriesRequest = () => {
  return {
    type: SET_CATEGORIES_REQUEST,
  };
};
export const setCategoriesSuccess = (categories) => {
  return {
    type: SET_CATEGORIES_SUCCESS,
    payload: categories,
  };
};
export const setCategoriesFailure = (error) => {
  return {
    type: SET_CATEGORIES_FAILURE,
    payload: error,
  };
};
export const setRelatedBlogs = (blogs) => {
  return {
    type: SET_RELATED_BLOGS,
    payload: blogs,
  };
};
export const setRecentBlogs = (blogs) => {
  return {
    type: SET_RECENT_BLOGS,
    payload: blogs,
  };
};

export const handleUploadProgress = (progress) => {
  return {
    type: FILE_UPLOAD_PROGRESS,
    payload: progress,
  };
};

export const handleProfileImageChange = (url) => {
  return {
    type: PROFILE_IMAGE_CHANGE,
    payload: url,
  };
};
export const getBlogAuthor = (user) => {
  return {
    type: SET_BLOG_AUTHOR,
    payload: user
  }
}
export const redirectRequest = () => {
  return { type: REDIRECT_REQUEST };
};
export const redirectSuccess = (link) => {
  return {
    type: REDIRECT_SUCCESS,
    payload: link,
  };
};
export const redirectFailure = (link) => {
  return {
    type: REDIRECT_FAILURE,
    payload: link,
  };
};
export const redirectReset = () => {
  return {
    type: CLEAR_REDIRECT,
  };
};

//Actions

//Blogs
export const getRelatedBlogs = (blog) => {
  return (dispatch) => {
    const relatedBlogsQuery = query(blogCollection(), where("deleted", "==", false), where("approved", "==", false), where("tags", "array-contains-any", blog?.tags, limit(3)));
    getDocs(relatedBlogsQuery)
      .then((relatedBlogSnapshot) => {
        dispatch(
          setRelatedBlogs(
            relatedBlogSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
          )
        );
      })
      .catch((error) => {
        dispatch(notify({ status: "error", message: error.message }));
      });
  };
};

export const getRecentBlogs = () => {
  return (dispatch) => {
    const blogRef = collection(firestoreDb, "blogs");
    const recentBlogs = query(blogRef, where("deleted", "==", false), where("approved", "==", false), orderBy("timestamp", "desc"), limit(5));
    getDocs(recentBlogs)
      .then((docSnapshot) => {
        dispatch(
          setRecentBlogs(
            docSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          )
        );
      })
      .catch((error) => {
        dispatch(notify({ status: "error", message: error.message }));
      });
  };
};

export const getTrendingBlogs = () => {
  return async (dispatch) => {
    try {
      dispatch(trendingBlogsRequest());
      const trendingblogsSnapshot = await getDocs(query(blogCollection(), where("trending", "==", true), where("deleted", "==", false), where("approved", "==", true), limit(50)));
      const promises = trendingblogsSnapshot.docs.map(async item => {
        const itemData = item.data();
        const userDataRef = await getDoc(itemData.postedBy);
        const userData = userDataRef.data();
        return { ...itemData, postedBy: userData, id: item.id };
      });
      const blogsList = await Promise.all(promises);
      dispatch(trendingBlogsSuccess(blogsList));

    } catch (error) {
      dispatch(trendingBlogsFailure(error));
      dispatch(
        notify({ id: "error", message: error.message, status: "error" })
      );
    };
  };
};
export const searchBlogs = (searchQuery) => {
  return (dispatch) => {
    dispatch(searchblogsRequest());
    const searchTitleQuery = query(blogCollection(), where("deleted", "==", false), where("approved", "==", false), where("title", ">=", searchQuery));
    const searchUserQuery = query(blogCollection(), where("deleted", "==", false), where("approved", "==", false), where("postedBy.displayName", ">=", searchQuery));
    const searchTagQuery = query(blogCollection(), where("deleted", "==", false), where("approved", "==", false), where("tags", "array-contains", searchQuery));

    const searchTitleBlogsPromise = getDocs(searchTitleQuery)
      .then((titleSnapshot) => {
        const searchTitleBlogs = [];
        titleSnapshot.forEach((doc) => {
          searchTitleBlogs.push({ id: doc.id, ...doc.data() });
        });
        return searchTitleBlogs;
      })
      .catch((error) => {
        dispatch(notify({ status: "error", message: error.message }));
        return [];
      });
    const searchUserBlogsPromise = getDocs(searchUserQuery)
      .then((userSnapshot) => {
        const searchUserBlogs = [];
        userSnapshot.forEach((doc) => {
          searchUserBlogs.push({ id: doc.id, ...doc.data() });
        });
        return searchUserBlogs;
      })
      .catch((error) => {
        dispatch(notify({ status: "error", message: error.message }));
        return [];
      });

    const searchTagBlogsPromise = getDocs(searchTagQuery)
      .then((tagSnapshot) => {
        const searchTagBlogs = [];
        tagSnapshot.forEach((doc) => {
          searchTagBlogs.push({ id: doc.id, ...doc.data() });
        });
        return searchTagBlogs;
      })
      .catch((error) => {
        dispatch(notify({ status: "error", message: error.message }));
        return [];
      });

    Promise.all([searchTitleBlogsPromise, searchTagBlogsPromise, searchUserBlogsPromise])
      .then(([searchTitleBlogs, searchTagBlogs, searchUserBlogs]) => {
        // console.log("title: ",searchTitleBlogs,"Tags:", searchTagBlogs,"Users:", searchUserBlogs);
        const combinedSearchBlogs = searchTitleBlogs.concat(searchTagBlogs, searchUserBlogs);
        if (combinedSearchBlogs.length > 0) {
          dispatch(searchblogsSuccess(combinedSearchBlogs));
        } else {
          dispatch(searchblogsFailure("No blogs found"));
        }
      });
  };
};

export const getTotalBlogs = () => {
  let unsubscribe;
  return (dispatch) => {
    dispatch(totalBlogsRequest());
    const ref = collection(firestoreDb, "blogs");
    const q = query(ref, where("deleted", "==", false), where("approved", "==", true));
    unsubscribe = onSnapshot(q, (snapshot) => {
      let list = [];
      let tags = [];
      let count = 0;
      snapshot.docs.forEach((doc) => {
        tags.push(...doc.get("tags"));
        list.push({ id: doc.id, ...doc.data() });
      });
      count = snapshot.size;
      dispatch(totalBlogsSuccess(list, tags, count));
    }, (error) => {
      dispatch(totalBlogsFailure(error));
      dispatch(notify({ message: `${error?.message}`, status: "warning" }));
    });
    return () => unsubscribe();
  };
};

export const getBlogs = () => {
  return async (dispatch) => {
    try {
      dispatch(blogsRequest());
      const blogsSnapshot = await getDocs(query(blogCollection(), where("deleted", "==", false), where("approved", "==", true), orderBy("timestamp", "desc"), limit(10)));
      const lastDocument = blogsSnapshot.docs[blogsSnapshot.docs.length - 1];
      dispatch(blogsLimitSet(lastDocument));
      const promises = blogsSnapshot.docs.map(async item => {
        const itemData = item.data();
        const userDataRef = await getDoc(itemData.postedBy);
        const userData = userDataRef.data();
        return { ...itemData, postedBy: userData, id: item.id };
      });
      const blogsList = await Promise.all(promises);
      dispatch(blogsSuccess(blogsList));

    } catch (error) {
      dispatch(notify({ message: `${error?.message}`, status: "warning" }));
      dispatch(blogsFailure(error));
    };

  };
};

export const fetchMoreBlogs = () => {
  return (dispatch, getState) => {
    const limits = getState()?.blogs.limit;
    const blogRef = collection(firestoreDb, "blogs");
    const nextFour = query(blogRef, where("deleted", "==", false), where("approved", "==", false), orderBy("timestamp"), startAfter(limits), limit(10));
    getDocs(nextFour)
      .then((docSnapshot) => {
        const blogs = [];
        const isCollectionEmpty = docSnapshot.size === 0;
        if (!isCollectionEmpty) {
          docSnapshot.docs.forEach((doc) => {
            blogs.push({ id: doc.id, ...doc.data() });
          });
          dispatch(addBlogs(blogs));
          dispatch(
            blogsLimitSet(docSnapshot.docs[docSnapshot.docs.length - 1])
          );
        } else {
          dispatch(hideMoreButton(true));
          dispatch(
            notify({ message: "No more blogs to display", status: "warning" })
          );
        }
      })
      .catch((error) => {
        dispatch(notify({ message: `${error?.message}`, status: "warning" }));
      });
  };
};

export const getBlogAuthorDetails = (uid) => {
  return dispatch => {
    getDoc(userRef(uid))
      .then((info) => {
        if (info.exists()) {
          const data = info.data();
          const keysToRemove = ['accessToken', 'createdAt',
            'creationTime',
            'emailVerified',
            'lastLoginAt',
            'lastUpdatedBy',
            'lastSignInTime',
            'permissions',
            'roles',
            'providerData'];
          Object.keys(data).forEach(key => {
            if (keysToRemove.includes(key)) {
              delete data[key];
            }
          });
          dispatch(getBlogAuthor(data));
        }
      })
      .catch((error) => {
        dispatch(
          notify({ id: "error", message: error.message, status: "error" })
        );
      });
  }
}
const getLikesData = async (transaction, likeRefs) => {
  const likePromises = likeRefs.map(async (likeRef) => {
    const userDoc = await transaction.get(likeRef); // Assuming you have a userRef field in your like object
    return userDoc.data();
  });

  return Promise.all(likePromises);
};
export const getBlogDetails = (id) => {
  return async (dispatch) => {
    dispatch(getBlogDetailsRequest());
    const blogRef = blogDoc(id);

    try {

      await runTransaction(blogRef.firestore, async (transaction) => {
        const blogDetailsSnapshot = await transaction.get(blogDoc(id));
        if (!blogDetailsSnapshot.exists()) {
          throw new Error('Blog post does not exist.');
        }
        const blogDetails = blogDetailsSnapshot.data();


        const likesData = blogDetails.likes ? await getLikesData(transaction, blogDetails.likes) : [];

        const userDataRef = await transaction.get(blogDetails.postedBy);
        const userData = userDataRef.data();

        dispatch(getBlogDetailsSuccess({ ...blogDetails, likes: likesData, postedBy: userData, id: blogDetails.id }));

      });
    }
    catch (error) {
      dispatch(notify({ message: `${error?.message}`, status: "error" }));
      dispatch(getBlogDetailsFailure(error));
    };
  };
};
export const getReviewBlogDetails = (id) => {
  return (dispatch) => {
    dispatch(getBlogDetailsRequest());
    getDoc(blogReviewDoc(id))
      .then((blog) => {
        const blogDetails = blog?.data();
        dispatch(getBlogAuthorDetails(blogDetails?.postedBy?.uid));
        dispatch(getBlogDetailsSuccess(blogDetails));
      })
      .catch((error) => {
        dispatch(notify({ message: `${error?.message}`, status: "warning" }));
        dispatch(getBlogDetailsFailure(error));
      });
  };
};
export const addBlog = (blog) => {
  return (dispatch, getState) => {
    const blogDetails = {
      ...blog,
      id: faker.string.uuid(),
      deleted: false,
      likes: [],
      comments: [],
      timestamp: Timestamp.now(),
      ipData: getState().auth.ipData,
      postedBy: usermetadata(auth.currentUser.uid),
    };
    dispatch(addBlogRequest());
    setDoc(blogDoc(blogDetails?.id), blogDetails)
      .then(() => {
        dispatch(
          notify({ message: "Blog posted successfully", status: "success" })
        );
        dispatch(addBlogSuccess(blogDetails.id));
        dispatch(redirectRequest());
        dispatch(redirectSuccess({ location: `/blogs/view/${blogDetails.id}` }));
        dispatch(redirectReset());
      })
      .catch((error) => {
        dispatch(notify({ message: `${error?.message}`, status: "warning" }));
        dispatch(addBlogFailure(error));
      });
  };
};
export const addFakeBlogs = (blogs) => {
  return dispatch => {
    const batch = writeBatch(firestoreDb);
    blogs?.forEach((blog) => {
      batch.set(blogDoc(blog?.id), blog)
    })
    batch.commit().then(() => {
      dispatch(notify({ status: "success", message: "Fake data added successfully." }))
    })
  }
}
export const removeFakeBlogs = () => {
  return (dispatch, getState) => {
    const blogs = getState().blogs.totalBlogs?.list
    const batch = writeBatch(firestoreDb);
    blogs?.forEach((blog) => {
      if (blog?.isFake) {
        batch.delete(blogDoc(blog?.id))
      }
    })
    batch.commit().then(() => {
      dispatch(notify({ status: "success", message: "Fake data deleted successfully." }))
    })
  }
}
// export const 
export const sentBlogToReview = (blog) => {
  return (dispatch, getState) => {
    const id = faker.string.uuid();
    const blogDetails = {
      ...blog,
      id: id,
      deleted: false,
      timestamp: Timestamp.now(),
      postedBy: {
        firstName: getState().authState?.user?.firstName,
        lastName: getState().authState?.user?.lastName,
        email: getState().authState?.user?.email,
        photoURL: getState().authState?.user?.photoURL,
        uid: getState().authState?.user?.id,
        phone: getState().authState?.user?.phoneNumber,
        timestamps: Timestamp.now(),
      },
    };
    const notification = {
      users: [],
      id: id,
      read: false,
      toAll: false,
      toAllAdmins: true,
      title: `A new blog posted by ${getState().authState?.user?.firstName + ' ' + getState().authState?.user?.lastName}.`,
      type: null,
      blogId: blogDetails?.id,
      shortDescription: `A new blog posted by ${getState().authState?.user?.firstName + ' ' + getState().authState?.user?.lastName}.`,
      Description: null,
      timestamp: Timestamp.now(),
      postedBy: {
        firstName: getState().authState?.user?.firstName,
        lastName: getState().authState?.user?.lastName,
        email: getState().authState?.user?.email,
        photoURL: getState().authState?.user?.photoURL,
        uid: getState().authState?.user?.id,
        phone: getState().authState?.user?.phoneNumber,
        timestamps: Timestamp.now(),
      },
    }
    dispatch(addBlogRequest());
    setDoc(blogReviewDoc(blogDetails?.id), blogDetails)
      .then((data) => {
        dispatch(appendNotification(notification));
        dispatch(
          notify({ message: "Blog was sent to review", status: "success" })
        );
        dispatch(addBlogSuccess(data));
        dispatch(redirectRequest());
        dispatch(redirectSuccess({ location: `/blogs/post/new-blog` }));
        dispatch(redirectReset());
      })
      .catch((error) => {
        dispatch(notify({ message: `${error?.message}`, status: "warning" }));
        dispatch(addBlogFailure(error));
      });
  };
};
export const approveBlog = (blog) => {
  return (dispatch, getState) => {
    batch.set(blogDoc(blog?.id), {
      ...blog,
      timestamp: Timestamp.now(),
      approvedBy: {
        firstName: getState().authState?.user?.firstName,
        lastName: getState().authState?.user?.lastName,
        email: getState().authState?.user?.email,
        photoURL: getState().authState?.user?.photoURL,
        uid: getState().authState?.user?.id,
        phone: getState().authState?.user?.phoneNumber,
        timestamps: Timestamp.now(),
      },
    });
    batch.update(blogReviewDoc(blog?.id), {
      deleted: true
    });
    batch.update(notificationById(blog?.id), {
      read: true
    });
    batch.set(notificationById(faker.string.uuid()), {
      shortDescription: `Congratulations, Your blog was approved!.`,
      title: `Your blog has been approved!.`,
      users: [blog?.postedBy?.uid],
      toAll: false,
      deleted: false,
      toAllAdmins: false,
      timestamp: Timestamp.now(),
      approvedBy: {
        firstName: getState().authState?.user?.firstName,
        lastName: getState().authState?.user?.lastName,
        email: getState().authState?.user?.email,
        photoURL: getState().authState?.user?.photoURL,
        uid: getState().authState?.user?.id,
        phone: getState().authState?.user?.phoneNumber,
        timestamps: Timestamp.now(),
      },
    });
    batch.commit().then(() => {
      dispatch(notify({ message: "Blog has been approved!.", status: "success" }));
    })
      .catch((error) => {
        dispatch(notify({ message: `${error?.message}`, status: "error" }));
      })
  }
}
export const getSentBlogsToReview = () => {
  let unsubscribe;
  return (dispatch) => {
    dispatch(totalSentToReviewBlogsRequest());
    const ref = collection(firestoreDb, "review");
    const q = query(ref, where("deleted", "==", false));
    unsubscribe = onSnapshot(q, (snapshot) => {
      let list = [];
      let tags = [];
      let count = 0;
      snapshot.docs.forEach((doc) => {
        tags.push(...doc.get("tags"));
        list.push({ id: doc.id, ...doc.data() });
      });
      count = snapshot.size;
      dispatch(totalSentToReviewBlogsSuccess(list, tags, count));
    }, (error) => {
      dispatch(totalSentToReviewBlogsFailure(error));
      dispatch(notify({ message: `${error?.message}`, status: "warning" }));
    });
    return () => unsubscribe();
  };
};
export const editBlog = (id, blog) => {
  return (dispatch, getState) => {
    const blogDetails = {
      ...blog,
      lastUpdatedBy: {
        firstName: getState().authState?.user?.firstName,
        lastName: getState().authState?.user?.lastName,
        email: getState().authState?.user?.email,
        photoURL: getState().authState?.user?.photoURL,
        uid: getState().authState?.user?.id,
        phone: getState().authState?.user?.phoneNumber,
        timestamps: Timestamp.now(),
      },
    };
    dispatch(editBlogRequest());
    updateDoc(blogDoc(id), blogDetails)
      .then((data) => {
        dispatch(
          notify({
            message: `Blog updated successfully ${id}`,
            status: "success",
          })
        );
        dispatch(editBlogSuccess(data));
        dispatch(redirectRequest());
        dispatch(
          redirectSuccess({ location: `/blog/view/${id}`, state: data?.id })
        );
        dispatch(redirectReset());
      })
      .catch((error) => {
        dispatch(notify({ message: `${error?.message}`, status: "warning" }));
        dispatch(editBlogFailure(error));
      });
  };
};
export const deleteBlog = (id) => {
  return (dispatch, getState) => {
    dispatch(deleteBlogRequest());
    updateDoc(blogDoc(id), { deleted: true })
      .then(() => {
        dispatch(deleteBlogSuccess(id));

        dispatch(
          notify({
            message: "Blog was deleted successfully.",
            status: "success",
          })
        );
      })
      .catch((error) => {
        dispatch(notify({ message: `${error?.message}`, status: "warning" }));
        dispatch(deleteBlogFailure(error));
      });
    dispatch(getTrendingBlogs());
    dispatch(getTotalBlogs());
    dispatch(getBlogs());
  };
};
export const handleLike = (id) => {
  return async (dispatch, getState) => {
    const blogRef = blogDoc(id);

    try {
      // Use a transaction to update the likes array
      await runTransaction(blogRef.firestore, async (transaction) => {
        const doc = await transaction.get(blogRef);
        const blogDetails = doc.data();

        if (!doc.exists()) {
          throw new Error('Blog post does not exist.');
        }
        const userLike = usermetadata(auth.currentUser.uid);
        const usermetaData = (await transaction.get(usermetadata(auth.currentUser.uid))).data();
        // Check if the user already liked the post
        const userLikedIndex = blogDetails?.likes?.find((like) => like.id === auth.currentUser.uid);

        if (!userLikedIndex) {
          // User has not liked the post, add their like
          transaction.update(blogRef, {
            likes: arrayUnion(userLike),
          });
          dispatch(addLike(usermetaData)); // Add like to Redux state
          dispatch(notify({ message: 'You liked this post', status: 'success' }));
        } else {
          // User has already liked the post, remove their like
          transaction.update(blogRef, {
            likes: arrayRemove(userLike),
          });
          dispatch(removeLike(usermetaData)); // Remove like from Redux state
          dispatch(notify({ message: 'You disliked this post', status: "success" }));
        }
      });
    } catch (error) {
      dispatch(notify({ message: `${error?.message}`, status: 'warning' }));
    }
  };
};
// export const handleLike = (id) => {
//   return (dispatch, getState) => {
//     getDoc(blogDoc(id)).then((doc) => {
//       const blog = doc.data();
//       if (blog) {
//         const likes = blog?.likes;
//         const filter = likes?.filter(
//           (like) => like.uid === auth?.currentUser?.uid
//         );
//         if (filter?.length === 0) {
//           updateDoc(blogDoc(id), {
//             likes: arrayUnion({
//               firstName: getState().authState?.user?.firstName, 
//               lastName: getState().authState?.user?.lastName,
//               email: getState().authState?.user?.email,
//               photoURL: getState().authState?.user?.photoURL,
//               uid: getState().authState?.user?.id,
//               phone: getState().authState?.user?.phoneNumber,
//               // timestamps: Timestamp.now()
//             }),
//           })
//             .then(() => {
//               getDoc(blogDoc(id)).then((doc) => {
//                 dispatch(addLike(doc.data()));
//                 dispatch(
//                   notify({ message: "You liked this post", status: "success" })
//                 );
//               });
//             })
//             .catch((error) => {
//               dispatch(
//                 notify({ message: `${error?.message}`, status: "warning" })
//               );
//             });
//         } else {
//           updateDoc(blogDoc(id), {
//             likes: arrayRemove({
//               firstName: getState().authState?.user?.firstName, 
//               lastName: getState().authState?.user?.lastName,
//               email: getState().authState?.user?.email,
//               photoURL: getState().authState?.user?.photoURL,
//               uid: getState().authState?.user?.id,
//               phone: getState().authState?.user?.phoneNumber,
//               // timestamps: Timestamp.now()
//             }),
//           })
//             .then(() => {
//               getDoc(blogDoc(id)).then((doc) => {
//                 dispatch(removeLike(doc.data()));
//                 dispatch(
//                   notify({
//                     message: "You unliked this post",
//                     status: "success",
//                   })
//                 );
//               });
//             })
//             .catch((error) => {
//               dispatch(
//                 notify({ message: `${error?.message}`, status: "warning" })
//               );
//             });
//         }
//       }
//     });
//   };
// };
export const setBlogComments = (postId) => {
  return (dispatch) => {
    getDocs(commentsRef(postId))
      .then((querySnapshot) => {
        const commentsData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          comId: doc.id,
        }));
        dispatch(setComments(commentsData));
      })
      .catch((error) => {
        dispatch(notify({ message: `${error?.message}`, status: "warning" }));
      });
  };
};
export const handleAddComment = (postId, data) => {
  return (dispatch) => {
    const commentData = {
      userId: data.userId,
      avatarUrl: data.avatarUrl,
      userProfile: data.userProfile,
      fullName: data.fullName,
      replies: [],
      text: data.text,
      comId: data.comId,
      timestamps: Timestamp.now(),
    };
    setDoc(commentsDocRef(postId, data?.comId), commentData).then(() => {
      dispatch(addComment(data));
      dispatch(
        notify({ message: "Comment posted successfully", status: "success" })
      );
    });
  };
};
export const handleEditComment = (postId, data) => {
  return (dispatch, getState) => {
    const { comId, parentOfEditedCommentId } = data;
    const newCommentData = { text: data.text };
    const comments = getState().blogs.comments;
    if (parentOfEditedCommentId === undefined) {
      const comDocRef = doc(firestoreDb, `blogs/${postId}/comments`, comId);
      getDoc(comDocRef)
        .then((comDoc) => {
          if (comDoc.exists()) {
            updateDoc(comDocRef, newCommentData);
            const updatedComments = comments.map((com) => {
              if (com.comId === comId) {
                return { ...com, text: data.text };
              } else {
                return com;
              }
            });
            dispatch(setComments(updatedComments));
            dispatch(
              notify({
                message: "Edited comment posted successfully.",
                status: "success",
              })
            );
          }
        })
        .catch((error) => {
          dispatch(notify({ status: "error", message: error.message }));
        });
    } else {
      const parentDocRef = doc(
        firestoreDb,
        `blogs/${postId}/comments`,
        parentOfEditedCommentId
      );
      getDoc(parentDocRef)
        .then((parentDoc) => {
          if (parentDoc.exists()) {
            const parentData = parentDoc.data();
            const updatedReplies = parentData.replies.map((reply) => {
              if (reply.comId === comId) {
                return { ...reply, newCommentData };
              } else {
                return reply;
              }
            });
            updateDoc(parentDocRef, { replies: updatedReplies });
            dispatch(
              notify({
                message: "Edited comment posted successfully.",
                status: "success",
              })
            );
          }
        })
        .catch((error) => {
          dispatch(notify({ status: "error", message: error.message }));
        });
    }
  };
};
export const handleDeleteComment = (postId, data) => {
  return (dispatch, getState) => {
    const { comIdToDelete, parentOfDeleteId } = data;
    const comments = getState().blogs.comments;
    if (parentOfDeleteId === undefined) {
      const comDocRef = doc(
        firestoreDb,
        `blogs/${postId}/comments`,
        comIdToDelete
      );
      getDoc(comDocRef)
        .then((comDoc) => {
          if (comDoc.exists()) {
            deleteDoc(comDocRef)
              .then(() => {
                dispatch(
                  notify({
                    message: "Comment deleted successfully",
                    status: "success",
                  })
                );
                const updatedComments = comments.filter(
                  (com) => com.comId !== comIdToDelete
                );
                dispatch(setComments(updatedComments));
              })
              .catch((error) => {
                dispatch(notify({ status: "error", message: error.message }));
              });
          }
        })
        .catch((error) => {
          dispatch(notify({ status: "error", message: error.message }));
        });
    } else {
      const parentDocRef = doc(
        firestoreDb,
        `blogs/${postId}/comments`,
        parentOfDeleteId
      );
      getDoc(parentDocRef)
        .then((parentDoc) => {
          if (parentDoc.exists()) {
            const parentData = parentDoc.data();
            const updatedReplies = parentData.replies.filter(
              (replyId) => replyId?.comId !== comIdToDelete
            );
            updateDoc(parentDocRef, { replies: updatedReplies })
              .then(() => {
                dispatch(
                  notify({
                    message: "Comment deleted successfully",
                    status: "success",
                  })
                );
              })
              .catch((error) => {
                dispatch(notify({ status: "error", message: error.message }));
              });
          }
        })
        .catch((error) => {
          dispatch(notify({ status: "error", message: error.message }));
        });
    }
  };
};
export const handleReplyComment = (postId, data) => {
  return (dispatch) => {
    const replyData = {
      repliedToCommentId: data.repliedToCommentId,
      userId: data.userId,
      avatarUrl: data.avatarUrl,
      userProfile: data.userProfile,
      fullName: data.fullName,
      replies: [],
      text: data.text,
      comId: data.comId,
      timestamps: Timestamp.now(),
    };
    updateDoc(
      doc(
        firestoreDb,
        `blogs/${postId}/comments/${data.parentOfRepliedCommentId === undefined
          ? data?.repliedToCommentId
          : data.parentOfRepliedCommentId
        }`
      ),
      "replies",
      arrayUnion(replyData)
    )
      .then(() => {
        dispatch(
          notify({
            message: "Reply to the Comment posted successfully",
            status: "success",
          })
        );
      })
      .catch((error) => {
        dispatch(notify({ status: "error", message: error.message }));
      });
  };
};
export const getTags = (tag) => {
  return async(dispatch) => {
    try{
      const blogsSnapshot = await getDocs(query(blogCollection(),where("tags", "array-contains", tag), where("deleted", "==", false), where("approved", "==", true), orderBy("timestamp", "desc"), limit(10)));
        const promises = blogsSnapshot.docs.map(async item => {
        const itemData = item.data();
        const userDataRef = await getDoc(itemData.postedBy);
        const userData = userDataRef.data();
        return { ...itemData, postedBy: userData, id: item.id };
      });
      const blogsList = await Promise.all(promises);
      dispatch( setTagsSuccess(blogsList));
    }
   catch (error) {
    dispatch(setTagsFailure(error));
    dispatch(notify({ message: `${error?.message}`, status: "warning" }));
   };
  };
};
export const getCategories = (category) => {
  return async(dispatch) => {
    try{
     dispatch(setCategoriesRequest());

    const blogsSnapshot = await getDocs(query(blogCollection(),where("category", "==", category), where("deleted", "==", false), where("approved", "==", true), orderBy("timestamp", "desc")));
        const promises = blogsSnapshot.docs.map(async item => {
        const itemData = item.data();
        const userDataRef = await getDoc(itemData.postedBy);
        const userData = userDataRef.data();
        return { ...itemData, postedBy: userData, id: item.id };
      });
      const blogsList = await Promise.all(promises);
      dispatch(setCategoriesSuccess(blogsList));
     
  } catch (error) {
    dispatch(notify({ message: `${error?.message}`, status: "warning" }));
     dispatch(setCategoriesFailure(error));
  };
  };
};
export const handleBlogFileUploadProgress = (progress) => {
  return {
    type: 'BLOGS_FILE_UPLOAD_PROGRESS',
    payload: progress,
  };
};
export const handleBlogsFileUpload = (url) => {
  return {
    type: 'HANDLE_BLOGS_FILE_UPLOAD',
    payload: url,
  };
};
export const handleBlogsFileRemove = () => {
  return {
    type: 'HANDLE_BLOGS_FILE_REMOVE',
  };
};
export const uploadBlogFiles = (file) => {
  return (dispatch) => {
    var imageFullPath = blogFilesUploadPath(file.name);
    const uploadprogress = uploadBytesResumable(imageFullPath, file);

    uploadprogress.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        dispatch(handleBlogFileUploadProgress(progress));
      },
      (error) => {
        dispatch(notify({ status: "error", message: error.message }));
      },
      () => {
        getDownloadURL(uploadprogress.snapshot.ref)
          .then((url) => {
            dispatch(handleBlogsFileUpload(url));
            dispatch(notify({ status: "success", message: 'File uploaded Successfully.' }));
          })
          .catch((error) => {
            dispatch(notify({ status: "error", message: error.message }));
          });
      }
    );
  };
};
export const removeBlogFiles = (file) => {
  return (dispatch) => {
    var imageFullPath = blogFilesUploadPath(file.name);
    deleteObject(fileRef(imageFullPath)).then(() => {
      dispatch(handleBlogsFileRemove())
      dispatch(notify({ message: 'File Successfully Removed ', status: 'success' }))
    })
      .catch((error) => {
        dispatch(notify({ status: "error", message: error.message }));
      });
  }
}
export const getBlogsCountRequest = () => {
  return {
    type: 'GET_BLOGS_COUNT_REQUEST',
  };
};
export const getBlogsCountSuccess = (data) => {
  return {
    type: 'GET_BLOGS_COUNT_SUCCESS',
    payload: data,
  };
};
export const getBlogsCountFailure = (error) => {
  return {
    type: 'GET_BLOGS_COUNT_FAILURE',
    payload: error,
  };
};
export const getPendingBlogsCountRequest = () => {
  return {
    type: 'GET_PENDING_BLOGS_COUNT_REQUEST',
  };
};
export const getPendingBlogsCountSuccess = (data) => {
  return {
    type: 'GET_PENDING_BLOGS_COUNT_SUCCESS',
    payload: data,
  };
};
export const getPendingBlogsCountFailure = (error) => {
  return {
    type: 'GET_PENDING_BLOGS_COUNT_FAILURE',
    payload: error,
  };
};
export const getLastWeekPostedBlogsCountRequest = () => {
  return {
    type: 'GET_LAST_WEEK_POSTED_BLOGS_COUNT_REQUEST',
  };
};
export const getLastWeekPostedBlogsCountSuccess = (data) => {
  return {
    type: 'GET_LAST_WEEK_POSTED_BLOGS_COUNT_SUCCESS',
    payload: data,
  };
};
export const getLastWeekPostedBlogsCountFailure = (error) => {
  return {
    type: 'GET_LAST_WEEK_POSTED_BLOGS_COUNT_FAILURE',
    payload: error,
  };
};
export const getBlogsCount = () => {
  return (dispatch) => {
    dispatch(getBlogsCountRequest());
    const usersQuery = query(blogCollection(), where("deleted", "==", false), where("approved", "==", true));
    getDocs(usersQuery)
      .then((snapshot) => {
        dispatch(getBlogsCountSuccess(snapshot.size));
      })
      .catch((error) => {
        dispatch(getBlogsCountFailure(error));
        dispatch(
          notify({ id: "error", message: error.message, status: "error" })
        );
      })
  };
};
export const getPendingBlogsCount = () => {
  return (dispatch) => {
    dispatch(getPendingBlogsCountRequest());
    const usersQuery = query(blogCollection(), where("deleted", "==", false), where("approved", "==", false));
    getDocs(usersQuery)
      .then((snapshot) => {
        dispatch(getPendingBlogsCountSuccess(snapshot.size));
      })
      .catch((error) => {
        dispatch(getPendingBlogsCountFailure(error));
        dispatch(
          notify({ id: "error", message: error.message, status: "error" })
        );
      })
  };
};
export const getLastWeekPostedBlogsCount = () => {
  return (dispatch) => {
    dispatch(getLastWeekPostedBlogsCountRequest());
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - 7);
    const usersQuery = query(blogCollection(), where("deleted", "==", false), where("approved", "==", true), 
    where('timestamp', '>=', start));
    getDocs(usersQuery)
      .then((snapshot) => {
        dispatch(getLastWeekPostedBlogsCountSuccess(snapshot.size));
      })
      .catch((error) => {
        dispatch(getLastWeekPostedBlogsCountFailure(error));
        dispatch(
          notify({ id: "error", message: error.message, status: "error" })
        );
      })
  };
};
export const addCategoryRequest = () => {
  return {
    type: 'ADD_CATEGORY_REQUEST',
  };
};
export const addCategorySuccess = (data) => {
  return {
    type: 'ADD_CATEGORY_SUCCESS',
    payload: data,
  };
};
export const addCategoryFailure = (error) => {
  return {
    type: 'ADD_CATEGORY_FAILURE',
    payload: error,
  };
};
export const addCategories = (info) => {
  return async dispatch => {
    console.log(info);
    const category = {
      ...info,
      addedBy: usermetadata(auth.currentUser.uid),
      timestamp: new Date(),
    }
    console.log(category);
    dispatch(addCategoryRequest())
    const isCheck = (await getDoc(categories())).exists();
    if (!isCheck) {
      setDoc(categories(), { categories: arrayUnion({ ...category }) })
        .then(() => {
          dispatch(addCategorySuccess(category));
          dispatch(
            notify({ message: "Category added successfully", status: "success" })
          );
        })
        .catch((error) => {
          dispatch(addCategoryFailure(error));
          dispatch(
            notify({ id: "error", message: error.message, status: "error" })
          );
        })
    }
    else {
      updateDoc(categories(), {
        categories: arrayUnion({ ...category })
      })
        .then(() => {
          dispatch(addCategorySuccess(category));
          dispatch(
            notify({ message: "Category added successfully", status: "success" })
          );
        })
        .catch((error) => {
          dispatch(addCategoryFailure(error));
          dispatch(
            notify({ id: "error", message: error.message, status: "error" })
          );
        })
    }

  }
}
export const removeCategoryRequest = () => {
  return {
    type: 'REMOVE_CATEGORY_REQUEST',
  };
};
export const removeCategorySuccess = (data) => {
  return {
    type: 'REMOVE_CATEGORY_SUCCESS',
    payload: data,
  };
};
export const removeCategoryFailure = (error) => {
  return {
    type: 'REMOVE_CATEGORY_FAILURE',
    payload: error,
  };
};
export const removeCategories = (info) => {
  return async dispatch => {

    dispatch(removeCategoryRequest())
    updateDoc(categories(), {
      categories: arrayRemove({ ...info })
    })
      .then(() => {
        dispatch(removeCategorySuccess(info));
        dispatch(
          notify({ message: "Category removed successfully", status: "success" })
        );
      })
      .catch((error) => {
        dispatch(removeCategoryFailure(error));
        dispatch(
          notify({ id: "error", message: error.message, status: "error" })
        );
      })
  }
}

export const getCategoriesDataRequest = () => {
  return {
    type: 'GET_CATEGORIES_DATA_REQUEST',
  };
};
export const getCategoriesDataSuccess = (data) => {
  return {
    type: 'GET_CATEGORIES_DATA_SUCCESS',
    payload: data,
  };
};
export const getCategoriesDataFailure = (error) => {
  return {
    type: 'GET_CATEGORIES_DATA_FAILURE',
    payload: error,
  };
};
export const getCategoriesData = () => {
  return async dispatch => {
    dispatch(getCategoriesDataRequest())
    getDoc(categories())
      .then((data) => {
        const categories = data.data();
        dispatch(getCategoriesDataSuccess(categories?.categories));

      })
      .catch((error) => {
        dispatch(getCategoriesDataFailure(error));
        dispatch(
          notify({ id: "error", message: error.message, status: "error" })
        );
      })
  }
}


export const fetchBlogsSuccess = (blogs, count) => ({
  type: 'FETCH_BLOGS_SUCCESS',
  payload: { blogs, count },
});

export const setLoading = (isLoading) => ({
  type: 'SET_LOADING',
  payload: isLoading,
});

export const updatePage = (page) => ({
  type: 'UPDATE_PAGE',
  payload: page,
});

export const setLastVisible = (docRef) => ({ // Action to set lastVisible
  type: 'SET_LAST_VISIBLE',
  payload: docRef,
});

export const fetchBlogs = () => async (dispatch) => {
  dispatch(setLoading(true));
  // Your existing logic for fetching blogs using Firebase
  const first = query(blogCollection(), where("deleted", "==", false), orderBy("title"), limit(10));
  const blogsSnapshot = await getDocs(first);
  const promises = blogsSnapshot.docs.map(async item => {
    const itemData = item.data();
    const userDataRef = await getDoc(itemData.postedBy);
    const userData = userDataRef.data();
    return { ...itemData, postedBy: userData, id: item.id };
  });
  const blogs = await Promise.all(promises);
  const count = blogsSnapshot.size;
  dispatch(fetchBlogsSuccess(blogs, count));
  dispatch(setLastVisible(blogsSnapshot.docs[blogsSnapshot.docs.length - 1])); // Set lastVisible
  dispatch(setLoading(false));
};

export const fetchMoreBlogs1 = () => async (dispatch, getState) => {
  const state = getState();
  const { lastVisible } = state.HeaderPageBlogs;

  dispatch(setLoading(true));
  const nextBlogsQuery = query(
    blogCollection(),
    orderBy("title"),
    where("deleted", "==", false),
    startAfter(lastVisible),
    limit(10)
  );
  const nextBlogsSnaphot = await getDocs(nextBlogsQuery);
  const promises = nextBlogsSnaphot.docs.map(async item => {
    const itemData = item.data();
    const userDataRef = await getDoc(itemData.postedBy);
    const userData = userDataRef.data();
    return { ...itemData, postedBy: userData, id: item.id };
  });
  const newBlogs = await Promise.all(promises);
  dispatch(fetchBlogsSuccess(newBlogs, nextBlogsSnaphot.size));
  dispatch(setLastVisible(nextBlogsSnaphot.docs[nextBlogsSnaphot.docs.length - 1])); // Update lastVisible
  dispatch(setLoading(false));
};
export const fetchPrevBlogs = () => async (dispatch, getState) => {
  const state = getState();
  const { currentPage, lastVisible, noOfPages } = state.HeaderPageBlogs;

  dispatch(setLoading(true));

  const limitData = noOfPages !== currentPage ? limit(10) : limitToLast(10);

  const prevBlogsQuery = query(
    blogCollection(),
    where("deleted", "==", false),
    orderBy("title"),
    // Use server-side logic to set the starting document  
    lastVisible ? endBefore(lastVisible) : limitToLast(10),
    limitData
  );

  const prevBlogsSnaphot = await getDocs(prevBlogsQuery);
  const promises = prevBlogsSnaphot.docs.map(async item => {
    const itemData = item.data();
    const userDataRef = await getDoc(itemData.postedBy);
    const userData = userDataRef.data();
    return { ...itemData, postedBy: userData, id: item.id };
  });
  const newBlogs = await Promise.all(promises);
  dispatch(fetchBlogsSuccess(newBlogs, prevBlogsSnaphot.size));
  dispatch(setLastVisible(prevBlogsSnaphot.docs[prevBlogsSnaphot.docs.length - 1])); // Update lastVisible
  dispatch(setLoading(false));
};

export const fetchBlogsByTimeRangeRequest = (timeRange) => ({
  type: 'FETCH_BLOGS_BY_TIME_RANGE_REQUEST',
  payload: timeRange,
});

export const fetchBlogsByTimeRangeSuccess = (blogs) => ({
  type: 'FETCH_BLOGS_BY_TIME_RANGE_SUCCESS',
  payload: blogs,
});

export const fetchBlogsByTimeRangeFailure = (error) => ({
  type: 'FETCH_BLOGS_BY_TIME_RANGE_FAILURE',
  payload: error,
});
const calculateStartDate = (timeRange) => {
  const today = new Date();
  const start = new Date(today);
  switch (timeRange) {
    case 'week':
      start.setDate(today.getDate() - 7);
      break;
    case 'month':
      start.setMonth(today.getMonth() - 1);
      break;
    case 'year':
      start.setFullYear(today.getFullYear() - 1);
      break;
    case 'today':
      start.setDate(today.getDate());
      break
    default:
      throw new Error(`Invalid time range: ${timeRange}`);
  }
  return Timestamp.fromDate(start);
};
export const getBlogsByTimeRange = (timeRange) => {
  return async dispatch => {
    try {

      const startDate = calculateStartDate(timeRange);
      dispatch(fetchBlogsByTimeRangeRequest(startDate));

      const endDate = Timestamp.fromDate(new Date());
      const blogsQuery = query(blogCollection(), where("deleted", "==", false), where('timestamp', '>=', startDate)
        , where('timestamp', '<', endDate), orderBy("timestamp"));
      const blogsSnapshot = await getDocs(blogsQuery);
      const promises = blogsSnapshot.docs.map(async item => {
        const itemData = item.data();
        const userDataRef = await getDoc(itemData.postedBy);
        const userData = userDataRef.data();
        return { ...itemData, postedBy: userData, id: item.id };
      });
      const blogs = await Promise.all(promises);
      const count = blogsSnapshot.size;
      dispatch(fetchBlogsByTimeRangeSuccess(blogs));
    }
    catch (error) {
      dispatch(fetchBlogsByTimeRangeFailure(error));
    }
  }
}
export const blogsToDashboardRequest = () => {
  return {
    type: 'GET_BLOGS_TO_DASHBOARD_REQUEST',
  };
};
export const blogsToDashboardFailure = (error) => {
  return {
    type: 'GET_BLOGS_TO_DASHBOARD_FAILURE',
    payload: error,
  };
};
export const blogsToDashboardSuccess = (blogs) => {
  return {
    type: 'GET_BLOGS_TO_DASHBOARD_SUCCESS',
    payload: blogs,
  };
};
export const getTop10TagsToDashboardRequest = () => {
  return {
    type: 'GET_TOP_10_TAGS_TO_DASHBOARD_REQUEST',
  };
};
export const getTop10TagsToDashboardFailure = (error) => {
  return {
    type: 'GET_TOP_10_TAGS_TO_DASHBOARD_FAILURE',
    payload: error,
  };
};
export const getTop10TagsToDashboardSuccess = (blogs) => {
  return {
    type: 'GET_TOP_10_TAGS_TO_DASHBOARD_SUCCESS',
    payload: blogs,
  };
};
export const getBlogsToDashboard = () => {
  return async (dispatch) => {
    try {
      dispatch(blogsToDashboardRequest());
      const blogsSnapshot = await getDocs(query(blogCollection(), where("deleted", "==", false), where("approved", "==", true), orderBy("timestamp", "desc")));
        const tagMap = {};
      const promises = blogsSnapshot.docs.map(async item => {
        const itemData = item.data();
        dispatch(getTop10TagsToDashboardRequest());
        itemData.tags.forEach((tag) => {
          tagMap[tag] = (tagMap[tag] || 0) + 1;
        });
        const userDataRef = await getDoc(itemData.postedBy);
        const userData = userDataRef.data();
        return { ...itemData, postedBy: userData, id: item.id };
      }); 
      
      const blogsList = await Promise.all(promises);
      dispatch(blogsToDashboardSuccess(blogsList));
      const tags = Object.entries(tagMap).sort((a, b) => b[1] - a[1]).slice(0,10)
      dispatch(getTop10TagsToDashboardSuccess(tags));

    } catch (error) {
      dispatch(notify({ message: `${error?.message}`, status: "warning" }));
      dispatch(blogsToDashboardFailure(error));
      dispatch(getTop10TagsToDashboardFailure(error));
    };

  };
};