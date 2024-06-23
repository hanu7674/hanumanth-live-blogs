import React, { useEffect } from "react";
import "./CertificationCard.css";
import { Button, Panel, Text } from "rsuite";
import { getCertificationList } from "../../../redux/auth";
import { connect } from "react-redux";
import Loading from '../../Loading/loading'
import { excerpt } from "../../../assets/constants";
 
const CertificationCard = ({getCertificationList, certificationListLoading, certificationList }) => {
  const  certifications= [
      {
        title: "Python for Everybody Specialization",
        subtitle: "- Charles Severance",
        logo_path: "University_of_Michigan.png",
        certificate_link: "https://www.coursera.org/account/accomplishments/specialization/certificate/WAZ5FD9XWRDM",
        alt_name: "University of Michigan",
        color_code: "#8C151599",
      },
      {
        title: "Programming for Everybody(Getting Started With Python)",
        subtitle: "- Charles Severance",
        logo_path: "University_of_Michigan.png",
        certificate_link:
          "https://www.coursera.org/account/accomplishments/verify/GQSPWDH82XFM",
        alt_name: "University of Michigan",
        color_code: "#8C151599",
      },
      {
        title: "Python Data Structures",
        subtitle: "- Charles Severance",
        logo_path: "University_of_Michigan.png",
        certificate_link: "https://www.coursera.org/account/accomplishments/verify/H8J86TX3BXHK",
        alt_name: "University of Michigan",
        color_code: "#8C151599",
      },
      {
        title: "Using Databases with Python",
        subtitle: "- Charles Severance",
        logo_path: "University_of_Michigan.png",
        certificate_link: "https://www.coursera.org/account/accomplishments/verify/CRYZT5UPM7AT",
        alt_name: "University of Michigan",
        color_code: "#8C151599",
      },
      {
        title: "Using Python to Access Web Data",
        subtitle: "- Charles Severance",
        logo_path: "University_of_Michigan.png",
        certificate_link: "https://www.coursera.org/account/accomplishments/verify/MSTJG8GFBK9M",
        alt_name: "University of Michigan",
        color_code: "#8C151599",
      },
      {
        title: "Capstone: Retrieving, Processing, and Visualizing Data with Python",
        subtitle: "- Charles Severance",
        logo_path: "University_of_Michigan.png",
        certificate_link: "https://www.coursera.org/account/accomplishments/verify/XM4C2MUU9974",
        alt_name: "University of Michigan",
        color_code: "#8C151599",
      },
      {
        title: "Programming in Java",
        subtitle: "- Prof.Debasis Samanta",
        logo_path: "nptel.png",
        certificate_link: "https://nptel.ac.in/content/noc/NOC19/SEM1/Ecertificates/106/noc19-cs07/Course/NPTEL19CS07S51540015191135463.jpg",
        alt_name: "University of Michigan",
        color_code: "#8C151599",
      },
      {
        title: "Cutshort Certified JavaScript - Advanced",
        subtitle: "- Cutshort Team",
        logo_path: "cutshort.png",
        certificate_link: "https://cutshort.io/certificate/45275",
        alt_name: "Cutshort",
        color_code: "#8C151599",
      },
      {
        title: "Web Designing using React Js",
        subtitle: "- APSSDC",
        logo_path: "apssdc.png",
        certificate_link: "https://drive.google.com/file/d/1fRCHzW9NlWZ_EEGlHNFeouQk3RHHGII3/view?usp=sharing",
        alt_name: "APSSDC",
        color_code: "#8C151599",
      },
      {
        title: "Python (Basic)",
        subtitle: "- Hackerrank",
        logo_path: "hackerrank.png",
        certificate_link: "https://www.hackerrank.com/certificates/ec4d2d225869",
        alt_name: "hackerrank",
        color_code: "#8C151599",
      },
      {
        title: "Problem Solving (Basic)",
        subtitle: "- Hackerrank",
        logo_path: "hackerrank.png",
        certificate_link: "https://www.hackerrank.com/certificates/0ae0b6c24dc0",
        alt_name: "hackerrank",
        color_code: "#8C151599",
      },
      {
        title: "Java (Basic)",
        subtitle: "- Hackerrank",
        logo_path: "hackerrank.png",
        certificate_link: "https://www.hackerrank.com/certificates/95df21a53036",
        alt_name: "hackerrank",
        color_code: "#8C151599",
      },
      {
        title: "Technical Support Fundamentals",
        subtitle: "- Google",
        logo_path: "google_logo.png",
        certificate_link: "https://www.coursera.org/account/accomplishments/specialization/certificate/WH6QWKTL4XE4",
        alt_name: "Google",
        color_code: "#8C151599",
      },
    ]
    useEffect(() => {
      getCertificationList();
    }, []);
    
    return (<>
 {
      certificationListLoading ? <Loading /> :
    
<div className="certs-body-div">{
      certificationList.map((certificate) =>{
        return(
        <Panel bordered shaded bodyFill className="cert-card" key={certificate.title} data-aos="fade-up"
        data-aos-easing="ease-in-back"
        data-aos-delay="100"
        data-aos-offset="0">
          <div className="content">
            <a
              href={certificate.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="content-overlay"></div>
              <div
                className="cert-header"
                style={{ backgroundColor: '#8C151599' }}
              >
                <img loading="lazy" 
                  className="logo_img"
                  src={certificate?.imageUrl}
                  alt={certificate.title}
                />
              </div>
              <div className="content-details fadeIn-top">
                <h3 className="content-title"  >
                  Certificate
                </h3>
              </div>
            </a>
          </div>
          <Panel shaded >
          <div className="cert-body">
            <h2 className="cert-body-title"  >
            <Text size='xxl' align='center'>
             {
            excerpt( certificate.title, 30)
          }
           </Text>
             </h2>
            <h3
              className="cert-body-subtitle"
             >
              {certificate.issuer}
            </h3>
            <p>({certificate?.startDateMonth+ ' ' + certificate?.startDateYear + ' - '+ certificate?.endDateMonth+ ' ' + certificate?.endDateYear })</p>
          </div>
          </Panel>
        </Panel>)
      })
    }
        </div>
 }
        </>
    );
}
const mapDispatchToProps = dispatch => ({
  getCertificationList: () => dispatch(getCertificationList()),
 });
const mapStateToProps = state => ({
  certificationListLoading: state.auth?.certificationListLoading,
  certificationList: state.auth?.certifications,
});
export default connect(mapStateToProps, mapDispatchToProps)(CertificationCard);

