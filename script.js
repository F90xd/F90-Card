"use strict";

/*
============================================================
مجلس القمة للشحن
حاسبة VIP

المعادلة الأساسية:

1) نقاط الوصول = القيم التي يدخلها المستخدم
2) نقاط التثبيت = قيمة التثبيت إذا تم تفعيل التثبيت
3) إجمالي نقاط VIP = الوصول + التثبيت
4) الشحن الفعلي = إجمالي نقاط VIP ÷ العرض
5) الدعم = الشحن الفعلي ÷ 1,000,000 × دعم المليون

مهم جداً:
جدول VIP لا يتم جمعه تلقائياً في حسبة العميل.
============================================================
*/


/* =========================================================
   جدول VIP 1 - 20
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
    "majlis_alqimma_vip_records_v5";


/* =========================================================
   اختصار العناصر
========================================================= */

const $ = id =>
    document.getElementById(id);


/* =========================================================
   عناصر الصفحة
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

const transitionList =
    $("transitionList");

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
   اختيارات VIP
========================================================= */

function buildVipOptions() {

    currentVip.innerHTML = "";
    targetVip.innerHTML = "";

    for (
        let level = 1;
        level <= 20;
        level++
    ) {

        const optionCurrent =
            document.createElement("option");

        optionCurrent.value =
            level;

        optionCurrent.textContent =
            `VIP ${level}`;

        currentVip.appendChild(
            optionCurrent
        );


        const optionTarget =
            document.createElement("option");

        optionTarget.value =
            level;

        optionTarget.textContent =
            `VIP ${level}`;

        targetVip.appendChild(
            optionTarget
        );
    }

    currentVip.value = "10";
    targetVip.value = "11";
}


/* =========================================================
   جدول VIP
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
   جلب بيانات مستوى
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
   إنشاء خانات الانتقال
=========================================================

مثال:

VIP 10 → VIP 11

تظهر خانة واحدة:

المتبقي الفعلي = 80M

الموقع لا يقول:
VIP 10 إجماليه 62M
VIP 11 إجماليه 102M

ولا يجمعهم.

أنت تدخل الرقم الحقيقي الذي أرسله العميل.
========================================================= */

function renderTransitions(saved = []) {

    const current =
        Number(currentVip.value);

    const target =
        Number(targetVip.value);

    transitionList.innerHTML = "";


    /*
    إذا كانت العملية تثبيت المستوى الحالي فقط
    لا نحتاج انتقالات.
    */

    if (
        getMode() === "currentLock"
    ) {

        transitionArea
            .classList.add("hidden");

        targetLockBox
            .classList.add("hidden");

        calculate();

        return;
    }


    transitionArea
        .classList.remove("hidden");


    /*
    لا يوجد انتقال إذا الهدف ليس أعلى.
    */

    if (target <= current) {

        transitionList.innerHTML = `
            <div class="empty">
                اختر مستوى مطلوب أعلى من المستوى الحالي.
            </div>
        `;

        targetLockBox
            .classList.remove("hidden");

        calculate();

        return;
    }


    /*
    إنشاء انتقال لكل مستوى.
    */

    for (
        let from = current;
        from < target;
        from++
    ) {

        const to =
            from + 1;


        let value = "";


        const savedItem =
            saved.find(
                item =>
                    Number(item.from) === from &&
                    Number(item.to) === to
            );


        if (savedItem) {
            value =
                savedItem.value;
        }


        const div =
            document.createElement("div");

        div.className =
            "transition";


        div.innerHTML = `

            <div class="transition-head">
                <span>الانتقال</span>
                <strong>
                    VIP ${from} → VIP ${to}
                </strong>
            </div>

            <div class="field">

                <label>
                    المتبقي الفعلي لهذا الانتقال
                </label>

                <input
                    class="transition-value"
                    type="number"
                    min="0"
                    step="1"
                    data-from="${from}"
                    data-to="${to}"
                    value="${value}"
                    placeholder="مثال: 80000000"
                >

            </div>
        `;


        transitionList.appendChild(
            div
        );
    }


    /*
    إظهار صندوق التثبيت.
    */

    targetLockBox
        .classList.remove("hidden");


    /*
    عند تفعيل التثبيت لأول مرة
    نضع قيمة جدول المستوى المستهدف.
    */

    if (
        enableTargetLock.checked &&
        !lockValue.value
    ) {

        const targetData =
            getVip(target);

        if (targetData) {

            lockValue.value =
                targetData.maintain;
        }
    }


    updateLockReference();

    calculate();
}


/* =========================================================
   قراءة الانتقالات
========================================================= */

function getTransitionValues() {

    return Array.from(
        document.querySelectorAll(
            ".transition-value"
        )
    ).map(input => {

        return {

            from:
                Number(
                    input.dataset.from
                ),

            to:
                Number(
                    input.dataset.to
                ),

            value:
                number(input.value)
        };

    });
}


/* =========================================================
   وضع قيمة التثبيت من جدول VIP
========================================================= */

function setDefaultLockValue() {

    const target =
        Number(targetVip.value);

    const data =
        getVip(target);

    if (!data) {
        return;
    }

    lockValue.value =
        data.maintain;

    updateLockReference();

    calculate();
}


/* =========================================================
   مرجع التثبيت
========================================================= */

function updateLockReference() {

    const target =
        Number(targetVip.value);

    const data =
        getVip(target);

    if (!data) {

        lockReference.textContent =
            "";

        return;
    }


    lockReference.textContent =
        `قيمة التثبيت في جدول VIP ${target}: ${format(data.maintain)} — ويمكنك تعديلها للعميل.`;
}


/* =========================================================
   الحساب الرئيسي
========================================================= */

function calculate() {

    const mode =
        getMode();


    const vipCurrent =
        Number(currentVip.value);

    const vipTarget =
        Number(targetVip.value);


    const x =
        number(multiplier.value);


    const supportPerMillion =
        number(supportRate.value);


    const jodPerMillion =
        number(jodRate.value);


    const usdPerMillion =
        number(usdRate.value);


    /*
    ================================================
    حالة تثبيت المستوى الحالي فقط
    ================================================
    */

    if (
        mode === "currentLock"
    ) {

        /*
        في هذه الحالة القيمة الوحيدة
        هي المتبقي الفعلي للتثبيت.

        لا نضيف XP للترقية.
        لا نضيف قيمة المستوى.
        */

        const currentLock =
            getCurrentLockValue();


        const total =
            currentLock;


        showCalculation(
            vipCurrent,
            vipCurrent,
            0,
            currentLock,
            total,
            x,
            supportPerMillion,
            jodPerMillion,
            usdPerMillion
        );

        return;
    }


    /*
    ================================================
    حالة الوصول إلى مستوى آخر
    ================================================
    */

    if (
        vipTarget <= vipCurrent
    ) {

        showCalculation(
            vipCurrent,
            vipTarget,
            0,
            0,
            0,
            x,
            supportPerMillion,
            jodPerMillion,
            usdPerMillion
        );

        return;
    }


    /*
    نقاط الوصول:
    مجموع القيم التي أدخلها المستخدم فقط.
    */

    const transitions =
        getTransitionValues();


    const reach =
        transitions.reduce(
            (sum, item) =>
                sum + number(item.value),
            0
        );


    /*
    نقاط التثبيت.
    لا تضاف إلا إذا فعل المستخدم التثبيت.
    */

    let lock = 0;

    if (
        enableTargetLock.checked
    ) {

        lock =
            number(lockValue.value);
    }


    /*
    الإجمالي النهائي لنقاط VIP.
    */

    const total =
        reach + lock;


    showCalculation(
        vipCurrent,
        vipTarget,
        reach,
        lock,
        total,
        x,
        supportPerMillion,
        jodPerMillion,
        usdPerMillion
    );
}


/* =========================================================
   تثبيت المستوى الحالي
========================================================= */

function getCurrentLockValue() {

    /*
    خانة التثبيت الحالية يتم إنشاؤها
    داخل transitionList في هذا الوضع.
    */

    const input =
        document.querySelector(
            ".current-lock-value"
        );

    return input
        ? number(input.value)
        : 0;
}


/* =========================================================
   إنشاء خانة تثبيت المستوى الحالي
========================================================= */

function renderCurrentLock() {

    transitionArea
        .classList.remove("hidden");

    targetLockBox
        .classList.add("hidden");


    transitionList.innerHTML = `

        <div class="transition">

            <div class="transition-head">

                <span>تثبيت فقط</span>

                <strong>
                    VIP ${Number(currentVip.value)}
                </strong>

            </div>


            <div class="field">

                <label>
                    المتبقي الفعلي للتثبيت
                </label>

                <input
                    class="current-lock-value"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="مثال: 15000000"
                >

                <small>
                    أدخل الرقم الموجود فعلياً في صورة العميل.
                </small>

            </div>

        </div>
    `;


    calculate();
}


/* =========================================================
   عرض الحساب
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

    /*
    الشحن الفعلي:

    إجمالي نقاط VIP ÷ العرض
    */

    let charge = 0;

    if (x > 0) {

        charge =
            total / x;
    }


    /*
    الدعم:

    الشحن الفعلي ÷ 1M × دعم المليون
    */

    const support =
        (charge / 1000000) *
        supportRateValue;


    /*
    المال:

    الشحن الفعلي ÷ 1M × سعر المليون
    */

    const jod =
        (charge / 1000000) *
        jodRateValue;


    const usd =
        (charge / 1000000) *
        usdRateValue;


    /*
    النصوص.
    */

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
   تحديث واجهة نوع العملية
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


    if (
        mode === "currentLock"
    ) {

        renderCurrentLock();

        return;
    }


    renderTransitions();
}


/* =========================================================
   حفظ العملاء
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
   إنشاء سجل كامل
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

        mode:

            mode,

        currentVip:
            Number(currentVip.value),

        targetVip:
            Number(targetVip.value),

        multiplier:
            number(multiplier.value),

        transitions:
            getTransitionValues(),

        currentLock:
            mode === "currentLock"
                ? getCurrentLockValue()
                : 0,

        targetLockEnabled:
            enableTargetLock.checked,

        targetLock:
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
   زر الحفظ
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


        /*
        حفظ نسخة جديدة من العملية.
        */

        records.unshift(
            createRecord()
        );


        saveRecords(
            records
        );


        clientStatus.textContent =
            `تم حفظ العملية للعميل ID: ${id}`;

        clientStatus
            .classList.remove(
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
            ).toLocaleString(
                "ar"
            );


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
                    ${operation}
                    · ×${record.multiplier}
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


        history.appendChild(
            item
        );
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
    نوع العملية.
    */

    const modeRadio =
        document.querySelector(
            `input[name="mode"][value="${record.mode}"]`
        );


    if (modeRadio) {

        modeRadio.checked =
            true;
    }


    /*
    التثبيت.
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


    updateModeUI();


    /*
    بعد renderTransitions
    يتم استبدال القيم بالقيم المحفوظة.
    */

    if (
        record.mode === "reach"
    ) {

        renderTransitions(
            record.transitions || []
        );
    }


    /*
    إذا كانت عملية تثبيت فقط.
    */

    if (
        record.mode === "currentLock"
    ) {

        renderCurrentLock();

        const input =
            document.querySelector(
                ".current-lock-value"
            );

        if (input) {

            input.value =
                record.currentLock || "";
        }
    }


    updateLockReference();

    calculate();


    clientStatus.textContent =
        `تم فتح سجل العميل ID: ${record.clientId}`;

    clientStatus
        .classList.remove(
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
        getRecords()
            .filter(
                item =>
                    item.id !== id
            );


    saveRecords(
        records
    );


    renderHistory();
}


/* =========================================================
   حذف الكل
========================================================= */

$("clearHistory")
    .addEventListener(
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

        updateModeUI();
    }
);


targetVip.addEventListener(
    "change",
    () => {

        if (
            getMode() === "reach"
        ) {

            renderTransitions();

        } else {

            updateLockReference();

            calculate();
        }
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

        if (
            enableTargetLock.checked
        ) {

            targetLockInput
                .classList.remove(
                    "hidden"
                );


            /*
            إذا لم توجد قيمة،
            استخدم قيمة الحفاظ من جدول المستوى المطلوب.
            */

            if (
                !number(
                    lockValue.value
                )
            ) {

                setDefaultLockValue();

            } else {

                calculate();
            }

        } else {

            targetLockInput
                .classList.add(
                    "hidden"
                );

            calculate();
        }
    }
);


/* =========================================================
   تغيير قيمة التثبيت
========================================================= */

lockValue.addEventListener(
    "input",
    calculate
);


/* =========================================================
   تغييرات الأسعار
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
   تغييرات خانات الانتقال
========================================================= */

transitionList.addEventListener(
    "input",
    event => {

        if (
            event.target.matches(
                ".transition-value, .current-lock-value"
            )
        ) {

            calculate();
        }
    }
);


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

$("calculateBtn")
    .addEventListener(
        "click",
        calculate
    );


/* =========================================================
   عملية جديدة
========================================================= */

$("newBtn")
    .addEventListener(
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

            supportRate.value =
                "130000";

            jodRate.value =
                "11";

            usdRate.value =
                "15";

            lockValue.value =
                "";

            enableTargetLock.checked =
                false;


            targetLockInput
                .classList.add(
                    "hidden"
                );


            const reach =
                document.querySelector(
                    'input[name="mode"][value="reach"]'
                );


            reach.checked =
                true;


            clientStatus
                .classList.add(
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
   تشغيل الموقع
========================================================= */

buildVipOptions();

renderVipTable();

updateModeUI();

renderHistory();

calculate();

/* =========================
   الحاسبة العادية
========================= */

(function () {

    const result = document.getElementById("calculatorResult");
    const history = document.getElementById("calculatorHistory");
    const buttons = document.querySelectorAll(".calc-btn");

    if (!result || !history || !buttons.length) return;

    let expression = "";

    function updateDisplay() {
        result.textContent = expression || "0";
    }

    function calculate() {

        if (!expression) return;

        try {

            let exp = expression
                .replace(/×/g, "*")
                .replace(/÷/g, "/")
                .replace(/%/g, "/100");

            if (!/^[0-9+\-*/().\s]+$/.test(exp)) {
                throw new Error("Invalid");
            }

            const answer = Function(
                `"use strict"; return (${exp})`
            )();

            if (!Number.isFinite(answer)) {
                throw new Error("Invalid");
            }

            history.textContent = expression + " =";

            expression = String(
                Number.isInteger(answer)
                    ? answer
                    : Number(answer.toFixed(10))
            );

            updateDisplay();

        } catch (error) {

            history.textContent = expression;
            result.textContent = "خطأ";
            expression = "";

        }
    }

    buttons.forEach(button => {

        button.addEventListener("click", function () {

            const value = this.dataset.value;
            const action = this.dataset.action;

            if (action === "clear") {
                expression = "";
                history.textContent = "";
                updateDisplay();
                return;
            }

            if (action === "delete") {
                expression = expression.slice(0, -1);
                updateDisplay();
                return;
            }

            if (action === "equals") {
                calculate();
                return;
            }

            if (value) {
                expression += value;
                updateDisplay();
            }

        });

    });

})();
