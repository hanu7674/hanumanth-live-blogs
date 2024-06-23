import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./index.css"
import { useDispatch, useSelector } from "react-redux";
import { getTrendingBlogs } from "../../redux/blogs";
 import AwesomeSlider from 'react-awesome-slider';
import { Container } from "rsuite";
import withAutoplay from 'react-awesome-slider/dist/autoplay';
import Loading from "../../components/Loading/loading";
const AutoplaySlider = withAutoplay(AwesomeSlider);

const Trending = () => {
    const loading  = useSelector((state)=> state.blogs.loading)
    const blogs = useSelector((state)=> state.blogs.trendingBlogs);
    const location = useLocation();

    const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(getTrendingBlogs());
    }, [dispatch])
    return(
        <>
        <div>
      {/* {JSON.stringify(blogs)} */}
         <div className="blog-heading">Trending</div>
       {
        loading ? <div style={{margin: 'auto', width: 'max-content ', height: "max-content"}}><Loading/></div> : 
        <>{
          blogs?.length >0 ? 
        <div style={{}}>
      <AutoplaySlider play={true}
      cancelOnInteraction={false} // should stop playing on user interaction
      interval={6000}
      className="carousel-auto-play"
      >
        {blogs?.map((item) => (
          <div className="item  " key={item.id}>
            <Link to={`${location.pathname}/view/${item?.id}`}>
              <div className="trending-img-position">
              <img loading="lazy" 
                    src={item?.imageUrl}
                    alt={item?.title}
                    className="trending-img-relative"
                  />
                <div className="trending-img-absolute"></div>
                <div className="trending-img-absolute-1">
                  <span className="text-white">{item.title}</span>
                  <div className="trending-meta-info">
                    {item?.postedBy?.firstName + item?.postedBy?.lastName} - {item?.timestamp?.toDate().toDateString()}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </AutoplaySlider></div>
      : <>
      <Container>
        <div className="carousel-empty-message" >
          Oh! No one hasn't posted any Trending blogs till now.
        </div>
      </Container>
      </>
      }</>
}
        </div>
        </>
    )
}


export default Trending;