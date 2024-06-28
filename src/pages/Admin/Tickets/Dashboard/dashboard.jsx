import React, { useState, useEffect } from "react";
import { Col, FlexboxGrid, Loader, Panel, Row, Modal, ButtonGroup, Button, Checkbox, CheckboxGroup, Divider, Stack, Grid } from "rsuite";
import { LiaUsersSolid } from "react-icons/lia";
import { FaUsers } from "react-icons/fa";
import { RiUserSettingsLine } from "react-icons/ri";
import './index.css';
import BarChart from '../../dashboard/BarChart';
import PieChart from '../../dashboard/PieChart';
import { BiFullscreen, BiExitFullscreen } from 'react-icons/bi'
import { connect } from "react-redux";
import { fetchDashboardDataTicketsSummary } from "../../../../redux/tickets";
import { IoReload, IoTicketOutline } from "react-icons/io5";
import Loading from "../../../../components/Loading/loading";
import '../../dashboard/styles.css'

const timeRangeOptions = [
  { label: 'Today', value: 'today' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: 'Year', value: 'year' },
];
const TicketsDashboard = ({ ticketsHeaderData, tickets, user, loading, error, fetchDashboardDataTicketsSummary, }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [barChartData, setBarChartData] = useState([]);
  const [activeTimeRange, setActiveTimeRange] = useState('today');
  const handleTimeRangeChange = (value) => {
    setActiveTimeRange(value);
  };

  const [ticketsOptions, setTicketsOptions] = React.useState(['Open', 'Assigned', 'Re-assigned', 'Hold', 'Waiting', 'Work In Progress', 'Close', 'Pending']);
  const data = ['Open', 'Assigned', 'Re-assigned', 'Hold', 'Waiting', 'Work In Progress', 'Close', 'Pending'];
  const handleCheckAllTicketsOptions = (value, checked) => setTicketsOptions(checked ? data : []);
  const handleTicketsOptionChange = value => setTicketsOptions(value);
  const [isFirstTime, setIsFirstTime] = useState(true);

  const filterDataByTimeRange = (tickets, timeRange, ticketsOptions) => {
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
        startDate.setDate(today.getDate());
        break
      default:
        startDate.setDate(today.getDate());
    }

    const endDate = new Date(today);

    const filteredData = [];
    const statusCounts = {};

    ticketsOptions.forEach((status) => {
      filteredData.push({
        name: status,
        data: [],
      });
    });

    // Generate an array of date strings between start and end dates
    const dateRange = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dateRange.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    tickets.forEach((ticket) => {
      const createdAt = new Date(ticket.createdAt?.seconds * 1000);

      if (createdAt >= startDate) {
        const status = ticket.status;

        if (ticketsOptions.includes(status)) {
          const dateString = createdAt.toISOString().split('T')[0];

          statusCounts[dateString] = statusCounts[dateString] || {};
          statusCounts[dateString][status] = (statusCounts[dateString][status] || 0) + 1;

          const entryIndex = filteredData.findIndex((entry) => entry.name === status);
          const existingDataPoint = filteredData[entryIndex].data.find((point) => point.x === dateString);

          if (existingDataPoint) {
            existingDataPoint.y += 1;
          } else {
            filteredData[entryIndex].data.push({ x: dateString, y: 1 });
          }
        }
      }
    });

    // Fill in missing dates with 0 count for each status
    dateRange.forEach((dateString) => {
      filteredData.forEach((entry) => {
        const existingDataPoint = entry.data.find((point) => point.x === dateString);
        if (!existingDataPoint) {
          entry.data.push({ x: dateString, y: 0 });
        }
      });
    });
    filteredData.forEach((entry) => {
      entry.data.sort((a, b) => new Date(a.x) - new Date(b.x));
    });
    return filteredData;
  };
  const filterDataByType = (tickets, ticketsOptions) => {
    const ticketCounts = {};
  
    ticketsOptions.forEach((status) => {
      ticketCounts[status] = 0;
    });
  
    // Update counts based on actual occurrences
    tickets.forEach((ticket) => {
      const ticketStatus = ticket.status;
  
      if (ticketsOptions.includes(ticketStatus)) {
        ticketCounts[ticketStatus] += 1;
      }
    });
  
    // Convert counts to the desired array format
    const filteredData = Object.entries(ticketCounts).map(([name, total]) => ({
      name,
      total,
    }));
    return filteredData;
  };
  const getBarChartData = () => {
    fetchDashboardDataTicketsSummary();
  };
  useEffect(() => {
    getBarChartData();
  }, []);
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };
  const [pieChartData, setPieChartData] = useState([]);
  const [pieChartOverallData, setPieChartOverallData] = useState([]);
  useEffect(() => {
    
    if (tickets) {
      const filteredData = filterDataByTimeRange(tickets, activeTimeRange, ticketsOptions)
      setTimeout(() => {
        setBarChartData(filteredData);
      }, 100)
    }
    if (isFirstTime && tickets?.length > 0) {
      const filteredData = filterDataByTimeRange(tickets, activeTimeRange, ticketsOptions);
      const overallFilteredData = filterDataByType(tickets, data); 
      setPieChartData(filteredData);
      setPieChartOverallData(overallFilteredData);
      setIsFirstTime(false);
    }
  }, [ticketsOptions, activeTimeRange, tickets])
  const pieChartDataValues = (data) => {
    const res = [];
    data.map((item) => {
      let r = 0
      item?.data?.map((doc) => {
        r = r + doc?.y 
      })
      if (r !== 0) {
        res.push(r);
      }
    })
    return res;
  }
  const pieChartOverallDataValues = (data) => {
    const res = [];
    data.map((item) =>{
        res.push(item.total)      
    })
    return res;
  }
  const BarChartComponent = () => (
    <BarChart
      title="Tickets Summary"
      actions={
        <ButtonGroup>
          {timeRangeOptions.map(option => (
            <Button
              active={activeTimeRange === option.value}
              key={option.value} onClick={() => handleTimeRangeChange(option.value)}>
              {option.label}
            </Button>
          ))}
          <Button onClick={() => getBarChartData()}><IoReload size={20} /></Button>
        </ButtonGroup>
      }
      loading={loading}
      dataOptions={
        <>
          <Grid fluid>
            <Row>
              <Col sm={18} md={20} lg={22} xl={22} xs={16}>
                <Checkbox
                  indeterminate={ticketsOptions.length > 0 && ticketsOptions.length < data.length}
                  checked={ticketsOptions.length === data.length}
                  onChange={handleCheckAllTicketsOptions}
                >
                  All
                </Checkbox>
                <div style={{ borderTop: '1px solid white', marginLeft: '20px' }}>
                  <CheckboxGroup name="checkboxList" value={ticketsOptions} onChange={handleTicketsOptionChange}>
                    <Stack wrap>
                      {data.map(item => (

                        <Checkbox key={item} value={item}>
                          {item}
                        </Checkbox>

                      ))}</Stack>
                  </CheckboxGroup></div>
              </Col>
              <Col sm={6} md={4} lg={2} xl={2} xs={8}>
                <Stack spacing={10} alignItems="center">

                  {
                    isModalVisible ? <>
                      <BiExitFullscreen size={20} onClick={toggleModal} />
                    </> : <><BiFullscreen size={20} onClick={toggleModal} /> </>
                  }</Stack>
              </Col>
            </Row>
          </Grid>
          {/* <FlexboxGrid  justify='space-between' style={{ flexWrap: 'wrap' , maxWidth: '100%'}}>
                  <FlexboxGrid.Item colspan={20}>
                    <Stack wrap spacing={10} style={{ margin: '10px' }} alignItems="center">
                      <Checkbox
                        indeterminate={ticketsOptions.length > 0 && ticketsOptions.length < data.length}
                        checked={ticketsOptions.length === data.length}
                        onChange={handleCheckAllTicketsOptions}
                      >
                        All
                      </Checkbox>
                    </Stack>
                    <Stack wrap spacing={10} style={{ margin: '10px' }}>
                      <CheckboxGroup  inline name="checkboxList" value={ticketsOptions} onChange={handleTicketsOptionChange}>
                        {data.map(item => (
                          <Checkbox key={item} value={item}>
                            {item}
                          </Checkbox>
                        ))}
                      </CheckboxGroup>
                    </Stack>
                  </FlexboxGrid.Item>
                  <FlexboxGrid.Item colspan={4}>
                    <FlexboxGrid justify='end'>
                    <Stack spacing={10} alignItems="center">
                      
                  {
                    isModalVisible ? <>
                      <BiExitFullscreen onClick={toggleModal} />
                    </> : <><BiFullscreen onClick={toggleModal} /> </>
                  }</Stack></FlexboxGrid>
                  </FlexboxGrid.Item>
                </FlexboxGrid> */}
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
      <Panel shaded >
        <Row gutter={30} className="dashboard-header">
          <Col xs={20} sm={22} md={12} lg={10} xl={8}>
            <Panel className="trend-box bg-gradient-red"data-aos="fade-down" data-aos-anchor-placement="bottom-bottom" data-aos-offset="100"
     data-aos-easing="ease-in-sine">
              <div className="chart-img"><LiaUsersSolid size={64} /></div>
              <div className="title">Total Active Users </div>
              <div className="value">
                {loading ? <Loader /> : <>{ticketsHeaderData?.activeUsersCount}</>}</div>
            </Panel>
          </Col>
          <Col xs={20} sm={22} md={12} lg={10} xl={8}>
            <Panel className="trend-box bg-gradient-green"data-aos="fade-down" data-aos-anchor-placement="bottom-bottom" data-aos-offset="100"
     data-aos-easing="ease-in-sine">
              <div className="chart-img"><FaUsers size={64} /></div>
              <div className="title">Total Users </div>
              <div className="value">
                {loading ? <Loader /> : <>{ticketsHeaderData?.usersCount}</>}</div>
            </Panel>
          </Col>
          <Col xs={20} sm={22} md={12} lg={10} xl={8}>
            <Panel className="trend-box bg-gradient-blue"data-aos="fade-down" data-aos-anchor-placement="bottom-bottom" data-aos-offset="100"
     data-aos-easing="ease-in-sine">
              <div className="chart-img"><RiUserSettingsLine size={64} /></div>
              <div className="title">Total Admins</div>
              <div className="value">
                {loading ? <Loader /> : <>{ticketsHeaderData?.adminsCount} </>}</div>
            </Panel>
          </Col>

          {ticketsHeaderData?.ticketStatusSummary?.map((status) => (
    <Col key={status.value} xs={20} sm={22} md={12} lg={10} xl={8}>
      <Panel className={`trend-box bg-gradient-${status.color}`} data-aos="fade-down" data-aos-anchor-placement="bottom-bottom" data-aos-offset="100"
     data-aos-easing="ease-in-sine">
        <div className="chart-img"><IoTicketOutline size={64} /></div>
        <div className="title">{`${status.label} Tickets`}</div>
        <div className="value">
          {loading ? <Loader /> : <>{status.count}</>}
        </div>
      </Panel>
    </Col>
  ))}
        </Row>
        <Row gutter={30}>
          <Col xs={20} sm={22} md={20} lg={18} xl={16}  >
            {
              loading ? <Loading/> :  
            <BarChartComponent /> }
          </Col>
          <Col xs={20} sm={22} md={20} lg={18} xl={8}  >
          {
              loading ? <Loading/> :
            <PieChart
              title="Today's Ticket Status"
              data={pieChartDataValues(pieChartData)}
              type="donut"
              labels={data}
            />}
          </Col>
        </Row>
        <Row gutter={30}>
          
          <Col xs={20} sm={22} md={20} lg={18} xl={16}  >
          {
              loading ? <Loading/> :
                        <PieChart
              title="Overall Ticket Status"
              data={pieChartOverallDataValues(pieChartOverallData)}
              type="donut"
              labels={data}
          />
}
          </Col>
          <Col xs={20} sm={22} md={20} lg={18} xl={8}   >

          </Col>
        </Row>
      </Panel>
    </>
  )
}
const mapDispatchToProps = dispatch => ({
  fetchDashboardDataTicketsSummary: () => dispatch(fetchDashboardDataTicketsSummary()),
});
const mapStateToProps = state => ({
  loading: state.tickets?.loading,
  user: state.tickets?.user,
  tickets: state.tickets?.tickets,

});
export default connect(mapStateToProps, mapDispatchToProps)(TicketsDashboard);