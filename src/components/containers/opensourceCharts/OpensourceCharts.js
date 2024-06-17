import React, { Component } from "react";
import PullRequestChart from "../pullRequestChart/PullRequestChart.js";
import IssueChart from "../issueChart/IssueChart.js";
import "./OpensourceCharts.css";
import PullRequestData from "../../../assets/opensource/pull_requests.json";
import IssueData from "../../../assets/opensource/issues.json";
import { Col, Row, Stack } from "rsuite";

class OpensourceCharts extends Component {
  render() {
    return (
      <div className="mb-5 pb-5">
        <div className="os-charts-header-div">
          <h1 className="os-charts-header text-white" >
            <u>Contributions</u>
          </h1>
        </div>
        <>
          <Row>


            {
              PullRequestData.totalCount > 0 ? <>
                <Col sm={24} mdOffset={IssueData.totalCount > 0 ? 0 : 6} md={12}>
                  <PullRequestChart /></Col></> : <></>}


            {
              IssueData.totalCount > 0 ? <>
                <Col sm={24} md={12} mdOffset={PullRequestData.totalCount > 0 ? 0 : 6}>
                  <IssueChart /> </Col></> : <></>}

          </Row>
        </>
      </div>
    );
  }
}

export default OpensourceCharts;
