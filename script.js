/* =========================================================
   مجلس القمة للشحن
   VIP Calculator
   جميع القيم قابلة للتعديل
   الحفظ باستخدام LocalStorage
========================================================= */


/* =========================
   جدول VIP 1 - 20
========================= */

const VIP_DATA = [
  {
    level: 1,
    total: 50000,
    upgrade: 50000,
    keep: 30000
  },
  {
    level: 2,
    total: 100000,
    upgrade: 50000,
    keep: 30000
  },
  {
    level: 3,
    total: 300000,
    upgrade: 100000,
    keep: 90000
  },
  {
    level: 4,
    total: 1000000,
    upgrade: 800000,
    keep: 500000
  },
  {
    level: 5,
    total: 3000000,
    upgrade: 2000000,
    keep: 1300000
  },
  {
    level: 6,
    total: 7000000,
    upgrade: 4000000,
    keep: 2600000
  },
  {
    level: 7,
    total: 14000000,
    upgrade: 7000000,
    keep: 4500000
  },
  {
    level: 8,
    total: 26000000,
    upgrade: 12000000,
    keep: 7800000
  },
  {
    level: 9,
    total: 42000000,
    upgrade: 16000000,
    keep: 11000000
  },
  {
    level: 10,
    total: 62000000,
    upgrade: 20000000,
    keep: 14000000
  },
  {
    level: 11,
    total: 102000000,
    upgrade: 40000000,
    keep: 28000000
  },
  {
    level: 12,
    total: 220000000,
    upgrade: 118000000,
    keep: 83000000
  },
  {
    level: 13,
    total: 430000000,
    upgrade: 210000000,
    keep: 150000000
  },
  {
    level: 14,
    total: 820000000,
    upgrade: 390000000,
    keep: 310000000
  },
  {
    level: 15,
    total: 1820000000,
    upgrade: 1000000000,
    keep: 700000000
  },
  {
    level: 16,
    total: 3820000000,
    upgrade: 2000000000,
    keep: 1400000000
  },
  {
    level: 17,
    total: 7382000000,
    upgrade: 3500000000,
    keep: 3000000000
  },
  {
    level: 18,
    total: 11882000000,
    upgrade: 4500000000,
    keep: 4000000000
  },
  {
    level: 19,
    total: 17382000000,
    upgrade: 5500000000,
    keep: 5000000000
  },
  {
    level: 20,
    total: 27382000000,
    upgrade: 10000000000,
    keep: 9000000000
  }
];


/* =========================
   Helpers
========================= */

const $ = (id) => document.getElementById(id);

function number(value) {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2
  }).format(number(value));
}

function formatMoney(value, currency) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(number(value)) + " " + currency;
}


/* =========================
   DOM
========================= */

const customerName = $("customerName");
const customerId = $("customerId");

const currentVip = $("currentVip");
const targetVip = $("targetVip");

const remainingNext = $("remainingNext");
const multiplier = $("multiplier");

const levelInputs = $("levelInputs");

const lockValue = $("lockValue");
const lockBox = $("lockBox");

const supportPerMillion = $("supportPerMillion");
const jodPerMillion = $("jodPerMillion");
const usdPerMillion = $("usdPerMillion");

const finalSupport = $("finalSupport");
const reachValue = $("reachValue");
const lockResult = $("lockResult");
const totalWithLock = $("totalWithLock");
const supportBefore = $("supportBefore");
const chargedSupport = $("chargedSupport");
const supportAfter = $("supportAfter");
const totalJod = $("totalJod");
const totalUsd = $("totalUsd");

const historyList = $("historyList");
const searchHistory = $("searchHistory");


/* =========================
   إنشاء جدول VIP
========================= */

function renderVipTable() {

  const tbody = $("vipTable");

  tbody.innerHTML = "";

  VIP_DATA.forEach(item => {

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>VIP ${item.level}</td>
      <td>${formatNumber(item.total)}</td>
      <td>${formatNumber(item.upgrade)}</td>
      <td>${formatNumber(item.keep)}</td>
    `;

    tbody.appendChild(tr);

  });
}


/* =========================
   إنشاء خانات المستويات
=========================

   مثال:
   VIP 5 -> VIP 7

   تظهر:
   VIP 5 -> 6
   VIP 6 -> 7

   أول خانة يمكن ربطها بالقيمة
   التي أدخلها المستخدم في remainingNext.

   وباقي المستويات تدخل يدوياً.
========================= */

function renderLevelInputs() {

  const current = Number(currentVip.value);
  const target = Number(targetVip.value);

  levelInputs.innerHTML = "";

  if (target <= current) {

    levelInputs.innerHTML = `
      <div class="empty-history">
        المستوى المستهدف يجب أن يكون أعلى من المستوى الحالي.
      </div>
    `;

    return;
  }


  for (let level = current; level < target; level++) {

    const next = level + 1;

    const wrapper = document.createElement("div");

    wrapper.className = "level-item";

    const isFirst = level === current;

    wrapper.innerHTML = `
      <label>
        VIP ${level} ← VIP ${next}
        ${isFirst ? "(المتبقي الفعلي)" : "(قيمة يدوية)"}
      </label>

      <input
        type="number"
        min="0"
        step="1"
        class="level-value"
        data-from="${level}"
        data-to="${next}"
        value="${isFirst ? number(remainingNext.value) : ""}"
        placeholder="أدخل القيمة"
      >
    `;

    levelInputs.appendChild(wrapper);
  }


  calculate();
}


/* =========================
   قراءة قيم المستويات
========================= */

function getLevelValues() {

  const inputs = document.querySelectorAll(".level-value");

  let total = 0;

  inputs.forEach(input => {

    total += number(input.value);

  });

  return total;
}


/* =========================
   الحساب الرئيسي
=========================

   مهم:

   الموقع لا يجمع إجمالي الشحن من جدول VIP.

   الموقع يستخدم فقط القيم التي تدخلها
   أنت للعميل.

   الوصول:
   مجموع المتبقي الفعلي + القيم اليدوية
   للمستويات التالية.

   التثبيت:
   يضاف فقط عند اختيار "مع تثبيت".
========================= */

function calculate() {

  const current = Number(currentVip.value);
  const target = Number(targetVip.value);

  const multiplierValue = number(multiplier.value);

  const manualFirst = number(remainingNext.value);

  const lockMode = document.querySelector(
    'input[name="lockMode"]:checked'
  )?.value || "none";

  const lock = lockMode === "lock"
    ? number(lockValue.value)
    : 0;


  /* إذا لا يوجد مستوى مستهدف أعلى */
  if (target <= current) {

    reachValue.textContent = "0";
    lockResult.textContent = "0";
    totalWithLock.textContent = "0";
    supportBefore.textContent = "0";
    chargedSupport.textContent = "0";
    supportAfter.textContent = "0";
    finalSupport.textContent = "0";
    totalJod.textContent = "0.00 د.أ";
    totalUsd.textContent = "0.00 $";

    return;
  }


  /*
    قيمة الوصول الأساسية.

    أول قيمة = المتبقي الحقيقي الذي أدخله الوكيل.

    باقي القيم = القيم اليدوية في خانات
    المستويات.
  */

  let reachTotal = manualFirst;

  const otherInputs =
    document.querySelectorAll(".level-value");

  otherInputs.forEach(input => {

    const from = Number(input.dataset.from);

    if (from !== current) {
      reachTotal += number(input.value);
    }

  });


  /*
    التثبيت منفصل تماماً.
  */

  const total = reachTotal + lock;


  /*
    الدعم المطلوب من العميل.

    إذا كان 1 مليون شحن يحتاج 130,000 دعم:

    عدد الملايين = الشحن المطلوب ÷ 1,000,000

    الدعم = عدد الملايين × قيمة الدعم للمليون
  */

  const supportRate =
    number(supportPerMillion.value);

  const supportNeeded =
    (total / 1000000) * supportRate;


  /*
    كمية الشحن التي سيحصل عليها العميل
    بناءً على ×VIP المختار.
  */

  const charged =
    total * multiplierValue;


  /*
    الدعم الناتج/المقابل بعد الشحن.

    هنا نحسب قيمة الدعم على كمية الشحن
    التي سيتم شحنها فعلياً.
  */

  const supportGenerated =
    (charged / 1000000) * supportRate;


  /*
    المتبقي بعد الشحن.
  */

  const after =
    Math.max(0, supportNeeded - supportGenerated);


  /*
    الأسعار المالية.

    السعر لكل مليون شحن يحدده المستخدم.
  */

  const jodRate =
    number(jodPerMillion.value);

  const usdRate =
    number(usdPerMillion.value);


  const jod =
    (charged / 1000000) * jodRate;

  const usd =
    (charged / 1000000) * usdRate;


  /* =========================
     عرض النتائج
  ========================= */

  reachValue.textContent =
    formatNumber(reachTotal);

  lockResult.textContent =
    formatNumber(lock);

  totalWithLock.textContent =
    formatNumber(total);

  supportBefore.textContent =
    formatNumber(supportNeeded);

  chargedSupport.textContent =
    formatNumber(charged);

  supportAfter.textContent =
    formatNumber(after);

  finalSupport.textContent =
    formatNumber(supportNeeded);

  totalJod.textContent =
    formatMoney(jod, "د.أ");

  totalUsd.textContent =
    formatMoney(usd, "$");
}


/* =========================
   حساب القيم تلقائياً
========================= */

document.addEventListener("input", (event) => {

  if (
    event.target.matches("input") ||
    event.target.matches("select")
  ) {

    calculate();

  }

});


/* =========================
   تغيير المستوى
========================= */

currentVip.addEventListener("change", () => {

  renderLevelInputs();

});


targetVip.addEventListener("change", () => {

  renderLevelInputs();

});


/* =========================
   أول خانة مستوى
=========================

   عند تغيير remainingNext
   نحدث أول خانة أيضاً.
========================= */

remainingNext.addEventListener("input", () => {

  const first =
    document.querySelector(".level-value");

  if (first) {
    first.value = remainingNext.value;
  }

  calculate();

});


/* =========================
   التثبيت
========================= */

document
  .querySelectorAll('input[name="lockMode"]')
  .forEach(radio => {

    radio.addEventListener("change", () => {

      document
        .querySelectorAll(".radio-card")
        .forEach(card => {

          card.classList.remove("active");

        });


      radio
        .closest(".radio-card")
        ?.classList.add("active");


      if (radio.value === "lock") {

        lockBox.classList.remove("hidden");

      } else {

        lockBox.classList.add("hidden");

      }

      calculate();

    });

  });


/* =========================
   LocalStorage
========================= */

const STORAGE_KEY =
  "majles_alqimmah_vip_customers";


function getHistory() {

  try {

    const data =
      localStorage.getItem(STORAGE_KEY);

    if (!data) {
      return [];
    }

    const parsed = JSON.parse(data);

    return Array.isArray(parsed)
      ? parsed
      : [];

  } catch (error) {

    console.error(error);

    return [];

  }

}


function setHistory(history) {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(history)
  );

}


/* =========================
   إنشاء سجل العملية
========================= */

function buildRecord() {

  calculate();


  const lockMode =
    document.querySelector(
      'input[name="lockMode"]:checked'
    )?.value || "none";


  const record = {

    id: Date.now(),

    customerName:
      customerName.value.trim(),

    customerId:
      customerId.value.trim(),

    currentVip:
      Number(currentVip.value),

    targetVip:
      Number(targetVip.value),

    remainingNext:
      number(remainingNext.value),

    multiplier:
      number(multiplier.value),

    lockMode,

    lockValue:
      lockMode === "lock"
        ? number(lockValue.value)
        : 0,

    supportPerMillion:
      number(supportPerMillion.value),

    jodPerMillion:
      number(jodPerMillion.value),

    usdPerMillion:
      number(usdPerMillion.value),

    levelValues:
      Array.from(
        document.querySelectorAll(".level-value")
      ).map(input => ({
        from: Number(input.dataset.from),
        to: Number(input.dataset.to),
        value: number(input.value)
      })),

    result: {

      reach:
        numberFromText(reachValue.textContent),

      lock:
        numberFromText(lockResult.textContent),

      total:
        numberFromText(totalWithLock.textContent),

      supportBefore:
        numberFromText(supportBefore.textContent),

      charged:
        numberFromText(chargedSupport.textContent),

      supportAfter:
        numberFromText(supportAfter.textContent),

      jod:
        numberFromText(totalJod.textContent),

      usd:
        numberFromText(totalUsd.textContent)

    },

    createdAt:
      new Date().toISOString()

  };


  return record;

}


/* =========================
   تحويل النص إلى رقم
========================= */

function numberFromText(value) {

  if (!value) {
    return 0;
  }

  const cleaned =
    String(value)
      .replace(/,/g, "")
      .replace("د.أ", "")
      .replace("$", "")
      .trim();

  const n = Number(cleaned);

  return Number.isFinite(n) ? n : 0;

}


/* =========================
   حفظ العميل
========================= */

$("saveBtn").addEventListener("click", () => {

  const id =
    customerId.value.trim();

  if (!id) {

    alert("أدخل ID الحساب أولاً.");

    customerId.focus();

    return;

  }


  const record =
    buildRecord();

  const history =
    getHistory();


  /*
    إذا كان نفس ID موجوداً:
    نضيف عملية جديدة، ولا نحذف العملية القديمة.
  */

  history.unshift(record);

  setHistory(history);

  renderHistory();

  alert("تم حفظ العميل والعملية بنجاح.");

});


/* =========================
   عرض السجل
========================= */

function renderHistory(filter = "") {

  const history =
    getHistory();

  const query =
    filter.trim().toLowerCase();


  const filtered =
    history.filter(item => {

      if (!query) {
        return true;
      }

      return (
        String(item.customerId)
          .toLowerCase()
          .includes(query)
        ||
        String(item.customerName)
          .toLowerCase()
          .includes(query)
      );

    });


  historyList.innerHTML = "";


  if (!filtered.length) {

    historyList.innerHTML = `
      <div class="empty-history">
        لا توجد عمليات محفوظة.
      </div>
    `;

    return;

  }


  filtered.forEach(item => {

    const date =
      new Date(item.createdAt)
        .toLocaleString("ar");

    const div =
      document.createElement("div");

    div.className =
      "history-item";


    div.innerHTML = `

      <div class="history-info">

        <strong>
          ${escapeHtml(
            item.customerName || "بدون اسم"
          )}
        </strong>

        <span>
          ID: ${escapeHtml(item.customerId)}
          · VIP ${item.currentVip}
          → VIP ${item.targetVip}
          · ×${item.multiplier}
        </span>

        <span>
          ${date}
        </span>

      </div>


      <div class="history-actions">

        <button
          onclick="loadCustomer(${item.id})"
        >
          فتح
        </button>

        <button
          class="remove"
          onclick="deleteCustomer(${item.id})"
        >
          حذف
        </button>

      </div>

    `;


    historyList.appendChild(div);

  });

}


/* =========================
   حماية HTML
========================= */

function escapeHtml(value) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


/* =========================
   فتح عملية محفوظة
========================= */

window.loadCustomer = function(id) {

  const history =
    getHistory();

  const item =
    history.find(x => x.id === id);


  if (!item) {
    return;
  }


  customerName.value =
    item.customerName || "";

  customerId.value =
    item.customerId || "";

  currentVip.value =
    item.currentVip;

  targetVip.value =
    item.targetVip;

  remainingNext.value =
    item.remainingNext;

  multiplier.value =
    item.multiplier;

  supportPerMillion.value =
    item.supportPerMillion;

  jodPerMillion.value =
    item.jodPerMillion;

  usdPerMillion.value =
    item.usdPerMillion;

  lockValue.value =
    item.lockValue || 0;


  const radio =
    document.querySelector(
      `input[name="lockMode"][value="${item.lockMode}"]`
    );

  if (radio) {

    radio.checked = true;

    document
      .querySelectorAll(".radio-card")
      .forEach(card =>
        card.classList.remove("active")
      );

    radio
      .closest(".radio-card")
      ?.classList.add("active");

  }


  if (item.lockMode === "lock") {

    lockBox.classList.remove("hidden");

  } else {

    lockBox.classList.add("hidden");

  }


  renderLevelInputs();


  /*
    استعادة القيم اليدوية
    لكل انتقال بين المستويات.
  */

  const inputs =
    document.querySelectorAll(".level-value");


  inputs.forEach(input => {

    const from =
      Number(input.dataset.from);

    const saved =
      item.levelValues?.find(
        x => x.from === from
      );

    if (saved) {

      input.value =
        saved.value;

    }

  });


  calculate();


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

};


/* =========================
   حذف عملية
========================= */

window.deleteCustomer = function(id) {

  const ok =
    confirm("هل تريد حذف هذه العملية؟");

  if (!ok) {
    return;
  }


  const history =
    getHistory()
      .filter(item => item.id !== id);


  setHistory(history);

  renderHistory(searchHistory.value);

};


/* =========================
   حذف السجل بالكامل
========================= */

$("clearHistory").addEventListener(
  "click",
  () => {

    const history =
      getHistory();

    if (!history.length) {

      alert("السجل فارغ.");

      return;

    }


    const ok =
      confirm(
        "سيتم حذف جميع العملاء والعمليات المحفوظة. هل أنت متأكد؟"
      );


    if (!ok) {
      return;
    }


    localStorage.removeItem(STORAGE_KEY);

    renderHistory();

  }
);


/* =========================
   البحث
========================= */

searchHistory.addEventListener(
  "input",
  () => {

    renderHistory(
      searchHistory.value
    );

  }
);


/* =========================
   عملية جديدة
========================= */

$("newBtn").addEventListener(
  "click",
  () => {

    const ok =
      confirm(
        "بدء عملية جديدة؟ لن يتم حذف السجل المحفوظ."
      );

    if (!ok) {
      return;
    }


    customerName.value = "";

    customerId.value = "";

    currentVip.value = "1";

    targetVip.value = "2";

    remainingNext.value = "";

    multiplier.value = "1";

    supportPerMillion.value =
      "130000";

    jodPerMillion.value =
      "11";

    usdPerMillion.value =
      "15";

    lockValue.value =
      "0";


    const none =
      document.querySelector(
        'input[name="lockMode"][value="none"]'
      );

    if (none) {

      none.checked = true;

      document
        .querySelectorAll(".radio-card")
        .forEach(card =>
          card.classList.remove("active")
        );

      none
        .closest(".radio-card")
        ?.classList.add("active");

    }


    lockBox.classList.add("hidden");

    renderLevelInputs();

    calculate();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }
);


/* =========================
   تشغيل الموقع
========================= */

renderVipTable();

renderLevelInputs();

renderHistory();

calculate();
