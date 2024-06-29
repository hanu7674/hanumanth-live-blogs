import React, { useEffect, useState } from "react";
import { FaUser, FaUsers } from "react-icons/fa";
import {
  Row, Col, Panel, Loader, FlexboxGrid,
  Button,
  Stack,
} from "rsuite";
import { connect } from "react-redux";
import { getAuthorsCount, getPendingAuthorsCount, getTotalAuthors, fetchDashboardDataOnVisitsPages } from "../../../redux/authors";
import Loading from "../../../components/Loading/loading";
import AuthorsBarChartComponent from "./BarChart";
import { useLocation, useNavigate } from "react-router-dom";
import { DataTable } from "./DataTable";

const AuthorsDashboard = ({ fetchAuthors, visitorsDataPage, fetchDashboardDataOnVisitsPages, loading, authors, tags, dashboardTagsLoading, user, fetchLastWeekPostedAuthorsCount, lastWeekPostedAuthorsCount, publishersCount, fetchPublishersUsersCount, authorsCount, fetchAuthorsCount, pendingAuthorsCount, fetchPendingAuthorsCount }) => {
  useEffect(() => {
    fetchPublishersUsersCount();
    fetchAuthorsCount();
    fetchPendingAuthorsCount();
    getAuthorData();
    fetchAuthors();
    fetchLastWeekPostedAuthorsCount();
    fetchDashboardDataOnVisitsPages();
  }, []);

  const navigate = useNavigate();
  const location = useLocation();
  const [authorCategories, setAuthorCategories] = useState([]);

  const getAuthorData = () => {
    fetchAuthors();
  };

  const handleViewAllAuthors = () => {
    navigate(`${location.pathname.split('/').slice(0, -1).join('/')}/view-authors`)
  }
  const handleAddNewAuthor = () => {
    navigate(`${location.pathname.split('/').slice(0, -1).join('/')}/add-author`)
  }
  const pieChartLabels = authorCategories.length ? authorCategories : [];

  return (
    <>
      <FlexboxGrid justify="end">
        <Stack justifyContent="space-around" spacing={20}>
          <Button onClick={() => handleViewAllAuthors()}>View All Authors</Button>
          <Button onClick={() => handleAddNewAuthor()}> Create New Author</Button>
        </Stack>
      </FlexboxGrid>
      <Row gutter={30} >
        <Col xs={22} sm={22} md={22} lg={16} xl={16}>
          <DataTable visitorsData={visitorsDataPage} />
        </Col>
        <Col xs={22} sm={22} md={22} lg={8} xl={8}>
          {loading ? (
            <Loading />
          ) : (
            <>
              <div className="dashboard-header" style={{ marginTop: '30px' }}>
                <Panel className={`trend-box bg-gradient-orange`} style={{ marginTop: '20px' }} data-aos="fade-down" data-aos-offset="50"
                  data-aos-easing="ease-in-sine">
                  <div className="chart-img"><FaUser size={64} /></div>
                  <div className="title">Total Authors</div>
                  <div className="value">
                    {
                      loading ? <Loader /> : <>{authorsCount}</>
                    }    
                  </div>
                </Panel>
                <Panel className={`trend-box bg-gradient-cyan`} style={{ marginTop: '20px' }} data-aos="fade-down" data-aos-offset="50"
                  data-aos-easing="ease-in-sine">
                  <div className="chart-img"><FaUser size={64} /></div>
                  <div className="title">New Authors (Last Week)</div>
                  <div className="value">
                    {
                      loading ? <Loader /> : <>{lastWeekPostedAuthorsCount}</>
                    }    
                  </div>
                </Panel>
                <Panel className={`trend-box bg-gradient-green`} style={{ marginTop: '20px' }} data-aos="fade-down" data-aos-offset="50"
                  data-aos-easing="ease-in-sine">
                  <div className="chart-img"><FaUser size={64} /></div>
                  <div className="title">Pending Authors</div>
                  <div className="value">
                    {
                      loading ? <Loader /> : <>{pendingAuthorsCount}</>
                    }  
                  </div>
                </Panel>
                <Panel className={`trend-box bg-gradient-yellow`} style={{ marginTop: '20px' }} data-aos="fade-down" data-aos-offset="50"
                  data-aos-easing="ease-in-sine">
                  <div className="chart-img"><FaUsers size={64} /></div>
                  <div className="title">Publishers</div>
                  <div className="value">
                    {
                      loading ? <Loader /> : <>{publishersCount}</>
                    }   
                  </div>
                </Panel>
              </div>
            </>
          )}
        </Col>
      </Row>
      <Row gutter={30} >
        <Col xs={22} sm={22} md={22} lg={22} xl={22} data-aos="fade-down" data-aos-easing="ease-in-sine">
          <AuthorsBarChartComponent />
        </Col>
      </Row>
      <Row gutter={20} className="dashboard-header">
        <Col md={22} xs={22} sm={22} lg={22} xl={22} data-aos="fade-down" data-aos-offset="50"
          data-aos-easing="ease-in-sine">
          <CategoryDistribution data={authors} />
        </Col>
        <Col md={22} xs={22} sm={22} lg={22} xl={22} data-aos="fade-down" data-aos-offset="50"
          data-aos-easing="ease-in-sine">
          <Top10TagsBarChart loading={dashboardTagsLoading} tags={tags} />
        </Col>
      </Row>
    </>
  )
}

const mapDispatchToProps = dispatch => ({
  fetchPublishersUsersCount: () => dispatch(getPublishersUsersCount()),
  fetchAuthorsCount: () => dispatch(getAuthorsCount()),
  fetchPendingAuthorsCount: () => dispatch(getPendingAuthorsCount()),
  fetchAuthors: () => dispatch(getAuthorsToDashboard()),
  fetchLastWeekPostedAuthorsCount: () => dispatch(getLastWeekPostedAuthorsCount()),
  fetchDashboardDataOnVisitsPages: () => dispatch(fetchDashboardDataOnVisitsPages()),
});

const mapStateToProps = state => ({
  loading: state.authors?.loading,
  user: state.auth?.user,
  publishersCount: state.auth?.publishersCount,
  authorsCount: state.authors?.authorsCount,
  pendingAuthorsCount: state.authors?.pendingAuthorsCount,
  lastWeekPostedAuthorsCount: state.authors?.lastWeekPostedAuthorsCount,
  authors: state.authors?.dashboardAuthors,
  tags: state.authors?.dashboardTags,
  visitorsDataPage: state.dashboardData?.visitorsDataPage,
  dashboardTagsLoading: state.authors?.dashboardTagsLoading,
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthorsDashboard);
