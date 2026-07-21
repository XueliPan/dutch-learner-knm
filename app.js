import { KNM_CONTENT } from "./content-data.js";

const importedContent = KNM_CONTENT || {};

const fallbackTopics = [
  {
    id: "wonen",
    title: "Wonen",
    zhTitle: "住房与邻里",
    color: "#0f766e",
    summary: "理解租房、买房、邻居、gemeente 和日常住房责任。",
    keywords: ["huurcontract", "woningcorporatie", "gemeente", "buren", "afval"],
    learn: [
      "租房时通常会签 huurcontract，并按时支付 huur 和可能的 servicekosten。",
      "房屋维修要看责任：小维修常由住户处理，大问题通常联系 verhuurder 或 woningcorporatie。",
      "搬家后要在 gemeente 登记地址，生活垃圾按当地规则分类或预约处理。",
    ],
  },
  {
    id: "werk",
    title: "Werk en inkomen",
    zhTitle: "工作与收入",
    color: "#2d6cdf",
    summary: "认识合同、工资、税、福利和找工作的基本规则。",
    keywords: ["arbeidscontract", "loonstrook", "belasting", "uitkering", "sollicitatie"],
    learn: [
      "工作前通常签 arbeidscontract，里面写明工资、工时、假期和试用期。",
      "工资单 loonstrook 会显示 bruto、netto、belasting 和社会保险扣款。",
      "失业或收入不足时可联系 UWV 或 gemeente 了解可能的帮助，但需要符合条件。",
    ],
  },
  {
    id: "gezondheid",
    title: "Gezondheid",
    zhTitle: "医疗健康",
    color: "#c2413d",
    summary: "学习 huisarts、保险、急救和药房流程。",
    keywords: ["huisarts", "zorgverzekering", "apotheek", "spoed", "eigen risico"],
    learn: [
      "在荷兰一般先联系 huisarts，由家庭医生判断是否转诊 specialist。",
      "基本医疗保险 zorgverzekering 通常是必须的，部分费用可能先走 eigen risico。",
      "有生命危险时拨打 112；非紧急但需要医疗建议时联系 huisarts 或 huisartsenpost。",
    ],
  },
  {
    id: "onderwijs",
    title: "Onderwijs",
    zhTitle: "教育与孩子",
    color: "#e0a928",
    summary: "了解义务教育、学校沟通、托儿和继续学习。",
    keywords: ["leerplicht", "basisschool", "oudergesprek", "kinderopvang", "MBO"],
    learn: [
      "孩子到一定年龄有 leerplicht，家长需要确保孩子上学。",
      "学校常通过 oudergesprek、邮件或学校系统与家长沟通。",
      "职业教育常见路线包括 MBO；成年人也可以通过 kursus 或 opleiding 继续学习。",
    ],
  },
  {
    id: "democratie",
    title: "Democratie en rechten",
    zhTitle: "民主与权利",
    color: "#6f5cc2",
    summary: "掌握选举、宪法、平等、警察和政府服务。",
    keywords: ["stemmen", "grondwet", "gelijke rechten", "politie", "gemeenteraad"],
    learn: [
      "荷兰是 democratische rechtsstaat，法律保护基本权利和自由。",
      "荷兰公民可以在 verkiezingen 投票；市政层面有 gemeenteraad。",
      "遇到犯罪或危险可找 politie；紧急危险拨打 112。",
    ],
  },
  {
    id: "geld",
    title: "Geldzaken",
    zhTitle: "金钱与行政",
    color: "#138a45",
    summary: "处理银行、账单、税务、保险和补贴。",
    keywords: ["rekening", "factuur", "toeslag", "belastingaangifte", "verzekering"],
    learn: [
      "日常生活需要银行 rekening，并按时支付 huur、energie 和 zorgverzekering。",
      "部分家庭可以申请 toeslag，例如 huurtoeslag 或 zorgtoeslag，金额取决于收入和条件。",
      "很多政府事务需要 DigiD 登录，请妥善保护账号和验证码。",
    ],
  },
  {
    id: "verkeer",
    title: "Verkeer en vervoer",
    zhTitle: "交通出行",
    color: "#d25f27",
    summary: "熟悉自行车、公共交通、交通规则和安全。",
    keywords: ["OV-chipkaart", "fiets", "rijbewijs", "verkeersregels", "inchecken"],
    learn: [
      "乘坐公共交通时通常要 inchecken 和 uitchecken，可使用 OV-chipkaart 或银行卡。",
      "骑 fiets 很常见，但也要遵守 verkeersregels，夜间使用车灯。",
      "开车需要有效 rijbewijs，并遵守限速、停车和保险规则。",
    ],
  },
  {
    id: "samenleven",
    title: "Samenleven",
    zhTitle: "社会生活",
    color: "#8b5d33",
    summary: "理解邻里礼貌、志愿服务、节日和日常习惯。",
    keywords: ["afspraak", "vrijwilligerswerk", "privacy", "op tijd", "feestdagen"],
    learn: [
      "荷兰社会重视 afspraak 和 op tijd；迟到最好提前通知。",
      "邻居之间要注意噪音、垃圾和公共空间使用。",
      "vrijwilligerswerk 是认识社区、练习荷兰语和建立社会联系的好方式。",
    ],
  },
];

const fallbackQuestions = [
  {
    topic: "wonen",
    scenario: "你刚搬到新城市。",
    question: "Wat moet u meestal doen als u verhuist naar een andere gemeente?",
    answers: ["Uw nieuwe adres doorgeven aan de gemeente", "Alleen uw buren informeren", "Een nieuw paspoort aanvragen"],
    correct: 0,
    explanation: "搬家后通常要向 nieuwe gemeente 登记新地址。buren 可以通知，但不是正式登记。",
  },
  {
    topic: "wonen",
    scenario: "你的暖气坏了，房子是租的。",
    question: "Wie belt u meestal eerst bij een groot probleem in een huurwoning?",
    answers: ["De politie", "De verhuurder of woningcorporatie", "De basisschool"],
    correct: 1,
    explanation: "租房的大维修通常联系 verhuurder 或 woningcorporatie。只有危险或犯罪才找 politie。",
  },
  {
    topic: "wonen",
    scenario: "你要扔大件家具。",
    question: "Wat is verstandig om te doen met grofvuil?",
    answers: ["Het midden op straat zetten", "Het bij de buren neerzetten", "De regels van de gemeente controleren"],
    correct: 2,
    explanation: "大件垃圾 grofvuil 的处理规则由 gemeente 决定，很多地方需要预约。",
  },
  {
    topic: "werk",
    scenario: "你收到第一份工资。",
    question: "Waar ziet u hoeveel belasting er is ingehouden?",
    answers: ["Op het huurcontract", "Op de loonstrook", "Op de OV-chipkaart"],
    correct: 1,
    explanation: "loonstrook 工资单显示 bruto、netto 和 belasting 等信息。",
  },
  {
    topic: "werk",
    scenario: "你要申请一份工作。",
    question: "Wat stuurt u vaak bij een sollicitatie?",
    answers: ["Een afvalpas", "Een recept van de apotheek", "Een cv en motivatiebrief"],
    correct: 2,
    explanation: "sollicitatie 常需要 cv 和 motivatiebrief，用来说明经验和求职动机。",
  },
  {
    topic: "werk",
    scenario: "你失业了，想了解失业金。",
    question: "Welke organisatie is vaak belangrijk bij werkloosheid?",
    answers: ["De bibliotheek", "UWV", "De tandarts"],
    correct: 1,
    explanation: "UWV 负责很多与 werkloosheid 和 uitkering 相关的事务。",
  },
  {
    topic: "gezondheid",
    scenario: "你感冒很严重，但没有生命危险。",
    question: "Met wie neemt u meestal eerst contact op?",
    answers: ["De rechter", "De rijschool", "De huisarts"],
    correct: 2,
    explanation: "非紧急医疗问题通常先联系 huisarts，家庭医生决定下一步。",
  },
  {
    topic: "gezondheid",
    scenario: "有人突然昏倒，没有反应。",
    question: "Welk nummer belt u bij direct levensgevaar?",
    answers: ["112", "0900-8844", "1400"],
    correct: 0,
    explanation: "生命危险或紧急事故拨打 112。0900-8844 是非紧急警务号码。",
  },
  {
    topic: "gezondheid",
    scenario: "医生给你开了药。",
    question: "Waar haalt u meestal medicijnen met een recept?",
    answers: ["Bij de gemeente", "Bij de apotheek", "Bij de bank"],
    correct: 1,
    explanation: "处方药通常到 apotheek 药房领取。",
  },
  {
    topic: "onderwijs",
    scenario: "孩子到上学年龄。",
    question: "Wat betekent leerplicht?",
    answers: ["Kinderen mogen niet fietsen", "Ouders hoeven niets te doen", "Kinderen moeten naar school"],
    correct: 2,
    explanation: "leerplicht 指义务教育，孩子必须上学，家长要负责。",
  },
  {
    topic: "onderwijs",
    scenario: "学校想和你谈孩子的进展。",
    question: "Hoe heet een gesprek tussen ouders en school vaak?",
    answers: ["Sollicitatiegesprek", "Oudergesprek", "Huurgesprek"],
    correct: 1,
    explanation: "oudergesprek 是家长和学校讨论孩子学习情况的谈话。",
  },
  {
    topic: "onderwijs",
    scenario: "你想学职业技能。",
    question: "Welke opleiding is vaak praktisch en beroepsgericht?",
    answers: ["MBO", "Gemeenteraad", "Eigen risico"],
    correct: 0,
    explanation: "MBO 是职业教育路线，偏实践和职业技能。",
  },
  {
    topic: "democratie",
    scenario: "你在学习荷兰政治。",
    question: "Wat is een democratie?",
    answers: ["Alle besluiten worden door een bedrijf genomen", "Burgers hebben invloed via verkiezingen", "Niemand mag zijn mening geven"],
    correct: 1,
    explanation: "democratie 中公民通过 verkiezingen 等方式影响政治决定。",
  },
  {
    topic: "democratie",
    scenario: "你看到有人被歧视。",
    question: "Welk principe past bij de Nederlandse grondwet?",
    answers: ["Alleen rijke mensen hebben rechten", "Iedereen moet dezelfde baan hebben", "Gelijke behandeling"],
    correct: 2,
    explanation: "grondwet 保护平等和基本权利。gelijke behandeling 是重要原则。",
  },
  {
    topic: "democratie",
    scenario: "你目击自行车被偷。",
    question: "Bij wie kunt u aangifte doen?",
    answers: ["Bij de politie", "Bij de apotheek", "Bij de kinderopvang"],
    correct: 0,
    explanation: "犯罪或被盗可以向 politie 报案 aangifte doen。",
  },
  {
    topic: "geld",
    scenario: "你需要登录政府网站。",
    question: "Wat gebruikt u vaak om online zaken met de overheid te regelen?",
    answers: ["Een fietsbel", "DigiD", "Een schoolrapport"],
    correct: 1,
    explanation: "很多政府网站使用 DigiD 登录，验证码和密码要保密。",
  },
  {
    topic: "geld",
    scenario: "你的收入较低，想了解房租补贴。",
    question: "Hoe heet een mogelijke bijdrage voor huurkosten?",
    answers: ["Loonstrook", "Rijbewijs", "Huurtoeslag"],
    correct: 2,
    explanation: "huurtoeslag 是可能的房租补贴，是否能拿取决于收入、房租和其他条件。",
  },
  {
    topic: "geld",
    scenario: "你收到一张账单。",
    question: "Wat doet u met een factuur?",
    answers: ["Controleren en op tijd betalen", "Altijd weggooien", "Aan de buren geven"],
    correct: 0,
    explanation: "factuur 是账单，应检查内容并按时支付，避免额外费用。",
  },
  {
    topic: "verkeer",
    scenario: "你坐火车出门。",
    question: "Wat doet u meestal aan het begin en einde van de reis?",
    answers: ["Aangifte doen", "Een huurcontract tekenen", "Inchecken en uitchecken"],
    correct: 2,
    explanation: "公共交通通常需要 inchecken 和 uitchecken。",
  },
  {
    topic: "verkeer",
    scenario: "晚上骑自行车。",
    question: "Wat is belangrijk voor de veiligheid?",
    answers: ["Zonder remmen rijden", "Goede fietsverlichting gebruiken", "Op de snelweg fietsen"],
    correct: 1,
    explanation: "夜间骑车要用 fietsverlichting，并遵守交通规则。",
  },
  {
    topic: "verkeer",
    scenario: "你想开车。",
    question: "Wat heeft u nodig om auto te mogen rijden?",
    answers: ["Een geldig rijbewijs", "Alleen een OV-chipkaart", "Een bibliotheekpas"],
    correct: 0,
    explanation: "开车需要有效 rijbewijs，并且车辆要符合保险等要求。",
  },
  {
    topic: "samenleven",
    scenario: "你和荷兰朋友约见面。",
    question: "Wat is in Nederland vaak belangrijk bij een afspraak?",
    answers: ["Zonder bericht veel later komen", "Op tijd komen", "Nooit plannen maken"],
    correct: 1,
    explanation: "荷兰生活中 afspraak 和准时 op tijd 很重要。迟到应提前说明。",
  },
  {
    topic: "samenleven",
    scenario: "你想认识社区的人。",
    question: "Wat kan helpen om mensen te ontmoeten en Nederlands te oefenen?",
    answers: ["Alle post negeren", "Geen buren groeten", "Vrijwilligerswerk"],
    correct: 2,
    explanation: "vrijwilligerswerk 可以帮助认识人、了解社会、练习荷兰语。",
  },
  {
    topic: "samenleven",
    scenario: "晚上很晚了，你想开很大声的音乐。",
    question: "Waar moet u rekening mee houden?",
    answers: ["Met de buren en geluidsoverlast", "Alleen met uw eigen smaak", "Met de belastingaangifte"],
    correct: 0,
    explanation: "住在社区要注意 buren 和 geluidsoverlast，避免影响别人。",
  },
];

const keywordMeanings = {
  huurcontract: "租房合同",
  woningcorporatie: "住房协会/社会住房机构",
  gemeente: "市政府/市政厅",
  buren: "邻居",
  afval: "垃圾",
  arbeidscontract: "劳动合同",
  loonstrook: "工资单",
  belasting: "税",
  uitkering: "福利金/补助",
  sollicitatie: "求职申请",
  huisarts: "家庭医生",
  zorgverzekering: "医疗保险",
  apotheek: "药房",
  spoed: "紧急情况",
  "eigen risico": "医疗保险自付额",
  leerplicht: "义务教育",
  basisschool: "小学",
  oudergesprek: "家长谈话",
  kinderopvang: "托儿",
  MBO: "中等职业教育",
  stemmen: "投票",
  grondwet: "宪法",
  "gelijke rechten": "平等权利",
  politie: "警察",
  gemeenteraad: "市议会",
  rekening: "银行账户/账单",
  factuur: "发票/账单",
  toeslag: "补贴",
  belastingaangifte: "报税",
  verzekering: "保险",
  "OV-chipkaart": "公共交通卡",
  fiets: "自行车",
  rijbewijs: "驾照",
  verkeersregels: "交通规则",
  inchecken: "刷卡进站/开始旅程",
  afspraak: "约定/预约",
  vrijwilligerswerk: "志愿工作",
  privacy: "隐私",
  "op tijd": "准时",
  feestdagen: "节日",
};

const topics = importedContent.topics?.length ? importedContent.topics : fallbackTopics;
const questions = importedContent.questions?.length ? importedContent.questions : fallbackQuestions;
const words = importedContent.words?.length
  ? importedContent.words
  : topics.flatMap((topic) =>
  topic.keywords.map((word) => ({
    word,
    topic: topic.title,
    topicId: topic.id,
    meaning: keywordMeanings[word] || "KNM 高频词",
  })),
);
const grammar = importedContent.grammar || [];
const cheatSheet = importedContent.cheatSheet || [];
const MOCK_QUESTION_COUNT = 40;
const MOCK_DURATION_MINUTES = 45;

const STORAGE_KEY = "knm-cn-progress-v1";
const state = {
  view: "dashboard",
  activeTopic: topics[0]?.id || "wonen",
  activeWordTopic: "all",
  practiceIndex: 0,
  practiceAnswered: false,
  mock: {
    active: false,
    questions: [],
    index: 0,
    answers: [],
    deadline: null,
    startedAt: null,
    timer: null,
    result: null,
  },
  progress: loadProgress(),
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));
let currentAudio = null;

function loadProgress() {
  const fallback = {
    answered: 0,
    correct: 0,
    byTopic: {},
    wrongAnswers: {},
    lastVisit: new Date().toISOString().slice(0, 10),
    streak: 1,
  };

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved) return fallback;
    const today = new Date().toISOString().slice(0, 10);
    if (saved.lastVisit !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      saved.streak = saved.lastVisit === yesterday ? (saved.streak || 0) + 1 : 1;
      saved.lastVisit = today;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    }
    return { ...fallback, ...saved };
  } catch {
    return fallback;
  }
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress));
  renderDashboard();
  if (state.view === "wrongbook") renderWrongbook();
}

function questionKey(question) {
  return question.id || `${question.topic}:${question.question}`;
}

function findQuestionByKey(key) {
  return questions.find((question) => questionKey(question) === key);
}

function selectedAnswerText(question, response) {
  if (!hasQuestionResponse(question, response)) return "未作答";
  if (question.type === "short") return String(response);
  return question.answers?.[response] || "未知选项";
}

function correctAnswerText(question) {
  if (question.type === "short") return question.correctText || question.explanation || "";
  return question.answers?.[question.correct] || "";
}

function addWrongAnswer(question, response, source) {
  const key = questionKey(question);
  const wrongAnswers = state.progress.wrongAnswers || {};
  const existing = wrongAnswers[key] || {};
  wrongAnswers[key] = {
    id: key,
    topic: question.topic,
    scenario: question.scenario,
    question: question.question,
    answers: question.answers || [],
    correct: question.correct,
    correctText: question.correctText || "",
    explanation: question.explanation,
    type: question.type || "choice",
    lastResponse: response,
    lastSource: source,
    mistakes: (existing.mistakes || 0) + 1,
    lastWrongAt: new Date().toISOString(),
  };
  state.progress.wrongAnswers = wrongAnswers;
}

function removeWrongAnswer(key) {
  if (!state.progress.wrongAnswers?.[key]) return;
  delete state.progress.wrongAnswers[key];
  saveProgress();
}

function clearWrongAnswers() {
  state.progress.wrongAnswers = {};
  saveProgress();
}

function wrongAnswerEntries() {
  return Object.values(state.progress.wrongAnswers || {})
    .map((entry) => ({ ...entry, questionData: findQuestionByKey(entry.id) || entry }))
    .sort((a, b) => new Date(b.lastWrongAt || 0) - new Date(a.lastWrongAt || 0));
}

function recordAnswer(question, isCorrect, response = null, source = "practice", saveNow = true) {
  const topicStats = state.progress.byTopic[question.topic] || { answered: 0, correct: 0 };
  topicStats.answered += 1;
  topicStats.correct += isCorrect ? 1 : 0;
  state.progress.byTopic[question.topic] = topicStats;
  state.progress.answered += 1;
  state.progress.correct += isCorrect ? 1 : 0;
  if (!isCorrect) addWrongAnswer(question, response, source);
  if (saveNow) saveProgress();
}

function getTopic(id) {
  return topics.find((topic) => topic.id === id) || topics[0];
}

function topicQuestions(topicId) {
  return questions.filter((question) => question.topic === topicId);
}

function topicWords(topicId) {
  return topicId === "all" ? words : words.filter((word) => word.topicId === topicId);
}

function getDutchVoice() {
  if (!("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  return voices.find((voice) => voice.lang === "nl-NL") || voices.find((voice) => voice.lang.startsWith("nl")) || null;
}

function stopDutchSpeech() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
}

function speakDutch(text) {
  stopDutchSpeech();

  if ("speechSynthesis" in window && "SpeechSynthesisUtterance" in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "nl-NL";
    utterance.rate = 0.86;
    utterance.pitch = 1;
    const voice = getDutchVoice();
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
    return;
  }

  const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=nl&q=${encodeURIComponent(text)}`;
  currentAudio = typeof window.Audio === "function" ? new window.Audio(url) : document.createElement("audio");
  currentAudio.src = url;
  currentAudio.play().catch(() => {
    window.alert("Deze browser kan de uitspraak niet afspelen.");
  });
}

function questionSpeechText(question) {
  return [
    question.question,
    ...(question.answers || []).map((answer, index) => `Antwoord ${String.fromCharCode(65 + index)}. ${answer}.`),
  ].join(" ");
}

function normalizeAnswer(value) {
  return String(value == null ? "" : value)
    .toLowerCase()
    .replace(/[。.,!?`'"]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderText(value) {
  return escapeHtml(value).replace(/\n/g, "<br>");
}

function checkQuestionAnswer(question, response) {
  if (question.type === "short") {
    const submitted = normalizeAnswer(response);
    if (!submitted) return false;
    const accepted = (question.accepted?.length ? question.accepted : [question.correctText]).map(normalizeAnswer).filter(Boolean);
    return accepted.some((answer) => submitted === answer || submitted.includes(answer) || answer.includes(submitted));
  }
  return response === question.correct;
}

function hasQuestionResponse(question, response) {
  if (question.type === "short") return normalizeAnswer(response) !== "";
  return response !== null && response !== undefined;
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function showView(view) {
  stopDutchSpeech();
  state.view = view;
  $$(".view").forEach((section) => section.classList.toggle("is-visible", section.id === view));
  $$(".tab").forEach((tab) => tab.classList.toggle("is-active", tab.dataset.view === view));
  history.replaceState(null, "", `#${view}`);
  if (view === "wrongbook") renderWrongbook();
}

function renderDashboard() {
  const { answered, correct, streak, byTopic } = state.progress;
  const weakTopic = [...topics].sort((a, b) => {
    const aStats = byTopic[a.id] || { answered: 0, correct: 0 };
    const bStats = byTopic[b.id] || { answered: 0, correct: 0 };
    const aRate = aStats.answered ? aStats.correct / aStats.answered : -1;
    const bRate = bStats.answered ? bStats.correct / bStats.answered : -1;
    return aRate - bRate;
  })[0];

  $("#answeredCount").textContent = answered;
  $("#accuracyRate").textContent = answered ? `${Math.round((correct / answered) * 100)}%` : "0%";
  $("#streakDays").textContent = `${streak || 1} 天`;
  $("#nextTopic").textContent = weakTopic.title;
}

function renderLessonFilters() {
  const container = $("#lessonFilters");
  container.innerHTML = "";
  topics.forEach((topic) => {
    const button = document.createElement("button");
    button.className = "filter-chip";
    button.type = "button";
    button.textContent = topic.title;
    button.dataset.topic = topic.id;
    button.addEventListener("click", () => {
      state.activeTopic = topic.id;
      renderLessons();
      renderPractice();
      showView("lessons");
    });
    container.append(button);
  });
}

function renderLessons() {
  $$("#lessonFilters .filter-chip").forEach((chip) => chip.classList.toggle("is-active", chip.dataset.topic === state.activeTopic));
  renderTopicFocus(getTopic(state.activeTopic));

  $$("[data-practice-topic]").forEach((button) => {
    button.addEventListener("click", () => {
      goPracticeTopic(button.dataset.practiceTopic);
    });
  });
}

function renderTopicFocus(topic) {
  const guideSections = topic.guideSections || [];
  const memoryHints = topic.memoryHints || [];
  $("#topicFocus").innerHTML = `
    <div class="topic-focus-head" style="--topic-color: ${topic.color}">
      <div>
        <p class="eyebrow">Hoofdstuk ${topic.chapter}</p>
        <h2>${topic.title}</h2>
        <p>${topic.zhTitle}</p>
      </div>
      <div class="topic-focus-actions">
        <span class="pill">${topicQuestions(topic.id).length} 道题</span>
        <span class="pill">${topicWords(topic.id).length} 个词</span>
        <button class="primary-action" data-practice-topic="${topic.id}" type="button">练这个主题</button>
      </div>
    </div>
    <div class="topic-study-layout">
      <div class="topic-study-main">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Core Knowledge</p>
            <h3>核心知识解析</h3>
          </div>
        </div>
        <div class="study-section-list">
          ${guideSections
            .map(
              (section, index) => `
                <details class="study-section" ${index < 2 ? "open" : ""}>
                  <summary>${section.title}</summary>
                  <ul>
                    ${section.points.map((point) => `<li>${point}</li>`).join("")}
                  </ul>
                </details>
              `,
            )
            .join("")}
        </div>
      </div>
      <aside class="topic-memory">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Memory Hooks</p>
            <h3>看到关键词就联想</h3>
          </div>
        </div>
        <ul>
          ${memoryHints.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      </aside>
    </div>
    ${topic.fullStudy ? renderFullStudy(topic.fullStudy) : ""}
  `;
}

function renderFullStudy(study) {
  const units = study.parts.flatMap((part) => part.units);
  return `
    <section class="full-study-panel">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Full Chapter</p>
          <h3>第 ${study.chapter} 章完整学习页</h3>
          <p>${units.length} 个知识单元，${study.imageCount} 张图片引用，${study.vocabulary.length} 个核心词。</p>
        </div>
      </div>
      ${
        study.goals?.length
          ? `<div class="learning-goals"><strong>本章学习目标</strong><ol>${study.goals.map((goal) => `<li>${renderText(goal)}</li>`).join("")}</ol></div>`
          : ""
      }
      <div class="full-study-parts">
        ${study.parts.map((part, index) => renderFullStudyPart(part, index)).join("")}
      </div>
      ${renderFullStudyExtraSections(study)}
      ${renderFullStudyVocabulary(study)}
      ${renderCommonMistakes(study)}
      ${renderChapterCheatSheet(study)}
    </section>
  `;
}

function renderFullStudyPart(part, index) {
  return `
    <details class="full-study-part" ${index === 0 ? "open" : ""}>
      <summary>${renderText(part.title)} <span>${part.units.length} 个知识单元</span></summary>
      <div class="full-study-units">
        ${part.units.map((unit, unitIndex) => renderFullStudyUnit(unit, index === 0 && unitIndex === 0)).join("")}
      </div>
    </details>
  `;
}

function renderFullStudyUnit(unit, open = false) {
  return `
    <details class="unit-card" ${open ? "open" : ""}>
      <summary><span>${unit.number}</span>${renderText(unit.title)}</summary>
      <div class="unit-content">
        ${unit.blocks.map(renderStudyBlock).join("")}
      </div>
    </details>
  `;
}

function renderStudyBlock(block) {
  if (block.type === "subheading") return `<h4>${renderText(block.text)}</h4>`;
  if (block.type === "paragraph") return `<p>${renderText(block.text)}</p>`;
  if (block.type === "quote") return `<blockquote>${renderText(block.text)}</blockquote>`;
  if (block.type === "list") return `<ul>${(block.items || []).map((item) => `<li>${renderText(item)}</li>`).join("")}</ul>`;
  if (block.type === "orderedList") return `<ol>${(block.items || []).map((item) => `<li>${renderText(item)}</li>`).join("")}</ol>`;
  if (block.type === "table") {
    return `
      <div class="study-table-wrap">
        <table class="study-table">
          <thead><tr>${(block.headers || []).map((header) => `<th>${renderText(header)}</th>`).join("")}</tr></thead>
          <tbody>
            ${(block.rows || []).map((row) => `<tr>${row.map((cell) => `<td>${renderText(cell)}</td>`).join("")}</tr>`).join("")}
          </tbody>
        </table>
      </div>
    `;
  }
  if (block.type === "image") {
    return `
      <figure class="study-image ${block.missing ? "is-missing" : ""}">
        ${
          block.missing
            ? `<div class="image-placeholder"><strong>${renderText(block.alt || "图片")}</strong><span>${renderText(block.originalSrc)}</span></div>`
            : `<img src="${renderText(block.src)}" alt="${renderText(block.alt)}" loading="lazy" />`
        }
        <figcaption>${renderText(block.alt || block.originalSrc)}</figcaption>
      </figure>
    `;
  }
  return "";
}

function renderFullStudyExtraSections(study) {
  if (!study.extraSections?.length) return "";
  return study.extraSections
    .map(
      (section) => `
        <details class="full-study-extra">
          <summary>${renderText(section.title)} <span>${section.blocks.length} 组内容</span></summary>
          <div class="unit-content">
            ${section.blocks.map(renderStudyBlock).join("")}
          </div>
        </details>
      `,
    )
    .join("");
}

function renderFullStudyVocabulary(study) {
  if (!study.vocabulary?.length) return "";
  return `
    <details class="full-study-extra">
      <summary>本章核心词汇表 <span>${study.vocabulary.length} 个词</span></summary>
      <div class="study-table-wrap">
        <table class="study-table">
          <thead><tr><th>荷兰语</th><th>中文</th><th>例句或记忆</th></tr></thead>
          <tbody>
            ${study.vocabulary.map((item) => `<tr><td>${renderText(item.word)}</td><td>${renderText(item.meaning)}</td><td>${renderText(item.example)}</td></tr>`).join("")}
          </tbody>
        </table>
      </div>
    </details>
  `;
}

function renderCommonMistakes(study) {
  if (!study.commonMistakes?.length) return "";
  return `
    <details class="full-study-extra">
      <summary>容易出错的原句与正确表达 <span>${study.commonMistakes.length} 条</span></summary>
      <div class="study-table-wrap">
        <table class="study-table">
          <thead><tr><th>原资料表达</th><th>建议表达</th><th>中文</th></tr></thead>
          <tbody>
            ${study.commonMistakes.map((item) => `<tr><td>${renderText(item.original)}</td><td>${renderText(item.corrected)}</td><td>${renderText(item.meaning)}</td></tr>`).join("")}
          </tbody>
        </table>
      </div>
    </details>
  `;
}

function renderChapterCheatSheet(study) {
  if (!study.cheatSheet?.length) return "";
  return `
    <details class="full-study-extra">
      <summary>第 ${study.chapter} 章一页速记 <span>${study.cheatSheet.reduce((total, section) => total + section.items.length, 0)} 条</span></summary>
      <div class="chapter-cheat-grid">
        ${study.cheatSheet
          .map(
            (section) => `
              <article class="chapter-cheat-card">
                <strong>${renderText(section.title)}</strong>
                <ul>${section.items.map((item) => `<li>${renderText(item)}</li>`).join("")}</ul>
              </article>
            `,
          )
          .join("")}
      </div>
    </details>
  `;
}

function renderTopicSelect() {
  const select = $("#topicSelect");
  select.innerHTML = topics.map((topic) => `<option value="${topic.id}">${topic.title} - ${topic.zhTitle}</option>`).join("");
  select.value = state.activeTopic;
}

function renderWordTopicFilters() {
  const container = $("#wordTopicFilters");
  const filters = [{ id: "all", title: "全部" }, ...topics];
  container.innerHTML = "";
  filters.forEach((topic) => {
    const count = topicWords(topic.id).length;
    const button = document.createElement("button");
    button.className = "filter-chip";
    button.type = "button";
    button.textContent = `${topic.title} ${count}`;
    button.dataset.wordTopic = topic.id;
    button.addEventListener("click", () => {
      state.activeWordTopic = topic.id;
      renderWords();
    });
    container.append(button);
  });
}

function renderPractice() {
  renderTopicSelect();
  const topic = getTopic(state.activeTopic);
  const list = topicQuestions(state.activeTopic);
  const question = list[state.practiceIndex % list.length];
  if (!question) return;
  state.practiceAnswered = false;

  $("#practiceTopicPill").textContent = `${topic.title} | ${topic.zhTitle}`;
  $("#practiceProgress").textContent = `第 ${state.practiceIndex + 1} / ${list.length} 题`;
  $("#practiceScenario").textContent = question.scenario;
  $("#practiceQuestion").textContent = question.question;
  $("#speakPracticeQuestion").dataset.speech = questionSpeechText(question);
  $("#practiceMeter").style.width = `${(state.practiceIndex / list.length) * 100}%`;
  $("#practiceFeedback").hidden = true;
  $("#practiceFeedback").className = "feedback";
  $("#nextPractice").disabled = true;

  renderAnswers($("#practiceAnswers"), question, (choice, button) => {
    if (state.practiceAnswered) return;
    state.practiceAnswered = true;
    const isCorrect = checkQuestionAnswer(question, choice);
    recordAnswer(question, isCorrect, choice, "practice");
    if (question.type === "short") {
      renderShortAnswer($("#practiceAnswers"), question, () => {}, choice, true);
    } else {
      showAnswerResult($("#practiceAnswers"), question, choice);
    }
    showFeedback($("#practiceFeedback"), question, isCorrect);
    $("#nextPractice").disabled = false;
    button?.focus();
  });
}

function renderAnswers(container, question, onSelect, selected = null, reveal = false) {
  if (question.type === "short") {
    renderShortAnswer(container, question, onSelect, selected, reveal);
    return;
  }
  container.innerHTML = "";
  (question.answers || []).forEach((answer, index) => {
    const button = document.createElement("button");
    button.className = "answer-btn";
    button.type = "button";
    button.textContent = `${String.fromCharCode(65 + index)}. ${answer}`;
    if (selected === index) button.classList.add("is-selected");
    if (reveal && index === question.correct) button.classList.add("is-correct");
    if (reveal && selected === index && selected !== question.correct) button.classList.add("is-wrong");
    button.addEventListener("click", () => onSelect(index, button));
    container.append(button);
  });
}

function renderShortAnswer(container, question, onSelect, value = "", reveal = false) {
  container.innerHTML = `
    <div class="short-answer">
      <label for="${question.id}-answer">Typ uw antwoord</label>
      <div class="short-answer-row">
        <input id="${question.id}-answer" type="text" value="${escapeHtml(value)}" ${reveal ? "disabled" : ""} autocomplete="off" />
        <button class="secondary-action" type="button" ${reveal ? "disabled" : ""}>检查</button>
      </div>
      ${reveal ? `<p>参考答案：${escapeHtml(question.correctText || question.explanation)}</p>` : ""}
    </div>
  `;
  const input = container.querySelector("input");
  const button = container.querySelector("button");
  button?.addEventListener("click", () => onSelect(input.value, button));
  input?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") onSelect(input.value, button);
  });
}

function showAnswerResult(container, question, selected) {
  Array.from(container.children).forEach((button, index) => {
    button.disabled = true;
    button.classList.toggle("is-correct", index === question.correct);
    button.classList.toggle("is-wrong", selected === index && selected !== question.correct);
  });
}

function showFeedback(container, question, isCorrect) {
  container.hidden = false;
  container.classList.toggle("is-wrong", !isCorrect);
  container.innerHTML = `
    <strong>${isCorrect ? "答对了" : "这题要再看一眼"}</strong>
    <p>${question.explanation}</p>
  `;
}

function nextPractice() {
  const list = topicQuestions(state.activeTopic);
  state.practiceIndex = (state.practiceIndex + 1) % list.length;
  renderPractice();
}

function renderWords() {
  $$("#wordTopicFilters .filter-chip").forEach((chip) => {
    chip.classList.toggle("is-active", chip.dataset.wordTopic === state.activeWordTopic);
  });
  const list = topicWords(state.activeWordTopic);
  const topic = state.activeWordTopic === "all" ? null : getTopic(state.activeWordTopic);
  const sample = shuffle(list).slice(0, state.activeWordTopic === "all" ? 20 : list.length);
  $("#wordTopicCount").textContent = topic ? `${topic.title} | 显示 ${sample.length} / ${list.length}` : `全部 | 显示 ${sample.length} / ${words.length}`;
  $("#wordGrid").innerHTML = sample
    .map(
      (item) => `
        <article class="word-card">
          <div class="word-top">
            <strong>${item.word}</strong>
            <button class="listen-button small" data-speak-word="${item.word}" type="button" aria-label="播放 ${item.word} 的荷兰语发音">
              <span aria-hidden="true">Luister</span>
            </button>
          </div>
          <span>${item.meaning}</span>
          <span>${item.topic}</span>
        </article>
      `,
    )
    .join("");
}

function renderGrammarGuide() {
  $("#grammarGrid").innerHTML = grammar
    .map(
      (item) => `
        <article class="grammar-card">
          <div>
            <strong>${item.pattern}</strong>
            <p>${item.meaning}</p>
          </div>
          <div class="grammar-example">
            <span>${item.example}</span>
            <button class="listen-button small" data-speak-grammar="${item.example}" type="button" aria-label="播放 ${item.pattern} 例句">
              <span aria-hidden="true">Luister</span>
            </button>
          </div>
        </article>
      `,
    )
    .join("");
  $("#cheatList").innerHTML = cheatSheet.map((item) => `<li>${item}</li>`).join("");
}

function goPracticeTopic(topicId) {
  state.activeTopic = topicId;
  state.practiceIndex = 0;
  renderPractice();
  showView("practice");
}

function goReviewTopic(topicId) {
  state.activeTopic = topicId;
  renderLessons();
  showView("lessons");
}

function handleReviewAction(event) {
  const target = event.target instanceof Element ? event.target : null;
  const practiceButton = target?.closest("[data-wrong-practice-topic]");
  if (practiceButton) {
    goPracticeTopic(practiceButton.dataset.wrongPracticeTopic);
    return;
  }

  const reviewButton = target?.closest("[data-review-topic]");
  if (reviewButton) {
    goReviewTopic(reviewButton.dataset.reviewTopic);
    return;
  }

  const removeButton = target?.closest("[data-remove-wrong]");
  if (removeButton) {
    removeWrongAnswer(removeButton.dataset.removeWrong);
  }
}

function renderWrongbook() {
  const entries = wrongAnswerEntries();
  $("#wrongbookCount").textContent = `${entries.length} 道错题`;
  $("#clearWrongbook").disabled = entries.length === 0;
  $("#wrongbookHint").textContent = entries.length
    ? "优先处理错得多、最近错的题；点“已掌握”可以从错题本移除。"
    : "刷题或模拟中答错的题会自动保存到这里。";
  $("#wrongbookList").innerHTML = entries.length
    ? entries.map((entry) => renderWrongQuestionCard(entry, { showActions: true })).join("")
    : `<section class="panel empty-state"><strong>目前没有错题</strong><p>做几道刷题或模拟后，这里会自动生成复习清单。</p></section>`;
}

function startMock() {
  state.mock.active = true;
  const questionCount = Math.min(MOCK_QUESTION_COUNT, questions.length);
  state.mock.questions = shuffle(questions).slice(0, questionCount);
  state.mock.index = 0;
  state.mock.answers = Array(state.mock.questions.length).fill(null);
  state.mock.result = null;
  state.mock.startedAt = Date.now();
  state.mock.deadline = Date.now() + MOCK_DURATION_MINUTES * 60 * 1000;
  clearInterval(state.mock.timer);
  state.mock.timer = setInterval(updateMockTimer, 1000);
  $("#startMock").textContent = "重新开始";
  $("#finishMock").disabled = false;
  $("#speakMockQuestion").disabled = false;
  $("#mockReport").hidden = true;
  $("#mockReport").innerHTML = "";
  renderMockQuestion();
  updateMockTimer();
}

function updateMockTimer() {
  if (!state.mock.active) return;
  const remaining = Math.max(0, state.mock.deadline - Date.now());
  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  $("#mockTimer").textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  if (remaining === 0) finishMock();
}

function renderMockQuestion() {
  const mock = state.mock;
  const question = mock.questions[mock.index];
  if (!question) return;
  const selected = mock.answers[mock.index];

  $("#mockScenario").textContent = question.scenario;
  $("#mockQuestion").textContent = question.question;
  $("#speakMockQuestion").dataset.speech = questionSpeechText(question);
  $("#mockCount").textContent = `第 ${mock.index + 1} / ${mock.questions.length} 题`;
  $("#mockMeter").style.width = `${((mock.index + 1) / mock.questions.length) * 100}%`;
  $("#mockFeedback").hidden = true;
  $("#prevMock").disabled = mock.index === 0;
  $("#nextMock").disabled = mock.index === mock.questions.length - 1;

  renderAnswers(
    $("#mockAnswers"),
    question,
    (choice) => {
      mock.answers[mock.index] = choice;
      renderMockQuestion();
    },
    selected,
  );
}

function formatDuration(milliseconds) {
  const totalSeconds = Math.max(0, Math.round(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}分${String(seconds).padStart(2, "0")}秒`;
}

function buildMockResult() {
  const finishedAt = Date.now();
  const elapsedMs = state.mock.startedAt ? finishedAt - state.mock.startedAt : MOCK_DURATION_MINUTES * 60 * 1000;
  const items = state.mock.questions.map((question, index) => {
    const response = state.mock.answers[index];
    const answered = hasQuestionResponse(question, response);
    const isCorrect = checkQuestionAnswer(question, response);
    return {
      question,
      response,
      answered,
      isCorrect,
    };
  });
  const correct = items.filter((item) => item.isCorrect).length;
  const unanswered = items.filter((item) => !item.answered).length;
  const byTopic = new Map();
  items.forEach((item) => {
    const topic = getTopic(item.question.topic);
    const stats = byTopic.get(topic.id) || { id: topic.id, title: topic.title, zhTitle: topic.zhTitle, total: 0, correct: 0, unanswered: 0 };
    stats.total += 1;
    stats.correct += item.isCorrect ? 1 : 0;
    stats.unanswered += item.answered ? 0 : 1;
    byTopic.set(topic.id, stats);
  });

  const topicsReport = [...byTopic.values()]
    .map((topic) => ({
      ...topic,
      wrong: topic.total - topic.correct,
      percentage: Math.round((topic.correct / topic.total) * 100),
    }))
    .sort((a, b) => b.wrong - a.wrong || a.percentage - b.percentage);

  return {
    total: items.length,
    correct,
    percentage: Math.round((correct / items.length) * 100),
    unanswered,
    elapsedMs,
    topics: topicsReport,
    items,
  };
}

function renderReviewAnswerList(question, response) {
  if (question.type === "short") {
    return `
      <div class="answer-review">
        <span class="is-wrong">你的答案：${renderText(selectedAnswerText(question, response))}</span>
        <span class="is-correct">参考答案：${renderText(correctAnswerText(question))}</span>
      </div>
    `;
  }

  return `
    <div class="answer-review">
      ${(question.answers || [])
        .map((answer, index) => {
          const className = index === question.correct ? "is-correct" : index === response ? "is-wrong" : "";
          return `<span class="${className}">${String.fromCharCode(65 + index)}. ${renderText(answer)}</span>`;
        })
        .join("")}
    </div>
  `;
}

function renderWrongQuestionCard(item, options = {}) {
  const question = item.question || item.questionData || item;
  const topic = getTopic(question.topic);
  const response = Object.prototype.hasOwnProperty.call(item, "response") ? item.response : item.lastResponse;
  const key = item.id || questionKey(question);
  return `
    <article class="wrong-card">
      <div class="wrong-card-head">
        <span class="pill">${renderText(topic.title)}</span>
        ${item.mistakes ? `<span class="mistake-count">错 ${item.mistakes} 次</span>` : ""}
      </div>
      ${question.scenario ? `<p class="scenario">${renderText(question.scenario)}</p>` : ""}
      <h3>${renderText(question.question)}</h3>
      ${renderReviewAnswerList(question, response)}
      <p>${renderText(question.explanation)}</p>
      ${
        options.showActions
          ? `<div class="card-actions">
              <button class="secondary-action" data-review-topic="${topic.id}" type="button">复习本章</button>
              <button class="secondary-action" data-wrong-practice-topic="${topic.id}" type="button">练这个主题</button>
              <button class="primary-action" data-remove-wrong="${renderText(key)}" type="button">已掌握</button>
            </div>`
          : ""
      }
    </article>
  `;
}

function renderMockReport(result) {
  const weakTopics = result.topics.filter((topic) => topic.wrong > 0).slice(0, 3);
  const wrongItems = result.items.filter((item) => !item.isCorrect);
  const passed = result.percentage >= 65;
  $("#mockReport").hidden = false;
  $("#mockReport").innerHTML = `
    <div class="section-heading">
      <div>
        <p class="eyebrow">Exam Report</p>
        <h2>模拟考试结果页</h2>
      </div>
    </div>
    <div class="report-grid">
      <article><span>成绩</span><strong>${result.correct}/${result.total}</strong><small>${result.percentage}%</small></article>
      <article><span>用时</span><strong>${formatDuration(result.elapsedMs)}</strong><small>45 分钟上限</small></article>
      <article><span>未答</span><strong>${result.unanswered}</strong><small>未答按错题保存</small></article>
      <article><span>练习目标</span><strong>${passed ? "达标" : "需加强"}</strong><small>建议目标 65%+</small></article>
    </div>
    ${
      weakTopics.length
        ? `<div class="topic-breakdown">
            <h3>优先复习章节</h3>
            ${weakTopics
              .map(
                (topic) => `
                  <article>
                    <div>
                      <strong>${renderText(topic.title)}</strong>
                      <span>${renderText(topic.zhTitle)} | ${topic.correct}/${topic.total} 正确</span>
                    </div>
                    <div class="card-actions">
                      <button class="secondary-action" data-review-topic="${topic.id}" type="button">看完整学习页</button>
                      <button class="primary-action" data-wrong-practice-topic="${topic.id}" type="button">练这个主题</button>
                    </div>
                  </article>
                `,
              )
              .join("")}
          </div>`
        : `<p class="report-note">这一套没有明显薄弱章节，可以继续换一套模拟保持手感。</p>`
    }
    <details class="mock-wrong-list" ${wrongItems.length ? "open" : ""}>
      <summary>本次错题 <span>${wrongItems.length} 题</span></summary>
      <div class="wrongbook-list">
        ${wrongItems.length ? wrongItems.map((item) => renderWrongQuestionCard(item)).join("") : `<p class="empty-state">本次没有错题。</p>`}
      </div>
    </details>
  `;
}

function finishMock() {
  if (!state.mock.active) return;
  clearInterval(state.mock.timer);
  state.mock.active = false;

  const result = buildMockResult();
  state.mock.result = result;
  result.items.forEach((item) => {
    recordAnswer(item.question, item.isCorrect, item.response, "mock", false);
  });
  saveProgress();

  $("#mockTimer").textContent = "完成";
  $("#mockCount").textContent = `${result.correct} / ${result.total} 正确`;
  $("#mockMeter").style.width = `${result.percentage}%`;
  $("#mockFeedback").hidden = false;
  $("#mockFeedback").className = result.percentage >= 65 ? "feedback" : "feedback is-wrong";
  $("#mockFeedback").innerHTML = `
    <strong>模拟成绩：${result.percentage}%</strong>
    <p>${result.percentage >= 65 ? "不错，继续保持速度和稳定性。" : "建议回到主题课，优先复习错得多的章节。"}${
      result.unanswered ? ` 未作答 ${result.unanswered} 题，本次按错题计算。` : ""
    }</p>
  `;
  renderMockReport(result);
  renderAnswers(
    $("#mockAnswers"),
    state.mock.questions[state.mock.index],
    () => {},
    state.mock.answers[state.mock.index],
    true,
  );
  $("#finishMock").disabled = true;
  $("#prevMock").disabled = true;
  $("#nextMock").disabled = true;
  $("#speakMockQuestion").disabled = true;
}

function bindEvents() {
  $$(".tab").forEach((tab) => tab.addEventListener("click", () => showView(tab.dataset.view)));
  $$("[data-start]").forEach((button) => button.addEventListener("click", () => showView(button.dataset.start)));
  window.addEventListener("hashchange", () => {
    const view = window.location.hash.replace("#", "");
    if (view && $(`#${view}`)) showView(view);
  });
  $("#topicSelect").addEventListener("change", (event) => {
    state.activeTopic = event.target.value;
    state.practiceIndex = 0;
    renderPractice();
  });
  $("#nextPractice").addEventListener("click", nextPractice);
  $("#resetPractice").addEventListener("click", () => {
    state.practiceIndex = 0;
    renderPractice();
  });
  $("#shuffleWords").addEventListener("click", renderWords);
  $("#speakPracticeQuestion").addEventListener("click", (event) => speakDutch(event.currentTarget.dataset.speech));
  $("#speakMockQuestion").addEventListener("click", (event) => speakDutch(event.currentTarget.dataset.speech));
  $("#clearWrongbook").addEventListener("click", () => {
    if (!wrongAnswerEntries().length) return;
    if (window.confirm("确定清空错题本吗？")) clearWrongAnswers();
  });
  $("#wrongbookList").addEventListener("click", handleReviewAction);
  $("#mockReport").addEventListener("click", handleReviewAction);
  $("#wordGrid").addEventListener("click", (event) => {
    const button = event.target instanceof Element ? event.target.closest("[data-speak-word]") : null;
    if (button) speakDutch(button.dataset.speakWord);
  });
  $("#grammarGrid").addEventListener("click", (event) => {
    const button = event.target instanceof Element ? event.target.closest("[data-speak-grammar]") : null;
    if (button) speakDutch(button.dataset.speakGrammar);
  });
  $("#startMock").addEventListener("click", startMock);
  $("#prevMock").addEventListener("click", () => {
    state.mock.index = Math.max(0, state.mock.index - 1);
    renderMockQuestion();
  });
  $("#nextMock").addEventListener("click", () => {
    state.mock.index = Math.min(state.mock.questions.length - 1, state.mock.index + 1);
    renderMockQuestion();
  });
  $("#finishMock").addEventListener("click", finishMock);
}

function init() {
  const hash = window.location.hash.replace("#", "");
  if (hash && $(`#${hash}`)) state.view = hash;
  renderLessonFilters();
  renderWordTopicFilters();
  renderLessons();
  renderPractice();
  renderWords();
  renderGrammarGuide();
  renderDashboard();
  renderWrongbook();
  bindEvents();
  showView(state.view);
}

init();
