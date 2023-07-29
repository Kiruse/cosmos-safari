import { DateTime } from 'luxon';
import type { Proposal, ProposalsResponse } from '../types.js'
import { getSmartQuery } from '../utils.js'

const BATCH_SIZE = 50;

export const DAO = Object.freeze({
  LionDAO: 'terra17c6ts8grcfrgquhj3haclg44le8s7qkx6l2yx33acguxhpf000xqhnl3je',
  pixeLionsDAO: 'terra1exj6fxvrg6xuukgx4l90ujg3vh6420540mdr6scrj62u2shk33sqnp0stl',
});

export async function getProposals(daoAddress: string) {
  let props: Proposal[] = [];
  let curr: ProposalsResponse[] = [];
  let batch = 0;

  do {
    const res = await getSmartQuery<{ proposals: ProposalsResponse[]}>(daoAddress, {
      proposals: {
        limit: BATCH_SIZE,
        start_after: batch * BATCH_SIZE,
      }
    });
    const data = (await res.json()) as {data: { proposals: ProposalsResponse[] }};
    curr = data.data.proposals;
    props.push(...curr.map(fromResponse));
    batch++;
  } while (curr.length === BATCH_SIZE);
  return props.sort((a, b) => a.id - b.id);
}

function fromResponse(response: ProposalsResponse): Proposal {
  return {
    id: parseInt(response.proposal.id+''),
    title: response.proposal.title,
    description: response.proposal.description,
    type: response.proposal.proposal_type,
    status: response.proposal.status,
    startedAt: timestamp(response.proposal.started_at),
    expires: timestamp(response.proposal.expires.at_time),
    actions: response.proposal.proposal_actions,
  }
}

/** Parse an on-chain timestamp into a Luxon DateTime object. Assumes timestamp is in nanoseconds
 * (for whatever reason they need such precision on a frickin' blockchain).
 */
function timestamp(raw: string) {
  if (!/^\d+$/.test(raw)) throw new Error(`Invalid timestamp: ${raw}`);
  return DateTime.fromMillis(Number(BigInt(raw) / 1000000n));
}
