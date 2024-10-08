# CCIP Read Gateway

[Cloudflare Worker](https://developers.cloudflare.com/workers/) is used as the [CCIP Read](https://eips.ethereum.org/EIPS/eip-3668) gateway. [Cloudflare D1](https://developers.cloudflare.com/d1/) is used to store name data.

These choices allow for a scalable namespace with low cost (store up to 1M names for free), low latency, and high availability.

## API Routes

- `/names` - GET - Returns all names from the database
- `/get/{name}` - GET - Returns the records for a given name
- `/getAddress/{address}` - GET - Returns the records for a given address
- `/set` - POST - Adds a name to the database or upate the 
```
{
"name":"fans.beagles.eth",
"owner":"0x8A13185c7da27aa575F30f5F382a5C85Dac8730b",
"addresses":{"60":"0x8A13185c7da27aa575F30f5F382a5C85Dac8730b"},
"texts":
{"description":"My Description",
 "displayName":"Display name",
 "carrierAddress":"carrier address"},
"signature":
{"hash":"0x77b0a1096f2e8e0d1b6a550c2b280af9ae6c734313426326ba907c5130b8fc4966ed0588f5b669d09cea5a01f79a4ed94679a3f262962658884f60c6a01f75931b","message":"Register fans.beagles.eth"}
}
```
- `/lookup/{sender}/{data}.json` - GET - CCIP Read lookup

## Customizing the Gateway

If you want to use the gateway to serve offchain data that does not come from Cloudflare D1, you can customize [src/handlers/functions/get.ts](./src/handlers/functions/get.ts). Just make sure that it returns data of the same type.

## Run Locally

1. Navigate to this directory: `cd worker`
2. Login to Cloudflare: `npx wrangler login`
3. Create a D1 instance: `npx wrangler d1 create <DATABASE_NAME>` and update the `[[d1_databases]]` section of `wrangler.toml` with the returned info
4. Create the default table in the local database: `yarn run dev:create-tables`
5. Set your environment variables: `cp .dev.vars.example .dev.vars` (this is the private key for one of the addresses listed as a signer on your resolver contract)
6. Install dependencies: `yarn install`
7. Start the dev server: `yarn dev`

## Deploy to Cloudflare

1. Navigate to this directory: `cd worker`
2. Login to Cloudflare: `npx wrangler login`
3. Deploy the Worker: `yarn deploy`
4. Create the default table in the prod database: `yarn run prod:create-tables`
5. Set your environment variable: `echo <PRIVATE_KEY> | npx wrangler secret put PRIVATE_KEY` (this is the private key for one of the addresses listed as a signer on your resolver contract)
