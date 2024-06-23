import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateStatus } from '../../../redux/auth';
import { Form, SelectPicker, Button, Modal, Loader, Message, Text, Panel, Breadcrumb, Stack } from 'rsuite';
import { withAuthorization } from '../../../Session';

 
const ManageAppStatus = () => {
  const [newStatus, setNewStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
const { appStatus, appStatusLoading, appStatusError } = useSelector((state) => state.auth);

  const handleChange = (value) => {
    setNewStatus(value);
  };

  const handleSubmit = () => {
    setIsModalOpen(true);
  };

  const confirmChange = () => {
    dispatch(updateStatus(newStatus));
    setIsModalOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Maintenance', value: 'maintenance' },
    { label: 'Production Down', value: 'production-down' },
    { label: 'Under Construction', value: 'under-construction' },
    { label: 'Coming Soon', value: 'coming-soon' },
    { label: 'Beta', value: 'beta' },
  ];
  const getStatusType = (status) => {
    switch (status) {
        case 'active':
            return 'success';
          case 'maintenance':
            return 'warning';
          case 'production-down':
            return 'error';
          case 'under-construction':
            return 'info';
          case 'coming-soon':
            return 'info';
          case 'beta':
            return 'info';
          default:
            return 'info';
        }
  };
const [changeStatus, setChangeStatus] = useState(false);
  const handleChangeStatus = () => {
setChangeStatus(!changeStatus);
  }
  return (
    <div>
      <Panel
        header={
          <>
            <h2 className="title">Application Status Management</h2>
            <Breadcrumb>
              <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
              <Breadcrumb.Item>Admin</Breadcrumb.Item>
              <Breadcrumb.Item active>App Status</Breadcrumb.Item>
            </Breadcrumb>
          </>
        }
      >
<Message   type={getStatusType(appStatus)}>
 Current Status: {appStatus} <Button appearance='link' onClick={handleChangeStatus}>
{changeStatus ? 'Cancel' : 'Change Status'}
  </Button>
  {
    changeStatus ? <>
        <Form fluid layout="inline" onSubmit={handleSubmit}>
<Form.Group controlId="appStatus">
             <SelectPicker
              data={statusOptions}
              value={newStatus}
              defaultValue={appStatus}
              onChange={handleChange}
              style={{ width: 224 }}
            />
          </Form.Group>
<Button appearance="primary" onClick={handleSubmit} disabled={appStatusLoading}>
            Update Status
          </Button>
        </Form>
    </> : <></>
}
    </Message>

        {appStatusLoading && <Loader backdrop content="Updating appStatus..." vertical />}
{appStatusError && <Message type="appStatusError" description={appStatusError.message} />}
      </Panel>

<Modal open={isModalOpen} onClose={closeModal}>
        <Modal.Header>
          <Modal.Title>Confirm Status Change</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to change the appStatus to "{newStatus}"?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={confirmChange} appearance="primary">
            Yes
          </Button>
          <Button onClick={closeModal} appearance="subtle">
            No
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
const condition = (authUser) =>authUser && (!!authUser?.roles?.includes('SUPER_ADMIN'));

export default withAuthorization(condition)(ManageAppStatus);

 