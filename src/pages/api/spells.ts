import { initializeApp } from "firebase/app";
import { getDatabase, get, child, ref } from "firebase/database";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  spells: any
}

const firebaseConfig = {
  // ...
  // The value of `databaseURL` depends on the location of the database
  databaseURL: "https://dungeonsdragons-f84ec-default-rtdb.europe-west1.firebasedatabase.app",
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const app = initializeApp(firebaseConfig);
  const dbRef = ref(getDatabase());
  // get(child(dbRef, `spells`)).then((snapshot) => {
  //   if (snapshot.exists()) {
  //     console.log(snapshot.val());
  //   } else {
  //     console.log("No data available");
  //   }
  // }).catch((error) => {
  //   console.error(error);
  // });
  const dndClass = req.query.class as String;

  return fetch(`https://www.dnd5eapi.co/api/classes/${req.query.class}/spells`).then(async data => {
    const spells = await data.json().then(async data => {

      return await Promise.all(data.results.map(async (spell : any) => {
        const response = await fetch(`https://www.dnd5eapi.co${spell.url}`);
        const spellResponse = await response.json();
        
        return {
          ...spell,
          ...spellResponse
        }
      }))
      
    });
    
    try {
      const snapshot = await get(child(dbRef, `spells`));
      console.log(snapshot);
      if (snapshot.exists()) {
        console.log(typeof snapshot.val());
        Object.values(snapshot.val()).forEach((spell : any) => {
          if (!spell.classes.length) {
            console.log(spell.name, 'does not have a class')
          }
          const classes : String[] = spell.classes.split(',').map((a : String) => a.toLowerCase());
          if (dndClass && classes.includes(dndClass.toLowerCase())) {
            spells.push(spell);
          }
          
        })
      } else {
        console.log("No data available");
      }
    } catch(error) {
      console.error(error);
    }


    console.log('RETTTUUUURN')
    return res.status(200).json({ spells })
  })
  
}
