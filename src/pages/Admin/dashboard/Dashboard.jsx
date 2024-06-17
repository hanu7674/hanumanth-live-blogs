import React, { useEffect, useState } from 'react';
import { Row, Col, Panel, Loader, } from 'rsuite';
import "./styles.css"
import * as images from '../../../assets/images/charts';
import PieChart from './PieChart';
import ViewByCountryTable, { DataTable } from './DataTable';
import { addFakeTraffic, fetchDashboardData, fetchDashboardDataOnVisits, fetchDashboardDataOnVisitsPages, fetchDashboardDataTrafficSummary, fetchTrafficSources, getTopPagesByViewCount, getViewCountByCity, getViewCountByCountry, removeFakeTraffic } from '../../../redux/dashboard';
import {  connect } from 'react-redux';
import DonutChart from './Donut';
import BarChartComponentPanel from './BarChartComponent';
const Dashboard = ({ user, fetchDashboardDataStartAsync, fetchTopPages, getViewCountByCountry, getViewCountByCity,viewCountByCity, viewCountByCountry, fetchDashboardDataTrafficSummary, fetchDashboardDataOnVisitsPages, fetchDashboardDataOnVisits, fetchTrafficSources, trafficSources, routes, visitorsDataPage, dashboardData, addFakeTraffic, traffic, visitorsData, loading, error }) => {
  const data = ['Web', 'Social', 'Others'];
  
  useEffect(() => {
    fetchDashboardDataStartAsync();
    fetchDashboardDataOnVisits();
    fetchDashboardDataOnVisitsPages();
    fetchDashboardDataTrafficSummary(data)
    fetchTrafficSources();
    fetchTopPages('India');
    getViewCountByCountry();
    getViewCountByCity();
  }, []);
  const [pieChartData, setPieChartData] = useState([]);
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
  useEffect(() => {
      const initialPieChartData = formattedData(traffic);
      setPieChartData(initialPieChartData);
  }, [traffic]);

  const pieChartDataValues = (data) => {
    const res = [];
    data.map((item) => {
      let r = 0
      item?.data?.map((doc) => {
        r = r + doc?.y
      })
      res.push(r)
    })
    return res;
  }
  return (
    <>
    {
      loading ? <Loader size='lg' center/> :
    
      <Row gutter={30}>
        <Col xs={20} sm={22} md={22} lg={22} xl={16}>
          <Row>

           
            <BarChartComponentPanel traffic={traffic}/>
            <DataTable visitorsData={visitorsDataPage} loading={loading} error={error} />
            <ViewByCountryTable />
            {viewCountByCity && 
            <DonutChart 
                title="Top Cities by % of traffic"
                data={viewCountByCity && viewCountByCity?.map((item) => item.count)}
                type="donut"
                labels={viewCountByCity && viewCountByCity?.map((item) => item.city)}
              />
              }
          </Row>

        </Col>
        <Col lg={24} xl={8} sm={22} md={22} xs={22}>
          <Row gutter={30} className="dashboard-header" style={{ marginTop: '20px' }}>
            <Col xs={20} sm={22} md={22} lg={22} xl={22}>
              <Panel className="trend-box bg-gradient-red"  data-aos="fade-down" data-aos-offset="300"
     data-aos-easing="ease-in-sine">
                <img className="chart-img" src={images.PVIcon} />
                <div className="title">Page Views </div>
                <div className="value">{visitorsData?.pageViews}</div>
              </Panel>
            </Col>
            <Col xs={20} sm={22} md={22} lg={22} xl={22}>
              <Panel className="trend-box bg-gradient-green" data-aos="fade-down" data-aos-offset="300"
     data-aos-easing="ease-in-sine">
                <img className="chart-img" src={images.VVICon} />
                <div className="title">Visits </div>
                <div className="value">{visitorsData?.visits}</div>
              </Panel>
            </Col>
            <Col xs={20} sm={22} md={22} lg={22} xl={22}>
              <Panel className="trend-box bg-gradient-blue" data-aos="fade-down" data-aos-offset="300"
     data-aos-easing="ease-in-sine">
                <img className="chart-img" src={images.UVIcon} />
                <div className="title">Unique Visitors</div>
                <div className="value">{visitorsData?.uniqueVisitors}</div>
              </Panel>
            </Col>
            <Col xs={20} sm={22} md={22} lg={22} xl={22}>
              <PieChart
                title="Traffic Sources"
                data={pieChartDataValues(pieChartData)}
                type="donut"
                labels={data}
              />
            </Col>
            {trafficSources &&
              <Col xs={20} sm={22} md={22} lg={22} xl={22}> <PieChart
                title="Browsers"
                data={trafficSources && trafficSources?.map((item) => item.count)}
                type="pie"
                labels={trafficSources && trafficSources?.map((item) => item.id)}
              />
              </Col>
            } 
            {viewCountByCountry &&
              <Col xs={20} sm={22} md={22} lg={22} xl={22}> <PieChart
                title="Viewer's % by Countries"
                data={viewCountByCountry && viewCountByCountry?.map((item) => item.count)}
                type="pie"
                labels={viewCountByCountry && viewCountByCountry?.map((item) => item.country)}
              />
              </Col>
            }
          </Row>
        </Col>
      </Row>
}
    </>
  );
};
const mapStateToProps = state => ({
  dashboardData: state.dashboardData.data,
  visitorsData: state.dashboardData?.visitorsData,
  visitorsDataPage: state.dashboardData?.visitorsDataPage,
  loading: state.dashboardData?.loading,
  error: state.dashboardData?.error,
  routes: state.dashboardData?.routes,
  traffic: state.dashboardData?.traffic,
  trafficSources: state.dashboardData?.trafficSources,
  user: state.auth?.user,
  top10Pages: state.dashboardData.top10Pages,
  viewCountByCountry: state.dashboardData.viewCountByCountry,
  viewCountByCity: state.dashboardData.viewCountByCity,
});
const mapDispatchToProps = dispatch => ({
  fetchDashboardDataStartAsync: () => dispatch(fetchDashboardData()),
  fetchDashboardDataOnVisits: () => dispatch(fetchDashboardDataOnVisits()),
  fetchDashboardDataOnVisitsPages: () => dispatch(fetchDashboardDataOnVisitsPages()),
  fetchDashboardDataTrafficSummary: (options) => dispatch(fetchDashboardDataTrafficSummary(options)),
  addFakeTraffic: () => dispatch(addFakeTraffic()),
  fetchTrafficSources: () => dispatch(fetchTrafficSources()),
  fetchTopPages: (country_name) => dispatch(getTopPagesByViewCount(country_name)),
  getViewCountByCountry: () => dispatch(getViewCountByCountry()),
  getViewCountByCity: () => dispatch(getViewCountByCity()),
});
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);