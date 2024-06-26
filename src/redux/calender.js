import { auth,   eventRefById, eventsRef, firestoreDb, notificationById, usermetadata } from '../Firebase/firebase';
import {
  ADD_EVENT_REQUEST,
  ADD_EVENT_SUCCESS,
  ADD_EVENT_FAILURE,
  EDIT_EVENT_REQUEST,
  EDIT_EVENT_SUCCESS,
  EDIT_EVENT_FAILURE,
  DELETE_EVENT_REQUEST,
  DELETE_EVENT_SUCCESS,
  DELETE_EVENT_FAILURE,
  GET_ALL_EVENTS_REQUEST,
  GET_ALL_EVENTS_FAILURE,
  GET_ALL_EVENTS_SUCCESS,
  SET_DRAGGABLE_EVENTS,
   DELETE_DRAGGABLE_EVENT
} from '../reducers/types';
import {   notify } from "reapop";
import {   Timestamp, getDocs, query, where, deleteDoc, setDoc, updateDoc, writeBatch, getDoc, arrayUnion, orderBy, arrayRemove } from "firebase/firestore";
import {faker} from '@faker-js/faker'
// Add Event Actions
export const addEventRequest = () => {
  return {
    type: ADD_EVENT_REQUEST,
  };
};

export const addEventSuccess = (event) => {
  return {
    type: ADD_EVENT_SUCCESS,
    payload: event
  };
};

export const addEventFailure = (error) => {
  return {
    type: ADD_EVENT_FAILURE,
    payload: error
  };
};
// Get All Event Actions
export const getAllEventsRequest = () => {
  return {
    type: GET_ALL_EVENTS_REQUEST
  };
};

export const getAllEventsSuccess = (event) => {
  return {
    type: GET_ALL_EVENTS_SUCCESS,
    payload: event
  };
};

export const getAllEventsFailure = (error) => {
  return {
    type: GET_ALL_EVENTS_FAILURE,
    payload: error
  };
};

export const editEventRequest = () => {
  return {
    type: EDIT_EVENT_REQUEST,
  };
};
export const editEventSuccess = (event) => {
  return {
    type: EDIT_EVENT_SUCCESS,
    payload: event
  };
};
export const editEventFailure = (error) => {
  return {
    type: EDIT_EVENT_FAILURE,
    payload: error
  };
};
// Delete Event Actions
export const deleteEventRequest = () => {
  return {
    type: DELETE_EVENT_REQUEST,
  };
};

export const deleteEventSuccess = () => {
  return {
    type: DELETE_EVENT_SUCCESS
  };
};

export const deleteEventFailure = (error) => {
  return {
    type: DELETE_EVENT_FAILURE,
    payload: error
  };
};
export const setDraggableEvents = (events) => {
  return {
    type: SET_DRAGGABLE_EVENTS,
    payload: events,
  };
};
export const addDraggableEventAction = (event) => {
  return {
    type: 'ADD_DRAGGABLE_EVENT',
    payload: event,
  };
};
export const editDraggableEventAction = (event) => {
  return {
    type: 'EDIT_DRAGGABLE_EVENT',
    payload: event,
  };
};
export const deleteDraggableEventAction = (event) => {
  return {
    type: DELETE_DRAGGABLE_EVENT,
    payload: event,
  };
};
export const addDraggableEvent = (event) => {
  return async (dispatch, getState) => {
    try{
          const currentUserId = auth.currentUser.uid;
          const events = getState().events?.draggableEvents;
          if(events.length > 4){
            throw Error(`You can save five draggable events only.`)
          }
          if(!event.title){
            throw Error('Event Title is required!.')
          }
          const isUserPresent = (await getDoc(eventRefById(currentUserId))).exists()
          if(!isUserPresent){
            await setDoc(eventRefById(currentUserId), {
              events: arrayUnion({...event})
            }).then(()=>{
              dispatch({ type: 'ADD_DRAGGABLE_EVENT', payload: event });
              dispatch(notify({message: 'Event successfully saved.',status: 'success'}))
            })
          }
          else{
          await updateDoc(eventRefById(currentUserId), {
            events: arrayUnion({...event})
          }).then(()=>{
            dispatch({ type: 'ADD_DRAGGABLE_EVENT', payload: event });
            dispatch(notify({message: 'Event successfully saved.',status: 'success'}))
          })
        }

        }
        catch (error) {
            dispatch(notify({message: error.message, status: 'error'}))
        }
    }
}
export const removeDraggableEvent = (event) => {
  const currentUserId = auth.currentUser.uid;
  return async (dispatch) => {
      try{
        await updateDoc(eventRefById(currentUserId), {
          events: arrayRemove({...event})
        }).then(()=>{
          dispatch({ type: 'DELETE_DRAGGABLE_EVENT', payload: event });
          dispatch(notify({message: 'Event successfully removed.',status: 'success'}))
        })
      }
      catch (error) {
          dispatch(notify({message: error.message, status: 'error'}))
      }
  }
}
export const editDraggableEvent = (event) => {
  const currentUserId = auth.currentUser.uid;
  return async (dispatch) => {
      try{
        await updateDoc(eventRefById(currentUserId), {
          events: arrayUnion({...event})
        }).then(()=>{
          dispatch({ type: 'EDIT_DRAGGABLE_EVENT', payload: event });
          dispatch(notify({message: 'Event successfully saved.',status: 'success'}))
        })
      }
      catch (error) {
          dispatch(notify({message: error.message, status: 'error'}))
      }
  }
}
export const fetchDraggableEvents = () => {
  return async (dispatch) => {
    const currentUserId = auth.currentUser.uid; // Assuming the user ID is stored in the auth state

    try {
      getDoc(eventRefById(currentUserId))
      .then((doc) =>{
        if(doc.exists()){
           const e = doc.data();
        dispatch({ type: 'SET_DRAGGABLE_EVENTS', payload: e.events });
        }
      })
    } catch (error) {
      dispatch(notify({message: error.message, status: 'error'}))
      console.error('Error fetching draggable events:', error);
      // Dispatch an action to handle the error, e.g., show a notification
    }
  };
};
export const addEvent = (form) => {
  return async (dispatch, getState) => {
    const batch = writeBatch(firestoreDb);
    dispatch(addEventRequest());
    const userId = auth.currentUser.uid;

    const formData = {
      ...form,
      id: faker.string.uuid(),
      start: form.start.toISOString(),
      end: form.end.toISOString(),
      allDay: form.allDay,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      updatedBy: [],
      ipData: getState().auth.ipData,
      createdBy: usermetadata(userId),
    }
    if (form?.people?.length > 0) {
      const notification = {
        id: faker.string.uuid(),
        shortDescription: `${getState().auth?.user?.firstName + ' ' + getState().auth?.user?.lastName} invited to an event!.`,
        title: `${getState().auth?.user?.firstName + ' ' + getState().auth?.user?.lastName} invited to an event!.`,
        users: [...form?.people],
        toAll: false,
        deleted: false,
        toAllAdmins: false,
        timestamp: new Date(),
      }
      batch.set(notificationById(notification?.id), { ...notification });
    }
    batch.set(eventRefById(formData.id), { ...formData });
    await batch.commit()
      .then(() => {
        dispatch(addEventSuccess(formData));
        dispatch(notify({ message: 'Event added! ', status: 'success', }))
      })
      .catch((error) => {
        dispatch(addEventFailure());
        dispatch(notify({ message: error.message, status: 'error' }))
      })
  }
}
export const getAllEvents = () => {
  return async (dispatch) => {
    const currentUserId = auth.currentUser.uid;
    dispatch(getAllEventsRequest());
    try {
      const eventsQuery = query(eventsRef(), where('createdBy', '==', usermetadata(currentUserId)));
      const eventsSnapshot = await getDocs(eventsQuery);
      const events = [];
      for (const doc of eventsSnapshot.docs) {
        const eventData = doc.data();
        const createdByRef = eventData.createdBy;
        const createdByData = await getDoc(createdByRef);
        const eventWithUserData = { id: doc.id, ...eventData, createdBy: createdByData.data() };
        events.push(eventWithUserData);
      }
      dispatch(getAllEventsSuccess(events))
    } catch (error) {
        dispatch(getAllEventsFailure());
          dispatch(notify({ message: error.message, status: 'error' }))
      console.error('Error fetching events:', error);
    }
  }
}
export const editEvent = (eventId, updatedEvent) => {
  return (dispatch, getState) => {
    dispatch(editEventRequest());
    const formData = {
      ...updatedEvent,
      start: updatedEvent.start,
      end: updatedEvent.end,
      updatedAt: Timestamp.now(),
    }
    updateDoc(eventRefById(eventId), { ...formData, 
    lastUpdatedBy: usermetadata(auth.currentUser.uid),
    updatedIpData: arrayUnion(getState().auth.ipData),
  })
      .then(() => {
        dispatch(editEventSuccess(formData));
        dispatch(notify({ message: 'Event modified!', status: 'success' }));
      })
      .catch((error) => {
        dispatch(editEventFailure(error));
        dispatch(notify({ message: error.message, status: 'error' }));
      });
  };
};
export const deleteEvent = (eventId) => {
  return (dispatch) => {
    dispatch(deleteEventRequest(eventId));
    deleteDoc(eventRefById(eventId))
      .then(() => {
        dispatch(deleteEventSuccess(eventId));
        dispatch(notify({ message: 'Event deleted!', status: 'success' }));
      })
      .catch((error) => {
        dispatch(deleteEventFailure(error));
        dispatch(notify({ message: error.message, status: 'error' }));
      });
  };
};
const calculateEventDuration = (start, end) => {
  const startTime = new Date(start);
  const endTime = new Date(end);
  const duration = endTime - startTime;
  return duration / (60 * 60 * 1000); // Convert duration to hours
};
const calculateEventDurationAnalysis = (events) => {
  const durations = events.map(event => event.duration);

  const averageDuration = durations.reduce((total, duration) => total + duration, 0) / durations.length;

  const longestEvent = events.reduce((maxEvent, event) => (event.duration > maxEvent.duration ? event : maxEvent), events[0]);

  const sortedEvents = [...events].sort((a, b) => b.duration - a.duration);

  const topEvents = sortedEvents.slice(0, 5);

  return {
    averageDuration: averageDuration.toFixed(2),
    longestEvent: {
      eventId: longestEvent.id,
      duration: longestEvent.duration.toFixed(2),
    },
    topEvents: topEvents.map(event => ({
      eventId: event.id,
      duration: event.duration.toFixed(2),
    })),
  };
};
export const fetchCalendarDashboard = () => {
  return async dispatch => {
    try {
      dispatch({type: 'FETCH_EVENTS_DASHBOARD_REQUEST'})
      // Fetch all events ordered by createdAt
      const q = query(eventsRef(), orderBy('createdAt'));

      const snapshot = await getDocs(q);
      const events = [];
      const eventsCountByCity = {};
      const eventsCountryCounts = {};
      const eventsContinentCounts = {};
      snapshot.forEach((doc) => {
        const {updatedAt, ...data} = doc.data();
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

        // Calculate event duration and add it to the data
        const eventDuration = calculateEventDuration(data.start, data.end);
        data.duration = eventDuration;


          // Increment the count for the unique key
          eventsCountByCity[key] = (eventsCountByCity[key] || 0) + 1; 
          eventsCountryCounts[key] = (eventsCountryCounts[key] || 0) + 1; 
          eventsContinentCounts[key] = (eventsContinentCounts[key] || 0) + 1; 
          events.push(data);
        }); 
        const durationAnalysis = calculateEventDurationAnalysis(events);

        const viewCountCityArray = Object.entries(eventsCountByCity).map(([key, count]) => {
          const [city,region,country_name,country_code,continent,  latitude, longitude ] = key.split('_');
          return { city,region,country_name,country_code,continent,  latitude, longitude, count  };
        });
        const viewCountCountryArray = Object.entries(eventsCountryCounts).map(([key, count]) => {
          const [city,region,country_name,country_code,continent,  latitude, longitude] = key.split('_');
          return { city,region,country_name,country_code,continent,  latitude, longitude, count};
        });
        const viewCountContinentArray = Object.entries(eventsContinentCounts).map(([key, count]) => {
          const [city,region,country_name,country_code,continent,  latitude, longitude] = key.split('_');
          return { city,region,country_name,country_code,continent,  latitude, longitude, count};
        });
      // Get total events count
      const totalEventsCount = events.length;

      // Process data for the bar chart (assuming createdAt is a Date field)
      // Now 'barChartData' contains an array of objects with date and count properties
 
      // Dispatch the data to your Redux store or use it as needed
      dispatch({
        type: 'FETCH_EVENTS_DASHBOARD_SUCCESS',
        payload: { totalEventsCount, events,durationAnalysis, viewCountCityArray, viewCountContinentArray, viewCountCountryArray },
      });
    } catch (error) {
      dispatch({
        type: 'FETCH_EVENTS_DASHBOARD_FAILURE',
        payload: error.message,
      });
    }

  }
} 