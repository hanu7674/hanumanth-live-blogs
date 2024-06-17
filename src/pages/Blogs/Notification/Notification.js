import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import parse from "html-react-parser";
import {FcPrint} from "react-icons/fc"
import Timestamp from "react-timestamp"
import { useLocation } from "react-router-dom";
import { compose } from "recompose";
import { withAuthorization } from "../../../Session";
import Loading from "../../Loading/loading";
import { useDispatch, useSelector } from "react-redux";
import { getNotificationById } from "../../../redux/ActionCreators";

function printPage() {
	window.print();
}

const NotificationContent = ({ notification }) => (
	<>
		<div className='container' >
			<div className='container-fluid bg-light' style={{minHeight: "80vh"}}>
				<div>
					<div
						className='text-center text-muted text-uppercase'
						style={{ fontFamily: "courier" }}>
						{notification.title}
					</div>
					<div className='float-right'>
						<FcPrint onClick={printPage} size={24}></FcPrint>
					</div>
				</div>

				<div className=''>
					<h4 className='text-whitesmoke' style={{ fontFamily: "courier" }}>
						Short Description (Subject):
					</h4>
					{notification.shortDescription ? (
						<>
							<h4
								className='text-whitesmoke mt-0 mb-0 m-5'
								style={{ fontFamily: "courier" }}>
								{parse(notification.shortDescription)}
							</h4>
						</>
					) : (
						<></>
					)}
				</div>
				<div className=''>
					<h4 className='text-whitesmoke' style={{ fontFamily: "courier" }}>
						Detailed Description:
					</h4>
					{notification?.Description ? <><h4
						className='text-whitesmoke mt-0 mb-0 m-5'
						style={{ fontFamily: "courier" }}>
						{parse(notification?.Description)}
					</h4></> : <>
					Detaild description not available
					</>}
					
				</div>
				<div style={{float: "right", display:"flex"}}>
					{notification?.postedBy || notification?.approvedBy ? (
					<div className='text-muted font-size-small'>
						Updated by {notification?.postedBy?.firstName + notification?.postedBy?.lastName || notification?.approvedBy?.firstName + notification?.approvedBy?.lastName} on
						{notification?.timestamp ? (
							<>
								{" "}
								<Timestamp relative date={notification?.timestamp?.toDate().toString()} autoUpdate />
							</>
						) : (
							""
						)}
					</div>
				) : (
					"No Data Available"
				)}
				</div>
				
			</div>
		</div>
	</>
);
function Notification(props) {
	function useQuery() {
		const { search } = useLocation();
		return React.useMemo(() => new URLSearchParams(search), [search]);
	}
	let query = useQuery();
	const location = useLocation();
	console.log(location);
	const notification = useSelector((state)=> state.notification?.notification);
	const loading = useSelector((state) => state.notification.loading);
	const dispatch = useDispatch();
	let notificationId = query.get("id")
	useEffect(() => {
			dispatch(getNotificationById(notificationId))
		// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [notificationId]);
	return (
		<div className='container mt-5'>
			<>			
			{loading ? (
				<>
					<Loading/>
				</>
			) : (
				<>
					{notification ? (
						<>
							<NotificationContent notification={notification} />
						</>
					) : (
								<>
									No details available
								</>
					)}
				</>
			)}</>
		</div>
	);
}
const condition = (authUser) =>
	authUser;

export default compose(withAuthorization(condition))(Notification);