import React, { useState } from 'react';
import { Button, Drawer, IconButton, Stack } from 'rsuite';
import ArrowLeftLine from '@rsuite/icons/ArrowLeftLine';
import UserStatusError from '../../../../components/ErrorPage/UserStatus';
import HelpOutlineIcon from '@rsuite/icons/HelpOutline';
import SupportComponent from './support';
import { connect, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { SiCodereview } from "react-icons/si";
import { CiLogout } from "react-icons/ci";
import { logoutUser } from '../../../../redux/auth';
const CustomRedBox = ({ error }) => {
  return (
    <div>
      {JSON.stringify(error, null, 4)}
    </div>
  );
};
const StatusComponent = ({ status, user, error }) => {
  const [showForm, setShowForm] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showError, setShowError] = useState(false);
  const [newError, setNewError] = useState(false);
  const dispatch = useDispatch();
useEffect(()=>{
    if(user && user.roles.includes('ADMIN')){
      setIsAdmin(true);
    }
},[])
const handleLogout = () => {
    dispatch(logoutUser())
}
  return (
    <>
      {
        showForm ? <>
          <SupportComponent setShowForm={() => setShowForm(false)} />
        </> : 
        <UserStatusError>
        <>
        <h1 className="error-page-code">{status?.type}</h1>
          <p className="error-page-title">{status?.title}</p>
          <p className="error-page-subtitle text-muted ">{status?.message}</p>
          <Drawer size='full' placement='right' open={showError} onClose={() => setShowError(false)}>
        <Drawer.Header>
          <Drawer.Title>Error Details</Drawer.Title>
          <Drawer.Actions>
            <Button onClick={() => setShowError(false)}>Cancel</Button>
          </Drawer.Actions>
        </Drawer.Header>
        <Drawer.Body>
          <div>
           <CustomRedBox error = {error}/>
          </div>
        </Drawer.Body>
      </Drawer>
          
          <Stack spacing={10} alignItems='center' justifyContent='center'>
            <IconButton icon={<ArrowLeftLine />} appearance="primary" href="/">
              Take me home
            </IconButton>
            <IconButton icon={<HelpOutlineIcon />} appearance="primary" onClick={() => setShowForm(true)}>
              Contact Support Team
            </IconButton>
            {
              isAdmin ? <>
              <IconButton icon={<SiCodereview className='rs-icon' />} appearance="primary" onClick={() => setShowError(true)}>
             View Error
            </IconButton>
              </> : <></>
            }
            <IconButton icon={<CiLogout className='rs-icon' />} appearance="primary" onClick={handleLogout}>
              Logout 
            </IconButton>
            </Stack>
        </>
        </UserStatusError>
      }
    </>
  )
}
const mapStateToProps = state => ({
  user: state.auth.user
});
export default connect(mapStateToProps)(StatusComponent);