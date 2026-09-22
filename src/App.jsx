import React, {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  Calculator,
  Users,
  Settings,
  ShieldCheck,
  Save,
  Trash2,
  Search,
  Copy,
  Download,
  Upload,
  Moon,
  Sun,
  RotateCcw,
  History,
  ChevronLeft,
  X,
  Edit3,
  Database,
  MessageCircle,
  Instagram,
  UserRound,
  ArrowLeftRight,
  Plus,
  Minus,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

/* =========================================================
   CONSTANTS
========================================================= */

const STORAGE_KEY =
  "majlis_alqimma_vip_database_v1";

/*
  بيانات التواصل ثابتة كما طلب المستخدم.
*/
const CONTACTS = {
  ghlisId: "14935693",
  f90Id: "31991930",
  lordId: "12221042",
  supporterId: "JOR",

  ghlisWhatsapp: "+963938722013",
  f90Whatsapp: "+970568181910",
  lordWhatsapp: "+962775630834",

  instagram: "f90.xd"
};

/*
  جدول VIP من 1 إلى 20.
  القيم مأخوذة من الجدول المرسل.
*/
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

/*
  الإعدادات الابتدائية.
  المستخدم يستطيع تعديلها من صفحة الإعدادات.
*/
const DEFAULT_SETTINGS = {
  siteName: "مجلس القمة للشحن",
  siteSubtitle:
    "حاسبة VIP والشحن وصافي الحساب",

  developer:
    "تم تطوير هذا الموقع بواسطة F90 — أف تسعين للخدمات الرقمية",

  supportPerMillion: 130000,
  jodPerMillion: 11,
  usdPerMillion: 15,

  contactText: {
    ghlis: CONTACTS.ghlisWhatsapp,
    f90: CONTACTS.f90Whatsapp,
    lord: CONTACTS.lordWhatsapp
  }
};

/* =========================================================
   HELPERS
========================================================= */

function createInitialDatabase() {
  return {
    settings: {
      ...DEFAULT_SETTINGS
    },

    customers: [],

    calculations: []
  };
}

function loadDatabase() {
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return createInitialDatabase();
    }

    const parsed =
      JSON.parse(raw);

    return {
      ...createInitialDatabase(),
      ...parsed,

      settings: {
        ...DEFAULT_SETTINGS,
        ...(parsed.settings || {})
      },

      customers:
        Array.isArray(parsed.customers)
          ? parsed.customers
          : [],

      calculations:
        Array.isArray(parsed.calculations)
          ? parsed.calculations
          : []
    };
  } catch {
    return createInitialDatabase();
  }
}

function saveDatabase(database) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(database)
  );
}

function number(value) {
  const result = Number(value);

  return Number.isFinite(result)
    ? result
    : 0;
}

function format(value, decimals = 0) {
  return new Intl.NumberFormat(
    "en-US",
    {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }
  ).format(number(value));
}

function generateId() {
  if (
    typeof crypto !== "undefined" &&
    crypto.randomUUID
  ) {
    return crypto.randomUUID();
  }

  return (
    Date.now() +
    "-" +
    Math.random()
      .toString(36)
      .substring(2)
  );
}

function getVip(level) {
  return (
    VIP_TABLE.find(
      item => item.level === number(level)
    ) || {
      level: number(level),
      total: 0,
      upgrade: 0,
      maintain: 0
    }
  );
}

function calculateMoney(
  support,
  settings
) {
  const million =
    number(support) / 1000000;

  return {
    jod:
      million *
      number(settings.jodPerMillion),

    usd:
      million *
      number(settings.usdPerMillion),

    supportEquivalent:
      million *
      number(settings.supportPerMillion)
  };
}

function createTransitions(
  current,
  target,
  existingInputs = {}
) {
  const result = [];

  current = number(current);
  target = number(target);

  if (target <= current) {
    return result;
  }

  for (
    let level = current;
    level < target;
    level++
  ) {
    const key =
      `${level}-${level + 1}`;

    result.push({
      id: key,
      from: level,
      to: level + 1,
      missing:
        existingInputs[key] !== undefined
          ? existingInputs[key]
          : ""
    });
  }

  return result;
}

/* =========================================================
   MAIN APP
========================================================= */

export default function App() {
  const [database, setDatabase] =
    useState(loadDatabase);

  const [page, setPage] =
    useState("calculator");

  const [darkMode, setDarkMode] =
    useState(true);

  const [notice, setNotice] =
    useState("");

  const [calculator, setCalculator] =
    useState({
      userId: "",
      userName: "",

      currentLevel: 1,
      targetLevel: 2,

      multiplier: 1,

      maintainEnabled: false,

      missing: {}
    });

  const [search, setSearch] =
    useState("");

  const [selectedCustomer, setSelectedCustomer] =
    useState(null);

  const [editingCalculation, setEditingCalculation] =
    useState(null);

  const settings =
    database.settings;

  useEffect(() => {
    saveDatabase(database);
  }, [database]);

  function notify(message) {
    setNotice(message);

    window.setTimeout(
      () => setNotice(""),
      2600
    );
  }

  function updateDatabase(next) {
    setDatabase(next);
  }

  /* =======================================================
     CALCULATOR
  ======================================================= */

  const transitions = useMemo(() => {
    return createTransitions(
      calculator.currentLevel,
      calculator.targetLevel,
      calculator.missing
    );
  }, [
    calculator.currentLevel,
    calculator.targetLevel,
    calculator.missing
  ]);

  const accessTotal = useMemo(() => {
    return transitions.reduce(
      (total, item) =>
        total + number(item.missing),
      0
    );
  }, [transitions]);

  const targetVip =
    getVip(
      calculator.targetLevel
    );

  const maintainValue =
    targetVip.maintain;

  const maintainAmount =
    calculator.maintainEnabled
      ? maintainValue
      : 0;

  const totalWithMaintain =
    accessTotal +
    maintainAmount;

  const multiplier =
    Math.max(
      1,
      number(calculator.multiplier)
    );

  /*
    هذا هو الحساب الأساسي:

    المبلغ المطلوب من العميل
    = إجمالي الدعم المطلوب ÷ العرض

    مثال:
    المطلوب للوصول = 8,300,000
    العرض = ×5

    العميل يحتاج:
    8,300,000 ÷ 5
    = 1,660,000
  */

  const customerWithoutMaintain =
    accessTotal / multiplier;

  const customerWithMaintain =
    totalWithMaintain / multiplier;

  const moneyWithout =
    calculateMoney(
      customerWithoutMaintain,
      settings
    );

  const moneyWith =
    calculateMoney(
      customerWithMaintain,
      settings
    );

  function updateCalculator(
    key,
    value
  ) {
    setCalculator(prev => ({
      ...prev,
      [key]: value
    }));
  }

  function changeCurrentLevel(
    value
  ) {
    const current =
      number(value);

    let target =
      number(calculator.targetLevel);

    if (target <= current) {
      target =
        Math.min(
          20,
          current + 1
        );
    }

    setCalculator(prev => ({
      ...prev,

      currentLevel:
        current,

      targetLevel:
        target,

      missing: {}
    }));
  }

  function changeTargetLevel(
    value
  ) {
    const target =
      number(value);

    if (
      target <=
      number(calculator.currentLevel)
    ) {
      notify(
        "المستوى المستهدف يجب أن يكون أعلى من المستوى الحالي"
      );

      return;
    }

    setCalculator(prev => ({
      ...prev,

      targetLevel:
        target,

      missing: {}
    }));
  }

  function updateMissing(
    key,
    value
  ) {
    setCalculator(prev => ({
      ...prev,

      missing: {
        ...prev.missing,
        [key]: value
      }
    }));
  }

  function resetCalculator() {
    setCalculator({
      userId: "",
      userName: "",
      currentLevel: 1,
      targetLevel: 2,
      multiplier: 1,
      maintainEnabled: false,
      missing: {}
    });

    setEditingCalculation(null);
  }

  function saveCalculation() {
    if (
      !calculator.userId.trim()
    ) {
      notify(
        "أدخل ID المستخدم"
      );

      return;
    }

    if (
      number(calculator.targetLevel) <=
      number(calculator.currentLevel)
    ) {
      notify(
        "اختر مستوى مستهدف أعلى"
      );

      return;
    }

    if (
      transitions.length === 0
    ) {
      notify(
        "لا توجد مراحل للحساب"
      );

      return;
    }

    const hasEmpty =
      transitions.some(
        item =>
          item.missing === "" ||
          number(item.missing) < 0
      );

    if (hasEmpty) {
      notify(
        "أدخل قيمة الناقص لكل انتقال"
      );

      return;
    }

    const now =
      new Date().toISOString();

    const record = {
      id:
        editingCalculation ||
        generateId(),

      userId:
        calculator.userId.trim(),

      userName:
        calculator.userName.trim(),

      currentLevel:
        number(calculator.currentLevel),

      targetLevel:
        number(calculator.targetLevel),

      multiplier,

      maintainEnabled:
        calculator.maintainEnabled,

      missing: {
        ...calculator.missing
      },

      accessTotal,

      maintainAmount,

      totalWithMaintain,

      customerWithoutMaintain,

      customerWithMaintain,

      moneyWithout,

      moneyWith,

      settingsSnapshot: {
        ...settings
      },

      createdAt:
        editingCalculation
          ? (
              database.calculations.find(
                item =>
                  item.id ===
                  editingCalculation
              )?.createdAt ||
              now
            )
          : now,

      updatedAt: now
    };

    const existingCustomer =
      database.customers.find(
        customer =>
          customer.id ===
          calculator.userId.trim()
      );

    const customer = {
      id:
        calculator.userId.trim(),

      name:
        calculator.userName.trim(),

      updatedAt: now,

      createdAt:
        existingCustomer?.createdAt ||
        now
    };

    let calculations;

    if (editingCalculation) {
      calculations =
        database.calculations.map(
          item =>
            item.id ===
            editingCalculation
              ? record
              : item
        );
    } else {
      calculations = [
        record,
        ...database.calculations
      ];
    }

    updateDatabase({
      ...database,

      customers: [
        ...database.customers.filter(
          item =>
            item.id !==
            customer.id
        ),

        customer
      ],

      calculations
    });

    setEditingCalculation(null);

    notify(
      editingCalculation
        ? "تم تعديل العملية وحفظها"
        : "تم حفظ العملية وسجل العميل"
    );
  }

  function editCalculation(
    record
  ) {
    setCalculator({
      userId:
        record.userId,

      userName:
        record.userName,

      currentLevel:
        record.currentLevel,

      targetLevel:
        record.targetLevel,

      multiplier:
        record.multiplier,

      maintainEnabled:
        record.maintainEnabled,

      missing:
        {
          ...record.missing
        }
    });

    setEditingCalculation(
      record.id
    );

    setPage(
      "calculator"
    );

    notify(
      "تم تحميل العملية"
    );
  }

  function deleteCalculation(
    id
  ) {
    if (
      !window.confirm(
        "هل تريد حذف هذه العملية؟"
      )
    ) {
      return;
    }

    updateDatabase({
      ...database,

      calculations:
        database.calculations.filter(
          item =>
            item.id !== id
        )
    });

    if (
      selectedCustomer
    ) {
      setSelectedCustomer(
        null
      );
    }

    notify(
      "تم حذف العملية"
    );
  }

  function deleteCustomer(
    customerId
  ) {
    if (
      !window.confirm(
        "سيتم حذف العميل وجميع عملياته. هل تريد المتابعة؟"
      )
    ) {
      return;
    }

    updateDatabase({
      ...database,

      customers:
        database.customers.filter(
          item =>
            item.id !==
            customerId
        ),

      calculations:
        database.calculations.filter(
          item =>
            item.userId !==
            customerId
        )
    });

    setSelectedCustomer(
      null
    );

    notify(
      "تم حذف العميل"
    );
  }

  /* =======================================================
     COPY
  ======================================================= */

  function copySummary() {
    const lines = [];

    lines.push(
      settings.siteName
    );

    lines.push("");

    lines.push(
      `ID المستخدم: ${
        calculator.userId || "-"
      }`
    );

    lines.push(
      `الاسم: ${
        calculator.userName || "-"
      }`
    );

    lines.push(
      `VIP الحالي: ×${calculator.currentLevel}`
    );

    lines.push(
      `VIP المطلوب: ×${calculator.targetLevel}`
    );

    lines.push(
      `العرض: ×${multiplier}`
    );

    lines.push("");

    lines.push(
      "تفاصيل الوصول:"
    );

    transitions.forEach(
      item => {
        lines.push(
          `×${item.from} → ×${item.to}: ${format(
            item.missing
          )} دعم`
        );
      }
    );

    lines.push("");

    lines.push(
      `إجمالي الوصول بدون تثبيت: ${format(
        accessTotal
      )} دعم`
    );

    lines.push("");

    lines.push(
      "بدون تثبيت:"
    );

    lines.push(
      `العميل يرمي: ${format(
        customerWithoutMaintain
      )} دعم`
    );

    lines.push(
      `الدينار: ${format(
        moneyWithout.jod,
        2
      )} JOD`
    );

    lines.push(
      `الدولار: ${format(
        moneyWithout.usd,
        2
      )} USD`
    );

    lines.push("");

    lines.push(
      "مع تثبيت:"
    );

    lines.push(
      `قيمة التثبيت: ${format(
        maintainValue
      )} دعم`
    );

    lines.push(
      `الإجمالي: ${format(
        totalWithMaintain
      )} دعم`
    );

    lines.push(
      `العميل يرمي: ${format(
        customerWithMaintain
      )} دعم`
    );

    lines.push(
      `الدينار: ${format(
        moneyWith.jod,
        2
      )} JOD`
    );

    lines.push(
      `الدولار: ${format(
        moneyWith.usd,
        2
      )} USD`
    );

    lines.push("");

    lines.push(
      settings.developer
    );

    lines.push(
      `Instagram: ${CONTACTS.instagram}`
    );

    navigator.clipboard
      .writeText(
        lines.join("\n")
      )
      .then(() => {
        notify(
          "تم نسخ ملخص الحساب"
        );
      });
  }

  /* =======================================================
     CUSTOMERS
  ======================================================= */

  const filteredCustomers =
    database.customers.filter(
      customer => {
        const q =
          search
            .trim()
            .toLowerCase();

        if (!q) {
          return true;
        }

        return (
          customer.id
            .toLowerCase()
            .includes(q) ||
          customer.name
            .toLowerCase()
            .includes(q)
        );
      }
    );

  function openCustomer(
    customer
  ) {
    const history =
      database.calculations.filter(
        item =>
          item.userId ===
          customer.id
      );

    setSelectedCustomer({
      customer,
      history
    });
  }

  /* =======================================================
     EXPORT
  ======================================================= */

  function exportData() {
    const blob =
      new Blob(
        [
          JSON.stringify(
            database,
            null,
            2
          )
        ],
        {
          type:
            "application/json"
        }
      );

    const url =
      URL.createObjectURL(
        blob
      );

    const link =
      document.createElement(
        "a"
      );

    link.href = url;

    link.download =
      `vip-backup-${new Date()
        .toISOString()
        .slice(0, 10)}.json`;

    link.click();

    URL.revokeObjectURL(
      url
    );

    notify(
      "تم تصدير النسخة الاحتياطية"
    );
  }

  function importData(
    event
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader =
      new FileReader();

    reader.onload = () => {
      try {
        const imported =
          JSON.parse(
            reader.result
          );

        if (
          !imported ||
          typeof imported !==
            "object"
        ) {
          throw new Error();
        }

        updateDatabase({
          ...createInitialDatabase(),
          ...imported,

          settings: {
            ...DEFAULT_SETTINGS,
            ...(imported.settings ||
              {})
          },

          customers:
            Array.isArray(
              imported.customers
            )
              ? imported.customers
              : [],

          calculations:
            Array.isArray(
              imported.calculations
            )
              ? imported.calculations
              : []
        });

        notify(
          "تم استيراد البيانات"
        );
      } catch {
        notify(
          "ملف النسخة غير صالح"
        );
      }
    };

    reader.readAsText(
      file
    );

    event.target.value = "";
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      className={
        darkMode
          ? "app dark"
          : "app light"
      }
    >
      <Header
        settings={settings}
        darkMode={darkMode}
        setDarkMode={
          setDarkMode
        }
      />

      <Navigation
        page={page}
        setPage={setPage}
      />

      {notice && (
        <div className="toast">
          <CheckCircle2 />
          {notice}
        </div>
      )}

      <main className="container">

        {page ===
          "calculator" && (
          <CalculatorPage
            calculator={
              calculator
            }
            settings={
              settings
            }
            transitions={
              transitions
            }
            accessTotal={
              accessTotal
            }
            maintainValue={
              maintainValue
            }
            maintainAmount={
              maintainAmount
            }
            totalWithMaintain={
              totalWithMaintain
            }
            multiplier={
              multiplier
            }
            customerWithoutMaintain={
              customerWithoutMaintain
            }
            customerWithMaintain={
              customerWithMaintain
            }
            moneyWithout={
              moneyWithout
            }
            moneyWith={
              moneyWith
            }
            updateCalculator={
              updateCalculator
            }
            changeCurrentLevel={
              changeCurrentLevel
            }
            changeTargetLevel={
              changeTargetLevel
            }
            updateMissing={
              updateMissing
            }
            saveCalculation={
              saveCalculation
            }
            copySummary={
              copySummary
            }
            resetCalculator={
              resetCalculator
            }
            editingCalculation={
              editingCalculation
            }
          />
        )}

        {page ===
          "customers" && (
          <CustomersPage
            customers={
              filteredCustomers
            }
            search={search}
            setSearch={
              setSearch
            }
            openCustomer={
              openCustomer
            }
            selectedCustomer={
              selectedCustomer
            }
            setSelectedCustomer={
              setSelectedCustomer
            }
            editCalculation={
              editCalculation
            }
            deleteCalculation={
              deleteCalculation
            }
            deleteCustomer={
              deleteCustomer
            }
          />
        )}

        {page ===
          "vip" && (
          <VipPage />
        )}

        {page ===
          "settings" && (
          <SettingsPage
            database={
              database
            }
            updateDatabase={
              updateDatabase
            }
            exportData={
              exportData
            }
            importData={
              importData
            }
            notify={
              notify
            }
          />
        )}

      </main>

      <Footer
        settings={
          settings
        }
      />
    </div>
  );
}

/* =========================================================
   HEADER
========================================================= */

function Header({
  settings,
  darkMode,
  setDarkMode
}) {
  return (
    <header className="topbar">

      <div className="brand-area">

        <div className="brand-mark">
          VIP
        </div>

        <div>
          <h1>
            {settings.siteName}
          </h1>

          <p>
            {settings.siteSubtitle}
          </p>
        </div>

      </div>

      <button
        className="theme-button"
        onClick={() =>
          setDarkMode(
            value => !value
          )
        }
        title="تغيير المظهر"
      >
        {darkMode ? (
          <Sun />
        ) : (
          <Moon />
        )}
      </button>

    </header>
  );
}

/* =========================================================
   NAVIGATION
========================================================= */

function Navigation({
  page,
  setPage
}) {
  const items = [
    {
      id: "calculator",
      label: "الحاسبة",
      icon: Calculator
    },
    {
      id: "customers",
      label: "سجل العملاء",
      icon: Users
    },
    {
      id: "vip",
      label: "جدول VIP",
      icon: ShieldCheck
    },
    {
      id: "settings",
      label: "الإعدادات",
      icon: Settings
    }
  ];

  return (
    <nav className="navigation">

      <div className="nav-inner">

        {items.map(
          item => {
            const Icon =
              item.icon;

            return (
              <button
                key={item.id}
                className={
                  page === item.id
                    ? "nav-item active"
                    : "nav-item"
                }
                onClick={() =>
                  setPage(
                    item.id
                  )
                }
              >
                <Icon />
                <span>
                  {item.label}
                </span>
              </button>
            );
          }
        )}

      </div>

    </nav>
  );
}

/* =========================================================
   CALCULATOR PAGE
========================================================= */

function CalculatorPage({
  calculator,
  settings,
  transitions,
  accessTotal,
  maintainValue,
  maintainAmount,
  totalWithMaintain,
  multiplier,
  customerWithoutMaintain,
  customerWithMaintain,
  moneyWithout,
  moneyWith,
  updateCalculator,
  changeCurrentLevel,
  changeTargetLevel,
  updateMissing,
  saveCalculation,
  copySummary,
  resetCalculator,
  editingCalculation
}) {
  return (
    <section>

      <div className="page-heading">

        <div className="heading-icon red">
          <Calculator />
        </div>

        <div>
          <h2>
            حاسبة VIP
          </h2>

          <p>
            احسب الناقص الحقيقي
            من مستوى إلى مستوى
            بدون جمع المستويات السابقة.
          </p>
        </div>

      </div>

      {/* USER */}

      <div className="panel">

        <PanelTitle
          icon={<UserRound />}
          title="بيانات المستخدم"
        />

        <div className="form-grid three">

          <Input
            label="ID المستخدم"
            value={
              calculator.userId
            }
            onChange={value =>
              updateCalculator(
                "userId",
                value
              )
            }
            placeholder="أدخل ID الحساب"
          />

          <Input
            label="اسم المستخدم"
            value={
              calculator.userName
            }
            onChange={value =>
              updateCalculator(
                "userName",
                value
              )
            }
            placeholder="أدخل اسم المستخدم"
          />

          <Select
            label="المستوى الحالي"
            value={
              calculator.currentLevel
            }
            onChange={
              changeCurrentLevel
            }
          >
            {VIP_TABLE.map(
              item => (
                <option
                  key={
                    item.level
                  }
                  value={
                    item.level
                  }
                >
                  VIP ×
                  {
                    item.level
                  }
                </option>
              )
            )}
          </Select>

        </div>

      </div>

      {/* LEVEL SELECTION */}

      <div className="panel">

        <PanelTitle
          icon={<ShieldCheck />}
          title="اختيار المستوى والعرض"
        />

        <div className="form-grid two">

          <Select
            label="الوصول إلى"
            value={
              calculator.targetLevel
            }
            onChange={
              changeTargetLevel
            }
          >
            {VIP_TABLE.filter(
              item =>
                item.level >
                number(
                  calculator.currentLevel
                )
            ).map(
              item => (
                <option
                  key={
                    item.level
                  }
                  value={
                    item.level
                  }
                >
                  VIP ×
                  {
                    item.level
                  }
                </option>
              )
            )}
          </Select>

          <div className="field">

            <label>
              عرض الشحن
            </label>

            <div className="multiplier-grid">

              {Array.from(
                {
                  length: 10
                },
                (_, index) =>
                  index + 1
              ).map(
                value => (
                  <button
                    key={value}
                    className={
                      calculator.multiplier ===
                      value
                        ? "multiplier active"
                        : "multiplier"
                    }
                    onClick={() =>
                      updateCalculator(
                        "multiplier",
                        value
                      )
                    }
                  >
                    ×{value}
                  </button>
                )
              )}

            </div>

          </div>

        </div>

      </div>

      {/* TRANSITIONS */}

      <div className="panel">

        <div className="panel-title-row">

          <PanelTitle
            icon={
              <ArrowLeftRight />
            }
            title="الناقص لكل انتقال"
          />

          <span className="small-label">
            أدخل الناقص الحقيقي
          </span>

        </div>

        <div className="transitions">

          {transitions.length ===
          0 ? (
            <div className="empty-inline">
              اختر مستوى مستهدف أعلى
              من المستوى الحالي.
            </div>
          ) : (
            transitions.map(
              (transition, index) => (
                <div
                  className="transition-row"
                  key={
                    transition.id
                  }
                >

                  <div className="transition-number">
                    {index + 1}
                  </div>

                  <div className="vip-from">
                    VIP ×
                    {
                      transition.from
                    }
                  </div>

                  <ChevronLeft />

                  <div className="vip-to">
                    VIP ×
                    {
                      transition.to
                    }
                  </div>

                  <div className="missing-input">

                    <label>
                      الناقص
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={
                        transition.missing
                      }
                      onChange={event =>
                        updateMissing(
                          transition.id,
                          event.target
                            .value
                        )
                      }
                      placeholder="0"
                    />

                  </div>

                </div>
              )
            )
          )}

        </div>

        <div className="access-total">

          <div>
            <span>
              إجمالي الوصول
            </span>

            <small>
              بدون تثبيت
            </small>
          </div>

          <strong>
            {format(
              accessTotal
            )}
          </strong>

          <span>
            دعم
          </span>

        </div>

      </div>

      {/* MAINTAIN */}

      <div className="maintain-panel">

        <div>

          <div className="maintain-title">
            <ShieldCheck />
            تثبيت المستوى
          </div>

          <p>
            عند تفعيل التثبيت تتم إضافة
            قيمة الحفاظ على المستوى
            المستهدف فقط.
          </p>

        </div>

        <label className="switch">

          <input
            type="checkbox"
            checked={
              calculator.maintainEnabled
            }
            onChange={event =>
              updateCalculator(
                "maintainEnabled",
                event.target.checked
              )
            }
          />

          <span></span>

        </label>

        <div className="maintain-value">

          <small>
            تثبيت VIP ×
            {
              calculator.targetLevel
            }
          </small>

          <strong>
            {format(
              maintainValue
            )}
          </strong>

          <small>
            دعم
          </small>

        </div>

      </div>

      {/* RESULTS */}

      <div className="results-grid">

        <ResultCard
          title="بدون تثبيت"
          icon={
            <Calculator />
          }
          rows={[
            [
              "إجمالي الوصول",
              `${format(
                accessTotal
              )} دعم`
            ],
            [
              "العرض",
              `×${multiplier}`
            ],
            [
              "المطلوب من العميل",
              `${format(
                customerWithoutMaintain
              )} دعم`
            ],
            [
              "ما أشحنه للعميل",
              `${format(
                accessTotal
              )} دعم`
            ],
            [
              "القيمة بالدينار",
              `${format(
                moneyWithout.jod,
                2
              )} JOD`
            ],
            [
              "القيمة بالدولار",
              `${format(
                moneyWithout.usd,
                2
              )} USD`
            ]
          ]}
        />

        <ResultCard
          highlight
          title="مع تثبيت"
          icon={
            <ShieldCheck />
          }
          rows={[
            [
              "إجمالي الوصول",
              `${format(
                accessTotal
              )} دعم`
            ],
            [
              "قيمة التثبيت",
              `${format(
                maintainAmount
              )} دعم`
            ],
            [
              "الإجمالي",
              `${format(
                totalWithMaintain
              )} دعم`
            ],
            [
              "العرض",
              `×${multiplier}`
            ],
            [
              "المطلوب من العميل",
              `${format(
                customerWithMaintain
              )} دعم`
            ],
            [
              "ما أشحنه للعميل",
              `${format(
                totalWithMaintain
              )} دعم`
            ],
            [
              "القيمة بالدينار",
              `${format(
                moneyWith.jod,
                2
              )} JOD`
            ],
            [
              "القيمة بالدولار",
              `${format(
                moneyWith.usd,
                2
              )} USD`
            ]
          ]}
        />

      </div>

      {/* ACTIONS */}

      <div className="actions">

        <button
          className="primary-action"
          onClick={
            saveCalculation
          }
        >
          <Save />
          {editingCalculation
            ? "حفظ التعديل"
            : "حفظ العملية"}
        </button>

        <button
          className="secondary-action"
          onClick={
            copySummary
          }
        >
          <Copy />
          نسخ الملخص
        </button>

        <button
          className="secondary-action"
          onClick={
            resetCalculator
          }
        >
          <RotateCcw />
          حساب جديد
        </button>

      </div>

      {/* PRICE NOTE */}

      <div className="price-note">

        <div>
          <strong>
            أسعار الحساب الحالية
          </strong>

          <span>
            مليون دعم =
            {format(
              settings.supportPerMillion
            )} دعم
          </span>

          <span>
            {format(
              settings.jodPerMillion,
              2
            )} JOD
          </span>

          <span>
            {format(
              settings.usdPerMillion,
              2
            )} USD
          </span>
        </div>

        <Settings />

      </div>

    </section>
  );
}

/* =========================================================
   RESULT CARD
========================================================= */

function ResultCard({
  title,
  icon,
  rows,
  highlight
}) {
  return (
    <div
      className={
        highlight
          ? "result-card highlight"
          : "result-card"
      }
    >

      <div className="result-header">

        <div className="result-icon">
          {icon}
        </div>

        <h3>
          {title}
        </h3>

      </div>

      <div className="result-rows">

        {rows.map(
          ([label, value]) => (
            <div
              className="result-row"
              key={label}
            >
              <span>
                {label}
              </span>

              <strong>
                {value}
              </strong>
            </div>
          )
        )}

      </div>

    </div>
  );
}

/* =========================================================
   CUSTOMERS
========================================================= */

function CustomersPage({
  customers,
  search,
  setSearch,
  openCustomer,
  selectedCustomer,
  setSelectedCustomer,
  editCalculation,
  deleteCalculation,
  deleteCustomer
}) {
  return (
    <section>

      <div className="page-heading">

        <div className="heading-icon">
          <Users />
        </div>

        <div>
          <h2>
            سجل العملاء
          </h2>

          <p>
            كل عميل محفوظ بواسطة
            ID الخاص به.
          </p>
        </div>

      </div>

      <div className="search-box">

        <Search />

        <input
          value={search}
          onChange={event =>
            setSearch(
              event.target.value
            )
          }
          placeholder="ابحث بالـ ID أو اسم المستخدم"
        />

      </div>

      {customers.length ===
      0 ? (
        <div className="empty-state">

          <Database />

          <h3>
            لا يوجد عملاء
          </h3>

          <p>
            عند حفظ أول عملية
            سيظهر العميل هنا.
          </p>

        </div>
      ) : (
        <div className="customer-grid">

          {customers.map(
            customer => (
              <div
                className="customer-card"
                key={
                  customer.id
                }
              >

                <div className="customer-top">

                  <div className="customer-avatar">
                    <UserRound />
                  </div>

                  <div>
                    <h3>
                      {
                        customer.name ||
                        "بدون اسم"
                      }
                    </h3>

                    <code>
                      {
                        customer.id
                      }
                    </code>
                  </div>

                </div>

                <div className="customer-info">

                  <span>
                    العمليات:
                    {" "}
                    {
                      /* count is computed in parent data via history */
                    }
                  </span>

                </div>

                <div className="customer-actions">

                  <button
                    onClick={() =>
                      openCustomer(
                        customer
                      )
                    }
                  >
                    <History />
                    السجل
                  </button>

                  <button
                    className="delete-button"
                    onClick={() =>
                      deleteCustomer(
                        customer.id
                      )
                    }
                  >
                    <Trash2 />
                    حذف
                  </button>

                </div>

              </div>
            )
          )}

        </div>
      )}

      {selectedCustomer && (
        <CustomerModal
          selectedCustomer={
            selectedCustomer
          }
          close={() =>
            setSelectedCustomer(
              null
            )
          }
          editCalculation={
            editCalculation
          }
          deleteCalculation={
            deleteCalculation
          }
        />
      )}

    </section>
  );
}

/* =========================================================
   CUSTOMER MODAL
========================================================= */

function CustomerModal({
  selectedCustomer,
  close,
  editCalculation,
  deleteCalculation
}) {
  const {
    customer,
    history
  } = selectedCustomer;

  return (
    <div
      className="modal-overlay"
      onClick={close}
    >

      <div
        className="customer-modal"
        onClick={event =>
          event.stopPropagation()
        }
      >

        <button
          className="modal-close"
          onClick={close}
        >
          <X />
        </button>

        <div className="modal-header">

          <div className="customer-avatar large">
            <UserRound />
          </div>

          <div>
            <h2>
              {
                customer.name ||
                "بدون اسم"
              }
            </h2>

            <code>
              {
                customer.id
              }
            </code>
          </div>

        </div>

        <div className="history-count">
          {history.length}
          {" "}
          عملية محفوظة
        </div>

        <div className="history-list">

          {history.length ===
          0 ? (
            <div className="empty-inline">
              لا توجد عمليات.
            </div>
          ) : (
            history.map(
              (record, index) => (
                <div
                  className="history-card"
                  key={
                    record.id
                  }
                >

                  <div className="history-main">

                    <strong>
                      عملية #
                      {
                        String(
                          index + 1
                        ).padStart(
                          4,
                          "0"
                        )
                      }
                    </strong>

                    <span>
                      {new Date(
                        record.createdAt
                      ).toLocaleString(
                        "ar-EG"
                      )}
                    </span>

                  </div>

                  <div className="history-details">

                    <span>
                      VIP ×
                      {
                        record.currentLevel
                      }
                      {" → "}
                      VIP ×
                      {
                        record.targetLevel
                      }
                    </span>

                    <span>
                      العرض ×
                      {
                        record.multiplier
                      }
                    </span>

                    <span>
                      الوصول:
                      {" "}
                      {format(
                        record.accessTotal
                      )}
                    </span>

                    <span>
                      العميل:
                      {" "}
                      {format(
                        record.customerWithoutMaintain
                      )}
                    </span>

                  </div>

                  <div className="history-actions">

                    <button
                      onClick={() =>
                        editCalculation(
                          record
                        )
                      }
                    >
                      <Edit3 />
                      فتح وتعديل
                    </button>

                    <button
                      className="delete-button"
                      onClick={() =>
                        deleteCalculation(
                          record.id
                        )
                      }
                    >
                      <Trash2 />
                      حذف
                    </button>

                  </div>

                </div>
              )
            )
          )}

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   VIP PAGE
========================================================= */

function VipPage() {
  return (
    <section>

      <div className="page-heading">

        <div className="heading-icon gold">
          <ShieldCheck />
        </div>

        <div>
          <h2>
            جدول VIP
          </h2>

          <p>
            جدول المستويات المرجعي
            من VIP 1 إلى VIP 20.
          </p>
        </div>

      </div>

      <div className="vip-table-container">

        <table className="vip-table">

          <thead>

            <tr>
              <th>
                المستوى
              </th>

              <th>
                إجمالي الشحن
              </th>

              <th>
                XP للترقية
              </th>

              <th>
                XP للحفاظ
              </th>
            </tr>

          </thead>

          <tbody>

            {VIP_TABLE.map(
              item => (
                <tr
                  key={
                    item.level
                  }
                >

                  <td>
                    <span className="vip-badge">
                      ×
                      {
                        item.level
                      }
                    </span>
                  </td>

                  <td>
                    {format(
                      item.total
                    )}
                  </td>

                  <td>
                    {format(
                      item.upgrade
                    )}
                  </td>

                  <td>
                    {format(
                      item.maintain
                    )}
                  </td>

                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

    </section>
  );
}

/* =========================================================
   SETTINGS
========================================================= */

function SettingsPage({
  database,
  updateDatabase,
  exportData,
  importData,
  notify
}) {
  const [
    settings,
    setSettings
  ] = useState(
    database.settings
  );

  useEffect(() => {
    setSettings(
      database.settings
    );
  }, [database.settings]);

  function update(
    key,
    value
  ) {
    setSettings(
      previous => ({
        ...previous,
        [key]: value
      })
    );
  }

  function saveSettings() {
    updateDatabase({
      ...database,
      settings
    });

    notify(
      "تم حفظ الإعدادات"
    );
  }

  function resetAllData() {
    if (
      !window.confirm(
        "سيتم حذف جميع العملاء والعمليات. هل أنت متأكد؟"
      )
    ) {
      return;
    }

    const fresh =
      createInitialDatabase();

    updateDatabase(
      fresh
    );

    setSettings(
      fresh.settings
    );

    notify(
      "تم حذف جميع البيانات"
    );
  }

  return (
    <section>

      <div className="page-heading">

        <div className="heading-icon">
          <Settings />
        </div>

        <div>
          <h2>
            الإعدادات
          </h2>

          <p>
            عدّل بيانات الموقع
            وأسعار الحساب.
          </p>
        </div>

      </div>

      {/* SITE */}

      <div className="panel">

        <PanelTitle
          icon={
            <Settings />
          }
          title="بيانات الموقع"
        />

        <div className="form-grid two">

          <Input
            label="اسم الموقع"
            value={
              settings.siteName
            }
            onChange={value =>
              update(
                "siteName",
                value
              )
            }
          />

          <Input
            label="الوصف"
            value={
              settings.siteSubtitle
            }
            onChange={value =>
              update(
                "siteSubtitle",
                value
              )
            }
          />

          <Input
            label="اسم المطور"
            value={
              settings.developer
            }
            onChange={value =>
              update(
                "developer",
                value
              )
            }
          />

        </div>

      </div>

      {/* PRICES */}

      <div className="panel">

        <PanelTitle
          icon={
            <ArrowLeftRight />
          }
          title="أسعار الحساب"
        />

        <div className="form-grid three">

          <Input
            type="number"
            label="كم دعم لكل مليون"
            value={
              settings.supportPerMillion
            }
            onChange={value =>
              update(
                "supportPerMillion",
                value
              )
            }
          />

          <Input
            type="number"
            label="سعر مليون الدعم بالدينار"
            value={
              settings.jodPerMillion
            }
            onChange={value =>
              update(
                "jodPerMillion",
                value
              )
            }
          />

          <Input
            type="number"
            label="سعر مليون الدعم بالدولار"
            value={
              settings.usdPerMillion
            }
            onChange={value =>
              update(
                "usdPerMillion",
                value
              )
            }
          />

        </div>

        <div className="setting-help">

          مثال:

          إذا كان:

          <b>
            130000 دعم = مليون
          </b>

          والسعر:

          <b>
            11 دينار
          </b>

          و:

          <b>
            15 دولار
          </b>

          يتم استخدام هذه القيم
          تلقائيًا في الحاسبة.

        </div>

      </div>

      {/* CONTACT */}

      <div className="panel">

        <PanelTitle
          icon={
            <MessageCircle />
          }
          title="بيانات التواصل"
        />

        <div className="contact-fixed">

          <div>
            <strong>
              ID غليص
            </strong>
            <span>
              {CONTACTS.ghlisId}
            </span>
          </div>

          <div>
            <strong>
              ID F90
            </strong>
            <span>
              {CONTACTS.f90Id}
            </span>
          </div>

          <div>
            <strong>
              ID لورد
            </strong>
            <span>
              {CONTACTS.lordId}
            </span>
          </div>

          <div>
            <strong>
              ID الداعم
            </strong>
            <span>
              {CONTACTS.supporterId}
            </span>
          </div>

          <div>
            <strong>
              واتساب غليص
            </strong>
            <span>
              {CONTACTS.ghlisWhatsapp}
            </span>
          </div>

          <div>
            <strong>
              واتساب F90
            </strong>
            <span>
              {CONTACTS.f90Whatsapp}
            </span>
          </div>

          <div>
            <strong>
              واتساب لورد
            </strong>
            <span>
              {CONTACTS.lordWhatsapp}
            </span>
          </div>

          <div>
            <strong>
              Instagram
            </strong>
            <span>
              {CONTACTS.instagram}
            </span>
          </div>

        </div>

      </div>

      {/* BACKUP */}

      <div className="panel">

        <PanelTitle
          icon={
            <Database />
          }
          title="النسخ الاحتياطي"
        />

        <p className="setting-description">
          احفظ نسخة من العملاء
          والعمليات والإعدادات حتى
          تستطيع استعادتها لاحقًا.
        </p>

        <div className="actions">

          <button
            className="secondary-action"
            onClick={
              exportData
            }
          >
            <Download />
            تصدير البيانات
          </button>

          <label className="secondary-action file-label">

            <Upload />
            استيراد البيانات

            <input
              type="file"
              accept=".json,application/json"
              onChange={
                importData
              }
            />

          </label>

          <button
            className="delete-button large-button"
            onClick={
              resetAllData
            }
          >
            <Trash2 />
            حذف جميع البيانات
          </button>

        </div>

      </div>

      <div className="actions">

        <button
          className="primary-action"
          onClick={
            saveSettings
          }
        >
          <Save />
          حفظ الإعدادات
        </button>

      </div>

    </section>
  );
}

/* =========================================================
   SMALL COMPONENTS
========================================================= */

function PanelTitle({
  icon,
  title
}) {
  return (
    <div className="panel-title">

      <div className="panel-title-icon">
        {icon}
      </div>

      <h3>
        {title}
      </h3>

    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text"
}) {
  return (
    <div className="field">

      <label>
        {label}
      </label>

      <input
        type={type}
        value={
          value ?? ""
        }
        onChange={event =>
          onChange(
            event.target.value
          )
        }
        placeholder={
          placeholder
        }
      />

    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  children
}) {
  return (
    <div className="field">

      <label>
        {label}
      </label>

      <select
        value={value}
        onChange={event =>
          onChange(
            event.target.value
          )
        }
      >
        {children}
      </select>

    </div>
  );
}

/* =========================================================
   FOOTER
========================================================= */

function Footer({
  settings
}) {
  return (
    <footer className="footer">

      <div className="footer-main">
        {settings.developer}
      </div>

      <div className="footer-instagram">

        <Instagram />

        Instagram:
        {" "}
        {CONTACTS.instagram}

      </div>

      <div className="footer-contacts">

        <span>
          غليص:
          {" "}
          {CONTACTS.ghlisWhatsapp}
        </span>

        <span>
          F90:
          {" "}
          {CONTACTS.f90Whatsapp}
        </span>

        <span>
          لورد:
          {" "}
          {CONTACTS.lordWhatsapp}
        </span>

      </div>

    </footer>
  );
  }
