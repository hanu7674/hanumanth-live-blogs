import React, {  useEffect } from "react";
import animationData from "../../../Assets/Lotties/get-in-touch.json";
import Lottie from "react-lottie";
import "./index.css";
import { MyTextInput, MyTextInputArea } from "../../Forms";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { Button, Spinner } from "react-bootstrap";
import { submitGetInTouchForm } from "../../../redux/ActionCreators";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Loading from "../../../components/Loading/loading";
const ConnectWithMeBlogs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.userState?.loading);
  const redirect = useSelector(state => state.redirect.redirectTo);
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  useEffect(()=>{
    if(redirect){
      navigate(redirect?.location,{state: redirect?.state })
    }    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[redirect]);

  return (
    <>
    <div className="container mt-5"> 
        <h1 className="text-center mb-5 fs-1 "> Get in Touch</h1>
        <div className="row">
          <div className="col-md-4 col-sm-12">
            <div>
              <div data-aos="zoom-in-right">
                <Lottie
                  options={defaultOptions}
                  isClickToPauseDisabled={false}
                  title="connect with lingala hanumantha reddy "
                />
              </div>
            </div>
          </div>
          <div className="col-md-8 col-sm-12">
            <div className="" data-aos="zoom-in-left">
              <div className="row gap-5">
                <Formik
                  initialValues={{
                    firstName: "",
                    lastName: '',
                    email:'',
                    phone:'',
                    message: '',

                  }}
                  validateOnChange={true}
                  validationSchema={Yup.object({
                    firstName: Yup.string()
                      .max(15, "Must be 15 characters or less")
                      .min(3, "Must be 3 characters or more")
                      .required("First Name is Required"),
                    lastName: Yup.string()
                      .max(20, "Must be 20 characters or less")
                      .min(3, "Must be 3 characters or more")
                      .required("Last Name is Required"),
                    email: Yup.string()
                      .transform((value, originalValue) =>
                        originalValue.toLowerCase()
                      )
                      .matches(/(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/, "Invalid email address")
                      .required("Email is Required"),

                    phone: Yup.string()
                      .matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, "Phone number is not valid")
                      .required("Phone number is required"),
                    message: Yup.string()
                        .required("Message is Required"),
                  })}
                  onSubmit={(values, { setSubmitting }) => {

                    setTimeout(() => {
                        dispatch(submitGetInTouchForm(values))
                      setSubmitting(false);
                    }, 1000);
                  }}
                  validateOnMount={true}
                >
                  {({
                    values,
                    isSubmitting,
                    isValid
                  }) => (
                    <Form>
                      <div className="col">
                        <div className="row">
                          <div className="col-md-6 col-sm-12">
                            <MyTextInput
                              label="First Name"
                              name="firstName"
                              type="text"
                              placeholder="Jane"
                              value={values?.firstName}
                            />
                          </div>
                          <div className="col-md-6 col-sm-12">
                            <MyTextInput
                              label="Last Name"
                              name="lastName"
                              type="text"
                              placeholder="Doe"
                              value={values?.lastName}

                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6 col-sm-12">
                            <MyTextInput
                              label="Email"
                              name="email"
                              type="text"
                              placeholder="example@gmail.com"
                              value={values?.email}

                            />
                          </div>
                          <div className="col-md-6 col-sm-12">
                            <MyTextInput
                              label="Phone"
                              name="phone"
                              type="text"
                              placeholder="+91 1234567890"
                              value={values?.phone}

                            />
                          </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12 col-sm-12">
                                <MyTextInputArea 
                                label="Message"
                                name="message"
                                type="text"
                                rows={5}
                                placeholder="Your message"
                              value={values?.message}

                                />
                            </div>
                        </div>
                        <div className="row">
                        <div className="col-md-12 text-center">
                        {
                                    loading ? <>
                                    <Button type="submit" variant="outline-dark" disabled={isSubmitting || !loading}>
                                
                                    <Loading/>
                                </Button>
                                   </> : <> <Button type="submit"  variant="outline-dark"  disabled={isSubmitting || !isValid}>
                                
                                Connect with Me
                                </Button></>
                                }
                            
                        </div>
                      </div>
                      </div>{" "}
                      
                    </Form>
                  )}
                </Formik>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConnectWithMeBlogs;
