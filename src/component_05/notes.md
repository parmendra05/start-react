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

| Part | Description |
|---|---|
| `() => { }` | The effect function — runs after render |
| `return () => { }` | Cleanup function — runs before next effect or on unmount |
| `[dependencies]` | Dependency array — controls when the effect runs |

---

## 3. The Dependency Array — Most Important Concept

The **dependency array** is the second argument to `useEffect`. It controls **when** the effect runs.

### Case 1 — No dependency array → runs after EVERY render
```jsx
useEffect(() => {
  console.log('runs after every render');
});
```

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

The cleanup function runs:
- Before the effect runs again (when dependency changes)
- When the component is **unmounted** (removed from UI)

Used to clean up timers, subscriptions, or event listeners to avoid memory leaks.

### Timer Cleanup
```jsx
useEffect(() => {
  const timer = setInterval(() => {
    console.log('tick');
  }, 1000);

  return () => {
    clearInterval(timer);  // cleanup — stops timer when component unmounts
  };
}, []);
```

### Event Listener Cleanup
```jsx
useEffect(() => {
  function handleResize() {
    console.log(window.innerWidth);
  }

  window.addEventListener('resize', handleResize);

  return () => {
    window.removeEventListener('resize', handleResize);  // cleanup
  };
}, []);
```

---

## 7. Component Lifecycle vs useEffect

Class components had lifecycle methods. `useEffect` replaces all of them in functional components.

| Class Lifecycle Method | useEffect Equivalent |
|---|---|
| `componentDidMount` | `useEffect(() => { }, [])` |
| `componentDidUpdate` | `useEffect(() => { }, [dependency])` |
| `componentWillUnmount` | `useEffect(() => { return () => { } }, [])` |

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

## 10. Common Mistakes with useEffect

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

## 11. useEffect Flow Diagram

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

## 12. Rules of useEffect

- Must be called at the **top level** of the component — not inside loops or conditions.
- Always add every value used inside the effect to the **dependency array**.
- Always return a **cleanup function** when setting up subscriptions, timers, or event listeners.
- Never make the `useEffect` callback itself `async` — define async function inside instead.

---

## 13. Interview Questions

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

> ⏭️ Next Topic: **useRef & useContext** — covered in `component_06`.
