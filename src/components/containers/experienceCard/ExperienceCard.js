import React, { Component } from "react";
import "./ExperienceCard.css";
import parse from "html-react-parser";

class ExperienceCard extends Component {
  render() {
    const experience = this.props.experience;
    return (
      <div
        className="experience-card"
        style={{ border: `1px solid ${experience.color || "#fff"}` }}
        data-aos="zoom-in-up"
      >
        <div className="experience-card-logo-div">
          <img loading="lazy" 
            className="experience-card-logo"
            src={experience.imageUrl}
            alt={experience.company}
          />
        </div>
        <div className="experience-card-body-div">
          <div className="experience-card-header-div">
            <div className="experience-card-heading-left">
              <h3
                className="experience-card-title"
                style={{ color: "white" }}
              >
                {experience.role}
              </h3>
              <p
                className="experience-card-company"
                style={{ color: "white" }}
              >
                <a
                  href={experience.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {experience.company}
                </a>
              </p>
            </div>
            <div className="experience-card-heading-right">
              <p
                className="experience-card-duration"
                style={{ color: "whitesmoke" }}
              >
                {experience.startDateMonth} {experience.startDateYear} - {experience.endDateMonth} {experience.endDateYear}
              </p>
              <p
                className="experience-card-location"
                style={{ color: "whitesmoke" }}
              >
                {experience.location}
              </p>
            </div>
          </div>
          <p
            className="experience-card-description"
            style={{ color: "#f2f2f2" }}
          >
            { parse(experience.description)}
          </p>
        </div>
      </div>
    );
  }
}

export default ExperienceCard;
