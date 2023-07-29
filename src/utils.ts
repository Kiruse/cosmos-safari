import { toBase64, toUtf8 } from '@cosmjs/encoding'
import { DateTime } from 'luxon'

export const zip = <L, R>(lhs: L[], rhs: R[]) => lhs.map((l, i) => [l, rhs[i]] as [L, R]);

export async function getSmartQuery<T>(address: string, query: any) {
  const { default: fetch } = await import('node-fetch');
  query = toBase64(toUtf8(JSON.stringify(query)));
  return await fetch(`https://phoenix-lcd.terra.dev/cosmwasm/wasm/v1/contract/${address}/smart/${query}`);
}

export const timestamp = () => DateTime.now().toISO();
