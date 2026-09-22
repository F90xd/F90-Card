"use strict";

/*
============================================================
مجلس القمة للشحن
حاسبة VIP - الإصدار المطور

النظام الجديد:

مثال:
VIP 1 → VIP 7

المستخدم يدخل قيمة واحدة فقط:
"المتبقي الحقيقي للوصول إلى VIP 7"

لا يتم إنشاء:
VIP 1 → 2
VIP 2 → 3
VIP 3 → 4
... إلخ

القيمة التي يدخلها المستخدم هي أساس الحسبة.

إذا فعل التثبيت:
الإجمالي = قيمة الوصول + قيمة التثبيت التي يدخلها المستخدم

إذا لم يفعل التثبيت:
الإجمالي = قيمة الوصول فقط

مهم:
قيمة التثبيت لا يتم وضعها تلقائياً من جدول VIP.
============================================================
*/


/* =========================================================
   جدول VIP
========================================================= */

const VIP_TABLE = [

    {
        level: 1,
        total: 50000,
        upgrade: 50000,
        maintain: 30000
    },

    {
        level: 2,
        total: 100000,
        upgrade: 50000,
        maintain: 30000
    },

    {
        level: 3,
        total: 300000,
        upgrade: 100000,
        maintain: 90000
    },

    {
        level: 4,
        total: 1000000,
        upgrade: 800000,
        maintain: 500000
    },

    {
        level: 5,
        total: 3000000,
        upgrade: 2000000,
        maintain: 1300000
    },

    {
        level: 6,
        total: 7000000,
        upgrade: 4000000,
        maintain: 2600000
    },

    {
        level: 7,
        total: 14000000,
        upgrade: 7000000,
        maintain: 4500000
    },

    {
        level: 8,
        total: 26000000,
        upgrade: 12000000,
        maintain: 7800000
    },

    {
        level: 9,
        total: 42000000,
        upgrade: 16000000,
        maintain: 11000000
    },

    {
        level: 10,
        total: 62000000,
        upgrade: 20000000,
        maintain: 14000000
    },

    {
        level: 11,
        total: 102000000,
        upgrade: 40000000,
        maintain: 28000000
    },

    {
        level: 12,
        total: 220000000,
        upgrade: 118000000,
        maintain: 83000000
    },

    {
        level: 13,
        total: 430000000,
        upgrade: 210000000,
        maintain: 150000000
    },

    {
        level: 14,
        total: 820000000,
        upgrade: 390000000,
        maintain: 310000000
    },

    {
        level: 15,
        total: 1820000000,
        upgrade: 1000000000,
        maintain: 700000000
    },

    {
        level: 16,
        total: 3820000000,
        upgrade: 2000000000,
        maintain: 1400000000
    },

    {
        level: 17,
        total: 7382000000,
        upgrade: 3500000000,
        maintain: 3000000000
    },

    {
        level: 18,
        total: 11882000000,
        upgrade: 4500000000,
        maintain: 4000000000
    },

    {
        level: 19,
        total: 17382000000,
        upgrade: 5500000000,
        maintain: 5000000000
    },

    {
        level: 20,
        total: 27382000000,
        upgrade: 10000000000,
        maintain: 9000000000
    }

];


/* =========================================================
   التخزين
========================================================= */

const STORAGE_KEY =
    "majlis_alqimma_vip_records_v6";

const THEME_KEY =
    "majlis_alqimma_theme_v2";

const CALC_HISTORY_KEY =
    "majlis_alqimma_calculator_history_v2";


/* =========================================================
   اختصار العناصر
========================================================= */

const $ = id =>
    document.getElementById(id);


/* =========================================================
   عناصر VIP
========================================================= */

const clientName =
    $("clientName");

const clientId =
    $("clientId");

const currentVip =
    $("currentVip");

const targetVip =
    $("targetVip");

const multiplier =
    $("multiplier");

const transitionArea =
    $("transitionArea");

const singleReachBox =
    $("singleReachBox");

const reachValue =
    $("reachValue");

const reachRoute =
    $("reachRoute");

const currentLockArea =
    $("currentLockArea");

const currentLockValue =
    $("currentLockValue");

const currentLockTitle =
    $("currentLockTitle");

const enableTargetLock =
    $("enableTargetLock");

const targetLockBox =
    $("targetLockBox");

const targetLockInput =
    $("targetLockInput");

const lockValue =
    $("lockValue");

const lockReference =
    $("lockReference");

const supportRate =
    $("supportRate");

const jodRate =
    $("jodRate");

const usdRate =
    $("usdRate");

const actualCharge =
    $("actualCharge");

const reachPoints =
    $("reachPoints");

const lockPoints =
    $("lockPoints");

const totalVipPoints =
    $("totalVipPoints");

const supportNeeded =
    $("supportNeeded");

const jodTotal =
    $("jodTotal");

const usdTotal =
    $("usdTotal");

const resultTitle =
    $("resultTitle");

const resultMultiplier =
    $("resultMultiplier");

const formulaVip =
    $("formulaVip");

const formulaMultiplier =
    $("formulaMultiplier");

const formulaCharge =
    $("formulaCharge");

const formulaSupport =
    $("formulaSupport");

const history =
    $("history");

const historySearch =
    $("historySearch");

const clientStatus =
    $("clientStatus");

const calculationStatus =
    $("calculationStatus");


/* =========================================================
   أدوات الأرقام
========================================================= */

function number(value) {

    const x =
        Number(value);

    if (!Number.isFinite(x)) {
        return 0;
    }

    if (x < 0) {
        return 0;
    }

    return x;
}


function format(value) {

    return new Intl.NumberFormat(
        "en-US",
        {
            maximumFractionDigits: 2
        }
    ).format(number(value));
}


function formatMoney(value, suffix) {

    return new Intl.NumberFormat(
        "en-US",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    ).format(number(value)) + " " + suffix;
}


/* =========================================================
   جدول VIP
========================================================= */

function buildVipOptions() {

    currentVip.innerHTML = "";
    targetVip.innerHTML = "";

    VIP_TABLE.forEach(row => {

        const currentOption =
            document.createElement("option");

        currentOption.value =
            row.level;

        currentOption.textContent =
            `VIP ${row.level}`;

        currentVip.appendChild(
            currentOption
        );


        const targetOption =
            document.createElement("option");

        targetOption.value =
            row.level;

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
   جدول VIP المرئي
========================================================= */

function renderVipTable() {

    const tbody =
        $("vipTable");

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
   جلب مستوى
========================================================= */

function getVip(level) {

    return VIP_TABLE.find(
        row =>
            row.level === Number(level)
    );
}


/* =========================================================
   نوع العملية
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
   تحديث مسار VIP
========================================================= */

function updateVipRoute() {

    const current =
        Number(currentVip.value);

    const target =
        Number(targetVip.value);

    reachRoute.textContent =
        `VIP ${current} → VIP ${target}`;

    currentLockTitle.textContent =
        `VIP ${current}`;

    updateLockReference();
}


/* =========================================================
   مرجع التثبيت

   فقط يعرض قيمة الجدول كمرجع.
   لا يضعها داخل input.
========================================================= */

function updateLockReference() {

    const target =
        Number(targetVip.value);

    const data =
        getVip(target);

    if (!data) {

        lockReference.textContent =
            "أدخل قيمة التثبيت يدوياً.";

        return;
    }

    lockReference.textContent =
        `مرجع جدول VIP ${target}: ${format(data.maintain)} — هذه القيمة للمرجع فقط ولن يتم إدخالها تلقائياً.`;
}


/* =========================================================
   حالة الحسبة
========================================================= */

function setCalculationStatus(type, text) {

    calculationStatus.className =
        `calculation-status status-${type}`;

    calculationStatus.innerHTML = `
        <span class="status-dot"></span>
        <strong>${text}</strong>
    `;
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


    reachLabel.classList.toggle(
        "active",
        mode === "reach"
    );

    currentLabel.classList.toggle(
        "active",
        mode === "currentLock"
    );


    if (mode === "currentLock") {

        transitionArea
            .classList.add("hidden");

        targetLockBox
            .classList.add("hidden");

        currentLockArea
            .classList.remove("hidden");

        calculate();

        return;
    }


    currentLockArea
        .classList.add("hidden");

    transitionArea
        .classList.remove("hidden");

    targetLockBox
        .classList.remove("hidden");

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

    const supportPerMillion =
        number(supportRate.value);

    const jodPerMillion =
        number(jodRate.value);

    const usdPerMillion =
        number(usdRate.value);


    updateVipRoute();


    /* =====================================================
       تثبيت المستوى الحالي فقط
    ===================================================== */

    if (mode === "currentLock") {

        const lock =
            number(
                currentLockValue.value
            );

        const total =
            lock;


        showCalculation(
            current,
            current,
            0,
            lock,
            total,
            x,
            supportPerMillion,
            jodPerMillion,
            usdPerMillion
        );


        if (lock > 0) {

            setCalculationStatus(
                "success",
                "الحسبة جاهزة"
            );

        } else {

            setCalculationStatus(
                "waiting",
                "انتظار إدخال قيمة التثبيت"
            );
        }

        return;
    }


    /* =====================================================
       الوصول إلى مستوى
    ===================================================== */

    if (target <= current) {

        showCalculation(
            current,
            target,
            0,
            0,
            0,
            x,
            supportPerMillion,
            jodPerMillion,
            usdPerMillion
        );


        setCalculationStatus(
            "error",
            "اختر مستوى مطلوب أعلى من المستوى الحالي"
        );

        return;
    }


    /*
    القيمة الوحيدة التي يدخلها المستخدم للوصول.
    */

    const reach =
        number(
            reachValue.value
        );


    /*
    قيمة التثبيت لا تدخل إلا إذا المستخدم فعل المفتاح
    وكتب قيمة بنفسه.
    */

    let lock = 0;

    if (
        enableTargetLock.checked
    ) {

        lock =
            number(
                lockValue.value
            );
    }


    const total =
        reach + lock;


    showCalculation(
        current,
        target,
        reach,
        lock,
        total,
        x,
        supportPerMillion,
        jodPerMillion,
        usdPerMillion
    );


    if (reach <= 0) {

        setCalculationStatus(
            "waiting",
            "انتظار إدخال قيمة المتبقي"
        );

        return;
    }


    if (
        enableTargetLock.checked &&
        lock <= 0
    ) {

        setCalculationStatus(
            "waiting",
            "أدخل قيمة التثبيت أو أوقف التثبيت"
        );

        return;
    }


    setCalculationStatus(
        "success",
        "الحسبة جاهزة"
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
    supportRateValue,
    jodRateValue,
    usdRateValue
) {

    let charge = 0;

    if (x > 0) {

        charge =
            total / x;
    }


    const support =
        (charge / 1000000) *
        supportRateValue;


    const jod =
        (charge / 1000000) *
        jodRateValue;


    const usd =
        (charge / 1000000) *
        usdRateValue;


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
        format(charge);

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


    formulaVip.textContent =
        format(total);

    formulaMultiplier.textContent =
        `×${x}`;

    formulaCharge.textContent =
        format(charge);


    formulaSupport.textContent =
        `${format(charge)} ÷ 1,000,000 × ${format(supportRateValue)} = ${format(support)}`;
}


/* =========================================================
   حفظ سجلات VIP
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

    calculate();

    const mode =
        getMode();

    return {

        id:
            Date.now(),

        created:
            new Date().toISOString(),

        clientName:
            clientName.value.trim(),

        clientId:
            clientId.value.trim(),

        mode,

        currentVip:
            Number(currentVip.value),

        targetVip:
            Number(targetVip.value),

        multiplier:
            number(multiplier.value),

        reachValue:
            mode === "reach"
                ? number(reachValue.value)
                : 0,

        currentLock:
            mode === "currentLock"
                ? number(currentLockValue.value)
                : 0,

        targetLockEnabled:
            mode === "reach"
                ? Boolean(
                    enableTargetLock.checked
                )
                : false,

        targetLock:
            mode === "reach" &&
            enableTargetLock.checked
                ? number(lockValue.value)
                : 0,

        supportRate:
            number(supportRate.value),

        jodRate:
            number(jodRate.value),

        usdRate:
            number(usdRate.value)
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


        const record =
            createRecord();


        const records =
            getRecords();


        records.unshift(record);


        saveRecords(records);


        clientStatus.textContent =
            `تم حفظ العملية للعميل ID: ${id}`;

        clientStatus.classList.remove(
            "hidden"
        );


        renderHistory();


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
                    ID: ${safe(record.clientId)}
                </span>

                <span>
                    ${operation}
                    · ×${record.multiplier}
                </span>

                <span>
                    المتبقي:
                    ${
                        record.mode === "currentLock"
                            ? format(record.currentLock)
                            : format(record.reachValue)
                    }
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
   حماية النص
========================================================= */

function safe(value) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );
}


/* =========================================================
   فتح / حذف سجل
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
            item =>
                item.id === id
        );


    if (!record) {
        return;
    }


    clientName.value =
        record.clientName || "";


    clientId.value =
        record.clientId || "";


    currentVip.value =
        String(
            record.currentVip
        );


    targetVip.value =
        String(
            record.targetVip
        );


    multiplier.value =
        String(
            record.multiplier
        );


    supportRate.value =
        record.supportRate;


    jodRate.value =
        record.jodRate;


    usdRate.value =
        record.usdRate;


    /*
    الوصول:
    القيمة الواحدة فقط.
    */

    reachValue.value =
        record.reachValue || "";


    /*
    تثبيت المستوى الحالي.
    */

    currentLockValue.value =
        record.currentLock || "";


    /*
    تثبيت الهدف.
    لا نضع أي قيمة تلقائية.
    */

    enableTargetLock.checked =
        Boolean(
            record.targetLockEnabled
        );


    lockValue.value =
        record.targetLock || "";


    targetLockInput.classList.toggle(
        "hidden",
        !enableTargetLock.checked
    );


    const radio =
        document.querySelector(
            `input[name="mode"][value="${record.mode}"]`
        );


    if (radio) {

        radio.checked = true;
    }


    updateModeUI();

    updateVipRoute();

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
            item =>
                item.id !== id
        );


    saveRecords(records);

    renderHistory();
}


/* =========================================================
   حذف كل السجل
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
    () => {

        updateVipRoute();

        calculate();
    }
);


targetVip.addEventListener(
    "change",
    () => {

        updateVipRoute();

        calculate();
    }
);


/* =========================================================
   المتبقي
========================================================= */

reachValue.addEventListener(
    "input",
    calculate
);


currentLockValue.addEventListener(
    "input",
    calculate
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

        if (
            enableTargetLock.checked
        ) {

            targetLockInput
                .classList.remove(
                    "hidden"
                );


            /*
            مهم:
            لا يتم وضع قيمة من جدول VIP.
            */

            lockValue.value = "";

            lockValue.focus();

        } else {

            targetLockInput
                .classList.add(
                    "hidden"
                );

            /*
            عند إيقاف التثبيت
            يتم تصفيره بالكامل.
            */

            lockValue.value = "";
        }


        calculate();
    }
);


/* =========================================================
   قيمة التثبيت
========================================================= */

lockValue.addEventListener(
    "input",
    calculate
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
   تغيير نوع العملية
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

        reachValue.value = "";

        currentLockValue.value = "";

        lockValue.value = "";

        enableTargetLock.checked = false;

        targetLockInput.classList.add(
            "hidden"
        );

        supportRate.value =
            "130000";

        jodRate.value =
            "11";

        usdRate.value =
            "15";


        const reachRadio =
            document.querySelector(
                'input[name="mode"][value="reach"]'
            );


        reachRadio.checked =
            true;


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
   الوضع الليلي / النهاري
========================================================= */

const themeToggle =
    $("themeToggle");


function applyTheme(theme) {

    document.body.classList.toggle(
        "light-mode",
        theme === "light"
    );


    themeToggle.textContent =
        theme === "light"
            ? "🌙"
            : "☀️";
}


const savedTheme =
    localStorage.getItem(
        THEME_KEY
    );


applyTheme(
    savedTheme || "dark"
);


themeToggle.addEventListener(
    "click",
    () => {

        const isLight =
            document.body.classList.contains(
                "light-mode"
            );


        const newTheme =
            isLight
                ? "dark"
                : "light";


        localStorage.setItem(
            THEME_KEY,
            newTheme
        );


        applyTheme(newTheme);
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

    const copyButton =
        $("calcCopy");

    const clearCalcHistory =
        $("calcClearHistory");

    const savedHistory =
        $("calcSavedHistory");


    if (
        !result ||
        !buttons.length
    ) {
        return;
    }


    let expression = "";


    function updateDisplay() {

        result.textContent =
            expression || "0";
    }


    function getCalcHistory() {

        try {

            const data =
                localStorage.getItem(
                    CALC_HISTORY_KEY
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


    function saveCalcHistory(data) {

        localStorage.setItem(
            CALC_HISTORY_KEY,
            JSON.stringify(data.slice(0, 20))
        );
    }


    function renderCalcHistory() {

        const records =
            getCalcHistory();


        savedHistory.innerHTML = "";


        if (!records.length) {

            savedHistory.innerHTML = `
                <div class="calc-history-empty">
                    لا توجد عمليات سابقة
                </div>
            `;

            return;
        }


        records.forEach(item => {

            const row =
                document.createElement("button");

            row.type = "button";

            row.className =
                "calc-history-row";


            row.innerHTML = `

                <span>
                    ${safe(item.expression)}
                </span>

                <strong>
                    ${safe(item.result)}
                </strong>

            `;


            row.addEventListener(
                "click",
                () => {

                    expression =
                        item.result;

                    calcHistory.textContent =
                        item.expression + " =";

                    updateDisplay();

                }
            );


            savedHistory.appendChild(row);

        });
    }


    function calculateNormal() {

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
            نسبة مئوية:
            50% = 0.5
            */

            exp =
                exp.replace(
                    /(\d+(?:\.\d+)?)%/g,
                    "($1/100)"
                );


            if (
                !/^[0-9+\-*/().%\s]+$/.test(
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
                !Number.isFinite(answer)
            ) {

                throw new Error(
                    "Invalid"
                );
            }


            const cleanAnswer =
                Number.isInteger(answer)
                    ? String(answer)
                    : String(
                        Number(
                            answer.toFixed(10)
                        )
                    );


            calcHistory.textContent =
                expression + " =";


            const records =
                getCalcHistory();


            records.unshift({

                expression:
                    expression,

                result:
                    cleanAnswer,

                created:
                    Date.now()

            });


            saveCalcHistory(
                records
            );


            expression =
                cleanAnswer;


            updateDisplay();

            renderCalcHistory();


        } catch {

            calcHistory.textContent =
                expression;

            result.textContent =
                "خطأ";

            expression = "";

        }
    }


    function addValue(value) {

        /*
        منع أكثر من فاصلة عشرية في نفس الرقم.
        */

        if (value === ".") {

            const parts =
                expression.split(
                    /[+\-*/]/
                );

            const last =
                parts[parts.length - 1];


            if (
                last.includes(".")
            ) {
                return;
            }
        }


        /*
        منع تكرار العمليات.
        */

        if (
            ["+", "-", "*", "/"].includes(
                value
            )
        ) {

            if (!expression) {

                if (value !== "-") {
                    return;
                }
            }


            const last =
                expression.slice(-1);


            if (
                ["+", "-", "*", "/"].includes(
                    last
                )
            ) {

                expression =
                    expression.slice(
                        0,
                        -1
                    );
            }
        }


        expression += value;

        updateDisplay();
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

                    calcHistory.textContent =
                        "";

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

                    updateDisplay();

                    return;
                }


                if (
                    action === "equals"
                ) {

                    calculateNormal();

                    return;
                }


                if (value) {

                    addValue(value);

                }

            }
        );

    });


    /*
    لوحة مفاتيح الجهاز.
    */

    document.addEventListener(
        "keydown",
        event => {

            const tag =
                document.activeElement.tagName;


            if (
                tag === "INPUT" ||
                tag === "SELECT" ||
                tag === "TEXTAREA"
            ) {
                return;
            }


            const key =
                event.key;


            if (
                /[0-9.]/.test(key)
            ) {

                addValue(key);

                return;
            }


            if (
                ["+", "-", "*", "/"].includes(
                    key
                )
            ) {

                addValue(key);

                return;
            }


            if (key === "Enter" || key === "=") {

                calculateNormal();

                return;
            }


            if (key === "Backspace") {

                expression =
                    expression.slice(
                        0,
                        -1
                    );

                updateDisplay();

                return;
            }


            if (key === "Escape") {

                expression = "";

                calcHistory.textContent =
                    "";

                updateDisplay();
            }

        }
    );


    /*
    نسخ النتيجة.
    */

    copyButton.addEventListener(
        "click",
        async () => {

            const value =
                result.textContent;


            if (
                !value ||
                value === "0" ||
                value === "خطأ"
            ) {
                return;
            }


            try {

                await navigator.clipboard.writeText(
                    value
                );

                copyButton.textContent =
                    "تم النسخ";

                setTimeout(
                    () => {
                        copyButton.textContent =
                            "نسخ";
                    },
                    1200
                );

            } catch {

                alert(
                    "تعذر نسخ الرقم."
                );
            }

        }
    );


    /*
    مسح سجل الحاسبة العادية.
    */

    clearCalcHistory.addEventListener(
        "click",
        () => {

            if (
                !confirm(
                    "هل تريد مسح سجل الحاسبة؟"
                )
            ) {
                return;
            }


            localStorage.removeItem(
                CALC_HISTORY_KEY
            );


            renderCalcHistory();

        }
    );


    updateDisplay();

    renderCalcHistory();

})();


/* =========================================================
   تشغيل الموقع
========================================================= */

buildVipOptions();

renderVipTable();

updateVipRoute();

updateModeUI();

renderHistory();

calculate();
