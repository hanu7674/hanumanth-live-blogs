export const env = "production ";
export const LOGIN = '/login';
export const EMAIL_FORGET = "/forgot-email";
export const EDUCATION = "/education";
export const EXPERIENCE = "/experience";
export const OPEN_SOURCE = "/open-source";
export const CONTACT = "/contact";
export const PROJECTS = "/projects";
export const BLOGS = "/blogs";
export const CONNECT_WITH_ME = "/connect-with-me";
export const THANK_YOU = "/connect-with-me/thank-you";
export const excerpt = (str, count) => {
    if (str?.length > count) {
      str = str.substring(0, count) + " ... ";
    }
    return str;
  };
  export function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes'
  
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
  
    const i = Math.floor(Math.log(bytes) / Math.log(k))
  
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  };

  export const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ].map((month) => {return {value: month.padStart(2, '0'), label: month}});
  
  export function startYear() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
  const startYear = currentYear;
  const endYear = currentYear - 100;

  const yearOptions = [];
  for (let year = startYear; year >= endYear; year--) {
    yearOptions.push({ value: year.toString(), label: year.toString() });
  }
  return yearOptions.sort((a, b) => a.value + b.value);
  }
  export const endYear = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
  const startYear = currentYear + 10;
  const endYear = currentYear - 100;

  const yearOptions = [];
  for (let year = startYear; year >= endYear; year--) {
    yearOptions.push({ value: year.toString(), label: year.toString() });
  }
  return yearOptions.sort((a, b) => a.value + b.value);
  }
  export const isURL = (value) => {
    // Simple URL validation using a regular expression
    const urlRegex = /^(http|https):\/\/[^ "]+$/;
    return urlRegex.test(value);
  };