import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const notesPath =
  "/Users/sherrypan/Library/Mobile Documents/com~apple~CloudDocs/Dutch-A2/knm/KNM-study-notes.zh-CN.md";
const questionsPath =
  "/Users/sherrypan/Library/Mobile Documents/com~apple~CloudDocs/Dutch-A2/knm/KNM-practice-questions.zh-CN.md";
const outputPath = path.join(root, "content-data.js");

const notes = fs.readFileSync(notesPath, "utf8");
const practice = fs.readFileSync(questionsPath, "utf8");

const colorSet = ["#0f766e", "#2d6cdf", "#c2413d", "#e0a928", "#6f5cc2", "#138a45", "#d25f27", "#8b5d33", "#2f6f8f", "#8a4f93"];

function slugify(title) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function splitChapters(markdown) {
  const matches = [...markdown.matchAll(/^## Hoofdstuk (\d+) - (.+)$/gm)];
  return matches.map((match, index) => {
    const start = match.index;
    const end = matches[index + 1]?.index ?? markdown.length;
    return {
      number: Number(match[1]),
      title: match[2].trim(),
      body: markdown.slice(start, end).trim(),
    };
  });
}

function getSection(body, heading) {
  const lines = body.split("\n");
  const headingPattern = new RegExp(`^### ${heading}$`);
  const start = lines.findIndex((line) => headingPattern.test(line.trim()));
  if (start === -1) return "";

  const collected = [];
  for (let index = start + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (/^#{2,3} /.test(line.trim())) break;
    collected.push(line);
  }
  return collected.join("\n").trim();
}

function paragraphs(text) {
  return text
    .split(/\n{2,}/)
    .map((item) => item.replace(/\n/g, " ").trim())
    .filter(Boolean);
}

function bullets(text) {
  return text
    .split("\n")
    .map((line) => line.replace(/^- /, "").trim())
    .filter((line) => line && !line.startsWith("|"));
}

function parseVocabulary(section, topicId, topicTitle) {
  return section
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("|") && !line.includes("---"))
    .slice(1)
    .map((line) => line.split("|").map((cell) => cell.trim()).filter(Boolean))
    .filter((cells) => cells.length >= 2)
    .map((cells) => ({
      word: stripMarkdown(cells[0]),
      meaning: stripMarkdown(cells[1]),
      example: stripMarkdown(cells[2] || ""),
      note: stripMarkdown(cells[3] || ""),
      importance: stripMarkdown(cells[4] || ""),
      topic: topicTitle,
      topicId,
    }));
}

function stripMarkdown(text) {
  return text.replace(/`/g, "").replace(/\*\*/g, "").trim();
}

function parseNumberedQuestions(section) {
  const lines = section.split("\n");
  const items = [];
  let current = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    const questionMatch = line.match(/^(\d+)\.\s+(.+)/);
    const optionMatch = line.match(/^([A-D])\.\s+(.+?)(?:\s{2,})?$/);

    if (questionMatch) {
      if (current) items.push(current);
      current = {
        number: Number(questionMatch[1]),
        question: stripMarkdown(questionMatch[2]),
        options: [],
      };
    } else if (current && optionMatch) {
      current.options.push(stripMarkdown(optionMatch[2]));
    } else if (current && line) {
      current.question = `${current.question} ${stripMarkdown(line)}`;
    }
  }

  if (current) items.push(current);
  return items;
}

function parseAnswers(section) {
  const answers = new Map();
  for (const rawLine of section.split("\n")) {
    const line = rawLine.trim();
    const match = line.match(/^(\d+)\.\s+(.+)/);
    if (!match) continue;
    const number = Number(match[1]);
    const text = stripMarkdown(match[2]);
    const first = text[0];
    const letter = first?.match(/[A-D]/) ? first : null;
    const truth = first === "对" ? true : first === "错" ? false : null;
    const shortAnswer = !letter && truth === null ? text.split(/[。.!]/)[0].trim() : "";
    answers.set(number, {
      text,
      letter,
      truth,
      shortAnswer,
    });
  }
  return answers;
}

function parseQuestions(markdown, lessonByChapter) {
  const chapters = splitChapters(markdown);
  const allQuestions = [];

  for (const chapter of chapters) {
    const lesson = lessonByChapter.get(chapter.number);
    if (!lesson) continue;
    const dutchQuestions = parseNumberedQuestions(getSection(chapter.body, "1\\. Nederlandse vragen"));
    const answerMap = parseAnswers(getSection(chapter.body, "3\\. 答案与解释"));

    for (const item of dutchQuestions) {
      const answer = answerMap.get(item.number);
      if (!answer) continue;

      const base = {
        id: `${lesson.id}-${item.number}`,
        topic: lesson.id,
        chapter: chapter.number,
        scenario: `Hoofdstuk ${chapter.number} - ${lesson.title}`,
        question: item.question,
        explanation: answer.text,
      };

      if (item.options.length) {
        allQuestions.push({
          ...base,
          type: "choice",
          answers: item.options,
          correct: answer.letter ? answer.letter.charCodeAt(0) - 65 : 0,
        });
      } else if (item.question.toLowerCase().startsWith("waar of niet waar")) {
        allQuestions.push({
          ...base,
          type: "choice",
          answers: ["Waar", "Niet waar"],
          correct: answer.truth ? 0 : 1,
        });
      } else {
        allQuestions.push({
          ...base,
          type: "short",
          answers: [],
          correctText: answer.shortAnswer,
          accepted: answer.shortAnswer ? [answer.shortAnswer.toLowerCase()] : [],
        });
      }
    }
  }

  return allQuestions;
}

function parseReviewPlan(markdown) {
  const start = markdown.indexOf("## 7 天复习计划");
  const section = start === -1 ? "" : markdown.slice(start);
  return section
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("|") && !line.includes("---"))
    .slice(1)
    .map((line) => line.split("|").map((cell) => cell.trim()).filter(Boolean))
    .filter((cells) => cells.length >= 2)
    .map((cells) => ({ day: cells[0], task: cells[1] }));
}

const noteChapters = splitChapters(notes);
const topics = noteChapters.map((chapter, index) => {
  const id = slugify(chapter.title);
  const vocab = parseVocabulary(getSection(chapter.body, "词汇表"), id, chapter.title);
  return {
    id,
    chapter: chapter.number,
    title: chapter.title,
    zhTitle: chapter.title,
    color: colorSet[index % colorSet.length],
    summary: paragraphs(getSection(chapter.body, "中文解释"))[0] || "",
    explanation: paragraphs(getSection(chapter.body, "中文解释")),
    examPoints: bullets(getSection(chapter.body, "考试重点")),
    lifeTips: bullets(getSection(chapter.body, "荷兰生活常识")),
    confusing: bullets(getSection(chapter.body, "容易混淆")),
    keywords: vocab.map((item) => item.word).slice(0, 8),
    vocabulary: vocab,
  };
});

const lessonByChapter = new Map(topics.map((topic) => [topic.chapter, topic]));
const questions = parseQuestions(practice, lessonByChapter);
const words = topics.flatMap((topic) => topic.vocabulary);
const reviewPlan = parseReviewPlan(notes);

const output = `export const KNM_CONTENT = ${JSON.stringify({ topics, questions, words, reviewPlan }, null, 2)};\n`;
fs.writeFileSync(outputPath, output);

console.log(`Imported ${topics.length} topics, ${questions.length} questions, ${words.length} vocabulary items.`);
