import React from "react";
import parse from 'html-react-parser';
import { Stack, Rate, Panel, Avatar, Whisper, Popover, Button } from 'rsuite';
import { FiExternalLink } from "react-icons/fi";
import { FaExternalLinkSquareAlt } from 'react-icons/fa';
const ContentPanel = ({ data, header, styles }) => {
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
    <img src={data?.by?.photoURL} width="40" alt={data?.by?.displayName} />
  </div>
      <p>
        <b>Name:</b> {data?.by?.firstName + ' ' + data?.by?.lastName}
      </p>
      <p>
        <b>Email:</b> {data?.by?.email}
      </p>
      <p>
        <b>User ID :</b> {data?.id}
      </p>
    </Popover>
  );
  return (
    <>
    {
      data.rating ? <>
      <Panel shaded header={<Stack justifyContent='center'>{header}</Stack>} className={styles ? `content-panel` : ''}>
      {/* {JSON.stringify(data)} */}
      <div style={{height: '100px'}}>
        {data?.comments && 
      <Stack justifyContent='center' wrap >
        <span>{parse(data.comments)}</span></Stack>
      }
      </div>
      
      <Stack justifyContent='center' spacing={20} style={{ marginTop: '30px' }}>
        <Stack.Item>
          {
            <Avatar src={data.by.photoURL} circle size='lg' />
          }
        </Stack.Item>
      </Stack>
      {
        data.rating ? <>
          <Stack justifyContent='center' spacing={20} style={{ marginTop: '10px' }}>
            <Stack.Item>
              <Rate value={data.rating} readOnly />
            </Stack.Item>
          </Stack>
        </> : ''
      }
      <Stack justifyContent='center' wrap spacing={5} style={{ marginTop: '20px' }}>
        <Stack.Item>
          {
            data.by.firstName + ' ' + data.by.lastName
          }
        </Stack.Item>
        </Stack>
        <Stack justifyContent='center' wrap spacing={5}>
        <Stack.Item>
        <Whisper placement="top" speaker={speaker}>
          <a>{data.by.email}</a>
        </Whisper>
        </Stack.Item>
        
      </Stack>
      <Stack justifyContent='center' wrap spacing={5}>
<Stack.Item>
        {/* <Button appearance='link' href={`/testimonials/view/${data.id}`}>View Testimony</Button> */}
        </Stack.Item>
        <Stack.Item>
        <Button appearance='link' href={`/profile/user/${data.id}`} target="_blank" endIcon={<FaExternalLinkSquareAlt/>}>View Profile</Button>
        </Stack.Item>
      </Stack>
    </Panel>
      </> : <>
      <Panel shaded header={<Stack justifyContent='center'>{header}</Stack>} className={styles ? `content-panel` : ''}>
      {/* {JSON.stringify(data)} */}
      <div style={{height: '150px'}}>

      {data?.testimonial && <Stack justifyContent='center' wrap >
        <span>{parse(data.testimonial)}</span></Stack>}
      </div>
      
      <Stack justifyContent='center' spacing={20} style={{ marginTop: '30px' }}>
        <Stack.Item>
          {
            <Avatar src={data.by.photoURL} circle size='lg' />
          }
        </Stack.Item>
      </Stack>
      {
        data.rating ? <>
          <Stack justifyContent='center' spacing={20} style={{ marginTop: '10px' }}>
            <Stack.Item>
              <Rate value={data.rating} readOnly />
            </Stack.Item>
          </Stack>
        </> : ''
      }
      <Stack justifyContent='center' wrap spacing={5} style={{ marginTop: '20px' }}>
        <Stack.Item>
          {
            data.by.firstName + ' ' + data.by.lastName
          }
        </Stack.Item>
        </Stack>
        <Stack justifyContent='center' wrap spacing={5}>
        <Stack.Item>
        <Whisper placement="top" speaker={speaker}>
          <a>{data.by.email}</a>
        </Whisper>
        </Stack.Item>
        
      </Stack>
      <Stack justifyContent='center' wrap spacing={5}>
<Stack.Item>
        {/* <Button appearance='link' href={`/testimonials/view/${data.id}`}>View Testimony</Button> */}
        </Stack.Item>
        <Stack.Item>
        <Button appearance='link' href={`/profile/user/${data.id}`} target="_blank" endIcon={<FaExternalLinkSquareAlt/>}>View Profile </Button>
        </Stack.Item>
      </Stack>
    </Panel>
      </>
    }
    </>
  )
}
export default ContentPanel;