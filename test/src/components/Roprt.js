import React, { useState } from 'react';

function MalwareReportPage({ fileName }) {
  const [apiCallNo, setApiCallNo] = useState('');
  const [apiCallSequence, setApiCallSequence] = useState('');

  
   {
    console.log('File Name:', fileName);
    console.log('API Call No:', apiCallNo);
    console.log('API Call Sequence:', apiCallSequence);
    
    setApiCallNo('');
    setApiCallSequence('');
  };

  return (
    <div>
      <h1>Malware Behavioral Report</h1>
      <form>
        <div>
          <label>
            File Name:
            <input type="text" value={fileName} disabled />
          </label>
        </div>
        <div>
          <label>
            API Call No:
            <input
              type="text"
              value={apiCallNo}
              onChange={(e) => setApiCallNo(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            API Call Sequence:
            <textarea
              value={apiCallSequence}
              onChange={(e) => setApiCallSequence(e.target.value)}
              required
            ></textarea>
          </label>
        </div>
      </form>
    </div>
  );
}

export default MalwareReportPage;
