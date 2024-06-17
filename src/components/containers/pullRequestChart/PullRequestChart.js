import React, { Component } from "react";
 import "./PullRequestChart.css";
import PullRequestData from "../../../assets/opensource/pull_requests.json";
import DonutChart from "../../../pages/Admin/dashboard/Donut";

class PullRequestChart extends Component {
  render() {
     

    return (
      <div className="pr-chart">
           
        <DonutChart
        title={'Pull Request Distribution'}
          data ={ [
            PullRequestData["open"],
            PullRequestData["merged"],
            PullRequestData["closed"],
          ]}
          labels = {["Open", "Merged", "Closed"]}
        />
      </div>
    );
  }
}

export default PullRequestChart;
