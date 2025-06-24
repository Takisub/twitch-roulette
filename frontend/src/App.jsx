import React, { useState } from "react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";

const sampleItems = ["アイテムA", "アイテムB", "アイテムC", "アイテムD"];

export default function App() {
  const [items] = useState(sampleItems);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState("");

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setResult("");

    const spinTime = 3000;
    setTimeout(() => {
      const winner = items[Math.floor(Math.random() * items.length)];
      setResult(winner);
      setIsSpinning(false);
      playSound(winner);
      confetti();
    }, spinTime);
  };

  const playSound = (item) => {
    const audio = new Audio(`/sounds/${item}.mp3`);
    audio.play();
  };

  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center bg-white rounded shadow p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Twitchルーレット</h1>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {items.map((item, index) => (
            <div key={index} className="p-2 border rounded bg-gray-50">
              {item}
            </div>
          ))}
        </div>
        <button
          onClick={spin}
          disabled={isSpinning}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {isSpinning ? "スピン中..." : "ルーレットを回す"}
        </button>

        {result && (
          <motion.div
            className="text-xl font-bold text-green-600 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            🎉 結果: {result} 🎉
          </motion.div>
        )}
      </div>
    </div>
  );
}
