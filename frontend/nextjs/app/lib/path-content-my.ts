import {
  COLLEAGUE_VOICES,
  type PathContent,
  type PathProject,
  type VisitorPath,
} from "./visitor-paths";

const PROJECT_TITLES = {
  essential: "Essential",
  genesis: "Genesis",
  "myan-gate": "MyanGate",
  "york-yoga": "York Yoga",
} as const;

function projects(
  copy: Record<
    keyof typeof PROJECT_TITLES,
    { meta: string; outcome: string; body: string }
  >,
): PathProject[] {
  return (Object.keys(PROJECT_TITLES) as (keyof typeof PROJECT_TITLES)[]).map(
    (mediaSlug) => ({
      title: PROJECT_TITLES[mediaSlug],
      mediaSlug,
      ...copy[mediaSlug],
    }),
  );
}

const HIRE_PROJECTS = projects({
  essential: {
    meta: "ထုတ်ကုန်",
    outcome: "စမှတ်မှ အဆုံးအထိ ကိုင်တွယ်ခဲ့သော ပရောဒတ် UI လမ်းညွှန်။",
    body: "ပို့ဆောင်မှု အရည်အသွေးကို ကြည့်ပါ။ Stack နှင့် လုပ်ငန်းစဉ်ကို တောင်းဆိုရင် ပြောပြပါမယ်။",
  },
  genesis: {
    meta: "ထုတ်ကုန်",
    outcome: "နောက်ထပ် တိုက်ရိုက်ထုတ်ကုန် ဖြတ်ပိုင်း။ မျက်နှာပြင် ရှင်းလင်းမှု တူညီပါတယ်။",
    body: "တကယ့် ကန့်သတ်ချက်တွေအောက်မှာ UI ဆုံးဖြတ်ချက်ကို မြန်မြန် ဖတ်ရန် အသုံးဝင်ပါတယ်။",
  },
  "myan-gate": {
    meta: "ထုတ်ကုန်",
    outcome: "Mock မဟုတ်ဘဲ production UI လှုပ်ရှားမှု။",
    body: "လမ်းညွှန်မှုနှင့် အကြောင်းအရာ အထပ်အလွှာက အသုံးပြုချိန်မှာ ဘယ်လိုခံနိုင်သလဲ ကြည့်ပါ။",
  },
  "york-yoga": {
    meta: "ဖောက်သည်ဆိုက်",
    outcome: "ဧည့်သည်ကို ဆက်သွယ်ရန် ပြောင်းလဲပေးသော အသေးစားလုပ်ငန်းဆိုက်။",
    body: "တူညီသော လက်ရာ၏ freelance ဘက်: အလှဆင်မှုထက် ရှင်းလင်းမှု။",
  },
});

const CRAFT_PROJECTS = projects({
  essential: {
    meta: "UI လမ်းညွှန်",
    outcome: "အလုပ်လုပ်နေသော ထုတ်ကုန်ထဲက layout၊ သိပ်သည်းမှု၊ motion။",
    body: "အကွာအဝေး၊ component စည်းချက်၊ ဖိအားအောက်မှာ ဖတ်လို့ရမှုကို ကြည့်ပါ။",
  },
  genesis: {
    meta: "UI လမ်းညွှန်",
    outcome: "ဖွဲ့စည်းပုံ အရင်။ အလှဆင်မှုက ရှေ့မရောက်ပါ။",
    body: "အထပ်အလွှာ၊ state များ၊ chrome က တန်ဖိုးရှိမရှိ စီရင်ရန် ကောင်းသော နေရာ။",
  },
  "myan-gate": {
    meta: "UI လမ်းညွှန်",
    outcome: "ပိုသိပ်သည်းသော မျက်နှာပြင်မှာ လမ်းညွှန်မှုနှင့် အကြောင်းအရာ ထုပ်ပိုးမှု။",
    body: "ပြောစရာများသောအခါ အချက်အလက်ကို ဘယ်လို စုစည်းထားသလဲ ကြည့်ပါ။",
  },
  "york-yoga": {
    meta: "Marketing UI",
    outcome: "မျက်နှာပြင် နည်းသောကြောင့် type/layout အားနည်းချက် ဖုံးရန် ခက်သည်။",
    body: "နေရာ ကျဉ်းသည်။ အပိုင်းတိုင်း အလေးချိန် ထမ်းရမယ်။",
  },
});

const BUILD_PROJECTS = projects({
  essential: {
    meta: "တကယ့်အဖွဲ့အတွက်",
    outcome: "အဖွဲ့ အလုပ်လုပ်ပုံအတိုင်း ပုံဖော်ထားသော မျက်နှာပြင်များ။",
    body: "နေ့စဉ်သုံးရန်။ လုပ်ငန်းစဉ်ကို လိုရင် လျှောက်ပြနိုင်ပါတယ်။",
  },
  genesis: {
    meta: "တကယ့်အဖွဲ့အတွက်",
    outcome: "တကယ့် workflow နဲ့ ကိုက်ညီသော ရှင်းလင်းသည့် မျက်နှာပြင်များ။",
    body: "အဲဒီအဖွဲ့ အလုပ်လုပ်ပုံပေါ် အခြေခံ တည်ဆောက်ထားသည်။",
  },
  "myan-gate": {
    meta: "တကယ့်အဖွဲ့အတွက်",
    outcome: "ပိုသိပ်သည်းသေးသော်လည်း ဖတ်လို့ရသော ကိရိယာ။",
    body: "လမ်းညွှန်ကို ကြည့်ပြီး သင့်ဆိုက်/ပရောဒတ် ဘာလုပ်စေချင်သလဲ ပြောပါ။",
  },
  "york-yoga": {
    meta: "လုပ်ငန်းဆိုက်",
    outcome: "ဘာရောင်းသလဲ၊ ဘယ်လိုဆက်သွယ်ရမလဲ ဧည့်သည် နားလည်သည်။",
    body: "အွန်လိုင်းမှာ ရှာတွေ့ခံရမှ တိုးတက်မည့် ဆိုင်/စတူဒီယို အတွက် ဆိုက်အမျိုးအစား။",
  },
});

const WANDER_PROJECTS = projects({
  essential: {
    meta: "ထုတ်ကုန်",
    outcome: "အသုံးပြုနေသော ထုတ်ကုန်၏ တိုတောင်းသော လမ်းညွှန်။",
    body: "ပုံထက် ပိုလိုချင်ရင် ကလစ်ကို ဖွင့်ပါ။",
  },
  genesis: {
    meta: "ထုတ်ကုန်",
    outcome: "တူညီသော လမ်းညွှန်ပုံစံဖြင့် နောက်ထပ် တည်ဆောက်မှု။",
    body: "ကြည့်နိုင်သည် သို့မဟုတ် ဆက်သွားနိုင်သည်။",
  },
  "myan-gate": {
    meta: "ထုတ်ကုန်",
    outcome: "ပိုသိပ်သည်းသော UI၊ လည်ပတ်မှုကို ကြည့်သည့် အယူအဆ တူသည်။",
    body: "ဒီပုံစံ စိတ်ဝင်စားရင် မှတ်တမ်းကို ဖွင့်ပါ။",
  },
  "york-yoga": {
    meta: "ဝက်ဘ်ဆိုက်",
    outcome: "ပရောဒတ် chrome နည်းသော အသေးစားလုပ်ငန်းဆိုက်။",
    body: "အပေါ်က ထုတ်ကုန်များထက် ပိုငြိမ်သည်။",
  },
});

/**
 * Myanmar path copy. Voices/quotes reuse English verbatim from the EN pack.
 */
export const PATH_CONTENT_MY: Record<VisitorPath, PathContent> = {
  hire: {
    eyebrow: "အလုပ်ခန့်ခြင်း",
    roles: [
      "ပရောဒတ် အင်ဂျင်နီယာ",
      "Frontend ခိုင်မာသော full stack",
      "ပို့ဆောင်ပြီး အပေးအယူကို ရှင်းပြနိုင်သူ",
    ],
    headline: "စခရင်မှတ်တမ်းနှင့် လုပ်ဖော်ကိုင်ဖက်မှတ်စုများ။ ကြော်ငြာစာမပါဘဲ ရာထူးကိုက်ညီမှု။",
    support:
      "ပရောဒတ် UI နှင့် ၎င်းကို ကျွေးသော API များကို ပို့ဆောင်ပါတယ်။ အလုပ်ကို ကြည့်ပါ၊ လုပ်ဖော်ကိုင်ဖက်ရေးသားချက်ကို ဖတ်ပါ၊ ပုံစံကိုက်ရင် အီးမေးလ်ပို့ပါ။",
    primaryCta: { label: "ရလဒ်ကြည့်ရန်", section: "work" },
    secondaryCta: { label: "ကိုယ်ရေးကြည့်ရန်", href: "/resume" },
    focusTitle: "",
    focusSupport: "",
    items: [],
    sectionTitle: "မကြာသေးမီ ပို့ဆောင်မှုများ",
    sectionSupport: "တိုက်ရိုက် တည်ဆောက်မှုကလစ်များ။ Stack နှင့် လုပ်ငန်းစဉ်ကို စကားပြောမှ။",
    projects: HIRE_PROJECTS,
    aboutTitle: "ခန့်မည့်သူက ဘယ်သူလဲ",
    aboutBody:
      "ကျွန်တော် Kaung Mon၊ Dan လို့လည်း ခေါ်ပါတယ်။ ရှင်းလင်းသော interface နှင့် ပြီးစီးမှုကို ဦးစားပေးသော ပရောဒတ် အင်ဂျင်နီယာ။ အဖွဲ့များနှင့် အသေးစားလုပ်ငန်းများအတွက် ပို့ဆောင်ခဲ့ပါတယ်။ ဘာပို့ဆောင်ခဲ့သလဲ၊ နောက်ဘာပြင်မလဲကို ရိုးရိုးရှင်းရှင်း ပြောတတ်ပါတယ်။",
    aboutCta: { label: "ကိုယ်ရေးကြည့်ရန်", href: "/resume" },
    clientsTitle: "လုပ်ခဲ့သော မိတ်ဖက်များ",
    clientsSupport: "",
    voicesTitle: "အတူပို့ဆောင်ခဲ့သူများထံမှ",
    voicesSupport: "မပြင်ဆင်ထားပါ။ ယဉ်ကျေးမှုနှင့် ပူးပေါင်းဆောင်ရွက်မှုကိုက်ညီမှုအတွက် အသုံးဝင်သည်။",
    voices: COLLEAGUE_VOICES,
    voicesShowQuotes: true,
    contactEyebrow: "",
    contactTitle: "မှန်ကန်သော ရာထူးကို ဖွင့်ထားသည်",
    contactSupport: "ရာထူး၊ အချိန်ဇယား၊ remote/on-site ရှိမရှိ ပို့ပါ။",
    contactFormSupport: "ရှင်းလင်းသော ဟုတ်/မဟုတ် သို့မဟုတ် တိုတောင်းသော မေးခွန်းဖြင့် ပြန်ကြားပါမယ်။",
    contactCtaLabel: "စာပို့ရန်",
  },

  craft: {
    eyebrow: "လက်ရာ",
    roles: [
      "Frontend စနစ်များ",
      "UI နှင့် API ကြား typed အစွန်းများ",
      "ဖတ်လို့ရနေသော layout",
    ],
    headline: "Play နှိပ်လိုက်သောအခါ မျက်နှာပြင်များ ဘယ်လို စုစည်းနေသလဲ။",
    support:
      "ဖွဲ့စည်းပုံ၊ state များ၊ ဘယ် complexity က တန်ဖိုးရှိသလဲကို စိတ်ဝင်စားပါတယ်။ Portfolio pitch deck မဟုတ်ပါ။",
    primaryCta: { label: "တည်ဆောက်မှုကြည့်ရန်", section: "work" },
    secondaryCta: { label: "နည်းပညာစကားပြောရန်", section: "contact" },
    focusTitle: "",
    focusSupport: "",
    items: [],
    sectionTitle: "ရပ်ကြည့်သင့်သော တည်ဆောက်မှုများ",
    sectionSupport: "အထပ်အလွှာ၊ သိပ်သည်းမှု၊ motion ကို ကိုယ်တိုင် စီရင်ပါ။ မေးရင် ကန့်သတ်ချက်တွေ ဖြည့်ပြောပါမယ်။",
    projects: CRAFT_PROJECTS,
    aboutTitle: "အလုပ်လုပ်ပုံ",
    aboutBody:
      "တကယ့် မျက်နှာပြင်နှင့် လိုအပ်သော ဒေတာကနေ စပါတယ်။ အစွန်းမှာ type များ၊ ရည်ရွယ်သော design token နှင့် ကိုက်သော CSS၊ state ပြောင်းလဲမှုကို ရှင်းမှသာ motion။ အပေးအယှားကို လူသိရှင်ကြား သဘောထားကွဲနိုင်ပါတယ်။",
    aboutCta: { label: "နည်းပညာစကားပြောရန်", section: "contact" },
    clientsTitle: "လုပ်ခဲ့သော မိတ်ဖက်များ",
    clientsSupport: "",
    voicesTitle: "လုပ်ဖော်ကိုင်ဖက် ကွန်ရက်",
    voicesSupport: "မျက်နှာပြင်ခွင့်ပြုရင် tablet အထက်မှာ မျက်နှာနှစ်ခု။",
    voices: COLLEAGUE_VOICES,
    voicesShowQuotes: true,
    contactEyebrow: "",
    contactTitle: "UI သို့မဟုတ် API အစွန်းမှာ ပိတ်မိနေသလား?",
    contactSupport: "လင့်ခ်၊ မှတ်တမ်း၊ သို့မဟုတ် တိုတောင်းသော ဖော်ပြချက် ပို့ပါ။",
    contactFormSupport: "ပြဿနာကို ဘယ်လို ဖြတ်တောက်မလဲဖြင့် ဖြေပါမယ်။ အရောင်းခေါ်ဆိုမှု မဟုတ်ပါ။",
    contactCtaLabel: "စာပို့ရန်",
  },

  build: {
    eyebrow: "သင့်လုပ်ငန်းအတွက်",
    roles: [
      "အသုံးပြုခံရသော ဝက်ဘ်ဆိုက်များ",
      "Template အစုံမဟုတ်၊ စိတ်ကြိုက်",
      "လွှင့်တင်ပြီးနောက် ဆက်သွယ်လို့ရသူ",
    ],
    headline: "ဖောက်သည် နားလည်သော ဆိုက်၊ သင်ကိုယ်တိုင် အပ်ဒိတ်လုပ်ရန် မကြောက်သော ဆိုက်။",
    support:
      "တိုးတက်ချင်သော ကုမ္ပဏီ၊ ဆိုင်၊ အသင်းအဖွဲ့များအတွက် ဝက်ဘ်ဆိုက် တည်ဆောက်ပါတယ်။ ရိုးရှင်းသော ဘာသာစကား၊ သင့်အလုပ်လုပ်ပုံအတိုင်း။",
    primaryCta: { label: "ဥပမာကြည့်ရန်", section: "work" },
    secondaryCta: { label: "ဆက်သွယ်ရန်", section: "contact" },
    focusTitle: "ပုံမှန် အဟန့်အတားများ",
    focusSupport: "ပိုင်ရှင်အများစု တူညီသော အတားအဆီးအချို့ကို အရင်တွေ့ပါတယ်။ ဘယ်လို ရှင်းမလဲ။",
    items: [
      {
        title: "ဘယ်သူမှ ဖုန်းမဆက်ဘူး",
        body: "ဘာလုပ်သလဲ၊ ဘာကြောင့် ယုံကြည်သင့်သလဲ ဆိုက်က ပြသောအခါ ဆက်သွယ်ရန် ထင်ရှားလာသည်။",
      },
      {
        title: "နည်းပညာက နံရံလို ခံစားရသည်",
        body: "အွန်လိုင်းဘက်ကို ရိုးရှင်းစွာ ရှင်းပြပြီး လွှင့်တင်ပြီးနောက် ဆက်လက် ဆက်သွယ်နိုင်ပါတယ်။",
      },
      {
        title: "သင့်ပုံစံလို ဖြစ်ရမယ်",
        body: "အသင့်လုပ် template မသုံးပါ။ သင့်ထုတ်ကုန်၊ သင့်အသံ၊ သင့်အလုပ်လုပ်ပုံပေါ် အခြေခံ ဒီဇိုင်းဆွဲပါတယ်။",
      },
    ],
    sectionTitle: "ကြည့်နိုင်သော ဥပမာများ",
    sectionSupport: "တကယ့်ဆိုက်နှင့် ထုတ်ကုန်များ။ တစ်ခုခုနောက်ကွယ် ပိုလိုရင် မေးပါ။",
    projects: BUILD_PROJECTS,
    aboutTitle: "ကျွန်တော် Kaung Mon၊ Dan လို့လည်း ခေါ်ပါတယ်",
    aboutBody:
      "ဖောက်သည်က ဘာရောင်းသလဲ မြင်ပြီး ဆက်သွယ်နိုင်အောင် အသေးစားလုပ်ငန်းနှင့် ဒေသခံဆိုင်များအတွက် ဝက်ဘ်ဆိုက် လုပ်ပေးပါတယ်။ အွန်လိုင်းဘက် ဘယ်လိုအလုပ်လုပ်သလဲ နားလည်သင့်ပြီး နောက်မှ ပြင်နိုင်သင့်ပါတယ်။",
    aboutCta: { label: "ဆက်သွယ်ရန်", section: "contact" },
    clientsTitle: "လုပ်ခဲ့သော မိတ်ဖက်များ",
    clientsSupport: "",
    voicesTitle: "အသံများ",
    voicesSupport: "",
    voices: [],
    voicesShowQuotes: false,
    contactEyebrow: "",
    contactTitle: "ပရောဂျက်အကြောင်း ပြောပြပါ",
    contactSupport: "ဘာရောင်းသလဲ၊ ဘယ်သူအတွက်လဲ၊ ဆိုက်က ဘာလုပ်သင့်သလဲ။",
    contactFormSupport:
      "တိုတောင်းသော မှတ်ချက် လုံလောက်ပါတယ်။ ဆိုက်အသစ်၊ ပြန်ဒီဇိုင်း၊ သို့မဟုတ် ပိုသေးသော အလုပ်ကို စီစဉ်နိုင်ပါတယ်။",
    contactCtaLabel: "စာပို့ရန်",
  },

  wander: {
    eyebrow: "လှည့်ကြည့်ပါ",
    roles: [
      "ဝက်ဘ် ဒက်ဗလော့ပါ",
      "UI ဒီဇိုင်နာ",
      "အသေးစားအဖွဲ့များအတွက် တည်ဆောက်သူ",
    ],
    headline: "အလုပ်များကို ကိုယ့်အရှိန်အတိုင်း လှည့်ကြည့်ပါ။",
    support:
      "အလုပ်ကလစ်များ၊ လုပ်ခဲ့သောသူများ၊ တိုတောင်းသော အကြောင်း။ အလုပ်ခန့်ခြင်း၊ လက်ရာ၊ သို့မဟုတ် ပရောဂျက်အတွက် လာရင် ခေါင်းစီးက Lens ကို ပြောင်းပါ။",
    primaryCta: { label: "အလုပ်ကြည့်ရန်", section: "work" },
    secondaryCta: { label: "ဆက်သွယ်ရန်", section: "contact" },
    focusTitle: "",
    focusSupport: "",
    items: [],
    sectionTitle: "အလုပ်များ",
    sectionSupport: "ပို့ဆောင်ခဲ့သော ပရောဂျက်များမှ တိုတောင်းသော မှတ်တမ်းများ။",
    projects: WANDER_PROJECTS,
    aboutTitle: "အကြောင်း",
    aboutBody:
      "ကျွန်တော် Kaung Mon၊ Dan လို့လည်း ခေါ်ပါတယ်။ ဝက်ဘ်ဆိုက်နှင့် ပရောဒတ် interface တည်ဆောက်ပါတယ်။ တခါတရံ အွန်လိုင်းမှာ တွေ့ရှိခံရရန် ဆိုင်ဖြစ်ပြီး တခါတရံ အဖွဲ့အတွက် ပိုသိပ်သည်းသော UI ဖြစ်ပါတယ်။ မျက်နှာပြင်က အဓိပ္ပာယ်ရှိဖို့ အရေးထားပါတယ်။",
    aboutCta: { label: "ဆက်သွယ်ရန်", section: "contact" },
    clientsTitle: "လုပ်ခဲ့သော မိတ်ဖက်များ",
    clientsSupport: "",
    voicesTitle: "အတူလုပ်ခဲ့သောသူများ",
    voicesSupport: "ပို့ဆောင်ခဲ့သော ပရောဂျက်များမှ လုပ်ဖော်ကိုင်ဖက်များ။",
    voices: COLLEAGUE_VOICES,
    voicesShowQuotes: false,
    contactEyebrow: "",
    contactTitle: "ဆက်သွယ်ရန်",
    contactSupport: "ပရောဂျက်မှတ်ချက် သို့မဟုတ် မေးခွန်းရပါပြီ။ ပြန်စာလိုရင် ပို့ပါ။",
    contactFormSupport: "ဖောင် သို့မဟုတ် အီးမေးလ်သုံးပါ။ ပြန်ဆက်သွယ်ပါမယ်။",
    contactCtaLabel: "စာပို့ရန်",
  },
};
