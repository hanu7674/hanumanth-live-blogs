
import React from 'react';
import { Breadcrumb, Loader, Panel } from 'rsuite';
import ViewTicketComponent from './ViewTicketComponent';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { useEffect } from 'react';
import { getTicketDetails } from '../../../../redux/tickets';
import Loading from '../../../../components/Loading/loading'
import { useState } from 'react';
const ViewTicketComponentPage = ({ticket,loading,getTicketDetails}) => {
  const [reload, setReload] = useState(false);
  const {id} = useParams();
  useEffect(()=>{
    getTicketDetails(id);
    if(reload){
      setReload(false)
    }
  },[id, reload]);
  return (
    <Panel 
      header={
        <>
          <h2 className="title">View Ticket Details</h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item>Ticket</Breadcrumb.Item>
            <Breadcrumb.Item >View Ticket</Breadcrumb.Item>
            <Breadcrumb.Item active>{id}</Breadcrumb.Item>
          </Breadcrumb>
        </>
      }
    >
      {
        loading ? <Loading/>: 
      <ViewTicketComponent ticket = {ticket} reload = {() => setReload(true)}/> }
    </Panel>
  );
};
const mapDispatchToProps = dispatch => ({
      getTicketDetails: (id) => dispatch(getTicketDetails(id)),
  // updateTicketStatus: (id,user, status) => dispatch(updateTicketStatus(id,user, status)),
});
const mapStateToProps = state => ({
  ticket: state.tickets?.ticket,
  loading: state.tickets?.loading,
  error: state.tickets?.error,
});
export default connect(mapStateToProps, mapDispatchToProps)(ViewTicketComponentPage);
