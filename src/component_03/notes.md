# React - useState Hook

---

## 1. What is State?

**State** is data that a component **owns and manages internally**. When state changes, React **automatically re-renders** the component to reflect the new data in the UI.

- Props = data passed **from outside** (parent) — read-only
- State = data managed **inside** the component — can change

### Real-world analogy:
> Think of a light switch. The switch has a **state** — either ON or OFF. When you flip it (change state), the light (UI) updates automatically.

---

## 2. What is a Hook?

A **Hook** is a special function provided by React that lets functional components use React features like state and lifecycle.

- Hooks always start with the word **`use`** — `useState`, `useEffect`, `useRef`, etc.
- Hooks can only be called **inside functional components** (not in class components or regular JS functions).
- Hooks must be called at the **top level** of the component — never inside loops, conditions, or nested functions.

---

## 3. useState — Syntax

```jsx
import { useState } from 'react';

const [stateVariable, setterFunction] = useState(initialValue);
```

| Part | Description |
|---|---|
| `stateVariable` | Current value of the state |
| `setterFunction` | Function to update the state |
| `initialValue` | The starting value of the state |

### Naming Convention:
- State variable: `count`, `name`, `isOpen`
- Setter function: `setCount`, `setName`, `setIsOpen` (always `set` + variable name)

---

## 4. Basic Example — Counter

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);  // initial value = 0

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
```

**What happens step by step:**
1. Component renders with `count = 0`
2. User clicks "Increment"
3. `setCount(count + 1)` is called → `count` becomes `1`
4. React re-renders the component → UI shows `Count: 1`

---

## 5. useState with Different Data Types

### String
```jsx
const [name, setName] = useState('');

<input onChange={(e) => setName(e.target.value)} />
<p>Hello, {name}</p>
```

### Boolean (Toggle)
```jsx
const [isVisible, setIsVisible] = useState(false);

<button onClick={() => setIsVisible(!isVisible)}>Toggle</button>
{isVisible && <p>Now you see me!</p>}
```

### Array
```jsx
const [items, setItems] = useState([]);

// Adding to array — always create a NEW array, never mutate directly
setItems([...items, 'new item']);
```

### Object
```jsx
const [user, setUser] = useState({ name: '', age: 0 });

// Updating object — always spread existing state first
setUser({ ...user, name: 'Raju' });
```

---

## 6. How Re-rendering Works

```
setCount(newValue)
      ↓
React schedules a re-render
      ↓
Component function runs again
      ↓
New JSX is returned
      ↓
Virtual DOM diff → Real DOM updated
```

- Every time you call a setter function, React **re-renders** the component.
- React is smart — it only re-renders the **affected component** and its children, not the whole page.
- State value is **preserved** between re-renders (unlike regular variables which reset).

---

## 7. Why Not Use a Regular Variable?

```jsx
// ❌ This does NOT work — UI will never update
function Counter() {
  let count = 0;

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => count++}>Click</button>  {/* count changes but UI doesn't */}
    </div>
  );
}
```

- Regular variables reset to their initial value on every re-render.
- React has no way to know a regular variable changed — so it never re-renders.
- `useState` solves both problems — it **persists** the value and **triggers re-render** on change.

---

## 8. State is Asynchronous

State updates are **not immediate** — React batches them for performance.

```jsx
const [count, setCount] = useState(0);

function handleClick() {
  setCount(count + 1);
  console.log(count);  // ⚠️ still logs OLD value — state hasn't updated yet
}
```

### Functional Update Form (Safe Way)
When new state depends on old state, use the **functional form** of the setter:

```jsx
// ❌ Unsafe — may use stale value
setCount(count + 1);

// ✅ Safe — always gets the latest state
setCount((prevCount) => prevCount + 1);
```

> Always use the functional form when the new state depends on the previous state.

---

## 9. Multiple State Variables

You can use `useState` multiple times in one component — each is independent.

```jsx
function UserForm() {
  const [name, setName]       = useState('');
  const [age, setAge]         = useState('');
  const [isActive, setIsActive] = useState(false);

  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <input value={age}  onChange={(e) => setAge(e.target.value)}  placeholder="Age" />
      <button onClick={() => setIsActive(!isActive)}>
        {isActive ? 'Active' : 'Inactive'}
      </button>
    </div>
  );
}
```

---

## 10. Updating State in Arrays & Objects (Important!)

React state must be treated as **immutable** — never directly mutate state.

### ❌ Wrong — Direct Mutation
```jsx
// Array
items.push('new item');         // mutates directly — React won't re-render
setItems(items);

// Object
user.name = 'Raju';             // mutates directly — React won't re-render
setUser(user);
```

### ✅ Correct — Create New Copy
```jsx
// Array — add item
setItems([...items, 'new item']);

// Array — remove item
setItems(items.filter((item) => item !== 'target'));

// Array — update item
setItems(items.map((item) => item.id === id ? { ...item, name: 'new' } : item));

// Object — update one field
setUser({ ...user, name: 'Raju' });
```

> Always return a **new array or object** — never modify the existing one directly.

---

## 11. Conditional Rendering with State

State is commonly used to show/hide parts of the UI.

```jsx
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div>
      {isLoggedIn ? (
        <h2>Welcome back, Raju!</h2>
      ) : (
        <h2>Please log in.</h2>
      )}
      <button onClick={() => setIsLoggedIn(!isLoggedIn)}>
        {isLoggedIn ? 'Logout' : 'Login'}
      </button>
    </div>
  );
}
```

### Ways to conditionally render:
```jsx
// Ternary operator
{isLoggedIn ? <Dashboard /> : <Login />}

// Short-circuit (&&) — renders only if true
{isLoggedIn && <Dashboard />}

// Null — renders nothing
{isLoggedIn ? <Dashboard /> : null}
```

---

## 12. Rules of Hooks (Important!)

| Rule | Correct | Wrong |
|---|---|---|
| Call at top level | `const [x, setX] = useState(0)` at top | Inside `if`, `for`, nested function |
| Only in functional components | Inside `function MyComponent()` | Inside regular JS functions |
| Import from React | `import { useState } from 'react'` | Forgetting the import |

```jsx
// ❌ Wrong — inside a condition
if (someCondition) {
  const [count, setCount] = useState(0);  // NEVER do this
}

// ✅ Correct — always at top level
const [count, setCount] = useState(0);
if (someCondition) {
  setCount(1);  // calling setter inside condition is fine
}
```

---

## 13. useState vs Regular Variable — Summary

| | Regular Variable | useState |
|---|---|---|
| Persists between re-renders | ❌ No — resets every render | ✅ Yes |
| Triggers re-render on change | ❌ No | ✅ Yes |
| Use for UI data | ❌ No | ✅ Yes |
| Use for non-UI data | ✅ Yes (e.g. refs, timers) | Not needed |

---

## 14. Interview Questions

**Q1. What is useState in React?**
> `useState` is a React Hook that lets functional components declare and manage state. It returns the current state value and a setter function to update it.

**Q2. What happens when you call a state setter function?**
> React schedules a re-render of the component. On the next render, the state variable holds the new value and the UI updates accordingly.

**Q3. Why can't we use a regular variable instead of useState?**
> Regular variables reset on every re-render and don't trigger re-renders when changed. `useState` persists the value between renders and tells React to re-render when the value changes.

**Q4. What is the naming convention for useState variables?**
> The state variable is named descriptively (e.g. `count`, `name`) and the setter is prefixed with `set` (e.g. `setCount`, `setName`).

**Q5. What are the Rules of Hooks?**
> Hooks must be called at the top level of a functional component — never inside loops, conditions, or nested functions. They can only be used inside functional components, not regular JS functions.

**Q6. What is the functional update form of useState? When should you use it?**
> Instead of `setCount(count + 1)`, use `setCount((prev) => prev + 1)`. Use it whenever the new state depends on the previous state to avoid stale value bugs, since state updates are asynchronous.

**Q7. Why should you never mutate state directly in React?**
> React uses reference comparison to detect state changes. If you mutate the existing array or object directly, the reference doesn't change and React won't detect the update or trigger a re-render.

**Q8. How do you update one field in an object stored in state?**
> Spread the existing state and override the specific field: `setUser({ ...user, name: 'Raju' })`. This creates a new object while keeping other fields intact.

**Q9. Can you use multiple useState calls in one component?**
> Yes. Each `useState` call is independent and manages its own piece of state. There is no limit on how many you can use in a single component.

**Q10. What is the difference between props and state?**
> Props are passed from a parent and are read-only. State is owned and managed by the component itself and can be updated using the setter function, triggering a re-render.

**Q11. What is conditional rendering? How does state help with it?**
> Conditional rendering means showing different UI based on a condition. State drives this — e.g. `isLoggedIn` state determines whether to show a dashboard or login screen using ternary or `&&` operators.

**Q12. What is the initial value in useState? Can it be any data type?**
> The initial value is the starting value of the state, passed as the argument to `useState(initialValue)`. It can be any data type — string, number, boolean, array, object, or null.

**Q13. Is state update synchronous or asynchronous?**
> State updates are asynchronous. React batches updates for performance. So reading the state variable immediately after calling the setter will still give the old value.

**Q14. What is the difference between `&&` and ternary for conditional rendering?**
> `&&` renders the right side only if the left side is true — used when there's no "else" case. Ternary `? :` handles both true and false cases — used when you need to render one of two things.

**Q15. How do you add an item to an array stored in state?**
> Use the spread operator to create a new array: `setItems([...items, newItem])`. Never use `.push()` directly on the state array as it mutates the original.

---

> ⏭️ Next Topic: **Event Handling & Forms** — covered in `component_04`.
