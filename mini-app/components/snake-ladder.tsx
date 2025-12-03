"use client";

import { useState } from "react";
import { Button } from "./ui/button";

const BOARD_SIZE = 10;
const TOTAL_CELLS = BOARD_SIZE * BOARD_SIZE;

// Each cell can be a money spot, danger zone, or prize
const CELL_TYPES = [
  { type: "fire", value: 0.5, color: "bg-red-500" },
  { type: "water", value: 1, color: "bg-blue-500" },
  { type: "earth", value: -50, color: "bg-green-500" },
  { type: "air", value: 200, color: "bg-indigo-500" },
];

function getCellType(index: number) {
  // Simple deterministic pattern: every 5th cell is danger, every 7th is prize, rest are bitcoin
  if ((index + 1) % 5 === 0) return CELL_TYPES[2];
  if ((index + 1) % 7 === 0) return CELL_TYPES[3];
  return CELL_TYPES[0];
}

export function SnakeLadder() {
  const [position, setPosition] = useState(1);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");

  const rollDice = () => {
    const roll = Math.floor(Math.random() * 6) + 1;
    let newPos = position + roll;
    if (newPos > TOTAL_CELLS) newPos = position; // stay if overshoot

    const cell = getCellType(newPos - 1);
    let newScore = score + cell.value;
    let msg = `You landed on a ${cell.type} spot! ${cell.value > 0 ? "You earned" : "You lost"} ${Math.abs(cell.value)}.`;

    setPosition(newPos);
    setScore(newScore);
    setMessage(msg);
  };

  const resetGame = () => {
    setPosition(1);
    setScore(0);
    setMessage("");
  };

  const renderCell = (cellNumber: number) => {
    const cell = getCellType(cellNumber - 1);
    return (
      <div
        key={cellNumber}
        className={`flex items-center justify-center border h-12 w-12 text-xs ${cell.color} ${cellNumber === position ? "border-2 border-black" : ""}`}
      >
        {cellNumber}
        {cell.type === "earth" && <span className="text-sm">🌍</span>}
        {cell.type === "air" && <span className="text-sm">🌬️</span>}
        {cell.type === "fire" && <span className="text-sm">🔥</span>}
        {cell.type === "water" && <span className="text-sm">🌊</span>}
      </div>
    );
  };

  const boardRows = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    const start = row * BOARD_SIZE + 1;
    const end = start + BOARD_SIZE - 1;
    const rowCells = Array.from({ length: BOARD_SIZE }, (_, i) => {
      const cellNumber = row % 2 === 0 ? end - i : start + i;
      return renderCell(cellNumber);
    });
    boardRows.push(
      <div key={row} className="flex">
        {rowCells}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-10 gap-1">{boardRows}</div>
      <div className="flex flex-col items-center gap-2">
        <Button onClick={rollDice}>Roll Dice</Button>
        <Button variant="outline" onClick={resetGame}>
          Reset Game
        </Button>
        <p className="text-sm">Score: {score}</p>
        {message && <p className="text-sm">{message}</p>}
      </div>
    </div>
  );
}
