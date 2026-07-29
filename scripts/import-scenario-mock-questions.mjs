import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const questionsDir = "/Users/sherrypan/Library/Mobile Documents/com~apple~CloudDocs/Dutch-A2/questions";
const outputPath = path.join(root, "content", "generated-mock-questions.json");

const chapterFiles = [
  [1, "KNM_Hoofdstuk_1_Nederland_leren_kennen_scenario_simulatievragen_met_antwoorden.md"],
  [2, "KNM_Hoofdstuk_2_oefeningen_met_antwoorden.md"],
  [3, "KNM_Hoofdstuk_3_scenario_simulatievragen_met_antwoorden.md"],
  [4, "KNM_Hoofdstuk_4_Wonen_scenario_simulatievragen_met_antwoorden.md"],
  [5, "KNM_Hoofdstuk_5_Dienstverlening_scenario_simulatievragen_met_antwoorden.md"],
  [6, "KNM_Hoofdstuk_6_Opvoeding_en_onderwijs_scenario_simulatievragen_met_antwoorden.md"],
  [7, "KNM_Hoofdstuk_7_Werken_scenario_simulatievragen_met_antwoorden.md"],
  [8, "KNM_Hoofdstuk_8_Samenleven_scenario_simulatievragen_met_antwoorden.md"],
  [9, "KNM_Hoofdstuk_9_Geschiedenis_scenario_simulatievragen_met_antwoorden.md"],
  [10, "KNM_Hoofdstuk_10_Politiek_scenario_simulatievragen_met_antwoorden.md"],
];

const topicByChapter = {
  1: { id: "nederland-leren-kennen", title: "Nederland leren kennen" },
  2: { id: "de-mensen-in-nederland", title: "De mensen in Nederland" },
  3: { id: "gezondheid-en-gezondheidszorg-in-nederland", title: "Gezondheid en gezondheidszorg in Nederland" },
  4: { id: "wonen-in-nederland", title: "Wonen in Nederland" },
  5: { id: "dienstverlening-in-nederland", title: "Dienstverlening in Nederland" },
  6: { id: "opvoeding-en-onderwijs-in-nederland", title: "Opvoeding en onderwijs in Nederland" },
  7: { id: "werken-in-nederland", title: "Werken in Nederland" },
  8: { id: "samenleven-in-nederland", title: "Samenleven in Nederland" },
  9: { id: "de-geschiedenis-van-nederland", title: "De geschiedenis van Nederland" },
  10: { id: "politiek-in-nederland", title: "Politiek in Nederland" },
};

function stripMarkdown(value) {
  return String(value || "")
    .replace(/\*\*/g, "")
    .replace(/`/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function answerIndex(value) {
  return value.charCodeAt(0) - "A".charCodeAt(0);
}

function parseAnswerTable(markdown) {
  const answers = new Map();
  let tableStarted = false;

  for (const rawLine of markdown.split("\n")) {
    const line = rawLine.trim();
    if (!line.startsWith("|")) {
      if (tableStarted && line.startsWith("#")) break;
      continue;
    }

    tableStarted = true;
    if (line.includes("---")) continue;

    const cells = line
      .split("|")
      .map((cell) => stripMarkdown(cell))
      .filter(Boolean);
    if (cells.length < 2) continue;
    if (/^(nr\.?|vraag)$/i.test(cells[0])) continue;

    const number = Number(cells[0]);
    const answer = cells[1];
    if (!Number.isInteger(number) || !answer) continue;

    answers.set(number, {
      answer,
      explanation: cells[2] || "",
    });
  }

  return answers;
}

function splitQuestionAndAnswerSections(markdown) {
  const answerHeading = markdown.match(/^# Antwoorden(?: en kernpunten)?$/m);
  if (!answerHeading?.index) {
    throw new Error("Could not find answer section.");
  }

  return {
    questionSection: markdown.slice(0, answerHeading.index),
    answerSection: markdown.slice(answerHeading.index),
  };
}

function parseQuestionSection(markdown) {
  const lines = markdown.split("\n");
  const questions = [];
  let current = null;
  let currentPart = "";

  function pushCurrent() {
    if (!current) return;
    current.question = stripMarkdown(current.questionLines.join(" "));
    delete current.questionLines;
    questions.push(current);
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();
    const partMatch = line.match(/^# Deel \d+\s+[–-]\s+(.+)/);
    const questionMatch = line.match(/^###\s+(\d+)\.\s+(.+)/);
    const optionMatch = line.match(/^([A-D])\.\s+(.+?)(?:\s{2,})?$/);

    if (partMatch) {
      currentPart = stripMarkdown(partMatch[1]);
      continue;
    }

    if (questionMatch) {
      pushCurrent();
      current = {
        number: Number(questionMatch[1]),
        questionLines: [questionMatch[2]],
        answers: [],
        part: currentPart,
      };
      continue;
    }

    if (!current) continue;
    if (optionMatch) {
      current.answers.push(stripMarkdown(optionMatch[2]));
      continue;
    }

    if (line && !line.startsWith("#") && !line.startsWith(">") && !line.startsWith("---")) {
      current.questionLines.push(line);
    }
  }

  pushCurrent();
  return questions;
}

function toChoiceQuestion({ chapter, topic, item, answer }) {
  const answerValue = answer.answer;
  const isTruthQuestion = answerValue === "Waar" || answerValue === "Niet waar";
  const answers = isTruthQuestion ? ["Waar", "Niet waar"] : item.answers;
  const correct = isTruthQuestion ? (answerValue === "Waar" ? 0 : 1) : answerIndex(answerValue);

  if (!answers.length) {
    throw new Error(`Question ${chapter}.${item.number} has no answers.`);
  }

  if (!Number.isInteger(correct) || correct < 0 || correct >= answers.length) {
    throw new Error(`Question ${chapter}.${item.number} has invalid answer "${answerValue}".`);
  }

  return {
    id: `scenario-${chapter}-${String(item.number).padStart(3, "0")}`,
    topic: topic.id,
    chapter,
    scenario: item.part ? `Hoofdstuk ${chapter} - ${item.part}` : `Hoofdstuk ${chapter} - ${topic.title}`,
    question: item.question,
    type: "choice",
    answers,
    correct,
    explanation: answer.explanation || `${answerValue}: ${answers[correct]}`,
    source: "原创场景模拟题",
  };
}

function parseChapter(chapter, fileName) {
  const filePath = path.join(questionsDir, fileName);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing source file: ${filePath}`);
  }

  const topic = topicByChapter[chapter];
  const markdown = fs.readFileSync(filePath, "utf8");
  const { questionSection, answerSection } = splitQuestionAndAnswerSections(markdown);
  const questions = parseQuestionSection(questionSection);
  const answers = parseAnswerTable(answerSection);

  const missingAnswers = questions.filter((item) => !answers.has(item.number));
  if (missingAnswers.length) {
    throw new Error(
      `${fileName} is missing answers for: ${missingAnswers.map((item) => item.number).join(", ")}`,
    );
  }

  return questions.map((item) => toChoiceQuestion({ chapter, topic, item, answer: answers.get(item.number) }));
}

const generatedQuestions = chapterFiles.flatMap(([chapter, fileName]) => parseChapter(chapter, fileName));
const ids = new Set(generatedQuestions.map((question) => question.id));

if (ids.size !== generatedQuestions.length) {
  throw new Error("Duplicate generated question ids found.");
}

fs.writeFileSync(outputPath, `${JSON.stringify(generatedQuestions, null, 2)}\n`);

const counts = generatedQuestions.reduce((totals, question) => {
  totals[question.chapter] = (totals[question.chapter] || 0) + 1;
  return totals;
}, {});

console.log(`Imported ${generatedQuestions.length} scenario mock questions.`);
console.log(Object.entries(counts).map(([chapter, count]) => `Hoofdstuk ${chapter}: ${count}`).join("\n"));
