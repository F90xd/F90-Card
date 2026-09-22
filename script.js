"use strict";

/*
==========================================================
مجلس القمة للشحن
حاسبة VIP

مهم:
جدول VIP مرجعي فقط.

الحساب الحقيقي للعميل يعتمد على:
1. VIP الحالي
2. VIP المستهدف
3. المتبقي الفعلي للمستوى التالي
4. القيم اليدوية للانتقالات التالية
5. التثبيت إن تم اختياره
6. معامل ×1 إلى ×10
7. سعر الدعم لكل مليون
8. سعر المليون بالدينار والدولار

الحفظ:
LocalStorage
==========================================================
*/


/* ======================================================
   جدول VIP
====================================================== */

const VIP = [
    [1, 50000, 50000, 30000],
    [2, 100000, 50000, 30000],
    [3, 300000, 100000, 90000],
    [4, 1000000, 800000, 500000],
    [5, 3000000, 2000000, 1300000],
    [6, 7000000, 4000000, 2600000],
    [7, 14000000, 7000000, 4500000],
    [8, 26000000, 12000000, 7800000],
    [9, 42000000, 16000000, 11000000],
    [10, 62000000, 20000000, 14000000],
    [11, 102000000, 40000000, 28000000],
    [12, 220000000, 118000000, 83000000],
    [13, 430000000, 210000000, 150000000],
    [14, 820000000, 390000000, 310000000],
    [15, 1820000000, 1000000000, 700000000],
    [16, 3820000000, 2000000000, 1400000000],
    [17, 7382000000, 3500000000, 3000000000],
    [18, 11882000000, 4500000000, 4000000000],
    [19, 17382000000, 5500000000, 5000000000],
    [20, 27382000000, 10000000000, 9000000000]
];


const STORAGE_KEY = "alqimma_vip_customer_records_v2";


/* ======================================================
   اختصارات
====================================================== */

const $ = id => document.getElementById(id);

const clientName = $("clientName");
const clientId = $("clientId");

const currentVip = $("currentVip");
const targetVip = $("targetVip");

const firstRemaining = $("firstRemaining");
const multiplier = $("multiplier");

const transitions = $("transitions");

const lockValue = $("lockValue");
const lockArea = $("lockArea");

const supportRate = $("supportRate");
const jodRate = $("jodRate");
const usdRate = $("usdRate");

const resultVip = $("resultVip");
const finalCharge = $("finalCharge");

const reachResult = $("reachResult");
const lockResult = $("lockResult");
const totalResult = $("totalResult");

const customerSupport = $("customerSupport");
const chargeToClient = $("chargeToClient");
const remainingSupport = $("remainingSupport");

const jodResult = $("jodResult");
const usdResult = $("usdResult");

const history = $("history");
const historySearch = $("historySearch");


/* ======================================================
   تنسيق الأرقام
====================================================== */

function n(value) {
    const number = Number(value);

    if (!Number.isFinite(number) || number < 0) {
        return 0;
    }

    return number;
}


function fmt(value) {
    return new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 2
    }).format(n(value));
}


function money(value, suffix) {
    return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(n(value)) + " " + suffix;
}


/* ======================================================
   إنشاء اختيارات VIP
====================================================== */

function createVipOptions() {

    currentVip.innerHTML = "";
    targetVip.innerHTML = "";

    for (let i = 1; i <= 20; i++) {

        const a = document.createElement("option");
        a.value = i;
        a.textContent = `VIP ${i}`;
        currentVip.appendChild(a);

        const b = document.createElement("option");
        b.value = i;
        b.textContent = `VIP ${i}`;
        targetVip.appendChild(b);
    }

    currentVip.value = "5";
    targetVip.value = "7";
}


/* ======================================================
   جدول VIP
====================================================== */

function renderVipTable() {

    const tbody = $("vipTable");

    tbody.innerHTML = "";

    VIP.forEach(row => {

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>VIP ${row[0]}</td>
            <td>${fmt(row[1])}</td>
            <td>${fmt(row[2])}</td>
            <td>${fmt(row[3])}</td>
        `;

        tbody.appendChild(tr);
    });
}


/* ======================================================
   إنشاء خانات الانتقال
======================================================

مثال:

الحالي 5
المطلوب 7

تظهر:

5 → 6
6 → 7

القيمة الأولى = المتبقي الفعلي
الذي أدخله المستخدم.

القيمة الثانية = تدخل يدوياً.

لا نأخذ قيمة الجدول للحساب.
====================================================== */

function renderTransitions(savedValues = null) {

    const current = Number(currentVip.value);
    const target = Number(targetVip.value);

    transitions.innerHTML = "";

    if (target <= current) {

        transitions.innerHTML = `
            <div class="empty">
                اختر مستوى مستهدف أعلى من المستوى الحالي.
            </div>
        `;

        calculate();
        return;
    }


    for (let from = current; from < target; from++) {

        const to = from + 1;

        const div = document.createElement("div");

        div.className = "transition";

        let saved = "";

        if (Array.isArray(savedValues)) {

            const found = savedValues.find(
                item => Number(item.from) === from
            );

            if (found) {
                saved = found.value;
            }
        }

        /*
        أول انتقال مرتبط بالمتبقي الفعلي.
        */
        if (from === current) {
            saved = firstRemaining.value || saved || "";
        }


        div.innerHTML = `
            <div class="transition-head">
                <span>انتقال</span>
                <strong>VIP ${from} → VIP ${to}</strong>
            </div>

            <label>
                القيمة المطلوبة لهذا الانتقال
                <input
                    class="transition-value"
                    data-from="${from}"
                    data-to="${to}"
                    type="number"
                    min="0"
                    step="1"
                    value="${saved}"
                    placeholder="أدخل القيمة"
                >
            </label>
        `;

        transitions.appendChild(div);
    }


    /*
    إذا غير المستخدم المتبقي الأول
    نضعه في أول انتقال.
    */

    const firstInput =
        transitions.querySelector(".transition-value");

    if (firstInput) {

        firstInput.value =
            firstRemaining.value || firstInput.value;

    }

    calculate();
}


/* ======================================================
   قراءة انتقالات العميل
====================================================== */

function getTransitions() {

    return Array.from(
        document.querySelectorAll(".transition-value")
    ).map(input => ({
        from: Number(input.dataset.from),
        to: Number(input.dataset.to),
        value: n(input.value)
    }));
}


/* ======================================================
   الحساب
====================================================== */

function calculate() {

    const current = Number(currentVip.value);
    const target = Number(targetVip.value);

    const multiplierValue = n(multiplier.value);

    const supportPerMillion = n(supportRate.value);

    const jodPerMillion = n(jodRate.value);

    const usdPerMillion = n(usdRate.value);


    resultVip.textContent =
        `VIP ${current} → VIP ${target}`;


    if (target <= current) {

        setResults(0, 0, 0, 0, 0, 0, 0, 0);

        return;
    }


    /*
    ================================================
    1. إجمالي الوصول بدون تثبيت
    ================================================

    نجمع فقط القيم التي أدخلها المستخدم
    للانتقالات من المستوى الحالي إلى المستهدف.

    لا نستخدم إجمالي جدول VIP.
    */

    const values = getTransitions();

    let reach = 0;

    values.forEach(item => {
        reach += n(item.value);
    });


    /*
    ================================================
    2. التثبيت
    ================================================
    */

    const lockEnabled =
        document.querySelector(
            'input[name="lock"]:checked'
        )?.value === "yes";

    const lock = lockEnabled
        ? n(lockValue.value)
        : 0;


    /*
    ================================================
    3. الإجمالي المطلوب للوصول
       + التثبيت إذا اختاره المستخدم
    ================================================
    */

    const total = reach + lock;


    /*
    ================================================
    4. دعم العميل

    كل 1,000,000 شحن
    يحتاج supportRate دعم.

    مثال:
    1M × 130,000 = 130,000 دعم

    8M × 130,000 = 1,040,000 دعم
    ================================================
    */

    const supportNeeded =
        (total / 1000000) * supportPerMillion;


    /*
    ================================================
    5. كمية الشحن حسب العرض

    مثال:
    المطلوب 8M
    العرض ×5

    الشحن الفعلي = 8M × 5 = 40M
    ================================================
    */

    const actualCharge =
        total * multiplierValue;


    /*
    ================================================
    6. الدعم الناتج من كمية الشحن
    ================================================
    */

    const generatedSupport =
        (actualCharge / 1000000) *
        supportPerMillion;


    /*
    ================================================
    7. الدعم المتبقي بعد الشحن
    ================================================
    */

    const after =
        Math.max(
            0,
            supportNeeded - generatedSupport
        );


    /*
    ================================================
    8. القيمة المالية

    السعر لكل مليون شحن تحدده أنت.
    ================================================
    */

    const jod =
        (actualCharge / 1000000) *
        jodPerMillion;

    const usd =
        (actualCharge / 1000000) *
        usdPerMillion;


    setResults(
        reach,
        lock,
        total,
        supportNeeded,
        actualCharge,
        after,
        jod,
        usd
    );
}


/* ======================================================
   عرض النتائج
====================================================== */

function setResults(
    reach,
    lock,
    total,
    support,
    charge,
    after,
    jod,
    usd
) {

    reachResult.textContent = fmt(reach);

    lockResult.textContent = fmt(lock);

    totalResult.textContent = fmt(total);

    customerSupport.textContent = fmt(support);

    chargeToClient.textContent = fmt(charge);

    remainingSupport.textContent = fmt(after);

    finalCharge.textContent = fmt(charge);

    jodResult.textContent = money(jod, "د.أ");

    usdResult.textContent = money(usd, "$");
}


/* ======================================================
   التثبيت
====================================================== */

document
    .querySelectorAll('input[name="lock"]')
    .forEach(radio => {

        radio.addEventListener("change", () => {

            const yes =
                document.querySelector(
                    'input[name="lock"]:checked'
                ).value === "yes";


            lockArea.classList.toggle(
                "hidden",
                !yes
            );


            $("noLockLabel")
                .classList.toggle(
                    "selected",
                    !yes
                );

            $("yesLockLabel")
                .classList.toggle(
                    "selected",
                    yes
                );


            calculate();
        });
    });


/* ======================================================
   تحديث أول انتقال
====================================================== */

firstRemaining.addEventListener("input", () => {

    const first =
        transitions.querySelector(
            ".transition-value"
        );

    if (first) {
        first.value = firstRemaining.value;
    }

    calculate();
});


/* ======================================================
   تغيير VIP
====================================================== */

currentVip.addEventListener("change", () => {

    renderTransitions();

});


targetVip.addEventListener("change", () => {

    renderTransitions();

});


/* ======================================================
   أي تغيير في الحساب
====================================================== */

document.addEventListener("input", event => {

    if (
        event.target.matches(
            "input, select"
        )
    ) {
        calculate();
    }
});


/* ======================================================
   زر الحساب
====================================================== */

$("calculateBtn").addEventListener(
    "click",
    calculate
);


/* ======================================================
   LocalStorage
====================================================== */

function getRecords() {

    try {

        const raw =
            localStorage.getItem(STORAGE_KEY);

        if (!raw) {
            return [];
        }

        const data =
            JSON.parse(raw);

        return Array.isArray(data)
            ? data
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


/* ======================================================
   إنشاء سجل
====================================================== */

function createRecord() {

    calculate();

    return {

        id: Date.now(),

        name:
            clientName.value.trim(),

        accountId:
            clientId.value.trim(),

        currentVip:
            Number(currentVip.value),

        targetVip:
            Number(targetVip.value),

        firstRemaining:
            n(firstRemaining.value),

        transitions:
            getTransitions(),

        multiplier:
            n(multiplier.value),

        lockEnabled:
            document.querySelector(
                'input[name="lock"]:checked'
            )?.value === "yes",

        lockValue:
            n(lockValue.value),

        supportRate:
            n(supportRate.value),

        jodRate:
            n(jodRate.value),

        usdRate:
            n(usdRate.value),

        created:
            new Date().toISOString()
    };
}


/* ======================================================
   حفظ
====================================================== */

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

        const record =
            createRecord();


        records.unshift(record);

        saveRecords(records);

        renderHistory();

        $("savedClient").textContent =
            `تم حفظ العملية للعميل ID: ${id}`;

        $("savedClient")
            .classList.remove("hidden");

        alert("تم حفظ العملية بنجاح.");
    }
);


/* ======================================================
   عرض السجل
====================================================== */

function renderHistory() {

    const records =
        getRecords();

    const query =
        historySearch.value
            .trim()
            .toLowerCase();


    const filtered =
        records.filter(record => {

            if (!query) {
                return true;
            }

            return (
                String(record.accountId)
                    .toLowerCase()
                    .includes(query)
                ||
                String(record.name)
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


        item.innerHTML = `

            <div class="history-main">
                <strong>
                    ${safe(record.name || "بدون اسم")}
                </strong>

                <span>
                    ID: ${safe(record.accountId)}
                    · VIP ${record.currentVip}
                    → VIP ${record.targetVip}
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


        history.appendChild(item);
    });
}


/* ======================================================
   حماية النص
====================================================== */

function safe(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* ======================================================
   فتح سجل
====================================================== */

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


/* ======================================================
   تحميل سجل
====================================================== */

function loadRecord(id) {

    const record =
        getRecords()
            .find(item => item.id === id);


    if (!record) {
        return;
    }


    clientName.value =
        record.name || "";

    clientId.value =
        record.accountId || "";

    currentVip.value =
        String(record.currentVip);

    targetVip.value =
        String(record.targetVip);

    firstRemaining.value =
        record.firstRemaining || "";

    multiplier.value =
        String(record.multiplier);


    supportRate.value =
        record.supportRate;

    jodRate.value =
        record.jodRate;

    usdRate.value =
        record.usdRate;

    lockValue.value =
        record.lockValue || 0;


    const lockRadio =
        document.querySelector(
            `input[name="lock"][value="${record.lockEnabled ? "yes" : "no"}"]`
        );


    if (lockRadio) {
        lockRadio.checked = true;
        lockRadio.dispatchEvent(
            new Event("change")
        );
    }


    renderTransitions(
        record.transitions
    );


    calculate();


    $("savedClient").textContent =
        `تم فتح السجل الخاص بالعميل ID: ${record.accountId}`;

    $("savedClient")
        .classList.remove("hidden");


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* ======================================================
   حذف سجل
====================================================== */

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
            .filter(item => item.id !== id);


    saveRecords(records);

    renderHistory();
}


/* ======================================================
   حذف كل السجل
====================================================== */

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
                "سيتم حذف جميع العمليات المحفوظة. هل أنت متأكد؟"
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


/* ======================================================
   البحث
====================================================== */

historySearch.addEventListener(
    "input",
    renderHistory
);


/* ======================================================
   عملية جديدة
====================================================== */

$("newBtn").addEventListener(
    "click",
    () => {

        if (
            !confirm(
                "بدء عملية جديدة؟ السجل المحفوظ لن يتم حذفه."
            )
        ) {
            return;
        }


        clientName.value = "";

        clientId.value = "";

        currentVip.value = "5";

        targetVip.value = "7";

        firstRemaining.value = "";

        multiplier.value = "5";

        supportRate.value = "130000";

        jodRate.value = "11";

        usdRate.value = "15";

        lockValue.value = "0";


        const no =
            document.querySelector(
                'input[name="lock"][value="no"]'
            );

        no.checked = true;

        $("noLockLabel")
            .classList.add("selected");

        $("yesLockLabel")
            .classList.remove("selected");

        lockArea
            .classList.add("hidden");


        $("savedClient")
            .classList.add("hidden");


        renderTransitions();

        calculate();


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
);


/* ======================================================
   التشغيل الأول
====================================================== */

createVipOptions();

renderVipTable();

renderTransitions();

renderHistory();

calculate();
