import type { Locale } from "./locale";
import type { VisitorPath } from "./visitor-paths";

export type NavHref =
  | "/"
  | "/work"
  | "/courses"
  | "/blog"
  | "/resume"
  | "/contact";

export type Messages = {
  nav: Record<NavHref, string>;
  navAria: string;
  footerAria: string;
  footerBlurb: string;
  socialAria: string;
  lensEyebrow: string;
  lensAria: (label: string) => string;
  lensTitle: string;
  pathLabels: Record<VisitorPath, string>;
  pathHints: Record<VisitorPath, string>;
  chooser: {
    optional: string;
    title: string;
    desc: string;
    rolesAria: string;
    continueAs: (label: string) => string;
    close: string;
  };
  sections: {
    services: string;
    work: string;
    clients: string;
    about: string;
    voices: string;
    portfolio: string;
  };
  workPage: {
    title: string;
    support: string;
  };
  seeAllWork: string;
  courses: {
    back: string;
    learn: string;
    allTitle: string;
    allSupport: string;
    missingTitle: string;
    missingSupport: string;
    stepOf: (current: number, total: number) => string;
    previous: string;
    next: string;
    yourTurn: string;
  };
  blog: {
    label: string;
    back: string;
    allTitle: string;
    allSupport: string;
    read: string;
    missingTitle: string;
    missingSupport: string;
  };
  locale: {
    groupAria: string;
    en: string;
    my: string;
    switchToEn: string;
    switchToMy: string;
  };
  dayNight: {
    toDark: string;
    toLight: string;
  };
};

const en: Messages = {
  nav: {
    "/": "Home",
    "/work": "Work",
    "/courses": "Courses",
    "/blog": "Blog",
    "/resume": "Resume",
    "/contact": "Contact",
  },
  navAria: "Site pages",
  footerAria: "Footer",
  footerBlurb:
    "I build websites and product UI for teams and small businesses that want work that feels like theirs.",
  socialAria: "Social",
  lensEyebrow: "Lens",
  lensAria: (label) => `Lens: ${label}. Change`,
  lensTitle: "Change lens",
  pathLabels: {
    hire: "Recruiter",
    craft: "Developer/Designer",
    build: "Client",
    wander: "Wonderer",
  },
  pathHints: {
    hire: "Hiring for a role",
    craft: "View UI choices & architecture",
    build: "Need a product built",
    wander: "Just looking around",
  },
  chooser: {
    optional: "Optional",
    title: "What are you looking for?",
    desc: "You can stay as a wonderer, or choose a lens if you're hiring, curious about the craft, or need a site built.",
    rolesAria: "Visitor type",
    continueAs: (label) => `Continue as ${label.toLowerCase()}`,
    close: "Close",
  },
  sections: {
    services: "Services",
    work: "Work",
    clients: "Clients",
    about: "About",
    voices: "Voices",
    portfolio: "Portfolio",
  },
  workPage: {
    title: "Projects I've worked on",
    support:
      "Same filters as before — Web, App, Chatbot, Designs, MMD. Hover a piece for the title and links; open home for live walkthroughs.",
  },
  seeAllWork: "See all work",
  courses: {
    back: "← All courses",
    learn: "Learn",
    allTitle: "Courses",
    allSupport:
      "Pick one path. Start simple, then move up when you're ready.",
    missingTitle: "Course not found",
    missingSupport: "That course isn't here. Pick another from the list.",
    stepOf: (current, total) => `Step ${current} of ${total}`,
    previous: "Previous",
    next: "Next step",
    yourTurn: "Your turn",
  },
  blog: {
    label: "Notes",
    back: "← All posts",
    allTitle: "Blog",
    allSupport:
      "Short notes on React, UI, and building. More posts will land here over time.",
    read: "Read post",
    missingTitle: "Post not found",
    missingSupport: "That post isn’t here. Pick another from the list.",
  },
  locale: {
    groupAria: "Language",
    en: "EN",
    my: "မြ",
    switchToEn: "Switch to English",
    switchToMy: "မြန်မာလို ပြောင်းရန်",
  },
  dayNight: {
    toDark: "Switch to dark mode",
    toLight: "Switch to light mode",
  },
};

const my: Messages = {
  nav: {
    "/": "ပင်မ",
    "/work": "အလုပ်များ",
    "/courses": "သင်ခန်းစာ",
    "/blog": "ဘလော့",
    "/resume": "ကိုယ်ရေး",
    "/contact": "ဆက်သွယ်ရန်",
  },
  navAria: "ဆိုက်စာမျက်နှာများ",
  footerAria: "အောက်ခြေ",
  footerBlurb:
    "ကိုယ်ပိုင်ခံစားမှုရှိတဲ့ ဝက်ဘ်ဆိုက်နဲ့ ပရောဒတ် UI ကို အဖွဲ့များ၊ အသေးစားလုပ်ငန်းများအတွက် တည်ဆောက်ပေးပါတယ်။",
  socialAria: "လူမှုကွန်ရက်",
  lensEyebrow: "မှန်ဘီလူး",
  lensAria: (label) => `မှန်ဘီလူး: ${label}။ ပြောင်းရန်`,
  lensTitle: "မှန်ဘီလူး ပြောင်းရန်",
  pathLabels: {
    hire: "အလုပ်ရှာဖွေသူ",
    craft: "ဒီဇိုင်နာ/ဖန်တီးသူ",
    build: "လုပ်ငန်းရှင်",
    wander: "လှည့်လည်သူ",
  },
  pathHints: {
    hire: "ရာထူးအတွက် ခန့်ထားရန်",
    craft: "UI ရွေးချယ်မှုနှင့် ဖွဲ့စည်းပုံကို ကြည့်ရန်",
    build: "ပရောဒတ်/ဆိုက် လိုအပ်သည်",
    wander: "ပေါ့ပေါ့ပါးပါး လှည့်ကြည့်ရန်",
  },
  chooser: {
    optional: "ရွေးချယ်နိုင်သည်",
    title: "ဘာကို ရှာဖွေနေပါသလဲ?",
    desc: "လှည့်လည်သူအဖြစ် ဆက်နေနိုင်သလို အလုပ်ခန့်ခြင်း၊ လက်ရာကြည့်ခြင်း၊ သို့မဟုတ် ဆိုက်တည်ဆောက်ခြင်းအတွက် မှန်ဘီလူးကို ရွေးနိုင်ပါတယ်။",
    rolesAria: "ဧည့်သည်အမျိုးအစား",
    continueAs: (label) => `${label} အဖြစ် ဆက်သွားမည်`,
    close: "ပိတ်ရန်",
  },
  sections: {
    services: "ဝန်ဆောင်မှု",
    work: "အလုပ်များ",
    clients: "မိတ်ဖက်များ",
    about: "အကြောင်း",
    voices: "အသံများ",
    portfolio: "ပေါ့တ်ဖိုလီယို",
  },
  workPage: {
    title: "လုပ်ခဲ့သော ပရောဂျက်များ",
    support:
      "ယခင်အတိုင်း စစ်ထုတ်နိုင်ပါတယ် — Web, App, Chatbot, Designs, MMD။ ခေါင်းစဉ်နှင့် လင့်ခ်အတွက် hover လုပ်ပါ။ တိုက်ရိုက်လမ်းညွှန်အတွက် ပင်မစာမျက်နှာကို ဖွင့်ပါ။",
  },
  seeAllWork: "အလုပ်အားလုံးကြည့်ရန်",
  courses: {
    back: "← သင်ခန်းစာအားလုံး",
    learn: "သင်ယူရန်",
    allTitle: "သင်ခန်းစာများ",
    allSupport: "တစ်ခုရွေးပါ။ ရိုးရိုးမှ စပြီး အဆင်သင့်ဖြစ်မှ တက်ပါ။",
    missingTitle: "သင်ခန်းစာ မတွေ့ပါ",
    missingSupport: "ဒီသင်ခန်းစာ မရှိပါ။ စာရင်းမှ တစ်ခုရွေးပါ။",
    stepOf: (current, total) => `အဆင့် ${current} / ${total}`,
    previous: "ယခင်",
    next: "နောက်အဆင့်",
    yourTurn: "သင့်အလှည့်",
  },
  blog: {
    label: "မှတ်စုများ",
    back: "← ပို့စ်အားလုံး",
    allTitle: "ဘလော့",
    allSupport:
      "React၊ UI၊ တည်ဆောက်ခြင်းအကြောင်း တိုတောင်းသော မှတ်စုများ။ နောက်ထပ် ပို့စ်များ ထပ်ထည့်သွားမည်။",
    read: "ဖတ်ရန်",
    missingTitle: "ပို့စ် မတွေ့ပါ",
    missingSupport: "ဒီပို့စ် မရှိပါ။ စာရင်းမှ တစ်ခုရွေးပါ။",
  },
  locale: {
    groupAria: "ဘာသာစကား",
    en: "EN",
    my: "မြ",
    switchToEn: "Switch to English",
    switchToMy: "မြန်မာလို ပြောင်းရန်",
  },
  dayNight: {
    toDark: "အမှောင်မုဒ်သို့",
    toLight: "အလင်းမုဒ်သို့",
  },
};

export const MESSAGES: Record<Locale, Messages> = { en, my };

export function messagesFor(locale: Locale): Messages {
  return MESSAGES[locale] ?? MESSAGES.en;
}
