"use strict";

/* =========================================================
   جدول VIP
========================================================= */

const VIP_TABLE = [
    { level: 1,  total: 50000,        upgrade: 50000,        maintain: 30000 },
    { level: 2,  total: 100000,       upgrade: 50000,        maintain: 30000 },
    { level: 3,  total: 300000,       upgrade: 100000,       maintain: 90000 },
    { level: 4,  total: 1000000,      upgrade: 800000,       maintain: 500000 },
    { level: 5,  total: 3000000,      upgrade: 2000000,      maintain: 1300000 },
    { level: 6,  total: 7000000,      upgrade: 4000000,      maintain: 2600000 },
    { level: 7,  total: 14000000,     upgrade: 7000000,      maintain: 4500000 },
    { level: 8,  total: 26000000,     upgrade: 12000000,     maintain: 7800000 },
    { level: 9,  total: 42000000,     upgrade: 16000000,     maintain: 11000000 },
    { level: 10, total: 62000000,     upgrade: 20000000,     maintain: 14000000 },
    { level: 11, total: 102000000,    upgrade: 40000000,     maintain: 28000000 },
    { level: 12, total: 220000000,    upgrade: 118000000,    maintain: 83000000 },
    { level: 13, total: 430000000,    upgrade: 210000000,    maintain: 150000000 },
    { level: 14, total: 820000000,    upgrade: 390000000,    maintain: 310000000 },
    { level: 15, total: 1820000000,   upgrade: 1000000000,   maintain: 700000000 },
    { level: 16, total: 3820000000,   upgrade: 2000000000,   maintain: 1400000000 },
    { level: 17, total: 7382000000,   upgrade: 3500000000,   maintain: 3000000000 },
    { level: 18, total: 11882000000,  upgrade: 4500000000,   maintain: 4000000000 },
    { level: 19, total: 17382000000,  upgrade: 5500000000,   maintain: 5000000000 },
    { level: 20, total: 27382000000,  upgrade: 10000000000,  maintain: 9000000000 }
];


/* =========================================================
   التخزين
========================================================= */

const STORAGE_KEY = "majlis_alqimma_vip_records_v6";
const CALC_HISTORY_KEY = "majlis_calculator_history_v2";
const THEME_KEY = "majlis_theme_v1";


/* =========================================================
   أدوات عامة
========================================================= */

const $ = id => document.getElementById(id);

function getVip(level) {
    return VIP_TABLE.find(v => v.level === Number(level));
}

function number(value) {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
}

function formatNumber(value, decimals = 2) {
    const n = number(value);

    if (Math.abs(n - Math.round(n)) < 0.0000001) {
        return Math.round(n).toLocaleString("en-US");
    }

    return n.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: decimals
    });
}

function formatMoney(value) {
    return number(value).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function safeText(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================================================
   DOM
========================================================= */

const currentVip = $("currentVip");
const targetVip = $("targetVip");
const multiplier = $("multiplier");

const modeReach = $("modeReach");
const modeCurrentLock = $("modeCurrentLock");

const firstTransitionValue = $("firstTransitionValue");
const transitionArea = $("transitionArea");
const autoTransitions = $("autoTransitions");

const targetLockBox = $("targetLockBox");
const enableTargetLock = $("enableTargetLock");
const autoLockInfo = $("autoLockInfo");

const operationStatus = $("operationStatus");

const supportRate = $("supportRate");
const jodRate = $("jodRate");
const usdRate = $("usdRate");

const clientName = $("clientName");
const clientId = $("clientId");
const clientStatus = $("clientStatus");

const resultTitle = $("resultTitle");
const resultMultiplier = $("resultMultiplier");
const actualCharge = $("actualCharge");
const reachPoints = $("reachPoints");
const lockPoints = $("lockPoints");
const totalVipPoints = $("totalVipPoints");
const supportNeeded = $("supportNeeded");
const jodTotal = $("jodTotal");
const usdTotal = $("usdTotal");

const formulaVip = $("formulaVip");
const formulaMultiplier = $("formulaMultiplier");
const formulaCharge = $("formulaCharge");
const formulaSupport = $("formulaSupport");

const historySearch = $("historySearch");
const historyContainer = $("history");

const calculateBtn = $("calculateBtn");
const saveBtn = $("saveBtn");
const newBtn = $("newBtn");
const clearHistoryBtn = $("clearHistory");

const themeToggle = $("themeToggle");

const calculator = $("calculator");
const calculatorHistoryDisplay = $("calculatorHistory");
const calculatorResult = $("calculatorResult");
const calculatorHistoryList = $("calculatorHistoryList");
const calcHistoryCount = $("calcHistoryCount");
const calcSizeToggle = $("calcSizeToggle");
const calcClearHistory = $("calcClearHistory");


/* =========================================================
   تعبئة مستويات VIP
========================================================= */

function fillVipSelects() {

    currentVip.innerHTML = "";
    targetVip.innerHTML = "";

    VIP_TABLE.forEach(vip => {

        const option1 = document.createElement("option");
        option1.value = vip.level;
        option1.textContent = `VIP ${vip.level}`;

        const option2 = document.createElement("option");
        option2.value = vip.level;
        option2.textContent = `VIP ${vip.level}`;

        currentVip.appendChild(option1);
        targetVip.appendChild(option2);
    });

    currentVip.value = "1";
    targetVip.value = "2";
}


/* =========================================================
   جدول VIP
========================================================= */

function renderVipTable() {

    const tbody = document.querySelector("#vipTable tbody");

    tbody.innerHTML = VIP_TABLE.map(vip => `
        <tr>
            <td>
                <span class="vip-badge">VIP ${vip.level}</span>
            </td>
            <td>${formatNumber(vip.total)}</td>
            <td>${formatNumber(vip.upgrade)}</td>
            <td>${formatNumber(vip.maintain)}</td>
        </tr>
    `).join("");
}


/* =========================================================
   الحسبة التلقائية للانتقالات
========================================================= */

/*
   القاعدة:

   المستخدم يدخل قيمة واحدة فقط:
   الحالي → المستوى التالي

   بعد ذلك نحسب كل مستوى تلقائياً
   حسب نسبة XP للترقية في جدول VIP.

   مثال:

   VIP 2 → VIP 3 = 80,000,000 يدوي

   VIP 3 → VIP 4 =
   80,000,000 × (800,000 ÷ 100,000)

   VIP 4 → VIP 5 =
   80,000,000 × (2,000,000 ÷ 100,000)

   وهكذا.
*/

function calculateAutomaticTransitions() {

    const current = number(currentVip.value);
    const target = number(targetVip.value);
    const firstValue = number(firstTransitionValue.value);

    if (target <= current) {
        return [];
    }

    if (firstValue <= 0) {
        return [];
    }

    const firstNextLevel = current + 1;
    const firstVip = getVip(firstNextLevel);

    if (!firstVip || firstVip.upgrade <= 0) {
        return [];
    }

    const result = [];

    for (let from = current; from < target; from++) {

        const to = from + 1;
        const targetVipData = getVip(to);

        if (!targetVipData) continue;

        let value = firstValue;
        let automatic = false;

        if (from !== current) {

            automatic = true;

            const ratio =
                targetVipData.upgrade / firstVip.upgrade;

            value = firstValue * ratio;
        }

        result.push({
            from,
            to,
            value,
            automatic
        });
    }

    return result;
}


/* =========================================================
   عرض الانتقالات
========================================================= */

function renderAutomaticTransitions() {

    const current = number(currentVip.value);
    const target = number(targetVip.value);
    const firstValue = number(firstTransitionValue.value);

    if (modeCurrentLock.checked) {

        autoTransitions.innerHTML = `
            <div class="single-auto-card">
                <span>تثبيت المستوى الحالي</span>
                <strong>
                    ${formatNumber(getVip(current)?.maintain || 0)}
                </strong>
                <small>يتم أخذه تلقائياً من جدول VIP</small>
            </div>
        `;

        return;
    }

    if (target <= current) {

        autoTransitions.innerHTML = `
            <div class="empty-auto">
                اختر مستوى مطلوباً أعلى من المستوى الحالي.
            </div>
        `;

        return;
    }

    if (firstValue <= 0) {

        autoTransitions.innerHTML = `
            <div class="empty-auto">
                أدخل قيمة الانتقال الأول حتى تظهر جميع المستويات تلقائياً.
            </div>
        `;

        return;
    }

    const transitions = calculateAutomaticTransitions();

    autoTransitions.innerHTML = transitions.map(item => `
        <div class="transition-card ${item.automatic ? "automatic" : "manual"}">

            <div class="transition-name">
                <strong>VIP ${item.from}</strong>
                <span>→</span>
                <strong>VIP ${item.to}</strong>
            </div>

            <div class="transition-value">
                <strong>${formatNumber(item.value)}</strong>
                <span>
                    ${item.automatic ? "تلقائي" : "القيمة التي أدخلتها"}
                </span>
            </div>

        </div>
    `).join("");
}


/* =========================================================
   التثبيت التلقائي
========================================================= */

function renderAutomaticLock() {

    const current = number(currentVip.value);
    const target = number(targetVip.value);

    if (modeCurrentLock.checked) {

        const vip = getVip(current);

        autoLockInfo.innerHTML = `
            <span>تثبيت VIP ${current}</span>
            <strong>${formatNumber(vip?.maintain || 0)}</strong>
            <small>قيمة التثبيت التلقائية</small>
        `;

        return;
    }

    if (target <= current) {

        autoLockInfo.innerHTML = `
            <span>لا يوجد مستوى مستهدف أعلى.</span>
        `;

        return;
    }

    const vip = getVip(target);

    if (!enableTargetLock.checked) {

        autoLockInfo.innerHTML = `
            <span>التثبيت غير مفعل</span>
        `;

        return;
    }

    autoLockInfo.innerHTML = `
        <span>تثبيت VIP ${target}</span>
        <strong>${formatNumber(vip?.maintain || 0)}</strong>
        <small>تم حسابه تلقائياً من جدول VIP</small>
    `;
}


/* =========================================================
   تحديث الواجهة
========================================================= */

function updateVipInterface() {

    const current = number(currentVip.value);
    const target = number(targetVip.value);

    if (modeCurrentLock.checked) {

        transitionArea.classList.remove("hidden");
        targetLockBox.classList.add("hidden");

        firstTransitionValue.disabled = true;

    } else {

        transitionArea.classList.remove("hidden");

        firstTransitionValue.disabled = false;

        if (target > current) {
            targetLockBox.classList.remove("hidden");
        } else {
            targetLockBox.classList.add("hidden");
        }
    }

    renderAutomaticTransitions();
    renderAutomaticLock();
}


/* =========================================================
   الحساب الرئيسي
========================================================= */

let lastCalculation = null;

function calculate() {

    const current = number(currentVip.value);
    const target = number(targetVip.value);
    const mult = Math.max(number(multiplier.value), 1);

    let transitions = [];
    let reach = 0;
    let lock = 0;

    if (modeCurrentLock.checked) {

        const currentData = getVip(current);

        lock = currentData?.maintain || 0;

    } else {

        transitions = calculateAutomaticTransitions();

        reach = transitions.reduce(
            (sum, item) => sum + item.value,
            0
        );

        if (enableTargetLock.checked && target > current) {

            const targetData = getVip(target);

            lock = targetData?.maintain || 0;
        }
    }

    const totalVip = reach + lock;

    const charge = totalVip / mult;

    const support =
        (charge / 1000000) * number(supportRate.value);

    const jod =
        charge / Math.max(number(jodRate.value), 1);

    const usd =
        charge / Math.max(number(usdRate.value), 1);

    lastCalculation = {
        currentVip: current,
        targetVip: target,
        multiplier: mult,

        mode: modeCurrentLock.checked
            ? "currentLock"
            : "reach",

        firstTransitionValue:
            number(firstTransitionValue.value),

        transitions,

        reach,
        lock,
        totalVip,
        charge,
        support,
        jod,
        usd,

        lockEnabled:
            modeCurrentLock.checked
                ? true
                : enableTargetLock.checked,

        status:
            operationStatus.value,

        clientName:
            clientName.value.trim(),

        clientId:
            clientId.value.trim(),

        clientStatus:
            clientStatus.value,

        supportRate:
            number(supportRate.value),

        jodRate:
            number(jodRate.value),

        usdRate:
            number(usdRate.value),

        timestamp:
            Date.now()
    };


    /* عرض النتيجة */

    if (modeCurrentLock.checked) {

        resultTitle.textContent =
            `تثبيت VIP ${current}`;

    } else {

        resultTitle.textContent =
            `VIP ${current} → VIP ${target}`;
    }

    resultMultiplier.textContent =
        `×${formatNumber(mult)}`;

    actualCharge.textContent =
        formatNumber(charge);

    reachPoints.textContent =
        formatNumber(reach);

    lockPoints.textContent =
        formatNumber(lock);

    totalVipPoints.textContent =
        formatNumber(totalVip);

    supportNeeded.textContent =
        formatNumber(support);

    jodTotal.textContent =
        formatMoney(jod);

    usdTotal.textContent =
        formatMoney(usd);

    formulaVip.textContent =
        formatNumber(totalVip);

    formulaMultiplier.textContent =
        `×${formatNumber(mult)}`;

    formulaCharge.textContent =
        formatNumber(charge);

    formulaSupport.textContent =
        formatNumber(support);

    renderAutomaticTransitions();
    renderAutomaticLock();

    return lastCalculation;
}


/* =========================================================
   Local Storage - VIP History
========================================================= */

function loadVipHistory() {

    try {

        const raw =
            localStorage.getItem(STORAGE_KEY);

        const data =
            raw ? JSON.parse(raw) : [];

        return Array.isArray(data)
            ? data
            : [];

    } catch {

        return [];
    }
}


function saveVipHistory(data) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
    );
}


/* =========================================================
   حفظ العملية
========================================================= */

function saveRecord() {

    const calculation =
        calculate();

    if (!clientId.value.trim()) {

        alert("أدخل معرف العميل أولاً.");
        clientId.focus();
        return;
    }

    const history =
        loadVipHistory();

    const record = {
        ...calculation,

        id:
            Date.now().toString(),

        date:
            new Date().toLocaleString("ar-EG"),

        name:
            clientName.value.trim() || "بدون اسم",

        customerId:
            clientId.value.trim()
    };

    history.unshift(record);

    saveVipHistory(history);

    renderHistory();
    updateStatistics();

    alert("تم حفظ العملية بنجاح.");
}


/* =========================================================
   عرض سجل VIP
========================================================= */

function statusText(status) {

    if (status === "success") return "نجاح";
    if (status === "failed") return "فشل";

    return "انتظار";
}


function statusClass(status) {

    if (status === "success") return "success";
    if (status === "failed") return "failed";

    return "pending";
}


function renderHistory() {

    const history =
        loadVipHistory();

    const search =
        historySearch.value
            .trim()
            .toLowerCase();

    const filtered =
        history.filter(record => {

            const text = `
                ${record.name || ""}
                ${record.customerId || ""}
                ${record.clientId || ""}
            `.toLowerCase();

            return text.includes(search);
        });

    if (!filtered.length) {

        historyContainer.innerHTML = `
            <div class="empty-history">
                لا توجد عمليات محفوظة.
            </div>
        `;

        return;
    }

    historyContainer.innerHTML =
        filtered.map(record => {

            const status =
                record.status || "pending";

            return `
                <div class="history-item">

                    <div class="history-main">

                        <div class="history-client">
                            <strong>
                                ${safeText(record.name || "بدون اسم")}
                            </strong>

                            <span>
                                ID:
                                ${safeText(record.customerId || record.clientId || "-")}
                            </span>
                        </div>

                        <div class="history-route">

                            <strong>
                                VIP ${record.currentVip}
                            </strong>

                            <span>→</span>

                            <strong>
                                VIP ${record.targetVip}
                            </strong>

                        </div>

                        <div class="history-values">

                            <div>
                                <span>الشحن</span>
                                <strong>
                                    ${formatNumber(record.charge)}
                                </strong>
                            </div>

                            <div>
                                <span>الدعم</span>
                                <strong>
                                    ${formatNumber(record.support)}
                                </strong>
                            </div>

                            <div>
                                <span>VIP</span>
                                <strong>
                                    ${formatNumber(record.totalVip)}
                                </strong>
                            </div>

                        </div>

                    </div>


                    <div class="history-side">

                        <span class="status ${statusClass(status)}">
                            ${statusText(status)}
                        </span>

                        <small>
                            ${safeText(record.date || "")}
                        </small>

                        <div class="history-buttons">

                            <button
                                onclick="openRecord('${record.id}')"
                            >
                                فتح
                            </button>

                            <button
                                class="delete-record"
                                onclick="deleteRecord('${record.id}')"
                            >
                                حذف
                            </button>

                        </div>

                    </div>

                </div>
            `;
        }).join("");
}


/* =========================================================
   فتح سجل
========================================================= */

window.openRecord = function(id) {

    const history =
        loadVipHistory();

    const record =
        history.find(item =>
            String(item.id) === String(id)
        );

    if (!record) return;

    currentVip.value =
        record.currentVip ?? 1;

    targetVip.value =
        record.targetVip ?? 2;

    multiplier.value =
        record.multiplier ?? 5;

    clientName.value =
        record.name || record.clientName || "";

    clientId.value =
        record.customerId || record.clientId || "";

    clientStatus.value =
        record.clientStatus || "active";

    supportRate.value =
        record.supportRate ?? 130000;

    jodRate.value =
        record.jodRate ?? 11;

    usdRate.value =
        record.usdRate ?? 15;

    operationStatus.value =
        record.status || "pending";

    if (record.mode === "currentLock") {

        modeCurrentLock.checked = true;

    } else {

        modeReach.checked = true;
    }

    let firstValue =
        record.firstTransitionValue;

    if (
        firstValue === undefined &&
        Array.isArray(record.transitions) &&
        record.transitions.length
    ) {
        firstValue =
            record.transitions[0].value;
    }

    firstTransitionValue.value =
        firstValue || "";

    enableTargetLock.checked =
        Boolean(record.lockEnabled);

    updateVipInterface();

    calculate();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
};


/* =========================================================
   حذف عملية
========================================================= */

window.deleteRecord = function(id) {

    if (!confirm("هل تريد حذف هذه العملية؟")) {
        return;
    }

    const history =
        loadVipHistory()
            .filter(item =>
                String(item.id) !== String(id)
            );

    saveVipHistory(history);

    renderHistory();
    updateStatistics();
};


/* =========================================================
   مسح سجل VIP
========================================================= */

function clearVipHistory() {

    const history =
        loadVipHistory();

    if (!history.length) return;

    if (
        !confirm(
            "سيتم حذف جميع عمليات VIP المحفوظة. هل أنت متأكد؟"
        )
    ) {
        return;
    }

    localStorage.removeItem(STORAGE_KEY);

    renderHistory();
    updateStatistics();
}


/* =========================================================
   الإحصائيات
========================================================= */

function updateStatistics() {

    const history =
        loadVipHistory();

    const totalOperations =
        history.length;

    const customers =
        new Set(
            history
                .map(item =>
                    String(
                        item.customerId ||
                        item.clientId ||
                        ""
                    ).trim()
                )
                .filter(Boolean)
        ).size;

    const totalCharge =
        history.reduce(
            (sum, item) =>
                sum + number(item.charge),
            0
        );

    const totalVip =
        history.reduce(
            (sum, item) =>
                sum + number(item.totalVip),
            0
        );

    const totalSupport =
        history.reduce(
            (sum, item) =>
                sum + number(item.support),
            0
        );

    const totalJod =
        history.reduce(
            (sum, item) =>
                sum + number(item.jod),
            0
        );

    const totalUsd =
        history.reduce(
            (sum, item) =>
                sum + number(item.usd),
            0
        );

    const totalLock =
        history.reduce(
            (sum, item) =>
                sum + number(item.lock),
            0
        );

    const success =
        history.filter(
            item => item.status === "success"
        ).length;

    const pending =
        history.filter(
            item =>
                !item.status ||
                item.status === "pending"
        ).length;

    const failed =
        history.filter(
            item => item.status === "failed"
        ).length;

    const average =
        totalOperations
            ? totalCharge / totalOperations
            : 0;


    $("statOperations").textContent =
        formatNumber(totalOperations);

    $("statCustomers").textContent =
        formatNumber(customers);

    $("statCharge").textContent =
        formatNumber(totalCharge);

    $("statVipPoints").textContent =
        formatNumber(totalVip);

    $("statSupport").textContent =
        formatNumber(totalSupport);

    $("statJod").textContent =
        formatMoney(totalJod);

    $("statUsd").textContent =
        formatMoney(totalUsd);

    $("statLock").textContent =
        formatNumber(totalLock);

    $("statSuccess").textContent =
        formatNumber(success);

    $("statPending").textContent =
        formatNumber(pending);

    $("statFailed").textContent =
        formatNumber(failed);

    $("statAverage").textContent =
        formatNumber(average);
}


/* =========================================================
   عملية جديدة
========================================================= */

function newCalculation() {

    clientName.value = "";
    clientId.value = "";

    currentVip.value = "1";
    targetVip.value = "2";
    multiplier.value = "5";

    modeReach.checked = true;
    modeCurrentLock.checked = false;

    firstTransitionValue.value = "";

    enableTargetLock.checked = false;

    operationStatus.value = "pending";

    supportRate.value = "130000";
    jodRate.value = "11";
    usdRate.value = "15";

    updateVipInterface();

    lastCalculation = null;

    resultTitle.textContent =
        "جاهز للحساب";

    resultMultiplier.textContent =
        "×5";

    actualCharge.textContent = "0";
    reachPoints.textContent = "0";
    lockPoints.textContent = "0";
    totalVipPoints.textContent = "0";
    supportNeeded.textContent = "0";
    jodTotal.textContent = "0";
    usdTotal.textContent = "0";

    formulaVip.textContent = "0";
    formulaMultiplier.textContent = "×0";
    formulaCharge.textContent = "0";
    formulaSupport.textContent = "0";
}


/* =========================================================
   الوضع الليلي / النهاري
========================================================= */

function applyTheme(theme) {

    if (theme === "light") {

        document.body.classList.add("light");

        themeToggle.textContent =
            "🌙 الوضع الليلي";

    } else {

        document.body.classList.remove("light");

        themeToggle.textContent =
            "☀️ الوضع النهاري";
    }

    localStorage.setItem(
        THEME_KEY,
        theme
    );
}


function loadTheme() {

    const saved =
        localStorage.getItem(THEME_KEY);

    applyTheme(
        saved === "light"
            ? "light"
            : "dark"
    );
}


/* =========================================================
   الحاسبة العادية
========================================================= */

let calcExpression = "";
let calcLastResult = "";
let calculatorHistory = [];


function loadCalculatorHistory() {

    try {

        const raw =
            localStorage.getItem(
                CALC_HISTORY_KEY
            );

        const data =
            raw ? JSON.parse(raw) : [];

        calculatorHistory =
            Array.isArray(data)
                ? data
                : [];

    } catch {

        calculatorHistory = [];
    }
}


function saveCalculatorHistory() {

    localStorage.setItem(
        CALC_HISTORY_KEY,
        JSON.stringify(
            calculatorHistory.slice(0, 50)
        )
    );
}


function cleanExpression(expression) {

    let exp =
        expression
            .replaceAll("×", "*")
            .replaceAll("÷", "/")
            .replaceAll("−", "-");

    exp =
        exp.replace(
            /(\d+(?:\.\d+)?)%/g,
            "($1/100)"
        );

    if (
        !/^[0-9+\-*/().\s]+$/.test(exp)
    ) {
        throw new Error("Invalid expression");
    }

    return exp;
}


function evaluateCalculatorExpression(expression) {

    const clean =
        cleanExpression(expression);

    if (!clean.trim()) {
        return 0;
    }

    const result =
        Function(
            `"use strict"; return (${clean})`
        )();

    if (
        typeof result !== "number" ||
        !Number.isFinite(result)
    ) {
        throw new Error("Invalid result");
    }

    return result;
}


function formatCalcResult(value) {

    if (!Number.isFinite(number(value))) {
        return "خطأ";
    }

    return number(value).toLocaleString(
        "en-US",
        {
            maximumFractionDigits: 10
        }
    );
}


function updateCalculatorDisplay() {

    calculatorHistoryDisplay.textContent =
        calcExpression || "";

    calculatorResult.textContent =
        calcLastResult !== ""
            ? formatCalcResult(
                number(calcLastResult)
            )
            : (
                calcExpression
                    ? calcExpression
                    : "0"
            );
}


function addCalculatorValue(value) {

    if (
        calcLastResult !== "" &&
        /^[0-9.]$/.test(value)
    ) {
        calcExpression = "";
        calcLastResult = "";
    }

    if (
        calcLastResult !== "" &&
        ["+", "-", "*", "/", "(", ")"].includes(value)
    ) {
        calcExpression =
            String(calcLastResult);

        calcLastResult = "";
    }

    calcExpression += value;

    updateCalculatorDisplay();
}


function calculateCalculator() {

    if (!calcExpression.trim()) {
        return;
    }

    try {

        const result =
            evaluateCalculatorExpression(
                calcExpression
            );

        const expression =
            calcExpression;

        calcLastResult =
            result;

        calculatorHistory.unshift({
            expression,
            result,
            date:
                new Date().toLocaleTimeString(
                    "ar-EG",
                    {
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                )
        });

        calculatorHistory =
            calculatorHistory.slice(0, 50);

        saveCalculatorHistory();
        renderCalculatorHistory();

        updateCalculatorDisplay();

    } catch {

        calcLastResult = "0";
        calculatorResult.textContent =
            "خطأ";
    }
}


function calculatorAction(action) {

    if (action === "clear") {

        calcExpression = "";
        calcLastResult = "";

        updateCalculatorDisplay();

        return;
    }


    if (action === "delete") {

        if (calcLastResult !== "") {

            calcExpression =
                String(calcLastResult);

            calcLastResult = "";
        }

        calcExpression =
            calcExpression.slice(0, -1);

        updateCalculatorDisplay();

        return;
    }


    if (action === "percent") {

        calcExpression += "%";

        updateCalculatorDisplay();

        return;
    }


    if (action === "calculate") {

        calculateCalculator();

        return;
    }


    if (action === "sign") {

        if (!calcExpression) return;

        calcExpression =
            `-(${calcExpression})`;

        calcLastResult = "";

        updateCalculatorDisplay();

        return;
    }


    if (action === "sqrt") {

        try {

            const value =
                evaluateCalculatorExpression(
                    calcExpression || "0"
                );

            if (value < 0) {
                throw new Error();
            }

            calcExpression =
                String(Math.sqrt(value));

            calcLastResult = "";

            updateCalculatorDisplay();

        } catch {

            calculatorResult.textContent =
                "خطأ";
        }

        return;
    }


    if (action === "square") {

        try {

            const value =
                evaluateCalculatorExpression(
                    calcExpression || "0"
                );

            calcExpression =
                String(value * value);

            calcLastResult = "";

            updateCalculatorDisplay();

        } catch {

            calculatorResult.textContent =
                "خطأ";
        }

        return;
    }


    if (action === "reciprocal") {

        try {

            const value =
                evaluateCalculatorExpression(
                    calcExpression || "0"
                );

            if (value === 0) {
                throw new Error();
            }

            calcExpression =
                String(1 / value);

            calcLastResult = "";

            updateCalculatorDisplay();

        } catch {

            calculatorResult.textContent =
                "خطأ";
        }
    }
}


/* =========================================================
   سجل الحاسبة
========================================================= */

function renderCalculatorHistory() {

    calcHistoryCount.textContent =
        calculatorHistory.length;

    if (!calculatorHistory.length) {

        calculatorHistoryList.innerHTML = `
            <div class="empty-calc-history">
                لا توجد حسابات سابقة.
            </div>
        `;

        return;
    }

    calculatorHistoryList.innerHTML =
        calculatorHistory.map(
            (item, index) => `
                <button
                    class="calc-history-item"
                    data-index="${index}"
                >
                    <span>
                        ${safeText(item.expression)}
                    </span>

                    <strong>
                        ${formatCalcResult(item.result)}
                    </strong>

                    <small>
                        ${safeText(item.date)}
                    </small>
                </button>
            `
        ).join("");
}


/* =========================================================
   أحداث الحاسبة
========================================================= */

document
    .querySelectorAll(".calc-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const action =
                    button.dataset.action;

                const value =
                    button.dataset.value;

                if (action) {

                    calculatorAction(action);

                } else if (value !== undefined) {

                    addCalculatorValue(value);
                }
            }
        );
    });


calculatorHistoryList.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                ".calc-history-item"
            );

        if (!button) return;

        const index =
            number(button.dataset.index);

        const item =
            calculatorHistory[index];

        if (!item) return;

        calcExpression =
            String(item.result);

        calcLastResult = "";

        updateCalculatorDisplay();
    }
);


calcClearHistory.addEventListener(
    "click",
    () => {

        if (!calculatorHistory.length) {
            return;
        }

        if (
            !confirm(
                "هل تريد حذف سجل الحاسبة؟"
            )
        ) {
            return;
        }

        calculatorHistory = [];

        saveCalculatorHistory();
        renderCalculatorHistory();
    }
);


calcSizeToggle.addEventListener(
    "click",
    () => {

        calculator.classList.toggle("large");

        calcSizeToggle.textContent =
            calculator.classList.contains("large")
                ? "تصغير"
                : "تكبير";
    }
);


/* =========================================================
   لوحة المفاتيح للحاسبة
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        const active =
            document.activeElement;

        if (
            active &&
            (
                active.tagName === "INPUT" ||
                active.tagName === "SELECT" ||
                active.tagName === "TEXTAREA"
            )
        ) {
            return;
        }

        const key =
            event.key;

        if (
            /^[0-9.]$/.test(key)
        ) {

            addCalculatorValue(key);
            return;
        }

        if (
            ["+", "-", "*", "/", "(", ")"].includes(key)
        ) {

            addCalculatorValue(key);
            return;
        }

        if (key === "Enter" || key === "=") {

            event.preventDefault();

            calculateCalculator();
            return;
        }

        if (key === "Backspace") {

            calculatorAction("delete");
            return;
        }

        if (key === "Escape") {

            calculatorAction("clear");
        }
    }
);


/* =========================================================
   الأحداث الرئيسية
========================================================= */

currentVip.addEventListener(
    "change",
    updateVipInterface
);

targetVip.addEventListener(
    "change",
    updateVipInterface
);

multiplier.addEventListener(
    "change",
    calculate
);

firstTransitionValue.addEventListener(
    "input",
    () => {

        renderAutomaticTransitions();
        calculate();
    }
);

enableTargetLock.addEventListener(
    "change",
    () => {

        renderAutomaticLock();
        calculate();
    }
);

modeReach.addEventListener(
    "change",
    () => {

        updateVipInterface();
        calculate();
    }
);

modeCurrentLock.addEventListener(
    "change",
    () => {

        updateVipInterface();
        calculate();
    }
);

supportRate.addEventListener(
    "input",
    calculate
);

jodRate.addEventListener(
    "input",
    calculate
);

usdRate.addEventListener(
    "input",
    calculate
);

operationStatus.addEventListener(
    "change",
    calculate
);

calculateBtn.addEventListener(
    "click",
    calculate
);

saveBtn.addEventListener(
    "click",
    saveRecord
);

newBtn.addEventListener(
    "click",
    newCalculation
);

historySearch.addEventListener(
    "input",
    renderHistory
);

clearHistoryBtn.addEventListener(
    "click",
    clearVipHistory
);

themeToggle.addEventListener(
    "click",
    () => {

        const isLight =
            document.body.classList.contains("light");

        applyTheme(
            isLight
                ? "dark"
                : "light"
        );
    }
);


/* =========================================================
   بدء التطبيق
========================================================= */

fillVipSelects();
renderVipTable();

loadTheme();

loadCalculatorHistory();
renderCalculatorHistory();

updateVipInterface();
calculate();

renderHistory();
updateStatistics();
