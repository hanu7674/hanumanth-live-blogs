import React from 'react';
import { Breadcrumb, Panel } from 'rsuite';
import NotificationManagementComponent from './notifications'
import Loading from '../../../components/Loading/loading';
import { connect } from 'react-redux';
import { getNotifications } from '../../../redux/notifications';
import { useEffect } from 'react';
const Notifications = ({getNotifications}) => {
    useEffect(() => {
        getNotifications();
    },[])
  return (
    <Panel
      header={
        <>
          <h2 className="title">Notifications List</h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item >Admin</Breadcrumb.Item>
            <Breadcrumb.Item active>Notifications</Breadcrumb.Item>
          </Breadcrumb>
        </>
      }
    >
        <NotificationManagementComponent/>
    </Panel>
  );
};
const mapDispatchToProps = dispatch => ({
    getNotifications: () => dispatch(getNotifications())
});

export default connect(null, mapDispatchToProps)(Notifications);
