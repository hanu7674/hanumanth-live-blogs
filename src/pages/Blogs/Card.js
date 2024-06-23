import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { excerpt } from "./utility";
import parse from 'html-react-parser';
import { Row, Panel, Stack } from "rsuite";
import Timestamp from "react-timestamp";
import { AiFillHeart } from "react-icons/ai";
import { FaComments } from "react-icons/fa";

const Card = ({ key, item, index }) => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div>
      <Row>
        <div
          key={item.id}
          style={{ cursor: "pointer" }}
          onClick={() => navigate(`${location.pathname.split('/').slice(0, -1).join('/')}/${item.id}`)}
        >
          <Panel shaded bordered bodyFill style={{ display: 'inline-block', width: 240 }}>
            <img loading="lazy"  height="240" src={item.imageUrl}
              alt={item.title}
              style={{ fontFamily: 'Space Mono Regular' }} />
            <Panel header={
              <h3 style={{ fontFamily: 'Space Mono Regular' }}>{item.title}</h3>
            }>
              <h6 style={{ fontFamily: 'Courier Prime Regular' }}>


                {
                  item?.content ? <>{excerpt(parse(item?.content), 25)}</> : null
                }</h6>
              <Stack justifyContent="space-between">
                <Stack.Item>
                  <Timestamp relative date={item?.timestamp?.toDate().toDateString()}></Timestamp>
                </Stack.Item>
                <Stack.Item>
                  <Stack justifyContent="space-between">
                    <Stack.Item>
                      <Stack alignItems="center" justifyContent="center">{
                        item?.likes?.length > 0 ? <> {item?.likes?.length} </> : <>0</>
                      }<AiFillHeart size={24} />
                        &nbsp;</Stack>
                    </Stack.Item>
                    <Stack.Item><Stack alignItems="center" justifyContent="center">
                      {
                        item?.comments?.length > 0 ? <>

                          {item?.comments?.length}
                        </> : <>0</>
                      }<FaComments size={24} />&nbsp;</Stack></Stack.Item>
                  </Stack>


                </Stack.Item>

              </Stack>

            </Panel>
          </Panel>
        </div>

      </Row>
    </div>
  );
};

export default Card;
