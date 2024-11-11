import { Agent, CredentialSession } from '@atproto/api';

if (process.env.CLIENT_EMAIL === undefined || process.env.CLIENT_EMAIL === '') {
  throw new Error('Missing CLIENT_EMAIL');
}
if (
  process.env.CLIENT_PASSWORD === undefined ||
  process.env.CLIENT_PASSWORD === ''
) {
  throw new Error('Missing CLIENT_PASSWORD');
}

let agent: Agent;

console.log('Creating agent');
const crednetialManager = new CredentialSession(new URL('https://bsky.social'));
await crednetialManager.login({
  identifier: process.env.CLIENT_EMAIL,
  password: process.env.CLIENT_PASSWORD,
});

if (process.env.NODE_ENV === 'development') {
  const globalForAgent = global as unknown as { agent?: Agent };
  if (!globalForAgent.agent) {
    globalForAgent.agent = new Agent(crednetialManager);
  }
  agent = globalForAgent.agent;
} else {
  agent = new Agent(crednetialManager);
}

export default agent;
