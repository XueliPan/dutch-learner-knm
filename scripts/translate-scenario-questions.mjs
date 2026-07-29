import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const questionsPath = path.join(root, "content", "generated-mock-questions.json");
const translationsPath = path.join(root, "content", "scenario-question-translations.json");
const batchSize = 25;
const separator = "\n<<<KNM_TRANSLATION_SEPARATOR>>>\n";
const retryDelayMs = 20000;
let useMyMemoryOnly = false;

const overrides = {
  Waar: "正确 / 是",
  "Niet waar": "错误 / 不是",
  "Azië": "亚洲",
  Europa: "欧洲",
  Afrika: "非洲",
  "Zuid-Amerika": "南美洲",
  Nederland: "荷兰",
  Duitsland: "德国",
  België: "比利时",
  Frankrijk: "法国",
  Engeland: "英格兰",
  Denemarken: "丹麦",
  Zwitserland: "瑞士",
  Noordzee: "北海",
  Oostzee: "波罗的海",
  "Middellandse Zee": "地中海",
  "Zwarte Zee": "黑海",
  Amsterdam: "阿姆斯特丹",
  Rotterdam: "鹿特丹",
  "Den Haag": "海牙",
  Utrecht: "乌得勒支",
  MBO: "中等职业教育",
  HBO: "高等职业教育",
  VWO: "大学预科教育",
  HAVO: "高级中等普通教育",
  VMBO: "预备中等职业教育",
  UWV: "雇员保险局",
  IND: "移民与归化局",
  DigiD: "DigiD 数字身份",
  BSN: "公民服务号码",
  "Cao": "集体劳动协议",
  cao: "集体劳动协议",
};

function readJson(filePath, fallback) {
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function translatedText(payload) {
  return (payload?.[0] || [])
    .map((segment) => segment?.[0] || "")
    .join("")
    .trim();
}

function shouldKeepSource(text) {
  return /^[0-9\s.,–-]+$/.test(text);
}

async function translateBatch(texts) {
  const query = texts.join(separator);
  const params = new URLSearchParams({
    client: "gtx",
    sl: "nl",
    tl: "zh-CN",
    dt: "t",
    q: query,
  });
  const response = await fetch("https://translate.googleapis.com/translate_a/single", {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: params,
  });

  if (!response.ok) {
    throw new Error(`Translation request failed: ${response.status} ${response.statusText}`);
  }

  const translated = translatedText(await response.json());
  const parts = translated.split("<<<KNM_TRANSLATION_SEPARATOR>>>");
  if (parts.length !== texts.length) {
    throw new Error(`Expected ${texts.length} translations, received ${parts.length}.`);
  }

  return parts.map((part) => part.trim());
}

async function translateWithMyMemory(text) {
  if (shouldKeepSource(text)) return text;

  const params = new URLSearchParams({
    langpair: "nl|zh-CN",
    q: text,
  });
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    const response = await fetch(`https://api.mymemory.translated.net/get?${params.toString()}`);

    if (response.status === 429 && attempt < 5) {
      const delay = 30000 * attempt;
      console.log(`MyMemory rate limited; waiting ${Math.round(delay / 1000)}s.`);
      await wait(delay);
      continue;
    }

    if (!response.ok) {
      throw new Error(`MyMemory request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (data.quotaFinished) {
      throw new Error("MyMemory quota finished.");
    }

    return String(data.responseData?.translatedText || text).trim();
  }

  throw new Error("MyMemory retry loop exhausted.");
}

async function translateBatchWithMyMemory(texts) {
  const translated = [];
  for (const text of texts) {
    translated.push(await translateWithMyMemory(text));
    await wait(600);
  }
  return translated;
}

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function translateBatchWithRetry(texts) {
  if (useMyMemoryOnly) return translateBatchWithMyMemory(texts);

  for (let attempt = 1; attempt <= 6; attempt += 1) {
    try {
      return await translateBatch(texts);
    } catch (error) {
      if (String(error.message).includes("429") && attempt >= 3) {
        console.log("Google is still rate limited; using MyMemory fallback for this batch.");
        useMyMemoryOnly = true;
        return translateBatchWithMyMemory(texts);
      }
      if (!String(error.message).includes("429") || attempt === 6) throw error;
      const delay = retryDelayMs * attempt;
      console.log(`Rate limited; waiting ${Math.round(delay / 1000)}s before retry ${attempt + 1}.`);
      await wait(delay);
    }
  }
  throw new Error("Translation retry loop exhausted.");
}

function collectTexts(questions) {
  const values = new Set();
  questions.forEach((question) => {
    if (question.source !== "原创场景模拟题") return;
    values.add(question.question);
    (question.answers || []).forEach((answer) => values.add(answer));
  });
  return [...values].filter(Boolean);
}

const questions = readJson(questionsPath, []);
const cache = { ...readJson(translationsPath, {}), ...overrides };
const texts = collectTexts(questions);
texts.forEach((text) => {
  if (!cache[text] && shouldKeepSource(text)) cache[text] = text;
});
const missing = texts.filter((text) => !cache[text]);

console.log(`Translation cache has ${Object.keys(cache).length} entries.`);
console.log(`Found ${texts.length} unique source strings; ${missing.length} missing translations.`);

for (let index = 0; index < missing.length; index += batchSize) {
  const batch = missing.slice(index, index + batchSize);
  const translated = await translateBatchWithRetry(batch);
  batch.forEach((source, offset) => {
    cache[source] = translated[offset];
  });
  writeJson(translationsPath, cache);
  console.log(`Translated ${Math.min(index + batch.length, missing.length)} / ${missing.length}`);
}

writeJson(translationsPath, cache);
console.log(`Saved ${Object.keys(cache).length} translations to ${path.relative(root, translationsPath)}.`);
