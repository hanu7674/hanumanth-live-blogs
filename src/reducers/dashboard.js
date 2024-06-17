const INITIAL_STATE = {
  data: null,
  isFetching: false,
  errorMessage: undefined,
  routeToPageId: null,
  routes: null,
  status: null,
  loading: true,
  usersHeaderData: [],
  userCountsByMinute: [],
  dashboardData: [],
  viewCountByCountry: [],
  traffic: [],
  userSignupLogs: [],
  visitorsData:{
    pageViews: 0,
    visits: 0,
    uniqueVisitors: 0
  }
};

const dashboardDataReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'GET_VIEW_COUNT_BY_COUNTRY_REQUEST':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'GET_VIEW_COUNT_BY_COUNTRY_SUCCESS':
      return {
        ...state,
        loading: false,
        viewCountByCountry: action.payload,
      };
    case 'GET_VIEW_COUNT_BY_COUNTRY_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.error,
      };
      case 'GET_VIEW_COUNT_BY_CITY_REQUEST':
        return {
          ...state,
          loading: true,
          error: null,
        };
      case 'GET_VIEW_COUNT_BY_CITY_SUCCESS':
        return {
          ...state,
          loading: false,
          viewCountByCity: action.payload,
        };
      case 'GET_VIEW_COUNT_BY_CITY_FAILURE':
        return {
          ...state,
          loading: false,
          error: action.error,
        };
    case 'FETCH_TRAFFIC_DATA_REQUEST':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'FETCH_TRAFFIC_DATA_SUCCESS':
      return{
        ...state,
        cityCountData: action.payload.cityCounts,
        countryCountData: action.payload.countryCounts,
        loading: false
      }
      case "FETCH_USER_SIGNUP_LOGS_REQUEST":
        return {
          ...state,
          userSignupLogs: [],
          loading: true,
          error: null,
        };
      case "FETCH_USER_SIGNUP_LOGS_SUCCESS":
        return {
          ...state,
          userSignupLogs: action.payload,
          error: null,
          loading: false,
        };
      case "FETCH_USER_SIGNUP_LOGS_ERROR":
        return {
          ...state,
          userSignupLogs: [],
          loading: false,
          error: action.payload,
        };
      case "UPDATE_USER_SIGNUP_LOG":
        return {
          ...state,
          userSignupLogs: [...state.userSignupLogs, action.payload],
          error: null,
        };
    case 'FETCH_TRAFFIC_DATA_FAILURE':
    
    case 'FETCH_USERS_DASHBOARD_HEADER_DATA_SUCCESS':
      return{
        ...state,
        loading: false,
        usersHeaderData: action.payload,
      }
    case 'FETCH_DASHBOARD_DATA_TRAFFIC_SUMMARY_SUCCESS': 
    return{
      ...state,
      loading: false,
      traffic: action.payload
    }
    case 'FETCH_USERS_DASHBOARD_HEADER_DATA_REQUEST':
    case 'FETCH_DASHBOARD_DATA_TRAFFIC_SUMMARY_REQUEST': 
    return{
      ...state,
      loading: true
    }
    case 'FETCH_TRAFFIC_SOURCES_REQUEST': 
    return{
      ...state,
      loading: true
    }
    case 'FETCH_USERS_DASHBOARD_HEADER_DATA_FAILURE':
    case 'FETCH_DASHBOARD_DATA_TRAFFIC_SUMMARY_FAILURE': 
    return{
      ...state,
      error: action.payload,
      loading: false,
    }
    case 'FETCH_TRAFFIC_SOURCES_FAILURE': 
    return{
      ...state,
      error: action.payload,
      loading: false,
    }
    case 'FETCH_TRAFFIC_SOURCES_SUCCESS':
      return{
        ...state,
        trafficSources: action.payload,
        loading: false,
      }
    case 'FETCH_VISITORS_DATA_SUCCESS': 
    return{
      ...state,
      loading: false,
      visitorsData: action.payload
    }
    case 'FETCH_VISITORS_DATA_REQUEST': 
    return{
      ...state,
      loading: true
    }
    case 'FETCH_VISITORS_DATA_FAILURE': 
    return{
      ...state,
      error: action.payload,
      loading: false,
    }
    case 'FETCH_VISITORS_PAGE_DATA_SUCCESS': 
    return{
      ...state,
      loading: false,
      visitorsDataPage: action.payload
    }
    case 'GET_TOP_PAGES_BY_COUNT_AND_COUNTRY_SUCCESS':
      return{
        ...state,
        top10PagesLoading: false,
        top10Pages: action.payload
      }
    case 'GET_TOP_PAGES_BY_COUNT_AND_COUNTRY_REQUEST':
      return{
        ...state,
        top10PagesLoading: true,
      }
    case 'FETCH_VISITORS_PAGE_DATA_REQUEST': 
    return{
      ...state,
      loading: true
    }
    case 'GET_TOP_PAGES_BY_COUNT_AND_COUNTRY_FAILURE':
      return{
        ...state,
        top10PagesError: action.payload,
        top10PagesLoading: false,
      }
    case 'FETCH_VISITORS_PAGE_DATA_FAILURE': 
    return{
      ...state,
      error: action.payload,
      loading: false,
    }
    case 'FETCH_DASHBOARD_DATA_START':
      return {
        ...state,
        isFetching: true
      };
    case 'ADD_ROUTE_TO_PAGE_ID_START':
      return {
        ...state,
        isFetching: true
      };
    case 'FETCH_ROUTE_TO_PAGE_IDS_START':
      return {
        ...state,
        isFetching: true
      };
    case 'EDIT_ROUTE_TO_PAGE_ID':
      return {
        ...state,
        routes: state.routes.map(route =>
          route.routeName === action.routeName ? action.updatedData : route
        )
      };
    case 'DELETE_ROUTE_TO_PAGE_ID':
      return {
        ...state,
        routes: state?.routes?.filter(route => route?.routeName !== action.payload)
      };
    case 'FETCH_ROUTE_TO_PAGE_IDS_SUCCESS':
      return {
        ...state,
        isFetching: false,
        routes: action.payload
      }
    case 'ADD_ROUTE_TO_PAGE_ID_SUCCESS':
      return {
        ...state,
        routes: [...state.routes, action.payload],
        status: {code: 200, message: "success"},
        isFetching: false,
      }
    case 'FETCH_DASHBOARD_DATA_SUCCESS': 
      return {
        ...state,
        isFetching: false,
        data: action.payload
      };
    case 'FETCH_DASHBOARD_DATA_FAILURE':
      return {
        ...state,
        isFetching: false,
        errorMessage: action.payload
      };
    case 'FETCH_ROUTE_TO_PAGE_ID_START':
      return {
        ...state,
        isFetchingRouteToPageId: true
      };
    case 'FETCH_ROUTE_TO_PAGE_ID_SUCCESS':
      return {
        ...state,
        isFetchingRouteToPageId: false,
        routeToPageId: action.payload
      };
    case 'FETCH_ROUTE_TO_PAGE_ID_FAILURE':
    case 'ADD_ROUTE_TO_PAGE_ID_FAILURE':
    case 'FETCH_ROUTE_TO_PAGE_IDS_FAILURE':
      return {
        ...state,
        isFetchingRouteToPageId: false,
        errorMessage: action.payload
      };
    default:
      return state;
  }
};

export default dashboardDataReducer;