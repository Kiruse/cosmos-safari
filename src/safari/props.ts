import { getFirestore } from 'firebase-admin/firestore'
import { DAO, getProposals } from '../onchain/props.js'
import safari, { Report } from '../safari.js'
import { timestamp } from '../utils.js';

const lastPropIds: Record<string, number> = {};

export async function getPropsTask() {
  await Promise.all(Object.entries(DAO).map(async ([dao, address]) => {
    const props = await getProposals(address);
    const doc = getFirestore().doc(`daos/${address}`);

    // initialize
    if (!(address in lastPropIds)) {
      const data = (await doc.get()).data();
      lastPropIds[address] = parseInt(data?.lastPropIds ?? 0);
    }

    const newPropCount = props.length - lastPropIds[address];
    if (newPropCount) {
      const newProps = props.filter(prop => prop.id > lastPropIds[address]);
      const reports: Report[] = newProps.map(prop => ({
        title: `New ${dao} Proposal #${prop.id}`,
        category: 'proposal',
        message: `New governance proposal in ${dao}: ${prop.title} (#${prop.id})`,
        logs: [],
      }));
      await safari.report(...reports);
    }

    let logSubmsg: string;
    switch (newPropCount) {
      case 0: logSubmsg = 'no new proposals'; break;
      case 1: logSubmsg = 'a new proposal'; break;
      default: logSubmsg = `${newPropCount} new proposals`; break;
    }

    await doc.set({
      lastPropIds: props[props.length - 1].id,
    }, { merge: true });

    console.log(`[${timestamp()}] ${dao} has ${logSubmsg} (total ${props.length})`);
  }));
}
