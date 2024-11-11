'use client';

import createPost from '@/actions/create-post';
import { useState } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');

  return (
    <main className="mt-4 flex flex-col gap-4 items-center">
      <div className="w-full max-w-lg flex flex-col justify-center items-center gap-4">
        <textarea
          className="w-4/5 border border-black"
          rows={4}
          value={text}
          onChange={(newText) => setText(newText.target.value)}
        />
        <button
          className="px-2 py-1 bg-neutral-300 border border-black rounded-sm cursor-pointer hover:bg-neutral-400"
          onClick={async () => {
            setLoading(true);
            await createPost({ text });
            setText('');
            setLoading(false);
          }}
          disabled={loading}
        >
          Submit
        </button>
      </div>
    </main>
  );
}
