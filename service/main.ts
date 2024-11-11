import { ScheduledPost } from "./types/post";
import { Agent, CredentialSession, RichText } from "@atproto/api";
import * as mariadb from 'mariadb';

async function getConnetion() {
    if (!process.env.MYSQL_HOST) {
        throw new Error('Missing MYSQL_HOST');
    }

    if (!process.env.MYSQL_USER) {
        throw new Error('Missing MYSQL_USER');
    }

    if (!process.env.MYSQL_PASSWORD) {
        throw new Error('Missing MYSQL_PASSWORD');
    }

    if (!process.env.MYSQL_DATABASE) {
        throw new Error('Missing MYSQL_DATABASE');
    }

    return await mariadb.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
    });

}

async function getAgent() {
    if (process.env.CLIENT_EMAIL === undefined || process.env.CLIENT_EMAIL === '') {
        throw new Error('Missing CLIENT_EMAIL');
    }
    if (
        process.env.CLIENT_PASSWORD === undefined ||
        process.env.CLIENT_PASSWORD === ''
    ) {
        throw new Error('Missing CLIENT_PASSWORD');
    }

    console.log('Creating agent');
    const crednetialManager = new CredentialSession(new URL('https://bsky.social'));
    await crednetialManager.login({
        identifier: process.env.CLIENT_EMAIL,
        password: process.env.CLIENT_PASSWORD,
    });

    return new Agent(crednetialManager);
}


async function getPosts(connection: mariadb.Connection): Promise<ScheduledPost[]> {
    try {
        return await connection.query<ScheduledPost[]>(
            'SELECT * FROM POSTS WHERE SENT=false AND POST_DATE <= DATE(NOW())'
        );
    } catch (e) {
        console.log(e);
        throw new Error('Failed to get posts');
    }
}

async function sendPost(agent: Agent, connection: mariadb.Connection, { postId, text, postDate }: {
    postId: string;
    text: string;
    postDate: Date;
}) {
    const rt = new RichText({ text });
    await rt.detectFacets(agent);
    const newPost = {
        $type: 'app.bsky.feed.post',
        text: rt.text,
        facets: rt.facets,
        createdAt: postDate.toISOString(),
    };

    try {
        console.log(`Sending post with id: ${postId}`);
        await agent.post(newPost);
        return await connection.query<ScheduledPost>(
            'UPDATE POSTS SET SENT=true WHERE POST_ID=?', [postId]
        );
    } catch (e) {
        console.log(e);
        throw new Error('Failed to send post');
    }
}

(async () => {
    let connection;
    let agent;
    try {
        connection = await getConnetion();
        const postsToSend = await getPosts(connection);
        if (postsToSend.length === 0) {
            return;
        }
        agent = await getAgent();
        for (let i = 0; i < postsToSend.length; i++) {
            const postToSend = postsToSend[i];
            await sendPost(agent, connection, { postId: postToSend.POST_ID, text: postToSend.TEXT, postDate: postToSend.POST_DATE });
        }
    } catch (e) {
        console.log(e);
    } finally {
        if (connection) {
            connection.end();
        }
    }
})();
