import { mkdir, readFile, writeFile } from "node:fs/promises";

const timeZone = "Europe/Rome";

function dateKey(dateValue) {
  return String(dateValue || "").slice(0, 10);
}

function nextFridayKey(now) {
  if (process.env.SHABBAT_DATE) {
    return process.env.SHABBAT_DATE;
  }

  const parts = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone
  }).formatToParts(now);
  const values = Object.fromEntries(
    parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value])
  );
  const romeDate = new Date(
    Date.UTC(Number(values.year), Number(values.month) - 1, Number(values.day), 12)
  );
  const daysUntilFriday = (5 - romeDate.getUTCDay() + 7) % 7;
  romeDate.setUTCDate(romeDate.getUTCDate() + daysUntilFriday);
  return romeDate.toISOString().slice(0, 10);
}

const targetFriday = nextFridayKey(new Date());
const apiUrl = new URL("https://www.hebcal.com/shabbat");
apiUrl.search = new URLSearchParams({
  cfg: "json",
  geonameid: "3181928",
  M: "on",
  b: "20",
  leyning: "off",
  dt: targetFriday
}).toString();

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
const candles = items.find(
  (item) => item.category === "candles" && dateKey(item.date) === targetFriday
);
const havdalah = items.find(
  (item) => item.category === "havdalah" && dateKey(item.date) >= targetFriday
);

if (!candles || !havdalah) {
  throw new Error("Hebcal response did not contain the coming Friday and ending times.");
}

const endingDate = dateKey(havdalah.date);
const parashat = items.find(
  (item) => item.category === "parashat" &&
    dateKey(item.date) >= targetFriday &&
    dateKey(item.date) <= endingDate
);
const holiday = items.find(
  (item) => item.category === "holiday" &&
    item.yomtov === true &&
    !/^Erev\b/i.test(item.title || "") &&
    dateKey(item.date) >= targetFriday &&
    dateKey(item.date) <= endingDate
);

if (!parashat && !holiday) {
  throw new Error("Hebcal response did not contain a parashah or Yom Tov for the coming Friday.");
}

const additionalCandles = items
  .filter(
    (item) => item.category === "candles" &&
      dateKey(item.date) > targetFriday &&
      dateKey(item.date) < endingDate
  )
  .map((item) => ({ date: item.date }));

const scheduleData = {
  targetFriday,
  candles: {
    date: candles.date
  },
  additionalCandles,
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
  targetFriday: data?.targetFriday || null,
  candles: data?.candles || null,
  additionalCandles: data?.additionalCandles || [],
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
  `Prepared ${weeklyData.holiday?.title || weeklyData.parashat?.title}: ${weeklyData.candles.date} - ${weeklyData.havdalah.date}`
);
