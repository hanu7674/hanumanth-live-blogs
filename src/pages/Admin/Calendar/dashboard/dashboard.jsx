import React, { useState, useEffect } from "react";
import { Col, Loader, Panel, Row, Modal, Stack } from "rsuite";
import PieChart from '../../dashboard/PieChart';
import { BiFullscreen, BiExitFullscreen } from 'react-icons/bi'
import { MdReviews } from "react-icons/md";
import MapChart1 from "../../users/Maps";
import { GiDuration } from "react-icons/gi";
import BarChartComponent1 from './barchart'; // Update the path accordingly

const CalendarDashboard = ({ eventsbarChartData, loading,eventDurationAnalysis, error, totalEventsCount, viewCountCityArray, viewCountContinentArray, viewCountCountryArray  }) => {     
//   todo: 'Add location data and display avarage by country'
  const [pieChartData, setPieChartData] = useState([]);
  const [isMapModalVisible, setIsMapModalVisible] = useState(false);
  const [markers, setMarkers] = useState([])
  const [countriesCount, setCountriesCount] = useState([]);
  const toggleMapModal = () => {
    setIsMapModalVisible(!isMapModalVisible);
  };
  const convertListToMarkers = (inputList) => {
    return inputList.map((input) => ({
      markerOffset: -15,
      name: `${input.city}, ${input.country_name}`,
      coordinates: [input.longitude, input.latitude],
      count: input.count || 1,
    }));
  };
  useEffect(() => {
    const top10Cities = viewCountCityArray?.sort((a, b) => b.count - a.count).slice(0,10);
        const pieChartData =top10Cities.map((item) => ({
            label: item.city,
            value: item.count,
        }));
        setPieChartData(pieChartData);
    const data = convertListToMarkers(viewCountCityArray);
    setMarkers(data);
    setCountriesCount(viewCountCountryArray)
  }, [viewCountCityArray, viewCountCountryArray])
  const Map = () => (
    <Panel className="card"
    header={
      <Stack justifyContent="space-between">
        <span>Events by City and Country</span>
        <span>
        {
                    isMapModalVisible ? <>
                      <BiExitFullscreen size={20} onClick={toggleMapModal} />
                    </> : <><BiFullscreen size={20} onClick={toggleMapModal} /> </>
                  }
        </span>
      </Stack>
    }>
                  <MapChart1 markers={markers} title={'Events Counts by City'} countryCountData={countriesCount}/>
            </Panel>
  )

  const PieChartComponent = () => (
    <PieChart
      title="Events with City Distribution"
      data={pieChartData && pieChartData?.map((item) => item.value)}
      labels={pieChartData && pieChartData?.map((item) => item.label)}
      type="pie"
    />
  );
  return (
    <>
      <Modal open={isMapModalVisible} onClose={toggleMapModal} backdrop='static' size='full' overflow={false}>
        <Modal.Header>
            {/* <Modal.Title>Full View of Real Time Users Data</Modal.Title> */}
        </Modal.Header>
        <Modal.Body>
          <Map />
        </Modal.Body>
      </Modal>
      <Panel shaded >
        <Row gutter={30}>
        <Col xs={20} sm={22} md={22} lg={17} xl={16}>
            <Map/>
        </Col>
        <Col xs={20} sm={22} md={22} lg={7} xl={8}>
           <Row gutter={30} className="dashboard-header" style={{ marginTop: '20px' }}>

            <Col xs={22} sm={22} md={22} lg={22} xl={22}>
            <Panel className="trend-box bg-gradient-red" data-aos="fade-down" data-aos-anchor-placement="bottom-bottom" data-aos-offset="100"
     data-aos-easing="ease-in-sine">
              <div className="chart-img"><MdReviews size={64} /></div>
              <div className="title">Total Events </div>
              <div className="value">
                {loading ? <Loader /> : <>{totalEventsCount}</>}</div>
            </Panel>
          </Col>
          <Col xs={22} sm={22} md={22} lg={22} xl={22}>
            <Panel className="trend-box bg-gradient-red" data-aos="fade-down" data-aos-anchor-placement="bottom-bottom" data-aos-offset="100"
     data-aos-easing="ease-in-sine">
              <div className="chart-img"><GiDuration size={64} /></div>
              <div className="title">Average Duration (Hours)</div>
              <div className="value">
                {loading ? <Loader /> : <>{eventDurationAnalysis?.averageDuration}</>}
                </div>
            </Panel>
          </Col>
            </Row> 
        </Col>
        <Col xs={20} sm={22} md={22} lg={17} xl={16}>
          <Row>
            <BarChartComponent1 eventsbarChartData={eventsbarChartData}/>  
          </Row>
        </Col>
        <Col xs={20} sm={22} md={22} lg={7} xl={8}>
        <Row gutter={30} >
        <Col xs={23} sm={22} md={22} lg={22} xl={22}>
          <PieChartComponent />
</Col>
          
        </Row>
        </Col>
        </Row>
      </Panel>
    </>
  )
}
export default CalendarDashboard;