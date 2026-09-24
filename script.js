"use strict";


/* =========================================================
   مجلس القمة للشحن
   النسخة النهائية
========================================================= */


/* =========================================================
   VIP TABLE
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
   STORAGE
========================================================= */

const STORAGE_KEY =
    "majlis_alqimma_vip_records_v5";


let historyRecords =
    loadHistory();


/* =========================================================
   HELPERS
========================================================= */

function byId(id) {

    return document.getElementById(id);

}


function numberValue(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return 0;
    }


    const cleaned =
        String(value)
            .replace(/,/g, "")
            .trim();


    if (cleaned === "") {
        return 0;
    }


    const result =
        Number(cleaned);


    return Number.isFinite(result)
        ? result
        : 0;

}


function formatNumber(value, decimals = 0) {

    if (!Number.isFinite(value)) {
        value = 0;
    }


    return value.toLocaleString(
        "en-US",
        {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }
    );

}


function formatCoins(value) {

    return formatNumber(value, 0);

}


function formatMoney(value) {

    return formatNumber(value, 2);

}


/*
   هذه الدالة تجعل كل خانات الأرقام
   قابلة للمسح وإعادة الإدخال.
*/

function cleanNumericInput(input) {

    if (!input) {
        return;
    }


    input.addEventListener(
        "input",
        function () {

            /*
               لا نحول القيمة إلى Number أثناء الكتابة.
               هذا هو السبب الذي يسمح بمسح الرقم بالكامل.
            */

            const original =
                input.value;


            /*
               نسمح بالأرقام والفاصلة والنقطة
               وعلامة السالب عند الحاجة.
            */

            const cleaned =
                original.replace(
                    /[^\d.,-]/g,
                    ""
                );


            if (cleaned !== original) {
                input.value = cleaned;
            }

        }
    );

}


/* =========================================================
   INITIALIZE NUMERIC FIELDS
========================================================= */

[
    "supportRate",
    "jodRate",
    "usdRate",
    "targetInput",
    "gamesInput"
].forEach(function (id) {

    cleanNumericInput(
        byId(id)
    );

});


/* =========================================================
   VIP SELECTS
========================================================= */

function buildVipSelects() {

    const current =
        byId("currentVip");

    const target =
        byId("targetVip");


    if (!current || !target) {
        return;
    }


    current.innerHTML = "";

    target.innerHTML = "";


    VIP_TABLE.forEach(function (item) {

        const optionCurrent =
            document.createElement("option");

        optionCurrent.value =
            item.level;

        optionCurrent.textContent =
            "VIP " + item.level;

        current.appendChild(
            optionCurrent
        );


        const optionTarget =
            document.createElement("option");

        optionTarget.value =
            item.level;

        optionTarget.textContent =
            "VIP " + item.level;

        target.appendChild(
            optionTarget
        );

    });


    current.value = "10";
    target.value = "11";

}


buildVipSelects();


/* =========================================================
   VIP TABLE RENDER
========================================================= */

function renderVipTable() {

    const tbody =
        byId("vipTable");


    if (!tbody) {
        return;
    }


    tbody.innerHTML = "";


    VIP_TABLE.forEach(function (item) {

        const tr =
            document.createElement("tr");


        tr.innerHTML = `

            <td>
                VIP ${item.level}
            </td>

            <td>
                ${formatCoins(item.total)}
            </td>

            <td>
                ${formatCoins(item.upgrade)}
            </td>

            <td>
                ${formatCoins(item.maintain)}
            </td>

        `;


        tbody.appendChild(tr);

    });

}


renderVipTable();


/* =========================================================
   TRANSITION CALCULATOR
========================================================= */

function getVip(level) {

    return VIP_TABLE.find(
        function (item) {
            return item.level === Number(level);
        }
    );

}


function renderTransitions() {

    const area =
        byId("transitionList");

    const current =
        Number(
            byId("currentVip").value
        );

    const target =
        Number(
            byId("targetVip").value
        );


    if (!area) {
        return;
    }


    area.innerHTML = "";


    if (target <= current) {

        area.innerHTML = `
            <div class="empty">
                اختر مستوى أعلى
            </div>
        `;

        return;
    }


    const firstTarget =
        current + 1;


    const first =
        getVip(firstTarget);


    if (!first) {
        return;
    }


    /*
       الانتقال الأول هو الوحيد الذي يدخله المستخدم.
    */

    const firstBox =
        document.createElement("div");


    firstBox.className =
        "transition first-transition";


    firstBox.innerHTML = `

        <div class="transition-head">

            <span>
                الانتقال الأول
            </span>

            <strong>
                VIP ${current} → VIP ${firstTarget}
            </strong>

        </div>

        <input
            id="firstTransitionInput"
            type="text"
            inputmode="decimal"
            placeholder="أدخل قيمة النقص"
            autocomplete="off"
        >

    `;


    area.appendChild(firstBox);


    cleanNumericInput(
        byId("firstTransitionInput")
    );


    /*
       بقية الانتقالات تلقائية.
    */

    if (target > firstTarget) {

        const title =
            document.createElement("div");

        title.className =
            "automatic-title";

        title.innerHTML = `

            <span>
                الانتقالات التلقائية
            </span>

            <small>
                يتم حسابها من جدول VIP
            </small>

        `;

        area.appendChild(title);


        for (
            let level = firstTarget;
            level < target;
            level++
        ) {

            const next =
                getVip(level + 1);


            if (!next) {
                continue;
            }


            const box =
                document.createElement("div");

            box.className =
                "transition automatic-transition";


            box.innerHTML = `

                <div class="transition-head">

                    <span>
                        تلقائي
                    </span>

                    <strong>
                        VIP ${level} → VIP ${level + 1}
                    </strong>

                </div>


                <div class="auto-transition-value">

                    <span>
                        القيمة
                    </span>

                    <strong>
                        ${formatCoins(next.upgrade)}
                    </strong>

                </div>

            `;


            area.appendChild(box);

        }

    }


    const firstInput =
        byId("firstTransitionInput");


    if (firstInput) {

        firstInput.addEventListener(
            "input",
            calculateVip
        );

    }

}


function getFirstTransitionValue() {

    const input =
        byId("firstTransitionInput");


    if (!input) {
        return 0;
    }


    return numberValue(
        input.value
    );

}


/* =========================================================
   VIP CALCULATION
========================================================= */

function calculateVip() {

    const current =
        Number(
            byId("currentVip").value
        );


    const target =
        Number(
            byId("targetVip").value
        );


    const multiplier =
        numberValue(
            byId("multiplier").value
        ) || 1;


    const firstValue =
        getFirstTransitionValue();


    let reachPoints = 0;


    if (target > current) {

        /*
           القيمة التي يدخلها المستخدم
           هي قيمة النقص في أول انتقال.
        */

        reachPoints +=
            firstValue;


        /*
           باقي المستويات تحسب تلقائياً
           من جدول VIP.
        */

        for (
            let level = current + 1;
            level < target;
            level++
        ) {

            const next =
                getVip(level + 1);


            if (next) {

                reachPoints +=
                    next.upgrade;

            }

        }

    }


    let lockPoints = 0;


    const mode =
        document.querySelector(
            'input[name="mode"]:checked'
        );


    if (
        mode &&
        mode.value === "currentLock"
    ) {

        const currentData =
            getVip(current);


        if (currentData) {

            lockPoints =
                currentData.maintain;

        }

    }


    const lockEnabled =
        byId("enableTargetLock") &&
        byId("enableTargetLock").checked;


    if (
        mode &&
        mode.value === "reach" &&
        lockEnabled
    ) {

        const targetData =
            getVip(target);


        if (targetData) {

            lockPoints =
                targetData.maintain;

        }

    }


    const totalVipPoints =
        reachPoints +
        lockPoints;


    const actualCharge =
        totalVipPoints *
        multiplier;


    /*
       دعم كل مليون:
       الدعم = الشحن ÷ 1,000,000 × supportRate
    */

    const supportRate =
        numberValue(
            byId("supportRate").value
        );


    const supportNeeded =
        actualCharge /
        1000000 *
        supportRate;


    const jodRate =
        numberValue(
            byId("jodRate").value
        );


    const usdRate =
        numberValue(
            byId("usdRate").value
        );


    const jodTotal =
        supportNeeded /
        supportRate *
        jodRate;


    const usdTotal =
        supportNeeded /
        supportRate *
        usdRate;


    updateVipResult({

        current,
        target,
        multiplier,

        reachPoints,
        lockPoints,
        totalVipPoints,

        actualCharge,
        supportNeeded,

        jodTotal,
        usdTotal,

        supportRate

    });


    return {

        current,
        target,
        multiplier,

        reachPoints,
        lockPoints,
        totalVipPoints,

        actualCharge,
        supportNeeded,

        jodTotal,
        usdTotal

    };

}


/* =========================================================
   VIP RESULT
========================================================= */

function updateVipResult(data) {

    byId("resultTitle").textContent =
        `VIP ${data.current} → VIP ${data.target}`;


    byId("resultMultiplier").textContent =
        `×${data.multiplier}`;


    byId("actualCharge").textContent =
        formatCoins(
            data.actualCharge
        );


    byId("reachPoints").textContent =
        formatCoins(
            data.reachPoints
        );


    byId("lockPoints").textContent =
        formatCoins(
            data.lockPoints
        );


    byId("totalVipPoints").textContent =
        formatCoins(
            data.totalVipPoints
        );


    byId("supportNeeded").textContent =
        formatCoins(
            data.supportNeeded
        );


    byId("jodTotal").textContent =
        `${formatMoney(data.jodTotal)} د.أ`;


    byId("usdTotal").textContent =
        `${formatMoney(data.usdTotal)} $`;


    byId("formulaReach").textContent =
        formatCoins(
            data.reachPoints
        );


    byId("formulaLock").textContent =
        formatCoins(
            data.lockPoints
        );


    byId("formulaVip").textContent =
        formatCoins(
            data.totalVipPoints
        );


    byId("formulaMultiplier").textContent =
        `×${data.multiplier}`;


    byId("formulaSupport").textContent =
        `${formatCoins(data.actualCharge)} ÷ 1,000,000 × ${formatCoins(data.supportRate)} = ${formatCoins(data.supportNeeded)}`;


    const autoLock =
        byId("autoLockValue");

    const autoLevel =
        byId("autoLockLevel");


    const targetData =
        getVip(data.target);


    if (targetData) {

        if (autoLock) {

            autoLock.textContent =
                formatCoins(
                    targetData.maintain
                );

        }


        if (autoLevel) {

            autoLevel.textContent =
                data.target;

        }

    }

}


/* =========================================================
   MODES
========================================================= */

function updateMode() {

    const selected =
        document.querySelector(
            'input[name="mode"]:checked'
        );


    const reachLabel =
        byId("reachModeLabel");

    const lockLabel =
        byId("currentLockLabel");


    const transitionArea =
        byId("transitionArea");

    const lockBox =
        byId("targetLockBox");


    if (!selected) {
        return;
    }


    if (selected.value === "reach") {

        reachLabel.classList.add(
            "active"
        );

        lockLabel.classList.remove(
            "active"
        );


        transitionArea.classList.remove(
            "hidden"
        );

        lockBox.classList.remove(
            "hidden"
        );

    } else {

        reachLabel.classList.remove(
            "active"
        );

        lockLabel.classList.add(
            "active"
        );


        transitionArea.classList.add(
            "hidden"
        );

        lockBox.classList.add(
            "hidden"
        );

    }


    calculateVip();

}


/* =========================================================
   LOCK SWITCH
========================================================= */

function updateLock() {

    const enabled =
        byId("enableTargetLock").checked;


    const targetInput =
        byId("targetLockInput");


    if (enabled) {

        targetInput.classList.remove(
            "hidden"
        );

    } else {

        targetInput.classList.add(
            "hidden"
        );

    }


    calculateVip();

}


/* =========================================================
   INPUT EVENTS
========================================================= */

[
    "currentVip",
    "targetVip",
    "multiplier",
    "supportRate",
    "jodRate",
    "usdRate"
].forEach(function (id) {

    const element =
        byId(id);


    if (!element) {
        return;
    }


    element.addEventListener(
        "input",
        function () {

            if (
                id === "currentVip" ||
                id === "targetVip"
            ) {

                renderTransitions();

            }


            calculateVip();

        }
    );


    element.addEventListener(
        "change",
        function () {

            if (
                id === "currentVip" ||
                id === "targetVip"
            ) {

                renderTransitions();

            }


            calculateVip();

        }
    );

});


document
    .querySelectorAll(
        'input[name="mode"]'
    )
    .forEach(function (radio) {

        radio.addEventListener(
            "change",
            updateMode
        );

    });


byId("enableTargetLock")
    .addEventListener(
        "change",
        updateLock
    );


/* =========================================================
   INITIAL VIP
========================================================= */

renderTransitions();

updateMode();

calculateVip();


/* =========================================================
   SAVE / HISTORY
========================================================= */

function loadHistory() {

    try {

        const saved =
            localStorage.getItem(
                STORAGE_KEY
            );


        if (!saved) {
            return [];
        }


        const parsed =
            JSON.parse(saved);


        return Array.isArray(parsed)
            ? parsed
            : [];

    } catch (error) {

        return [];

    }

}


function saveHistory() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(historyRecords)
    );

}


function createRecord() {

    const result =
        calculateVip();


    return {

        id:
            Date.now().toString(),

        createdAt:
            new Date().toISOString(),

        clientName:
            byId("clientName").value.trim(),

        clientId:
            byId("clientId").value.trim(),

        currentVip:
            result.current,

        targetVip:
            result.target,

        multiplier:
            result.multiplier,

        reachPoints:
            result.reachPoints,

        lockPoints:
            result.lockPoints,

        totalVipPoints:
            result.totalVipPoints,

        actualCharge:
            result.actualCharge,

        supportNeeded:
            result.supportNeeded,

        jodTotal:
            result.jodTotal,

        usdTotal:
            result.usdTotal

    };

}


function saveCurrentOperation() {

    const name =
        byId("clientName").value.trim();


    const id =
        byId("clientId").value.trim();


    if (!name && !id) {

        showStatus(
            "أدخل اسم العميل أو ID أولاً"
        );

        return;

    }


    const record =
        createRecord();


    historyRecords.unshift(
        record
    );


    saveHistory();

    renderHistory();

    renderStats();


    showStatus(
        "تم حفظ العملية بنجاح"
    );

}


byId("saveBtn")
    .addEventListener(
        "click",
        saveCurrentOperation
    );


/* =========================================================
   HISTORY RENDER
========================================================= */

function renderHistory() {

    const container =
        byId("history");


    const search =
        byId("historySearch")
            .value
            .trim()
            .toLowerCase();


    let records =
        historyRecords;


    if (search) {

        records =
            records.filter(
                function (record) {

                    return (

                        String(
                            record.clientName || ""
                        )
                        .toLowerCase()
                        .includes(search)

                        ||

                        String(
                            record.clientId || ""
                        )
                        .toLowerCase()
                        .includes(search)

                    );

                }
            );

    }


    if (!records.length) {

        container.innerHTML = `
            <div class="empty">
                لا توجد عمليات محفوظة
            </div>
        `;

        return;

    }


    container.innerHTML = "";


    records.forEach(function (record) {

        const item =
            document.createElement("div");


        item.className =
            "history-item";


        const date =
            new Date(
                record.createdAt
            );


        const dateText =
            date.toLocaleString(
                "ar",
                {
                    dateStyle: "medium",
                    timeStyle: "short"
                }
            );


        item.innerHTML = `

            <div class="history-main">

                <strong>
                    ${escapeHtml(
                        record.clientName || "بدون اسم"
                    )}
                </strong>

                <span>
                    ID:
                    ${escapeHtml(
                        record.clientId || "-"
                    )}
                </span>

                <span>
                    VIP ${record.currentVip}
                    →
                    VIP ${record.targetVip}
                    ·
                    ${formatCoins(record.actualCharge)}
                    كوينز
                </span>

                <span>
                    ${dateText}
                </span>

            </div>


            <div class="history-buttons">

                <button
                    type="button"
                    data-load="${record.id}"
                >
                    استرجاع
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


        container.appendChild(item);

    });

}


function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


renderHistory();


byId("historySearch")
    .addEventListener(
        "input",
        renderHistory
    );


byId("history")
    .addEventListener(
        "click",
        function (event) {

            const loadButton =
                event.target.closest(
                    "[data-load]"
                );


            const deleteButton =
                event.target.closest(
                    "[data-delete]"
                );


            if (loadButton) {

                loadRecord(
                    loadButton.dataset.load
                );

            }


            if (deleteButton) {

                deleteRecord(
                    deleteButton.dataset.delete
                );

            }

        }
    );


function loadRecord(id) {

    const record =
        historyRecords.find(
            function (item) {
                return item.id === id;
            }
        );


    if (!record) {
        return;
    }


    byId("clientName").value =
        record.clientName || "";


    byId("clientId").value =
        record.clientId || "";


    byId("currentVip").value =
        String(record.currentVip);


    byId("targetVip").value =
        String(record.targetVip);


    byId("multiplier").value =
        String(record.multiplier);


    renderTransitions();


    calculateVip();


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    showStatus(
        "تم استرجاع العملية"
    );

}


function deleteRecord(id) {

    historyRecords =
        historyRecords.filter(
            function (item) {
                return item.id !== id;
            }
        );


    saveHistory();

    renderHistory();

    renderStats();

}


byId("clearHistory")
    .addEventListener(
        "click",
        function () {

            if (!historyRecords.length) {
                return;
            }


            const confirmed =
                window.confirm(
                    "هل تريد حذف جميع العمليات؟"
                );


            if (!confirmed) {
                return;
            }


            historyRecords = [];

            saveHistory();

            renderHistory();

            renderStats();

        }
    );


/* =========================================================
   NEW OPERATION
========================================================= */

byId("newBtn")
    .addEventListener(
        "click",
        function () {

            byId("clientName").value = "";

            byId("clientId").value = "";


            byId("currentVip").value =
                "10";

            byId("targetVip").value =
                "11";

            byId("multiplier").value =
                "5";


            byId("supportRate").value =
                "130000";

            byId("jodRate").value =
                "11";

            byId("usdRate").value =
                "15";


            byId("enableTargetLock").checked =
                false;


            byId("targetInput").value =
                "";

            byId("gamesInput").value =
                "";


            renderTransitions();

            updateMode();

            updateLock();

            calculateVip();

            calculateTargetCalculator();

            calculateGamesCalculator();


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );


/* =========================================================
   STATUS
========================================================= */

let statusTimer = null;


function showStatus(message) {

    const status =
        byId("clientStatus");


    if (!status) {
        return;
    }


    status.textContent =
        message;


    status.classList.remove(
        "hidden"
    );


    clearTimeout(statusTimer);


    statusTimer =
        setTimeout(
            function () {

                status.classList.add(
                    "hidden"
                );

            },
            2200
        );

}


/* =========================================================
   STATS
========================================================= */

function renderStats() {

    const operations =
        historyRecords.length;


    const customers =
        new Set(
            historyRecords
                .map(
                    function (record) {
                        return (
                            record.clientId ||
                            record.clientName ||
                            record.id
                        );
                    }
                )
        ).size;


    let charge = 0;
    let support = 0;
    let vipPoints = 0;
    let jod = 0;
    let usd = 0;
    let highest = 0;


    historyRecords.forEach(
        function (record) {

            charge +=
                numberValue(
                    record.actualCharge
                );


            support +=
                numberValue(
                    record.supportNeeded
                );


            vipPoints +=
                numberValue(
                    record.totalVipPoints
                );


            jod +=
                numberValue(
                    record.jodTotal
                );


            usd +=
                numberValue(
                    record.usdTotal
                );


            highest =
                Math.max(
                    highest,
                    numberValue(
                        record.targetVip
                    )
                );

        }
    );


    byId("statOperations").textContent =
        formatNumber(operations);


    byId("statCustomers").textContent =
        formatNumber(customers);


    byId("statCharge").textContent =
        formatCoins(charge);


    byId("statSupport").textContent =
        formatCoins(support);


    byId("statVipPoints").textContent =
        formatCoins(vipPoints);


    byId("statJod").textContent =
        formatMoney(jod);


    byId("statUsd").textContent =
        formatMoney(usd);


    byId("statHighestVip").textContent =
        `VIP ${highest}`;

}


renderStats();


/* =========================================================
   STATS TOGGLE
========================================================= */

byId("statsToggle")
    .addEventListener(
        "click",
        function () {

            const panel =
                byId("statsPanel");


            const arrow =
                byId("statsArrow");


            panel.classList.toggle(
                "hidden"
            );


            if (
                panel.classList.contains(
                    "hidden"
                )
            ) {

                arrow.textContent =
                    "⌄";

            } else {

                arrow.textContent =
                    "⌃";

            }

        }
    );


/* =========================================================
   THEME
========================================================= */

const THEME_KEY =
    "majlis_alqimma_theme";


function applyTheme(theme) {

    if (theme === "light") {

        document.body.classList.add(
            "light"
        );

        byId("themeToggle").textContent =
            "☀";

    } else {

        document.body.classList.remove(
            "light"
        );

        byId("themeToggle").textContent =
            "☾";

    }

}


const savedTheme =
    localStorage.getItem(
        THEME_KEY
    ) || "dark";


applyTheme(savedTheme);


byId("themeToggle")
    .addEventListener(
        "click",
        function () {

            const isLight =
                document.body.classList.contains(
                    "light"
                );


            const newTheme =
                isLight
                    ? "dark"
                    : "light";


            localStorage.setItem(
                THEME_KEY,
                newTheme
            );


            applyTheme(
                newTheme
            );

        }
    );


/* =========================================================
   TARGET CALCULATOR
========================================================= */

const TARGET_JOD_RATE =
    7;

const TARGET_USD_RATE =
    10;


const GAMES_JOD_RATE =
    6;

const GAMES_USD_RATE =
    8;


function calculateTargetCalculator() {

    const input =
        byId("targetInput");


    const value =
        numberValue(
            input.value
        );


    const jod =
        (value / 100000) *
        TARGET_JOD_RATE;


    const usd =
        (value / 100000) *
        TARGET_USD_RATE;


    byId("targetJod").textContent =
        formatMoney(jod);


    byId("targetUsd").textContent =
        formatMoney(usd);

}


function calculateGamesCalculator() {

    const input =
        byId("gamesInput");


    const value =
        numberValue(
            input.value
        );


    const jod =
        (value / 100000) *
        GAMES_JOD_RATE;


    const usd =
        (value / 100000) *
        GAMES_USD_RATE;


    byId("gamesJod").textContent =
        formatMoney(jod);


    byId("gamesUsd").textContent =
        formatMoney(usd);

}


byId("targetInput")
    .addEventListener(
        "input",
        calculateTargetCalculator
    );


byId("gamesInput")
    .addEventListener(
        "input",
        calculateGamesCalculator
    );


calculateTargetCalculator();

calculateGamesCalculator();


/* =========================================================
   COPY CONTACT
========================================================= */

document
    .querySelectorAll(
        ".copy-btn"
    )
    .forEach(
        function (button) {

            button.addEventListener(
                "click",
                async function () {

                    const value =
                        button.dataset.copy;


                    if (!value) {
                        return;
                    }


                    try {

                        await navigator.clipboard.writeText(
                            value
                        );


                        const oldText =
                            button.textContent;


                        button.textContent =
                            "تم النسخ";


                        setTimeout(
                            function () {

                                button.textContent =
                                    oldText;

                            },
                            1200
                        );


                    } catch (error) {

                        /*
                           بديل للأجهزة التي تمنع
                           Clipboard API.
                        */

                        const temp =
                            document.createElement(
                                "textarea"
                            );


                        temp.value =
                            value;


                        document.body.appendChild(
                            temp
                        );


                        temp.select();


                        document.execCommand(
                            "copy"
                        );


                        temp.remove();


                        button.textContent =
                            "تم النسخ";


                        setTimeout(
                            function () {

                                button.textContent =
                                    "نسخ";

                            },
                            1200
                        );

                    }

                }
            );

        }
    );


/* =========================================================
   CALCULATE BUTTON
========================================================= */

byId("calculateBtn")
    .addEventListener(
        "click",
        function () {

            calculateVip();

            calculateTargetCalculator();

            calculateGamesCalculator();

            showStatus(
                "تم تحديث جميع النتائج"
            );

        }
    );


/* =========================================================
   CLIENT INPUT
========================================================= */

byId("clientName")
    .addEventListener(
        "input",
        function () {

            byId("clientStatus")
                .classList.add(
                    "hidden"
                );

        }
    );


byId("clientId")
    .addEventListener(
        "input",
        function () {

            byId("clientStatus")
                .classList.add(
                    "hidden"
                );

        }
    );


/* =========================================================
   FINAL CALCULATION
========================================================= */

calculateVip();

renderHistory();

renderStats();
