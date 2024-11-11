'use server';

import agent from '@/lib/api';
import pool from '@/lib/db';
import { AppBskyFeedPost, RichText } from '@atproto/api';

interface CreatePostPayload {
  text: string;
  postDate?: Date | null;
}

export default async function createPost({
  text,
  postDate,
}: CreatePostPayload) {
  const rt = new RichText({ text });
  await rt.detectFacets(agent);
  const newPost = {
    $type: 'app.bsky.feed.post',
    text: rt.text,
    facets: rt.facets,
    createdAt: postDate?.toISOString() || new Date().toISOString(),
  };
  const res = AppBskyFeedPost.validateRecord(newPost);
  if (!res.success) {
    throw new Error('Invalid post: ' + res.error);
  }

  let conn;
  try {
    conn = await pool.getConnection();
    let result;
    if (postDate) {
      result = await conn.query(
        'INSERT INTO POSTS (TEXT, POST_DATE) VALUES (?, ?)',
        [text, postDate]
      );
    } else {
      // await agent.post(newPost);
      const postText = JSON.stringify(newPost);
      console.log(postText, postText.length);
      result = await conn.query(
        'INSERT INTO POSTS (TYPE, TEXT, POST_DATE, SENT) VALUES (?, ?, ?, ?)',
        [newPost.$type, text, postDate, true]
      );
    }
    if (result.affectedRows === 0) {
      throw new Error('No rows updated');
    }
  } catch (e) {
    console.log(e);
    throw new Error('Failed to process post');
  } finally {
    if (conn) {
      conn.release();
    }
  }
}
