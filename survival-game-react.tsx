import React, { useState, useEffect, useCallback } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const GRID_SIZE = 10;
const CELL_SIZE = 40;
const INITIAL_OPPONENTS = 3;
const MAX_OPPONENTS = 5;
const OPPONENT_MOVE_INTERVAL = 1000;
const ITEM_SPAWN_INTERVAL = 5000;

const Game = () => {
  const [player, setPlayer] = useState({ x: 0, y: 0 });
  const [opponents, setOpponents] = useState([]);
  const [items, setItems] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [opponentMoveInterval, setOpponentMoveInterval] = useState(OPPONENT_MOVE_INTERVAL);

  const playSound = (type) => {
    const audio = new Audio(`/api/placeholder/100/100`);
    audio.play().catch(e => console.error("Error playing sound:", e));
  };

  const initGame = useCallback(() => {
    setPlayer({ x: 0, y: 0 });
    setOpponents(Array(INITIAL_OPPONENTS).fill().map(() => ({
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    })));
    setItems([]);
    setScore(0);
    setGameOver(false);
    setOpponentMoveInterval(OPPONENT_MOVE_INTERVAL);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const movePlayer = useCallback((dx, dy) => {
    if (gameOver) return;
    setPlayer(prev => {
      const newX = Math.max(0, Math.min(GRID_SIZE - 1, prev.x + dx));
      const newY = Math.max(0, Math.min(GRID_SIZE - 1, prev.y + dy));
      playSound('move');
      return { x: newX, y: newY };
    });
  }, [gameOver]);

  const handleKeyDown = useCallback((e) => {
    switch (e.key) {
      case 'ArrowUp': movePlayer(0, -1); break;
      case 'ArrowDown': movePlayer(0, 1); break;
      case 'ArrowLeft': movePlayer(-1, 0); break;
      case 'ArrowRight': movePlayer(1, 0); break;
    }
  }, [movePlayer]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const moveOpponents = useCallback(() => {
    setOpponents(prevOpponents => prevOpponents.map(opp => ({
      x: Math.max(0, Math.min(GRID_SIZE - 1, opp.x + Math.floor(Math.random() * 3) - 1)),
      y: Math.max(0, Math.min(GRID_SIZE - 1, opp.y + Math.floor(Math.random() * 3) - 1))
    })));
  }, []);

  const spawnItem = useCallback(() => {
    setItems(prev => [...prev, {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    }]);
  }, []);

  useEffect(() => {
    if (gameOver) return;

    const opponentInterval = setInterval(moveOpponents, opponentMoveInterval);
    const itemInterval = setInterval(spawnItem, ITEM_SPAWN_INTERVAL);

    return () => {
      clearInterval(opponentInterval);
      clearInterval(itemInterval);
    };
  }, [gameOver, moveOpponents, spawnItem, opponentMoveInterval]);

  useEffect(() => {
    if (opponents.some(opp => opp.x === player.x && opp.y === player.y)) {
      setGameOver(true);
      playSound('gameover');
    }

    setItems(prev => {
      const newItems = prev.filter(item => !(item.x === player.x && item.y === player.y));
      if (newItems.length < prev.length) {
        setScore(s => s + 10);
        playSound('collect');
      }
      return newItems;
    });

    if (score > 0 && score % 50 === 0) {
      setOpponentMoveInterval(prev => Math.max(prev * 0.9, 200));
      if (opponents.length < MAX_OPPONENTS) {
        setOpponents(prev => [...prev, {
          x: Math.floor(Math.random() * GRID_SIZE),
          y: Math.floor(Math.random() * GRID_SIZE)
        }]);
      }
    }
  }, [player, opponents, score]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="mb-4 text-2xl font-bold">Score: {score}</div>
      <svg width={GRID_SIZE * CELL_SIZE} height={GRID_SIZE * CELL_SIZE} className="border border-gray-300">
        {/* Grid */}
        {Array(GRID_SIZE).fill().map((_, i) => (
          <React.Fragment key={i}>
            <line x1={0} y1={i * CELL_SIZE} x2={GRID_SIZE * CELL_SIZE} y2={i * CELL_SIZE} stroke="lightgray" />
            <line x1={i * CELL_SIZE} y1={0} x2={i * CELL_SIZE} y2={GRID_SIZE * CELL_SIZE} stroke="lightgray" />
          </React.Fragment>
        ))}
        {/* Player */}
        <circle cx={player.x * CELL_SIZE + CELL_SIZE / 2} cy={player.y * CELL_SIZE + CELL_SIZE / 2} r={CELL_SIZE / 3} fill="blue" />
        {/* Opponents */}
        {opponents.map((opp, i) => (
          <circle key={i} cx={opp.x * CELL_SIZE + CELL_SIZE / 2} cy={opp.y * CELL_SIZE + CELL_SIZE / 2} r={CELL_SIZE / 3} fill="red" />
        ))}
        {/* Items */}
        {items.map((item, i) => (
          <rect key={i} x={item.x * CELL_SIZE + CELL_SIZE / 4} y={item.y * CELL_SIZE + CELL_SIZE / 4} width={CELL_SIZE / 2} height={CELL_SIZE / 2} fill="gold" />
        ))}
      </svg>
      <div className="mt-4">
        <button onClick={() => movePlayer(0, -1)} className="px-4 py-2 m-1 bg-gray-200 rounded">Up</button>
        <button onClick={() => movePlayer(0, 1)} className="px-4 py-2 m-1 bg-gray-200 rounded">Down</button>
        <button onClick={() => movePlayer(-1, 0)} className="px-4 py-2 m-1 bg-gray-200 rounded">Left</button>
        <button onClick={() => movePlayer(1, 0)} className="px-4 py-2 m-1 bg-gray-200 rounded">Right</button>
      </div>
      <AlertDialog open={gameOver}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Game Over</AlertDialogTitle>
            <AlertDialogDescription>
              Your final score: {score}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={initGame}>Restart</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Game;
