import React from "react";
import UserStatusPage from "./Auth/StatusPage";
class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, error: null };
    }
  
    static getDerivedStateFromError(error) {
      // Update state to display fallback UI
      return { hasError: true };
    }
  
    componentDidCatch(error, errorInfo) {
      // You can also log the error to an error reporting service
      this.setState({error: {error, errorInfo}})
      console.error(error, errorInfo); 
    }
  
    render() {
      if (this.state.hasError) {
        // Render fallback UI
        return <UserStatusPage
          error = {this.state.error}
         status={{ type: 'Some Error Occured!', title: 'Oops… Something went wrong.', message: 'Something went wrong. Please contact support for assistance.' }} />;
      }
  
      // Render children if there's no error
      return this.props.children;
    }
  }

  export default ErrorBoundary;