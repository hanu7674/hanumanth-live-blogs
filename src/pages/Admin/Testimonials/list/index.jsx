import React, { useEffect } from 'react';
import { Breadcrumb, Panel } from 'rsuite';
import  TestimonialsManagementComponent from './testimonials';
import {  fetchTestimonialsList } from '../../../../redux/auth';
import { connect } from 'react-redux';

const TestimonialsListPage = ({fetchTestimonialsList}) => {
  useEffect(() => {
    fetchTestimonialsList();
  },[])
  return (
    <Panel
      header={
        <>
          <h2 className="title">Testimonials Management</h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item active>Testimonials Management</Breadcrumb.Item>
          </Breadcrumb>
        </>
      }
    >
        <TestimonialsManagementComponent />
    </Panel>
  );
};

const mapDispatchToProps = dispatch => ({
  fetchTestimonialsList: () => dispatch(fetchTestimonialsList())
});
export default connect(null, mapDispatchToProps)(TestimonialsListPage);
