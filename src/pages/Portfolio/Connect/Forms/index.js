import React, { useState, useEffect } from "react";
import { useField } from "formik";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { userDataUploadPath } from "../../redux/ActionCreators";
import { uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { ProgressBar, Button } from "react-bootstrap";
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import {BsCalendarEventFill} from 'react-icons/bs'
import Editor from "../Editor/Editor";
import "./index.css";
export const MyTextInput = ({ label, ...props }) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input>. We can use field meta to show an error
  // message if the field is invalid and it has been touched (i.e. visited)
  const [field, meta] = useField(props);
  return (
    <>
      <div className="col">
        <div className="form-group focused">
          <label
            className="form-control-label"
            htmlFor={props.id || props.name}
          >
            {label}
          </label>
          <input
            className="form-control form-control-alternative"
            {...field}
            {...props}
          />
          {meta.touched && meta.error ? (
            <div className="error">{meta.error}</div>
          ) : null}
        </div>
      </div>
    </>
  );
};
export const MyEditor = ({ label, ...props }) => {
  const [field, meta, { setValue, setTouched }] = useField(props.field.name);
  return (
    <>
      <div className="col">
        <div className="form-group focused">
          <label
            className="form-control-label"
            htmlFor={props.id || props.name}
          >
            {label}
          </label>
          <Editor
									data={field.value}
									setData={(data) => setValue(data)}
                  onBlur = {setTouched}
                {...props}
								/>
          {meta.touched && meta.error ? (
            <div className="error">{meta.error}</div>
          ) : null}
        </div>
      </div>
    </>
  );
};
export const MyTextInputArea = ({ label, ...props }) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input>. We can use field meta to show an error
  // message if the field is invalid and it has been touched (i.e. visited)
  const [field, meta] = useField(props);
  return (
    <>
      <div className="col">
        <div className="form-group focused">
          <label
            className="form-control-label"
            htmlFor={props.id || props.name}
          >
            {label}
          </label>
          <textarea
            type="text"
            className="form-control form-control-alternative"
            {...field}
            {...props}
          />
          {meta.touched && meta.error ? (
            <div className="error">{meta.error}</div>
          ) : null}
        </div>
      </div>
    </>
  );
};
export const MyCheckbox = ({ children, ...props }) => {
  const [field, meta] = useField({ ...props, type: "checkbox" });
  return (
    <>
      <div className="col">
        <div className="form-group focused">
          <label
            className="form-control-label"
            htmlFor={props.id || props.name}
          >
            <input
              style={{ marginRight: "10px" }}
              {...field}
              {...props}
              type="checkbox"
            />
            <span>{children}</span>
          </label>
          {meta.touched && meta.error ? (
            <div className="error">{meta.error}</div>
          ) : null}
        </div>
      </div>
    </>
  );
};
export const MySelect = (props) => {
  const [ meta, { setValue, }] = useField(props.field.name);
  const animated = makeAnimated();
  const handleChange = (options) => {
    setValue({ options });
  };
  return (
    <div className="col">
      <div className="form-group focused">
        <label className="form-control-label" htmlFor={props.id || props.name}>
          {props.label}
        </label>
        <Select
          closeMenuOnSelect={true}
          components={animated}
          isSearchable
          tabSelectsValue
          isMulti={props.isMulti}
          options={props.options}
          onChange={handleChange}
          {...props}
        />
        {meta.touched && meta.error ? (
          <div className="error">{meta.error}</div>
        ) : null}
      </div>
    </div>
  );
};
export const Myselect = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div className="col">
      <div className="form-group focused">
        <label className="form-control-label" htmlFor={props.id || props.name}>
          {label}
        </label>
        <select
          {...field}
          {...props}
          className="form-control form-control-alternative"
        />
        {meta.touched && meta.error ? (
          <div className="error">{meta.error}</div>
        ) : null}
      </div>
    </div>
  );
};
export function MyCreatableSelect(props) {
  const [ state, { setValue, setTouched }] = useField(props.field.name);
  const animated = makeAnimated();
  const [optionsLoading, setOptionsLoading] = useState(false);
  const handleCreate = (event) => {
    setOptionsLoading(true);
    setTimeout(() => {
      const newOption = createOption(event);
      props.options.push(newOption);
      setOptionsLoading(false);
    }, 1000);
  };
  const createOption = (label) => ({
    label,
    value: label.toLowerCase().replace(/\W/g, ""),
  });
  const handleChange = (options) => {
    setValue(options);
    state.touched = true;
  };
  return (
    <div className="col">
      <div className="form-group focused">
        <label className="form-control-label" htmlFor={props.id || props.name}>
          {props.label}
        </label>
        <CreatableSelect
theme={(theme) => ({
  ...theme,
  borderRadius: 0,
  colors: {
    ...theme.colors,
    neutral0: 'black',
    primary25: 'grey',
    primary: 'whitesmoke',
  },
})}          closeMenuOnSelect={false}
          components={animated}
          isSearchable
          tabSelectsValue
          isMulti={props.isMulti}
          isLoading={optionsLoading}
          onCreateOption={handleCreate}
          options={props.options}
          onChange={handleChange}
          onBlur={setTouched}
          isDisabled={props.disabled}
          placeholder={props.placeholder}
          defaultValue = {props?.values}
        />
        {state.touched && state.error ? (
          <div className="error">{state.error}</div>
        ) : null}
      </div>
    </div>
  );
}
export const FileUploadF = ({ userId, label, fileTypes, ...props }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileUrl, setFileUrl] = useState("");
  const [file, setFile] = useState(null);
  const [ state, { setValue }] = useField(props.field.name);
  const maxSize = 5000000;
  const [message, setMessage] = useState(null);
  const [Errormessage, setErrorMessage] = useState(null);
  const handleFileChange = async (e) => {
    const reader = new FileReader();
    const File = e.target.files[0];
    reader.readAsDataURL(File);
    if (File && fileTypes.includes(File.type) && File.size <= maxSize) {
      setFile(File);
      state.error = null;
      setErrorMessage(null);
    } else {
      setFile(null);
      const extension = File.type.split("/")[1];

      if (File && !fileTypes.includes(File.type)) {
        const allowedFileTypes = fileTypes.map(fileType => fileType.split("/")[1]).join(", ");
        setErrorMessage(`Invalid file type. Only ${allowedFileTypes} are allowed. (Attempted: ${extension})`);
      } else if (File && File.size > maxSize) {
        setErrorMessage("File size exceeds the limit of 5 MB.");
      }
    }
  };
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      state.error = "No file selected for upload.";
      return;
    }
    setUploading(true);
    const uploadprogress = uploadBytesResumable(
      userDataUploadPath(userId, file.name),
      file
    );
    uploadprogress.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.error(error);
      },
      () => {
        getDownloadURL(uploadprogress.snapshot.ref).then((downloadURL) => {
          setFileUrl(downloadURL);
          setUploading(false);
          setValue(downloadURL);
        });
      }
    );
  };
  const handleRemove = async (e) =>{
    e.preventDefault();
    deleteObject(userDataUploadPath(userId, file.name))
    .then(()=>{
        setMessage("File deleted successfully");
        setFileUrl(null);
        setFile(null);
        setValue(null);
        document.querySelector("input[type='file']").value = "";
        setTimeout(()=>{
          setMessage(null);
        }, 5000)
    })
    .catch((error)=>{
      setMessage(null)
      state.touched = true;
      state.error = error;
    })
  }
  return (
    <>
      <div className="col">
        <div className="form-group focused">
          <label
            className="form-control-label"
            htmlFor={props.id || props.name}
          >
            {label}
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="form-control form-control-alternative"
            accept={props?.accept}
            disabled={props?.disabled}
          />{uploading && 
          <div className='mb-1 mt-2'>
          <ProgressBar
            now={progress}
            label={`${progress}%`}
          />
        </div>
        }
        {state.touched && state.error ? (
            <div className="error">{state.error}</div>
          ) : null}
          {message ? (
            <div className="text-success">{message}</div>
          ) : null}
          {Errormessage ? (
            <div className="text-danger">{Errormessage}</div>
          ) : null}
          <div className='mb-1 mt-2'>
          <Button onClick={handleUpload} disabled={!file || fileUrl}>
            Upload
          </Button>
          {
            fileUrl && <>
                      <Button onClick={handleRemove} disabled={file && !fileUrl}>
                      Remove
                    </Button>
            </>
          } </div>    
          {fileUrl && (
            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
              View file
            </a>
          )}
        </div>
      </div>
    </>
  );
};

export const MyDatePicker = ({ label,endDate, ...props }) => {

  const [ state, { setValue, setTouched }] = useField(props?.field?.name);
  const [startDate, setStartDate] = useState(props?.field?.value ? props.field.value : new Date());
  const [minDate, setMinDate] = useState(endDate ? endDate : null);
  const handleChange = (options) => {
    setValue(options);
    setStartDate(options);
    state.touched = true;
  };
  useEffect(() => {
    if (endDate) {
      setMinDate(endDate);
    }
  }, [endDate]);
  const calendarIcon = <BsCalendarEventFill/>
  return (
    <>
      <div className="col">
        <div className="form-group focused">
          <label
            className="form-control-label"
            htmlFor={props.id || props.name}
          >
            {label}
          </label>
          <DatePicker
            showIcon
            isClearable 
            peekNextMonth
      showMonthDropdown
      showYearDropdown
      dropdownMode="select"
            calendarIcon = {calendarIcon}
            selected={startDate}
            maxDate={new Date()}
            minDate={minDate}
            className="form-control form-control-alternative"
            onChange={handleChange}
            onBlur={setTouched}
            customInput={
              <div className="custom-input" style={{tabIndex: -1}}>
                <span><BsCalendarEventFill size={15} /></span>
                <span style={{ marginLeft: "10px", paddingTop: "3px", paddingBottom: "0px" }}>
                  {startDate ? startDate.toLocaleDateString() : "Click to select a date "}
                </span>
              </div>
            }
          />
          {state.touched && state.error ? (
            <div className="error">{state.error}</div>
          ) : null}
        </div>
      </div>
    </>
  );
};
export const MyCheckboxes = ({ obj, onChange }) => {
  return (
    <>
      <input
        type="checkbox"
        id={`custom-checkbox-${obj.index}`}
        name={obj.name}
        value={obj.checked}
        onChange={() => onChange({ ...obj, checked: !obj.checked })}
      />
      {obj.name}
    </>
  );
};