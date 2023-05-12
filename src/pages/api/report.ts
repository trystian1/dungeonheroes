import { Configuration, OpenAIApi } from "openai";
import { initializeApp } from "firebase/app";
import { getDatabase, set, ref } from "firebase/database";
import type { NextApiRequest, NextApiResponse } from 'next'
import firebaseapp from "@/util/firebaseapp";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
  ) {
    console.log('SAVE REPORT?')
    saveReport(req.query.report, req.query.uuid, req.query.date, req.query.imageUrl)
    return res.status(200).json({});
  }

  function saveReport(report: any, uuid: any, date: any, imageUrl: any) {

      // Initialize Realtime Database and get a reference to the service
      const database = getDatabase(firebaseapp);
      set(ref(database, 'reports/' + uuid), {
        report,
        date,
        imageUrl
      });
}
