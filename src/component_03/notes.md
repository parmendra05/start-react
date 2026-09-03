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

`useState` can hold **any JavaScript data type** as its value.

---

### String
```jsx
const [name, setName] = useState('');        // initial = empty string
const [city, setCity] = useState('Hyderabad'); // initial = default string
```

**Real example — live input binding:**
```jsx
function App() {
  const [name, setName] = useState('');

  return (
    <div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
      />
      <p>Hello, {name || 'Stranger'}!</p>
    </div>
  );
}
```
- `value={name}` — input is controlled by state.
- `onChange` — updates state on every keystroke.
- `name || 'Stranger'` — shows fallback if name is empty.

---

### Number
```jsx
const [count, setCount]   = useState(0);
const [price, setPrice]   = useState(99.99);
const [quantity, setQuantity] = useState(1);
```

**Real example — counter:**
```jsx
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count - 1)}>-</button>
      <span> {count} </span>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}
```

---

### Boolean
```jsx
const [isVisible, setIsVisible] = useState(false);
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [isDarkMode, setIsDarkMode] = useState(false);
```

**Real example — toggle visibility:**
```jsx
function App() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div>
      <button onClick={() => setIsVisible(!isVisible)}>
        {isVisible ? 'Hide' : 'Show'}
      </button>
      {isVisible && <p>Now you see me!</p>}
    </div>
  );
}
```
- `!isVisible` — flips the boolean on every click.
- `&&` — renders the paragraph only when `isVisible` is `true`.

---

### Array
```jsx
const [items, setItems]   = useState([]);           // empty array
const [users, setUsers]   = useState(['Raju', 'Priya']); // pre-filled
const [scores, setScores] = useState([10, 20, 30]);
```

**Real example — add & remove items:**
```jsx
function TodoList() {
  const [todos, setTodos] = useState(['Buy milk', 'Read book']);
  const [input, setInput] = useState('');

  function addTodo() {
    if (!input) return;
    setTodos([...todos, input]);   // ✅ new array with added item
    setInput('');
  }

  function removeTodo(index) {
    setTodos(todos.filter((_, i) => i !== index));  // ✅ new array without removed item
  }

  return (
    <div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map((todo, index) => (
          <li key={index}>
            {todo}
            <button onClick={() => removeTodo(index)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```
- Always create a **new array** — never use `.push()` or `.splice()` directly on state.

---

### Object
```jsx
const [user, setUser]     = useState({ name: '', age: 0 });
const [address, setAddress] = useState({ city: '', pin: '' });
```

**Real example — update one field without losing others:**
```jsx
function ProfileForm() {
  const [user, setUser] = useState({ name: '', age: '', city: '' });

  function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value });  // spread + update one field
  }

  return (
    <div>
      <input name="name" value={user.name} onChange={handleChange} placeholder="Name" />
      <input name="age"  value={user.age}  onChange={handleChange} placeholder="Age" />
      <input name="city" value={user.city} onChange={handleChange} placeholder="City" />
      <p>{user.name} | {user.age} | {user.city}</p>
    </div>
  );
}
```
- `{ ...user, [e.target.name]: e.target.value }` — spreads all existing fields, then overrides only the changed one.
- Never do `user.name = 'Raju'` — that mutates state directly.

---

### null / undefined
```jsx
const [user, setUser]   = useState(null);      // no user loaded yet
const [error, setError] = useState(null);      // no error initially
const [data, setData]   = useState(undefined); // not yet fetched
```
- Commonly used as initial state when data hasn't loaded yet (e.g. API calls).
```jsx
if (user === null) return <p>Loading...</p>;
return <h2>Welcome, {user.name}</h2>;
```

---

### Quick Reference Table:
| Data Type | Initial Value Example | Setter Example |
|---|---|---|
| String | `useState('')` | `setName('Raju')` |
| Number | `useState(0)` | `setCount(count + 1)` |
| Boolean | `useState(false)` | `setIsOpen(!isOpen)` |
| Array | `useState([])` | `setItems([...items, newItem])` |
| Object | `useState({})` | `setUser({ ...user, name: 'Raju' })` |
| Null | `useState(null)` | `setUser(data)` |

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

This is one of the most important concepts to understand as a beginner.

### Problem 1 — Regular variables reset on every render

Every time React re-renders a component, the **entire function runs again from top to bottom**. Any `let` or `const` variable declared inside gets **reset to its initial value**.

```jsx
// ❌ Does NOT work
function Counter() {
  let count = 0;   // resets to 0 on EVERY render

  function handleClick() {
    count++;                    // count becomes 1
    console.log(count);         // logs 1 ✅ — value changed in memory
    // BUT React doesn't know about this change
    // AND next render will reset count back to 0
  }

  return (
    <div>
      <p>Count: {count}</p>     {/* always shows 0 */}
      <button onClick={handleClick}>Click</button>
    </div>
  );
}
```

### Problem 2 — React has no idea the variable changed

- React only re-renders a component when **state** or **props** change.
- Changing a regular variable does NOT tell React anything — React never re-renders.
- So even if `count` changes in memory, the UI stays the same.

### How useState solves both problems:

```jsx
// ✅ Works correctly
function Counter() {
  const [count, setCount] = useState(0);
  //              ↑
  //   React stores this value OUTSIDE the component function
  //   It survives re-renders and persists between them

  function handleClick() {
    setCount(count + 1);
    // ↑ This tells React:
    // 1. Store the new value (persists between renders)
    // 2. Schedule a re-render (UI will update)
  }

  return (
    <div>
      <p>Count: {count}</p>   {/* always shows latest value */}
      <button onClick={handleClick}>Click</button>
    </div>
  );
}
```

### Where does React store state?
- React stores state values **outside** the component function — in React's internal memory (not in the function's local scope).
- When the component re-renders (function runs again), React gives back the **latest stored value** instead of the initial value.

```
First render:   useState(0)  →  React stores: 0  →  count = 0
Click button:   setCount(1)  →  React stores: 1  →  schedules re-render
Second render:  useState(0)  →  React ignores 0, returns stored: 1  →  count = 1
```

### Summary — Regular Variable vs useState:
| | `let count = 0` | `useState(0)` |
|---|---|---|
| Survives re-render | ❌ Resets to 0 every time | ✅ Persists between renders |
| Triggers re-render | ❌ React doesn't know | ✅ Calls re-render automatically |
| Stored where | Inside function (local scope) | Outside function (React's memory) |
| Use for UI data | ❌ Never | ✅ Always |

---

## 8. State as a Snapshot

When React re-renders a component, it takes a **snapshot** of the state at that moment and gives it to the JSX. Every render has its own fixed copy of state — like a photograph.

```jsx
const [count, setCount] = useState(0);

function handleClick() {
  setCount(count + 1);  // schedules: count = 1

  setTimeout(() => {
    // This closure captured count = 0 (the snapshot at the time of click)
    console.log(count);  // ⚠️ logs 0, NOT 1
  }, 3000);
}
```

- The `setTimeout` callback "remembers" the value of `count` from the render it was created in — not the latest value.
- This is called a **stale closure** — the function closed over an old snapshot of state.

### Why this matters:
```
Render 1:  count = 0  →  handleClick runs  →  setTimeout captures count = 0
Render 2:  count = 1  →  (setTimeout fires 3s later, still sees count = 0)
```

### Fix — use a ref to always get the latest value:
```jsx
const countRef = useRef(count);
countRef.current = count;  // always updated to latest

setTimeout(() => {
  console.log(countRef.current);  // ✅ always latest value
}, 3000);
```

> Key insight: **state is tied to a render**. Each render sees its own fixed snapshot of state. This is why functional updates `(prev) => prev + 1` are safer — they don't rely on a captured snapshot.

---

## 9. State is Asynchronous

### What does asynchronous mean here?
When you call `setCount(count + 1)`, React does **not** update the state immediately. Instead it:
1. **Schedules** the update for later.
2. **Batches** multiple updates together for performance.
3. **Re-renders** the component after all updates in the current event are processed.

This means if you read the state variable right after calling the setter, you still get the **old value**.

```jsx
const [count, setCount] = useState(0);

function handleClick() {
  setCount(count + 1);
  console.log(count);   // ⚠️ logs 0 — NOT 1 — state hasn't updated yet
  // The new value (1) will only be available on the NEXT render
}
```

### Problem — Stale State (Multiple updates in one handler)

This is where async state causes a real bug:

```jsx
// ❌ Bug — you expect count to become 3, but it becomes 1
function handleClick() {
  setCount(count + 1);  // count is 0 → schedules update to 1
  setCount(count + 1);  // count is STILL 0 → schedules update to 1 again
  setCount(count + 1);  // count is STILL 0 → schedules update to 1 again
  // Result: count = 1, not 3
}
```

All three calls read the **same stale value** of `count` (0) because state hasn't updated yet.

### Solution — Functional Update Form

Instead of passing a value directly, pass a **function** that receives the latest state:

```jsx
// ✅ Correct — each call gets the LATEST state
function handleClick() {
  setCount((prev) => prev + 1);  // prev = 0 → returns 1
  setCount((prev) => prev + 1);  // prev = 1 → returns 2
  setCount((prev) => prev + 1);  // prev = 2 → returns 3
  // Result: count = 3 ✅
}
```

- `prev` is the **guaranteed latest value** of state at the time React processes the update.
- React processes each functional update in sequence, passing the result of one as `prev` to the next.

### When to use functional update form:
```jsx
// ✅ Use functional form when new state depends on old state
setCount((prev) => prev + 1);
setItems((prev) => [...prev, newItem]);
setUser((prev) => ({ ...prev, name: 'Raju' }));

// Direct value is fine when new state does NOT depend on old state
setName('Raju');       // ✅ not based on previous name
setIsOpen(false);      // ✅ not based on previous isOpen
```

### What is Batching?
React **batches** (groups) multiple state updates that happen in the same event handler and processes them together in a single re-render — for performance.

```jsx
function handleClick() {
  setCount(count + 1);   // ┐
  setName('Raju');       // ├── React batches all 3 → only ONE re-render
  setIsOpen(true);       // ┘
}
```

- In React 17 and below, batching only happened inside event handlers.
- In **React 18**, batching happens **everywhere** — including inside `setTimeout`, `fetch`, and Promises.

> Rule of thumb: whenever new state depends on the previous state, always use the functional form `(prev) => newValue`.

---

## 9. Multiple State Variables

You can call `useState` **multiple times** in one component. Each call is completely **independent** — they don't affect each other.

### Approach 1 — Separate state variables (Recommended ✅)
```jsx
function UserForm() {
  const [name,     setName]     = useState('');
  const [age,      setAge]      = useState('');
  const [email,    setEmail]    = useState('');
  const [isActive, setIsActive] = useState(false);
  const [role,     setRole]     = useState('user');

  return (
    <div>
      <input value={name}  onChange={(e) => setName(e.target.value)}  placeholder="Name" />
      <input value={age}   onChange={(e) => setAge(e.target.value)}   placeholder="Age" />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />

      <button onClick={() => setIsActive(!isActive)}>
        {isActive ? 'Active' : 'Inactive'}
      </button>

      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
    </div>
  );
}
```

### Approach 2 — Single object state (for related data)
```jsx
function UserForm() {
  const [user, setUser] = useState({
    name:  '',
    age:   '',
    email: '',
  });

  function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  return (
    <div>
      <input name="name"  value={user.name}  onChange={handleChange} placeholder="Name" />
      <input name="age"   value={user.age}   onChange={handleChange} placeholder="Age" />
      <input name="email" value={user.email} onChange={handleChange} placeholder="Email" />
    </div>
  );
}
```

### When to use which approach:
| Situation | Recommended Approach |
|---|---|
| Independent values (counter, toggle, name) | Separate `useState` calls |
| Related form fields that belong together | Single object `useState` |
| Mix of related and unrelated data | Separate for unrelated, object for related |

### Key Rules:
- React processes each `useState` call **in order** — this is why you must never call hooks inside conditions or loops (the order must stay the same on every render).
- Each state variable has its **own setter** — updating one does not affect others.
- There is **no limit** on how many `useState` calls you can have in one component.

---

## 10. Updating State in Arrays & Objects (Important!)

### Why Immutability Matters

React detects state changes by comparing the **reference** (memory address) of the old and new value — not the contents.

- If you mutate an array/object directly, the **reference stays the same**.
- React sees old reference === new reference → **thinks nothing changed** → **no re-render**.
- You must always create a **new array or object** so React sees a new reference and re-renders.

```
Direct mutation:  oldArray === newArray  →  React: "nothing changed" → no re-render ❌
New copy:         oldArray !== newArray  →  React: "something changed" → re-renders ✅
```

---

### Arrays — All Operations

#### ❌ Wrong — mutates directly
```jsx
items.push('new item');      // mutates original — same reference
items.splice(0, 1);          // mutates original — same reference
items[0] = 'updated';        // mutates original — same reference
setItems(items);             // React sees same reference → no re-render
```

#### ✅ Correct — always create a new array

**Add item:**
```jsx
// Add to end
setItems([...items, 'new item']);

// Add to beginning
setItems(['new item', ...items]);

// Add at specific index
setItems([...items.slice(0, index), 'new item', ...items.slice(index)]);
```

**Remove item:**
```jsx
// Remove by value
setItems(items.filter((item) => item !== 'target'));

// Remove by index
setItems(items.filter((_, i) => i !== indexToRemove));
```

**Update item:**
```jsx
// Update by id
setItems(items.map((item) =>
  item.id === targetId ? { ...item, name: 'updated name' } : item
));

// Update by index
setItems(items.map((item, i) =>
  i === targetIndex ? 'updated value' : item
));
```

**Sort / Reverse:**
```jsx
// ❌ Wrong — .sort() and .reverse() mutate the original array
setItems(items.sort());

// ✅ Correct — spread first to create a copy, then sort
setItems([...items].sort());
setItems([...items].reverse());
```

---

### Objects — All Operations

#### ❌ Wrong — mutates directly
```jsx
user.name = 'Raju';          // mutates original — same reference
user.address.city = 'Delhi'; // mutates nested object — same reference
setUser(user);               // React sees same reference → no re-render
```

#### ✅ Correct — always spread to create a new object

**Update one field:**
```jsx
setUser({ ...user, name: 'Raju' });
```

**Update multiple fields:**
```jsx
setUser({ ...user, name: 'Raju', age: 25 });
```

**Update nested object:**
```jsx
// ❌ Wrong — only spreads top level, nested object still mutated
setUser({ ...user, address: { city: 'Delhi' } });

// ✅ Correct — spread at every level
setUser({
  ...user,
  address: { ...user.address, city: 'Delhi' }
});
```

**Delete a field:**
```jsx
const { fieldToRemove, ...rest } = user;
setUser(rest);   // new object without the removed field
```

---

### Real Example — Array of Objects (Most Common Pattern)
```jsx
const [users, setUsers] = useState([
  { id: 1, name: 'Raju',  active: true  },
  { id: 2, name: 'Priya', active: false },
]);

// Add a new user
setUsers([...users, { id: 3, name: 'Arjun', active: true }]);

// Remove a user by id
setUsers(users.filter((u) => u.id !== 2));

// Update a user's name by id
setUsers(users.map((u) =>
  u.id === 1 ? { ...u, name: 'Raju Kumar' } : u
));

// Toggle active status by id
setUsers(users.map((u) =>
  u.id === 1 ? { ...u, active: !u.active } : u
));
```

---

### Quick Reference — Immutable Update Cheat Sheet
| Operation | Method |
|---|---|
| Add to array end | `[...arr, newItem]` |
| Add to array start | `[newItem, ...arr]` |
| Remove from array | `arr.filter(...)` |
| Update item in array | `arr.map(...)` |
| Sort array | `[...arr].sort()` |
| Update object field | `{ ...obj, key: value }` |
| Update nested object | `{ ...obj, nested: { ...obj.nested, key: value } }` |
| Delete object field | destructure + rest `{ field, ...rest }` |

---

## 11. Lifting State Up

**Lifting state up** means moving state to the **closest common parent** when two or more sibling components need to share or sync the same data.

### Problem — siblings can't share state directly:
```jsx
// ❌ Each component has its own count — they are NOT in sync
function ComponentA() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>A: {count}</button>;
}

function ComponentB() {
  const [count, setCount] = useState(0);  // completely separate state
  return <p>B sees: {count}</p>;          // never updates when A changes
}
```

### Solution — lift state to the parent:
```jsx
// ✅ Parent owns the state, passes it down as props
function Parent() {
  const [count, setCount] = useState(0);  // state lives here

  return (
    <div>
      <ComponentA count={count} onIncrement={() => setCount(count + 1)} />
      <ComponentB count={count} />
    </div>
  );
}

function ComponentA({ count, onIncrement }) {
  return <button onClick={onIncrement}>A: {count}</button>;
}

function ComponentB({ count }) {
  return <p>B sees: {count}</p>;  // ✅ always in sync with A
}
```

### When to lift state:
- Two sibling components need to **read the same data**.
- One component needs to **change data** that another component displays.
- A parent needs to **coordinate** behavior between children.

> Rule: move state to the **lowest common ancestor** that contains all components needing that state. Don't lift higher than necessary.

---

## 12. Lazy Initialization of useState

By default, the initial value passed to `useState` is evaluated **on every render** — even though React only uses it on the first render. For expensive computations, this is wasteful.

### Problem — Expensive initial value runs every render:
```jsx
// ❌ getExpensiveValue() runs on EVERY render, not just the first
const [data, setData] = useState(getExpensiveValue());
```

### Solution — Pass a function (Lazy Initialization):
```jsx
// ✅ getExpensiveValue runs ONLY on the first render
const [data, setData] = useState(() => getExpensiveValue());

// or shorthand
const [data, setData] = useState(getExpensiveValue);
```

- When you pass a **function** instead of a value, React calls it only once — on the first render.
- On subsequent re-renders, React ignores the function and uses the stored state.

### Real examples:
```jsx
// Reading from localStorage — only needed once on mount
const [theme, setTheme] = useState(() => {
  return localStorage.getItem('theme') || 'light';
});

// Parsing a large JSON string — expensive, do it once
const [config, setConfig] = useState(() => JSON.parse(largeJsonString));
```

> Rule: if your initial state requires a function call or computation, always use lazy initialization `useState(() => value)` instead of `useState(value)`.

---

## 13. Derived State — Don't Store What You Can Compute

**Derived state** is a value that can be **calculated from existing state** — you should NOT store it in a separate `useState`.

### ❌ Wrong — storing derived value in state:
```jsx
const [items, setItems] = useState([1, 2, 3, 4, 5]);
const [count, setCount] = useState(5);   // ❌ derived — just items.length
const [total, setTotal] = useState(15);  // ❌ derived — can be computed
// Now you have to keep count and total in sync manually — error-prone
```

### ✅ Correct — compute directly from state:
```jsx
const [items, setItems] = useState([1, 2, 3, 4, 5]);

// Compute during render — always in sync, no extra state needed
const count = items.length;
const total = items.reduce((sum, n) => sum + n, 0);

return (
  <div>
    <p>Count: {count}</p>
    <p>Total: {total}</p>
  </div>
);
```

### Real example — filtered list:
```jsx
const [users, setUsers]   = useState([...]);
const [search, setSearch] = useState('');

// ✅ Derived — filter computed from existing state, no extra useState
const filteredUsers = users.filter((u) =>
  u.name.toLowerCase().includes(search.toLowerCase())
);

return (
  <div>
    <input value={search} onChange={(e) => setSearch(e.target.value)} />
    {filteredUsers.map((u) => <p key={u.id}>{u.name}</p>)}
  </div>
);
```

> Rule: if a value can be calculated from existing state or props, **compute it during render** — don't put it in `useState`. Fewer state variables = fewer bugs.

---

## 14. Resetting State

Common patterns for resetting state back to its initial value.

### Reset individual state variables:
```jsx
const [count, setCount] = useState(0);
const [name, setName]   = useState('');

function handleReset() {
  setCount(0);  // reset to initial
  setName('');  // reset to initial
}
```

### Reset an object state:
```jsx
// Store initial value OUTSIDE component so it doesn't reset on every render
const initialForm = { name: '', email: '', password: '' };

function MyForm() {
  const [form, setForm] = useState(initialForm);

  function handleReset() {
    setForm(initialForm);  // ✅ reset entire object at once
  }
}
```

### Reset by changing `key` prop (full component reset):
```jsx
// When key changes, React unmounts and remounts the component
// — all state inside resets to initial values automatically
function App() {
  const [formKey, setFormKey] = useState(0);

  return (
    <div>
      <Form key={formKey} />
      <button onClick={() => setFormKey((k) => k + 1)}>Reset Form</button>
    </div>
  );
}
```

- Changing the `key` prop forces React to **destroy and recreate** the component.
- All internal state resets automatically — no need to manually reset each field.
- Useful for complex forms with many state variables.

---

## 15. State vs useRef — When to Use Which

Both `useState` and `useRef` can store values across renders — but they behave very differently.

| | `useState` | `useRef` |
|---|---|---|
| Triggers re-render on change | ✅ Yes | ❌ No |
| Value persists between renders | ✅ Yes | ✅ Yes |
| Use for | UI data (what user sees) | Non-UI data (timers, DOM refs) |
| Access value | `count` | `ref.current` |

### Use `useState` when:
- The value affects what is **displayed in the UI**.
- You need the component to **re-render** when the value changes.

```jsx
const [count, setCount] = useState(0);  // shown in UI → useState ✅
```

### Use `useRef` when:
- The value does **not** need to be shown in the UI.
- You don't want a re-render when it changes.
- Storing timer IDs, previous values, or direct DOM references.

```jsx
const timerRef = useRef(null);  // timer id — not shown in UI → useRef ✅

useEffect(() => {
  timerRef.current = setInterval(() => console.log('tick'), 1000);
  return () => clearInterval(timerRef.current);
}, []);
```

### Storing previous state value with useRef:
```jsx
function App() {
  const [count, setCount] = useState(0);
  const prevCountRef      = useRef(0);

  useEffect(() => {
    prevCountRef.current = count;  // store current as previous after render
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

> Full details on `useRef` → covered in `component_06`.

---

## 16. Conditional Rendering with State

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

## 17. Rules of Hooks (Important!)

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

## 18. useState vs Regular Variable — Summary

| | Regular Variable | useState |
|---|---|---|
| Persists between re-renders | ❌ No — resets every render | ✅ Yes |
| Triggers re-render on change | ❌ No | ✅ Yes |
| Use for UI data | ❌ No | ✅ Yes |
| Use for non-UI data | ✅ Yes (e.g. refs, timers) | Not needed |

---

## 19. Interview Questions

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

**Q16. What is lazy initialization in useState? When should you use it?**
> Lazy initialization means passing a function to `useState` instead of a value: `useState(() => getValue())`. React calls the function only on the first render and ignores it on re-renders. Use it when the initial value requires an expensive computation, a function call, or reading from localStorage.

**Q17. What is derived state? Why should you avoid storing it in useState?**
> Derived state is a value that can be computed from existing state or props. Storing it in a separate `useState` creates redundancy and requires keeping multiple state variables in sync — which leads to bugs. Instead, compute it directly during render: `const total = items.reduce(...)`.

**Q18. What is state batching in React 18?**
> Batching means React groups multiple state updates from the same event into a single re-render. In React 17, batching only worked inside event handlers. In React 18, batching works everywhere — including inside `setTimeout`, `fetch` callbacks, and Promises — reducing unnecessary re-renders.

**Q19. How do you reset a form's state in React?**
> Store the initial state in a variable outside the component, pass it to `useState`, and call the setter with that variable on reset: `setForm(initialForm)`. Alternatively, change the component's `key` prop to force React to unmount and remount it, resetting all state automatically.

**Q20. What is the difference between useState and useRef for storing values?**
> Both persist values across renders, but `useState` triggers a re-render when updated while `useRef` does not. Use `useState` for values that affect the UI. Use `useRef` for values that don't need to be displayed — like timer IDs, previous values, or DOM element references.

---

**Q21. What is "state as a snapshot" in React?**
> Each render captures a fixed snapshot of state. Functions created during a render (like event handlers or `setTimeout` callbacks) close over that snapshot — they see the state value from when they were created, not the latest value. This is why stale closures happen and why functional updates `(prev) => prev + 1` are safer.

**Q22. What is lifting state up? When do you need it?**
> Lifting state up means moving state to the closest common parent component when two or more siblings need to share the same data. The parent owns the state and passes it down as props, keeping all children in sync. You need it when sibling components need to read or update the same piece of data.

---

> ⏭️ Next Topic: **Event Handling & Forms** — covered in `component_04`.
