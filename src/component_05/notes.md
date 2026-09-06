# React - useEffect Hook

---

## 1. What is useEffect?

`useEffect` is a React Hook that lets you perform **side effects** in functional components.

### What is a Side Effect?
A side effect is anything that happens **outside of rendering** — interacting with the outside world.

Examples of side effects:
- Fetching data from an API
- Setting up a timer (`setTimeout`, `setInterval`)
- Updating the document title
- Adding/removing event listeners
- Reading from localStorage

> Without `useEffect`, you cannot safely perform these operations inside a React component — because the component function runs on every render and would cause infinite loops or unexpected behavior.

---

## 2. Syntax

```jsx
import { useEffect } from 'react';

useEffect(() => {
  // side effect code here

  return () => {
    // cleanup code here (optional)
  };
}, [dependencies]);
```

`useEffect` takes **two arguments**:

```jsx
useEffect(
  () => {           // Argument 1 — what to run (the side effect)
    return () => {} // optional cleanup
  },
  []                // Argument 2 — when to run (dependency array)
);
```

### Parts at a glance:
| Part | Required | Purpose |
|---|---|---|
| Effect function | ✅ Yes | Your side effect code — runs after render |
| Cleanup function | ❌ Optional | Undo the effect — runs before next run or on unmount |
| Dependency array | ❌ Optional | Controls when the effect re-runs |

### Dependency array — 3 forms:
```jsx
useEffect(() => { ... });          // no array  — runs after every render
useEffect(() => { ... }, []);      // empty []  — runs once on mount only
useEffect(() => { ... }, [count]); // [count]   — runs when count changes
```

### useEffect cannot be async — here's why:

`useEffect` expects its callback to return either **nothing** or a **cleanup function**.
An `async` function always returns a **Promise** — React doesn't know what to do with that.

```jsx
// ❌ Wrong — async callback returns a Promise, not a cleanup function
useEffect(async () => {
  const data = await fetchData();
}, []);

// ✅ Correct — define async function inside, call it immediately
useEffect(() => {
  async function load() {
    const data = await fetchData();
  }
  load();  // call it here
}, []);
```

> Simple rule: never put `async` on the `useEffect` arrow function itself. Always create a separate async function inside and call it.

---

## 3. The Dependency Array — Most Important Concept

The **dependency array** is the second argument to `useEffect`. It controls **when** the effect runs.

### Case 1 — No dependency array → runs after EVERY render

When you don't pass a dependency array at all, the effect runs after **every single render** — initial render and every re-render.

```jsx
useEffect(() => {
  console.log('runs after every render');
});
// Runs on: mount, every state change, every prop change
```

⚠️ Be careful — if you update state inside this effect, it will cause an **infinite loop** (state update → re-render → effect runs → state update → ...).

Use this only when you genuinely need to react to every render, which is rare.

### Case 2 — Empty array `[]` → runs ONCE after first render (mount)
```jsx
useEffect(() => {
  console.log('runs only once — on mount');
}, []);
```

### Case 3 — With dependencies → runs when dependency value changes
```jsx
useEffect(() => {
  console.log('runs when count changes');
}, [count]);
```

### Summary Table:
| Dependency Array | When Effect Runs |
|---|---|
| Not provided | After every render |
| `[]` empty | Only once — on component mount |
| `[value]` | On mount + whenever `value` changes |
| `[a, b]` | On mount + whenever `a` or `b` changes |

---

## 4. Basic Examples

### Update Document Title
```jsx
import { useState, useEffect } from 'react';

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);  // runs whenever count changes

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

### Run Once on Mount
```jsx
useEffect(() => {
  console.log('Component mounted!');
}, []);
```

---

## 5. Fetching Data with useEffect

The most common real-world use of `useEffect` — fetching data from an API on component load.

```jsx
import { useState, useEffect } from 'react';

function UserList() {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      });
  }, []);  // empty array — fetch only once on mount

  if (loading) return <p>Loading...</p>;

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Using async/await inside useEffect:
```jsx
useEffect(() => {
  // ❌ Wrong — cannot make useEffect callback itself async
  // async () => { } is not allowed directly

  // ✅ Correct — define async function inside and call it
  async function fetchData() {
    const res  = await fetch('https://jsonplaceholder.typicode.com/users');
    const data = await res.json();
    setUsers(data);
    setLoading(false);
  }

  fetchData();
}, []);
```

> `useEffect` callback cannot be `async` directly. Define an async function inside and call it.

---

## 6. Cleanup Function

Think of `useEffect` as **setup + teardown**. The cleanup function is the teardown — it undoes whatever the effect set up.

```
Effect runs  →  sets something up  (timer, listener, subscription)
Cleanup runs →  tears it down      (clear timer, remove listener)
```

**When does cleanup run?**
- When the component is **removed from the UI** (unmount)
- Before the effect **runs again** due to a dependency change (cleans up old, then sets up new)

### Timer Cleanup — without cleanup, timer keeps running even after component is gone:
```jsx
useEffect(() => {
  // SETUP — start the timer
  const timer = setInterval(() => console.log('tick'), 1000);

  // TEARDOWN — stop the timer
  return () => clearInterval(timer);
}, []);
```

### Event Listener Cleanup — without cleanup, listener stacks up on every render:
```jsx
useEffect(() => {
  // SETUP — add listener
  function handleResize() {
    console.log(window.innerWidth);
  }
  window.addEventListener('resize', handleResize);

  // TEARDOWN — remove listener
  return () => window.removeEventListener('resize', handleResize);
}, []);
```

> Rule of thumb: if your effect **starts** something (timer, listener, subscription), always **return a cleanup** that stops it.

---

## 7. Component Lifecycle vs useEffect

### What is a Component Lifecycle?
Every React component goes through 3 phases during its life:

```
  MOUNT              UPDATE               UNMOUNT
    ↓                   ↓                    ↓
Component          State/Props           Component
appears in UI       changes             removed from UI
```

- **Mount** — component is created and added to the DOM for the first time.
- **Update** — component re-renders because state or props changed.
- **Unmount** — component is removed from the DOM (e.g. navigating away, conditional rendering hides it).

---

### Class Component Lifecycle Methods (Old Way)

Before Hooks, class components used special **lifecycle methods** to run code at each phase:

```jsx
class MyComponent extends React.Component {

  componentDidMount() {
    // runs ONCE after component is added to DOM
    // used for: API calls, subscriptions, timers
    console.log('Mounted!');
  }

  componentDidUpdate(prevProps, prevState) {
    // runs after EVERY update (state or props change)
    // used for: reacting to changes, re-fetching data
    if (prevState.count !== this.state.count) {
      console.log('Count changed!');
    }
  }

  componentWillUnmount() {
    // runs just BEFORE component is removed from DOM
    // used for: cleanup — clear timers, remove listeners
    console.log('Unmounting!');
  }

  render() {
    return <h1>Hello</h1>;
  }
}
```

---

### useEffect Replaces All 3 Lifecycle Methods

With functional components and `useEffect`, you don't need separate methods — one hook handles all 3 phases.

---

#### Phase 1 — Mount (`componentDidMount`)

Runs **once** after the component is added to the DOM.

```jsx
// Class way
componentDidMount() {
  fetch('/api/users').then(...);
}

// useEffect way ✅
useEffect(() => {
  fetch('/api/users').then(...);
}, []);  // empty array = run once on mount
```

---

#### Phase 2 — Update (`componentDidUpdate`)

Runs after **every re-render** caused by state or props change.

```jsx
// Class way
componentDidUpdate(prevProps, prevState) {
  if (prevState.count !== this.state.count) {
    document.title = `Count: ${this.state.count}`;
  }
}

// useEffect way ✅
useEffect(() => {
  document.title = `Count: ${count}`;
}, [count]);  // runs whenever count changes
```

- The dependency array in `useEffect` replaces the manual `prevState` comparison.
- React automatically re-runs the effect only when the listed dependency changes.

---

#### Phase 3 — Unmount (`componentWillUnmount`)

Runs just **before** the component is removed from the DOM.

```jsx
// Class way
componentWillUnmount() {
  clearInterval(this.timer);
  window.removeEventListener('resize', this.handleResize);
}

// useEffect way ✅
useEffect(() => {
  const timer = setInterval(() => console.log('tick'), 1000);
  window.addEventListener('resize', handleResize);

  return () => {
    clearInterval(timer);                          // cleanup on unmount
    window.removeEventListener('resize', handleResize);
  };
}, []);  // empty array = cleanup runs only on unmount
```

- The **return function** inside `useEffect` is the unmount equivalent.
- It runs when the component is removed from the UI.

---

#### All 3 Phases in One Component:

```jsx
import { useState, useEffect } from 'react';

function Timer() {
  const [seconds, setSeconds] = useState(0);

  // MOUNT — runs once when component appears
  useEffect(() => {
    console.log('Timer mounted!');
  }, []);

  // UPDATE — runs whenever seconds changes
  useEffect(() => {
    document.title = `Timer: ${seconds}s`;
  }, [seconds]);

  // MOUNT + UNMOUNT — setup and cleanup
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(interval);   // UNMOUNT — cleanup when component removed
      console.log('Timer unmounted!');
    };
  }, []);

  return <h2>Seconds: {seconds}</h2>;
}
```

---

### Lifecycle Comparison Table:

| Phase | When it runs | Class Method | useEffect Equivalent |
|---|---|---|---|
| Mount | Once — after first render | `componentDidMount()` | `useEffect(() => { }, [])` |
| Update | After every state/props change | `componentDidUpdate()` | `useEffect(() => { }, [dep])` |
| Unmount | Just before removed from DOM | `componentWillUnmount()` | `useEffect(() => { return () => { } }, [])` |
| Every render | After every render | No direct equivalent | `useEffect(() => { })` — no array |

---

### Why useEffect is Better than Lifecycle Methods:

| | Class Lifecycle Methods | useEffect |
|---|---|---|
| Code organization | Split across 3 separate methods | Related logic stays together in one effect |
| Reusability | Hard to reuse lifecycle logic | Can extract into custom hooks |
| Readability | Verbose, requires `this` | Clean, functional style |
| Multiple concerns | Mixed in one method | Separate `useEffect` per concern |

> In class components, you had to split related setup and cleanup across `componentDidMount` and `componentWillUnmount`. With `useEffect`, setup and its cleanup live **together** in the same block — much easier to read and maintain.

---

## 8. Multiple useEffect Hooks

You can use multiple `useEffect` calls in one component — each handles a separate concern.

```jsx
function App() {
  const [count, setCount] = useState(0);
  const [name, setName]   = useState('');

  // Effect 1 — runs when count changes
  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);

  // Effect 2 — runs once on mount
  useEffect(() => {
    console.log('Component mounted');
  }, []);

  // Effect 3 — runs when name changes
  useEffect(() => {
    console.log('Name changed:', name);
  }, [name]);
}
```

> Separating concerns into multiple `useEffect` calls keeps code clean and easy to maintain.

---

## 9. Fetching Data Based on a Dependency

Re-fetch data whenever a value (like a selected ID) changes.

```jsx
function UserDetail({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const res  = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
      const data = await res.json();
      setUser(data);
    }

    fetchUser();
  }, [userId]);  // re-runs whenever userId prop changes

  if (!user) return <p>Loading...</p>;
  return <h2>{user.name}</h2>;
}
```

---

## 10. Cleanup for Fetch — AbortController

### The Problem

Imagine the user clicks on User 1 → then quickly clicks User 2.
Two fetches are now running. If User 1's fetch finishes last, it overwrites User 2's data — wrong result shown.
Also, if the component unmounts before a fetch finishes, it tries to call `setUser` on a component that no longer exists — React warns about this.

```jsx
// ⚠️ No cleanup — old fetch can still call setState after unmount or after userId changed
useEffect(() => {
  async function fetchUser() {
    const res  = await fetch(`/api/users/${userId}`);
    const data = await res.json();
    setUser(data);  // may run on unmounted component
  }
  fetchUser();
}, [userId]);
```

### The Fix — AbortController

`AbortController` is a built-in browser tool that lets you **cancel a fetch request**.

```jsx
useEffect(() => {
  const controller = new AbortController();

  async function fetchUser() {
    try {
      const res  = await fetch(`/api/users/${userId}`, {
        signal: controller.signal   // link fetch to this controller
      });
      const data = await res.json();
      setUser(data);
    } catch (err) {
      if (err.name === 'AbortError') return;  // cancelled intentionally — ignore
      setError(err.message);
    }
  }

  fetchUser();

  return () => controller.abort();  // cancel fetch on unmount or userId change
}, [userId]);
```

**How it works in plain words:**
1. Each time `userId` changes, a new `AbortController` is created.
2. The cleanup from the previous effect calls `controller.abort()` — cancelling the old fetch.
3. Only the latest fetch completes and updates state.

> Think of it as: cleanup = "cancel whatever was in progress".

---

## 11. Persisting State to localStorage

A very common real-world pattern — save state to `localStorage` so it survives page refreshes.

```jsx
import { useState, useEffect } from 'react';

function App() {
  // Lazy initialization — read from localStorage only on first render
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  // Sync state to localStorage whenever theme changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </button>
    </div>
  );
}
```

- `useState(() => localStorage.getItem('theme') || 'light')` — lazy init reads saved value once on mount.
- `useEffect` with `[theme]` — writes to localStorage every time theme changes.
- On page refresh, the saved value is loaded back from localStorage.

---

## 12. Stale Closure in useEffect

A **stale closure** happens when a `useEffect` captures an old value of a state variable because it was created during an earlier render.

```jsx
const [count, setCount] = useState(0);

useEffect(() => {
  const timer = setInterval(() => {
    console.log(count);  // ⚠️ always logs 0 — stale closure
    // count was 0 when this effect ran — it never updates inside the interval
  }, 1000);

  return () => clearInterval(timer);
}, []);  // empty array — effect runs once, captures count = 0 forever
```

### Why it happens:
- The effect ran once with `count = 0` and the `setInterval` callback closed over that snapshot.
- Even as `count` updates, the interval still sees the old `count = 0`.

### Fix 1 — Add count to dependency array (re-creates interval on every change):
```jsx
useEffect(() => {
  const timer = setInterval(() => {
    console.log(count);  // ✅ always latest count
  }, 1000);

  return () => clearInterval(timer);  // cleanup old interval before creating new one
}, [count]);  // re-runs when count changes
```

### Fix 2 — Use functional update form (doesn't need to read count):
```jsx
useEffect(() => {
  const timer = setInterval(() => {
    setCount((prev) => prev + 1);  // ✅ prev is always latest — no stale closure
  }, 1000);

  return () => clearInterval(timer);
}, []);  // safe with empty array — doesn't read count directly
```

> Fix 2 is preferred for counters — the functional update `(prev) => prev + 1` always gets the latest value without needing `count` in the dependency array.

---

## 13. useLayoutEffect vs useEffect

You already know `useEffect` runs **after** the browser paints the screen. That's fine for most things — fetching data, setting timers, updating the title.

But sometimes you need to **read or change the DOM before the user sees it** — otherwise the user sees a flicker (element jumps from wrong position to correct position).

That's exactly what `useLayoutEffect` is for.

### The only difference — timing:

```
useEffect:
  Render → DOM updated → Browser paints ✦ → useEffect runs
                                         ↑ user sees the screen here

useLayoutEffect:
  Render → DOM updated → useLayoutEffect runs → Browser paints ✦
                                                ↑ user sees the screen here
```

`useLayoutEffect` runs **before** the browser paints — so you can fix the DOM and the user never sees the wrong state.

### When to use it:
```jsx
import { useLayoutEffect, useRef } from 'react';

function Tooltip() {
  const ref = useRef();

  useLayoutEffect(() => {
    // measure the element and reposition it BEFORE user sees it
    const { height } = ref.current.getBoundingClientRect();
    ref.current.style.top = `-${height}px`;
  }, []);

  return <div ref={ref}>Tooltip</div>;
}
```

With `useEffect` here, the tooltip would flash in the wrong position for a split second. With `useLayoutEffect`, it's already in the right place when the screen paints.

### Quick comparison:
| | `useEffect` | `useLayoutEffect` |
|---|---|---|
| Runs | After browser paints | Before browser paints |
| Blocks painting | ❌ No | ✅ Yes |
| Use for | Fetch, timers, events, localStorage | DOM measurements, fixing flicker |

> Start with `useEffect` always. Switch to `useLayoutEffect` only if you notice a visual flicker.

---

## 14. Common Mistakes with useEffect

### Mistake 1 — Missing dependency
```jsx
// ❌ Wrong — count is used inside but not in dependency array
useEffect(() => {
  document.title = `Count: ${count}`;
}, []);  // stale value bug — always shows initial count

// ✅ Correct
useEffect(() => {
  document.title = `Count: ${count}`;
}, [count]);
```

### Mistake 2 — Infinite loop
```jsx
// ❌ Wrong — no dependency array, state update inside causes infinite loop
useEffect(() => {
  setCount(count + 1);  // triggers re-render → effect runs again → infinite loop
});

// ✅ Correct — add dependency or empty array
useEffect(() => {
  setCount((prev) => prev + 1);
}, []);  // runs only once
```

### Mistake 3 — async directly on useEffect
```jsx
// ❌ Wrong
useEffect(async () => {
  const data = await fetchData();
}, []);

// ✅ Correct — define async inside
useEffect(() => {
  async function load() {
    const data = await fetchData();
  }
  load();
}, []);
```

---

## 15. useEffect Flow Diagram

```
Component Renders
      ↓
React updates the DOM
      ↓
useEffect runs (after paint)
      ↓
Dependency changes? → Cleanup runs → Effect runs again
      ↓
Component Unmounts → Cleanup runs
```

---

## 16. Rules of useEffect

- Must be called at the **top level** of the component — not inside loops or conditions.
- Always add every value used inside the effect to the **dependency array**.
- Always return a **cleanup function** when setting up subscriptions, timers, or event listeners.
- Never make the `useEffect` callback itself `async` — define async function inside instead.

---

## 17. Interview Questions

**Q1. What is useEffect and what is it used for?**
> `useEffect` is a React Hook used to perform side effects in functional components — such as fetching data, setting timers, updating the document title, or adding event listeners.

**Q2. What is a side effect in React?**
> A side effect is any operation that interacts with the outside world beyond rendering — like API calls, DOM manipulation, timers, or localStorage access.

**Q3. What does the dependency array in useEffect do?**
> It controls when the effect runs. No array = runs after every render. Empty array `[]` = runs once on mount. `[value]` = runs on mount and whenever `value` changes.

**Q4. How do you run useEffect only once when the component mounts?**
> Pass an empty dependency array: `useEffect(() => { }, [])`. This tells React the effect has no dependencies and should only run once.

**Q5. What is the cleanup function in useEffect? Why is it important?**
> The cleanup function is returned from the effect and runs before the next effect execution or when the component unmounts. It's used to clear timers, remove event listeners, or cancel subscriptions to prevent memory leaks.

**Q6. How do you fetch data using useEffect?**
> Define an async function inside the effect, call it, and use an empty dependency array to fetch once on mount. Update state with the response data to trigger a re-render.

**Q7. Why can't you make the useEffect callback async directly?**
> `useEffect` expects the callback to return either nothing or a cleanup function. An `async` function always returns a Promise, which is not a valid cleanup function. Define an async function inside and call it instead.

**Q8. What happens if you forget to add a dependency to the dependency array?**
> The effect will use a stale (old) value of that variable — it won't re-run when the value changes, causing bugs where the UI shows outdated data.

**Q9. How does useEffect replace lifecycle methods from class components?**
> `useEffect(() => {}, [])` = `componentDidMount`. `useEffect(() => {}, [dep])` = `componentDidUpdate`. `useEffect(() => { return () => {} }, [])` = `componentWillUnmount`.

**Q10. What causes an infinite loop in useEffect?**
> Updating state inside a `useEffect` without a dependency array causes an infinite loop — the state update triggers a re-render, which runs the effect again, which updates state again, and so on.

**Q11. Can you use multiple useEffect hooks in one component?**
> Yes. Each `useEffect` handles a separate concern. React runs them in the order they are defined. This keeps code organized and each effect focused on one responsibility.

**Q12. When does the cleanup function run?**
> It runs in two cases: before the effect runs again (when a dependency changes) and when the component unmounts (is removed from the UI).

**Q13. What is the difference between useEffect with no array vs empty array?**
> No array: runs after every single render. Empty array `[]`: runs only once after the first render (mount). This is a very common interview question.

**Q14. How do you re-fetch data when a prop or state value changes?**
> Add that value to the dependency array: `useEffect(() => { fetchData(id); }, [id])`. The effect re-runs whenever `id` changes.

**Q15. What is the order of execution — render or useEffect?**
> Render runs first (React updates the DOM), then `useEffect` runs after the browser has painted the screen. This ensures the effect doesn't block the UI from rendering.

---

**Q16. What is AbortController and why is it used with useEffect?**
> `AbortController` is a browser API used to cancel in-flight `fetch` requests. In `useEffect`, if a component unmounts before a fetch completes, the fetch would still try to call `setState` on an unmounted component. Passing `controller.signal` to `fetch` and calling `controller.abort()` in the cleanup function cancels the request and prevents this memory leak.

**Q17. How do you persist state to localStorage using useEffect?**
> Use lazy initialization to read from localStorage on mount: `useState(() => localStorage.getItem('key') || defaultValue)`. Then use `useEffect(() => { localStorage.setItem('key', value); }, [value])` to write to localStorage whenever the value changes.

**Q18. What is a stale closure in useEffect? How do you fix it?**
> A stale closure happens when a `useEffect` captures an old value of a state variable from the render it was created in. For example, a `setInterval` inside an effect with `[]` will always see the initial state value. Fix it by either adding the variable to the dependency array (so the effect re-runs when it changes) or using the functional update form `setState((prev) => prev + 1)` which doesn't need to read the stale value.

**Q19. What is the difference between useEffect and useLayoutEffect?**
> `useEffect` runs after the browser paints the screen — it's asynchronous and doesn't block rendering. `useLayoutEffect` runs after the DOM is updated but before the browser paints — it's synchronous and blocks painting. Use `useLayoutEffect` only when you need to read DOM measurements or prevent visual flicker. For everything else, use `useEffect`.

---

> ⏭️ Next Topic: **useRef & useContext** — covered in `component_06`.
