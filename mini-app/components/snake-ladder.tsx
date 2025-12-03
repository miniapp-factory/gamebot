"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";

const BOARD_SIZE = 10;
const TOTAL_CELLS = BOARD_SIZE * BOARD_SIZE;

// Define some snakes and ladders with elemental themes
const ELEMENTS = [
  { name: "Fire", color: "bg-red-500" },
  { name: "Water", color: "bg-blue-500" },
  { name: "Earth", color: "bg-green-500" },
  { name: "Air", color: "bg-yellow-500" },
];

const snakes = [
  { from: 16, to: 6 },
  { from: 48, to: 30 },
  { from: 62, to: 19 },
  { from: 88, to: 24 },
];

const ladders = [
  { from: 3, to: 22 },
  { from: 5, to: 8 },
  { from: 11, to: 26 },
  { from: 20, to: 29 },
];

function getElementColor(index: number) {
  return ELEMENTS[index % ELEMENTS.length].color;
}

export function SnakeLadder() {
  const [position, setPosition] = useState(1);
  const [dice, setDice] = useState(0);
  const [message, setMessage] = useState("");

  const rollDice = () => {
    const roll = Math.floor(Math.random() * 6) + 1;
    setDice(roll);
    let newPos = position + roll;
    if (newPos > TOTAL_CELLS) {
      newPos = position; // stay in place if overshoot
    } else {
      // check for snakes or ladders
      const snake = snakes.find((s) => s.from === newPos);
      const ladder = ladders.find((l) => l.from === newPos);
      if (snake) {
        newPos = snake.to;
        setMessage(`Oh no! You landed on a ${ELEMENTS[snake.from % ELEMENTS.length].name} snake!`);
      } else if (ladder) {
        newPos = ladder.to;
        setMessage(`Great! You climbed a ${ELEMENTS[ladder.from % ELEMENTS.length].name} ladder!`);
      } else {
        setMessage("");
      }
    }
    setPosition(newPos);
  };

  const resetGame = () => {
    setPosition(1);
    setDice(0);
    setMessage("");
  };

  const renderCell = (cell: number) => {
    const isSnake = snakes.some((s) => s.from === cell);
    const isLadder = ladders.some((l) => l.from === cell);
    const isCurrent = cell === position;
    const elementColor = getElementColor(cell);
    return (
      <div
        key={cell}
        className={`flex items-center justify-center border h-12 w-12 text-xs ${elementColor} ${isCurrent ? "border-2 border-black" : ""}`}
      >
        {cell}
        {isSnake && <span className="text-sm">🐍</span>}
        {isLadder && <span className="text-sm">🪜</span>}
      </div>
    );
  };

  const boardRows = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    const cells = [];
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
        <Button onClick={rollDice}>Roll Dice ({dice})</Button>
        <Button variant="outline" onClick={resetGame}>
          Reset Game
        </Button>
        {message && <p className="text-sm">{message}</p>}
      </div>
    </div>
  );
}
