import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch(`${process.env.SERVER_HOST}/api/roomman/backline`, 
    )
    const data = await response.json()
    res.status(200).json(data)
  } catch (error) {
    console.error('Error fetching backline:', error)
    res.status(500).json({ message: 'Error fetching backline' })
  }
}