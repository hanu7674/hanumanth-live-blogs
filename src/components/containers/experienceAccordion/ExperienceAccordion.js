import React from "react";
import { Accordion, PanelGroup, Panel } from "rsuite";
import ExperienceCard from "../experienceCard/ExperienceCard";

const ExperienceAccordion = ({ sections }) => {
    return (
        <div data-aos="zoom-in">
            <PanelGroup accordion defaultActiveKey={0} bordered>
                {sections?.map((section, index) => (
                    <Panel
                        header={section.title}
                        key={section.title}
                        eventKey={index}
                    >
                        {section.experiences.map((experience, expIndex) => (
                           
                            <ExperienceCard key={experience.id} experience={experience} />
                        ))}
                    </Panel>
                ))}
            </PanelGroup>
        </div>
    );
}

export default ExperienceAccordion;
