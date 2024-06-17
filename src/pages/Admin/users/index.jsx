import React, { useEffect } from "react";
import { Panel } from "rsuite";
import UsersDashboard from "./dashboard";
import { fetchDashboardDataTicketsSummary, getTicketsDashboardHeaderData } from "../../../redux/tickets";
import { connect } from "react-redux";
import Loading from "../../../components/Loading/loading";
import { fetchTrafficData, getUsersDashboardHeaderData, fetchUserSignupLogs } from "../../../redux/dashboard";


const UsersDashboardPage = ({loading,  usersHeadersData ,fetchTrafficData , getHeaderData, fetchUserSignupLogs}) => {
    useEffect(() => {
        getHeaderData();
        fetchTrafficData();
        fetchUserSignupLogs();
    },[])
    return (
        <Panel header ={<div> <h3 className="title"> </h3>Dashboard</div>}>
            {
                loading ? <Loading/> :
            <UsersDashboard usersHeaderData = {usersHeadersData}/>
            }
            </Panel>
    )
}

const mapDispatchToProps = dispatch => ({
    getHeaderData: () => dispatch(getUsersDashboardHeaderData()),
    fetchTrafficData: () => dispatch(fetchTrafficData()),
  fetchUserSignupLogs: () => dispatch(fetchUserSignupLogs()),

});
const mapStateToProps = state => ({
  usersHeadersData: state.dashboardData?.usersHeaderData,
  loading: state.dashboardData.loading,
});
export default connect(mapStateToProps, mapDispatchToProps)(UsersDashboardPage);