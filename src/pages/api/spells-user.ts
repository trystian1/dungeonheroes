import firebaseapp from "@/util/firebaseapp";
import { keyframes } from "@emotion/react";
import { child, get, getDatabase, ref } from "firebase/database";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
  ) {
    const name = req.query.name
    const dbRef = ref(getDatabase(firebaseapp));
    const snapshot = await get(child(dbRef, `${name}/spells`));
    const spells : any[] = []
    console.log(snapshot, snapshot.exists());
    if (snapshot.exists()) {
      const data = snapshot.val();
      Object.keys(snapshot.val()).forEach((key : any) => {
        console.log(data[key], key);
        Object.values(data[key]).forEach((spell: any) => {
           console.log(spell);
           
           spells.push(
            {
                level: key,
                spell
            }
        )
        })

      });
    }
    return res.status(200).json({ spells })
};