import React from "react";
import parse from 'html-react-parser';
import { Stack, Rate, Panel, Avatar, Whisper, Popover, Button } from 'rsuite';
import Timestamp from "react-timestamp";
import { connect } from "react-redux";
import { rejectUser } from "../../../redux/auth";

const UserContentPanel = ({ data, header, styles, rejectUser }) => {
  const speaker = (
    <Popover title="Description">
      <div
    style={{
      width: 40,
      height: 40,
      background: '#f5f5f5',
      borderRadius: 6,
      marginTop: 2,
      overflow: 'hidden',
      display: 'inline-block'
    }}
  >
    <img src={data?.photoURL} width="40" alt={data?.displayName} />
  </div>
      <p>
        <b>Name:</b> {data?.firstName + ' ' + data?.lastName}
      </p>
      <p>
        <b>Email:</b> {data?.email}
      </p>
      <p>
        <b>User ID :</b> {data?.id}
      </p>
      <p>
        <b>UserName :</b> {data?.username}
      </p>
      <p>
        <b>Last Login at :</b> <Timestamp autoUpdate relative date={data?.lastLoginAt?.toDate().toString()} />
      </p>
      <p>
        <b>Account Created at :</b> <Timestamp autoUpdate relative date={data?.creationTime} />
      </p>
    </Popover>
  );
  const handleRejectUser = () => {
    rejectUser(data.id)
  }
  return (
    <>
      <Panel shaded header={<Stack justifyContent='center'>{header}</Stack>} className={styles ? `user-content-panel` : ''}>
      {/* {JSON.stringify(data, null, 4 )} */}
      
      <Stack justifyContent='center' spacing={20} style={{ marginTop: '30px' }}>
        <Stack.Item>
          {
            <Avatar src={data.photoURL} circle size='lg' />
          }
        </Stack.Item>
      </Stack>
      
      <Stack justifyContent='center' wrap spacing={5} style={{ marginTop: '20px' }}>
        <Stack.Item>
          {
            data.firstName + ' ' + data.lastName
          }
        </Stack.Item>
        </Stack>
        <Stack justifyContent='center' wrap spacing={5}>
        <Stack.Item>
        <Whisper placement="top" speaker={speaker}>
          <a>{data.email}</a>
        </Whisper>
        </Stack.Item>
        
      </Stack>
      <Stack justifyContent='center' wrap spacing={5}>
      <Stack.Item>
        <Button appearance='link' onClick={() => handleRejectUser()}>Reject User</Button>
        </Stack.Item>
        <Stack.Item>
        <Button appearance='link' href={`/profile/user/${data.id}`}>View User Profile</Button>
        </Stack.Item>
      </Stack>
    </Panel>
      
    </>
  )
}
const mapDispatchToProps = dispatch => ({
  rejectUser: (userId) => dispatch(rejectUser(userId)),
});
export default connect(null, mapDispatchToProps)(UserContentPanel);