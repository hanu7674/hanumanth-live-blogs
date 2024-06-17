import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Breadcrumb,Popover, Whisper, Loader, Panel, Avatar, Form,Uploader,InputGroup, Table, Pagination, Progress, Input, Schema, Divider, Grid, Row, Button, Col, Modal, Drawer, Stack, IconButton, ButtonToolbar, DateRangePicker, Toggle } from "rsuite";
import { deleteCarouselItem, editCarouselItem, fetchCarouselItems } from "../../../redux/carousel";
import { MdAddCircle, MdFilterAlt, MdImage, MdRefresh } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { TextField } from '../../Auth/FormFields';
import { addCarouselItem, removeCarouselFiles, uploadCarouselFiles } from '../../../redux/carousel';
import { AddCarouselItemForm } from "./Carousel";
import SearchIcon from '@rsuite/icons/Search';
import TableIcon from '@rsuite/icons/legacy/Table';
import ListIcon from '@rsuite/icons/legacy/ListAlt';
import { startOfDay, endOfDay, addDays, subDays, startOfWeek, endOfWeek, addWeeks, startOfMonth, endOfMonth } from 'date-fns';
import MoreIcon from '@rsuite/icons/legacy/More';

const { Column, HeaderCell, Cell, ColumnGroup } = Table;

const isURL = (value) => {
  const urlRegex = /^(http|https):\/\/[^ "]+$/;
  return urlRegex.test(value);
};
const SearchStyle = {
  width: 300,
};
const Ranges = [
  {
    label: 'Today',
    value: [startOfDay(new Date()), endOfDay(new Date())]
  },
  {
    label: 'Tomorrow',
    value: [startOfDay(addDays(new Date(), 1)), endOfDay(addDays(new Date(), 1))]
  },
  {
    label: 'This Week',
    value: [startOfDay(startOfWeek(new Date())), endOfDay(endOfWeek(new Date()))]
  },
  {
    label: 'Next Week',
    value: [startOfDay(addWeeks(startOfWeek(new Date()), 1)), endOfDay(addWeeks(endOfWeek(new Date()), 1))]
  },
  {
    label: 'This Month',
    value: [startOfDay(startOfMonth(new Date())), endOfDay(endOfMonth(new Date()))]
  },
];
const {StringType} =  Schema.Types;
const EditCarouselItemForm = ({ onClose, values }) => {
  const [formValue, setFormValue] = useState({});
  const [formError, setFormError] = React.useState({});
  const [uploading, setUploading] = React.useState(false);
  const [fileInfo, setFileInfo] = React.useState();
  const [fileList, setFileList] = React.useState([]);
  const uploader = React.useRef();

  const fileUploadProgress = useSelector((state) => state.carousel.progress);
  const addItemStatus = useSelector((state) => state.carousel.addItemStatus);
  const loading = useSelector((state) => state.carousel.loading);
  const carouselFileUrl = useSelector((state) => state.carousel.carouselUrl);
  const status = fileUploadProgress === 100 ? 'success' : null;
  const color = fileUploadProgress === 100 ? '#52c41a' : '#3385ff';
  const [progress, setProgress] = useState(0);
  const [disabled, setDisabled] = useState(true)
  const formRef = React.useRef();
  const [fileUploaded, setFileUploaded] = useState(false);

  const formModel = Schema.Model({
    id: StringType(),
    title: StringType().isRequired('This field is required.'),
    description: StringType().isRequired('This field is required.'),
    caption: StringType().isRequired('This field is required.'),
    imageUrl: StringType().addRule((value) => isURL(value), 'Please enter a valid URL').isRequired('This field is required.'),
  })
  useEffect(() => {
    setProgress(fileUploadProgress);
  }, [fileUploadProgress])
  const dispatch = useDispatch()
  function previewFile(file, callback) {
    const reader = new FileReader();
    reader.onloadend = () => {
        callback(reader.result);
    };
    reader.readAsDataURL(file);
}
  const handleCarouselImageUpload = async () => {
    setUploading(true);
    const file = fileList[0];
    if (file) {
      previewFile(file.blobFile, (value) => {
        setFileInfo(value);
      });
  
      try {
        await dispatch(uploadCarouselFiles(file.blobFile));
      } catch (error) {
        console.error('Error uploading file:', error);
      }
  
      setUploading(false);
    }
}
const handleFileRemove = (file) => {
    setFileInfo();
    setFileList([]);
    setProgress(0);
    setDisabled(false);
    setFormValue({ ...formValue , imageUrl: '' });
    dispatch({type: 'CAROUSEL_FILE_UPLOAD_PROGRESS',payload: 0});
    if(fileUploaded){
      dispatch(removeCarouselFiles(file));
    }
}
  const handleSubmit = () => {
    if (!formRef.current.check()) {
      console.error('Form Error');
      return;
  }
  else {
    const formData = {...formValue, id: values.id, imageUrl: values.imageUrl}
    dispatch(editCarouselItem(formData))
    }
  };
  useEffect(() => {
      if(addItemStatus){
        handleClose()
      }
  },[addItemStatus])
  const handleClose = () => {
    setFileInfo();
    setFileList([]);
    setProgress(0);
    setDisabled(false);
    setFormValue({ ...formValue , imageUrl: '' })
    dispatch({type: 'CAROUSEL_FILE_UPLOAD_PROGRESS',payload: 0})
    onClose();
  }
const handleClear = () => {
  setFileInfo();
  setFileList([]);
  setProgress(0);
  setDisabled(false);
  setFormValue({ ...formValue , imageUrl: '' })
  dispatch({type: 'CAROUSEL_FILE_UPLOAD_PROGRESS',payload: 0})

}
useEffect(() => {
  if(isURL(carouselFileUrl)){
    setDisabled(true);
    setFileUploaded(true)
    setFormValue({ ...formValue , imageUrl: carouselFileUrl });
    setUploading(false)
  }
},[carouselFileUrl])
  return (
        <div>
        <Form
          fluid
          ref={formRef}
          formDefaultValue={values}
          onChange={(value) => setFormValue(value)}
          formValue={formValue}
          model={formModel}
          formError={formError}
          checkTrigger='none'
          onCheck={setFormError}
        >
         <TextField name="id" checkAsync disabled type="text" label="Carousel Id" />
         <TextField name="title" checkAsync type="text" label="Carousel Title" />
         <TextField name="description" checkAsync type="text" label="Carousel Description" />
         <TextField name="caption" checkAsync type="text" label="Carousel Caption" />
         <TextField disabled={disabled} value={formValue?.imageUrl} name="imageUrl" checkAsync type="text" label="Image URL" />
         <Divider>Or</Divider>
         <Uploader
         disabled={progress == 100 || disabled}
         multiple = {false}
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
      <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span>Click or Drag files to this area to upload</span>
      </div>
    </Uploader>

    {
      progress > 1 ? <>
      <Progress.Line percent={progress} strokeColor={color} status={status} />
      </> : ''
    }
    <Stack style={{margin: "15px 0"}} justifyContent='center' spacing={20}>
      <Button disabled={!fileList.length}
        onClick={
          handleCarouselImageUpload
        }
        loading={uploading}
        >Upload</Button>
      <Button onClick={handleClear}>Clear</Button>
    </Stack>
        </Form>
        <Stack justifyContent='flex-end' spacing={15}>
        <Button onClick={onClose} appearance="subtle">
          Cancel
        </Button>
        <Button disabled={loading} loading={loading} onClick={handleSubmit} appearance="primary">
          Save Carousel Item 
        </Button>
        </Stack>
      </div>
  );
};
const EditableCell = ({ rowData, dataKey, onChange, ...props }) => {
  const editing = rowData.rowStatus === 'EDIT';
  return (
    <Cell {...props} className={editing ? 'table-content-editing' : ''}>
      {editing ? (
        <input
          className="rs-input"
          defaultValue={rowData[dataKey]}
          onChange={event => {
            onChange && onChange(rowData.id, dataKey, event.target.value);
          }}
        />
      ) : (
        <span className="table-content-edit-span">{rowData[dataKey]}</span>
      )}
    </Cell>
  );
};
const ActionCell = ({ rowData, dataKey, onClick, ...props }) => {
  return (
    <Cell {...props} style={{ padding: '6px' }}>
      <Button
        appearance="link"
        onClick={() => {
          onClick(rowData.id);
        }}
      >
        {rowData.rowStatus === 'EDIT' ? 'Update' : 'Edit'}
      </Button>
    </Cell>
  );
};
const CarouselCard = ({ data, deleteCarouselItem, editCarouselItem  }) => {
  const { imageUrl, addedBy, title, description, addedAt, id } = data;
  const [imageError, setImageError] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditDrawer, setShowEditDrawer] = useState(false);
  const formatDate = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleString();
  };

  const handleImageError = () => {
    setImageError(true);
  };
  const handleDeleteModalClose = () => {
    setShowDeleteModal(false);
  };
  const handleDelete = () => {
    deleteCarouselItem(data)
  }
  const handleEditDrawerClose = () => {
    setShowEditDrawer(false)
  }
  return (
    <div style={{maxWidth: '350px'}}>
     <Modal open={showDeleteModal} onClose={handleDeleteModalClose} size="xs">
        <Modal.Header>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this item?
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleDelete} appearance="primary">
            Yes, Delete
          </Button>
          <Button onClick={handleDeleteModalClose} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      <Drawer
        open={showEditDrawer}
        onClose={handleEditDrawerClose}
        placement="right"
        size="sm"
        backdrop={true}
      >
        <Drawer.Header>
          <Drawer.Title>Edit Carousel Item</Drawer.Title>
          <Drawer.Actions>
            <Button onClick={handleEditDrawerClose}>Cancel</Button>
          </Drawer.Actions>
        </Drawer.Header>
        <Drawer.Body>
        <EditCarouselItemForm values={data} onClose={handleEditDrawerClose} editCarouselItem={editCarouselItem}/>
        </Drawer.Body>
        {/* Add your Edit form or component here */}
        {/* Example: <EditForm data={selectedItem} onSubmit={editCarouselItem} onCancel={handleEditDrawerClose} /> */}
      </Drawer>
    <Panel bordered style={{ marginBottom: '20px' }}>
      {imageError ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '200px',
          }}
        >
          <div><MdImage size={200} />
          <p style={{ color: '#999', marginTop: '10px', textAlign: 'center' }}> Failed to load Image</p></div>
          
        </div>
      ) : (
        <img
          src={imageUrl}
          alt={title}
          style={{ width: '100%', height: '200px', objectFit: 'cover' }}
          onError={handleImageError}
        />
      )}
      <Divider />
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <Avatar circle src={addedBy?.photoURL} alt={addedBy?.firstName} />
        <div style={{ marginLeft: '10px' }}>
          <b>{addedBy?.firstName} {addedBy?.lastName}</b>
          <p>{addedBy?.email}</p>
        </div>
      </div>
      <Divider>Description</Divider>
      <p style={{ wordBreak: 'break-all', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'pre-line' }}>{  description || 'No description available'}</p>
      <Divider>Details</Divider>
      <div>
        <p><b>ID:</b> {id}</p>
        <p><b>Added At:</b> {formatDate(addedAt)}</p>
      </div>
      <Divider />
      {/* Edit and Delete Buttons */}
      <Stack justifyContent="center" spacing={15}>
      <Button appearance="primary" onClick={() => setShowEditDrawer(true)}>
        Edit
      </Button>
      <Button appearance="ghost" onClick={() => setShowDeleteModal(true)} style={{ marginLeft: '10px' }}>
        Delete
      </Button>
      </Stack>
      
    </Panel>
    </div>
  );
};
const NameCell = ({ rowData, dataKey, ...props }) => {
  const speaker = (
    <Popover title="Description">
      <div
        
      >

        <Avatar  src={rowData?.addedBy?.photoURL} alt={rowData?.addedBy?.firstName + rowData?.addedBy?.lastName} />
      </div>
      <p>
        <b>Name:</b> {rowData?.addedBy?.firstName} {rowData?.addedBy?.lastName}
      </p>
      <p>
        <b>Email:</b> {rowData?.addedBy?.email}
      </p>
    </Popover>
  ); return (
    <Cell {...props}>
      <Whisper placement="top" speaker={speaker}>
        <a>{rowData?.addedBy.email}</a>
      </Whisper>
    </Cell>
  );
};
const ViewCarouselItemsPageComponent = ({ carouselItems, loading, deleteCarouselItem, editCarouselItem, handleRefreshCarouselItems  }) => {
  const [showAddCarouselItemDrawer, setShowAddCarouselItemDrawer] = useState(false);
  const [filters, setFilters] = useState(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState('');
  const [tableLoading, setTableLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [sortColumn, setSortColumn] = useState();
  const [sortType, setSortType] = useState();
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [displayType, setDisplayType] = useState('card');

  const handleChangeLimit = (dataKey) => {
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
      return tableData?.length
        ? tableData?.filter((v, i) => {
          const start = limit * (page - 1);
          const end = start + limit;
          return i >= start && i < end;
        })
        : [];
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
      const filteredData = carouselItems?.filter((item) =>
        item?.id?.toLowerCase().includes(e?.toLowerCase()) ||
        item?.title?.toLowerCase().includes(e?.toLowerCase()) ||
        item?.caption?.toLowerCase().includes(e?.toLowerCase()) ||
        item?.description?.toLowerCase().includes(e?.toLowerCase())
      );
      setTableData(filteredData);
      setTimeout(() => {
        setTableLoading(false);
      }, 500);
    } else {
      setTableData(carouselItems);
    }
    setSearchInputValue(e);
  };

  const handleSearch = () => {
    if (searchInputValue?.length > 0) {
      setTableLoading(true);
      const filteredData = carouselItems?.filter((item) =>
        item?.id?.toLowerCase().includes(searchInputValue?.toLowerCase()) ||
        item?.title?.toLowerCase().includes(searchInputValue?.toLowerCase()) ||
        item?.caption?.toLowerCase().includes(searchInputValue?.toLowerCase()) ||
        item?.description?.toLowerCase().includes(searchInputValue?.toLowerCase())
      );
      setTableData(filteredData);
      setTimeout(() => {
        setTableLoading(false);
      }, 500);
    } else {
      setTableData(carouselItems);
    }
  };
  
  useEffect(() => {
    setTableLoading(true);
    setTableData(carouselItems || []);
    setTableLoading(false);
  }, [carouselItems, limit]);
  const filterData = (data, filters) => {
    return data.filter(item => {    
      // Filter by 'created' date range
      if (filters.created && filters.created.length === 2) {
        const [startDate, endDate] = filters.created;
        const createdDate = new Date(item.created);
  
        if (startDate && endDate) {
          if (createdDate < new Date(startDate) || createdDate > new Date(endDate)) {
            return false;
          }
        } else if (startDate && createdDate < new Date(startDate)) {
          return false;
        } else if (endDate && createdDate > new Date(endDate)) {
          return false;
        }
      }
      // Filter by 'status'
      if (filters.status && item.status !== filters.status) {
        return false;
      }
      return true;
    });
  };
  const formRef = React.useRef();
  const [formValue, setFormValue] = React.useState({
  });
  const handleFormSubmit = () => {
    setFilters(true);
    setTableLoading(true);
    const filteredData = filterData(carouselItems, formValue);
    setTableData(filteredData);
    setTableLoading(false);
    setShowFilterDrawer(false);
  };

  // Editable table 
 

  const handleChange = (id, key, value) => {
    const nextData = Object.assign([], tableData);
    nextData.find(item => item.id === id)[key] = value;
    setTableData(nextData);
  };
  const handleEditState = id => {
    const nextData = Object.assign([], tableData);
    const activeItem = nextData.find(item => item.id === id);
    activeItem.rowStatus = activeItem.rowStatus ? null : 'EDIT';
    setTableData(nextData);
    if(activeItem.rowStatus == null){
      editCarouselItem(activeItem)
    }
  };  
  
  return (
    <> 
    <Stack justifyContent="space-between" spacing={15} wrap>
              <Stack.Item>
                <InputGroup inside style={SearchStyle}>
                  <Input onChange={handleInputChange} value={searchInputValue} />
                  <InputGroup.Button>
                    <SearchIcon onClick={handleSearch} />
                  </InputGroup.Button>
                </InputGroup>
              </Stack.Item>
              <Stack.Item>
                <Stack spacing={15} wrap>
                <IconButton onClick={() => setShowAddCarouselItemDrawer(true)} placement='right' icon={<MdAddCircle className='rs-icon'/>}> Add Carousel Item</IconButton>
              
                  <IconButton icon={<MdFilterAlt className='rs-icon' />} placement='right' onClick={() => setShowFilterDrawer(true)}>
                  {
                filters ? <>View Filters</> : <>
                Add Filters</>}</IconButton>
      <ButtonToolbar>
              <IconButton icon={<TableIcon />} onClick={() => setDisplayType('table')} active={displayType =='table' ? true : false}></IconButton>
              <IconButton icon={<ListIcon />} onClick={() => setDisplayType('list')} active={displayType =='list' ? true : false}></IconButton>
            </ButtonToolbar>
      <IconButton onClick={handleRefreshCarouselItems} placement='right' icon={<MdRefresh className='rs-icon'/>}></IconButton>

              </Stack>
              </Stack.Item>
    </Stack>
      <Divider/>
      <Drawer size='xs' placement='right' keyboard={false} open={showFilterDrawer} onClose={() => setShowFilterDrawer(false)}>
        <Drawer.Header>
          <Drawer.Title>Add Filters</Drawer.Title>
          <Drawer.Actions>
            <Button onClick={() => setShowFilterDrawer(false)}>Cancel</Button>
          </Drawer.Actions>
        </Drawer.Header>
        <Drawer.Body>
        <Form
              ref={formRef}
              onChange={setFormValue}
              formValue={formValue}
              fluid>
              <Stack wrap spacing={10} style={{ marginTop: '15px' }}> 
              <TextField  placement='bottomEnd' accepter={DateRangePicker} ranges={Ranges} helpText="Select Date Range to filter or sort the data." block name="created" label="Carousel Item Created In-Between:"/>
              </Stack>
              <Stack wrap spacing={10} style={{ marginTop: '15px' }}> 
              <TextField size="lg" checkedChildren="Active" unCheckedChildren="In-Active"  accepter={Toggle} helpText="Select Date Range to filter or sort the data." block name="status" label="Carousel Item Status"/>
              </Stack>
              <Stack wrap spacing={20} justifyContent='center' style={{marginTop: '10px'}}>
                <Button onClick={handleFormSubmit}> {
                  filters ? 'Update Filters' :'Apply Filters'
                }</Button>
              </Stack>
            </Form>
        </Drawer.Body>
      </Drawer>
      <Drawer
        open={showAddCarouselItemDrawer}
        onClose={() => setShowAddCarouselItemDrawer(false)}
        placement="right"
        size="sm"
        backdrop={true}
      >
        <Drawer.Header>
          <Drawer.Title>Add Carousel Item</Drawer.Title>
          <Drawer.Actions>
            <Button onClick={() => setShowAddCarouselItemDrawer(false)}>Cancel</Button>
          </Drawer.Actions>
        </Drawer.Header>
        <Drawer.Body>
        <AddCarouselItemForm onClose={() => setShowAddCarouselItemDrawer(false)}
      />
        </Drawer.Body>
        {/* Add your Edit form or component here */}
        {/* Example: <EditForm data={selectedItem} onSubmit={editCarouselItem} onCancel={handleEditDrawerClose} /> */}
      </Drawer>
    <Grid fluid style={{minHeight: '60vh'}}>
      <Row>
        {loading ? (
          <Loader size="lg" center />
        ) : (
          <>
          {
            carouselItems.length < 1 ? <>
            
            <div
            style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '200px',
          }}
        >
          <div><MdImage size={200} />
          <p style={{ color: '#999', marginTop: '10px', textAlign: 'center', marginBottom: '10px' }}>No carousel items found.</p></div>
          <Stack>
            <Button onClick={() => setShowAddCarouselItemDrawer(true)}>Add Carousel Item</Button>
          </Stack>
        </div>
            
            </> : 
            <>
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
        {
          displayType == 'table' ? 
				            <>   
				            <Table height={420} rowHeight={56} headerHeight={40} data={getData()} 
            sortColumn={sortColumn}
            bordered cellBordered
            sortType={sortType}
            onSortColumn={handleSortColumn}
            loading={tableLoading}>
              <Column align="center" fixed flexGrow={1}>
            <HeaderCell>#</HeaderCell>
            <Cell>
              {(rowData, rowIndex) => {
                return <div>{rowIndex + 1}</div>;
              }}
            </Cell>
          </Column>
          <Column flexGrow={1} align="center" fixed>
            <HeaderCell >Carousel Id.</HeaderCell>
            <Cell dataKey='id' />
          </Column>
          <Column flexGrow={1} align="center" >
            <HeaderCell >Title</HeaderCell>
            <EditableCell onChange={handleChange} dataKey='title' />
          </Column>
          <Column flexGrow={1} align="center" >
            <HeaderCell >Position</HeaderCell>
            <EditableCell dataKey='position' onChange={handleChange} />
          </Column>
          
          <Column flexGrow={2} align="center" >
            <HeaderCell >Description</HeaderCell>
            <EditableCell onChange={handleChange} dataKey='description' />
          </Column>
          <Column flexGrow={2} align="center" >
            <HeaderCell >Caption</HeaderCell>
            <EditableCell onChange={handleChange} dataKey='caption' />
          </Column>
          <Column flexGrow={1} align="center" sortable>
            <HeaderCell >Created on</HeaderCell>
            <Cell>
              {(rowData) => {
                return <>{new Date(rowData.addedAt?.seconds * 1000).toLocaleString()}</>
              }}
            </Cell>
          </Column>
          <Column flexGrow={2} sortable align="center">
            <HeaderCell>Created By</HeaderCell>
            <NameCell>
            {rowData => rowData?.addedBy}   
          </NameCell>
          </Column>
          <Column flexGrow={1}>
        <HeaderCell>
              <MoreIcon/>
        </HeaderCell>
        <ActionCell dataKey="id" onClick={handleEditState} />
      </Column>
      </Table>
      </> : 
      <div style={{minHeight: '60vh'}}> 
      <Stack spacing={20} justifyContent='center' alignItems='center'  wrap style={{maxHeight: '60vh', overflow: 'auto'}}>
      {
        getData().map((item) => {
          return(
            <CarouselCard data={item} editCarouselItem={editCarouselItem} deleteCarouselItem={deleteCarouselItem} />
            )
          })
        }
        {
          tableData.length <=0 ? <Stack.Item>No Data Found.</Stack.Item> : <></>
        }
        </Stack>
       </div> }
            
            </>
          }
          </>
        )}
      </Row>
    </Grid></>
  );
};

const ViewCarouselItemsPage = ({ carouselItems, loading, fetchCarouselItems, deleteCarouselItem, editCarouselItem, handleRefreshCarouselItems  }) => {
  useEffect(() => {
    fetchCarouselItems();
  }, []);
  return (
    <Panel
      header={
        <>
          <h2 className="title">View Carousel items</h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item>Admin</Breadcrumb.Item>
            <Breadcrumb.Item>Carousel</Breadcrumb.Item>
            <Breadcrumb.Item active>View Carousel Items</Breadcrumb.Item>
          </Breadcrumb>
        </>
      }
    >
      
      <ViewCarouselItemsPageComponent carouselItems={carouselItems} editCarouselItem={editCarouselItem} deleteCarouselItem={deleteCarouselItem} loading={loading} fetchCarouselItems={fetchCarouselItems} handleRefreshCarouselItems={() => {fetchCarouselItems()}} />
    </Panel>
  );
};

const mapDispatchToProps = (dispatch) => ({
  fetchCarouselItems: () => dispatch(fetchCarouselItems()),
  deleteCarouselItem: (item) => dispatch(deleteCarouselItem(item)),
  editCarouselItem: (data) => dispatch(editCarouselItem(data)),
});

const mapStateToProps = (state) => ({
  carouselItems: state.carousel.carouselItems,
  loading: state.carousel.loading,
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewCarouselItemsPage);
