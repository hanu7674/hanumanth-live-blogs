import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Stack, Divider, Schema, Panel, Uploader, Loader, Drawer, InputGroup, Button, FlexboxGrid, Form, Message, Modal, Progress } from "rsuite";
import { TextField } from "../../Auth/FormFields";
import AvatarIcon from '@rsuite/icons/legacy/Avatar';
import { changeProfileImage, getUserDataById, updateUserProfile } from "../../../redux/auth";
import { useParams } from "react-router-dom";

const { StringType } = Schema.Types;

const PersonalInformation = ({ loading, updateAccountDetails, user, error, getUserDetails, profileUrl, progress, profileImageUpload }) => {
    const { id } = useParams();
    useEffect(() => {
        if (id) {
            getUserDetails(id);
        }
    }, [])
    const [edit, setEdit] = useState(false);
    const formRef = React.useRef();
    const [formError, setFormError] = React.useState({});
    const [formValue, setFormValue] = React.useState({
        firstName: '', lastName: '', username: '', email: ''
    });
    const [uploading, setUploading] = React.useState(false);
    const [fileInfo, setFileInfo] = React.useState();
    const schemaModel = Schema.Model({
        firstName: StringType().isRequired('This field is required.'),
        lastName: StringType().isRequired('This field is required.'),
        username: StringType().isRequired('This field is required.'),
        address1: StringType().isRequired('This field is required.'),
        address2: StringType().isRequired('This field is required.'),
        city: StringType().isRequired('This field is required.'),
        zipcode: StringType().isRequired('This field is required.'),
        country: StringType().isRequired('This field is required.'),
    });
    const handleSubmit = () => {
        if (!formRef.current.check()) {
            console.error('Form Error');
            return;
        }
        else {
            updateAccountDetails(id, formValue)
        }
    };
    useEffect(() => {
        setFormValue({ ...user })
        setFileInfo(user?.photoURL)
    }, [user]);

    function previewFile(file, callback) {
        const reader = new FileReader();
        reader.onloadend = () => {
            callback(reader.result);
        };
        reader.readAsDataURL(file);
    }
    const handleImageUpload = (file) => {
        setUploading(true);
        previewFile(file.blobFile, value => {
            setFileInfo(value);
        })
        profileImageUpload(id, file.blobFile)
    }
    useEffect(() => {
        if (progress === 100 && profileUrl) {
            setUploading(false);
            setFormValue({ ...formValue, photoURL: profileUrl })
        }
    }, [profileUrl])
    return (
        <>
            {
                loading ? <>
                    <Loader backdrop content="loading..." vertical />
                </> : <>

                    <Panel bordered>
                        {
                            error && error.code === 'USER_NOT_EXISTS'
                                ? <>
                                    <Message showIcon type="info" header="User not found">

                                    </Message>
                                </> : <>


                                    <FlexboxGrid justify="space-between">
                                        <FlexboxGrid.Item>
                                            <Button appearance="link"><h3>Personal Information</h3></Button>
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item>
                                            <Button appearance="primary" onClick={() => setEdit(!edit)}>{
                                                edit ? 'Cancel' : 'Edit Profile'
                                            }</Button>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
                                    <FlexboxGrid justify="center">
                                        {
                                            edit ? <><Uploader
                                                action=""
                                                fileListVisible={false}
                                                listType="picture"
                                                onUpload={(file) => {
                                                    handleImageUpload(file)
                                                }
                                                }

                                            >
                                                <button style={{ width: 120, height: 120, borderRadius: '50%' }} >
                                                    {uploading && <Loader backdrop center />}
                                                    {fileInfo ? (
                                                        <img loading="lazy"  src={fileInfo} width="100%" height="100%" />
                                                    ) : (
                                                        <AvatarIcon style={{ fontSize: 40 }} />
                                                    )}
                                                </button>
                                            </Uploader>

                                            </> : <>
                                                <Panel shaded bordered bodyFill style={{ display: 'inline-block', width: 119, borderRadius: '50%', borderColor: 'greenyellow' }}>
                                                    {
                                                        user?.photoURL ? <>
                                                            <img loading="lazy"  src={user.photoURL} height="119" width='119' style={{ borderRadius: '50%' }} />
                                                        </> :
                                                            <AvatarIcon style={{ fontSize: 40 }} />}

                                                </Panel>  </>
                                        }
                                        <FlexboxGrid.Item colspan={22}>

                                            <Form fluid
                                                ref={formRef}
                                                onChange={setFormValue}
                                                onCheck={setFormError}
                                                formValue={formValue}
                                                model={schemaModel}>
                                                <FlexboxGrid style={{ marginTop: '20px' }} justify="space-between">
                                                    <FlexboxGrid.Item colspan={11}><TextField name="firstName" disabled={!edit} label="First Name" /></FlexboxGrid.Item>
                                                    <FlexboxGrid.Item colspan={11}><TextField name="lastName" disabled={!edit} label="Last Name" /></FlexboxGrid.Item>


                                                </FlexboxGrid>
                                                <FlexboxGrid style={{ marginTop: '20px' }} justify="space-between">
                                                    <FlexboxGrid.Item colspan={11}>
                                                        <TextField name="username" label="Username" disabled={!edit} />

                                                    </FlexboxGrid.Item>
                                                    <FlexboxGrid.Item colspan={11}>
                                                        <TextField name="phoneNumber" label="Phone Number" disabled={!edit} />
                                                    </FlexboxGrid.Item>


                                                </FlexboxGrid>

                                                <FlexboxGrid style={{ marginTop: '20px' }} justify="space-between">
                                                    <FlexboxGrid.Item colspan={11}>
                                                        <TextField name="address1" label="Address 1" disabled={!edit} />

                                                    </FlexboxGrid.Item>
                                                    <FlexboxGrid.Item colspan={11}>
                                                        <TextField name="address2" label="Address 2" disabled={!edit} />

                                                    </FlexboxGrid.Item>


                                                </FlexboxGrid>
                                                <FlexboxGrid style={{ marginTop: '20px' }} justify="space-between">
                                                    <FlexboxGrid.Item colspan={11}>
                                                        <TextField name="city" label="City" disabled={!edit} />

                                                    </FlexboxGrid.Item>
                                                    <FlexboxGrid.Item colspan={11}>
                                                        <TextField name="zipcode" label="Zip Code " disabled={!edit} />

                                                    </FlexboxGrid.Item>


                                                </FlexboxGrid>
                                                <FlexboxGrid style={{ marginTop: '20px' }} justify="space-between">
                                                    <FlexboxGrid.Item colspan={11}>
                                                        <TextField name="country" label="Country" disabled={!edit} />

                                                    </FlexboxGrid.Item>
                                                    <FlexboxGrid.Item colspan={11}>
                                                    </FlexboxGrid.Item>


                                                </FlexboxGrid>


                                                {
                                                    edit ? <>
                                                        <Form.Group style={{ marginTop: '30px' }}>
                                                            <Stack divider={<Divider vertical />}>
                                                                <Button appearance="primary" type="submit" onClick={handleSubmit}>
                                                                    Update Profile
                                                                </Button>

                                                            </Stack>
                                                        </Form.Group>
                                                    </> : ''
                                                }
                                            </Form>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
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
    progress: state.auth?.progress,
    profileUrl: state.auth?.profileUrl,
});
export default connect(mapStateToProps, mapDispatchToProps)(PersonalInformation);