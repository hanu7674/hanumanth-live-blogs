import React, { Component } from "react";
import "./PullRequests.css";
import PullRequestCard from "../pullRequestCard/PullRequestCard";
import pullRequestsData from "../../../assets/opensource/pull_requests.json";

class PullRequests extends Component {
  render() {
    return (
      <div data-aos="zoom-in-up">
        {
          pullRequestsData.totalCount > 0 ? 
          <>
        <div className="pull-requests-header-div">
            <h1 className="pull-requests-header text-white">
              Pull Requests
            </h1>
        </div>
        <div className="pull-request-body-div">
        
          {pullRequestsData["data"].map((pullRequest) => {
            return <PullRequestCard pullRequest={pullRequest} />;
          })}
          </div>
          </> : 
        <></>
        }
      </div>
    );
  }
}

export default PullRequests;
