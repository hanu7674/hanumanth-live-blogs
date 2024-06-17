import React from "react";
import Lottie from "react-lottie";
import animationData from '../../../assets/Lotties/contact-me.json';
import {FaGithub, FaFacebook, FaGoogle, FaTwitter, FaInstagram, FaLinkedinIn, FaWhatsapp} from "react-icons/fa"
import './index.css';
import { Link } from "react-router-dom";
import { Col, Container, Panel, Row, Text } from "rsuite";
const Contact = () =>{
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice",
        },
      };
      const socialMediaLinks = [
        {
          name: "Github",
          link: "https://github.com/hanu7674",
          icon: <FaGithub size={30}/>, // Reference https://fontawesome.com/icons/github?style=brands
          backgroundColor: "black", // Reference https://simpleicons.org/?q=github
        },
        {
          name: "LinkedIn",
          link: "https://www.linkedin.com/in/hanu7674/",
          icon: <FaLinkedinIn size={30}/>, // Reference https://fontawesome.com/icons/linkedin-in?style=brands
          backgroundColor: "#0077B5", // Reference https://simpleicons.org/?q=linkedin
        },
        //youtube channel link
        // {
        //   name: "YouTube",
        //   link: "https://www.youtube.com/channel/UC_amoXmmxSY9KusoDczDTXQ",
        //   fontAwesomeIcon: "fa-youtube", // Reference https://fontawesome.com/icons/youtube?style=brands
        //   backgroundColor: "#FF0000", // Reference https://simpleicons.org/?q=youtube
        // },
        {
          name: "Gmail",
          link: "mailto:hanumanth.lingala@gmail.com",
          icon: <FaGoogle size={30}/>, // Reference https://fontawesome.com/icons/google?style=brands
          backgroundColor: "#D14836", // Reference https://simpleicons.org/?q=gmail
        },
        {
          name: "Twitter",
          link: "https://twitter.com/hanu7674",
          icon : <FaTwitter size={30}/>, // Reference https://fontawesome.com/icons/twitter?style=brands
          backgroundColor: "#1DA1F2", // Reference https://simpleicons.org/?q=twitter
        },
        {
          name: "Facebook",
          link: "https://www.facebook.com/hanu7674/",
          icon: <FaFacebook size={30}/>, // Reference https://fontawesome.com/icons/facebook-f?style=brands
          backgroundColor: "#1877F2", // Reference https://simpleicons.org/?q=facebook
        },
        {
          name: "Instagram",
          link: "https://www.instagram.com/hanu7674/",
          icon: <FaInstagram size={30}/>, // Reference https://fontawesome.com/icons/instagram?style=brands
          backgroundColor: "#E4405F", // Reference https://simpleicons.org/?q=instagram
        },
        {
            name: "Whatsapp",
            link: "https://wa.me/917674070018?text=Hi, I wanted to connect with you ",
            icon: <FaWhatsapp size={30}/>, // Reference https://fontawesome.com/icons/instagram?style=brands
            backgroundColor: "green", // Reference https://simpleicons.org/?q=instagram
          },
      ];
    return(
        <Container  style={{ margin: "2% 12% 8% 12%"}}>
    <Text align="center" size="4rem"  weight="extrabold" muted> <u>Contact Me</u></Text>

        <Row  style={{ margin: "2% 0% 0% 0%"}}>
            <Col md={10} sm={24} className="col-md-6 col-sm-12" data-aos="fade-right">
            <Lottie
                  options={defaultOptions}
                  isClickToPauseDisabled={false}
                  title="connect with lingala hanumantha reddy "
                />
            </Col>
            <Col md={14} sm={24} className="col-md-6 col-sm-12" data-aos="fade-left">
                <Panel bordered shaded   >               
                 
                <div  style={{ margin: "2% 0% 0% 0%"}}>
                <Text align="center"  size="1.8rem">Thank you for viewing my my portfolio.</Text> 
                <Text align="center"  size="1.2rem">I really hope you've  enjoyed looking of my work.</Text>
                 </div>
                     <div style={{ margin: "2% 0% 0% 0%"}}>

                    
                <p>I’m currently available for freelance work so feel free to contact me using this form <Link to="/connect-with-me" className="text-decoration-none">here</Link>.
</p><Text align="center" style={{ margin: "2% 0% 2% 0%"}}>
 I’ll get back to you quickly –  within 24 hours on business days.
</Text>
</div>
                  
                <p style={{textIndent: '50px', margin: "2% 0% 2% 0%"}}>
                Whether you’re a new business looking to launch your brand into the world or a large, established business, I’m happy to cater to your needs. I understand that every company, big or small, has different needs and requirements. Therefore, every job is be treated accordingly. If you are a new business or individual and don’t know where to start, that’s fine too! I’m more than happy to give advice and try and point you in the right direction.


                </p>
                <div className="social-icons-bar">
                    <span className="navbar-text">
              <div className="social-icon">
              {socialMediaLinks.map((media) => {
        return (
            <a href={media.link} referrerPolicy="no-referrer" target="_blank" rel="noreferrer">
                <span style={{color:  media.backgroundColor}} className="social-icon-hover">
                {
                    media.icon
                }</span>
            </a>
        );
      })}
              </div>
              </span>
                </div>
                </Panel>
            </Col>
        </Row>
        {/* <div className="row mt-5 pt-5">
            <div className="col-md-8 col-sm-12" data-aos="zoom-in-up">
                <div className="m-3">
                        <div className="contact-form">

                
                

                            
                        </div>
                </div>
            </div>
            <div className="col-md-4 col-sm-12" data-aos="zoom-in-up">
                <div className="m-5">
            Email
My preferred method of project disussion is via email. Please complete the form on this page to send me through an enquiry. Alternatively, you can send me an email at: info[at]ckgd.net

Skype
If you wish to contact me via Skype regarding a project, feel free to add me: ckgdesign.

Phone
Whilst my preferred method of communication is via email, I’m happy to discuss projects with you over the phone – send me an email and I’ll get in touch!
</div></div>
        </div> */}
        </Container>
    )
}

export default Contact;