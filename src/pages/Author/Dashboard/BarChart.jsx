import React, { useState, useEffect } from 'react';
import { Button, ButtonGroup, Modal, Stack, FlexboxGrid, Checkbox, Divider, CheckboxGroup } from 'rsuite';
import { BiFullscreen, BiExitFullscreen } from 'react-icons/bi';
import { connect } from 'react-redux';
import { IoReload } from "react-icons/io5";
import BarChart from '../../Admin/dashboard/BarChart';
import { fetchAuthorsByTimeRange } from '../../../redux/authorsDashboard';
import Loading from '../../../components/Loading/loading';

const initialTimeRangeOptions = [
  { label: 'Today', value: 'today' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' }
];

const AuthorsBarChartComponent = ({ authorsByTimeRange, fetchAuthorsByTimeRange, loading }) => {
  const [barChartData, setBarChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [activeTimeRange, setActiveTimeRange] = useState('today');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const timeRangeOptions = isModalVisible
    ? [...initialTimeRangeOptions, { label: 'Year', value: 'year' }]
    : initialTimeRangeOptions;

  const handleTimeRangeChange = (value) => {
    setActiveTimeRange(value);
fetchAuthorsByTimeRange(value)
  };

  const calculateStartDate = (timeRange) => {
    const today = new Date();
    const start = new Date(today);
    switch (timeRange) {
      case 'week':
        start.setDate(today.getDate() - 7);
        break;
      case 'month':
        start.setMonth(today.getMonth() - 1);
        break;
      case 'year':
        start.setFullYear(today.getFullYear() - 1);
        break;
      case 'today':
        start.setDate(today.getDate());
        break;
      default:
        throw new Error(`Invalid time range: ${timeRange}`);
    }
    return start;
  };

  const formatChartDataForBarChart = (data) => {
    const endDate = new Date();
    const startDate = calculateStartDate(activeTimeRange);

    const dateRange = Array.from({ length: (endDate - startDate) / (1000 * 60 * 60 * 24) + 1 }, (_, index) => {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + index);
      return currentDate;
    });

    const chartData = dateRange.map(date => {
      const formattedDate = date.toLocaleDateString('en-GB');
      const count = data?.filter(author => {
        const authorDate = new Date(author.timestamp.seconds * 1000);
        return authorDate.toLocaleDateString('en-GB') === formattedDate;
      }).length;
      return { x: formattedDate, y: count };
    });

    return [{ name: 'Authors per Day', data: chartData }];
  };

  const handleRefresh = () => {
fetchAuthorsByTimeRange(activeTimeRange)
  };

  useEffect(() => {
    setChartLoading(true);
    const data = formatChartDataForBarChart(authorsByTimeRange)
    setTimeout(() => {
      setBarChartData(data);
      setChartLoading(false)
    }, 100)
  }, [activeTimeRange, authorsByTimeRange]);

  const BarChartComponent = () => (
    <BarChart
      title="Number of Authors By Date"
      actions={
        <ButtonGroup>
          {timeRangeOptions.map(option => (
            <Button
              active={activeTimeRange === option.value}
              key={option.value} onClick={() => handleTimeRangeChange(option.value)}>
              {option.label}
            </Button>
          ))}
          <Button onClick={handleRefresh}><IoReload size={20} /></Button>
          <Button onClick={toggleModal}>
            {
              isModalVisible ? <>
                <BiExitFullscreen size={20} />
              </> : <><BiFullscreen size={20} /> </>
            }</Button>
        </ButtonGroup>
      }
      loading={chartLoading}
      series={barChartData}
      type="area"
    />
  )

  return (
    <>
      {
        loading ? <><Loading /></> : <>
          <Modal open={isModalVisible} onClose={toggleModal} backdrop='static' size='full' overflow={false}>
            <Modal.Header>
              <Modal.Title>Full Charts</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <BarChartComponent />
            </Modal.Body>
          </Modal>
          <BarChartComponent /></>
      }
    </>
  );
};

const mapDispatchToProps = dispatch => ({
  fetchAuthorsByTimeRange: (timeRange) => dispatch(fetchAuthorsByTimeRange(timeRange)),
});

const mapStateToProps = state => ({
  loading: state.authors?.authorsByTimeRangeLoading,
  authorsByTimeRange: state.authors?.authorsByTimeRange,
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthorsBarChartComponent);
