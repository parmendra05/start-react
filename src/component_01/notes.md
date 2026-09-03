# Component 01 — React Fundamentals & Core Concepts

---

## 1. What is React & How it Works

React is a **JavaScript library** built by Facebook (Meta) in **2013** for building **user interfaces**, especially Single Page Applications (SPAs).

- It is NOT a full framework — it only handles the **View layer** (what the user sees).
- It breaks the UI into small, reusable pieces called **Components**.
- Each component manages its own logic and appearance.

### How it Works — Step by Step:

**Step 1 — You write components:**
```jsx
function App() {
  return <h1>Hello, World!</h1>;
}
```

**Step 2 — React builds a Virtual DOM:**
- When your app loads or data changes, React creates a **Virtual DOM** — a lightweight JavaScript object that represents the UI structure.
- This lives in **memory** (RAM), not in the browser.

**Step 3 — State or data changes:**
- When a user interacts (clicks a button, types in input), state changes.
- React creates a **new Virtual DOM tree** reflecting the updated UI.

**Step 4 — Diffing (Comparison):**
- React compares the **new Virtual DOM** with the **previous Virtual DOM**.
- This comparison process is called **Diffing**.
- React finds exactly which parts changed.

**Step 5 — Reconciliation & Real DOM update:**
- React updates **only the changed parts** in the real browser DOM.
- This process is called **Reconciliation**.
- The rest of the DOM is left untouched — making updates fast and efficient.

```
User Action
    ↓
State Changes
    ↓
New Virtual DOM Created (in memory)
    ↓
Diff: New VDOM vs Old VDOM
    ↓
Only Changed Parts → Real DOM Updated (Reconciliation)
```

---

## 2. React — Advantages & Disadvantages

### ✅ Advantages
- **Fast** — Virtual DOM minimizes real DOM operations.
- **Component-Based** — UI is broken into reusable, independent pieces.
- **Declarative** — You describe *what* the UI should look like, React handles *how*.
- **Large Ecosystem** — Huge community, tons of libraries.
- **React Native** — Same concepts can be used to build mobile apps.
- **One-way Data Flow** — Predictable and easier to debug.

### ❌ Disadvantages
- **Only a View Library** — Not a full framework; you need extra tools for routing, state management, etc.
- **JSX Learning Curve** — Mixing HTML in JS feels odd at first.
- **Frequent Updates** — The ecosystem changes fast.
- **Boilerplate** — Can feel verbose for simple tasks.

---

## 3. Ways to Create a React App (Setup & Tooling)

### Option 1: Create React App (CRA) — ❌ Not Recommended Anymore
```bash
npx create-react-app my-app
```
- Old, slow, heavy. No longer actively maintained.

### Option 2: Vite — ✅ Recommended
```bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm run dev
```
- Super fast dev server, modern tooling, lightweight.

### Option 3: Next.js — For Production / SSR Apps
```bash
npx create-next-app@latest
```
- Use this when you need Server-Side Rendering (SSR) or a full-stack React app.

> **Recommendation**: Use **Vite** for learning and most projects. Use **Next.js** when you need SSR/SEO.

---

## 4. JSX (JavaScript XML)

JSX is a **syntax extension** for JavaScript that lets you write HTML-like code directly inside JS files.

- It was created to make React code more **readable and intuitive**.
- JSX is **not valid JavaScript** — it gets compiled (converted) to `React.createElement()` calls by a tool called **Babel** or **SWC** before the browser runs it.
- The browser never sees JSX — it only sees plain JavaScript.

### JSX vs What it Compiles To:
```jsx
// What you write (JSX)
const element = <h1 className="title">Hello, Raju!</h1>;

// What Babel compiles it to (plain JS)
const element = React.createElement('h1', { className: 'title' }, 'Hello, Raju!');
```

### Embedding JavaScript in JSX:
- Use `{}` curly braces to embed any JavaScript **expression** inside JSX.
```jsx
const name = "Raju";
const age  = 25;

const element = (
  <div>
    <h1>Hello, {name}!</h1>        // variable
    <p>Age: {age}</p>              // variable
    <p>Next year: {age + 1}</p>    // expression
    <p>{age > 18 ? 'Adult' : 'Minor'}</p>  // ternary
  </div>
);
```

### JSX Rules — Every Developer Must Know:
1. **One root element** — Every component must return a single root element. Wrap multiple elements in a `<div>` or a Fragment `<>`.
2. **All tags must be closed** — `<img />`, `<br />`, `<input />` — self-closing tags are mandatory.
3. **`className` not `class`** — `class` is a reserved word in JS, so use `className` for CSS classes.
4. **camelCase for attributes** — `onClick` not `onclick`, `onChange` not `onchange`, `tabIndex` not `tabindex`.
5. **`{}` for JS expressions** — strings use `""`, everything else (numbers, variables, functions) uses `{}`.
6. **No statements inside JSX** — you can use expressions (`? :`, `&&`, `.map()`) but NOT `if`, `for`, `while` directly.
7. **Fragment `<>`** — use `<>...</>` when you need a wrapper but don't want an extra DOM node.

```jsx
// ✅ Correct
return (
  <>
    <h1>Title</h1>
    <p>Paragraph</p>
  </>
);

// ❌ Wrong — two root elements
return (
  <h1>Title</h1>
  <p>Paragraph</p>
);
```

---

## 5. What is Babel / SWC?

When you write JSX, the browser cannot understand it directly. A **transpiler** converts it to plain JavaScript before the browser runs it.

- **Babel** — the original JavaScript transpiler. Converts JSX and modern JS (ES6+) to browser-compatible JS. Slightly slower.
- **SWC** — a newer, faster transpiler written in Rust. Used by Vite by default. Does the same job as Babel but much faster.

```
Your JSX Code
     ↓
  Babel / SWC  (transpiler)
     ↓
Plain JavaScript  →  Browser understands it
```

> You don't need to configure these manually — Vite sets up SWC automatically when you create a React project.

---

## 6. Components

A component is a **reusable piece of UI**. Think of it like a custom HTML tag.

### Functional Component (Modern Way ✅)
```jsx
function Greeting() {
  return <h1>Hello, World!</h1>;
}
```

### Class Component (Old Way ❌ — avoid for new code)
```jsx
class Greeting extends React.Component {
  render() {
    return <h1>Hello, World!</h1>;
  }
}
```

> React moved away from class components after introducing **Hooks** in React 16.8. Always use functional components.

### Key Rules:
- Component names must start with a **Capital Letter**.
- Must return **JSX** (or `null`).
- Can be exported as `default` or **named exports**.

```jsx
export default function UserCard() { ... }  // default export — one per file
export function Person() { ... }            // named export — multiple allowed
```

### Importing Components
```jsx
import UserCard from './UserCard';         // default import
import { Person } from './UserCard';       // named import
```

---

## 7. React vs ReactDOM — What is the Difference?

| | `react` | `react-dom` |
|---|---|---|
| Purpose | Core library — components, state, hooks, Virtual DOM | Renderer — connects React to the browser DOM |
| Package | `react` | `react-dom` |
| Used for | Writing components, `useState`, `useEffect` | `ReactDOM.createRoot()`, `.render()` |
| Platform | Platform-independent | Browser-specific |

- `react` alone has no idea about the browser — it just manages components and Virtual DOM in memory.
- `react-dom` is the bridge that takes React's output and paints it into the real browser DOM.
- This separation allows React to work on other platforms too — `react-native` renders to mobile instead of a browser.

---

## 8. React DOM & Rendering

**ReactDOM** is a separate package from React that is responsible for **rendering React components into the actual browser DOM**.

- `react` — knows how to build and manage components, Virtual DOM, state, hooks.
- `react-dom` — knows how to take those components and render them into the real browser DOM.

### How Rendering Works:

**Step 1 — index.html has a single empty div:**
```html
<!-- index.html -->
<div id="root"></div>
```
This is the only HTML element React needs. Everything else is generated by React.

**Step 2 — main.jsx mounts the React app into that div:**
```jsx
// main.jsx
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
```

**Step 3 — React takes over:**
- `document.getElementById('root')` — finds the `#root` div in the HTML.
- `ReactDOM.createRoot()` — creates a React root, enabling React 18 features like Concurrent Mode.
- `.render(<App />)` — renders the entire React component tree starting from `<App />` into the `#root` div.

### Why only one div?
- React manages all UI updates itself through the Virtual DOM.
- Having one entry point keeps the app structure clean and predictable.
- This is why React apps are called **Single Page Applications (SPA)** — one HTML page, React handles everything inside it dynamically.

### Old way (React 17 and below) vs New way (React 18+):
```jsx
// ❌ Old way — React 17
ReactDOM.render(<App />, document.getElementById('root'));

// ✅ New way — React 18+
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
```

---

## 9. Real DOM vs Virtual DOM

### What is the Real DOM?
- **DOM** stands for **Document Object Model**.
- It is a tree-like structure the browser creates from your HTML to represent the page.
- Every time something changes, the browser **re-paints and re-layouts** the affected parts — which is slow for frequent updates.

### What is the Virtual DOM?
- The Virtual DOM is a **lightweight JavaScript object** (plain JS, not a browser API) that React keeps **in memory**.
- It is an exact copy of the real DOM structure but lives in RAM, not in the browser.
- Updating a JS object in memory is **much faster** than updating the real browser DOM.

### How React uses both together:
```
Real DOM  ←  React updates only changed nodes
              ↑
          Reconciliation
              ↑
          Diffing (compare new vs old)
              ↑
Virtual DOM (new)  vs  Virtual DOM (old)  — both in memory
```

| | Real DOM | Virtual DOM |
|---|---|---|
| Where it lives | Browser | Memory (RAM) — JS object |
| Speed | Slow — re-paints entire tree | Fast — plain JS object manipulation |
| Memory usage | High | Low |
| Manipulation | Direct browser API | Via React's diffing algorithm |
| Re-render | Full page re-render possible | Only affected components re-render |
| Who manages it | Browser | React |

---

## 10. React Fiber

**React Fiber** is the complete internal rewrite of React's core rendering algorithm, introduced in **React 16 (2017)**.

### The Problem Before Fiber:
- React's original rendering was **synchronous** — once it started updating the DOM, it could not stop or pause.
- For large, complex UIs this meant the browser could **freeze** until React finished all updates.
- There was no way to prioritize urgent updates (like user input) over less urgent ones (like loading a list).

### What Fiber Solved:
- Fiber broke rendering work into small **units of work** (called fibers).
- React can now **pause** rendering, do something more urgent, then **resume** where it left off.
- It can **prioritize** high-priority updates (animations, user input) over low-priority ones (background data fetch).

### What Fiber Enables:
- **Concurrent Mode** — React can work on multiple tasks at the same time.
- **Suspense** — show a fallback UI while waiting for data or lazy-loaded components.
- **Transitions** — mark some updates as non-urgent so they don't block the UI.
- **Error Boundaries** — catch rendering errors gracefully without crashing the whole app.

> As a beginner, just know: Fiber is the engine under the hood that makes React fast, smooth, and capable of handling complex UIs without freezing the browser.

---

## 11. Declarative vs Imperative Programming

| | Imperative | Declarative (React) |
|---|---|---|
| Approach | You tell *how* to do it step by step | You tell *what* you want |
| Example | `document.getElementById('btn').style.color = 'red'` | `<Button color="red" />` |
| Code | More verbose | Cleaner, readable |

React is **declarative** — you describe the UI state, React figures out the DOM updates.

---

## 12. SPA vs MPA

### SPA — Single Page Application
- Loads **one HTML page** once from the server.
- After that, JavaScript (React) dynamically updates the content **without full page reloads**.
- Navigation feels instant because only data changes, not the whole page.
- Examples: Gmail, Facebook, Twitter, Netflix.

### MPA — Multi Page Application
- Every time you navigate to a new page, the browser makes a **full request to the server** and reloads the entire page.
- Traditional websites work this way.
- Examples: Government websites, old e-commerce sites.

| | SPA (Single Page App) | MPA (Multi Page App) |
|---|---|---|
| Page Load | Loads once, updates dynamically | Full reload on every navigation |
| Speed | Faster after initial load | Slower — full reload each time |
| SEO | Harder (needs extra setup) | Easier — each page is a full HTML |
| Example | Gmail, Facebook, Netflix | Traditional websites |
| React fits | ✅ Yes | ❌ Not ideal |

---

## 13. React Versions — Key Milestones

| Version | Release Year | Key Feature |
|---|---|---|
| React 0.3 (first release) | 2013 | Open-sourced by Facebook |
| React 15 | 2016 | Stable DOM improvements |
| React 16 | 2017 | Fiber engine, Error Boundaries, Portals |
| React 16.3 | 2018 | New Context API, `createRef` |
| React 16.8 | 2019 | **Hooks introduced** (`useState`, `useEffect`, etc.) |
| React 17 | 2020 | No new features — gradual upgrade improvements |
| React 18 | 2022 | **Concurrent Mode**, `createRoot`, auto-batching, Suspense improvements |
| React 19 | 2024 | **Actions, Server Components, new hooks** (`useActionState`, `useOptimistic`, `use`) |

### React 19 — Major Features Explained (December 2024)

React 19 is the biggest release since Hooks (React 16.8). Here's what's new:

**1. Actions**
- Before React 19, handling async operations (like form submissions to an API) required a lot of manual state management — loading state, error state, success state.
- **Actions** are async functions that React now manages automatically.
- React handles the pending, error, and success states for you.
```jsx
// Before React 19 — manual loading/error state
const [loading, setLoading] = useState(false);
const [error, setError]     = useState(null);

async function handleSubmit() {
  setLoading(true);
  try {
    await submitForm(data);
  } catch (e) {
    setError(e);
  } finally {
    setLoading(false);
  }
}

// After React 19 — useActionState handles it
const [state, submitAction, isPending] = useActionState(submitForm, null);
```

**2. `useActionState` Hook (New)**
- Manages the state of an async action — result, error, and pending status.
- Replaces the pattern of manually managing loading/error states for form submissions.

**3. `useOptimistic` Hook (New)**
- Allows you to **optimistically update the UI** before the server confirms the action.
- Example: Show a message as "sent" immediately, then revert if the server returns an error.
```jsx
const [optimisticMessages, addOptimisticMessage] = useOptimistic(messages);
// UI updates instantly — no waiting for server response
```

**4. `use` Hook (New)**
- A new hook that can read the value of a **Promise** or **Context** directly inside a component.
- Unlike other hooks, `use` can be called inside loops and conditions.
```jsx
const data = use(fetchDataPromise);   // reads a promise
const theme = use(ThemeContext);      // reads context
```

**5. React Server Components (RSC) — Stable**
- Components that run **only on the server** — they fetch data and render HTML before sending to the browser.
- No JavaScript is sent to the client for server components — faster page loads.
- This is a fundamental shift in how React apps can be architected.
- Fully supported in **Next.js 14+**.

**6. Server Actions**
- Functions that run **on the server** but can be called directly from client components.
- Eliminates the need to write separate API endpoints for simple data mutations.
```jsx
// Server Action — runs on server, called from client
async function saveUser(formData) {
  'use server';  // marks this as a server action
  await db.save(formData);
}
```

**7. `ref` as a Prop (No more `forwardRef`)**
- Before React 19, passing a `ref` to a child component required wrapping it in `forwardRef()` — verbose and confusing.
- In React 19, `ref` can be passed as a **regular prop** directly.
```jsx
// Before React 19
const Input = forwardRef((props, ref) => <input ref={ref} {...props} />);

// React 19 — ref is just a prop now ✅
function Input({ ref, ...props }) {
  return <input ref={ref} {...props} />;
}
```

**8. Improved `<form>` Support**
- React 19 adds native support for `action` prop on `<form>` elements.
- Forms can now call async functions directly without `onSubmit` boilerplate.
```jsx
<form action={submitAction}>
  <input name="name" />
  <button type="submit">Submit</button>
</form>
```

### Summary — React 18 vs React 19:
| Feature | React 18 (2022) | React 19 (2024) |
|---|---|---|
| Async state management | Manual (`useState`) | Automatic (`useActionState`) |
| Optimistic UI | Manual | `useOptimistic` hook |
| Server Components | Experimental | ✅ Stable |
| `ref` forwarding | Required `forwardRef` | Just a regular prop |
| Form handling | `onSubmit` + state | Native `action` prop |
| Reading Promises | Not possible in render | `use()` hook |

---

## 14. Interview Questions — React Fundamentals

**Q1. What is the Virtual DOM and how does React use it?**
> React maintains a Virtual DOM (in-memory JS object copy of the real DOM). On state change, it diffs the new and old Virtual DOM and patches only the changed parts in the real DOM.

**Q2. What is JSX? Is it mandatory in React?**
> JSX is a syntax extension that lets you write HTML-like code in JavaScript. It's not mandatory — you can use `React.createElement()` directly — but JSX makes code much more readable.

**Q3. What is the difference between a Library and a Framework? Is React a library or framework?**
> A **library** is a collection of tools you call when you need them — you are in control of the flow. A **framework** dictates the structure and calls your code (inversion of control). React is a **library** — it only handles the View layer and gives you freedom to choose your own tools for routing, state management, etc. Angular is an example of a full framework.

**Q4. What is the difference between functional and class components?**
> Functional components are plain JS functions that return JSX. Class components extend `React.Component` and use a `render()` method. Since React 16.8, functional components with Hooks are the standard — class components are considered legacy.

**Q5. What is the difference between default export and named export?**
> A file can have only one `default export` but multiple `named exports`. Default: `import UserCard from './UserCard'`. Named: `import { Person } from './UserCard'`.

**Q6. Why must component names start with a capital letter?**
> React uses the capital letter to distinguish custom components from native HTML tags. `<div>` is HTML; `<Div>` would be treated as a React component.

**Q7. What is Reconciliation in React?**
> Reconciliation is the process React uses to compare the new Virtual DOM with the previous one and determine the minimal set of real DOM changes needed.

**Q8. What is React Fiber?**
> React Fiber is the complete rewrite of React's internal core rendering algorithm, introduced in React 16 (2017). Before Fiber, React's rendering was synchronous — once it started updating the DOM, it couldn't stop until it finished, which could freeze the UI for complex updates. Fiber broke rendering into small units of work that can be **paused, prioritized, resumed, or discarded**. This enables features like Concurrent Mode, Suspense, and smooth animations without blocking the main thread.

**Q9. What is the recommended way to create a React app today and why?**
> **Vite** is recommended because it has a much faster dev server and build process compared to the older Create React App (CRA).

**Q10. What is the difference between Real DOM and Virtual DOM?**
> Real DOM is slow — any change re-renders the whole tree. Virtual DOM is a lightweight in-memory copy; React diffs it and updates only the changed nodes in the real DOM, making updates efficient.

**Q11. What does `ReactDOM.createRoot()` do?**
> `ReactDOM.createRoot()` is the React 18+ way to mount a React application into the real browser DOM. It takes a real DOM node (usually the `#root` div from `index.html`) and creates a React root on it. Calling `.render(<App />)` on it tells React to render the entire component tree inside that node. Compared to the old `ReactDOM.render()`, `createRoot` unlocks React 18 features like Concurrent Mode and automatic batching of state updates.

**Q12. What is a SPA? Is React a SPA framework?**
> A Single Page Application loads one HTML page and dynamically updates content without full page reloads. React is commonly used to build SPAs.

**Q13. What is the difference between Declarative and Imperative programming? Which does React follow?**
> Imperative = you describe *how* to do something step by step. Declarative = you describe *what* you want. React is **declarative** — you define the UI state and React handles the DOM updates.

**Q14. What are the JSX rules every React developer must know?**
> - Must return **one root element** — wrap multiple elements in `<div>` or `<>`.
> - All tags must be **self-closed** — `<img />`, `<br />`, `<input />`.
> - Use `className` instead of `class` — `class` is a reserved JS keyword.
> - Use **camelCase** for all attributes — `onClick`, `onChange`, `tabIndex`.
> - Use `{}` to embed **JS expressions** — variables, ternary, `.map()`.
> - No `if`, `for`, `while` directly inside JSX — use ternary or `&&` instead.
> - Use **Fragment** `<>...</>` to avoid adding unnecessary DOM nodes.

**Q15. What major feature was introduced in React 16.8?**
> **Hooks** were introduced in React 16.8 (February 2019). Before Hooks, only class components could use state and lifecycle methods. Hooks like `useState` and `useEffect` brought these capabilities to functional components, making class components largely unnecessary. This was one of the biggest shifts in how React apps are written.

**Q17. What is the difference between `react` and `react-dom`?**
> `react` is the core library that handles components, state, hooks, and the Virtual DOM — it is platform-independent. `react-dom` is the renderer that connects React to the browser's real DOM via `ReactDOM.createRoot()`. This separation allows React to target other platforms like mobile (`react-native`) using the same core.

**Q18. What is Babel or SWC? Why is it needed in React?**
> Babel and SWC are **transpilers** — tools that convert JSX and modern JavaScript into plain JavaScript that browsers can understand. The browser cannot read JSX directly. Vite uses SWC by default, which is faster than Babel. Without a transpiler, React code would not run in the browser.

**Q19. What does "in-memory" mean in the context of React's Virtual DOM?**
> "In-memory" means the data exists in the computer's **RAM (Random Access Memory)** — not in the browser, not on disk, not on a server. It's a temporary JavaScript object that React creates and manages internally. Accessing and modifying data in memory (RAM) is extremely fast compared to interacting with the browser's real DOM, which involves layout calculations, painting, and re-rendering. This is why React's Virtual DOM approach makes UI updates so efficient — React does all the comparison work in memory first, then touches the real DOM as little as possible.

---

> ⏭️ Next Topic: **Props** — Passing data into components (covered in `component_02`).
