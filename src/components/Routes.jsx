import React, {lazy, useEffect} from "react";
import { Container, Content, Divider, Header } from "rsuite";
 import NavBarComponent from "./NavBarComponent";
import Loading from "./Loading/loading";
import withUserStatusCheck from "../assets/withUserStatusCheck";
import  WithSecurityQuestionVerificationComponent from "./WithSecurityQuestionVerificationComponent";
 import FooterPage from "../pages/Footer";
const AppRoutes = () => {
  
    
    return(
        <React.Suspense fallback={<Loading />}>
                     

      <Container>           
        <Header>

           <NavBarComponent />
        </Header>          
          <Content>
            
         <WithSecurityQuestionVerificationComponent />
         </Content>
      </Container>
        <FooterPage/>
    </React.Suspense>
    )
}
export default withUserStatusCheck(AppRoutes);