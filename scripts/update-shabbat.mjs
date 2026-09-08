import { mkdir, readFile, writeFile } from "node:fs/promises";

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
const holiday = parashat
  ? null
  : items.find(
      (item) => item.category === "holiday" && !/^Erev\b/i.test(item.title || "")
    );
const havdalah = items.find((item) => item.category === "havdalah");

if (!candles || !havdalah || (!parashat && !holiday)) {
  throw new Error("Hebcal response did not contain complete Shabbat information.");
}

const scheduleData = {
  candles: {
    date: candles.date
  },
  parashat: parashat
    ? {
        title: parashat.title,
        date: parashat.date,
        hdate: parashat.hdate
      }
    : null,
  havdalah: {
    date: havdalah.date
  }
};

if (holiday) {
  scheduleData.holiday = {
    title: holiday.title,
    date: holiday.date,
    hdate: holiday.hdate
  };
}

let previousData = null;
try {
  previousData = JSON.parse(await readFile("data/shabbat.json", "utf8"));
} catch {
  // The file may not exist on the first run.
}

const comparableData = (data) => JSON.stringify({
  candles: data?.candles || null,
  parashat: data?.parashat || null,
  holiday: data?.holiday || null,
  havdalah: data?.havdalah || null
});

const unchanged = previousData && comparableData(previousData) === comparableData(scheduleData);
const weeklyData = {
  updatedAt: unchanged && previousData.updatedAt
    ? previousData.updatedAt
    : new Date().toISOString(),
  ...scheduleData
};

await mkdir("data", { recursive: true });
await writeFile(
  "data/shabbat.json",
  JSON.stringify(weeklyData, null, 2) + "\n",
  "utf8"
);

console.log(
  `Prepared ${weeklyData.parashat?.title || weeklyData.holiday?.title}: ${weeklyData.candles.date} – ${weeklyData.havdalah.date}`
);
