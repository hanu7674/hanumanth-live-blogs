import React  from "react";
import Lottie from "react-lottie";
import { useLocation } from "react-router";
import animationData from '../../Assets/Lotties/thanks.json';
import './index.css';

const Thankyou = () => {
    const location = useLocation();
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice",
        },
      };
    return(
        <>
        <div className="thanks-main m-0"> 
        
        <div className="row align-items-center justify-content-center mt-5 text-white">
            <div className="col-6">

        <Lottie
                  options={defaultOptions}
                  isClickToPauseDisabled={false}
                  title="Thanks for connecting with lingala hanumantha reddy "
                /> 
        </div>            </div>
        <div className="row">
        <div className="col fs-1 text-center mt-2 fw-bold">
        Thank you for getting in touch with me - {location?.state?.firstName + ' ' + location?.state?.lastName}

        </div>
        </div>
               </div>
</>
    )
}
export default Thankyou;