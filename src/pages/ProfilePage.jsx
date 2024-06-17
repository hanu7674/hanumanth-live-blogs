import React, {useState, useCallback} from "react";
import { Avatar, Divider, FlexboxGrid, Panel, Stack, Toggle } from 'rsuite';
import { useSelector, useDispatch } from 'react-redux';
import {
  Button,
  Form,
  Row,
  Col,
} from 'rsuite';
function AsyncToggle(props) {
    const [checked, setChecked] = useState(false);
    const [loading, setLoading] = useState(false);
  
    const toggle = useCallback(() => {
      setLoading(true);
  
      setTimeout(() => {
        setChecked(checked => !checked);
        setLoading(false);
      }, 1000);
    }, []);
  
    return <Toggle loading={loading} checked={checked} onChange={toggle} {...props} />;
  }
const ProfilePage = () => {
    const profile= {
        name: "Hanumanth",
        email: 'hanumant@gmail.com',
        imgURL: 'https://lh3.googleusercontent.com/a/AAcHTtevZDrMsNunk7dZX__i6kx0cNK4mNSUJN-I5exEG0_Oa49M=s96-c',
        roles: {
            ADMIN: "ADMIN"
        }
    }
    const [checked, setChecked] = useState(profile.roles.ADMIN);
  const [withText, setWithText] = useState(true);
  const [size, setSize] = useState('md');
  const [loading, setLoading] = useState(false)
    

    return(
        <>
        <div style={{margin: '2% 12% 2% 12%'}}>
            <div style={{padding: '2% 10% 2% 10%'}}>
            <FlexboxGrid >

            <Panel shaded bordered bodyFill style={{ display: 'inline-block', width: 140 }}>
        {
            profile.imgURL ? <>
            <img src={profile.imgURL} height="140" /> 
            </> : 
    <img src="https://via.placeholder.com/240x240" height="240" /> }
    
  </Panel>  
  <Panel>
      <p>
        <h4>{profile.name}</h4>
        <small>
            {profile.email}
        </small>
        
      </p>
      <span>
        {profile.roles.ADMIN ?
         <div style={{padding: "10% 0% 0% 0%"}}>
         <>Role:  </>
         <Toggle
            loading = {loading}
            checked={checked}
            onChange={() => setChecked(!checked)}
            checkedChildren={withText ? 'Admin' : undefined}
            unCheckedChildren={withText ? 'User' : undefined}
            size={size}
          /></div> 
         :<></>}
      </span>
    </Panel>
    </FlexboxGrid>

            </div>
        </div>
        <div style={{margin: '2% 8% 2% 8%'}} >
          
        </div>
        </>
    )
}

export default ProfilePage;