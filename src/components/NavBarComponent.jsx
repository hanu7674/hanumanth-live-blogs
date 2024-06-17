import React, { useEffect, useState, useRef } from 'react';
import { Whisper, Avatar, Badge, Popover, Stack, List, Button, FlexboxGrid } from 'rsuite';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/auth';
import NoticeIcon from '@rsuite/icons/Notice';
import { getNotifications } from '../redux/notifications';
import './index.css';
import { MdMenu, MdClose, MdDashboardCustomize } from 'react-icons/md';
import { CgProfile } from "react-icons/cg";
import { IoIosLogOut } from "react-icons/io";
import Timestamp from 'react-timestamp';
import ReloadIcon from '@rsuite/icons/Reload';
import Loading from './Loading/loading';
import Timer from '../assets/Timer';
const NavBarComponent = () => {
  const currentUser = useSelector((state) => state?.auth?.user);
  const notificationsData = useSelector((state) => state.notification.notifications);
  const loading = useSelector((state) => state.notification.loading);

  const loc = useLocation();
  const [activeKey, setActiveKey] = useState(loc?.pathname);
  const dispatch = useDispatch();
  const trigger = useRef()
  useEffect(() => {
    setActiveKey(loc?.pathname);
  }, [loc?.pathname]);
  const [showNavbar, setShowNavbar] = React.useState(false);
  const handleShowNavbar = () => {
    setShowNavbar((prevShowNavbar) => !prevShowNavbar);
  };

  useEffect(() => {
    if (currentUser?.id) {
      dispatch(getNotifications())
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser])
  const NavLink = React.forwardRef(({ href, children, ...rest }, ref) => (
    <Link ref={ref} to={href} {...rest}>
      {children}
    </Link>
  ));
  const renderNavLink = (item) => {
    return (
      <li key={item.path} className={`nav-item-link ${activeKey === item.path ? 'active' : ''}`}>
        <NavLink to={item.path} key={item.path}>
          {item.label}
        </NavLink>
      </li>
    );
  };
  const sortedNotifications = [...notificationsData].sort((a, b) => {
    const dateA = a.createdAt instanceof Date ? a.createdAt : a.createdAt;
    const dateB = b.createdAt instanceof Date ? b.createdAt : b.createdAt;
    return dateB - dateA;
  });
  const latestNotifications = sortedNotifications.slice(0, 5);
  const RenderNoticeSpeaker = ({ onClose, left, top, className }, ref) => {
    const handleViewNotification = (id) => {
      window.location.href = `/admin/view-notification/${id}`;
    }
    const [hoveredIndex, setHoveredIndex] = React.useState(null);
    const [reloading, setReloading] = useState(false);
    const [time, setTime] = useState(false);
    useEffect(() => {
      setTime(new Date().toLocaleString());
    }, [])
    const refreshNotifications = () => {
      setReloading(true);
      dispatch(getNotifications());
      setTimeout(() => {
        setReloading(false);
        setTime(new Date().toLocaleString())
      }, 2000)
    }
    return (
      <Popover ref={ref} className={className} style={{ left, top, width: 300 }} title="Last updates">
        <div>
          <div style={{ padding: '1px', overflowY: 'scroll', maxHeight: '300px', zIndex: 1 }}>
            {
              reloading || loading ? <><Loading /></> :

                <List>
                  {
                    latestNotifications.length < 1 ? <>
                     <Stack wrap justifyContent='center'>You have 0 notifications</Stack> 
                     </> :
                      <>
                        {latestNotifications.map((item, index) => {
                          const { createdAt, title, id, createdBy } = item;
                          const itemStyle = {
                            backgroundColor: index === hoveredIndex ? '#44474d' : '#292d33',
                            borderBottom: '1px solid white',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s ease',
                            padding: '2px'
                          };

                          return (
                            <List.Item
                              key={index}
                              style={itemStyle}
                              onClick={() => handleViewNotification(id)}
                              onMouseOver={() => setHoveredIndex(index)}
                              onMouseOut={() => setHoveredIndex(null)}
                            >
                              <Stack spacing={4}>
                                <Stack.Item>
                                  <Avatar circle src={createdBy?.photoURL} alt={createdBy?.name ? createdBy.name : 'UK'}>{createdBy?.name ? createdBy.name : 'UK'}</Avatar>
                                </Stack.Item>
                                <Stack.Item>
                                  <p>{title}</p><Badge /> <span style={{ color: '#57606a' }}>
                                    <Timestamp relative autoUpdate date={createdAt?.toDate().toString()} />
                                  </span>
                                </Stack.Item>

                              </Stack>

                            </List.Item>
                          );
                        })
                        }
                      </>
                   }
                </List>
            }
            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <Button onClick={onClose} href='/admin/notifications'>More notifications</Button>
            </div>
          </div>

        </div><div style={{ margin: '5px', zIndex: 22 }}>


          <FlexboxGrid justify='space-between' >
            <FlexboxGrid.Item>
              <span>Synced at {time}</span>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item>
              <ReloadIcon style={{ cursor: 'pointer' }} spin={reloading} onClick={() => refreshNotifications()} />
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </div>
      </Popover>
    );
  };
  const renderDropDownMenu = ({ left, top, className }, ref) => {

    return (
      <Popover ref={ref} className={className} style={{ left, top, width: 180 }} >
        <Stack justifyContent='flex-start' direction='column' alignItems='flex-start'>
          <Stack.Item className='dropdown-item-hover' >
            <Button block style={{ textAlign: 'left' }} eventKey='/user/profile' as={NavLink} href={`user/personal-information`}>

              <CgProfile /> Your Profile
            </Button>

          </Stack.Item>

          <Stack.Item className='dropdown-item-hover'>
            {
              currentUser.roles?.includes('ADMIN') ? <>
                <Button block style={{ textAlign: 'left' }} as={NavLink} href={`/admin/traffic/dashboard`}>
                  <MdDashboardCustomize /> Admin Dashboard
                </Button>
              </> : <>

              </>
            }
          </Stack.Item>
          <Stack.Item className='dropdown-item-hover' >
            <Button block style={{ textAlign: 'left' }} as={NavLink}
              onClick={() => dispatch(logoutUser())}
            >
              <IoIosLogOut /> Logout
            </Button>
          </Stack.Item>
        </Stack>
      </Popover>
    );
  };
  const navLinks = [
    { path: '/', label: 'Home' },
    // { path: '/about-us', label: 'About Us' },
    { path: '/education', label: 'Education' },
    { path: '/experience', label: 'Experience' },
    { path: '/projects', label: 'Projects' },
    // { path: '/open-source', label: 'Open Source' },
    { path: '/contact-us', label: 'Contact Us' },
    { path: '/blogs', label: 'Blogs' },
  ];
  // const loginLink = [
  //   {
  //     path: '/login', label: 'Login here'
  //   }
  // ]

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (showNavbar && !trigger.current.contains(event.target)) {
        setShowNavbar(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [showNavbar]);
  const task = () => {
    dispatch(logoutUser());
  }
  return (
    <div>
      <nav className="navbar" >
        <div className="nav-container" >
          <div className="logo">
            <Link to='/' style={{ textDecoration: 'none', color: 'currentcolor' }}>
            <span> &lt;</span>
               <span className="logo-name" >
                  Lingala Hanumantha Reddy
                </span>
                <span >/&gt;</span>
            </Link>
          </div>
          <div className="menu-icon" onClick={handleShowNavbar}>
            {
              !showNavbar ? <MdMenu size={40} /> : <MdClose size={40} />
            }
          </div>
          <div className={`nav-elements  ${showNavbar && "active"}`} ref={trigger}>
            <ul>
              {navLinks.map((item) => renderNavLink(item))}
              {currentUser?.email ? (
                < >
                  <li className='nav-item-link' key='notifications'>
                    <Whisper placement="bottomEnd" trigger="click" speaker={RenderNoticeSpeaker}>
                      <div style={{ cursor: 'pointer' }}>
                        <Badge content={latestNotifications.length}>
                          <NoticeIcon style={{ fontSize: 20 }} />
                        </Badge>
                      </div>
                    </Whisper>
                  </li>
                  <>
                    <Whisper placement="bottomEnd" trigger="click" speaker={renderDropDownMenu}>
                      <div className='m-3' style={{ padding: "15px 15px 0px 0px" }}>
                        {
                          currentUser?.photoURL ? <>
                        <Avatar circle size='sm' src={currentUser?.photoURL} alt={currentUser?.firstName + ' ' + currentUser?.lastName} />
                      </> : <>
                      <Avatar circle size='sm' alt={currentUser?.firstName + ' ' + currentUser?.lastName}>
                      {currentUser?.firstName[0] + ' ' + currentUser?.lastName[0]}
                      </Avatar>

                      </>
                        }

                      </div>
                    </Whisper>

                  </>
                </>
              ) :
                <>
                  {/* {
                    loginLink.map((item) => renderNavLink(item))
                  } */}
                </>}
            </ul>
          </div>
        </div>
        {currentUser?.email ?
        <Timer time={1800} task={task}/> : <></>
        }
      </nav>
    </div>
  );
};
export const NonAuthNavBarComponent = () => {
  const loc = useLocation();
  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about-us', label: 'About Us' },
    { path: '/contact-us', label: 'Contact Us' },
  ];
  const [activeKey, setActiveKey] = useState(loc?.pathname);
  const dispatch = useDispatch();
  const trigger = useRef()
  useEffect(() => {
    setActiveKey(loc?.pathname);
  }, [loc?.pathname]);
  const [showNavbar, setShowNavbar] = React.useState(false);
  const handleShowNavbar = () => {
    setShowNavbar((prevShowNavbar) => !prevShowNavbar);
  };
  const NavLink = React.forwardRef(({ href, children, ...rest }, ref) => (
    <Link ref={ref} to={href} {...rest}>
      {children}
    </Link>
  ));


  const renderNavLink = (item) => {
    return (
      <li key={item.path} className={`nav-item-link ${activeKey === item.path ? 'active' : ''}`}>
        <NavLink to={item.path} key={item.path}>
          {item.label}
        </NavLink></li>
    );
  };
  return (
    <div>
      <nav className="navbar" >
        <div className="nav-container" >
          <div className="logo">
            <Link to='/' style={{ textDecoration: 'none', color: 'currentcolor' }}>
              App - @Hanu7674
            </Link>
          </div>
          <div className="menu-icon" onClick={handleShowNavbar}>
            {
              !showNavbar ? <MdMenu size={40} /> : <MdClose size={40} />
            }
          </div>
          <div className={`nav-elements  ${showNavbar && "active"}`} ref={trigger}>
            <ul>
              {navLinks.map((item) => renderNavLink(item))}

            </ul>
          </div>
        </div>
      </nav>
    </div>
  )
}
export default NavBarComponent;
