'use server';

import { getAgent } from '@/lib/api';
import { AppBskyFeedPost } from '@atproto/api';

interface CreatePostPayload {
  text: string;
}

export default async function createPost({ text }: CreatePostPayload) {
  const agent = await getAgent();
  if (!agent) {
    throw new Error('User is not initlized');
  }

  const newPost = {
    $type: 'app.bsky.feed.post',
    text: text,
    createdAt: new Date().toISOString(),
  };
  if (AppBskyFeedPost.isRecord(newPost)) {
    const res = AppBskyFeedPost.validateRecord(newPost);
    if (res.success) {
      await agent.post(newPost);
    } else {
      throw new Error('Invalid post: ' + res.error);
    }
  } else {
    throw new Error('Invalid post');
  }
}
