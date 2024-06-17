import React, { useEffect } from "react";
import { Panel } from "rsuite";
import { connect } from "react-redux";
import ReviewsDashboard from './dashboard'
import { fetchReviewsDashboard } from "../../../../redux/auth";

const ReviewsDashboardPage = ({loading, error, totalReviewsCount,reviewsbarChartData, fetchReviewsDashboardData, viewCountCityArray, viewCountContinentArray, viewCountCountryArray }) => {
    useEffect(() => {
        fetchReviewsDashboardData();
    }, [])
    return (
        <Panel header={<div><h3 className="title">Reviews Dashboard</h3></div>}>
            <ReviewsDashboard viewCountCityArray={viewCountCityArray} totalReviewsCount={totalReviewsCount} viewCountContinentArray={viewCountContinentArray} viewCountCountryArray={viewCountCountryArray} loading={loading} fetchReviewsDashboardData={fetchReviewsDashboardData} error={error} reviewsbarChartData={reviewsbarChartData} />
        </Panel>
    )
}

const mapDispatchToProps = dispatch => ({
    fetchReviewsDashboardData: () => dispatch(fetchReviewsDashboard())
});
const mapStateToProps = state => ({
    totalReviewsCount: state.auth.totalReviewsCount,
    reviewsbarChartData: state.auth.reviewsbarChartData,
    loading: state.auth.reviewsloading,
    error: state.auth.reviewserror,
    viewCountCityArray: state.auth.viewCountCityArray,
     viewCountContinentArray: state.auth.viewCountContinentArray,
      viewCountCountryArray: state.auth.viewCountContinentArray,
});
export default connect(mapStateToProps, mapDispatchToProps)(ReviewsDashboardPage);