/* =========================================================
   مجلس القمة للشحن
   حاسبة VIP
   ========================================================= */


/* =========================================================
   بيانات VIP الأساسية
   =========================================================

   required:
   نقاط الخبرة المطلوبة للانتقال إلى هذا المستوى.

   maintain:
   نقاط الخبرة المطلوبة لتثبيت هذا المستوى.
   ========================================================= */

const DEFAULT_VIP = {

    1:  { required: 50000,      maintain: 30000 },
    2:  { required: 50000,      maintain: 30000 },
    3:  { required: 100000,     maintain: 90000 },
    4:  { required: 800000,     maintain: 500000 },
    5:  { required: 2000000,    maintain: 1300000 },
    6:  { required: 4000000,    maintain: 2600000 },
    7:  { required: 7000000,    maintain: 4500000 },
    8:  { required: 12000000,   maintain: 7800000 },
    9:  { required: 16000000,   maintain: 11000000 },
    10: { required: 20000000,   maintain: 14000000 },
    11: { required: 40000000,   maintain: 28000000 },
    12: { required: 118000000,  maintain: 83000000 },
    13: { required: 210000000,  maintain: 150000000 },
    14: { required: 390000000,  maintain: 310000000 },
    15: { required: 1000000000, maintain: 700000000 },
    16: { required: 2000000000, maintain: 1400000000 },
    17: { required: 3500000000, maintain: 3000000000 },
    18: { required: 4500000000, maintain: 4000000000 },
    19: { required: 5500000000, maintain: 5000000000 },
    20: { required: 10000000000, maintain: 9000000000 }

};


/* =========================================================
   تحميل قيم VIP المعدلة
   ========================================================= */

let vipData = loadVIPData();


function loadVIPData() {

    try {

        const saved =
            localStorage.getItem("summit_vip_values");

        if (saved) {

            const parsed = JSON.parse(saved);

            return {
                ...DEFAULT_VIP,
                ...parsed
            };
        }

    } catch (error) {

        console.error(error);

    }

    return JSON.parse(
        JSON.stringify(DEFAULT_VIP)
    );
}


/* =========================================================
   حفظ VIP
   ========================================================= */

function saveVIPData() {

    localStorage.setItem(
        "summit_vip_values",
        JSON.stringify(vipData)
    );
}


/* =========================================================
   الأرقام
   ========================================================= */

function number(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return 0;
    }

    return Number(
        String(value)
            .replace(/,/g, "")
            .replace(/[^\d.-]/g, "")
    ) || 0;
}


function format(value, decimals = 0) {

    return number(value).toLocaleString(
        "en-US",
        {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }
    );
}


/* =========================================================
   إنشاء قوائم VIP
   ========================================================= */

function createVipLists() {

    const current =
        document.getElementById("currentVip");

    const target =
        document.getElementById("targetVip");


    current.innerHTML = "";

    target.innerHTML = "";


    for (let i = 1; i <= 20; i++) {

        current.innerHTML += `
            <option value="${i}">
                VIP ${i}
            </option>
        `;

        target.innerHTML += `
            <option value="${i}">
                VIP ${i}
            </option>
        `;
    }


    current.value = "1";
    target.value = "2";
}


/* =========================================================
   جدول VIP السفلي
   ========================================================= */

function renderVipTable() {

    const table =
        document.getElementById("vipTable");

    table.innerHTML = "";


    for (let i = 1; i <= 20; i++) {

        const item = vipData[i];

        const total =
            calculateVipTotal(i);


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                <strong>VIP ${i}</strong>
            </td>

            <td>
                ${format(total)}
            </td>

            <td>
                ${format(item.required)}
            </td>

            <td>
                ${format(item.maintain)}
            </td>

        `;


        table.appendChild(row);
    }
}


/* =========================================================
   إجمالي الشحن للوصول من VIP 1
   ========================================================= */

function calculateVipTotal(level) {

    let total = 0;

    for (let i = 1; i <= level; i++) {

        total += number(
            vipData[i]?.required
        );
    }

    return total;
}


/* =========================================================
   محرر قيم VIP
   ========================================================= */

function renderVipEditor() {

    const container =
        document.getElementById("editVip");

    container.innerHTML = "";


    for (let i = 1; i <= 20; i++) {

        const item = vipData[i];


        const row =
            document.createElement("div");

        row.className = "edit-row";


        row.innerHTML = `

            <div class="level">
                VIP ${i}
            </div>

            <input
                type="number"
                min="0"
                data-required="${i}"
                value="${item.required}"
                title="قيمة الترقية">

            <input
                type="number"
                min="0"
                data-maintain="${i}"
                value="${item.maintain}"
                title="قيمة التثبيت">

        `;


        container.appendChild(row);
    }


    container
        .querySelectorAll("input")
        .forEach(input => {

            input.addEventListener(
                "input",
                function () {

                    if (this.dataset.required) {

                        const level =
                            this.dataset.required;

                        vipData[level].required =
                            number(this.value);
                    }


                    if (this.dataset.maintain) {

                        const level =
                            this.dataset.maintain;

                        vipData[level].maintain =
                            number(this.value);
                    }


                    saveVIPData();

                    renderVipTable();

                    calculate();

                }
            );

        });
}


/* =========================================================
   الحسبة الأساسية
   =========================================================

   مثال:

   الحالي 10
   الهدف 13
   الناقص الحالي 36M

   10 → 11 = 36M
   11 → 12 = 118M
   12 → 13 = 210M

   المجموع = 364M

   إذا ×5:

   364M ÷ 5 = 72.8M شحن فعلي

   إذا التثبيت مفعل:

   + تثبيت VIP 13
   ========================================================= */

function calculate() {

    const current =
        number(
            document.getElementById(
                "currentVip"
            ).value
        );

    const target =
        number(
            document.getElementById(
                "targetVip"
            ).value
        );

    const currentMissing =
        number(
            document.getElementById(
                "currentMissing"
            ).value
        );

    const multiplier =
        number(
            document.getElementById(
                "multiplier"
            ).value
        ) || 1;

    const supportPerMillion =
        number(
            document.getElementById(
                "supportPerMillion"
            ).value
        );

    const jodPrice =
        number(
            document.getElementById(
                "jodPrice"
            ).value
        );

    const usdPrice =
        number(
            document.getElementById(
                "usdPrice"
            ).value
        );

    const maintain =
        document.getElementById(
            "maintain"
        ).checked;


    /* -----------------------------------------
       إذا الهدف نفس المستوى
       ----------------------------------------- */

    if (target < current) {

        alert(
            "مستوى الهدف يجب أن يكون أعلى أو مساويًا للمستوى الحالي."
        );

        return;
    }


    /* -----------------------------------------
       الوصول بدون تثبيت
       ----------------------------------------- */

    let withoutMaintain = 0;


    /*
       إذا كان هناك انتقال:

       نستخدم القيمة التي أدخلها المستخدم
       لأول انتقال فقط.
    */

    if (target > current) {

        withoutMaintain =
            currentMissing;


        /*
           باقي المستويات تحسب تلقائيًا
           من جدول VIP.
        */

        for (
            let level = current + 2;
            level <= target;
            level++
        ) {

            withoutMaintain +=
                number(
                    vipData[level]?.required
                );
        }

    }


    /* -----------------------------------------
       قيمة التثبيت
       ----------------------------------------- */

    let maintainAmount = 0;


    if (maintain) {

        maintainAmount =
            number(
                vipData[target]?.maintain
            );
    }


    /* -----------------------------------------
       الإجمالي النهائي لنقاط VIP
       ----------------------------------------- */

    const total =
        withoutMaintain +
        maintainAmount;


    /* -----------------------------------------
       الشحن الفعلي
       -----------------------------------------

       النقاط المطلوبة ÷ العرض

       مثال:

       108M ÷ 5
       = 21.6M
       ----------------------------------------- */

    const chargeWithout =
        withoutMaintain /
        multiplier;


    const chargeWith =
        total /
        multiplier;


    /* -----------------------------------------
       الدعم المطلوب
       -----------------------------------------

       كل مليون شحن له قيمة دعم
       قابلة للتعديل.
       ----------------------------------------- */

    const supportWithout =
        (chargeWithout / 1000000) *
        supportPerMillion;


    const supportWith =
        (chargeWith / 1000000) *
        supportPerMillion;


    /* -----------------------------------------
       الدينار

       130,000 دعم = 11 دينار افتراضيًا

       إذا غيرت 130,000:
       الحسبة تتغير تلقائيًا.
       ----------------------------------------- */

    const jodWithout =
        supportPerMillion > 0
            ? (supportWithout / supportPerMillion) *
              jodPrice
            : 0;


    const jodWith =
        supportPerMillion > 0
            ? (supportWith / supportPerMillion) *
              jodPrice
            : 0;


    /* -----------------------------------------
       الدولار
       ----------------------------------------- */

    const usdWithout =
        supportPerMillion > 0
            ? (supportWithout / supportPerMillion) *
              usdPrice
            : 0;


    const usdWith =
        supportPerMillion > 0
            ? (supportWith / supportPerMillion) *
              usdPrice
            : 0;


    /* -----------------------------------------
       الإجمالي الكامل

       المقصود هنا القيمة النقدية
       بالدينار + الدولار بشكل منفصل.

       لا نجمع الدينار والدولار مع بعض
       لأنهما عملتان مختلفتان.
       ----------------------------------------- */

    const fullTotal =
        jodWith;


    /* -----------------------------------------
       عرض النتائج
       ----------------------------------------- */

    setText(
        "resultWithout",
        format(withoutMaintain)
    );

    setText(
        "resultMaintain",
        format(maintainAmount)
    );

    setText(
        "resultTotal",
        format(total)
    );

    setText(
        "chargeWithout",
        format(chargeWithout)
    );

    setText(
        "chargeWith",
        format(chargeWith)
    );

    setText(
        "supportWithout",
        format(supportWithout)
    );

    setText(
        "supportWith",
        format(supportWith)
    );

    setText(
        "jodWithout",
        format(jodWithout, 2)
    );

    setText(
        "usdWithout",
        format(usdWithout, 2)
    );

    setText(
        "jodWith",
        format(jodWith, 2)
    );

    setText(
        "usdWith",
        format(usdWith, 2)
    );

    setText(
        "fullTotal",
        format(fullTotal, 2)
    );


    renderSteps(
        current,
        target,
        currentMissing,
        maintain
    );
}


/* =========================================================
   تفاصيل المستويات
   ========================================================= */

function renderSteps(
    current,
    target,
    currentMissing,
    maintain
) {

    const container =
        document.getElementById(
            "steps"
        );

    container.innerHTML = "";


    if (target <= current) {

        container.innerHTML = `
            <div class="step">
                <span>لا يوجد انتقال لمستوى آخر</span>
                <strong>0</strong>
            </div>
        `;

        return;
    }


    /* أول انتقال */

    let row =
        document.createElement("div");

    row.className = "step";

    row.innerHTML = `

        <span>
            VIP ${current}
            →
            VIP ${current + 1}
        </span>

        <strong>
            ${format(currentMissing)}
        </strong>

    `;

    container.appendChild(row);


    /* باقي الانتقالات */

    for (
        let level = current + 2;
        level <= target;
        level++
    ) {

        const amount =
            number(
                vipData[level]?.required
            );


        row =
            document.createElement("div");

        row.className = "step";

        row.innerHTML = `

            <span>
                VIP ${level - 1}
                →
                VIP ${level}
            </span>

            <strong>
                ${format(amount)}
            </strong>

        `;

        container.appendChild(row);
    }


    /* التثبيت */

    if (maintain) {

        const maintainAmount =
            number(
                vipData[target]?.maintain
            );


        row =
            document.createElement("div");

        row.className = "step";

        row.innerHTML = `

            <span>
                تثبيت VIP ${target}
            </span>

            <strong>
                + ${format(maintainAmount)}
            </strong>

        `;

        container.appendChild(row);
    }
}


/* =========================================================
   وضع النص
   ========================================================= */

function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
}


/* =========================================================
   سجل العملاء
   ========================================================= */

function getHistory() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "summit_clients"
            )
        ) || [];

    } catch {

        return [];
    }
}


function saveHistory(data) {

    localStorage.setItem(
        "summit_clients",
        JSON.stringify(data)
    );
}


/* =========================================================
   حفظ العميل الحالي
   ========================================================= */

function saveClient() {

    const name =
        document.getElementById(
            "clientName"
        ).value.trim();

    const id =
        document.getElementById(
            "clientId"
        ).value.trim();


    if (!id) {

        alert(
            "أدخل ID الحساب الأساسي للعميل أولاً."
        );

        return;
    }


    const record = {

        id: id,

        name:
            name || "بدون اسم",

        currentVip:
            number(
                document.getElementById(
                    "currentVip"
                ).value
            ),

        targetVip:
            number(
                document.getElementById(
                    "targetVip"
                ).value
            ),

        currentMissing:
            number(
                document.getElementById(
                    "currentMissing"
                ).value
            ),

        multiplier:
            number(
                document.getElementById(
                    "multiplier"
                ).value
            ),

        maintain:
            document.getElementById(
                "maintain"
            ).checked,

        savedAt:
            new Date().toLocaleString(
                "ar-EG"
            )

    };


    const history =
        getHistory();


    /*
       إذا كان نفس ID موجودًا،
       يتم تحديث بياناته بدل إنشاء
       نسخة مكررة.
    */

    const existing =
        history.findIndex(
            item => item.id === id
        );


    if (existing !== -1) {

        history[existing] = {
            ...history[existing],
            ...record
        };

    } else {

        history.unshift(record);
    }


    saveHistory(history);

    renderHistory();

    alert(
        "تم حفظ بيانات العميل."
    );
}


/* =========================================================
   عرض سجل العملاء
   ========================================================= */

function renderHistory() {

    const container =
        document.getElementById(
            "clientHistory"
        );

    const history =
        getHistory();


    container.innerHTML = "";


    if (!history.length) {

        container.innerHTML = `
            <div class="history-empty">
                لا يوجد عملاء محفوظون حتى الآن.
            </div>
        `;

        return;
    }


    history.forEach(
        (item, index) => {

            const div =
                document.createElement("div");

            div.className =
                "history-item";


            div.innerHTML = `

                <div class="history-item-top">

                    <div>
                        <strong>
                            ${escapeHtml(item.name)}
                        </strong>

                        <div>
                            ID:
                            ${escapeHtml(item.id)}
                        </div>
                    </div>

                    <small>
                        ${item.savedAt}
                    </small>

                </div>

                <div>
                    VIP ${item.currentVip}
                    →
                    VIP ${item.targetVip}
                    |
                    ×${item.multiplier}
                    |
                    ناقص:
                    ${format(item.currentMissing)}
                </div>

                <button
                    style="
                        margin-top:10px;
                        padding:8px 12px;
                        border:1px solid rgba(255,255,255,.1);
                        border-radius:8px;
                        background:#0b0e14;
                        color:#fff;
                        cursor:pointer;
                    "
                    onclick="loadClient(${index})">

                    تحميل بيانات العميل

                </button>

            `;


            container.appendChild(div);
        }
    );
}


/* =========================================================
   تحميل عميل
   ========================================================= */

function loadClient(index) {

    const history =
        getHistory();

    const item =
        history[index];

    if (!item) return;


    document.getElementById(
        "clientName"
    ).value = item.name;


    document.getElementById(
        "clientId"
    ).value = item.id;


    document.getElementById(
        "currentVip"
    ).value = item.currentVip;


    document.getElementById(
        "targetVip"
    ).value = item.targetVip;


    document.getElementById(
        "currentMissing"
    ).value = item.currentMissing;


    document.getElementById(
        "multiplier"
    ).value = item.multiplier;


    document.getElementById(
        "maintain"
    ).checked = item.maintain;


    calculate();


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================================
   مسح سجل العملاء
   ========================================================= */

function clearHistory() {

    const answer =
        confirm(
            "هل تريد حذف جميع العملاء المحفوظين؟"
        );

    if (!answer) return;


    localStorage.removeItem(
        "summit_clients"
    );

    renderHistory();
}


/* =========================================================
   حماية عرض اسم العميل وID
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
   الأحداث
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        createVipLists();

        renderVipTable();

        renderVipEditor();

        renderHistory();


        /* زر الحساب */

        document.getElementById(
            "calculateBtn"
        ).addEventListener(
            "click",
            calculate
        );


        /* الحسبة تلقائيًا */

        const fields = [

            "currentVip",
            "targetVip",
            "currentMissing",
            "multiplier",
            "supportPerMillion",
            "jodPrice",
            "usdPrice",
            "maintain"

        ];


        fields.forEach(id => {

            const element =
                document.getElementById(id);

            element.addEventListener(
                "input",
                calculate
            );

            element.addEventListener(
                "change",
                calculate
            );

        });


        /* حفظ العميل */

        document.getElementById(
            "saveClient"
        ).addEventListener(
            "click",
            saveClient
        );


        /* مسح السجل */

        document.getElementById(
            "clearHistory"
        ).addEventListener(
            "click",
            clearHistory
        );


        /* أول حسبة */

        calculate();

    }
);
