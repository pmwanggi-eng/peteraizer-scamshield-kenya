
const $ = id => document.getElementById(id);

$("year").textContent = new Date().getFullYear();

const terminalLines = [
  "[BOOT] ScamShield interface initialized",
  "[MODULE] URL inspection rules loaded",
  "[MODULE] Message scanner ready",
  "[PRIVACY] Local browser analysis active",
  "[STATUS] Waiting for user input..."
];

let line = 0;

function terminalLog() {
  const output = $("terminalOutput");
  const lines = (output.textContent + "\n> " +
    terminalLines[line++ % terminalLines.length]).split("\n");

  output.textContent = lines.slice(-5).join("\n");
}

terminalLog();
setInterval(terminalLog, 2500);

const translations = {
  en: {
    headline: "Think before you click_",
    intro: "Inspect suspicious links and messages before sending money or sharing private information.",
    urlTitle: "[01] URL THREAT INSPECTOR",
    urlDesc: "Check a web address for common warning signs.",
    urlBtn: "CHECK URL",
    messageTitle: "[02] MESSAGE SCANNER",
    messageDesc: "Analyze an SMS or WhatsApp message.",
    messageBtn: "SCAN MESSAGE",
    tipsTitle: "DEFENSE PROTOCOLS",
    advice: "Verify suspicious requests through an official channel. Never share your PIN or password.",
    emptyUrl: "Enter a website address first.",
    invalidUrl: "Enter a valid HTTP or HTTPS web address.",
    high: "HIGH WARNING LEVEL",
    medium: "CAUTION ADVISED",
    low: "NO OBVIOUS WARNING FOUND",
    host: "Website host",
    https: "The address does not use HTTPS.",
    ip: "The host is an IP address instead of a typical domain.",
    short: "A URL shortener may hide the destination.",
    at: "The @ character may disguise the actual destination.",
    puny: "The domain contains an internationalized label. Inspect carefully.",
    none: "No listed warning signs detected. This is not a safety guarantee.",
    emptyMsg: "Paste a message first.",
    msgHigh: "HIGH SCAM WARNING",
    msgMedium: "POTENTIAL WARNING SIGNS",
    msgLow: "FEW WARNING SIGNS DETECTED",
    pin: "The message requests a PIN, password or one-time code.",
    urgent: "The message uses urgent pressure or account threats.",
    money: "The message asks for a fee, deposit or money transfer.",
    job: "The message mentions job offers or registration fees.",
    prize: "The message mentions unexpected prizes or winnings.",
    link: "The message contains a link. Verify it independently.",
    noneMsg: "No matching phrases found. This does not prove the message is safe."
  },
  sw: {
    headline: "Fikiri kabla ya kubofya_",
    intro: "Kagua viungo na ujumbe unaotiliwa shaka kabla ya kutuma pesa au kutoa taarifa za siri.",
    urlTitle: "[01] KIKAGUA VIUNGO",
    urlDesc: "Kagua anwani ya tovuti kwa dalili za hatari.",
    urlBtn: "KAGUA KIUNGO",
    messageTitle: "[02] KICHANGANUZI CHA UJUMBE",
    messageDesc: "Changanua SMS au ujumbe wa WhatsApp.",
    messageBtn: "CHANGANUA UJUMBE",
    tipsTitle: "NJIA ZA KUJILINDA",
    advice: "Thibitisha maombi kupitia njia rasmi. Usishiriki PIN au nenosiri lako.",
    emptyUrl: "Weka anwani ya tovuti kwanza.",
    invalidUrl: "Weka anwani halali ya HTTP au HTTPS.",
    high: "TAHADHARI KUBWA",
    medium: "TAHADHARI INAHITAJIKA",
    low: "HAKUNA DALILI DHIRIHU",
    host: "Anwani ya tovuti",
    https: "Anwani haitumii HTTPS.",
    ip: "Tovuti inatumia anwani ya IP badala ya jina la kawaida.",
    short: "Kiungo kifupi kinaweza kuficha anwani ya mwisho.",
    at: "Alama ya @ inaweza kuficha mahali kiungo kinapoelekea.",
    puny: "Jina la tovuti lina muundo wa kimataifa. Likague kwa makini.",
    none: "Hakuna dalili zilizoorodheshwa. Hii si dhamana ya usalama.",
    emptyMsg: "Bandika ujumbe kwanza.",
    msgHigh: "TAHADHARI KUBWA YA UTAPELI",
    msgMedium: "DALILI ZA HATARI ZINAZOWEZEKANA",
    msgLow: "DALILI CHACHE ZIMEPATIKANA",
    pin: "Ujumbe unaomba PIN, nenosiri au msimbo wa uthibitishaji.",
    urgent: "Ujumbe unatumia vitisho au shinikizo la haraka.",
    money: "Ujumbe unaomba ada, amana au kutuma pesa.",
    job: "Ujumbe unataja kazi au ada ya usajili.",
    prize: "Ujumbe unataja zawadi au ushindi usiotarajiwa.",
    link: "Ujumbe una kiungo. Kithibitishe kivyake.",
    noneMsg: "Hakuna maneno yaliyotambuliwa. Hii haithibitishi usalama."
  }
};

function t(key) {
  return translations[$("language").value][key] ||
    translations.en[key] || key;
}

function displayResult(element, title, items, level) {
  element.className = "result show";
  element.replaceChildren();

  const heading = document.createElement("h3");
  heading.className = level;
  heading.textContent = title;
  element.append(heading);

  const list = document.createElement("ul");

  items.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    list.append(li);
  });

  element.append(list);

  const advice = document.createElement("p");
  advice.textContent = t("advice");
  element.append(advice);
}

function checkUrl() {
  const raw = $("urlInput").value.trim();
  const result = $("urlResult");

  if (!raw) {
    displayResult(result, t("emptyUrl"), [], "warn");
    return;
  }

  let url;

  try {
    url = new URL(
      /^[a-z][a-z\d+.-]*:\/\//i.test(raw)
        ? raw
        : "https://" + raw
    );

    if (
      !["http:", "https:"].includes(url.protocol) ||
      !url.hostname.includes(".")
    ) throw new Error("Invalid URL");
  } catch {
    displayResult(result, t("invalidUrl"), [], "warn");
    return;
  }

  const flags = [];

  if (url.protocol !== "https:") flags.push(t("https"));

  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(url.hostname)) {
    flags.push(t("ip"));
  }

  if (/^(bit\.ly|tinyurl\.com|t\.co|cutt\.ly|rb\.gy)$/i.test(url.hostname)) {
    flags.push(t("short"));
  }

  if (url.username || url.password || raw.includes("@")) {
    flags.push(t("at"));
  }

  if (url.hostname.split(".").some(part => part.startsWith("xn--"))) {
    flags.push(t("puny"));
  }

  const title = flags.length >= 2 ? t("high")
    : flags.length ? t("medium") : t("low");

  displayResult(
    result,
    title,
    [t("host") + ": " + url.hostname,
      ...(flags.length ? flags : [t("none")])],
    flags.length >= 2 ? "danger"
      : flags.length ? "warn" : "safe"
  );

  terminalLog();
}

function checkMessage() {
  const message = $("messageInput").value.trim().toLowerCase();
  const result = $("messageResult");

  if (!message) {
    displayResult(result, t("emptyMsg"), [], "warn");
    return;
  }

  const rules = [
    [/\b(pin|password|passcode|otp|verification code|mpesa pin)\b|nenosiri|nambari ya siri/i, "pin"],
    [/urgent|immediately|act now|account.{0,25}(blocked|suspended|closed)|haraka sana/i, "urgent"],
    [/pay (a )?(fee|deposit|tax)|send (me )?money|processing fee|lipa ada|tuma pesa/i, "money"],
    [/job offer|work from home|registration fee|guaranteed income|kazi ya mtandaoni/i, "job"],
    [/you (have )?won|claim your prize|free gift|lottery winner|umeshinda/i, "prize"],
    [/https?:\/\/|www\.|bit\.ly|tinyurl\.com/i, "link"]
  ];

  const flags = [];

  rules.forEach(([pattern, key]) => {
    if (pattern.test(message)) flags.push(t(key));
  });

  const title = flags.length >= 3 ? t("msgHigh")
    : flags.length ? t("msgMedium") : t("msgLow");

  displayResult(
    result,
    title,
    flags.length ? flags : [t("noneMsg")],
    flags.length >= 3 ? "danger"
      : flags.length ? "warn" : "safe"
  );

  terminalLog();
}

$("checkUrl").addEventListener("click", checkUrl);
$("checkMessage").addEventListener("click", checkMessage);

$("urlInput").addEventListener("keydown", event => {
  if (event.key === "Enter") checkUrl();
});

$("language").addEventListener("change", () => {
  const dictionary = translations[$("language").value];

  [
    "headline", "intro", "urlTitle", "urlDesc", "urlBtn",
    "messageTitle", "messageDesc", "messageBtn", "tipsTitle"
  ].forEach(id => {
    if (dictionary[id]) $(id).textContent = dictionary[id];
  });

  $("urlResult").className = "result";
  $("messageResult").className = "result";
});
