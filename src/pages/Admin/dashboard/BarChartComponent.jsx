// BarChartComponent.jsx
import React, { useState, useEffect } from 'react';
import { Button, ButtonGroup, Modal,Stack, FlexboxGrid,Checkbox,Divider, CheckboxGroup } from 'rsuite';
import BarChart from './BarChart';
import { BiFullscreen, BiExitFullscreen } from 'react-icons/bi';
import { useDispatch } from 'react-redux';
import { IoReload } from "react-icons/io5";
import { fetchDashboardDataTrafficSummary } from '../../../redux/dashboard';
const timeRangeOptions = [
    { label: 'Today', value: 'today' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
    { label: 'Year', value: 'year' },
  //   { label: 'All Time', value: 'allTime' },
  ];
const BarChartComponentPanel = ({  traffic }) => {
  const [barChartData, setBarChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [activeTimeRange, setActiveTimeRange] = useState('today');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [trafficOptions, setTrafficOptions] = React.useState(['Web', 'Social', 'Others']);
  const dispatch = useDispatch();
  const data = ['Web', 'Social', 'Others'];
  const handleCheckAllTrafficOptions = (value, checked) => setTrafficOptions(checked ? data : []);
  const handleTrafficOptionChange = value => setTrafficOptions(value);
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };
  const handleTimeRangeChange = (value) => {
    setActiveTimeRange(value);
  };
  const formattedData = (traffic) => {
    const allDates = new Set();
    const allCategories = new Set();

    // Collect all unique dates and categories
    Object.keys(traffic).forEach(date => {
      allDates.add(date);
      Object.keys(traffic[date]).forEach(category => {
        allCategories.add(category);
      });
    });
    const formattedData = Array.from(allCategories).map(category => {
      return {
        name: category,
        data: Array.from(allDates).map(date => {
          const count = traffic[date] && traffic[date][category] ? traffic[date][category].count : 0;
          return { x: date, y: count };
        })
      };
    });

    return formattedData;
  };
  const filterDataByTimeRange = (data, timeRange) => {
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
      default:
        startDate.setDate(today.getDate() - 2);
    }
    const filteredData = {};
    Object.keys(data)
      .filter((date) => new Date(date) >= startDate)
      .sort((a, b) => new Date(a) - new Date(b))
      .forEach((date) => {
        filteredData[date] = data[date];
      });
    return filteredData;
  };
  const handleRefresh = () => {
    dispatch(fetchDashboardDataTrafficSummary(trafficOptions))
  };
  useEffect(() => {
    if (traffic) {
      setChartLoading(true);
      const filteredData = filterDataByTimeRange(traffic, activeTimeRange);
      const formattedDataForChart = formattedData(filteredData);
      setTimeout(() => {
        setBarChartData(formattedDataForChart);
        setChartLoading(false)
      }, 100)
    }
  }, [activeTimeRange, traffic]);

  const BarChartComponent = () => (
    <BarChart
              title="Traffic Summary"
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
                </ButtonGroup>
              }
              loading={chartLoading}
              dataOptions={
                <>
                  <FlexboxGrid justify='space-between'>
                    <FlexboxGrid.Item colspan={18}>
                      <Stack wrap spacing={10} style={{ margin: '10px' }}>
                        <Checkbox
                          indeterminate={trafficOptions.length > 0 && trafficOptions.length < data.length}
                          checked={trafficOptions.length === data.length}
                          onChange={handleCheckAllTrafficOptions}
                        >
                          All
                        </Checkbox>
                        <Divider vertical />

                        <CheckboxGroup inline name="checkboxList" value={trafficOptions} onChange={handleTrafficOptionChange}>
                          {data.map(item => (
                            <Checkbox key={item} value={item}>
                              {item}
                            </Checkbox>
                          ))}
                        </CheckboxGroup>
                      </Stack>
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item colspan={6}>
                      <FlexboxGrid justify='end'>
                        <Stack spacing={10}>
                          {/* {
                            user && user.roles?.includes('ADMIN') ? <><Button onClick={() => addFakeTraffic()}>Add fake traffic</Button></> : ''
                          } */}
                          {
                            isModalVisible ? <>
                              <BiExitFullscreen onClick={toggleModal} />
                            </> : <><BiFullscreen onClick={toggleModal} /> </>
                          }</Stack></FlexboxGrid>
                    </FlexboxGrid.Item>
                  </FlexboxGrid>
                </>
              }
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
