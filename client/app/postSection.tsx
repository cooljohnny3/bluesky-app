'use client';

import createPost from '@/actions/create-post';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import clsx from 'clsx';
import { add, isBefore } from 'date-fns';
import { useState } from 'react';

interface PostSectionProps {
  className?: string | null;
}

function PostSection({ className }: PostSectionProps) {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');
  const [postDate, setPostDate] = useState<Date | null>(null);

  const tomorrow = add(new Date(), { days: 1 });

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
      <div className="flex items-center gap-4">
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            disablePast
            value={postDate}
            onOpen={() => {
              if (postDate === null) {
                setPostDate(tomorrow);
              }
            }}
            onChange={(newDate) => setPostDate(newDate)}
          />
        </LocalizationProvider>
        {postDate && (
          <div
            className="text-blue-500 cursor-pointer"
            onClick={() => setPostDate(null)}
          >
            Clear
          </div>
        )}
        <button
          className="h-fit px-2 py-1 bg-neutral-300 border border-black rounded-sm cursor-pointer hover:bg-neutral-400 disabled:cursor-auto disabled:bg-neutral-200 disabled:text-neutral-400"
          onClick={async () => {
            setLoading(true);
            try {
              await createPost({ text, postDate });
              setText('');
              setPostDate(null);
            } finally {
              setLoading(false);
            }
          }}
          disabled={
            loading ||
            text.length === 0 ||
            (postDate !== null && isBefore(postDate, new Date()))
          }
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default PostSection;
