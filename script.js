"use strict";

/* =========================================================
   مجلس القمة للشحن
   النسخة النهائية
   - الانتقال الأول يدوي
   - باقي الانتقالات تلقائية من جدول VIP
   - التثبيت اختياري
   - إجمالي الشحن = إجمالي VIP ÷ العرض
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

const THEME_KEY =
    "majlis_alqimma_theme";

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

    return formatNumber(
        value,
        0
    );

}


function formatMoney(value) {

    return formatNumber(
        value,
        2
    );

}


/* =========================================================
NUMERIC INPUT
========================================================= */

function cleanNumericInput(input) {

    if (!input) {
        return;
    }

    input.addEventListener(
        "input",
        function () {

            const original =
                input.value;

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


[
    "supportRate",
    "jodRate",
    "usdRate",
    "targetInput",
    "gamesInput"
].forEach(
    function (id) {

        cleanNumericInput(
            byId(id)
        );

    }
);


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

    VIP_TABLE.forEach(
        function (item) {

            const currentOption =
                document.createElement(
                    "option"
                );

            currentOption.value =
                item.level;

            currentOption.textContent =
                "VIP " + item.level;

            current.appendChild(
                currentOption
            );


            const targetOption =
                document.createElement(
                    "option"
                );

            targetOption.value =
                item.level;

            targetOption.textContent =
                "VIP " + item.level;

            target.appendChild(
                targetOption
            );

        }
    );

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

    VIP_TABLE.forEach(
        function (item) {

            const tr =
                document.createElement(
                    "tr"
                );

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

        }
    );

}


renderVipTable();


/* =========================================================
GET VIP
========================================================= */

function getVip(level) {

    return VIP_TABLE.find(
        function (item) {

            return item.level ===
                Number(level);

        }
    );

}


/* =========================================================
TRANSITIONS
========================================================= */

function renderTransitions() {

    const area =
        byId("transitionList");

    const currentElement =
        byId("currentVip");

    const targetElement =
        byId("targetVip");

    if (
        !area ||
        !currentElement ||
        !targetElement
    ) {
        return;
    }

    const current =
        Number(
            currentElement.value
        );

    const target =
        Number(
            targetElement.value
        );

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


    /* =====================================================
       الانتقال الأول — يدوي
    ===================================================== */

    const firstBox =
        document.createElement(
            "div"
        );

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

    area.appendChild(
        firstBox
    );


    const firstInput =
        byId("firstTransitionInput");

    cleanNumericInput(
        firstInput
    );


    if (target > firstTarget) {

        const title =
            document.createElement(
                "div"
            );

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

        area.appendChild(
            title
        );


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
                document.createElement(
                    "div"
                );

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

            area.appendChild(
                box
            );

        }

    }


    if (firstInput) {

        firstInput.addEventListener(
            "input",
            calculateVip
        );

    }

}


/* =========================================================
FIRST TRANSITION
========================================================= */

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

    const currentElement =
        byId("currentVip");

    const targetElement =
        byId("targetVip");

    const multiplierElement =
        byId("multiplier");

    if (
        !currentElement ||
        !targetElement ||
        !multiplierElement
    ) {
        return {
            current: 0,
            target: 0,
            multiplier: 1,
            reachPoints: 0,
            lockPoints: 0,
            totalVipPoints: 0,
            actualCharge: 0,
            supportNeeded: 0,
            jodTotal: 0,
            usdTotal: 0
        };
    }


    const current =
        Number(
            currentElement.value
        );

    const target =
        Number(
            targetElement.value
        );

    const multiplier =
        numberValue(
            multiplierElement.value
        ) || 1;


    const firstValue =
        getFirstTransitionValue();


    let reachPoints = 0;


    /* =====================================================
       الوصول
    ===================================================== */

    if (target > current) {

        /*
        الانتقال الأول:
        القيمة الحقيقية المتبقية التي يدخلها المستخدم.
        */

        reachPoints +=
            firstValue;


        /*
        باقي الانتقالات:
        من جدول VIP بشكل تلقائي.
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


    /* =====================================================
       التثبيت
    ===================================================== */

    let lockPoints = 0;


    const mode =
        document.querySelector(
            'input[name="mode"]:checked'
        );


    /*
    تثبيت المستوى الحالي فقط
    */

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


    /*
    تثبيت المستوى المطلوب
    */

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


    /* =====================================================
       الإجمالي
    ===================================================== */

    const totalVipPoints =
        reachPoints +
        lockPoints;


    /*
    إجمالي شحن الوكيل:
    إجمالي نقاط VIP ÷ العرض
    */

    const actualCharge =
        totalVipPoints /
        multiplier;


    /* =====================================================
       SUPPORT
    ===================================================== */

    const supportRate =
        numberValue(
            byId("supportRate").value
        );


    let supportNeeded = 0;

    if (supportRate > 0) {

        supportNeeded =
            actualCharge /
            1000000 *
            supportRate;

    }


    /* =====================================================
       MONEY
    ===================================================== */

    const jodRate =
        numberValue(
            byId("jodRate").value
        );

    const usdRate =
        numberValue(
            byId("usdRate").value
        );


    let jodTotal = 0;
    let usdTotal = 0;


    if (supportRate > 0) {

        jodTotal =
            supportNeeded /
            supportRate *
            jodRate;


        usdTotal =
            supportNeeded /
            supportRate *
            usdRate;

    }


    const result = {

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

    };


    updateVipResult(
        result
    );


    return result;

}


/* =========================================================
VIP RESULT
========================================================= */

function updateVipResult(data) {

    const resultTitle =
        byId("resultTitle");

    const resultMultiplier =
        byId("resultMultiplier");

    const actualCharge =
        byId("actualCharge");

    const reachPoints =
        byId("reachPoints");

    const lockPoints =
        byId("lockPoints");

    const totalVipPoints =
        byId("totalVipPoints");

    const supportNeeded =
        byId("supportNeeded");

    const jodTotal =
        byId("jodTotal");

    const usdTotal =
        byId("usdTotal");

    const formulaReach =
        byId("formulaReach");

    const formulaLock =
        byId("formulaLock");

    const formulaVip =
        byId("formulaVip");

    const formulaMultiplier =
        byId("formulaMultiplier");

    const formulaSupport =
        byId("formulaSupport");


    if (resultTitle) {

        resultTitle.textContent =
            `VIP ${data.current} → VIP ${data.target}`;

    }


    if (resultMultiplier) {

        resultMultiplier.textContent =
            `×${data.multiplier}`;

    }


    if (actualCharge) {

        actualCharge.textContent =
            formatCoins(
                data.actualCharge
            );

    }


    if (reachPoints) {

        reachPoints.textContent =
            formatCoins(
                data.reachPoints
            );

    }


    if (lockPoints) {

        lockPoints.textContent =
            formatCoins(
                data.lockPoints
            );

    }


    if (totalVipPoints) {

        totalVipPoints.textContent =
            formatCoins(
                data.totalVipPoints
            );

    }


    if (supportNeeded) {

        supportNeeded.textContent =
            formatCoins(
                data.supportNeeded
            );

    }


    if (jodTotal) {

        jodTotal.textContent =
            `${formatMoney(data.jodTotal)} د.أ`;

    }


    if (usdTotal) {

        usdTotal.textContent =
            `${formatMoney(data.usdTotal)} $`;

    }


    if (formulaReach) {

        formulaReach.textContent =
            formatCoins(
                data.reachPoints
            );

    }


    if (formulaLock) {

        formulaLock.textContent =
            formatCoins(
                data.lockPoints
            );

    }


    if (formulaVip) {

        formulaVip.textContent =
            formatCoins(
                data.totalVipPoints
            );

    }


    if (formulaMultiplier) {

        formulaMultiplier.textContent =
            `×${data.multiplier}`;

    }


    if (formulaSupport) {

        formulaSupport.textContent =
            `${formatCoins(data.actualCharge)} ÷ 1,000,000 × ${formatCoins(data.supportRate)} = ${formatCoins(data.supportNeeded)}`;

    }


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

    if (!selected) {
        return;
    }


    const reachLabel =
        byId("reachModeLabel");

    const lockLabel =
        byId("currentLockLabel");

    const transitionArea =
        byId("transitionArea");

    const lockBox =
        byId("targetLockBox");


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

    const checkbox =
        byId("enableTargetLock");

    const targetInput =
        byId("targetLockInput");


    if (!checkbox || !targetInput) {
        return;
    }


    if (checkbox.checked) {

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
].forEach(
    function (id) {

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

    }
);


/* =========================================================
MODE EVENTS
========================================================= */

document
    .querySelectorAll(
        'input[name="mode"]'
    )
    .forEach(
        function (radio) {

            radio.addEventListener(
                "change",
                updateMode
            );

        }
    );


const lockCheckbox =
    byId("enableTargetLock");

if (lockCheckbox) {

    lockCheckbox.addEventListener(
        "change",
        updateLock
    );

}


/* =========================================================
STORAGE
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

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(historyRecords)
        );

    } catch (error) {

        console.error(
            "تعذر حفظ السجل:",
            error
        );

    }

}


/* =========================================================
CREATE RECORD
========================================================= */

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


/* =========================================================
SAVE
========================================================= */

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


const saveButton =
    byId("saveBtn");

if (saveButton) {

    saveButton.addEventListener(
        "click",
        saveCurrentOperation
    );

}


/* =========================================================
HISTORY
========================================================= */

function renderHistory() {

    const container =
        byId("history");

    const searchInput =
        byId("historySearch");

    if (!container || !searchInput) {
        return;
    }


    const search =
        searchInput.value
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


    records.forEach(
        function (record) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "history-item";


            const date =
                new Date(
                    record.createdAt
                );


            const dateText =
                Number.isNaN(
                    date.getTime()
                )
                    ? "-"
                    : date.toLocaleString(
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
                            record.clientName ||
                            "بدون اسم"
                        )}
                    </strong>

                    <span>
                        ID:
                        ${escapeHtml(
                            record.clientId ||
                            "-"
                        )}
                    </span>

                    <span>
                        VIP ${record.currentVip}
                        →
                        VIP ${record.targetVip}
                        ·
                        ${formatCoins(
                            record.actualCharge
                        )}
                        كوينز
                    </span>

                    <span>
                        ${dateText}
                    </span>

                </div>


                <div class="history-buttons">

                    <button
                        type="button"
                        data-load="${escapeHtml(record.id)}"
                    >
                        استرجاع
                    </button>

                    <button
                        type="button"
                        class="delete"
                        data-delete="${escapeHtml(record.id)}"
                    >
                        حذف
                    </button>

                </div>

            `;


            container.appendChild(
                item
            );

        }
    );

}


function escapeHtml(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


const historySearch =
    byId("historySearch");

if (historySearch) {

    historySearch.addEventListener(
        "input",
        renderHistory
    );

}


const historyContainer =
    byId("history");

if (historyContainer) {

    historyContainer.addEventListener(
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

                return;

            }


            if (deleteButton) {

                deleteRecord(
                    deleteButton.dataset.delete
                );

            }

        }
    );

}


/* =========================================================
LOAD RECORD
========================================================= */

function loadRecord(id) {

    const record =
        historyRecords.find(
            function (item) {

                return String(item.id) ===
                    String(id);

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
        String(
            record.currentVip
        );


    byId("targetVip").value =
        String(
            record.targetVip
        );


    byId("multiplier").value =
        String(
            record.multiplier
        );


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


/* =========================================================
DELETE RECORD
========================================================= */

function deleteRecord(id) {

    historyRecords =
        historyRecords.filter(
            function (item) {

                return String(item.id) !==
                    String(id);

            }
        );


    saveHistory();

    renderHistory();

    renderStats();

}


/* =========================================================
CLEAR HISTORY
========================================================= */

const clearHistory =
    byId("clearHistory");

if (clearHistory) {

    clearHistory.addEventListener(
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

}


/* =========================================================
NEW OPERATION
========================================================= */

const newButton =
    byId("newBtn");

if (newButton) {

    newButton.addEventListener(
        "click",
        function () {

            byId("clientName").value =
                "";

            byId("clientId").value =
                "";


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


            const lock =
                byId("enableTargetLock");

            if (lock) {
                lock.checked = false;
            }


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

}


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


    clearTimeout(
        statusTimer
    );


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
            historyRecords.map(
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


    const elements = {

        statOperations:
            formatNumber(operations),

        statCustomers:
            formatNumber(customers),

        statCharge:
            formatCoins(charge),

        statSupport:
            formatCoins(support),

        statVipPoints:
            formatCoins(vipPoints),

        statJod:
            formatMoney(jod),

        statUsd:
            formatMoney(usd),

        statHighestVip:
            `VIP ${highest}`

    };


    Object.keys(elements).forEach(
        function (id) {

            const element =
                byId(id);

            if (element) {

                element.textContent =
                    elements[id];

            }

        }
    );

}


renderStats();


/* =========================================================
STATS TOGGLE
========================================================= */

const statsToggle =
    byId("statsToggle");

if (statsToggle) {

    statsToggle.addEventListener(
        "click",
        function () {

            const panel =
                byId("statsPanel");

            const arrow =
                byId("statsArrow");


            if (!panel) {
                return;
            }


            panel.classList.toggle(
                "hidden"
            );


            if (
                panel.classList.contains(
                    "hidden"
                )
            ) {

                if (arrow) {
                    arrow.textContent =
                        "⌄";
                }

            } else {

                if (arrow) {
                    arrow.textContent =
                        "⌃";
                }

            }

        }
    );

}


/* =========================================================
THEME
========================================================= */

function applyTheme(theme) {

    const themeButton =
        byId("themeToggle");


    if (theme === "light") {

        document.body.classList.add(
            "light"
        );


        if (themeButton) {

            themeButton.textContent =
                "☀";

        }

    } else {

        document.body.classList.remove(
            "light"
        );


        if (themeButton) {

            themeButton.textContent =
                "☾";

        }

    }

}


const savedTheme =
    localStorage.getItem(
        THEME_KEY
    ) || "dark";


applyTheme(
    savedTheme
);


const themeToggle =
    byId("themeToggle");

if (themeToggle) {

    themeToggle.addEventListener(
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

}


/* =========================================================
TARGET / GAMES CALCULATOR
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

    if (!input) {
        return;
    }


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


    const targetJod =
        byId("targetJod");

    const targetUsd =
        byId("targetUsd");


    if (targetJod) {

        targetJod.textContent =
            formatMoney(jod);

    }


    if (targetUsd) {

        targetUsd.textContent =
            formatMoney(usd);

    }

}


function calculateGamesCalculator() {

    const input =
        byId("gamesInput");

    if (!input) {
        return;
    }


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


    const gamesJod =
        byId("gamesJod");

    const gamesUsd =
        byId("gamesUsd");


    if (gamesJod) {

        gamesJod.textContent =
            formatMoney(jod);

    }


    if (gamesUsd) {

        gamesUsd.textContent =
            formatMoney(usd);

    }

}


const targetInput =
    byId("targetInput");

if (targetInput) {

    targetInput.addEventListener(
        "input",
        calculateTargetCalculator
    );

}


const gamesInput =
    byId("gamesInput");

if (gamesInput) {

    gamesInput.addEventListener(
        "input",
        calculateGamesCalculator
    );

}


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


                    const oldText =
                        button.textContent;


                    try {

                        if (
                            navigator.clipboard &&
                            navigator.clipboard.writeText
                        ) {

                            await navigator.clipboard.writeText(
                                value
                            );

                        } else {

                            throw new Error(
                                "Clipboard unavailable"
                            );

                        }


                        button.textContent =
                            "تم النسخ";


                    } catch (error) {

                        const temp =
                            document.createElement(
                                "textarea"
                            );


                        temp.value =
                            value;


                        temp.style.position =
                            "fixed";

                        temp.style.opacity =
                            "0";


                        document.body.appendChild(
                            temp
                        );


                        temp.focus();

                        temp.select();


                        try {

                            document.execCommand(
                                "copy"
                            );

                        } catch (copyError) {

                            /* تجاهل الخطأ */

                        }


                        temp.remove();


                        button.textContent =
                            "تم النسخ";

                    }


                    setTimeout(
                        function () {

                            button.textContent =
                                oldText;

                        },
                        1200
                    );

                }
            );

        }
    );


/* =========================================================
CALCULATE BUTTON
========================================================= */

const calculateButton =
    byId("calculateBtn");

if (calculateButton) {

    calculateButton.addEventListener(
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

}


/* =========================================================
CLIENT INPUT
========================================================= */

const clientName =
    byId("clientName");

if (clientName) {

    clientName.addEventListener(
        "input",
        function () {

            const status =
                byId("clientStatus");

            if (status) {

                status.classList.add(
                    "hidden"
                );

            }

        }
    );

}


const clientId =
    byId("clientId");

if (clientId) {

    clientId.addEventListener(
        "input",
        function () {

            const status =
                byId("clientStatus");

            if (status) {

                status.classList.add(
                    "hidden"
                );

            }

        }
    );

}


/* =========================================================
COLLAPSIBLE SECTIONS
========================================================= */

function setupCollapsibleSection(
    toggleId,
    contentId
) {

    const toggle =
        byId(toggleId);

    const content =
        byId(contentId);


    if (!toggle || !content) {
        return;
    }


    toggle.addEventListener(
        "click",
        function () {

            const isHidden =
                content.classList.contains(
                    "hidden"
                );


            if (isHidden) {

                content.classList.remove(
                    "hidden"
                );

                toggle.classList.add(
                    "open"
                );

            } else {

                content.classList.add(
                    "hidden"
                );

                toggle.classList.remove(
                    "open"
                );

            }

        }
    );

}


setupCollapsibleSection(
    "clientToggle",
    "clientSectionContent"
);


setupCollapsibleSection(
    "historyToggle",
    "historySectionContent"
);


/* =========================================================
INITIAL
========================================================= */

renderTransitions();

updateMode();

updateLock();

calculateVip();

renderHistory();

renderStats();
