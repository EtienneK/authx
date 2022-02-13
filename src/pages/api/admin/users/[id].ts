import nc from 'next-connect'
import type { NextApiRequest, NextApiResponse } from 'next'
import { userSchema } from '../../../../schemas/shared/admin'
import adapters from '../../../../adapters'
import { validate } from '../../../../middlewares/validate'
import { upsert } from '../../../../services/admin/users'

const handler = nc<NextApiRequest, NextApiResponse>()

  .get(async (req, res) => {
    const { id } = req.query
    const found = await adapters.users().find(id as string)
    if (found == null) return res.status(404).end()
    found.password = '********'
    res.status(200).json(found)
  })

  .put(validate(userSchema, async (req, res) => {
    const { id } = req.query
    const found = await adapters.users().find(id as string)
    if (found == null) {
      res.status(404).end()
    } else {
      await upsert(req.body, id as string)
      res.status(204).end()
    }
  }))

  .delete(async (req, res) => {
    const { id } = req.query
    await adapters.users().destroy(id as string)
    res.status(204).end()
  })

export default handler
