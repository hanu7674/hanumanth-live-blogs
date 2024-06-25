import React, { useEffect } from "react";
import "../experienceCard/ExperienceCard.css";
import { connect } from "react-redux";
import { getEducationList } from "../../../redux/auth";
  import Loading  from '../../Loading/loading'
import parse from "html-react-parser";

  const DegreeCard = ({educationList, educationListLoading, getEducationList}) => {
  useEffect(()=>{
      getEducationList();
  }, [])
    
    return ( 
      <div className="m-5">
        {
          educationListLoading ? <Loading /> : <>
          {
            educationList?.map((edu) => {
              return(
                <div
        className="experience-card"
        style={{ border: `1px solid green` }}
        data-aos="zoom-in-up"

      >
        <div className="experience-card-logo-div">
          <img loading="lazy" 
            className="experience-card-logo"
            src={edu?.imageUrl}
            alt=""
          />
        </div>
        <div className="experience-card-body-div">
          <div className="experience-card-header-div">
            <div className="experience-card-heading-left">
              <h3
                className="experience-card-title"
                style={{ color: "white" }}
              >
                {edu?.degree} 
              </h3>
              <h4
                className="experience-card-company"
                style={{ color: "white" }}
              >
               {edu?.fieldOfStudy ? edu?.fieldOfStudy : ''}
              </h4>
              <p
                className="experience-card-company"
                style={{ color: "white" }}
              >
                <a
                  href={edu?.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {edu?.school}
                </a>
              </p>
            </div>
            <div className="experience-card-heading-right">
              <p
                className="experience-card-duration"
                style={{ color: "whitesmoke" }}
              >
                 {
        edu?.startDateMonth+ ' ' + edu?.startDateYear + ' - '+ edu?.endDateMonth+ ' ' + edu?.endDateYear
            }
              </p>
              <p
                className="experience-card-location"
                style={{ color:  "whitesmoke"}}
              >
                {edu.location ? edu?.location : 'Not Available'}
              </p>
            </div>
          </div>
          <p
            className="experience-card-description"
            style={{ color: "#f2f2f2" }}
          >
            <p className="content-list" >
                     {parse(edu?.description)}
                  </p>
          </p>
        </div>
      </div>

              )
            })
          }
          </>
        }
        </div>
      
    );
}
const mapDispatchToProps = dispatch => ({
  getEducationList: () => dispatch(getEducationList()),
});
const mapStateToProps = state => ({
  educationListLoading: state.auth?.educationListLoading,
  educationList: state.auth?.educationList,
 });
export default connect(mapStateToProps, mapDispatchToProps)(DegreeCard);
