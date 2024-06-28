import React, { useState, useEffect } from "react";
import { Col, Loader, Panel, Row, Modal, FlexboxGrid, Stack, Button, } from "rsuite";
import { LiaUsersSolid } from "react-icons/lia";
import { BiFullscreen, BiExitFullscreen } from 'react-icons/bi'
import { connect, useDispatch } from "react-redux";
import Loading from "../../../components/Loading/loading";
import { addFakeUserSignupLogs, fetchUserSignupLogs ,fetchTrafficData, getUsersDashboardHeaderData,} from "../../../redux/dashboard";
import ApexRealtimeChart from "./RealTimeChart";
import { signuplogs } from "../tables/members/mock";
import '../dashboard/styles.css'
const UsersDashboard = ({ usersHeaderData, userSignupLogs, usersHeaderDataLoading, fetchTrafficData, getHeaderData, }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };
  useEffect(() => {
    fetchTrafficData();
    fetchUserSignupLogs();
    getHeaderData();
  }, [])
  const dispatch = useDispatch();
  const handleClick = () => {
    const fakeData = signuplogs(100);
    setTimeout(() => {
      dispatch(addFakeUserSignupLogs(100, fakeData))
    }, 2000)
  }
  return (
    <>
      <Modal open={isModalVisible} onClose={toggleModal} backdrop='static' size='full' overflow={false}>
        <Modal.Header>
          <Modal.Title>Full Charts</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ApexRealtimeChart data={userSignupLogs}
            dataOptions={
              <>
                <FlexboxGrid justify='end'>
                  <FlexboxGrid.Item colspan={6}>
                    <FlexboxGrid justify='end'>
                      <Stack spacing={10}>
                        {
                          isModalVisible ? <>
                            <BiExitFullscreen onClick={toggleModal} />
                          </> : <><BiFullscreen onClick={toggleModal} /> </>
                        }</Stack></FlexboxGrid>
                  </FlexboxGrid.Item>
                </FlexboxGrid>
              </>
            } />

        </Modal.Body>
      </Modal>

      <Panel shaded >
        <Row gutter={30}>
          {/* <Button onClick={handleClick}>Add signuplogs</Button> */}
          <Col xs={20} sm={22} md={20} lg={16} xl={16}>
            {
              usersHeaderDataLoading ? <Loading /> :

                <ApexRealtimeChart data={userSignupLogs} dataOptions={
                  <>
                    <FlexboxGrid justify='space-between'>
                      <Stack>
                        Real-Time Registered Users's
                      </Stack>
                      <FlexboxGrid.Item colspan={6}>
                        <Stack spacing={10} justifyContent="flex-end">
                          {
                            isModalVisible ? <>
                              <BiExitFullscreen onClick={toggleModal} />
                            </> : <><BiFullscreen onClick={toggleModal} /> </>
                          }</Stack>
                      </FlexboxGrid.Item>
                    </FlexboxGrid>
                  </>
                } />}
          </Col>
          <Col lg={8} xl={8} md={12}>
            <Row gutter={20} className="dashboard-header" style={{ marginTop: '20px' }}>
   {usersHeaderDataLoading ? <Loader /> : <> {
                usersHeaderData && usersHeaderData.map((user) => {

                  return (
                    <Col key={user.label} xs={20} sm={22} md={22} lg={22} xl={22} >
                      <Panel className={`trend-box bg-gradient-${user.color}`} data-aos="fade-down" data-aos-anchor-placement="bottom-bottom"
                        data-aos-easing="ease-in-sine">
                        <div className="chart-img"><LiaUsersSolid size={64} /></div>
                        <div className="title">{user.label}</div>
                        <div className="value">
                      {user.count}</div>
                      </Panel>
                    </Col>
                  )
                })
              }
                    </> }
            </Row>
          </Col>

        </Row>
      </Panel>
    </>
  )
}
const mapDispatchToProps = dispatch => ({
  fetchUserSignupLogs: () => dispatch(fetchUserSignupLogs()),
  getHeaderData: () => dispatch(getUsersDashboardHeaderData()),
  fetchTrafficData: () => dispatch(fetchTrafficData()),
  fetchUserSignupLogs: () => dispatch(fetchUserSignupLogs()),
});
const mapStateToProps = state => ({
  usersHeaderDataLoading: state.dashboardData?.usersHeaderDataLoading,
cityCountData: state.dashboardData.cityCountData,
  countryCountData: state.dashboardData.countryCountData,
  userSignupLogs: state.dashboardData.userSignupLogs,
usersHeaderData: state.dashboardData?.usersHeaderData,
});
export default connect(mapStateToProps, mapDispatchToProps)(UsersDashboard);