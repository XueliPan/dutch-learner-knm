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
const reviewPlan = importedContent.reviewPlan || [];
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
    timer: null,
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
}

function recordAnswer(question, isCorrect) {
  const topicStats = state.progress.byTopic[question.topic] || { answered: 0, correct: 0 };
  topicStats.answered += 1;
  topicStats.correct += isCorrect ? 1 : 0;
  state.progress.byTopic[question.topic] = topicStats;
  state.progress.answered += 1;
  state.progress.correct += isCorrect ? 1 : 0;
  saveProgress();
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

function renderReviewPlan() {
  if (!reviewPlan.length) return;
  $("#reviewPlanPanel").hidden = false;
  $("#reviewPlanGrid").innerHTML = reviewPlan
    .map(
      (item) => `
        <article class="review-item">
          <strong>${item.day}</strong>
          <p>${item.task}</p>
        </article>
      `,
    )
    .join("");
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
  $$(".filter-chip").forEach((chip) => chip.classList.toggle("is-active", chip.dataset.topic === state.activeTopic));
  const currentFirst = [getTopic(state.activeTopic), ...topics.filter((topic) => topic.id !== state.activeTopic)];
  $("#lessonGrid").innerHTML = currentFirst
    .map(
      (topic) => `
        <article class="lesson-card" style="--topic-color: ${topic.color}">
          <header>
            <div>
              <p class="eyebrow">${topic.title}</p>
              <h2>${topic.zhTitle}</h2>
            </div>
            <span class="pill">${topicQuestions(topic.id).length} 题</span>
          </header>
          <p>${topic.summary}</p>
          <div class="tag-stack">
            ${(topic.keywords || []).map((word) => `<span class="tag">${word}</span>`).join("")}
          </div>
          ${
            topic.examPoints?.length
              ? `<div class="mini-section"><strong>考试重点</strong><ul>${topic.examPoints.map((item) => `<li>${item}</li>`).join("")}</ul></div>`
              : ""
          }
          ${
            topic.confusing?.length
              ? `<div class="mini-section"><strong>容易混淆</strong><ul>${topic.confusing.slice(0, 4).map((item) => `<li>${item}</li>`).join("")}</ul></div>`
              : ""
          }
          <ul>
            ${(topic.learn || topic.lifeTips || []).slice(0, 3).map((item) => `<li>${item}</li>`).join("")}
          </ul>
          <button class="secondary-action full" data-practice-topic="${topic.id}" type="button">练这个主题</button>
        </article>
      `,
    )
    .join("");

  $$("[data-practice-topic]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeTopic = button.dataset.practiceTopic;
      state.practiceIndex = 0;
      renderPractice();
      showView("practice");
    });
  });
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
    recordAnswer(question, isCorrect);
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

function startMock() {
  state.mock.active = true;
  const questionCount = Math.min(MOCK_QUESTION_COUNT, questions.length);
  state.mock.questions = shuffle(questions).slice(0, questionCount);
  state.mock.index = 0;
  state.mock.answers = Array(state.mock.questions.length).fill(null);
  state.mock.deadline = Date.now() + MOCK_DURATION_MINUTES * 60 * 1000;
  clearInterval(state.mock.timer);
  state.mock.timer = setInterval(updateMockTimer, 1000);
  $("#startMock").textContent = "重新开始";
  $("#finishMock").disabled = false;
  $("#speakMockQuestion").disabled = false;
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

function finishMock() {
  if (!state.mock.active) return;
  clearInterval(state.mock.timer);
  state.mock.active = false;

  let correct = 0;
  state.mock.questions.forEach((question, index) => {
    const isCorrect = checkQuestionAnswer(question, state.mock.answers[index]);
    correct += isCorrect ? 1 : 0;
    recordAnswer(question, isCorrect);
  });

  const percentage = Math.round((correct / state.mock.questions.length) * 100);
  const unanswered = state.mock.answers.filter((answer, index) => !hasQuestionResponse(state.mock.questions[index], answer)).length;
  $("#mockTimer").textContent = "完成";
  $("#mockCount").textContent = `${correct} / ${state.mock.questions.length} 正确`;
  $("#mockMeter").style.width = `${percentage}%`;
  $("#mockFeedback").hidden = false;
  $("#mockFeedback").className = percentage >= 65 ? "feedback" : "feedback is-wrong";
  $("#mockFeedback").innerHTML = `
    <strong>模拟成绩：${percentage}%</strong>
    <p>${percentage >= 65 ? "不错，继续保持速度和稳定性。" : "建议回到主题课，优先复习错得多的主题。"}${
      unanswered ? ` 未作答 ${unanswered} 题，本次按错题计算。` : ""
    }</p>
  `;
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
  renderReviewPlan();
  bindEvents();
  showView(state.view);
}

init();
