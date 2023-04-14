import { Configuration, OpenAIApi } from "openai";
import { initializeApp } from "firebase/app";
import { getDatabase, set, ref } from "firebase/database";
import type { NextApiRequest, NextApiResponse } from 'next'

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
const openai = new OpenAIApi(configuration);
const firebaseConfig = {
    // ...
    // The value of `databaseURL` depends on the location of the database
    databaseURL: "https://dungeonsdragons-f84ec-default-rtdb.europe-west1.firebasedatabase.app",
  };
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
  ) {
    const prompt = `You are a great dungeons master, can you write the following text into an exciting dungeons and dragons story? Write this as a great fantasy writer, should bring excitement to the user.
    ${req.query.report}
`;
    console.log('CALLING')
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: prompt}]
    });

    const report = completion?.data?.choices[0]?.message?.content;
    saveReport(report, req.query.date)
    console.log(report);
    return res.status(200).json({ report });
  }

  function saveReport(report: any, date: any) {
      // Initialize Firebase
      const app = initializeApp(firebaseConfig);
      // Initialize Realtime Database and get a reference to the service
      const database = getDatabase(app);
      set(ref(database, 'report/' + date), report);
}
