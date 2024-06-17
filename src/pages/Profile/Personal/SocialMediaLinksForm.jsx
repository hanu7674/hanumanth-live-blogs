import {
    Form,
    Button,
    ButtonGroup,
    Schema,
    Stack,
    Divider,
    Input,
    FlexboxGrid,
    IconButton,
    Notification
} from 'rsuite';
import PlusIcon from '@rsuite/icons/Plus';
import MinusIcon from '@rsuite/icons/Minus';
import CloseIcon from '@rsuite/icons/Close';

import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateUserProfile } from '../../../redux/auth';

const { ArrayType, StringType, NumberType, ObjectType } = Schema.Types;
const model = Schema.Model({
    socialMediaLinks: ArrayType().of(
        ObjectType().shape({
            name: StringType().isRequired('Please enter a name for the social media link.'),
            link: StringType()
                .isURL('Please enter a valid URL for the social media link.')
                .isRequired('Please enter a link for the social media link.'),
        })
    )
});

const ErrorMessage = ({ children }) => <span style={{ color: 'red' }}>{children}</span>;


const ProductItem = ({ rowValue = {}, onChange, rowIndex, rowError, disabled }) => {
    const handleChangeName = value => {
        onChange(rowIndex, { ...rowValue, name: value });
    };
    const handleChangeLink = value => {
        onChange(rowIndex, { ...rowValue, link: value });
    };

    return (
        <FlexboxGrid justify='space-between' style={{ paddingTop: 10 }}>
            <FlexboxGrid.Item colspan={10}>
                <Input value={rowValue.name} onChange={handleChangeName} disabled={disabled} />
                {rowError ? <ErrorMessage>{rowError.name.errorMessage}</ErrorMessage> : null}
            </FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={10}>
                <Input
                    value={rowValue.link}
                    onChange={handleChangeLink}
                    disabled={disabled}
                />
                {rowError ? <ErrorMessage>{rowError.link.errorMessage}</ErrorMessage> : null}
            </FlexboxGrid.Item>
        </FlexboxGrid>
    );
};

const ProductInputControl = ({ value = [], onChange, fieldError, disabled, setEditSocialMediaLinks }) => {
    const errors = fieldError ? fieldError.array : [];
    const [socialMediaLinks, setSocialMediaLinks] = React.useState(value);
    const handleChangeProducts = nextProducts => {
        setSocialMediaLinks(nextProducts);
        onChange(nextProducts);
    };
    const handleInputChange = (rowIndex, value) => {
        const nextProducts = [...socialMediaLinks];
        nextProducts[rowIndex] = value;
        handleChangeProducts(nextProducts);
    };

    const handleMinus = () => {
        handleChangeProducts(socialMediaLinks.slice(0, -1));
    };
    const handleAdd = () => {
        handleChangeProducts(socialMediaLinks.concat([{ name: '', link: null }]));
    };
    return (
        < >
            {
                socialMediaLinks.length > 0 ? <>
                    <FlexboxGrid justify="space-between" style={{ paddingTop: 10 }}>
                        <FlexboxGrid.Item colspan={10}>
                            Social Media Name
                        </FlexboxGrid.Item>
                        <FlexboxGrid.Item colspan={10}>
                            Social Media Link
                        </FlexboxGrid.Item>
                    </FlexboxGrid>
                    {socialMediaLinks.map((rowValue, index) => (
                        <ProductItem
                            key={index}
                            rowIndex={index}
                            rowValue={rowValue}
                            rowError={errors[index] ? errors[index].object : null}
                            onChange={handleInputChange}
                            disabled={disabled}
                        />
                    ))}
                    {
                        !disabled ?  <> <FlexboxGrid justify="space-around" style={{ paddingTop: 10 }}>
                        <FlexboxGrid.Item>
                            <IconButton onClick={handleAdd} icon={<PlusIcon />}> Add a Social Media Link</IconButton>
                        </FlexboxGrid.Item>
                        <FlexboxGrid.Item>
                            <IconButton onClick={handleMinus} icon={<CloseIcon />} >
                                Remove last Link
                            </IconButton>
                        </FlexboxGrid.Item>
                    </FlexboxGrid>
                        </>: <></> 
                    }
                    
                </> : <>
                
                
                {
                        !disabled ?  <>
                    <FlexboxGrid justify="center" style={{ paddingTop: 10 }}>
                        <FlexboxGrid.Item>
                            <IconButton onClick={handleAdd} icon={<PlusIcon />}> Add a Social Media Link</IconButton>
                        </FlexboxGrid.Item>
                    </FlexboxGrid>
                    </>: <><Stack justifyContent='center'>
                    <Notification>Social Media links not found.! Click <a appearance='link' onClick={setEditSocialMediaLinks}>here</a> to add profiles.</Notification>
                </Stack></> }
                </>
            }
        </>
    );
};

const SocialMediaLinksForm = ({userData}) => {
    const formRef = React.useRef();
    const [formError, setFormError] = React.useState({});
    const [formValue, setFormValue] = React.useState({...userData});
    const [editSocialMediaLinks, setEditSocialMediaLinks] = React.useState(false);
    const dispatch = useDispatch();
 
     const handleSocialMediaLinksSubmit = () => {
        if (!formRef.current.check()) {
            return;
        }
        else{
            dispatch(updateUserProfile(userData.id,formValue));

        }
    };
    return (
        <>
            <div className="card shadow">
                <div className="card-header ">
                    <FlexboxGrid justify="space-between">
                        <FlexboxGrid.Item>
                            <h5 className="heading-small text-muted"><span>About Me</span></h5>
                        </FlexboxGrid.Item>
                        <FlexboxGrid.Item>
                            <Button size="sm" appearance="primary" onClick={() => setEditSocialMediaLinks(!editSocialMediaLinks)}>{
                                editSocialMediaLinks ? 'Cancel' : 'Edit Social Media Links'
                            }</Button>
                        </FlexboxGrid.Item>
                    </FlexboxGrid>
                </div>
                <div className="card-body">
                    <FlexboxGrid justify="center">

                        <FlexboxGrid.Item colspan={22}>

                            <Form
                                ref={formRef}
                                checkTrigger="blur"
                                onChange={setFormValue}
                                onCheck={setFormError}
                                formValue={formValue}
                                model={model}
                            >

                                <Form.Control
                                    name="socialMediaLinks"
                                    accepter={ProductInputControl}
                                    fieldError={formError.socialMediaLinks}
                                    disabled={!editSocialMediaLinks}
                                    setEditSocialMediaLinks = {() => setEditSocialMediaLinks(true)}
                                />
                                {
                                    editSocialMediaLinks ? <>
                                        <Form.Group style={{ marginTop: '30px' }}>
                                            <Stack divider={<Divider vertical />} justifyContent="flex-end">
                                                <Button appearance="primary" type="submit" onClick={handleSocialMediaLinksSubmit}>
                                                    Update Social Media Links
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
        </>
    );
};

export default SocialMediaLinksForm;