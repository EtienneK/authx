import nc from 'next-connect'
import type { NextApiRequest, NextApiResponse } from 'next'
import adapters from '../../../../adapters'
import { validate } from '../../../../middlewares/validate'
import { serverUserSchema } from '../../../../schemas/server/admin'
import { upsert } from '../../../../services/admin/users'

const handler = nc<NextApiRequest, NextApiResponse>()
  .get(async (req, res) => {
    res.status(200).json(await adapters.users().list())
  })
  .post(validate(serverUserSchema, async (req, res) => {
    const id = await upsert(req.body)
    res.status(201).json({ id })
  }))

export default handler
