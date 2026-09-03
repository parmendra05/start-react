# React - Beginner Notes

---

## 1. What is React & How it Works

React is a **JavaScript library** built by Facebook (Meta) for building **user interfaces**, especially Single Page Applications (SPAs).

### How it Works:

- **Virtual DOM**: React keeps a lightweight copy of the real DOM in memory called the Virtual DOM.
- When state/data changes, React creates a new Virtual DOM tree.
- It then **compares (diffs)** the new tree with the previous one.
- Only the **changed parts** are updated in the real DOM — this is called **Reconciliation**.
- This makes UI updates fast and efficient.

```
User Action → State Changes → Virtual DOM Updates → Diff with Old VDOM → Real DOM Patched
```

---

## 2. Advantages & Disadvantages

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

## 3. Ways to Create a React App

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

JSX lets you write HTML-like syntax inside JavaScript.

```jsx
const element = <h1>Hello, World!</h1>;
```

- JSX is **not HTML** — it gets compiled to `React.createElement()` calls by Babel/SWC.
- You must return **one root element** (or use a Fragment `<>...</>`).
- Use `{}` to embed any JavaScript expression inside JSX.

```jsx
const name = "Raju";
const element = <h1>Hello, {name}!</h1>;  // Hello, Raju!
```

**JSX Rules:**
- All tags must be closed: `<img />`, `<br />`
- Use `className` instead of `class`
- Use `camelCase` for attributes: `onClick`, `onChange`
- Only one root element per return (wrap in `<div>` or `<>`)

---

## 5. Components

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

## 6. React DOM & Rendering

React needs an entry point in your HTML to render into.

```html
<!-- index.html -->
<div id="root"></div>
```

```jsx
// main.jsx
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
```

- `ReactDOM.createRoot()` — modern way (React 18+) to mount the app.
- Everything renders inside this single `#root` div — that's why React is called a **SPA (Single Page Application)**.

---

## 7. Real DOM vs Virtual DOM

| | Real DOM | Virtual DOM |
|---|---|---|
| Speed | Slow — updates entire tree | Fast — updates only changed parts |
| Memory | High | Low (in-memory JS object) |
| Manipulation | Direct | Via React's diffing algorithm |
| Re-render | Full page re-render | Only affected components re-render |

---

## 8. React Fiber

- **React Fiber** is the internal re-implementation of React's core algorithm (introduced in React 16).
- It makes rendering **asynchronous** — React can pause, prioritize, and resume rendering work.
- This enables features like **Concurrent Mode**, **Suspense**, and **Transitions**.
- As a beginner, just know: Fiber is what makes React fast and smooth under the hood.

---

## 9. Declarative vs Imperative

| | Imperative | Declarative (React) |
|---|---|---|
| Approach | You tell *how* to do it step by step | You tell *what* you want |
| Example | `document.getElementById('btn').style.color = 'red'` | `<Button color="red" />` |
| Code | More verbose | Cleaner, readable |

React is **declarative** — you describe the UI state, React figures out the DOM updates.

---

## 10. SPA vs MPA

| | SPA (Single Page App) | MPA (Multi Page App) |
|---|---|---|
| Page Load | Loads once, updates dynamically | Full reload on every page |
| Speed | Faster after initial load | Slower navigation |
| Example | Gmail, Facebook | Traditional websites |
| React fits | ✅ Yes | ❌ Not ideal |

---

## 11. React Versions — Key Milestones

| Version | Key Feature |
|---|---|
| React 16 | Error Boundaries, Portals, Fiber engine |
| React 16.8 | **Hooks introduced** (`useState`, `useEffect`) |
| React 17 | No new features — internal improvements |
| React 18 | **Concurrent Mode**, `createRoot`, auto-batching |

---

## 12. Interview Questions

**Q1. What is the Virtual DOM and how does React use it?**
> React maintains a Virtual DOM (in-memory JS object copy of the real DOM). On state change, it diffs the new and old Virtual DOM and patches only the changed parts in the real DOM.

**Q2. What is JSX? Is it mandatory in React?**
> JSX is a syntax extension that lets you write HTML-like code in JavaScript. It's not mandatory — you can use `React.createElement()` directly — but JSX makes code much more readable.

**Q3. What is the difference between a Library and a Framework? Is React a library or framework?**
> A library gives you tools to use as needed; a framework dictates the structure. React is a **library** — it only handles the View layer.

**Q4. What is the difference between functional and class components?**
> Functional components are plain JS functions that return JSX. Class components extend `React.Component` and use a `render()` method. Since React 16.8, functional components with Hooks are the standard — class components are considered legacy.

**Q5. What is the difference between default export and named export?**
> A file can have only one `default export` but multiple `named exports`. Default: `import UserCard from './UserCard'`. Named: `import { Person } from './UserCard'`.

**Q6. Why must component names start with a capital letter?**
> React uses the capital letter to distinguish custom components from native HTML tags. `<div>` is HTML; `<Div>` would be treated as a React component.

**Q7. What is Reconciliation in React?**
> Reconciliation is the process React uses to compare the new Virtual DOM with the previous one and determine the minimal set of real DOM changes needed.

**Q8. What is React Fiber?**
> React Fiber is the reimplemented core algorithm of React (since v16) that makes rendering asynchronous, allowing React to pause and prioritize rendering tasks for better performance.

**Q9. What is the recommended way to create a React app today and why?**
> **Vite** is recommended because it has a much faster dev server and build process compared to the older Create React App (CRA).

**Q10. What is the difference between Real DOM and Virtual DOM?**
> Real DOM is slow — any change re-renders the whole tree. Virtual DOM is a lightweight in-memory copy; React diffs it and updates only the changed nodes in the real DOM, making updates efficient.

**Q11. What does `ReactDOM.createRoot()` do?**
> It mounts the React application into a real DOM node (usually `#root`). It's the React 18+ way to initialize the app and enables Concurrent Mode features.

**Q12. What is a SPA? Is React a SPA framework?**
> A Single Page Application loads one HTML page and dynamically updates content without full page reloads. React is commonly used to build SPAs.

**Q13. What is the difference between Declarative and Imperative programming? Which does React follow?**
> Imperative = you describe *how* to do something step by step. Declarative = you describe *what* you want. React is **declarative** — you define the UI state and React handles the DOM updates.

**Q14. What are the JSX rules every React developer must know?**
> One root element per return, all tags must be closed, use `className` instead of `class`, use camelCase for events (`onClick`), and wrap siblings in a Fragment `<>` if you don't want an extra DOM node.

**Q15. What major feature was introduced in React 16.8?**
> **Hooks** — they allow functional components to use state and lifecycle features without writing class components.

---

> ⏭️ Next Topic: **Props** — Passing data into components (covered in `component_02`).
