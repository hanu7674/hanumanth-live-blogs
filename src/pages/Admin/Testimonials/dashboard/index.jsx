import React, { useEffect } from "react";
import { Panel } from "rsuite";
import { connect } from "react-redux";
import TestimonialsDashboard from './dashboard'
import {  fetchTestimonialsDashboard } from "../../../../redux/auth";

const TestimonialsDashboardPage = ({loading, error, totalTestimonialsCount,testimonialsbarChartData, fetchTestimonialsDashboardData, viewCountCityArray, viewCountContinentArray, viewCountCountryArray  }) => {
    useEffect(() => {
        fetchTestimonialsDashboardData();
    }, [])
    return (
        <Panel header={<div><h3 className="title">Testimonials Dashboard</h3></div>}>
            <TestimonialsDashboard viewCountCityArray={viewCountCityArray} viewCountContinentArray={viewCountContinentArray} viewCountCountryArray={viewCountCountryArray} loading={loading} fetchTestimonialsDashboardData={fetchTestimonialsDashboardData} error={error} totalTestimonialsCount={totalTestimonialsCount} testimonialsbarChartData={testimonialsbarChartData} />
        </Panel>
    )
}

const mapDispatchToProps = dispatch => ({
    fetchTestimonialsDashboardData: () => dispatch(fetchTestimonialsDashboard())
});
const mapStateToProps = state => ({
    totalTestimonialsCount: state.auth.totalTestimonialsCount,
    testimonialsbarChartData: state.auth.testimonialsbarChartData,
    loading: state.auth.testimonialsloading,
    error: state.auth.testimonialserror,
    viewCountCityArray: state.auth.viewCountCityArray,
    viewCountContinentArray: state.auth.viewCountContinentArray,
    viewCountCountryArray: state.auth.viewCountContinentArray,
});
export default connect(mapStateToProps, mapDispatchToProps)(TestimonialsDashboardPage);