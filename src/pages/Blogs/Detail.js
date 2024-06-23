import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Like from "./Like";
import FeatureBlogs from "./FeatureBlogs";
import RelatedBlog from "./RelatedBlog";
import Tags from "./Tags";
import { useSelector, connect, useDispatch } from "react-redux";
import { getBlogDetails, getRecentBlogs, getRelatedBlogs, handleLike } from "../../redux/blogs";
import parse from "html-react-parser";
import { handleAddComment, handleDeleteComment, handleEditComment, handleReplyComment, setBlogComments } from "../../redux/blogs";
import { CommentSection } from 'react-comments-section'
import 'react-comments-section/dist/index.css'
import "./index.css";
import { SuperSEO } from 'react-super-seo';
import { excerpt } from "./utility";
import Loading from "../../components/Loading/loading";
import { TbError404 } from "react-icons/tb";
import { Button, Popover, Whisper, AvatarGroup, Avatar, Container, Stack, Row, Col, Notification, FlexboxGrid, Panel, Breadcrumb, Text } from "rsuite";
import Share from "./Share";
import Timestamp from "react-timestamp"
import { FaShareSquare } from 'react-icons/fa'
import { FaUser } from "react-icons/fa6";
import { IoMdTime } from "react-icons/io";

const BlogDetails = () => {
  const user = useSelector((state) => state?.auth?.user);
  const userId = user?.id ? user?.id : null;
  const { id } = useParams();
  const dispatch = useDispatch();
  const blog = useSelector((state) => state.blogs.blogDetails);
  const blogLoading = useSelector((state) => state.blogs.blogLoading);
  const likes = useSelector((state) => state?.blogs?.blogDetails?.likes);
  const relatedBlogs = useSelector((state) => state.blogs.relatedBlogs);
  const recentBlogs = useSelector((state) => state.blogs.recentBlogs);
  // const [comments, setComments] = useState([]);
  const [keywords, setKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const commentsData = useSelector((state) => state?.blogs?.comments);
  const currentUser = {
    currentUserId: user?.id,
    currentUserImg: user?.photoURL ? user?.photoURL : null,
    currentUserProfile: `/users/profile/${user?.id}`,
    currentUserFullName: user?.firstName + ' ' + user?.lastName,
  }
  const initials = (name) => name
    .split(' ')
    .map(name => name.charAt(0))
    .join('');
  const navigate = useNavigate();
  useEffect(() => {
    setLoading(true)
    localStorage.setItem('redirectUrl', window.location.pathname);
    if (id) {
      dispatch(getBlogDetails(id));
      dispatch(getRecentBlogs())
      dispatch(setBlogComments(id));
    }

    if (blog?.title) {
      dispatch(getRelatedBlogs(blog))

      // setComments(commentsData);
      const keys = [];
      keys.push(blog?.title);
      blog?.tags?.map((tag) => (
        keys.push(tag)
      ))
      keys.push(blog.postedBy?.displayName);
      setKeywords(keys.join(", "))
    }
    setLoading(false);
  },
    [id, user]);
   
  const handleLikes = () => {
    dispatch(handleLike(id))
  }
  const handleCommentSubmit = (data) => {
    dispatch(handleAddComment(id, data))
  }
  const handleReplySubmit = (data) => {
    dispatch(handleReplyComment(id, data))
  }
  const handleEdit = (data) => {
    dispatch(handleEditComment(id, data))

  };
  const handleDelete = (data) => {
    dispatch(handleDeleteComment(id, data))
  }
  return (
    <div className="blogs">
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
           },
        }}
      >{blog?.tags && blog?.tags.map((tag, index) => (
        <meta key={index} name="keywords" content={tag} />
      ))}
        <meta name="keywords" content={keywords} />
      </SuperSEO>
      {blogLoading ? <   ><Loading /></> :
        <>
          {
            blog ? <>
              <Container>
                {/* {JSON.stringify(blog)} */}
                <div className=" blog-single-content">
                  <Container>

                    <div  >

                      <Container>
                        <Row>
                          <Col md={16} sm={24} xs={24} lg={16} xl={16} style={{ marginTop: "20px" }}>
                            <FlexboxGrid justify="center">
                              <FlexboxGrid.Item colspan={24}>
                                <div className="card" >
                              <div className="blog-details-image">
                                    {
                                      blog?.imageUrl ? <img loading="lazy"  src={blog?.imageUrl} className="blogs-img" /> : null
                                    }</div>
                                </div>
                              </FlexboxGrid.Item>
                            </FlexboxGrid>
                            <FlexboxGrid style={{ marginTop: "20px" }} justify="space-between">
                              <FlexboxGrid.Item colspan={23}>
                                <Stack spacing={30}>
                                  <Stack.Item>
                                    <Text  size='xxl' style={{ fontFamily: 'Space Mono Regular' }}>{blog?.title}</Text>
                                  </Stack.Item>

                                </Stack>
                                <Stack wrap spacing={15} style={{ marginTop: "20px" }} justifyContent="flex-start" alignItems="center">
                                   
                                  <Stack.Item>
                                     
                                    <div> 
                                      <Stack spacing={15}>
                                        
                                      
                                    <FaUser />
                                    <Link to={`/profile/user/${blog?.postedBy?.id ? blog?.postedBy?.id : blog?.postedBy?.uid}`} className=" text-dark">
                                        {blog?.postedBy?.firstName + " " + blog?.postedBy?.lastName}
                                      </Link>
                                      </Stack>
                                    </div >

                                  </Stack.Item>
                                  
                                  <Stack.Item>
                                    <div>
                                    <Stack spacing={15}>
                                    <IoMdTime size={20}/>
                                    <Timestamp relative autoUpdate date={blog?.timestamp?.toDate().toString()} />
                                    </Stack>
                                    </div>
                                  </Stack.Item>
                                </Stack>
                                <Stack spacing={15} style={{ marginTop: "20px" }} justifyContent="flex-start" alignItems="center">
                                <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item>Blogs</Breadcrumb.Item>
            <Breadcrumb.Item>View</Breadcrumb.Item>
            <Breadcrumb.Item active>{id}</Breadcrumb.Item>
          </Breadcrumb>
          </Stack>
                              </FlexboxGrid.Item>
                            </FlexboxGrid>

                            <FlexboxGrid justify="flex-start">
                              <FlexboxGrid.Item colspan={23}>
                                <Stack justifyContent="flex-start" style={{ marginTop: '20px' }}>
                                  <Stack.Item>

                            <Panel>
                                      {blog?.content ? <>{parse(blog.content)}</> : null}
                                    </Panel>
                                  </Stack.Item>
                                </Stack>
                                <Stack justifyContent="flex-start" style={{ marginTop: '20px' }}>
                                  <Stack.Item>

                                    <div className="text-start mt-3">
                                      <Tags tags={blog?.tags} />
                                    </div>
                                  </Stack.Item>
                                </Stack>
                              </FlexboxGrid.Item>
                            </FlexboxGrid>

                            <div className="blog-detail-border-bottom"></div>
                            <div className="blog-detail-share-content">
                              <div>Enjoy this post? Give <span className="fw-bold">{blog?.postedBy?.firstName + " " + blog?.postedBy?.lastName}</span> a like if it's helpful.
                              </div>
                              <div className="blog-detail-margin-top">
                                <Like blogId={id} likes={likes} userId={userId} handleLikes={handleLikes} /> &nbsp;
                                <Whisper trigger="click"
                                  placement="bottom"
                                  speaker={
                                    <Popover arrow={false}>
                                      <Share shareUrl={window.location} title={blog?.title} image={blog?.imgUrl} />
                                    </Popover>}
                                >
                                  <Button>
                                    <Stack alignItems="center" justifyContent="center">
                                      <FaShareSquare size={24} /><span>&nbsp;SHARE</span>
                                    </Stack>
                                  </Button>
                                </Whisper>
                              </div>
                              <Container className="blog-detail-margin-top">
                                <Stack alignItems="center" justifyContent="center" spacing={20}>
                                  <AvatarGroup stack>
                                    {likes ?
                                      <>{
                                        likes
                                          .filter((user, i) => i < 10)
                                          .map(user => (
                                            <>
                                              {user?.photoURL ? (
                                                <Avatar src={user?.photoURL} key={user?.firstName + " " + user?.lastName} circle round={true} alt={user?.firstName + " " + user?.lastName} />

                                              ) : (
                                                <Avatar circle key={user?.firstName + " " + user?.lastName} alt={user?.firstName + " " + user?.lastName}>
                                                  {initials(user?.firstName + " " + user?.lastName)}
                                                </Avatar>
                                              )}

                                            </>
                                          ))}
                                        {
                                          likes.length > 10 ? <Avatar circle style={{ background: '#111' }}>
                                            + {likes.length - 10}
                                          </Avatar> : null
                                        } </>
                                      : null}
                                  </AvatarGroup>
                                </Stack>
                              </Container>
                            </div>

                            <br />
                            <CommentSection
                              currentUser={userId ? { ...currentUser } : null}
                              inputStyle={{ border: '1px solid red' }}
                              formStyle={{ backgroundColor: '#0F131A' }}
                              cancelBtnStyle={{
                                border: '1px solid gray',
                                backgroundColor: '#0F131A',
                                color: 'white',
                                padding: '7px 15px'
                              }}
                              hrStyle={{ border: '0.5px solid #01E9EA' }}
                              advancedInput={true}
                              replyInputStyle={{ borderBottom: '1px solid black', color: 'black' }}
                              onSubmitAction={handleCommentSubmit}
                              onReplyAction={handleReplySubmit}
                              // logs current comments data here
                              // currentData={(data) => {
                              //   console.log('current data', data)
                              // }}
                              onDeleteAction={handleDelete}
                              onEditAction={handleEdit}
                              logIn={{
                                loginLink: '/login',
                                signupLink: '/signup'
                              }}

                              key={id}
                              commentData={commentsData?.length > 0 ? commentsData : []}
                            />
                          </Col>
                          <Col md={6} sm={22} xs={22} lg={6} xl={6}>


                            <Tags title={"Tags"} tags={blog?.tags} />
                            <FeatureBlogs title={"Latest Posts"} blogs={recentBlogs} />
                          </Col>
                        </Row>
                      </Container>
                      <RelatedBlog id={id} blogs={recentBlogs} />
                    </div>
                  </Container>
                </div>
              </Container>

            </> : <>
            <>
      <FlexboxGrid align="center" justify="center">
        <FlexboxGrid.Item>
           <TbError404 size={300} />
        </FlexboxGrid.Item>
        
      </FlexboxGrid>
      <FlexboxGrid align="center" justify="center">
            
          <Text size='2rem'>
            Oops! Blog not found
          </Text>
          <Text size='xl' style={{marginTop: '20px'}}>
            Sorry, but the blog you are looking for is not found. Please, make sure you have typed the correct URL.
          </Text>
         
        </FlexboxGrid>
        <Stack spacing={20} alignItems="center" justifyContent="center" style={{marginTop: '20px'}}>
 
          <Button color="violet" appearance="primary" onClick={() => navigate("/")}>Go to Home</Button>
          <Button color="violet" appearance="primary" onClick={() => navigate("/blogs")}>View list of blogs</Button>

           </Stack>
        </></>
          }</>

      }
    </div>
  );
};

export default BlogDetails;
