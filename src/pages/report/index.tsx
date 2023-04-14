import { useEffect, useState } from "react"
import { Button, TextField } from "@mui/material";
import { Configuration, OpenAIApi } from "openai";


export default function Report() {

  const [date, setDate] = useState('');
  const [report, setReport] = useState<string | undefined>('');
  const [loading, setIsLoading] = useState(false);
  const [responseText, setReponseText] = useState<string | undefined>('');
 
  const generateReport = async () => {
    setIsLoading(true)
    const prompt = `You are a great dungeons master, can you write the following text into an exciting dungeons and dragons story? Write this as a great fantasy writer, should bring excitement to the user.
    ${report}
`;
    console.log('CALLING')
    const data = await fetch(`api/key`) 
    .then(response => response.json());
    const configuration = new Configuration({
        apiKey: data.key
      });
    const openai = new OpenAIApi(configuration);
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: prompt}]
    });
    const reportRes = completion?.data?.choices[0]?.message?.content
    setReponseText(completion?.data?.choices[0]?.message?.content);
    fetch(`api/report?report=${reportRes}&date=${date}`) 
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
