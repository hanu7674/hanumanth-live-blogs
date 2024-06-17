import React from "react";
import Lottie from 'react-lottie';
import animationData from "../../../assets/Lotties/education.json";
import CertificationCard from "../../../components/containers/certificationCard/CertificationCard";
import CompetitiveSites from "../../../components/containers/competitiveSites/CompetitiveSites";
import DegreeCard from "../../../components/containers/degreeCard/DegreeCard";
import { Col, Row, Text } from "rsuite";
const Education = () =>{
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice"
        }
      };
    return(
        <>
         <Row style={{ margin: "5% 12% 12% 12%"}}>
  <Col md={10} sm={24}  >
  <div data-aos="zoom-in">
    <Lottie 
	    options={defaultOptions}
      isClickToPauseDisabled={false}
      
      title="lingala hanumantha reddy's animation skills"
      
      /></div>
  </Col>
  <Col md={14} sm={24}  >
    <div data-aos="zoom-in">
    <Text align="center" size="4rem" transform="uppercase" weight="extrabold" muted>Education</Text>
    <Text align="center" size="2rem">Basic Qualification and Certifcations</Text>
    <div  style={{marginTop: '5%'}}>
       <CompetitiveSites/>
    </div>
   </div>
  </Col>
  </Row>
  <Row style={{ margin: "5% 12% 12% 12%"}}>
  <div data-aos="zoom-in-up">
  <Text align="center" size="4rem" weight="extrabold" muted><span style={{textDecoration: 'underline'}}> Degrees Received</span></Text>
     
  <Col md={24} sm={24}>
        <DegreeCard/>
        </Col>
 
    </div>
  </Row>
   <Text align="center" size="4rem" weight="extrabold" muted><span style={{textDecoration: 'underline'}}> Certifications</span></Text>
  <Row style={{ margin: "5% 12% 12% 12%"}}>
  <div data-aos="zoom-in-up">

    
  <Col sm={24} md={24}>
        <CertificationCard/>
        </Col>
 
    </div>
  </Row>
         </>
    )
}

export default Education; 