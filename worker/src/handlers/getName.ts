import type { IRequest } from 'itty-router'
import zod from 'zod'

import { Env } from '../env'
import { get, getByAddress } from './functions/get'

export async function getName(request: IRequest, env: Env) {
  const schema = zod.object({
    name: zod.string().regex(/^[a-z0-9-.]+$/),
  })
  const safeParse = schema.safeParse(request.params)

  if (!safeParse.success) {
    const response = { error: safeParse.error }
    return Response.json(response, { status: 400 })
  }

  const { name } = safeParse.data
  const nameData = await get(name, env)

  if (nameData === null) {
    return new Response('Name not found', { status: 404 })
  }

  return Response.json(nameData, {
    status: 200,
  })
}
export async function getAddress(request: IRequest, env: Env) {
  const schema = zod.object({
//    name: zod.string().regex(/^[a-z0-9-.]+$/),
    address: zod.string().regex(/^0x[a-fA-F0-9]{40}$/),
  })
  console.log("request:"+JSON.stringify(request.params));
  const safeParse = schema.safeParse(request.params)

  if (!safeParse.success) {
    const response = { error: safeParse.error }
    return Response.json(response, { status: 400 })
  }

  const { address } = safeParse.data
  const nameData = await getByAddress(address, env)

  if (nameData === null) {
    return new Response('Name not found', { status: 404 })
  }

  return Response.json(nameData, {
    status: 200,
  })
}
