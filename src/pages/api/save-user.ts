import firebaseapp from "@/util/firebaseapp";
import { NextApiRequest, NextApiResponse } from "next";
import { getDatabase, set, ref } from "firebase/database";
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
  ) {

    console.log(req.body);
    const { name, level, spell } = req.body;

    // Initialize Realtime Database and get a reference to the service
    const database = getDatabase(firebaseapp);
    await set(ref(database, `${name}/spells/${level}/${spell.name}` ), spell);
    return res.status(200).json({ spell })
  }