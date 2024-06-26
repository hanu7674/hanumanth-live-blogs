import * as types from './types';
 
  const initialState = {
    loadingFetch: true,
    securityQuestionsVerified: false,
    securityQuestionsVerificationCount: 0,
    isEmailVerified: false,
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: false,
    user: null,
    error: null,
    users: [],
    currentPasswordVerified: false,
    userData: null,
    ipData: [],
    userStatus: {
      loading: true,
      status: null,
      account_status: null
    },
    review: {
      data: null,
      loading: false,
      error: null,
    },
    testimonial: {
      data: null,
      loading: false,
      error: null,
    },
    isReviewSubmitted: false,
    isTestimonialSubmitted: false,
    viewCountCityArray: [],
     viewCountContinentArray: [],
      viewCountCountryArray: [],
      activeUsers: [],
      inActiveUsers: [],
      securityQuestionsStatusChangeLoading: false,
      contactUsFormStatus: false,
      contactUsFormStatusLoading: false,
       educationList: [],
      projectList: [],
  addProjectLoading: false,
  addProjectError: null,
  getProjectListLoading: false,
  getProjectListError: null,
  projectsList: [],
  certifications: [],
  certificationsLoading: false,
  certificationsError: null,
status: null,
appStatusLoading: false,
appStatusError: null,
appStatus: '',
  };
  
  export const authReducer = (state = initialState, action) => {
    const { type, payload } = action;
  

    switch (type) {
case types.FETCH_STATUS_REQUEST:
      return {
        ...state,
    appStatusLoading: true,
    appStatusError: null,
      };
case types.FETCH_STATUS_SUCCESS:
      return {
        ...state,
appStatus: action.payload,
appStatusLoading: false,
      };
case types.FETCH_STATUS_FAILURE:
      return {
        ...state,
appStatusLoading: false,
    appStatusError: action.payload,
      };
      case types.GET_CERTIFICATION_LIST_REQUEST:
        return {
          ...state,
          certificationsLoading: true
        };
      case types.GET_CERTIFICATION_LIST_SUCCESS:
        return {
          ...state,
          certifications: action.payload,
          certificationsLoading: false
        };
      case types.GET_CERTIFICATION_LIST_FAILURE:
        return {
          ...state,
          certificationsError: action.payload,
          certificationsLoading: false
        };
      case types.ADD_CERTIFICATION_REQUEST:
    case types.UPDATE_CERTIFICATION_REQUEST:
    case types.DELETE_CERTIFICATION_REQUEST:
      return {
        ...state,
        certificationsLoading: true,
      };
    case types.ADD_CERTIFICATION_SUCCESS:
      return {
        ...state,
        certifications: [...state.certifications, action.payload],
        certificationsLoading: false
      };
    case types.UPDATE_CERTIFICATION_SUCCESS:
      return {
        ...state,
        certifications: state.certifications.map(cert =>
          cert.id === action.payload.id ? action.payload : cert
        ),
        certificationsLoading: false
      };
    case types.DELETE_CERTIFICATION_SUCCESS:
      return {
        ...state,
        certifications: state.certifications.filter(cert => cert.id !== action.payload),
        certificationsLoading: false
      };
    case types.ADD_CERTIFICATION_FAILURE:
    case types.UPDATE_CERTIFICATION_FAILURE:
    case types.DELETE_CERTIFICATION_FAILURE:
      return {
        ...state,
        certificationsError: action.payload,
        certificationsLoading: false
      };
      case 'ADD_EXPERIENCE_REQUEST':
        return { ...state,addExperienceStatus: false, addExperienceLoading: true, addExperienceError: null };
      case 'ADD_EXPERIENCE_SUCCESS':
        return { ...state, addExperienceStatus:true, addExperienceLoading: false, experienceList: [...state.experienceList, action.payload] };
      case 'ADD_EXPERIENCE_FAILURE':
        return { ...state,addExperienceStatus:false, addExperienceLoading: false, addExperienceError: action.error };
      case 'GET_EXPERIENCE_LIST_REQUEST':
        return { ...state, getExperienceListLoading: true, getExperienceListError: null };
      case 'GET_EXPERIENCE_LIST_SUCCESS':
        return { ...state, getExperienceListLoading: false, experienceList: action.payload };
      case 'GET_EXPERIENCE_LIST_FAILURE':
        return { ...state, getExperienceListLoading: false, getExperienceListError: action.error };
        case 'EDIT_EXPERIENCE_START':
          return {
            ...state,
            editExperienceStatus: false,
            editExperienceLoading: true,
          };
          case "EDIT_EXPERIENCE_SUCCESS":
            return {
              ...state,
              editExperienceLoading: false,
              editExperienceStatus: true,
              experienceList: state.experienceList.map(exp =>
                exp.id === action.payload.id ? action.payload : exp
              ),
             };
          case 'EDIT_EXPERIENCE_FAILURE':
            return {
              ...state,
              editExperienceStatus: false,
              editExperienceLoading: false,
              editExperienceError: action.payload,
            };
          case "DELETE_EXPERIENCE_SUCCESS": 
          const deletedExperienceId = action.payload;
          return{
            ...state,
            experienceList: state.experienceList.filter(
              (exp) => exp.id !== deletedExperienceId
            ),      }
      case 'ADD_PROJECT_REQUEST':
        return { ...state,addProjectStatus: false, addProjectLoading: true, addProjectError: null };
      case 'ADD_PROJECT_SUCCESS':
        return { ...state, addProjectStatus:true, addProjectLoading: false, projectList: [...state.projectList, action.payload] };
      case 'ADD_PROJECT_FAILURE':
        return { ...state,addProjectStatus:false, addProjectLoading: false, addProjectError: action.error };
      case 'GET_PROJECT_LIST_REQUEST':
        return { ...state, getProjectListLoading: true, getProjectListError: null };
      case 'GET_PROJECT_LIST_SUCCESS':
        return { ...state, getProjectListLoading: false, projectList: action.payload };
      case 'GET_PROJECT_LIST_FAILURE':
        return { ...state, getProjectListLoading: false, getProjectListError: action.error };
        case 'EDIT_PROJECT_START':
          return {
            ...state,
            editProjectStatus: false,
            editProjectLoading: true,
          };
          case "EDIT_PROJECT_SUCCESS":
            return {
              ...state,
              editProjectLoading: false,
              editProjectStatus: true,
              projectList: state.projectList.map(pro =>
                pro.id === action.payload.id ? action.payload : pro
              ),
             };
          case 'EDIT_PROJECT_FAILURE':
            return {
              ...state,
              editProjectStatus: false,
              editProjectLoading: false,
              editProjectError: action.payload,
            };
          case "DELETE_PROJECT_SUCCESS": 
          const deletedProjectId = action.payload;
          return{
            ...state,
            projectList: state.projectList.filter(
              (project) => project.id !== deletedProjectId
            ),      }
      case 'GET_EDUCATION_LIST_REQUEST': 
      return {
        ...state,
        educationListLoading: true,
        educationList: [],
      }
      case 'GET_EDUCATION_LIST_SUCCESS': 
      return {
        ...state,
        educationListLoading: false,
        educationList: action.payload

      }
      case 'GET_EDUCATION_LIST_FAILURE': 
      return {
        ...state,
        educationListLoading: false,
        educationList: [],
      }
      
      case 'HANDLE_PROFILE_FILE_REMOVE': 
        return{
          ...state,
          profileFileUrl: null,
          fileUploadProgress: 0,
        }
      case 'HANDLE_PROFILE_FILE_UPLOAD': 
        return{
          ...state,
          profileFileUrl: action.payload,
        }
        case types.ADD_EDUCATION_START:
      return {
        ...state,
        addEducationStatus: false,
        addEducationLoading: true,
      };
    case types.ADD_EDUCATION_SUCCESS:
      return {
        ...state,
        addEducationLoading: false,
        addEducationStatus: true,
        educationList: [...state.educationList, action.payload],
      };
    case types.ADD_EDUCATION_FAILURE:
      return {
        ...state,
        addEducationStatus: false,
        addEducationLoading: false,
        addEducationError: action.payload,
      };
      case types.EDIT_EDUCATION_START:
      return {
        ...state,
        editEducationStatus: false,
        editEducationLoading: true,
      };
      case types.EDIT_EDUCATION_SUCCESS:
        return {
          ...state,
          editEducationLoading: false,
          editEducationStatus: true,
          educationList: state.educationList.map(edu =>
            edu.id === action.payload.id ? action.payload : edu
          ),
         };
      case types.EDIT_EDUCATION_FAILURE:
        return {
          ...state,
          editEducationStatus: false,
          editEducationLoading: false,
          editEducationError: action.payload,
        };
      case "DELETE_EDUCATION_SUCCESS": 
      const deletedEducationId = action.payload;
      return{
        ...state,
        educationList: state.educationList.filter(
          (education) => education.id !== deletedEducationId
        ),      }
      case 'SUBMIT_CONTACT_US_FORM_REQUEST': 
      return {
        ...state,
        contactUsFormStatusLoading: true,
      }
      case 'SUBMIT_CONTACT_US_FORM_FAILURE': 
      return {
        ...state,
        contactUsFormStatusLoading: false,
      }
      case 'SUBMIT_CONTACT_US_FORM_SUCCESS': 
      return {
        ...state,
        contactUsFormStatus: true,
        contactUsFormData: action.payload,
        contactUsFormStatusLoading: false
      }
      case 'GET_USERS_LOGIN_LOGS_REQUEST':
      return {
        ...state,
        logsLoading: true,
        logsError: null,
      };
      case 'USER_ACCOUNT_LOGIN_LOGS_SUCCESS':
      return {
        ...state,
        loginLogs: action.payload,
 
      };

    case 'GET_USERS_LOGIN_LOGS_SUCCESS':
      return {
        ...state,
        userLogs: action.payload,
        logsLoading: false,
        logsError: null,
 
      };

    case 'GET_USERS_LOGIN_LOGS_FAILURE':
      return {
        ...state,
        logsLoading: false,
        logsError: action.payload,
      };
      case 'SECURITY_QUESTIONS_STATUS_CHANGE_REQUEST': 
      return{
        ...state,
        securityQuestionsStatusChangeLoading: true,
        securityQuestionsStatusChangeError: null,
      }
      case 'SECURITY_QUESTIONS_STATUS_CHANGE_SUCCESS': 
      return{
        ...state,
        userSecurityQuestionEnabled: action.payload,
        securityQuestionsStatusChangeLoading: false,
        securityQuestionsStatusChangeError: null
      }
      case 'SECURITY_QUESTIONS_STATUS_CHANGE_FAILURE': 
      return{
        ...state,
        securityQuestionsStatusChangeLoading: false,
         securityQuestionsStatusChangeError: action.payload
      }
      case 'SECURITY_QUESTIONS_VERIFICATION_REQUEST': 
      return{
        ...state,
        securityQuestionsVerificationLoading: true,
        securityQuestionsVerificationError: null,
      }
      case 'SECURITY_QUESTIONS_VERIFICATION_SUCCESS': 
      return{
        ...state,
        securityQuestionsVerified: true,
        securityQuestionsVerificationLoading: false,
        securityQuestionsVerificationError: null
      }
      case 'SECURITY_QUESTIONS_VERIFICATION_FAILURE': 
      return{
        ...state,
        securityQuestionsVerificationLoading: false,
        securityQuestionsVerificationCount: state.securityQuestionsVerificationCount + 1,
        securityQuestionsVerificationError: action.payload
      }
      case 'FETCH_SECURITY_QUESTIONS_REQUEST':
      return {
        ...state,
        loadingFetch: true,
        errorFetch: null
      };
    case 'UPDATE_SECURITY_QUESTIONS_REQUEST':
      return {
        ...state,
        loadingUpdateSecurityQuestions: true,
        errorUpdate: null
      };
    case 'FETCH_SECURITY_QUESTIONS_SUCCESS':
      return {
        ...state,
        securityQuestions: action.payload,
        loadingFetch: false,
        errorFetch: null
      };
    case 'UPDATE_SECURITY_QUESTIONS_SUCCESS':
      return {
        ...state,
        loadingUpdateSecurityQuestions: false,
        errorUpdate: null
      };
    case 'FETCH_SECURITY_QUESTIONS_FAILURE':
      return {
        ...state,
        loadingFetch: false,
        errorFetch: action.payload
      };
    case 'UPDATE_SECURITY_QUESTIONS_FAILURE':
      return {
        ...state,
        loadingUpdateSecurityQuestions: false,
        errorUpdate: action.payload
      };
      case "SET_EMAIL_VERIFIED":
      return {
        ...state,
        isEmailVerified: action.payload,
      };
      case 'FETCH_REVIEWS_LIST_REQUEST': 
      return{
        ...state,
        reviewsListLoading: true,
        reviewsListError: null,
      }
      case 'FETCH_REVIEWS_LIST_SUCCESS': 
      return{
        ...state,
        reviewsList: action.payload,
        reviewsListLoading: false,
        reviewsListError: null
      }
      case 'FETCH_REVIEWS_LIST_FAILURE': 
      return{
        ...state,
        reviewsListLoading: false,
        reviewsListError: action.payload
      }
      case 'FETCH_TESTIMONIALS_LIST_REQUEST': 
      return{
        ...state,
        testimonialsListLoading: true,
        testimonialsListError: null,
      }
      case 'FETCH_TESTIMONIALS_LIST_SUCCESS': 
      return{
        ...state,
        testimonialsList: action.payload,
        testimonialsListLoading: false,
        testimonialsListError: null
      }
      case 'FETCH_TESTIMONIALS_LIST_FAILURE': 
      return{
        ...state,
        testimonialsListLoading: false,
        testimonialsListError: action.payload,
      }
      case 'FETCH_REVIEWS_DASHBOARD_REQUEST':
      return {
        ...state,
        reviewsloading: true,
        reviewserror: null,
      };

    case 'FETCH_REVIEWS_DASHBOARD_SUCCESS':
      return {
        ...state,
        totalReviewsCount: action.payload.totalReviewsCount,
        reviewsbarChartData: action.payload.reviews,
        viewCountCityArray: action.payload.viewCountCityArray,
         viewCountContinentArray: action.payload.viewCountContinentArray,
         viewCountCountryArray: action.payload.viewCountCountryArray,
        reviewsloading: false,
        reviewserror: null,
      };

    case 'FETCH_REVIEWS_DASHBOARD_FAILURE':
      return {
        ...state,
        reviewsloading: false,
        reviewserror: action.payload,
      };
      case 'FETCH_TESTIMONIALS_DASHBOARD_REQUEST':
      return {
        ...state,
        testimonialsloading: true,
        testimonialserror: null,
      };

    case 'FETCH_TESTIMONIALS_DASHBOARD_SUCCESS':
      return {
        ...state,
        totalTestimonialsCount: action.payload.totalTestimonialsCount,
        testimonialsbarChartData: action.payload.testimonials,
        testimonialsloading: false,
        viewCountCityArray: action.payload.viewCountCityArray,
        viewCountContinentArray: action.payload.viewCountContinentArray,
        viewCountCountryArray: action.payload.viewCountCountryArray,
        testimonialserror: null,
      };

    case 'FETCH_TESTIMONIALS_DASHBOARD_FAILURE':
      return {
        ...state,
        testimonialsloading: false,
        testimonialserror: action.payload,
      };
      case 'CHECK_REVIEW_SUBMITTED':
      return {
        ...state,
        isReviewSubmitted: action.payload.isReviewSubmitted,
        review: action.payload.review
      };

    case 'CHECK_TESTIMONIAL_SUBMITTED':
      return {
        ...state,
        isTestimonialSubmitted: action.payload.isTestimonialSubmitted,
        testimonial: action.payload.testimonial
      };

      case 'ADD_REVIEW_REQUEST':
      return {
        ...state,
        loading: true,
        error: null,
      };

    case 'ADD_REVIEW_SUCCESS':
      return {
        ...state,
        data: action.payload.data,
        loading: false,
        error: null,
        isReviewSubmitted: action.payload.isReviewSubmitted,

      };

    case 'ADD_REVIEW_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
      case 'ADD_TESTIMONIAL_REQUEST':
      return {
        ...state,
        loading: true,
        error: null,
      };

    case 'ADD_TESTIMONIAL_SUCCESS':
      return {
        ...state,
        data: action.payload.data,
        loading: false,
        error: null,
        isTestimonialSubmitted: action.payload.isTestimonialSubmitted,
      };

    case 'ADD_TESTIMONIAL_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
      case types.FETCH_TICKETS_DASHBOARD_HEADER_DATA_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case types.FETCH_TICKETS_DASHBOARD_HEADER_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        ticketsHeaderData: action.payload,
      };
    case types.FETCH_TICKETS_DASHBOARD_HEADER_DATA_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
      case types.SUBMIT_FORM_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case types.SUBMIT_FORM_SUCCESS:
      return {
        ...state,
        loading: false,
        supportFormInfo: action.payload,
      };
    case types.SUBMIT_FORM_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
      case 'SET_USER_STATUS_REQUEST': 
        return{
          ...state,
          userStatus: {loading: true,
            status: null,
            account_status: null}
        }
      case 'SET_USER_STATUS_FAILURE': 
        return{
          ...state,
          userStatus: {loading: false,
            status: null,
            account_status: null}
        }
      case 'SET_USER_STATUS_SUCCESS':
        return {
          ...state,
          
          userStatus: action.payload
        }
      case 'GET_USERS_META_DATA_SUCCESS':
        return{ 
          ...state,
          usersMetaData: action.payload,
          loading: false
        }
      case 'STORE_TRAFFIC_SUCCESS':
        return{
          ...state,
          ip: action.payload
        }
        case 'GET_IP_AND_LOCATION_SUCCESS':
          return {
            ...state,
            ipData: action.payload
          }
      case 'GET_IP_AND_LOCATION_REQUEST':
      case 'STORE_TRAFFIC_REQUEST':
      case 'GET_USERS_META_DATA_REQUEST':
        return{
          ...state,
          loading: true,
        }
      case 'STORE_TRAFFIC_FAILURE':
      case 'GET_IP_AND_LOCATION_FAILURE':
      case 'GET_USERS_META_DATA_FAILURE':
        return{
          ...state,
          loading: false,
          error: action.payload
        }
        case 'GET_REGISTERED_USERS_SUCCESS':
          return{ 
            ...state,
            registeredUsers: action.payload,
            loading: false
          }
        case 'GET_REGISTERED_USERS_REQUEST':
          return{
            ...state,
            loading: true,
          }
        
        case 'GET_REGISTERED_USERS_FAILURE':
          return{
            ...state,
            loading: false,
            error: action.payload
          }
          case 'GET_REJECTED_USERS_SUCCESS':
          return{ 
            ...state,
            rejectedUsers: action.payload,
            loading: false
          }
        case 'GET_REJECTED_USERS_REQUEST':
          return{
            ...state,
            loading: true,
          }
        case 'GET_REJECTED_USERS_FAILURE':
          return{
            ...state,
            loading: false,
            error: action.payload
          }
          case 'GET_APPROVED_USERS_SUCCESS':
          return{ 
            ...state,
            approvedUsers: action.payload,
            loading: false
          }
        case 'GET_APPROVED_USERS_REQUEST':
          return{
            ...state,
            loading: true,
          }
        case 'GET_APPROVED_USERS_FAILURE':
          return{
            ...state,
            loading: false,
            error: action.payload
          }
          case 'GET_ACTIVE_USERS_SUCCESS':
          return{ 
            ...state,
            activeUsers: action.payload,
            loading: false
          }
        case 'GET_ACTIVE_USERS_REQUEST':
          return{
            ...state,
            loading: true,
          }
        case 'GET_ACTIVE_USERS_FAILURE':
          return{
            ...state,
            loading: false,
            error: action.payload
          }
          case 'GET_INACTIVE_USERS_SUCCESS':
            return{ 
              ...state,
              inActiveUsers: action.payload,
              loading: false
            }
          case 'GET_INACTIVE_USERS_REQUEST':
            return{
              ...state,
              loading: true,
            }
          case 'GET_INACTIVE_USERS_FAILURE':
            return{
              ...state,
              loading: false,
              error: action.payload
            }
            case 'SET_ACCOUNT_STATUS_CHANGE_SUCCESS':
const {  uid, status } = action.payload;

      // Remove the user from both active and inactive lists
      const updatedActiveUsers = state.activeUsers.filter(user => user.id !== uid);
      const updatedInactiveUsers = state.inActiveUsers.filter(user => user.id !== uid);

      // Update the user with the new status
      const updatedUser = { uid, status };

      // Determine the target list based on the status
      const targetList = status ? 'activeUsers' : 'inActiveUsers';

      return {
        ...state,
        [targetList]: [...state[targetList], updatedUser],
        activeUsers: updatedActiveUsers,
        inActiveUsers: updatedInactiveUsers,
      };

      case 'GET_USER_DATA_BY_ID_REQUEST':
        return {
          ...state,
          userDataloading: true,
          userData: null,
          userDataerror: null,
        } 
        case 'GET_USER_DATA_BY_ID_SUCCESS':
        return {
          ...state,
          userDataloading: false,
          userData: action.payload,
          userDataerror: null
        }
        case 'GET_SELECTED_USERS_FOR_CALENDAR_SUCCESS':
          return{
            ...state,
            selectedUsersOnEvent: action.payload
          }
        case 'GET_USER_DATA_BY_ID_FAILURE':
        return {
          ...state,
          userDataloading: false,
          userDataerror: action.payload,
          userData: null
        }
      case 'GET_USERS_REQUEST':
      return {
        ...state,
        loading: true,
        users: null,
      };
      case 'GET_ADMIN_USERS_REQUEST':
      return {
        ...state,
        loading: true,
        adminUsers: null,
      };
      case 'GET_PUBLISHERS_USERS_REQUEST':
      return {
        ...state,
        loading: true,
        publishers: null,
      };
      case 'GET_PUBLISHERS_USERS_COUNT_REQUEST':
      return {
        ...state,
        loading: true,
        publishersCount: '-',
      };
      case 'VERIFY_CURRENT_USER_PASSWORD':
        return{
          ...state,
          currentPasswordVerified: action.payload
        };
        case 'CLEAR_VERIFY_CURRENT_USER_PASSWORD':
        return{
          ...state,
          currentPasswordVerified: null
        };

      case 'UPDATE_PASSWORD_SUCCESS':
        return {
          ...state,
          currentPasswordVerifiedStatus: action.payload
        }
    case 'GET_USERS_SUCCESS':
      return {
        ...state,
        loading: false,
        users: action.payload,
      };
    case 'GET_USERS_FAILURE':
      return {
        ...state,
        users: null,
        loading: false,
        error: action.payload,
      };
      case 'GET_ADMIN_USERS_SUCCESS':
      return {
        ...state,
        loading: false,
        adminUsers: action.payload,
      };
    case 'GET_ADMIN_USERS_FAILURE':
      return {
        ...state,
        adminUsers: null,
        error: action.payload,
      };
      case 'GET_PUBLISHERS_USERS_SUCCESS':
      return {
        ...state,
        loading: false,
        publishers: action.payload,
      };
    case 'GET_PUBLISHERS_USERS_FAILURE':
      return {
        ...state,
        publishers: null,
        error: action.payload,
      };
      case 'GET_PUBLISHERS_USERS_COUNT_SUCCESS':
      return {
        ...state,
        loading: false,
        publishersCount: action.payload,
      };
    case 'GET_PUBLISHERS_USERS_COUNT_FAILURE':
      return {
        ...state,
        publishersCount: '-',
        error: action.payload,
      };
      case types.SIGNUP_REQUEST:
          return{
            ...state,
            loading: true
          };
      case types.SIGNUP_FAILURE:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: action.payload,
      };
      case types.SIGNUP_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
      };
      case types.GET_CURRENT_USER_DATA_REQUEST:
      return {
        ...state,
        loading: true,
      };
      case types.GET_CURRENT_USER_DATA_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

      case 'FILE_UPLOAD_PROGRESS':
        return {
          ...state,
          progress: action.payload
        }
        case 'PROFILE_FILE_UPLOAD_PROGRESS': 
        return {
          ...state,
          fileUploadProgress: action.payload
        }
      case 'PROFILE_IMAGE_CHANGE':
        return {
          ...state,
          profileUrl : action.payload
        }
      case types.GET_CURRENT_USER_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload
      };
      case types.LOGIN_SUCCESS:

        localStorage.setItem('token', payload.token);
        return {
          ...state,
          isAuthenticated: true,
          loading: false
        };
      case types.LOGIN_FAIL:
        localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: action.payload,
      };
      case types.LOGOUT:
        localStorage.removeItem('token');
        return {
          token: null,
          isAuthenticated: false,
          loading: false,
          user: null
        };
        case types.SENT_EMAIL_VERIFICATION_REQUEST:
          return{
            ...state,
            isEmailVerificationSent: false,
            loading: true,
          }
        case types.SENT_EMAIL_VERIFICATION_SUCCESS:
          return{
          ...state,
          isEmailVerificationSent: true,
          loading: false
  
        }
        case types.SENT_EMAIL_VERIFICATION_FAILURE:
          return{
            ...state,
            isEmailVerificationSent: false,
            loading: false,
            error: action.payload,
          }
          case types.SEND_PASSWORD_RESET_EMAIL_REQUEST:
          return{
            ...state,
            isResetEmailSent: false,
            loading: true,
          }
        case types.SEND_PASSWORD_RESET_EMAIL_SUCCESS:
          return{
          ...state,
          isResetEmailSent: true,
          loading: false
        }
        case types.SEND_PASSWORD_RESET_EMAIL_FAILURE:
          return{
            ...state,
            isResetEmailSent: false,
            loading: false,
            error: action.payload,
          }

        default:
            return state;
    }
  }