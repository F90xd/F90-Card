/*
  =========================================================
  مجلس القمة للشحن
  حاسبة VIP والحساب الصافي
  =========================================================

  الحسابات:

  الناقص للوصول =
  إجمالي المستوى المطلوب - الدعم الحالي

  الشحن الفعلي =
  الناقص ÷ VIP

  رمي الدعم =
  الشحن الفعلي ÷ 1,000,000 × قيمة رمي الدعم للمليون

  التحويل بالدينار =
  الشحن الفعلي ÷ 1,000,000 × سعر المليون بالدينار

  التحويل بالدولار =
  الشحن الفعلي ÷ 1,000,000 × سعر المليون بالدولار
*/


/* =========================================================
   جدول مستويات VIP
   ========================================================= */

const LEVELS = [

  {
    lv: 1,
    total: 50000,
    up: 50000,
    keep: 30000
  },

  {
    lv: 2,
    total: 100000,
    up: 50000,
    keep: 30000
  },

  {
    lv: 3,
    total: 300000,
    up: 100000,
    keep: 90000
  },

  {
    lv: 4,
    total: 1000000,
    up: 800000,
    keep: 500000
  },

  {
    lv: 5,
    total: 3000000,
    up: 2000000,
    keep: 1300000
  },

  {
    lv: 6,
    total: 7000000,
    up: 4000000,
    keep: 2600000
  },

  {
    lv: 7,
    total: 14000000,
    up: 7000000,
    keep: 4500000
  },

  {
    lv: 8,
    total: 26000000,
    up: 12000000,
    keep: 7800000
  },

  {
    lv: 9,
    total: 42000000,
    up: 16000000,
    keep: 11000000
  },

  {
    lv: 10,
    total: 62000000,
    up: 20000000,
    keep: 14000000
  },

  {
    lv: 11,
    total: 102000000,
    up: 40000000,
    keep: 28000000
  },

  {
    lv: 12,
    total: 220000000,
    up: 118000000,
    keep: 83000000
  },

  {
    lv: 13,
    total: 430000000,
    up: 210000000,
    keep: 150000000
  },

  {
    lv: 14,
    total: 820000000,
    up: 390000000,
    keep: 310000000
  },

  {
    lv: 15,
    total: 1820000000,
    up: 1000000000,
    keep: 700000000
  },

  {
    lv: 16,
    total: 3820000000,
    up: 2000000000,
    keep: 1400000000
  },

  {
    lv: 17,
    total: 7382000000,
    up: 3500000000,
    keep: 3000000000
  },

  {
    lv: 18,
    total: 11882000000,
    up: 4500000000,
    keep: 4000000000
  },

  {
    lv: 19,
    total: 17382000000,
    up: 5500000000,
    keep: 5000000000
  },

  {
    lv: 20,
    total: 27382000000,
    up: 10000000000,
    keep: 9000000000
  }

];


/* =========================================================
   التخزين المحلي
   ========================================================= */

const STORAGE_KEY = "majlis_alqimah_data_v1";

const THEME_KEY = "majlis_alqimah_theme";


function getData() {

  try {

    const saved =
      localStorage.getItem(STORAGE_KEY);

    if (saved) {

      return JSON.parse(saved);

    }

  } catch (error) {

    console.error(error);

  }


  return {

    settings: {

      vip: 1,

      throwPerMillion: 130000,

      jodPerMillion: 11,

      usdPerMillion: 15

    },

    customers: {}

  };

}


function saveData(data) {

  localStorage.setItem(

    STORAGE_KEY,

    JSON.stringify(data)

  );

  updateCustomerCount();

}


/* =========================================================
   اختصار العناصر
   ========================================================= */

function $(id) {

  return document.getElementById(id);

}


/* =========================================================
   تنسيق الأرقام
   ========================================================= */

function formatNumber(

  number,

  decimals = 0

) {

  if (!Number.isFinite(number)) {

    return "—";

  }


  return new Intl.NumberFormat(

    "en-US",

    {

      minimumFractionDigits: 0,

      maximumFractionDigits: decimals

    }

  ).format(number);

}


function money(

  number,

  currency

) {

  return `${formatNumber(number, 2)} ${currency}`;

}


/* =========================================================
   الحصول على بيانات المستوى
   ========================================================= */

function getLevel(level) {

  return LEVELS.find(

    item => item.lv === Number(level)

  );

}


/* =========================================================
   تعبئة مستويات الاختيار
   ========================================================= */

function populateLevels() {

  const currentSelect = $("currentLevel");

  const targetSelect = $("targetLevel");


  currentSelect.innerHTML = "";

  targetSelect.innerHTML = "";


  LEVELS.forEach(level => {

    const option1 = document.createElement("option");

    option1.value = level.lv;

    option1.textContent = `Lv.${level.lv}`;

    currentSelect.appendChild(option1);


    const option2 = document.createElement("option");

    option2.value = level.lv;

    option2.textContent = `Lv.${level.lv}`;

    targetSelect.appendChild(option2);

  });


  currentSelect.value = "1";

  targetSelect.value = "2";


  $("levelsBody").innerHTML = LEVELS.map(

    level => `

      <tr>

        <td>Lv.${level.lv}</td>

        <td>${formatNumber(level.total)}</td>

        <td>${formatNumber(level.up)}</td>

        <td>${formatNumber(level.keep)}</td>

      </tr>

    `

  ).join("");

}


/* =========================================================
   الإعدادات
   ========================================================= */

function loadSettings() {

  const data = getData();

  const settings = data.settings;


  $("vip").value =

    settings.vip || 1;


  $("throwPerMillion").value =

    settings.throwPerMillion ?? 130000;


  $("jodPerMillion").value =

    settings.jodPerMillion ?? 11;


  $("usdPerMillion").value =

    settings.usdPerMillion ?? 15;

}


function getSettingsFromPage() {

  return {

    vip:

      Math.max(

        1,

        Number($("vip").value) || 1

      ),


    throwPerMillion:

      Math.max(

        0,

        Number($("throwPerMillion").value) || 0

      ),


    jodPerMillion:

      Math.max(

        0,

        Number($("jodPerMillion").value) || 0

      ),


    usdPerMillion:

      Math.max(

        0,

        Number($("usdPerMillion").value) || 0

      )

  };

}


function saveSettings() {

  const data = getData();

  data.settings =

    getSettingsFromPage();


  saveData(data);


  toast("تم حفظ إعدادات الحاسبة");

}


/* =========================================================
   عدد العملاء
   ========================================================= */

function updateCustomerCount() {

  const data = getData();


  $("customerCount").textContent =

    Object.keys(

      data.customers

    ).length;

}


/* =========================================================
   التحقق من ID
   ========================================================= */

function getCustomerId() {

  const id =

    $("customerId")

      .value

      .trim();


  if (!id) {

    toast(

      "أدخل ID الحساب الأساسي أولاً"

    );

    $("customerId").focus();

    return null;

  }


  return id;

}


/* =========================================================
   تحميل العميل
   ========================================================= */

function loadCustomer(id) {

  if (!id) {

    return;

  }


  const data = getData();

  const customer =

    data.customers[id];


  if (!customer) {

    $("savedNotice")

      .classList

      .add("hidden");


    renderHistory(id);

    return;

  }


  $("customerName").value =

    customer.name || "";


  $("currentLevel").value =

    customer.currentLevel || 1;


  $("targetLevel").value =

    customer.targetLevel || 2;


  $("currentSupport").value =

    customer.currentSupport ?? 0;


  $("savedNotice").textContent =

    `تم تحميل الحساب المحفوظ: ${id}`;


  $("savedNotice")

    .classList

    .remove("hidden");


  renderHistory(id);

}


/* =========================================================
   حساب جزء من العملية
   ========================================================= */

function calculateBlock(

  missing,

  vip,

  throwPerMillion,

  jodPerMillion,

  usdPerMillion

) {

  const charge =

    missing / vip;


  const throwSupport =

    (charge / 1000000) *

    throwPerMillion;


  const jod =

    (charge / 1000000) *

    jodPerMillion;


  const usd =

    (charge / 1000000) *

    usdPerMillion;


  return {

    missing,

    charge,

    throwSupport,

    jod,

    usd

  };

}


/* =========================================================
   الحساب الرئيسي
   ========================================================= */

let lastResult = null;


function calculate() {

  const customerId =

    getCustomerId();


  if (!customerId) {

    return;

  }


  const currentLevel =

    Number(

      $("currentLevel").value

    );


  const targetLevel =

    Number(

      $("targetLevel").value

    );


  const currentSupport =

    Math.max(

      0,

      Number(

        $("currentSupport").value

      ) || 0

    );


  const settings =

    getSettingsFromPage();


  const vip = settings.vip;


  const target =

    getLevel(targetLevel);


  if (!target) {

    toast("تعذر قراءة المستوى");

    return;

  }


  /*
    الوصول:

    إجمالي المطلوب للوصول
    ناقص الدعم الحالي
  */

  const reachMissing =

    Math.max(

      0,

      target.total -

      currentSupport

    );


  /*
    التثبيت:

    احتياج تثبيت المستوى المطلوب
    ناقص الدعم الحالي
  */

  const maintainMissing =

    Math.max(

      0,

      target.keep -

      currentSupport

    );


  const reach =

    calculateBlock(

      reachMissing,

      vip,

      settings.throwPerMillion,

      settings.jodPerMillion,

      settings.usdPerMillion

    );


  const maintain =

    calculateBlock(

      maintainMissing,

      vip,

      settings.throwPerMillion,

      settings.jodPerMillion,

      settings.usdPerMillion

    );


  const grand = {

    missing:

      reach.missing +

      maintain.missing,


    charge:

      reach.charge +

      maintain.charge,


    throwSupport:

      reach.throwSupport +

      maintain.throwSupport,


    jod:

      reach.jod +

      maintain.jod,


    usd:

      reach.usd +

      maintain.usd

  };


  lastResult = {

    customerId,

    currentLevel,

    targetLevel,

    currentSupport,

    vip,

    reach,

    maintain,

    grand,

    date:

      new Date().toISOString()

  };


  renderResult(lastResult);


  /*
    نحفظ بيانات العميل الأساسية
    مباشرة بعد الحساب، لكن سجل
    العملية لا يضاف إلا عند الضغط
    على "حفظ العميل والعملية".
  */

  saveCustomer(false);

}


/* =========================================================
   عرض النتيجة
   ========================================================= */

function renderResult(result) {

  $("results")

    .classList

    .remove("hidden");


  $("resultStatus").textContent =

    `محسوب لـ ${result.customerId}`;


  $("rCurrent").textContent =

    `Lv.${result.currentLevel}`;


  $("rTarget").textContent =

    `Lv.${result.targetLevel}`;


  $("rVip").textContent =

    `×${result.vip}`;


  $("rCurrentSupport").textContent =

    formatNumber(

      result.currentSupport

    );


  /*
    الوصول
  */

  $("reachTotal").textContent =

    formatNumber(

      getLevel(

        result.targetLevel

      ).total

    );


  $("reachMissing").textContent =

    formatNumber(

      result.reach.missing

    );


  $("reachCharge").textContent =

    formatNumber(

      result.reach.charge,

      2

    );


  $("reachThrow").textContent =

    formatNumber(

      result.reach.throwSupport,

      2

    );


  $("reachJod").textContent =

    money(

      result.reach.jod,

      "د.أ"

    );


  $("reachUsd").textContent =

    money(

      result.reach.usd,

      "$"

    );


  /*
    التثبيت
  */

  $("maintainTotal").textContent =

    formatNumber(

      getLevel(

        result.targetLevel

      ).keep

    );


  $("maintainMissing").textContent =

    formatNumber(

      result.maintain.missing

    );


  $("maintainCharge").textContent =

    formatNumber(

      result.maintain.charge,

      2

    );


  $("maintainThrow").textContent =

    formatNumber(

      result.maintain.throwSupport,

      2

    );


  $("maintainJod").textContent =

    money(

      result.maintain.jod,

      "د.أ"

    );


  $("maintainUsd").textContent =

    money(

      result.maintain.usd,

      "$"

    );


  /*
    الإجمالي
  */

  $("grandMissing").textContent =

    formatNumber(

      result.grand.missing,

      2

    );


  $("grandCharge").textContent =

    formatNumber(

      result.grand.charge,

      2

    );


  $("grandThrow").textContent =

    formatNumber(

      result.grand.throwSupport,

      2

    );


  $("grandJod").textContent =

    money(

      result.grand.jod,

      "د.أ"

    );


  $("grandUsd").textContent =

    money(

      result.grand.usd,

      "$"

    );

}


/* =========================================================
   حفظ العميل
   ========================================================= */

function saveCustomer(addHistory = true) {

  const id =

    getCustomerId();


  if (!id) {

    return;

  }


  const data = getData();


  const existing =

    data.customers[id] ||

    {

      history: []

    };


  existing.name =

    $("customerName")

      .value

      .trim();


  existing.currentLevel =

    Number(

      $("currentLevel").value

    );


  existing.targetLevel =

    Number(

      $("targetLevel").value

    );


  existing.currentSupport =

    Number(

      $("currentSupport").value

    ) || 0;


  existing.updatedAt =

    new Date().toISOString();


  /*
    إضافة العملية إلى السجل
  */

  if (

    addHistory &&

    lastResult &&

    lastResult.customerId === id

  ) {

    existing.history =

      existing.history || [];


    existing.history.unshift({

      id:

        generateId(),


      date:

        new Date().toLocaleString(

          "ar-EG"

        ),


      currentLevel:

        lastResult.currentLevel,


      targetLevel:

        lastResult.targetLevel,


      vip:

        lastResult.vip,


      missing:

        lastResult.grand.missing,


      charge:

        lastResult.grand.charge,


      throwSupport:

        lastResult.grand.throwSupport,


      jod:

        lastResult.grand.jod,


      usd:

        lastResult.grand.usd,


      note:

        $("operationNote")

          .value

          .trim()

    });


    /*
      الاحتفاظ بآخر 100 عملية
    */

    if (

      existing.history.length > 100

    ) {

      existing.history =

        existing.history.slice(

          0,

          100

        );

    }

  }


  data.customers[id] =

    existing;


  saveData(data);


  renderHistory(id);


  $("savedNotice").textContent =

    `تم حفظ الحساب: ${id}`;


  $("savedNotice")

    .classList

    .remove("hidden");


  if (addHistory) {

    toast(

      "تم حفظ العميل والعملية"

    );

  }

}


/* =========================================================
   إنشاء ID للعملية
   ========================================================= */

function generateId() {

  if (

    window.crypto &&

    crypto.randomUUID

  ) {

    return crypto.randomUUID();

  }


  return (

    Date.now().toString() +

    Math.random()

      .toString(36)

      .substring(2)

  );

}


/* =========================================================
   سجل العميل
   ========================================================= */

function renderHistory(id) {

  const data = getData();

  const customer =

    data.customers[id];


  if (

    !id ||

    !customer ||

    !customer.history ||

    !customer.history.length

  ) {

    $("historyEmpty").textContent =

      id

        ? "لا يوجد سجل محفوظ لهذا الحساب بعد."

        : "أدخل ID العميل لعرض سجله.";


    $("historyEmpty")

      .classList

      .remove("hidden");


    $("historyTableWrap")

      .classList

      .add("hidden");


    return;

  }


  $("historyEmpty")

    .classList

    .add("hidden");


  $("historyTableWrap")

    .classList

    .remove("hidden");


  $("historyBody").innerHTML =

    customer.history

      .map(

        operation => `

          <tr>

            <td>

              ${escapeHtml(operation.date)}

            </td>

            <td>

              Lv.${operation.currentLevel}

              → Lv.${operation.targetLevel}

            </td>

            <td>

              ${formatNumber(

                operation.missing,

                2

              )}

            </td>

            <td>

              ×${operation.vip}

            </td>

            <td>

              ${formatNumber(

                operation.charge,

                2

              )}

            </td>

            <td>

              ${formatNumber(

                operation.throwSupport,

                2

              )}

            </td>

            <td>

              ${formatNumber(

                operation.jod,

                2

              )}

            </td>

            <td>

              ${formatNumber(

                operation.usd,

                2

              )}

            </td>

            <td>

              <button

                class="copy-btn delete-history"

                data-id="${operation.id}">

                حذف

              </button>

            </td>

          </tr>

        `

      )

      .join("");


  document

    .querySelectorAll(

      ".delete-history"

    )

    .forEach(button => {

      button.addEventListener(

        "click",

        () => {

          deleteHistoryItem(

            id,

            button.dataset.id

          );

        }

      );

    });

}


/* =========================================================
   حذف عملية من السجل
   ========================================================= */

function deleteHistoryItem(

  customerId,

  operationId

) {

  const data = getData();

  const customer =

    data.customers[customerId];


  if (!customer) {

    return;

  }


  customer.history =

    (customer.history || [])

      .filter(

        operation =>

          operation.id !==

          operationId

      );


  data.customers[customerId] =

    customer;


  saveData(data);


  renderHistory(customerId);


  toast("تم حذف العملية");

}


/* =========================================================
   مسح سجل العميل
   ========================================================= */

function clearHistory() {

  const id =

    $("customerId")

      .value

      .trim();


  if (!id) {

    toast(

      "أدخل ID الحساب أولاً"

    );

    return;

  }


  const data = getData();


  if (!data.customers[id]) {

    toast(

      "لا يوجد حساب محفوظ"

    );

    return;

  }


  const confirmed = confirm(

    `هل تريد مسح سجل الحساب ${id} بالكامل؟`

  );


  if (!confirmed) {

    return;

  }


  data.customers[id].history = [];


  saveData(data);


  renderHistory(id);


  toast("تم مسح سجل العميل");

}


/* =========================================================
   عميل جديد
   ========================================================= */

function newCustomer() {

  $("customerId").value = "";

  $("customerName").value = "";

  $("currentLevel").value = "1";

  $("targetLevel").value = "2";

  $("currentSupport").value = "0";

  $("operationNote").value = "";


  $("savedNotice")

    .classList

    .add("hidden");


  $("results")

    .classList

    .add("hidden");


  lastResult = null;


  renderHistory("");


  $("customerId").focus();

}


/* =========================================================
   الوضع الليلي
   ========================================================= */

function initTheme() {

  const savedTheme =

    localStorage.getItem(

      THEME_KEY

    );


  if (savedTheme === "dark") {

    document.body.classList.add(

      "dark"

    );

  }


  updateThemeButton();

}


function updateThemeButton() {

  $("themeBtn").textContent =

    document.body.classList.contains(

      "dark"

    )

      ? "الوضع النهاري"

      : "الوضع الليلي";

}


function toggleTheme() {

  document.body.classList.toggle(

    "dark"

  );


  localStorage.setItem(

    THEME_KEY,

    document.body.classList.contains(

      "dark"

    )

      ? "dark"

      : "light"

  );


  updateThemeButton();

}


/* =========================================================
   النسخ
   ========================================================= */

async function copyText(text) {

  try {

    await navigator.clipboard.writeText(

      text

    );


    toast("تم النسخ");

  } catch (error) {

    /*
      طريقة احتياطية لبعض المتصفحات
    */

    const textarea =

      document.createElement(

        "textarea"

      );


    textarea.value = text;

    document.body.appendChild(

      textarea

    );

    textarea.select();

    document.execCommand("copy");

    textarea.remove();


    toast("تم النسخ");

  }

}


/* =========================================================
   تنظيف النصوص قبل وضعها في HTML
   ========================================================= */

function escapeHtml(value) {

  return String(value ?? "")

    .replace(

      /[&<>"']/g,

      character => {

        const entities = {

          "&": "&amp;",

          "<": "&lt;",

          ">": "&gt;",

          '"': "&quot;",

          "'": "&#039;"

        };


        return entities[character];

      }

    );

}


/* =========================================================
   رسالة صغيرة
   ========================================================= */

function toast(message) {

  const element =

    $("toast");


  element.textContent =

    message;


  element.classList.add(

    "show"

  );


  clearTimeout(

    window.__toastTimer

  );


  window.__toastTimer =

    setTimeout(

      () => {

        element.classList.remove(

          "show"

        );

      },

      1800

    );

}


/* =========================================================
   تشغيل الموقع
   ========================================================= */

document.addEventListener(

  "DOMContentLoaded",

  () => {

    populateLevels();

    loadSettings();

    initTheme();

    updateCustomerCount();


    /*
      عند كتابة ID العميل
    */

    $("customerId")

      .addEventListener(

        "input",

        event => {

          loadCustomer(

            event.target.value.trim()

          );

        }

      );


    /*
      زر الحساب
    */

    $("calculateBtn")

      .addEventListener(

        "click",

        calculate

      );


    /*
      حفظ العميل والعملية
    */

    $("saveCustomerBtn")

      .addEventListener(

        "click",

        () => {

          saveCustomer(true);

        }

      );


    /*
      حفظ الإعدادات
    */

    $("saveSettingsBtn")

      .addEventListener(

        "click",

        saveSettings

      );


    /*
      عميل جديد
    */

    $("newCustomerBtn")

      .addEventListener(

        "click",

        newCustomer

      );


    /*
      مسح السجل
    */

    $("clearHistoryBtn")

      .addEventListener(

        "click",

        clearHistory

      );


    /*
      الوضع الليلي
    */

    $("themeBtn")

      .addEventListener(

        "click",

        toggleTheme

      );


    /*
      أزرار النسخ
    */

    document

      .querySelectorAll(

        ".copy-btn"

      )

      .forEach(button => {

        button.addEventListener(

          "click",

          () => {

            copyText(

              button.dataset.copy

            );

          }

        );

      });

  }

);
