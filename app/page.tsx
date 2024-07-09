import { Chat } from '@/components/chat';
import { nanoid } from 'ai';
import { AI } from './actions';
import Image from 'next/image';

export const maxDuration = 60;

export default function Page() {
  const id = nanoid();
  return (
    <div>
      <div className="flex justify-center items-center pt-16 p-2">
        <Image
          src={'/banner.png'}
          alt="logo"
          width={672}
          height={150}
          className="rounded-lg shadow-md "
        />
      </div>

      <div className="mt-10">
        <AI initialAIState={{ chatId: id, messages: [] }}>
          <Chat id={id} />
        </AI>
      </div>
    </div>
  );
}
