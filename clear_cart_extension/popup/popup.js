(function () {
  "use strict";

  const I18N = {
    en: {
      highlight: "Highlight",
      scoreLabel: "Transparency Score",
      breakdownHeading: "Pattern Breakdown",
      clearFilter: "Clear filter",
      trapsHeading: "Detected Traps",
      itemSingular: "item",
      itemPlural: "items",
      recommended: "Recommended:",
      locate: "Locate and outline on page",
      noTrapsTitle: "No deceptive patterns detected.",
      noTrapsDesc: "This page passed all local heuristic checks without manipulative urgency, pre-selected add-ons, or deceptive opt-outs.",
      noCatTitle: "No detections in this category.",
      noCatDesc: "Select another category above or clear the filter.",
      appearance: "APPEARANCE",
      backToScan: "Back to scan",
      theme: "Theme",
      light: "Light",
      dark: "Dark",
      system: "System",
      language: "Language",
      detection: "DETECTION",
      autoScan: "Auto-scan pages",
      autoScanSub: "Check every page when it loads",
      highlightTraps: "Highlight traps on page",
      highlightTrapsSub: "Mark deceptive elements",
      testDemo: "Test demo site",
      testDemoSub: "Open the ShadyMart test store",
      open: "Open",
      privacy: "PRIVACY",
      onDevice: "100% on-device and private",
      onDeviceSub: "Your browsing never leaves this device.",
      clearHistory: "Clear scan history",
      historyCleared: "Scan history cleared",
      footer: "100% On-Device & Private",
      summaryNone: "No manipulative checkout flows, hidden charges, or urgency indicators detected on this page.",
      summaryMid: "Some persuasive or opt-out patterns detected. Verify optional add-ons and terms before checkout.",
      summaryHigh: "Multiple high-pressure or deceptive patterns detected. Inspect every line item before purchasing.",
      categories: {
        "urgency-scarcity": "Urgency & Scarcity",
        "social-proof": "Social Proof",
        "confirmshaming": "Confirmshaming",
        "sneak-into-basket": "Sneak Into Basket",
        "threshold-trap": "Threshold Trap",
        "checkout-upsell": "Checkout Upsell",
        "hidden-details": "Hidden Details"
      },
      severity: { HIGH: "HIGH", MEDIUM: "MEDIUM", LOW: "LOW" },
      grades: { A: "Transparent", B: "Low Risk", C: "Moderate Risk", D: "Deceptive Patterns", F: "High Manipulation" },
      traps: {}
    },
    es: {
      highlight: "Resaltar",
      scoreLabel: "Índice de Transparencia",
      breakdownHeading: "Desglose de Patrones",
      clearFilter: "Quitar filtro",
      trapsHeading: "Trampas Detectadas",
      itemSingular: "elemento",
      itemPlural: "elementos",
      recommended: "Recomendado:",
      locate: "Localizar y resaltar en página",
      noTrapsTitle: "No se detectaron patrones engañosos.",
      noTrapsDesc: "Esta página superó las comprobaciones locales sin urgencia manipuladora ni complementos preseleccionados.",
      noCatTitle: "Sin detecciones en esta categoría.",
      noCatDesc: "Selecciona otra categoría arriba o quita el filtro.",
      appearance: "APARIENCIA",
      backToScan: "Volver al análisis",
      theme: "Tema",
      light: "Claro",
      dark: "Oscuro",
      system: "Sistema",
      language: "Idioma",
      detection: "DETECCIÓN",
      autoScan: "Auto-analizar páginas",
      autoScanSub: "Comprobar cada página al cargar",
      highlightTraps: "Resaltar trampas en página",
      highlightTrapsSub: "Marcar elementos engañosos",
      testDemo: "Sitio de prueba",
      testDemoSub: "Abrir tienda de pruebas ShadyMart",
      open: "Abrir",
      privacy: "PRIVACIDAD",
      onDevice: "100% local y privado",
      onDeviceSub: "Tu navegación nunca sale de este dispositivo.",
      clearHistory: "Borrar historial de análisis",
      historyCleared: "Historial borrado",
      footer: "100% Local y Privado",
      summaryNone: "No se detectaron flujos de pago manipuladores, cargos ocultos ni indicadores de urgencia en esta página.",
      summaryMid: "Se detectaron algunos patrones persuasivos o de rechazo. Verifica los complementos y términos antes de pagar.",
      summaryHigh: "Se detectaron varios patrones engañosos o de alta presión. Revisa cada artículo antes de comprar.",
      categories: {
        "urgency-scarcity": "Urgencia y Escasez",
        "social-proof": "Prueba Social",
        "confirmshaming": "Culpa Inducida",
        "sneak-into-basket": "Añadido Oculto",
        "threshold-trap": "Trampa de Umbral",
        "checkout-upsell": "Venta en Pago",
        "hidden-details": "Detalles Ocultos"
      },
      severity: { HIGH: "ALTA", MEDIUM: "MEDIA", LOW: "BAJA" },
      grades: { A: "Transparente", B: "Riesgo Bajo", C: "Riesgo Moderado", D: "Patrones Engañosos", F: "Alta Manipulación" },
      traps: {
        "Countdown Timer Pressure": { name: "Presión por Temporizador de Cuenta Regresiva", description: "Muestra un temporizador o plazo corto que puede generar presión de tiempo.", action: "Comprueba si el temporizador se reinicia al recargar la página." },
        "High-Pressure Urgency Banner": { name: "Banner de Urgencia de Alta Presión", description: "Utiliza lenguaje promocional de alta urgencia que puede acelerar decisiones.", action: "Tómate tiempo para comparar precios en otros comercios." },
        "Artificial Scarcity Alert": { name: "Alerta de Escasez Artificial", description: "Muestra un aviso de bajo inventario indicando pocas unidades restantes.", action: "Verifica si el aviso de inventario refleja stock real." },
        "Exaggerated Savings / Price Anchoring": { name: "Ahorro Exagerado / Anclaje de Precio", description: "Destaca descuentos elevados o precios tachados de referencia.", action: "Consulta el historial de precios antes de comprar." },
        "High-Demand / Viewer Pressure": { name: "Presión por Alta Demanda / Visitantes", description: "Muestra contadores en vivo de visitantes o carritos no verificables.", action: "Evalúa el producto por sus características y precio." },
        "Confirmshaming Opt-Out": { name: "Rechazo con Culpa Inducida (Confirmshaming)", description: "Usa un lenguaje culpabilizador en el botón de rechazo.", action: "Rechaza la oferta de forma neutra si no la deseas." },
        "Pre-Checked Add-on or Subscription": { name: "Complemento o Suscripción Preseleccionada", description: "Un extra pagado o suscripción aparece marcado por defecto.", action: "Desmarca cualquier complemento que no desees." },
        "Spending Threshold Trap (Basket Padding)": { name: "Trampa de Umbral de Gasto", description: "Invita a añadir artículos para alcanzar envío gratis o reembolso.", action: "Compara si los artículos extra cuestan más que el beneficio." },
        "Intrusive Subscription / Co-Brand Push": { name: "Impulso Intrusivo de Suscripción", description: "Promociona membresías recurrentes junto a las acciones de pago.", action: "Revisa las tarifas recurrentes antes de aceptar." },
        "Checkout Nagging / Impulse Add-On": { name: "Extra Impulsivo en el Pago", description: "Presenta servicios opcionales o cargos adicionales durante el pago.", action: "Verifica si los cargos por manejo prioritario son opcionales." },
        "Obscured Auto-Renewal Terms": { name: "Términos Ocultos de Renovación Automática", description: "Incluye cobros recurrentes o restricciones de devolución en letra pequeña.", action: "Lee la frecuencia de renovación y devoluciones antes de pagar." },
        "Disguised / Low-Contrast Opt-Out": { name: "Opción de Rechazo de Bajo Contraste", description: "Muestra el rechazo en texto muy pequeño u opacidad reducida.", action: "Busca enlaces pequeños o tenues si deseas rechazar ofertas." },
        "Fake Countdown Timer": { name: "Temporizador de Cuenta Regresiva Falso", description: "Utiliza un temporizador para crear presión artificial de tiempo.", action: "Verifica si el temporizador se reinicia al recargar la página." },
        "Artificial Low-Stock Scarcity": { name: "Escasez Artificial de Inventario", description: "Asegura que quedan muy pocas unidades sin cifras verificadas.", action: "Compara disponibilidad estándar con otros vendedores." },
        "Unverified Live Viewer Counter": { name: "Contador de Visitantes No Verificado", description: "Muestra cifras simuladas de visitantes para fabricar demanda.", action: "Ignora los contadores en vivo al evaluar si lo necesitas." },
        "Confirmshaming Decline Copy": { name: "Texto de Rechazo Culpabilizador", description: "Usa lenguaje que induce culpa en el botón de rechazo.", action: "Rechaza la oferta directamente si no la deseas." },
        "Pre-Selected Paid Add-On or Warranty": { name: "Complemento o Garantía Preseleccionada", description: "Marca automáticamente un extra pagado salvo que lo desactives.", action: "Desmarca cualquier complemento antes de pagar." },
        "Threshold Trap / Basket Padding": { name: "Trampa de Umbral / Relleno de Carrito", description: "Te anima a gastar más para alcanzar un umbral de envío o reembolso.", action: "Calcula si el artículo extra cuesta más que el beneficio." },
        "Checkout Upsell Fee": { name: "Cargo Adicional en el Pago", description: "Inserta mejoras opcionales de manejo durante el pago.", action: "Elige envío estándar salvo que necesites envío urgente." },
        "Hidden Auto-Renewal / Recurring Terms": { name: "Renovación Automática Oculta", description: "Oculta cobros recurrentes en letra pequeña de bajo contraste.", action: "Lee la frecuencia de renovación y cancelación antes de pagar." }
      }
    },
    hi: {
      highlight: "हाइलाइट",
      scoreLabel: "पारदर्शिता स्कोर",
      breakdownHeading: "पैटर्न विवरण",
      clearFilter: "फ़िल्टर हटाएं",
      trapsHeading: "पहचाने गए ट्रैप",
      itemSingular: "आइटम",
      itemPlural: "आइटम",
      recommended: "सुझाव:",
      locate: "पेज पर खोजें और चिह्नित करें",
      noTrapsTitle: "कोई भ्रामक पैटर्न नहीं मिला।",
      noTrapsDesc: "इस पेज ने बिना किसी नकली जल्दबाजी या छुपे हुए शुल्क के सभी स्थानीय नियम पास कर लिए हैं।",
      noCatTitle: "इस श्रेणी में कोई पहचान नहीं।",
      noCatDesc: "सभी परिणाम देखने के लिए ऊपर दूसरी श्रेणी चुनें या फ़िल्टर हटाएं।",
      appearance: "दिखावट",
      backToScan: "स्कैन पर वापस जाएं",
      theme: "थीम",
      light: "लाइट",
      dark: "डार्क",
      system: "सिस्टम",
      language: "भाषा",
      detection: "पहचान",
      autoScan: "पेज स्वतः स्कैन करें",
      autoScanSub: "हर पेज लोड होने पर जांचें",
      highlightTraps: "पेज पर ट्रैप हाइलाइट करें",
      highlightTrapsSub: "भ्रामक तत्वों को चिह्नित करें",
      testDemo: "डेमो साइट जांचें",
      testDemoSub: "ShadyMart टेस्ट स्टोर खोलें",
      open: "खोलें",
      privacy: "गोपनीयता",
      onDevice: "100% डिवाइस पर और निजी",
      onDeviceSub: "आपकी ब्राउज़िंग कभी इस डिवाइस से बाहर नहीं जाती।",
      clearHistory: "स्कैन इतिहास साफ़ करें",
      historyCleared: "स्कैन इतिहास साफ़ हो गया",
      footer: "100% ऑन-डिवाइस और निजी",
      summaryNone: "इस पेज पर कोई भ्रामक चेकआउट प्रवाह, छुपे शुल्क या जल्दबाजी के संकेत नहीं मिले।",
      summaryMid: "कुछ प्रभावित करने वाले या अस्वीकृति से जुड़े पैटर्न मिले। भुगतान से पहले ऐड-ऑन और शर्तें जांचें।",
      summaryHigh: "कई उच्च-दबाव या भ्रामक पैटर्न मिले। खरीदने से पहले हर आइटम जांचें।",
      categories: {
        "urgency-scarcity": "जल्दबाजी और कमी",
        "social-proof": "सोशल प्रूफ",
        "confirmshaming": "गिल्ट दबाव",
        "sneak-into-basket": "छुपा हुआ ऐड-ऑन",
        "threshold-trap": "थ्रेशोल्ड ट्रैप",
        "checkout-upsell": "चेकआउट अपसेल",
        "hidden-details": "छुपी हुई शर्तें"
      },
      severity: { HIGH: "उच्च", MEDIUM: "मध्यम", LOW: "कम" },
      grades: { A: "पारदर्शी", B: "कम जोखिम", C: "मध्यम जोखिम", D: "भ्रामक पैटर्न", F: "अत्यधिक हेरफेर" },
      traps: {
        "Countdown Timer Pressure": { name: "काउंटडाउन टाइमर दबाव", description: "समय का दबाव बनाने वाला काउंटडाउन टाइमर या छोटी समय-सीमा दिखाता है।", action: "जांचें कि पेज रीलोड पर टाइमर रीसेट होता है या नहीं।" },
        "High-Pressure Urgency Banner": { name: "उच्च-दबाव तात्कालिकता बैनर", description: "तेज़ी से खरीदारी करने के लिए अत्यावश्यक प्रचार शब्दों का उपयोग करता है।", action: "अन्य विक्रेताओं से कीमतों की तुलना करने के लिए समय लें।" },
        "Artificial Scarcity Alert": { name: "कृत्रिम कमी की चेतावनी", description: "कम स्टॉक की सूचना दिखाता है जिसमें बहुत कम इकाइयां शेष होने का दावा है।", action: "जांचें कि स्टॉक चेतावनी वास्तविक उपलब्धता दर्शाती है या नहीं।" },
        "Exaggerated Savings / Price Anchoring": { name: "अतिशयोक्तिपूर्ण बचत / मूल्य एंकरिंग", description: "भारी छूट या कटे हुए संदर्भ मूल्य को उजागर करता है।", action: "खरीदने से पहले कीमत इतिहास जांचें।" },
        "High-Demand / Viewer Pressure": { name: "उच्च मांग / व्यूअर दबाव", description: "लाइव दर्शक या कार्ट गतिविधि काउंटर दिखाता है जिन्हें सत्यापित नहीं किया जा सकता।", action: "उत्पाद की गुणवत्ता और कीमत के आधार पर निर्णय लें।" },
        "Confirmshaming Opt-Out": { name: "गिल्ट-आधारित अस्वीकृति विकल्प", description: "ऑफर अस्वीकार करने वाले बटन पर शर्मिंदगी वाली भाषा का उपयोग करता है।", action: "यदि ऑफर नहीं चाहिए तो बिना झिझक अस्वीकार करें।" },
        "Pre-Checked Add-on or Subscription": { name: "पहले से चुना गया ऐड-ऑन या सब्सक्रिप्शन", description: "सशुल्क ऐड-ऑन या सुरक्षा योजना डिफ़ॉल्ट रूप से टिक रहती है।", action: "भुगतान से पहले अनचाहे ऐड-ऑन अनचेक करें।" },
        "Spending Threshold Trap (Basket Padding)": { name: "खर्च सीमा ट्रैप (बास्केट पैडिंग)", description: "मुफ्त शिपिंग या कैशबैक के लिए अधिक सामान जोड़ने को प्रोत्साहित करता है।", action: "जांचें कि अतिरिक्त आइटम की कीमत लाभ से अधिक तो नहीं है।" },
        "Intrusive Subscription / Co-Brand Push": { name: "हस्तक्षेपकारी सब्सक्रिप्शन ऑफर", description: "सामान्य चेकआउट विकल्पों के साथ आवर्ती सदस्यता का प्रचार करता है।", action: "सदस्यता चुनने से पहले आवर्ती शुल्क ध्यान से जांचें।" },
        "Checkout Nagging / Impulse Add-On": { name: "चेकआउट में अतिरिक्त शुल्क / ऐड-ऑन", description: "चेकआउट के दौरान वैकल्पिक सेवाएं या अतिरिक्त शुल्क जोड़ता है।", action: "जांचें कि प्रायोरिटी हैंडलिंग या प्रोटेक्शन शुल्क वैकल्पिक हैं या नहीं।" },
        "Obscured Auto-Renewal Terms": { name: "छुपी हुई ऑटो-रिन्यूअल शर्तें", description: "छोटे अक्षरों में ऑटो-रिन्यूअल शुल्क या सख्त रिफंड शर्तें रखता है।", action: "भुगतान से पहले रिन्यूअल अवधि और रिटर्न नीति पढ़ें।" },
        "Disguised / Low-Contrast Opt-Out": { name: "कम-कंट्रास्ट अस्वीकृति विकल्प", description: "अस्वीकृति लिंक को बहुत छोटे टेक्स्ट या कम अपारदर्शिता में दिखाता है।", action: "ऑफर अस्वीकार करते समय छोटे या हल्के लिंक ध्यान से देखें।" },
        "Fake Countdown Timer": { name: "नकली काउंटडाउन टाइमर", description: "कृत्रिम समय दबाव बनाने के लिए टिक-टिक टाइमर दिखाता है।", action: "खरीदने से पहले जांचें कि पेज रीलोड पर टाइमर रीसेट होता है या नहीं।" },
        "Artificial Low-Stock Scarcity": { name: "कृत्रिम कम स्टॉक चेतावनी", description: "सत्यापित आंकड़ों के बिना सीमित स्टॉक का डर दिखाता है।", action: "अन्य विक्रेताओं के पास उपलब्धता की तुलना करें।" },
        "Unverified Live Viewer Counter": { name: "असत्यापित लाइव व्यूअर काउंटर", description: "कृत्रिम मांग दिखाने के लिए सिम्युलेट किए गए व्यूअर आंकड़े दिखाता है।", action: "खरीदारी तय करते समय लाइव व्यूअर बैज को नजरअंदाज करें।" },
        "Confirmshaming Decline Copy": { name: "गिल्ट-आधारित अस्वीकृति बटन", description: "ऑफर ठुकराने के बटन पर शर्मिंदगी वाली भाषा का उपयोग करता है।", action: "यदि आपको ऑफर नहीं चाहिए तो बिना झिझक अस्वीकार करें।" },
        "Pre-Selected Paid Add-On or Warranty": { name: "पहले से चुना गया पेड ऐड-ऑन या वारंटी", description: "डिफ़ॉल्ट रूप से सशुल्क वारंटी टिक रखता है।", action: "भुगतान से पहले पहले से चुने गए सभी ऐड-ऑन अनचेक करें।" },
        "Threshold Trap / Basket Padding": { name: "थ्रेशोल्ड ट्रैप / अतिरिक्त कार्ट दबाव", description: "कैशबैक या मुफ्त शिपिंग के लिए अधिक खर्च करने को प्रोत्साहित करता है।", action: "जांचें कि अतिरिक्त आइटम की कीमत छूट से ज्यादा तो नहीं है।" },
        "Checkout Upsell Fee": { name: "चेकआउट अतिरिक्त शुल्क", description: "चेकआउट के दौरान वैकल्पिक हैंडलिंग शुल्क जोड़ता है।", action: "मानक डिलीवरी विकल्प चुनें।" },
        "Hidden Auto-Renewal / Recurring Terms": { name: "छुपी हुई ऑटो-रिन्यूअल शर्तें", description: "नियमित बिलिंग शर्तों को छोटे अक्षरों में छिपाता है।", action: "भुगतान से पहले रिन्यूअल अवधि ध्यान से पढ़ें।" }
      }
    }
  };

  const CATEGORIES = [
    "urgency-scarcity",
    "social-proof",
    "confirmshaming",
    "sneak-into-basket",
    "threshold-trap",
    "checkout-upsell",
    "hidden-details"
  ];

  // Clearcart scanner category ids -> the category keys this UI uses
  const CATEGORY_KEY_MAP = {
    urgency: "urgency-scarcity",
    social_proof: "social-proof",
    confirmshaming: "confirmshaming",
    preselection: "sneak-into-basket",
    basket_padding: "threshold-trap",
    upsell_nag: "checkout-upsell",
    obstruction: "hidden-details"
  };

  // Accepts a report from scripts/detector.js and returns what the UI renders.
  function adaptReport(report) {
    if (!report) return report;
    if (report.categoryCounts && !report.categories) return report; // already adapted
    const detections = (report.detections || []).map((d) => ({
      id: d.id,
      ruleId: d.ruleId,
      categoryKey: CATEGORY_KEY_MAP[d.category] || d.category,
      name: d.name,
      severity: d.severity,
      description: d.description,
      advice: d.advice,
      snippet: d.snippet
    }));
    const categoryCounts = {};
    CATEGORIES.forEach((k) => { categoryCounts[k] = 0; });
    detections.forEach((d) => {
      categoryCounts[d.categoryKey] = (categoryCounts[d.categoryKey] || 0) + 1;
    });
    const onExtensionPage = typeof report.url === "string" && report.url.indexOf("chrome-extension://") === 0;
    return {
      domain: onExtensionPage ? "shadymart-demo.local" : (report.domain || "local-page"),
      score: report.score,
      grade: report.grade,
      detections: detections,
      categoryCounts: categoryCounts
    };
  }

  // Clearcart's content script reports highlight state as highlightsActive
  function hlState(obj) {
    if (!obj) return false;
    if (typeof obj.highlightsActive === "boolean") return obj.highlightsActive;
    return Boolean(obj.highlightEnabled);
  }

  const domainLabel = document.getElementById("domainLabel");
  const brandRefreshBtn = document.getElementById("brandRefreshBtn");
  const highlightToggle = document.getElementById("highlightToggle");
  const statePanel = document.getElementById("statePanel");
  const stateTitle = document.getElementById("stateTitle");
  const stateMessage = document.getElementById("stateMessage");
  const stateActionBtn = document.getElementById("stateActionBtn");
  const mainContent = document.getElementById("mainContent");
  const settingsPanel = document.getElementById("settingsPanel");
  const settingsBtn = document.getElementById("settingsBtn");
  const settingsBackBtn = document.getElementById("settingsBackBtn");
  const themeOptButtons = document.querySelectorAll(".dpg-theme-seg-btn");
  const settingLanguage = document.getElementById("settingLanguage");
  const settingAutoScan = document.getElementById("settingAutoScan");
  const settingHighlightTraps = document.getElementById("settingHighlightTraps");
  const clearHistoryBtn = document.getElementById("clearHistoryBtn");
  const clearHistoryLabel = document.getElementById("clearHistoryLabel");
  const gradeBox = document.getElementById("gradeBox");
  const gradeLetter = document.getElementById("gradeLetter");
  const scoreValue = document.getElementById("scoreValue");
  const scoreProgressTrack = document.getElementById("scoreProgressTrack");
  const scoreProgressFill = document.getElementById("scoreProgressFill");
  const transparencyStatus = document.getElementById("transparencyStatus");
  const scoreSummary = document.getElementById("scoreSummary");
  const categoryGrid = document.getElementById("categoryGrid");
  const clearFilterBtn = document.getElementById("clearFilterBtn");
  const trapCountLabel = document.getElementById("trapCountLabel");
  const trapsList = document.getElementById("trapsList");
  const openTestStoreBtn = document.getElementById("openTestStoreBtn");

  let activeTabId = null;
  let currentScan = null;
  let selectedCategory = null;
  let highlightEnabled = false;
  let settingsOpen = false;
  const THEME_KEY = "clearcart_theme";
  const LANG_KEY = "clearcart_setting_language";
  let currentLang = localStorage.getItem(LANG_KEY);
  if (!["en", "es", "hi"].includes(currentLang)) currentLang = "en";

  function applyLanguage(lang) {
    currentLang = ["en", "es", "hi"].includes(lang) ? lang : "en";
    document.documentElement.setAttribute("data-lang", currentLang);
    document.documentElement.lang = currentLang;
    if (settingLanguage) settingLanguage.value = currentLang;

    const t = I18N[currentLang];
    const setTxt = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    const hlSpan = highlightToggle && highlightToggle.querySelector("span");
    if (hlSpan) hlSpan.textContent = t.highlight;
    setTxt("scoreSectionLabel", t.scoreLabel);
    setTxt("breakdownHeading", t.breakdownHeading);
    setTxt("clearFilterBtn", t.clearFilter);
    setTxt("trapsHeading", t.trapsHeading);
    setTxt("settingsBackBtn", t.backToScan);
    setTxt("themeOptLight", t.light);
    setTxt("themeOptDark", t.dark);
    setTxt("themeOptSystem", t.system);
    setTxt("detectionHeading", t.detection);
    setTxt("autoScanLabel", t.autoScan);
    setTxt("autoScanSub", t.autoScanSub);
    setTxt("highlightTrapsLabel", t.highlightTraps);
    setTxt("highlightTrapsSub", t.highlightTrapsSub);
    setTxt("testDemoLabel", t.testDemo);
    setTxt("testDemoSub", t.testDemoSub);
    setTxt("openTestStoreBtn", t.open);
    setTxt("privacyHeading", t.privacy);
    setTxt("onDeviceTitle", t.onDevice);
    setTxt("onDeviceSub", t.onDeviceSub);
    setTxt("clearHistoryLabel", t.clearHistory);
    setTxt("footerPrivacyNote", t.footer);
    const appearanceHead = settingsPanel && settingsPanel.querySelector(".dpg-section-heading");
    if (appearanceHead) appearanceHead.textContent = t.appearance;
    const langLabel = document.querySelector('label[for="settingLanguage"]');
    if (langLabel) langLabel.textContent = t.language;
    if (currentScan) {
      renderScore(currentScan);
      renderCategories(currentScan);
      renderTraps(currentScan);
    }
  }

  function applyTheme(mode) {
    const polarity = mode === "system"
      ? (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark")
      : (mode === "light" ? "light" : "dark");

    if (polarity === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }

    themeOptButtons.forEach((btn) => {
      const active = btn.getAttribute("data-theme-opt") === mode;
      btn.classList.toggle("is-selected", active);
      btn.setAttribute("aria-checked", active ? "true" : "false");
    });
  }

  applyTheme(localStorage.getItem(THEME_KEY) || "dark");
  applyLanguage(currentLang);

  function showStatePanel(title, message, actionLabel, onAction) {
    mainContent.classList.add("dpg-hidden");
    statePanel.classList.remove("dpg-hidden");
    stateTitle.textContent = title;
    stateMessage.textContent = message;
    if (actionLabel && onAction) {
      stateActionBtn.textContent = actionLabel;
      stateActionBtn.classList.remove("dpg-hidden");
      stateActionBtn.onclick = onAction;
    } else {
      stateActionBtn.classList.add("dpg-hidden");
      stateActionBtn.onclick = null;
    }
  }

  function showMainContent() {
    statePanel.classList.add("dpg-hidden");
    mainContent.classList.remove("dpg-hidden");
  }

  function setToggleState(enabled) {
    highlightEnabled = Boolean(enabled);
    highlightToggle.setAttribute("aria-checked", highlightEnabled ? "true" : "false");
    if (settingHighlightTraps) {
      settingHighlightTraps.setAttribute("aria-checked", highlightEnabled ? "true" : "false");
    }
  }

  function isRestrictedUrl(url) {
    if (!url) return true;
    return (
      url.startsWith("chrome://") ||
      (url.startsWith("chrome-extension://") && !url.includes("test-store/index.html")) ||
      url.startsWith("edge://") ||
      url.startsWith("about:") ||
      url.startsWith("https://chromewebstore.google.com")
    );
  }

  function renderScore(scan) {
    const t = I18N[currentLang];
    const grade = scan.grade || "-";
    gradeLetter.textContent = grade;
    gradeBox.setAttribute("data-grade", grade);
    scoreValue.textContent = scan.score + " / 100";
    scoreProgressTrack.setAttribute("aria-valuenow", String(scan.score));
    scoreProgressFill.style.width = scan.score + "%";
    transparencyStatus.textContent = (t.grades && t.grades[grade]) || scan.status || "Scanned";
    scoreSummary.textContent = !scan.detections || scan.detections.length === 0
      ? t.summaryNone
      : (scan.score < 60 ? t.summaryHigh : t.summaryMid);
  }

  function renderCategories(scan) {
    const t = I18N[currentLang];
    categoryGrid.innerHTML = "";
    const counts = scan.categoryCounts || {};
    CATEGORIES.forEach((key) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "dpg-cat-btn" + (selectedCategory === key ? " is-active" : "");
      btn.setAttribute("role", "listitem");
      btn.setAttribute("aria-pressed", selectedCategory === key ? "true" : "false");

      const nameSpan = document.createElement("span");
      nameSpan.className = "dpg-cat-name";
      nameSpan.textContent = t.categories[key] || key;

      const countSpan = document.createElement("span");
      countSpan.className = "dpg-cat-count";
      countSpan.textContent = String(counts[key] || 0);

      btn.appendChild(nameSpan);
      btn.appendChild(countSpan);
      btn.addEventListener("click", () => {
        selectedCategory = selectedCategory === key ? null : key;
        renderCategories(currentScan);
        renderTraps(currentScan);
        if (selectedCategory) {
          const trapsHeadingEl = document.getElementById("trapsHeading");
          if (trapsHeadingEl) {
            trapsHeadingEl.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      });
      categoryGrid.appendChild(btn);
    });
    clearFilterBtn.classList.toggle("dpg-hidden", !selectedCategory);
  }

  function renderTraps(scan) {
    const t = I18N[currentLang];
    trapsList.innerHTML = "";
    const allDetections = scan.detections || [];
    const filtered = selectedCategory
      ? allDetections.filter((d) => d.categoryKey === selectedCategory)
      : allDetections;

    trapCountLabel.textContent = filtered.length + " " + (filtered.length === 1 ? t.itemSingular : t.itemPlural);

    if (allDetections.length === 0) {
      const emptyBox = document.createElement("div");
      emptyBox.className = "dpg-empty-inline";
      emptyBox.innerHTML = '<p class="dpg-empty-inline-title">' + t.noTrapsTitle + '</p><p class="dpg-empty-inline-desc">' + t.noTrapsDesc + '</p>';
      trapsList.appendChild(emptyBox);
      return;
    }

    if (filtered.length === 0) {
      const emptyFilter = document.createElement("div");
      emptyFilter.className = "dpg-empty-inline";
      emptyFilter.innerHTML = '<p class="dpg-empty-inline-title">' + t.noCatTitle + '</p><p class="dpg-empty-inline-desc">' + t.noCatDesc + '</p>';
      trapsList.appendChild(emptyFilter);
      return;
    }

    filtered.forEach((det) => {
      const tr = (t.traps && t.traps[det.name]) || null;
      const targetId = det.id || det.elementId;
      const adviceText = det.advice || det.action || "";
      const card = document.createElement("article");
      card.className = "dpg-trap-card";

      const head = document.createElement("div");
      head.className = "dpg-trap-head";

      const title = document.createElement("h3");
      title.className = "dpg-trap-title";
      title.textContent = tr ? tr.name : det.name;

      const sev = document.createElement("span");
      sev.className = "dpg-severity-badge";
      sev.setAttribute("data-severity", det.severity);
      sev.textContent = (t.severity && t.severity[det.severity]) || det.severity;
      head.appendChild(title);
      head.appendChild(sev);

      const snippet = document.createElement("p");
      snippet.className = "dpg-trap-snippet";
      snippet.textContent = '"' + det.snippet + '"';

      const desc = document.createElement("p");
      desc.className = "dpg-trap-desc";
      desc.textContent = tr ? tr.description : det.description;

      const actionNote = document.createElement("p");
      actionNote.className = "dpg-trap-action-note";
      actionNote.textContent = t.recommended + " " + (tr ? tr.action : adviceText);

      const locateBtn = document.createElement("button");
      locateBtn.type = "button";
      locateBtn.className = "dpg-locate-btn";
      locateBtn.textContent = t.locate;
      locateBtn.addEventListener("click", () => {
        if (activeTabId === null) return;
        chrome.tabs.sendMessage(
          activeTabId,
          { action: "SCROLL_TO_PATTERN", type: "SCROLL_TO_PATTERN", patternId: targetId, elementId: targetId },
          (res) => {
            if (chrome.runtime.lastError) return;
            if (res && (typeof res.highlightsActive === "boolean" || typeof res.highlightEnabled === "boolean")) {
              setToggleState(hlState(res));
            }
          }
        );
      });

      card.appendChild(head);
      card.appendChild(snippet);
      card.appendChild(desc);
      card.appendChild(actionNote);
      card.appendChild(locateBtn);
      trapsList.appendChild(card);
    });
  }

  function renderScan(rawScan, isHighlighted) {
    const scan = adaptReport(rawScan);
    currentScan = scan;
    domainLabel.textContent = scan.domain || "local-page";
    setToggleState(isHighlighted);
    showMainContent();
    renderScore(scan);
    renderCategories(scan);
    renderTraps(scan);
  }

  function requestTabState(actionName) {
    showStatePanel("Scanning Page", "Inspecting DOM elements and copy locally...");
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs && tabs[0];
      if (!tab) {
        domainLabel.textContent = "Unavailable";
        showStatePanel("No Active Tab", "Unable to locate an active browser tab to scan.");
        return;
      }
      activeTabId = tab.id;
      try {
        domainLabel.textContent = new URL(tab.url).hostname || "local-page";
      } catch (_e) {
        domainLabel.textContent = "restricted-page";
      }

      if (isRestrictedUrl(tab.url)) {
        showStatePanel(
          "Restricted Browser Page",
          "Chrome prevents extensions from inspecting internal browser pages or the Chrome Web Store. Open a standard webpage or the ShadyMart Test Store to scan.",
          "Open ShadyMart Test Store",
          () => {
            chrome.tabs.create({ url: chrome.runtime.getURL("test-store/index.html") });
          }
        );
        return;
      }

      chrome.tabs.sendMessage(activeTabId, { action: actionName, type: actionName }, (response) => {
        const scanReport = response && (response.report || response.result);
        if (chrome.runtime.lastError || !scanReport) {
          showStatePanel(
            "Scanner Not Ready",
            "Reload this tab to activate local dark-pattern scanning.",
            "Reload Page",
            () => chrome.tabs.reload(activeTabId, {}, () => window.close())
          );
          return;
        }
        renderScan(scanReport, hlState(response));
      });
    });
  }

  function handleHighlightToggle() {
    const nextState = !highlightEnabled;
    setToggleState(nextState);
    if (activeTabId === null) return;
    chrome.tabs.sendMessage(
      activeTabId,
      { action: "TOGGLE_HIGHLIGHTS", type: "TOGGLE_HIGHLIGHTS", enabled: nextState },
      (res) => {
        if (chrome.runtime.lastError) return;
        if (res && (typeof res.highlightsActive === "boolean" || typeof res.highlightEnabled === "boolean")) setToggleState(hlState(res));
      }
    );
  }

  function setSettingsOpen(nextOpen) {
    settingsOpen = Boolean(nextOpen);
    settingsPanel.classList.toggle("dpg-hidden", !settingsOpen);
    settingsBtn.setAttribute("aria-expanded", settingsOpen ? "true" : "false");
    if (settingsOpen) {
      mainContent.classList.add("dpg-hidden");
      statePanel.classList.add("dpg-hidden");
      settingsPanel.scrollTop = 0;
    } else if (currentScan) {
      statePanel.classList.add("dpg-hidden");
      mainContent.classList.remove("dpg-hidden");
      mainContent.scrollTop = 0;
    } else {
      mainContent.classList.add("dpg-hidden");
      statePanel.classList.remove("dpg-hidden");
    }
  }

  chrome.runtime.onMessage.addListener((msg, sender) => {
    if (!msg) return;
    const action = msg.action || msg.type;
    if (action === "SCAN_COMPLETED" && msg.report) {
      if (sender && sender.tab && activeTabId !== null && sender.tab.id !== activeTabId) return;
      renderScan(msg.report, (msg.highlightsActive !== undefined || msg.highlightEnabled !== undefined) ? hlState(msg) : highlightEnabled);
    }
  });

  brandRefreshBtn.addEventListener("click", () => {
    selectedCategory = null;
    setSettingsOpen(false);
    requestTabState("TRIGGER_RESCAN");
  });

  highlightToggle.addEventListener("click", handleHighlightToggle);
  if (settingHighlightTraps) settingHighlightTraps.addEventListener("click", handleHighlightToggle);

  themeOptButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const nextTheme = btn.getAttribute("data-theme-opt") || "dark";
      applyTheme(nextTheme);
      localStorage.setItem(THEME_KEY, nextTheme);
    });
  });

  clearFilterBtn.addEventListener("click", () => {
    selectedCategory = null;
    if (currentScan) {
      renderCategories(currentScan);
      renderTraps(currentScan);
    }
  });

  settingsBtn.addEventListener("click", () => {
    setSettingsOpen(!settingsOpen);
  });

  settingsBackBtn.addEventListener("click", () => {
    setSettingsOpen(false);
  });

  settingAutoScan.addEventListener("click", () => {
    const next = settingAutoScan.getAttribute("aria-checked") !== "true";
    settingAutoScan.setAttribute("aria-checked", String(next));
    localStorage.setItem("clearcart_setting_autoscan", String(next));
    if (chrome.storage && chrome.storage.local) chrome.storage.local.set({ autoScan: next });
  });

  settingAutoScan.setAttribute("aria-checked", localStorage.getItem("clearcart_setting_autoscan") === "false" ? "false" : "true");

  settingLanguage.addEventListener("change", () => {
    localStorage.setItem(LANG_KEY, settingLanguage.value);
    applyLanguage(settingLanguage.value);
  });

  clearHistoryBtn.addEventListener("click", () => {
    if (chrome.storage && chrome.storage.local) {
      chrome.storage.local.remove(["scanHistory", "lastScan"]);
    }
    clearHistoryLabel.textContent = I18N[currentLang].historyCleared;
    setTimeout(() => {
      clearHistoryLabel.textContent = I18N[currentLang].clearHistory;
    }, 2000);
  });

  openTestStoreBtn.addEventListener("click", () => {
    chrome.tabs.create({ url: chrome.runtime.getURL("test-store/index.html") });
  });

  requestTabState("GET_SCAN_REPORT");
})();