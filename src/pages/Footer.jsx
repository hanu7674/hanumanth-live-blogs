import {  Nav, Navbar, Footer, FlexboxGrid, IconButton } from 'rsuite';
import HomeIcon from '@rsuite/icons/legacy/Home';
import ListIcon from '@rsuite/icons/List';
import UserBadgeIcon from '@rsuite/icons/UserBadge';
import FacebookSquareIcon from '@rsuite/icons/legacy/FacebookSquare';
import GithubSquare from '@rsuite/icons/legacy/GithubSquare';
import LinkedInSquare from '@rsuite/icons/legacy/LinkedinSquare';
import Instagram from '@rsuite/icons/legacy/Instagram';
import React from 'react';
import { Link } from 'react-router-dom';

const NavLink = React.forwardRef(({ href, children, ...rest }, ref) => (
    <Link ref={ref} to={href} {...rest} >
      {children}
    </Link>
  ));
function FooterPage() {
  return (
    <Footer>
      <div style={{margin: '2% 2% 2% 2%',}}>
        <hr></hr>
        <div>
            <FlexboxGrid justify='space-between'>
                <div>
                    <span>Developed by @Hanu7674</span>
                </div>
                <div style={{ textAlign: 'center' }}>
          &copy; {new Date().getFullYear()} React Admin Dashboard with Firebase App. All rights reserved.
        </div>
              <FlexboxGrid justify='space-around'>
              <NavLink href="https://facebook.com/hanu7674"   >
                <FacebookSquareIcon  style={{width: '40px', height: '40px'}}/>
              </NavLink>
             <NavLink href="https://linkedin.com/in/hanu7674"  >
                <LinkedInSquare  style={{width: '40px', height: '40px'}}/>
              </NavLink> 
              <NavLink href="https://github.com/hanu7674" >
                <GithubSquare style={{width: '40px', height: '40px'}}/>
              </NavLink>
              <NavLink  href="https://instagram.com/hanu7674" >
                <Instagram style={{width: '40px', height: '40px'}}/>
              </NavLink>
                </FlexboxGrid>
            </FlexboxGrid>
        </div>
      </div>
    </Footer>
  );
}

export default FooterPage;

{/* <div style={{ padding: '1rem' }}>
        <Navbar appearance="subtle" style={{ marginBottom: '1rem' }}>
          <Nav>
            <Nav.Item as={NavLink} href="/home">
            <HomeIcon/>  Home
            </Nav.Item>
            <Nav.Item  as={NavLink} href="/home">
            <ListIcon/>  Todo List
            </Nav.Item>
            <Nav.Item  as={NavLink}href="/profile">
            <UserBadgeIcon/>  My Account
            </Nav.Item>
          </Nav>
        </Navbar>
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontWeight: 'bold' }}>Subscribe to our newsletter:</div>
          <input type="email" placeholder="Enter your email" />
          <button>Subscribe</button>
        </div>
        <div>
          <div style={{ fontWeight: 'bold' }}>Follow us:</div>
              <Link href="https://facebook.com/hanu7674" >
                <FacebookSquareIcon/>
              </Link>
             <Link ref="https://linkedin.com/in/hanu7674" >
                <LinkedInSquare/>
              </Link> 
              <Link href="https://github.com/hanu7674" >
                <GithubSquare/>
              </Link>
              <Link  href="https://instagram.com/hanu7674" >
                <Instagram/>
              </Link>
        </div>
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          &copy; {new Date().getFullYear()} Todo App. All rights reserved.
        </div>
      </div> */}