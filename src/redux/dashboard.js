import { app,   browserCollectionRef, browserCollectionRefByAgent,  dashboardDataRef, firestoreDb, ipDataCollectionRef, pageView, pageViewRef, pageViewRefById, pageViewsRef, pageViewsRefById, pageViewsRefByParameter, routeConfigRef, routeConfigRefById,   userSignupLogs, userSignupLogsById, usersRef,  } from '../Firebase/firebase';
import {
  FETCH_DASHBOARD_DATA_START,
  FETCH_DASHBOARD_DATA_SUCCESS, FETCH_DASHBOARD_DATA_FAILURE, INCREMENT_PAGE_VIEW_START, INCREMENT_PAGE_VIEW_SUCCESS, INCREMENT_PAGE_VIEW_FAILURE, FETCH_ROUTE_TO_PAGE_ID_FAILURE, FETCH_ROUTE_TO_PAGE_ID_START, FETCH_ROUTE_TO_PAGE_ID_SUCCESS, ADD_ROUTE_TO_PAGE_ID_START, ADD_ROUTE_TO_PAGE_ID_SUCCESS, ADD_ROUTE_TO_PAGE_ID_FAILURE, FETCH_ROUTE_TO_PAGE_IDS_START, FETCH_ROUTE_TO_PAGE_IDS_SUCCESS, FETCH_ROUTE_TO_PAGE_IDS_FAILURE
} from '../reducers/types';
import {  collection, collectionGroup, deleteDoc, getDoc, getDocs, increment, onSnapshot,   query, runTransaction, setDoc,   where } from 'firebase/firestore'; // adjust this path to your firebase config file
import {   notify } from "reapop";
import { faker } from '@faker-js/faker';
import { get } from 'firebase/database';
 
export const fetchDashboardDataStart = () => ({
  type: FETCH_DASHBOARD_DATA_START
});

export const fetchDashboardDataSuccess = (data) => ({
  type: FETCH_DASHBOARD_DATA_SUCCESS,
  payload: data
});

export const fetchDashboardDataFailure = (error) => ({
  type: FETCH_DASHBOARD_DATA_FAILURE,
  payload: error
});

export const incrementPageViewStart = () => ({
  type: INCREMENT_PAGE_VIEW_START
});

export const incrementPageViewSuccess = () => ({
  type: INCREMENT_PAGE_VIEW_SUCCESS
});

export const incrementPageViewFailure = (error) => ({
  type: INCREMENT_PAGE_VIEW_FAILURE,
  payload: error
});

export const fetchRouteToPageIdStart = () => ({
  type: FETCH_ROUTE_TO_PAGE_ID_START
});

export const fetchRouteToPageIdSuccess = (routeToPageId) => ({
  type: FETCH_ROUTE_TO_PAGE_ID_SUCCESS,
  payload: routeToPageId
});

export const fetchRouteToPageIdFailure = (error) => ({
  type: FETCH_ROUTE_TO_PAGE_ID_FAILURE,
  payload: error
});
export const addRouteToPageIdStart = () => ({
  type: ADD_ROUTE_TO_PAGE_ID_START
});

export const addRouteToPageIdSuccess = (routeToPageId) => ({
  type: ADD_ROUTE_TO_PAGE_ID_SUCCESS,
  payload: routeToPageId
});

export const addRouteToPageIdFailure = (error) => ({
  type: ADD_ROUTE_TO_PAGE_ID_FAILURE,
  payload: error
});
export const fetchRoutePageToIdsStart = () => ({
  type: FETCH_ROUTE_TO_PAGE_IDS_START
});

export const fetchRoutePageToIdsSuccess = (routes) => ({
  type: FETCH_ROUTE_TO_PAGE_IDS_SUCCESS,
  payload: routes
});

export const fetchRoutePageToIdsFailure = (error) => ({
  type: FETCH_ROUTE_TO_PAGE_IDS_FAILURE,
  payload: error
});
export const addRouteToPageId = (item) => {
  return async (dispatch, getState) => {
    dispatch(addRouteToPageIdStart())
    const docRef = routeConfigRefById(item.routeName);
    const doc = await getDoc(docRef);
    const isAdmin = getState().auth.user?.roles.includes('ADMIN');

    if (doc.exists()) {
      if (isAdmin) {
        dispatch(addRouteToPageIdFailure(new Error('Item already exists')));
        dispatch(notify({ message: `${item.routeName} route already exists`, status: 'error' }));
      }
    } else {
      if (item.routeName.startsWith('/')) {
        if (isAdmin) {
          dispatch(addRouteToPageIdFailure(new Error('Error with document name')));
          dispatch(notify({ message: `${item.routeName} Error!. This route can't be added.`, status: 'error' }));
        }
      }
      else {
        setDoc(routeConfigRefById(item.routeName), { ...item })
          .then(() => {
            dispatch(addRouteToPageIdSuccess(item));
            if (isAdmin) {
              dispatch(notify({ message: `${item.routeName} added successfully.`, status: 'success' }));
            }
          })
          .catch((error) => {
            dispatch(addRouteToPageIdFailure(error));
            dispatch(notify({ message: error.message, status: 'error' }));
          });
      } 
    }
  }
}
export const fetchRouteToPageIds = () => {
  return dispatch => {
    dispatch(fetchRoutePageToIdsStart());
    getDocs(routeConfigRef())
      .then(snapshot => {
        const routes = snapshot.docs.map(doc => doc.data());
        dispatch(fetchRoutePageToIdsSuccess(routes));
      })
      .catch((error) => {
        dispatch(fetchRoutePageToIdsFailure(error))
        dispatch(notify({ message: error.message , status: 'error' }));
      });
  };
};
export const editRouteToPageId = (routeName, updatedData) => {
  return dispatch => {
    setDoc(routeConfigRefById(routeName), updatedData).then(() => {
      dispatch({ type: 'EDIT_ROUTE_TO_PAGE_ID', routeName, updatedData });
      dispatch(notify({ message: `${routeName} updated successfully.`, status: 'success' }));
      dispatch(fetchRouteToPageIds());
    })
      .catch((error) => {
        dispatch(notify({ message: error.message, status: 'error' }));
      })
  }
}
export const deleteRouteToPageId = (routeName) => {
  return dispatch => {
    deleteDoc(routeConfigRefById(routeName))
      .then(() => {
        dispatch({ type: 'DELETE_ROUTE_TO_PAGE_ID', routeName });
        dispatch(notify({ message: `${routeName} deleted successfully.`, status: 'success' }));
        dispatch(fetchRouteToPageIds());
      })
      .catch((error) => {
        dispatch(notify({ message: error.message, status: 'error' }));
      })
  }
}
export const fetchDashboardData = () => {
  return dispatch => {
    dispatch(fetchDashboardDataStart());
    getDocs(dashboardDataRef())
      .then(snapshot => {
        const data = snapshot.docs.map(doc => doc.data());
        dispatch(fetchDashboardDataSuccess(data));
      })
      .catch((error) => {
        dispatch(fetchDashboardDataFailure(error))
        dispatch(notify({ message: error.message, status: 'error' }));
      });
  };
};
export const fetchDashboardDataOnVisits = () => {
  return dispatch => {
    dispatch({ type: "FETCH_VISITORS_DATA_REQUEST" });
    getDoc(pageViewsRefById('webApp')).then((info) => {
      const data = info.data();
      dispatch({ type: 'FETCH_VISITORS_DATA_SUCCESS', payload: data });
    })
      .catch((error) => {
        dispatch({ type: 'FETCH_VISITORS_DATA_FAILURE', error: error });
        dispatch(notify({ message: error.message, status: 'error' }));
      })
  }
}
export const fetchDashboardDataOnVisitsPages = () => {
  return dispatch => {
    dispatch({ type: "FETCH_VISITORS_PAGE_DATA_REQUEST" });
    getDocs(pageViewsRef()).then((snapshot) => {
      const data = [];
snapshot.docs.map((doc) => (
        data.push({
          routeComponent: doc.id,
          ...doc.data() 
        })
));
      dispatch({ type: 'FETCH_VISITORS_PAGE_DATA_SUCCESS', payload: data });
    })
      .catch((error) => {
        dispatch({ type: 'FETCH_VISITORS_PAGE_DATA_FAILURE', error: error });
        dispatch(notify({ message: error.message, status: 'error' }));
      })
  }
}
export const fetchDashboardDataOnVisitsPagesBlogs = () => {
return dispatch => {
dispatch({ type: "FETCH_VISITORS_PAGE_DATA_REQUEST" });
const q = query(pageViewsRef(), where('pagePath', '>=', '/blogs/'), where('pagePath', '<=', '/blogs/\uf8ff'))
getDocs(q).then((snapshot) => {
  const data = [];
snapshot.docs.map((doc) => (
    data.push({
      routeComponent: doc.id,
      ...doc.data() 
    })
));
   dispatch({ type: 'FETCH_VISITORS_PAGE_DATA_SUCCESS', payload: data });
})
  .catch((error) => {
    dispatch({ type: 'FETCH_VISITORS_PAGE_DATA_FAILURE', error: error });
    dispatch(notify({ message: error.message, status: 'error' }));
  })

}
}
export const fetchRouteToPageIdStartAsync = (docName) => {
  return dispatch => {
    try {
      dispatch(fetchRouteToPageIdStart());
      getDoc(routeConfigRefById(docName)).then((info) => {
        const routeToPageId = info.data();
        dispatch(fetchRouteToPageIdSuccess(routeToPageId));
      })
        .catch((error) => {
          dispatch(fetchRouteToPageIdFailure(error));
          dispatch(notify({ message: error.message, status: 'error' }));
        })
    }
    catch (error) {
      dispatch(fetchRouteToPageIdFailure(error));
      dispatch(notify({ message: error.message, status: 'error' }));

    }
  };
};
export const incrementPageViewStartAsync = (pageId, pagePath) => {
  return async (dispatch) => {
    dispatch(incrementPageViewStart());
    try {
      await runTransaction(firestoreDb, async (transaction) => {
        const docRef = await transaction.get(pageViewsRefById(pageId));
        const docRefTot = await transaction.get(pageViewsRefById('webApp'));

        if (docRef.exists()) {
          const uniqueVisitors = docRef.data().uniqueVisitors;
          const pageViews = docRef.data().pageViews + 1;
          const bounceRate = Math.round((pageViews - uniqueVisitors) / pageViews) * 100 + '%';
          if (!document.cookie.includes(`visited-${pageId}=true`)) {
            const newUniqueCount = uniqueVisitors + 1;
            transaction.update(pageViewsRefById(pageId), {
              uniqueVisitors: newUniqueCount,
              bounceRate: bounceRate,
              pageViews: pageViews,
            });
            document.cookie = `visited-${pageId}=true; max-age=31536000`; // 1 year expiration
          } else {
            transaction.update(pageViewsRefById(pageId), {
              bounceRate: bounceRate,
              pageViews: pageViews,
            });
          }
        } else {
          const newPageViewData = {
            pagePath: pagePath,
            uniqueVisitors: 1,
            bounceRate: '0 %',
            pageViews: 1,
          };
          transaction.set(pageViewsRefById(pageId), newPageViewData);
        }
        if (docRefTot.exists()) {
          const uniqueVisitors = docRefTot.data().uniqueVisitors;
          const visits = docRefTot.data().visits;
          const pageViews = docRefTot.data().pageViews + 1;
          const bounceRate = Math.round((pageViews - uniqueVisitors) / pageViews) * 100 + '%';
          const session = sessionStorage.getItem(`webapp-session ${app.name}`);
          if (!session) {
            const newUniqueCount = uniqueVisitors + 1;
            transaction.update(pageViewsRefById('webApp'), {
              uniqueVisitors: newUniqueCount,
              bounceRate: bounceRate,
              pageViews: pageViews,
              visits: visits + 1
            });
            sessionStorage.setItem(`webapp-session ${app.name}`, true);
          }
          if (!document.cookie.includes(`visited-app=true`)) {
            const newUniqueCount = uniqueVisitors + 1;
            transaction.update(pageViewsRefById('webApp'), {
              uniqueVisitors: newUniqueCount,
              bounceRate: bounceRate,
              pageViews: pageViews,
              visits: visits + 1,
            });
            document.cookie = `visited-app=true; max-age=31536000`; // 1 year expiration
          }
          else {
            transaction.update(pageViewsRefById('webApp'), {
              bounceRate: bounceRate,
              pageViews: pageViews,
            });
          }
        } else {
          const newPageViewData = {
            uniqueVisitors: 1,
            bounceRate: '0 %',
            pageViews: 1,
            pagePath: '/',
            visits: 1
          };
          transaction.set(pageViewsRefById('webApp'), newPageViewData);
        }
      }).then(() => dispatch(incrementPageViewSuccess()));
    } catch (error) {
      dispatch(incrementPageViewFailure(error));
      dispatch(notify({ message: error.message, status: 'error' }));
    }
  };
};
export const fetchDashboardDataTrafficSummary = (options) => {
  return async (dispatch) => {
    dispatch({ type: 'FETCH_DASHBOARD_DATA_TRAFFIC_SUMMARY_REQUEST'});

    try {
      const queryPromises = options?.map((option) => {
        const queryRef = query(collectionGroup(firestoreDb, option));
        return getDocs(queryRef);
      });

      const querySnapshots = await Promise.all(queryPromises);
      const data = querySnapshots.map((querySnapshot, index) => {
        const option = options[index];
        const documents = querySnapshot.docs.map((doc) => {
          return { id: doc.id, path: doc.ref?.path, ...doc.data() }; // Include document ID

        });
        return { option, documents };
      });
      const formattedData = {};
 
      data.forEach(({ option, documents }) => {
        documents.forEach((doc) => {
          const path = doc.path;
          const date = path.split('/')[1];
          const pageId = doc.id;
          const count = doc.count;
          if (!formattedData[date]) {
            formattedData[date] = {};
          }
          if (!formattedData[date][option]) {
            formattedData[date][option] = {};
          }
          if (!formattedData[date][option][pageId]) {
            formattedData[date][option][pageId] = { count };
          } else {
            formattedData[date][option][pageId].count += count;
          }
        });
      });

      // Calculate the total count for each option
      Object.keys(formattedData).forEach((date) => {
        Object.keys(formattedData[date]).forEach((option) => {
          const pageIds = Object.keys(formattedData[date][option]);
          const totalCount = pageIds.reduce((sum, pageId) => sum + formattedData[date][option][pageId].count, 0);
          formattedData[date][option].count = totalCount;
        });
      });
      // Dispatch an action with the formatted data
      dispatch({ type: 'FETCH_DASHBOARD_DATA_TRAFFIC_SUMMARY_SUCCESS', payload: formattedData });
     } catch (error) {
      console.error("Error fetching bar chart data: ", error);
      // Dispatch an action with the error
      dispatch({ type: 'FETCH_DASHBOARD_DATA_TRAFFIC_SUMMARY_FAILURE', payload: error });
    }
  };
};
export const incrementPageViewStartAsyncTraffic = (date, parameter, pageId, fake) => {
  return async dispatch => {
    try {
      const data = fake ? { count: increment(1), fake: true } : { count: increment(1) }
      await setDoc(pageViewsRefByParameter(date, parameter, pageId), data, { merge: true });
    } catch (error) {
      dispatch(notify({ message: error.message, status: 'error' }));
      console.error('Error incrementing page view:', error.message);
    }
  }
}
export const addPageView = (pageId, info) => {
  return async dispatch => {
    try {
      await setDoc(pageViewRef(pageId, faker.string.uuid()), { ...info }, { merge: true });
      await setDoc(pageViewRefById(pageId), { count: increment(1) }, { merge: true });
    } catch (error) {
      dispatch(notify({ message: error.message, status: 'error' }));
      console.error('Error incrementing page view:', error.message);
    }
  }
}
export const addTrafficSources = (type, fake) => {
  return async dispatch => {
    try {
      const data = fake ? { count: increment(1), fake: true } : { count: increment(1) }
      await setDoc(browserCollectionRefByAgent(type), data, { merge: true });
    } catch (error) {
      dispatch(notify({ message: error.message, status: 'error' }));
      console.error('Error incrementing page view:', error.message);
    }
  }
}
export const fetchTrafficSources = () => {
  return dispatch => {
    dispatch({ type: "FETCH_TRAFFIC_SOURCES_REQUEST" })
    getDocs(browserCollectionRef())
      .then((transaction) => {
        const res = []
        transaction.forEach((ele) => {
          res.push({ id: ele.id, ...ele.data() })
        })
        dispatch({ type: "FETCH_TRAFFIC_SOURCES_SUCCESS", payload: res })
      })
      .catch((error) => {
        dispatch({ type: "FETCH_TRAFFIC_SOURCES_FAILURE", payload: error })
        dispatch(notify({ message: error.message, status: 'error' }));
      })
  }

}
const dataGen = () => {
  const date = faker.date.between({ from: '2023-10-01T00:00:00.000Z', to: '2023-11-10T00:00:00.000Z' }).toDateString();
  const parameter = faker.helpers.arrayElement(['Web', 'Social', 'Others']);
  const pageId = faker.helpers.arrayElement(['adminComponent', 'calendarComponent', 'webApp', 'RouteManagementComponent']);
  return {
    date,
    parameter,
    pageId,
  }
}
export const addFakeTraffic = () => {
  return async dispatch => {
    dispatch(notify({ message: 'adding fake data...', status: 'loading' }))
    try {
      for (let i = 0; i < 100; i++) {
        const data = dataGen();
        await incrementPageViewStartAsyncTraffic(data.date, data.parameter, data.pageId, 'fake')(dispatch);
      }
      dispatch(notify({ message: 'Successfully added fake data.', status: 'success' }))

    } catch (error) {
      dispatch(notify({ message: error.message, status: 'error' }))

      console.error('Error adding fake traffic:', error.message);
    }
  }
}
export const getUsersDashboardHeaderData = () => {
  return async dispatch => {

    dispatch({ type: 'FETCH_USERS_DASHBOARD_HEADER_DATA_REQUEST' });

    try {
      const activeUsersCountRef = await getDocs(query(usersRef(), where('status', '==', 'active')));
      const inactiveUsersCountRef = await getDocs(query(usersRef(), where('status', '==', 'inactive')));
      const approvedUsersCountRef = await getDocs(query(usersRef(), where('account_status', '==', 'approved')));
      const rejectedUsersCountRef = await getDocs(query(usersRef(), where('account_status', '==', 'rejected')));
      const registeredUsersCountRef = await getDocs(query(usersRef(), where('account_status', '==', 'registered')));
      const adminsCountRef = await getDocs(query(usersRef(), where('roles', 'array-contains', 'ADMIN')));
      const usersCountRef = await getDocs(usersRef());
      const activeUsersCount = activeUsersCountRef.size;
      const inactiveUsersCount = inactiveUsersCountRef.size;
      const approvedUsersCount = approvedUsersCountRef.size;
      const rejectedUsersCount = rejectedUsersCountRef.size;
      const registeredUsersCount = registeredUsersCountRef.size;
      const adminsCount = adminsCountRef.size;
      const usersCount = usersCountRef.size;

      const userSummary = [
        { label: 'Active Users', value: 'activeUsersCount', color: 'blue', count: activeUsersCount },
        { label: 'Admins', value: 'adminsCount', color: 'red', count: adminsCount },
        { label: 'Total Users', value: 'usersCount', color: 'green', count: usersCount },
        { label: 'Inactive Users', value: 'inactiveUsersCount', color: 'purple', count: inactiveUsersCount },
        { label: 'Approved Users', value: 'approvedUsersCount', color: 'orange', count: approvedUsersCount },
        { label: 'Rejected Users', value: 'rejectedUsersCount', color: 'teal', count: rejectedUsersCount },
        { label: 'Registered Users', value: 'registeredUsersCount', color: 'brown', count: registeredUsersCount }
      ];
      dispatch({
        type: 'FETCH_USERS_DASHBOARD_HEADER_DATA_SUCCESS',
        payload: userSummary
      });
    }
    catch (error) {
      dispatch({
        type: 'FETCH_USERS_DASHBOARD_HEADER_DATA_ERROR',
        payload: error.message,
      });

    }
  }
}
export const fetchDashboardDataUsersSummary = () => {
  return async dispatch => {
    try {
      dispatch({ type: 'FETCH_DASHBOARD_DATA_USERS_SUMMARY_REQUEST' });

      const querySnapshot = await getDocs(usersRef()); // Replace with your actual users collection reference

      const users = [];
      for (const docSnapshot of querySnapshot.docs) {
        // Exclude sensitive fields from the original document data
        const { password, otherSensitiveField, ...userDataWithoutSensitive } = docSnapshot.data();

        // Construct the user object without sensitive fields
        const user = { id: docSnapshot.id, ...userDataWithoutSensitive };

        // Push the user into the users array
        users.push(user);
      }

      dispatch({ type: 'FETCH_DASHBOARD_DATA_USERS_SUMMARY_SUCCESS', payload: users });
    } catch (error) {
      dispatch({ type: 'FETCH_DASHBOARD_DATA_USERS_SUMMARY_FAILURE' });
      dispatch(notify({ message: error.message, status: 'error' }));

      console.error('Error fetching users data:', error);
    }
  };
};
export const fetchUserCountsByCreationTime = () => {
  return async (dispatch) => {

    try {
      dispatch({ type: 'FETCH_DASHBOARD_DATA_USERS_COUNTES_TIME_REQUEST' });
      const userCounts = [];
      // Query users collection and group by creation time
      const querySnapshot = await getDocs(usersRef());
      querySnapshot.forEach(doc => {
        const creationTimestamp = doc.data().creationTime; // Replace 'createdAt' with your actual timestamp field
        const creationDate = new Date(creationTimestamp.toMillis());

        // Format the date to the desired granularity (e.g., day, month, year)
        const formattedDate = creationDate.toISOString().split('T')[0]; // Use only the date part
        // Check if there is an entry for the date; if not, add a new entry
        const existingEntry = userCounts.find(entry => entry.date === formattedDate);
        if (existingEntry) {
          existingEntry.count += 1;
        } else {
          userCounts.push({ date: formattedDate, count: 1 });
        }
      });
      dispatch({ type: 'FETCH_DASHBOARD_DATA_USERS_COUNTES_TIME_SUCCESS', payload: userCounts });
    }
    catch (error) {
      dispatch({ type: 'FETCH_DASHBOARD_DATA_USERS_COUNTES_TIME_FAILURE' });
      dispatch(notify({ message: error.message, status: 'error' }));
    }
  }
};
export const fetchUserSignupLogs = () => {
  return (dispatch) => {
    // Fetch user signup logs from Firestore and dispatch the result
    // Update this code based on your Firebase setup
    dispatch({
      type: 'FETCH_USER_SIGNUP_LOGS_REQUEST',
    });
    const timestamp = new Date();
    const adjustedTimestamp = new Date(timestamp.getTime()); // Create a copy
    adjustedTimestamp.setMinutes(timestamp.getMinutes() - 30);

    const q = query(userSignupLogs(), where("timestamp", ">", adjustedTimestamp));
    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        const logs = snapshot.docs.map((doc) => ({ id: doc.id, timeString: doc.data().timestamp.toDate(), ...doc.data() }));
        dispatch({
          type: 'FETCH_USER_SIGNUP_LOGS_SUCCESS',
          payload: logs,
        });
      },
      (error) => {
        dispatch({
          type: 'FETCH_USER_SIGNUP_LOGS_ERROR',
          payload: error.message,
        });
      }
    );
    return () => unsubscribe()
  };
};
export const addFakeUserSignupLogs = (len, fakeData) => {
  return async dispatch => {

    dispatch(notify({ message: 'adding fake data...', status: 'loading' }));
    try {
      for (let i = 0; i < len; i++) {
        const data = fakeData[i]
        await setDoc(userSignupLogsById(data.uid), { ...data });
      }
      dispatch(notify({ message: 'Successfully added fake data.', status: 'success' }))
    } catch (error) {
      dispatch(notify({ message: error.message, status: 'error' }))

      console.error('Error adding fake traffic:', error.message);
    }
  }
}
export const fetchTrafficData = () => {
  return async (dispatch) => {
    dispatch({ type: 'FETCH_TRAFFIC_DATA_REQUEST' });
    try {
      const onSnapshot = await get(ipDataCollectionRef());
      const trafficData = [];

      // Separate maps for city and country counts
      const cityDataMap = new Map();
      const countryDataMap = new Map();

      // Iterate through the trafficData and store relevant information for each city
      onSnapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        trafficData.push(data);
      });

      // Iterate through the trafficData and store relevant information for each city
      trafficData.forEach((data) => {
        const { ip, network, org, version, ...cityData } = data;

        // Unique keys for city and country
        const cityKey = `${cityData.city}-${cityData.region}-${cityData.country}`;
        const countryKey = `${cityData.country}`;

        // If the city is not in the map, initialize its data
        if (!cityDataMap.has(cityKey)) {
          cityDataMap.set(cityKey, {
            ...cityData,
            count: 0,
          });
        }

        // If the country is not in the map, initialize its data
        if (!countryDataMap.has(countryKey)) {
          countryDataMap.set(countryKey, {
            ...cityData, // Assuming country data is similar to city data
            count: 0,
          });
        }

        // Increment the count for the city and country
        cityDataMap.get(cityKey).count += 1;
        countryDataMap.get(countryKey).count += 1;
      });

      // Convert the map values to arrays
      const cityCounts = Array.from(cityDataMap.values());
      const countryCounts = Array.from(countryDataMap.values());

      dispatch({
        type: 'FETCH_TRAFFIC_DATA_SUCCESS',
        payload: { cityCounts, countryCounts },
      });
    } catch (error) {
      dispatch(notify({ message: error.message, status: 'error' }));
      dispatch({ type: 'FETCH_TRAFFIC_DATA_FAILURE', payload: error });
    }
  };
};
export const getTopPagesByViewCount = (country) => {
  return async (dispatch) => {
    try {
      dispatch({ type: 'GET_TOP_PAGES_BY_COUNT_AND_COUNTRY_REQUEST' });

      const pageViewsSnapshot = await getDocs(pageView());

      let uniquePageIds = new Set(); // Use a Set to track unique page IDs
      let topPages = [];

      for (const pageViewDoc of pageViewsSnapshot.docs) {
        const viewsCollectionRef = collection(pageView(), pageViewDoc.id, 'views');
        const viewsSnapshot = await getDocs(viewsCollectionRef);

        // Process each view
        viewsSnapshot.forEach((viewDoc) => {
          const viewData = viewDoc.data();

          // Check if the view is from the specified country and the page ID is not already added
          if (viewData.country_name === country && !uniquePageIds.has(pageViewDoc.id)) {
            uniquePageIds.add(pageViewDoc.id); // Add page ID to the Set
            topPages.push({
              pageId: pageViewDoc.id,
              viewCount: pageViewDoc.data().count,
              // Include other relevant data
            });
          }
        });
      }

      // Sort the top pages by view count
      topPages.sort((a, b) => b.viewCount - a.viewCount);

      // Get the top 10 pages
      const top10Pages = topPages.slice(0, 10);

      // Dispatch an action with the top 10 pages
      dispatch({ type: 'GET_TOP_PAGES_BY_COUNT_AND_COUNTRY_SUCCESS', payload: top10Pages });
    } catch (error) {
      console.error('Error getting top pages by view count:', error.message);
      dispatch(notify({ message: error.message, status: 'error' }));
      dispatch({ type: 'GET_TOP_PAGES_BY_COUNT_AND_COUNTRY_FAILURE', error: error });
    }
  };
};
export const getViewCountByCountry = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: 'GET_VIEW_COUNT_BY_COUNTRY_REQUEST' });

      const pageViewsSnapshot = await getDocs(pageView());
      const viewCountByCountry = {};

      for (const pageViewDoc of pageViewsSnapshot.docs) {
        const viewsCollectionRef = collection(pageView(), pageViewDoc.id, 'views');
        const viewsSnapshot = await getDocs(viewsCollectionRef);

        // Process each view
        viewsSnapshot.forEach((viewDoc) => {
          const viewData = viewDoc.data();

          const country = viewData.country_name;

          // Increment the count for the country
          viewCountByCountry[country] = (viewCountByCountry[country] || 0) + 1;

        });
      }
      const viewCountArray = Object.entries(viewCountByCountry).map(([country, count]) => ({
        country,
        count,
      }));

      // Initialize an object to store the count for each country

      // Dispatch an action with the view count by country
      dispatch({ type: 'GET_VIEW_COUNT_BY_COUNTRY_SUCCESS', payload: viewCountArray });
    } catch (error) {
      console.error('Error getting view count by country:', error.message);
      dispatch(notify({ message: error.message, status: 'error' }));
      dispatch({ type: 'GET_VIEW_COUNT_BY_COUNTRY_FAILURE', error: error });
    }
  };
};
export const getViewCountByCity = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: 'GET_VIEW_COUNT_BY_CITY_REQUEST' });

      const pageViewsSnapshot = await getDocs(pageView());
      const viewCountByCity = {};

      for (const pageViewDoc of pageViewsSnapshot.docs) {
        const viewsCollectionRef = collection(pageView(), pageViewDoc.id, 'views');
        const viewsSnapshot = await getDocs(viewsCollectionRef);

        // Process each view
        viewsSnapshot.forEach((viewDoc) => {
          const viewData = viewDoc.data();

          const city = viewData.city;
          const continent = viewData.continent_code;
          const region = viewData.region;

          // Create a unique key for each city, considering continent and region
          const key = `${city}_${continent}_${region}`;

          // Increment the count for the unique key
          viewCountByCity[key] = (viewCountByCity[key] || 0) + 1;
        });
      }

      // Transform the viewCountByCity object into an array of objects
      const viewCountArray = Object.entries(viewCountByCity).map(([key, count]) => {
        const [city, continent, region] = key.split('_');
        return { city, count, continent, region };
      });

      const top10Cities = viewCountArray.slice(0, 10);

      // Dispatch an action with the view count by city
      dispatch({ type: 'GET_VIEW_COUNT_BY_CITY_SUCCESS', payload: top10Cities });
    } catch (error) {
      console.error('Error getting view count by city:', error.message);
      dispatch(notify({ message: error.message, status: 'error' }));
      dispatch({ type: 'GET_VIEW_COUNT_BY_CITY_FAILURE', error: error });
    }
  };
};