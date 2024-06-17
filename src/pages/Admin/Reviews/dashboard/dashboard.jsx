import React, { useState, useEffect } from "react";
import { Col, FlexboxGrid, Loader, Panel, Row, Modal, ButtonGroup, Button, Checkbox, CheckboxGroup, Divider, Stack, Grid } from "rsuite";
import BarChart from '../../dashboard/BarChart';
import PieChart from '../../dashboard/PieChart';
import { BiFullscreen, BiExitFullscreen } from 'react-icons/bi'
import { MdReviews } from "react-icons/md";
import { TbMathAvg } from "react-icons/tb";
import MapChart1 from "../../users/Maps";
import BarChartComponentPanel from "./BarChartComponent";

const timeRangeOptions = [
  { label: 'Today', value: 'today' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: 'Year', value: 'year' },
//   { label: 'All Time', value: 'allTime' },
];
const ReviewsDashboard = ({  loading, error, totalReviewsCount,reviewsbarChartData, viewCountCityArray, viewCountContinentArray, viewCountCountryArray  }) => {     
//   todo: 'Add location data and display avarage by country'
  const [pieChartData, setPieChartData] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [isMapModalVisible, setIsMapModalVisible] = useState(false);
  const [markers, setMarkers] = useState([])
  const [countriesCount, setCountriesCount] = useState([])
  const toggleMapModal = () => {
    setIsMapModalVisible(!isMapModalVisible);
  };
  const calculateAverageRating = (filteredData) => {
    const totalRatings = filteredData.reduce((acc, item) => acc + item.rating, 0);
    const averageRating = totalRatings / filteredData.length;
    return isNaN(averageRating) ? 0 : averageRating; // Handle NaN case
  };

  const countUsersByRating = (data) => {
    const ratingCounts = {};
  
    // Initialize counts for ratings from 0 to 5
    for (let i = 1; i <= 5; i++) {
      ratingCounts[i] = 0;
    }
  
    data.forEach((item) => {
      const rating = item?.rating;
      // Increment the count for the corresponding rating
      ratingCounts[rating] = (ratingCounts[rating] || 0) + 1;
    });
  
    return ratingCounts;
  };
  useEffect(() => {
    if ( reviewsbarChartData) {
        const averagerating = calculateAverageRating(reviewsbarChartData);
        const counts = countUsersByRating(reviewsbarChartData);
        const pieChartData = Object.entries(counts).map(([rating, count]) => ({
            label: `Rating ${rating}`,
            value: count,
        }));
        setPieChartData(pieChartData);
        setAverageRating(averagerating);
    }
  }, [reviewsbarChartData]);
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
        <span>Reviews Submitted by City and Country</span>
        <span>
        {
                    isMapModalVisible ? <>
                      <BiExitFullscreen size={20} onClick={toggleMapModal} />
                    </> : <><BiFullscreen size={20} onClick={toggleMapModal} /> </>
                  }
        </span>
      </Stack>
    }>
                  <MapChart1 markers={markers} title={'Reviews Submitted by City'} countryCountData={countriesCount}/>
            </Panel>
  )
  const PieChartComponent = () => (
    <PieChart
      title="User Ratings Distribution"
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
              <div className="title">Total Reviews </div>
              <div className="value">
                {loading ? <Loader /> : <>{totalReviewsCount}</>}</div>
            </Panel>
          </Col>
          <Col xs={23} sm={22} md={22} lg={22} xl={22}>
            <Panel className="trend-box bg-gradient-cyan" data-aos="fade-down" data-aos-anchor-placement="bottom-bottom" data-aos-offset="100"
     data-aos-easing="ease-in-sine">
              <div className="chart-img"><TbMathAvg size={64} /></div>
              <div className="title">Overall Average Rating </div>
              <div className="value">   
                {loading ? <Loader /> : <>{averageRating.toFixed(2)}</>}</div>
            </Panel>
          </Col>

            </Row> 
        </Col>
        <Col xs={20} sm={22} md={22} lg={17} xl={16}>
          <Row>
            <BarChartComponentPanel title={'Review Summary'} reviewsbarChartData={reviewsbarChartData} />
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
export default ReviewsDashboard;