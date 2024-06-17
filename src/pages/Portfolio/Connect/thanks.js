import React  from "react";
import Lottie from "react-lottie";
import { useLocation } from "react-router";
import animationData from '../../../assets/Lotties/thanks.json';
 import {   Stack, Text } from "rsuite";
import { useSelector } from "react-redux";

const Thankyou = () => {
    const location = useLocation();
  const contactUsFormData = useSelector((state) => state.auth?.contactUsFormData)

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
        <div style={{ margin: "2% 12% 1% 12%" }}> 
        
        <Stack justifyContent="center">
             
        <Lottie
                  options={defaultOptions}
                  isClickToPauseDisabled={false}
                  title="Thanks for connecting with lingala hanumantha reddy "
                /> 
                  </Stack>
        <Text align="center" weight="bold" size='xxl'>
        Thank you for getting in touch with me - {contactUsFormData?.firstName + ' ' + contactUsFormData?.lastName}
</Text>
         
               </div>
</>
    )
}
export default Thankyou;