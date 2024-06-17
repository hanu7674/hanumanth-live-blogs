import React from "react";
import { Link, useLocation } from "react-router-dom";

const Category = ({ catgBlogsCount }) => {
  const location = useLocation();
  return (
    <div className="widget">
      <div className="blog-heading text-start py-2 mb-4">Category</div>
      {
        catgBlogsCount?.length > 0 ? <></> : <>Categories are not available</>
      }
      <div className="link-widget">
        <ul>
          {catgBlogsCount?.map((item, index) => (
            <li key={index}>
              <Link
                to={`${location.pathname}/category/${item.category}`}
                style={{ textDecoration: "none", float: "left", color: "#777" }}
              >
                {item.category}
                <span>({item.count})</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Category;
