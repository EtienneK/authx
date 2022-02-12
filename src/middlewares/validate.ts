import { yupResolver } from '@hookform/resolvers/yup'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { ObjectShape, OptionalObjectSchema } from 'yup/lib/object'

export function validate (
  schema: OptionalObjectSchema<ObjectShape>,
  handler: NextApiHandler
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const resolver = yupResolver(schema, { abortEarly: false, stripUnknown: true })
    const result = await resolver(req.body, {}, {} as any)
    if (Object.keys(result.errors).length !== 0) return res.status(400).json({ fieldValidationErrors: result.errors })
    req.body = result.values
    return await handler(req, res)
  }
}
