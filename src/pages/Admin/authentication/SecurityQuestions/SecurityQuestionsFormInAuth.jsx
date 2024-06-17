import React, { useState , useEffect} from "react";
import EyeIcon from '@rsuite/icons/legacy/Eye';
import EyeSlashIcon from '@rsuite/icons/legacy/EyeSlash';
import { Button, Form, Input, InputGroup,   Placeholder,   Schema, Stack,   } from 'rsuite';
 import { connect, useDispatch } from "react-redux";
import { fetchSecurityQuestions, verifySecurityQuestions } from "../../../../redux/auth";
 
import Loading from "../../../../components/Loading/loading";
  const { StringType } = Schema.Types;

const model = Schema.Model({
     answer1: StringType().minLength(3, 'Security Question Answer 1 should be more than 2 characters.').maxLength(10, 'Security Question  Answer 1 should be less than 10 characters.').isRequired('Security Question 1 Answer is required.'),
     answer2: StringType().minLength(3, 'Security Question Answer 2 should be more than 2 characters.').maxLength(10, 'Security Question Answer 2 should be less than 10 characters.').isRequired('Security Question 2 Answer is required.'),
});


  


const SecurityQuestionsFormInAuth = ({user, loading, questions, getSecurityQuestions, verifySecurityQuestions, securityQuestionsVerificationLoading}) => {
    const formRef = React.useRef();
     const [formError, setFormError] = React.useState({});
    const [formValue, setFormValue] = React.useState({
         answer1: "",
         answer2: "",
    })
    const [question1, setQuestion1] = useState();
    const [question2, setQuestion2] = useState();
    const [answer1Visible, setAnswer1Visible] = useState(false);
    useEffect(()=> {
        if(user){
            getSecurityQuestions();
        }
    }, [user])
      
      
      useEffect(()=> {
        if(Array.isArray(questions)){
           const [q1, q2] = questions;
        setQuestion1(q1)
        setQuestion2(q2) 
        }
        
      }, [questions])
         const handleChangeAnswer1Visible = () => {
            setAnswer1Visible(!answer1Visible)
        }
        const [answer2Visible, setAnswer2Visible] = useState(false);
         const handleChangeAnswer2Visible = () => {
            setAnswer2Visible(!answer2Visible)
        }
         const handleSubmit = () => {
            if (!formRef.current.check()) {
                return;
            }
            else {
          
          verifySecurityQuestions(questions, formValue)
             }
        }
        return(
            <>
             
            
            <Form ref={formRef}
                                        checkTrigger="blur"
                                        onChange={setFormValue}
                                        onCheck={setFormError}
                                        formValue={formValue}
                                        model={model}
                                        fluid>
                                            {
                loading ? <Placeholder rows={1}  active/> : <><Input  label='Email' disabled value={user?.email} />  
                                </>
}
                            
                            <br></br>
                         <Form.Group controlId='answer1'>
                            <Form.ControlLabel>
                                <>  
                                {
                loading ? <Placeholder rows={1}  active/> : <>{question1?.question} 
                                </>
}</>
                            </Form.ControlLabel>

                            <InputGroup inside>
                                <Form.Control name="answer1"   autoComplete="off" type={answer1Visible ? 'text' : 'password'} />
                                <InputGroup.Button onClick={handleChangeAnswer1Visible}>
                                    {answer1Visible ? <EyeIcon /> : <EyeSlashIcon />}
                                </InputGroup.Button>
                            </InputGroup> 
                        </Form.Group>
 
                        <Form.Group controlId='answer2'>
                            <Form.ControlLabel><>  
                            {
                loading ? <Placeholder rows={1}  active/> : <>{question2?.question} 
                                </>
}</>
                            
                            </Form.ControlLabel>

                            <InputGroup inside>
                                <Form.Control name="answer2"   autoComplete="off" type={answer2Visible ? 'text' : 'password'} />
                                <InputGroup.Button onClick={handleChangeAnswer2Visible}>
                                    {answer2Visible ? <EyeIcon /> : <EyeSlashIcon />}
                                </InputGroup.Button>
                            </InputGroup>
                        </Form.Group>
                        <Stack justifyContent="flex-end" spacing={20}>
                            <Button appearance="primary" onClick={handleSubmit} loading={securityQuestionsVerificationLoading}>Continue</Button>
 
                        </Stack>
                    </Form>
                    
            </>
        )
}
const mapDispatchToProps = dispatch => ({
    getSecurityQuestions: () => dispatch(fetchSecurityQuestions()),
    verifySecurityQuestions: (hashedAnswers, userAnswers) => dispatch(verifySecurityQuestions(hashedAnswers, userAnswers))
  });
const mapStateToProps = state => ({
    loading: state.auth?.loadingFetch,
    securityQuestionsVerificationLoading: state.auth?.securityQuestionsVerificationLoading,
    questions: state.auth?.securityQuestions?.randomPairs,
    user: state.auth?.user,

});
export default connect(mapStateToProps, mapDispatchToProps)(SecurityQuestionsFormInAuth);