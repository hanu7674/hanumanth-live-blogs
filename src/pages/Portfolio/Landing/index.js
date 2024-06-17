import React from 'react';
import { Button, Col, Nav, Panel, Row, Stack, Tabs, Text } from 'rsuite';
import { BsArrowRightCircle } from 'react-icons/bs';
import { useParallax, Parallax } from 'react-scroll-parallax';
import "./index.css"
import Typewriter from 'typewriter-effect';
import Lottie from 'react-lottie';
import animationData from '../../../assets/Lotties/home-header.json';
import animationData1 from '../../../assets/Lotties/home-2.json';
import { useNavigate } from 'react-router';
import 'react-multi-carousel/lib/styles.css';
import "react-circular-progressbar/dist/styles.css";
const Landing = () => {
  const navigate = useNavigate();
  const { ref } = useParallax({ speed: 10 });
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
    },
  };
  const roles = [
    {
      name: "Full-Stack Developer", performance: 80, points: [
        "Proficient in programming languages like Python and JavaScript, and experienced in working with popular frameworks like Laravel and React.",
        "Proven ability to learn new technologies quickly and contribute to the success of the team.",
        "Strong expertise in database design, data retrieval and processing, and web development.",
        "Winner of the 2nd prize in Project Expo-2K19 on the occasion of Engineer’s day organized by CRI, KSRMCE."
      ]
    },
    {
      name: "Front-End Developer", performance: 90, points: [
        "Experienced in developing responsive and interactive user interfaces using modern frontend technologies such as React, Vue, and Angular.",
        "Proficient in HTML, CSS, and JavaScript, with a strong understanding of web standards and best practices.",
        "Skilled in implementing designs and UX concepts provided by designers into high-quality, pixel-perfect web pages.",
        "Familiar with popular tools and frameworks such as Bootstrap, Material UI, and Tailwind CSS to create visually appealing and efficient UI components.",
      ]
    },
    {
      name: "React Developer", performance: 90, points: [
        "Proficient in React and its ecosystem, including Redux, React Router, and React Native.",
        "Experience in building responsive and scalable web applications using React and other front-end technologies like HTML, CSS, and JavaScript.",
        "Familiarity with modern web development tools such as Webpack, Babel, and Git for efficient and collaborative development workflows.",
        "Strong understanding of core computer science concepts like data structures and algorithms, as well as software engineering best practices such as test-driven development and continuous integration.",
      ]
    }];
   
  // const skills = [
  //   {name: "HTML", performance: 90},
  //   {name: "CSS", performance: 90},
  //   {name: "Java Script", performance: 90},
  //   {name: "React Js", performance: 80},
  //   {name: "Git", performance: 80},
  //   {name: "Laravel", performance: 60},
  //   {name: "Vue Js", performance: 60},
  //   {name: "NPM", performance: 80},
  //   {name: "SCSS", performance: 0},
  // ]
  const Component = () => {
    return (
      <div >
      <Parallax translateY={[-20, 20]}>
        <Row  style={{ margin: "12% 12% 0% 12%"}}>
          <Col md={10} sm={24}  >
            <div data-aos="zoom-in">
              <Lottie
                options={defaultOptions1}
                isClickToPauseDisabled={false}

                title="lingala hanumantha reddy's animation skills"

              /></div>
          </Col>
          <Col md={14} sm={24}  >
            <div data-aos="zoom-in">
               
              <div  >
                <Panel bordered shaded header={
                  <><Text align='center' size='xlg'>
                  <h1>What I Do  ?</h1></Text>
                  </>
                }>

                  <Tabs defaultActiveKey={0} vertical appearance="subtle">
                       
                      {
                      roles.map((role, index) => {
                            return (
                                 <Tabs.Tab eventKey={index} title={role.name}>
                                  <div key={role.name}>
                                    <div key={role.name}>{
                                      role?.points?.map((point) => {
                                        return (
                                          <div key={point}>

                                            <Stack alignItems='flex-start' spacing={10}>
                                              <Stack.Item>⚡</Stack.Item>
                                              <Stack.Item>{point}</Stack.Item>
                                            </Stack>
                                          </div>
                                        )
                                      })
                                    }
                                    </div>
                                  </div>
                                </Tabs.Tab>
                             )
                          })}
                  </Tabs>
                   
                </Panel>
                 

              </div>
            </div>
          </Col>
        </Row>
      </Parallax>
      </div>
    )
  };
  const letsConnect = () => {
    navigate('/connect-with-me')
  }
  return (
    <div ref={ref} >
      <Row style={{ margin: "5% 12% 12% 12%"}}>
        <Col md={16} sm={24}  >
          <Button size='lg' className='space-btn' variant="outline-light">Welcome to my Portfolio</Button>
          <br></br>        <br></br>

          <span className='fw-bold home-heading-main'>Hi! I'm&nbsp; Hanumantha Reddy
            <Typewriter
              options={{
                strings: ['Full Stack Developer !', 'Front-End Developer !', 'React Developer !'],
                autoStart: true,
                loop: true,
              }}
            />
          </span>
          <p className='home-tag-description'>
            I am a highly skilled and passionate full-stack web developer with expertise in modern technologies such as React, Node.js, and MongoDB. With several years of experience delivering high-quality web applications for clients around the world, I am dedicated to creating responsive and engaging user experiences. My portfolio showcases a diverse range of projects that demonstrate my ability to solve complex problems and deliver outstanding results.
          </p>
          <br></br>
          <br></br>
          <br></br>
          <div>
            <Button appearance='ghost' className='lets-connect-button' onClick={letsConnect}>
              <Stack alignItems='center'>
                <Stack.Item>
            <h3 className='text-white'>Let's Connect &nbsp; <BsArrowRightCircle className='forword-arrow-icon' />&nbsp; &nbsp;</h3>
</Stack.Item>
               </Stack>
            </Button>
             </div>
        </Col>
        <Col  md={8} sm={24}>
          <div data-aos="zoom-in"><Lottie
            options={defaultOptions}
            isClickToPauseDisabled={false}
            title="lingala hanumantha reddy's animation skills"

          /></div>

        </Col>

      </Row>
      <Component />
    </div>
  )
};

export default Landing;
