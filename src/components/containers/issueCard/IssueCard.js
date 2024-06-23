import React, { Component } from "react";
import "./IssueCard.css";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import {RiErrorWarningLine} from "react-icons/ri";
import {GoIssueClosed} from 'react-icons/go';
class IssueCard extends Component {
  render() {
    const issue = this.props.issue;
    var iconPR;
    if (issue["closed"] === false) {
      iconPR = {
        style: { color: "#28a745" },
      };
    } else {
      iconPR = {
        style: { color: "#d73a49" },
      };
    }

    var subtitleString =
      "#" + issue["number"] + " opened on " + issue["createdAt"].split("T")[0];
    var assignee;
    if (issue["assignees"]["nodes"].length > 0) {
      const name = issue["assignees"]["nodes"][0]["name"];
      assignee = (
        <OverlayTrigger
          key={name}
          placement={"top"}
          style={{ marginBottom: "5px" }}
          overlay={
            <Tooltip id={`tooltip-top`}>
              <strong>{`Assigned to ${name}`}</strong>
            </Tooltip>
          }
        >
          <a
            href={issue["assignees"]["nodes"][0]["url"]}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img loading="lazy" 
              className="assigned-to-img"
              src={issue["assignees"]["nodes"][0]["avatarUrl"]}
              alt=""
            />
          </a>
        </OverlayTrigger>
      );
    } else {
      assignee = <noscript></noscript>;
    }

    return (
        <div data-aos="zoom-in-up"
          className="issue-card"
          style={{
            // backgroundColor: bgColor,
            border: `1px solid ${iconPR.style.color}`,
          }}
        >
          <div className="issue-top">
            <div className="issue-header">
              <span style={iconPR.style}>
                {
                  issue["closed"] ? <><GoIssueClosed size={24}/></> : <><RiErrorWarningLine size={24}/></>
                }
              </span>
              <div className="issue-title-header">
                <p className="issue-title">
                  <a
                    href={issue["url"]}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{color:'white'}}
                   >
                    {issue["title"]}
                  </a>
                </p>
                <p className="issue-subtitle">{subtitleString}</p>
              </div>
            </div>
            {/* <div className="files-changed-header">
							<p
								className="files-changed-text"
								style={{ backgroundColor: iconPR.style.color }}
							>
								{issue["changedFiles"]}
							</p>
							<p className="files-changed-text-2">Files Changed</p>
						</div> */}
          </div>
          <div className="issue-down">
            <div className="assignee-repo">
              <p className="parent-repo ">
                <span className="text-muted">Repository:</span>{" "}
                <a
                  style={{ color: iconPR.style.color }}
                  href={issue["repository"]["url"]}
                >
                  {issue["repository"]["owner"]["login"]}/
                  {issue["repository"]["name"]}
                </a>
              </p>
              <div className="assignee-info">
                {/* <p className="additions-files">
									<strong>{pullRequest["additions"]} + </strong>
								</p>
								<p className="deletions-files">
									<strong>{pullRequest["deletions"]} - </strong>
								</p> */}
                {assignee}
              </div>
            </div>
            <div className="owner-img-div">
              <a
                href={issue["repository"]["owner"]["url"]}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img loading="lazy" 
                  className="owner-img"
                  src={issue["repository"]["owner"]["avatarUrl"]}
                  alt=""
                />
              </a>
            </div>
          </div>
        </div>
    );
  }
}

export default IssueCard;
