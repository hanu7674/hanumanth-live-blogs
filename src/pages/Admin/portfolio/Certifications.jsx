import React, { useEffect, useState, useRef } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Form, Row, Col, FormGroup, ControlLabel, Button, Schema, IconButton, ButtonToolbar, Input, Drawer, SelectPicker, Stack, Divider, Uploader, Progress, Breadcrumb, Text, DatePicker, Checkbox, TagPicker, TagInput } from 'rsuite';
import PlusIcon from '@rsuite/icons/Plus';
import TrashIcon from '@rsuite/icons/Trash';
import { addCertification, deleteCertification, editCertification, getCertificationList, removeProfileFiles, uploadProfileFiles } from '../../../redux/auth';
import { TextField } from '../../Auth/FormFields';
import { endYear, excerpt, isURL, months, startYear } from '../../../assets/constants';
import TableIcon from '@rsuite/icons/legacy/Table';
import ListIcon from '@rsuite/icons/legacy/ListAlt';
import SearchIcon from '@rsuite/icons/Search';
import MoreIcon from '@rsuite/icons/legacy/More';
import Editor from '../../Blogs/Editor';
import RemindIcon from '@rsuite/icons/legacy/Remind';
import { Table, Pagination, Popover, Whisper, Modal, InputGroup, FlexboxGrid, Dropdown, Tag, Panel, Avatar } from 'rsuite';
import Timestamp from 'react-timestamp';
import { Link } from 'react-router-dom';
import { MdDelete, MdEdit } from 'react-icons/md';
   
const UserContentPanel = ({ data, header, styles }) => {
     
  return (
    <>        <Panel shaded bordered bodyFill className={styles ? `user-content-panel` : ''} style={{ display: 'inline-block' }}>
  <Stack justifyContent='center'><img src={data.imageUrl} height="150" />
</Stack>
      <Panel     >
 

       
      <Stack justifyContent='center' wrap spacing={5} style={{ marginTop: '20px' }}>
        <Stack.Item>
          <Text size='xxl' align='center'>
          <Link to={data.link}>
            {
            excerpt( data.title, 30)
          }
          </Link>
          </Text>
          
        </Stack.Item>
        </Stack>
        <Stack justifyContent='center' wrap spacing={5} style={{ marginTop: '20px' }}>
          ID: {data?.cid ? data?.cid : 'N/A'}
        </Stack>
      <Stack justifyContent='center' wrap spacing={5} style={{ marginTop: '20px' }}>
        <Stack.Item>
          {
           data?.startDateMonth+ ' ' + data?.startDateYear + ' - '+ data?.endDateMonth+ ' ' + data?.endDateYear
          }
        </Stack.Item>
        </Stack>
        <Stack justifyContent='flex-start' alignItems='flex-start' spacing={5} style={{ marginTop: '20px' }}>
           
          <Stack.Item>
          {
            data?.skills ? <Stack spacing={5} wrap> 
            {
              data?.skills?.map((skill) => (<><Tag>{skill}</Tag></>))
            }
            </Stack> : <></>
          }
          </Stack.Item>
        </Stack>

      
    </Panel>
    </Panel>
    </>
  )
}

 const {Cell, HeaderCell, Column} = Table;
const { StringType } = Schema.Types;

const model = Schema.Model({
  title: StringType().isRequired('Title is required'),
  issuer: StringType().isRequired('Issuer is required'),
  startDateMonth: StringType().isRequired('Program Start Month is required.'),  
  startDateYear: StringType().isRequired('Program Start Year is required.'),  
  endDateMonth: StringType().isRequired('Program End Month is required.'),    
  endDateYear: StringType().isRequired('Program End Year is required.'),  
  description: StringType().isRequired('Description is required'),

  cid: StringType().isRequired('Credential Id is required.'),  
   link: StringType().addRule((value) => isURL(value), 'Please enter a valid URL').isRequired('This field is required.'),
  imageUrl: StringType().addRule((value) => isURL(value), 'Please enter a valid URL').isRequired('This field is required.'),
});

const initialValues = {
  title: "",
  issuer: "",
  issueDate: "",
  expirationDate: "",
  description: "",
  imageUrl: "",
  startDateMonth: "",  
  startDateYear: "",   
  endDateMonth: "",     
  endDateYear: "",   
  link: ""
};

const CertificationForm = ({ open, onClose, certification }) => {
  const [formValue, setFormValue] = useState(initialValues);
  const [formError, setFormError] = useState({});
  const dispatch = useDispatch();
   const formRef = useRef();
  const [content, setContent] = useState('');

  const handleChange = (value) => {
    setFormValue(value);
  };
  useEffect(() => {
    if (certification) {
        setFormValue(certification);
        setContent(certification?.description)
    } else {
        setFormValue(initialValues);
    }
}, [certification]);
const [uploadingImage, setUploadingImage] = useState(false);
const [imageFileInfo, setImageFileInfo] = useState();
const [imageFileList, setImageFileList] = useState([]);
const [imageProgress, setImageProgress] = useState(0);
const imageUploaderRef = useRef();
// States for document uploader
const documentUploaderRef = useRef();

const [uploadingDocument, setUploadingDocument] = useState(false);
const [documentFileInfo, setDocumentFileInfo] = useState();
const [documentFileList, setDocumentFileList] = useState([]);
const [documentProgress, setDocumentProgress] = useState(0);

const fileUploadProgress = useSelector((state) => state.auth.fileUploadProgress);
  const profileFileUrl = useSelector((state) => state.auth?.profileFileUrl);    
const { addCertificationLoading, editCertificationLoading } = useSelector((state) => state.auth);

  const imageProgressStatus = imageProgress  === 100 ? 'success' : null;
  const documentProgressStatus = documentProgress  === 100 ? 'success' : null;
  const imageProgressColor = imageProgress === 100 ? '#52c41a' : '#3385ff';
  const documentProgressColor = documentProgress === 100 ? '#52c41a' : '#3385ff';
 
  const handleContent = (e) => {
    setContent(e);
    setFormValue({ ...formValue, description: e });
  };

  useEffect(() => {
    if(uploadingImage){
      setImageProgress(fileUploadProgress);
    }
    else {
      setDocumentProgress(fileUploadProgress);
    }
  }, [fileUploadProgress, uploadingImage,uploadingDocument]);
   
  const handleClear = () => {
    setImageFileInfo();
    setDocumentFileInfo()
    setDocumentFileList([]);
    setImageFileList([]);
    setImageProgress(0);
    setDocumentProgress(0);
    setContent('')
    setFormValue({ ...formValue, imageUrl: '' });
    dispatch({ type: 'PROFILE_FILE_UPLOAD_PROGRESS', payload: 0 });
  };
 
  useEffect(() => {
    if (!open) {
      setFormValue(initialValues);
      setImageFileInfo();
      setImageFileList([]);
      setImageProgress(0);
      setDocumentFileInfo();
      setDocumentFileList([]);
      setDocumentProgress(0);
    }
  }, [open]);

  const handleSubmit = async () => {
    let hasError = false;
     const { startDateMonth, startDateYear, endDateMonth, endDateYear } = formValue;
     const newFormError = { ...formError };

    if (startDateYear && endDateYear && startDateMonth && endDateMonth) {
      const start = new Date(`${startDateYear}-${startDateMonth}-01`);
      const end = new Date(`${endDateYear}-${endDateMonth}-01`);
      if (end < start) {
        if (endDateYear < startDateYear) {
          newFormError.endDateYear = 'End year must be after start year.';
        } else if (endDateYear === startDateYear && endDateMonth < startDateMonth) {
          newFormError.endDateMonth = 'End month must be after start month.';
        }
        hasError = true;
      }
    }
    if (content?.length < 1) {
      newFormError.description = 'Description is required';
      hasError = true;
    }
    setFormError(newFormError);
    if (hasError) {
      return;
    }
    if (!formRef.current.check()) {
      console.log(formError);
      return;
    }
    if (certification) {
      dispatch(editCertification(certification.id, formValue));
  } else {
      dispatch(addCertification(formValue));

  }    
  handleClear();
  onClose();
  
  };

  function previewFile(file, callback) {
    const reader = new FileReader();
    reader.onloadend = () => {
      callback(reader.result);
    };
    reader.readAsDataURL(file);
  }

  const handleImageUpload = () => {
    setUploadingImage(true);
    const file = imageFileList[0];
    previewFile(file.blobFile, value => {
      setImageFileInfo(value);
    });
    console.log("Uploading image", imageFileList);
    dispatch(uploadProfileFiles(file.blobFile));
  };
  const handleDocumentUpload = () => {
    setUploadingDocument(true);
    const file = documentFileList[0];
    previewFile(file.blobFile, value => {
      setDocumentFileInfo(value);
    });
    dispatch(uploadProfileFiles(file.blobFile));
    console.log("Uploading document", documentFileList);

  };

  
  const handleImageFileRemove = (file) => {
    setImageFileInfo();
    setImageFileList([]);
    setImageProgress(0);
    setFormValue({ ...formValue, imageUrl: '' });
    dispatch({ type: 'PROFILE_FILE_UPLOAD_PROGRESS', payload: 0 });
    if (setUploadingImage) {
      dispatch(removeProfileFiles(file));
    }
  };

  const handleDocumentFileRemove = (file) => {
    setDocumentFileInfo();
    setDocumentFileList([]);
    setDocumentProgress(0);
    setFormValue({ ...formValue, link: '' });
    dispatch({ type: 'PROFILE_FILE_UPLOAD_PROGRESS', payload: 0 });
    if (setUploadingDocument) {
      dispatch(removeProfileFiles(file));
    }
  };
  

  useEffect(() => {
    if (isURL(profileFileUrl)) {
      if(uploadingImage){
        setUploadingImage(false);
        setFormValue({ ...formValue, imageUrl: profileFileUrl });
      }
      else if(uploadingDocument){
        setUploadingDocument(false);
        setFormValue({ ...formValue, link: profileFileUrl });
      }
     }
  }, [profileFileUrl]);

  return (
    <>
      <Drawer size='sm' open={open} onClose={onClose}>
        <Drawer.Header>
          <Drawer.Title>Add Certification Form</Drawer.Title>
          <Drawer.Actions></Drawer.Actions>
        </Drawer.Header>
        <Drawer.Body>
          <Form
            ref={formRef}
            model={model}
            formValue={formValue}
            onCheck={setFormError}
            onChange={handleChange}
            fluid
          >
            <TextField name='title' label="Name *" placeholder='Ex: AWS Certified Solutions Architect' accepter={Input} error={formError.title} />
            <TextField name='issuer' label="Issuing Organization*" placeholder='Ex: Amazon Web Services' accepter={Input} error={formError.issuer} />
            <Form.Group  >
                        <Form.ControlLabel>Issue Date *</Form.ControlLabel>
                        <Row >
                            <Col md={12} sm={24} xs={24}>
                            <Form.Control block name='startDateMonth' placeholder='Select Start Month' accepter={SelectPicker} data={months}></Form.Control>

                            </Col>
                            <Col md={12} sm={24} xs={24}>
                            <Form.Control block fluid name='startDateYear' placeholder='Select Start Year' accepter={SelectPicker} data={startYear()}></Form.Control>

                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group>
                        
                        <Form.ControlLabel>Expiration Date  *</Form.ControlLabel>
                        <Row>
                            <Col md={12} sm={24} xs={24}> 
                            <Form.Control block name='endDateMonth' placeholder='Select End Month' accepter={SelectPicker} data={months}></Form.Control>
                            </Col>
                            <Col md={12} sm={24} xs={24}><Form.Control block name='endDateYear' placeholder='Select End Year' accepter={SelectPicker} data={endYear()}></Form.Control>
                        </Col></Row>
                    </Form.Group>

                          <Form.Group>
              <Form.ControlLabel>Description *</Form.ControlLabel>
              <Editor
                setData={handleContent}
                readonly={false}
                className="form-control"
                placeholder="Write Description here ..."
                data={content}
                name='content'
               />
              {
                            formError.description ? <Text color='red'>{formError.description}</Text> : <></>
                          }
            </Form.Group>
            <TextField name='skills' label="Skills" block  accepter={TagPicker} creatable error={formError.link} />

            <TextField name='link' label="Certification Link *" accepter={Input} error={formError.link} />
            <Divider>Or</Divider>
            <Uploader
              disabled={documentProgress == 100}
              multiple={false}
              listType="picture-text"
              onChange={setDocumentFileList}
              fileList={documentFileList}
              onRemove={(file) => handleDocumentFileRemove(file)}
              autoUpload={false}
              renderFileInfo={(file, fileElement) => {
                return (
                  <>
                    <span>File Name: {file.name}</span>
                  </>
                );
              }}
              ref={documentUploaderRef}
              draggable>
              <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span>Click or Drag files to this area to upload</span>
              </div>
            </Uploader>
            {documentProgress > 1 ? <Progress.Line percent={documentProgress} strokeColor={documentProgressColor} status={documentProgressStatus} /> : ''}
            <Stack style={{ margin: "15px 0" }} justifyContent='center' spacing={20}>
              <Button disabled={!documentFileList.length} onClick={handleDocumentUpload} loading={uploadingDocument}>Upload</Button>
              <Button onClick={handleDocumentFileRemove}>Clear</Button>
            </Stack>
            <TextField name='cid' label="Certification Id *" accepter={Input} error={formError.cid} />
            <h3>Attachments</h3>
            <TextField value={formValue?.imageUrl} name="imageUrl" checkAsync type="text" label="Certification logo URL *" />
            <Divider>Or</Divider>
            <Uploader
              disabled={imageProgress == 100}
              multiple={false}
              listType="picture-text"
              onChange={setImageFileList}
              fileList={imageFileList}
              onRemove={(file) => handleImageFileRemove(file)}
              autoUpload={false}
              renderFileInfo={(file, fileElement) => {
                return (
                  <>
                    <span>File Name: {file.name}</span>
                  </>
                );
              }}
              ref={imageUploaderRef}
              draggable>
              <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span>Click or Drag files to this area to upload</span>
              </div>
            </Uploader>
            {imageProgress > 1 ? <Progress.Line percent={imageProgress} strokeColor={imageProgressColor} status={imageProgressStatus} /> : ''}
            <Stack style={{ margin: "15px 0" }} justifyContent='center' spacing={20}>
              <Button disabled={!imageFileList.length} onClick={handleImageUpload} loading={uploadingImage}>Upload</Button>
              <Button onClick={handleImageFileRemove}>Clear</Button>
            </Stack>
            <FlexboxGrid justify='end'>
              <Stack justifyContent='space-between' alignItems='center' spacing={20}>
                <Stack.Item>
                  <Button onClick={onClose}>Cancel</Button>
                </Stack.Item>
                <Stack.Item>
                  <Button onClick={handleSubmit} appearance="primary" loading={addCertificationLoading || editCertificationLoading} disabled={addCertificationLoading || editCertificationLoading}>
                  {certification ? <>
                    {addCertificationLoading ? 'Updating...' : 'Update Certification'}
                   </>: <>{addCertificationLoading ? 'Adding...' : 'Add Certification'}</>}
                  
                  </Button>
                </Stack.Item>
              </Stack>
            </FlexboxGrid>
          </Form>
        </Drawer.Body>
      </Drawer>
    </>
  );
};

 

const RemoveCertification = ({ open, certId, onClose }) => {
  const dispatch = useDispatch();
  const handleConfirmDelete = () => {
    // dispatch(deleteCertification(certId));
    onClose();
  };
  return (
    <><Modal backdrop="static" role="alertdialog" open={open} onClose={onClose} size="xs">
      <Modal.Header>
        <Modal.Title>Delete Certification</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Stack justifyContent='center'>
          <RemindIcon style={{ color: '#ffb300', fontSize: 64 }} /></Stack>
        <Text size='lg'>
          This action cannot be undone. Once deleted, this certification will be permanently removed from your profile.
        </Text>
        <Text size='lg'>
          Are you sure you want to delete this certification entry?
        </Text>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} appearance="subtle">
          Cancel
        </Button>
        <Button onClick={handleConfirmDelete} appearance="primary">
          Yes, Confirm
        </Button>
      </Modal.Footer>
    </Modal></>
  );
};
export const ImageCell = ({ rowData, dataKey, ...props }) => (
  <Cell {...props} style={{ padding: 0 }}>
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
      <img src={rowData[dataKey]} width="40" />
    </div>
  </Cell>
);

export const NameCell = ({ rowData, dataKey, ...props }) => {
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
    <img src={rowData?.imageUrl} width="40" alt={rowData?.title} />
  </div>
      <p>
        <b>Issuer :</b> {rowData?.issuer}
      </p>
      <p>
        <b>Website:</b> <Link to={rowData?.link}>
             {rowData?.link ? rowData?.link : 'Not Available'}
               
            </Link>
      </p>
    </Popover>
  );return (
      <Cell {...props}>
        <Whisper placement="top" speaker={speaker}>
          <a>{rowData?.title}</a>
        </Whisper>
      </Cell>
    );
  }; 
  const CertificationForm1 = ({ open, onClose, certification }) => {
    const [formValue, setFormValue] = useState(initialValues);
    const [formError, setFormError] = useState({});
    const dispatch = useDispatch();
     const formRef = useRef();
    const [content, setContent] = useState('');
  
    const handleChange = (value) => {
      setFormValue(value);
    };
    useEffect(() => {
      if (certification) {
          setFormValue(certification);
          setContent(certification?.description)
      } else {
          setFormValue(initialValues);
      }
  }, [certification]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFileInfo, setImageFileInfo] = useState();
  const [imageFileList, setImageFileList] = useState([]);
  const [imageProgress, setImageProgress] = useState(0);
  const imageUploaderRef = useRef();
  // States for document uploader
  const documentUploaderRef = useRef();
  
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [documentFileInfo, setDocumentFileInfo] = useState();
  const [documentFileList, setDocumentFileList] = useState([]);
  const [documentProgress, setDocumentProgress] = useState(0);
  
  const fileUploadProgress = useSelector((state) => state.auth.fileUploadProgress);
  const addCertificationStatus = useSelector((state) => state.auth.addCertificationStatus);
  const profileFileUrl = useSelector((state) => state.auth?.profileFileUrl);    
  const { addCertificationLoading, editCertificationLoading } = useSelector((state) => state.auth);
  
    const imageProgressStatus = imageProgress  === 100 ? 'success' : null;
    const documentProgressStatus = documentProgress  === 100 ? 'success' : null;
    const imageProgressColor = imageProgress === 100 ? '#52c41a' : '#3385ff';
    const documentProgressColor = documentProgress === 100 ? '#52c41a' : '#3385ff';
   
    const handleContent = (e) => {
      setContent(e);
      setFormValue({ ...formValue, description: e });
    };
  
    useEffect(() => {
      if(uploadingImage){
        setImageProgress(fileUploadProgress);
      }
      else {
        setDocumentProgress(fileUploadProgress);
      }
    }, [fileUploadProgress, uploadingImage,uploadingDocument]);
     
    const handleClear = () => {
      setImageFileInfo();
      setDocumentFileInfo()
      setDocumentFileList([]);
      setImageFileList([]);
      setImageProgress(0);
      setDocumentProgress(0);
      setContent('')
      setFormValue({ ...formValue, imageUrl: '' });
      dispatch({ type: 'PROFILE_FILE_UPLOAD_PROGRESS', payload: 0 });
    };
    useEffect(() => {
      if (addCertificationStatus) {
        onClose();
        handleClear();
      }
    }, [addCertificationStatus]);
  
    useEffect(() => {
      if (!open) {
        setFormValue(initialValues);
        setImageFileInfo();
        setImageFileList([]);
        setImageProgress(0);
        setDocumentFileInfo();
        setDocumentFileList([]);
        setDocumentProgress(0);
      }
    }, [open]);
  
    const handleSubmit = async () => {
      let hasError = false;
       const { startDateMonth, startDateYear, endDateMonth, endDateYear } = formValue;
       const newFormError = { ...formError };
  
      if (startDateYear && endDateYear && startDateMonth && endDateMonth) {
        const start = new Date(`${startDateYear}-${startDateMonth}-01`);
        const end = new Date(`${endDateYear}-${endDateMonth}-01`);
        if (end < start) {
          if (endDateYear < startDateYear) {
            newFormError.endDateYear = 'End year must be after start year.';
          } else if (endDateYear === startDateYear && endDateMonth < startDateMonth) {
            newFormError.endDateMonth = 'End month must be after start month.';
          }
          hasError = true;
        }
      }
      if (content?.length < 1) {
        newFormError.description = 'Description is required';
        hasError = true;
      }
      setFormError(newFormError);
      if (hasError) {
        return;
      }
      if (!formRef.current.check()) {
        console.log(formError);
        return;
      }
       
        dispatch(addCertification(formValue));
    
    };
  
    function previewFile(file, callback) {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result);
      };
      reader.readAsDataURL(file);
    }
  
    const handleImageUpload = () => {
      setUploadingImage(true);
      const file = imageFileList[0];
      previewFile(file.blobFile, value => {
        setImageFileInfo(value);
      });
      console.log("Uploading image", imageFileList);
      dispatch(uploadProfileFiles(file.blobFile));
    };
    const handleDocumentUpload = () => {
      setUploadingDocument(true);
      const file = documentFileList[0];
      previewFile(file.blobFile, value => {
        setDocumentFileInfo(value);
      });
      dispatch(uploadProfileFiles(file.blobFile));
      console.log("Uploading document", documentFileList);
  
    };
  
    
    const handleImageFileRemove = (file) => {
      setImageFileInfo();
      setImageFileList([]);
      setImageProgress(0);
      setFormValue({ ...formValue, imageUrl: '' });
      dispatch({ type: 'PROFILE_FILE_UPLOAD_PROGRESS', payload: 0 });
      if (setUploadingImage) {
        dispatch(removeProfileFiles(file));
      }
    };
  
    const handleDocumentFileRemove = (file) => {
      setDocumentFileInfo();
      setDocumentFileList([]);
      setDocumentProgress(0);
      setFormValue({ ...formValue, link: '' });
      dispatch({ type: 'PROFILE_FILE_UPLOAD_PROGRESS', payload: 0 });
      if (setUploadingDocument) {
        dispatch(removeProfileFiles(file));
      }
    };
    
  
    useEffect(() => {
      if (isURL(profileFileUrl)) {
        if(uploadingImage){
          setUploadingImage(false);
          setFormValue({ ...formValue, imageUrl: profileFileUrl });
        }
        else if(uploadingDocument){
          setUploadingDocument(false);
          setFormValue({ ...formValue, link: profileFileUrl });
        }
       }
    }, [profileFileUrl]);
  
    return (
      <>
        <Drawer size='sm' open={open} onClose={onClose}>
          <Drawer.Header>
            <Drawer.Title>Add Certification Form</Drawer.Title>
            <Drawer.Actions></Drawer.Actions>
          </Drawer.Header>
          <Drawer.Body>
            <Form
              ref={formRef}
              model={model}
              formValue={formValue}
              onCheck={setFormError}
              onChange={handleChange}
              fluid
            >
              <TextField name='title' label="Name *" placeholder='Ex: AWS Certified Solutions Architect' accepter={Input} error={formError.title} />
              <TextField name='issuer' label="Issuing Organization*" placeholder='Ex: Amazon Web Services' accepter={Input} error={formError.issuer} />
              <Form.Group  >
                          <Form.ControlLabel>Issue Date *</Form.ControlLabel>
                          <Row >
                              <Col md={12} sm={24} xs={24}>
                              <Form.Control block name='startDateMonth' placeholder='Select Start Month' accepter={SelectPicker} data={months}></Form.Control>
  
                              </Col>
                              <Col md={12} sm={24} xs={24}>
                              <Form.Control block fluid name='startDateYear' placeholder='Select Start Year' accepter={SelectPicker} data={startYear()}></Form.Control>
  
                              </Col>
                          </Row>
                      </Form.Group>
                      <Form.Group>
                          
                          <Form.ControlLabel>Expiration Date  *</Form.ControlLabel>
                          <Row>
                              <Col md={12} sm={24} xs={24}> 
                              <Form.Control block name='endDateMonth' placeholder='Select End Month' accepter={SelectPicker} data={months}></Form.Control>
                              </Col>
                              <Col md={12} sm={24} xs={24}><Form.Control block name='endDateYear' placeholder='Select End Year' accepter={SelectPicker} data={endYear()}></Form.Control>
                          </Col></Row>
                      </Form.Group>
  
                            <Form.Group>
                <Form.ControlLabel>Description *</Form.ControlLabel>
                <Editor
                  setData={handleContent}
                  readonly={false}
                  className="form-control"
                  placeholder="Write Description here ..."
                  data={content}
                  name='content'
                 />
                {
                              formError.description ? <Text color='red'>{formError.description}</Text> : <></>
                            }
              </Form.Group>
              <TextField name='skills' label="Skills" block  accepter={TagPicker} creatable error={formError.link} />
  
              <TextField name='link' label="Certification Link *" accepter={Input} error={formError.link} />
              <Divider>Or</Divider>
              <Uploader
                disabled={documentProgress == 100}
                multiple={false}
                listType="picture-text"
                onChange={setDocumentFileList}
                fileList={documentFileList}
                onRemove={(file) => handleDocumentFileRemove(file)}
                autoUpload={false}
                renderFileInfo={(file, fileElement) => {
                  return (
                    <>
                      <span>File Name: {file.name}</span>
                    </>
                  );
                }}
                ref={documentUploaderRef}
                draggable>
                <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span>Click or Drag files to this area to upload</span>
                </div>
              </Uploader>
              {documentProgress > 1 ? <Progress.Line percent={documentProgress} strokeColor={documentProgressColor} status={documentProgressStatus} /> : ''}
              <Stack style={{ margin: "15px 0" }} justifyContent='center' spacing={20}>
                <Button disabled={!documentFileList.length} onClick={handleDocumentUpload} loading={uploadingDocument}>Upload</Button>
                <Button onClick={handleDocumentFileRemove}>Clear</Button>
              </Stack>
              <TextField name='cid' label="Certification Id *" accepter={Input} error={formError.cid} />
              <h3>Attachments</h3>
              <TextField value={formValue?.imageUrl} name="imageUrl" checkAsync type="text" label="Certification logo URL *" />
              <Divider>Or</Divider>
              <Uploader
                disabled={imageProgress == 100}
                multiple={false}
                listType="picture-text"
                onChange={setImageFileList}
                fileList={imageFileList}
                onRemove={(file) => handleImageFileRemove(file)}
                autoUpload={false}
                renderFileInfo={(file, fileElement) => {
                  return (
                    <>
                      <span>File Name: {file.name}</span>
                    </>
                  );
                }}
                ref={imageUploaderRef}
                draggable>
                <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span>Click or Drag files to this area to upload</span>
                </div>
              </Uploader>
              {imageProgress > 1 ? <Progress.Line percent={imageProgress} strokeColor={imageProgressColor} status={imageProgressStatus} /> : ''}
              <Stack style={{ margin: "15px 0" }} justifyContent='center' spacing={20}>
                <Button disabled={!imageFileList.length} onClick={handleImageUpload} loading={uploadingImage}>Upload</Button>
                <Button onClick={handleImageFileRemove}>Clear</Button>
              </Stack>
              <FlexboxGrid justify='end'>
                <Stack justifyContent='space-between' alignItems='center' spacing={20}>
                  <Stack.Item>
                    <Button onClick={onClose}>Cancel</Button>
                  </Stack.Item>
                  <Stack.Item>
                    <Button onClick={handleSubmit} appearance="primary" loading={addCertificationLoading || editCertificationLoading} disabled={addCertificationLoading || editCertificationLoading}>
                    {certification ? <>
                      {addCertificationLoading ? 'Updating...' : 'Update Certification'}
                     </>: <>{addCertificationLoading ? 'Adding...' : 'Add Certification'}</>}
                    
                    </Button>
                  </Stack.Item>
                </Stack>
              </FlexboxGrid>
            </Form>
          </Drawer.Body>
        </Drawer>
      </>
    );
  };
const CertificationList = ({ certificationList , certificationListLoading}) => {
  const [open, setOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
  const onClose = () => {
    setOpen(false);
  };
 
  const onCloseDelete = () => {
    setOpenDelete(false);
  };
  const SearchStyle = {
    width: 300,
  };
  const [searchInputValue, setSearchInputValue] = useState('');
  const [tableLoading, setTableLoading] = useState(certificationListLoading);
  const [tableData, setTableData] = useState([]);
  const [sortColumn, setSortColumn] = useState();
  const [sortType, setSortType] = useState();
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [displayType, setDisplayType] = useState('table');
  const [selectedItem, setSelectedItem] = useState();
 
  const handleChangeLimit = dataKey => {
    setPage(1);
    setLimit(dataKey);
  };
  const getData = () => {
    if (sortColumn && sortType) {
      return tableData?.sort((a, b) => {
        let x = a[sortColumn];
        let y = b[sortColumn];
        if (typeof x === 'string') {
          x = x.charCodeAt();
        }
        if (typeof y === 'string') {
          y = y.charCodeAt();
        }
        if (sortType === 'asc') {
          return x - y;
        } else {
          return y - x;
        }
      });
    } else {
      return tableData?.length ? tableData?.filter((v, i) => {
        const start = limit * (page - 1);
        const end = start + limit;
        return i >= start && i < end;
      }) : [];
    }
  };

  const handleSortColumn = (sortColumn, sortType) => {
    setTableLoading(true);
    setTimeout(() => {
      setTableLoading(false);
      setSortColumn(sortColumn);
      setSortType(sortType);
    }, 500);
  };
  const handleInputChange = (e) => {
    if (e?.length > 0) {
      setTableLoading(true);
      const certificationList = [...certificationList];
      const filteredData = certificationList?.filter((cert) =>
        cert?.title?.toLowerCase().includes(e?.toLowerCase()) ||
        cert?.issuer?.toLowerCase().includes(e?.toLowerCase())
      );
      setTableData(filteredData);
      setTimeout(() => {
        setTableLoading(false);
      }, 500);
    } else {
      setTableData(certificationList);
    }
    setSearchInputValue(e);
  };
  const handleSearch = () => {
    if (searchInputValue?.length > 0) {
      setTableLoading(true);
      const certificationList = [...certificationList];
      const filteredData = certificationList?.filter((cert) =>
        cert?.title?.toLowerCase().includes(searchInputValue?.toLowerCase()) ||
        cert?.issuer?.toLowerCase().includes(searchInputValue?.toLowerCase())
      );
      setTableData(filteredData);
      setTimeout(() => {
        setTableLoading(false);
      }, 500);
    } else {
      setTableData(certificationList);
    }
  };

  useEffect(() => {
    setTableLoading(true);
    setTableData(certificationList || []);
    setTableLoading(false);
  }, [certificationList, limit]);

  const handleEdit = (cert) => {
    if (cert) {
      setSelectedItem(cert);
      setOpen(true);
    }
  };
  const handleDelete = (cert) => {
    if (cert) {
      setSelectedItem(cert);
      setOpenDelete(true);
    }
  };

  const ActionCell = ({ rowData, ...props }) => {
    return (
      <Cell {...props}>
        <Stack justifyContent='center' wrap spacing={20} alignItems='flex-start'>
          <IconButton circle size='sm' icon={<MdEdit className='rs-icon' />} onClick={() => handleEdit(rowData)} />
          <IconButton circle size='sm' icon={<MdDelete className='rs-icon' />} onClick={() => handleDelete(rowData)} />
        </Stack>
      </Cell>
    );
  };
  
  
  return (
    <div>
      <CertificationForm open={open} onClose={onClose} certification={selectedItem}/>
        <RemoveCertification certId={selectedItem?.id} open={openDelete} onClose={onCloseDelete} />
         
      <FlexboxGrid justify='end' style={{ marginBottom: '20px' }}>
        <FlexboxGrid.Item>
          <Stack spacing={5} justifyContent="space-between">
            <InputGroup inside style={SearchStyle}>
              <Input onChange={handleInputChange} value={searchInputValue} />
              <InputGroup.Button>
                <SearchIcon onClick={handleSearch} />
              </InputGroup.Button>
            </InputGroup>
            <ButtonToolbar>
              <IconButton icon={<TableIcon />} onClick={() => setDisplayType('table')} active={displayType == 'table' ? true : false}></IconButton>
              <IconButton icon={<ListIcon />} onClick={() => setDisplayType('list')} active={displayType == 'list' ? true : false}></IconButton>
            </ButtonToolbar>
            <Button startIcon={<PlusIcon />} onClick={() => setOpen(true)}>Add</Button>
          </Stack>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item>
        </FlexboxGrid.Item>
      </FlexboxGrid>

      {displayType == 'table' ?
        <>
          <Table height={420} data={getData()}
            sortColumn={sortColumn}
            bordered cellBordered
            sortType={sortType}
            onSortColumn={handleSortColumn}
            loadAnimation
            loading={tableLoading}>
            <Column width={50} align="center" fixed>
              <HeaderCell>#</HeaderCell>
              <Cell>
                {(rowData, rowIndex) => {
                  return <div>{rowIndex + 1}</div>;
                }}
              </Cell>
            </Column>
            
            <Column flexGrow={2} sortable>
              <HeaderCell align="center">Title</HeaderCell>
              <NameCell dataKey="title">
                {rowData => rowData?.title}
              </NameCell>
            </Column>
            <Column flexGrow={2}>
              <HeaderCell align="center">Issuer</HeaderCell>
              <Cell dataKey="issuer" />
            </Column>
            <Column flexGrow={2} sortable>
              <HeaderCell align="center">Issue & Expiration Date</HeaderCell>
              <Cell  dataKey="title">
            {rowData => 
                rowData?.startDateMonth+ ' ' + rowData?.startDateYear + ' - '+ rowData?.endDateMonth+ ' ' + rowData?.endDateYear
            }   
          </Cell>
            </Column>
            <Column flexGrow={1}>
              <HeaderCell align="center">Last Updated</HeaderCell>
              <Cell dataKey='updatedAt'>
                {rowData => <Timestamp relative autoUpdate date={rowData?.updatedAt?.toDate()?.toString()} />}
              </Cell>
            </Column>
            <Column width={120} align="center">
              <HeaderCell>
                <MoreIcon />
              </HeaderCell>
              <ActionCell dataKey="id" />
            </Column>
          </Table>
        </> :
        <div style={{ minHeight: '60vh' }}>
          <Stack spacing={20} justifyContent='center' alignItems='center' wrap style={{ maxHeight: '60vh', overflow: 'auto' }}>
            {getData().map((cert) => {
              return (
                <UserContentPanel data={cert} styles={true} />
              );
            })}
            {tableData.length <= 0 ? <Stack.Item>No Data Found.</Stack.Item> : <></>}
          </Stack>
        </div>}
      <div style={{ padding: 20 }}>
        <Pagination
          prev
          next
          first
          last
          ellipsis
          boundaryLinks
          maxButtons={5}
          size="xs"
          layout={['total', '-', 'limit', '|', 'pager', 'skip']}
          total={tableData?.length}
          limitOptions={[10, 30, 50]}
          limit={limit}
          activePage={page}
          onChangePage={setPage}
          onChangeLimit={handleChangeLimit}
        />
      </div>
    </div>
  );
};

const CertificationPage = ({ getCertificationList, certificationListLoading, certificationList }) => {
  useEffect(() => {
    getCertificationList();
  }, []);
  return (
    <Panel
      header={
        <>
          <h2 className="title">Certification Management</h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item>Admin</Breadcrumb.Item>
            <Breadcrumb.Item active>Certification Management</Breadcrumb.Item>
          </Breadcrumb>
        </>
      }
    >
      <CertificationList certificationList={certificationList} certificationListLoading={certificationListLoading} />
    </Panel>
  );
};

const mapDispatchToProps = dispatch => ({
  getCertificationList: () => dispatch(getCertificationList()),
});
const mapStateToProps = state => ({
  certificationListLoading: state.auth?.certificationListLoading,
  certificationList: state.auth?.certifications,
});
export default connect(mapStateToProps, mapDispatchToProps)(CertificationPage);          