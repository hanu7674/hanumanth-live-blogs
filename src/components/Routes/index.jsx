import React, { lazy, useEffect } from "react";
import HomePage from "../../pages/Home";
import AboutPage from "../../pages/AboutUs";
import ContactUsPage from "../../pages/contactUs";
import LoginPage from "../../pages/Auth/Login";
import SignUpPage from "../../pages/Auth/SignUp";
import ForgotPassword from "../../pages/Auth/ForgotPassword";
import Frame from "../../pages/Admin/Frame";
import { appNavs, profileNavs, userAppNavs } from "../NavConfig";
import MembersPage from "../../pages/Admin/tables/members";
import VirtualizedTablePage from "../../pages/Admin/tables/virtualized";
import DashBoardPage from "../../pages/Admin/dashboard";
import FormBasicPage from "../../pages/Admin/forms/basic";
import WizardFormPage from "../../pages/Admin/forms/wizard";
import FormsPage from "../../pages/Admin/forms/forms";
import SignInPage from "../../pages/Admin/authentication/sign-in";
import Error403 from "../../pages/Admin/authentication/403";
import Error404 from "../../pages/Admin/authentication/404";
import Error500 from "../../pages/Admin/authentication/500";
import Error503 from "../../pages/Admin/authentication/503";
import SignUpPageAdmin from "../../pages/Admin/authentication/sign-up";
import AppliedSignInPage from "../../pages/Admin/authentication/signin";
import AppliedSignUpPage from "../../pages/Admin/authentication/signup";
import PersonalInformationPage from "../../pages/Profile/Personal";
import AccountSettingsPage from "../../pages/Profile/Account";
import AdminFrame from "../../pages/Admin/AdminFrame";
import UserPersonalInformationPage from "../../pages/Profile/UserPersonal";
import UserAccountSettingsPage from "../../pages/Profile/UserAccount";
import Error403Component from "../../pages/Admin/authentication/403/Error403";
import AdminUsersForms from "../../pages/Admin/AdminUsers";
import RegisteredUsers from "../../pages/Admin/RegisteredUsers";
import RejectedUsers from "../../pages/Admin/RejectedUsers";
import ApprovedUsers from "../../pages/Admin/ApprovedUsers";
import ActiveUsers from "../../pages/Admin/ActiveUsers";
import InActiveUsers from "../../pages/Admin/InActiveUsers";
import InactiveUserPage from "../../pages/Auth/StatusPage";
import { Route, Routes, useLocation } from "react-router-dom";

import AddTicketsComponentPage from "../../pages/Admin/Tickets/AddTickets";
import ViewTicketsComponentPage from "../../pages/Admin/Tickets/ViewTickets";
import TicketsDashboardPage from "../../pages/Admin/Tickets/Dashboard";
import ViewTicketComponentPage from "../../pages/Admin/Tickets/ViewTicket";
import UsersDashboardPage from '../../pages/Admin/users'
import TestimonialFormPage from "../../pages/Admin/forms/Testimonials";
import ReviewForm from "../../pages/Admin/forms/Reviews/form";
import Reviews from "../../pages/Admin/forms/Reviews";
import ReviewsListPage from "../../pages/Admin/Reviews/list/index";
import TestimonialsListPage from "../../pages/Admin/Testimonials/list/index";
import ReviewsDashboardPage from '../../pages/Admin/Reviews/dashboard/index';
import TestimonialsDashboardPage from '../../pages/Admin/Testimonials/dashboard/index';
import CalendarDashboardPage from '../../pages/Admin/Calendar/dashboard/index'
import StaticHtml from "../../pages/Admin/static-html";
import CalenderPage from "../../pages/Admin/Calendar";
import TotalUsersList from "../../pages/Admin/Users-list";
import Notifications from "../../pages/Admin/Notifications";
import AdminCarouselComponent from "../../pages/Admin/Carousel";
import FooterPage from "../../pages/Footer";
import ViewCarouselItemsPage from "../../pages/Admin/Carousel/ViewCarouselItems";
import AddBlog from '../../pages/Blogs/AddBlog';
import BlogsHome from '../../pages/Blogs/index';
import BlogDetails from '../../pages/Blogs/Detail';
import UserProfile from '../../pages/Blogs/profile';
import BlogsAdminDashboard from "../../pages/Blogs/Dashboard";
import Categories from "../../pages/Blogs/Categories";
import BlogsRoute from "../../pages/Blogs/BlogsHeader";
import CategoryBlog from "../../pages/Blogs/CategoryBlog";
import TagBlog from "../../pages/Blogs/TagBlog";
import ConnectWithMe from "../../pages/Portfolio/Connect";
// import Thankyou from "../../pages/Portfolio/Connect/thanks";
import Education from "../../pages/Portfolio/Education";
import Projects from "../../pages/Portfolio/Projects";
import Experience from "../../pages/Portfolio/Experience";
import OpenSource from "../../pages/Portfolio/OpenSource";
import Contact from "../../pages/Portfolio/Contact";
import Landing from "../../pages/Portfolio/Landing";
import Portfolio from "../../pages/Admin/portfolio";
import EducationPage from "../../pages/Admin/portfolio/Education";
import ProjectsPage from "../../pages/Admin/portfolio/ProjectManagement";
import ExperiencePage from "../../pages/Admin/portfolio/Experience";
import Certifications from "../../pages/Admin/portfolio/Certifications";
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
          </Route>
          <Route path="portfolio" >
            <Route index element={<Portfolio />} ></Route>
            <Route path='education' element={<EducationPage />} ></Route>
            <Route path='projects' element={<ProjectsPage />} ></Route>
            <Route path='experience' element={<ExperiencePage />} ></Route>
            <Route path='certifications' element={<Certifications />} ></Route>
          </Route>



          <Route path="notifications" element={<Notifications />}></Route>
          <Route path="static/dashboard" element={<StaticHtml />}></Route>

          <Route path="traffic/dashboard" element={<DashBoardPage />}></Route>
          <Route path="calendar/Calendar" element={<CalenderPage />}></Route>
          <Route path="calendar/Dashboard" element={<CalendarDashboardPage />}></Route>
          <Route path="table-members" element={<MembersPage />} ></Route>
          <Route path="table-virtualized" element={<VirtualizedTablePage />} ></Route>
          <Route path="forms/form-basic" element={<FormBasicPage />} ></Route>
          <Route path="traffic/route-management-form" element={<FormsPage />} ></Route>
          <Route path="users/dashboard" element={<UsersDashboardPage />}></Route>
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
        <Route path="/user" element={<Frame navs={profileNavs} />}>
          <Route index element={<PersonalInformationPage />}></Route>
          <Route path="calendar" element={<CalenderPage />}></Route>
          <Route path="account-settings" element={<AccountSettingsPage />}></Route>
          <Route path="personal-information" index element={<PersonalInformationPage />}></Route>
          {/* <Route path="messages" index element={<ChatPage />}></Route> */}
        </Route>
        <Route path="/profile/user/:id" element={<AdminFrame navs={profileNavs} />}>
          <Route index element={<UserPersonalInformationPage />}></Route>
          <Route path="account-settings" element={<UserAccountSettingsPage />}></Route>
          <Route path="personal-information" index element={<UserPersonalInformationPage />}></Route>
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
