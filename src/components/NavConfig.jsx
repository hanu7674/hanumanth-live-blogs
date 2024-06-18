import React from 'react';
import { Icon } from '@rsuite/icons';
import { VscTable, VscCalendar } from 'react-icons/vsc';
import { MdFingerprint, MdDashboard, MdModeEditOutline, MdSettings, MdOutlineAdminPanelSettings, MdAddCircle, MdReviews, MdOutlineReviews, MdFormatListBulleted, MdViewCarousel, MdOutlineViewCarousel, MdDisplaySettings, MdAddCard } from 'react-icons/md';
import {BiCategory, BiSolidUser} from 'react-icons/bi';
import {FaBlog, FaUsersRectangle} from 'react-icons/fa6';
import { IoTicketOutline } from "react-icons/io5";
import { BsTicketDetailed } from "react-icons/bs";
import { BiSolidTrafficBarrier } from "react-icons/bi";
import { SiGoogleforms, SiReacthookform } from "react-icons/si";
import { RiUserStarFill, RiUserStarLine } from 'react-icons/ri';
import { HiTemplate } from "react-icons/hi";
import { ImProfile } from "react-icons/im";
import { FaGraduationCap } from "react-icons/fa";
import { GrProjects } from 'react-icons/gr';
import { MdOutlineWorkHistory } from "react-icons/md";
import { TbCertificate } from "react-icons/tb";
import { PiCertificate } from "react-icons/pi";
import { LiaBlogSolid } from "react-icons/lia";
export const appNavs = [
  {
    eventKey: 'portfolio',
    icon: <Icon as={ImProfile} />,
    title: 'Portfolio',
    to: 'portfolio',
    children: [
      {
        eventKey: 'education',
        title: 'Education',
        icon: <Icon as={FaGraduationCap}/>,
        to: 'portfolio/education'
      },
      {
        eventKey: 'certifications',
        title: 'Certifications',
        icon: <Icon as={PiCertificate}/>,
        to: 'portfolio/certifications'
      },
      {
        eventKey: 'projects',
        title: 'Projects',
        icon: <Icon as={GrProjects}/>,
        to: 'portfolio/projects'
      },
      {
        eventKey: 'experience',
        title: 'Experience',
        icon: <Icon as={MdOutlineWorkHistory}/>,
        to: 'portfolio/experience'
      }
    ]
  },
  {
    eventKey: 'calendar',
    icon: <Icon as={VscCalendar} />,
    title: 'Calendar',
    to: 'calendar',
    children: [
      {
        eventKey: 'dashboard',
        title: 'Dashboard',
        icon: <Icon as={MdDashboard}/>,
        to: 'calendar/dashboard'
      },
      {
        eventKey: 'calendar',
        title: 'Calendar',
        icon: <Icon as={VscCalendar}/>,
        to: 'calendar/Calendar'
      },
    ]
  },
  {
    eventKey: 'user-management',
    icon: <Icon as={FaUsersRectangle} />,
    title: 'User Management',
    to: 'user-management',
    children: [
      {
        eventKey: 'dashboard',
        title: 'Dashboard',
        to: 'users/dashboard',
        icon: <Icon as={MdDashboard} />,
      },
      {
        eventKey: 'users-list',
        title: 'Total Users',
        to: 'users/users-list',
        icon: <Icon as={FaUsersRectangle} />,
      },
      {
        eventKey: 'admins',
        icon: <Icon as={MdOutlineAdminPanelSettings} />,
        title: 'Admins',
        to: 'users/admin-users',
      },
      {
        eventKey: 'active-users-list',
        title: 'Active Users',
        to: 'users/active-users-list',
        icon: <Icon as={FaUsersRectangle} />,
      },
      {
        eventKey: 'inActive-users-list',
        title: 'In Active Users',icon: <Icon as={FaUsersRectangle} />,
        to: 'users/inActive-users-list'

      },
      {
        eventKey: 'registered-users-list',
        title: 'Registered Users',icon: <Icon as={FaUsersRectangle} />,
        to: 'users/registered-users-list'
      },
      {
        eventKey: 'approved-users-list',
        title: 'Approved Users',icon: <Icon as={FaUsersRectangle} />,
        to: 'users/approved-users-list'
      },
        {
          eventKey: 'rejected-users-list',
          title: 'Rejected Users',icon: <Icon as={FaUsersRectangle} />,
          to: 'users/rejected-users-list'
        }
    ]
  },
  {
    eventKey: 'traffic',
    icon: <Icon as={BiSolidTrafficBarrier} />,
    title: 'Traffic Management',
    to: 'traffic',
    children: [
      {
        eventKey: 'dashboard',
        title: 'Dashboard',
        icon: <Icon as={MdDashboard}/>,
        to: 'traffic/dashboard'
      },
      {
        icon: <Icon as={SiGoogleforms}/>,
        eventKey: 'route-management-form',
        title: 'Route Management Forms',
        to: 'traffic/route-management-form'
      },
    ]
  },
  {
    eventKey: 'tickets',
    icon: <Icon as={IoTicketOutline} />,
    title: 'Ticket Management',
    to: 'tickets',
    children: [
      {
        eventKey: 'dashboard',
        title: 'Dashboard',
        icon: <Icon as={MdDashboard}/>,
        to: 'tickets/dashboard'
      },
      {
        eventKey: 'add-tickets',
        title: 'Add Tickets',
        to: 'tickets/add-tickets',
        icon: <Icon as={MdAddCircle}/>,
      },
      {
        eventKey: 'view-tickets',
        title: 'View Tickets',
        to: 'tickets/view-tickets',
        icon: <Icon as={BsTicketDetailed}/>
      },
      
    ]
  },
  { 
    eventKey: 'carousel',
    icon: <Icon as={MdViewCarousel} />,
    title: 'Carousel Management',
    to: 'carousel-management',
    children: [
      {
        eventKey: 'CarouselSettings',
        title: 'Carousel Settings',
        icon: <Icon as={MdDisplaySettings}/>,
        to: 'carousel-management/settings'
      },
      {
        eventKey: 'viewCarouselItems',
        title: 'View Carousel Items',
        icon: <Icon as={MdOutlineViewCarousel}/>,
        to: 'carousel-management/view-items'
      },
    ]
  },
  {
    eventKey: 'blogs',
    icon: <Icon as={FaBlog} />,
    title: 'Blogs Management',
    to: 'reviews',
    children: [
      {
        eventKey: 'dashboard',
        title: 'Dashboard',
        icon: <Icon as={MdDashboard}/>,
        to: 'blogs/dashboard'
      },
      {
        eventKey: 'view-blogs-list',
        title: 'View Blogs List',
        icon: <Icon as={LiaBlogSolid}/>,
        to: 'blogs/list'
      },
      {
        eventKey: 'view-blogs',
        title: 'View Blogs',
        icon: <Icon as={MdFormatListBulleted}/>,
        to: 'blogs'
      },
      {
        eventKey: 'add-blog',
        title: 'Add a Blog',
        icon: <Icon as={MdAddCard}/>,
        to: 'blogs/add-blog'
      },
      {
        eventKey: 'categories',
        title: 'Blog Categories',
        icon: <Icon as={BiCategory}/>,
        to: 'blogs/categories'
      },

    ]
  },
   
  {
    eventKey: 'static-template',
    icon: <Icon as={HiTemplate} />,
    title: 'Static Template with Bootstrap',
    to: 'static/dashboard',
  },
  {
    eventKey: 'reviews',
    icon: <Icon as={MdReviews} />,
    title: 'Reviews Management',
    to: 'reviews',
    children: [
      {
        eventKey: 'dashboard',
        title: 'Dashboard',
        icon: <Icon as={MdDashboard}/>,
        to: 'reviews/dashboard'
      },
      {
        eventKey: 'reviews-list',
        title: 'Reviews List',
        icon: <Icon as={MdFormatListBulleted}/>,
        to: 'reviews/reviews-list'
      },
    ]
  },
  {
    eventKey: 'testimonials',
    icon: <Icon as={RiUserStarLine} />,
    title: 'Testimonials Management',
    to: 'testimonials',
    children: [
      {
        eventKey: 'dashboard',
        title: 'Dashboard',
        icon: <Icon as={MdDashboard}/>,
        to: 'testimonials/dashboard'
      },
      {
        eventKey: 'testimonials-list',
        title: 'Testimonials List',
        icon: <Icon as={MdFormatListBulleted}/>,
        to: 'testimonials/testimonials-list'
      },
    ]
  },
  {
    eventKey: 'tables',
    icon: <Icon as={VscTable} />,
    title: 'Tables (Demo)',
    to: 'table-members',
    children: [
      {
        eventKey: 'members',
        title: 'Members',
        to: 'table-members'
      },
      {
        eventKey: 'virtualized',
        title: 'Virtualized Table',
        to: 'table-virtualized'
      }
    ]
  },
  {
    eventKey: 'forms',
    icon: <Icon as={MdModeEditOutline} />,
    title: 'Other Forms',
    to: 'form-basic',
    children: [
      
      {
        eventKey: 'form-basic',
        title: 'Basic',
        to: 'forms/form-basic'
      },
      {
        eventKey: 'testimonials',
        title: 'Testimonials',
        to: 'forms/testimonials'
      },
      {
        eventKey: 'reviews',
        title: 'Reviews',
        to: 'forms/reviews'
      },
      {
        eventKey: 'form-wizard',
        title: 'Wizard',
        to: 'forms/form-wizard'
      },

    ]
  },

  {
    eventKey: 'authentication',
    title: 'Authentication',
    icon: <Icon as={MdFingerprint} />,
    children: [
      
      {
        eventKey: ' sign-in',
        title: ' Sign In',
        to: 'sign-in'
      },

      {
        eventKey: 'sign-up',
        title: 'Sign Up',
        to: 'sign-up'
      },
      {
        eventKey: 'template sign-in',
        title: 'Template Sign In',
        to: 'template/sign-in'
      },

      {
        eventKey: 'template sign-up',
        title: 'Template Sign Up',
        to: 'template/sign-up'
      },
      {
        eventKey: 'error403',
        title: 'Error 403',
        to: 'error-403'
      },
      {
        eventKey: 'error404',
        title: 'Error 404',
        to: 'error-404'
      },
      {
        eventKey: 'error500',
        title: 'Error 500',
        to: 'error-500'
      },
      {
        eventKey: 'error503',
        title: 'Error 503',
        to: 'error-503'
      }
    ]
  },
  // {
  //   eventKey: 'payments',
  //   icon: <Icon as = {GiCash }/>,
  //   title: 'Payments',
  //   to: 'payments',
  //   children: [
  //     {
  //       eventKey: 'subscription-fee',
  //       title: 'Subscription Fee',
  //       to: 'subscription-fee'
  //     },
  //     {
  //       eventKey: 'admission-fee',
  //       title: 'Admission Fee',
  //       to: 'admission-fee'
  //     },
  //     {
  //       eventKey: 'exam-fee',
  //       title: 'Exam Fee',
  //       to: 'exam-fee'
  //     }, 
  //     {
  //       eventKey: 'other-fee',
  //       title: 'Other Fee',
  //       to: 'other-fee'
  //     },
  //   ]
  // },

];
export const profileNavs = [
  {
    eventKey: 'calendar',
    icon: <Icon as={VscCalendar} />,
    title: 'Calendar',
    to: 'calendar',
  },
  {
    eventKey: 'profile',
    title: 'Profile',
    icon: <Icon as={BiSolidUser} />,
    children: [
      {
        eventKey: 'personalInformation',
        icon: <Icon as={BiSolidUser} />,
        title: 'Personal Information',
        to: 'personal-information'
      },
      {
        eventKey: 'accountSettings',
        icon: <Icon as={MdSettings} />,
        title: 'Account Settings',
        to: 'account-settings'
      }
      
    ]
  },
  
  // {
  //   eventKey: 'messages',
  //   icon: <Icon as={BiSolidMessageSquareDetail} />,
  //   title: 'Messages',
  //   to: 'messages'
  // },

]