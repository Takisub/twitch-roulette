import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import confetti from "canvas-confetti";

const sampleItems = ["アイテムA", "アイテムB", "アイテムC", "アイテムD"];

export default function TwitchRouletteApp() {
  const [items, setItems] = useState(sampleItems);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState("");
  const [theme, setTheme] = useState("default");
  const [history, setHistory] = useState([]);
  const [angle, setAngle] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setResult("");

    const spinTime = 3000;
    const spins = 5;
    const selectedIndex = Math.floor(Math.random() * items.length);
    const anglePerItem = 360 / items.length;
    const targetAngle = 360 * spins + anglePerItem * selectedIndex;
    setAngle(targetAngle);

    setTimeout(() => {
      const winner = items[selectedIndex];
      setResult(winner);
      setHistory((prev) => [...prev, { time: new Date(), winner }]);
      setIsSpinning(false);
      playSound(winner);
      confetti();
    }, spinTime);
  };

  const playSound = (winner) => {
    const audio = new Audio(`/sounds/${winner}.mp3`);
    audio.play().catch((e) => console.log("Audio error", e));
  };

  const handleItemChange = (index, value) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, "新しい景品"]);
  };

  const removeItem = (index) => {
    if (items.length <= 2) return;
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  return (
    <div
      className={`min-h-screen p-4 flex flex-col items-center justify-center bg-${theme}`}
    >
      <Card className="w-full max-w-xl text-center">
        <CardContent className="space-y-4">
          <h1 className="text-2xl font-bold">Twitch ルーレット</h1>

          <div className="relative w-64 h-64 mx-auto">
            <motion.div
              className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-gray-300"
              animate={{ rotate: angle }}
              transition={{ duration: 3, ease: "easeInOut" }}
              style={{ transformOrigin: "50% 50%" }}
            >
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-full h-full flex flex-wrap">
                  {items.map((item, index) => (
                    <div
                      key={index}
                      className="w-1/2 h-1/2 flex items-center justify-center border border-white text-sm text-center bg-green-100"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full z-10"></div>
          </div>

          <Button onClick={spin} disabled={isSpinning} className="mt-4">
            {isSpinning ? "スピン中..." : "ルーレットを回す"}
          </Button>

          {result && (
            <motion.div
              className="text-xl font-bold text-green-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              🎉 結果: {result} 🎉
            </motion.div>
          )}

          <Button
            onClick={() => setShowSettings((prev) => !prev)}
            className="mt-4"
            variant="outline"
          >
            {showSettings ? "設定を隠す" : "ルーレット設定を表示"}
          </Button>

          {showSettings && (
            <div className="space-y-2 mt-2">
              {items.map((item, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    className="border p-1 rounded w-full"
                    value={item}
                    onChange={(e) => handleItemChange(index, e.target.value)}
                  />
                  <Button
                    onClick={() => removeItem(index)}
                    variant="destructive"
                    size="sm"
                  >
                    削除
                  </Button>
                </div>
              ))}
              <Button onClick={addItem} size="sm">
                + 景品を追加
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-8 w-full max-w-xl">
        <h2 className="font-semibold mb-2">履歴</h2>
        <ul className="space-y-1">
          {history.map((entry, idx) => (
            <li key={idx} className="text-sm text-gray-600">
              {entry.time.toLocaleTimeString()} - {entry.winner}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
