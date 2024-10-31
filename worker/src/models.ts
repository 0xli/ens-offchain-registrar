import { ColumnType } from 'kysely'
import { isAddress, isHex } from 'viem'
import z from 'zod'

export const ZodName = z.object({
  id: z.number().optional(),
  name: z.string().regex(/^[a-z0-9-.]+$/),
  owner: z.string().refine((owner) => isAddress(owner)),
  addresses: z.record(z.string().refine((addr) => isHex(addr))).optional(),
  texts: z.record(z.string()).optional(),
  contenthash: z
    .string()
    .refine((contenthash) => isHex(contenthash))
    .optional(),
  referee: z.string().optional(),
  nft: z.string().optional(),
  nftid: z.number().optional(),
})

export const ZodNameWithSignature = z.object({
  signature: z.object({
    hash: z.string().refine((hash) => isHex(hash)),
    message: ZodName,
  }),
  expiration: z.number(),
})

export type Name = z.infer<typeof ZodName>
export type NameWithSignature = z.infer<typeof ZodNameWithSignature>

export interface NameInKysely {
  id: number
  name: string
  owner: string
  addresses: string | null
  texts: string | null
  contenthash: string | null
  referee: string | null
  nft: string | null
  nftid: number | null
  createdAt: ColumnType<Date, never, never>
  updatedAt: ColumnType<Date, never, string | undefined>
}
