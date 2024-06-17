import React from "react";
import Card from "./Card";
import { Col, Divider, FlexboxGrid, Notification } from "rsuite";

const RelatedBlog = ({ blogs, id }) => {
  return (
    <div>
      <div className="blog-heading">
        Related Blogs
      </div>
      

        {blogs.length < 1 ? (
          <FlexboxGrid justify="center">
          <Notification>
            Related Blogs not found for this blog.
          </Notification>
          </FlexboxGrid>
        ) : <>
<FlexboxGrid >
          {blogs
            ?.filter((blogs) => blogs.id !== id)
            .map((item, index) => (
              <>
                <FlexboxGrid.Item as={Col}   >
                  <Card item={item} key={item.id} index={index} />
                </FlexboxGrid.Item>
                <FlexboxGrid.Item as={Col}   >
                   {
                    (index) % 2 == 0 ? <><span>{ " " }</span> </> : <></>
                  }
                </FlexboxGrid.Item>
              </>
            ))} </FlexboxGrid>
        </>}

     
    </div>
  );
};

export default RelatedBlog;
