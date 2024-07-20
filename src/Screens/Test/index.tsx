import React, { useState } from 'react';

function Test() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');

  const handleFileChange = (e:any) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('http://127.0.0.1:8787/convertPdfToText', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    if (result.text) {
      setText(result.text);
    } else {
      console.error('Error:', result.error);
    }
  };

  

  const handleUploadToAI = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('http://127.0.0.1:8787/extractTextWithAI', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    if (result.text) {
      setText(result.text);
    } else {
      console.error('Error:', result.error);
    }
  }


  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <button onClick={handleUploadToAI}>Upload to AI</button>
      <pre>{text}</pre>
    </div>
  );
}

export default Test;
