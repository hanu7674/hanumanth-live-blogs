import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchBlogs, setLoading, updatePage, fetchMoreBlogs1, fetchPrevBlogs } from '../../redux/blogs'; // Import actions
import BlogSection from './BlogSection';
import { Col, Pagination, Panel, Row } from 'rsuite'; // Import RSuite components
import Loading from '../../components/Loading/loading';
const mapStateToProps = (state) => ({
  blogs: state.blogs.HeaderPageBlogs,
  currentPage: state.blogs.currentPage,
  noOfPages: state.blogs.noOfPages,
  count: state.blogs.count,
  loading: state.blogs.loading,
});

const mapDispatchToProps = (dispatch) => ({
  fetchBlogs: () => dispatch(fetchBlogs()),
  fetchMoreBlogs: () => dispatch(fetchMoreBlogs1()),
  fetchPrevBlogs: () => dispatch(fetchPrevBlogs()),
  setLoading: (isLoading) => dispatch(setLoading(isLoading)),
  updatePage: (page) => dispatch(updatePage(page)),
});

const BlogsRoute = ({ blogs, currentPage, noOfPages, count, loading, fetchBlogs, setLoading, updatePage,fetchMoreBlogs, fetchPrevBlogs}) => {
  useEffect(() => {
    fetchBlogs(); // Fetch blogs on component mount
  }, [fetchBlogs]);
  const [limit, setLimit] = React.useState(10);
  const [page, setPage] = React.useState(1);
  const handleChangeLimit = dataKey => {
    setPage(1);
    setLimit(dataKey);
  };
  const handlePageChange = (value) => {
    updatePage(value);
    if (value === "Next") {
      fetchMoreBlogs();
    } else if (value === "Prev") {
      fetchPrevBlogs();
    }
  };
  
  return (
    <Panel   shaded>
      <div className="container mt-5">
        <Row gutter={20}>
          <div className="blog-heading ">Daily Blogs</div>
          {loading ? (
            <Loading size="md" content="Fetching Blogs..." />
          ) : blogs.length === 0 ? (
            <div className="text-center">No blogs found.</div>
          ) : (
            blogs.map((blog, index) => (
              <>
              <Col md={23} key={blog.id}>
                <BlogSection {...blog} index={index} />
              </Col>
              
              
              </>
            ))
          )}
        </Row>
        <Pagination
          current={currentPage}
          total={count}
          limit={10}
          onChangePage={handlePageChange}
          prev
          next
          first
          last
          ellipsis
          boundaryLinks
          maxButtons={5}
          size="xs"
          layout={['total', '-', 'limit', '|', 'pager', 'skip']}
          limitOptions={[10, 30, 50]}
           activePage={page}
           onChangeLimit={handleChangeLimit}
        />
      </div>
    </Panel>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(BlogsRoute);
