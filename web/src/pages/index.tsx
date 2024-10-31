import { Button, Input } from '@ensdomains/thorin'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Head from 'next/head'
import { useState } from 'react'
import { useAccount, useSignMessage } from 'wagmi'

import { Footer } from '@/components/Footer'
import { useDebounce } from '@/hooks/useDebounce'
import { useFetch } from '@/hooks/useFetch'
import { Card, Form, Helper, Link, Spacer,Label } from '@/styles'
import { WorkerRequest } from '@/types'

export default function App() {
  const { address } = useAccount()

  const [name, setName] = useState<string | undefined>(undefined)
  const [description, setDescription] = useState<string | undefined>(undefined)
  const [displayName, setDisplayName] = useState<string | undefined>(undefined)
  const [carrierAddress, setCarrierAddress] = useState<string | undefined>(undefined)
  const [carrierUserId, setCarrierUserId] = useState<string | undefined>(undefined)
  const [baseAddress, setBaseAddress] = useState<string | undefined>(address)
  const [arbAddress, setArbAddress] = useState<string | undefined>(address)
  const [referee, setReferee] = useState<string | undefined>(undefined)
  const [nft, setNft] = useState<string | undefined>(undefined)
  const [nftid, setNftid] = useState<number | undefined>(undefined)

  const regex = new RegExp('^[a-z0-9-]+$')
  const debouncedName = useDebounce(name, 500)
  const enabled = !!debouncedName && regex.test(debouncedName)

  const { data, isLoading, signMessage, variables } = useSignMessage()

    const L1ensname = "beagles";
  const nameData: WorkerRequest['signature']['message'] = {
//    name: `${debouncedName}.offchaindemo.eth`,
//  const requestBody: WorkerRequest = {
    name: `${debouncedName}.${L1ensname}.eth`,
    owner: address!,
    // https://docs.ens.domains/web/resolution#multi-chain
    addresses: {
      '60': address,
      '2147492101': baseAddress,
      '2147525809': arbAddress,
    },
    texts: { description, displayName, carrierAddress },
    referee: referee,
    nft: nft,
    nftid: nftid,
  }

  const requestBody: WorkerRequest = {
    addresses: { '60': address },
    texts: { description, displayName,carrierAddress },
    signature: {
      hash: data!,
      message: nameData,
    },
    expiration: new Date().getTime() + 60 * 60, // 1 hour
  }

  const {
    data: gatewayData,
    error: gatewayError,
    isLoading: gatewayIsLoading,
//  } = useFetch(data && 'https://ens-gateway.gregskril.workers.dev/set', {
//  } = useFetch(data && 'https://ens-gateway.beaglechat.workers.dev/set', {
  } = useFetch(data && 'http://localhost:8787/set', {
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
        <Label>Get free subdomain name of beagles.eth </Label>
        <Label>Not ETH needed, not gas fee </Label>
        <ConnectButton showBalance={false} />

        <Form
          onSubmit={(e) => {
            e.preventDefault()
//            signMessage({
//              message: `Register ${debouncedName}.${L1ensname}.eth`,
//            })
            signMessage({ message: JSON.stringify(nameData) })
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
              label="DisplayName"
              placeholder="Your Display name"
              disabled={!!data || !address}
              onChange={(e) => setDisplayName(e.target.value)}
          />

          <Input
            type="text"
            label="Description"
            placeholder="Your beagle chat profile"
            disabled={!!data || !address}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Input
              type="text"
              label="carrierAddress"
              placeholder="Your carrier address"
              disabled={!!data || !address}
              onChange={(e) => setCarrierAddress(e.target.value)}
          />
          {/*<Input*/}
          {/*    type="text"*/}
          {/*    label="carrierUserId"*/}
          {/*    placeholder="Your carrier user id"*/}
          {/*    disabled={!!data || !address}*/}
          {/*    onChange={(e) => setCarrierUserId(e.target.value)}*/}
          {/*/>*/}

          <Input
            type="text"
            label="Referee"
            placeholder="Referee ENS name or address"
            disabled={!!data || !address}
            onChange={(e) => setReferee(e.target.value)}
          />

          <Input
            type="text"
            label="NFT Collection"
            placeholder="NFT collection name"
            disabled={!!data || !address}
            onChange={(e) => setNft(e.target.value)}
          />

          <Input
            type="number"
            label="NFT ID"
            placeholder="NFT token ID"
            disabled={!!data || !address}
            onChange={(e) => setNftid(parseInt(e.target.value))}
          />

          <Input
            type="text"
            label="ETH Address"
            defaultValue={address}
            disabled
          />

          <Input
            type="text"
            label="Base Address"
            defaultValue={address}
            disabled={!!data || !address}
            onChange={(e) => setBaseAddress(e.target.value)}
          />

          <Input
            type="text"
            label="Arb Address"
            defaultValue={address}
            disabled={!!data || !address}
            onChange={(e) => setArbAddress(e.target.value)}
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
