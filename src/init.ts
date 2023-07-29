import { Expo } from 'expo-server-sdk'
import { cert, initializeApp } from 'firebase-admin/app'
import * as fs from 'fs/promises'
import keytar from 'keytar'

async function getConfigParam(name: string) {
  let value: any = process.env[name];
  if (!value) {
    value = await keytar.getPassword('cosmos-safari', name);
  }
  if (!value) throw Error(`Missing config parameter: ${name}`);
  return value as string;
}

async function getFirebaseCredentials() {
  let value = await getConfigParam('FIREBASE_SECRET');
  if (!value.startsWith('{')) {
    return cert(JSON.parse(await fs.readFile(value, 'utf-8')));
  } else {
    return cert(JSON.parse(value));
  }
}

const expo = new Expo({
  accessToken: await getConfigParam('EXPO_SECRET'),
});

const firebase = initializeApp({
  credential: await getFirebaseCredentials(),
});

export default { expo, firebase };
