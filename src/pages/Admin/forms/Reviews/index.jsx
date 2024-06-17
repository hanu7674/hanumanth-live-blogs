import React, { useEffect } from 'react';
import { Breadcrumb, Panel } from 'rsuite';
import { connect } from 'react-redux';
import ReviewForm from './form';
import { checkUserReview } from '../../../../redux/auth';

const ReviewsFormPage = ({user, checkReviewSubmitted, isReviewSubmitted}) => {
  useEffect(() => {
    checkReviewSubmitted();
  }, [isReviewSubmitted])
  return (
    <Panel 
      header={
        <>
          <h2 className="title">Reviews Form</h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item>Forms</Breadcrumb.Item>
            <Breadcrumb.Item active>Reviews Form</Breadcrumb.Item>
          </Breadcrumb>
        </>
      }

    >
        <ReviewForm user={user} isReviewSubmitted={isReviewSubmitted}/>
    </Panel>
  ); 
};
const mapDispatchToProps = dispatch => ({
  checkReviewSubmitted: () => dispatch(checkUserReview()),

});
const mapStateToProps = state => ({
    user: state.auth?.user,
    isReviewSubmitted: state.auth.isReviewSubmitted,
});
export default connect(mapStateToProps, mapDispatchToProps)(ReviewsFormPage);
