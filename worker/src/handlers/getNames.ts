import { createKysely } from '../db/kysely'
import { Env } from '../env'
import { parseNameFromDb } from './functions/utils'
import { sql } from 'kysely'

export async function getNames(env: Env) {
  const db = createKysely(env)
  const names = await db
    .selectFrom('names as n')
    .leftJoin('whitelist as w', 'n.name', 'w.name')
    .leftJoin('blacklist as b', 'n.name', 'b.name')
    .selectAll('n')
    .where('n.texts', '!=', '{}')
    .where('n.texts', 'like', '%carrierAddress%')
    .where(sql`json_extract(n.texts, '$.carrierAddress') IS NOT NULL`)
    .where(sql`length(json_extract(n.texts, '$.carrierAddress')) >= 40`)
    .where(sql`length(json_extract(n.texts, '$.carrierAddress')) <= 52`)
    .where('b.name', 'is', null) // Exclude blacklisted names
    .orderBy('w.name', 'desc') // Whitelist first
    .orderBy('n.created_at', 'desc') // Then by creation date
    .limit(10)
    .execute()

  try {
    const parsedNames = parseNameFromDb(names)
    const formattedNames = parsedNames.reduce((acc, name) => {
      return {
        ...acc,
        [name.name]: {
          id: name.id,
          addresses: name.addresses,
          texts: name.texts,
          contenthash: name.contenthash,
          referee: name.referee,
          nft: name.nft,
          nftid: name.nftid,
        },
      }
    }, {})

    return Response.json(formattedNames, {
      status: 200,
    })
  } catch (e) {
    console.error('Error parsing names:', e)
    return Response.json({ error: 'Error processing names' }, { status: 500 })
  }
}
