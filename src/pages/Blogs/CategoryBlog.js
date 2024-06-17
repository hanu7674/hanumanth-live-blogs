import React, {  useEffect } from "react";
import { useParams } from "react-router-dom";
import BlogSection from "./BlogSection";
 import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../../redux/blogs";
import Loading from "../../components/Loading/loading";
import { Col, Container, Row } from "rsuite";

const CategoryBlog = () => {
  const categoryBlogs = useSelector((state) => state.blogs.categoryBlogs);
  const  loading = useSelector((state) => state.blogs.loading);
  const { category } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCategories(category))
   }, [category]);
  return (
    <div>
      <Container  >
        <Row  >
          <div className="blog-heading  ">
            Category: <strong>{category?.toLocaleUpperCase()}</strong>
          </div>
          {
        loading ? <><Loading/></> : 
<>
          {categoryBlogs?.map((item) => (
            <Col md={24}>
              <BlogSection key={item.id} {...item} />
            </Col>
          ))}</>}
        </Row>
      </Container>
    </div>
  );
};

export default CategoryBlog;
