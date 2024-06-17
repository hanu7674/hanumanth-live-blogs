import React from "react";
import "./index.css";
import {FaGithub, FaFacebook, FaGoogle, FaTwitter, FaInstagram, FaLinkedinIn, FaWhatsapp} from "react-icons/fa"
import { Button, Form } from "react-bootstrap";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { submitSubscribe } from "../../redux/ActionCreators";
import './index.css';
import Logo from "../../Assets/images/logo/logo-transparent-png.png";

const BlogFooter = () => {
  const socialMedia = []
      // const socialMedia = [
      //   {
      //     name: "Github",
      //     link: "https://github.com/hanu7674",
      //     icon: <FaGithub size={30}/>, // Reference https://fontawesome.com/icons/github?style=brands
      //     backgroundColor: "#2f2f2f", // Reference https://simpleicons.org/?q=github
      //   },
      //   {
      //     name: "LinkedIn",
      //     link: "https://www.linkedin.com/in/hanu7674/",
      //     icon: <FaLinkedinIn size={30}/>, // Reference https://fontawesome.com/icons/linkedin-in?style=brands
      //     backgroundColor: "#0077B5", // Reference https://simpleicons.org/?q=linkedin
      //   },
      //   //youtube channel link
      //   // {
      //   //   name: "YouTube",
      //   //   link: "https://www.youtube.com/channel/UC_amoXmmxSY9KusoDczDTXQ",
      //   //   fontAwesomeIcon: "fa-youtube", // Reference https://fontawesome.com/icons/youtube?style=brands
      //   //   backgroundColor: "#FF0000", // Reference https://simpleicons.org/?q=youtube
      //   // },
      //   {
      //     name: "Gmail",
      //     link: "mailto:hanumanth.lingala@gmail.com",
      //     icon: <FaGoogle size={30}/>, // Reference https://fontawesome.com/icons/google?style=brands
      //     backgroundColor: "#D14836", // Reference https://simpleicons.org/?q=gmail
      //   },
      //   {
      //     name: "Twitter",
      //     link: "https://twitter.com/hanu7674",
      //     icon : <FaTwitter size={30}/>, // Reference https://fontawesome.com/icons/twitter?style=brands
      //     backgroundColor: "#1DA1F2", // Reference https://simpleicons.org/?q=twitter
      //   },
      //   {
      //     name: "Facebook",
      //     link: "https://www.facebook.com/hanu7674/",
      //     icon: <FaFacebook size={30}/>, // Reference https://fontawesome.com/icons/facebook-f?style=brands
      //     backgroundColor: "#1877F2", // Reference https://simpleicons.org/?q=facebook
      //   },
      //   {
      //     name: "Instagram",
      //     link: "https://www.instagram.com/hanu7674/",
      //     icon: <FaInstagram size={30}/>, // Reference https://fontawesome.com/icons/instagram?style=brands
      //     backgroundColor: "#E4405F", // Reference https://simpleicons.org/?q=instagram
      //   },
      //   {
      //       name: "Whatsapp",
      //       link: "https://wa.me/917674070018?text=Hi, I wanted to connect with you ",
      //       icon: <FaWhatsapp size={30}/>, // Reference https://fontawesome.com/icons/instagram?style=brands
      //       backgroundColor: "green", // Reference https://simpleicons.org/?q=instagram
      //     },
      // ];
      const [email, setEmail] = useState('');
      const [name, setName] = useState('');
      const [validated, setValidated] = useState(false);
      const dispatch = useDispatch();
      const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === true) {
          event.preventDefault();
          const formData = {
            email: email,
            name: name
          }
          dispatch(submitSubscribe(formData))
          event.stopPropagation();
        }
        setValidated(true);
      };
      const year = new Date().getFullYear();
  return (
    <>
 <footer className=" bg-dark">
  <div className="blog-footer-hr"></div>
 <div className="footer-box">
 <div className='m-5 text-center'>
            <img style={{height: "64px", width: "300px"}} src={Logo}/>
            <div></div>
</div>
<div><h3 className="text-center text-secondary text-gradient">Subscribe to blogs</h3>
       
       <div className="m-3 row" style={{display: "flex",alignItems: "center", flexWrap: "nowrap",flexDirection: "column",justifyContent:"center"}}>
        <div className="col-md-4 col-sm-8 col-xs-12">
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Control
        type="text"
        id="inputName"
        className="bg-transparent text-light m-2"
        placeholder="Enter full name" 
        onChange={(e) => setName(e.target.value)}
        value={name}
      />
      <Form.Control
        type="email"
        id="inputemail"
        className="bg-transparent text-white m-2"
        placeholder="Enter email address" 
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
        <Button className="text-center" style={{width: 'max-content',display: "flex", alignContent: "center", alignItems: "center",margin: "auto", textAlign: "center"}} type="submit">
            Subscribe
         </Button>  
        </Form></div>
        </div>
        
       <div className="social-icons-bar">
                    <span className="navbar-text">
              <div className="social-icon">
              {socialMedia.map((media) => {
        return (
            <a key={media.link} href={media.link} referrerPolicy="no-referrer" target="_blank" rel="noreferrer">
                <span style={{color: media.backgroundColor}}>
                {
                    media.icon
                }</span>
            </a>
        );
      })}
              </div>
              </span>
                </div></div>
       
     </div>
   <div className="bottom-blog">
     <p>Copyright &copy; {year} <i className="fw-bold">@Hanumanth</i> , All rights reserved.</p>
     <span>Best viewing experience at <b>1920*1080</b></span>
   </div>
 </footer>
    </>
  );
};

export default BlogFooter;
