import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const notesPath =
  "/Users/sherrypan/Library/Mobile Documents/com~apple~CloudDocs/Dutch-A2/knm/KNM-study-notes.zh-CN.md";
const questionsPath =
  "/Users/sherrypan/Library/Mobile Documents/com~apple~CloudDocs/Dutch-A2/knm/KNM-practice-questions.zh-CN.md";
const guidePath = "/Users/sherrypan/Downloads/KNM_study_guide_CN_NL.md";
const duoQuestionsPath = path.join(root, "content", "duo-practice-questions.json");
const generatedQuestionsPath = path.join(root, "content", "generated-mock-questions.json");
const outputPath = path.join(root, "content-data.js");

const notes = fs.readFileSync(notesPath, "utf8");
const practice = fs.readFileSync(questionsPath, "utf8");
const guide = fs.existsSync(guidePath) ? fs.readFileSync(guidePath, "utf8") : "";

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
  return text.replace(/`/g, "").replace(/\*\*/g, "").replace(/<[^>]+>/g, "").trim();
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

function choiceQuestionFromShortAnswer(base, answer, lesson) {
  const correctText = answer.shortAnswer || answer.text.split(/[。.!]/)[0].trim();
  const topicDistractors = {
    "nederland-leren-kennen": ["dijk", "provincie"],
    "de-mensen-in-nederland": ["buurman", "collega"],
    "wonen-in-nederland": ["huurcontract", "woningcorporatie"],
    "werken-in-nederland": ["salaris", "vacature"],
    "gezondheid-en-gezondheidszorg-in-nederland": ["huisarts", "apotheek"],
    "opvoeding-en-onderwijs-in-nederland": ["basisschool", "diploma"],
    "politiek-in-nederland": ["gemeenteraad", "parlement"],
    "dienstverlening-in-nederland": ["DigiD", "gemeente"],
    "samenleven-in-nederland": ["vrijwilliger", "vereniging"],
    "de-geschiedenis-van-nederland": ["koning", "grondwet"],
  };
  const distractors = topicDistractors[lesson.id] || ["gemeente", "provincie"];
  const incorrect = distractors.filter((item) => item.toLowerCase() !== correctText.toLowerCase()).slice(0, 2);
  const correct = ([...base.id].reduce((total, char) => total + char.charCodeAt(0), 0) + 1) % 3;
  const answers = [...incorrect];
  answers.splice(correct, 0, correctText);
  return {
    ...base,
    type: "choice",
    answers,
    correct,
  };
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
        allQuestions.push(choiceQuestionFromShortAnswer(base, answer, lesson));
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

function readJsonArray(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  if (!Array.isArray(data)) {
    throw new Error(`${filePath} must contain a JSON array.`);
  }
  return data;
}

function splitGuideChapters(markdown) {
  if (!markdown) return [];
  const matches = [...markdown.matchAll(/^# Hoofdstuk (\d+) [–-] (.+?)(?:｜(.+))?$/gm)];
  return matches.map((match, index) => {
    const start = match.index;
    const end = matches[index + 1]?.index ?? markdown.indexOf("\n# 综合词汇表", start);
    return {
      number: Number(match[1]),
      title: stripMarkdown(match[2]),
      zhTitle: stripMarkdown(match[3] || match[2]),
      body: markdown.slice(start, end === -1 ? markdown.length : end).trim(),
    };
  });
}

function getTopLevelSection(markdown, heading, nextHeadingPattern = /^# /m) {
  if (!markdown) return "";
  const start = markdown.search(new RegExp(`^# ${heading}$`, "m"));
  if (start === -1) return "";
  const section = markdown.slice(start);
  const next = section.slice(1).search(nextHeadingPattern);
  return next === -1 ? section.trim() : section.slice(0, next + 1).trim();
}

function parseGuideAnswers(section) {
  const details = section.includes("<details>") ? section.slice(section.indexOf("<details>")) : section;
  const answers = new Map();
  for (const rawLine of details.split("\n")) {
    const line = rawLine.trim();
    const match = line.match(/^(\d+)\.\s+\*\*([A-C])\*\*\s*[—-]\s*(.+)$/);
    if (!match) continue;
    answers.set(Number(match[1]), {
      letter: match[2],
      explanation: stripMarkdown(match[3]),
    });
  }
  return answers;
}

function parseGuideChoiceQuestions(section, { idPrefix, topicId, chapter = null, scenario, source }) {
  const questionPart = section.split("<details>")[0] || "";
  const matches = [...questionPart.matchAll(/^\*\*(\d+)\.\s+(.+?)\*\*$/gm)];
  const answerMap = parseGuideAnswers(section);
  return matches.flatMap((match, index) => {
    const number = Number(match[1]);
    const start = match.index + match[0].length;
    const end = matches[index + 1]?.index ?? questionPart.length;
    const options = questionPart
      .slice(start, end)
      .split("\n")
      .map((line) => line.trim())
      .map((line) => line.match(/^-\s+([A-C])\.\s+(.+)$/))
      .filter(Boolean)
      .map((option) => stripMarkdown(option[2]));
    const answer = answerMap.get(number);
    if (!answer || options.length < 2) return [];
    return {
      id: `${idPrefix}-${number}`,
      topic: topicId,
      chapter,
      scenario,
      question: stripMarkdown(match[2]),
      type: "choice",
      answers: options,
      correct: answer.letter.charCodeAt(0) - 65,
      explanation: `${answer.letter} — ${answer.explanation}`,
      source,
    };
  });
}

function inferGuideTopic(text) {
  const value = text.toLowerCase();
  if (/(hoofdstad|den haag|rotterdam|dijk|duin|zee|polder|verenigde naties|wilhelmus|belgië)/.test(value)) return "nederland-leren-kennen";
  if (/(koningsdag|dodenherdenking|bevrijdingsdag|beterschap|gecondoleerd|ov-chipkaart|inchecken)/.test(value)) return "de-mensen-in-nederland";
  if (/(huisarts|specialist|recept|basisverzekering|zorgtoeslag|doktersafspraak|gezond)/.test(value)) return "gezondheid-en-gezondheidszorg-in-nederland";
  if (/(huur|woning|makelaar|grofvuil|afval|kwijtschelding|statiegeld)/.test(value)) return "wonen-in-nederland";
  if (/(ind|digid|bsn|belastingdienst|rijbewijs|verblijfsvergunning|gemeente)/.test(value)) return "dienstverlening-in-nederland";
  if (/(school|leerplicht|vmbo|mbo|havo|vwo|kinderopvang|consultatiebureau)/.test(value)) return "opvoeding-en-onderwijs-in-nederland";
  if (/(sollicitatie|salaris|werk|uwv|baan|nett|bruto)/.test(value)) return "werken-in-nederland";
  if (/(trouwen|vrouwen|mannen|discriminatie|geweld|respect)/.test(value)) return "samenleven-in-nederland";
  if (/(tachtigjarige|willem|oranje|gouden eeuw|oorlog|deltawerken|5 mei|4 mei)/.test(value)) return "de-geschiedenis-van-nederland";
  if (/(tweede kamer|eerste kamer|kiesrecht|oppositie|grondwet|rechter|minister|parlement)/.test(value)) return "politiek-in-nederland";
  return "nederland-leren-kennen";
}

function parseGuideChapterQuestions(markdown, lessonByChapter) {
  return splitGuideChapters(markdown).flatMap((chapter) => {
    const lesson = lessonByChapter.get(chapter.number);
    const section = getSection(chapter.body, "本章练习");
    if (!lesson || !section) return [];
    return parseGuideChoiceQuestions(section, {
      idPrefix: `guide-h${chapter.number}`,
      topicId: lesson.id,
      chapter: chapter.number,
      scenario: `KNM 学习手册 - Hoofdstuk ${chapter.number}: ${lesson.title}`,
      source: "KNM study guide chapter practice",
    });
  });
}

function parseGuideMockQuestions(markdown) {
  const section = getTopLevelSection(markdown, "综合模拟题", /^## 考前一页速记/m);
  const questions = parseGuideChoiceQuestions(section, {
    idPrefix: "guide-mock",
    topicId: "nederland-leren-kennen",
    scenario: "KNM 学习手册 - 综合模拟题",
    source: "KNM study guide mock",
  });
  return questions.map((question) => ({
    ...question,
    topic: inferGuideTopic(`${question.question} ${(question.answers || []).join(" ")}`),
  }));
}

function normalizeWord(value) {
  return stripMarkdown(value)
    .toLowerCase()
    .replace(/^(de|het|een)\s+/, "")
    .replace(/[()]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function dedupeWords(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = normalizeWord(item.word);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function parseGuideChapterWords(markdown, lessonByChapter) {
  return splitGuideChapters(markdown).flatMap((chapter) => {
    const lesson = lessonByChapter.get(chapter.number);
    if (!lesson) return [];
    return parseVocabulary(getSection(chapter.body, "高频词汇"), lesson.id, lesson.title).map((item) => ({
      ...item,
      source: "KNM study guide chapter vocabulary",
    }));
  });
}

function parseGuideComprehensiveWords(markdown) {
  const section = getTopLevelSection(markdown, "综合词汇表", /^# 高频语法与连接词/m);
  const categoryTopicMap = {
    "地理、社会与公共服务": "dienstverlening-in-nederland",
    "礼仪、交流与日常生活": "de-mensen-in-nederland",
    "居留、住房、税费与保险": "wonen-in-nederland",
    "工作与职业": "werken-in-nederland",
    "家庭、教育与社会关系": "opvoeding-en-onderwijs-in-nederland",
    "政治、法律与民主": "politiek-in-nederland",
    "历史": "de-geschiedenis-van-nederland",
    "金融、医疗与常用动词": "gezondheid-en-gezondheidszorg-in-nederland",
  };
  const headingMatches = [...section.matchAll(/^## (.+)$/gm)];
  return headingMatches.flatMap((match, index) => {
    const category = stripMarkdown(match[1]);
    const start = match.index;
    const end = headingMatches[index + 1]?.index ?? section.length;
    const topicId = categoryTopicMap[category] || "nederland-leren-kennen";
    return section
      .slice(start, end)
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.startsWith("|") && !line.includes("---"))
      .slice(1)
      .map((line) => line.split("|").map((cell) => cell.trim()).filter(Boolean))
      .filter((cells) => cells.length >= 2)
      .map((cells) => ({
        word: stripMarkdown(cells[0]),
        meaning: stripMarkdown(cells[1]),
        example: "",
        note: category,
        importance: "综合词汇",
        topic: category,
        topicId,
        source: "KNM study guide comprehensive vocabulary",
      }));
  });
}

function parseGuideGrammar(markdown) {
  const section = getTopLevelSection(markdown, "高频语法与连接词", /^# 综合模拟题/m);
  return section
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("|") && !line.includes("---"))
    .slice(1)
    .map((line) => line.split("|").map((cell) => cell.trim()).filter(Boolean))
    .filter((cells) => cells.length >= 3)
    .map((cells) => ({
      pattern: stripMarkdown(cells[0]),
      meaning: stripMarkdown(cells[1]),
      example: stripMarkdown(cells[2]),
    }));
}

function parseGuideCheatSheet(markdown) {
  const section = markdown.includes("## 考前一页速记") ? markdown.slice(markdown.indexOf("## 考前一页速记")) : "";
  return section
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => stripMarkdown(line.replace(/^- /, "")));
}

function parseGuidePointLines(section) {
  return section
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.includes("---") && !line.startsWith("| Nederlands") && !line.startsWith("| ---"))
    .flatMap((line) => {
      if (line.startsWith("- ")) return [stripMarkdown(line.replace(/^- /, ""))];
      if (!line.startsWith("|")) return line.startsWith("#") ? [] : [stripMarkdown(line)];
      const cells = line.split("|").map((cell) => stripMarkdown(cell)).filter(Boolean);
      if (cells.length < 2) return [];
      return [cells.join(" ｜ ")];
    })
    .filter(Boolean);
}

function parseGuideLessonExtras(markdown) {
  const extras = new Map();
  splitGuideChapters(markdown).forEach((chapter) => {
    const contentEnd = chapter.body.search(/^### 高频词汇$/m);
    const core = chapter.body.slice(0, contentEnd === -1 ? chapter.body.length : contentEnd);
    const matches = [...core.matchAll(/^## \d+\.\s+(.+)$/gm)];
    const guideSections = matches.map((match, index) => {
      const start = match.index + match[0].length;
      const end = matches[index + 1]?.index ?? core.length;
      return {
        title: stripMarkdown(match[1]),
        points: parseGuidePointLines(core.slice(start, end)),
      };
    }).filter((section) => section.points.length);
    const memoryHints = bullets(getSection(chapter.body, "看到关键词就联想")).map(stripMarkdown);
    extras.set(chapter.number, {
      guideTitle: chapter.title,
      guideZhTitle: chapter.zhTitle,
      guideSections,
      memoryHints,
    });
  });
  return extras;
}

const noteChapters = splitChapters(notes);
const guideExtrasByChapter = parseGuideLessonExtras(guide);
const topics = noteChapters.map((chapter, index) => {
  const id = slugify(chapter.title);
  const vocab = parseVocabulary(getSection(chapter.body, "词汇表"), id, chapter.title);
  const guideExtra = guideExtrasByChapter.get(chapter.number) || {};
  const memoryHints = guideExtra.memoryHints?.length ? guideExtra.memoryHints : vocab.slice(0, 6).map((item) => `${item.word} → ${item.meaning}`);
  return {
    id,
    chapter: chapter.number,
    title: chapter.title,
    zhTitle: guideExtra.guideZhTitle || chapter.title,
    color: colorSet[index % colorSet.length],
    summary: paragraphs(getSection(chapter.body, "中文解释"))[0] || "",
    explanation: paragraphs(getSection(chapter.body, "中文解释")),
    examPoints: bullets(getSection(chapter.body, "考试重点")),
    lifeTips: bullets(getSection(chapter.body, "荷兰生活常识")),
    confusing: bullets(getSection(chapter.body, "容易混淆")),
    guideSections: guideExtra.guideSections || [],
    memoryHints,
    keywords: vocab.map((item) => item.word).slice(0, 8),
    vocabulary: vocab,
  };
});

const lessonByChapter = new Map(topics.map((topic) => [topic.chapter, topic]));
const studyQuestions = parseQuestions(practice, lessonByChapter);
const duoQuestions = readJsonArray(duoQuestionsPath);
const generatedQuestions = readJsonArray(generatedQuestionsPath);
const guideChapterQuestions = parseGuideChapterQuestions(guide, lessonByChapter);
const guideMockQuestions = parseGuideMockQuestions(guide);
const guideQuestions = [...guideChapterQuestions, ...guideMockQuestions];
const questions = [...studyQuestions, ...duoQuestions, ...generatedQuestions, ...guideQuestions];
const guideWords = [...parseGuideChapterWords(guide, lessonByChapter), ...parseGuideComprehensiveWords(guide)];
const words = dedupeWords([...topics.flatMap((topic) => topic.vocabulary), ...guideWords]);
const reviewPlan = parseReviewPlan(notes);
const grammar = parseGuideGrammar(guide);
const cheatSheet = parseGuideCheatSheet(guide);

const output = `export const KNM_CONTENT = ${JSON.stringify({ topics, questions, words, reviewPlan, grammar, cheatSheet }, null, 2)};\n`;
fs.writeFileSync(outputPath, output);

console.log(
  `Imported ${topics.length} topics, ${questions.length} questions (${studyQuestions.length} study, ${duoQuestions.length} DUO, ${generatedQuestions.length} generated, ${guideQuestions.length} guide), ${words.length} vocabulary items, ${grammar.length} grammar cards, ${cheatSheet.length} cheat-sheet notes.`,
);
