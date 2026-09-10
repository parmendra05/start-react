# React - useReducer & Custom Hooks

---

## 1. What is useReducer?

`useReducer` is a React Hook used for **state management** — an alternative to `useState` when state logic is more complex.

It is inspired by the **Redux** pattern and works by dispatching **actions** to a **reducer function** that returns the new state.

```jsx
const [state, dispatch] = useReducer(reducer, initialState);
```

| Part | Role |
|---|---|
| `state` | The current state value |
| `dispatch` | Function to send an action |
| `reducer` | Pure function that computes next state |
| `initialState` | The starting state value |

---

## 2. The Reducer Function

A **reducer** is a pure function that takes the current state and an action, and returns the **next state**.

```jsx
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: 0 };
    default:
      return state;  // always return state for unknown actions
  }
}
```

### Rules for a reducer:
- Must be a **pure function** — same inputs always produce the same output
- Must **not mutate** the existing state — always return a new object
- Must handle every `action.type` — use `default: return state` as a fallback
- No side effects inside — no API calls, no `setTimeout`, etc.

---

## 3. useReducer — Basic Example (Counter)

```jsx
import { useReducer } from 'react';

// 1. Define the reducer
function reducer(state, action) {
  switch (action.type) {
    case 'increment': return { count: state.count + 1 };
    case 'decrement': return { count: state.count - 1 };
    case 'reset':     return { count: 0 };
    default:          return state;
  }
}

// 2. Initial state
const initialState = { count: 0 };

function Counter() {
  // 3. Hook it up
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </div>
  );
}
```

### What happens step by step:
```
User clicks "+"
  → dispatch({ type: 'increment' })
    → reducer(currentState, { type: 'increment' })
      → returns { count: currentState.count + 1 }
        → React updates state → re-render
```

---

## 4. Actions with Payload

Actions can carry extra data in a `payload` property.

```jsx
function reducer(state, action) {
  switch (action.type) {
    case 'set_name':
      return { ...state, name: action.payload };
    case 'set_age':
      return { ...state, age: action.payload };
    case 'reset':
      return initialState;
    default:
      return state;
  }
}

const initialState = { name: '', age: 0 };

function UserForm() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <input
        value={state.name}
        onChange={(e) => dispatch({ type: 'set_name', payload: e.target.value })}
        placeholder="Name"
      />
      <input
        type="number"
        value={state.age}
        onChange={(e) => dispatch({ type: 'set_age', payload: Number(e.target.value) })}
        placeholder="Age"
      />
      <p>Name: {state.name} | Age: {state.age}</p>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </div>
  );
}
```

---

## 5. useReducer — Complex State Example (Todo List)

```jsx
import { useReducer, useState } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'add':
      return [...state, { id: Date.now(), text: action.payload, done: false }];
    case 'toggle':
      return state.map((todo) =>
        todo.id === action.payload ? { ...todo, done: !todo.done } : todo
      );
    case 'delete':
      return state.filter((todo) => todo.id !== action.payload);
    default:
      return state;
  }
}

function TodoApp() {
  const [todos, dispatch] = useReducer(reducer, []);
  const [input, setInput]  = useState('');

  function handleAdd() {
    if (!input.trim()) return;
    dispatch({ type: 'add', payload: input });
    setInput('');
  }

  return (
    <div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Add a todo..."
      />
      <button onClick={handleAdd}>Add</button>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <span
              style={{ textDecoration: todo.done ? 'line-through' : 'none', cursor: 'pointer' }}
              onClick={() => dispatch({ type: 'toggle', payload: todo.id })}
            >
              {todo.text}
            </span>
            <button onClick={() => dispatch({ type: 'delete', payload: todo.id })}>✕</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 6. useState vs useReducer — When to Use Which

```
useState   →  simple, independent values
useReducer →  complex state with multiple sub-values or related transitions
```

| Situation | Use |
|---|---|
| Simple counter, toggle, input value | `useState` ✅ |
| Multiple related state fields updated together | `useReducer` ✅ |
| Next state depends on the previous state | `useReducer` ✅ |
| State logic is complex and needs to be testable separately | `useReducer` ✅ |
| Many event handlers that modify the same state | `useReducer` ✅ |

### Key insight:
> The reducer function lives **outside** the component and can be unit-tested independently — you just call `reducer(state, action)` and check the output.

---

## 7. useReducer + useContext — Global State Pattern

Combining `useReducer` with `useContext` gives you a lightweight global state manager — similar to Redux but built into React.

```jsx
// store.jsx
import { createContext, useContext, useReducer } from 'react';

const StoreContext = createContext();

function reducer(state, action) {
  switch (action.type) {
    case 'login':  return { ...state, user: action.payload };
    case 'logout': return { ...state, user: null };
    default:       return state;
  }
}

const initialState = { user: null };

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}

// Custom hook for clean consumption
export function useStore() {
  return useContext(StoreContext);
}
```

```jsx
// main.jsx
import { StoreProvider } from './store';

<StoreProvider>
  <App />
</StoreProvider>
```

```jsx
// Any component
import { useStore } from './store';

function Navbar() {
  const { state, dispatch } = useStore();

  return (
    <nav>
      {state.user
        ? <button onClick={() => dispatch({ type: 'logout' })}>Logout ({state.user.name})</button>
        : <span>Not logged in</span>
      }
    </nav>
  );
}
```

---

## 8. What is a Custom Hook?

A **Custom Hook** is a regular JavaScript function whose name starts with `use` and that calls one or more React Hooks inside it.

Custom hooks let you **extract and reuse stateful logic** across multiple components — without duplicating code or changing component structure.

```
Custom Hook =  reusable stateful logic
             + starts with "use"
             + calls React hooks inside
             + returns whatever the component needs
```

### Why use custom hooks?
- Extract repeated hook logic into one place
- Make components cleaner and easier to read
- Test the logic in isolation
- Share logic between components without a wrapper component

---

## 9. Custom Hook — Example 1: useToggle

A common pattern — toggling a boolean value.

```jsx
// hooks/useToggle.js
import { useState } from 'react';

function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  function toggle() {
    setValue((prev) => !prev);
  }

  return [value, toggle];
}

export default useToggle;
```

```jsx
// Usage in any component
import useToggle from './hooks/useToggle';

function App() {
  const [isOpen, toggleOpen]   = useToggle(false);
  const [isDark, toggleDark]   = useToggle(false);

  return (
    <div>
      <button onClick={toggleOpen}>{isOpen ? 'Close' : 'Open'} Menu</button>
      <button onClick={toggleDark}>{isDark ? 'Light' : 'Dark'} Mode</button>
    </div>
  );
}
```

- The same `useToggle` logic is reused for two different things — no duplication.

---

## 10. Custom Hook — Example 2: useLocalStorage

Sync state with `localStorage` so it persists across page reloads.

```jsx
// hooks/useLocalStorage.js
import { useState } from 'react';

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  function setValue(value) {
    try {
      setStoredValue(value);
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      console.error('useLocalStorage: failed to save', key);
    }
  }

  return [storedValue, setValue];
}

export default useLocalStorage;
```

```jsx
// Usage — works just like useState but persists to localStorage
import useLocalStorage from './hooks/useLocalStorage';

function App() {
  const [name, setName] = useLocalStorage('username', '');

  return (
    <input
      value={name}
      onChange={(e) => setName(e.target.value)}
      placeholder="Your name (saved!)"
    />
  );
}
```

---

## 11. Custom Hook — Example 3: useFetch

Fetch data from an API with loading and error state.

```jsx
// hooks/useFetch.js
import { useState, useEffect } from 'react';

function useFetch(url) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    let cancelled = false;  // prevents state update on unmounted component

    setLoading(true);
    setError(null);

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (!cancelled) {
          setData(json);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };  // cleanup on unmount or url change
  }, [url]);

  return { data, loading, error };
}

export default useFetch;
```

```jsx
// Usage — all fetch logic is hidden inside the hook
import useFetch from './hooks/useFetch';

function UserList() {
  const { data, loading, error } = useFetch('https://jsonplaceholder.typicode.com/users');

  if (loading) return <p>Loading...</p>;
  if (error)   return <p>Error: {error}</p>;

  return (
    <ul>
      {data.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

---

## 12. Custom Hook — Example 4: useDebounce

Delay a value update — useful for search inputs to avoid firing on every keystroke.

```jsx
// hooks/useDebounce.js
import { useState, useEffect } from 'react';

function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);  // clear on every value change
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
```

```jsx
import { useState } from 'react';
import useDebounce from './hooks/useDebounce';
import useFetch    from './hooks/useFetch';

function Search() {
  const [query,         setQuery]         = useState('');
  const debouncedQuery                    = useDebounce(query, 400);
  const { data, loading }                 = useFetch(
    `https://api.example.com/search?q=${debouncedQuery}`
  );

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      {loading && <p>Searching...</p>}
      {data?.results?.map((r) => <p key={r.id}>{r.title}</p>)}
    </div>
  );
}
```

- `useFetch` only re-fires when `debouncedQuery` changes — not on every keystroke.

---

## 13. Custom Hook — Example 5: useForm

Manage form state generically.

```jsx
// hooks/useForm.js
import { useState } from 'react';

function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function reset() {
    setValues(initialValues);
  }

  return { values, handleChange, reset };
}

export default useForm;
```

```jsx
import useForm from './hooks/useForm';

function RegisterForm() {
  const { values, handleChange, reset } = useForm({ email: '', password: '' });

  function handleSubmit(e) {
    e.preventDefault();
    console.log('Submitting:', values);
    reset();
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="email"    value={values.email}    onChange={handleChange} placeholder="Email"    />
      <input name="password" value={values.password} onChange={handleChange} placeholder="Password" type="password" />
      <button type="submit">Register</button>
    </form>
  );
}
```

---

## 14. Rules of Custom Hooks

Custom hooks follow the same Rules of Hooks:

1. **Only call hooks at the top level** — not inside loops, conditions, or nested functions.
2. **Only call hooks from React functions** — components or other custom hooks.
3. **Name must start with `use`** — this is what tells React (and linters) it's a hook.
4. **Each call to a custom hook gets its own isolated state** — calling `useToggle()` twice gives two independent toggles.

---

## 15. Where to Put Custom Hooks

```
src/
  hooks/
    useToggle.js
    useLocalStorage.js
    useFetch.js
    useDebounce.js
    useForm.js
  components/
    ...
```

- Keep hooks in a dedicated `hooks/` folder for discoverability.
- One hook per file, named to match the function.
- Export as named or default — both work, pick one convention and stick with it.

---

## 16. useReducer & Custom Hooks — Summary

### useReducer Summary:
| Concept | Detail |
|---|---|
| Syntax | `const [state, dispatch] = useReducer(reducer, initialState)` |
| Reducer | Pure function: `(state, action) => newState` |
| Action | Object with `type` and optional `payload` |
| When to use | Complex state, multiple related fields, logic testable in isolation |
| Combined with | `useContext` for global state (Redux-lite pattern) |

### Custom Hook Summary:
| Concept | Detail |
|---|---|
| Definition | Function starting with `use` that calls other hooks |
| Purpose | Extract and reuse stateful logic across components |
| Each call | Gets its own isolated state — not shared |
| Common patterns | `useToggle`, `useFetch`, `useLocalStorage`, `useDebounce`, `useForm` |
| Location | `src/hooks/` folder |

---

## 17. Interview Questions

**Q1. What is useReducer and when would you use it over useState?**
> `useReducer` manages state via a reducer function and dispatch — similar to Redux. Use it over `useState` when state has multiple related fields, when transitions are complex, or when the next state depends on the previous. It also keeps all state logic in one testable function outside the component.

**Q2. What is a reducer function? What rules must it follow?**
> A reducer is a pure function `(state, action) => newState`. It must not mutate the existing state (return a new object), must be pure (no side effects), and must always handle unknown action types by returning the current state via `default: return state`.

**Q3. What is the difference between dispatch and setState?**
> `setState` (from `useState`) directly sets a new value. `dispatch` (from `useReducer`) sends an action object to the reducer, which computes the new state. `dispatch` gives you a centralized, descriptive way to express state transitions.

**Q4. How do you pass extra data with a dispatched action?**
> Add a `payload` property to the action object: `dispatch({ type: 'set_name', payload: 'Ali' })`. The reducer reads `action.payload` to apply the data.

**Q5. How can you combine useReducer and useContext for global state?**
> Create a Provider component that calls `useReducer` and passes `{ state, dispatch }` as the context value. Any component in the tree calls `useContext` (or a custom hook wrapping it) to read state and dispatch actions. This replaces Redux for simple global state needs.

**Q6. What is a custom hook?**
> A custom hook is a regular JavaScript function whose name starts with `use` and that calls one or more React hooks inside it. It extracts reusable stateful logic so multiple components can share it without code duplication.

**Q7. Do two components using the same custom hook share state?**
> No. Each call to a custom hook creates its own isolated state. The logic is shared, but the state is independent per component instance.

**Q8. What are the rules of custom hooks?**
> They follow the same Rules of Hooks: call hooks only at the top level (not in conditions or loops), call them only from React function components or other custom hooks, and the function name must start with `use`.

**Q9. How is a custom hook different from a utility function?**
> A utility function is a plain function with no React state or effects. A custom hook can call `useState`, `useEffect`, `useRef`, etc. — it has access to React's reactivity system. You can't call hooks inside a regular utility function.

**Q10. What is the useDebounce hook and why is it useful?**
> `useDebounce` delays updating a value until a specified time has passed since the last change. It's useful for search inputs — instead of firing an API call on every keystroke, the call is deferred until the user stops typing, reducing unnecessary requests.

**Q11. Walk me through building a useFetch hook.**
> Create state for `data`, `loading`, and `error`. In `useEffect`, call `fetch(url)`, set loading to `true` before the call, then update `data` on success or `error` on failure, and set `loading` to `false` in both cases. Return a cleanup function that sets a `cancelled` flag to prevent state updates on unmounted components. Return `{ data, loading, error }`.

**Q12. What is the advantage of extracting form logic into a useForm hook?**
> All the `onChange` wiring, state management, and reset logic lives in one place. Components just call `useForm(initialValues)` and get back `values`, `handleChange`, and `reset` — making form components much simpler and the logic reusable across all forms in the app.

---

> ⏭️ Next Topic: **React Router v6** — covered in `component_08`.
