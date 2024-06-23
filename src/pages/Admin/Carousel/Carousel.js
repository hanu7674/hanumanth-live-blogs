import { Carousel, RadioGroup, Radio, Divider, Container, Content, Footer, Panel, Stack, SelectPicker, FlexboxGrid, Col, Grid, Row, Button, Checkbox, Slider, Uploader, Avatar, Progress, IconButton } from 'rsuite';
import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/dist/styles.css';
import React, { useEffect, useState } from 'react';
import './index.css'
import { RxTransparencyGrid } from "react-icons/rx";
import { Drawer, Form, Input, Schema } from 'rsuite';
import HomePageCarousal from '../../HompageCarousel';
import { TextField } from '../../Auth/FormFields';
import { useDispatch, useSelector } from 'react-redux';
import { addCarouselItem, removeCarouselFiles, saveCarouselSettings, uploadCarouselFiles } from '../../../redux/carousel';
import { MdAddCircle } from 'react-icons/md';
import { fetchCarouselItems, fetchCarouselSettings } from "../../../redux/carousel";
import 'react-awesome-slider/dist/custom-animations/cube-animation.css';
import 'react-awesome-slider/dist/custom-animations/fall-animation.css';
import 'react-awesome-slider/dist/custom-animations/fold-out-animation.css';
import 'react-awesome-slider/dist/custom-animations/open-animation.css';
import 'react-awesome-slider/dist/custom-animations/scale-out-animation.css';
import 'react-awesome-slider/dist/captioned.css';
import 'react-awesome-slider/dist/lettering.css';
import Loading from '../../../components/Loading/loading';
import { isURL } from '../../../assets/constants';
 
 
// const Lettered = LetteringHoc(AwesomeSlider);

const { StringType } = Schema.Types;
export const AddCarouselItemForm = ({ onClose }) => {
  const [formValue, setFormValue] = useState({});
  const [formError, setFormError] = React.useState({});
  const [uploading, setUploading] = React.useState(false);
  const [fileInfo, setFileInfo] = React.useState();
  const [fileList, setFileList] = React.useState([]);
  const uploader = React.useRef();

  const fileUploadProgress = useSelector((state) => state.carousel.progress);
  const addItemStatus = useSelector((state) => state.carousel.addItemStatus);
  const loading = useSelector((state) => state.carousel.loading);
  const carouselFileUrl = useSelector((state) => state.carousel.caroucselUrl);
  const status = fileUploadProgress === 100 ? 'success' : null;
  const color = fileUploadProgress === 100 ? '#52c41a' : '#3385ff';
  const [progress, setProgress] = useState(0);
  const [disabled, setDisabled] = useState(false)
  const formRef = React.useRef();
  const [fileUploaded, setFileUploaded] = useState(false);
  const defaultFormValues = {
    title: '',
    description: '',
    imageUrl: '',
    caption: ''
  }
  const formModel = Schema.Model({
    title: StringType().isRequired('This field is required.'),
    description: StringType().isRequired('This field is required.'),
    imageUrl: StringType().addRule((value) => isURL(value), 'Please enter a valid URL').isRequired('This field is required.'),
  })
  useEffect(() => {
    setProgress(fileUploadProgress);
  }, [fileUploadProgress])
  const dispatch = useDispatch()
  function previewFile(file, callback) {
    const reader = new FileReader();
    reader.onloadend = () => {
      callback(reader.result);
    };
    reader.readAsDataURL(file);
  }
  const handleCarouselImageUpload = () => {
    setUploading(true);
    const file = fileList[0];
    previewFile(file.blobFile, value => {
      setFileInfo(value);
    })
    dispatch(uploadCarouselFiles(file.blobFile))
  }
  const handleFileRemove = (file) => {
    setFileInfo();
    setFileList([]);
    setProgress(0);
    setDisabled(false);
    setFormValue({ ...formValue, imageUrl: '' })
    dispatch({ type: 'CAROUSEL_FILE_UPLOAD_PROGRESS', payload: 0 });
    if (fileUploaded) {
      dispatch(removeCarouselFiles(file));
    }
  }
  const handleSubmit = () => {
    if (!formRef.current.check()) {
      console.error('Form Error');
      return;
    }
    else {
      dispatch(addCarouselItem(formValue))
    }
  };
  useEffect(() => {
    if (addItemStatus) {
      handleClose()
    }
  }, [addItemStatus])
  const handleClose = () => {
    setFileInfo();
    setFileList([]);
    setProgress(0);
    setDisabled(false);
    setFormValue({ ...formValue, imageUrl: '' })
    dispatch({ type: 'CAROUSEL_FILE_UPLOAD_PROGRESS', payload: 0 })
    onClose();
  }
  const handleClear = () => {
    setFileInfo();
    setFileList([]);
    setProgress(0);
    setDisabled(false);
    setFormValue({ ...formValue, imageUrl: '' })
    dispatch({ type: 'CAROUSEL_FILE_UPLOAD_PROGRESS', payload: 0 })

  }
  useEffect(() => {
    if (isURL(carouselFileUrl)) {
      setDisabled(true);
      setFileUploaded(true)
      setFormValue({ ...formValue, imageUrl: carouselFileUrl });
      setUploading(false)
    }
  }, [carouselFileUrl])
  return (
    <div>
      <Form
        fluid
        ref={formRef}
        formDefaultValue={defaultFormValues}
        onChange={(value) => setFormValue(value)}
        formValue={formValue}
        model={formModel}
        formError={formError}
        checkTrigger='blur'
        onCheck={setFormError}
      >
        <TextField name="title" checkAsync type="text" label="Title" />
        <TextField name="description" checkAsync type="text" label="Description" />
        <TextField name="caption" checkAsync type="text" label="Caption" />
        <TextField disabled={disabled} value={formValue.imageUrl} name="imageUrl" checkAsync type="text" label="Image URL" />
        <Divider>Or</Divider>
        <Uploader
          disabled={progress == 100}
          multiple={false}
          listType="picture-text"
          onChange={setFileList}
          fileList={fileList}
          onRemove={(file) => handleFileRemove(file)}
          autoUpload={false}
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
        <Stack style={{ margin: "15px 0" }} justifyContent='center' spacing={20}>
          <Button disabled={!fileList.length}
            onClick={
              handleCarouselImageUpload
            }
            loading={uploading}
          >Upload</Button>
          <Button onClick={handleClear}>Clear</Button>
        </Stack>
      </Form>
      <Stack justifyContent='flex-end' spacing={15}>
        <Button onClick={onClose} appearance="subtle">
          Cancel
        </Button>
        <Button disabled={loading} loading={loading} onClick={handleSubmit} appearance="primary">
          Add Carousel Item
        </Button>
      </Stack>
    </div>
  );
};
const carouselAnimationTypes = [
  { label: 'Basic Usage', value: 'Basic Usage' },
  { label: 'Scale-out animation', value: 'scaleOutAnimation' },
  { label: 'Fold-out animation', value: 'foldOutAnimation' },
  { label: 'Cube animation', value: 'cubeAnimation' },
  { label: 'Open animation', value: 'openAnimation' },
  { label: 'Fall animation', value: 'fallAnimation' },

];
const carouselTypes = [
  { label: 'Captioned images HOC', value: 'Captioned images HOC' },
  { label: 'Smooth lettering HOC', value: 'Smooth lettering HOC' },
  { label: 'Autoplay HOC', value: 'Autoplay HOC' },
]
const CarouselComponent = () => {

  const [isFormOpen, setFormOpen] = useState(false);
  const defaultCarouselSettings = useSelector((state) => state?.carousel?.carouselSettings) || {
    '--slider-height-percentage': '50%',
    '--slider-transition-duration': '500ms',
    '--organic-arrow-thickness': '5px',
    '--organic-arrow-border-radius': '5px',
    '--organic-arrow-height': '30px',
    '--organic-arrow-color': '#ffffff',
    '--control-button-width': '10%',
    '--control-button-height': '50%',
    '--control-button-background': '#ffffff',
    '--control-bullet-color': '#ffffff',
    '--control-bullet-active-color': '#3385ff',
    '--control-bullet-hover-color': '#ffffff',
    '--control-button-color': '#ffffff',
    '--loader-bar-color': '#3385ff',
    '--loader-bar-height': '2px',
    'animation': 'fallAnimation',
    '--control-arrow-color': '#ffffff',
    bullets: true,
    organicArrows: true,
    fillParent: false,
  };
  const [carouselSettings, setCarouselSettings] = useState([
    
  ]);
  const [settings, setSettings] = useState();
  const [isSettingsChanged, setIsSettingsChanged] = useState(false)
  const handleSettingChange = (name, value) => {
    setSettings({ ...settings, [name]: value });
    setIsSettingsChanged(true);
  };
  const loading = useSelector((state) => state.carousel.loading);
  const carouselItems = useSelector((state) => state.carousel.carouselItems);
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch carousel items when the component mounts
    dispatch(fetchCarouselItems());
    dispatch(fetchCarouselSettings())
  }, []);
  const customStyles = {
    '--slider-height-percentage': settings?.sliderHeightPercentage
      ? `${settings?.sliderHeightPercentage}%`
      : defaultCarouselSettings["--slider-height-percentage"],
    '--slider-transition-duration': settings?.sliderTransitionDuration
      ? `${settings?.sliderTransitionDuration}ms`
      : defaultCarouselSettings["--slider-transition-duration"],
    '--organic-arrow-thickness': settings?.organicArrowThickness
      ? `${settings?.organicArrowThickness}px` 
      : defaultCarouselSettings["--organic-arrow-thickness"],
    '--organic-arrow-border-radius': settings?.organicArrowBorderRadius
      ? `${settings?.organicArrowBorderRadius}px`
      : defaultCarouselSettings["--organic-arrow-border-radius"],
    '--organic-arrow-height': settings?.organicArrowHeight
      ? `${settings?.organicArrowHeight}px`
      : defaultCarouselSettings["--organic-arrow-height"],
    '--organic-arrow-color': settings?.organicArrowColor || defaultCarouselSettings["--organic-arrow-color"],
    '--control-button-width': settings?.controlButtonWidth
      ? `${settings?.controlButtonWidth}%`
      : defaultCarouselSettings["--control-button-width"],
    '--control-button-height': settings?.controlButtonHeight
      ? `${settings?.controlButtonHeight}%`
      : defaultCarouselSettings["--control-button-height"],
    '--control-button-background': settings?.controlButtonBackground || defaultCarouselSettings["--control-button-background"],
    '--control-bullet-color': settings?.controlBulletColor || defaultCarouselSettings["--control-bullet-color"],
    '--control-bullet-active-color': settings?.controlBulletActiveColor
      ? settings?.controlBulletActiveColor
      : defaultCarouselSettings["--control-bullet-active-color"],
    '--loader-bar-color': settings?.loaderBarColor || defaultCarouselSettings["--loader-bar-color"],
    '--loader-bar-height': settings?.loaderBarHeight
      ? `${settings?.loaderBarHeight}px`
      : defaultCarouselSettings["--loader-bar-height"],
    'animation': settings?.animation ? settings?.animation : defaultCarouselSettings["animation"],
    bullets: settings?.bullets !== undefined ? settings?.bullets :  defaultCarouselSettings?.bullets,
    organicArrows: settings?.organicArrows !== undefined ? settings?.organicArrows : defaultCarouselSettings?.organicArrows,
    fillParent: settings?.fillParent !== undefined ? settings?.fillParent : defaultCarouselSettings?.fillParent,
    // Color properties
    '--organic-arrow-color': settings?.organicArrowColor || defaultCarouselSettings["--organic-arrow-color"],
    '--control-button-background': settings?.controlButtonBackground || defaultCarouselSettings["--control-button-background"],
    '--control-bullet-color': settings?.controlBulletColor || defaultCarouselSettings["--control-bullet-color"],
    '--control-bullet-active-color': settings?.controlBulletActiveColor
      || defaultCarouselSettings["--control-bullet-active-color"],
    '--loader-bar-color': settings?.loaderBarColor || defaultCarouselSettings["--loader-bar-color"],

    // Add more color properties as needed
    '--control-button-color': settings?.controlButtonColor || defaultCarouselSettings["--control-button-color"],
    '--control-bullet-hover-color': settings?.controlBulletHoverColor
      || defaultCarouselSettings["--control-bullet-hover-color"],
    '--control-arrow-color': settings?.controlArrowColor || defaultCarouselSettings["--control-arrow-color"],
    // Add more color properties as needed
  }
  useEffect(() =>{
    setSettings({...customStyles})
  },[])
  useEffect(() => {
    if(isSettingsChanged){
      setCarouselSettings(customStyles)
      setIsSettingsChanged(false);
    }
  }, [isSettingsChanged]);
  useEffect(() => {
    if(defaultCarouselSettings){
    setSettings(defaultCarouselSettings)
       
      setCarouselSettings(defaultCarouselSettings);
    }
  }, [defaultCarouselSettings])
  const handleSaveCarouselSettings = () => {
    const settings = {
      ...customStyles,
    }
    dispatch(saveCarouselSettings(settings))
  }
  const handleResetCarouselSettings = () => {
    setCarouselSettings(defaultCarouselSettings);
    setSettings([])
    setIsSettingsChanged(false);
  }
  return (
    <>
      {/* <h1 style={{textAlign: 'center', color: 'red'}}>Still Under development</h1> */}
      <Drawer open={isFormOpen} onClose={() => setFormOpen(false)}>
        <Drawer.Header>
          <Drawer.Title>Add Carousel Item</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <AddCarouselItemForm onClose={() => setFormOpen(false)}
          />
        </Drawer.Body>
      </Drawer>
      <Stack justifyContent='flex-end' spacing={20}>
        <div>
          <IconButton onClick={() => setFormOpen(true)} placement='right' icon={<MdAddCircle className='rs-icon' />}> Add Carousel Item</IconButton>

        </div>
      </Stack>
{
  loading ? <Loading/> :

      <Grid fluid  style={{marginTop: '15px'}}>

        <Row>
          {
            JSON.stringify(settings, null ,4)
          }
          <Col md={12} sm={24} xs={24} lg={15} xl={15}>
            <div className="aws-frm__title-bar--1gf9">
              <div className="aws-frm__title-bar__controls--2G7d">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <p>Animation : {settings?.animation}</p>
            </div>
            <AwesomeSlider

              style={ carouselSettings}
              {...carouselSettings}
            > 
                       <img loading="lazy"  src="https://via.placeholder.com/600.png"  />
    <img loading="lazy"  src="https://via.placeholder.com/600.png"   />
    <img loading="lazy"  src="https://via.placeholder.com/600.png"   />
    <img loading="lazy"  src="https://via.placeholder.com/600.png"  />
    <img loading="lazy"  src="https://via.placeholder.com/600.png"  /> 
            </AwesomeSlider>
          </Col>
          <Col md={12} sm={24} xs={24} lg={9} xl={9} >
          <div className="aws-frm__title-bar--1gf9">
              <div className="aws-frm__title-bar__controls--2G7d">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <p> Customisation </p>
            </div>
            {
              loading ? <Loading/> : 
            
            <div style={{border: '1px solid white', padding:'5px'}}>

            
            <h3 >
             </h3>
            <p style={{ margin: '10px' }}>
              Basic customization through the component's props and CSS custom-properties.
            </p>
            <div style={{ maxHeight: '70vh', overflow: 'scroll' }}>

              {/* <h4>
                Carousel Types

              </h4>
              <SelectPicker
  data={carouselTypes}
  searchable={false}
  block
  onChange={(value) => handleSettingChange('carouselType', value)}
  placeholder="Select Carousel Type"
  value={carouselSettings.carouselType}
/> */}

              <h4>
                Carousel Animation

              </h4>
              <SelectPicker
  data={carouselAnimationTypes}
  searchable={false}
  block
  onChange={(value) => handleSettingChange('animation', value)}
  placeholder="Select Carousel Animation Type"
  value={settings?.animation}
/>
              <h4>
                Component's global props

              </h4>
              <hr />
              <FlexboxGrid justify='space-between'>
                <FlexboxGrid.Item>
                  organicArrows
                </FlexboxGrid.Item>
                <FlexboxGrid.Item>

                  <Checkbox 
                  onChange={(value, check) => handleSettingChange('organicArrows', check)}
                  checked={settings?.organicArrows}
                  
                  ></Checkbox>{JSON.stringify(settings?.organicArrows)}
                </FlexboxGrid.Item>
              </FlexboxGrid>
              <FlexboxGrid justify='space-between'>
                <FlexboxGrid.Item>
                  bullets
                </FlexboxGrid.Item>
                <FlexboxGrid.Item>

                  <Checkbox 
                  onChange={(value, check) => handleSettingChange('bullets', check)}
                  checked={settings?.bullets}
                  // onChange={(value, check) => handleBullets(check)} value={bullets}
                  ></Checkbox>{JSON.stringify(settings?.bullets)}
                </FlexboxGrid.Item>
              </FlexboxGrid>
              <FlexboxGrid justify='space-between'>
                <FlexboxGrid.Item>
                  fillParent
                </FlexboxGrid.Item>
                <FlexboxGrid.Item>

                  <Checkbox 
                  onChange={(value, check) => handleSettingChange('fillParent',check)} 
                  checked={settings?.fillParent}
                  ></Checkbox>{JSON.stringify(settings?.fillParent)}
                </FlexboxGrid.Item>
              </FlexboxGrid>
              <h4>
                CSS Custom Properties

              </h4>
              <hr />
              <h5>General</h5>
              <Stack style={{ marginTop: '10px' }} horizontal tokens={{ childrenGap: 15 }}>
                <Stack.Item align="stretch">
                  <span>slider-height-percentage</span>
                </Stack.Item>
                <Stack.Item align="center" grow={2}>
                  <Slider
                    min={10}
                    style={{ width: '10vw' }}
                    onChange={(value) => handleSettingChange('sliderHeightPercentage', value)}
                    value={settings?.sliderHeightPercentage}
                  />
                </Stack.Item>
                <Stack.Item align="flex-end">
                  <span>{JSON.stringify(settings?.sliderHeightPercentage)}%</span>
                </Stack.Item>
              </Stack>

              <Stack style={{ marginTop: '10px' }} horizontal tokens={{ childrenGap: 15 }}>
                <Stack.Item align="stretch">slider-transition-duration</Stack.Item>
                <Stack.Item align="center" grow={2}>
                  <Slider style={{ width: '10vw' }} min={200} max={1000} 
                  onChange={(value) => handleSettingChange('sliderTransitionDuration', value)}
                  value={settings?.sliderTransitionDuration}
                  // onChange={handleTransitionDurationChange} value={sliderTransitionDuration} 
                  />
                </Stack.Item>
                <Stack.Item align="flex-end">{JSON.stringify(settings?.sliderTransitionDuration)}ms</Stack.Item>
              </Stack>

              <h5 style={{ marginTop: '10px' }}>Arrows</h5>

              <Stack style={{ marginTop: '10px' }} horizontal tokens={{ childrenGap: 15 }}>
                <Stack.Item align="stretch">organic-arrow-thickness</Stack.Item>
                <Stack.Item align="center" grow={2}>
                  <Slider style={{ width: '10vw' }} max={20} min={1} 
                  onChange={(value) => handleSettingChange('organicArrowThickness', value)}
                  value={settings?.organicArrowThickness}
                  // onChange={handleArrowThicknessChange} value={organicArrowThickness} 
                  />
                </Stack.Item>
                <Stack.Item align="flex-end">{JSON.stringify(settings?.organicArrowThickness)}px</Stack.Item>
              </Stack>

              <Stack style={{ marginTop: '10px' }} horizontal tokens={{ childrenGap: 15 }}>
                <Stack.Item align="stretch">organic-arrow-border-radius</Stack.Item>
                <Stack.Item align="center" grow={2}>
                  <Slider style={{ width: '10vw' }} max={30} min={0} 
                  onChange={(value) => handleSettingChange('organicArrowBorderRadius', value)}
                  value={settings?.organicArrowBorderRadius}
                  // onChange={handleArrowBorderRadiusChange} value={organicArrowBorderRadius}
                   />
                </Stack.Item>
                <Stack.Item align="flex-end">{JSON.stringify(settings?.organicArrowBorderRadius)}px</Stack.Item>
              </Stack>

              <Stack style={{ marginTop: '10px' }} horizontal tokens={{ childrenGap: 15 }}>
                <Stack.Item align="stretch">organic-arrow-height</Stack.Item>
                <Stack.Item align="center" grow={2}>
                  <Slider style={{ width: '10vw' }} max={80} min={10} 
                  onChange={(value) => handleSettingChange('organicArrowHeight', value)}
                  value={settings?.organicArrowHeight}
                  // onChange={handleArrowHeightChange} value={organicArrowHeight} 
                  />
                </Stack.Item>
                <Stack.Item align="flex-end">{JSON.stringify(settings?.organicArrowHeight)}px</Stack.Item>
              </Stack>

              <Stack style={{ marginTop: '10px' }} horizontal tokens={{ childrenGap: 15 }}>
                <Stack.Item align="stretch">organic-arrow-color</Stack.Item>
                <Stack.Item align="center" grow={2}>
                  {/* Using a color picker input */}
                  <input
                    type="color"
                    style={{ height: '24px', width: '10vw' }}
                    // value={organicArrowColor}
                    // onChange={(e) => handleArrowColorChange(e.target.value)}
                    onChange={(e) => handleSettingChange('organicArrowColor', e.target.value)}
  value={settings?.organicArrowColor}
                  />
                </Stack.Item>
                <RxTransparencyGrid size={24} onClick={() => handleSettingChange('organicArrowColor','#ffffff00')} />
                <Stack.Item align="flex-end">{settings?.organicArrowColor == '#ffffff00' ? 'Transparent' : settings?.organicArrowColor}</Stack.Item>
              </Stack>

              <h5 style={{ marginTop: '10px' }}>Controls</h5>

              <Stack style={{ marginTop: '10px' }} horizontal tokens={{ childrenGap: 15 }}>
                <Stack.Item align="stretch">control-button-width</Stack.Item>
                <Stack.Item align="center" grow={2}>
                  <Slider style={{ width: '10vw' }} max={40} min={5} 
                  // onChange={handleButtonWidthChange} value={controlButtonWidth} 
                  onChange={(value) => handleSettingChange('controlButtonWidth', value)}
  value={settings?.controlButtonWidth}
                  />
                </Stack.Item>
                <Stack.Item align="flex-end">{JSON.stringify(settings?.controlButtonWidth)}%</Stack.Item>
              </Stack>

              <Stack style={{ marginTop: '10px' }} horizontal tokens={{ childrenGap: 15 }}>
                <Stack.Item align="stretch">control-button-height</Stack.Item>
                <Stack.Item align="center" grow={2}>
                  <Slider style={{ width: '10vw' }} max={80} min={25} 
                  onChange={(value) => handleSettingChange('controlButtonHeight', value)}
                  value={settings?.controlButtonHeight}
                  // onChange={handleButtonHeightChange} value={controlButtonHeight}
                   />
                </Stack.Item>
                <Stack.Item align="flex-end">{JSON.stringify(settings?.controlButtonHeight)}%</Stack.Item>
              </Stack>

              <Stack style={{ marginTop: '10px' }} horizontal tokens={{ childrenGap: 15 }}>
                <Stack.Item align="stretch">control-button-background</Stack.Item>
                <Stack.Item align="center" grow={2}>
                  {/* Using a color picker input */}
                  <input
                    type="color"
                    style={{ height: '24px', width: '10vw' }}
                    // value={controlButtonBackground}
                    // onChange={(e) => handleButtonBackgroundChange(e.target.value)}
                    onChange={(e) => handleSettingChange('controlButtonBackground', e.target.value)}
  value={settings?.controlButtonBackground}
                  />
                </Stack.Item>
                <RxTransparencyGrid size={24} onClick={() => handleSettingChange('controlButtonBackground','#ffffff00')} />
                <Stack.Item align="flex-end">{settings?.controlButtonBackground == '#ffffff00' ? 'Transparent' : settings?.controlButtonBackground}</Stack.Item>
              </Stack>

              <Stack style={{ marginTop: '10px' }} horizontal tokens={{ childrenGap: 15 }}>
                <Stack.Item align="stretch">control-bullet-color</Stack.Item>
                <Stack.Item align="center" grow={2}>
                  {/* Using a color picker input */}
                  <input
                    type="color"
                    style={{ height: '24px', width: '10vw' }}
                    // value={controlBulletColor}
                    // onChange={(e) => setControlBulletColor(e.target.value)}
                    onChange={(e) => handleSettingChange('controlBulletColor', e.target.value)}
  value={settings?.controlBulletColor}
                  />
                </Stack.Item>
                <RxTransparencyGrid size={24} onClick={() => handleSettingChange('controlBulletColor','#ffffff00')} />
                <Stack.Item align="flex-end">{settings?.controlBulletColor == '#ffffff00' ? 'Transparent' : settings?.controlBulletColor}</Stack.Item>

              </Stack>

              <Stack style={{ marginTop: '10px' }} horizontal tokens={{ childrenGap: 15 }}>
                <Stack.Item align="stretch">control-bullet-active-color</Stack.Item>
                <Stack.Item align="center" grow={2}>
                  {/* Using a color picker input */}
                  <input
                    type="color"
                    style={{ height: '24px', width: '10vw' }}
                    // value={controlBulletActiveColor}
                    // onChange={(e) => setControlBulletActiveColor(e.target.value)}
                    onChange={(e) => handleSettingChange('controlBulletActiveColor', e.target.value)}
  value={settings?.controlBulletActiveColor}
                  />
                </Stack.Item>
                <RxTransparencyGrid size={24} onClick={() => handleSettingChange('controlBulletActiveColor','#ffffff00')} />
                <Stack.Item align="flex-end"> {settings?.controlBulletActiveColor == '#ffffff00' ? 'Transparent' : settings?.controlBulletActiveColor}</Stack.Item>

              </Stack>
              <h5 style={{ marginTop: '10px' }}>Loader Bar
              </h5>
              <Stack style={{ marginTop: '10px' }} horizontal tokens={{ childrenGap: 15 }}>
                <Stack.Item align="stretch">loader-bar-color</Stack.Item>
                <Stack.Item align="center" grow={2}>
                  {/* Using a color picker input */}
                  <input
                    type="color"
                    style={{ height: '24px', width: '10vw' }}
                    // value={loaderBarColor}
                    // onChange={(e) => setLoaderBarColor(e.target.value)}
                    onChange={(e) => handleSettingChange('loaderBarColor', e.target.value)}
                    value={settings?.loaderBarColor}
                  />
                </Stack.Item>
                <RxTransparencyGrid size={24} onClick={() => handleSettingChange('loaderBarColor','#ffffff00')} />
                <Stack.Item align="flex-end">{settings?.loaderBarColor == '#ffffff00' ? 'Transparent' : settings?.loaderBarColor}</Stack.Item>
              </Stack>


              <Stack style={{ marginTop: '10px' }} horizontal tokens={{ childrenGap: 15 }}>
                <Stack.Item align="stretch">loader-bar-height</Stack.Item>
                <Stack.Item align="center" grow={2}>
                  <Slider style={{ width: '10vw' }} max={20} min={1} 
                  onChange={(value) => handleSettingChange('loaderBarHeight', value)}
                  value={settings?.loaderBarHeight}
                  // onChange={handleLoaderBarHeightChange} value={loaderBarHeight} 
                  />
                </Stack.Item>
                <Stack.Item align="flex-end"  >{JSON.stringify(settings?.loaderBarHeight)}px</Stack.Item>
              </Stack>


            </div>
            <Stack style={{ marginTop: '10px' }} justifyContent='center' spacing={20}>
              <Button onClick={handleResetCarouselSettings}>Reset Styles</Button>
              <Button onClick={handleSaveCarouselSettings}>Save Styles</Button>
            </Stack>

            </div>
}
          </Col>
        </Row>
      </Grid>
}
    </>
  );
}

export default CarouselComponent;


