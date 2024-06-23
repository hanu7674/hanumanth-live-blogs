import { initializeApp } from 'firebase/app';
import { config } from './config'
import { collection, collectionGroup, doc, getFirestore, serverTimestamp, writeBatch} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getMessaging } from "firebase/messaging";
import { getDatabase, ref as dbRef } from "firebase/database";
import { getStorage, ref } from 'firebase/storage';
import { getAnalytics } from "firebase/analytics";
export const app = initializeApp(config);
export const firestoreDb = getFirestore(app);
export const auth = getAuth(app)
export const db = getDatabase(app);
export const messaging = getMessaging(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
export const batch = writeBatch(firestoreDb);
export const usersRef = () => collection(firestoreDb, "/users");
export const securityQuestionsCollectionRef = () => collection(firestoreDb, `securityQuestions`);
export const securityQuestionsRef = (uid) => doc(firestoreDb, `securityQuestions/${uid}`);
export const todosRef = () => collection(firestoreDb, "/todos");
export const userRef = (id) => doc(firestoreDb, `/users/${id}`);
export const userLogRef = (uid, id) => doc(firestoreDb, `/users/${uid}/logs/${id}`);
export const userLogCollectionRef = (uid) => collection(firestoreDb, `/users/${uid}/logs`);
export const usernameRef = (id) => doc(firestoreDb, `/usernames/${id}`);
export const usermetadata = (id) => doc(firestoreDb, `/metadata/userdata/users/${id}`);
export const savePasswordsForDemo = (id) => doc(firestoreDb, `/passwords/${id}`);
export const usermetadataRef = () => collection(firestoreDb, `/metadata/userdata/users`);
export const users = () => collection(firestoreDb, "users");
export const carouselSettingsRef = () => doc(firestoreDb, 'settings/carousel');
export const carouselRef = () => collection(firestoreDb, "/carousel");
export const carouselRefById = (id) => doc(firestoreDb, `/carousel/${id}`);
export const notificationsCollection = () => collection(firestoreDb, `notifications`);
export const notificationById = (id) => doc(firestoreDb, `/notifications/${id}`);
export const eventsRef = () => collection(firestoreDb, "/events");
export const eventRefById = (id) => doc(firestoreDb, `/events/${id}`);
export const dashboardDataRef = () => collection(firestoreDb, "/dashboard");
export const pageViewsRef = () => collection(firestoreDb, "/pageViews");
export const trafficRef = () => collection(firestoreDb, "/traffic");
export const pageViewsRefByParameter = (date, parameter, pageId) => doc(firestoreDb, `/traffic/${date}/${parameter}/${pageId}`);
export const trafficCollectionGroupRef = () => collectionGroup(firestoreDb, 'traffic');
export const pageViewsRefById = (id) => doc(firestoreDb, `/pageViews/${id}`);
export const configRef = () => collection(firestoreDb, '/config');
export const configRefById = (id) => doc(firestoreDb, `/config/${id}`);
export const routeConfigRef = () => collection(firestoreDb, `/config/routeToPageId/routes`);
export const routeConfigRefById = (id) => doc(firestoreDb, `/config/routeToPageId/routes/${id}`);
export const imageUploadPath = (uid, fileName) =>ref(storage, `images/profile/${uid}/${fileName}`);
export const carouselFilesUploadPath = (fileName) =>ref(storage, `carousel/${fileName}`);
export const blogFilesUploadPath = (fileName) =>ref(storage, `blogs/${fileName}`);
export const browserCollectionRef = () => collection(firestoreDb, 'browsers');
export const browserCollectionRefByAgent = (id) => doc(firestoreDb, `browsers/${id}`);
export const fileRef = (path) => ref(storage, path);
export const groupChatCollection = () => collection(firestoreDb, 'groups');
export const chatProfileImageUploadPath = (fileName) =>ref(storage, `images/chats/${fileName}`);
export const ticketsCollection = () => collection(firestoreDb,'tickets');
export const ticketById = (id) => doc(firestoreDb, `/tickets/${id}`);

export const ipDataRef = (ip) => dbRef(db, `traffic/${ip}`);
export const ipDataCollectionRef = () => dbRef(db, `traffic`);
export const webAppTrafficCollectionRef = () => collection(firestoreDb, 'webapp');
export const webAppTrafficDocRef = (date) => doc(firestoreDb, `webapp/${date}`);
export const pageViewRef = (pageId, id) => doc(firestoreDb, `pages/${pageId}/views/${id}`);
export const pageViewRefById = (pageId) => doc(firestoreDb, `pages/${pageId}`);
export const pageView = () => collection(firestoreDb, `pages`);

export const reviewCollection = () => collection(firestoreDb, 'reviews')
export const reviewById = (id) => doc(firestoreDb, `reviews/${id}`)
export const testimonialById = (id) => doc(firestoreDb, `testimonials/${id}`)
export const testimonialCollection = () => collection(firestoreDb, 'testimonials')

export const userSignupLogs = () => collection(firestoreDb, `userSignupLogs`);
export const userSignupLogsById = (id) => doc(firestoreDb, `userSignupLogs/${id}`);

export const emailCollection = () => collection(firestoreDb, 'mail');
export const templatesColRef = () => collection(firestoreDb, 'templates');
export const templateDocRef = (id) => doc(firestoreDb, `templates/${id}`);
export const templateFiles = (id,filename) =>
  ref(storage, `files/templates/${id}/${filename}`);
// blogs
export const userDataUploadPath = (uid, filename) => ref(storage, `files/${uid}/${filename}`);
  export const blogCollection = () => collection(firestoreDb, "/blogs");
  export const blogCollectionToReview = (id) => doc(firestoreDb, `/review/${id}`);
  export const blogDoc = (id) => doc(firestoreDb, `/blogs/${id}`);
  export const blogReviewDoc = (id) => doc(firestoreDb, `/review/${id}`);
  export const headerImageRef = (url) => ref(storage, `${url}`);
  export const deletedBlogRef = () => collection(firestoreDb, "/deletedBlogs");
  export const commentsRef = (id) =>
    collection(firestoreDb, `/blogs/${id}/comments`);
  export const commentsDocRef = (id, commentId) =>
    doc(firestoreDb, `/blogs/${id}/comments/${commentId}`);
  export const replyCommentsRef = (postId, commentId) =>
    doc(firestoreDb, `/blogs/${postId}/comments/${commentId}`);
  export const replyCommentsRefDoc = (postId, replyId) =>
    doc(firestoreDb, `/blogs/${postId}/comments/${replyId}`);
  export const replyCommentsRefCol = (postId, replyId, replyParent) =>
    collection(
      firestoreDb,
      `/blogs/${postId}/comments/${replyParent}/${replyId}`
    );
  export const categories = () => doc(firestoreDb, `/config/categories`);
export const contactUsCollection = () => collection(firestoreDb, '/contactUS')
export const educationCollection = () => collection(firestoreDb, '/education')
export const educationById = (id) => doc(firestoreDb, `/education/${id}`)
export const profileFilesUploadPath = (fileName) =>ref(storage, `profile/${fileName}`);
export const projectsCollection = () => collection(firestoreDb, '/projects')
export const projectsById = (id) => doc(firestoreDb, `/projects/${id}`)
export const experienceCollection = () => collection(firestoreDb, '/experiences')
export const experienceById = (id) => doc(firestoreDb, `/experiences/${id}`)
export const certificationsCollection = () => collection(firestoreDb, '/certifications')
export const certificationsById = (id) => doc(firestoreDb, `/certifications/${id}`)

export const appStatusDocRef = () => dbRef(db, 'appStatus/status');