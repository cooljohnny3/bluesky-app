import { Agent, CredentialSession } from '@atproto/api';

const globalForAgent = global as unknown as { agent: Agent };

export async function getAgent() {
  if (globalForAgent.agent) {
    return globalForAgent.agent;
  }

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
  await crednetialManager.login({
    identifier: process.env.CLIENT_EMAIL,
    password: process.env.CLIENT_PASSWORD,
  });

  const agent = new Agent(crednetialManager);
  if (process.env.NODE_ENV !== 'production') {
    globalForAgent.agent = agent;
  }
  return agent;
}
