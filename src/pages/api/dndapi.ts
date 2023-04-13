// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  data: any
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log(req.query)
  return fetch(`https://www.dnd5eapi.co/api/${req.query.path}`).then(data => {
    return data.json().then(data => res.status(200).json({ data }))
  })
  
}
