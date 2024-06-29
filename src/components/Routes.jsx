import React from "react";
import { Container, Content,  Header } from "rsuite";
 import NavBarComponent from "./NavBarComponent";
import Loading from "./Loading/loading";
import withUserStatusCheck from "../assets/withUserStatusCheck";
import  WithSecurityQuestionVerificationComponent from "./WithSecurityQuestionVerificationComponent";
 import FooterPage from "../pages/Footer";
 import { useLocation } from 'react-router-dom';

const AppRoutes = () => {
  const location = useLocation();
    const path = location.pathname;

    // Define routes that have a sidebar
const routesWithSidebar = ['/admin', '/user', '/profile/user', '/author'];

    // Check if the current route is one of the routes with a sidebar
    const hasSidebar = routesWithSidebar.some(route => path.startsWith(route));

    
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
      {!hasSidebar &&  <FooterPage/> }
    </React.Suspense>
    )
}
export default withUserStatusCheck(AppRoutes);