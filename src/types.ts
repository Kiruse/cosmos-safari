import type { DateTime } from 'luxon'

export type Log = {

}

export type Proposal = {
  id: number;
  type: string;
  status: string;
  title: string;
  description: string;
  startedAt: DateTime;
  expires: DateTime;
  actions: ProposalAction[];
}

export type ProposalsResponse = {
  proposal: RawProposal;
  proposal_status: string;
  results: Vote[];
  total_votes_available: string; // bigint
}

export type RawProposal = {
  proposal_type: string;
  id: number | string;
  proposer: string; // ignore, it's not accurate
  title: string;
  description: string;
  status: string; // in_progress, rejected, ...
  started_at: string; // nanoseconds timestamp
  expires: Expiration;
  proposal_actions: ProposalAction[];
}

export type Vote = [VoteType, string]; // type, total voting power
export enum VoteType {
  Yes,
  No,
  Abstain,
  Veto,
};

// TODO: are there more types of expiration?
export type Expiration = {
  at_time: string; // nanoseconds timestamp
};

export type ProposalAction = any; // not sure what this data is yet...
