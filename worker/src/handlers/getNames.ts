import { createKysely } from '../db/kysely'
import { Env } from '../env'
import { parseNameFromDb } from './functions/utils'
import { sql } from 'kysely'

export async function getNames(env: Env) {
  const db = createKysely(env)
  const names = await db.selectFrom('names')
    .selectAll()
    .where('texts', '!=', '{}')
    .where('texts', 'like', '%carrierAddress%')
    .where(sql`json_extract(texts, '$.carrierAddress') IS NOT NULL`)
    .where(sql`length(json_extract(texts, '$.carrierAddress')) = 52`)
    .orderBy('created_at', 'desc')
    .execute()

  try {
    const parsedNames = parseNameFromDb(names)

    // Simplify the response format
    const formattedNames = parsedNames.reduce((acc, name) => {
      return {
        ...acc,
        [name.name]: {
          addresses: name.addresses,
          texts: name.texts,
          contenthash: name.contenthash,
        },
      }
    }, {})

    return Response.json(formattedNames, {
      status: 200,
    })
  } catch (e) {
    return Response.json(names, {status: 500})
  }
}
