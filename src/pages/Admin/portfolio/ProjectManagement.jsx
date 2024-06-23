import React, { useEffect, useRef, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Form,Row, Col, Button, Schema, IconButton, ButtonToolbar, Input, Drawer, SelectPicker, Stack, Divider, Uploader, Progress, Breadcrumb, Text, DateRangePicker } from 'rsuite';
import PlusIcon from '@rsuite/icons/Plus';
import TrashIcon from '@rsuite/icons/Trash';
import { addProject, deleteProject, editProject, getProjectList, removeProfileFiles, uploadProfileFiles } from '../../../redux/auth';
import { TextField, Textarea } from '../../Auth/FormFields';
import { endYear, excerpt, isURL, months, startYear } from '../../../assets/constants';
import TableIcon from '@rsuite/icons/legacy/Table';
import ListIcon from '@rsuite/icons/legacy/ListAlt';
import SearchIcon from '@rsuite/icons/Search';
import MoreIcon from '@rsuite/icons/legacy/More';
import RemindIcon from '@rsuite/icons/legacy/Remind';
import { Table, Pagination, Popover, Whisper, Modal, InputGroup, FlexboxGrid, Dropdown, Tag, Panel, Avatar } from 'rsuite';
import Timestamp from 'react-timestamp';
import { Link } from 'react-router-dom';
import { MdDelete, MdEdit } from 'react-icons/md';
import Editor from '../../Blogs/Editor'
 
const { StringType } = Schema.Types;
function isValidDate(dateString) {
  const regEx = /^\d{4}-\d{2}-\d{2}$/;
  if (!regEx.test(dateString)) {
    return false;
  }
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  return (date && (year === date.getFullYear()) && (month === date.getMonth()) && (day === date.getDate()));
}
const model = Schema.Model({
  projectName: StringType().isRequired('Project Name is required'),
  projectDescription: StringType().isRequired('Project Description is required'),
  startDateMonth: StringType().isRequired('Project Start Month is required.'),  
  startDateYear: StringType().isRequired('Project Start Year is required.'),  
  location: StringType(),
  endDateMonth: StringType().isRequired('End Month is required.'),
  endDateYear: StringType().isRequired('End Year is required.'),
  projectStatus: StringType().isRequired('Project Status is required'),
  projectUrl: StringType().addRule((value) => isURL(value), 'Please enter a valid URL').isRequired('Project URL is required'),
  imageUrl: StringType().addRule((value) => isURL(value), 'Please enter a valid URL').isRequired('Project Image Thumbnail is required'),
});
 
const initialValues = {
  projectName: "",
  location: '',
  projectDescription: "",
   projectStatus: "",
  projectUrl: "",
  imageUrl: "",
  startDateMonth: "",  
  startDateYear: "",   
  endDateMonth: "",     
  endDateYear: "",   
};

const ProjectForm = ({ open, onClose }) => {
  const [formValue, setFormValue] = useState(initialValues);
  const [formError, setFormError] = useState({});
  const dispatch = useDispatch();
  const { addProjectLoading, addProjectError } = useSelector((state) => state.auth);
  const formRef = useRef();

  const handleChange = (value) => {
    setFormValue(value);
  };
 
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
    dispatch(addProject(formValue));
    setFormValue(initialValues);
  };

  const [uploading, setUploading] = useState(false);
  const [fileInfo, setFileInfo] = useState();
  const [fileList, setFileList] = useState([]);
  const uploader = useRef();
  const [fileUploaded, setFileUploaded] = useState(false);

  const fileUploadProgress = useSelector((state) => state.auth.fileUploadProgress);
  const addProjectStatus = useSelector((state) => state.auth.addProjectStatus);
  const addProjectFileUrl = useSelector((state) => state.auth?.profileFileUrl);
  const status = fileUploadProgress === 100 ? 'success' : null;
  const color = fileUploadProgress === 100 ? '#52c41a' : '#3385ff';
  const [progress, setProgress] = useState(0);
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
    setProgress(fileUploadProgress);
  }, [fileUploadProgress])
  useEffect(() => {
    if(addProjectStatus){
      onClose();
      handleClear();
    }
  }, [addProjectStatus])
  useEffect(()=>{
    if(!open){
      setFormValue(initialValues)
      setFileInfo();
    setFileList([]);
    setProgress(0);
    }
  },[open])
  useEffect(() => {
    if (isURL(addProjectFileUrl)) {
       setFileUploaded(true)
      setFormValue({ ...formValue, imageUrl: addProjectFileUrl });
      setUploading(false)
    }
  }, [addProjectFileUrl])
  const handleDate = (first, last) => {
    console.log(first, last);
  }
  const projectStatusList = ['Planning', 'In Progress', 'Completed'].map((status) => { return ({label: status, value: status})})
  return (
    <Drawer open={open} onClose={onClose}>
      <Drawer.Header>
        <Drawer.Title>Add Project</Drawer.Title>
      </Drawer.Header>
      <Drawer.Body>
        <Form
          fluid
          ref={formRef}
          model={model}
          formValue={formValue}
          onChange={handleChange}
          onCheck={setFormError}
          formError={formError}
        >
 
        <TextField name='projectName' label="Project Name *" placeholder='Ex: Personal Portfolio Website' accepter={Input} error={formError.projectName}/>
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
        <TextField name='projectStatus' block label="Project Status *" placeholder='Ex: In Progress' accepter={SelectPicker} data={projectStatusList} error={formError.projectStatus}/>
        <TextField name='projectUrl' label="Project URL *"   accepter={Input} error={formError.projectUrl}/>
        <TextField name='imageUrl' value={formValue?.imageUrl}  label="Project Image URL (Thumbnail) *"   accepter={Input} error={formError.imageUrl}/>
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
            disabled={addProjectLoading}
          >
            {addProjectLoading ? 'Adding...' : ' Add Project'}
          </Button>
        </Stack.Item>
        </Stack>
        </FlexboxGrid>
           
              
         </Form>
      </Drawer.Body>
    </Drawer>
  );
};
const ProjectEditForm = ({ open, onClose, project }) => {
  useEffect(()=>{
    setFormValue(project)
 }, [project])
  const [formValue, setFormValue] = useState(initialValues);
  const [formError, setFormError] = useState({});
  const dispatch = useDispatch();
  const { editProjectLoading, editProjectError } = useSelector((state) => state.auth);
  const formRef = useRef();
  const [content, setContent] = useState('')
  const handleContent = (e) => {
    setContent(e)
    setFormValue({ ...formValue, description: e })
  }
  useEffect(()=>{
    setFormValue(project)
    setContent(project?.description)
 }, [project])
  
  const handleChange = (value) => {
    setFormValue(value);
  };

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
    dispatch(editProject(formValue));
    setFormValue(initialValues);
  };

  const [uploading, setUploading] = useState(false);
  const [fileInfo, setFileInfo] = useState();
  const [fileList, setFileList] = useState([]);
  const uploader = useRef();
  const [fileUploaded, setFileUploaded] = useState(false);

  const fileUploadProgress = useSelector((state) => state.auth.fileUploadProgress);
  const editProjectStatus = useSelector((state) => state.auth.editProjectStatus);
  const addProjectFileUrl = useSelector((state) => state.auth?.profileFileUrl);
  const status = fileUploadProgress === 100 ? 'success' : null;
  const color = fileUploadProgress === 100 ? '#52c41a' : '#3385ff';
  const [progress, setProgress] = useState(0);
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
    setProgress(fileUploadProgress);
  }, [fileUploadProgress])
  useEffect(() => {
    if(editProjectStatus){
      onClose();
      handleClear();
    }
  }, [editProjectStatus])
  useEffect(()=>{
    if(!open){
      setFormValue(initialValues)
      setFileInfo();
    setFileList([]);
    setProgress(0);
    }
  },[open])
  useEffect(() => {
    if (isURL(addProjectFileUrl)) {
       setFileUploaded(true)
      setFormValue({ ...formValue, imageUrl: addProjectFileUrl });
      setUploading(false)
    }
  }, [addProjectFileUrl])
  
  const projectStatusList = ['Planning', 'In Progress', 'Completed', 'On Hold', 
  'Cancelled', 
  'Under Review'].map((status) => { return ({label: status, value: status})})
  return (
    <Drawer open={open} onClose={onClose}>
      <Drawer.Header>
        <Drawer.Title>Add Project</Drawer.Title>
      </Drawer.Header>
      <Drawer.Body>
        <Form
          fluid
          ref={formRef}
          model={model}
          formValue={formValue}
          onChange={handleChange}
          onCheck={setFormError}
          formError={formError}
        >

        <TextField name='projectName' label="Project Name *" placeholder='Ex: Personal Portfolio Website' accepter={Input} error={formError.projectName}/>
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
                        </Form.Group>        <TextField name='location' label="Location "   accepter={Input} error={formError.location}/>        <Form.Group>
        <Form.ControlLabel>Project Start Date  *</Form.ControlLabel>
        <Stack spacing={20} wrap>

          <Form.Control fluid name='startDateMonth' placeholder='Select Project Start Month  *' accepter={SelectPicker} data={months}></Form.Control>
          <Form.Control block fluid name='startDateYear' placeholder='Select Project Start Year *' accepter={SelectPicker} data={startYear()}></Form.Control>
        </Stack>
        
          {/* <Form.Control name='startDateYear' accepter={SelectPicker} data={startYear}></Form.Control> */}
        </Form.Group>
        <Form.Group>
        <Form.ControlLabel>Project End Date (or Expected ) *</Form.ControlLabel>
        <Stack spacing={20} wrap>

          <Form.Control block name='endDateMonth' placeholder='Select Project End Month *' accepter={SelectPicker} data={months}></Form.Control>
          <Form.Control block name='endDateYear' placeholder='Select Project End Year *' accepter={SelectPicker} data={endYear()}></Form.Control>
        </Stack>
        
          {/* <Form.Control name='startDateYear' accepter={SelectPicker} data={startYear}></Form.Control> */}
        </Form.Group>
        <TextField name='projectStatus' block label="Project Status *" placeholder='Ex: In Progress' accepter={SelectPicker} data={projectStatusList} error={formError.projectStatus}/>
        <TextField name='projectUrl' label="Project URL *"   accepter={Input} error={formError.projectUrl}/>
        <TextField name='imageUrl' value={formValue?.imageUrl}  label="Project Image URL (Thumbnail) *"   accepter={Input} error={formError.imageUrl}/>
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
            disabled={editProjectLoading}
          >
            {editProjectLoading ? 'Adding...' : ' Add Project'}
          </Button>
        </Stack.Item>
        </Stack>
        </FlexboxGrid>
           
              
         </Form>
      </Drawer.Body>
    </Drawer>
  );
};
const RemoveProject = ({open, id, onClose}) => {
  const dispatch = useDispatch();
  const handleConfirmDelete = ( ) => {
     dispatch(deleteProject(id))
    onClose();
  }
  return (
    <><Modal backdrop="static" role="alertdialog" open={open} onClose={onClose} size="xs">
      <Modal.Header>
        <Modal.Title>Delete Project</Modal.Title>
      </Modal.Header>
    <Modal.Body>
      <Stack justifyContent='center'>
      <RemindIcon style={{ color: '#ffb300', fontSize: 64 }} /></Stack>
      <Text size='lg'>
        This action cannot be undone. Once deleted, this Project information will be permanently removed from your profile.
      </Text>
      <Text size='lg'>
         Are you sure you want to delete this Project entry ?
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
const UserContentPanel = ({ data, header, styles }) => {
     
  return (
    <>        <Panel shaded bordered bodyFill className={styles ? `user-content-panel` : ''} style={{ display: 'inline-block' }}>
  <Stack justifyContent='center'><img loading="lazy"  src={data.imageUrl} height="150" />
</Stack>
      <Panel     >
      {/* {JSON.stringify(data)} */}


       
      <Stack justifyContent='center' wrap spacing={5} style={{ marginTop: '20px' }}>
        <Stack.Item>
          <Text size='xxl' align='center'>
          <Link to={data.projectUrl}>
            {
            excerpt( data.projectName, 30)
          }
          </Link>
          </Text>
          
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
          Status: {data?.projectStatus}
        </Stack>

      
    </Panel>
    </Panel>
    </>
  )
}
const ProjectManagement = ({projectList}) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
 
  const onCloseEdit = () => {
    setOpenEdit(false)
  }
  const onCloseDelete = () => {
    setOpenDelete(false)
  }
  const [tableData, setTableData] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);

   const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
   const [sortColumn, setSortColumn] = useState();
  const [sortType, setSortType] = useState();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleSort = (columnKey, order) => {
    setSortColumn(columnKey);
    setSortType(sortType);
  };

  const handleLimitChange = (limit) => {
    setLimit(limit);
  };

  const handlePageChange = (page) => {
    setPage(page);
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
  useEffect(() => {
    setTableLoading(true);
    setTableData(projectList || []);
    setTableLoading(false);
  }, [projectList]);

  const [displayType, setDisplayType] = useState('table');
  const SearchStyle = {
    width: 300,
  };
  const handleEdit = (project) => {
    if(project){
       setSelectedItem(project);
      setOpenEdit(true)
    }
  }
  const handleDelete = (project) =>{ 
    if(project){
      setSelectedItem(project);
      setOpenDelete(true)
    }

  }
  
  return (
    <>
           <ProjectForm open={open} onClose={handleClose} />
      <ProjectEditForm open={openEdit} onClose={onCloseEdit} project={selectedItem} />
      <RemoveProject id={selectedItem?.id}  open={openDelete} onClose={onCloseDelete}/>
      
      <FlexboxGrid justify='end' style={{ marginBottom: '20px' }}>
          <FlexboxGrid.Item>
            <Stack spacing={5} justifyContent="space-between">
          <InputGroup inside style={SearchStyle}>
            <Input onChange={handleSearch} value={searchQuery} />
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
      <Table
      bordered cellBordered
        data={getData()}
        loading={tableLoading}
        sortColumn={sortColumn}
        sortType={sortType}
        onSort={handleSort}
        height={420}
        rowHeight={50}
        shouldUpdateScroll
       >
        <Table.Column width={50} align="center" fixed>
    <Table.HeaderCell>#</Table.HeaderCell>
    <Table.Cell>
      {(rowData, rowIndex) => {
        return <div>{rowIndex + 1}</div>;
      }}
    </Table.Cell>
  </Table.Column>
        
        <Table.Column flexGrow={1}  >
          <Table.HeaderCell>Project Name</Table.HeaderCell>
          <Table.Cell dataKey="projectName" />
        </Table.Column>
        <Table.Column flexGrow={1}  >
          <Table.HeaderCell>Project Description</Table.HeaderCell>
          <Table.Cell dataKey="projectDescription" />
        </Table.Column>
        <Table.Column flexGrow={1}  >
          <Table.HeaderCell>Start Date</Table.HeaderCell>
          <Table.Cell >
          {rowData => 
                rowData?.startDateMonth+ ' ' + rowData?.startDateYear 
          }
          </Table.Cell>
        </Table.Column>
        <Table.Column flexGrow={1}  >
          <Table.HeaderCell>End Date</Table.HeaderCell>
          <Table.Cell>
            {
              rowData => rowData?.endDateMonth+ ' ' + rowData?.endDateYear
            }
          </Table.Cell>
        </Table.Column>
        <Table.Column flexGrow={1}  >
          <Table.HeaderCell>Status</Table.HeaderCell>
          <Table.Cell dataKey="projectStatus" />
        </Table.Column>
         
        <Table.Column   >
          <Table.HeaderCell>Actions</Table.HeaderCell>
          <Table.Cell>
            {(rowData) => (
              <><Stack justifyContent='center' wrap spacing={20} alignItems='flex-start'>
                <IconButton
                  appearance="subtle"
                  onClick={() => handleEdit(rowData)}
                  circle
                  size='sm'
                  icon={<MdEdit />}
                />
                <IconButton
                  appearance="subtle"
                  onClick={() =>  handleDelete( rowData) }
                  circle
                  size='sm'
                  icon={<MdDelete />}
                />
                </Stack>
              </>
            )}
          </Table.Cell>
        </Table.Column>
      </Table>
      </> :
      <>
      <div style={{minHeight: '60vh'}}> 
      <Stack spacing={20} justifyContent='center' alignItems='center'  wrap style={{maxHeight: '60vh', overflow: 'auto'}}>
      {
        getData().map((project) => {
          return(
            <UserContentPanel   data={project} styles={true}/>
            )
          })
        }
        {
          tableData.length <=0 ? <Stack.Item>No Data Found.</Stack.Item> : <></>
        }
        </Stack>
       </div> </> }

      <div style={{ padding: 20 }}>
      <Pagination
        prev
        next
        first
        last
        ellipsis
        boundaryLinks
        maxButtons={5}
        size="sm"
        layout={['total', '-', 'limit', '|', 'pager', 'skip']}
        total={tableData?.length}
        limit={limit}
        activePage={page}
        onChangePage={handlePageChange}
        onChangeLimit={handleLimitChange}
      /></div>
    </>
  );
};

const ProjectsPage = ({ getProjectList, projectList}) => {
  
    useEffect(()=> {
      getProjectList();
     },[])
    return(
           <Panel
      header={
        <>
          <h2 className="title">Project Management</h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item >Admin</Breadcrumb.Item>
             <Breadcrumb.Item active>Project Management</Breadcrumb.Item>
          </Breadcrumb>
        </>
      }
    >
         <ProjectManagement projectList={projectList}/>
         </Panel>
     )
}
const mapDispatchToProps = dispatch => ({
   getProjectList: () => dispatch(getProjectList())
});
const mapStateToProps = state => ({
  projectList: state.auth?.projectList,
   
 });
export default connect(mapStateToProps, mapDispatchToProps)(ProjectsPage);