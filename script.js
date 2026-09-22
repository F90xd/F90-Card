/* =========================================================
   مجلس القمة للشحن
   VIP Calculator - F90
   ========================================================= */

/* =========================
   جدول VIP
   required = XP المطلوبة للانتقال من المستوى السابق
   maintain = XP المطلوبة لتثبيت المستوى
   ========================= */

const VIP_LEVELS = {
    1: {
        required: 50000,
        maintain: 30000
    },
    2: {
        required: 50000,
        maintain: 30000
    },
    3: {
        required: 100000,
        maintain: 90000
    },
    4: {
        required: 800000,
        maintain: 500000
    },
    5: {
        required: 2000000,
        maintain: 1300000
    },
    6: {
        required: 4000000,
        maintain: 2600000
    },
    7: {
        required: 7000000,
        maintain: 4500000
    },
    8: {
        required: 12000000,
        maintain: 7800000
    },
    9: {
        required: 16000000,
        maintain: 11000000
    },
    10: {
        required: 20000000,
        maintain: 14000000
    },
    11: {
        required: 40000000,
        maintain: 28000000
    },
    12: {
        required: 118000000,
        maintain: 83000000
    },
    13: {
        required: 210000000,
        maintain: 150000000
    },
    14: {
        required: 390000000,
        maintain: 310000000
    },
    15: {
        required: 1000000000,
        maintain: 700000000
    },
    16: {
        required: 2000000000,
        maintain: 1400000000
    },
    17: {
        required: 3500000000,
        maintain: 3000000000
    },
    18: {
        required: 4500000000,
        maintain: 4000000000
    },
    19: {
        required: 5500000000,
        maintain: 5000000000
    },
    20: {
        required: 10000000000,
        maintain: 9000000000
    }
};


/* =========================
   أدوات الأرقام
   ========================= */

function toNumber(value) {
    if (value === null || value === undefined || value === "") {
        return 0;
    }

    if (typeof value === "number") {
        return Number.isFinite(value) ? value : 0;
    }

    return Number(
        String(value)
            .replace(/,/g, "")
            .replace(/\s/g, "")
            .replace(/[^\d.-]/g, "")
    ) || 0;
}


function formatNumber(value, decimals = 0) {
    const number = toNumber(value);

    return number.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}


/* =========================
   حساب قيمة الانتقال
   =========================

   مهم:

   المستخدم قد يكون داخل المستوى الحالي،
   لذلك أول انتقال لا نأخذه من جدول VIP.

   مثال:

   VIP الحالي = 10
   الناقص للوصول إلى 11 = 36,000,000
   الهدف = 13

   الحساب:

   10 → 11 = 36M   ← القيمة التي أدخلتها أنت
   11 → 12 = 118M  ← تلقائي
   12 → 13 = 210M  ← تلقائي

   الإجمالي = 364M
   ========================= */

function calculateProgression(
    currentLevel,
    targetLevel,
    currentMissing
) {
    currentLevel = Math.floor(toNumber(currentLevel));
    targetLevel = Math.floor(toNumber(targetLevel));
    currentMissing = toNumber(currentMissing);

    if (currentLevel < 1) currentLevel = 1;
    if (targetLevel > 20) targetLevel = 20;

    if (targetLevel <= currentLevel) {
        return {
            totalWithoutMaintain: 0,
            levels: []
        };
    }

    const levels = [];

    /* أول مستوى:
       نستخدم النقص الذي أدخله المستخدم */
    levels.push({
        from: currentLevel,
        to: currentLevel + 1,
        amount: currentMissing
    });

    let total = currentMissing;

    /* باقي المستويات:
       تؤخذ تلقائياً من جدول VIP */
    for (
        let level = currentLevel + 2;
        level <= targetLevel;
        level++
    ) {
        const data = VIP_LEVELS[level];

        if (!data) continue;

        total += data.required;

        levels.push({
            from: level - 1,
            to: level,
            amount: data.required
        });
    }

    return {
        totalWithoutMaintain: total,
        levels
    };
}


/* =========================
   حساب التثبيت
   =========================

   إذا أراد المستخدم الوصول إلى المستوى
   وتثبيته، نضيف قيمة maintain الخاصة
   بالمستوى الهدف.

   مثال:

   الوصول إلى VIP 11 = 80M
   تثبيت VIP 11 = 28M

   الإجمالي = 108M
   ========================= */

function calculateMaintain(targetLevel) {
    targetLevel = Math.floor(toNumber(targetLevel));

    if (!VIP_LEVELS[targetLevel]) {
        return 0;
    }

    return VIP_LEVELS[targetLevel].maintain;
}


/* =========================
   حساب الشحن الفعلي
   =========================

   إذا العرض ×5:

   المطلوب داخل نقاط VIP = 108M

   الشحن الفعلي:

   108M ÷ 5 = 21.6M
   ========================= */

function calculateActualCharge(vipPoints, multiplier) {
    vipPoints = toNumber(vipPoints);
    multiplier = toNumber(multiplier);

    if (multiplier <= 0) {
        return 0;
    }

    return vipPoints / multiplier;
}


/* =========================
   حساب الدعم
   =========================

   القيمة الافتراضية:

   كل 1,000,000 شحن
   يحتاج 130,000 دعم

   لكن القيمة قابلة للتعديل.

   مثال:

   21.6M × 130,000 / 1M
   = 2,808,000 دعم
   ========================= */

function calculateSupport(actualCharge, supportPerMillion) {
    actualCharge = toNumber(actualCharge);
    supportPerMillion = toNumber(supportPerMillion);

    return (actualCharge / 1000000) * supportPerMillion;
}


/* =========================
   تحويل الدعم إلى دينار
   ========================= */

function calculateJOD(supportAmount, supportRate) {
    supportAmount = toNumber(supportAmount);
    supportRate = toNumber(supportRate);

    if (supportRate <= 0) {
        return 0;
    }

    return (supportAmount / supportRate);
}


/* =========================
   تحويل الدعم إلى دولار
   ========================= */

function calculateUSD(supportAmount, supportRate) {
    supportAmount = toNumber(supportAmount);
    supportRate = toNumber(supportRate);

    if (supportRate <= 0) {
        return 0;
    }

    return (supportAmount / supportRate);
}


/* =========================
   الحساب الرئيسي
   ========================= */

function calculateVIP() {

    const currentLevel = toNumber(
        document.getElementById("currentLevel")?.value
    );

    const targetLevel = toNumber(
        document.getElementById("targetLevel")?.value
    );

    const currentMissing = toNumber(
        document.getElementById("currentMissing")?.value
    );

    const multiplier = toNumber(
        document.getElementById("vipMultiplier")?.value
    );

    const supportPerMillion = toNumber(
        document.getElementById("supportPerMillion")?.value
    );

    const jodPerSupport = toNumber(
        document.getElementById("jodRate")?.value
    );

    const usdPerSupport = toNumber(
        document.getElementById("usdRate")?.value
    );

    const maintainEnabled =
        document.getElementById("maintainLevel")?.checked || false;


    /* -------------------------
       التحقق
       ------------------------- */

    if (!currentLevel || currentLevel < 1) {
        showMessage("أدخل مستوى VIP الحالي");
        return;
    }

    if (!targetLevel || targetLevel < currentLevel) {
        showMessage("اختر مستوى الهدف بشكل صحيح");
        return;
    }

    if (targetLevel > 20) {
        showMessage("المستوى الأعلى المتاح هو VIP 20");
        return;
    }

    if (targetLevel > currentLevel && currentMissing <= 0) {
        showMessage("أدخل قيمة النقص الحالية للوصول للمستوى التالي");
        return;
    }

    if (multiplier <= 0) {
        showMessage("أدخل عرض VIP صحيح مثل ×5");
        return;
    }


    /* -------------------------
       حساب الوصول بدون تثبيت
       ------------------------- */

    const progression = calculateProgression(
        currentLevel,
        targetLevel,
        currentMissing
    );

    const withoutMaintain =
        progression.totalWithoutMaintain;


    /* -------------------------
       حساب التثبيت
       ------------------------- */

    let maintainAmount = 0;

    if (maintainEnabled) {
        maintainAmount = calculateMaintain(targetLevel);
    }


    /* -------------------------
       الإجمالي مع التثبيت
       ------------------------- */

    const totalVIPPoints =
        withoutMaintain + maintainAmount;


    /* -------------------------
       الشحن الفعلي بدون تثبيت
       ------------------------- */

    const actualChargeWithoutMaintain =
        calculateActualCharge(
            withoutMaintain,
            multiplier
        );


    /* -------------------------
       الشحن الفعلي مع التثبيت
       ------------------------- */

    const actualChargeWithMaintain =
        calculateActualCharge(
            totalVIPPoints,
            multiplier
        );


    /* -------------------------
       الدعم بدون تثبيت
       ------------------------- */

    const supportWithoutMaintain =
        calculateSupport(
            actualChargeWithoutMaintain,
            supportPerMillion
        );


    /* -------------------------
       الدعم مع التثبيت
       ------------------------- */

    const supportWithMaintain =
        calculateSupport(
            actualChargeWithMaintain,
            supportPerMillion
        );


    /* -------------------------
       الفرق الناتج عن التثبيت
       ------------------------- */

    const maintainActualCharge =
        actualChargeWithMaintain -
        actualChargeWithoutMaintain;

    const maintainSupport =
        supportWithMaintain -
        supportWithoutMaintain;


    /* -------------------------
       الدينار والدولار
       ------------------------- */

    const jodWithoutMaintain =
        jodPerSupport > 0
            ? calculateJOD(
                supportWithoutMaintain,
                jodPerSupport
            )
            : 0;

    const usdWithoutMaintain =
        usdPerSupport > 0
            ? calculateUSD(
                supportWithoutMaintain,
                usdPerSupport
            )
            : 0;


    const jodWithMaintain =
        jodPerSupport > 0
            ? calculateJOD(
                supportWithMaintain,
                jodPerSupport
            )
            : 0;

    const usdWithMaintain =
        usdPerSupport > 0
            ? calculateUSD(
                supportWithMaintain,
                usdPerSupport
            )
            : 0;


    /* -------------------------
       إخراج النتائج
       ------------------------- */

    setValue(
        "resultWithoutMaintain",
        formatNumber(withoutMaintain)
    );

    setValue(
        "resultMaintain",
        formatNumber(maintainAmount)
    );

    setValue(
        "resultTotal",
        formatNumber(totalVIPPoints)
    );

    setValue(
        "chargeWithoutMaintain",
        formatNumber(actualChargeWithoutMaintain)
    );

    setValue(
        "chargeWithMaintain",
        formatNumber(actualChargeWithMaintain)
    );

    setValue(
        "supportWithoutMaintain",
        formatNumber(supportWithoutMaintain)
    );

    setValue(
        "supportWithMaintain",
        formatNumber(supportWithMaintain)
    );

    setValue(
        "maintainSupport",
        formatNumber(maintainSupport)
    );

    setValue(
        "maintainActualCharge",
        formatNumber(maintainActualCharge)
    );

    setValue(
        "jodWithoutMaintain",
        formatNumber(jodWithoutMaintain, 2)
    );

    setValue(
        "usdWithoutMaintain",
        formatNumber(usdWithoutMaintain, 2)
    );

    setValue(
        "jodWithMaintain",
        formatNumber(jodWithMaintain, 2)
    );

    setValue(
        "usdWithMaintain",
        formatNumber(usdWithMaintain, 2)
    );


    /* -------------------------
       تفاصيل المراحل
       ------------------------- */

    renderProgression(progression.levels);


    /* -------------------------
       عرض VIP الهدف
       ------------------------- */

    setValue(
        "resultTargetLevel",
        `VIP ${targetLevel}`
    );


    /* -------------------------
       حفظ آخر عملية
       ------------------------- */

    saveCurrentCalculation({
        currentLevel,
        targetLevel,
        currentMissing,
        multiplier,
        supportPerMillion,
        maintainEnabled,
        withoutMaintain,
        maintainAmount,
        totalVIPPoints,
        actualChargeWithoutMaintain,
        actualChargeWithMaintain,
        supportWithoutMaintain,
        supportWithMaintain,
        jodWithoutMaintain,
        usdWithoutMaintain,
        jodWithMaintain,
        usdWithMaintain,
        date: new Date().toISOString()
    });
}


/* =========================
   وضع النتائج داخل الصفحة
   ========================= */

function setValue(id, value) {

    const element = document.getElementById(id);

    if (!element) return;

    if (
        element.tagName === "INPUT" ||
        element.tagName === "TEXTAREA"
    ) {
        element.value = value;
    } else {
        element.textContent = value;
    }
}


/* =========================
   تفاصيل الانتقال
   ========================= */

function renderProgression(levels) {

    const container =
        document.getElementById("progressionDetails");

    if (!container) return;

    container.innerHTML = "";

    levels.forEach(item => {

        const row = document.createElement("div");

        row.className = "progression-row";

        row.innerHTML = `
            <span>VIP ${item.from} → VIP ${item.to}</span>
            <strong>${formatNumber(item.amount)}</strong>
        `;

        container.appendChild(row);
    });
}


/* =========================
   الرسائل
   ========================= */

function showMessage(message) {

    const element =
        document.getElementById("message");

    if (element) {
        element.textContent = message;
        element.classList.add("show");

        setTimeout(() => {
            element.classList.remove("show");
        }, 3000);

        return;
    }

    alert(message);
}


/* =========================
   حفظ آخر عملية
   ========================= */

function saveCurrentCalculation(data) {

    try {

        localStorage.setItem(
            "lastVIPCalculation",
            JSON.stringify(data)
        );

    } catch (error) {

        console.error(
            "تعذر حفظ العملية:",
            error
        );

    }
}


/* =========================
   استرجاع آخر عملية
   ========================= */

function loadLastCalculation() {

    try {

        const saved =
            localStorage.getItem(
                "lastVIPCalculation"
            );

        if (!saved) return;

        const data = JSON.parse(saved);

        setValue(
            "currentLevel",
            data.currentLevel
        );

        setValue(
            "targetLevel",
            data.targetLevel
        );

        setValue(
            "currentMissing",
            data.currentMissing
        );

        setValue(
            "vipMultiplier",
            data.multiplier
        );

        setValue(
            "supportPerMillion",
            data.supportPerMillion
        );

    } catch (error) {

        console.error(
            "تعذر استرجاع العملية:",
            error
        );

    }
}


/* =========================
   إنشاء قائمة VIP تلقائياً
   من 1 إلى 20
   ========================= */

function populateVIPSelects() {

    const current =
        document.getElementById("currentLevel");

    const target =
        document.getElementById("targetLevel");

    if (current) {

        current.innerHTML =
            '<option value="">اختر VIP الحالي</option>';

        for (let i = 1; i <= 20; i++) {

            current.innerHTML += `
                <option value="${i}">
                    VIP ${i}
                </option>
            `;
        }
    }


    if (target) {

        target.innerHTML =
            '<option value="">اختر VIP الهدف</option>';

        for (let i = 1; i <= 20; i++) {

            target.innerHTML += `
                <option value="${i}">
                    VIP ${i}
                </option>
            `;
        }
    }
}


/* =========================
   عروض ×1 إلى ×10
   ========================= */

function populateMultipliers() {

    const select =
        document.getElementById("vipMultiplier");

    if (!select) return;

    select.innerHTML =
        '<option value="">اختر العرض</option>';

    for (let i = 1; i <= 10; i++) {

        select.innerHTML += `
            <option value="${i}">
                ×${i}
            </option>
        `;
    }
}


/* =========================
   عند تغيير VIP الحالي
   ========================= */

function updateTargetLevels() {

    const current =
        toNumber(
            document.getElementById("currentLevel")?.value
        );

    const target =
        document.getElementById("targetLevel");

    if (!target || !current) return;

    [...target.options].forEach(option => {

        if (!option.value) return;

        const level =
            Number(option.value);

        option.disabled =
            level <= current;

    });

    if (
        target.value &&
        Number(target.value) <= current
    ) {
        target.value = "";
    }
}


/* =========================
   عند تشغيل الصفحة
   ========================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        populateVIPSelects();

        populateMultipliers();

        loadLastCalculation();


        const current =
            document.getElementById("currentLevel");

        if (current) {

            current.addEventListener(
                "change",
                updateTargetLevels
            );
        }


        const calculateButton =
            document.getElementById("calculateBtn");

        if (calculateButton) {

            calculateButton.addEventListener(
                "click",
                calculateVIP
            );
        }


        /* الحساب تلقائياً عند تغيير أي خانة */

        const fields = [
            "currentLevel",
            "targetLevel",
            "currentMissing",
            "vipMultiplier",
            "supportPerMillion",
            "jodRate",
            "usdRate",
            "maintainLevel"
        ];

        fields.forEach(id => {

            const element =
                document.getElementById(id);

            if (!element) return;

            element.addEventListener(
                "input",
                calculateVIP
            );

            element.addEventListener(
                "change",
                calculateVIP
            );
        });

    }
);
