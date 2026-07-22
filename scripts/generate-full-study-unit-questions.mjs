import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const contentDataPath = path.join(root, "content-data.js");
const outputPath = path.join(root, "content", "full-study-unit-questions.json");

function stripText(value) {
  return String(value || "")
    .replace(/`/g, "")
    .replace(/\*\*/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function hasChinese(value) {
  return /[\u3400-\u9fff]/.test(value);
}

function hasDutchLetters(value) {
  return /[A-Za-zÀ-ÿ]/.test(value);
}

function normalizeOption(value) {
  return stripText(value)
    .toLowerCase()
    .replace(/[.,;:!?()[\]"']/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function splitDutchChinese(value) {
  const text = stripText(value);
  if (!text) return "";
  const fullColon = text.split("：")[0]?.trim();
  if (fullColon && hasDutchLetters(fullColon) && !hasChinese(fullColon)) return fullColon;
  const pipe = text.split("｜")[0]?.trim();
  if (pipe && hasDutchLetters(pipe) && !hasChinese(pipe)) return pipe;
  const firstChinese = text.search(/[\u3400-\u9fff]/);
  if (firstChinese > 0) {
    const prefix = text.slice(0, firstChinese).replace(/[，。、；：]+$/g, "").trim();
    if (prefix && hasDutchLetters(prefix) && !hasChinese(prefix)) return prefix;
  }
  if (hasDutchLetters(text) && !hasChinese(text)) return text;
  return "";
}

function dutchPhrasesFromMixedText(value) {
  const text = stripText(value);
  if (!hasDutchLetters(text)) return [];
  return [...text.matchAll(/[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ0-9'’.-]*(?:\s+(?:en|of|de|het|een|van|voor|bij|met|zonder|naar|in|op|te|tot|uit|aan|over|der|[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ0-9'’.-]*)){0,5}/g)]
    .map((match) => cleanCandidate(match[0]))
    .filter((phrase) => phrase.length >= 5 && phrase.length <= 90)
    .filter((phrase) => !/^(bij|met|zonder|naar|voor|over|oude|moderne)$/i.test(phrase));
}

function dutchFromRow(headers, row) {
  const sentenceIndex = headers.findIndex((header) => /zin|句子|uitleg|verklaring/i.test(header));
  const preferred = sentenceIndex >= 0 ? splitDutchChinese(row[sentenceIndex]) : "";
  if (preferred) return preferred;

  const firstDutch = row.map(splitDutchChinese).find((cell) => cell && cell.length > 2) || "";
  if (!firstDutch) return "";

  const dateIndex = headers.findIndex((header) => /datum|日期/i.test(header));
  if (dateIndex >= 0 && row[dateIndex]) return `${firstDutch}: ${stripText(row[dateIndex])}.`;
  return firstDutch;
}

function collectCandidates(unit) {
  const candidates = [];

  for (const block of unit.blocks || []) {
    if (block.type === "paragraph" || block.type === "quote") {
      const text = splitDutchChinese(block.text);
      if (text) candidates.push(text);
      if (!text) candidates.push(...dutchPhrasesFromMixedText(block.text));
    }

    if (block.type === "list" || block.type === "orderedList") {
      for (const item of block.items || []) {
        const text = splitDutchChinese(item);
        if (text) candidates.push(text);
      }
    }

    if (block.type === "table") {
      for (const row of block.rows || []) {
        const text = dutchFromRow(block.headers || [], row);
        if (text) candidates.push(text);
      }
    }
  }

  return candidates.map(cleanCandidate).filter(isGoodCandidate);
}

function cleanCandidate(value) {
  return stripText(value)
    .replace(/\s+([.,;:!?])/g, "$1")
    .replace(/\.$/, "")
    .trim();
}

function isGoodCandidate(value) {
  if (!value || value.length < 4 || value.length > 150) return false;
  if (!hasDutchLetters(value)) return false;
  if (hasChinese(value)) return false;
  if (/^(voorbeeld|中文|原句|记忆|角色|流程|常见活动)$/i.test(value)) return false;
  return true;
}

function scoreCandidate(candidate, unitTitle) {
  const value = candidate.toLowerCase();
  const titleWords = stripText(unitTitle)
    .toLowerCase()
    .split(/[^a-zà-ÿ0-9]+/i)
    .filter((word) => word.length >= 4);
  let score = 0;
  if (/[.!?]$/.test(candidate)) score += 4;
  if (/\b(is|zijn|heeft|moet|mag|kan|kun|krijgt|betaalt|gaat|komt|heet|wonen|werken)\b/i.test(candidate)) score += 6;
  if (candidate.length >= 18 && candidate.length <= 90) score += 6;
  score += titleWords.filter((word) => value.includes(word)).length * 5;
  if (/^de |^het |^een /i.test(candidate)) score -= 3;
  if (candidate.includes("/") || candidate.includes("=")) score -= 2;
  return score;
}

function bestCandidate(unit) {
  const candidates = collectCandidates(unit);
  if (!candidates.length) return stripText(unit.title);
  return candidates.sort((a, b) => scoreCandidate(b, unit.title) - scoreCandidate(a, unit.title))[0];
}

function hash(value) {
  return [...value].reduce((total, char) => (total * 31 + char.charCodeAt(0)) >>> 0, 2166136261);
}

function rotate(items, seed) {
  if (!items.length) return items;
  const start = seed % items.length;
  return [...items.slice(start), ...items.slice(0, start)];
}

function chooseDistractors(allUnits, currentUnitKey, correct, seed) {
  const correctKey = normalizeOption(correct);
  const sameTopic = allUnits.filter((item) => item.topicId === currentUnitKey.topicId && item.unitKey !== currentUnitKey.unitKey);
  const others = allUnits.filter((item) => item.topicId !== currentUnitKey.topicId);
  const pool = [...rotate(sameTopic, seed), ...rotate(others, seed + 7)]
    .map((item) => item.correctStatement)
    .filter((item) => normalizeOption(item) !== correctKey);

  const seen = new Set([correctKey]);
  const distractors = [];
  for (const item of pool) {
    const key = normalizeOption(item);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    distractors.push(item);
    if (distractors.length === 3) break;
  }
  return distractors;
}

function optionsWithCorrect(correct, distractors, seed) {
  const answers = [...distractors.slice(0, 3)];
  const correctIndex = seed % (answers.length + 1);
  answers.splice(correctIndex, 0, correct);
  return { answers, correct: correctIndex };
}

function displayUnitTitle(unit, partTitle) {
  const title = stripText(unit.title);
  if (title && title !== "本部分重点") return title;
  return stripText(partTitle).replace(/^第.+?部分：/, "") || title || "dit kennispunt";
}

function flattenUnits(topics) {
  return topics.flatMap((topic) =>
    (topic.fullStudy?.parts || []).flatMap((part, partIndex) =>
      (part.units || []).map((unit) => {
        const unitKey = `h${topic.chapter}-p${partIndex + 1}-u${unit.number}`;
        return {
          unitKey,
          topicId: topic.id,
          topicTitle: topic.title,
          chapter: topic.chapter,
          partTitle: part.title,
          unit,
          correctStatement: bestCandidate(unit),
        };
      }),
    ),
  );
}

function validateQuestions(questions, expectedUnitCount) {
  const ids = new Set();
  const unitKeys = new Set();
  const errors = [];

  for (const question of questions) {
    if (ids.has(question.id)) errors.push(`Duplicate id: ${question.id}`);
    ids.add(question.id);
    unitKeys.add(question.unitKey);
    if (question.type !== "choice") errors.push(`${question.id} is not a choice question`);
    if (!Array.isArray(question.answers) || question.answers.length < 3 || question.answers.length > 4) {
      errors.push(`${question.id} has ${question.answers?.length || 0} answers`);
    }
    if (!Number.isInteger(question.correct) || question.correct < 0 || question.correct >= question.answers.length) {
      errors.push(`${question.id} has invalid correct index`);
    }
    const uniqueAnswers = new Set(question.answers.map(normalizeOption));
    if (uniqueAnswers.size !== question.answers.length) errors.push(`${question.id} has duplicate answers`);
  }

  if (unitKeys.size !== expectedUnitCount) {
    errors.push(`Expected ${expectedUnitCount} unit questions, found ${unitKeys.size}`);
  }

  if (errors.length) {
    throw new Error(`Full-study unit question validation failed:\n${errors.join("\n")}`);
  }
}

const { KNM_CONTENT } = await import(`${pathToFileURL(contentDataPath).href}?v=${Date.now()}`);
const units = flattenUnits(KNM_CONTENT.topics);
const unitByKey = new Map(units.map((item) => [item.unitKey, item]));

const questions = units.map((item) => {
  const seed = hash(item.unitKey);
  const distractors = chooseDistractors(units, item, item.correctStatement, seed);
  const { answers, correct } = optionsWithCorrect(item.correctStatement, distractors, seed);
  return {
    id: `fullstudy-${item.unitKey}`,
    topic: item.topicId,
    chapter: item.chapter,
    unitKey: item.unitKey,
    scenario: `完整学习页 - Hoofdstuk ${item.chapter}: ${item.topicTitle}`,
    question: `Welke uitspraak past het best bij "${displayUnitTitle(item.unit, item.partTitle)}"?`,
    type: "choice",
    answers,
    correct,
    explanation: `对应知识点：Hoofdstuk ${item.chapter} - ${stripText(item.partTitle)} - ${stripText(item.unit.title)}。正确说法：${item.correctStatement}.`,
    source: "Full study unit question",
  };
});

validateQuestions(questions, unitByKey.size);
fs.writeFileSync(outputPath, `${JSON.stringify(questions, null, 2)}\n`);

console.log(`Generated ${questions.length} full-study unit questions at ${path.relative(root, outputPath)}.`);
