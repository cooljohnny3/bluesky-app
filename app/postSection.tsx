'use client';

import createPost from '@/actions/create-post';
import clsx from 'clsx';
import { useState } from 'react';

interface PostSectionProps {
  className?: string | null;
}

function PostSection({ className }: PostSectionProps) {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');

  return (
    <div
      className={clsx(
        'flex flex-col justify-center items-center gap-4',
        className
      )}
    >
      <textarea
        className="w-4/5 border border-black resize-none"
        rows={4}
        value={text}
        onChange={(newText) => setText(newText.target.value)}
      />
      <button
        className="h-fit px-2 py-1 bg-neutral-300 border border-black rounded-sm cursor-pointer hover:bg-neutral-400 disabled:cursor-auto disabled:bg-neutral-200 disabled:text-neutral-400"
        onClick={async () => {
          setLoading(true);
          try {
            await createPost({ text });
            setText('');
          } finally {
            setLoading(false);
          }
        }}
        disabled={loading || text.length === 0}
      >
        Submit
      </button>
    </div>
  );
}

export default PostSection;
