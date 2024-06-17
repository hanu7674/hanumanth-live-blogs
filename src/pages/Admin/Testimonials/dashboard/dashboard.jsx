import React, { useState, useEffect } from "react";
import { Col, FlexboxGrid, Loader, Panel, Row, Modal, ButtonGroup, Button, Checkbox, CheckboxGroup, Divider, Stack, Grid } from "rsuite";
import BarChart from '../../dashboard/BarChart';
import PieChart from '../../dashboard/PieChart';
import { BiFullscreen, BiExitFullscreen } from 'react-icons/bi'
import { MdReviews } from "react-icons/md";
import { TbMathAvg } from "react-icons/tb";
import MapChart1 from "../../users/Maps";
import Loading from "../../../../components/Loading/loading";
import BarChartComponent from "../../Reviews/dashboard/BarChartComponent";
const TestimonialsDashboard = ({  loading, error, totalTestimonialsCount, fetchTestimonialsDashboardData, testimonialsbarChartData , viewCountCityArray, viewCountContinentArray, viewCountCountryArray  }) => {
//   todo: 'Add location data and display avarage by country'

  const [pieChartData, setPieChartData] = useState([]);
  const [isMapModalVisible, setIsMapModalVisible] = useState(false);
  const [markers, setMarkers] = useState([])
  const [countriesCount, setCountriesCount] = useState([])
  const toggleMapModal = () => {
    setIsMapModalVisible(!isMapModalVisible);
  };

  useEffect(() =>{
      const sortedCities = viewCountCityArray.sort((a, b) => b.count - a.count).slice(0,10);
      setPieChartData(sortedCities);
  },[viewCountCityArray]);
  const convertListToMarkers = (inputList) => {
    return inputList.map((input) => ({
      markerOffset: -15,
      name: `${input.city}, ${input.country_name}`,
      coordinates: [input.longitude, input.latitude],
      count: input.count || 1,
    }));
  };
  useEffect(() => {
    const data = convertListToMarkers(viewCountCityArray);
    setMarkers(data);
    setCountriesCount(viewCountCountryArray)
  }, [viewCountCityArray, viewCountCountryArray])
  const Map = () => (
    <Panel className="card" 
    header={
      <Stack justifyContent="space-between">
        <span>Testimonials Submitted by City and Country</span>
        <span>
        {
                    isMapModalVisible ? <>
                      <BiExitFullscreen size={20} onClick={toggleMapModal} />
                    </> : <><BiFullscreen size={20} onClick={toggleMapModal} /> </>
                  }
        </span>
      </Stack>
    }>
                  <MapChart1 markers={markers} title={'Testimonials Submitted by City'} countryCountData={countriesCount}/>
            </Panel>
  );
  const PieChartComponent = () => (
    <PieChart
      title="Testimonial's Distribution By Top 10 Cities"
      data={pieChartData && pieChartData?.map((item) => item.count)}
      labels={pieChartData && pieChartData?.map((city) => `${city.city}, ${city.region}, ${city.country_name}`)}
      type="pie"
    />
  );

  return (
    <>
      
      <Modal open={isMapModalVisible} onClose={toggleMapModal} backdrop='static' size='full' overflow={false}>
        <Modal.Header>
        </Modal.Header>
        <Modal.Body>
          <Map />
        </Modal.Body>
      </Modal>
      {
        loading ? <Loading /> : <>
      
      <Panel shaded >
        <Map />
        <Row gutter={30}>
        <Col xs={20} sm={22} md={22} lg={22} xl={16}>
          <Row>
            <BarChartComponent title={'Testimonials Summary'} reviewsbarChartData={testimonialsbarChartData}/>
          </Row>
          </Col>
          <Row gutter={30} className="dashboard-header" style={{ marginTop: '20px' }}>
            <Col xs={20} sm={22} md={10} lg={8} xl={8}>
            <Panel className="trend-box bg-gradient-red" data-aos="fade-down" data-aos-anchor-placement="bottom-bottom" data-aos-offset="100"
     data-aos-easing="ease-in-sine">
              <div className="chart-img"><MdReviews size={64} /></div>
              <div className="title">Total Testimonials  </div>
              <div className="value">
                {loading ? <Loader /> : <>{totalTestimonialsCount}</>}</div>
            </Panel>
            </Col>
            <Col xs={20} sm={22} md={10} lg={8} xl={8}>
            <PieChartComponent />

            </Col>
          </Row>
        </Row>

      </Panel>
      </> }
    </>
  )
}
export default TestimonialsDashboard;