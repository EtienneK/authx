import nc from 'next-connect'
import type { NextApiRequest, NextApiResponse } from 'next'
import { userSchema } from '../../../../schemas/db'
import adapters from '../../../../adapters'
import { validate } from '../../../../middlewares/validate'

const handler = nc<NextApiRequest, NextApiResponse>()
  .get(async (req, res) => {
    const { id } = req.query
    const found = await adapters.users().find(id as string)
    if (found == null) return res.status(404).end()
    res.status(200).json(found)
  })
  .put(validate(userSchema, async (req, res) => {
    const { id } = req.query
    const found = await adapters.users().find(id as string)
    if (found == null) {
      res.status(404).end()
    } else {
      await adapters.users().upsert(id as string, req.body)
      res.status(204).end()
    }
  }))
  .delete(async (req, res) => {
    const { id } = req.query
    await adapters.users().destroy(id as string)
    res.status(204).end()
  })

export default handler
