"use strict";

/* =========================================================
   مجلس القمة للشحن
   حاسبة VIP + سجل العملاء + الإحصائيات + الحاسبة العادية
========================================================= */


/* =========================================================
   جدول VIP
========================================================= */

const VIP_TABLE = [
    { level: 1,  total: 50000,       upgrade: 50000,       maintain: 30000 },
    { level: 2,  total: 100000,      upgrade: 50000,       maintain: 30000 },
    { level: 3,  total: 300000,      upgrade: 100000,      maintain: 90000 },
    { level: 4,  total: 1000000,     upgrade: 800000,      maintain: 500000 },
    { level: 5,  total: 3000000,     upgrade: 2000000,     maintain: 1300000 },
    { level: 6,  total: 7000000,     upgrade: 4000000,     maintain: 2600000 },
    { level: 7,  total: 14000000,    upgrade: 7000000,     maintain: 4500000 },
    { level: 8,  total: 26000000,    upgrade: 12000000,    maintain: 7800000 },
    { level: 9,  total: 42000000,    upgrade: 16000000,    maintain: 11000000 },
    { level: 10, total: 62000000,    upgrade: 20000000,    maintain: 14000000 },
    { level: 11, total: 102000000,   upgrade: 40000000,    maintain: 28000000 },
    { level: 12, total: 220000000,   upgrade: 118000000,   maintain: 83000000 },
    { level: 13, total: 430000000,   upgrade: 210000000,   maintain: 150000000 },
    { level: 14, total: 820000000,   upgrade: 390000000,   maintain: 310000000 },
    { level: 15, total: 1820000000,  upgrade: 1000000000,  maintain: 700000000 },
    { level: 16, total: 3820000000,  upgrade: 2000000000,  maintain: 1400000000 },
    { level: 17, total: 7382000000,  upgrade: 3500000000,  maintain: 3000000000 },
    { level: 18, total: 11882000000, upgrade: 4500000000, maintain: 4000000000 },
    { level: 19, total: 17382000000, upgrade: 5500000000, maintain: 5000000000 },
    { level: 20, total: 27382000000, upgrade: 10000000000, maintain: 9000000000 }
];


/* =========================================================
   التخزين
========================================================= */

const STORAGE_KEY = "majlis_alqimma_vip_records_v8";
const THEME_KEY = "majlis_alqimma_theme_v2";


/* =========================================================
   اختصار
========================================================= */

const $ = id => document.getElementById(id);


/* =========================================================
   العناصر
========================================================= */

const clientName = $("clientName");
const clientId = $("clientId");

const currentVip = $("currentVip");
const targetVip = $("targetVip");
const multiplier = $("multiplier");

const transitionArea = $("transitionArea");
const transitionList = $("transitionList");

const enableTargetLock = $("enableTargetLock");
const targetLockBox = $("targetLockBox");
const targetLockInput = $("targetLockInput");

const autoLockValue = $("autoLockValue");
const autoLockLevel = $("autoLockLevel");

const supportRate = $("supportRate");
const jodRate = $("jodRate");
const usdRate = $("usdRate");

const actualCharge = $("actualCharge");
const reachPoints = $("reachPoints");
const lockPoints = $("lockPoints");
const totalVipPoints = $("totalVipPoints");
const supportNeeded = $("supportNeeded");
const jodTotal = $("jodTotal");
const usdTotal = $("usdTotal");

const resultTitle = $("resultTitle");
const resultMultiplier = $("resultMultiplier");

const formulaReach = $("formulaReach");
const formulaLock = $("formulaLock");
const formulaVip = $("formulaVip");
const formulaMultiplier = $("formulaMultiplier");
const formulaSupport = $("formulaSupport");

const history = $("history");
const historySearch = $("historySearch");
const clientStatus = $("clientStatus");


/* =========================================================
   الأرقام
========================================================= */

function number(value) {

    const x = Number(value);

    if (!Number.isFinite(x) || x < 0) {
        return 0;
    }

    return x;
}


function format(value) {

    return new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 2
    }).format(number(value));
}


function formatMoney(value, suffix) {

    return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(number(value)) + " " + suffix;
}


/* =========================================================
   VIP OPTIONS
========================================================= */

function buildVipOptions() {

    currentVip.innerHTML = "";
    targetVip.innerHTML = "";

    VIP_TABLE.forEach(row => {

        const currentOption = document.createElement("option");

        currentOption.value = row.level;
        currentOption.textContent = `VIP ${row.level}`;

        currentVip.appendChild(currentOption);


        const targetOption = document.createElement("option");

        targetOption.value = row.level;
        targetOption.textContent = `VIP ${row.level}`;

        targetVip.appendChild(targetOption);

    });

    currentVip.value = "10";
    targetVip.value = "11";
}


/* =========================================================
   جدول VIP
========================================================= */

function renderVipTable() {

    const tbody = $("vipTable");

    tbody.innerHTML = "";

    VIP_TABLE.forEach(row => {

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>VIP ${row.level}</td>
            <td>${format(row.total)}</td>
            <td>${format(row.upgrade)}</td>
            <td>${format(row.maintain)}</td>
        `;

        tbody.appendChild(tr);
    });
}


/* =========================================================
   بيانات المستوى
========================================================= */

function getVip(level) {

    return VIP_TABLE.find(
        row => row.level === Number(level)
    );
}


/* =========================================================
   الوضع
========================================================= */

function getMode() {

    const selected = document.querySelector(
        'input[name="mode"]:checked'
    );

    return selected ? selected.value : "reach";
}


/* =========================================================
   قيمة الانتقال الأول
========================================================= */

function getFirstTransitionInput() {

    return document.querySelector(".first-transition-value");
}


/* =========================================================
   إنشاء الانتقالات
=========================================================

المستخدم يدخل فقط:

VIP 2 → VIP 3 = القيمة الفعلية

بعدها:

VIP 3 → VIP 4 = تلقائي
VIP 4 → VIP 5 = تلقائي
VIP 5 → VIP 6 = تلقائي
...

لا تظهر خانات كثيرة للمستخدم.
========================================================= */

function renderTransitions(savedFirstValue = "") {

    const current = Number(currentVip.value);
    const target = Number(targetVip.value);

    transitionList.innerHTML = "";

    targetLockBox.classList.toggle(
        "hidden",
        target <= current
    );


    if (target <= current) {

        transitionArea.classList.remove("hidden");

        transitionList.innerHTML = `
            <div class="empty">
                اختر مستوى مطلوب أعلى من المستوى الحالي.
            </div>
        `;

        calculate();

        return;
    }


    transitionArea.classList.remove("hidden");


    const firstTo = current + 1;

    const firstSaved =
        savedFirstValue !== ""
            ? savedFirstValue
            : "";


    /* الانتقال الأول فقط */

    const firstBox = document.createElement("div");

    firstBox.className = "transition first-transition";

    firstBox.innerHTML = `

        <div class="transition-head">
            <span>أدخل القيمة الفعلية</span>
            <strong>VIP ${current} → VIP ${firstTo}</strong>
        </div>

        <div class="field">

            <label>
                المتبقي الفعلي للدخول إلى VIP ${firstTo}
            </label>

            <input
                class="first-transition-value"
                type="number"
                min="0"
                step="1"
                value="${firstSaved}"
                placeholder="أدخل القيمة هنا"
            >

            <small>
                هذه هي الخانة الوحيدة التي تحتاج إدخال يدوي.
            </small>

        </div>
    `;

    transitionList.appendChild(firstBox);


    /* المستويات التالية تلقائية */

    if (target > firstTo) {

        const autoTitle = document.createElement("div");

        autoTitle.className = "automatic-title";

        autoTitle.innerHTML = `
            <span>الحساب التلقائي</span>
            <small>القيم التالية مأخوذة من جدول VIP</small>
        `;

        transitionList.appendChild(autoTitle);


        for (let from = firstTo; from < target; from++) {

            const to = from + 1;
            const data = getVip(to);

            const div = document.createElement("div");

            div.className = "transition automatic-transition";

            div.innerHTML = `

                <div class="transition-head">
                    <span>تلقائي</span>
                    <strong>VIP ${from} → VIP ${to}</strong>
                </div>

                <div class="auto-transition-value">

                    <span>القيمة المحسوبة</span>

                    <strong>
                        ${format(data ? data.upgrade : 0)}
                    </strong>

                </div>

            `;

            transitionList.appendChild(div);
        }
    }


    updateAutoLock();

    calculate();
}


/* =========================================================
   حساب نقاط الوصول
========================================================= */

function calculateReach() {

    const current = Number(currentVip.value);
    const target = Number(targetVip.value);

    if (target <= current) {
        return 0;
    }


    const firstInput = getFirstTransitionInput();

    const firstValue = firstInput
        ? number(firstInput.value)
        : 0;


    let total = firstValue;


    /*
    كل انتقال بعد الأول يؤخذ تلقائياً
    من XP الترقية للمستوى الهدف.
    */

    for (let level = current + 1; level < target; level++) {

        const nextLevel = level + 1;
        const data = getVip(nextLevel);

        if (data) {
            total += number(data.upgrade);
        }
    }


    return total;
}


/* =========================================================
   التثبيت التلقائي
========================================================= */

function getAutomaticLockValue() {

    const mode = getMode();

    let level = 0;

    if (mode === "currentLock") {
        level = Number(currentVip.value);
    } else {
        level = Number(targetVip.value);
    }

    const data = getVip(level);

    return data
        ? number(data.maintain)
        : 0;
}


function updateAutoLock() {

    const mode = getMode();

    if (mode === "currentLock") {

        targetLockBox.classList.add("hidden");
        targetLockInput.classList.add("hidden");

        return;
    }


    const target = Number(targetVip.value);

    if (target <= Number(currentVip.value)) {

        targetLockBox.classList.add("hidden");

        return;
    }


    targetLockBox.classList.remove("hidden");


    const value = getAutomaticLockValue();

    autoLockValue.textContent = format(value);
    autoLockLevel.textContent = `VIP ${target}`;

    targetLockInput.classList.toggle(
        "hidden",
        !enableTargetLock.checked
    );
}


/* =========================================================
   التثبيت الحالي
========================================================= */

function renderCurrentLock() {

    transitionArea.classList.remove("hidden");
    targetLockBox.classList.add("hidden");

    transitionList.innerHTML = "";


    const current = Number(currentVip.value);
    const data = getVip(current);

    const value = data
        ? number(data.maintain)
        : 0;


    transitionList.innerHTML = `

        <div class="transition current-lock-card">

            <div class="transition-head">

                <span>تلقائي</span>

                <strong>
                    تثبيت VIP ${current}
                </strong>

            </div>


            <div class="auto-lock-big">

                <small>قيمة التثبيت المحسوبة تلقائياً</small>

                <strong>
                    ${format(value)}
                </strong>

                <span>
                    مأخوذة من XP للحفاظ في جدول VIP
                </span>

            </div>

        </div>
    `;


    calculate();
}


/* =========================================================
   حساب النتيجة
========================================================= */

function calculate() {

    const mode = getMode();

    const current = Number(currentVip.value);
    const target = Number(targetVip.value);

    const x = number(multiplier.value);

    const supportPerMillion = number(supportRate.value);

    const jodPerSupportUnit = number(jodRate.value);
    const usdPerSupportUnit = number(usdRate.value);


    let reach = 0;
    let lock = 0;


    if (mode === "currentLock") {

        const data = getVip(current);

        lock = data
            ? number(data.maintain)
            : 0;

    } else {

        if (target > current) {

            reach = calculateReach();

            if (enableTargetLock.checked) {
                lock = getAutomaticLockValue();
            }

        }
    }


    const total = reach + lock;

    const charge = x > 0
        ? total / x
        : 0;


    /*
    ========================================================
    التصحيح المهم:

    الدعم = الشحن الفعلي ÷ 1,000,000 × دعم المليون

    سعر الدعم:
    كل supportRate دعم = jodRate دينار
    كل supportRate دعم = usdRate دولار

    لذلك:

    السعر بالدينار =
    الدعم ÷ 130000 × 11

    وليس:
    الشحن ÷ 1,000,000 × 11
    ========================================================
    */


    const support =
        (charge / 1000000) *
        supportPerMillion;


    const jod =
        supportPerMillion > 0
            ? (support / supportPerMillion) * jodPerSupportUnit
            : 0;


    const usd =
        supportPerMillion > 0
            ? (support / supportPerMillion) * usdPerSupportUnit
            : 0;


    showCalculation(
        current,
        target,
        reach,
        lock,
        total,
        x,
        support,
        jod,
        usd,
        supportPerMillion,
        jodPerSupportUnit,
        usdPerSupportUnit
    );
}


/* =========================================================
   عرض النتيجة
========================================================= */

function showCalculation(
    current,
    target,
    reach,
    lock,
    total,
    x,
    support,
    jod,
    usd,
    supportPerMillion,
    jodRateValue,
    usdRateValue
) {

    if (current === target) {

        resultTitle.textContent =
            `تثبيت VIP ${current}`;

    } else {

        resultTitle.textContent =
            `VIP ${current} → VIP ${target}`;
    }


    resultMultiplier.textContent =
        `×${x}`;


    actualCharge.textContent =
        format(total / (x || 1));


    reachPoints.textContent =
        format(reach);


    lockPoints.textContent =
        format(lock);


    totalVipPoints.textContent =
        format(total);


    supportNeeded.textContent =
        format(support);


    jodTotal.textContent =
        formatMoney(jod, "د.أ");


    usdTotal.textContent =
        formatMoney(usd, "$");


    formulaReach.textContent =
        format(reach);


    formulaLock.textContent =
        format(lock);


    formulaVip.textContent =
        format(total);


    formulaMultiplier.textContent =
        `×${x}`;


    formulaSupport.textContent =
        `${format(total / (x || 1))} ÷ 1,000,000 × ${format(supportPerMillion)} = ${format(support)}`;

}


/* =========================================================
   الوضع UI
========================================================= */

function updateModeUI() {

    const mode = getMode();

    const reachLabel = $("reachModeLabel");
    const currentLabel = $("currentLockLabel");


    reachLabel.classList.toggle(
        "active",
        mode === "reach"
    );


    currentLabel.classList.toggle(
        "active",
        mode === "currentLock"
    );


    if (mode === "currentLock") {

        renderCurrentLock();

    } else {

        renderTransitions();
    }
}


/* =========================================================
   السجلات
========================================================= */

function getRecords() {

    try {

        const data =
            localStorage.getItem(STORAGE_KEY);

        if (!data) {
            return [];
        }

        const parsed = JSON.parse(data);

        return Array.isArray(parsed)
            ? parsed
            : [];

    } catch {

        return [];
    }
}


function saveRecords(records) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(records)
    );
}


/* =========================================================
   إنشاء سجل
========================================================= */

function createRecord() {

    calculate();

    const mode = getMode();

    const current = Number(currentVip.value);
    const target = Number(targetVip.value);

    const reach = mode === "reach"
        ? calculateReach()
        : 0;

    const lock = mode === "currentLock"
        ? getAutomaticLockValue()
        : (
            enableTargetLock.checked
                ? getAutomaticLockValue()
                : 0
        );

    const total = reach + lock;

    const x = number(multiplier.value);

    const charge = x > 0
        ? total / x
        : 0;

    const support =
        (charge / 1000000) *
        number(supportRate.value);

    const jod =
        number(supportRate.value) > 0
            ? (support / number(supportRate.value)) * number(jodRate.value)
            : 0;

    const usd =
        number(supportRate.value) > 0
            ? (support / number(supportRate.value)) * number(usdRate.value)
            : 0;


    return {

        id: Date.now() + Math.random(),

        created: new Date().toISOString(),

        clientName: clientName.value.trim(),

        clientId: clientId.value.trim(),

        mode,

        currentVip: current,

        targetVip: target,

        multiplier: x,

        firstTransition:
            getFirstTransitionInput()
                ? number(getFirstTransitionInput().value)
                : 0,

        targetLockEnabled:
            mode === "reach"
                ? enableTargetLock.checked
                : true,

        reach,
        lock,
        total,
        charge,
        support,
        jod,
        usd,

        supportRate:
            number(supportRate.value),

        jodRate:
            number(jodRate.value),

        usdRate:
            number(usdRate.value)
    };
}


/* =========================================================
   حفظ
========================================================= */

$("saveBtn").addEventListener(
    "click",
    () => {

        const id = clientId.value.trim();


        if (!id) {

            alert("أدخل ID الحساب أولاً.");

            clientId.focus();

            return;
        }


        const records = getRecords();

        records.unshift(createRecord());

        saveRecords(records);

        clientStatus.textContent =
            `تم حفظ العملية للعميل ID: ${id}`;

        clientStatus.classList.remove("hidden");

        renderHistory();

        updateStats();

        alert("تم حفظ العملية بنجاح.");
    }
);


/* =========================================================
   عرض السجل
========================================================= */

function renderHistory() {

    const records = getRecords();

    const query =
        historySearch.value
            .trim()
            .toLowerCase();


    const filtered = records.filter(record => {

        return (

            !query ||

            String(record.clientId)
                .toLowerCase()
                .includes(query)

            ||

            String(record.clientName)
                .toLowerCase()
                .includes(query)

        );
    });


    history.innerHTML = "";


    if (!filtered.length) {

        history.innerHTML = `
            <div class="empty">
                لا توجد عمليات محفوظة.
            </div>
        `;

        return;
    }


    filtered.forEach(record => {

        const item = document.createElement("div");

        item.className = "history-item";


        const date =
            new Date(record.created)
                .toLocaleString("ar");


        const operation =
            record.mode === "currentLock"
                ? `تثبيت VIP ${record.currentVip}`
                : `VIP ${record.currentVip} → VIP ${record.targetVip}`;


        item.innerHTML = `

            <div class="history-main">

                <strong>
                    ${safe(record.clientName || "بدون اسم")}
                </strong>

                <span>
                    ID: ${safe(record.clientId)}
                </span>

                <span>
                    ${operation} · ×${record.multiplier}
                </span>

                <span>
                    الشحن: ${format(record.charge)} كوينز
                </span>

                <span>
                    الدعم: ${format(record.support)}
                </span>

                <span>
                    ${safe(date)}
                </span>

            </div>


            <div class="history-buttons">

                <button data-open="${record.id}">
                    فتح
                </button>

                <button
                    class="delete"
                    data-delete="${record.id}"
                >
                    حذف
                </button>

            </div>
        `;


        history.appendChild(item);
    });
}


/* =========================================================
   حماية النص
========================================================= */

function safe(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================================================
   فتح سجل
========================================================= */

history.addEventListener(
    "click",
    event => {

        const openId =
            event.target.dataset.open;

        const deleteId =
            event.target.dataset.delete;


        if (openId) {
            loadRecord(Number(openId));
        }


        if (deleteId) {
            deleteRecord(Number(deleteId));
        }
    }
);


/* =========================================================
   تحميل سجل
========================================================= */

function loadRecord(id) {

    const record =
        getRecords().find(
            item => item.id === id
        );


    if (!record) {
        return;
    }


    clientName.value =
        record.clientName || "";


    clientId.value =
        record.clientId || "";


    currentVip.value =
        String(record.currentVip);


    targetVip.value =
        String(record.targetVip);


    multiplier.value =
        String(record.multiplier);


    supportRate.value =
        record.supportRate || 130000;


    jodRate.value =
        record.jodRate || 11;


    usdRate.value =
        record.usdRate || 15;


    const radio =
        document.querySelector(
            `input[name="mode"][value="${record.mode}"]`
        );


    if (radio) {
        radio.checked = true;
    }


    enableTargetLock.checked =
        Boolean(record.targetLockEnabled);


    updateModeUI();


    if (record.mode === "reach") {

        const input =
            getFirstTransitionInput();

        if (input) {
            input.value =
                record.firstTransition || 0;
        }

        updateAutoLock();
    }


    calculate();


    clientStatus.textContent =
        `تم فتح سجل العميل ID: ${record.clientId}`;

    clientStatus.classList.remove("hidden");


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================================
   حذف سجل
========================================================= */

function deleteRecord(id) {

    if (!confirm("هل تريد حذف هذه العملية؟")) {
        return;
    }


    const records =
        getRecords().filter(
            item => item.id !== id
        );


    saveRecords(records);

    renderHistory();

    updateStats();
}


/* =========================================================
   حذف الكل
========================================================= */

$("clearHistory").addEventListener(
    "click",
    () => {

        const records = getRecords();


        if (!records.length) {

            alert("السجل فارغ.");

            return;
        }


        if (!confirm(
            "هل تريد حذف جميع العمليات المحفوظة؟"
        )) {
            return;
        }


        localStorage.removeItem(STORAGE_KEY);

        renderHistory();

        updateStats();
    }
);


/* =========================================================
   البحث
========================================================= */

historySearch.addEventListener(
    "input",
    renderHistory
);


/* =========================================================
   تغيير المستويات
========================================================= */

currentVip.addEventListener(
    "change",
    updateModeUI
);


targetVip.addEventListener(
    "change",
    () => {

        updateAutoLock();

        calculate();
    }
);


/* =========================================================
   العرض
========================================================= */

multiplier.addEventListener(
    "change",
    calculate
);


/* =========================================================
   التثبيت
========================================================= */

enableTargetLock.addEventListener(
    "change",
    () => {

        updateAutoLock();

        calculate();
    }
);


/* =========================================================
   الأسعار
========================================================= */

[
    supportRate,
    jodRate,
    usdRate
].forEach(input => {

    input.addEventListener(
        "input",
        calculate
    );
});


/* =========================================================
   قيمة الانتقال الأول
========================================================= */

transitionList.addEventListener(
    "input",
    event => {

        if (
            event.target.matches(
                ".first-transition-value"
            )
        ) {

            calculate();
        }
    }
);


/* =========================================================
   نوع العملية
========================================================= */

document
    .querySelectorAll(
        'input[name="mode"]'
    )
    .forEach(radio => {

        radio.addEventListener(
            "change",
            updateModeUI
        );

    });


/* =========================================================
   الحساب
========================================================= */

$("calculateBtn").addEventListener(
    "click",
    calculate
);


/* =========================================================
   عملية جديدة
========================================================= */

$("newBtn").addEventListener(
    "click",
    () => {

        if (!confirm(
            "بدء عملية جديدة؟ السجلات المحفوظة لن تحذف."
        )) {
            return;
        }


        clientName.value = "";
        clientId.value = "";

        currentVip.value = "10";
        targetVip.value = "11";

        multiplier.value = "5";

        supportRate.value = "130000";
        jodRate.value = "11";
        usdRate.value = "15";

        enableTargetLock.checked = false;


        const reachRadio =
            document.querySelector(
                'input[name="mode"][value="reach"]'
            );


        reachRadio.checked = true;


        clientStatus.classList.add("hidden");


        updateModeUI();

        calculate();


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
);


/* =========================================================
   الإحصائيات
========================================================= */

function updateStats() {

    const records = getRecords();


    const operations = records.length;


    /*
    العميل يعتبر واحداً فقط حتى لو لديه
    أكثر من عملية.
    */

    const customers =
        new Set(
            records
                .map(record => String(record.clientId || "").trim())
                .filter(Boolean)
        ).size;


    const totalCharge =
        records.reduce(
            (sum, record) =>
                sum + number(record.charge),
            0
        );


    const totalSupport =
        records.reduce(
            (sum, record) =>
                sum + number(record.support),
            0
        );


    const totalVip =
        records.reduce(
            (sum, record) =>
                sum + number(record.total),
            0
        );


    const totalJod =
        records.reduce(
            (sum, record) =>
                sum + number(record.jod),
            0
        );


    const totalUsd =
        records.reduce(
            (sum, record) =>
                sum + number(record.usd),
            0
        );


    const highestVip =
        records.length
            ? Math.max(
                ...records.map(
                    record =>
                        number(record.targetVip)
                )
            )
            : 0;


    $("statOperations").textContent =
        format(operations);


    $("statCustomers").textContent =
        format(customers);


    $("statCharge").textContent =
        format(totalCharge);


    $("statSupport").textContent =
        format(totalSupport);


    $("statVipPoints").textContent =
        format(totalVip);


    $("statJod").textContent =
        format(totalJod);


    $("statUsd").textContent =
        format(totalUsd);


    $("statHighestVip").textContent =
        `VIP ${highestVip}`;
}


/* =========================================================
   فتح وإخفاء الإحصائيات
========================================================= */

$("statsToggle").addEventListener(
    "click",
    () => {

        const panel = $("statsPanel");
        const arrow = $("statsArrow");

        const hidden =
            panel.classList.contains("hidden");


        panel.classList.toggle(
            "hidden",
            !hidden
        );


        arrow.textContent =
            hidden ? "⌃" : "⌄";
    }
);


/* =========================================================
   الوضع الليلي والنهاري
========================================================= */

function loadTheme() {

    const saved =
        localStorage.getItem(THEME_KEY);


    if (saved === "light") {

        document.body.classList.add("light");

        $("themeToggle").textContent = "☀";

    } else {

        document.body.classList.remove("light");

        $("themeToggle").textContent = "☾";
    }
}


$("themeToggle").addEventListener(
    "click",
    () => {

        document.body.classList.toggle("light");


        const light =
            document.body.classList.contains("light");


        localStorage.setItem(
            THEME_KEY,
            light ? "light" : "dark"
        );


        $("themeToggle").textContent =
            light ? "☀" : "☾";
    }
);


/* =========================================================
   الحاسبة العادية
========================================================= */

(function () {

    const result =
        $("calculatorResult");

    const calcHistory =
        $("calculatorHistory");

    const buttons =
        document.querySelectorAll(".calc-btn");


    if (!result || !calcHistory || !buttons.length) {
        return;
    }


    let expression = "";
    let justCalculated = false;


    function updateDisplay() {

        result.textContent =
            expression || "0";
    }


    function calculateExpression() {

        if (!expression) {
            return;
        }


        try {

            let exp =
                expression
                    .replace(/×/g, "*")
                    .replace(/÷/g, "/");


            /*
            النسبة المئوية
            */

            exp =
                exp.replace(
                    /(\d+(?:\.\d+)?)%/g,
                    "($1/100)"
                );


            if (
                !/^[0-9+\-*/().\s]+$/.test(exp)
            ) {
                throw new Error("Invalid");
            }


            const answer =
                Function(
                    `"use strict"; return (${exp})`
                )();


            if (!Number.isFinite(answer)) {
                throw new Error("Invalid");
            }


            calcHistory.textContent =
                expression + " =";


            expression =
                String(
                    Number.isInteger(answer)
                        ? answer
                        : Number(
                            answer.toFixed(10)
                        )
                );


            justCalculated = true;

            updateDisplay();

        } catch {

            calcHistory.textContent =
                expression;

            result.textContent =
                "خطأ";

            expression = "";

            justCalculated = false;
        }
    }


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            function () {

                const value =
                    this.dataset.value;

                const action =
                    this.dataset.action;


                if (action === "clear") {

                    expression = "";

                    calcHistory.textContent = "";

                    justCalculated = false;

                    updateDisplay();

                    return;
                }


                if (action === "delete") {

                    if (justCalculated) {

                        expression = "";

                        justCalculated = false;

                    } else {

                        expression =
                            expression.slice(0, -1);
                    }


                    updateDisplay();

                    return;
                }


                if (action === "equals") {

                    calculateExpression();

                    return;
                }


                if (value) {

                    const isOperator =
                        ["+", "-", "*", "/", "%"]
                            .includes(value);


                    if (
                        justCalculated &&
                        !isOperator &&
                        value !== "."
                    ) {

                        expression = "";
                        calcHistory.textContent = "";
                    }


                    if (
                        value === "." &&
                        (
                            expression === "" ||
                            /[+\-*/]$/.test(expression)
                        )
                    ) {

                        expression += "0.";

                    } else {

                        expression += value;
                    }


                    justCalculated = false;

                    updateDisplay();
                }

            }
        );

    });


    /* لوحة المفاتيح */

    document.addEventListener(
        "keydown",
        event => {

            const key = event.key;


            if (
                /[0-9.+\-*/%]/.test(key)
            ) {

                event.preventDefault();

                const mapped =
                    key === "*"
                        ? "*"
                        : key === "/"
                            ? "/"
                            : key;


                expression += mapped;

                justCalculated = false;

                updateDisplay();

                return;
            }


            if (key === "Enter" || key === "=") {

                event.preventDefault();

                calculateExpression();

                return;
            }


            if (key === "Backspace") {

                event.preventDefault();

                expression =
                    expression.slice(0, -1);

                updateDisplay();

                return;
            }


            if (key === "Escape") {

                event.preventDefault();

                expression = "";

                calcHistory.textContent = "";

                updateDisplay();
            }

        }
    );

})();

/* =========================================================
   حاسبة التارجت ومكاسب الألعاب
========================================================= */

(function initTargetGameCalculator() {

    const targetInput = document.getElementById("targetAmount");
    const gameInput = document.getElementById("gameAmount");

    const targetJod = document.getElementById("targetJodResult");
    const targetUsd = document.getElementById("targetUsdResult");

    const gameJod = document.getElementById("gameJodResult");
    const gameUsd = document.getElementById("gameUsdResult");


    if (
        !targetInput ||
        !gameInput ||
        !targetJod ||
        !targetUsd ||
        !gameJod ||
        !gameUsd
    ) {
        return;
    }


    /* =====================================================
       أسعار التارجت
       
       كل 100,000 تارجت:
       7 دينار
       10 دولار
    ===================================================== */

    const TARGET_BASE = 100000;

    const TARGET_JOD_RATE = 7;

    const TARGET_USD_RATE = 10;


    /* =====================================================
       أسعار مكاسب الألعاب

       كل 100,000 مكاسب ألعاب:
       6 دينار
       8 دولار
    ===================================================== */

    const GAME_BASE = 100000;

    const GAME_JOD_RATE = 6;

    const GAME_USD_RATE = 8;


    /* =====================================================
       تنسيق الأرقام
    ===================================================== */

    function formatNumber(value, decimals = 2) {

        if (!Number.isFinite(value)) {
            return "0.00";
        }


        return value.toLocaleString("en-US", {

            minimumFractionDigits: decimals,

            maximumFractionDigits: decimals

        });

    }


    /* =====================================================
       حساب التارجت
    ===================================================== */

    function calculateTarget() {

        const amount =
            parseFloat(targetInput.value);


        if (
            !Number.isFinite(amount) ||
            amount < 0
        ) {

            targetJod.textContent = "0.00 د.أ";

            targetUsd.textContent = "0.00 $";

            return;
        }


        const jod =
            (amount / TARGET_BASE) *
            TARGET_JOD_RATE;


        const usd =
            (amount / TARGET_BASE) *
            TARGET_USD_RATE;


        targetJod.textContent =
            formatNumber(jod) + " د.أ";


        targetUsd.textContent =
            formatNumber(usd) + " $";
    }


    /* =====================================================
       حساب مكاسب الألعاب
    ===================================================== */

    function calculateGame() {

        const amount =
            parseFloat(gameInput.value);


        if (
            !Number.isFinite(amount) ||
            amount < 0
        ) {

            gameJod.textContent = "0.00 د.أ";

            gameUsd.textContent = "0.00 $";

            return;
        }


        const jod =
            (amount / GAME_BASE) *
            GAME_JOD_RATE;


        const usd =
            (amount / GAME_BASE) *
            GAME_USD_RATE;


        gameJod.textContent =
            formatNumber(jod) + " د.أ";


        gameUsd.textContent =
            formatNumber(usd) + " $";
    }


    /* =====================================================
       تحديث مباشر أثناء الكتابة
    ===================================================== */

    targetInput.addEventListener(
        "input",
        calculateTarget
    );


    gameInput.addEventListener(
        "input",
        calculateGame
    );


    /* =====================================================
       حساب أولي
    ===================================================== */

    calculateTarget();

    calculateGame();

})();

/* =========================================================
   تشغيل
========================================================= */

buildVipOptions();

renderVipTable();

loadTheme();

updateModeUI();

renderHistory();

updateStats();

calculate();
