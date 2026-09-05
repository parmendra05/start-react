# React - useRef & useContext

---

## 1. What is useRef?

`useRef` is a React Hook that gives you a **mutable object** whose `.current` property persists across renders — without causing a re-render when it changes.

It has **two main uses**:
1. **Accessing DOM elements directly** (focus, scroll, measure)
2. **Storing a value that persists between renders** without triggering a re-render

```jsx
import { useRef } from 'react';

const myRef = useRef(initialValue);
// myRef = { current: initialValue }
```

- `useRef()` returns a plain object: `{ current: ... }`
- `.current` is the only property — you read and write to it directly
- Changing `.current` does **not** cause a re-render
- The `.current` value **survives** re-renders (unlike regular variables)

---

## 2. useRef — DOM Access

The most common use of `useRef` is to get a **direct reference to a DOM element** — so you can call browser APIs on it like `.focus()`, `.blur()`, `.scrollIntoView()`, or read its size.

### How it works:
1. Create a ref: `const inputRef = useRef()`
2. Attach it to a JSX element: `<input ref={inputRef} />`
3. After the component mounts, `inputRef.current` points to the actual DOM node
4. Call any DOM method on it: `inputRef.current.focus()`

```
useRef()  →  { current: null }
              ↓ (after mount)
           { current: <input DOM element> }
```

---

### Example 1 — Auto Focus an Input

```jsx
import { useRef, useEffect } from 'react';

function SearchBar() {
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.focus();  // focus the input when component mounts
  }, []);

  return <input ref={inputRef} placeholder="Search..." />;
}
```

- `inputRef.current` is `null` before the component mounts.
- After mount, React sets `inputRef.current` to the actual `<input>` DOM element.
- `useEffect` with `[]` runs after mount — safe to call `.focus()` here.

---

### Example 2 — Focus on Button Click

```jsx
import { useRef } from 'react';

function App() {
  const inputRef = useRef();

  function handleClick() {
    inputRef.current.focus();   // focus the input
    inputRef.current.select();  // also select any existing text
  }

  return (
    <div>
      <input ref={inputRef} defaultValue="Hello" />
      <button onClick={handleClick}>Focus Input</button>
    </div>
  );
}
```

---

### Example 3 — Reading DOM Measurements

```jsx
import { useRef, useState } from 'react';

function Box() {
  const boxRef  = useRef();
  const [size, setSize] = useState({ width: 0, height: 0 });

  function measureBox() {
    const rect = boxRef.current.getBoundingClientRect();
    setSize({ width: rect.width, height: rect.height });
  }

  return (
    <div>
      <div ref={boxRef} style={{ width: '200px', height: '100px', background: 'lightblue' }}>
        Box
      </div>
      <button onClick={measureBox}>Measure</button>
      <p>Width: {size.width}px | Height: {size.height}px</p>
    </div>
  );
}
```

---

### Example 4 — Scroll to Element

```jsx
import { useRef } from 'react';

function Page() {
  const bottomRef = useRef();

  function scrollToBottom() {
    bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div>
      <button onClick={scrollToBottom}>Scroll to Bottom</button>

      <div style={{ height: '1000px' }}>...lots of content...</div>

      <div ref={bottomRef}>
        <p>You reached the bottom!</p>
      </div>
    </div>
  );
}
```

---

### Common DOM Methods Used with useRef:

| Method / Property | What it does |
|---|---|
| `.focus()` | Focuses the element |
| `.blur()` | Removes focus |
| `.select()` | Selects text inside input |
| `.scrollIntoView()` | Scrolls element into view |
| `.getBoundingClientRect()` | Returns size and position |
| `.value` | Reads/sets input value (uncontrolled) |
| `.style.property` | Directly sets CSS style |
| `.click()` | Programmatically clicks element |

---

## 3. useRef — Persist Value Without Re-render

The second use of `useRef` is storing a **mutable value** that:
- Persists between renders (survives re-renders like state)
- Does **not** trigger a re-render when changed (unlike state)

This is useful for values that are needed internally by the component but don't affect what's displayed in the UI.

```
Regular variable  →  resets on every render          ❌
useState          →  persists + triggers re-render    ✅ (for UI data)
useRef            →  persists + NO re-render          ✅ (for non-UI data)
```

---

### Example 1 — Storing a Timer ID

```jsx
import { useRef, useState } from 'react';

function Stopwatch() {
  const [time, setTime]     = useState(0);
  const intervalRef         = useRef(null);  // stores timer ID — not shown in UI

  function start() {
    // prevent multiple intervals from starting
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);
  }

  function stop() {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }

  function reset() {
    stop();
    setTime(0);
  }

  return (
    <div>
      <p>Time: {time}s</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

- `intervalRef.current` stores the timer ID — changing it doesn't re-render.
- `time` is in state because it's displayed in the UI.
- If `intervalRef` were `useState`, updating it would cause unnecessary re-renders.

---

### Example 2 — Tracking Previous State Value

```jsx
import { useRef, useEffect, useState } from 'react';

function App() {
  const [count, setCount] = useState(0);
  const prevCountRef      = useRef(0);

  useEffect(() => {
    prevCountRef.current = count;  // update after every render
  });

  return (
    <div>
      <p>Current: {count}</p>
      <p>Previous: {prevCountRef.current}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

- `prevCountRef.current` is updated in `useEffect` (which runs after render).
- During the current render, `prevCountRef.current` still holds the previous value.
- Updating `.current` doesn't trigger a re-render — so it's safe to update in every effect.

---

### Example 3 — Counting Renders (without causing infinite loop)

```jsx
import { useRef, useState } from 'react';

function App() {
  const [name, setName]  = useState('');
  const renderCount      = useRef(0);

  renderCount.current += 1;  // increments on every render — no re-render triggered

  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <p>Render count: {renderCount.current}</p>
    </div>
  );
}
```

- If `renderCount` were `useState`, incrementing it would trigger another render → infinite loop.
- `useRef` increments silently — no re-render.

---

### Example 4 — Ignore First useEffect Run (Skip Mount)

```jsx
import { useRef, useEffect, useState } from 'react';

function App() {
  const [count, setCount] = useState(0);
  const isMounted         = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;  // mark as mounted
      return;                    // skip the first run
    }

    console.log('count changed to:', count);  // only runs on updates, not mount
  }, [count]);

  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}
```

---

### useState vs useRef — Full Comparison:

| | `useState` | `useRef` |
|---|---|---|
| Triggers re-render on change | ✅ Yes | ❌ No |
| Value persists between renders | ✅ Yes | ✅ Yes |
| Use for UI data (shown in JSX) | ✅ Yes | ❌ No |
| Use for non-UI data (timers, IDs) | ❌ Overkill | ✅ Yes |
| Access value | `count` directly | `ref.current` |
| Update value | `setCount(newVal)` | `ref.current = newVal` |

---

## 4. What is useContext?

`useContext` is a React Hook that lets you **share data across the component tree** without passing props manually at every level.

### The Problem — Prop Drilling:

```
App (has user data)
  └── Header
        └── Navbar
              └── UserAvatar  ← needs user data
```

Without context, you'd have to pass `user` as a prop through every level — even components that don't need it. This is called **prop drilling**.

```jsx
// ❌ Prop drilling — passing user through every level
<App user={user}>
  <Header user={user}>
    <Navbar user={user}>
      <UserAvatar user={user} />   {/* only this needs it */}
    </Navbar>
  </Header>
</App>
```

### The Solution — Context:

Context lets you **teleport** data directly to any component that needs it, skipping all the levels in between.

```
App (provides user via Context)
  └── Header          ← doesn't need user, doesn't receive it
        └── Navbar    ← doesn't need user, doesn't receive it
              └── UserAvatar  ← reads user directly from Context ✅
```

---

### 3 Steps to Use Context:

```
Step 1: CREATE   →  createContext()         — defines the context
Step 2: PROVIDE  →  <Context.Provider>      — wraps components, supplies the value
Step 3: CONSUME  →  useContext(Context)     — reads the value inside any component
```

---

## 5. useContext — Step 1: Create Context

Use `createContext()` to create a context object. This is usually done in a **separate file** so it can be imported anywhere.

```jsx
// UserContext.js
import { createContext } from 'react';

const UserContext = createContext();  // creates the context object

export default UserContext;
```

- `createContext()` returns a context object with two important parts: `.Provider` and `.Consumer`.
- You can pass a **default value** to `createContext(defaultValue)` — used when a component reads context but has no Provider above it.

```jsx
const ThemeContext = createContext('light');  // default value = 'light'
```

> Convention: name context files and variables with a capital letter — `UserContext`, `ThemeContext`, `AuthContext`.

---

## 6. useContext — Step 2: Provide Context

Wrap the part of your component tree that needs access to the data with `<Context.Provider value={...}>`.

```jsx
// App.jsx
import { useState } from 'react';
import UserContext from './UserContext';
import Header from './Header';

function App() {
  const [user, setUser] = useState({ name: 'Raju', role: 'admin' });

  return (
    <UserContext.Provider value={user}>   {/* provide the value */}
      <Header />
      {/* any component inside here can access user via useContext */}
    </UserContext.Provider>
  );
}
```

- `value={user}` — the data you want to share. Can be anything: object, string, number, function, array.
- Any component **inside** the Provider (at any depth) can read this value.
- Components **outside** the Provider cannot access it.
- If the `value` changes, all consuming components **automatically re-render** with the new value.

---

### Providing Multiple Values:

```jsx
// Provide an object with multiple values
<UserContext.Provider value={{ user, setUser }}>
  <App />
</UserContext.Provider>
```

---

### Nesting Multiple Providers:

```jsx
<ThemeContext.Provider value={theme}>
  <UserContext.Provider value={user}>
    <App />
  </UserContext.Provider>
</ThemeContext.Provider>
```

- Each Provider is independent.
- A component can consume multiple contexts by calling `useContext` multiple times.

---

## 7. useContext — Step 3: Consume Context

Use `useContext(ContextObject)` inside any component to read the current context value.

```jsx
import { useContext } from 'react';
import UserContext from './UserContext';

function UserAvatar() {
  const user = useContext(UserContext);  // reads value from nearest Provider above

  return <p>Logged in as: {user.name}</p>;
}
```

- No props needed — `UserAvatar` reads `user` directly from context.
- `useContext` always reads from the **nearest** `<Context.Provider>` above it in the tree.
- If there is no Provider above, it uses the default value passed to `createContext()`.

---

## 8. Full useContext Example — Theme Switcher

A complete real-world example showing all 3 steps together.

### Step 1 — Create Context (ThemeContext.js):

```jsx
import { createContext } from 'react';

const ThemeContext = createContext('light');  // default = 'light'

export default ThemeContext;
```

### Step 2 — Provide Context (App.jsx):

```jsx
import { useState } from 'react';
import ThemeContext from './ThemeContext';
import Page from './Page';

function App() {
  const [theme, setTheme] = useState('light');

  function toggleTheme() {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <Page />
    </ThemeContext.Provider>
  );
}

export default App;
```

### Step 3 — Consume Context (Page.jsx and Button.jsx):

```jsx
// Page.jsx — consumes theme for styling
import { useContext } from 'react';
import ThemeContext from './ThemeContext';
import ThemeButton from './ThemeButton';

function Page() {
  const { theme } = useContext(ThemeContext);

  return (
    <div style={{
      background: theme === 'light' ? '#fff' : '#333',
      color:      theme === 'light' ? '#000' : '#fff',
      minHeight:  '100vh',
      padding:    '20px',
    }}>
      <h1>Current Theme: {theme}</h1>
      <ThemeButton />
    </div>
  );
}

export default Page;
```

```jsx
// ThemeButton.jsx — consumes toggleTheme function
import { useContext } from 'react';
import ThemeContext from './ThemeContext';

function ThemeButton() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button onClick={toggleTheme}>
      Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
    </button>
  );
}

export default ThemeButton;
```

- `Page` and `ThemeButton` both read from `ThemeContext` independently — no prop drilling.
- When `toggleTheme` is called, `theme` state in `App` updates → Provider's `value` changes → both consumers re-render automatically.

---

## 9. Full useContext Example — Auth / User Context

Another common real-world pattern — sharing logged-in user data across the app.

### AuthContext.js:

```jsx
import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

// Custom Provider component — keeps all auth logic in one place
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  function login(userData) {
    setUser(userData);
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — cleaner way to consume this context
export function useAuth() {
  return useContext(AuthContext);
}
```

### main.jsx — Wrap the whole app:

```jsx
import { AuthProvider } from './AuthContext';

<AuthProvider>
  <App />
</AuthProvider>
```

### Any component — consume with custom hook:

```jsx
import { useAuth } from './AuthContext';

function Navbar() {
  const { user, logout } = useAuth();  // clean — no need to import AuthContext directly

  return (
    <nav>
      {user ? (
        <>
          <span>Welcome, {user.name}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <span>Please log in</span>
      )}
    </nav>
  );
}
```

- `AuthProvider` wraps the whole app — all components can access auth data.
- `useAuth()` is a **custom hook** that wraps `useContext(AuthContext)` — cleaner API, no need to import the context object everywhere.
- This pattern (context + custom hook) is the standard production approach.

---

## 10. When to Use Context vs Props

Context is powerful but should not replace props for everything.

| Situation | Use |
|---|---|
| Data needed by 1–2 nearby components | Props ✅ |
| Data needed by many components at different levels | Context ✅ |
| Global data: theme, language, auth, user | Context ✅ |
| Frequently changing data (every keystroke) | Props or state (Context re-renders all consumers) |
| Component-specific data | Props ✅ |

> Context is not a replacement for all props. Overusing context makes components harder to reuse and test. Use it for truly global or widely-shared data.

---

## 11. Common Mistakes with useContext

### Mistake 1 — Forgetting to wrap with Provider:
```jsx
// ❌ UserAvatar has no Provider above it — gets default value (undefined)
function App() {
  return <UserAvatar />;  // no Provider!
}

// ✅ Correct
function App() {
  return (
    <UserContext.Provider value={user}>
      <UserAvatar />
    </UserContext.Provider>
  );
}
```

### Mistake 2 — Creating context inside a component:
```jsx
// ❌ Wrong — new context object created on every render
function App() {
  const UserContext = createContext();  // NEVER do this inside a component
}

// ✅ Correct — create outside, at module level
const UserContext = createContext();

function App() { ... }
```

### Mistake 3 — Unnecessary re-renders from object value:
```jsx
// ❌ New object created on every render → all consumers re-render every time
<UserContext.Provider value={{ user, setUser }}>

// ✅ Memoize the value to prevent unnecessary re-renders
const value = useMemo(() => ({ user, setUser }), [user]);
<UserContext.Provider value={value}>
```

---

## 12. useRef & useContext — Summary

### useRef Summary:
| Use Case | How |
|---|---|
| Access a DOM element | `const ref = useRef(); <div ref={ref} />` |
| Focus an input | `ref.current.focus()` |
| Store timer ID | `const timerRef = useRef(null)` |
| Track previous value | `useEffect(() => { prevRef.current = value; })` |
| Count renders | `renderCount.current += 1` |
| Skip first effect run | `isMounted.current` flag |

### useContext Summary:
| Step | Code |
|---|---|
| Create | `const MyContext = createContext()` |
| Provide | `<MyContext.Provider value={data}>` |
| Consume | `const data = useContext(MyContext)` |
| Best practice | Wrap in custom hook: `export function useMyContext() { return useContext(MyContext); }` |

---

## 13. Interview Questions

**Q1. What is useRef in React? What are its two main uses?**
> `useRef` is a React Hook that returns a mutable object `{ current: value }` that persists across renders without causing re-renders. Its two main uses are: (1) accessing DOM elements directly by attaching `ref` to JSX elements, and (2) storing mutable values that don't need to trigger a re-render — like timer IDs, previous values, or render counts.

**Q2. How do you access a DOM element using useRef?**
> Create a ref with `useRef()`, attach it to a JSX element using the `ref` attribute (`<input ref={inputRef} />`), and after the component mounts, `inputRef.current` points to the actual DOM node. You can then call DOM methods like `inputRef.current.focus()`.

**Q3. What is the difference between useRef and useState?**
> Both persist values across renders, but `useState` triggers a re-render when updated while `useRef` does not. Use `useState` for values that affect the UI. Use `useRef` for values that don't need to be displayed — like timer IDs, DOM references, or previous values.

**Q4. Why would you store a timer ID in useRef instead of useState?**
> A timer ID is not displayed in the UI — it's only used internally to start/stop the timer. Storing it in `useState` would cause unnecessary re-renders every time it's set. `useRef` stores it silently without triggering any re-render.

**Q5. How do you track the previous value of a state variable using useRef?**
> Store the value in a ref inside `useEffect` (which runs after render). During the current render, the ref still holds the previous value. After render, `useEffect` updates it to the current value for the next render: `useEffect(() => { prevRef.current = value; })`.

**Q6. What is prop drilling? How does useContext solve it?**
> Prop drilling is passing data through multiple intermediate components that don't need it, just to reach a deeply nested component that does. `useContext` solves this by letting any component in the tree read shared data directly from a Provider — without receiving it as a prop.

**Q7. What are the 3 steps to use useContext?**
> (1) Create — `const MyContext = createContext()`. (2) Provide — wrap components with `<MyContext.Provider value={data}>`. (3) Consume — call `useContext(MyContext)` inside any component inside the Provider tree.

**Q8. What happens if a component calls useContext but there is no Provider above it?**
> The component receives the **default value** passed to `createContext(defaultValue)`. If no default was provided, it receives `undefined`.

**Q9. What does the Provider's `value` prop do? What happens when it changes?**
> The `value` prop is the data shared with all consuming components. When `value` changes (e.g. state update in the parent), React automatically re-renders all components that called `useContext` for that context — keeping them in sync.

**Q10. Where should you call createContext — inside or outside a component? Why?**
> Always outside a component, at the module level. If called inside a component, a new context object is created on every render — consumers would never find the matching Provider and would always get the default value.

**Q11. Can a component consume multiple contexts?**
> Yes. Call `useContext` multiple times with different context objects: `const theme = useContext(ThemeContext)` and `const user = useContext(UserContext)`. Each call reads from its own nearest Provider independently.

**Q12. What is the Context + Custom Hook pattern? Why is it recommended?**
> Instead of exporting the context object and importing it in every consumer, you export a custom hook that wraps `useContext`: `export function useAuth() { return useContext(AuthContext); }`. Consumers just call `useAuth()` — cleaner API, no need to import the context object directly, and you can add validation (throw error if used outside Provider).

**Q13. When should you NOT use context?**
> Avoid context for data that changes very frequently (like every keystroke) because every consumer re-renders on every change. Also avoid it for data only needed by 1–2 nearby components — props are simpler and more explicit in that case. Context is best for truly global data: theme, language, auth, user.

**Q14. What is the difference between useRef and createRef?**
> `createRef()` creates a new ref object on every render — it's meant for class components. `useRef()` creates the ref once and returns the same object on every render — it's the correct choice for functional components.

**Q15. How do you prevent unnecessary re-renders when passing an object as context value?**
> Wrap the value in `useMemo`: `const value = useMemo(() => ({ user, setUser }), [user])`. Without this, a new object is created on every render of the Provider component, causing all consumers to re-render even if the actual data hasn't changed.

---

> ⏭️ Next Topic: **useReducer & Custom Hooks** — covered in `component_07`.
