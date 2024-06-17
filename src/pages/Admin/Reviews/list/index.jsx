import React, { useEffect } from 'react';
import { Breadcrumb, Panel } from 'rsuite';
import  ReviesManagementComponent from './reviews';
import { fetchReviewsList } from '../../../../redux/auth';
import { connect } from 'react-redux';

const ReviewsListPage = ({fetchReviewsList}) => {
  useEffect(() => {
    fetchReviewsList();
  },[])
  return (
    <Panel
      header={
        <>
          <h2 className="title">Reviews Management</h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item active>Reviews Management</Breadcrumb.Item>
          </Breadcrumb>
        </>
      }
    >
        <ReviesManagementComponent/>
    </Panel>
  );
};

const mapDispatchToProps = dispatch => ({
  fetchReviewsList: () => dispatch(fetchReviewsList())
});

export default connect(null, mapDispatchToProps)(ReviewsListPage);
