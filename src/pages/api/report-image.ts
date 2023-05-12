import firebaseapp from '@/util/firebaseapp';
import type { NextApiRequest, NextApiResponse } from 'next'
import {
    getStorage,
    ref as refStorage,
    uploadBytes,
    getDownloadURL,
  } from "firebase/storage";



export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
  ) {
    const url = await saveImage(req.query.imageUrl, req.query.uuid)
    return res.status(200).json({ url });
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
