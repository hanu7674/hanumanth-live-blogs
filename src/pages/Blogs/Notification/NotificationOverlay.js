import React, { useState, useEffect } from "react";
import { Popover, OverlayTrigger, Nav, Row, Col } from 'react-bootstrap'
import { compose } from "recompose";
import { withAuthorization } from "../../../Session";
import { AiOutlineBell } from "react-icons/ai"
import './index.css'
import { Link, useNavigate } from "react-router-dom";
import Timestamp from "react-timestamp"
import { useDispatch, useSelector } from "react-redux";
import { getNotificaions } from "../../../redux/ActionCreators";
import  Avatar  from "react-avatar";
import { Badge, Button } from "rsuite";
function NotificationOverlay() {
	const authUser = useSelector(state => state.authState?.user);
	const [show, setShow] = useState(false);
    const data = useSelector((state) => state.notification.notifications);
	const Navigate = useNavigate()
	const dispatch = useDispatch();
	const handleClick = (event) => {
		setShow(!show);
	};

    useEffect(() => {
if(authUser?.id){
        dispatch(getNotificaions())
}
    // eslint-disable-next-line react-hooks/exhaustive-deps
},[])
	const viewMore = () => {
		Navigate('/notifications')
	}
    const renderTooltip = (props) => (
			<Popover id='button-tooltip' className="mt-3" {...props}>
				<Popover.Header as='h3' style={{ color: "black" }}>
					Notifications
				</Popover.Header>
			<Popover.Body className='notification-body'>
					<>
					{
					data?.length > 0 ?
						<>
							{
					data.map((notification) => (
						<div key={notification?.id}>
							<article className='notification-card border-bottom mb-1'>
								<Row>
									<Col xs={2}>
									{
										notification?.postedBy?.photoURL || notification?.approvedBy?.photoURL ? (
											<Avatar src={notification?.postedBy?.photoURL || notification?.approvedBy?.photoURL} name={null} round={true} size='35px' />
											
										  ) : (
											<Avatar name={notification?.postedBy?.firstName + notification?.postedBy?.lastName || notification?.approvedBy?.firstName + notification?.approvedBy?.lastName} round={true} size='35px'/>
										  )
										
									}
									</Col>
        <Col xs={9}><p className='mb-0 fs-6'>{notification?.shortDescription}</p>
										<p className='mt-0 fs-6'>
											<Link
												to={{
													pathname: `/notification/${notification?.title}`,
													state: {
														notification,
													},
													search: `id=${notification?.id}`
												}}>
												click here{" "}
											</Link>
											for more{" "}
										</p>
										<p className="mt-0 fs-6">
											<Timestamp relative date={notification?.timestamp?.toDate().toString()} autoUpdate />
										</p></Col>
								</Row>
							</article>
							
						</div>
					))
					
							}
							<p className=" text-center" style={{fontSize: "0.675rem"}}>
								<Button onClick={viewMore} className="mt-3">
									More Notifications
								</Button>
</p>			
						</>
						: <>
							Notifications Not available.
						</>
				}
					</>	
				
				</Popover.Body>
			</Popover>
		);
	return (
		<>
			<OverlayTrigger
                placement='bottom-end'
                rootClose
				delay={{ show: 250, hide: 400 }}
                trigger={['click']}
				overlay={renderTooltip}>
				<Nav.Link onClick={handleClick}>
					<Badge content={data?.length >=1 ? data?.length : false}>
					<AiOutlineBell size={25}></AiOutlineBell>

					</Badge>
				</Nav.Link>
			</OverlayTrigger>
		</>
	);
}
export default compose(NotificationOverlay);