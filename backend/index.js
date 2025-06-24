const express = require("express");
const tmi = require("tmi.js");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Twitchチャネル情報
const CHANNEL_NAME = "あなたのチャンネル名をここに";

// TMIクライアント設定
const client = new tmi.Client({
  channels: [CHANNEL_NAME]
});

client.connect().catch(console.error);

let rouletteRunning = false;

client.on("message", (channel, tags, message, self) => {
  if(self) return;

  // チャンネルポイント利用やスタンプの判定はTwitch EventSubやPubSubでやるのが正解ですが、
  // ここではチャットで「!start」と「!stop」のコマンドで代用します。
  
  if(message === "!start" && !rouletteRunning){
    rouletteRunning = true;
    console.log("ルーレットスタート！");
    // 必要に応じてフロントに通知等の処理を追加
  }
  if(message === "!stop" && rouletteRunning){
    rouletteRunning = false;
    console.log("ルーレットストップ！");
    // 必要に応じてフロントに通知等の処理を追加
  }
});

app.get("/", (req, res) => {
  res.send("Twitch Roulette Backend Running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
