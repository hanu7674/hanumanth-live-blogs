// BarChartComponent.jsx
import React, { useState, useEffect } from 'react';
import { Button, ButtonGroup, Modal } from 'rsuite';
import BarChart from '../../dashboard/BarChart';
import { BiFullscreen, BiExitFullscreen } from 'react-icons/bi';
const timeRangeOptions = [
    { label: 'Today', value: 'today' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
    { label: 'Year', value: 'year' },
  //   { label: 'All Time', value: 'allTime' },
  ];
const BarChartComponentPanel = ({  eventsbarChartData }) => {
  const [barChartData, setBarChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [activeTimeRange, setActiveTimeRange] = useState('today');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };
  const handleTimeRangeChange = (value) => {
    setActiveTimeRange(value);
  };
  const calculateStartDate = (timeRange, start) => {
    const today = new Date();
    const startDate = new Date(today);

    switch (timeRange) {
      case 'week':
        startDate.setDate(today.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(today.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(today.getFullYear() - 1);
        break;
      case 'today':
        startDate.setDate(today.getDate() - 1);
        break;
      default:
        startDate.setDate(today.getDate() - 1);
    }

    return startDate;
  };

  const formattedData = (filteredData, startDate, endDate) => {
    const reviews = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateKey = currentDate.toISOString().split('T')[0];
      const y = filteredData.reduce((acc, item) => {
        const createdAt = item.createdAt.toDate();
        const date = createdAt.toISOString().split('T')[0];
        return date === dateKey ? acc + 1 : acc;
      }, 0);
      reviews.push({ x: dateKey, y });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    const formattedDataList = [{ name: 'Events Count', data: [...reviews] }];

    return formattedDataList;
  };

  useEffect(() => {
    if (eventsbarChartData) {
      setChartLoading(true);
      const startDate = calculateStartDate(activeTimeRange, eventsbarChartData[0]?.createdAt.toDate());
      const endDate = new Date();

      const filteredData = eventsbarChartData.filter((item) => {
        const createdAt = item.createdAt.toDate();
        return createdAt >= startDate && createdAt <= endDate;
      });

      const formattedEventssData = formattedData(filteredData, startDate, endDate);
      setTimeout(() => {
        setBarChartData(formattedEventssData);
        setChartLoading(false);
      }, 100);
    }
  }, [activeTimeRange, eventsbarChartData]);

  const BarChartComponent = () => (
    <BarChart
      title="Events Summary"
      actions={
        <div>
          <ButtonGroup>
            {timeRangeOptions.map((option) => (
              <Button
                active={activeTimeRange === option.value}
                key={option.value}
                onClick={() => handleTimeRangeChange(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </ButtonGroup>
          <ButtonGroup style={{ marginLeft: '10px' }}>
            {isModalVisible ? (
              <BiExitFullscreen size={30} onClick={toggleModal} />
            ) : (
              <BiFullscreen size={30} onClick={toggleModal} />
            )}
          </ButtonGroup>
        </div>
      }
      loading={chartLoading}
      series={barChartData}
      type="area"
    />
  )
  return (
    <>
    <Modal open={isModalVisible} onClose={toggleModal} backdrop='static' size='full' overflow={false}>
        <Modal.Header>
          <Modal.Title>Full Charts</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <BarChartComponent />
        </Modal.Body>
      </Modal>
      <BarChartComponent/>
    </>
  );
};

export default BarChartComponentPanel;
