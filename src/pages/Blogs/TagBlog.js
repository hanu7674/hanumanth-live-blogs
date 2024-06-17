import React, {  useEffect } from "react";
import { useParams } from "react-router-dom";
import BlogSection from "./BlogSection";
 import { getTags } from "../../redux/blogs";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../components/Loading/loading";
import { Col, Container, Row } from "rsuite";

const TagBlog = () => {
    const tagBlogs = useSelector((state) => state.blogs.tagBlogs);
    const  loading = useSelector((state) => state.blogs.loading);
    const { tag } = useParams();
    const dispatch = useDispatch();
    useEffect(() => {
      dispatch(getTags(tag))
     }, [tag]);

  return (
    <div>
      <Container  >
        <Row  >
          <div className="blog-heading  ">
            Tag: <strong>{tag.toLocaleUpperCase()}</strong>
          </div>
          {
        loading ? <><Loading/></> : 
<>
          {tagBlogs?.map((item) => (
            <Col md={24}  key={item?.id}>
              <BlogSection key={item.id} {...item} />
            </Col>
          ))}
          </>}
        </Row>
      </Container>
    </div>
  );
};

export default TagBlog;
