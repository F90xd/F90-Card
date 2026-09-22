"use strict";

/* =========================================================
   مجلس القمة للشحن
   VIP Calculator + Records + Statistics + Calculator
========================================================= */


/* =========================================================
   VIP TABLE
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
   STORAGE
========================================================= */

const STORAGE_KEY = "majlis_alqimma_vip_records_v8";
const THEME_KEY = "majlis_alqimma_theme_v2";


/* =========================================================
   HELPER
========================================================= */

const $ = id => document.getElementById(id);


/* =========================================================
   ELEMENTS
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
   NUMBER
========================================================= */

function number(value) {

    if (value === null || value === undefined) {
        return 0;
    }

    const cleaned = String(value)
        .replace(/,/g, "")
        .trim();

    if (cleaned === "") {
        return 0;
    }

    const x = Number(cleaned);

    if (!Number.isFinite(x) || x < 0) {
        return 0;
    }

    return x;
}


/* =========================================================
   FORMAT
========================================================= */

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
   SAFE
========================================================= */

function safe(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================================================
   VIP OPTIONS
========================================================= */

function buildVipOptions() {

    currentVip.innerHTML = "";
    targetVip.innerHTML = "";

    VIP_TABLE.forEach(row => {

        const currentOption =
            document.createElement("option");

        currentOption.value = row.level;
        currentOption.textContent = `VIP ${row.level}`;

        currentVip.appendChild(currentOption);


        const targetOption =
            document.createElement("option");

        targetOption.value = row.level;
        targetOption.textContent = `VIP ${row.level}`;

        targetVip.appendChild(targetOption);

    });

    currentVip.value = "10";
    targetVip.value = "11";
}


/* =========================================================
   GET VIP
========================================================= */

function getVip(level) {

    return VIP_TABLE.find(
        row => row.level === Number(level)
    );
}


/* =========================================================
   MODE
========================================================= */

function getMode() {

    const selected =
        document.querySelector(
            'input[name="mode"]:checked'
        );

    return selected
        ? selected.value
        : "reach";
}


/* =========================================================
   FIRST INPUT
========================================================= */

function getFirstTransitionInput() {

    return transitionList.querySelector(
        ".first-transition-value"
    );
}


/* =========================================================
   حفظ القيمة الحالية قبل إعادة الرسم
========================================================= */

let firstTransitionMemory = "";


/* =========================================================
   RENDER TRANSITIONS
========================================================= */

function renderTransitions() {

    const current = Number(currentVip.value);
    const target = Number(targetVip.value);

    const oldInput =
        transitionList.querySelector(
            ".first-transition-value"
        );

    if (oldInput) {
        firstTransitionMemory = oldInput.value;
    }


    transitionList.innerHTML = "";


    if (target <= current) {

        transitionArea.classList.remove("hidden");

        transitionList.innerHTML = `
            <div class="empty">
                اختر مستوى مطلوب أعلى من المستوى الحالي.
            </div>
        `;

        targetLockBox.classList.add("hidden");

        calculate();

        return;
    }


    transitionArea.classList.remove("hidden");


    /* =====================================================
       الخانة الوحيدة التي يكتب فيها المستخدم
    ===================================================== */

    const firstTo = current + 1;

    const firstBox =
        document.createElement("div");

    firstBox.className =
        "transition first-transition";


    firstBox.innerHTML = `

        <div class="transition-head">

            <span>
                أدخل القيمة الفعلية
            </span>

            <strong>
                VIP ${current} → VIP ${firstTo}
            </strong>

        </div>


        <div class="field">

            <label>
                المتبقي الفعلي للدخول إلى VIP ${firstTo}
            </label>

            <input
                class="first-transition-value"
                id="firstTransitionInput"
                type="text"
                inputmode="numeric"
                autocomplete="off"
                spellcheck="false"
                placeholder="أدخل القيمة هنا"
            >

            <small>
                هذه هي الخانة الوحيدة التي تحتاج إدخال يدوي.
            </small>

        </div>
    `;


    transitionList.appendChild(firstBox);


    const input =
        transitionList.querySelector(
            ".first-transition-value"
        );


    /*
    ========================================================
    مهم جداً

    لا يوجد هنا:
    input.value = ...
    أثناء كل عملية كتابة.

    القيمة توضع مرة واحدة فقط عند إنشاء الخانة.
    ========================================================
    */

    if (
        firstTransitionMemory !== null &&
        firstTransitionMemory !== undefined
    ) {

        input.value =
            String(firstTransitionMemory);
    }


    /* =====================================================
       المستويات التالية تلقائية
    ===================================================== */

    if (target > firstTo) {

        const autoTitle =
            document.createElement("div");

        autoTitle.className =
            "automatic-title";

        autoTitle.innerHTML = `
            <span>الحساب التلقائي</span>
            <small>
                جميع المستويات التالية تحسب تلقائياً
            </small>
        `;

        transitionList.appendChild(autoTitle);


        for (
            let from = firstTo;
            from < target;
            from++
        ) {

            const to = from + 1;

            const data =
                getVip(to);

            const value =
                data
                    ? number(data.upgrade)
                    : 0;


            const div =
                document.createElement("div");

            div.className =
                "transition automatic-transition";


            div.innerHTML = `

                <div class="transition-head">

                    <span>
                        تلقائي
                    </span>

                    <strong>
                        VIP ${from} → VIP ${to}
                    </strong>

                </div>


                <div class="auto-transition-value">

                    <span>
                        القيمة المحسوبة
                    </span>

                    <strong>
                        ${format(value)}
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
   CALCULATE REACH
========================================================= */

function calculateReach() {

    const current =
        Number(currentVip.value);

    const target =
        Number(targetVip.value);


    if (target <= current) {
        return 0;
    }


    const input =
        getFirstTransitionInput();


    const firstValue =
        input
            ? number(input.value)
            : number(firstTransitionMemory);


    let total =
        firstValue;


    /*
    VIP 2 → VIP 3
    = القيمة التي يدخلها المستخدم

    VIP 3 → VIP 4
    = upgrade الخاص بـ VIP 4

    VIP 4 → VIP 5
    = upgrade الخاص بـ VIP 5

    وهكذا
    */

    for (
        let level = current + 1;
        level < target;
        level++
    ) {

        const nextLevel =
            level + 1;

        const data =
            getVip(nextLevel);


        if (data) {
            total += number(data.upgrade);
        }
    }


    return total;
}


/* =========================================================
   AUTOMATIC LOCK
========================================================= */

function getAutomaticLockValue() {

    const mode =
        getMode();


    let level;


    if (mode === "currentLock") {

        level =
            Number(currentVip.value);

    } else {

        level =
            Number(targetVip.value);
    }


    const data =
        getVip(level);


    return data
        ? number(data.maintain)
        : 0;
}


/* =========================================================
   UPDATE LOCK
========================================================= */

function updateAutoLock() {

    const mode =
        getMode();


    if (mode === "currentLock") {

        targetLockBox.classList.add("hidden");

        if (targetLockInput) {
            targetLockInput.classList.add("hidden");
        }

        return;
    }


    const current =
        Number(currentVip.value);

    const target =
        Number(targetVip.value);


    if (target <= current) {

        targetLockBox.classList.add("hidden");

        return;
    }


    targetLockBox.classList.remove("hidden");


    const value =
        getAutomaticLockValue();


    autoLockValue.textContent =
        format(value);


    autoLockLevel.textContent =
        `VIP ${target}`;


    if (targetLockInput) {

        targetLockInput.classList.toggle(
            "hidden",
            !enableTargetLock.checked
        );
    }
}


/* =========================================================
   CURRENT LOCK
========================================================= */

function renderCurrentLock() {

    transitionArea.classList.remove("hidden");

    targetLockBox.classList.add("hidden");

    const current =
        Number(currentVip.value);

    const data =
        getVip(current);

    const value =
        data
            ? number(data.maintain)
            : 0;


    transitionList.innerHTML = `

        <div class="transition current-lock-card">

            <div class="transition-head">

                <span>
                    تلقائي
                </span>

                <strong>
                    تثبيت VIP ${current}
                </strong>

            </div>


            <div class="auto-lock-big">

                <small>
                    قيمة التثبيت المحسوبة تلقائياً
                </small>

                <strong>
                    ${format(value)}
                </strong>

                <span>
                    مأخوذة من جدول VIP
                </span>

            </div>

        </div>
    `;


    calculate();
}


/* =========================================================
   MAIN CALCULATION
========================================================= */

function calculate() {

    const mode =
        getMode();


    const current =
        Number(currentVip.value);

    const target =
        Number(targetVip.value);


    const x =
        number(multiplier.value);


    const supportPerMillion =
        number(supportRate.value);


    const jodPerSupportUnit =
        number(jodRate.value);


    const usdPerSupportUnit =
        number(usdRate.value);


    let reach = 0;
    let lock = 0;


    if (mode === "currentLock") {

        const data =
            getVip(current);

        lock =
            data
                ? number(data.maintain)
                : 0;

    } else {

        if (target > current) {

            reach =
                calculateReach();


            if (
                enableTargetLock &&
                enableTargetLock.checked
            ) {

                lock =
                    getAutomaticLockValue();
            }
        }
    }


    const total =
        reach + lock;


    const charge =
        x > 0
            ? total / x
            : 0;


    /*
    ========================================================
    الدعم

    مثال:
    130,000 دعم = 11 دينار
    130,000 دعم = 15 دولار

    لذلك:
    1 دعم = 11 / 130000 دينار
    1 دعم = 15 / 130000 دولار
    ========================================================
    */


    const support =
        (charge / 1000000) *
        supportPerMillion;


    const jod =
        supportPerMillion > 0
            ? (support / supportPerMillion) *
              jodPerSupportUnit
            : 0;


    const usd =
        supportPerMillion > 0
            ? (support / supportPerMillion) *
              usdPerSupportUnit
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
        supportPerMillion
    );
}


/* =========================================================
   SHOW CALCULATION
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
    supportPerMillion
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
        format(
            x > 0
                ? total / x
                : 0
        );


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
        `${format(actualChargeValue(total, x))} ÷ 1,000,000 × ${format(supportPerMillion)} = ${format(support)}`;
}


/* =========================================================
   ACTUAL CHARGE VALUE
========================================================= */

function actualChargeValue(total, x) {

    return x > 0
        ? total / x
        : 0;
}


/* =========================================================
   MODE UI
========================================================= */

function updateModeUI() {

    const mode =
        getMode();


    const reachLabel =
        $("reachModeLabel");

    const currentLabel =
        $("currentLockLabel");


    if (reachLabel) {

        reachLabel.classList.toggle(
            "active",
            mode === "reach"
        );
    }


    if (currentLabel) {

        currentLabel.classList.toggle(
            "active",
            mode === "currentLock"
        );
    }


    if (mode === "currentLock") {

        renderCurrentLock();

    } else {

        renderTransitions();
    }
}


/* =========================================================
   RECORDS
========================================================= */

function getRecords() {

    try {

        const data =
            localStorage.getItem(
                STORAGE_KEY
            );


        if (!data) {
            return [];
        }


        const parsed =
            JSON.parse(data);


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
   CREATE RECORD
========================================================= */

function createRecord() {

    calculate();


    const mode =
        getMode();


    const current =
        Number(currentVip.value);


    const target =
        Number(targetVip.value);


    const reach =
        mode === "reach"
            ? calculateReach()
            : 0;


    const lock =
        mode === "currentLock"
            ? getAutomaticLockValue()
            : (
                enableTargetLock.checked
                    ? getAutomaticLockValue()
                    : 0
            );


    const total =
        reach + lock;


    const x =
        number(multiplier.value);


    const charge =
        x > 0
            ? total / x
            : 0;


    const supportRateValue =
        number(supportRate.value);


    const support =
        (charge / 1000000) *
        supportRateValue;


    const jod =
        supportRateValue > 0
            ? (support / supportRateValue) *
              number(jodRate.value)
            : 0;


    const usd =
        supportRateValue > 0
            ? (support / supportRateValue) *
              number(usdRate.value)
            : 0;


    const input =
        getFirstTransitionInput();


    if (input) {
        firstTransitionMemory =
            input.value;
    }


    return {

        id:
            Date.now() +
            Math.random(),

        created:
            new Date().toISOString(),

        clientName:
            clientName.value.trim(),

        clientId:
            clientId.value.trim(),

        mode,

        currentVip:
            current,

        targetVip:
            target,

        multiplier:
            x,

        firstTransition:
            input
                ? number(input.value)
                : number(firstTransitionMemory),

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
            supportRateValue,

        jodRate:
            number(jodRate.value),

        usdRate:
            number(usdRate.value)
    };
}


/* =========================================================
   SAVE
========================================================= */

$("saveBtn").addEventListener(
    "click",
    () => {

        const id =
            clientId.value.trim();


        if (!id) {

            alert(
                "أدخل ID الحساب أولاً."
            );

            clientId.focus();

            return;
        }


        const records =
            getRecords();


        records.unshift(
            createRecord()
        );


        saveRecords(records);


        clientStatus.textContent =
            `تم حفظ العملية للعميل ID: ${id}`;


        clientStatus.classList.remove(
            "hidden"
        );


        renderHistory();

        updateStats();


        alert(
            "تم حفظ العملية بنجاح."
        );
    }
);


/* =========================================================
   HISTORY
========================================================= */

function renderHistory() {

    const records =
        getRecords();


    const query =
        historySearch.value
            .trim()
            .toLowerCase();


    const filtered =
        records.filter(record => {

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

        const item =
            document.createElement("div");


        item.className =
            "history-item";


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
                    ${safe(
                        record.clientName ||
                        "بدون اسم"
                    )}
                </strong>

                <span>
                    ID: ${safe(record.clientId)}
                </span>

                <span>
                    ${safe(operation)}
                    · ×${format(record.multiplier)}
                </span>

                <span>
                    الشحن:
                    ${format(record.charge)}
                    كوينز
                </span>

                <span>
                    الدعم:
                    ${format(record.support)}
                </span>

                <span>
                    ${safe(date)}
                </span>

            </div>


            <div class="history-buttons">

                <button
                    data-open="${record.id}"
                >
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
   HISTORY CLICK
========================================================= */

history.addEventListener(
    "click",
    event => {

        const openId =
            event.target.dataset.open;


        const deleteId =
            event.target.dataset.delete;


        if (openId) {

            loadRecord(
                Number(openId)
            );
        }


        if (deleteId) {

            deleteRecord(
                Number(deleteId)
            );
        }
    }
);


/* =========================================================
   LOAD RECORD
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
        record.supportRate ||
        130000;


    jodRate.value =
        record.jodRate ||
        11;


    usdRate.value =
        record.usdRate ||
        15;


    firstTransitionMemory =
        record.firstTransition !== undefined
            ? String(record.firstTransition)
            : "";


    const radio =
        document.querySelector(
            `input[name="mode"][value="${record.mode}"]`
        );


    if (radio) {
        radio.checked = true;
    }


    enableTargetLock.checked =
        Boolean(
            record.targetLockEnabled
        );


    updateModeUI();

    calculate();


    clientStatus.textContent =
        `تم فتح سجل العميل ID: ${record.clientId}`;


    clientStatus.classList.remove(
        "hidden"
    );


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================================
   DELETE RECORD
========================================================= */

function deleteRecord(id) {

    if (
        !confirm(
            "هل تريد حذف هذه العملية؟"
        )
    ) {
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
   CLEAR HISTORY
========================================================= */

$("clearHistory").addEventListener(
    "click",
    () => {

        const records =
            getRecords();


        if (!records.length) {

            alert(
                "السجل فارغ."
            );

            return;
        }


        if (
            !confirm(
                "هل تريد حذف جميع العمليات المحفوظة؟"
            )
        ) {
            return;
        }


        localStorage.removeItem(
            STORAGE_KEY
        );


        renderHistory();

        updateStats();
    }
);


/* =========================================================
   SEARCH
========================================================= */

historySearch.addEventListener(
    "input",
    renderHistory
);


/* =========================================================
   VIP CHANGE
========================================================= */

currentVip.addEventListener(
    "change",
    () => {

        /*
        عند تغيير المستوى نبدأ خانة جديدة.
        */

        firstTransitionMemory = "";

        updateModeUI();
    }
);


targetVip.addEventListener(
    "change",
    () => {

        updateAutoLock();

        calculate();
    }
);


/* =========================================================
   MULTIPLIER
========================================================= */

multiplier.addEventListener(
    "input",
    calculate
);


/* =========================================================
   TARGET LOCK
========================================================= */

enableTargetLock.addEventListener(
    "change",
    () => {

        updateAutoLock();

        calculate();
    }
);


/* =========================================================
   RATES
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
   FIRST TRANSITION INPUT
   مهم جداً:
   لا renderTransitions هنا
   ولا تغيير value
========================================================= */

transitionList.addEventListener(
    "input",
    event => {

        if (
            event.target.classList.contains(
                "first-transition-value"
            )
        ) {

            firstTransitionMemory =
                event.target.value;

            calculate();
        }
    }
);


/* =========================================================
   MODE
========================================================= */

document
    .querySelectorAll(
        'input[name="mode"]'
    )
    .forEach(radio => {

        radio.addEventListener(
            "change",
            () => {

                firstTransitionMemory = "";

                updateModeUI();
            }
        );

    });


/* =========================================================
   CALCULATE BUTTON
========================================================= */

$("calculateBtn").addEventListener(
    "click",
    calculate
);


/* =========================================================
   NEW
========================================================= */

$("newBtn").addEventListener(
    "click",
    () => {

        if (
            !confirm(
                "بدء عملية جديدة؟ السجلات المحفوظة لن تحذف."
            )
        ) {
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

        firstTransitionMemory = "";


        const reachRadio =
            document.querySelector(
                'input[name="mode"][value="reach"]'
            );


        if (reachRadio) {
            reachRadio.checked = true;
        }


        clientStatus.classList.add(
            "hidden"
        );


        updateModeUI();

        calculate();


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
);


/* =========================================================
   STATISTICS
========================================================= */

function updateStats() {

    const records =
        getRecords();


    const operations =
        records.length;


    const customers =
        new Set(
            records
                .map(
                    record =>
                        String(
                            record.clientId || ""
                        ).trim()
                )
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
                        number(
                            record.targetVip
                        )
                )
            )
            : 0;


    const statOperations =
        $("statOperations");

    const statCustomers =
        $("statCustomers");

    const statCharge =
        $("statCharge");

    const statSupport =
        $("statSupport");

    const statVipPoints =
        $("statVipPoints");

    const statJod =
        $("statJod");

    const statUsd =
        $("statUsd");

    const statHighestVip =
        $("statHighestVip");


    if (statOperations)
        statOperations.textContent =
            format(operations);


    if (statCustomers)
        statCustomers.textContent =
            format(customers);


    if (statCharge)
        statCharge.textContent =
            format(totalCharge);


    if (statSupport)
        statSupport.textContent =
            format(totalSupport);


    if (statVipPoints)
        statVipPoints.textContent =
            format(totalVip);


    if (statJod)
        statJod.textContent =
            format(totalJod);


    if (statUsd)
        statUsd.textContent =
            format(totalUsd);


    if (statHighestVip)
        statHighestVip.textContent =
            highestVip
                ? `VIP ${highestVip}`
                : "—";
}


/* =========================================================
   STATISTICS TOGGLE
========================================================= */

$("statsToggle").addEventListener(
    "click",
    () => {

        const panel =
            $("statsPanel");

        const arrow =
            $("statsArrow");


        if (!panel) {
            return;
        }


        const isHidden =
            panel.classList.contains(
                "hidden"
            );


        panel.classList.toggle(
            "hidden",
            !isHidden
        );


        if (arrow) {

            arrow.textContent =
                isHidden
                    ? "⌃"
                    : "⌄";
        }
    }
);


/* =========================================================
   THEME
========================================================= */

function loadTheme() {

    const saved =
        localStorage.getItem(
            THEME_KEY
        );


    if (saved === "light") {

        document.body.classList.add(
            "light"
        );


        $("themeToggle").textContent =
            "☀";

    } else {

        document.body.classList.remove(
            "light"
        );


        $("themeToggle").textContent =
            "☾";
    }
}


$("themeToggle").addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "light"
        );


        const light =
            document.body.classList.contains(
                "light"
            );


        localStorage.setItem(
            THEME_KEY,
            light
                ? "light"
                : "dark"
        );


        $("themeToggle").textContent =
            light
                ? "☀"
                : "☾";
    }
);


/* =========================================================
   NORMAL CALCULATOR
========================================================= */

(function () {

    const result =
        $("calculatorResult");

    const calcHistory =
        $("calculatorHistory");

    const buttons =
        document.querySelectorAll(
            ".calc-btn"
        );


    if (
        !result ||
        !calcHistory ||
        !buttons.length
    ) {
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
                    .replace(
                        /×/g,
                        "*"
                    )
                    .replace(
                        /÷/g,
                        "/"
                    );


            exp =
                exp.replace(
                    /(\d+(?:\.\d+)?)%/g,
                    "($1/100)"
                );


            if (
                !/^[0-9+\-*/().\s]+$/.test(exp)
            ) {
                throw new Error(
                    "Invalid"
                );
            }


            const answer =
                Function(
                    `"use strict"; return (${exp})`
                )();


            if (
                !Number.isFinite(answer)
            ) {
                throw new Error(
                    "Invalid"
                );
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


                if (
                    action === "clear"
                ) {

                    expression = "";

                    calcHistory.textContent = "";

                    justCalculated = false;

                    updateDisplay();

                    return;
                }


                if (
                    action === "delete"
                ) {

                    expression =
                        expression.slice(
                            0,
                            -1
                        );

                    justCalculated = false;

                    updateDisplay();

                    return;
                }


                if (
                    action === "equals"
                ) {

                    calculateExpression();

                    return;
                }


                if (value) {

                    const isOperator =
                        [
                            "+",
                            "-",
                            "*",
                            "/",
                            "%"
                        ].includes(value);


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
                            /[+\-*/]$/.test(
                                expression
                            )
                        )
                    ) {

                        expression +=
                            "0.";

                    } else {

                        expression += value;
                    }


                    justCalculated = false;

                    updateDisplay();
                }

            }
        );

    });


    /* =====================================================
       KEYBOARD
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            const key =
                event.key;


            if (
                /[0-9.+\-*/%]/.test(key)
            ) {

                event.preventDefault();

                expression += key;

                justCalculated = false;

                updateDisplay();

                return;
            }


            if (
                key === "Enter" ||
                key === "="
            ) {

                event.preventDefault();

                calculateExpression();

                return;
            }


            if (
                key === "Backspace" ||
                key === "Delete"
            ) {

                event.preventDefault();

                expression =
                    expression.slice(
                        0,
                        -1
                    );

                justCalculated = false;

                updateDisplay();

                return;
            }


            if (
                key === "Escape"
            ) {

                event.preventDefault();

                expression = "";

                calcHistory.textContent = "";

                justCalculated = false;

                updateDisplay();
            }

        }
    );

})();


/* =========================================================
   START
========================================================= */

buildVipOptions();

renderVipTable();

loadTheme();

updateModeUI();

renderHistory();

updateStats();

calculate();
