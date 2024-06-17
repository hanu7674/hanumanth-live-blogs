import {
    Form,
    Button,
    Schema,
    Stack,
    Divider,
    Input,
    FlexboxGrid,
    SelectPicker,
    Panel,
    InputGroup,
    Row,
    Col,
    Toggle,
    Message
} from 'rsuite';
import EyeIcon from '@rsuite/icons/legacy/Eye';
import EyeSlashIcon from '@rsuite/icons/legacy/EyeSlash';

import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { TextField } from '../../Auth/FormFields';
import { addSecurityQuestions, userSecurityQuestionEnabledStautsChange, verifyCurrentPassword } from '../../../redux/auth';
import { BsShopWindow } from 'react-icons/bs';
// import { updateUserProfile } from '../../../redux/auth';

const { StringType } = Schema.Types;
const model = Schema.Model({
    question1: StringType().isRequired('Please select a question.'),
    answer1: StringType().minLength(3, 'Security Question Answer 1 should be more than 2 characters.').maxLength(10, 'Security Question  Answer 1 should be less than 10 characters.').isRequired('Security Question 1 Answer is required.'),
    question2: StringType().isRequired('Please select a question.'),
    answer2: StringType().minLength(3, 'Security Question Answer 2 should be more than 2 characters.').maxLength(10, 'Security Question Answer 2 should be less than 10 characters.').isRequired('Security Question 2 Answer is required.'),
    question3: StringType().isRequired('Please select a question.'),
    answer3: StringType().minLength(3, 'Security Question Answer 3 should be more than 2 characters.').maxLength(10, 'Security Question  Answer 3 should be less than 10 characters.').isRequired('Security Question 3 Answer is required.'),
});
const securityQuestions = [
    "What was your childhood nickname?",
    "What was the name of your first pet?",
    "What was the name of the street you grew up on?",
    "What was the high school you attended?",
    "What is the name of your mother's maiden name?",
    "What was the first car you owned?",
    "What is the name of your favorite city to visit?",
    "What was your favorite teacher's name in elementary school?",
    "What is the name of the first company you worked for?",
    "What was your favorite vacation destination as a child?"
].map(
    item => ({ label: item, value: item })
);




const SecurityQuestionsForm = ({ questions, addSecurityQuestions, userSecurityQuestionEnabled, securityQuestionsStatusChangeLoading, userSecurityQuestionEnabledStautsChange, loading, currentPasswordVerified, verifyCurrentPassword, user, clearVerifyCurrentPasswordStatus }) => {
    const formRef = React.useRef();
    const [formError, setFormError] = React.useState({});
    const [formValue, setFormValue] = React.useState({
        question1: "",
        answer1: "",
        question2: "",
        answer2: "",
        question3: "",
        answer3: "",
    });
    const [editSecurityQuestions, setEditSecurityQuestions] = React.useState(false);
    const [showEditForm, setShowEditForm] = React.useState(false);
    const [selectedQuestions, setSelectedQuestions] = React.useState(null);
    const [visible, setVisible] = React.useState(false);
    const [currentPassword, setCurrentPassword] = useState();

    useEffect(() => {
        const selected = Object.values(formValue).filter(value => !!value);
        setSelectedQuestions(selected);
    }, [formValue]);
    useEffect(() => {
        if (currentPasswordVerified?.code === 200) {
            setEditSecurityQuestions(true);
        }
        else {
            setEditSecurityQuestions(false)
        }
    }, [currentPasswordVerified])
    useEffect(() => {
        if (questions) {
            setFormValue({ ...questions })
        }
    }, [questions])
    const handleSecurityQuestionsSubmit = () => {
        if (!formRef.current.check()) {
            return;
        }
        else {
            addSecurityQuestions(formValue);
        }
    };
    const onCancelAction = () => {
        setShowEditForm(false);
        setEditSecurityQuestions(false)
        setFormValue({ ...questions });
        clearVerifyCurrentPasswordStatus()
    }
    const onEditAction = () => {
        setShowEditForm(true);
        setFormValue({ ...questions })
    }
    const handleChange = () => {
        setVisible(!visible);
    };
    const handleVerifyCurrentPassword = () => {
        verifyCurrentPassword(user.email, currentPassword)
    }
    const handleUserSecurityQuestionEnabledStatusChange = (checked) => {
        userSecurityQuestionEnabledStautsChange(checked)
    }
    const SecurityQuestionsFormEdit = () => {
        return (
            <FlexboxGrid justify="center">

                <FlexboxGrid.Item colspan={22}>

                    <Form
                        ref={formRef}
                        checkTrigger="blur"
                        onChange={setFormValue}
                        onCheck={setFormError}
                        formValue={formValue}
                        model={model}
                        fluid
                    >
                        <TextField accepter={SelectPicker} defaultValue={formValue.question1} disabledItemValues={selectedQuestions} block data={securityQuestions} disabled={!editSecurityQuestions} name='question1' label='Security Question 1' />
                        <TextField accepter={Input} type={editSecurityQuestions ? 'text' : 'password'} value={formValue.answer1} disabled={!editSecurityQuestions} name='answer1' label='Security Question 1 Answer' />
                        <TextField accepter={SelectPicker} defaultValue={formValue.question2} disabledItemValues={selectedQuestions} block data={securityQuestions} disabled={!editSecurityQuestions} name='question2' label='Security Question 2' />
                        <TextField accepter={Input} type={editSecurityQuestions ? 'text' : 'password'} value={formValue.answer2} disabled={!editSecurityQuestions} name='answer2' label='Security Question 2 Answer' />
                        <TextField accepter={SelectPicker} defaultValue={formValue.question3} disabledItemValues={selectedQuestions} block data={securityQuestions} disabled={!editSecurityQuestions} name='question3' label='Security Question 3' />
                        <TextField accepter={Input} type={editSecurityQuestions ? 'text' : 'password'} value={formValue.answer3} disabled={!editSecurityQuestions} name='answer3' label='Security Question 3 Answer ' />

                        {
                            editSecurityQuestions ? <>
                                <Form.Group style={{ marginTop: '30px' }}>
                                    <Stack divider={<Divider vertical />} justifyContent="flex-end">
                                        <Button appearance="primary" loading={loading} type="submit" onClick={handleSecurityQuestionsSubmit}>
                                            Update Security Questions
                                        </Button>

                                    </Stack>
                                </Form.Group>
                            </> : ''
                        }

                    </Form>

                </FlexboxGrid.Item>

            </FlexboxGrid>
        )
    }
    return (
        <>        <div style={{ margin: '10px 0px' }}>
            <Stack justifyContent='flex-end'>
                <Stack.Item>
                    <label>Current Security Questions Status : {" "} </label></Stack.Item>
                <Stack.Item>
                    <Toggle loading={securityQuestionsStatusChangeLoading} onChange={(checked) => handleUserSecurityQuestionEnabledStatusChange(checked)} checkedChildren={'Enabled'} checked={userSecurityQuestionEnabled}
                        unCheckedChildren={'Disabled'} size='lg' /></Stack.Item></Stack></div>
            {
                userSecurityQuestionEnabled ?
                    <Panel bordered shaded header={
                        <div className="card-header">
                            <FlexboxGrid justify="space-between">
                                <FlexboxGrid.Item>
                                    <h5 className="heading-small text-muted"><span>Security Questions</span></h5>
                                </FlexboxGrid.Item>
                                <FlexboxGrid.Item>
                                    {
                                        !showEditForm ? <><Button size="sm" appearance="primary" onClick={onEditAction}> Edit Security Questions </Button></> :
                                            <>

                                                <Button size="sm" appearance="primary" onClick={onCancelAction}>Cancel  </Button></>
                                    }


                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                        </div>
                    }>

                        < >
                            {
                                showEditForm ? <> {
                                    editSecurityQuestions ? <>
                                        <SecurityQuestionsFormEdit />
                                    </> :
                                        <>                        <FlexboxGrid justify="center">

                                            <FlexboxGrid.Item as={Col} md={16} sm={24} xs={24} lg={16} xl={16} xxl={16}>

                                                <Form fluid >
                                                    <Form.Group controlId='password'>
                                                        <Form.ControlLabel>Current Password
                                                        </Form.ControlLabel>

                                                        <InputGroup inside>
                                                            <Form.Control name="password" onChange={(value) => setCurrentPassword(value)} autoComplete="off" type={visible ? 'text' : 'password'} />
                                                            <InputGroup.Button onClick={handleChange}>
                                                                {visible ? <EyeIcon /> : <EyeSlashIcon />}
                                                            </InputGroup.Button>
                                                        </InputGroup>
                                                    </Form.Group>
                                                    <Button onClick={handleVerifyCurrentPassword} appearance="primary">
                                                        Verify Current Password
                                                    </Button>
                                                </Form>

                                            </FlexboxGrid.Item>
                                        </FlexboxGrid> </>
                                }

                                </> :
                                    <>
                                        <SecurityQuestionsFormEdit />

                                    </>
                            }
                        </>
                    </Panel>
                    :
                    <>
                        <Message showIcon type='info' header={<strong>Security Questions Not Enabled:</strong>}>
                            For additional account security, consider enabling security questions. These can be used to help verify your identity if you forget your password.
                        </Message>
                    </>
            }
        </>
    );
};
const mapDispatchToProps = dispatch => ({
    addSecurityQuestions: (questions) => dispatch(addSecurityQuestions(questions)),
    verifyCurrentPassword: (email, password) => dispatch(verifyCurrentPassword(email, password)),
    clearVerifyCurrentPasswordStatus: () => dispatch({ type: 'CLEAR_VERIFY_CURRENT_USER_PASSWORD' }),
    userSecurityQuestionEnabledStautsChange: (status) => dispatch(userSecurityQuestionEnabledStautsChange(status))
});
const mapStateToProps = state => ({
    loading: state.auth?.loadingUpdateSecurityQuestions,
    currentPasswordVerified: state.auth?.currentPasswordVerified,
    user: state.auth?.user,
    userSecurityQuestionEnabled: state.auth?.user?.securityQuestionsEnabled,
    securityQuestionsStatusChangeLoading: state.auth?.securityQuestionsStatusChangeLoading,
});
export default connect(mapStateToProps, mapDispatchToProps)(SecurityQuestionsForm);