import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./index.css";
import { Panel } from "rsuite";
const Tags = ({ tags, title }) => {
  const location = useLocation();
  const getTagUrl = (tag) => {
    // Check if the current pathname includes 'admin'
    if (location.pathname.includes('admin')) {
      // Extract the base admin path up to the point where 'admin' is mentioned
      const basePath = location.pathname.substring(0, location.pathname.indexOf('admin') + 'admin'.length);
      return `${basePath}/blogs/tags/${tag}`;
    } else {
      // If not in admin, use a default or handle differently as needed
      return `${location.pathname}/tags/${tag}`;
    }
  };
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
to={getTagUrl(tagCount.tag)}
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    {`${tagCount.tag} (${tagCount.count})`}
                  </Link>
                </p> : <p className="tag" key={index}>
                  <Link
to={getTagUrl(tagCount)}
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
