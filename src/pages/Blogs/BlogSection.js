import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { excerpt } from "./utility";
import { FaEdit, FaTrash } from 'react-icons/fa';
import parse from "html-react-parser";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, Col, Divider, Grid, Row, Panel } from "rsuite";
import { deleteBlog } from "../../redux/blogs";
import RemindIcon from '@rsuite/icons/legacy/Remind';

const BlogSection = ({
  id,
  title,
  content,
  category,
  imageUrl,
  postedBy,
  timestamp,
  index
}) => {
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const blogContent = parse(content);
 
  
  return (
    <>
      <Panel shaded className=" blog-section" data-aos="fade-up">
        <div >
           
          <div key={id} >
            <Row>
              <Col md={8} sm={24} xs={24}>
                <div className="hover-blogs-img">
                  <div className="blogs-img">
                    <img src={imageUrl} alt={title} />

                  </div>
                </div>
              </Col>
              <Col md={16} sm={24} xs={24}>
                <div className="text-start">
                  <h6 className="category catg-color">{category}</h6>
                  <span className="title  ">
                    {title ? <>{excerpt(title, 65)}</> : null}
                  </span>
                  <span className="meta-info">
                    <p className="author">{postedBy?.firstName + " " + postedBy?.lastName}</p> -&nbsp;
                    {timestamp?.toDate().toDateString()}
                  </span>
                </div>
                <div className="short-description text-start">
                  {content ? <>{excerpt(blogContent, 100)}</> : null}
                </div>
                <Link to={`${location.pathname}/view/${id}`}>
                  <button className="btn btn-read">Read More</button>
                </Link>
                
                
              </Col>
            </Row>

          </div>

        </div>
      </Panel>
      {
        (index % 2 == 0) ? <><div className="blog-section-divider" /></> : <></>
      }
    </>
  );
};

export default BlogSection;
