import type { Expo, ExpoPushMessage } from 'expo-server-sdk'
import { getFirestore } from 'firebase-admin/firestore'
import { Err, Ok, Result } from '../results.js';
import type { Report, Reporter } from '../safari.js'
import { timestamp, zip } from '../utils.js';

export type PushMessage = Omit<ExpoPushMessage, 'to'>;

async function getPushTokens(): Promise<string[]> {
  const tokens = await getFirestore().collection('users').get();
  return [...new Set(tokens.docs.map(doc => doc.data().pushToken))];
}

export class ExpoPushReporter implements Reporter {
  constructor(private expo: Expo) {}

  async report(reports: Report[]) {
    const msgs: PushMessage[] = reports.map(report => ({
      title: report.title,
      body: report.message,
      // currently, we only hve one channel: 'default'
      // channelId: category,
      priority: 'high',
    }));

    try {
      await broadcast(this.expo, msgs);
      return Ok();
    } catch (err: any) {
      return Err(err as Error);
    }
  }
}

/** Broadcast the same message to all users */
export async function broadcast(expo: Expo, messages: Omit<ExpoPushMessage, 'to'>[]) {
  const tokens = await getPushTokens();
  const msgs: ExpoPushMessage[] = tokens.filter(Boolean).flatMap(token => messages.map(msg => ({ ...msg, to: token })));

  const chunks = expo.chunkPushNotifications(msgs);
  console.info(`[${timestamp()}] We have ${chunks.length} ExpoPushMessage chunks`);
  for (let i = 0; i < chunks.length; ++i) {
    const chunk = chunks[i];
    console.info(`[${timestamp()}] Sending ExpoPushMessage chunk ${i} consisting of ${chunk.length} messages`)
    try {
      const tickets = await expo.sendPushNotificationsAsync(chunk);
      console.info(`Sent chunk ${i}`);

      const failures = zip(chunk, tickets)
        .filter(([msg, ticket]) => ticket.status !== 'ok')
        .map(([msg, ticket]) => ({ msg, ticket }));
      if (failures.length) {
        console.error(`[${timestamp()}] We have ${failures.length} failures in chunk ${i}`);
        // TODO: re-schedule failed messages?
      }
    } catch (err: any) {
      console.error(`[${timestamp()}] Failed sending chunk ${i}:`, err);
    }
  }
}
