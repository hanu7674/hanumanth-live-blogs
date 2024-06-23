// src/components/EducationForm.js
import React, { useEffect, useRef, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Form,Row, Col, FormGroup, ControlLabel, Button, Schema, IconButton, ButtonToolbar, Input, Drawer, SelectPicker, Stack, Divider, Uploader, Progress, Breadcrumb, Text } from 'rsuite';
import PlusIcon from '@rsuite/icons/Plus';
import TrashIcon from '@rsuite/icons/Trash';
import { addEducation, deleteEducation, editEducation, getEducationList, removeProfileFiles, uploadProfileFiles } from '../../../redux/auth';
import { TextField } from '../../Auth/FormFields';
import { endYear, excerpt, isURL, months, startYear } from '../../../assets/constants';
import TableIcon from '@rsuite/icons/legacy/Table';
import ListIcon from '@rsuite/icons/legacy/ListAlt';
import SearchIcon from '@rsuite/icons/Search';
import MoreIcon from '@rsuite/icons/legacy/More';
import Editor from '../../Blogs/Editor'
import RemindIcon from '@rsuite/icons/legacy/Remind';

import { Table, Pagination, Popover, Whisper, Modal,
	InputGroup, FlexboxGrid, Dropdown, Tag, Panel, Avatar} from 'rsuite';
import Timestamp from 'react-timestamp';
import { Link } from 'react-router-dom';
import { MdDelete, MdEdit } from 'react-icons/md';
const { StringType } = Schema.Types;

const model = Schema.Model({
  school: StringType().isRequired('Title is required'),
   degree: StringType().isRequired('Degree is required'),
  fieldOfStudy: StringType().isRequired('Field of Study is required'),
  startDateMonth: StringType().isRequired('Program Start Month is required.'),  
  startDateYear: StringType().isRequired('Program Start Year is required.'),  
  endDateMonth: StringType().isRequired('Program End Month is required.'),    
  endDateYear: StringType().isRequired('Program End Year is required.'),    
  grade: StringType(),
  location: StringType(),
  activitiesAndSocieties: StringType(),
  description: StringType().isRequired('Description is required'),
  link:  StringType().addRule((value) => isURL(value), 'Please enter a valid URL').isRequired('This field is required.'),
  imageUrl: StringType().addRule((value) => isURL(value), 'Please enter a valid URL').isRequired('This field is required.'),
});
const initialValues = {
  school: "",  
  location: '',
  degree: "",   
  fieldOfStudy: "",  
  startDateMonth: "",  
  startDateYear: "",   
  endDateMonth: "",     
  endDateYear: "",     
  grade: "",           
  activitiesAndSocieties: "", 
  description: "",   
  imageUrl: "",
  link: ''
}
const EducationForm = ({open, onClose}) => {
  const [formValue, setFormValue] = useState(initialValues);
  const [formError, setFormError] = useState({});
  const dispatch = useDispatch();
  const { addEducationLoading, addEducationError } = useSelector((state) => state.auth);
  const formRef = useRef();
  const [content, setContent] = useState('')

  const handleChange = (value) => {
    setFormValue(value);
  };
 

 
 
 
  const [uploading, setUploading] = React.useState(false);
  const [fileInfo, setFileInfo] = React.useState();
  const [fileList, setFileList] = React.useState([]);
  const uploader = React.useRef();
  const [fileUploaded, setFileUploaded] = useState(false);

  const fileUploadProgress = useSelector((state) => state.auth.fileUploadProgress);
  const addEducationStatus = useSelector((state) => state.auth.addEducationStatus);
   const profileFileUrl = useSelector((state) => state.auth?.profileFileUrl);
  const status = fileUploadProgress === 100 ? 'success' : null;
  const color = fileUploadProgress === 100 ? '#52c41a' : '#3385ff';
  const [progress, setProgress] = useState(0);
  const handleContent = (e) => {
    setContent(e)
    setFormValue({ ...formValue, description: e })
  }
  useEffect(() => {
    setProgress(fileUploadProgress);
  }, [fileUploadProgress])
  
  useEffect(()=>{
    if(!open){
      setFormValue(initialValues)
      setFileInfo();
    setFileList([]);
    setProgress(0);
    }
  },[open])
  const handleSubmit = async () => {
    const { startDateMonth, startDateYear, endDateMonth, endDateYear } = formValue;
    let hasError = false;
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
    if(content?.length < 1){
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
    dispatch(addEducation(formValue));
    setFormValue({ 
    });
  };
   function previewFile(file, callback) {
    const reader = new FileReader();
    reader.onloadend = () => {
      callback(reader.result);
    };
    reader.readAsDataURL(file);
  }
  const handleImageUpload = () => {
    setUploading(true);
    const file = fileList[0];
    previewFile(file.blobFile, value => {
      setFileInfo(value);
    })
    dispatch(uploadProfileFiles(file.blobFile))
  }
  const handleFileRemove = (file) => {
    setFileInfo();
    setFileList([]);
    setProgress(0);
     setFormValue({ ...formValue, imageUrl: '' })
    dispatch({ type: 'PROFILE_FILE_UPLOAD_PROGRESS', payload: 0 });
    if (fileUploaded) {
      dispatch(removeProfileFiles(file));
    }
  }
  const handleClear = () => {
    setFileInfo();
    setFileList([]);
    setContent('')
    setProgress(0);
     setFormValue({ ...formValue, imageUrl: '' })
    dispatch({ type: 'PROFILE_FILE_UPLOAD_PROGRESS', payload: 0 })

  }
  useEffect(() => {
    if(addEducationStatus){
      onClose();
      handleClear();
    }
  }, [addEducationStatus])
  useEffect(() => {
    if (isURL(profileFileUrl)) {
       setFileUploaded(true)
      setFormValue({ ...formValue, imageUrl: profileFileUrl });
      setUploading(false)
    }
  }, [profileFileUrl])
   return (
    <>
        <Drawer size= 'sm' open={open} onClose={onClose} >
        <Drawer.Header>
          <Drawer.Title>Add Education Form</Drawer.Title>
          <Drawer.Actions>
             
          </Drawer.Actions>
        </Drawer.Header>
            <Drawer.Body>
            <Form
        ref={ formRef}
        model={model}
        formValue={formValue}
        onCheck={setFormError}
        onChange={handleChange}
        fluid
      >
        <TextField name='school' label="School*" placeholder='Ex: Boston University' accepter={Input} error={formError.school}/>
        {/* <TextField name='alt_name' label="School Alt Name*" accepter={Input} error={formError.alt_name}/> */}
        <TextField name='degree' label="Degree*" placeholder={"Ex: Bachelor's"} accepter={Input} error={formError.degree}/>
        <TextField name='fieldOfStudy' label="Field of Study*" placeholder={"Ex: Business"} accepter={Input} error={formError.fieldOfStudy}/>
        <Form.Group  >
                        <Form.ControlLabel>Start Date</Form.ControlLabel>
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
                        
                        <Form.ControlLabel>End Date (or Expected)</Form.ControlLabel>
                        <Row>
                            <Col md={12} sm={24} xs={24}> 
                            <Form.Control block name='endDateMonth' placeholder='Select End Month' accepter={SelectPicker} data={months}></Form.Control>
                            </Col>
                            <Col md={12} sm={24} xs={24}><Form.Control block name='endDateYear' placeholder='Select End Year' accepter={SelectPicker} data={endYear()}></Form.Control>
                        </Col></Row>
                    </Form.Group>
        <TextField name='grade' label="Grade" accepter={Input} error={formError.grade}/>
        <TextField name='ActivitiesAndSocieties' label="Activities and societies" accepter={Input} error={formError.ActivitiesAndSocieties}/>
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
                        </Form.Group>        <TextField name='location' label="Location "   accepter={Input} error={formError.location}/>
        <TextField name='link' label="School Website Link" accepter={Input} error={formError.link}/>
          <h3>Attachments</h3>
        <TextField  value={formValue?.imageUrl} name="imageUrl" checkAsync type="text" label="School logo URL" />
        <Divider  >Or</Divider>
        <Uploader
          disabled={progress == 100}
          multiple={false}
          listType="picture-text"
          onChange={setFileList}
          fileList={fileList}
          onRemove={(file) => handleFileRemove(file)}
          autoUpload={false}
          renderFileInfo={(file, fileElement) => {
            return (
              <>
                <span>File Name: {file.name}</span>

              </>
            );
          }}
          ref={uploader}
          draggable>
          <div style={{ height: 200,   display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span>Click or Drag files to this area to upload</span>
          </div>
        </Uploader>

        {
          progress > 1 ? <>
            <Progress.Line percent={progress} strokeColor={color} status={status} />
          </> : ''
        }
       <Stack style={{ margin: "15px 0" }} justifyContent='center' spacing={20}>
          <Button disabled={!fileList.length}
            onClick={
              handleImageUpload
            }
            loading={uploading}
          >Upload</Button>
          <Button onClick={handleClear}>Clear</Button>
        </Stack>
        <FlexboxGrid justify='end'>
          <Stack justifyContent='space-between' alignItems='center' spacing={20}>
            <Stack.Item>
              <Button onClick={onClose}> Cancel</Button>
            </Stack.Item>
        <Stack.Item >
          <Button
            onClick={handleSubmit}
            appearance="primary"
            disabled={addEducationLoading}
          >
            {addEducationLoading ? 'Adding...' : 'Add Education'}
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
const EducationEditForm = ({open, onClose, edu}) => {
  const [formValue, setFormValue] = useState(initialValues);
  const [formError, setFormError] = useState({});
  const dispatch = useDispatch();
  const { editEducationLoading, editEducationError } = useSelector((state) => state.auth);
  const formRef = useRef();
  const handleChange = (value) => {
    setFormValue(value);
  };
 useEffect(()=>{
    setFormValue(edu)
    setContent(edu?.description)
 }, [edu])
 const [content, setContent] = useState('')
  const handleContent = (e) => {
    setContent(e)
    setFormValue({ ...formValue, description: e })
  }
  const handleSubmit = async () => {
    const { startDateMonth, startDateYear, endDateMonth, endDateYear } = formValue;
    let hasError = false;
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
    if(content?.length < 1){
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
    dispatch(editEducation(edu?.id, formValue));
    setFormValue({
    });
  };
  
  const [uploading, setUploading] = React.useState(false);
  const [fileInfo, setFileInfo] = React.useState();
  const [fileList, setFileList] = React.useState([]);
  const uploader = React.useRef();
  const [fileUploaded, setFileUploaded] = useState(false);

  const fileUploadProgress = useSelector((state) => state.auth.fileUploadProgress);
  const editEducationStatus = useSelector((state) => state.auth.editEducationStatus);
   const profileFileUrl = useSelector((state) => state.auth?.profileFileUrl);
  const status = fileUploadProgress === 100 ? 'success' : null;
  const color = fileUploadProgress === 100 ? '#52c41a' : '#3385ff';
  const [progress, setProgress] = useState(0);
 
  useEffect(() => {
    setProgress(fileUploadProgress);
  }, [fileUploadProgress])
  
  useEffect(()=>{
    if(!open){
      setFormValue(initialValues)
      setFileInfo();
    setFileList([]);
    setProgress(0);
    }
  },[open])
   function previewFile(file, callback) {
    const reader = new FileReader();
    reader.onloadend = () => {
      callback(reader.result);
    };
    reader.readAsDataURL(file);
  }
  const handleImageUpload = () => {
    setUploading(true);
    const file = fileList[0];
    previewFile(file.blobFile, value => {
      setFileInfo(value);
    })
    dispatch(uploadProfileFiles(file.blobFile))
  }
  const handleFileRemove = (file) => {
    setFileInfo();
    setFileList([]);
    setProgress(0);
     setFormValue({ ...formValue, imageUrl: '' })
    dispatch({ type: 'PROFILE_FILE_UPLOAD_PROGRESS', payload: 0 });
    if (fileUploaded) {
      dispatch(removeProfileFiles(file));
    }
  }
  const handleClear = () => {
    setFileInfo();
    setContent('')
    setFileList([]);
    setProgress(0);
     setFormValue({ ...formValue, imageUrl: '' })
    dispatch({ type: 'PROFILE_FILE_UPLOAD_PROGRESS', payload: 0 })

  }
  useEffect(() => {
    if(editEducationStatus){
      onClose();
      handleClear();
    }
  }, [editEducationStatus])
  useEffect(() => {
    if (isURL(profileFileUrl)) {
       setFileUploaded(true)
      setFormValue({ ...formValue, imageUrl: profileFileUrl });
      setUploading(false)
    }
  }, [profileFileUrl])
   return (
    <>
        <Drawer size= 'sm' open={open} onClose={onClose} >
        <Drawer.Header>
          <Drawer.Title>Edit Education Form</Drawer.Title>
          <Drawer.Actions>
             
          </Drawer.Actions>
        </Drawer.Header>
            <Drawer.Body>
             <Form
        ref={ formRef}
        model={model}
        formValue={formValue}
        onCheck={setFormError}
        onChange={handleChange}
        fluid
      >
        <TextField name='school' label="School*" placeholder='Ex: Boston University' accepter={Input} error={formError.school}/>
        {/* <TextField name='alt_name' label="School Alt Name*" accepter={Input} error={formError.alt_name}/> */}
        <TextField name='degree' label="Degree*" placeholder={"Ex: Bachelor's"} accepter={Input} error={formError.degree}/>
        <TextField name='fieldOfStudy' label="Field of Study*" placeholder={"Ex: Business"} accepter={Input} error={formError.fieldOfStudy}/>
        <Form.Group  >
                        <Form.ControlLabel>Start Date</Form.ControlLabel>
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
                        
                        <Form.ControlLabel>End Date (or Expected)</Form.ControlLabel>
                        <Row>
                            <Col md={12} sm={24} xs={24}> 
                            <Form.Control block name='endDateMonth' placeholder='Select End Month' accepter={SelectPicker} data={months}></Form.Control>
                            </Col>
                            <Col md={12} sm={24} xs={24}><Form.Control block name='endDateYear' placeholder='Select End Year' accepter={SelectPicker} data={endYear()}></Form.Control>
                        </Col></Row>
                    </Form.Group>

 
        <TextField name='grade' label="Grade" accepter={Input} error={formError.grade}/>
        <TextField name='ActivitiesAndSocieties' label="Activities and societies" accepter={Input} error={formError.ActivitiesAndSocieties}/>
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
                        </Form.Group>        <TextField name='location' label="Location "   accepter={Input} error={formError.location}/>
        <TextField name='link' label="School Website Link" accepter={Input} error={formError.link}/>
          <h3>Attachments</h3>
        <TextField  value={formValue?.imageUrl} name="imageUrl" checkAsync type="text" label="School logo URL" />
        <Divider  >Or</Divider>
        <Uploader
          disabled={progress == 100}
          multiple={false}
          listType="picture-text"
          onChange={setFileList}
          fileList={fileList}
          onRemove={(file) => handleFileRemove(file)}
          autoUpload={false}
          renderFileInfo={(file, fileElement) => {
            return (
              <>
                <span>File Name: {file.name}</span>

              </>
            );
          }}
          ref={uploader}
          draggable>
          <div style={{ height: 200,   display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span>Click or Drag files to this area to upload</span>
          </div>
        </Uploader>

        {
          progress > 1 ? <>
            <Progress.Line percent={progress} strokeColor={color} status={status} />
          </> : ''
        }
       <Stack style={{ margin: "15px 0" }} justifyContent='center' spacing={20}>
          <Button disabled={!fileList.length}
            onClick={
              handleImageUpload
            }
            loading={uploading}
          >Upload</Button>
          <Button onClick={handleClear}>Clear</Button>
        </Stack>
        <FlexboxGrid justify='end'>

        
          <Stack justifyContent='space-between' alignItems='center' spacing={20}>
            <Stack.Item>
              <Button onClick={onClose}> Cancel</Button>
            </Stack.Item>
        <Stack.Item >
          <Button
            onClick={handleSubmit}
            appearance="primary"
            disabled={editEducationLoading}
          >
            {editEducationLoading ? 'Adding...' : 'Save'}
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
const { Column, HeaderCell, Cell, ColumnGroup } = Table;
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
      <img loading="lazy"  src={rowData[dataKey]} width="40" />
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
    <img loading="lazy"  src={rowData?.imageUrl} width="40" alt={rowData?.school} />
  </div>
      <p>
        <b>School Name:</b> {rowData?.school}
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
          <a>{rowData?.school}</a>
        </Whisper>
      </Cell>
    );
  }; 
  const UserContentPanel = ({ data, header, styles }) => {
     
    return (
      <>        <Panel shaded bordered bodyFill className={styles ? `user-content-panel` : ''}  style={{ display: 'inline-block' }}>
    <Stack justifyContent='center'>
    <img loading="lazy"  src={data.imageUrl} height="150" />

    </Stack>
 
        <Panel     >
        {/* {JSON.stringify(data)} */}

  
         
        <Stack justifyContent='center' wrap spacing={5}  >
          <Stack.Item>
            <Text size='xxl' align='center'>
            <Link to={data.link}>
              {
              excerpt( data.school, 50)
            }
            </Link>
            </Text>
            
          </Stack.Item>
          </Stack>
          <Stack justifyContent='center' wrap spacing={5} style={{ marginTop: '20px' }}>
          <Stack.Item>
            {
             data?.degree
            }
          </Stack.Item>
          </Stack>
          <Stack justifyContent='center' wrap spacing={5} style={{ marginTop: '20px' }}>
          <Stack.Item>
            {
             data?.fieldOfStudy
            }
          </Stack.Item>
          </Stack>
        <Stack justifyContent='center' wrap spacing={5} style={{ marginTop: '20px' }}>
          <Stack.Item>
            {
             data?.startDateMonth+ ' ' + data?.startDateYear + ' - '+ data?.endDateMonth+ ' ' + data?.endDateYear
            }
          </Stack.Item>
          </Stack>
          <Stack justifyContent='center' wrap spacing={5} style={{ marginTop: '20px' }}>
          <Stack.Item>
            Grade: {
              data?.grade ? data?.grade : 0
            }
          </Stack.Item>
          </Stack>
 
        
      </Panel>
      </Panel>
      </>
    )
  }

  const RemoveEducation = ({open, eduId, onClose}) => {
    const dispatch = useDispatch();
    const handleConfirmDelete = ( ) => {
       dispatch(deleteEducation(eduId))
      onClose();
    }
    return (
      <><Modal backdrop="static" role="alertdialog" open={open} onClose={onClose} size="xs">
        <Modal.Header>
          <Modal.Title>Delete Education</Modal.Title>
        </Modal.Header>
      <Modal.Body>
        <Stack justifyContent='center'>
        <RemindIcon style={{ color: '#ffb300', fontSize: 64 }} /></Stack>
        <Text size='lg'>
          This action cannot be undone. Once deleted, this education experience will be permanently removed from your profile.
        </Text>
        <Text size='lg'>
           Are you sure you want to delete this education entry ?
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
    )
  }
const UserList = ({educationList,  }) => {

  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const onClose = () => {
    setOpen(false)
  }
  const onCloseEdit = () => {
    setOpenEdit(false)
  }
  const onCloseDelete = () => {
    setOpenDelete(false)
  }
  const SearchStyle = {
    width: 300,
  };
  const [searchInputValue, setSearchInputValue] = useState('');
  const [tableLoading, setTableLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [sortColumn, setSortColumn] = useState();
  const [sortType, setSortType] = useState();
  const [limit, setLimit] = React.useState(10);
  const [page, setPage] = React.useState(1);
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
    }
    else{
        return tableData?.length ? tableData?.filter((v, i) => {
        const start = limit * (page - 1);
        const end = start + limit;
        return i >= start && i < end;
    }): []}
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
      const educationListList = [...educationList];
      const filteredData = educationListList?.filter((edu) =>
      edu?.school?.toLowerCase().includes(e?.toLowerCase()) ||
      edu?.degree?.toLowerCase().includes(e?.toLowerCase()) ||
      edu?.fieldOfStudy?.toLowerCase().includes(e?.toLowerCase()) 
       )
      setTableData(filteredData);
      setTimeout(() => {
        setTableLoading(false)
      }, 500);
    }
    else {
      setTableData(educationList)
    }
    setSearchInputValue(e)
  }
  const handleSearch = () => {
    if (searchInputValue?.length > 0) {
      setTableLoading(true);
      const educationListList = [...educationList];
       
      const filteredData = educationListList?.filter((edu) =>
      edu?.school?.toLowerCase().includes(searchInputValue?.toLowerCase()) ||
      edu?.degree?.toLowerCase().includes(searchInputValue?.toLowerCase()) ||
      edu?.fieldOfStudy?.toLowerCase().includes(searchInputValue?.toLowerCase()) 
       )
      setTableData(filteredData);
      setTimeout(() => {
        setTableLoading(false);
      }, 500);
    }
    else {
      setTableData(educationList)
    }
  }
  useEffect(() => {
    setTableLoading(true);
    setTableData(educationList || []);
    setTableLoading(false);
  }, [educationList, limit]);

  const handleEdit = (edu) => {
    if(edu){
      setSelectedItem(edu);
      setOpenEdit(true)
    }
  }
  const handleDelete = (edu) =>{ 
    if(edu){
      setSelectedItem(edu);
      setOpenDelete(true)
    }

  }
  const ActionCell = ({rowData, ...props}) => {
    return(
      <Cell {...props}>
        <Stack justifyContent='center' wrap spacing={20} alignItems='flex-start'>
        <IconButton circle size='sm' icon={<MdEdit className='rs-icon'/>}  onClick={() =>handleEdit(rowData)}/>
        <IconButton circle size='sm' icon={<MdDelete className='rs-icon'/>} onClick={() =>handleDelete(rowData)}/>
        </Stack>
      </Cell>
    )
  }
    return (
      <div  >
                 <EducationForm open={open} onClose={onClose}/>
                 <EducationEditForm edu={selectedItem}  open={openEdit} onClose={onCloseEdit}/>
                  <RemoveEducation eduId={selectedItem?.id}  open={openDelete} onClose={onCloseDelete}/>
         
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
              <IconButton icon={<TableIcon />} onClick={() => setDisplayType('table')} active={displayType =='table' ? true : false}></IconButton>
              <IconButton icon={<ListIcon />} onClick={() => setDisplayType('list')} active={displayType =='list' ? true : false}></IconButton>
            </ButtonToolbar>
            <Button startIcon={<PlusIcon />} onClick={() => setOpen(true)}>Add </Button>

        </Stack></FlexboxGrid.Item>
          <FlexboxGrid.Item>
          </FlexboxGrid.Item>
        </FlexboxGrid>
            
        {
          displayType == 'table' ? 
				            <>   
				            <Table height={420}   data={getData() } 
            sortColumn={sortColumn}
            bordered cellBordered
            sortType={sortType}
            onSortColumn={handleSortColumn}
            loading={tableLoading}>
              <Column width={50} align="center" fixed>
    <HeaderCell>#</HeaderCell>
    <Cell>
      {(rowData, rowIndex) => {
        return <div>{rowIndex + 1}</div>;
      }}
    </Cell>
  </Column>
  <Column flexGrow={1} align="center">
          <HeaderCell>School Logo</HeaderCell>
          <ImageCell dataKey="imageUrl" />
        </Column>
        
  <Column  flexGrow={2}  sortable>
          <HeaderCell align="center">School Name</HeaderCell>
          <NameCell  dataKey="school">
            {rowData => 
                rowData?.school
            }   
          </NameCell>
        </Column>
        
        <Column  flexGrow={2}>
          <HeaderCell align="center">Degree</HeaderCell>
          <Cell  dataKey="degree"/>
             
        </Column><Column  flexGrow={2}>
          <HeaderCell align="center">Field of Study</HeaderCell>
          <Cell  dataKey="fieldOfStudy"/>
             
        </Column>
        <Column  flexGrow={2} sortable>
          <HeaderCell align="center">Program Start & End</HeaderCell>
          <Cell  dataKey="school">
            {rowData => 
                rowData?.startDateMonth+ ' ' + rowData?.startDateYear + ' - '+ rowData?.endDateMonth+ ' ' + rowData?.endDateYear
            }   
          </Cell>
        </Column>
        <Column  flexGrow={1}>
          <HeaderCell align="center">last UpdatedAt</HeaderCell>
          <Cell  dataKey='updatedAt'>
          { rowData =>
                                              <Timestamp relative autoUpdate date={rowData?.updatedAt?.toDate()?.toString()} /> 
                                        }
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
      <div style={{minHeight: '60vh'}}> 
      <Stack spacing={20} justifyContent='center' alignItems='center'  wrap style={{maxHeight: '60vh', overflow: 'auto'}}>
      {
        getData().map((user) => {
          return(
            <UserContentPanel   data={user} styles={true}/>
            )
          })
        }
        {
          tableData.length <=0 ? <Stack.Item>No Data Found.</Stack.Item> : <></>
        }
        </Stack>
       </div> }
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

}


const EducationPage = ({getEducationList, educationListLoading, educationList}) => {
  
    useEffect(()=> {
      getEducationList();
    },[])
    return(
           <Panel
      header={
        <>
          <h2 className="title">Education Management</h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item >Admin</Breadcrumb.Item>
             <Breadcrumb.Item active>Education Management</Breadcrumb.Item>
          </Breadcrumb>
        </>
      }
    >
         <UserList educationList={educationList} />
         </Panel>
     )
}
const mapDispatchToProps = dispatch => ({
  getEducationList: () => dispatch(getEducationList()),
});
const mapStateToProps = state => ({
  educationListLoading: state.auth?.educationListLoading,
  educationList: state.auth?.educationList,
 });
export default connect(mapStateToProps, mapDispatchToProps)(EducationPage);