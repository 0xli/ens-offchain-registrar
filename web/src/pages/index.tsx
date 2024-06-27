import { Button, Input } from '@ensdomains/thorin'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Head from 'next/head'
import { useState } from 'react'
import { useAccount, useSignMessage } from 'wagmi'

import { Footer } from '@/components/Footer'
import { useDebounce } from '@/hooks/useDebounce'
import { useFetch } from '@/hooks/useFetch'
import { Card, Form, Helper, Link, Spacer } from '@/styles'
import { WorkerRequest } from '@/types'

export default function App() {
  const { address } = useAccount()

  const [name, setName] = useState<string | undefined>(undefined)
  const [description, setDescription] = useState<string | undefined>(undefined)

  const regex = new RegExp('^[a-z0-9-]+$')
  const debouncedName = useDebounce(name, 500)
  const enabled = !!debouncedName && regex.test(debouncedName)

  const { data, isLoading, signMessage, variables } = useSignMessage()

  const L1ensname = "beagles";
  const requestBody: WorkerRequest = {
    name: `${debouncedName}.${L1ensname}.eth`,
    owner: address!,
    addresses: { '60': address },
    texts: { description },
    signature: {
      hash: data!,
      message: variables?.message!,
    },
  }

  const {
    data: gatewayData,
    error: gatewayError,
    isLoading: gatewayIsLoading,
//  } = useFetch(data && 'https://ens-gateway.gregskril.workers.dev/set', {
  } = useFetch(data && 'https://ens-gateway.beaglechat.workers.dev/set', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })

  return (
    <>
      <Head>
        <title>Beagle Chat ENS Registrar</title>
        <meta property="og:title" content="Beagle Chat ENS Registrar" />
        <meta
          name="description"
          content="Register subdomain of beagles.eth ENS names"
        />
        <meta
          property="og:description"
          content="Register subdomain of beagles.eth ENS names"
        />
      </Head>

      <Spacer />

      <Card>
        <ConnectButton showBalance={false} />

        <Form
          onSubmit={(e) => {
            e.preventDefault()
            signMessage({
              message: `Register ${debouncedName}.${L1ensname}.eth`,
            })
          }}
        >
          <Input
            type="text"
            label="Name"
            suffix=".beagles.eth"
            placeholder="ens"
            required
            disabled={!!data || !address}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            type="text"
            label="Description"
            placeholder="Your beagle chat profile"
            disabled={!!data || !address}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Button
            type="submit"
            disabled={!enabled || !!data}
            loading={isLoading || gatewayIsLoading}
          >
            Register
          </Button>
        </Form>

        {gatewayError ? (
          <Helper type="error">
            {gatewayError.message === 'Conflict'
              ? 'Somebody already registered that name'
              : 'Something went wrong'}
          </Helper>
        ) : gatewayData ? (
          <Helper>
            <p>
              Visit the{' '}
              <Link href={`https://ens.app/${debouncedName}.${L1ensname}.eth`}>
                ENS Manager
              </Link>{' '}
              to see your name
            </p>
          </Helper>
        ) : !!debouncedName && !enabled ? (
          <Helper type="error">Name must be lowercase alphanumeric</Helper>
        ) : null}
      </Card>

      <Footer />
    </>
  )
}
