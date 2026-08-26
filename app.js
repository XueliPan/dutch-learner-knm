import { createClient } from "@supabase/supabase-js";
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
const FEEDBACK_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSfy8fkoTYjD7vSWajsO_lBNmqO_EuLCr1kGr0YSrCEFujwYDA/viewform?usp=publish-editor";
const MOCK_QUESTION_COUNT = 40;
const MOCK_DURATION_MINUTES = 45;
const LANGUAGE_KEY = "knm-cn-language-v1";
const DEFAULT_SUPABASE_URL = "https://ywaamiepijeagtocqhpw.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "sb_publishable_IvYN26YJvO9GvpC7v8wIlg_PYH5UFmO";
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;
const SUPABASE_REDIRECT_URL = window.location.origin + window.location.pathname;
const supabase = SUPABASE_URL && SUPABASE_ANON_KEY
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        detectSessionInUrl: false,
        flowType: "pkce",
      },
    })
  : null;
const DUTCH_TERM_EN = {
  afspraak: "appointment",
  apotheek: "pharmacy",
  arbeidscontract: "employment contract",
  antwoordt: "answers",
  belasting: "tax",
  belastingaangifte: "tax return",
  belastingen: "taxes",
  belgië: "Belgium",
  bereikbaarheid: "accessibility",
  beroep: "profession",
  bescherming: "protection",
  bevrijding: "liberation",
  bijstand: "social assistance",
  boete: "fine",
  brief: "letter",
  burgemeester: "mayor",
  burger: "citizen",
  burgers: "citizens",
  buren: "neighbors",
  buurman: "neighbor",
  buurland: "neighboring country",
  buurlanden: "neighboring countries",
  cao: "collective labor agreement",
  consultatiebureau: "child health clinic",
  contract: "contract",
  democratie: "democracy",
  digid: "DigiD",
  dijk: "dike",
  dijken: "dikes",
  diploma: "diploma",
  discriminatie: "discrimination",
  dokter: "doctor",
  doorverwijzen: "refer",
  duinen: "dunes",
  duitsland: "Germany",
  europa: "Europe",
  familie: "family",
  "eigen risico": "deductible",
  gemeente: "municipality",
  gemeenteraad: "municipal council",
  gecondoleerd: "condolences",
  gefeliciteerd: "congratulations",
  gelijk: "equal",
  "gelijke rechten": "equal rights",
  gezondheidszorg: "healthcare",
  geboorteakte: "birth certificate",
  grondrechten: "fundamental rights",
  grondwet: "constitution",
  huisarts: "general practitioner",
  huur: "rent",
  huurder: "tenant",
  huurcontract: "rental contract",
  huurtoeslag: "rent benefit",
  inkomen: "income",
  inburgering: "civic integration",
  inchecken: "check in",
  ind: "Immigration and Naturalisation Service",
  informeel: "informal",
  kinderopvang: "childcare",
  klacht: "complaint or symptom",
  koning: "king",
  koningin: "queen",
  koningsdag: "King's Day",
  kust: "coast",
  land: "country",
  landen: "countries",
  leerplicht: "compulsory education",
  ligt: "is located",
  loon: "wage",
  loonstrook: "payslip",
  maatschappij: "society",
  mantelzorg: "informal care",
  mbo: "secondary vocational education",
  mening: "opinion",
  minister: "minister",
  nederland: "the Netherlands",
  noordzee: "North Sea",
  onderwijs: "education",
  oosten: "east",
  "openbaar vervoer": "public transport",
  oudergesprek: "parent-teacher meeting",
  parlement: "parliament",
  paspoort: "passport",
  pensioen: "pension",
  polder: "polder",
  politie: "police",
  provincie: "province",
  provincies: "provinces",
  randstad: "Randstad",
  recept: "prescription",
  rechter: "judge",
  regering: "government",
  rekening: "bill or account",
  rijbewijs: "driving licence",
  schoolarts: "school doctor",
  "sociale huur": "social housing rent",
  sollicitatie: "job application",
  sollicitatiegesprek: "job interview",
  spoed: "emergency",
  stemmen: "vote",
  uitchecken: "check out",
  uitkering: "benefit",
  uwv: "employee insurance agency",
  vacature: "job vacancy",
  verhuurder: "landlord",
  verklaring: "certificate or statement",
  verkiezingen: "elections",
  verzekering: "insurance",
  verkeersregels: "traffic rules",
  verhuist: "moves house",
  vraagt: "asks",
  vrijwilligerswerk: "volunteer work",
  woning: "home",
  woningcorporatie: "housing association",
  werelddeel: "continent",
  zee: "sea",
  zorgtoeslag: "healthcare benefit",
  zorgverzekering: "health insurance",
  zuiden: "south",
};
const DUTCH_TERM_ZH = {
  antwoordt: "回答",
  belgië: "比利时",
  buurland: "邻国",
  buurlanden: "邻国",
  duitsland: "德国",
  europa: "欧洲",
  familie: "家人/家庭",
  kust: "海岸",
  land: "国家",
  landen: "国家",
  ligt: "位于",
  nederland: "荷兰",
  noordzee: "北海",
  oosten: "东方",
  verhuist: "搬家/迁居",
  vraagt: "询问",
  werelddeel: "大洲",
  zee: "海",
  zuiden: "南方",
};
const DUTCH_REASON_ZH = {
  "Nederland ligt in Europa": "荷兰位于欧洲。",
  "Nederland ligt aan de Noordzee": "荷兰靠近北海。",
  "Duitsland ligt oostelijk": "德国在荷兰东边。",
  "België ligt zuidelijk": "比利时在荷兰南边。",
  "Buurlanden = Duitsland + België": "荷兰的邻国是德国和比利时。",
  "Duitsland ten oosten": "德国在东边。",
  "België ligt ten zuiden": "比利时在南边。",
  "China veel groter": "中国比荷兰大得多。",
  "Nederland ≈ 40.000 km²": "荷兰面积约 4 万平方公里。",
  "Nederland is ongeveer 300 km lang": "荷兰南北长度约 300 公里。",
  "Nederland is ongeveer 180 km breed": "荷兰东西宽度约 180 公里。",
  "Nederland heeft 12 provincies": "荷兰有 12 个省。",
  "Amsterdam is de hoofdstad": "阿姆斯特丹是首都。",
  "Den Haag = regering": "海牙是政府所在地。",
  "Rotterdam = haven": "鹿特丹以港口闻名。",
  "Utrecht ligt centraal": "乌得勒支位于荷兰中部。",
};
const glossaryTerms = buildGlossaryTerms(words);
const glossaryTermMap = new Map(glossaryTerms.map((item) => [item.term, item]));
const translations = {
  zh: {
    pageTitle: "荷兰 KNM 中文备考练习 | Dutch Learner KNM",
    brandAria: "KNM 通关练习首页",
    mainNavAria: "主要页面",
    brandTitle: "KNM 通关练习",
    brandSubtitle: "中文学习助手",
    tabDashboard: "总览",
    tabLessons: "主题",
    tabPractice: "刷题",
    tabMock: "模拟",
    tabWrongbook: "错题",
    tabWords: "词卡",
    tabGrammar: "语法/速记",
    languageToggle: "English",
    languageToggleAria: "Switch to English",
    authOpen: "登录/同步",
    authSignedIn: "已同步",
    authGuest: "游客模式",
    authTitle: "登录同步学习进度",
    authCopy: "登录后可以把答题进度、错题本和模拟考试记录保存到云端。未登录时仍会保存在本浏览器。",
    authEmail: "邮箱",
    authPassword: "密码",
    authSignIn: "登录",
    authSignUp: "注册",
    authGoogle: "用 Google 登录",
    authSignOut: "退出登录",
    authSyncNow: "立即同步",
    authClose: "关闭",
    authNotConfigured: "登录功能还没有配置 Supabase 项目，当前使用游客模式。",
    authConfiguredHint: "支持邮箱密码和 Google 登录。",
    authNeedEmailPassword: "请输入邮箱和至少 6 位密码。",
    authCheckEmail: "注册成功，请根据邮箱提示完成确认后再登录。",
    authSigningIn: "正在登录...",
    authSyncing: "正在同步学习进度...",
    authSynced: "学习进度已同步到云端。",
    authSyncFailed: "同步失败，已先保存在本浏览器。",
    authSignedOut: "已退出登录，之后会继续使用游客模式。",
    heroTitle: "用中文理解荷兰社会，用荷兰语通过 KNM。",
    heroCopy: "按主题学习常见生活场景，记住核心荷兰语关键词，并用考试风格选择题训练判断速度。",
    heroPrimary: "开始刷题",
    heroSecondary: "先学主题",
    statsAria: "学习进度",
    statAnswered: "已答题",
    statAnsweredHint: "本浏览器自动保存",
    statAnsweredHintSynced: "已登录，云端同步",
    statAccuracy: "正确率",
    statAccuracyHint: "包含刷题和模拟",
    statStreak: "连续学习",
    statStreakHint: "每天打开即可延续",
    statNext: "下一步",
    statNextHint: "优先补最弱主题",
    studyPathTitle: "今日学习路线",
    studyStep1Title: "10 分钟看主题",
    studyStep1Copy: "先读中文解释，再读荷兰语关键词，建立场景感。",
    studyStep2Title: "15 分钟刷题",
    studyStep2Copy: "每题看解析，错题会进入弱项记录。",
    studyStep3Title: "5 分钟词卡复习",
    studyStep3Copy: "把关键词读出声，训练考试时快速识别。",
    examNoteTitle: "考试提醒",
    examNoteCopy1:
      "DUO 说明：KNM 是电脑考试，题目围绕多个社会主题，例如 <strong>wonen</strong> 和 <strong>werk en inkomen</strong>，考试时间为 <strong>45 分钟</strong>，模拟时建议按 <strong>40 道题</strong> 训练。",
    examNoteCopy2:
      "题库只保留新版 10 章原创场景题和 2 套 DUO oefenexamen；正式考试前仍建议到 DUO 官网熟悉考试入口。",
    duoPracticeLink: "打开 DUO 官方练习",
    lessonsTitle: "KNM 主题课",
    lessonFiltersAria: "主题筛选",
    practiceTitle: "按主题刷题",
    topicSelectAria: "选择练习主题",
    practiceHint: "悬浮荷兰语关键词看中英文释义；选择答案后查看中文理解和选项解析。",
    resetPractice: "重开本主题",
    shufflePractice: "随机顺序",
    speakQuestionAria: "播放本题荷兰语发音",
    nextQuestion: "下一题",
    prevQuestion: "上一题",
    mockTitle: "45 分钟模拟模式",
    mockSourceLabel: "题库",
    mockSourceAria: "选择模拟题库",
    mockSourceSiteOption: "网站综合模拟题",
    startMock: "开始模拟",
    restartMock: "重新开始",
    finishMock: "交卷",
    mockMeta: "40 题 / 45 分钟",
    wrongbookTitle: "错题本",
    clearWrongbook: "清空错题",
    wordsTitle: "高频词卡",
    shuffleWords: "换一组",
    wordFiltersAria: "词汇主题筛选",
    grammarTitle: "语法 / 考前速记",
    grammarPatternsTitle: "高频语法",
    cheatSheetTitle: "考前一页速记",
    footerMade: "Made for Chinese KNM learners.",
    footerDuo: "请用官方 DUO 材料确认最新考试要求。",
    feedbackButton: "发现问题",
    feedbackAria: "发现问题或反馈建议",
    siteMockLabel: "网站综合模拟题",
    siteMockDescription: "随机抽取新版 10 章原创场景题，不混入 DUO 官方套题。",
    duo1Description: "使用第 1 套 DUO 官方模拟练习题，按原套题顺序完成 40 题。",
    duo2Description: "使用第 2 套 DUO 官方模拟练习题，按原套题顺序完成 40 题。",
    notAnswered: "未作答",
    unknownOption: "未知选项",
    day: "天",
    questionsUnit: "道题",
    wordsUnit: "个词",
    groupsUnit: "组内容",
    itemsUnit: "条",
    knowledgeUnits: "个知识单元",
    imageRefs: "张图片引用",
    coreWords: "个核心词",
    practiceTopic: "练这个主题",
    memoryHooksTitle: "看到关键词就联想",
    fullChapterTitle: (chapter) => `第 ${chapter} 章完整学习页`,
    chapterSummary: (units, imageCount, vocabCount) =>
      `${units} 个知识单元，${imageCount} 张图片引用，${vocabCount} 个核心词。`,
    learningGoals: "本章学习目标",
    coreVocabulary: "本章核心词汇表",
    dutch: "荷兰语",
    chinese: "中文",
    exampleOrMemory: "例句或记忆",
    commonMistakes: "容易出错的原句与正确表达",
    originalText: "原资料表达",
    suggestedText: "建议表达",
    chapterCheatSheet: (chapter) => `第 ${chapter} 章一页速记`,
    all: "全部",
    showWordsAll: (sample, total) => `全部 | 显示 ${sample} / ${total}`,
    showWordsTopic: (topic, sample, total) => `${topic} | 显示 ${sample} / ${total}`,
    questionProgress: (current, total) => `第 ${current} / ${total} 题`,
    typeAnswer: "Typ uw antwoord",
    check: "检查",
    referenceAnswer: "参考答案",
    correctFeedback: "答对了",
    wrongFeedback: "这题要再看一眼",
    chineseQuestionTitle: "中文理解",
    fullQuestionTranslation: "完整题目",
    chineseQuestionContext: "本题知识点",
    chineseQuestionFocus: "题目在问",
    optionExplanationTitle: "选项解析",
    optionTranslation: "中文",
    optionCorrectReason: "正确。核心依据：",
    optionSelectedWrongReason: "你选择了这一项，但它不符合本题核心依据：",
    optionDistractorReason: "干扰项。本题核心依据是：",
    mockReady: "准备开始",
    mockIntroSite: "按真实节奏练习：45 分钟完成 40 题，每题大约 1 分钟。",
    mockIntroDuo: (label) => `${label}：按官方练习套题顺序完成 40 题。`,
    noQuestionsAlert: "这个题库暂时没有可用题目。",
    wrongbookCount: (count) => `${count} 道错题`,
    wrongbookHintFilled: "优先处理错得多、最近错的题；点“已掌握”可以从错题本移除。",
    wrongbookHintEmpty: "刷题或模拟中答错的题会自动保存到这里。",
    emptyWrongbookTitle: "目前没有错题",
    emptyWrongbookCopy: "做几道刷题或模拟后，这里会自动生成复习清单。",
    confirmClearWrongbook: "确定清空错题本吗？",
    feedbackPending: "反馈入口正在准备中。",
    completed: "完成",
    correctCount: (correct, total) => `${correct} / ${total} 正确`,
    minutesLimit: "45 分钟上限",
    savedAsWrong: "未答按错题保存",
    targetScore: "建议目标 65%+",
    mockReportTitle: "模拟考试结果页",
    score: "成绩",
    timeSpent: "用时",
    unanswered: "未答",
    practiceGoal: "练习目标",
    passed: "达标",
    needsWork: "需加强",
    priorityReview: "优先复习章节",
    correctLabel: "正确",
    viewFullChapter: "看完整学习页",
    reportNoWeakTopic: "这一套没有明显薄弱章节，可以继续换一套模拟保持手感。",
    wrongItemsSummary: (count) => `本次错题 ${count} 题`,
    noWrongThisMock: "本次没有错题。",
    mockScore: (score) => `模拟成绩：${score}%`,
    mockPassCopy: "不错，继续保持速度和稳定性。",
    mockFailCopy: "建议回到主题课，优先复习错得多的章节。",
    unansweredCopy: (count) => ` 未作答 ${count} 题，本次按错题计算。`,
    yourAnswer: "你的答案",
    mastered: "已掌握",
    reviewChapter: "复习本章",
    mistakeCount: (count) => `错 ${count} 次`,
    speechUnavailable: "Deze browser kan de uitspraak niet afspelen.",
  },
  en: {
    pageTitle: "Dutch Learner KNM | Bilingual KNM Exam Practice App",
    brandAria: "Dutch Learner KNM home",
    mainNavAria: "Main navigation",
    brandTitle: "Dutch Learner KNM",
    brandSubtitle: "Bilingual study app",
    tabDashboard: "Overview",
    tabLessons: "Themes",
    tabPractice: "Practice",
    tabMock: "Mock Exam",
    tabWrongbook: "Mistakes",
    tabWords: "Flashcards",
    tabGrammar: "Grammar",
    languageToggle: "中文",
    languageToggleAria: "Switch to Chinese",
    authOpen: "Sign in / Sync",
    authSignedIn: "Synced",
    authGuest: "Guest mode",
    authTitle: "Sign in to sync progress",
    authCopy: "After signing in, your practice progress, mistake review, and mock exam summaries can sync to the cloud. Without sign-in, progress stays in this browser.",
    authEmail: "Email",
    authPassword: "Password",
    authSignIn: "Sign In",
    authSignUp: "Sign Up",
    authGoogle: "Continue with Google",
    authSignOut: "Sign Out",
    authSyncNow: "Sync Now",
    authClose: "Close",
    authNotConfigured: "Supabase is not configured yet, so the app is currently using guest mode.",
    authConfiguredHint: "Email/password and Google sign-in are supported.",
    authNeedEmailPassword: "Enter an email and a password with at least 6 characters.",
    authCheckEmail: "Sign-up succeeded. Check your email to confirm the account, then sign in.",
    authSigningIn: "Signing in...",
    authSyncing: "Syncing learning progress...",
    authSynced: "Learning progress synced to the cloud.",
    authSyncFailed: "Sync failed. Progress is still saved in this browser.",
    authSignedOut: "Signed out. The app will continue in guest mode.",
    heroTitle: "A bilingual KNM study app for Chinese-speaking learners.",
    heroCopy:
      "Learn Dutch society topics through Chinese explanations, Dutch keywords, pronunciation, chapter practice, DUO mock sets, and a timed exam mode.",
    heroPrimary: "Start Practice",
    heroSecondary: "Study Themes",
    statsAria: "Study progress",
    statAnswered: "Answered",
    statAnsweredHint: "Saved in this browser",
    statAnsweredHintSynced: "Signed in, cloud sync on",
    statAccuracy: "Accuracy",
    statAccuracyHint: "Practice and mock exams",
    statStreak: "Study Streak",
    statStreakHint: "Open daily to continue",
    statNext: "Next Step",
    statNextHint: "Focus on the weakest theme",
    studyPathTitle: "Suggested Study Flow",
    studyStep1Title: "10 min theme review",
    studyStep1Copy: "Read the Chinese explanation first, then scan the Dutch keywords in context.",
    studyStep2Title: "15 min practice",
    studyStep2Copy: "Answer exam-style multiple-choice questions and review explanations immediately.",
    studyStep3Title: "5 min flashcards",
    studyStep3Copy: "Listen and repeat key Dutch words to improve recognition speed.",
    examNoteTitle: "Exam Context",
    examNoteCopy1:
      "DUO describes KNM as a computer-based exam covering Dutch society topics such as <strong>wonen</strong> and <strong>werk en inkomen</strong>. The app trains with a <strong>45-minute</strong>, <strong>40-question</strong> mock format.",
    examNoteCopy2:
      "The question bank keeps only the updated 10-chapter original scenario questions and two DUO oefenexamen sets. Learners should still check DUO for official exam requirements.",
    duoPracticeLink: "Open DUO official practice",
    lessonsTitle: "KNM Theme Lessons",
    lessonFiltersAria: "Theme filters",
    practiceTitle: "Chapter Practice",
    topicSelectAria: "Choose a practice theme",
    practiceHint: "Hover over Dutch keywords for Chinese and English meanings; answer to see Chinese study notes and option explanations.",
    resetPractice: "Restart This Theme",
    shufflePractice: "Shuffle Questions",
    speakQuestionAria: "Play Dutch pronunciation for this question",
    nextQuestion: "Next Question",
    prevQuestion: "Previous Question",
    mockTitle: "45-Minute Mock Exam",
    mockSourceLabel: "Question Bank",
    mockSourceAria: "Choose a mock question bank",
    mockSourceSiteOption: "Site Comprehensive Mock",
    startMock: "Start Mock",
    restartMock: "Restart Mock",
    finishMock: "Submit Exam",
    mockMeta: "40 questions / 45 minutes",
    wrongbookTitle: "Mistake Review",
    clearWrongbook: "Clear Mistakes",
    wordsTitle: "High-Frequency Flashcards",
    shuffleWords: "Shuffle",
    wordFiltersAria: "Vocabulary theme filters",
    grammarTitle: "Grammar / Quick Review",
    grammarPatternsTitle: "High-Frequency Grammar",
    cheatSheetTitle: "One-Page Exam Notes",
    footerMade: "Built as a bilingual study tool for Chinese KNM learners.",
    footerDuo: "Always verify official exam requirements with DUO.",
    feedbackButton: "Feedback",
    feedbackAria: "Report an issue or send feedback",
    siteMockLabel: "Site Comprehensive Mock",
    siteMockDescription:
      "Randomly draws from the updated 10-chapter original scenario questions, while keeping DUO official sets separate.",
    duo1Description: "Uses DUO official practice set 1 in its original 40-question sequence.",
    duo2Description: "Uses DUO official practice set 2 in its original 40-question sequence.",
    notAnswered: "Not answered",
    unknownOption: "Unknown option",
    day: "days",
    questionsUnit: "questions",
    wordsUnit: "words",
    groupsUnit: "content groups",
    itemsUnit: "items",
    knowledgeUnits: "knowledge units",
    imageRefs: "image references",
    coreWords: "core words",
    practiceTopic: "Practice This Theme",
    memoryHooksTitle: "Keyword Memory Hooks",
    fullChapterTitle: (chapter) => `Full Study Page: Chapter ${chapter}`,
    chapterSummary: (units, imageCount, vocabCount) =>
      `${units} knowledge units, ${imageCount} image references, ${vocabCount} core words.`,
    learningGoals: "Learning Goals",
    coreVocabulary: "Core Vocabulary",
    dutch: "Dutch",
    chinese: "Chinese",
    exampleOrMemory: "Example or memory cue",
    commonMistakes: "Common Source Text Corrections",
    originalText: "Original wording",
    suggestedText: "Suggested wording",
    chapterCheatSheet: (chapter) => `Chapter ${chapter} One-Page Review`,
    all: "All",
    showWordsAll: (sample, total) => `All | Showing ${sample} / ${total}`,
    showWordsTopic: (topic, sample, total) => `${topic} | Showing ${sample} / ${total}`,
    questionProgress: (current, total) => `Question ${current} / ${total}`,
    typeAnswer: "Type your answer",
    check: "Check",
    referenceAnswer: "Reference answer",
    correctFeedback: "Correct",
    wrongFeedback: "Review this one again",
    chineseQuestionTitle: "Chinese Understanding",
    fullQuestionTranslation: "Full question",
    chineseQuestionContext: "Knowledge point",
    chineseQuestionFocus: "Question focus",
    optionExplanationTitle: "Option Notes",
    optionTranslation: "Chinese",
    optionCorrectReason: "Correct. Key reason:",
    optionSelectedWrongReason: "You chose this option, but it does not match the key reason:",
    optionDistractorReason: "Distractor. The key reason is:",
    mockReady: "Ready to start",
    mockIntroSite: "Practice at exam pace: 40 questions in 45 minutes, about one minute per question.",
    mockIntroDuo: (label) => `${label}: complete the 40 questions in the official practice order.`,
    noQuestionsAlert: "This question bank does not have available questions yet.",
    wrongbookCount: (count) => `${count} mistake${count === 1 ? "" : "s"}`,
    wrongbookHintFilled: "Prioritize recent and repeated mistakes. Click “Mastered” to remove a question.",
    wrongbookHintEmpty: "Wrong answers from practice and mock exams will be saved here automatically.",
    emptyWrongbookTitle: "No mistakes yet",
    emptyWrongbookCopy: "After you practice or take a mock exam, this page will become a review list.",
    confirmClearWrongbook: "Clear all saved mistakes?",
    feedbackPending: "The feedback form is not ready yet.",
    completed: "Completed",
    correctCount: (correct, total) => `${correct} / ${total} correct`,
    minutesLimit: "45-minute limit",
    savedAsWrong: "Unanswered questions are saved as mistakes",
    targetScore: "Suggested goal: 65%+",
    mockReportTitle: "Mock Exam Report",
    score: "Score",
    timeSpent: "Time",
    unanswered: "Unanswered",
    practiceGoal: "Goal",
    passed: "On Track",
    needsWork: "Needs Review",
    priorityReview: "Priority Review Themes",
    correctLabel: "correct",
    viewFullChapter: "Open Full Study Page",
    reportNoWeakTopic: "No obvious weak theme in this set. Try another mock to keep your exam rhythm.",
    wrongItemsSummary: (count) => `Mistakes in this mock ${count}`,
    noWrongThisMock: "No mistakes in this mock.",
    mockScore: (score) => `Mock score: ${score}%`,
    mockPassCopy: "Good work. Keep practicing speed and consistency.",
    mockFailCopy: "Review the theme lessons, starting with the weakest chapters.",
    unansweredCopy: (count) => ` ${count} unanswered question${count === 1 ? "" : "s"} saved as incorrect.`,
    yourAnswer: "Your answer",
    mastered: "Mastered",
    reviewChapter: "Review Chapter",
    mistakeCount: (count) => `${count} mistake${count === 1 ? "" : "s"}`,
    speechUnavailable: "This browser cannot play pronunciation.",
  },
};

const MOCK_SOURCES = {
  site: {
    labelKey: "siteMockLabel",
    descriptionKey: "siteMockDescription",
  },
  "duo-1": {
    label: "DUO oefenexamen 1",
    source: "DUO oefenexamen 1",
    descriptionKey: "duo1Description",
  },
  "duo-2": {
    label: "DUO oefenexamen 2",
    source: "DUO oefenexamen 2",
    descriptionKey: "duo2Description",
  },
};

const STORAGE_KEY = "knm-cn-progress-v1";
const state = {
  view: "dashboard",
  language: loadLanguage(),
  activeTopic: topics[0]?.id || "wonen",
  activeWordTopic: "all",
  mockSource: "duo-1",
  practiceIndex: 0,
  practiceOrderTopic: "",
  practiceOrder: [],
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

const authState = {
  configured: Boolean(supabase),
  initialized: false,
  session: null,
  user: null,
  syncing: false,
  messageKey: supabase ? "authConfiguredHint" : "authNotConfigured",
  lastSyncedUserId: null,
  saveTimer: null,
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));
let currentAudio = null;

function loadLanguage() {
  const saved = localStorage.getItem(LANGUAGE_KEY);
  return saved === "en" ? "en" : "zh";
}

function t(key, ...args) {
  const value = translations[state?.language || "zh"]?.[key] ?? translations.zh[key] ?? key;
  return typeof value === "function" ? value(...args) : value;
}

function applyI18n() {
  document.documentElement.lang = state.language === "en" ? "en" : "zh-CN";
  document.title = t("pageTitle");
  $$("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  $$("[data-i18n-html]").forEach((element) => {
    element.innerHTML = t(element.dataset.i18nHtml);
  });
  $$("[data-i18n-aria-label]").forEach((element) => {
    element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
  });
  const toggle = $("#languageToggle");
  if (toggle) {
    toggle.textContent = t("languageToggle");
    toggle.setAttribute("aria-label", t("languageToggleAria"));
  }
  renderAuthControls();
}

function setLanguage(language) {
  state.language = language === "en" ? "en" : "zh";
  localStorage.setItem(LANGUAGE_KEY, state.language);
  queueCloudProgressSave();
  applyI18n();
  renderLessonFilters();
  renderWordTopicFilters();
  renderLessons();
  renderPractice();
  renderWords();
  renderGrammarGuide();
  renderDashboard();
  renderWrongbook();
  if (state.mock.active) {
    $("#mockSourcePill").textContent = mockSourceConfig().label;
    $("#startMock").textContent = t("restartMock");
    renderMockQuestion();
  } else if (state.mock.result) {
    renderMockReport(state.mock.result);
  } else {
    renderMockIntro();
  }
  showView(state.view);
}

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

function mergeProgress(localProgress, cloudProgress) {
  const fallback = loadProgress();
  const local = { ...fallback, ...(localProgress || {}) };
  const cloud = { ...fallback, ...(cloudProgress || {}) };
  const topicIds = new Set([...Object.keys(local.byTopic || {}), ...Object.keys(cloud.byTopic || {})]);
  const byTopic = {};
  topicIds.forEach((topicId) => {
    const localStats = local.byTopic?.[topicId] || { answered: 0, correct: 0 };
    const cloudStats = cloud.byTopic?.[topicId] || { answered: 0, correct: 0 };
    byTopic[topicId] = {
      answered: Math.max(localStats.answered || 0, cloudStats.answered || 0),
      correct: Math.max(localStats.correct || 0, cloudStats.correct || 0),
    };
  });

  const wrongAnswers = { ...(cloud.wrongAnswers || {}) };
  Object.entries(local.wrongAnswers || {}).forEach(([key, localEntry]) => {
    const cloudEntry = wrongAnswers[key];
    if (!cloudEntry) {
      wrongAnswers[key] = localEntry;
      return;
    }
    wrongAnswers[key] = {
      ...cloudEntry,
      ...localEntry,
      mistakes: Math.max(localEntry.mistakes || 0, cloudEntry.mistakes || 0),
      lastWrongAt:
        new Date(localEntry.lastWrongAt || 0) > new Date(cloudEntry.lastWrongAt || 0)
          ? localEntry.lastWrongAt
          : cloudEntry.lastWrongAt,
      lastResponse:
        new Date(localEntry.lastWrongAt || 0) > new Date(cloudEntry.lastWrongAt || 0)
          ? localEntry.lastResponse
          : cloudEntry.lastResponse,
    };
  });

  return {
    ...fallback,
    ...cloud,
    ...local,
    answered: Math.max(local.answered || 0, cloud.answered || 0),
    correct: Math.max(local.correct || 0, cloud.correct || 0),
    byTopic,
    wrongAnswers,
    lastVisit: [local.lastVisit, cloud.lastVisit].filter(Boolean).sort().pop() || fallback.lastVisit,
    streak: Math.max(local.streak || 1, cloud.streak || 1),
  };
}

function persistLocalProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress));
}

function saveProgress() {
  persistLocalProgress();
  renderDashboard();
  if (state.view === "wrongbook") renderWrongbook();
  queueCloudProgressSave();
}

function setAuthMessage(messageKey) {
  authState.messageKey = messageKey;
  renderAuthControls();
}

function renderAuthControls() {
  const authButton = $("#authButton");
  const authStatus = $("#authStatus");
  if (!authButton || !authStatus) return;

  authButton.textContent = authState.user ? t("authSignedIn") : t("authOpen");
  authButton.classList.toggle("is-synced", Boolean(authState.user));
  authStatus.textContent = authState.user
    ? authState.user.email || t("authSignedIn")
    : authState.configured
      ? t("authGuest")
      : t("authGuest");

  const modalStatus = $("#authModalStatus");
  if (modalStatus) modalStatus.textContent = t(authState.messageKey);
  const userLine = $("#authUserLine");
  if (userLine) userLine.textContent = authState.user?.email || t("authGuest");
  const signedInActions = $("#authSignedInActions");
  if (signedInActions) signedInActions.hidden = !authState.user;
  const form = $("#authForm");
  if (form) form.hidden = Boolean(authState.user) || !authState.configured;
  const googleButton = $("#authGoogle");
  if (googleButton) googleButton.hidden = Boolean(authState.user) || !authState.configured;
}

function openAuthModal() {
  renderAuthControls();
  const modal = $("#authModal");
  if (modal) modal.hidden = false;
  $("#authEmail")?.focus();
}

function closeAuthModal() {
  const modal = $("#authModal");
  if (modal) modal.hidden = true;
}

async function saveCloudState() {
  if (!supabase || !authState.user) return;
  authState.syncing = true;
  setAuthMessage("authSyncing");
  const { error } = await supabase.from("user_learning_state").upsert({
    user_id: authState.user.id,
    progress: state.progress,
    language: state.language,
    updated_at: new Date().toISOString(),
  });
  authState.syncing = false;
  setAuthMessage(error ? "authSyncFailed" : "authSynced");
}

function queueCloudProgressSave() {
  if (!supabase || !authState.user) return;
  clearTimeout(authState.saveTimer);
  authState.saveTimer = setTimeout(() => {
    saveCloudState();
  }, 600);
}

async function syncProgressFromCloud() {
  if (!supabase || !authState.user) return;
  authState.syncing = true;
  setAuthMessage("authSyncing");
  const { data, error } = await supabase
    .from("user_learning_state")
    .select("progress, language")
    .eq("user_id", authState.user.id)
    .maybeSingle();

  if (error) {
    authState.syncing = false;
    setAuthMessage("authSyncFailed");
    return;
  }

  if (data?.progress) {
    state.progress = mergeProgress(state.progress, data.progress);
    if (data.language === "zh" || data.language === "en") state.language = data.language;
  }
  persistLocalProgress();
  localStorage.setItem(LANGUAGE_KEY, state.language);
  renderDashboard();
  renderWrongbook();
  applyI18n();
  await saveCloudState();
}

function applyAuthSession(session) {
  authState.session = session;
  authState.user = session?.user || null;
  if (authState.user) closeAuthModal();
  renderAuthControls();
  renderDashboard();
  if (!authState.user) return;
  if (authState.lastSyncedUserId === authState.user.id) return;
  authState.lastSyncedUserId = authState.user.id;
  window.setTimeout(() => {
    syncProgressFromCloud().catch(() => setAuthMessage("authSyncFailed"));
  }, 0);
}

function cleanAuthRedirectUrl() {
  const url = new URL(window.location.href);
  ["code", "state", "error", "error_code", "error_description"].forEach((key) => {
    url.searchParams.delete(key);
  });
  const cleanHash = url.hash || `#${state.view || "dashboard"}`;
  const cleanSearch = url.searchParams.toString();
  window.history.replaceState(
    null,
    "",
    `${url.pathname}${cleanSearch ? `?${cleanSearch}` : ""}${cleanHash}`,
  );
}

async function handleAuthRedirect() {
  if (!supabase) return false;
  const url = new URL(window.location.href);
  const callbackError = url.searchParams.get("error_description") || url.searchParams.get("error");
  if (callbackError) {
    cleanAuthRedirectUrl();
    authState.messageKey = "authSyncFailed";
    renderAuthControls();
    const modalStatus = $("#authModalStatus");
    if (modalStatus) modalStatus.textContent = callbackError;
    return true;
  }

  const code = url.searchParams.get("code");
  if (!code) return false;
  setAuthMessage("authSigningIn");
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  cleanAuthRedirectUrl();
  if (error) {
    authState.messageKey = "authSyncFailed";
    renderAuthControls();
    const modalStatus = $("#authModalStatus");
    if (modalStatus) modalStatus.textContent = error.message;
    return true;
  }
  applyAuthSession(data.session);
  return true;
}

async function initAuth() {
  renderAuthControls();
  if (!supabase) return;
  supabase.auth.onAuthStateChange((_event, session) => {
    window.setTimeout(() => {
      applyAuthSession(session);
    }, 0);
  });
  const handledRedirect = await handleAuthRedirect();
  const { data, error } = await supabase.auth.getSession();
  authState.initialized = true;
  if (handledRedirect) return;
  if (error) {
    setAuthMessage("authSyncFailed");
    return;
  }
  applyAuthSession(data.session);
}

async function handleEmailAuth(mode) {
  if (!supabase) {
    setAuthMessage("authNotConfigured");
    return;
  }
  const email = $("#authEmail")?.value.trim();
  const password = $("#authPassword")?.value;
  if (!email || !password || password.length < 6) {
    setAuthMessage("authNeedEmailPassword");
    return;
  }

  setAuthMessage("authSigningIn");
  const action = mode === "sign-up" ? supabase.auth.signUp : supabase.auth.signInWithPassword;
  const { data, error } = await action.call(supabase.auth, {
    email,
    password,
    options: mode === "sign-up" ? { emailRedirectTo: SUPABASE_REDIRECT_URL } : undefined,
  });
  if (error) {
    authState.messageKey = "authSyncFailed";
    $("#authModalStatus").textContent = error.message;
    return;
  }
  if (data.session) {
    applyAuthSession(data.session);
    closeAuthModal();
  } else {
    setAuthMessage("authCheckEmail");
  }
}

async function handleGoogleAuth() {
  if (!supabase) {
    setAuthMessage("authNotConfigured");
    return;
  }
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: SUPABASE_REDIRECT_URL },
  });
  if (error) {
    authState.messageKey = "authSyncFailed";
    $("#authModalStatus").textContent = error.message;
  }
}

async function signOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
  authState.session = null;
  authState.user = null;
  authState.lastSyncedUserId = null;
  setAuthMessage("authSignedOut");
  renderAuthControls();
}

async function saveMockAttempt(result) {
  if (!supabase || !authState.user) return;
  const summary = {
    sourceLabel: result.sourceLabel,
    total: result.total,
    correct: result.correct,
    percentage: result.percentage,
    unanswered: result.unanswered,
    elapsedMs: result.elapsedMs,
    topics: result.topics,
    wrongItems: result.items
      .filter((item) => !item.isCorrect)
      .map((item) => ({
        id: questionKey(item.question),
        response: item.response,
        answered: item.answered,
      })),
  };
  await supabase.from("mock_attempts").insert({
    user_id: authState.user.id,
    source_label: result.sourceLabel,
    score: result.percentage,
    correct_count: result.correct,
    total_count: result.total,
    unanswered_count: result.unanswered,
    elapsed_ms: result.elapsedMs,
    result: summary,
  });
}

function questionKey(question) {
  return question.id || `${question.topic}:${question.question}`;
}

function findQuestionByKey(key) {
  return questions.find((question) => questionKey(question) === key);
}

function selectedAnswerText(question, response) {
  if (!hasQuestionResponse(question, response)) return t("notAnswered");
  if (question.type === "short") return String(response);
  return question.answers?.[response] || t("unknownOption");
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
  return questions.filter((question) => question.topic === topicId && question.source === "原创场景模拟题");
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
    window.alert(t("speechUnavailable"));
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

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeTerm(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function stripDutchArticle(value) {
  return normalizeTerm(value).replace(/^(de|het|een)\s+/, "");
}

function englishForTerm(value) {
  const normalized = normalizeTerm(value);
  return DUTCH_TERM_EN[normalized] || DUTCH_TERM_EN[stripDutchArticle(normalized)] || "";
}

function addGlossaryEntry(entries, term, item) {
  const normalized = normalizeTerm(term);
  const english = item.english || englishForTerm(normalized);
  if (!normalized || normalized.length < 3 || !english) return;
  if (!/[a-z]/i.test(normalized)) return;

  const existing = entries.get(normalized);
  if (!existing || item.meaning.length > existing.zh.length) {
    entries.set(normalized, {
      term: normalized,
      zh: item.meaning,
      en: english,
    });
  }
}

function addGlossaryVariants(entries, rawTerm, item) {
  const term = stripDutchArticle(rawTerm);
  addGlossaryEntry(entries, rawTerm, item);
  addGlossaryEntry(entries, term, item);
  if (term.endsWith("ie")) addGlossaryEntry(entries, `${term.slice(0, -2)}ies`, item);
  if (!term.endsWith("s")) addGlossaryEntry(entries, `${term}s`, item);
  String(item.variants || "")
    .split(";")
    .map((variant) => variant.trim())
    .filter(Boolean)
    .forEach((variant) => addGlossaryEntry(entries, variant, item));
}

function buildGlossaryTerms(items) {
  const entries = new Map();
  items.forEach((item) => {
    if (!item.word || !item.meaning) return;
    addGlossaryVariants(entries, item.word, item);
  });
  Object.entries(DUTCH_TERM_ZH).forEach(([term, meaning]) => {
    addGlossaryVariants(entries, term, { word: term, meaning });
  });

  return [...entries.values()].sort((a, b) => b.term.length - a.term.length);
}

function renderGlossaryText(value) {
  const text = String(value == null ? "" : value);
  if (!glossaryTerms.length) return renderText(text);

  const pattern = glossaryTerms.map((item) => escapeRegExp(item.term)).join("|");
  const matcher = new RegExp(`(^|[^\\p{L}\\p{N}])(${pattern})(?=$|[^\\p{L}\\p{N}])`, "giu");
  let html = "";
  let lastIndex = 0;
  let match;

  while ((match = matcher.exec(text))) {
    const [fullMatch, prefix, term] = match;
    const termStart = match.index + prefix.length;
    const key = normalizeTerm(term);
    const entry = glossaryTermMap.get(key);
    if (!entry) continue;

    html += renderText(text.slice(lastIndex, termStart));
    const tooltip = `中文：${entry.zh}\nEnglish: ${entry.en}`;
    html += `<span class="glossary-term" tabindex="0" title="${escapeHtml(tooltip)}" aria-label="${escapeHtml(tooltip)}" data-tooltip="${escapeHtml(tooltip)}">${escapeHtml(text.slice(termStart, termStart + term.length))}</span>`;
    lastIndex = match.index + fullMatch.length;
  }

  html += renderText(text.slice(lastIndex));
  return html;
}

function glossaryChineseForTerm(value) {
  const key = normalizeTerm(value);
  return DUTCH_TERM_ZH[key] || glossaryTermMap.get(key)?.zh || "";
}

function dutchToChineseHint(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  if (DUTCH_REASON_ZH[text]) return DUTCH_REASON_ZH[text];

  const pattern = glossaryTerms.map((item) => escapeRegExp(item.term)).join("|");
  const matcher = new RegExp(`(^|[^\\p{L}\\p{N}])(${pattern})(?=$|[^\\p{L}\\p{N}])`, "giu");
  let result = "";
  let lastIndex = 0;
  let replacements = 0;
  let match;

  while ((match = matcher.exec(text))) {
    const [fullMatch, prefix, term] = match;
    const termStart = match.index + prefix.length;
    const zh = glossaryChineseForTerm(term);
    if (!zh) continue;
    result += text.slice(lastIndex, termStart);
    result += zh;
    lastIndex = match.index + fullMatch.length;
    replacements += 1;
  }

  result += text.slice(lastIndex);
  result = result
    .replace(/\bligt in\b/gi, "位于")
    .replace(/\bligt aan\b/gi, "靠近")
    .replace(/\bten oosten van\b/gi, "在……东边")
    .replace(/\bten zuiden van\b/gi, "在……南边")
    .replace(/\bis\b/gi, "是")
    .replace(/\ben\b/gi, "和")
    .replace(/\s+/g, " ")
    .trim();

  if (!replacements && result === text) return text;
  return `${result}（原文：${text}）`;
}

function chineseQuestionText(question) {
  return question.zhQuestion || dutchToChineseHint(question.question);
}

function chineseAnswerText(question, index) {
  return question.zhAnswers?.[index] || dutchToChineseHint(question.answers?.[index] || "");
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

function resetPracticeOrder(randomize = false) {
  const list = topicQuestions(state.activeTopic);
  state.practiceOrder = randomize ? shuffle(list) : [...list];
  state.practiceOrderTopic = state.activeTopic;
  state.practiceIndex = 0;
}

function practiceQuestions() {
  if (state.practiceOrderTopic !== state.activeTopic || state.practiceOrder.length !== topicQuestions(state.activeTopic).length) {
    resetPracticeOrder(false);
  }
  return state.practiceOrder;
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
  $("#answeredHint").textContent = authState.user ? t("statAnsweredHintSynced") : t("statAnsweredHint");
  $("#accuracyRate").textContent = answered ? `${Math.round((correct / answered) * 100)}%` : "0%";
  $("#streakDays").textContent = `${streak || 1} ${t("day")}`;
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
        <span class="pill">${topicQuestions(topic.id).length} ${t("questionsUnit")}</span>
        <span class="pill">${topicWords(topic.id).length} ${t("wordsUnit")}</span>
        <button class="primary-action" data-practice-topic="${topic.id}" type="button">${t("practiceTopic")}</button>
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
            <h3>${t("memoryHooksTitle")}</h3>
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
          <h3>${t("fullChapterTitle", study.chapter)}</h3>
          <p>${t("chapterSummary", units.length, study.imageCount, study.vocabulary.length)}</p>
        </div>
      </div>
      ${
        study.goals?.length
          ? `<div class="learning-goals"><strong>${t("learningGoals")}</strong><ol>${study.goals.map((goal) => `<li>${renderText(goal)}</li>`).join("")}</ol></div>`
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
      <summary>${renderText(part.title)} <span>${part.units.length} ${t("knowledgeUnits")}</span></summary>
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
          <summary>${renderText(section.title)} <span>${section.blocks.length} ${t("groupsUnit")}</span></summary>
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
      <summary>${t("coreVocabulary")} <span>${study.vocabulary.length} ${t("wordsUnit")}</span></summary>
      <div class="study-table-wrap">
        <table class="study-table">
          <thead><tr><th>${t("dutch")}</th><th>${t("chinese")}</th><th>${t("exampleOrMemory")}</th></tr></thead>
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
      <summary>${t("commonMistakes")} <span>${study.commonMistakes.length} ${t("itemsUnit")}</span></summary>
      <div class="study-table-wrap">
        <table class="study-table">
          <thead><tr><th>${t("originalText")}</th><th>${t("suggestedText")}</th><th>${t("chinese")}</th></tr></thead>
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
      <summary>${t("chapterCheatSheet", study.chapter)} <span>${study.cheatSheet.reduce((total, section) => total + section.items.length, 0)} ${t("itemsUnit")}</span></summary>
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
  const filters = [{ id: "all", title: t("all") }, ...topics];
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
  const list = practiceQuestions();
  const question = list[state.practiceIndex % list.length];
  if (!question) return;
  state.practiceAnswered = false;

  $("#practiceTopicPill").textContent = `${topic.title} | ${topic.zhTitle}`;
  $("#practiceProgress").textContent = t("questionProgress", state.practiceIndex + 1, list.length);
  $("#practiceScenario").textContent = question.scenario;
  $("#practiceQuestion").innerHTML = renderGlossaryText(question.question);
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
    showFeedback($("#practiceFeedback"), question, isCorrect, choice);
    $("#nextPractice").disabled = false;
    button?.focus();
  }, null, false, { glossary: true });
}

function renderAnswers(container, question, onSelect, selected = null, reveal = false, options = {}) {
  if (question.type === "short") {
    renderShortAnswer(container, question, onSelect, selected, reveal);
    return;
  }
  container.innerHTML = "";
  (question.answers || []).forEach((answer, index) => {
    const button = document.createElement("button");
    button.className = "answer-btn";
    button.type = "button";
    button.innerHTML = `<span class="answer-letter">${String.fromCharCode(65 + index)}.</span> ${
      options.glossary ? renderGlossaryText(answer) : renderText(answer)
    }`;
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
      <label for="${question.id}-answer">${t("typeAnswer")}</label>
      <div class="short-answer-row">
        <input id="${question.id}-answer" type="text" value="${escapeHtml(value)}" ${reveal ? "disabled" : ""} autocomplete="off" />
        <button class="secondary-action" type="button" ${reveal ? "disabled" : ""}>${t("check")}</button>
      </div>
      ${reveal ? `<p>${t("referenceAnswer")}：${escapeHtml(question.correctText || question.explanation)}</p>` : ""}
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

function renderOptionExplanation(question, selected) {
  if (question.type === "short") return "";
  const keyReason = dutchToChineseHint(question.explanation || correctAnswerText(question));
  return `
    <div class="option-explanations">
      <strong>${t("optionExplanationTitle")}</strong>
      <ul>
        ${(question.answers || [])
          .map((answer, index) => {
            const isCorrect = index === question.correct;
            const isSelectedWrong = selected === index && selected !== question.correct;
            const reason = isCorrect
              ? t("optionCorrectReason")
              : isSelectedWrong
                ? t("optionSelectedWrongReason")
                : t("optionDistractorReason");
            return `
              <li class="${isCorrect ? "is-correct" : ""} ${isSelectedWrong ? "is-wrong" : ""}">
                <span>${String.fromCharCode(65 + index)}. ${renderGlossaryText(answer)}</span>
                <p class="option-translation"><span>${t("optionTranslation")}：</span>${renderText(chineseAnswerText(question, index))}</p>
                <small>${reason} ${renderText(keyReason)}</small>
              </li>
            `;
          })
          .join("")}
      </ul>
    </div>
  `;
}

function renderChineseStudyExplanation(question) {
  const topic = getTopic(question.topic);
  const context = question.zhScenario || topic.zhTitle || topic.title || question.scenario;
  const focus = dutchToChineseHint(question.explanation || correctAnswerText(question));
  return `
    <div class="study-explanation">
      <strong>${t("chineseQuestionTitle")}</strong>
      <p><span>${t("fullQuestionTranslation")}：</span>${renderText(chineseQuestionText(question))}</p>
      <p><span>${t("chineseQuestionContext")}：</span>${renderText(context)}</p>
      <p><span>${t("chineseQuestionFocus")}：</span>${renderText(focus)}</p>
    </div>
  `;
}

function showFeedback(container, question, isCorrect, selected = null) {
  container.hidden = false;
  container.classList.toggle("is-wrong", !isCorrect);
  container.innerHTML = `
    <strong>${isCorrect ? t("correctFeedback") : t("wrongFeedback")}</strong>
    ${renderChineseStudyExplanation(question)}
    ${renderOptionExplanation(question, selected)}
  `;
}

function nextPractice() {
  const list = practiceQuestions();
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
  $("#wordTopicCount").textContent = topic
    ? t("showWordsTopic", topic.title, sample.length, list.length)
    : t("showWordsAll", sample.length, words.length);
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

function mockSourceConfig() {
  const config = MOCK_SOURCES[state.mockSource] || MOCK_SOURCES.site;
  return {
    ...config,
    label: config.label || t(config.labelKey),
    description: t(config.descriptionKey),
  };
}

function mockSourceQuestions() {
  const config = mockSourceConfig();
  if (state.mockSource === "site") {
    return shuffle(questions.filter((question) => !question.isOfficialPractice)).slice(0, MOCK_QUESTION_COUNT);
  }

  return questions
    .filter((question) => question.source === config.source)
    .sort((a, b) => String(a.id).localeCompare(String(b.id), undefined, { numeric: true }))
    .slice(0, MOCK_QUESTION_COUNT);
}

function renderMockIntro() {
  const config = mockSourceConfig();
  $("#mockSourcePill").textContent = state.mockSource === "site" ? "KNM Mock" : "DUO Mock";
  $("#mockCount").textContent = t("mockReady");
  $("#mockMeter").style.width = "0%";
  $("#mockTimer").textContent = `${MOCK_DURATION_MINUTES}:00`;
  $("#mockScenario").textContent = config.description;
  $("#mockQuestion").textContent = state.mockSource === "site" ? t("mockIntroSite") : t("mockIntroDuo", config.label);
  $("#mockAnswers").innerHTML = "";
  $("#mockFeedback").hidden = true;
  $("#mockReport").hidden = true;
  $("#mockReport").innerHTML = "";
  $("#prevMock").disabled = true;
  $("#nextMock").disabled = true;
  $("#finishMock").disabled = true;
  $("#speakMockQuestion").disabled = true;
  $("#startMock").textContent = t("startMock");
}

function goPracticeTopic(topicId) {
  state.activeTopic = topicId;
  resetPracticeOrder(false);
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
  $("#wrongbookCount").textContent = t("wrongbookCount", entries.length);
  $("#clearWrongbook").disabled = entries.length === 0;
  $("#wrongbookHint").textContent = entries.length
    ? t("wrongbookHintFilled")
    : t("wrongbookHintEmpty");
  $("#wrongbookList").innerHTML = entries.length
    ? entries.map((entry) => renderWrongQuestionCard(entry, { showActions: true })).join("")
    : `<section class="panel empty-state"><strong>${t("emptyWrongbookTitle")}</strong><p>${t("emptyWrongbookCopy")}</p></section>`;
}

function startMock() {
  const selectedQuestions = mockSourceQuestions();
  if (!selectedQuestions.length) {
    window.alert(t("noQuestionsAlert"));
    return;
  }
  state.mock.active = true;
  state.mock.questions = selectedQuestions;
  state.mock.index = 0;
  state.mock.answers = Array(state.mock.questions.length).fill(null);
  state.mock.result = null;
  state.mock.startedAt = Date.now();
  state.mock.deadline = Date.now() + MOCK_DURATION_MINUTES * 60 * 1000;
  clearInterval(state.mock.timer);
  state.mock.timer = setInterval(updateMockTimer, 1000);
  $("#startMock").textContent = t("restartMock");
  $("#finishMock").disabled = false;
  $("#speakMockQuestion").disabled = false;
  $("#mockReport").hidden = true;
  $("#mockReport").innerHTML = "";
  $("#mockSourcePill").textContent = mockSourceConfig().label;
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
  $("#mockCount").textContent = t("questionProgress", mock.index + 1, mock.questions.length);
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
  return state.language === "en"
    ? `${minutes}m ${String(seconds).padStart(2, "0")}s`
    : `${minutes}分${String(seconds).padStart(2, "0")}秒`;
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
    sourceLabel: mockSourceConfig().label,
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
        <span class="is-wrong">${t("yourAnswer")}：${renderText(selectedAnswerText(question, response))}</span>
        <span class="is-correct">${t("referenceAnswer")}：${renderText(correctAnswerText(question))}</span>
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
        ${item.mistakes ? `<span class="mistake-count">${t("mistakeCount", item.mistakes)}</span>` : ""}
      </div>
      ${question.scenario ? `<p class="scenario">${renderText(question.scenario)}</p>` : ""}
      <h3>${renderText(question.question)}</h3>
      ${renderReviewAnswerList(question, response)}
      <p>${renderText(question.explanation)}</p>
      ${
        options.showActions
          ? `<div class="card-actions">
              <button class="secondary-action" data-review-topic="${topic.id}" type="button">${t("reviewChapter")}</button>
              <button class="secondary-action" data-wrong-practice-topic="${topic.id}" type="button">${t("practiceTopic")}</button>
              <button class="primary-action" data-remove-wrong="${renderText(key)}" type="button">${t("mastered")}</button>
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
        <h2>${t("mockReportTitle")}</h2>
        <p>${renderText(result.sourceLabel)}</p>
      </div>
    </div>
    <div class="report-grid">
      <article><span>${t("score")}</span><strong>${result.correct}/${result.total}</strong><small>${result.percentage}%</small></article>
      <article><span>${t("timeSpent")}</span><strong>${formatDuration(result.elapsedMs)}</strong><small>${t("minutesLimit")}</small></article>
      <article><span>${t("unanswered")}</span><strong>${result.unanswered}</strong><small>${t("savedAsWrong")}</small></article>
      <article><span>${t("practiceGoal")}</span><strong>${passed ? t("passed") : t("needsWork")}</strong><small>${t("targetScore")}</small></article>
    </div>
    ${
      weakTopics.length
        ? `<div class="topic-breakdown">
            <h3>${t("priorityReview")}</h3>
            ${weakTopics
              .map(
                (topic) => `
                  <article>
                    <div>
                      <strong>${renderText(topic.title)}</strong>
                      <span>${renderText(topic.zhTitle)} | ${topic.correct}/${topic.total} ${t("correctLabel")}</span>
                    </div>
                    <div class="card-actions">
                      <button class="secondary-action" data-review-topic="${topic.id}" type="button">${t("viewFullChapter")}</button>
                      <button class="primary-action" data-wrong-practice-topic="${topic.id}" type="button">${t("practiceTopic")}</button>
                    </div>
                  </article>
                `,
              )
              .join("")}
          </div>`
        : `<p class="report-note">${t("reportNoWeakTopic")}</p>`
    }
    <details class="mock-wrong-list" ${wrongItems.length ? "open" : ""}>
      <summary>${t("wrongItemsSummary", wrongItems.length)}</summary>
      <div class="wrongbook-list">
        ${wrongItems.length ? wrongItems.map((item) => renderWrongQuestionCard(item)).join("") : `<p class="empty-state">${t("noWrongThisMock")}</p>`}
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
  saveMockAttempt(result).catch(() => setAuthMessage("authSyncFailed"));

  $("#mockTimer").textContent = t("completed");
  $("#mockCount").textContent = t("correctCount", result.correct, result.total);
  $("#mockMeter").style.width = `${result.percentage}%`;
  $("#mockFeedback").hidden = false;
  $("#mockFeedback").className = result.percentage >= 65 ? "feedback" : "feedback is-wrong";
  $("#mockFeedback").innerHTML = `
    <strong>${t("mockScore", result.percentage)}</strong>
    <p>${result.percentage >= 65 ? t("mockPassCopy") : t("mockFailCopy")}${
      result.unanswered ? t("unansweredCopy", result.unanswered) : ""
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
  $("#languageToggle").addEventListener("click", () => {
    setLanguage(state.language === "en" ? "zh" : "en");
  });
  window.addEventListener("hashchange", () => {
    const view = window.location.hash.replace("#", "");
    if (view && $(`#${view}`)) showView(view);
  });
  $("#topicSelect").addEventListener("change", (event) => {
    state.activeTopic = event.target.value;
    resetPracticeOrder(false);
    renderPractice();
  });
  $("#mockSourceSelect").addEventListener("change", (event) => {
    state.mockSource = event.target.value;
    if (state.mock.active) {
      clearInterval(state.mock.timer);
      state.mock.active = false;
      $("#startMock").textContent = t("startMock");
    }
    renderMockIntro();
  });
  $("#nextPractice").addEventListener("click", nextPractice);
  $("#resetPractice").addEventListener("click", () => {
    resetPracticeOrder(false);
    renderPractice();
  });
  $("#shufflePractice").addEventListener("click", () => {
    resetPracticeOrder(true);
    renderPractice();
  });
  $("#shuffleWords").addEventListener("click", renderWords);
  $("#speakPracticeQuestion").addEventListener("click", (event) => speakDutch(event.currentTarget.dataset.speech));
  $("#speakMockQuestion").addEventListener("click", (event) => speakDutch(event.currentTarget.dataset.speech));
  $("#clearWrongbook").addEventListener("click", () => {
    if (!wrongAnswerEntries().length) return;
    if (window.confirm(t("confirmClearWrongbook"))) clearWrongAnswers();
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
  $("#feedbackButton").addEventListener("click", () => {
    if (!FEEDBACK_FORM_URL) {
      window.alert(t("feedbackPending"));
      return;
    }
    window.open(FEEDBACK_FORM_URL, "_blank", "noopener,noreferrer");
  });
  $("#authButton").addEventListener("click", openAuthModal);
  $("#authClose").addEventListener("click", closeAuthModal);
  $("#authModal").addEventListener("click", (event) => {
    if (event.target === event.currentTarget) closeAuthModal();
  });
  $("#authSignIn").addEventListener("click", () => handleEmailAuth("sign-in"));
  $("#authSignUp").addEventListener("click", () => handleEmailAuth("sign-up"));
  $("#authGoogle").addEventListener("click", handleGoogleAuth);
  $("#authSyncNow").addEventListener("click", saveCloudState);
  $("#authSignOut").addEventListener("click", signOut);
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !$("#authModal").hidden) closeAuthModal();
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
  applyI18n();
  renderLessonFilters();
  renderWordTopicFilters();
  renderLessons();
  renderPractice();
  renderWords();
  renderGrammarGuide();
  renderDashboard();
  renderWrongbook();
  renderMockIntro();
  bindEvents();
  initAuth();
  showView(state.view);
}

init();
