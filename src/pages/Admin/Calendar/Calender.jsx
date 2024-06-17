import React from 'react';
import PageContent from './PageContent';
import CalendarComponent from './CalendarComponent';
import { useSelector } from 'react-redux';
import Loading from '../../../components/Loading/loading';
const Calendar = () => {

  return (
    <PageContent className="calendar-app">
      {
        <CalendarComponent />
      }
    </PageContent>
  );
};


export default Calendar;