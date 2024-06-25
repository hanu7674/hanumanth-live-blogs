import React, { useEffect, useRef, useState } from "react";
import Trending from "./Trending";
import { useDispatch, useSelector } from "react-redux";
import { fetchMoreBlogs, getBlogs, getTotalBlogs, getTrendingBlogs } from "../../redux/blogs";
import { useLocation, useNavigate } from "react-router";
import BlogSection from "./BlogSection";
 import { Button, Col, Container, Content, Grid, Input, Row } from "rsuite";
import { FaSearch } from "react-icons/fa";
import SearchIcon from '@rsuite/icons/Search';

import Category from './Category';
import Tags from "./Tags";
import FeatureBlogs from "./FeatureBlogs";
import { InputGroup, Form } from "rsuite";
import Loading from "../../components/Loading/loading";
import { useMediaQuery } from "rsuite/esm/useMediaQuery/useMediaQuery";
function useQuery() {
  return new URLSearchParams(useLocation().search);
}
const BlogsHomePage = () => {
  const queryString = useQuery();
  const searchQuery = queryString.get("q");
  const [search, setSearch] = useState('');
  const blogslist = useSelector((state) => state.blogs.totalBlogs);
  const [searchBlogsData, setSearchBlogsData] = useState([]);
  const blogs = useSelector((state) => state.blogs.blogs);
  const hideMoreButton = useSelector((state) => state.blogs.hide_more_button);
  const loading = useSelector((state) => state.blogs.loading);
  const [searchLoading, setSearchLoading] = useState(false);
  const [categoryCount, setCategoryCount] = useState();
  const [tagsCount, setTagsCount] = useState();
  const dispatch = useDispatch();
  const redirect = useSelector(state => state.redirect.redirectTo)

  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (redirect) {
      navigate(redirect)
    }
  }, [redirect])
  useEffect(() => {

    dispatch(getTrendingBlogs());
    dispatch(getTotalBlogs());
    dispatch(getBlogs());
  }, []);
  useEffect(() => {
    setSearchBlogsData(blogslist?.list)
    const counts = blogslist?.list?.reduce((prevValue, currentValue) => {
      let name = currentValue.category;
      if (!prevValue.hasOwnProperty(name)) {
        prevValue[name] = 0;
      }
      prevValue[name]++;
      // delete prevValue["undefined"];
      return prevValue;
    }, {});
    if (counts) {
      const categoryCount = Object.keys(counts).map((k) => {
        return {
          category: k,
          count: counts[k],
        };
      });
      setCategoryCount(categoryCount)

    }
    const tagCounts = {};

    blogslist?.tags?.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });

    const uniqueTags = [...new Set(blogslist?.tags)];

    const sortedTagCounts = uniqueTags
      .map(tag => ({ tag: tag, count: tagCounts[tag] }))
      .sort((a, b) => b.count - a.count);
    setTagsCount(sortedTagCounts)
  }, [blogslist]);
  console.log(location);
  const handleChange = (value, event) => {
    setSearchBlogsData(blogslist?.list);
    const currentPath = location.pathname;

    if (value) {
      const searchPath = currentPath.includes("/search")
        ? currentPath + `?q=${search}`
        : currentPath + "/search?q=" + search;

      navigate(searchPath);
      setSearchLoading(true);
      setSearchBlogsData(
        searchBlogsData?.filter((blog) =>
          blog?.title?.toLowerCase().includes(value?.toLowerCase()) ||
          blog?.postedBy?.displayName?.toLowerCase().includes(value?.toLowerCase())
          // || blog?.tags?
        )
      );
      setTimeout(() => {
        setSearchLoading(false);
      }, 500);
    } else {
      const newPath = currentPath.replace('/search', '');
      navigate(newPath);
      dispatch(getBlogs());
    }
    setSearch(value);
   };
  
  const handleSearch = (value, event) => {
    setSearchBlogsData(blogslist?.list);
    const currentPath = location.pathname;
  
    if (value) {
      const searchPath = currentPath.includes("/search")
        ? currentPath + `?q=${search}`
        : currentPath + "/search?q=" + search;

      navigate(searchPath);
      setSearchLoading(true);
      setSearchBlogsData(
        searchBlogsData?.filter((blog) =>
          blog?.title?.toLowerCase().includes(value?.toLowerCase()) ||
          blog?.postedBy?.displayName?.toLowerCase().includes(value?.toLowerCase())
          // || blog?.tags?
        )
      );
      setTimeout(() => {
        setSearchLoading(false);
      }, 500);
    } else {
      const newPath = currentPath.replace('/search', '');
      navigate(newPath);
      dispatch(getBlogs());
    }
    setSearch(value);
   };
const [isMobile] = useMediaQuery('(max-width: 700px)');
  
  return (
    <div className="blogs">

            <Row>
            <Trending />
{isMobile ? <>
<div className="blog-heading text-start py-2 mb-4">Search</div>
             <div  >

            <InputGroup style={{ marginBottom: 10}}>
      <Input placeholder="Search blog"
                  value={search}
                  onChange={handleChange}
                  aria-label="Search blog"
                   />
      <InputGroup.Addon>
        <SearchIcon onClick={handleSearch}/>
      </InputGroup.Addon>
    </InputGroup>
             
        </div>
</> : <></>}
            <Col md={16}  xs={23} sm={23} lg={16 } xl={16}>
            <div className="blog-heading text-start py-2 mb-4">Daily Blogs</div>
            {
              loading ? <div style={{ margin: 'auto', width: 'max-content ', height: "max-content" }}>
                <Loading /></div> : <>
                {
                  searchQuery?.length > 0 ? <>
                    {searchLoading ? <div style={{ margin: 'auto', width: 'max-content ', height: "max-content" }}>
                      <Loading /></div> :
                      <>{
                        searchBlogsData?.length > 0 ? <>
                          {searchBlogsData?.map((blog) => (
                            <BlogSection
                              key={blog.id}
                              {...blog}
                            />
                          ))}
                        </> : <>
                          <h4>
                            No Blog found with search keyword:{" "}
                            <strong>{searchQuery}</strong>
                          </h4>
                        </>
                      }</>
                    }
                  </> : <>
                     {
                      blogs?.length > 0 ? <>
                        {blogs?.map((blog, index) => (
                          <BlogSection
                            key={blog.id}
                            index={index}
                            {...blog}
                          />
                        ))}
                      </> : <>
                        <div className="container">
                          <p className="text-center">
                            Oh! No one hasn't posted any blogs till now. 
                           </p>
                        </div></>
                    }
                  </>
                }


                {!hideMoreButton && blogs?.length > 1 ? <>
                  <div className="mt-3 " style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Button
                      onClick={() => dispatch(fetchMoreBlogs())}
                    >
                      Load More
                    </Button></div> </> : <></>}
              </>
            }

            </Col>
            <Col md={8} xs={23} sm={23} lg={8 } xl={8}>
{!isMobile ? <>
<div className="blog-heading text-start py-2 mb-4">Search</div>
             <div  >

            <InputGroup style={{ marginBottom: 10}}>
      <Input placeholder="Search blog"
                  value={search}
                  onChange={handleChange}
                  aria-label="Search blog"
                   />
      <InputGroup.Addon>
        <SearchIcon onClick={handleSearch}/>
      </InputGroup.Addon>
    </InputGroup>
             
        </div>
</> : <></>}
            <div className="blog-heading text-start py-2 mb-4">Tags</div>
            <Tags tags={tagsCount?.slice(0,20)} />
            <FeatureBlogs title={"Most Popular"} blogs={blogs} />
            <Category catgBlogsCount={categoryCount} />
            </Col>
          </Row> 
     </div>
  )
}

export default BlogsHomePage;
 