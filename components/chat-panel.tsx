'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { AI, UIState } from '@/app/actions';
import { useUIState, useActions, useAIState } from 'ai/rsc';
import { cn } from '@/lib/utils';
import { UserMessage } from './user-message';
import { Button } from './ui/button';
import { ArrowRight, Plus, Podcast } from 'lucide-react';
import { EmptyScreen } from './empty-screen';
import Textarea from 'react-textarea-autosize';
import { nanoid } from 'ai';
import { useAppState } from '@/lib/utils/app-state';

interface ChatPanelProps {
  messages: UIState;
  query?: string;
}

export function ChatPanel({ messages, query }: ChatPanelProps) {
  const [input, setInput] = useState('');
  const [showEmptyScreen, setShowEmptyScreen] = useState(false);
  const [, setMessages] = useUIState<typeof AI>();
  const [aiMessage] = useAIState<typeof AI>();
  const { isGenerating, setIsGenerating } = useAppState();
  const { submit } = useActions();
  const router = useRouter();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isFirstRender = useRef(true); // For development environment

  async function handleQuerySubmit(query: string, formData?: FormData) {
    setInput(query);
    setIsGenerating(true);

    // Add user message to UI state
    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: nanoid(),
        component: <UserMessage message={query} />,
      },
    ]);

    // Submit and get response message
    const data = formData || new FormData();
    if (!formData) {
      data.append('input', query);
    }
    const responseMessage = await submit(data);
    setMessages((currentMessages) => [...currentMessages, responseMessage]);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await handleQuerySubmit(input, formData);
  };

  // if query is not empty, submit the query
  useEffect(() => {
    if (isFirstRender.current && query && query.trim().length > 0) {
      handleQuerySubmit(query);
      isFirstRender.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    const lastMessage = aiMessage.messages.slice(-1)[0];
    if (lastMessage?.type === 'followup') {
      setIsGenerating(false);
    }
  }, [aiMessage, setIsGenerating]);

  // Clear messages
  const handleClear = () => {
    setIsGenerating(false);
    router.push('/');
  };

  useEffect(() => {
    // focus on input when the page loads
    inputRef.current?.focus();
  }, []);

  // If there are messages and the new button has not been pressed, display the new Button
  if (messages.length > 0) {
    return (
      <div className="fixed bottom-2 md:bottom-8 left-0 right-0 flex justify-center items-center mx-auto pointer-events-none">
        <div className="inline-flex justify-center items-center gap-2">
          <Button
            type="button"
            variant={'secondary'}
            className="rounded-full bg-secondary/80 group transition-all hover:scale-105 pointer-events-auto"
            onClick={() => handleClear()}
          >
            <span className="text-sm mr-2 group-hover:block hidden animate-in fade-in duration-300">
              Yeni
            </span>
            <Plus size={18} className="group-hover:rotate-90 transition-all" />
          </Button>

          <Button
            type="button"
            variant={'default'}
            className="rounded-full hover:scale-105 pointer-events-auto transition-all relative"
          >
            <span className="text-sm mr-2 block">Podcast&apos;e çevir</span>
            <Podcast size={18} className="group-hover:rotate-90 transition-all" />
            <span className="px-2 py-0 bg-neutral-500 absolute -top-1 text-[.5rem] leading-3 rounded-full bg-[#0000fe] font-semibold dark:text-white">
              YAKINDA
            </span>
          </Button>
        </div>
      </div>
    );
  }

  if (query && query.trim().length > 0) {
    return null;
  }

  return (
    <div
      className={
        'fixed bottom-8 left-0 right-0 top-12 mx-auto h-screen flex flex-col items-center justify-center'
      }
    >
      <form onSubmit={handleSubmit} className="max-w-2xl w-full px-2 mt-64">
        <div className="relative flex items-center w-full">
          <Textarea
            ref={inputRef}
            name="input"
            rows={1}
            maxRows={5}
            tabIndex={0}
            placeholder="Her şeyi sorabilirsiniz..."
            spellCheck={false}
            value={input}
            className="resize-none w-full min-h-12 rounded-full bg-white/30 backdrop-blur-sm border border-white/10 pl-4 pr-10 pt-3 pb-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-100 shadow-lg"
            onChange={(e) => {
              setInput(e.target.value);
              setShowEmptyScreen(e.target.value.length === 0);
            }}
            onKeyDown={(e) => {
              // Enter should submit the form
              if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                // Prevent the default action to avoid adding a new line
                if (input.trim().length === 0) {
                  e.preventDefault();
                  return;
                }
                e.preventDefault();
                const textarea = e.target as HTMLTextAreaElement;
                textarea.form?.requestSubmit();
              }
            }}
            onHeightChange={(height) => {
              // Ensure inputRef.current is defined
              if (!inputRef.current) return;

              // The initial height and left padding is 70px and 2rem
              const initialHeight = 70;
              // The initial border radius is 32px
              const initialBorder = 32;
              // The height is incremented by multiples of 20px
              const multiple = (height - initialHeight) / 20;

              // Decrease the border radius by 4px for each 20px height increase
              const newBorder = initialBorder - 4 * multiple;
              // The lowest border radius will be 8px
              inputRef.current.style.borderRadius = Math.max(8, newBorder) + 'px';
            }}
            onFocus={() => setShowEmptyScreen(true)}
            onBlur={() => setShowEmptyScreen(false)}
          />
          <Button
            type="submit"
            size={'icon'}
            variant={'ghost'}
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            disabled={input.length === 0}
          >
            <ArrowRight size={20} />
          </Button>
        </div>
        <EmptyScreen
          submitMessage={(message) => {
            setInput(message);
          }}
          className={cn(showEmptyScreen ? 'visible' : 'invisible')}
        />
      </form>
      <iframe
        src="https://my.spline.design/nexbotrobotcharacterconcept-683ef88c9ba798b61413588b4d67c4d7/"
        frameBorder="0"
        width="100%"
        height="100%"
        className="bg-white dark:bg-neutral-950"
        style={{ flex: 1, border: 'none', marginBottom: '0px' }}
      ></iframe>
    </div>
  );
}
