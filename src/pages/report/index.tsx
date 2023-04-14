import { useEffect, useState } from "react"
import { Button, TextField } from "@mui/material";

export default function Report() {

  const [date, setDate] = useState('');
  const [report, setReport] = useState('');
  const [loading, setIsLoading] = useState(false);
  const [responseText, setReponseText] = useState('');
 
  const generateReport = () => {
    setIsLoading(true);
    fetch(`api/report?report=${report}&date=${date}`) 
    .then(response => response.json())
    .then(response => {
        console.log(response, response.report);
        setReponseText(response.report);
        setIsLoading(false);
    });
  }

  return <div>
        <h1>Report </h1>
       <label htmlFor="report-date">Start date:</label>
      <input
        type="date"
        id="start"
        name="trip-start"
        onChange={evt => setDate(evt.target.value)}
        
      />
      <div style={{ marginTop: '25px', marginBottom: '25px'}}>
      <TextField
        style={{ width: '100%'}}
        id="outlined-textarea"
        label="Multiline Placeholder"
        placeholder="Placeholder"
        onChange={evt => setReport(evt.target.value)}
        multiline
      />
    </div>
     
      <Button onClick={() => generateReport()} style={{ marginTop: '25px', marginBottom: '25px'}} variant="text">Generate Report</Button>
      <>
      {loading && <p>Making up a great story about how you killed everyone..... Dont worry this can take a while ...</p>}
      {responseText?.split(/\n\n/).map((text, i) => <p key={i} style={{ fontSize: '1.25em', padding: '10px'}}>{text}</p>)}
      </> 

    </div>
}
