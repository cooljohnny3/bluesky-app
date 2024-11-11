'use server';

import { agent } from '@/lib/api';

interface CreatePostPayload {
  text: string;
  postDate?: Date;
}

export default async function createPost({ text }: CreatePostPayload) {
  agent.post({
    text,
  });
}
