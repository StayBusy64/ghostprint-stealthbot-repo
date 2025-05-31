// commentbot.js
const fs = require("fs");
const path = require("path");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const config = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(config);

const VIDEO_FILE = "Videos.txt";
const COMMENT_FILE = "Comments.txt";

async function generateComment(title) {
  const prompt = `Write a short, engaging YouTube comment that sounds like a real user reacting to a video titled: "${title}"`;

  const res = await openai.createCompletion({
    model: "text-davinci-003",
    prompt,
    max_tokens: 40,
    temperature: 0.75,
  });

  return res.data.choices[0].text.trim();
}

async function injectComments() {
  const videos = fs.readFileSync(path.resolve(__dirname, VIDEO_FILE), "utf-8").split("\n").filter(Boolean);
  const outStream = fs.createWriteStream(COMMENT_FILE, { flags: "a" });

  for (const url of videos) {
    const videoTitle = url.split("v=")[1] || url;
    const comment = await generateComment(videoTitle);
    outStream.write(`${url} -> ${comment}\n`);
    console.log(`[Commented] ${url} => "${comment}"`);
  }

  outStream.end();
}

injectComments().catch(err => {
  console.error("[CommentBot] Error:", err.message);
  process.exit(1);
});
