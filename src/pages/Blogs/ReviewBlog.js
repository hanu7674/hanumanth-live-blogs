import React, {  useEffect, useState } from "react";
import {  Link, useNavigate, useParams } from "react-router-dom";
import FeatureBlogs from "./FeatureBlogs";
import RelatedBlog from "./RelatedBlog";
import Tags from "./Tags";
import { useSelector, connect, useDispatch } from "react-redux";
import { compose } from "recompose";
import {  approveBlog, getReviewBlogDetails } from "../../redux/ActionCreators";
import { withFirebase } from "../../firebase";
import { withAuthentication } from "../../Session";
import parse from "html-react-parser";
import "./index.css";
import { SuperSEO } from 'react-super-seo';
import { excerpt } from "./utility";
import Loading from "../Loading/loading";
import { TbError404 } from "react-icons/tb";
import { Button, Message } from "rsuite";
import Avatar from "react-avatar";
import Timestamp from "react-timestamp"
import { Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faClose } from "@fortawesome/free-solid-svg-icons";

const ReviewBlog = () => {
  const user = useSelector((state) => state.authState.user);
  const { id } = useParams();
  const dispatch = useDispatch();
  const blog = useSelector((state) => state.blogs.blogDetails);
  const blogAuthor = useSelector((state) => state.blogs.author);
  const relatedBlogs = useSelector((state) => state.blogs.relatedBlogs);
  const recentBlogs = useSelector((state) => state.blogs.recentBlogs);
  const [keywords, setKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const [author, setAuthor] = useState([])
  const navigate = useNavigate();
  useEffect(() => {
    setLoading(true)
    localStorage.setItem('redirectUrl', window.location.pathname);
    if(id){ 
    dispatch(getReviewBlogDetails(id));
    } 
    setTimeout(() =>{
      setLoading(false)

    },1000)
  },
   // eslint-disable-next-line react-hooks/exhaustive-deps
   [id, user]);
  useEffect(()=>{
    if(blog?.title){
    if(!blogAuthor){
      setAuthor(blog?.postedBy);
    }
    else{
      setAuthor(blogAuthor)
    }
    const keys = [];
    keys.push(blog?.title);
    blog?.tags?.map((tag)=>(
      keys.push(tag)
    ))
    keys.push(blog.postedBy?.displayName);
    setKeywords(keys.join(", "))
    
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blog])
  if (!blog) {
    return (
      <div className="mt-5 pt-5">
        <div className="m-5 text-center border-bottom border-top border-warning-subtle">
            <div className="text-center m-0">
              <span>
              <TbError404 size={300}/>
              </span>
            </div>
            <div className="pt-0 fs-2">
              Oops! Blog not found
            </div>
            <p className="pt-0 fs-3 mb-3">
              Sorry, but the blog you are looking for is not found. Please, make sure you have typed the correct URL.
            </p>
        </div>
        <div className="m-5 d-flex justify-content-center gap-4 align-items-center align-content-center text-center">
          
        <Button color="violet" appearance="primary" onClick={() =>navigate("/")}>Go to Home</Button>
        <Button color="violet" appearance="primary" onClick={() =>navigate("/blogs")}>View list of blogs</Button>
          
        </div>
             </div>
    );
  }

  return (
    <div className="mt-5">
      <SuperSEO
  title={blog?.title}
  description={blog?.title} property={blog?.content ? <>{excerpt(parse(blog?.content), 120)}</> : ''}
  lang="en"
  openGraph={{
    ogImage: {
      ogImage: `${blog?.imgUrl}`,
      ogImageAlt: `${blog?.title}`,
      ogImageWidth: 1200,
      ogImageHeight: 630,
      ogImageType: 'image/jpeg',
    },
  }}
  twitter={{
    twitterSummaryCard: {
      summaryCardImage: `${blog?.imgUrl}`,
      summaryCardImageAlt: `${blog?.title}`,
      summaryCardSiteUsername: 'hanu7674',
    },
  }}
>
<meta name="keywords" content={keywords}/>
  </SuperSEO>
  {loading ? <div style={{height: '100vh'}}><Loading/></div> : 
      <>

      <div className="container mt-5 pt-5">
      <Message showIcon type="info" header="Note">
      You are ReViewing a blog. This wasn't posted yet. <br></br>
      If you are An admin verify the blog contents and approve the blog.
    </Message>
      <div className="container-fluid pb-4 pt-4 padding blog-single-content">
            <div className="container padding">
            <div className="container d-flex justify-content-left gap-3 align-items-left align-content-left">            
          {
                                    author?.photoURL ? (
                                      <Avatar src={author?.photoURL} name={null} round={true} size='55px' alt={author?.firstName+ " " + author?.lastName} />
                                      
                                    ) : (
                                      <Avatar name={author?.firstName +" " +author?.lastName} round={true} size='55px' alt={author?.firstName+ " " + author?.lastName}/>
                                    )
                                  }
  <div>
    <p className="fw-bold">
      <Link to={`/user/profile/${author?.id}`} className=" text-dark">
      {author?.firstName+ " " + author?.lastName}
      </Link>
    </p>
    <span className="meta-info">{author?.tagLine ? <span>{excerpt(parse(author?.tagLine), 50)}</span> : null}</span>
    </div>
        </div>
        <div className=" d-flex mt-2 justify-content-left gap-3 align-items-left align-content-left">
          <span className="container fs-1 fw-bolder mt-2 text-capitalize">{blog?.title}</span>
        </div>
        <div>
        <span className="container fs-6 mt-2 mb-3 text-capitalize meta-info">Published <Timestamp relative date={blog?.postedBy?.timestamp?.toDate().toString()} /></span>
        </div>
              <div className="row mx-0">
                <div className="col-md-9 col-sm-12 col-xs-12 col-lg-10 col-xl-9">
                  <span>
                    {
                      blog?.imgUrl ? <Image src={blog?.imgUrl} fluid/> : null
                    }
                  </span>
                  <p className="text-start">
                    {blog?.content ? <>{parse(blog.content)}</> : null}
                  </p>
                  <div className="text-center d-flex align-content-center align-items-center justify-content-center">
                    <div className="m-2">
                    <Button appearance="primary" color="cyan" onClick={() => dispatch(approveBlog(blog))}>
                      <FontAwesomeIcon icon={faCheck}/> &nbsp;
                      Approve
                    </Button>
                    </div><div className="m-2">
                    <Button appearance="primary" color="cyan">
                      <FontAwesomeIcon icon={faClose}/> &nbsp;
                      Return to User
                    </Button>
                    </div>
                  </div>
                  <div className="text-start mt-3">
                    <Tags tags={blog?.tags} />
                  </div>
                  <br />
                  
                </div>
                <div className="col-md-3 col-sm-12 col-xs-12 col-lg-2 col-xl-3">

                  <div className="blog-heading text-start mb-4">
                    <p>Tags</p>
                  </div>
                  <Tags tags={blog?.tags} />
                  <FeatureBlogs title={"Recent Blogs"} blogs={recentBlogs} />
                </div>
              </div>
              <RelatedBlog id={id} blogs={relatedBlogs} />
            </div>
          </div>
      </div>
        </>}
        </div>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.authState.currentUser,
  user: state.userState.user,
});
export default compose(
  connect(mapStateToProps),
  withFirebase,
  withAuthentication
)(ReviewBlog);
