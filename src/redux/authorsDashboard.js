import * as types from '../reducers/types'
import {
  authorsRef,
  authorsCountRef,
  pendingAuthorsCountRef,
  lastWeekPostedAuthorsCountRef,
  dashboardDataRef,
  firestoreDb,
  usersRef,
  pageViewRef,
  blogCollection,
  userRef,
  usermetadataRef,
  usermetadata,
} from '../Firebase/firebase';
import { getDocs, query, where, collection, Timestamp, } from 'firebase/firestore';
import { notify } from 'reapop';


export const fetchAuthorsByTimeRangeRequest = () => ({ type: types.FETCH_AUTHORS_BY_TIME_RANGE_REQUEST });
export const fetchAuthorsByTimeRangeSuccess = (authors) => ({ type: types.FETCH_AUTHORS_BY_TIME_RANGE_SUCCESS, payload: authors });
export const fetchAuthorsByTimeRangeFailure = (error) => ({ type: types.FETCH_AUTHORS_BY_TIME_RANGE_FAILURE, payload: error });
export const fetchBlogsByAuthorRequest = () => ({ type: types.FETCH_BLOGS_BY_AUTHOR_REQUEST });
export const fetchBlogsByAuthorSuccess = (blogs) => ({ type: types.FETCH_BLOGS_BY_AUTHOR_SUCCESS, payload: blogs });
export const fetchBlogsByAuthorFailure = (error) => ({ type: types.FETCH_BLOGS_BY_AUTHOR_FAILURE, payload: error });

export const fetchBlogsCountByAuthorRequest = () => ({ type: types.FETCH_BLOGS_COUNT_BY_AUTHOR_REQUEST });
export const fetchBlogsCountByAuthorSuccess = (count) => ({ type: types.FETCH_BLOGS_COUNT_BY_AUTHOR_SUCCESS, payload: count });
export const fetchBlogsCountByAuthorFailure = (error) => ({ type: types.FETCH_BLOGS_COUNT_BY_AUTHOR_FAILURE, payload: error });

export const fetchPendingBlogsCountByAuthorRequest = () => ({
  type: 'FETCH_PENDING_BLOGS_COUNT_BY_AUTHOR_REQUEST',
});

export const fetchPendingBlogsCountByAuthorSuccess = (count) => ({
  type: 'FETCH_PENDING_BLOGS_COUNT_BY_AUTHOR_SUCCESS',
  payload: count,
});

export const fetchPendingBlogsCountByAuthorFailure = (error) => ({
  type: 'FETCH_PENDING_BLOGS_COUNT_BY_AUTHOR_FAILURE',
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
 
export const fetchAuthorsByTimeRange = (timeRange) => async (dispatch) => {
  dispatch(fetchAuthorsByTimeRangeRequest());
  try {
const startDate = calculateStartDate(timeRange);
      const endDate = Timestamp.fromDate(new Date());
    const authorsQuery = query(
      usersRef(),
where('roles', 'array-contains', 'AUTHOR'),
where('creationTime', '>=', startDate),
where('creationTime', '<=',  endDate )
    );
    const querySnapshot = await getDocs(authorsQuery);
    const authors = querySnapshot.docs.map(doc => doc.data());
    dispatch(fetchAuthorsByTimeRangeSuccess(authors));
  } catch (error) {
    dispatch(fetchAuthorsByTimeRangeFailure(error));
  }
};
export const fetchBlogsByAuthor = (authorId) => async (dispatch) => {
  dispatch(fetchBlogsByAuthorRequest());
  try {
const blogsQuery = query(blogCollection(), where('postedBy', '==', usermetadata(authorId)));
    const querySnapshot = await getDocs(blogsQuery);
    const blogs = querySnapshot.docs.map(doc => doc.data());
dispatch(fetchBlogsByAuthorSuccess(blogs));
  } catch (error) {
    dispatch(fetchBlogsByAuthorFailure(error));
  }
};

export const fetchBlogsCountByAuthor = (authorId) => async (dispatch) => {
dispatch(fetchBlogsCountByAuthorRequest());
try {
const blogsQuery = query(blogCollection(), where('postedBy', '==', usermetadata(authorId)));
const querySnapshot = await getDocs(blogsQuery);
const count = querySnapshot.size;
dispatch(fetchBlogsCountByAuthorSuccess(count));
}
catch (error) {
dispatch(fetchBlogsCountByAuthorFailure(error));
};
}
export const fetchPendingBlogsCountByAuthor = (authorId) => async (dispatch) => {
  dispatch(fetchPendingBlogsCountByAuthorRequest());
  try {
const blogsQuery = query(blogCollection(), where('postedBy', '==', usermetadata(authorId)), where('status', '==', 'Pending'));
    const querySnapshot = await getDocs(blogsQuery);
    const count = querySnapshot.size;
    dispatch(fetchPendingBlogsCountByAuthorSuccess(count));
  } catch (error) {
    dispatch(fetchPendingBlogsCountByAuthorFailure(error));
  }
};

