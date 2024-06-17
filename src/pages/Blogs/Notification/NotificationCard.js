import React from 'react'
import parse from "html-react-parser";
import {Table } from "rsuite";
import './index.css'
function NotificationCard({notification, index}) {
	return (
		<>
			<div className='container'>
				<Table striped bordered hover responsive>
				<thead>
					<tr>
						<th>#</th>
						<th>First Name</th>
						<th>Last Name</th>
						<th>Email</th>
						<th>Username</th>
						<th>Actions</th>
					</tr>
					</thead>
					</Table>
			</div>
		</>
		// <article className='job-card'>
		// 	<div className='company-logo-img-drive'>
		// 		{notification.postedBy.photoURL ? (
		// 			<>
		// 				<img
		// 					src={notification.postedBy.photoURL}
		// 					alt={notification.postedBy.fullName}
		// 					className='nav-user-avatar'
		// 					onError={(event) => {
		// 						event.target.src =
		// 							"https://firebasestorage.googleapis.com/v0/b/placement-7674.appspot.com/o/fa-user-circle.png?alt=media&token=b14d09fb-745a-4438-9850-b3f6e0eafd90";
		// 						event.onerror = null;
		// 					}}
		// 				/>
		// 			</>
		// 		) : (
		// 			<></>
		// 		)}
		// 	</div>
		// 	<div className='job-title'>
		// 		{notification.title ? <>{notification.title}</> : "No Data Available"}
		// 	</div>
		// 	<div className='notification-description'>
		// 		{notification.shortDescription
		// 			? notification.shortDescription
		// 			: "No Data Available"}
		// 	</div>
		// 	<div className='skills-container '>
		// 		{notification.title ? (
		// 			<>
		// 				<Link
		// 					to={{
		// 						pathname: `/notification/${notification.title}`,
		// 						state: {
		// 							notification,
		// 						},
		// 					}}>
		// 					click here{" "}
		// 				</Link>
		// 				for detailed notification{" "}
		// 				{/* {notification.postedDate.toLocaleString()} */}
		// 			</>
		// 		) : (
		// 			"No Data Available"
		// 		)}
		// 	</div>
		// 	<Timestamp relative date={notification.postedDate} autoUpdate />
		// </article>
	);
}
export default NotificationCard;