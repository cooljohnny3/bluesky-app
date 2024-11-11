import { Agent, CredentialSession } from '@atproto/api';

function getAgent() {
  console.log('Creating agent');
  if (
    process.env.CLIENT_EMAIL === undefined ||
    process.env.CLIENT_EMAIL === ''
  ) {
    console.error('Missing CLIENT_EMAIL');
    return;
  }
  if (
    process.env.CLIENT_PASSWORD === undefined ||
    process.env.CLIENT_PASSWORD === ''
  ) {
    console.error('Missing CLIENT_PASSWORD');
    return;
  }

  const crednetialManager = new CredentialSession(
    new URL('https://bsky.social')
  );
  crednetialManager.login({
    identifier: process.env.CLIENT_EMAIL,
    password: process.env.CLIENT_PASSWORD,
  });
  return new Agent(crednetialManager);
}

const globalForAgent = global as unknown as { agent: Agent };

export const agent = globalForAgent.agent || getAgent();

if (process.env.NODE_ENV !== 'production') globalForAgent.agent = agent;
