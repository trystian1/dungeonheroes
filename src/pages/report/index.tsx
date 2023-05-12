import { useEffect, useState } from "react"
import { Button, TextField } from "@mui/material";
import { Configuration, OpenAIApi } from "openai";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";

import {
  getStorage,
  ref as refStorage,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import firebaseapp from "@/util/firebaseapp";

export default function Report() {

  const [date, setDate] = useState('');
  const [report, setReport] = useState<string | undefined>('');
  const [loading, setIsLoading] = useState(false);
  const [responseText, setReponseText] = useState<string | undefined>('');
  const [imageUrl, setImageUrl] = useState('');
 
  const generateReport = async () => {
    setIsLoading(true)
    const prompt = `You are a great dungeons master, can you write the following text into an exciting dungeons and dragons story? Write this as a great fantasy writer, should bring excitement to the user.
    ${report}
`;
    const uuid = uuidv4();
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
    let imageUrl = '';
    try {
      imageUrl = await getImage(report, data.key, uuid);
    } catch(error) {
      console.log(error);
    }
    
    console.log(imageUrl)
    setImageUrl(imageUrl);
    fetch(`api/report?report=${reportRes}&uuid=${uuid}&imageUrl=${imageUrl}&date=${date}`) 
  }

  async function getImage(action: string | undefined, key: string, uuid: string) {
    console.log("START", action, key, uuid)
    const configuration = new Configuration({
      apiKey: key
    });
    const openai = new OpenAIApi(configuration);
    const response = await openai.createImage({
      prompt: `a pen and colored ink drawing of a D&D creature from the monster manual. Breath-taking digital painting with warm colours amazing art mesmerizing, 4k, detailed, trending in artstation, Style should be fantasy art, dungeons and dragons, which consist of a warlock, barbarian socerer and rogue. From the back`,
      n: 1,
      size: "512x512",
    });
    console.log(response);
    //console.log(response["data"]["data"][0]["url"])
    if (response?.data?.data) {
      const resp = await fetch(imageUrl, {
        headers: {},
        method: "GET",
      });

      console.log(resp);
      
      return await saveImage(response["data"]["data"][0]["url"], uuid);
    }
    return "";
  }

  async function saveImage(imageUrl: any, uuid: any) {
    // Initialize Firebase
    
    // Initialize Realtime Database and get a reference to the service
    const storage = getStorage(firebaseapp);
    
    const storageRef = refStorage(storage, `reports/${uuid}.jpg`);
    console.log(imageUrl)
    const resp = await fetch(imageUrl, {
      headers: {},
      method: "GET",
    });

    if (!resp.ok) {
      console.log(resp)
      throw new Error(`HTTP error! status: ${resp.status}`);
    }
    const blob = await resp.arrayBuffer();
    await uploadBytes(storageRef, blob);

    const url = await getDownloadURL(storageRef);
    console.log(url);

    return await getDownloadURL(storageRef);
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
      <img src={imageUrl} />
    </div>
     
      <Button onClick={() => generateReport()} style={{ marginTop: '25px', marginBottom: '25px'}} variant="text">Generate Report</Button>
      <>
      {loading && <p>Making up a great story about how you killed everyone..... Dont worry this can take a while ...</p>}
      {responseText?.split(/\n\n/).map((text, i) => <p key={i} style={{ fontSize: '1.25em', padding: '10px'}}>{text}</p>)}
      </> 

    </div>
}
