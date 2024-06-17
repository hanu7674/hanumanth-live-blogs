import React from "react";
import "./CompetitiveSites.css";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { FaHackerrank, FaKaggle } from "react-icons/fa";
import {SiCodechef, SiHackerearth} from "react-icons/si"
const CompetitiveSites = () => {

  const logos = [
      {
        siteName: "HackerRank",
        icon: <FaHackerrank style={ {
          color: "#2EC866",
        }}/>,
        profileLink: "https://www.hackerrank.com/hanu7674",
      },
      {
        siteName: "Codechef",
        icon:  <SiCodechef style={{color: "yellow",}}/>,
        profileLink: "https://www.codechef.com/users/hanu7674",
      },
      {
        siteName: "Hackerearth",
        icon: <SiHackerearth style={{
          color: "#e6e6e6",
        }}/>,
        profileLink: "https://www.hackerearth.com/@hanu7674",
      },
      {
        siteName: "Kaggle",
        icon: <FaKaggle style={{
          color: "#20BEFF",
        }}/>,
        profileLink: "https://www.kaggle.com/hanu7674",
      },
    ];
    return (
      <div className="competitive-sites-main-div">
        <ul className="dev-icons">
          {logos.map((logo, idx) => {
            return (
              <OverlayTrigger
                key={logo.siteName}
                placement={"top"}
                style={{ marginBottom: "5px" }}
                overlay={
                  <Tooltip id={`tooltip-top`}>
                    <strong>{logo.siteName}</strong>
                  </Tooltip>
                }
              >
                <li className="competitive-sites-inline" key={logo.siteName} name={logo.siteName}>
                  <a
                    href={logo.profileLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {
                      logo.icon
                    }
                  </a>
                </li>
              </OverlayTrigger>
            );
          })}
        </ul>
      </div>
    );
}

export default CompetitiveSites;
