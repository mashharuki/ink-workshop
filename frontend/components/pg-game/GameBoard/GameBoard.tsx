import React, { useEffect } from 'react';
import { useDimensions, useBoard, useGameState } from '../../../hooks/useGameContract';
import { Board } from '../../Board';
import { ConnectWallet } from '../../ConnectWallet';
import { useAudioSettings } from '../../../hooks/useAudioSettings';
import { Settings } from './Settings';
import { PlayerTurnSoundEffect } from '../../Board/PlayerTurnSoundEffect';
import { useGame } from '../../../contexts/GameContext';
import { useTranslation } from 'next-i18next';

export const GameBoard: React.FC = () => {
  const dim = useDimensions();
  const board = useBoard();
  const { status } = useGameState() || {};
  const { trackPlayer, playTrack } = useAudioSettings();
  const { playerTurnEvents } = useGame();
  const { t } = useTranslation('common');

  useEffect(() => {
    if (playTrack && trackPlayer) {
      trackPlayer.play();
    }

    return () => {
      trackPlayer && trackPlayer.stop();
    };
  }, [trackPlayer, playTrack]);

  if (!dim) {
    return (
      <div className="flex items-center justify-center flex-col h-full">
        <h1 className="text-xl">{t('contractNotFound')}</h1>
        <p className="text-md max-w-sm text-center mt-4">{t('contractCheckDesc')}</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full h-screen lg:hidden flex items-center text-center justify-center flex-col">
        <h1>{t('largerScreenDesc')}</h1>
      </div>

      <div className="hidden lg:block">
        {playerTurnEvents.map((turn) => (
          <PlayerTurnSoundEffect key={turn.id} turn={turn} />
        ))}

        <Board boardWidth="80%" board={board} dimensions={dim} className="w-full h-full" status={status} />

        <div className="fixed right-3 bottom-3 max-w-sm z-10">
          <ConnectWallet />
        </div>

        <div className="fixed left-3 bottom-3 z-10">
          <Settings />
        </div>
      </div>
    </>
  );
};
