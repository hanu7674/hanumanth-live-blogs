import React, { lazy, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { appNavs, authorNavs, profileNavs, profileNavsUser } from "../NavConfig";
import { useDispatch, useSelector } from "react-redux";
import ProductionDown from "../../assets/ProductionDown";
import MaintenanceMode from "../../assets/MaintenanceMode";
import { fetchStatus } from "../../redux/auth";
import ManageAppStatus from "../../pages/Admin/AppStatus";
import BlogsAuthorsUsersForms from "../../pages/Admin/BlogAuthors";
import AuthorFrame from "../../pages/Author/AuthorFrame";
import AuthorDashboard from "../../pages/Author/Dashboard";
import ChatsPage from "../../pages/Chats";

// Lazy load components
const HomePage = lazy(() => import("../../pages/Home"));
const AboutPage = lazy(() => import("../../pages/AboutUs"));
const ContactUsPage = lazy(() => import("../../pages/contactUs"));
const LoginPage = lazy(() => import("../../pages/Auth/Login"));
const SignUpPage = lazy(() => import("../../pages/Auth/SignUp"));
const ForgotPassword = lazy(() => import("../../pages/Auth/ForgotPassword"));
const Frame = lazy(() => import("../../pages/Admin/Frame"));
const MembersPage = lazy(() => import("../../pages/Admin/tables/members"));
const VirtualizedTablePage = lazy(() => import("../../pages/Admin/tables/virtualized"));
const DashBoardPage = lazy(() => import("../../pages/Admin/dashboard"));
const FormBasicPage = lazy(() => import("../../pages/Admin/forms/basic"));
const WizardFormPage = lazy(() => import("../../pages/Admin/forms/wizard"));
const FormsPage = lazy(() => import("../../pages/Admin/forms/forms"));
const SignInPage = lazy(() => import("../../pages/Admin/authentication/sign-in"));
const Error403 = lazy(() => import("../../pages/Admin/authentication/403"));
const Error404 = lazy(() => import("../../pages/Admin/authentication/404"));
const Error500 = lazy(() => import("../../pages/Admin/authentication/500"));
const Error503 = lazy(() => import("../../pages/Admin/authentication/503"));
const SignUpPageAdmin = lazy(() => import("../../pages/Admin/authentication/sign-up"));
const AppliedSignInPage = lazy(() => import("../../pages/Admin/authentication/signin"));
const AppliedSignUpPage = lazy(() => import("../../pages/Admin/authentication/signup"));
const PersonalInformationPage = lazy(() => import("../../pages/Profile/Personal"));
const PersonalAccountSettingsPage = lazy(() => import("../../pages/Profile/Account"));
const AdminFrame = lazy(() => import("../../pages/Admin/AdminFrame"));
const UserPersonalInformationPage = lazy(() => import("../../pages/Profile/UserPersonal"));
const Error403Component = lazy(() => import("../../pages/Admin/authentication/403/Error403"));
const AdminUsersForms = lazy(() => import("../../pages/Admin/AdminUsers"));
const RegisteredUsers = lazy(() => import("../../pages/Admin/RegisteredUsers"));
const RejectedUsers = lazy(() => import("../../pages/Admin/RejectedUsers"));
const ApprovedUsers = lazy(() => import("../../pages/Admin/ApprovedUsers"));
const ActiveUsers = lazy(() => import("../../pages/Admin/ActiveUsers"));
const InActiveUsers = lazy(() => import("../../pages/Admin/InActiveUsers"));
const InactiveUserPage = lazy(() => import("../../pages/Auth/StatusPage"));
const AddTicketsComponentPage = lazy(() => import("../../pages/Admin/Tickets/AddTickets"));
const ViewTicketsComponentPage = lazy(() => import("../../pages/Admin/Tickets/ViewTickets"));
const TicketsDashboardPage = lazy(() => import("../../pages/Admin/Tickets/Dashboard"));
const ViewTicketComponentPage = lazy(() => import("../../pages/Admin/Tickets/ViewTicket"));
const UsersDashboardPage = lazy(() => import("../../pages/Admin/users"));
const TestimonialFormPage = lazy(() => import("../../pages/Admin/forms/Testimonials"));
const ReviewForm = lazy(() => import("../../pages/Admin/forms/Reviews/form"));
const Reviews = lazy(() => import("../../pages/Admin/forms/Reviews"));
const ReviewsListPage = lazy(() => import("../../pages/Admin/Reviews/list/index"));
const TestimonialsListPage = lazy(() => import("../../pages/Admin/Testimonials/list/index"));
const ReviewsDashboardPage = lazy(() => import("../../pages/Admin/Reviews/dashboard/index"));
const TestimonialsDashboardPage = lazy(() => import("../../pages/Admin/Testimonials/dashboard/index"));
const CalendarDashboardPage = lazy(() => import("../../pages/Admin/Calendar/dashboard/index"));
 const CalenderPage = lazy(() => import("../../pages/Admin/Calendar"));
const TotalUsersList = lazy(() => import("../../pages/Admin/Users-list"));
const Notifications = lazy(() => import("../../pages/Admin/Notifications"));
const AdminCarouselComponent = lazy(() => import("../../pages/Admin/Carousel"));
const FooterPage = lazy(() => import("../../pages/Footer"));
const ViewCarouselItemsPage = lazy(() => import("../../pages/Admin/Carousel/ViewCarouselItems"));
const AddBlog = lazy(() => import('../../pages/Blogs/AddBlog'));
const BlogsHome = lazy(() => import('../../pages/Blogs/index'));
const BlogDetails = lazy(() => import('../../pages/Blogs/Detail'));
const UserProfile = lazy(() => import('../../pages/Blogs/profile'));
const BlogsAdminDashboard = lazy(() => import("../../pages/Blogs/Dashboard"));
const Categories = lazy(() => import("../../pages/Blogs/Categories"));
const ApprovedBlogsListPage = lazy(() => import("../../pages/Blogs/List/ApprovedBlogs"));
const RejectedBlogsListPage = lazy(() => import("../../pages/Blogs/List/RejectedBlogs"));
const DeletedBlogsListPage = lazy(() => import("../../pages/Blogs/List/DeletedBlogs"));
const PostedBlogsListPage = lazy(() => import("../../pages/Blogs/List/PostedBlogs"));
const BlogsRoute = lazy(() => import("../../pages/Blogs/BlogsHeader"));
const CategoryBlog = lazy(() => import("../../pages/Blogs/CategoryBlog"));
const TagBlog = lazy(() => import("../../pages/Blogs/TagBlog"));
const ConnectWithMe = lazy(() => import("../../pages/Portfolio/Connect"));
const Education = lazy(() => import("../../pages/Portfolio/Education"));
const Projects = lazy(() => import("../../pages/Portfolio/Projects"));
const Experience = lazy(() => import("../../pages/Portfolio/Experience"));
const OpenSource = lazy(() => import("../../pages/Portfolio/OpenSource"));
const Contact = lazy(() => import("../../pages/Portfolio/Contact"));
const Landing = lazy(() => import("../../pages/Portfolio/Landing"));
const Portfolio = lazy(() => import("../../pages/Admin/portfolio"));
const EducationPage = lazy(() => import("../../pages/Admin/portfolio/Education"));
const ProjectsPage = lazy(() => import("../../pages/Admin/portfolio/ProjectManagement"));
const ExperiencePage = lazy(() => import("../../pages/Admin/portfolio/Experience"));
const Certifications = lazy(() => import("../../pages/Admin/portfolio/Certifications"));

export const AppHome = () => {
  const location = useLocation();
  const isBlogsHome = location.pathname.startsWith('/blogs');
  const isBlogsAdminHome = location.pathname.startsWith('/admin/blogs');
 
  const applyMargin = isBlogsHome && !isBlogsAdminHome;
 
   return (
    <>
<div style={applyMargin ? { margin: "2% 12% 1% 12%" } : {}}>
      <Routes>
 
        <Route path="/user-inactive" element={<InactiveUserPage />} ></Route>

        <Route path='/admin' element={<AdminFrame navs={appNavs} role='admin' />}>
          <Route index element={<DashBoardPage />}></Route>
          {/* Blogs */}
          <Route path="blogs">
            <Route index element={<BlogsHome />}></Route>
            <Route path="search" element={<BlogsHome />}></Route>
            <Route path="view/:id" element={<BlogDetails />}></Route>
            <Route path="add-blog" element={<AddBlog />}></Route>
            <Route path="categories" element={<Categories />}></Route>
            <Route path="category/:category" element={<CategoryBlog />}></Route>
            <Route path="tags/:tag" element={<TagBlog />}></Route>
            <Route path="dashboard" element={<BlogsAdminDashboard />}></Route>
            <Route path="view-blogs" element={<BlogsRoute />}></Route>
            <Route path="approved-blogs-list" element={<ApprovedBlogsListPage />}></Route>
            <Route path="rejected-blogs-list" element={<RejectedBlogsListPage />}></Route>
            <Route path="posted-blogs-list" element={<PostedBlogsListPage />}></Route>
            <Route path="deleted-blogs-list" element={<DeletedBlogsListPage />}></Route>
          </Route>
          <Route path="portfolio" >
            <Route index element={<Portfolio />} ></Route>
            <Route path='education' element={<EducationPage />} ></Route>
            <Route path='projects' element={<ProjectsPage />} ></Route>
            <Route path='experience' element={<ExperiencePage />} ></Route>
            <Route path='certifications' element={<Certifications />} ></Route>
          </Route>
            {/* App Status */}
            <Route path="app-status" element={<ManageAppStatus />}></Route>


          <Route path="notifications" element={<Notifications />}></Route>
 
          <Route path="traffic/dashboard" element={<DashBoardPage />}></Route>
          <Route path="calendar/Calendar" element={<CalenderPage />}></Route>
          <Route path="calendar/Dashboard" element={<CalendarDashboardPage />}></Route>
          <Route path="table-members" element={<MembersPage />} ></Route>
          <Route path="table-virtualized" element={<VirtualizedTablePage />} ></Route>
          <Route path="forms/form-basic" element={<FormBasicPage />} ></Route>
          <Route path="traffic/route-management-form" element={<FormsPage />} ></Route>
          <Route path="users/dashboard" element={<UsersDashboardPage />}></Route>
<Route path="users/blogs-authors" element={<BlogsAuthorsUsersForms />}></Route>
          <Route path="users/users-list" element={<TotalUsersList />} ></Route>
          <Route path="users/registered-users-list" element={<RegisteredUsers />} ></Route>
      <Route path="users/rejected-users-list" element={<RejectedUsers />} ></Route>
          <Route path="users/approved-users-list" element={<ApprovedUsers />} ></Route>
          <Route path="users/active-users-list" element={<ActiveUsers />} ></Route>
          <Route path="users/inactive-users-list" element={<InActiveUsers />} ></Route>
          <Route path="users/admin-users" element={<AdminUsersForms />} ></Route>
          <Route path="tickets/dashboard" element={<TicketsDashboardPage />} ></Route>
          <Route path="tickets/add-tickets" element={<AddTicketsComponentPage />} ></Route>
          <Route path="tickets/view-tickets" element={<ViewTicketsComponentPage />} ></Route>
          <Route path="tickets/view-ticket/:id" element={<ViewTicketComponentPage />} ></Route>
          <Route path="forms/form-wizard" element={<WizardFormPage />} ></Route>
          <Route path="forms/testimonials" element={<TestimonialFormPage />} ></Route>
          <Route path="forms/reviews" element={<Reviews />} ></Route>
          <Route path="template/sign-in" element={<SignInPage />} />
          <Route path="template/sign-up" element={<SignUpPageAdmin />} />
          <Route path="reviews/dashboard" element={<ReviewsDashboardPage />} />
          <Route path="reviews/reviews-list" element={<ReviewsListPage />} />
          <Route path="testimonials/testimonials-list" element={<TestimonialsListPage />} />
          <Route path="testimonials/dashboard" element={<TestimonialsDashboardPage />} />
          <Route path="sign-in" element={<AppliedSignInPage />} />
          <Route path="sign-up" element={<AppliedSignUpPage />} />
          <Route path="error-404" element={<Error404 />} />
          <Route path="error-403" element={<Error403 />} />
          <Route path="error-500" element={<Error500 />} />
          <Route path="error-503" element={<Error503 />} />

          <Route path="carousel-management/settings" element={<AdminCarouselComponent />} />
          <Route path="carousel-management/view-items" element={<ViewCarouselItemsPage />} />

        </Route>
          <Route path="author" element={<AuthorFrame navs={authorNavs} />}>
          <Route index element={<AuthorDashboard />}></Route>
<Route path="dashboard" element={<AuthorDashboard />}></Route>
        </Route>
        <Route path="/user" element={<Frame navs={profileNavsUser} />}>
          <Route index element={<PersonalInformationPage />}></Route>
          <Route path="calendar" element={<CalenderPage />}></Route>
          <Route path="account-settings" element={<PersonalAccountSettingsPage />}></Route>
          <Route path="personal-information" index element={<PersonalInformationPage />}></Route>
          {/* <Route path="messages" index element={<ChatPage />}></Route> */}
        </Route>
        <Route path="/profile/user/:id" element={<Frame navs={profileNavs} />}>
          <Route index element={<UserPersonalInformationPage />}></Route>
         </Route>
        <Route path='/about-us' element={<AboutPage />}></Route>
        {/* Non-Auth routes */}


         <Route path="blogs">

          
          <Route index element={<BlogsHome />}></Route>
          <Route path="search" element={<BlogsHome />}></Route>
          <Route path="view/:id" element={<BlogDetails />}></Route>
          <Route path="add-blog" element={<AddBlog />}></Route>
          <Route path="categories" element={<Categories />}></Route>
          <Route path="category/:category" element={<CategoryBlog />}></Route>
          <Route path="tags/:tag" element={<TagBlog />}></Route>
          <Route path="dashboard" element={<BlogsAdminDashboard />}></Route>
          <Route path="view-blogs" element={<BlogsRoute />}></Route>
        </Route>
         <Route path='/' element={<Landing />} ></Route>
         <Route path='/chat' element={<ChatsPage />} ></Route>
        <Route path="/connect-with-me" element={<ConnectWithMe />} />
        {/* <Route path="/connect-with-me/thank-you" element={<Thankyou />} /> */}
        <Route path="/education" element={<Education />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/open-source" element={<OpenSource />} />
        <Route path="/contact" element={<Contact />} />
        <Route path='/contact-us' element={<ContactUsPage />}></Route>
        <Route path="/error-403" element={<Error403Component />} />
        <Route path='/login' element={<LoginPage />}></Route>
        <Route path='/sign-up' element={<SignUpPage />}></Route>
        <Route path='/forgot-password' element={<ForgotPassword />}></Route>
        <Route path='/*' element={<Error404 />}></Route>
      </Routes>
      </div>
    </>
  )
}
