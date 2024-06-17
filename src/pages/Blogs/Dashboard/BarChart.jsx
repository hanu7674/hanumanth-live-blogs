// BarChartComponent.jsx
import React, { useState, useEffect } from 'react';
import { Button, ButtonGroup, Modal,Stack, FlexboxGrid,Checkbox,Divider, CheckboxGroup } from 'rsuite';
import { BiFullscreen, BiExitFullscreen } from 'react-icons/bi';
import { connect } from 'react-redux';
import { IoReload } from "react-icons/io5";
import BarChart from '../../Admin/dashboard/BarChart';
import { getBlogsByTimeRange } from '../../../redux/blogs';
import Loading from '../../../components/Loading/loading';
const initialTimeRangeOptions = [
  { label: 'Today', value: 'today' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' }
];

// Add the 'Year' option when the model is open

const BlogsBarChartComponent = ({ blogsByTimeRange, getBlogsByTimeRange, loading}) => {
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
    getBlogsByTimeRange(value)
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
        break
      default:
        throw new Error(`Invalid time range: ${timeRange}`);
    }
    return start;
  };
  const formatChartDataForBarChart = (data) => {
    const endDate = new Date();
    const startDate = calculateStartDate(activeTimeRange);
  
    // Generate an array of dates within the specified time range
    const dateRange = Array.from({ length: (endDate - startDate) / (1000 * 60 * 60 * 24) + 1 }, (_, index) => {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + index);
      return currentDate;
    });
  
    // Count the number of blogs for each date in the range and format the date
    const chartData = dateRange.map(date => {
      const formattedDate = date.toLocaleDateString('en-GB'); // Format date as dd/mm/yyyy
      const count = data?.filter(blog => {
        const blogDate = new Date(blog.timestamp.seconds * 1000);
        return blogDate.toLocaleDateString('en-GB') === formattedDate;
      }).length;
      return { x: formattedDate, y: count };
    });
  
    return [{ name: 'Blogs per Day', data: chartData }];
  };
  const handleRefresh = () => {
     getBlogsByTimeRange(activeTimeRange)
  };
 
  useEffect(() => {
       setChartLoading(true);
      console.log(blogsByTimeRange);
      const data = formatChartDataForBarChart(blogsByTimeRange)
      setTimeout(() => {
        setBarChartData(data);
        setChartLoading(false)
      }, 100)
   }, [activeTimeRange, blogsByTimeRange]);

  const BarChartComponent = () => (
    <BarChart
              title="Number of Blogs By Date"
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
                              <BiExitFullscreen  size={20}/>
                            </> : <><BiFullscreen  size={20}/> </>
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
      <BarChartComponent/></>
    }
    </>
  );
};
const mapDispatchToProps = dispatch => ({
  getBlogsByTimeRange: (timeRange) => dispatch(getBlogsByTimeRange(timeRange)),
 });
const mapStateToProps = state => ({
  loading: state.blogs?.blogsByTimeRangeLoading,
  blogsByTimeRange: state.blogs?.blogsByTimeRange,
 
});
export default connect(mapStateToProps, mapDispatchToProps)(BlogsBarChartComponent);
