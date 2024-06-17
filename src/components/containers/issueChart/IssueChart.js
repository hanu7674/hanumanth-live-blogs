import React, { Component } from "react";
 import "./IssueChart.css";
import IssueData from "../../../assets/opensource/issues.json";
import DonutChart from "../../../pages/Admin/dashboard/Donut";
import { Col, Row , Panel, Stack} from "rsuite";

class IssueChart extends Component {
  render() {
     
 
    return (
           <DonutChart
           height={460}
           title={'Issue Distribution'}
          data= {[IssueData["open"], IssueData["closed"]]}
          type="donut"
          labels= {["Open", "Closed"]}
        />     
      );
  }
}

export default IssueChart;
