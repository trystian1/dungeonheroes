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
    saveReport(req.query.report, req.query.date)
    return res.status(200).json({});
  }

  function saveReport(report: any, date: any) {
      // Initialize Firebase
      const app = initializeApp(firebaseConfig);
      // Initialize Realtime Database and get a reference to the service
      const database = getDatabase(app);
      set(ref(database, 'report/' + date), report);
}
