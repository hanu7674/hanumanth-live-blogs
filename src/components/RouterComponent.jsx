import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { addPageView, addRouteToPageId, addTrafficSources, fetchRouteToPageIdStartAsync, fetchRouteToPageIds, incrementPageViewStartAsync, incrementPageViewStartAsyncTraffic } from '../redux/dashboard';
import Loading from "./Loading/loading";
import NotificationsSystem, {
  wyboTheme,
  dismissNotification,
  FadeTransition,
} from "reapop";
import { setUpNotifications } from "reapop";
import { useDispatch, useSelector, connect } from "react-redux";
import AppRoutes from "./Routes";
import { getIP, getUserAgentInfo, storeTrafficByIpAndLocation } from "../redux/auth";

setUpNotifications({
  defaultProps: {
    title: "Admin Dashboard App By @Hanu7674",
    position: "top-right",
    dismissible: true,
    dismissAfter: 5000,
    showDismissButton: true,
  },
});
const RouterComponent = ({addPageView,fetchRouteToPageIds, ipData,fetchIpAndLocation,addRouteToPageId, incrementPageViewStartAsync, fetchRouteToPageIdStartAsync, incrementPageViewStartAsyncTraffic, addTrafficSources }) => {
  const notifications = useSelector((state)   => state.notifications);
  const location = useLocation();
  const paths = useSelector((state) => state?.dashboardData.routes);
  const [trafficData, setTrafficData] = useState({});
  const [pageId, setPageId] = useState();
  const dispatch = useDispatch();
  useEffect(() => {
    fetchRouteToPageIds();
    fetchIpAndLocation();
  }, [location])
 
   
 
  useEffect(() => {
    const pagePath = paths?.find(path => path.routePath === location.pathname);
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source');
    const utmMedium = urlParams.get('utm_medium');
    const utmCampaign = urlParams.get('utm_campaign');
    const date = new Date().toDateString();
const {browser} = getUserAgentInfo();
    if (pagePath) {
      const { pageId } = pagePath;
      const currentDate = new Date().toDateString();
      incrementPageViewStartAsync(pageId, location.pathname);
      fetchRouteToPageIdStartAsync(pageId);
      addTrafficSources(browser, false);
      setPageId(pageId);
      if(ipData){
      const trafficData = {
        date: date,
        pageId: pageId,
        city: ipData.city,
        region: ipData.region,
        region_code: ipData.region_code,
        country_name: ipData.country_name,
        country_code: ipData.country_code,
        continent_code: ipData.continent_code,
        latitude: ipData.latitude,
        longitude: ipData.longitude,
        ...getUserAgentInfo(),
      }
      setTrafficData({...trafficData});
      addPageView(pageId,trafficData);
    }
      if (utmSource && utmMedium && utmCampaign) {
             // Store UTM parameters in a cookie
        document.cookie = `utm_source=${utmMedium}; expires=Session; path=/`;
        incrementPageViewStartAsyncTraffic(currentDate, utmMedium,pageId);
      }
      else { 
        incrementPageViewStartAsyncTraffic(currentDate, 'Web', pageId,{})
      }
    }
    else{
      if(location.pathname.length > 1)
      {
      const getComponentForRoute = (routeName) => {
        // Assuming your components follow a specific naming convention
        const pascalCaseRouteName = routeName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
    
      return `${pascalCaseRouteName}Component`;      };      
      // Extract values
      const pathSegments = location.pathname.split("/").filter(segment => segment !== "");
      const pageId = `${pathSegments.join("_")}`
      const routeName = `${pathSegments.join("-")}`;
      const routePath = `/${pathSegments.join("/")}`;
      const routeComponent = getComponentForRoute(routeName);
      
      // Create an object with extracted values
      const routeInfo = {
        pageId,
        routeName,
        routePath,
        routeComponent,
      };
      addRouteToPageId(routeInfo);
    }
    }
  }, [location]);
  return (
    <React.Suspense fallback={<Loading />}>
      <NotificationsSystem
        notifications={notifications}
        dismissNotification={(id) => dispatch(dismissNotification(id))}
        theme={wyboTheme}
        smallScreenBreakpoint
        components={{ Transition: FadeTransition }}
      /> 
      <AppRoutes />
    </React.Suspense>
  )
}
const mapStateToProps = (state) => ({

  ipData: state.auth.ipData,
})
const mapDispatchToProps = dispatch => ({
  incrementPageViewStartAsync: (pageId, pagePath) => dispatch(incrementPageViewStartAsync(pageId, pagePath)),
  fetchRouteToPageIdStartAsync: (pageId) => dispatch(fetchRouteToPageIdStartAsync(pageId)),
  incrementPageViewStartAsyncTraffic: (currentDate, parameter, pageId) => dispatch(incrementPageViewStartAsyncTraffic(currentDate, parameter, pageId)),
  addTrafficSources: (type) => dispatch(addTrafficSources(type, false)),
  storeTrafficByIpAndLocation: (ipData) =>  dispatch(storeTrafficByIpAndLocation(ipData)),
  fetchIpAndLocation: () => dispatch(getIP()),
  addPageView: (pageId, info) => dispatch(addPageView(pageId, info)),
  addRouteToPageId: (info) => dispatch(addRouteToPageId(info)),
  fetchRouteToPageIds: () => dispatch(fetchRouteToPageIds()),
});
export default connect(mapStateToProps, mapDispatchToProps)(RouterComponent); 