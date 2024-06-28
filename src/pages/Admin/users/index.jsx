import React, { useEffect } from "react";
import { Panel } from "rsuite";
import UsersDashboard from "./dashboard";
import { fetchDashboardDataTicketsSummary, getTicketsDashboardHeaderData } from "../../../redux/tickets";
import { connect } from "react-redux";
import Loading from "../../../components/Loading/loading";
import { fetchTrafficData, getUsersDashboardHeaderData, fetchUserSignupLogs } from "../../../redux/dashboard";


const UsersDashboardPage = ({}) => {
    
    return (
        <Panel header ={<div> <h3 className="title"> </h3>Dashboard</div>}>
             
<UsersDashboard  />
             
            </Panel>
    )
}

const mapDispatchToProps = dispatch => ({
    

});
const mapStateToProps = state => ({
  
});
export default connect(mapStateToProps, mapDispatchToProps)(UsersDashboardPage);