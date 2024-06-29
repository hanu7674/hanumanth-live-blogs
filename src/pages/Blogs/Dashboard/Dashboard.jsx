import React, { useEffect, useState } from "react";
import { FaBlog, FaUsers } from "react-icons/fa6";
import {
  Row, Col, Panel, Loader, FlexboxGrid,

  Button,

  Stack,
} from "rsuite";

import { MdOutlinePendingActions } from "react-icons/md";
import { FaUserEdit } from "react-icons/fa";
import { connect } from "react-redux";
import { getPublishersUsersCount } from "../../../redux/auth";
import { fetchDashboardDataOnVisitsPages, fetchDashboardDataOnVisitsPagesBlogs } from "../../../redux/dashboard";
import { getBlogs, getBlogsCount, getBlogsToDashboard, getLastWeekPostedBlogsCount, getPendingBlogsCount, getTotalBlogs, } from "../../../redux/blogs";
import Loading from "../../../components/Loading/loading";
import CategoryDistribution from "./CategoryDistribution";
import BlogsBarChartComponent from "./BarChart";
import { useLocation, useNavigate } from "react-router-dom";
import Top10TagsBarChart from "./Top10TagsChart";
import { DataTable } from "./DataTable";


const BlogsDashboard = ({ fetchBlogs, visitorsDataPage, fetchDashboardDataOnVisitsPages, loading, blogs, tags, dashboardTagsLoading, user, fetchLastWeekPostedBlogsCount, lastWeekPostedBlogsCount, publishersCount, fetchPublishersUsersCount, blogsCount, fetchBlogsCount, pendingBlogsCount, fetchPendingBlogsCount }) => {
  useEffect(() => {
    fetchPublishersUsersCount();
    fetchBlogsCount();
    fetchPendingBlogsCount();
    getBlogData();
    fetchBlogs();
    fetchLastWeekPostedBlogsCount();
    fetchDashboardDataOnVisitsPages();
  }, []);
  const navigate = useNavigate();
  const location = useLocation();
  const [blogCategories, setBlogCategories] = useState([]); // State for blog categories

  const getBlogData = () => {
    fetchBlogs();
  };

  const handleViewAllBlogs = () => {
    navigate(`${location.pathname.split('/').slice(0, -1).join('/')}/view-blogs`)
  }
  const handleAddNewBlog = () => {
    navigate(`${location.pathname.split('/').slice(0, -1).join('/')}/add-blog`)
  }
  const pieChartLabels = blogCategories.length ? blogCategories : []; // Use categories for pie chart labels if available
  return (
    <><FlexboxGrid justify="end">
      <Stack justifyContent="space-around" spacing={20}>
        <Button onClick={() => handleViewAllBlogs()}>View All Blogs</Button>
        <Button onClick={() => handleAddNewBlog()}> Create New Blog</Button>
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
                  <div className="chart-img"><FaBlog size={64} /></div>
                  <div className="title">Posted Blogs</div>
                  <div className="value">
                    {
                      loading ? <Loader /> : <>{blogsCount}</>
                    }    </div>
                </Panel>
                <Panel className={`trend-box bg-gradient-cyan`} style={{ marginTop: '20px' }} data-aos="fade-down" data-aos-offset="50"
                  data-aos-easing="ease-in-sine">
                  <div className="chart-img"><FaBlog size={64} /></div>
                  <div className="title">New Blogs (Last Week)</div>
                  <div className="value">
                    {
                      loading ? <Loader /> : <>{lastWeekPostedBlogsCount}</>
                    }    </div>
                </Panel>
                <Panel className={`trend-box bg-gradient-green`} style={{ marginTop: '20px' }} data-aos="fade-down" data-aos-offset="50"
                  data-aos-easing="ease-in-sine">
                  <div className="chart-img"><MdOutlinePendingActions size={64} /></div>
                  <div className="title">Pending Blogs</div>
                  <div className="value">
                    {
                      loading ? <Loader /> : <>{pendingBlogsCount}</>
                    }  </div>
                </Panel>
                <Panel className={`trend-box bg-gradient-yellow`} style={{ marginTop: '20px' }} data-aos="fade-down" data-aos-offset="50"
                  data-aos-easing="ease-in-sine">
                  <div className="chart-img"><FaUserEdit size={64} /></div>
                  <div className="title">Publishers</div>
                  <div className="value">
                    {
                      loading ? <Loader /> : <>{publishersCount}</>
                    }   </div>
                </Panel>
              </div>

            </>
          )}
        </Col>
      </Row>




      <Row gutter={30} >
        <Col xs={22} sm={22} md={22} lg={22} xl={22} data-aos="fade-down" data-aos-easing="ease-in-sine">

          <BlogsBarChartComponent />

        </Col>

      </Row>
      <Row gutter={20} className="dashboard-header">
        <Col md={22} xs={22} sm={22} lg={22} xl={22} data-aos="fade-down" data-aos-offset="50"
          data-aos-easing="ease-in-sine">
          <CategoryDistribution data={blogs} />
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
  fetchBlogsCount: () => dispatch(getBlogsCount()),
  fetchPendingBlogsCount: () => dispatch(getPendingBlogsCount()),
  fetchBlogs: () => dispatch(getBlogsToDashboard()),
  fetchLastWeekPostedBlogsCount: () => dispatch(getLastWeekPostedBlogsCount()),
  fetchDashboardDataOnVisitsPages: () => dispatch(fetchDashboardDataOnVisitsPagesBlogs()),
});
const mapStateToProps = state => ({
  loading: state.blogs?.loading,
  user: state.auth?.user,
  publishersCount: state.auth?.publishersCount,
  blogsCount: state.blogs?.blogsCount,
  pendingBlogsCount: state.blogs?.pendingBlogsCount,
  lastWeekPostedBlogsCount: state.blogs?.lastWeekPostedBlogsCount,
  blogs: state.blogs?.dashboardBlogs,
  tags: state.blogs?.dashboardTags,
  visitorsDataPage: state.dashboardData?.visitorsDataPage,
  dashboardTagsLoading: state.blogs?.dashboardTagsLoading,
});
export default connect(mapStateToProps, mapDispatchToProps)(BlogsDashboard);