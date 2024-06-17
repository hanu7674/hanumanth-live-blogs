import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./index.css";
import Lottie from 'react-lottie';
import animationData from "../../../assets/Lotties/experience.json";
import ExperienceAccordion from "../../../components/containers/experienceAccordion/ExperienceAccordion";
import { Col, Row } from "rsuite";
import { getExperienceList } from '../../../redux/auth'; // Import the action to fetch experience data

const Experience = () => {
    const dispatch = useDispatch();
    const experienceList = useSelector((state) => state.auth.experienceList);

    useEffect(() => {
        dispatch(getExperienceList());
    }, [dispatch]);

    const transformData = (data) => {
        const sections = {};
        data.forEach((item) => {
            if (!sections[item.type]) {
                sections[item.type] = {
                    title: item.type,
                    experiences: []
                };
            }
            sections[item.type].experiences.push(item);
        });
        return Object.values(sections);
    };

    const experience = {
        title: "Experience",
        subtitle: "Work, Internship and Volunteership",
        description:
          "I have worked for a MNC as Software Developer. I'm recently moved out as a Software Developer at Aricent Technologies (Holdings) Pvt.Ltd. I love organising events and that is why I am also involved with many opensource communities as a representative.",
        header_image_path: "experience.svg",
        sections: transformData(experienceList || []), // Transform the data
    };

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice"
        }
    };

    return (
        <div className="experience-main">
            <div>
                <Row style={{ margin: "5% 12% 0% 12%" }}>
                    <Col md={10} sm={24}>
                        <div data-aos="zoom-in">
                            <Lottie 
                                options={defaultOptions}
                                isClickToPauseDisabled={false}
                                title="lingala hanumantha reddy's experience"
                            />
                        </div>
                    </Col>
                    <Col md={14} sm={24}>
                        <div className="experience-heading-text-div" data-aos="zoom-in">
                            <h1 className="experience-heading-text text-white">
                                {experience.title}
                            </h1>
                            <h3 className="experience-heading-sub-text text-white">
                                {experience.subtitle}
                            </h3>
                            <p className="experience-header-detail-text subTitle text-muted">
                                {experience.description}
                            </p>
                        </div>
                    </Col>
                </Row>
                <Row style={{ margin: "5% 12% 12% 12%" }}>
                    <ExperienceAccordion sections={experience.sections} />
                </Row>
            </div>
        </div>
    );
};

export default Experience;
