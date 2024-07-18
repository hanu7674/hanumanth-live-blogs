import { Avatar, Dropdown, FlexboxGrid, Stack, Text, useBreakpointValue } from "rsuite";
import "./userInfo.css"
import { useSelector } from "react-redux";
import { BiSolidEdit } from "react-icons/bi";
import AddUser from "../chatList/addUser/addUser";
import { useState } from "react";

const Userinfo = () => {

  const user = useSelector(state => state?.auth?.user);
  const [addMode, setAddMode] = useState(false);
  const size = useBreakpointValue(
    {
      '(min-width: 1200px)': 'lg',
      '(min-width: 992px)': 'md',
      '(min-width: 768px)': 'sm',
      '(min-width: 576px)': 'xs'
    },
    { defaultValue: 'md' }
  );

  return (
    <>
      {
        user ?
          <>
            <div  >
              <FlexboxGrid justify="space-between" align="center">
                <FlexboxGrid.Item>
                  <Stack spacing={15}>
                    <Stack.Item>

                      {
                        user?.photoURL ? <>
                          <Avatar circle size={size} src={user?.photoURL} alt={user?.firstName + ' ' + user?.lastName} />
                        </> : <>
                          <Avatar circle size={size} alt={user?.firstName + ' ' + user?.lastName}>
                            {user?.firstName[0] + ' ' + user?.lastName[0]}
                          </Avatar>

                        </>
                      }
                    </Stack.Item>
                    <Stack.Item>
                      <Text size={size}>{user.firstName} {user.lastName}  </Text>
                      <Text size={size}>{user.username}</Text>
                    </Stack.Item>          </Stack>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item>
                  <BiSolidEdit size={32} onClick={() => setAddMode((prev) => !prev)} />
                </FlexboxGrid.Item>
              </FlexboxGrid>





              {addMode && <AddUser open={addMode} handleClose={() => setAddMode(false)} />}
            </div>
          </>
          : <></>
      }
    </>
  )
}

export default Userinfo