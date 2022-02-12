import nc from 'next-connect'
import type { NextApiRequest, NextApiResponse } from 'next'
import { nanoid } from 'nanoid'
import { userSchema } from '../../../../schemas/db'
import adapters from '../../../../adapters'
import { validate } from '../../../../middlewares/validate'
import { object } from 'yup'

const serverUserSchema = object({
  email: userSchema.fields.email.test(
    'unique email',
    'email already exists',
    async (email) => {
      if (email == null) return true
      const emailExists = await adapters.users().existsByEmail(email.toLowerCase())
      return !emailExists
    }),
  username: userSchema.fields.username.test(
    'unique username',
    'username already exists',
    async (username) => {
      if (username == null) return true
      const usernameExists = await adapters.users().existsByUsername(username.toLowerCase())
      return !usernameExists
    })
})

const handler = nc<NextApiRequest, NextApiResponse>()
  .get(async (req, res) => {
    res.status(200).json(await adapters.users().list())
  })
  .post(validate(userSchema.concat(serverUserSchema), async (req, res) => {
    const username = (req.body.username as string)?.toLowerCase()
    const email = (req.body.email as string)?.toLowerCase()

    req.body.username = username
    req.body.email = email

    const id = nanoid()
    await adapters.users().upsert(id, req.body)

    res.status(201).json({ id })
  }))

export default handler
