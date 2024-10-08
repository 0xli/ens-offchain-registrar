import { createKysely } from '../../db/kysely'
import { Env } from '../../env'
import { Name } from '../../models'
import { parseNameFromDb } from './utils'

export async function get(name: string, env: Env): Promise<Name | null> {
  const db = createKysely(env)
  const record = await db
    .selectFrom('names')
    .selectAll()
    .where('name', '=', name)
    .executeTakeFirst()

  if (!record) {
    return null
  }

  return parseNameFromDb(record)
}

export async function getByAddress(address: string, env: Env): Promise<Name | null> {
  const db = createKysely(env)
  console.log("address:"+address)
  const record = await db
      .selectFrom('names')
      .selectAll()
      .where('owner', '=', address)
      .executeTakeFirst()

  if (!record) {
    return null
  }

  console.log(JSON.stringify(record));
  return parseNameFromDb(record)
}
