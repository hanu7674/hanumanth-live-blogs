import React, { useEffect } from "react";
import { Panel } from "rsuite";
import { connect } from "react-redux";
import { fetchCalendarDashboard } from "../../../../redux/calender";
import CalendarComponent from './dashboard'
const CalendarDashboardPage = ({ totalEventsCount,eventsbarChartData, eventDurationAnalysis, fetchCalendarDashboardData,loading, error, viewCountCityArray, viewCountContinentArray, viewCountCountryArray }) => {
    useEffect(() => {
        fetchCalendarDashboardData();
    }, [])
    return (
        <Panel header={<div><h3 className="title">Calandar Dashboard</h3></div>}>
            <CalendarComponent totalEventsCount={totalEventsCount} eventDurationAnalysis={eventDurationAnalysis}  eventsbarChartData={eventsbarChartData} fetchDashboardDataEventsSummary = {fetchCalendarDashboard} loading={loading} error={error} viewCountCityArray={viewCountCityArray} viewCountContinentArray={viewCountContinentArray} viewCountCountryArray={viewCountCountryArray}/>
        </Panel>
    )
}

const mapDispatchToProps = dispatch => ({
    fetchCalendarDashboardData: () => dispatch(fetchCalendarDashboard())
});
const mapStateToProps = state => ({
    loading: state.events.dashboardLoading,
    error: state.events.dashboardError,
    totalEventsCount: state.events.totalEventsCount,
    eventsbarChartData: state.events.eventsbarChartData,
    viewCountCityArray: state.events.viewCountCityArray,
    viewCountContinentArray: state.events.viewCountContinentArray,
    viewCountCountryArray: state.events.viewCountCountryArray,
    eventDurationAnalysis: state.events.durationAnalysis,
});
export default connect(mapStateToProps, mapDispatchToProps)(CalendarDashboardPage);