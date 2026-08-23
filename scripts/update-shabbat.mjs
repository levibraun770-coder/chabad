import { mkdir, writeFile } from "node:fs/promises";

const apiUrl =
  "https://www.hebcal.com/shabbat?cfg=json&geonameid=3181928&M=on&b=20&leyning=off";

const response = await fetch(apiUrl, {
  headers: {
    "User-Agent": "Chabad-of-Bologna-Shabbat-Updater/1.0",
    "Accept": "application/json"
  }
});

if (!response.ok) {
  throw new Error(`Hebcal returned HTTP ${response.status}`);
}

const calendar = await response.json();
const items = Array.isArray(calendar.items) ? calendar.items : [];
const candles = items.find((item) => item.category === "candles");
const parashat = items.find((item) => item.category === "parashat");
const havdalah = items.find((item) => item.category === "havdalah");

if (!candles || !parashat || !havdalah) {
  throw new Error("Hebcal response did not contain complete Shabbat information.");
}

const weeklyData = {
  updatedAt: new Date().toISOString(),
  candles: {
    date: candles.date
  },
  parashat: {
    title: parashat.title,
    date: parashat.date,
    hdate: parashat.hdate
  },
  havdalah: {
    date: havdalah.date
  }
};

await mkdir("data", { recursive: true });
await writeFile(
  "data/shabbat.json",
  JSON.stringify(weeklyData, null, 2) + "\n",
  "utf8"
);

console.log(
  `Prepared ${weeklyData.parashat.title}: ${weeklyData.candles.date} – ${weeklyData.havdalah.date}`
);
