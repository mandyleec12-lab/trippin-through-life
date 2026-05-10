import React from 'react';
import { BoardGamePage } from '@/pages/games/BoardGamePage';

/**
 * Uses the upgraded game implementation imported from the
 * external project while keeping the existing app shell/routes.
 */
export default function Game() {
  return <BoardGamePage />;
}