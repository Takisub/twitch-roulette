const express = require("express");
const session = require("express-session");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 3001;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

// ✅ Twitch認証スタート
app.get("/auth/twitch", (req, res) => {
  const redirect = `https://id.twitch.tv/oauth2/authorize?client_id=${process.env.TWITCH_CLIENT_ID}&redirect_uri=${process.env.TWITCH_REDIRECT_URI}&response_type=code&scope=user:read:email`;
  res.redirect(redirect);
});

// ✅ コールバック：トークン取得 → ユーザー情報取得
app.get("/auth/twitch/callback", async (req, res) => {
  const code = req.query.code;

  try {
    // トークン取得
    const tokenRes = await axios.post("https://id.twitch.tv/oauth2/token", null, {
      params: {
        client_id: process.env.TWITCH_CLIENT_ID,
        client_secret: process.env.TWITCH_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: process.env.TWITCH_REDIRECT_URI,
      },
    });

    const { access_token } = tokenRes.data;

    // ユーザー情報取得
    const userRes = await axios.get("https://api.twitch.tv/helix/users", {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Client-Id": process.env.TWITCH_CLIENT_ID,
      },
    });

    const user = userRes.data.data[0];

    // セッション保存
    req.session.user = {
      id: user.id,
      name: user.display_name,
      login: user.login,
      profile_image_url: user.profile_image_url,
    };

    // 認証完了後にフロントへ戻す（リダイレクト先変更可）
    res.redirect("http://localhost:3000");
  } catch (err) {
    console.error("認証エラー:", err);
    res.status(500).send("認証に失敗しました");
  }
});

// ✅ ユーザー情報取得API（フロントから取得用）
app.get("/api/user", (req, res) => {
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.status(401).json({ error: "未ログインです" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ サーバー起動中 http://localhost:${PORT}`);
});
