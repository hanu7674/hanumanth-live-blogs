import React, {lazy, useEffect} from "react";

import withSecurityQuestionVerification from "../pages/Admin/authentication/SecurityQuestions";
import { getApp } from "./Routes/helpers";
import { Content } from "rsuite";
  

const WithSecurityQuestionVerificationComponent = () => {
  const CurrentApp = getApp();
   return(
        <Content style={{paddingTop: '60px'}}>    
          <CurrentApp />
        </Content>
  )
}
export default withSecurityQuestionVerification(WithSecurityQuestionVerificationComponent);