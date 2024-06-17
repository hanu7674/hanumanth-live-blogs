import React, { Component } from "react";
import "./Organizations.css";
import OrganizationList from "../organizationList/OrganizationList";
import OrganizationsData from "../../../assets/opensource/organizations.json";

class Organizations extends Component {
  render() {
    return (
      <div id="organizations">
        
        
        {
          OrganizationsData['data'].length >1 ? <>
          <div className="organizations-header-div" data-aos="zoom-in">
            <h1 className="organizations-header text-white">
              Contributed Organizations
            </h1>
        </div>
        
        <OrganizationList logos={OrganizationsData["data"]} /></> : <></>
        }
        
      </div>
    );
  }
}

export default Organizations;
