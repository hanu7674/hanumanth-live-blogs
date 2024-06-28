import React, { useEffect, } from "react";
import { connect, } from "react-redux";
import { Schema, Panel, Stack, Button, FlexboxGrid, Message, Input } from "rsuite";
import AvatarIcon from '@rsuite/icons/legacy/Avatar';
import { changeProfileImage, getUserDataById, updateUserProfile } from "../../../redux/auth";
import { useParams } from "react-router-dom";
import '../index.css'
import Loading from "../../../components/Loading/loading";
import CheckRoundIcon from '@rsuite/icons/CheckRound';
import { VscUnverified, VscVerifiedFilled } from "react-icons/vsc";

const PersonalInformation = ({ loading, user, error, getUserDetails, }) => {
    const { id } = useParams();
    useEffect(() => {
        if (id) {
            getUserDetails(id);
        }
    }, [])

    return (
        <>
            {
                loading ? <>
                    <Loading />
                </> : <>

                    <Panel bordered>
                        {
                            (error && error.code) === 'USER_NOT_EXISTS'
                                ? <>
                                    <Message showIcon type="info" header="User not found">
                                        {error.message}
                                    </Message>
                                </> : <>

                                    {user ? <>

                                        <FlexboxGrid justify="center">

                                            <Panel shaded bordered bodyFill style={{ display: 'inline-block', width: 119, borderRadius: '50%', borderColor: 'greenyellow' }}>
                                                {
                                                    user?.photoURL ? <>
                                                        <img loading="lazy" alt='user' src={user.photoURL} height="119" width='119' style={{ borderRadius: '50%' }} />
                                                    </> :
                                                        <AvatarIcon style={{ fontSize: 40 }} />}

                                            </Panel>


                                            <FlexboxGrid.Item colspan={22}>
                                                <FlexboxGrid.Item colspan={22}>
                                                    <Button appearance="link"><h5>Personal Information</h5></Button>
                                                </FlexboxGrid.Item>
                                                <FlexboxGrid style={{ marginTop: '10px' }} justify="space-between">
                                                    <FlexboxGrid.Item colspan={11}>
                                                        <label>First Name</label>
                                                         <Input style = {{marginTop: '10px' }}name="firstName" value={user.firstName} disabled label="First Name" />
                                                    </FlexboxGrid.Item>
<FlexboxGrid.Item colspan={11}><label>Last Name</label> <Input style = {{marginTop: '10px' }}name="lastName" value={user.lastName} disabled label="Last Name" /></FlexboxGrid.Item>


                                                </FlexboxGrid>

                                                <FlexboxGrid style={{ marginTop: '10px' }} justify="space-between">
                                                    <FlexboxGrid.Item colspan={11}>
                                                        <label>Username</label>
                                                         <Input style = {{marginTop: '10px' }}disabled value={user.username} name="username" label="Username" />

                                                    </FlexboxGrid.Item>
                                                    <FlexboxGrid.Item colspan={11}>
                                                        <label>Phone Number</label>
                                                         <Input style = {{marginTop: '10px' }}disabled value={user.phoneNumber} name="phoneNumber" label="Phone Number" />
                                                    </FlexboxGrid.Item>


                                                </FlexboxGrid>
                                                <FlexboxGrid style={{ marginTop: '10px' }} justify="space-between">
                                                    <FlexboxGrid.Item colspan={11}>
                    <Stack alignItems="baseline" >
<label>Email  {user?.emailVerified ? <> <VscVerifiedFilled color="green" size={15} /></> : <><VscUnverified size={15} color="red"/>  </>}</label>
                                                </Stack> <Input style = {{marginTop: '10px' }}disabled value={user.email} name="email" label="Email" />

                                                        
            
                                                    </FlexboxGrid.Item>
                                                </FlexboxGrid>
                                                <FlexboxGrid style={{ marginTop: '10px' }}>
                                                    <FlexboxGrid.Item colspan={22}>
                                                        <Button appearance="link"><h5>Contact Information</h5></Button>
                                                    </FlexboxGrid.Item>
                                                </FlexboxGrid>
                                                <FlexboxGrid style={{ marginTop: '10px' }} justify="space-between">
                                                    <FlexboxGrid.Item colspan={11}>
                <label>Address 1</label>
                                                         <Input style = {{marginTop: '10px' }}disabled value={user.address1} name="address1" label="Address 1" />

                                                    </FlexboxGrid.Item>
                                                    <FlexboxGrid.Item colspan={11}>
                                                        <label>Address 2</label>
                                                         <Input style = {{marginTop: '10px' }}disabled value={user.address2} name="address2" label="Address 2" />

                                                    </FlexboxGrid.Item>


                                                </FlexboxGrid>
                                                <FlexboxGrid style={{ marginTop: '10px' }} justify="space-between">
                                                    <FlexboxGrid.Item colspan={11}>
                                                        <label> City</label>
                                                         <Input style = {{marginTop: '10px' }}disabled value={user.city} name="city" label="City" />

                                                    </FlexboxGrid.Item>
                                                    <FlexboxGrid.Item colspan={11}>
                                                        <label>Zip Code (Pin Code )</label>
                                                         <Input style = {{marginTop: '10px' }}disabled value={user.zipcode} name="zipcode" label="Zip Code " />

                                                    </FlexboxGrid.Item>


                                                </FlexboxGrid>
                                                <FlexboxGrid style={{ marginTop: '10px' }} justify="space-between">
                                                    <FlexboxGrid.Item colspan={11}>
                                                        <label>
                                                            Country
                                                        </label>
                                                         <Input style = {{marginTop: '10px' }}disabled value={user.country} name="country" label="Country" />

                                                    </FlexboxGrid.Item>
                                                    <FlexboxGrid.Item colspan={11}>
                                                    </FlexboxGrid.Item>


                                                </FlexboxGrid>



                                            </FlexboxGrid.Item>
                                        </FlexboxGrid>
                                    </> : <>
                                        <Message showIcon type="info" header={error?.code}>
                                            {error?.message}
                                        </Message>
                                    </>

                                    }
                                </>
                        }
                    </Panel></>
            }
        </>
    )

}
const mapDispatchToProps = dispatch => ({
    getUserDetails: (id) => dispatch(getUserDataById(id)),
    updateAccountDetails: (userId, info) => dispatch(updateUserProfile(userId, info)),
    profileImageUpload: (id, file) => dispatch(changeProfileImage(id, file))
});
const mapStateToProps = state => ({
    user: state.auth?.userData,
    loading: state.auth?.userDataloading,
    error: state.auth?.userDataerror,
});
export default connect(mapStateToProps, mapDispatchToProps)(PersonalInformation);