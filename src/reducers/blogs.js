import { ADD_BLOG_FAILURE,     GET_TOTAL_BLOGS_LIST_REQUEST,
    GET_TOTAL_BLOGS_LIST_FAILURE,
    GET_TOTAL_BLOGS_LIST_SUCCESS,ADD_BLOG_REQUEST, ADD_BLOG_SUCCESS, ADD_COMMENT, ADD_LIKE, APPEND_BLOGS, BLOGS_LIMIT_SET, DELETE_BLOG_FAILURE, DELETE_BLOG_REQUEST, DELETE_BLOG_SUCCESS, EDIT_BLOG_FAILURE, EDIT_BLOG_REQUEST, EDIT_BLOG_SUCCESS, GET_BLOGS_FAILURE, GET_BLOGS_REQUEST, GET_BLOGS_SUCCESS, GET_BLOG_DETAILS_FAILURE, GET_BLOG_DETAILS_REQUEST, GET_BLOG_DETAILS_SUCCESS, GET_CURRENT_USER_DATA_FAILURE, GET_CURRENT_USER_DATA_SUCCESS, GET_SENT_TO_REVIEW_TOTAL_BLOGS_FAILURE, GET_SENT_TO_REVIEW_TOTAL_BLOGS_REQUEST, GET_SENT_TO_REVIEW_TOTAL_BLOGS_SUCCESS, GET_TOTAL_BLOGS_FAILURE, GET_TOTAL_BLOGS_REQUEST, GET_TOTAL_BLOGS_SUCCESS, HIDE_MORE_BUTTON, REMOVE_COMMENT, REMOVE_LIKE, SEARCH_BLOGS_FAILURE, SEARCH_BLOGS_REQUEST, SEARCH_BLOGS_SUCCESS, SET_BLOG_AUTHOR, SET_CATEGORIES, SET_CATEGORIES_FAILURE, SET_CATEGORIES_REQUEST, SET_CATEGORIES_SUCCESS, SET_COMMENTS, SET_RECENT_BLOGS, SET_RELATED_BLOGS, SET_TAGS, SET_TAGS_FAILURE, SET_TAGS_REQUEST, SET_TAGS_SUCCESS, TRENDING_BLOGS_FAILURE, TRENDING_BLOGS_REQUEST, TRENDING_BLOGS_SUCCESS } from "./types";

const INITIAL_STATE = {
    loading: false,
    limit: '',
    trendingBlogs: [],
    trendingBlogsError: '',
    totalBlogs: [
        {
            list: [],
            tags: [], count: 0
        }
    ],
    totalBlogsError: '',
    blogs: null,
    blogsError: '',
    hide_more_button: false,
    searchBlogs: [],
    blogDetails: [],
    blogDetailsError: null,
    blog: [],
    blogError: null,
    editBlog: [],
    editBlogError: null,
    deletedBlog: [],
    deletedBlogError: null,
    addLike: null,
    addComment: null,
    removeLike: null,
    removeComment: null,
    comments: [],
    relatedBlogs: [],
    recentBlogs: [],
    categoryBlogs: [],
    tagBlogs: [],
    searchLoading: false,
    totalreviewedBlogs: [],
    totalreviewedBlogsError: null,
    HeaderPageBlogs: [],
  currentPage: 1,
  noOfPages: null,
  count: null,
  loading: false,
  lastVisible: null,
  dashboardTags: {},
  categories: [],
  websiteTraffic: {},
  blogPerformance: {},
  userEngagement: {},
  salesAndConversions: {},
  loading: false,
  error: null
}
 

function blogReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case GET_TOTAL_BLOGS_LIST_REQUEST:
      return {
        ...state,
        blogsListLoading: true,
        blogsListError: null,
      };
    case GET_TOTAL_BLOGS_LIST_FAILURE:
      return {
        ...state,
        blogsListLoading: false,
        blogsListError: action.payload,
      };
    case GET_TOTAL_BLOGS_LIST_SUCCESS:
      return {
        ...state,
        blogsListLoading: false,
        blogsListData: action.payload,
      };
        case 'FETCH_BLOGS_DASHBOARD_DATA_TRAFFIC_SUMMARY_SUCCESS': 
        return{
          ...state,
          loading: false,
          blogsTraffic: action.payload
        }
        case 'GET_BLOGS_TO_DASHBOARD_REQUEST':
      return {
        ...state,
        dashboardBlogsLoading: true,
        error: null,
        
      };
    case 'GET_BLOGS_TO_DASHBOARD_SUCCESS':
      return {
        ...state,
        dashboardBlogsLoading: false,
        dashboardBlogs: action.payload,
      };
    case 'GET_BLOGS_TO_DASHBOARD_FAILURE':
      return {
        ...state,
        dashboardBlogsLoading: false,
        error: action.payload,
      };
      case 'GET_TOP_10_TAGS_TO_DASHBOARD_REQUEST':
        return {
          ...state,
          dashboardTagsLoading: true,
          error: null,
          dashboardTags: {}
          
        };
      case 'GET_TOP_10_TAGS_TO_DASHBOARD_SUCCESS':
        return {
          ...state,
          dashboardTagsLoading: false,
          dashboardTags: action.payload,
        };
      case 'GET_TOP_10_TAGS_TO_DASHBOARD_FAILURE':
        return {
          ...state,
          dashboardTagsLoading: false,
          error: action.payload,
          dashboardTags:{}
        };
        case 'FETCH_BLOGS_BY_TIME_RANGE_REQUEST':
      return {
        ...state,
        blogsByTimeRangeLoading: true,
        error: null,
        
      };
    case 'FETCH_BLOGS_BY_TIME_RANGE_SUCCESS':
      return {
        ...state,
        blogsByTimeRangeLoading: false,
        blogsByTimeRange: action.payload,
      };
    case 'FETCH_BLOGS_BY_TIME_RANGE_FAILURE':
      return {
        ...state,
        blogsByTimeRangeLoading: false,
        error: action.payload,
      };
        case 'FETCH_BLOGS_SUCCESS':
      return {
        ...state,
        HeaderPageBlogs: action.payload.blogs,
        count: action.payload.count,
        noOfPages: Math.ceil(action.payload.count / 10),
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'UPDATE_PAGE':
      return {
        ...state,
        currentPage: action.payload,
      };
      case 'SET_LAST_VISIBLE':  
      return {
        ...state,
        lastVisible: action.payload,
      };
        case SET_BLOG_AUTHOR:
            return {
                ...state,
                author: action.payload
            }
        case SET_TAGS_SUCCESS:
            return {
                ...state,
                loading: false,
                tagBlogs: action.payload
            }
        case SET_TAGS_REQUEST:
            return {
                ...state,
                loading: true,
                tagBlogs: []
            }
        case SET_TAGS_FAILURE:
            return {
                ...state,
                loading: false,
                tagBlogs: []
            }
        case SET_CATEGORIES_SUCCESS:
            return {
                ...state,
                loading: false,
                categoryBlogs: action.payload
            }
        case SET_CATEGORIES_REQUEST:
            return {
                ...state,
                loading: true,
                categoryBlogs: []
            }
        case SET_CATEGORIES_FAILURE:
            return {
                ...state,
                loading: false,
                categoryBlogs: []
            }
        case ADD_LIKE:
            const newLike = action.payload;

            return {
                ...state,
                loading: false,
                blogDetails: {
                    ...state.blogDetails,
                    likes: [...state.blogDetails.likes, newLike],
                },
            };
        case ADD_COMMENT:
            return {
                ...state,
                loading: false,
                comments: [...state.comments, action.payload]
            }
        case SET_COMMENTS:
            return {
                ...state,
                comments: action.payload,
            }
        case SET_RELATED_BLOGS:
            return {
                ...state,
                loading: false,
                relatedBlogs: action.payload
            }
        case 'BLOGS_FILE_UPLOAD_PROGRESS':
            return {
                ...state,
                progress: action.payload
            }
        case 'HANDLE_BLOGS_FILE_UPLOAD':
            return {
                ...state,
                imageUrl: action.payload
            }
        case 'HANDLE_BLOGS_FILE_REMOVE':
            return {
                ...state,
                imageUrl: null,
                progress: 0,
            }
        case SET_RECENT_BLOGS:
            return {
                ...state,
                loading: false,
                recentBlogs: action.payload
            }
        case REMOVE_LIKE:
            const likeToRemove = action.payload;

            return {
                ...state,
                loading: false,
                blogDetails: {
                    ...state.blogDetails,
                    likes: state.blogDetails.likes.filter(
                        (like) => like.uid !== likeToRemove.uid
                    ),
                },
            };
        case REMOVE_COMMENT:
            return {
                ...state,
                loading: false,

                removeComment: action.payload
            }
        case TRENDING_BLOGS_REQUEST:
            return {
                ...state,
                loading: true
            }
        case TRENDING_BLOGS_SUCCESS:
            return {
                ...state,
                loading: false,
                trendingBlogs: action.payload
            }
        case TRENDING_BLOGS_FAILURE:
            return {
                ...state,
                loading: false,
                trendingBlogsError: action.error
            }
        case GET_BLOGS_REQUEST:
            return {
                ...state,
            }
        case GET_BLOGS_SUCCESS:
            return {
                ...state,
                loading: false,
                blogs: action.payload
            }
        case GET_BLOGS_FAILURE:
            return {
                ...state,
                loading: false,
                blogsError: action.error
            }
        case ADD_BLOG_REQUEST:
            return {
                ...state,
                loading: true
            }
        case ADD_BLOG_SUCCESS:
            return {
                ...state,
                loading: false,
                blog: action.payload
            }
        case ADD_BLOG_FAILURE:
            return {
                ...state,
                loading: false,
                blogError: action.error
            }
        case DELETE_BLOG_REQUEST:
            return {
                ...state,
                loading: true
            }
        case DELETE_BLOG_SUCCESS:
            return {
                ...state, loading: false
            }
        case DELETE_BLOG_FAILURE:
            return {
                ...state,
                loading: false,
                deletedBlogError: action.error
            }
        case EDIT_BLOG_REQUEST:
            return {
                ...state,
                loading: true
            }
        case EDIT_BLOG_SUCCESS:
            return {
                ...state,
                loading: false,
                editBlog: action.payload
            }
        case EDIT_BLOG_FAILURE:
            return {
                ...state,
                loading: false,
                editBlogError: action.error
            }
        case SEARCH_BLOGS_REQUEST:
            return {
                ...state,
                searchBlogs: [],
                searchLoading: true
            }
        case SEARCH_BLOGS_SUCCESS:
            return {
                ...state,
                searchLoading: false,
                searchBlogs: action.payload
            }
        case SEARCH_BLOGS_FAILURE:
            return {
                ...state,
                searchLoading: false,
                searchBlogs: [],
                searchblogsError: action.error
            }
        case GET_TOTAL_BLOGS_REQUEST:
            return {
                ...state,
            }
        case GET_TOTAL_BLOGS_SUCCESS:
            return {
                ...state,
                totalBlogs: action.payload
            }
        case GET_TOTAL_BLOGS_FAILURE:
            return {
                ...state,
                totalreviewedBlogsError: action.error
            }
        case GET_SENT_TO_REVIEW_TOTAL_BLOGS_REQUEST:
            return {
                ...state,
                loading: true
            }
        case GET_SENT_TO_REVIEW_TOTAL_BLOGS_SUCCESS:
            return {
                ...state,
                loading: false,
                totalreviewedBlogs: action.payload
            }
        case GET_SENT_TO_REVIEW_TOTAL_BLOGS_FAILURE:
            return {
                ...state,
                loading: false,
                totalBlogsError: action.error
            }
         
        case APPEND_BLOGS:
            state = { ...state, loading: false, blogs: [...state.blogs, ...action.payload] };
            return state;
        case GET_BLOG_DETAILS_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case GET_BLOG_DETAILS_SUCCESS:
            return {
                ...state,
                loading: false,
                blogDetails: action.payload
            }
        case GET_BLOG_DETAILS_FAILURE:
            return {
                ...state,
                loading: false,
                blogDetailsError: action.error
            }
        case 'GET_BLOGS_COUNT_REQUEST':
            return {
                ...state,
                loading: true,
                blogsCount: '-',
            }
        case 'GET_BLOGS_COUNT_SUCCESS':
            return {
                ...state,
                loading: false,
                blogsCount: action.payload
            }
        case 'GET_BLOGS_COUNT_FAILURE':
            return {
                ...state,
                loading: false,
                blogsCount: '-',
                blogCountError: action.error
            }
        case 'GET_PENDING_BLOGS_COUNT_REQUEST':
            return {
                ...state,
                loading: true,
                pendingBlogsCount: '-',
            }
        case 'GET_PENDING_BLOGS_COUNT_SUCCESS':
            return {
                ...state,
                loading: false,
                pendingBlogsCount: action.payload
            }
        case 'GET_PENDING_BLOGS_COUNT_FAILURE':
            return {
                ...state,
                loading: false,
                pendingBlogsCount: '-',
                pendingBlogCountError: action.error
            }
            case 'GET_LAST_WEEK_POSTED_BLOGS_COUNT_REQUEST':
                return {
                    ...state,
                    loading: true,
                    lastWeekPostedBlogsCount: '-',
                }
            case 'GET_LAST_WEEK_POSTED_BLOGS_COUNT_SUCCESS':
                return {
                    ...state,
                    loading: false,
                    lastWeekPostedBlogsCount: action.payload
                }
            case 'GET_LAST_WEEK_POSTED_BLOGS_COUNT_FAILURE':
                return {
                    ...state,
                    loading: false,
                    lastWeekPostedBlogsCount: '-',
                    lastWeekPostedBlogCountError: action.error
                }
    
        case 'ADD_CATEGORY_REQUEST':
            return {
                ...state,
                categoryAddLoading: true,
                error: null,
            };
        case 'ADD_CATEGORY_SUCCESS':
            return {
                ...state,
                categoryAddLoading: false,
                categories: [...state.categories, action.payload],
            };
        case 'ADD_CATEGORY_FAILURE':
            return {
                ...state,
                categoryAddLoading: false,
                error: action.payload,
            };
        case 'REMOVE_CATEGORY_REQUEST':
            return {
                ...state,
                categoryRemoveLoading: true,
                error: null,
            };
        case 'REMOVE_CATEGORY_SUCCESS':
            return {
                ...state,
                categoryRemoveLoading: false,
                categories: state.categories.filter((category) => category.value !== action.payload.value),
            };
        case 'REMOVE_CATEGORY_FAILURE':
            return {
                ...state,
                categoryRemoveLoading: false,
                error: action.payload,
            };
        case 'GET_CATEGORIES_DATA_REQUEST':
            return {
                ...state,
                getCategoryDataLoading: true,
                error: null,
            };
        case 'GET_CATEGORIES_DATA_SUCCESS':
            return {
                ...state,
                getCategoryDataLoading: false,
                categories: action.payload,
            };
        case 'GET_CATEGORIES_DATA_FAILURE':
            return {
                ...state,
                getCategoryDataLoading: false,
                error: action.payload,
            };
        default:
            return {
                ...state
            }
    }
}

export default blogReducer;