export type CourseLesson = {
  id: string;
  title: string;
  summary: string;
  /** Short action checklist — keep concrete for non-technical readers. */
  points: string[];
  /** Optional short example — keep tiny. */
  example?: string;
  /** One clear “do this before continuing” line. */
  tryThis?: string;
  /** Topic page on an external docs site (e.g. W3Schools). */
  docsHref?: string;
};

export type CourseDocs = {
  label: string;
  href: string;
};

export type Course = {
  id: string;
  title: string;
  level: string;
  duration: string;
  blurb: string;
  /** Hub docs link — HTML/CSS/JS use W3Schools; React uses react.dev. */
  docs?: CourseDocs;
  /**
   * `stepped` = one lesson at a time (HTML beginner path).
   * `all` (default) = full lesson list on one page.
   */
  pace?: "stepped" | "all";
  lessons: CourseLesson[];
};

/** Courses listed on `/courses`. Order: foundations → React. */
export const COURSES: Course[] = [
  {
    id: "html",
    title: "Basic HTML Course",
    level: "Absolute beginner",
    duration: "9 short steps · one at a time",
    pace: "stepped",
    blurb:
      "Built for people new to tech. You will make a real page in your browser, one small step at a time — no prior coding needed. Optional W3Schools links are there if you want a second explanation.",
    docs: {
      label: "W3Schools HTML",
      href: "https://www.w3schools.com/html/",
    },
    lessons: [
      {
        id: "html-what",
        title: "Step 1 — What HTML is (in plain words)",
        summary:
          "A website page is a bit like a letter. HTML is the writing that tells the browser what belongs on the page: a title, a heading, a picture, a button. You are not “programming” yet — you are labeling pieces of content so the browser can show them.",
        points: [
          "HTML files usually end in `.html` (for example `hello.html`).",
          "You open that file in Chrome, Edge, Firefox, or Safari — just like opening a document.",
          "Tags look like `<something>` and often come in pairs: an opening tag and a closing tag.",
        ],
        tryThis:
          "Say this out loud: “HTML labels the parts of a page.” When that feels clear, go to the next step.",
        docsHref: "https://www.w3schools.com/html/html_intro.asp",
      },
      {
        id: "html-setup",
        title: "Step 2 — Make a blank file",
        summary:
          "Before any code, create a place to put it. On your computer, make a new empty file and give it a simple name. You will type into this file and then open it in your browser.",
        points: [
          "Create a folder for practice (any name is fine, e.g. `my-first-page`).",
          "Inside it, create a new text file named `index.html`.",
          "Open `index.html` in a simple editor (Notepad, TextEdit, VS Code, or Cursor).",
        ],
        tryThis:
          "Confirm you can find `index.html` in your folder. Do not worry that it is empty yet — next step fills it in.",
        docsHref: "https://www.w3schools.com/html/html_editors.asp",
      },
      {
        id: "html-skeleton",
        title: "Step 3 — Paste the starter page",
        summary:
          "Every page needs a small “frame”: a note for the browser, a head (behind-the-scenes info), and a body (what people see). Copy the example below into `index.html`, save, then double-click the file to open it in your browser.",
        points: [
          "The first line tells the browser “this is a modern web page.”",
          "`<head>` is for the tab title and settings — visitors mostly do not see it as page content.",
          "`<body>` is where the visible content will go in later steps.",
        ],
        example: `<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="utf-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1" />\n    <title>My first page</title>\n  </head>\n  <body>\n  </body>\n</html>`,
        tryThis:
          "Save the file, open it in your browser, and check the browser tab. You should see “My first page” as the tab name. The page itself may look blank — that is OK.",
        docsHref: "https://www.w3schools.com/html/html_basic.asp",
      },
      {
        id: "html-heading",
        title: "Step 4 — Add a big heading",
        summary:
          "Now put something people can read. Inside `<body>`, add one main heading. Think of `<h1>` as the biggest title on the page — like the title on a flyer.",
        points: [
          "Type your heading between `<body>` and `</body>`.",
          "Use exactly one main `<h1>` for this practice page.",
          "Save the file, then refresh the browser (F5 or the reload button) to see the change.",
        ],
        example: `<body>\n  <h1>Hello, I am learning HTML</h1>\n</body>`,
        tryThis:
          "Change the words inside `<h1>...</h1>`, save, and refresh until you see your own sentence on the page.",
        docsHref: "https://www.w3schools.com/html/html_headings.asp",
      },
      {
        id: "html-paragraph",
        title: "Step 5 — Add a short paragraph",
        summary:
          "Under your heading, add a normal paragraph of text. `<p>` means “paragraph” — the kind of writing you use in an email or note.",
        points: [
          "Put the `<p>...</p>` after the `<h1>`, still inside `<body>`.",
          "Write one or two friendly sentences about yourself or why you are learning.",
          "Save and refresh again — heading on top, paragraph below.",
        ],
        example: `<body>\n  <h1>Hello, I am learning HTML</h1>\n  <p>This is my first webpage. I made it today.</p>\n</body>`,
        tryThis:
          "If the text appears under the heading, you are doing it right. Only then continue.",
        docsHref: "https://www.w3schools.com/html/html_paragraphs.asp",
      },
      {
        id: "html-link",
        title: "Step 6 — Make a clickable link",
        summary:
          "A link lets someone jump somewhere else. You need two parts: the address to visit, and the words people click. We will add a link to a safe, well-known site.",
        points: [
          "Add an `<a>` tag under your paragraph.",
          "`href` is the address. The text between the tags is what people click.",
          "Save, refresh, and click the link to confirm it works.",
        ],
        example: `<p>\n  Read more on\n  <a href="https://www.w3schools.com/html/">W3Schools HTML</a>.\n</p>`,
        tryThis:
          "Click your link. If a new page opens, the link works. Come back to your file and continue.",
        docsHref: "https://www.w3schools.com/html/html_links.asp",
      },
      {
        id: "html-image",
        title: "Step 7 — Show a picture",
        summary:
          "Images need two things: where the picture file is, and a short text description for people who cannot see the image. For practice, you can use a picture from the internet or one saved next to your HTML file.",
        points: [
          "Add an `<img />` tag in the body (images often use a single self-closing tag).",
          "`src` points to the picture. `alt` is a plain-language description.",
          "If the picture does not show, check the `src` path carefully — typos are common.",
        ],
        example: `<img\n  src="https://www.w3schools.com/html/img_chania.jpg"\n  alt="A town by the sea"\n  width="400"\n/>`,
        tryThis:
          "Refresh until the picture appears. Then try changing `alt` to your own description.",
        docsHref: "https://www.w3schools.com/html/html_images.asp",
      },
      {
        id: "html-form",
        title: "Step 8 — A tiny form (name + button)",
        summary:
          "A form is how pages collect information — like a paper form, but on screen. We will make the simplest version: a label, a text box, and a button. You do not need a server yet; this is only to see the pieces.",
        points: [
          "Wrap the fields in `<form>...</form>`.",
          "Use a `<label>` so the text box has a clear name people can read.",
          "Add `<input>` for typing and a `<button>` that says what it does.",
        ],
        example: `<form>\n  <label for="name">Your name</label>\n  <input id="name" name="name" type="text" />\n  <button type="submit">Say hi</button>\n</form>`,
        tryThis:
          "Type in the box and click the button. The page may reload — that is normal for now. You have seen the building blocks of a form.",
        docsHref: "https://www.w3schools.com/html/html_forms.asp",
      },
      {
        id: "html-next",
        title: "Step 9 — You did it — what next?",
        summary:
          "You created a file, opened it in a browser, and added a heading, paragraph, link, image, and form. That is real HTML. Next you can make it look nicer with CSS, or keep practicing by changing the words and pictures on this page.",
        points: [
          "Keep `index.html` as your sandbox — change one thing at a time, then refresh.",
          "When you forget a tag, open the W3Schools HTML link and search by name.",
          "When you are ready for colors, fonts, and layout, open the Basic CSS Course.",
        ],
        tryThis:
          "Spend five minutes personalizing your page (new heading, new photo, new link). Then return to Courses and choose CSS when you want the next skill.",
        docsHref: "https://www.w3schools.com/html/default.asp",
      },
    ],
  },
  {
    id: "css",
    title: "Basic CSS Course",
    level: "Beginner",
    duration: "About 8 focused lessons",
    blurb:
      "CSS controls how HTML looks and flows. Learn selectors, the box model, layout, and responsive habits without fighting the cascade. Lessons point to W3Schools so looking things up becomes a habit.",
    docs: {
      label: "W3Schools CSS",
      href: "https://www.w3schools.com/css/",
    },
    lessons: [
      {
        id: "css-how",
        title: "How CSS gets onto the page",
        summary:
          "Stylesheets can be linked, embedded, or inlined. Prefer an external stylesheet for anything you’ll reuse.",
        points: [
          '`<link rel="stylesheet" href="/styles.css" />` in the head.',
          "A rule is `selector { property: value; }`.",
          "Later rules and higher specificity win — cascade, not magic.",
        ],
        example: `h1 {\n  font-size: 2rem;\n  letter-spacing: -0.02em;\n  color: #111;\n}`,
        docsHref: "https://www.w3schools.com/css/css_intro.asp",
      },
      {
        id: "css-selectors",
        title: "Selectors you’ll actually use",
        summary:
          "Target elements by type, class, id, and relationships. Classes are the workhorse for reusable design.",
        points: [
          "`.card` class, `#hero` id (use ids sparingly).",
          "Descendant `nav a`, child `ul > li`, and `:hover` / `:focus-visible`.",
          "Don’t over-qualify — short selectors are easier to override on purpose.",
        ],
        docsHref: "https://www.w3schools.com/css/css_selectors.asp",
      },
      {
        id: "css-box",
        title: "The box model",
        summary:
          "Every element is a box: content, padding, border, margin. `box-sizing: border-box` makes width include padding and border — start there.",
        points: [
          "Margin collapses between vertical siblings; padding does not.",
          "`display: block` vs `inline` vs `inline-block` changes how boxes flow.",
          "Set `*, *::before, *::after { box-sizing: border-box; }` once globally.",
        ],
        example: `.card {\n  box-sizing: border-box;\n  width: 100%;\n  padding: 1rem 1.25rem;\n  border: 1px solid #ddd;\n}`,
        docsHref: "https://www.w3schools.com/css/css_boxmodel.asp",
      },
      {
        id: "css-text-color",
        title: "Type, color, and space",
        summary:
          "Readable type beats decoration. Control font, line-height, color, and spacing with a small, consistent scale.",
        points: [
          "`font-family`, `font-size`, `font-weight`, `line-height` for text.",
          "Prefer `rem` for type and spacing that scales with the root.",
          "Limit line length (~45–75 characters) for body copy comfort.",
        ],
        docsHref: "https://www.w3schools.com/css/css_text.asp",
      },
      {
        id: "css-flex",
        title: "Flexbox for one-dimensional layout",
        summary:
          "Flex aligns items in a row or column. Great for toolbars, card rows, and centering without hacks.",
        points: [
          "Parent: `display: flex;` then `gap`, `justify-content`, `align-items`.",
          "`flex-wrap: wrap` when items should flow to the next line.",
          "Children: `flex: 1` to grow; `flex: 0 0 auto` to stay content-sized.",
        ],
        example: `.row {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 1rem;\n  align-items: center;\n}`,
        docsHref: "https://www.w3schools.com/css/css3_flexbox.asp",
      },
      {
        id: "css-grid",
        title: "Grid for two-dimensional layout",
        summary:
          "CSS Grid places items in rows and columns together. Use it for page frames and card matrices; use flex for linear clusters.",
        points: [
          "`display: grid` + `grid-template-columns` (often `repeat` + `minmax`).",
          "`gap` for gutters; `grid-column` to span.",
          "Don’t nest grids until a simple flex pass fails.",
        ],
        example: `.gallery {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));\n  gap: 1.25rem;\n}`,
        docsHref: "https://www.w3schools.com/css/css_grid.asp",
      },
      {
        id: "css-responsive",
        title: "Responsive with media queries",
        summary:
          "Design mobile-first: base styles for small screens, then `@media (min-width: …)` to enhance. Test real devices, not only the desktop window.",
        points: [
          "Viewport meta is required for mobile scaling (from HTML).",
          "Prefer fluid units (`%`, `fr`, `clamp`) before many breakpoints.",
          "Touch targets need space — don’t shrink buttons to desktop density.",
        ],
        example: `.nav {\n  display: grid;\n  gap: 0.5rem;\n}\n\n@media (min-width: 640px) {\n  .nav {\n    display: flex;\n    gap: 1rem;\n  }\n}`,
        docsHref: "https://www.w3schools.com/css/css_rwd_intro.asp",
      },
      {
        id: "css-next",
        title: "What to learn next",
        summary:
          "With layout and type under control, add motion carefully and learn custom properties (`--tokens`) for themes. Then wire behavior with JavaScript. Bookmark the W3Schools CSS index.",
        points: [
          "Rebuild a simple page section three ways: float-free flex, then grid.",
          "Inspect in DevTools — computed styles teach faster than guessing.",
          "Continue with the Basic JavaScript Course.",
        ],
        docsHref: "https://www.w3schools.com/css/default.asp",
      },
    ],
  },
  {
    id: "javascript",
    title: "Basic JavaScript Course",
    level: "Beginner",
    duration: "About 8 focused lessons",
    blurb:
      "JavaScript makes pages interactive. Learn values, functions, the DOM, and events — enough to understand what frameworks build on. W3Schools links train you to check the docs when you stall.",
    docs: {
      label: "W3Schools JavaScript",
      href: "https://www.w3schools.com/js/",
    },
    lessons: [
      {
        id: "js-values",
        title: "Values, variables, and types",
        summary:
          "Programs work with numbers, strings, booleans, null/undefined, objects, and arrays. Prefer `const`, use `let` when reassignment is real.",
        points: [
          "`const` by default; `let` when the binding must change.",
          "Avoid `var` in modern code — scope surprises aren’t worth it.",
          "`typeof`, truthiness, and strict equality `===` save debugging time.",
        ],
        example: `const name = "Kaung";\nlet visits = 0;\nvisits += 1;\n\nconsole.log(\`Hello, \${name}\`);`,
        docsHref: "https://www.w3schools.com/js/js_variables.asp",
      },
      {
        id: "js-control",
        title: "Conditionals and loops",
        summary:
          "Branch with `if` / `else` and `switch`. Repeat with `for`, `while`, and array methods like `map` / `filter` when transforming lists.",
        points: [
          "Keep conditions readable — extract named booleans when nested.",
          "`for...of` for values; classic index loops when you need the index.",
          "Prefer `map`/`filter` for derived arrays; mutate only on purpose.",
        ],
        docsHref: "https://www.w3schools.com/js/js_if_else.asp",
      },
      {
        id: "js-functions",
        title: "Functions",
        summary:
          "Functions package reusable behavior. Declarations hoist; arrow functions are concise and inherit `this` differently — know which you mean.",
        points: [
          "Name functions for the action they perform.",
          "Return early to avoid deep nesting.",
          "Parameters can have defaults: `function greet(name = 'friend')`.",
        ],
        example: `function sum(a, b) {\n  return a + b;\n}\n\nconst double = (n) => n * 2;`,
        docsHref: "https://www.w3schools.com/js/js_functions.asp",
      },
      {
        id: "js-objects-arrays",
        title: "Objects and arrays",
        summary:
          "Objects hold keyed properties; arrays hold ordered lists. Destructuring and spread keep updates clear.",
        points: [
          "Read/write with `obj.key` or `obj['key']` when dynamic.",
          "`const next = { ...prev, title: 'New' }` instead of silent mutation.",
          "Arrays: `push`/`pop`, `slice`, `find`, `includes` — learn the common set.",
        ],
        example: `const user = { id: 1, name: "Dan" };\nconst { name } = user;\nconst tags = ["html", "css"];\nconst all = [...tags, "js"];`,
        docsHref: "https://www.w3schools.com/js/js_objects.asp",
      },
      {
        id: "js-dom",
        title: "Talking to the DOM",
        summary:
          "The DOM is the browser’s live tree of HTML. Select nodes, change text/classes/attributes, and create elements when the UI must update.",
        points: [
          "`document.querySelector` / `querySelectorAll` for selection.",
          "`textContent`, `classList`, `setAttribute` for safe updates.",
          "Cache selections; don’t re-query the same node on every click.",
        ],
        example: `const btn = document.querySelector("#save");\nbtn?.classList.add("is-busy");\nbtn?.setAttribute("aria-busy", "true");`,
        docsHref: "https://www.w3schools.com/js/js_htmldom.asp",
      },
      {
        id: "js-events",
        title: "Events and listeners",
        summary:
          "Browsers fire events for clicks, input, submit, keyboard, and more. Listen, handle, and clean up when nodes go away.",
        points: [
          "`element.addEventListener('click', handler)`.",
          "`event.preventDefault()` for forms/links when you handle them in JS.",
          "Prefer listening on a parent (delegation) for long dynamic lists.",
        ],
        example: `form.addEventListener("submit", (event) => {\n  event.preventDefault();\n  const data = new FormData(form);\n  console.log(Object.fromEntries(data));\n});`,
        docsHref: "https://www.w3schools.com/js/js_events.asp",
      },
      {
        id: "js-async",
        title: "Async basics: promises and fetch",
        summary:
          "Some work finishes later (network, timers). Promises and `async`/`await` let you write that without callback pyramids.",
        points: [
          "`fetch(url)` returns a promise; check `response.ok` before JSON.",
          "`try` / `catch` around `await` for failure paths.",
          "Don’t block the UI — show loading and empty/error states.",
        ],
        example: `async function loadProfile(id) {\n  const res = await fetch(\`/api/users/\${id}\`);\n  if (!res.ok) throw new Error("Failed to load");\n  return res.json();\n}`,
        docsHref: "https://www.w3schools.com/js/js_api_fetch.asp",
      },
      {
        id: "js-next",
        title: "What to learn next",
        summary:
          "With language + DOM + events solid, a UI library like React becomes much clearer — it’s organizing the same ideas at scale. Keep the W3Schools JS index handy.",
        points: [
          "Build a small vanilla JS widget (tabs, modal, or todo) without a framework.",
          "Learn modules (`import` / `export`) and a simple build tool when files grow.",
          "Continue with the React Course when you’re ready for components.",
        ],
        docsHref: "https://www.w3schools.com/js/default.asp",
      },
    ],
  },
  {
    id: "react",
    title: "React Course",
    level: "Beginner → solid foundations",
    duration: "About 8 focused lessons",
    blurb:
      "A practical path through modern React: components, state, effects, and the habits that keep UI readable when it grows. Best after HTML, CSS, and JavaScript basics. Lessons link to the official React docs on react.dev.",
    docs: {
      label: "react.dev",
      href: "https://react.dev/learn",
    },
    lessons: [
      {
        id: "what-is-react",
        title: "What React is for",
        summary:
          "React is a library for building interfaces from small, reusable pieces. You describe what the UI should look like for a given state; React updates the DOM when that state changes.",
        points: [
          "UI is a function of state — change data, re-render the view.",
          "Components let you split a screen into named, reusable chunks.",
          "You still need HTML, CSS, and JavaScript fundamentals underneath.",
        ],
        docsHref: "https://react.dev/learn",
      },
      {
        id: "jsx",
        title: "JSX without the mystery",
        summary:
          "JSX looks like HTML in JavaScript. It compiles to function calls. Use `className`, close every tag, and wrap expressions in `{ }`.",
        points: [
          "`class` → `className`; `for` → `htmlFor`.",
          "One parent per return (or a fragment `<>...</>`).",
          "JavaScript expressions go in curly braces: `{user.name}`.",
        ],
        example: `function Hello({ name }) {\n  return <p className="greet">Hello, {name}</p>;\n}`,
        docsHref: "https://react.dev/learn/writing-markup-with-jsx",
      },
      {
        id: "components-props",
        title: "Components and props",
        summary:
          "A component is a function that returns JSX. Props are the inputs — read-only from the child’s point of view. Name components in PascalCase.",
        points: [
          "Pass data down: `<Card title={title} />`.",
          "Destructure props at the top of the function for clarity.",
          "Keep components focused — one job per file when it helps.",
        ],
        example: `function Card({ title, children }) {\n  return (\n    <article>\n      <h2>{title}</h2>\n      {children}\n    </article>\n  );\n}`,
        docsHref: "https://react.dev/learn/passing-props-to-a-component",
      },
      {
        id: "state",
        title: "State with useState",
        summary:
          "State is data that belongs to a component and can change over time. Calling the setter schedules a re-render with the new value.",
        points: [
          "`const [value, setValue] = useState(initial)`.",
          "Never mutate state in place — replace it (new object / array).",
          "Lift state up when siblings need to share the same data.",
        ],
        example: `const [open, setOpen] = useState(false);\n\n<button type="button" onClick={() => setOpen((v) => !v)}>\n  {open ? "Hide" : "Show"}\n</button>`,
        docsHref: "https://react.dev/learn/state-a-components-memory",
      },
      {
        id: "lists-keys",
        title: "Lists and keys",
        summary:
          "Map arrays to elements. Give each sibling a stable `key` so React can match items across updates — prefer IDs over array index when the list can reorder.",
        points: [
          "`items.map((item) => <Row key={item.id} ... />)`.",
          "Keys are for React’s reconciliation, not for your app logic.",
          "Filter and sort the data first; keep JSX thin.",
        ],
        docsHref: "https://react.dev/learn/rendering-lists",
      },
      {
        id: "effects",
        title: "Effects with useEffect",
        summary:
          "Effects sync your component with something outside React: network, subscriptions, timers, the document. Most UI should stay in render + events — reach for effects when you must.",
        points: [
          "Run after paint: `useEffect(() => { ... }, [deps])`.",
          "Return a cleanup function for listeners and timers.",
          "Empty deps `[]` = mount once; list every value the effect reads.",
        ],
        example: `useEffect(() => {\n  const id = window.setInterval(() => tick(), 1000);\n  return () => window.clearInterval(id);\n}, []);`,
        docsHref: "https://react.dev/learn/synchronizing-with-effects",
      },
      {
        id: "forms-events",
        title: "Events and forms",
        summary:
          "Pass functions to event props (`onClick`, `onChange`). For inputs, controlled components keep the value in state so the UI and data stay in sync.",
        points: [
          "Handlers receive a synthetic event; call `preventDefault` on submit when needed.",
          "Controlled input: `value={text}` + `onChange={(e) => setText(e.target.value)}`.",
          "Validate before you trust user input — React won’t do that for you.",
        ],
        docsHref: "https://react.dev/learn/responding-to-events",
      },
      {
        id: "next-steps",
        title: "What to learn next",
        summary:
          "Once components, props, state, and effects feel natural, grow into routing, data fetching patterns, and a small real project. Depth beats tutorial hopping — keep react.dev Learn open while you build.",
        points: [
          "Build one small app end-to-end (list + detail + form).",
          "Read the React docs on escape hatches only when you hit a real wall.",
          "Learn accessibility early: labels, focus, keyboard — same as any UI.",
        ],
        docsHref: "https://react.dev/learn",
      },
    ],
  },
];

export function courseById(id: string): Course | undefined {
  return COURSES.find((course) => course.id === id);
}
