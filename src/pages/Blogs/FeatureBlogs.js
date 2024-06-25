import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Timestamp from "react-timestamp";
import { Col, FlexboxGrid, Panel, Row, Stack } from "rsuite";
import { excerpt } from "../../assets/constants";
import parse from 'html-react-parser';

const FeatureBlogs = ({ blogs, title }) => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <Panel shaded>
      <div className="blog-heading">{title}</div>
      {
        blogs?.length > 0 ? <></> : <>{title} are not available</>
      }
      {blogs?.map((item, index) => (
        <div key={index}>
          <Row>
            <div
               style={{ cursor: "pointer" }}
            >
              <Col  >
                <Stack justifyContent="flex-start">
                <img loading="lazy" 
                  src={item.imageUrl}
                  alt={item.title}
                  className="most-popular-img"
                />
              </Stack>
              </Col>
              <Col  >
                <FlexboxGrid justify="start">
                <FlexboxGrid.Item colspan={20} style={{ fontFamily: 'Space Mono Regular' }}>
                  <a 
              onClick={() => navigate(`${location.pathname.split('/').slice(0, -1).join('/')}/${item.id}`)}
              >{item.title}</a></FlexboxGrid.Item>
                  <FlexboxGrid.Item colspan={20} style={{ fontFamily: 'Space Mono Regular' }}>
                  <p style={{fontFamily:'Courier Prime Regular'}}>
{
              item?.content ? <>{parse(excerpt(item?.content, 15))}</> : null
            }</p></FlexboxGrid.Item>
                <FlexboxGrid.Item  colspan={20}  >
                  <Timestamp relative date={item?.timestamp?.toDate().toDateString()}></Timestamp>
                </FlexboxGrid.Item>
               </FlexboxGrid>  
              </Col>

            </div>
          </Row>
          {
            (index % 2 == 0) ? <div className="feature-blogs-divider" /> : <></>
          }
        </div>

      ))}
    </Panel>
  );
};

export default FeatureBlogs;
