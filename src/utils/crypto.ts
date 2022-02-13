import { promisify } from 'util'
import { randomBytes, pbkdf2 } from 'crypto'

const randomBytesAsync = promisify(randomBytes)
const pbkdf2Async = promisify(pbkdf2)

// Password Hashing

const passwordHashParams = {
  saltLength: 16,
  iterations: 10000,
  keylen: 64,
  digest: 'sha512'
}

export async function hashPassword (password: string): Promise<string> {
  const { saltLength, iterations, keylen, digest } = passwordHashParams
  const salt = await randomBytesAsync(saltLength)
  const hash = await pbkdf2Async(password, salt, iterations, keylen, digest)
  return `${salt.toString('base64')}:${hash.toString('base64')}`
}
