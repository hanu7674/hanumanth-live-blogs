import React, { useEffect } from "react";
import { Panel } from "rsuite";
import TicketsDashboard from "./dashboard";
import { fetchDashboardDataTicketsSummary, getTicketsDashboardHeaderData } from "../../../../redux/tickets";
import { connect } from "react-redux";
import Loading from "../../../../components/Loading/loading";


const TicketsDashboardPage = ({loading,  ticketsHeaderData  , getHeaderData}) => {
    useEffect(() => {
        getHeaderData();
    },[])
    return (
        <Panel header ={<h3 className="title">Dashboard</h3>}>
            {
                loading ? <Loading/> :
            <TicketsDashboard ticketsHeaderData = {ticketsHeaderData}/>
            }
            </Panel>
    )
}

const mapDispatchToProps = dispatch => ({
    getHeaderData: () => dispatch(getTicketsDashboardHeaderData()),
});
const mapStateToProps = state => ({
  ticketsHeaderData: state.auth?.ticketsHeaderData,
  loading: state.auth.loading,
});
export default connect(mapStateToProps, mapDispatchToProps)(TicketsDashboardPage);