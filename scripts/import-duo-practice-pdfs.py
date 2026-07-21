import json
import re
from pathlib import Path

import pdfplumber


ROOT = Path.cwd()
OUTPUT_PATH = ROOT / "content" / "duo-practice-questions.json"
PDFS = [
    {
        "path": Path("/Users/sherrypan/Library/Mobile Documents/com~apple~CloudDocs/Dutch-A2/knm/KNM-1.pdf"),
        "source": "DUO oefenexamen 1",
        "answer_key": [
            2,
            3,
            1,
            3,
            3,
            3,
            1,
            1,
            1,
            3,
            1,
            3,
            3,
            1,
            2,
            1,
            1,
            1,
            3,
            2,
            3,
            3,
            1,
            1,
            1,
            1,
            2,
            1,
            2,
            3,
            2,
            1,
            2,
            1,
            1,
            2,
            1,
            3,
            1,
            2,
        ],
    },
    {
        "path": Path("/Users/sherrypan/Library/Mobile Documents/com~apple~CloudDocs/Dutch-A2/knm/KNM-2.pdf"),
        "source": "DUO oefenexamen 2",
        "answer_key": None,
    },
]


TOPIC_IDS = {
    "geo": "nederland-leren-kennen",
    "people": "de-mensen-in-nederland",
    "health": "gezondheid-en-gezondheidszorg-in-nederland",
    "housing": "wonen-in-nederland",
    "services": "dienstverlening-in-nederland",
    "education": "opvoeding-en-onderwijs-in-nederland",
    "work": "werken-in-nederland",
    "society": "samenleven-in-nederland",
    "history": "de-geschiedenis-van-nederland",
    "politics": "politiek-in-nederland",
}


def extract_text(pdf_path):
    parts = []
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            parts.append(page.extract_text(x_tolerance=1, y_tolerance=3) or "")
    return "\n".join(parts)


def split_blocks(text):
    matches = list(re.finditer(r"^Vraag\s+(\d+)\s*[:：]\s*(.+)$", text, re.M))
    blocks = []
    for index, match in enumerate(matches):
        start = match.start()
        end = matches[index + 1].start() if index + 1 < len(matches) else len(text)
        blocks.append((int(match.group(1)), match.group(2).strip(), text[start:end]))
    return blocks


def clean_whitespace(value):
    return re.sub(r"\s+", " ", value).strip()


def strip_translation(value):
    value = clean_whitespace(value)
    previous = None
    while previous != value:
        previous = value
        value = re.sub(r"\s*[（(][^()（）]*[\u3400-\u9fff][^()（）]*[）)]", "", value)
    return clean_whitespace(value)


def extract_between(block, starts, stops):
    start_index = -1
    start_marker = ""
    for marker in starts:
        found = block.find(marker)
        if found != -1 and (start_index == -1 or found < start_index):
            start_index = found
            start_marker = marker
    if start_index == -1:
        return ""
    section = block[start_index + len(start_marker) :]
    stop_indexes = [section.find(stop) for stop in stops if section.find(stop) != -1]
    if stop_indexes:
        section = section[: min(stop_indexes)]
    return section.strip()


def parse_options(section):
    options = []
    for line in section.splitlines():
        line = line.strip()
        numbered = re.match(r"^[1-4]\.\s*(.+)$", line)
        image_label = re.match(r"^○\s*图\s*[1-4]\s*[:：]\s*(.+)$", line)
        bulleted = re.match(r"^○\s*(.+)$", line)
        if numbered or image_label or bulleted:
            options.append(strip_translation((numbered or image_label or bulleted).group(1)))
        elif options and line and not line.startswith("●"):
            options[-1] = strip_translation(f"{options[-1]} {line}")
    return options


def parse_question(block):
    section = extract_between(
        block,
        ["● 原文题目与翻译：", "● 原文问题："],
        ["● 原文选项与翻译：", "● 选项翻译："],
    )
    return strip_translation(section)


def parse_explanation(block, source, correct_option):
    section = extract_between(block, ["● 题目解析："], ["● 语法小贴士：", "● 相近概念对比：", "Vraag "])
    if section:
        return strip_translation(section)
    return f"{source}：正确答案是 {correct_option}。"


def parse_answer(block, fallback_key, number):
    explicit = re.search(r"● 正确答案：\s*([1-4])", block)
    if explicit:
        return int(explicit.group(1)) - 1
    return fallback_key[number - 1] - 1


def infer_topic(question, title, number, source):
    text = f"{title} {question}".lower()
    if any(word in text for word in ["deltawerken", "holocaust", "wereldoorlog", "bevrijdingsdag", "willem", "voc", "suriname", "indonesië"]):
        return TOPIC_IDS["history"]
    if any(word in text for word in ["amsterdam", "gelderland", "provincie", "hoofdstad"]):
        return TOPIC_IDS["geo"]
    if any(word in text for word in ["huisarts", "apotheek", "112", "tandarts", "ziekenhuis", "recept", "eigen risico", "bloedonderzoek"]):
        return TOPIC_IDS["health"]
    if any(word in text for word in ["huur", "woning", "huis kopen", "makelaar", "statiegeld", "energie", "gas", "meter", "blikje"]):
        return TOPIC_IDS["housing"]
    if any(word in text for word in ["school", "duo", "diploma", "leerplicht", "universiteit", "consultatiebureau", "baby"]):
        return TOPIC_IDS["education"]
    if any(word in text for word in ["stem", "kiesrecht", "parlement", "wet", "rechter", "koning", "minister-president", "visum", "godsdienst"]):
        return TOPIC_IDS["politics"]
    if any(word in text for word in ["sollic", "werk", "salaris", "contract", "uitkering", "werkgever", "vacature", "kvk", "uren"]):
        return TOPIC_IDS["work"]
    if any(word in text for word in ["gemeente", "digid", "belasting", "paspoort", "rijbewijs", "id", "juridisch loket", "svb", "toeslag", "bsn", "uwv"]):
        return TOPIC_IDS["services"]
    if any(word in text for word in ["kerst", "oud en nieuw", "samenwonen", "trouwen", "vlag", "tas", "mannen", "vrouwen"]):
        return TOPIC_IDS["society"]
    if source.endswith("1") and number <= 5:
        return TOPIC_IDS["history"]
    if source.endswith("2") and number >= 32:
        return TOPIC_IDS["history"] if number <= 35 else TOPIC_IDS["politics"]
    return TOPIC_IDS["people"]


def parse_pdf(config):
    text = extract_text(config["path"])
    questions = []
    for number, title, block in split_blocks(text):
        option_section = extract_between(block, ["● 原文选项与翻译：", "● 选项翻译：", "● 解析翻译："], ["● 正确答案：", "● 重点单词解析：", "● 重点词汇："])
        options = parse_options(option_section)
        if len(options) < 2:
            continue
        question = parse_question(block)
        correct = parse_answer(block, config["answer_key"], number)
        questions.append(
            {
                "id": f"duo-{config['source'].split()[-1]}-{number}",
                "topic": infer_topic(question, title, number, config["source"]),
                "chapter": None,
                "scenario": f"{config['source']} - Vraag {number}: {title}",
                "question": question,
                "type": "choice",
                "answers": options,
                "correct": correct,
                "explanation": parse_explanation(block, config["source"], correct + 1),
                "source": config["source"],
                "isOfficialPractice": True,
            }
        )
    return questions


def main():
    all_questions = []
    for config in PDFS:
        parsed = parse_pdf(config)
        if len(parsed) != 40:
            raise RuntimeError(f"Expected 40 questions from {config['path'].name}, got {len(parsed)}")
        all_questions.extend(parsed)

    OUTPUT_PATH.parent.mkdir(exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(all_questions, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Imported {len(all_questions)} DUO practice questions into {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
