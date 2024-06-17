import React from 'react';
import { Breadcrumb, Panel } from 'rsuite';
import TestimonialForm from './form';
import { connect } from 'react-redux';
import { checkTestimonialSubmitted, checkUserTestimonial } from '../../../../redux/auth';
import { useEffect } from 'react';

const TestimonialFormPage = ({user, checkTestimonialSubmitted, isTestimonialSubmitted}) => {
    useEffect(() => {
        checkTestimonialSubmitted();
      }, [isTestimonialSubmitted])
  return (
    <Panel 
      header={
        <>
          <h2 className="title">Testimonial Form</h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item>Forms</Breadcrumb.Item>
            <Breadcrumb.Item active>Testimonials Form</Breadcrumb.Item>
          </Breadcrumb>
        </>
      }

    >
        <TestimonialForm user={user} isTestimonialSubmitted={isTestimonialSubmitted}/>
    </Panel>
  ); 
};
const mapDispatchToProps = dispatch => ({
    checkTestimonialSubmitted: () => dispatch(checkUserTestimonial()),
});
const mapStateToProps = state => ({
    user: state.auth?.user,
    // isTestimonialSubmitted: state.auth?.isTestimonialSubmitted,

});
export default connect(mapStateToProps, mapDispatchToProps)(TestimonialFormPage);
