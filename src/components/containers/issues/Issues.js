import React, { Component } from "react";
import "./Issues.css";
import IssueCard from "../issueCard/IssueCard";
import issuesData from "../../../assets/opensource/issues.json";

class Issues extends Component {
  render() {
    return (
      <div style={{margin:'20px'}}>
        <div className="issues-header-div" data-aos="zoom-in">
            <h1 className="issues-header" style={{ color: "white", margin: '20px' }}>
             <u> Issues</u>
            </h1>
        </div>
        <div className="issues-body-div">
        {
          issuesData.totalCount > 0 ? <>{issuesData["data"].map((issue) => {
            return <IssueCard issue={issue} />;
          })}</> : 
        <>
        <span>Currently Issue data is not available</span></>
        }
          
        </div>
      </div>
    );
  }
}

export default Issues;
