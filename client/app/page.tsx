import PostSection from './postSection';

export default function Home() {
  return (
    <main className="mt-4 flex flex-col gap-4 items-center">
      <PostSection className={'w-full max-w-lg'} />
    </main>
  );
}
