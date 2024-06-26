import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import {
    Stack, Divider, Schema, Panel, Uploader, Loader,
    InputNumber, Input, IconButton, ButtonGroup, Button, FlexboxGrid, Form, Message, Modal, Progress, Row, Col, Grid
} from "rsuite";
import { TextField, Textarea } from "../../Auth/FormFields";
import { changeProfileImage, updateUserProfile } from "../../../redux/auth";
import { FaUser } from "react-icons/fa";

import ProductForm from './SocialMediaLinksForm';
import Loading from "../../../components/Loading/loading";


const { StringType, ArrayType, ObjectType } = Schema.Types;


const PersonalInformation = ({ updateAccountDetails, user, profileUrl, progress, profileImageUpload }) => {
    const [edit, setEdit] = useState(false);
    const [editAddressForm, setEditAddressForm] = useState(false);
    const [editAboutMeForm, setEditAboutMeForm] = useState(false);
    const [editProfileImage, setEditProfileImage] = useState(false);
    const personalInfoformRef = React.useRef();
    const aboutMeformRef = React.useRef();
    const addressformRef = React.useRef();
    const [personalInfoFormError, setPersonalInfoFormError] = React.useState({});
    const [personalFormValues, setPersonalFormValues] = React.useState({
        firstName: '', lastName: '', username: '', email: ''
    });
    const [addressInfoFormError, setAddressInfoFormError] = React.useState({});
    const [addressFormValues, setAddressFormValues] = React.useState({
        address1: '', address2: '', city: '', country: '', zipcode: ''
    });
    const [aboutMeInfoFormError, setAboutMeInfoFormError] = React.useState({});
    const [aboutMeFormValues, setAboutMeFormValues] = React.useState({
        tagLine: '', aboutMe: ''
    });

    const [uploading, setUploading] = React.useState(false);
    const [fileInfo, setFileInfo] = React.useState();
    const personalInfoSchemaModel = Schema.Model({
        firstName: StringType().isRequired('This field is required.'),
        lastName: StringType().isRequired('This field is required.'),
        username: StringType().isRequired('This field is required.'),
        phoneNumber: StringType().isRequired('This field is required.'),
        });
    const addressInfoSchemaModel = Schema.Model({

        address1: StringType().isRequired('This field is required.'),
        address2: StringType().isRequired('This field is required.'),
        city: StringType().isRequired('This field is required.'),
        zipcode: StringType().isRequired('This field is required.'),
        country: StringType().isRequired('This field is required.'),
    });
    const aboutMeInfoSchemaModel = Schema.Model({

        tagLine: StringType().isRequired('This field is required.'),
        aboutMe: StringType().isRequired('This field is required.'),

    });
    const handleSubmitAddress = () => {
        if (!addressformRef.current.check()) {
            return;
        }
        else {
            updateAccountDetails(user.id, addressFormValues)
        }
    };
    const handleSubmitAboutMe = () => {
        if (!aboutMeformRef.current.check()) {
            return;
        }
        else {
            updateAccountDetails(user.id, aboutMeFormValues)
        }
    };
    const handleSubmitPersonalDetails = () => {
        if (!personalInfoformRef.current.check()) {
            return;
        }
        else {
            updateAccountDetails(user.id, personalFormValues)
        }
    };

    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true);
        setPersonalFormValues({ ...user })
        setAddressFormValues({ ...user })
        setAboutMeFormValues({ ...user })
        setFileInfo(user?.photoURL);
        setTimeout(() => {
            setLoading(false);
        }, [200])
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
        profileImageUpload(user.id, file.blobFile)
    }
    useEffect(() => {
        if (progress === 100 && profileUrl) {
            setUploading(false);
            setPersonalFormValues({ ...personalFormValues, photoURL: profileUrl });
            setEditProfileImage(false);
        }
    }, [profileUrl])




    return (
        <>
            <Panel >
                {
                    loading ? <Loading />: 
                    
                     <Row gutter={20}>
                        <Col md={24} sm={24} lg={8} xl={8}  >
                            <div className="card shadow">
                                <div className="card-header ">
                                    <h6 className="heading-small text-muted">
                                        User Avatar
                                    </h6>
                                </div>
                                <div className="card-body">
                                    <Stack justifyContent="center" spacing={10} wrap>

                                        <Stack.Item>
                                            {
                                                editProfileImage ? <><Uploader
                                                     
                                                    fileListVisible={false}
                                                    listType="picture"
                                                    onUpload={(file) => {
                                                        handleImageUpload(file)
                                                    }
                                                    }

                                                >
                                                    <button style={{ width: 119, height: 119, borderRadius: '50%' }} >
                                                        {uploading && <Loader backdrop center />}
                                                        {fileInfo ? (
                                                            <img loading="lazy" alt='profile' src={fileInfo} width="100%" height="100%" />
                                                        ) : (
                                                            <FaUser size={80} />
                                                        )}
                                                    </button>
                                                </Uploader>

                                                </> : <>
                                                    <div style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        borderRadius: '50%',
                                                        borderColor: 'greenyellow',
                                                        borderWidth: '1px',
                                                        borderStyle: 'solid',
                                                        overflow: 'hidden',
                                                        backgroundColor: '#232829',
                                                        padding: '2px',
                                                        position: 'relative',
                                                        width: '119px',
                                                        height: '119px',
                                                    }}>
                                                        {
                                                            user?.photoURL ? (
                                                                <img loading="lazy" 
                                                                    src={user.photoURL}
                                                                    alt="User Avatar"
                                                                    style={{
                                                                        width: '100%',
                                                                        height: '100%',
                                                                        objectFit: 'cover',
                                                                        borderRadius: '50%',
                                                                    }}
                                                                />
                                                            ) : (
                                                                <FaUser size={80} />
                                                            )
                                                        }
                                                    </div>


                                                </>
                                            }
                                        </Stack.Item>
                                    </Stack>
                                    <Stack justifyContent="center" spacing={20} wrap style={{ marginTop: '20px' }}>
                                        <Stack.Item >
                                            <Button appearance="primary" size="sm" onClick={() => setEditProfileImage(!editProfileImage)}>
                                                {
                                                    editProfileImage ? <>Cancel</> : <>Change Profile Image</>
                                                }
                                            </Button>
                                        </Stack.Item>
                                    </Stack>

                                </div>
                            </div>
                        </Col>
                        <Col md={24} sm={24} lg={16} xl={16}  >
                            <div className="card shadow">
                                <div className="card-header">

                                    <FlexboxGrid justify="space-between">
                                        <FlexboxGrid.Item>
                                            <h5 className="heading-small text-muted"><span>Personal Information</span></h5>
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item>
                                            <Button size="sm" appearance="primary" onClick={() => setEdit(!edit)}>{
                                                edit ? 'Cancel' : 'Edit Personal Information'
                                            }</Button>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
                                </div>
                                <div className="card-body">
                                    <FlexboxGrid justify="center">

                                        <FlexboxGrid.Item colspan={22}>

                                            <Form fluid
                                                ref={personalInfoformRef}
                                                onChange={setPersonalFormValues}
                                                onCheck={setPersonalInfoFormError}
                                                formValue={personalFormValues}
                                                model={personalInfoSchemaModel}>
                                                <Row>
                                                    <Col md={12} lg={12} sm={24} xs={24} xxl={12} xl={12}>
                                                        <TextField name="firstName" disabled={!edit} label="First Name" />
                                                    </Col>
                                                    <Col md={12} lg={12} sm={24} xs={24} xxl={12} xl={12}>
                                                        <TextField name="lastName" disabled={!edit} label="Last Name" />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col md={12} lg={12} sm={24} xs={24} xxl={12} xl={12}>
                                                        <TextField name="email" label="Email" disabled  />
                                                    </Col>
                                                    <Col md={12} lg={12} sm={24} xs={24} xxl={12} xl={12}>
                                                        <TextField name="username" label="Username" disabled={!edit} />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col md={12} lg={12} sm={24} xs={24} xxl={12} xl={12}>
                                                        <TextField name="phoneNumber" label="Phone Number" disabled={!edit} />
                                                    </Col>
                                                    <Col md={12} lg={12} sm={24} xs={24} xxl={12} xl={12}>
                                                    </Col>
                                                </Row>

                                                {
                                                    edit ? <>
                                                        <Form.Group style={{ marginTop: '30px' }}>
                                                            <Stack divider={<Divider vertical />} justifyContent="flex-end">
                                                                <Button appearance="primary" type="submit" onClick={handleSubmitPersonalDetails}>
                                                                    Update Personal Information
                                                                </Button>

                                                            </Stack>
                                                        </Form.Group>
                                                    </> : ''
                                                }
                                            </Form>
                                        </FlexboxGrid.Item>

                                    </FlexboxGrid></div>
                            </div>
                            <div className="card shadow">
                                <div className="card-header ">
                                    <FlexboxGrid justify="space-between">
                                        <FlexboxGrid.Item>
                                            <h5 className="heading-small text-muted"><span>Address</span></h5>
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item>
                                            <Button size="sm" appearance="primary" onClick={() => setEditAddressForm(!editAddressForm)}>{
                                                editAddressForm ? 'Cancel' : 'Edit Address Information'
                                            }</Button>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
                                </div>
                                <div className="card-body">
                                    <FlexboxGrid justify="center">

                                        <FlexboxGrid.Item colspan={22}>

                                            <Form fluid
                                                ref={addressformRef}
                                                onChange={setAddressFormValues}
                                                onCheck={setAddressInfoFormError}
                                                formValue={addressFormValues}
                                                model={addressInfoSchemaModel}>


                                                <Row>
                                                    <Col md={12} lg={12} sm={24} xs={24} xxl={12} xl={12}>
                                                        <TextField name="address1" label="Address 1" disabled={!editAddressForm} />

                                                    </Col>
                                                    <Col md={12} lg={12} sm={24} xs={24} xxl={12} xl={12}>
                                                        <TextField name="address2" label="Address 2" disabled={!editAddressForm} />

                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col md={12} lg={12} sm={24} xs={24} xxl={12} xl={12}>
                                                        <TextField name="city" label="City" disabled={!editAddressForm} />

                                                    </Col>
                                                    <Col md={12} lg={12} sm={24} xs={24} xxl={12} xl={12}>
                                                        <TextField name="zipcode" label="Zip Code " disabled={!editAddressForm} />

                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col md={12} lg={12} sm={24} xs={24} xxl={12} xl={12}>
                                                        <TextField name="country" label="Country" disabled={!editAddressForm} />

                                                    </Col>
                                                    <Col md={12} lg={12} sm={24} xs={24} xxl={12} xl={12}>

                                                    </Col>
                                                </Row>



                                                {
                                                    editAddressForm ? <>
                                                        <Form.Group style={{ marginTop: '30px' }}>
                                                            <Stack divider={<Divider vertical />} justifyContent="flex-end">
                                                                <Button appearance="primary" type="submit" onClick={handleSubmitAddress}>
                                                                    Update Address Information
                                                                </Button>

                                                            </Stack>
                                                        </Form.Group>
                                                    </> : ''
                                                }
                                            </Form>
                                        </FlexboxGrid.Item>

                                    </FlexboxGrid>
                                </div>
                            </div>
                            <div className="card shadow">
                                <div className="card-header ">
                                    <FlexboxGrid justify="space-between">
                                        <FlexboxGrid.Item>
                                            <h5 className="heading-small text-muted"><span>About Me</span></h5>
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item>
                                            <Button size="sm" appearance="primary" onClick={() => setEditAboutMeForm(!editAboutMeForm)}>{
                                                editAboutMeForm ? 'Cancel' : 'Edit About Me'
                                            }</Button>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
                                </div>
                                <div className="card-body">
                                    <FlexboxGrid justify="center">

                                        <FlexboxGrid.Item colspan={22}>

                                            <Form fluid
                                                ref={aboutMeformRef}
                                                onChange={setAboutMeFormValues}
                                                onCheck={setAboutMeInfoFormError}
                                                formValue={aboutMeFormValues}
                                                model={aboutMeInfoSchemaModel}>

                                                <FlexboxGrid style={{ marginTop: '20px' }} justify="space-between">
                                                    <FlexboxGrid.Item colspan={20}>
                                                        <TextField accepter={Textarea} rows={4} name="tagLine" label="Tag Line" disabled={!editAboutMeForm} />

                                                    </FlexboxGrid.Item>
                                                </FlexboxGrid>

                                                <FlexboxGrid style={{ marginTop: '20px' }} justify="space-between">

                                                    <FlexboxGrid.Item colspan={20}>
                                                        <TextField accepter={Textarea} rows={5} name="aboutMe" label="About Me" disabled={!editAboutMeForm} />

                                                    </FlexboxGrid.Item>


                                                </FlexboxGrid>



                                                {
                                                    editAboutMeForm ? <>
                                                        <Form.Group style={{ marginTop: '30px' }}>
                                                            <Stack divider={<Divider vertical />} justifyContent="flex-end">
                                                                <Button appearance="primary" type="submit" onClick={handleSubmitAboutMe}>
                                                                    Update About Me
                                                                </Button>

                                                            </Stack>
                                                        </Form.Group>
                                                    </> : ''
                                                }
                                            </Form>
                                        </FlexboxGrid.Item>

                                    </FlexboxGrid>
                                </div>
                            </div>
                            <ProductForm userData={user} />
                        </Col>
                    </Row>
                    }
             </Panel>
        </>
    )

}
const mapDispatchToProps = dispatch => ({
    updateAccountDetails: (userId, info) => dispatch(updateUserProfile(userId, info)),
    profileImageUpload: (id, file) => dispatch(changeProfileImage(id, file))
});
const mapStateToProps = state => ({
    user: state.auth?.user,
    progress: state.auth?.progress,
    profileUrl: state.auth?.profileUrl,
});
export default connect(mapStateToProps, mapDispatchToProps)(PersonalInformation);


