import React from 'react';
import TicketManagementComponent from './tickets';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchDashboardDataTicketsSummary } from '../../../../redux/tickets';



const ViewTicketsComponent =  () => {
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(fetchDashboardDataTicketsSummary())
  }, [])
  return(
  <>
    <TicketManagementComponent />
  </>
)};
export default ViewTicketsComponent