import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Editor from "./Editor";
import { addBlog, editBlog, getBlogDetails, getCategoriesData, removeBlogFiles, uploadBlogFiles } from "../../redux/blogs";
import { Container, Content, FlexboxGrid, Input, Loader } from "rsuite";
import Loading from "../../components/Loading/loading";
import { Breadcrumb, Panel, Stack, Form, TagInput, InlineEdit, RadioGroup, Radio, SelectPicker, Button, Progress, Divider, IconButton, Uploader, Message, toaster, Schema } from 'rsuite';
const { StringType, BooleanType } = Schema.Types;

const Field = React.forwardRef((props, ref) => {
  const { name, message, label, accepter, error, ...rest } = props;
  return (
    <Form.Group controlId={`${name}-10`} ref={ref} className={error ? 'has-error' : ''}>
      <Form.ControlLabel>{label} </Form.ControlLabel>
      <Form.Control name={name} accepter={accepter} errorMessage={error} {...rest} />
      <Form.HelpText>{message}</Form.HelpText>
    </Form.Group>
  );
});
const isURL = (value) => {
  const urlRegex = /^(http|https):\/\/[^ "]+\.(jpeg|jpg|gif|png|bmp|svg)(\?.*)?$/i;

  return urlRegex.test(value);
};

const categoryOption = [
  "Fashion",
  "Technology",
  "Food",
  "Politics",
  "Sports",
  "Business",
];

export const AddBlog = () => {
  const loading = useSelector((state) => state.blogs?.loading);
  const user = useSelector((state) => state.auth?.user);
  const [content, setContent] = useState('')
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const redirect = useSelector(state => state.redirect.redirectTo);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const formRef = React.useRef();
  const [formError, setFormError] = React.useState({});
  const [formValue, setFormValue] = React.useState({});
  const model = Schema.Model({
    title: StringType().isRequired('This field is required.'),
    imageUrl: StringType().addRule((value) => isURL(value), 'Please enter a valid URL').isRequired('This field is required.'),
    category: StringType().isRequired('This field is required.'),
    trending: BooleanType().isRequired('This filed is required.'),

  });
  const categories = useSelector((state) => state.blogs.categories);
  const getCategoryDataLoading = useSelector((state) => state.blogs.getCategoryDataLoading);

  useEffect(() => {
    dispatch(getCategoriesData())
}, [ ])
  useEffect(() => {
    if (redirect) {
      navigate(redirect?.location, { state: redirect?.state })
      setContent('');

    }
  }, [redirect])

  const handleSubmit = (e) => {
    if (!formRef.current.check()) {
      toaster.push(<Message showIcon header='warning' type="error">Error</Message>, { placement: 'bottomEnd' });
      return;
    }
     if (content.length < 30) {
      toaster.push(<Message showIcon header='warning' type="error">Please write some content before posting a blog.</Message>, { placement: 'bottomEnd' });
      return;
    }
    if (formValue?.tags.length < 3) {
      toaster.push(<Message showIcon header='warning' type="error">Please write some Tags before posting a blog.</Message>, { placement: 'bottomEnd' });
      return;
    }
    dispatch(addBlog(formValue));
    // toaster.push(<Message showIcon header= 'success' type="success">Success</Message>, {placement: 'bottomEnd'});
  }
  const handleContent = (e) => {
    setContent(e)
    setFormValue({ ...formValue, content: e })
  }

  const blogFileUrl = useSelector((state) => state.blogs.imageUrl);

  const fileUploadProgress = useSelector((state) => state.blogs.progress);
  const status = fileUploadProgress === 100 ? 'success' : null;
  const color = fileUploadProgress === 100 ? '#52c41a' : '#3385ff';
  const [disabled, setDisabled] = useState(false);
  const [fileList, setFileList] = React.useState([]);
  const uploader = React.useRef();
  const [fileInfo, setFileInfo] = React.useState();
  const [fileUploaded, setFileUploaded] = useState(false);

  useEffect(() => {
    setProgress(fileUploadProgress);
  }, [fileUploadProgress])
  function previewFile(file, callback) {
    const reader = new FileReader();
    reader.onloadend = () => {
      callback(reader.result);
    };
    reader.readAsDataURL(file);
  }
  const handleImageUpload = () => {
    setUploading(true);
    const file = fileList[0];
    previewFile(file.blobFile, value => {
      setFileInfo(value);
    })
    dispatch(uploadBlogFiles(file.blobFile))
  }
  const handleFileRemove = (file) => {
    setFileInfo();
    setFileList([]);
    setProgress(0);
    setDisabled(false);
    setFormValue({ ...formValue, imageUrl: '' })
    dispatch({ type: 'BLOGS_FILE_UPLOAD_PROGRESS', payload: 0 });
    dispatch({ type: 'HANDLE_BLOGS_FILE_REMOVE' });
    if (fileUploaded) {
      dispatch(removeBlogFiles(file));
    }
  }
  const handleClear = () => {
    setFileInfo();
    setFileList([]);
    setProgress(0);
    setDisabled(false);
    setFormValue({ ...formValue, imageUrl: '' })
    dispatch({ type: 'BLOGS_FILE_UPLOAD_PROGRESS', payload: 0 })
    dispatch({ type: 'HANDLE_BLOGS_FILE_REMOVE' });

  }
  useEffect(() => {
    if (isURL(blogFileUrl)) {
      setDisabled(true);
      setFileUploaded(true)
      setFormValue({ ...formValue, imageUrl: blogFileUrl });
      setUploading(false)
    }
  }, [blogFileUrl])
  return (
    <>
      {
        loading ? <Loading /> :
          


                  <Form fluid
                    ref={formRef}
                    onChange={setFormValue}
                    onCheck={setFormError}
                    formValue={formValue}
                    model={model}>
                    <Stack alignItems="center" justifyContent="flex-start" wrap spacing={20}>
                      <Stack.Item grow={7}>
                        <Field name="title" label="Blog Title:" accepter={Input} error={formError.title} />
                      </Stack.Item>
                      <Stack.Item grow={3}>
                        <Field
                          name="trending"
                          label="Trending blog?"
                          accepter={RadioGroup}
                          error={formError.trending}
                          inline
                        >
                          <Radio value={true}>Yes</Radio>
                          <Radio value={false}>No</Radio>
                        </Field>
                      </Stack.Item>
                    </Stack>
                    <Stack alignItems="center" justifyContent="flex-start" wrap spacing={20} >
                      <Stack.Item grow={1}>
                        {
                            getCategoryDataLoading ? <Loader/> : 
                        
                        <Form.Group >
                          <Form.ControlLabel>Blog category:</Form.ControlLabel>
                          <Field name="category"
                            block
                            accepter={SelectPicker}
                            data={categories}
                            placeholder="Please select category" />

                        </Form.Group>
                        }
                      </Stack.Item>
                      <Stack.Item grow={1}>
                        <Form.Group>
                          <Form.ControlLabel>Tags for this Blog:</Form.ControlLabel>
                          <InlineEdit
                            placeholder="Click to add Tags ..."
                            defaultValue={[]}
                            block
                          >
                            <TagInput
                              block
                              onClean={() => {
                                setFormValue({ ...formValue, tags: [] });
                              }}
                              name='tags'
                              trigger={['Enter', 'Space', 'Comma']}
                              placeholder="Blog tags"
                              style={{ width: 300 }}
                              menuStyle={{ width: 300 }}
                              onCreate={(value, item) => {
                                setFormValue({ ...formValue, tags: value });
                              }}
                              value={formValue.tags}
                              onChange={(tags) => setFormValue({ ...formValue, tags })}
                              onTagRemove={(value, event) => {
                                const updatedTags = formValue.tags.filter(tag => tag !== value);
                                setFormValue({ ...formValue, tags: updatedTags });
                              }}
                            />
                          </InlineEdit>
                        </Form.Group>

                      </Stack.Item>
                    </Stack>
                    <Stack alignItems="center" justifyContent="flex-start" wrap spacing={20} style={{ marginTop: "20px" }}>
                      <Stack.Item >
                        <Form.Group>
                          <Form.ControlLabel>Blog content:</Form.ControlLabel>

                          <Editor
                            setData={handleContent}
                            readonly={false}
                            className="form-control"
                            placeholder="Write Blog content here ..."
                            data={content}
                            name='content'

                          />
                          <Form.HelpText>{formError.content}</Form.HelpText>
                        </Form.Group>
                      </Stack.Item>
                    </Stack>
                    <Stack alignItems="center" justifyContent="flex-start" wrap spacing={20} style={{ marginTop: "20px" }}>

                      <Stack.Item grow={1}>
                        <Field disabled={disabled} value={formValue.imageUrl} name="imageUrl" checkAsync type="text" label="Thumbnail Image URL" />
                      </Stack.Item>
                    </Stack>
                    <Stack alignItems="center" justifyContent="flex-start" wrap spacing={20}>
                      <Stack.Item grow={1}>
                        <Divider>Or</Divider>
                      </Stack.Item>
                    </Stack>
                    <Stack alignItems="center" justifyContent="flex-start" wrap spacing={20}>

                      <Stack.Item grow={1}>
                        <Uploader
                          disabled={progress == 100}
                          multiple={false}
                          listType="picture-text"
                          onChange={setFileList}
                          fileList={fileList}
                          onRemove={(file) => handleFileRemove(file)}
                          autoUpload={false}
                          accept=".jpg, .jpeg, .png"
                          renderFileInfo={(file, fileElement) => {
                            return (
                              <>
                                <span>File Name: {file.name}</span>

                              </>
                            );
                          }}
                          ref={uploader}
                          draggable>
                          <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span>Click or Drag files to this area to upload</span>
                          </div>
                        </Uploader>
                        {
                          progress > 1 ? <>
                            <Progress.Line percent={progress} strokeColor={color} status={status} />
                          </> : ''
                        }
                      </Stack.Item>
                    </Stack>
                    <Stack style={{ margin: "15px 0" }} justifyContent='center' spacing={20}>
                      <Button disabled={!fileList.length}
                        onClick={
                          handleImageUpload
                        }
                        loading={uploading}
                      >Upload</Button>
                      <Button onClick={handleClear}>Clear</Button>
                    </Stack>
                    <Stack alignItems="center" justifyContent='center' spacing={20}>
                      <Stack.Item>


                        <Button
                          type="submit"
                          appearance="primary"
                          disabled={loading}
                          onClick={handleSubmit}
                        >
                          {(user.roles.includes('ADMIN') ? "Post it" : "Sent it to Review")}
                        </Button>
                      </Stack.Item>
                    </Stack>

                  </Form>
                
      }</>
  );
};

export const EditBlog = ({id}) => {
  const loading = useSelector((state) => state.blogs?.loading);
  const blogDetails = useSelector((state) => state.blogs?.blogDetails);
  const user = useSelector((state) => state.auth?.user);
  const [content, setContent] = useState('')
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const redirect = useSelector(state => state.redirect.redirectTo);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const formRef = React.useRef();
  const [formError, setFormError] = React.useState({});
  const [formValue, setFormValue] = React.useState({});
  const model = Schema.Model({
    title: StringType().isRequired('This field is required.'),
    imageUrl: StringType().addRule((value) => isURL(value), 'Please enter a valid URL').isRequired('This field is required.'),
    category: StringType().isRequired('This field is required.'),
    trending: BooleanType().isRequired('This filed is required.'),

  });
  const categories = useSelector((state) => state.blogs.categories);
  const getCategoryDataLoading = useSelector((state) => state.blogs.getCategoryDataLoading);

  useEffect(() => {
    dispatch(getCategoriesData())
    if(id){
      dispatch(getBlogDetails(id))
    }
}, [ ]);
useEffect(() => {
  if(blogDetails){
      setFormValue({...blogDetails})  
      setContent(blogDetails?.content)
      }
}, [ blogDetails]);
  useEffect(() => {
    if (redirect) {
      navigate(redirect?.location, { state: redirect?.state })
      setContent('');

    }
  }, [redirect])

  const handleSubmit = (e) => {
    if (!formRef.current.check()) {
      toaster.push(<Message showIcon header='warning' type="error">Error</Message>, { placement: 'bottomEnd' });
      return;
    }
     if (content.length < 30) {
      toaster.push(<Message showIcon header='warning' type="error">Please write some content before posting a blog.</Message>, { placement: 'bottomEnd' });
      return;
    }
    if (formValue?.tags.length < 3) {
      toaster.push(<Message showIcon header='warning' type="error">Please write some Tags before posting a blog.</Message>, { placement: 'bottomEnd' });
      return;
    }
    dispatch(editBlog(id, formValue));
    // toaster.push(<Message showIcon header= 'success' type="success">Success</Message>, {placement: 'bottomEnd'});
  }
  const handleContent = (e) => {
    setContent(e)
    setFormValue({ ...formValue, content: e })
  }

  const blogFileUrl = useSelector((state) => state.blogs.imageUrl);

  const fileUploadProgress = useSelector((state) => state.blogs.progress);
  const status = fileUploadProgress === 100 ? 'success' : null;
  const color = fileUploadProgress === 100 ? '#52c41a' : '#3385ff';
  const [disabled, setDisabled] = useState(false);
  const [fileList, setFileList] = React.useState([]);
  const uploader = React.useRef();
  const [fileInfo, setFileInfo] = React.useState();
  const [fileUploaded, setFileUploaded] = useState(false);

  useEffect(() => {
    setProgress(fileUploadProgress);
  }, [fileUploadProgress])
  function previewFile(file, callback) {
    const reader = new FileReader();
    reader.onloadend = () => {
      callback(reader.result);
    };
    reader.readAsDataURL(file);
  }
  const handleImageUpload = () => {
    setUploading(true);
    const file = fileList[0];
    previewFile(file.blobFile, value => {
      setFileInfo(value);
    })
    dispatch(uploadBlogFiles(file.blobFile))
  }
  const handleFileRemove = (file) => {
    setFileInfo();
    setFileList([]);
    setProgress(0);
    setDisabled(false);
    setFormValue({ ...formValue, imageUrl: '' })
    dispatch({ type: 'BLOGS_FILE_UPLOAD_PROGRESS', payload: 0 });
    dispatch({ type: 'HANDLE_BLOGS_FILE_REMOVE' });
    if (fileUploaded) {
      dispatch(removeBlogFiles(file));
    }
  }
  const handleClear = () => {
    setFileInfo();
    setFileList([]);
    setProgress(0);
    setDisabled(false);
    setFormValue({ ...formValue, imageUrl: '' })
    dispatch({ type: 'BLOGS_FILE_UPLOAD_PROGRESS', payload: 0 })
    dispatch({ type: 'HANDLE_BLOGS_FILE_REMOVE' });

  }
  useEffect(() => {
    if (isURL(blogFileUrl)) {
      setDisabled(true);
      setFileUploaded(true)
      setFormValue({ ...formValue, imageUrl: blogFileUrl });
      setUploading(false)
    }
  }, [blogFileUrl])
  return (
    <>
      {
        loading ? <Loading />:
           
                  <Form fluid
                    ref={formRef}
                    onChange={setFormValue}
                    onCheck={setFormError}
                    formValue={formValue}
                    model={model}>
                    <Stack alignItems="center" justifyContent="flex-start" wrap spacing={20}>
                      <Stack.Item grow={7}>
                        <Field name="title" label="Blog Title:" accepter={Input} error={formError.title} />
                      </Stack.Item>
                      <Stack.Item grow={3}>
                        <Field
                          name="trending"
                          label="Trending blog?"
                          accepter={RadioGroup}
                          error={formError.trending}
                          inline
                        >
                          <Radio value={true}>Yes</Radio>
                          <Radio value={false}>No</Radio>
                        </Field>
                      </Stack.Item>
                    </Stack>
                    <Stack alignItems="center" justifyContent="flex-start" wrap spacing={20} >
                      <Stack.Item grow={1}>
                        {
                            getCategoryDataLoading ? <Loader/> : 
                        
                        <Form.Group >
                          <Form.ControlLabel>Blog category:</Form.ControlLabel>
                          <Field name="category"
                            block
                            accepter={SelectPicker}
                            data={categories}
                            placeholder="Please select category" />

                        </Form.Group>
                        }
                      </Stack.Item>
                      <Stack.Item grow={1}>
                        <Form.Group>
                          <Form.ControlLabel>Tags for this Blog:</Form.ControlLabel>
                          <InlineEdit
                            placeholder="Click to add Tags ..."
                            defaultValue={[]}
                            block
                          >
                            <TagInput
                              block
                              onClean={() => {
                                setFormValue({ ...formValue, tags: [] });
                              }}
                              name='tags'
                              trigger={['Enter', 'Space', 'Comma']}
                              placeholder="Blog tags"
                              style={{ width: 300 }}
                              menuStyle={{ width: 300 }}
                              onCreate={(value, item) => {
                                setFormValue({ ...formValue, tags: value });
                              }}
                              value={formValue.tags}
                              onChange={(tags) => setFormValue({ ...formValue, tags })}
                              onTagRemove={(value, event) => {
                                const updatedTags = formValue.tags.filter(tag => tag !== value);
                                setFormValue({ ...formValue, tags: updatedTags });
                              }}
                            />
                          </InlineEdit>
                        </Form.Group>

                      </Stack.Item>
                    </Stack>
                    <Stack alignItems="center" justifyContent="flex-start" wrap spacing={20} style={{ marginTop: "20px" }}>
                      <Stack.Item >
                        <Form.Group>
                          <Form.ControlLabel>Blog content:</Form.ControlLabel>

                          <Editor
                            setData={handleContent}
                            readonly={false}
                            className="form-control"
                            placeholder="Write Blog content here ..."
                            data={content}
                            name='content'

                          />
                          <Form.HelpText>{formError.content}</Form.HelpText>
                        </Form.Group>
                      </Stack.Item>
                    </Stack>
                    <Stack alignItems="center" justifyContent="flex-start" wrap spacing={20} style={{ marginTop: "20px" }}>

                      <Stack.Item grow={1}>
                        <Field disabled={disabled} value={formValue.imageUrl} name="imageUrl" checkAsync type="text" label="Thumbnail Image URL" />
                      </Stack.Item>
                    </Stack>
                    <Stack alignItems="center" justifyContent="flex-start" wrap spacing={20}>
                      <Stack.Item grow={1}>
                        <Divider>Or</Divider>
                      </Stack.Item>
                    </Stack>
                    <Stack alignItems="center" justifyContent="flex-start" wrap spacing={20}>

                      <Stack.Item grow={1}>
                        <Uploader
                          disabled={progress == 100}
                          multiple={false}
                          listType="picture-text"
                          onChange={setFileList}
                          fileList={fileList}
                          onRemove={(file) => handleFileRemove(file)}
                          autoUpload={false}
                          accept=".jpg, .jpeg, .png"
                          renderFileInfo={(file, fileElement) => {
                            return (
                              <>
                                <span>File Name: {file.name}</span>

                              </>
                            );
                          }}
                          ref={uploader}
                          draggable>
                          <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span>Click or Drag files to this area to upload</span>
                          </div>
                        </Uploader>
                        {
                          progress > 1 ? <>
                            <Progress.Line percent={progress} strokeColor={color} status={status} />
                          </> : ''
                        }
                      </Stack.Item>
                    </Stack>
                    <Stack style={{ margin: "15px 0" }} justifyContent='center' spacing={20}>
                      <Button disabled={!fileList.length}
                        onClick={
                          handleImageUpload
                        }
                        loading={uploading}
                      >Upload</Button>
                      <Button onClick={handleClear}>Clear</Button>
                    </Stack>
                    <Stack alignItems="center" justifyContent='center' spacing={20}>
                      <Stack.Item>


                        <Button
                          type="submit"
                          appearance="primary"
                          disabled={loading}
                          onClick={handleSubmit}
                        >
                          {(user.roles.includes('ADMIN') ? "Post it" : "Sent it to Review")}
                        </Button>
                      </Stack.Item>
                    </Stack>

                  </Form>
}
    </>

  );
};

const AddBlogPage = () => {
  return (
    <>
    <Panel
      header={
        <>
          <h3 className="title">{"Post a new blog"}</h3>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href='/blogs'>Blogs</Breadcrumb.Item>
            <Breadcrumb.Item active>{"post a new Blog"}</Breadcrumb.Item>
          </Breadcrumb>
        </>
      }
    ><Container>
    <Content>
      <Stack spacing={10} alignItems='center' justifyContent='center'>
        <Stack.Item>


          <FlexboxGrid justify="center">
            <FlexboxGrid.Item colspan={18}>
              <AddBlog />
            </FlexboxGrid.Item>
              </FlexboxGrid>
            </Stack.Item>
          </Stack>
        </Content>
          </Container>
        
    </Panel>
    </>
  )
}
export default AddBlogPage;