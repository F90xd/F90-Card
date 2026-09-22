"use strict";

/* =========================================================
   مجلس القمة للشحن
   VIP Calculator + Customer Records + Statistics
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
   الاختصار
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

    if (value === null || value === undefined) {
        return 0;
    }

    const clean =
        String(value)
            .replace(/,/g, "")
            .trim();

    if (clean === "") {
        return 0;
    }

    const x = Number(clean);

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
   حماية النص
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
   جدول VIP
========================================================= */

function getVip(level) {

    return VIP_TABLE.find(
        row => row.level === Number(level)
    );
}


/* =========================================================
   خيارات VIP
========================================================= */

function buildVipOptions() {

    currentVip.innerHTML = "";
    targetVip.innerHTML = "";

    VIP_TABLE.forEach(row => {

        const currentOption =
            document.createElement("option");

        currentOption.value = row.level;
        currentOption.textContent =
            `VIP ${row.level}`;

        currentVip.appendChild(
            currentOption
        );


        const targetOption =
            document.createElement("option");

        targetOption.value = row.level;
        targetOption.textContent =
            `VIP ${row.level}`;

        targetVip.appendChild(
            targetOption
        );
    });


    currentVip.value = "10";
    targetVip.value = "11";
}


/* =========================================================
   جدول VIP
========================================================= */

function renderVipTable() {

    const tbody = $("vipTable");

    if (!tbody) {
        return;
    }

    tbody.innerHTML = "";

    VIP_TABLE.forEach(row => {

        const tr =
            document.createElement("tr");

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
   وضع الحساب
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
   خانة القيمة الفعلية
========================================================= */

function getFirstTransitionInput() {

    return document.querySelector(
        ".first-transition-value"
    );
}


/* =========================================================
   إنشاء الانتقالات
========================================================= */

function renderTransitions(savedFirstValue = null) {

    const current =
        Number(currentVip.value);

    const target =
        Number(targetVip.value);


    transitionList.innerHTML = "";


    if (target <= current) {

        transitionArea.classList.remove(
            "hidden"
        );

        targetLockBox.classList.add(
            "hidden"
        );

        transitionList.innerHTML = `
            <div class="empty">
                اختر مستوى مطلوب أعلى من المستوى الحالي.
            </div>
        `;

        calculate();

        return;
    }


    transitionArea.classList.remove(
        "hidden"
    );


    const firstTo =
        current + 1;


    /* =====================================================
       القيمة المحفوظة
    ===================================================== */

    let firstValue = "";

    if (savedFirstValue !== null) {

        firstValue =
            String(savedFirstValue);

    } else {

        const oldInput =
            getFirstTransitionInput();

        if (oldInput) {
            firstValue =
                oldInput.value;
        }
    }


    /* =====================================================
       أول انتقال
    ===================================================== */

    const firstBox =
        document.createElement("div");

    firstBox.className =
        "transition first-transition";


    const head =
        document.createElement("div");

    head.className =
        "transition-head";

    head.innerHTML = `
        <span>أدخل القيمة الفعلية</span>
        <strong>
            VIP ${current} → VIP ${firstTo}
        </strong>
    `;


    const field =
        document.createElement("div");

    field.className =
        "field";


    const label =
        document.createElement("label");

    label.textContent =
        `المتبقي الفعلي للدخول إلى VIP ${firstTo}`;


    /*
    مهم جداً:
    type="text"
    وليس number
    حتى يعمل Backspace والحذف بشكل طبيعي.
    */

    const input =
        document.createElement("input");

    input.type = "text";
    input.inputMode = "decimal";
    input.autocomplete = "off";

    input.className =
        "first-transition-value";

    input.placeholder =
        "أدخل القيمة هنا";

    input.value =
        firstValue;


    const small =
        document.createElement("small");

    small.textContent =
        "هذه هي الخانة الوحيدة التي تدخل فيها القيمة يدوياً.";


    field.appendChild(label);
    field.appendChild(input);
    field.appendChild(small);

    firstBox.appendChild(head);
    firstBox.appendChild(field);

    transitionList.appendChild(firstBox);


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
                جميع المستويات التالية محسوبة تلقائياً
            </small>
        `;

        transitionList.appendChild(
            autoTitle
        );


        for (
            let from = firstTo;
            from < target;
            from++
        ) {

            const to =
                from + 1;

            const data =
                getVip(to);


            const div =
                document.createElement("div");

            div.className =
                "transition automatic-transition";


            div.innerHTML = `
                <div class="transition-head">
                    <span>تلقائي</span>

                    <strong>
                        VIP ${from} → VIP ${to}
                    </strong>
                </div>

                <div class="auto-transition-value">

                    <span>القيمة المحسوبة</span>

                    <strong>
                        ${format(
                            data
                                ? data.upgrade
                                : 0
                        )}
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

    const current =
        Number(currentVip.value);

    const target =
        Number(targetVip.value);


    if (target <= current) {
        return 0;
    }


    const firstInput =
        getFirstTransitionInput();


    const firstValue =
        firstInput
            ? number(firstInput.value)
            : 0;


    let total =
        firstValue;


    /*
    مثال:

    VIP 2 → VIP 3
    المستخدم يدخل القيمة بنفسه.

    ثم:

    VIP 3 → VIP 4
    VIP 4 → VIP 5
    VIP 5 → VIP 6

    ... إلخ

    يتم أخذها تلقائياً من جدول VIP.
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

            total +=
                number(data.upgrade);
        }
    }


    return total;
}


/* =========================================================
   التثبيت التلقائي
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
   تحديث التثبيت
========================================================= */

function updateAutoLock() {

    const mode =
        getMode();


    if (mode === "currentLock") {

        targetLockBox.classList.add(
            "hidden"
        );

        if (targetLockInput) {

            targetLockInput.classList.add(
                "hidden"
            );
        }

        return;
    }


    const current =
        Number(currentVip.value);

    const target =
        Number(targetVip.value);


    if (target <= current) {

        targetLockBox.classList.add(
            "hidden"
        );

        return;
    }


    targetLockBox.classList.remove(
        "hidden"
    );


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
   تثبيت المستوى الحالي
========================================================= */

function renderCurrentLock() {

    transitionArea.classList.remove(
        "hidden"
    );

    targetLockBox.classList.add(
        "hidden"
    );


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

                <span>تلقائي</span>

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
   الحساب الرئيسي
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


    /*
    السعر الثابت:

    130,000 دعم = 11 دينار
    130,000 دعم = 15 دولار
    */

    const supportUnit =
        number(supportRate.value) || 130000;


    const jodUnit =
        number(jodRate.value) || 11;


    const usdUnit =
        number(usdRate.value) || 15;


    let reach = 0;
    let lock = 0;


    /* =====================================================
       تثبيت المستوى الحالي
    ===================================================== */

    if (mode === "currentLock") {

        const data =
            getVip(current);

        lock =
            data
                ? number(data.maintain)
                : 0;
    }


    /* =====================================================
       الوصول إلى مستوى آخر
    ===================================================== */

    else {

        if (target > current) {

            reach =
                calculateReach();


            /*
            التثبيت اختياري
            لكن قيمته محسوبة تلقائياً.
            */

            if (
                enableTargetLock &&
                enableTargetLock.checked
            ) {

                lock =
                    getAutomaticLockValue();
            }
        }
    }


    /* =====================================================
       الإجمالي
    ===================================================== */

    const total =
        reach + lock;


    /*
    الشحن الفعلي =
    إجمالي نقاط VIP ÷ معامل الحساب
    */

    const charge =
        x > 0
            ? total / x
            : 0;


    /*
    =====================================================
    الدعم

    إذا كانت 1,000,000 شحن فعلي:

    1,000,000 ÷ 1,000,000 × 130,000
    = 130,000 دعم

    =====================================================
    */

    const support =
        (charge / 1000000) *
        supportUnit;


    /*
    =====================================================
    الدينار

    كل 130,000 دعم = 11 دينار
    =====================================================
    */

    const jod =
        supportUnit > 0
            ? (
                support /
                supportUnit
            ) * jodUnit
            : 0;


    /*
    =====================================================
    الدولار

    كل 130,000 دعم = 15 دولار
    =====================================================
    */

    const usd =
        supportUnit > 0
            ? (
                support /
                supportUnit
            ) * usdUnit
            : 0;


    showCalculation(
        current,
        target,
        reach,
        lock,
        total,
        x,
        charge,
        support,
        jod,
        usd,
        supportUnit,
        jodUnit,
        usdUnit
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
    charge,
    support,
    jod,
    usd,
    supportUnit,
    jodUnit,
    usdUnit
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


    /*
    نقاط الوصول
    */

    reachPoints.textContent =
        format(reach);


    /*
    نقاط التثبيت
    */

    lockPoints.textContent =
        format(lock);


    /*
    إجمالي الوصول مع التثبيت
    */

    totalVipPoints.textContent =
        format(total);


    /*
    إجمالي شحن الوكيل
    */

    actualCharge.textContent =
        format(charge);


    /*
    إجمالي الدعم
    */

    supportNeeded.textContent =
        format(support);


    /*
    سعر الدعم بالدينار
    */

    jodTotal.textContent =
        formatMoney(
            jod,
            "د.أ"
        );


    /*
    سعر الدعم بالدولار
    */

    usdTotal.textContent =
        formatMoney(
            usd,
            "$"
        );


    /*
    المعادلات
    */

    formulaReach.textContent =
        format(reach);


    formulaLock.textContent =
        format(lock);


    formulaVip.textContent =
        format(total);


    formulaMultiplier.textContent =
        `×${x}`;


    formulaSupport.textContent =
        `${format(charge)} ÷ 1,000,000 × ${format(supportUnit)} = ${format(support)}`;
}


/* =========================================================
   تحديث واجهة الوضع
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
   السجلات
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
   إنشاء سجل
========================================================= */

function createRecord() {

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


    const supportUnit =
        number(supportRate.value) || 130000;


    const jodUnit =
        number(jodRate.value) || 11;


    const usdUnit =
        number(usdRate.value) || 15;


    const support =
        (charge / 1000000) *
        supportUnit;


    const jod =
        supportUnit > 0
            ? (
                support /
                supportUnit
            ) * jodUnit
            : 0;


    const usd =
        supportUnit > 0
            ? (
                support /
                supportUnit
            ) * usdUnit
            : 0;


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
            getFirstTransitionInput()
                ? number(
                    getFirstTransitionInput().value
                )
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
            supportUnit,


        jodRate:
            jodUnit,


        usdRate:
            usdUnit
    };
}


/* =========================================================
   حفظ العملية
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
   عرض السجل
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

                String(
                    record.clientId
                )
                    .toLowerCase()
                    .includes(query)

                ||

                String(
                    record.clientName
                )
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
            new Date(
                record.created
            ).toLocaleString("ar");


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
                    ID:
                    ${safe(record.clientId)}
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
                    type="button"
                    data-open="${record.id}"
                >
                    فتح
                </button>

                <button
                    type="button"
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
   فتح / حذف السجل
========================================================= */

history.addEventListener(
    "click",
    event => {

        const target =
            event.target;


        const openId =
            target.dataset.open;


        const deleteId =
            target.dataset.delete;


        if (openId) {

            loadRecord(
                Number(openId)
            );

            return;
        }


        if (deleteId) {

            deleteRecord(
                Number(deleteId)
            );
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
        String(
            record.multiplier || 0
        );


    supportRate.value =
        record.supportRate ||
        130000;


    jodRate.value =
        record.jodRate ||
        11;


    usdRate.value =
        record.usdRate ||
        15;


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


    if (record.mode === "reach") {

        renderTransitions(
            record.firstTransition || ""
        );

    } else {

        renderCurrentLock();
    }


    updateAutoLock();
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
   حذف سجل
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
   حذف جميع السجلات
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
   البحث
========================================================= */

historySearch.addEventListener(
    "input",
    renderHistory
);


/* =========================================================
   تغيير المستوى الحالي
========================================================= */

currentVip.addEventListener(
    "change",
    () => {

        updateModeUI();
    }
);


/* =========================================================
   تغيير المستوى الهدف
========================================================= */

targetVip.addEventListener(
    "change",
    () => {

        updateModeUI();
    }
);


/* =========================================================
   معامل الحساب
========================================================= */

multiplier.addEventListener(
    "input",
    calculate
);

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
   أسعار الدعم
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


    input.addEventListener(
        "change",
        calculate
    );
});


/* =========================================================
   خانة القيمة الفعلية

   مهم:
   لا نعيد بناء الخانة أثناء الكتابة.
   لذلك Backspace والحذف يعملان طبيعي.
========================================================= */

transitionList.addEventListener(
    "input",
    event => {

        if (
            event.target.classList.contains(
                "first-transition-value"
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
            () => {

                updateModeUI();
            }
        );
    });


/* =========================================================
   زر الحساب
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


        /*
        الأسعار الصحيحة
        */

        supportRate.value =
            "130000";


        jodRate.value =
            "11";


        usdRate.value =
            "15";


        enableTargetLock.checked =
            false;


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
   الإحصائيات
========================================================= */

function updateStats() {

    const records =
        getRecords();


    /*
    إجمالي العمليات
    */

    const operations =
        records.length;


    /*
    إجمالي العملاء الفريدين
    */

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


    /*
    إجمالي شحن الوكيل
    */

    const totalCharge =
        records.reduce(
            (sum, record) =>
                sum +
                number(record.charge),
            0
        );


    /*
    إجمالي الدعم
    */

    const totalSupport =
        records.reduce(
            (sum, record) =>
                sum +
                number(record.support),
            0
        );


    /*
    إجمالي نقاط VIP
    */

    const totalVip =
        records.reduce(
            (sum, record) =>
                sum +
                number(record.total),
            0
        );


    /*
    إجمالي الدينار
    */

    const totalJod =
        records.reduce(
            (sum, record) =>
                sum +
                number(record.jod),
            0
        );


    /*
    إجمالي الدولار
    */

    const totalUsd =
        records.reduce(
            (sum, record) =>
                sum +
                number(record.usd),
            0
        );


    /*
    أعلى VIP وصل إليه العملاء
    */

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
        highestVip
            ? `VIP ${highestVip}`
            : "—";
}


/* =========================================================
   فتح / إخفاء الإحصائيات
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


        const hidden =
            panel.classList.contains(
                "hidden"
            );


        panel.classList.toggle(
            "hidden",
            !hidden
        );


        if (arrow) {

            arrow.textContent =
                hidden
                    ? "⌃"
                    : "⌄";
        }
    }
);


/* =========================================================
   الوضع الليلي والنهاري
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
   الحاسبة العادية
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

    let justCalculated =
        false;


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


            /*
            النسبة
            */

            exp =
                exp.replace(
                    /(\d+(?:\.\d+)?)%/g,
                    "($1/100)"
                );


            if (
                !/^[0-9+\-*/().\s]+$/.test(
                    exp
                )
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
                !Number.isFinite(
                    answer
                )
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


            justCalculated =
                true;


            updateDisplay();

        } catch {

            calcHistory.textContent =
                expression;


            result.textContent =
                "خطأ";


            expression = "";


            justCalculated =
                false;
        }
    }


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                function () {

                    const value =
                        this.dataset.value;


                    const action =
                        this.dataset.action;


                    /*
                    مسح الكل
                    */

                    if (
                        action === "clear"
                    ) {

                        expression = "";

                        calcHistory.textContent =
                            "";

                        justCalculated =
                            false;

                        updateDisplay();

                        return;
                    }


                    /*
                    حذف رقم واحد
                    */

                    if (
                        action === "delete"
                    ) {

                        expression =
                            expression.slice(
                                0,
                                -1
                            );


                        justCalculated =
                            false;


                        updateDisplay();

                        return;
                    }


                    /*
                    يساوي
                    */

                    if (
                        action === "equals"
                    ) {

                        calculateExpression();

                        return;
                    }


                    /*
                    إدخال رقم / عملية
                    */

                    if (value) {

                        const isOperator =
                            [
                                "+",
                                "-",
                                "*",
                                "/",
                                "%"
                            ].includes(
                                value
                            );


                        if (
                            justCalculated &&
                            !isOperator &&
                            value !== "."
                        ) {

                            expression =
                                "";

                            calcHistory.textContent =
                                "";
                        }


                        /*
                        النقطة العشرية
                        */

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

                            expression +=
                                value;
                        }


                        justCalculated =
                            false;


                        updateDisplay();
                    }
                }
            );
        }
    );


    /* =====================================================
       لوحة المفاتيح
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            const key =
                event.key;


            /*
            الأرقام والعمليات
            */

            if (
                /[0-9.+\-*/%]/.test(
                    key
                )
            ) {

                event.preventDefault();


                expression +=
                    key;


                justCalculated =
                    false;


                updateDisplay();

                return;
            }


            /*
            Enter
            */

            if (
                key === "Enter" ||
                key === "="
            ) {

                event.preventDefault();

                calculateExpression();

                return;
            }


            /*
            Backspace
            */

            if (
                key === "Backspace"
            ) {

                event.preventDefault();


                expression =
                    expression.slice(
                        0,
                        -1
                    );


                justCalculated =
                    false;


                updateDisplay();

                return;
            }


            /*
            Escape
            */

            if (
                key === "Escape"
            ) {

                event.preventDefault();


                expression = "";


                calcHistory.textContent =
                    "";


                justCalculated =
                    false;


                updateDisplay();
            }
        }
    );

})();


/* =========================================================
   التشغيل
========================================================= */

buildVipOptions();

renderVipTable();

loadTheme();

updateModeUI();

renderHistory();

updateStats();

calculate();
