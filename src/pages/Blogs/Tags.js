import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./index.css";
import { Panel } from "rsuite";
const Tags = ({ tags, title }) => {
  const location = useLocation();
  return (
    <Panel shaded>
      {title ? <> <div className="blog-heading "> {title}  </div></> : <></>}
   
      {tags?.length > 0 ? (
        <div className="tags">
          {tags.map((tagCount, index) => (
            <span key={index} >{
              tagCount?.tag ?
                <p className="tag" key={index}>
                  <Link
                    to={`${location.pathname}/tags/${tagCount.tag}`}
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    {`${tagCount.tag} (${tagCount.count})`}
                  </Link>
                </p> : <p className="tag" key={index}>
                  <Link
                    to={`${location.pathname}/tags/${tagCount}`}
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    {tagCount}
                  </Link>
                </p>
            }</span>

          ))}
        </div>
      ) : (
        <div>Tags not available</div>
      )}

    </Panel>
  );
};

export default Tags;
