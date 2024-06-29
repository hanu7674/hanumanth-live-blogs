import React, { useEffect, useState } from "react";
import { FaUser, FaUsers } from "react-icons/fa";
import {
  Row, Col, Panel, Loader, FlexboxGrid,
  Button,
  Stack,
} from "rsuite";
import { connect } from "react-redux";
import {  fetchBlogsByAuthor, fetchBlogsCountByAuthor, fetchPendingBlogsCountByAuthor, } from "../../../redux/authorsDashboard";
import Loading from "../../../components/Loading/loading";
import AuthorsBarChartComponent from "./BarChart";
import { useLocation, useNavigate } from "react-router-dom";
import { DataTable } from "./DataTable";
import '../../Admin/dashboard/styles.css'
import { auth } from "../../../Firebase/firebase";
const AuthorsDashboard = ({blogs, blogsCount, pendingBlogsCount, visitorsDataPage,fetchBlogsCountByAuthor, fetchBlogsByAuthor, loading,   fetchLastWeekPostedAuthorsCount, lastWeekPostedAuthorsCount,     }) => {
  useEffect(() => {
 fetchBlogsByAuthor(auth.currentUser.uid);
fetchBlogsCountByAuthor(auth.currentUser.uid);
    fetchPendingBlogsCountByAuthor(auth.currentUser.uid);
  }, []);

  const navigate = useNavigate();
  const location = useLocation();
 const [lastWeekBlogsCount, setLastWeekBlogsCount] = useState(0);
    useEffect(()=>{
        const lastWeekBlogsCount = blogs?.length > 0 ? blogs?.filter(blog => {
            const blogDate = blog.timestamp.toDate();
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            return blogDate >= oneWeekAgo;
          }).length : 0;        
          setLastWeekBlogsCount(lastWeekBlogsCount);
},[blogs])

  const handleViewAllAuthors = () => {
    navigate(`${location.pathname.split('/').slice(0, -1).join('/')}/view-authors`)
  }
  const handleAddNewAuthor = () => {
    navigate(`${location.pathname.split('/').slice(0, -1).join('/')}/add-author`)
  }
 
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
              <div className="title">Total Blogs 
      <br></br>
<span>(PostedBy You)</span></div>
                  <div className="value">
                    {
loading ? <Loader /> : <>{blogsCount}</>
                    }    
                  </div>
                </Panel>
                <Panel className={`trend-box bg-gradient-cyan`} style={{ marginTop: '20px' }} data-aos="fade-down" data-aos-offset="50"
                  data-aos-easing="ease-in-sine">
                  <div className="chart-img"><FaUser size={64} /></div>
                  <div className="title">New Blogs <br></br>
<span>(Last Week)</span></div>
                  <div className="value">
                    {
loading ? <Loader /> : <>{ lastWeekBlogsCount}</>
                    }    
                  </div>
                </Panel>
                <Panel className={`trend-box bg-gradient-green`} style={{ marginTop: '20px' }} data-aos="fade-down" data-aos-offset="50"
                  data-aos-easing="ease-in-sine">
                  <div className="chart-img"><FaUser size={64} /></div>
          <div className="title">Pending Blogs</div>
                  <div className="value">
                    {
                      loading ? <Loader /> : <>{pendingBlogsCount }</>
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
{/* <CategoryDistribution data={authors} /> */}
        </Col>
        <Col md={22} xs={22} sm={22} lg={22} xl={22} data-aos="fade-down" data-aos-offset="50"
          data-aos-easing="ease-in-sine">
      {/* <Top10TagsBarChart loading={dashboardTagsLoading} tags={tags} /> */}
        </Col>
      </Row>
    </>
  )
}

const mapDispatchToProps = dispatch => ({
fetchBlogsByAuthor: (authorId) => dispatch(fetchBlogsByAuthor(authorId)),
fetchBlogsCountByAuthor: (authorId) => dispatch(fetchBlogsCountByAuthor(authorId)),
fetchPendingBlogsCountByAuthor: (authorId) => dispatch(fetchPendingBlogsCountByAuthor(authorId)),
});

const mapStateToProps = state => ({
  loading: state.authors?.loading,
authorsCount: state.authorsDashboard?.authorsCount,
blogsCount: state.authorsDashboard?.blogsCount,
blogs: state.authorsDashboard?.blogs,
  pendingAuthorsCount: state.authorsDashboard?.pendingAuthorsCount,
  lastWeekPostedAuthorsCount: state.authorsDashboard?.lastWeekPostedAuthorsCount,
  visitorsDataPage: state.dashboardData?.visitorsDataPage,
pendingBlogsCount: state.authorsDashboard?.pendingBlogsCount,
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthorsDashboard);
