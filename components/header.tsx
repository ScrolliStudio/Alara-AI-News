import { cn } from '@/lib/utils';
import React from 'react';
import HistoryContainer from './history-container';
import LoginButton from './login-button';
import { ModeToggle } from './mode-toggle';
import { IconLogo } from './ui/icons';

export const Header: React.FC = async () => {
  return (
    <header className="fixed w-full p-1 md:p-2 flex justify-between items-center z-10 backdrop-blur md:backdrop-blur-none bg-background/80 md:bg-transparent border-b">
      <div>
        <a href="/">
          <IconLogo />
          <span className="sr-only">Alara AI News</span>
        </a>
      </div>
      <div className="flex gap-0.5">
        <ModeToggle />
        <LoginButton />
        <HistoryContainer location="header" />
      </div>
    </header>
  );
};

export default Header;
