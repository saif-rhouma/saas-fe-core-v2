import axios, { endpoints } from 'src/utils/axios';

export const downloadFile = async (filename) => {
  const config = {
    responseType: 'blob',
  };
  const { data } = await axios.get(endpoints.download + filename, config);
  const fileURL = window.URL.createObjectURL(new Blob([data]));
  const fileName = `${filename}`; // You can dynamically set file name if needed

  if (window.navigator.msSaveBlob) {
    window.navigator.msSaveBlob(data, fileName);
  } else {
    const reader = new FileReader();
    reader.readAsDataURL(data);
    reader.onloadend = () => {
      const link = document.createElement('a');
      link.href = reader.result;
      link.download = fileName;
      link.click();
    };
  }
};
