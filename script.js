"use strict";

/*
    مجلس القمة للشحن
    F90 أف تسعين للخدمات الرقمية

    نظام حاسبة VIP شخصية.
    لا تحتاج قاعدة بيانات أو API.
    البيانات تحفظ داخل المتصفح باستخدام LocalStorage.
*/


/* =========================================================
   1. جدول VIP
   ========================================================= */

const VIP_DATA = [
    {
        level: 1,
        total: 50000,
        upgrade: 50000,
        maintenance: 30000
    },
    {
        level: 2,
        total: 100000,
        upgrade: 50000,
        maintenance: 30000
    },
    {
        level: 3,
        total: 300000,
        upgrade: 100000,
        maintenance: 90000
    },
    {
        level: 4,
        total: 1000000,
        upgrade: 800000,
        maintenance: 500000
    },
    {
        level: 5,
        total: 3000000,
        upgrade: 2000000,
        maintenance: 1300000
    },
    {
        level: 6,
        total: 7000000,
        upgrade: 4000000,
        maintenance: 2600000
    },
    {
        level: 7,
        total: 14000000,
        upgrade: 7000000,
        maintenance: 4500000
    },
    {
        level: 8,
        total: 26000000,
        upgrade: 12000000,
        maintenance: 7800000
    },
    {
        level: 9,
        total: 42000000,
        upgrade: 16000000,
        maintenance: 11000000
    },
    {
        level: 10,
        total: 62000000,
        upgrade: 20000000,
        maintenance: 14000000
    },
    {
        level: 11,
        total: 102000000,
        upgrade: 40000000,
        maintenance: 28000000
    },
    {
        level: 12,
        total: 220000000,
        upgrade: 118000000,
        maintenance: 83000000
    },
    {
        level: 13,
        total: 430000000,
        upgrade: 210000000,
        maintenance: 150000000
    },
    {
        level: 14,
        total: 820000000,
        upgrade: 390000000,
        maintenance: 310000000
    },
    {
        level: 15,
        total: 1820000000,
        upgrade: 1000000000,
        maintenance: 700000000
    },
    {
        level: 16,
        total: 3820000000,
        upgrade: 2000000000,
        maintenance: 1400000000
    },
    {
        level: 17,
        total: 7382000000,
        upgrade: 3500000000,
        maintenance: 3000000000
    },
    {
        level: 18,
        total: 11882000000,
        upgrade: 4500000000,
        maintenance: 4000000000
    },
    {
        level: 19,
        total: 17382000000,
        upgrade: 5500000000,
        maintenance: 5000000000
    },
    {
        level: 20,
        total: 27382000000,
        upgrade: 10000000000,
        maintenance: 9000000000
    }
];


/* =========================================================
   2. مفاتيح التخزين
   ========================================================= */

const STORAGE_KEYS = {
    customers: "majlis_alqimma_customers_v1",
    operations: "majlis_alqimma_operations_v1",
    settings: "majlis_alqimma_settings_v1"
};


/* =========================================================
   3. أدوات عامة
   ========================================================= */

function $(id) {
    return document.getElementById(id);
}


function toNumber(value) {

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return 0;
    }

    return number;
}


function formatNumber(value, decimals = 2) {

    if (!Number.isFinite(value)) {
        return "0";
    }

    return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: decimals
    }).format(value);
}


function formatMillions(coins) {
    return formatNumber(coins / 1000000, 4);
}


function formatCoins(coins) {
    return formatNumber(coins, 0);
}


function getVip(level) {

    return VIP_DATA.find(
        item => item.level === Number(level)
    );
}


function getStorage(key, fallback) {

    try {

        const value = localStorage.getItem(key);

        if (!value) {
            return fallback;
        }

        return JSON.parse(value);

    } catch (error) {

        console.error(error);

        return fallback;
    }
}


function setStorage(key, value) {

    localStorage.setItem(
        key,
        JSON.stringify(value)
    );
}


/* =========================================================
   4. ملء مستويات VIP
   ========================================================= */

function populateVipSelects() {

    const current = $("currentVip");
    const target = $("targetVip");

    VIP_DATA.forEach(item => {

        const option1 = document.createElement("option");

        option1.value = item.level;
        option1.textContent = `VIP ${item.level}`;

        current.appendChild(option1);


        const option2 = document.createElement("option");

        option2.value = item.level;
        option2.textContent = `VIP ${item.level}`;

        target.appendChild(option2);

    });
}


/* =========================================================
   5. جدول VIP
   ========================================================= */

function renderVipTable() {

    const tbody = $("vipTableBody");

    tbody.innerHTML = "";

    VIP_DATA.forEach(item => {

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td class="vip-level">${item.level}</td>
            <td>${formatCoins(item.total)}</td>
            <td>${formatCoins(item.upgrade)}</td>
            <td>${formatCoins(item.maintenance)}</td>
        `;

        tbody.appendChild(tr);
    });
}


/* =========================================================
   6. إظهار / إخفاء التثبيت
   ========================================================= */

function toggleMaintenanceField() {

    const checked = $("includeMaintenance").checked;

    $("maintenanceField")
        .classList
        .toggle("hidden", !checked);
}


/* =========================================================
   7. قراءة الإعدادات
   ========================================================= */

function loadSettings() {

    const settings = getStorage(
        STORAGE_KEYS.settings,
        {}
    );

    if (settings.coinsPerMillion) {
        $("coinsPerMillion").value =
            settings.coinsPerMillion;
    }

    if (settings.jodPerMillion) {
        $("jodPerMillion").value =
            settings.jodPerMillion;
    }

    if (settings.usdPerMillion) {
        $("usdPerMillion").value =
            settings.usdPerMillion;
    }
}


function saveSettings() {

    setStorage(
        STORAGE_KEYS.settings,
        {
            coinsPerMillion:
                toNumber($("coinsPerMillion").value),

            jodPerMillion:
                toNumber($("jodPerMillion").value),

            usdPerMillion:
                toNumber($("usdPerMillion").value)
        }
    );
}


/* =========================================================
   8. الحساب الأساسي
   =========================================================

   مثال:
   VIP 5 -> VIP 7

   المطلوب:
   VIP 5 -> VIP 6 = 4M
   VIP 6 -> VIP 7 = 7M

   الإجمالي للوصول = 11M

   لا نقوم بجمع إجمالي VIP1 -> VIP7.

   إذا تم إدخال "القيمة الناقصة يدويًا":
   نستخدمها كقيمة المرحلة الأولى الحالية،
   ثم نضيف مراحل VIP التالية.
*/


function calculate() {

    const currentLevel =
        Number($("currentVip").value);

    const targetLevel =
        Number($("targetVip").value);

    const multiplier =
        toNumber($("vipMultiplier").value);

    const customMissingRaw =
        $("customMissing").value.trim();

    const includeMaintenance =
        $("includeMaintenance").checked;

    const coinsPerMillion =
        toNumber($("coinsPerMillion").value);

    const jodPerMillion =
        toNumber($("jodPerMillion").value);

    const usdPerMillion =
        toNumber($("usdPerMillion").value);


    /* التحقق */

    if (!currentLevel || !targetLevel) {

        alert("اختر المستوى الحالي والمستوى المطلوب.");

        return null;
    }


    if (targetLevel <= currentLevel) {

        alert("المستوى المطلوب يجب أن يكون أعلى من المستوى الحالي.");

        return null;
    }


    if (multiplier <= 0) {

        alert("قيمة ×VIP غير صحيحة.");

        return null;
    }


    if (coinsPerMillion <= 0) {

        alert("عدد كوينز الدعم لكل مليون يجب أن يكون أكبر من صفر.");

        return null;
    }


    if (jodPerMillion < 0 || usdPerMillion < 0) {

        alert("أسعار الدينار والدولار غير صحيحة.");

        return null;
    }


    /*
        الوصول بدون تثبيت.

        مثال:
        الحالي 5
        المطلوب 7

        نأخذ:
        VIP6 upgrade = 4M
        VIP7 upgrade = 7M

        = 11M

        ولكن إذا العميل أعطى قيمة ناقصة يدويًا:
        مثال 1.3M للوصول إلى VIP6

        نستخدم:
        1.3M + VIP7 upgrade 7M
        = 8.3M
    */

    let withoutMaintenance = 0;

    const stages = [];

    const customMissing =
        customMissingRaw === ""
            ? null
            : toNumber(customMissingRaw);


    for (
        let level = currentLevel + 1;
        level <= targetLevel;
        level++
    ) {

        const vip = getVip(level);

        if (!vip) {
            continue;
        }

        let amount = vip.upgrade;

        /*
            القيمة اليدوية تخص أول مرحلة فقط.
        */

        if (
            level === currentLevel + 1 &&
            customMissing !== null
        ) {
            amount = customMissing;
        }

        withoutMaintenance += amount;

        stages.push({
            level,
            amount
        });
    }


    /*
        التثبيت:

        التثبيت يكون للمستوى المطلوب النهائي فقط.

        مثال:
        الوصول VIP7
        تثبيت VIP7
        = maintenance الخاصة بـ VIP7

        لا نجمع تثبيت كل المستويات.
    */

    let maintenance = 0;

    if (includeMaintenance) {

        const customMaintenanceRaw =
            $("maintenanceAmount").value.trim();

        if (customMaintenanceRaw !== "") {

            maintenance =
                toNumber(customMaintenanceRaw);

        } else {

            const targetVip =
                getVip(targetLevel);

            maintenance =
                targetVip
                    ? targetVip.maintenance
                    : 0;
        }
    }


    /*
        الإجمالي الفعلي الذي ستشحنه:
        الوصول + التثبيت إذا تم اختياره.
    */

    const totalCoins =
        withoutMaintenance + maintenance;


    /*
        هنا نقطة مهمة:

        العميل يرمي كوينز الدعم على حساب الوكيل.
        أنت تشحن له حسب ×VIP.

        لذلك:

        الدعم المطلوب من العميل =
        كمية الشحن الفعلية ÷ المعامل

        والشحن الذي ستنفذه =
        الإجمالي.

        مثال:
        الإجمالي 8.3M
        ×5

        العميل يحتاج يرمي:
        8.3 ÷ 5 = 1.66M

        وأنت تشحن:
        8.3M
    */

    const customerCoins =
        totalCoins / multiplier;


    const chargedMillions =
        totalCoins / 1000000;


    const customerJod =
        chargedMillions *
        jodPerMillion /
        multiplier;


    const customerUsd =
        chargedMillions *
        usdPerMillion /
        multiplier;


    /*
        حفظ آخر نتيجة مؤقتًا
    */

    const result = {

        customerId:
            $("customerId").value.trim(),

        customerName:
            $("customerName").value.trim(),

        currentLevel,

        targetLevel,

        multiplier,

        customMissing,

        withoutMaintenance,

        maintenance,

        totalCoins,

        customerCoins,

        chargedMillions,

        customerJod,

        customerUsd,

        coinsPerMillion,

        jodPerMillion,

        usdPerMillion,

        includeMaintenance,

        stages,

        createdAt:
            new Date().toISOString()
    };


    window.lastCalculation = result;


    /*
        عرض النتيجة
    */

    displayResult(result);

    saveSettings();

    return result;
}


/* =========================================================
   9. عرض النتيجة
   ========================================================= */

function displayResult(result) {

    $("resultEmpty").classList.add("hidden");

    $("resultContent").classList.remove("hidden");


    $("resultCustomerCoins").textContent =
        formatCoins(result.customerCoins);


    $("resultChargedMillions").textContent =
        formatNumber(result.chargedMillions, 4);


    $("resultWithoutMaintenance").textContent =
        formatMillions(result.withoutMaintenance);


    $("resultMaintenance").textContent =
        formatMillions(result.maintenance);


    $("resultTotal").textContent =
        formatMillions(result.totalCoins);


    $("resultMultiplier").textContent =
        `×${formatNumber(result.multiplier, 0)}`;


    $("resultJod").textContent =
        `${formatNumber(result.customerJod, 2)} د.أ`;


    $("resultUsd").textContent =
        `$${formatNumber(result.customerUsd, 2)}`;


    let stagesText = result.stages
        .map(stage =>
            `VIP ${stage.level}: ${formatMillions(stage.amount)}M`
        )
        .join(" + ");


    if (!stagesText) {
        stagesText = "لا توجد مراحل.";
    }


    const maintenanceText =
        result.includeMaintenance
            ? ` + تثبيت VIP ${result.targetLevel}: ${formatMillions(result.maintenance)}M`
            : " بدون تثبيت";


    $("calculationNote").innerHTML = `
        <strong>تفاصيل الحساب:</strong><br>
        ${stagesText}
        ${maintenanceText}
        <br><br>
        الإجمالي للشحن:
        <strong>${formatMillions(result.totalCoins)}M</strong>
        <br>
        معامل العرض:
        <strong>×${result.multiplier}</strong>
        <br>
        دعم العميل المطلوب:
        <strong>${formatCoins(result.customerCoins)}</strong>
        كوينز
        <br>
        سعر المليون:
        <strong>${formatCoins(result.coinsPerMillion)}</strong>
        كوينز
    `;
}


/* =========================================================
   10. العملاء
   ========================================================= */

function saveCustomer() {

    const id =
        $("customerId").value.trim();

    const name =
        $("customerName").value.trim();


    if (!id) {

        alert("أدخل ID الحساب أولًا.");

        return;
    }


    const customers =
        getStorage(
            STORAGE_KEYS.customers,
            []
        );


    const index =
        customers.findIndex(
            customer =>
                customer.id === id
        );


    const customer = {

        id,

        name,

        updatedAt:
            new Date().toISOString()
    };


    if (index >= 0) {

        customers[index] = customer;

    } else {

        customers.push(customer);
    }


    setStorage(
        STORAGE_KEYS.customers,
        customers
    );


    showMessage("تم حفظ بيانات العميل.");

    renderHistory();
}


function loadCustomer() {

    const id =
        $("customerId").value.trim();


    if (!id) {

        alert("أدخل ID العميل للبحث عنه.");

        return;
    }


    const customers =
        getStorage(
            STORAGE_KEYS.customers,
            []
        );


    const customer =
        customers.find(
            item =>
                item.id === id
        );


    if (!customer) {

        showMessage(
            "لم يتم العثور على هذا العميل.",
            true
        );

        return;
    }


    $("customerName").value =
        customer.name || "";


    showMessage(
        `تم تحميل العميل: ${customer.name || "بدون اسم"}`
    );
}


function showMessage(text, error = false) {

    const box =
        $("customerMessage");

    box.textContent = text;

    box.style.color =
        error
            ? "#e43c4f"
            : "#38c58b";


    clearTimeout(
        window.messageTimer
    );


    window.messageTimer =
        setTimeout(() => {

            box.textContent = "";

        }, 4000);
}


/* =========================================================
   11. حفظ العملية
   ========================================================= */

function saveOperation() {

    if (!window.lastCalculation) {

        alert("قم بالحساب أولًا.");

        return;
    }


    const result =
        window.lastCalculation;


    const operations =
        getStorage(
            STORAGE_KEYS.operations,
            []
        );


    const operation = {

        ...result,

        id:
            Date.now().toString(),

        savedAt:
            new Date().toISOString()
    };


    operations.unshift(operation);


    setStorage(
        STORAGE_KEYS.operations,
        operations
    );


    /*
        حفظ العميل تلقائيًا
        عند حفظ العملية.
    */

    if (result.customerId) {

        const customers =
            getStorage(
                STORAGE_KEYS.customers,
                []
            );


        const index =
            customers.findIndex(
                customer =>
                    customer.id === result.customerId
            );


        const customer = {

            id: result.customerId,

            name: result.customerName || "",

            updatedAt:
                new Date().toISOString()
        };


        if (index >= 0) {

            customers[index] = customer;

        } else {

            customers.push(customer);
        }


        setStorage(
            STORAGE_KEYS.customers,
            customers
        );
    }


    renderHistory();

    alert("تم حفظ العملية بنجاح.");
}


/* =========================================================
   12. عرض السجل
   ========================================================= */

function renderHistory() {

    const list =
        $("historyList");

    const operations =
        getStorage(
            STORAGE_KEYS.operations,
            []
        );


    const search =
        $("historySearch").value
            .trim()
            .toLowerCase();


    const filtered =
        operations.filter(operation => {

            if (!search) {
                return true;
            }

            return (
                String(operation.customerId || "")
                    .toLowerCase()
                    .includes(search)
                ||
                String(operation.customerName || "")
                    .toLowerCase()
                    .includes(search)
            );
        });


    if (!filtered.length) {

        list.innerHTML = `
            <div class="history-empty">
                لا توجد عمليات محفوظة.
            </div>
        `;

        return;
    }


    list.innerHTML = "";


    filtered.forEach(operation => {

        const item =
            document.createElement("div");

        item.className =
            "history-item";


        const date =
            new Date(
                operation.savedAt ||
                operation.createdAt
            );


        item.innerHTML = `

            <div class="history-top">

                <div>
                    <div class="history-name">
                        ${escapeHtml(
                            operation.customerName ||
                            "بدون اسم"
                        )}
                    </div>

                    <div class="history-id">
                        ID:
                        ${escapeHtml(
                            operation.customerId ||
                            "-"
                        )}
                    </div>
                </div>

                <div class="history-date">
                    ${date.toLocaleString("ar-JO")}
                </div>

            </div>


            <div class="history-data">

                <div>
                    <span>من</span>
                    <strong>
                        VIP ${operation.currentLevel}
                    </strong>
                </div>

                <div>
                    <span>إلى</span>
                    <strong>
                        VIP ${operation.targetLevel}
                    </strong>
                </div>

                <div>
                    <span>العرض</span>
                    <strong>
                        ×${operation.multiplier}
                    </strong>
                </div>

                <div>
                    <span>دعم العميل</span>
                    <strong>
                        ${formatCoins(operation.customerCoins)}
                    </strong>
                </div>

                <div>
                    <span>الشحن</span>
                    <strong>
                        ${formatMillions(operation.totalCoins)}M
                    </strong>
                </div>

                <div>
                    <span>الدينار</span>
                    <strong>
                        ${formatNumber(operation.customerJod, 2)} د.أ
                    </strong>
                </div>

                <div>
                    <span>الدولار</span>
                    <strong>
                        $${formatNumber(operation.customerUsd, 2)}
                    </strong>
                </div>

                <div>
                    <span>التثبيت</span>
                    <strong>
                        ${
                            operation.includeMaintenance
                                ? "مع تثبيت"
                                : "بدون تثبيت"
                        }
                    </strong>
                </div>

            </div>
        `;


        list.appendChild(item);
    });
}


/* =========================================================
   13. منع HTML في بيانات المستخدم
   ========================================================= */

function escapeHtml(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================================================
   14. نسخ النتيجة
   ========================================================= */

async function copyResult() {

    const result =
        window.lastCalculation;


    if (!result) {

        alert("لا توجد نتيجة لنسخها.");

        return;
    }


    const text = `
مجلس القمة للشحن

ID العميل: ${result.customerId || "-"}
اسم العميل: ${result.customerName || "-"}

المستوى الحالي: VIP ${result.currentLevel}
المستوى المطلوب: VIP ${result.targetLevel}

العرض: ×${result.multiplier}

الوصول بدون تثبيت:
${formatMillions(result.withoutMaintenance)} مليون

التثبيت:
${formatMillions(result.maintenance)} مليون

الإجمالي:
${formatMillions(result.totalCoins)} مليون

دعم العميل المطلوب:
${formatCoins(result.customerCoins)} كوينز

القيمة بالدينار:
${formatNumber(result.customerJod, 2)} د.أ

القيمة بالدولار:
$${formatNumber(result.customerUsd, 2)}

F90 أف تسعين للخدمات الرقمية
Instagram: f90.xd
`;


    try {

        await navigator.clipboard.writeText(text);

        alert("تم نسخ النتيجة.");

    } catch (error) {

        /*
            بديل للمتصفحات التي تمنع clipboard.
        */

        const textarea =
            document.createElement("textarea");

        textarea.value = text;

        document.body.appendChild(textarea);

        textarea.select();

        document.execCommand("copy");

        textarea.remove();

        alert("تم نسخ النتيجة.");
    }
}


/* =========================================================
   15. مسح النتيجة
   ========================================================= */

function clearResult() {

    window.lastCalculation = null;

    $("resultContent")
        .classList
        .add("hidden");

    $("resultEmpty")
        .classList
        .remove("hidden");
}


/* =========================================================
   16. حذف السجل
   ========================================================= */

function clearHistory() {

    const operations =
        getStorage(
            STORAGE_KEYS.operations,
            []
        );


    if (!operations.length) {

        alert("السجل فارغ.");

        return;
    }


    const confirmed =
        confirm(
            "هل أنت متأكد من حذف جميع العمليات المحفوظة؟"
        );


    if (!confirmed) {
        return;
    }


    localStorage.removeItem(
        STORAGE_KEYS.operations
    );


    renderHistory();
}


/* =========================================================
   17. أحداث الصفحة
   ========================================================= */

function setupEvents() {

    $("calculateBtn")
        .addEventListener(
            "click",
            calculate
        );


    $("saveCustomerBtn")
        .addEventListener(
            "click",
            saveCustomer
        );


    $("loadCustomerBtn")
        .addEventListener(
            "click",
            loadCustomer
        );


    $("includeMaintenance")
        .addEventListener(
            "change",
            toggleMaintenanceField
        );


    $("saveOperationBtn")
        .addEventListener(
            "click",
            saveOperation
        );


    $("copyResultBtn")
        .addEventListener(
            "click",
            copyResult
        );


    $("clearResultBtn")
        .addEventListener(
            "click",
            clearResult
        );


    $("clearHistoryBtn")
        .addEventListener(
            "click",
            clearHistory
        );


    $("historySearch")
        .addEventListener(
            "input",
            renderHistory
        );


    /*
        حفظ إعدادات الأسعار عند تغييرها.
    */

    [
        "coinsPerMillion",
        "jodPerMillion",
        "usdPerMillion"
    ].forEach(id => {

        $(id).addEventListener(
            "change",
            saveSettings
        );

    });
}


/* =========================================================
   18. تشغيل التطبيق
   ========================================================= */

function init() {

    populateVipSelects();

    renderVipTable();

    loadSettings();

    renderHistory();

    setupEvents();

    toggleMaintenanceField();

    $("currentYear").textContent =
        new Date().getFullYear();
}


document.addEventListener(
    "DOMContentLoaded",
    init
);
