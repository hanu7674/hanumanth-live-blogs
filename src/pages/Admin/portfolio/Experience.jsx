import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form,Panel, Breadcrumb, Button, Schema, Drawer, Divider, Uploader, Progress, Text, FlexboxGrid, Row, Col } from 'rsuite';
import { addExperience, editExperience, getExperienceList, removeProfileFiles,deleteExperience, uploadProfileFiles } from '../../../redux/auth';
import { TextField, Textarea } from '../../Auth/FormFields';
import { isURL, months, startYear, endYear, excerpt } from '../../../assets/constants';
 import { Table, Pagination, IconButton, Stack, InputGroup, Input, ButtonToolbar,SelectPicker, Modal } from 'rsuite';
import PlusIcon from '@rsuite/icons/Plus';
import TrashIcon from '@rsuite/icons/Trash';
import EditIcon from '@rsuite/icons/Edit';
import SearchIcon from '@rsuite/icons/Search';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import TableIcon from '@rsuite/icons/legacy/Table';
import ListIcon from '@rsuite/icons/legacy/ListAlt';
import Editor from '../../Blogs/Editor'

const { StringType } = Schema.Types;
const { Column, HeaderCell, Cell } = Table;

const model = Schema.Model({
    company: StringType().isRequired('Company is required'),
    position: StringType().isRequired('Position is required'),
    role: StringType().isRequired('Role is required'),
  location: StringType(),
  type: StringType().isRequired('Experience Type is required.'),
    startDateMonth: StringType().isRequired('Start Month is required.'),
    startDateYear: StringType().isRequired('Start Year is required.'),
    endDateMonth: StringType().isRequired('End Month is required.'),
    endDateYear: StringType().isRequired('End Year is required.'),
    description: StringType().isRequired('Description is required'),
    link: StringType().addRule((value) => isURL(value), 'Please enter a valid URL') ,
    imageUrl: StringType().addRule((value) => isURL(value), 'Please enter a valid URL').isRequired('This field is required.'),
});

const initialValues = {
    company: "",
    type:'',
    position: "",
    startDateMonth: "",
    startDateYear: "",
    endDateMonth: "",
    endDateYear: "",
    description: "",
    imageUrl: "",
    link: "",
    role: ''
};

const ExperienceForm = ({ open, onClose, experience }) => {
    const [formValue, setFormValue] = useState(initialValues);
    const [formError, setFormError] = useState({});
    const dispatch = useDispatch();
    const { addExperienceLoading, addExperienceError, editExperienceLoading, editExperienceError } = useSelector((state) => state.auth);
    const formRef = useRef();

    useEffect(() => {
        if (experience) {
            setFormValue(experience);
        } else {
            setFormValue(initialValues);
        }
    }, [experience]);

    const handleChange = (value) => {
        setFormValue(value);
    };
    useEffect(()=>{
        setFormValue(experience)
        setContent(experience?.description)
     }, [experience])
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
        if (experience) {
            dispatch(editExperience(formValue));
        } else {
            dispatch(addExperience(formValue));
        }
     };

    const [uploading, setUploading] = useState(false);
    const [fileInfo, setFileInfo] = useState();
    const [fileList, setFileList] = useState([]);
    const uploader = useRef();
    const [fileUploaded, setFileUploaded] = useState(false);

    const fileUploadProgress = useSelector((state) => state.auth.fileUploadProgress);
    const addExperienceStatus = useSelector((state) => state.auth.addExperienceStatus);
    const editExperienceStatus = useSelector((state) => state.auth.editExperienceStatus);
    const profileFileUrl = useSelector((state) => state.auth?.profileFileUrl);
    const status = fileUploadProgress === 100 ? 'success' : null;
    const color = fileUploadProgress === 100 ? '#52c41a' : '#3385ff';
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        setProgress(fileUploadProgress);
    }, [fileUploadProgress]);

    useEffect(() => {
        if (addExperienceStatus || editExperienceStatus) {
            onClose();
            handleClear();
        }
    }, [addExperienceStatus, editExperienceStatus]);

    useEffect(() => {
        if (!open) {
            setFormValue(initialValues);
            setFileInfo();
            setFileList([]);
            setProgress(0);
        }
    }, [open]);

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
        });
        dispatch(uploadProfileFiles(file.blobFile));
    };

    const handleFileRemove = (file) => {
        setFileInfo();
        setFileList([]);
        setProgress(0);
        setFormValue({ ...formValue, imageUrl: '' });
        dispatch({ type: 'PROFILE_FILE_UPLOAD_PROGRESS', payload: 0 });
        if (fileUploaded) {
            dispatch(removeProfileFiles(file));
        }
    };

    const handleClear = () => {
        setFileInfo();
        setFileList([]);
        setProgress(0);
        setContent('')
        setFormValue({ ...formValue, imageUrl: '' });
        dispatch({ type: 'PROFILE_FILE_UPLOAD_PROGRESS', payload: 0 });
    };

    useEffect(() => {
        if (isURL(profileFileUrl)) {
            setFileUploaded(true);
            setFormValue({ ...formValue, imageUrl: profileFileUrl });
            setUploading(false);
        }
    }, [profileFileUrl]);
    const experienceTypesList = ['Work', 'Internships', 'Volunteerships','Freelance', 
    'Part-time', 
    'Contract', 
    'Temporary', 
    'Apprenticeship'].map((status) => { return ({label: status, value: status})})

    return (
        <Drawer size='sm' open={open} onClose={onClose}>
            <Drawer.Header>
                <Drawer.Title>{experience ? 'Edit Experience' : 'Add Experience'}</Drawer.Title>
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
                    <TextField name='company' label="Company*" placeholder='Ex: Google' accepter={Input} error={formError.company} />
                    <TextField name='position' label="Position*" placeholder='Ex: Senior Manager' accepter={Input} error={formError.position} />
                    <TextField name='role' label="Role *" placeholder='Ex: Software Engineer' accepter={Input} error={formError.role} />
        <TextField name='type' block label="Experience Type *" placeholder='Ex: Work' accepter={SelectPicker} data={experienceTypesList} error={formError.projectStatus}/>
                    
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
                    <Form.Group>
                          <Form.ControlLabel>Description *</Form.ControlLabel>

                          <Editor
                            setData={handleContent}
                            readonly={false}
                            className="form-control"
                            placeholder="Ex: I worked as a software engineer at Google"
                            data={content}
                            name='content'

                          />
                          {
                            formError.description ? <Text color='red'>{formError.description}</Text> : <></>
                          }
                        </Form.Group>        
                        <TextField name='location' label="Location "   accepter={Input} error={formError.location}/>                    
                        <TextField name='link' label="Company Website " placeholder='Ex: https://www.google.com' accepter={Input} error={formError.link} />
                    <h3>Attachments</h3>
        <TextField  value={formValue?.imageUrl} name="imageUrl" checkAsync type="text" label="Company logo image URL" />
        <Divider  >Or</Divider>
        <Uploader
          disabled={progress == 100}
          multiple={false}
          listType="picture-text"
          onChange={setFileList}
          fileList={fileList}
          onRemove={(file) => handleFileRemove(file)}
          autoUpload={false}
          accept=".jpg, .jpeg, .png"
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
          >{
            uploading ? 'Uploading...' : 'Upload'
          }
             </Button>
          <Button onClick={handleClear}>Clear</Button>
        </Stack>
        <FlexboxGrid justify='end'>
          <Stack justifyContent='space-between' alignItems='center' spacing={20}>
            <Stack.Item>
              <Button onClick={onClose}> Cancel</Button>
            </Stack.Item>
        <Stack.Item >
        <Button type="submit" onClick={handleSubmit} loading={addExperienceLoading || editExperienceLoading} appearance="primary">
                        {addExperienceLoading || editExperienceLoading ? 'Loading...' : <>{
                            experience ? 'Update Experience' : 'Add Experience'
                        }</>}
                    </Button>
        </Stack.Item>
        </Stack>
        </FlexboxGrid>
                    
                </Form>
            </Drawer.Body>
        </Drawer>
    );
};
const UserContentPanel = ({ data, header, styles }) => {
     
    return (
      <>        <Panel shaded bordered bodyFill className={styles ? `user-content-panel` : ''} style={{ display: 'inline-block' }}>
    <Stack justifyContent='center'>
    <img loading="lazy"  src={data.imageUrl} height="150" />
 </Stack>
        <Panel    >
        {/* {JSON.stringify(data)} */}

  
         
        <Stack justifyContent='center' wrap spacing={5} style={{ marginTop: '20px' }}>
          <Stack.Item>
            <Text size='xxl'  align='center'>
            <Link to={data.link}>
              {
              excerpt(data.company, 30)
            }
            </Link>
            </Text>
            
          </Stack.Item>
          </Stack>
          <Stack justifyContent='center' wrap spacing={5} style={{ marginTop: '20px' }}>
          <Stack.Item>
            {
             data?.position
            }
          </Stack.Item>
          </Stack>
          <Stack justifyContent='center' wrap spacing={5} style={{ marginTop: '20px' }}>
          <Stack.Item>
            {
             data?.role
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
           
        
      </Panel>
      </Panel>
      </>
    )
  }

const ExperienceList = () => {
    const dispatch = useDispatch();
    const experienceList = useSelector((state) => state.auth.experienceList);
    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchInputValue, setSearchInputValue] = useState('');
    const [tableData, setTableData] = useState([]);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [displayType, setDisplayType] = useState('table');

    useEffect(() => {
        dispatch(getExperienceList());
    }, [dispatch]);

    useEffect(() => {
        setTableData(experienceList || []);
    }, [experienceList]);

    const handleSearch = () => {
        if (searchInputValue.length > 0) {
            const filteredData = experienceList.filter((exp) =>
                exp.company.toLowerCase().includes(searchInputValue.toLowerCase()) ||
                exp.position.toLowerCase().includes(searchInputValue.toLowerCase())
            );
            setTableData(filteredData);
        } else {
            setTableData(experienceList);
        }
    };

    const handleEdit = (exp) => {
        setSelectedItem(exp);
        setOpenEdit(true);
    };

    const handleDelete = (exp) => {
        setSelectedItem(exp);
        setOpenDelete(true);
    };

    const handleConfirmDelete = () => {
        dispatch(deleteExperience(selectedItem.id));
        setOpenDelete(false);
    };

    const getData = () => {
        const start = limit * (page - 1);
        const end = start + limit;
        return tableData.slice(start, end);
    };
    const SearchStyle = {
        width: 300,
      };
    return (
        <div>
            <ExperienceForm open={open} onClose={() => setOpen(false)} />
            <ExperienceForm open={openEdit} onClose={() => setOpenEdit(false)} experience={selectedItem} />
            <Modal backdrop="static" role="alertdialog" open={openDelete} onClose={() => setOpenDelete(false)} size="xs">
                <Modal.Header>
                    <Modal.Title>Delete Experience</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Stack justifyContent='center'>
                        <TrashIcon style={{ color: '#ffb300', fontSize: 64 }} />
                    </Stack>
                    <Text size='lg'>
                        This action cannot be undone. Are you sure you want to delete this experience entry?
                    </Text>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setOpenDelete(false)} appearance="subtle">Cancel</Button>
                    <Button onClick={handleConfirmDelete} appearance="primary">Yes, Confirm</Button>
                </Modal.Footer>
            </Modal>
            <FlexboxGrid justify='end' style={{ marginBottom: '20px' }}>
          <FlexboxGrid.Item>
            <Stack spacing={5} justifyContent="space-between">
          <InputGroup inside style={SearchStyle}>
            <Input onChange={setSearchInputValue} value={searchInputValue} />
            <InputGroup.Button>
              <SearchIcon onClick={handleSearch} />
            </InputGroup.Button>
          </InputGroup>
          <ButtonToolbar>
              <IconButton icon={<TableIcon />} onClick={() => setDisplayType('table')} active={displayType =='table' ? true : false}></IconButton>
              <IconButton icon={<ListIcon />} onClick={() => setDisplayType('list')} active={displayType =='list' ? true : false}></IconButton>
            </ButtonToolbar>
            <Button startIcon={<PlusIcon />} onClick={() => setOpen(true)}>Add Experience </Button>

        </Stack></FlexboxGrid.Item>
          <FlexboxGrid.Item>
          </FlexboxGrid.Item>
        </FlexboxGrid>
             
            {
          displayType == 'table' ? 
				            <>   
            <Table height={420} data={getData()} bordered cellBordered>
                <Column width={50} align="center" fixed>
                    <HeaderCell>#</HeaderCell>
                    <Cell>
                        {(rowData, rowIndex) => <div>{rowIndex + 1}</div>}
                    </Cell>
                </Column>
                <Column flexGrow={1} align="center">
                    <HeaderCell>Company Logo</HeaderCell>
                    <Cell dataKey="imageUrl">
                        {rowData => <img loading="lazy"  src={rowData.imageUrl} width="40" alt={rowData.company} />}
                    </Cell>
                </Column>
                <Column flexGrow={2} sortable>
                    <HeaderCell>Company Name</HeaderCell>
                    <Cell dataKey="company" />
                </Column>
                <Column flexGrow={2} sortable>
                    <HeaderCell>Position</HeaderCell>
                    <Cell dataKey="position" />
                </Column>
                <Column flexGrow={2} sortable>
                    <HeaderCell>Start &End Date</HeaderCell>
                    <Cell>
                        {rowData => rowData.startDateMonth+ ' '  + rowData.startDateYear + ' - ' + rowData.endDateMonth + ' ' +  rowData.endDateYear}
                    </Cell>
                </Column>
                <Column width={120} align="center">
                    <HeaderCell>Actions</HeaderCell>
                    <Cell>
                        {rowData => (
                            <Stack justifyContent='center' wrap spacing={20} alignItems='flex-start'>
                                <IconButton size='sm' circle  icon={<EditIcon />} onClick={() => handleEdit(rowData)} />
                                <IconButton  size='sm' circle icon={<TrashIcon />} onClick={() => handleDelete(rowData)} />
                            </Stack>
                        )}
                    </Cell>
                </Column>
            </Table>
            </> : <>
             
            <div style={{minHeight: '70vh'}}> 
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
       </div> </>
            }
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
                total={tableData.length}
                limitOptions={[10, 30, 50]}
                limit={limit}
                activePage={page}
                onChangePage={setPage}
                onChangeLimit={setLimit}
            />
            </div>
        </div>
    );
};
const ExperiencePage = ({ getExperienceList, experienceListLoading, experienceList }) => {
    useEffect(() => {
        getExperienceList();
    }, [getExperienceList]);
    return (
        <Panel
            header={
                <>
                    <h2 className="title">Experience Management</h2>
                    <Breadcrumb>
                        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                        <Breadcrumb.Item>Admin</Breadcrumb.Item>
                        <Breadcrumb.Item active>Experience Management</Breadcrumb.Item>
                    </Breadcrumb>
                </>
            }
        >
            <ExperienceList experienceList={experienceList} />
        </Panel>
    );
};
const mapDispatchToProps = dispatch => ({
    getExperienceList: () => dispatch(getExperienceList()),
});
const mapStateToProps = state => ({
    experienceListLoading: state.auth.experienceListLoading,
    experienceList: state.auth.experienceList,
});
export default connect(mapStateToProps, mapDispatchToProps)(ExperiencePage);
