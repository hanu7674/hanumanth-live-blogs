import React, { useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import animationData from "../../../assets/Lotties/projects.json";
import animationData1 from "../../../assets/Lotties/project-thumbnail.json";
import Lottie from "react-lottie";
import "./index.css";
 import { BsArrowRightCircle } from 'react-icons/bs';
import { Col, Container, FlexboxGrid, Row, Stack, Text, Button, Loader, Panel, Grid } from "rsuite";
import { getProjectList } from '../../../redux/auth'; // Import the action to fetch project data
import Loading from '../../../components/Loading/loading'
const Projects = ({ projectList, getProjectList, getProjectListLoading }) => {
  useEffect(() => {
    getProjectList();
  }, []);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };
  const defaultOptions1 = {
    loop: true,
    autoplay: true,
    animationData: animationData1,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  return (
    <div>
      <div style={{ margin: "8% 12% 12% 12%" }}>
        <Row   >
          <Col md={10} sm={24}  >
            <div data-aos="zoom-in">
              <Lottie
                options={defaultOptions}
                isClickToPauseDisabled={false}

                title="lingala hanumantha reddy's projects"

              />
            </div>
          </Col>
          <Col md={14} sm={24}  >
            <div data-aos="zoom-in"  >
              <div className="experience-heading-text-div" style={{ marginTop: '25%' }} data-aos="zoom-in">

                <p
                  className="experience-header-detail-text subTitle text-muted" style={{ margin: '15px' }}
                >My projects makes use of vast variety of latest technology tools. My best experience is to create Web applications and deploy them it into cloud.

                </p>
              </div>


            </div>
          </Col>
        </Row>
        {
          getProjectListLoading ? <><Loading /></> : <>
        <Container  >
          <h1 style={{ marginBottom: '20px' }}  data-aos="zoom-in"
            className="experience-heading-text text-white"
          >
            <u>
              Projects</u>
          </h1>
           <Row  gutter={20}>
            {
              projectList.map((project, index) => (
                <Col md={7} sm={24} key={project.id} data-aos="zoom-in">
                  <Panel  shaded bordered bodyFill >
                    {
                      project.imageUrl ? <img loading="lazy"  src={project.imageUrl} alt={project.title} style={{  objectFit: 'cover', height: 240 }} /> :
                        <div>
                          <Lottie
                            options={defaultOptions1}
                            isClickToPauseDisabled={false}
                            title="lingala hanumantha reddy's projects"
                          />
                        </div>
                    }
                  </Panel>
                  <div  style={{textAlign: 'center'}}>
                    <h4  >{project.projectName}</h4>
                    <Button href={project?.projectUrl}>View Details</Button>
                  </div>
                </Col>
              ))
            }
          </Row>
         </Container>
         
        <FlexboxGrid justify="center">
          <Button appearance='ghost' className='lets-connect-button' href='https://github.com/hanu7674' >
            <Stack alignItems='center'>
              <Stack.Item>
                <h3 className='text-white'>More Projects &nbsp; <BsArrowRightCircle className='forword-arrow-icon' />&nbsp; &nbsp;</h3>
              </Stack.Item>
            </Stack>
          </Button>
        </FlexboxGrid>
</>
        }
      </div>
    </div>
  )
}


const mapDispatchToProps = dispatch => ({
  getProjectList: () => dispatch(getProjectList())
});
const mapStateToProps = state => ({
  projectList: state.auth?.projectList,
  getProjectListLoading: state.auth?.getProjectListLoading,
});
export default connect(mapStateToProps, mapDispatchToProps)(Projects);