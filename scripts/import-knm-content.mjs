import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const notesPath =
  "/Users/sherrypan/Library/Mobile Documents/com~apple~CloudDocs/Dutch-A2/knm/KNM-study-notes.zh-CN.md";
const questionsPath =
  "/Users/sherrypan/Library/Mobile Documents/com~apple~CloudDocs/Dutch-A2/knm/KNM-practice-questions.zh-CN.md";
const guidePath = "/Users/sherrypan/Downloads/KNM_study_guide_CN_NL.md";
const fullChapterTwoToTenDir =
  "/Users/sherrypan/Downloads/KNM_Hoofdstukken_2-10_studiepakket/KNM_Hoofdstukken_2-10";
const duoQuestionsPath = path.join(root, "content", "duo-practice-questions.json");
const generatedQuestionsPath = path.join(root, "content", "generated-mock-questions.json");
const outputPath = path.join(root, "content-data.js");

const notes = fs.readFileSync(notesPath, "utf8");
const practice = fs.readFileSync(questionsPath, "utf8");
const guide = fs.existsSync(guidePath) ? fs.readFileSync(guidePath, "utf8") : "";

const colorSet = ["#0f766e", "#2d6cdf", "#c2413d", "#e0a928", "#6f5cc2", "#138a45", "#d25f27", "#8b5d33", "#2f6f8f", "#8a4f93"];

function getFullChapterCandidates(chapterNumber) {
  if (chapterNumber === 1) {
    return [
      "/Users/sherrypan/Downloads/KNM_Hoofdstuk_1_studiepakket/KNM_Hoofdstuk_1_studieversie_CN_NL.md",
      "/Users/sherrypan/Downloads/KNM_Hoofdstuk_1_studieversie_CN_NL.md",
    ];
  }

  if (!fs.existsSync(fullChapterTwoToTenDir)) return [];
  return fs
    .readdirSync(fullChapterTwoToTenDir)
    .filter((fileName) => fileName.startsWith(`KNM_Hoofdstuk_${chapterNumber}_`) && fileName.endsWith(".md"))
    .map((fileName) => path.join(fullChapterTwoToTenDir, fileName));
}

function findFullChapterStudyPath(chapterNumber) {
  return getFullChapterCandidates(chapterNumber).find((filePath) => fs.existsSync(filePath)) || "";
}

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

function dedupeWords(items, { scopeByTopic = false } = {}) {
  const seen = new Set();
  return items.filter((item) => {
    const normalized = normalizeWord(item.word);
    if (!normalized) return false;
    const key = scopeByTopic ? `${item.topicId || ""}:${normalized}` : normalized;
    if (seen.has(key)) return false;
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

function isBlockStart(line) {
  return /^#{1,4}\s+/.test(line) || /^!\[[^\]]*\]\([^)]+\)/.test(line) || line.startsWith("|") || /^[-*]\s+/.test(line) || /^\d+\.\s+/.test(line) || line.startsWith(">");
}

function parseTableLines(lines, start) {
  const tableLines = [];
  let index = start;
  while (index < lines.length && lines[index].trim().startsWith("|")) {
    tableLines.push(lines[index].trim());
    index += 1;
  }
  const rows = tableLines
    .filter((line) => !/^\|\s*-+/.test(line))
    .map((line) => line.split("|").map((cell) => stripMarkdown(cell)).filter(Boolean));
  return {
    block: {
      type: "table",
      headers: rows[0] || [],
      rows: rows.slice(1),
    },
    next: index,
  };
}

function findMediaSource(markdownPath, originalSrc) {
  const directPath = path.resolve(path.dirname(markdownPath), originalSrc);
  if (fs.existsSync(directPath)) return directPath;

  const parsed = path.parse(directPath);
  const chapterMatch = markdownPath.match(/Hoofdstuk_?(\d+)/i) || originalSrc.match(/Hoofdstuk_?(\d+)/i);
  const chapterNumber = chapterMatch?.[1];
  const chapterAssetDir = chapterNumber ? `KNM_Hoofdstuk_${chapterNumber}_assets` : "KNM_Hoofdstuk_1_assets";
  const possibleDirs = [
    parsed.dir,
    path.join(path.dirname(markdownPath), chapterAssetDir),
    path.join(path.dirname(path.dirname(markdownPath)), chapterAssetDir),
    path.join(path.dirname(markdownPath), `KNM_Hoofdstuk_${chapterNumber}_studiepakket`, chapterAssetDir),
    path.join(path.dirname(path.dirname(markdownPath)), `KNM_Hoofdstuk_${chapterNumber}_studiepakket`, chapterAssetDir),
  ];
  const extensions = [parsed.ext, ".png", ".jpg", ".jpeg", ".webp"].filter(Boolean);

  for (const dir of possibleDirs) {
    for (const ext of extensions) {
      const candidate = path.join(dir, `${parsed.name}${ext}`);
      if (fs.existsSync(candidate)) return candidate;
    }
  }

  return null;
}

function mediaBlockFromMarkdown(line, markdownPath, chapterSlug) {
  const match = line.match(/^!\[([^\]]*)\]\(([^)]+)\)/);
  if (!match) return null;
  const originalSrc = match[2];
  const sourcePath = findMediaSource(markdownPath, originalSrc);
  const fileName = sourcePath ? path.basename(sourcePath) : path.basename(originalSrc);
  const outputDir = path.join(root, "assets", "lesson-media", chapterSlug);
  const outputSrc = `assets/lesson-media/${chapterSlug}/${fileName}`;

  if (sourcePath) {
    fs.mkdirSync(outputDir, { recursive: true });
    fs.copyFileSync(sourcePath, path.join(outputDir, fileName));
    return { type: "image", alt: stripMarkdown(match[1]), src: outputSrc, originalSrc, missing: false };
  }

  return { type: "skippedImage", originalSrc };
}

function parseRichMarkdownBlocks(section, markdownPath, chapterSlug) {
  const lines = section.split("\n");
  const blocks = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();
    if (!line || line === "---") {
      index += 1;
      continue;
    }

    const image = mediaBlockFromMarkdown(line, markdownPath, chapterSlug);
    if (image) {
      if (image.type !== "skippedImage") {
        blocks.push(image);
      }
      index += 1;
      continue;
    }

    const heading = line.match(/^(#{3,4})\s+(.+)$/);
    if (heading) {
      blocks.push({ type: "subheading", level: heading[1].length, text: stripMarkdown(heading[2]) });
      index += 1;
      continue;
    }

    if (line.startsWith("|")) {
      const parsed = parseTableLines(lines, index);
      if (parsed.block.headers.length || parsed.block.rows.length) blocks.push(parsed.block);
      index = parsed.next;
      continue;
    }

    if (/^[-*]\s+/.test(line) || /^\d+\.\s+/.test(line)) {
      const ordered = /^\d+\.\s+/.test(line);
      const items = [];
      while (index < lines.length) {
        const itemLine = lines[index].trim();
        const itemMatch = ordered ? itemLine.match(/^\d+\.\s+(.+)$/) : itemLine.match(/^[-*]\s+(.+)$/);
        if (!itemMatch) break;
        items.push(stripMarkdown(itemMatch[1]));
        index += 1;
      }
      blocks.push({ type: ordered ? "orderedList" : "list", items });
      continue;
    }

    if (line.startsWith(">")) {
      const quotes = [];
      while (index < lines.length && lines[index].trim().startsWith(">")) {
        quotes.push(stripMarkdown(lines[index].trim().replace(/^>\s?/, "")));
        index += 1;
      }
      blocks.push({ type: "quote", text: quotes.join(" ") });
      continue;
    }

    const paragraph = [line];
    index += 1;
    while (index < lines.length) {
      const nextLine = lines[index].trim();
      if (!nextLine || nextLine === "---" || isBlockStart(nextLine)) break;
      paragraph.push(nextLine);
      index += 1;
    }
    blocks.push({ type: "paragraph", text: stripMarkdown(paragraph.join(" ")) });
  }

  return blocks;
}

function getSectionByHeading(markdown, headingPattern, nextPattern = null) {
  const match = markdown.match(headingPattern);
  if (!match || match.index == null) return "";
  const start = match.index + match[0].length;
  const rest = markdown.slice(start);
  if (!nextPattern) return rest.trim();
  const next = rest.search(nextPattern);
  return (next === -1 ? rest : rest.slice(0, next)).trim();
}

function isFullStudySupplementTitle(title) {
  return /(?:本章核心词汇表|重点词汇表|易错|容易出错|一页速记|重点时间线|教材结尾判断题的修正)/.test(title);
}

function findTopLevelHeading(markdown, titlePattern) {
  return [...markdown.matchAll(/^# (.+)$/gm)].find((match) => titlePattern.test(match[1]));
}

function getTopLevelSectionFromMatch(markdown, match) {
  if (!match || match.index == null) return "";
  const start = match.index + match[0].length;
  const rest = markdown.slice(start);
  const next = rest.search(/^# /m);
  return (next === -1 ? rest : rest.slice(0, next)).trim();
}

function parseTableSection(markdown, titlePattern, markdownPath, chapterSlug) {
  const heading = findTopLevelHeading(markdown, titlePattern);
  if (!heading) return null;
  const section = getTopLevelSectionFromMatch(markdown, heading);
  return parseRichMarkdownBlocks(section, markdownPath, chapterSlug).find((block) => block.type === "table") || null;
}

function parseExtraSections(markdown, markdownPath, chapterSlug) {
  return [...markdown.matchAll(/^# (.+)$/gm)]
    .filter((match) => /(?:重点时间线|教材结尾判断题的修正)/.test(match[1]))
    .map((match) => ({
      title: stripMarkdown(match[1]),
      blocks: parseRichMarkdownBlocks(getTopLevelSectionFromMatch(markdown, match), markdownPath, chapterSlug),
    }))
    .filter((section) => section.blocks.length);
}

function parseFullChapterStudy(markdown, markdownPath, chapterNumber) {
  if (!markdown) return null;
  const chapterSlug = `hoofdstuk-${chapterNumber}`;
  const title = stripMarkdown(markdown.match(/^#\s+(.+)$/m)?.[1] || `Hoofdstuk ${chapterNumber}`);
  const goalSection = getSectionByHeading(markdown, /^## 0\.\s+本章学习目标$/m, /^#\s+/m);
  const goalBlocks = parseRichMarkdownBlocks(goalSection, markdownPath, chapterSlug);
  const goals = goalBlocks.find((block) => block.type === "orderedList")?.items || [];

  const partMatches = [...markdown.matchAll(/^# (第.+?部分：.+)$/gm)].filter((match) => !isFullStudySupplementTitle(match[1]));
  const parts = partMatches.map((partMatch, partIndex) => {
    const partStart = partMatch.index + partMatch[0].length;
    const nextPartStart = partMatches[partIndex + 1]?.index;
    const nextHeadingOffset = markdown.slice(partStart).search(/^# /m);
    const resolvedPartEnd = nextPartStart ?? (nextHeadingOffset === -1 ? markdown.length : partStart + nextHeadingOffset);
    const partBody = markdown.slice(partStart, resolvedPartEnd);
    const unitMatches = [...partBody.matchAll(/^## (\d+)\.\s+(.+)$/gm)];
    const units = unitMatches.length
      ? unitMatches.map((unitMatch, unitIndex) => {
          const unitStart = unitMatch.index + unitMatch[0].length;
          const unitEnd = unitMatches[unitIndex + 1]?.index ?? partBody.length;
          return {
            number: Number(unitMatch[1]),
            title: stripMarkdown(unitMatch[2]),
            blocks: parseRichMarkdownBlocks(partBody.slice(unitStart, unitEnd), markdownPath, chapterSlug),
          };
        })
      : [
          {
            number: partIndex + 1,
            title: "本部分重点",
            blocks: parseRichMarkdownBlocks(partBody, markdownPath, chapterSlug),
          },
        ];
    return {
      title: stripMarkdown(partMatch[1]),
      units: units.filter((unit) => unit.blocks.length),
    };
  }).filter((part) => part.units.length);

  const vocabularyTable = parseTableSection(markdown, /(?:本章核心词汇表|重点词汇表)$/, markdownPath, chapterSlug);
  const mistakesTable = parseTableSection(markdown, /(?:易错|容易出错)/, markdownPath, chapterSlug);
  const cheatHeading = findTopLevelHeading(markdown, /一页速记$/);
  const cheatSection = getTopLevelSectionFromMatch(markdown, cheatHeading);
  const cheatMatches = [...cheatSection.matchAll(/^## (.+)$/gm)];
  const cheatSheet = cheatMatches.length
    ? cheatMatches.map((match, index) => {
        const start = match.index + match[0].length;
        const end = cheatMatches[index + 1]?.index ?? cheatSection.length;
        const blocks = parseRichMarkdownBlocks(cheatSection.slice(start, end), markdownPath, chapterSlug);
        return {
          title: stripMarkdown(match[1]),
          items: blocks.filter((block) => block.type === "list" || block.type === "orderedList").flatMap((block) => block.items || []),
        };
      })
    : [
        {
          title: "速记重点",
          items: parseRichMarkdownBlocks(cheatSection, markdownPath, chapterSlug)
            .filter((block) => block.type === "list" || block.type === "orderedList")
            .flatMap((block) => block.items || []),
        },
      ];

  return {
    title,
    chapter: chapterNumber,
    goals,
    parts,
    extraSections: parseExtraSections(markdown, markdownPath, chapterSlug),
    vocabulary: (vocabularyTable?.rows || []).map((row) => ({ word: row[0] || "", meaning: row[1] || "", example: row[2] || "" })).filter((item) => item.word),
    commonMistakes: (mistakesTable?.rows || []).map((row) => ({ original: row[0] || "", corrected: row[1] || "", meaning: row[2] || "" })).filter((item) => item.original),
    cheatSheet: cheatSheet.filter((section) => section.items.length),
    imageCount: parts.flatMap((part) => part.units).flatMap((unit) => unit.blocks).filter((block) => block.type === "image").length,
    missingImageCount: parts.flatMap((part) => part.units).flatMap((unit) => unit.blocks).filter((block) => block.type === "image" && block.missing).length,
  };
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

function fullStudyCoreWords(topics) {
  return topics.flatMap((topic) =>
    (topic.fullStudy?.vocabulary || []).map((item) => ({
      word: stripMarkdown(item.word),
      meaning: stripMarkdown(item.meaning),
      example: stripMarkdown(item.example || ""),
      note: "",
      importance: "本章核心",
      topic: topic.title,
      topicId: topic.id,
      source: "Full chapter core vocabulary",
    })),
  );
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
const fullStudyByChapter = new Map(
  Array.from({ length: 10 }, (_, index) => {
    const chapterNumber = index + 1;
    const studyPath = findFullChapterStudyPath(chapterNumber);
    if (!studyPath) return null;
    return [chapterNumber, parseFullChapterStudy(fs.readFileSync(studyPath, "utf8"), studyPath, chapterNumber)];
  }).filter(Boolean).filter(([, study]) => study),
);
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
    fullStudy: fullStudyByChapter.get(chapter.number) || null,
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
const questions = [...duoQuestions, ...generatedQuestions];
const guideWords = [...parseGuideChapterWords(guide, lessonByChapter), ...parseGuideComprehensiveWords(guide)];
const fullStudyWords = fullStudyCoreWords(topics);
const words = dedupeWords([...topics.flatMap((topic) => topic.vocabulary), ...fullStudyWords, ...guideWords], { scopeByTopic: true });
const grammar = parseGuideGrammar(guide);
const cheatSheet = parseGuideCheatSheet(guide);

const output = `export const KNM_CONTENT = ${JSON.stringify({ topics, questions, words, grammar, cheatSheet }, null, 2)};\n`;
fs.writeFileSync(outputPath, output);

console.log(
  `Imported ${topics.length} topics, ${questions.length} questions (${duoQuestions.length} DUO, ${generatedQuestions.length} scenario original; excluded ${studyQuestions.length} legacy study, ${guideQuestions.length} guide), ${words.length} vocabulary items, ${grammar.length} grammar cards, ${cheatSheet.length} cheat-sheet notes, ${fullStudyByChapter.size} full-study chapters.`,
);
