# React - Performance Optimization

---

## 1. Why Does Performance Matter?

React is fast by default, but as your app grows it can start to slow down. The most common reason is **unnecessary re-renders** — components re-rendering even when nothing they care about has changed.

```
User clicks a button
  → parent component re-renders
    → all child components re-render   ← even if their props didn't change!
      → app feels slow and laggy
```

Performance optimization in React is mostly about **preventing unnecessary re-renders** and **delaying or deferring expensive work**.

### When should you optimize?

> Don't optimize too early. First build your app, then measure if there's actually a problem, then fix it. Premature optimization adds complexity for no gain.

```
Rule of thumb:
  1. Build it first
  2. Notice slowness  (use React DevTools Profiler)
  3. Find the cause
  4. Apply the right fix
```

---

## 2. How React Re-rendering Works

Before fixing performance problems, you need to understand when React re-renders a component.

A component re-renders when:
1. Its **own state** changes (`useState`, `useReducer`)
2. Its **parent re-renders** — even if the props passed to it didn't change
3. Its **context value** changes

```jsx
function Parent() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <Child />   {/* re-renders every time Parent re-renders — even though Child has no props! */}
    </div>
  )
}

function Child() {
  console.log('Child rendered!')  // prints on every parent re-render
  return <p>I am a child</p>
}
```

This is fine for small apps. For large component trees with expensive renders, this is where performance problems start.

---

## 3. React.memo — Prevent Child Re-renders

`React.memo` is a wrapper that tells React: **"only re-render this component if its props actually changed"**.

Without `React.memo`:
```jsx
function Child({ username }) {
  console.log('Child rendered')
  return <p>Hello, {username}</p>
}
// re-renders every time Parent re-renders, even if username didn't change
```

With `React.memo`:
```jsx
import { memo } from 'react'

const Child = memo(function Child({ username }) {
  console.log('Child rendered')
  return <p>Hello, {username}</p>
})
// only re-renders when username prop actually changes ✅
```

### Real example:

```jsx
import { useState, memo } from 'react'

// Expensive component — wrap with memo
const UserCard = memo(function UserCard({ name, email }) {
  console.log('UserCard rendered')
  return (
    <div>
      <p>{name}</p>
      <p>{email}</p>
    </div>
  )
})

function App() {
  const [count,    setCount]    = useState(0)
  const [username, setUsername] = useState('Ali')

  return (
    <div>
      {/* clicking this button re-renders App */}
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>

      {/* UserCard does NOT re-render when count changes — name and email haven't changed */}
      <UserCard name={username} email="ali@example.com" />
    </div>
  )
}
```

### When to use React.memo:
- Component renders the same output for the same props
- Component re-renders often due to parent updates
- Component is expensive to render (large list, complex UI)

### When NOT to use it:
- Component almost always receives new props anyway
- Component is very simple — the comparison cost isn't worth it

---

## 4. useMemo — Cache an Expensive Calculation

`useMemo` remembers (caches) the result of an expensive calculation and only recalculates it when its dependencies change.

```jsx
const result = useMemo(() => expensiveCalculation(), [dependency])
```

Without `useMemo` — recalculates on every render:
```jsx
function ProductList({ products, searchTerm }) {
  // this runs on every single render — even if products and searchTerm haven't changed
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return <ul>{filtered.map(p => <li key={p.id}>{p.name}</li>)}</ul>
}
```

With `useMemo` — only recalculates when dependencies change:
```jsx
import { useMemo } from 'react'

function ProductList({ products, searchTerm }) {
  // only re-runs when products or searchTerm changes
  const filtered = useMemo(() =>
    products.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [products, searchTerm]  // dependencies
  )

  return <ul>{filtered.map(p => <li key={p.id}>{p.name}</li>)}</ul>
}
```

### Another example — expensive math:

```jsx
import { useState, useMemo } from 'react'

function App() {
  const [number, setNumber] = useState(10)
  const [theme,  setTheme]  = useState('light')

  // only recalculates when "number" changes — not when "theme" changes
  const factorial = useMemo(() => {
    console.log('Calculating factorial...')
    let result = 1
    for (let i = 1; i <= number; i++) result *= i
    return result
  }, [number])

  return (
    <div>
      <input
        type="number"
        value={number}
        onChange={e => setNumber(Number(e.target.value))}
      />
      <p>Factorial: {factorial}</p>
      <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
        Toggle Theme ({theme})
      </button>
    </div>
  )
}
```

> Toggling the theme no longer triggers the factorial calculation — it only recalculates when `number` changes.

### When to use useMemo:
- Filtering or sorting large arrays
- Complex mathematical calculations
- Deriving data from props that is expensive to compute

### When NOT to use it:
- Simple calculations — the overhead of memoization isn't worth it
- Values that change on almost every render anyway

---

## 5. useCallback — Cache a Function

Every time a component re-renders, every function inside it is **recreated** — it's a brand new function reference. This is a problem when you pass functions as props to memoized child components, because React.memo will see a "new" function and re-render anyway.

```jsx
function Parent() {
  const [count, setCount] = useState(0)

  // this function is recreated on every render
  function handleClick() {
    console.log('clicked')
  }

  // Even though Child is wrapped in memo, it still re-renders
  // because handleClick is a new function reference every time
  return <Child onClick={handleClick} />
}
```

`useCallback` caches the function and only recreates it when dependencies change:

```jsx
import { useState, useCallback, memo } from 'react'

const Child = memo(function Child({ onDelete }) {
  console.log('Child rendered')
  return <button onClick={onDelete}>Delete</button>
})

function Parent() {
  const [count, setCount] = useState(0)
  const [users, setUsers] = useState(['Ali', 'Sara', 'Raju'])

  // this function is now cached — same reference across renders
  // only recreates when setUsers changes (which it never does)
  const handleDelete = useCallback((username) => {
    setUsers(prev => prev.filter(u => u !== username))
  }, [])  // empty [] = never recreate

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      {users.map(user => (
        <Child key={user} onDelete={() => handleDelete(user)} />
      ))}
    </div>
  )
}
```

### useMemo vs useCallback — the difference:

```jsx
// useMemo — caches the RESULT of a function
const filteredList = useMemo(() => list.filter(...), [list])

// useCallback — caches the FUNCTION ITSELF
const handleClick = useCallback(() => { ... }, [])
```

> Think of it this way: `useMemo` is for values, `useCallback` is for functions.

---

## 6. Lazy Loading — Code Splitting with React.lazy

By default, React bundles your entire app into one JavaScript file. As your app grows, this file gets huge and the initial page load gets slow.

**Lazy loading** splits your app into smaller chunks. Each page/component is only downloaded when the user actually navigates to it.

```jsx
// Without lazy loading — everything downloaded upfront
import Dashboard from './pages/Dashboard'
import Settings  from './pages/Settings'
import Reports   from './pages/Reports'
```

```jsx
// With lazy loading — only downloaded when needed
import { lazy, Suspense } from 'react'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const Settings  = lazy(() => import('./pages/Settings'))
const Reports   = lazy(() => import('./pages/Reports'))
```

### Using with React Router:

```jsx
import { lazy, Suspense } from 'react'
import { Routes, Route }  from 'react-router-dom'

const Home      = lazy(() => import('./pages/Home'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Settings  = lazy(() => import('./pages/Settings'))

function App() {
  return (
    // Suspense shows a fallback while the component is loading
    <Suspense fallback={<p>Loading page...</p>}>
      <Routes>
        <Route path="/"          element={<Home />}      />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings"  element={<Settings />}  />
      </Routes>
    </Suspense>
  )
}
```

> `<Suspense fallback={...}>` is required — it shows the fallback UI while the lazy component is being downloaded. Without it, React throws an error.

### Better fallback — a loading spinner:

```jsx
function PageLoader() {
  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-500">Loading...</p>
    </div>
  )
}

<Suspense fallback={<PageLoader />}>
  <Routes>...</Routes>
</Suspense>
```

---

## 7. Key Prop — Help React Identify List Items

The `key` prop is how React tracks list items. A correct `key` helps React update only the items that changed instead of re-rendering the whole list.

### Wrong — using array index as key:

```jsx
// ❌ using index as key — causes bugs when list order changes
{users.map((user, index) => (
  <UserCard key={index} user={user} />
))}
```

### Correct — using a unique stable ID:

```jsx
// ✅ using a unique ID — React correctly tracks each item
{users.map(user => (
  <UserCard key={user.id} user={user} />
))}
```

> Never use array index as a key for lists that can be reordered, filtered, or have items added/removed. Always use a unique ID from your data.

---

## 8. Avoid Recreating Objects and Arrays in JSX

Every render, objects and arrays defined inline are recreated as new references. This breaks `React.memo` because the prop looks "changed" even though the data is the same.

```jsx
// ❌ new object created on every render — breaks React.memo on Child
function Parent() {
  return <Child style={{ color: 'blue' }} />
}

// ✅ define the object outside the component
const childStyle = { color: 'blue' }

function Parent() {
  return <Child style={childStyle} />
}
```

```jsx
// ❌ new array on every render
function Parent() {
  return <Child tabs={['Home', 'About', 'Contact']} />
}

// ✅ define outside
const tabs = ['Home', 'About', 'Contact']

function Parent() {
  return <Child tabs={tabs} />
}
```

---

## 9. Debouncing — Avoid Too Many State Updates

When a user types in a search box, you don't want to filter or call an API on every single keystroke. **Debouncing** delays the update until the user stops typing.

```jsx
import { useState, useMemo } from 'react'

// Simple debounce hook
function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)  // clear timer on each keystroke
  }, [value, delay])

  return debounced
}

function SearchUsers({ users }) {
  const [query,    setQuery]    = useState('')
  const debouncedQuery          = useDebounce(query, 400)

  // filtering only runs when user stops typing (400ms pause)
  const filtered = useMemo(() =>
    users.filter(u => u.name.toLowerCase().includes(debouncedQuery.toLowerCase())),
    [users, debouncedQuery]
  )

  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search users..."
      />
      <ul>
        {filtered.map(u => <li key={u.id}>{u.name}</li>)}
      </ul>
    </div>
  )
}
```

---

## 10. Virtualization — Render Only Visible List Items

If you have a list of 10,000 items, rendering all of them at once is very slow. **Virtualization** renders only the items that are currently visible on screen.

```bash
npm install @tanstack/react-virtual
```

```jsx
import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef }         from 'react'

function BigList({ items }) {
  const parentRef = useRef()

  const virtualizer = useVirtualizer({
    count:          items.length,
    getScrollElement: () => parentRef.current,
    estimateSize:   () => 50,   // estimated height of each row in px
  })

  return (
    // scrollable container
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>

      {/* total height to keep scrollbar correct */}
      <div style={{ height: virtualizer.getTotalSize() + 'px', position: 'relative' }}>

        {virtualizer.getVirtualItems().map(virtualItem => (
          <div
            key={virtualItem.key}
            style={{
              position:  'absolute',
              top:        virtualItem.start + 'px',
              width:      '100%',
              height:     virtualItem.size + 'px',
            }}
          >
            {items[virtualItem.index].name}
          </div>
        ))}

      </div>
    </div>
  )
}
```

> Without virtualization, rendering 10,000 items creates 10,000 DOM nodes. With virtualization, only ~10–20 are in the DOM at any time — massive speed improvement.

---

## 11. Image Optimization

Large images are one of the most common causes of slow page loads.

```jsx
// ✅ always set width and height to prevent layout shift
<img src="/profile.jpg" alt="User profile" width={200} height={200} />

// ✅ lazy load images below the fold — don't load until user scrolls to them
<img src="/banner.jpg" alt="Banner" loading="lazy" />

// ✅ use modern image formats (WebP is ~30% smaller than JPG)
<img src="/photo.webp" alt="Photo" />

// ✅ use srcSet for different screen sizes
<img
  src="/photo-400.jpg"
  srcSet="/photo-400.jpg 400w, /photo-800.jpg 800w"
  sizes="(max-width: 600px) 400px, 800px"
  alt="Responsive photo"
/>
```

---

## 12. useTransition — Mark Updates as Non-Urgent

`useTransition` lets you mark a state update as **non-urgent** — React will finish any urgent updates first (like typing) before processing the non-urgent one (like filtering a huge list).

```jsx
import { useState, useTransition } from 'react'

function Search({ items }) {
  const [query,      setQuery]      = useState('')
  const [filtered,   setFiltered]   = useState(items)
  const [isPending,  startTransition] = useTransition()

  function handleChange(e) {
    const value = e.target.value
    setQuery(value)  // urgent — update input immediately

    // non-urgent — React can defer this until the input is responsive
    startTransition(() => {
      setFiltered(items.filter(item =>
        item.name.toLowerCase().includes(value.toLowerCase())
      ))
    })
  }

  return (
    <div>
      <input value={query} onChange={handleChange} placeholder="Search..." />

      {isPending && <p>Updating results...</p>}  {/* show while deferred update runs */}

      <ul>
        {filtered.map(item => <li key={item.id}>{item.name}</li>)}
      </ul>
    </div>
  )
}
```

> `useTransition` is useful when a state update causes a slow render (like filtering a list of 1000 items) and you don't want the input to feel laggy while it's happening.

---

## 13. Performance Optimization — Summary

| Problem | Solution |
|---|---|
| Child re-renders when parent re-renders | `React.memo` |
| Expensive calculation runs on every render | `useMemo` |
| Function reference changes on every render | `useCallback` |
| Initial page load is slow (large bundle) | `React.lazy` + `Suspense` |
| List re-renders incorrectly | Correct `key` prop (use ID, not index) |
| Inline objects/arrays break memoization | Define them outside the component |
| Search/filter fires on every keystroke | Debounce with `useDebounce` |
| Rendering huge lists is slow | Virtualization (`@tanstack/react-virtual`) |
| Slow render makes input feel laggy | `useTransition` |
| Slow image loading | `loading="lazy"`, correct size, WebP format |

---

## 14. What to Optimize First

Not all optimizations are equal. Start with the ones that give the most benefit:

```
1. Lazy load routes      → biggest win, easy to add
2. Correct key props     → prevents list bugs, easy fix
3. React.memo on heavy components → good for large lists
4. useMemo for expensive filters  → good for search features
5. useCallback for memoized children → pair with React.memo
6. Virtualization        → only when dealing with 1000+ items
7. useTransition         → only for visibly laggy interactions
```

---

## 15. Interview Questions

**Q1. What causes unnecessary re-renders in React?**
> Three things: a component's own state changes, its parent re-renders (even with the same props), or its context value changes. The most common performance problem is parent re-renders causing all children to re-render even when their props haven't changed.

**Q2. What is React.memo and when should you use it?**
> `React.memo` is a higher-order component that wraps a component and tells React to skip re-rendering it if its props haven't changed. Use it when a component is expensive to render and its parent re-renders frequently but the component's props stay the same. Don't use it on simple components where the comparison cost outweighs the benefit.

**Q3. What is the difference between useMemo and useCallback?**
> `useMemo` caches the **result** of a function — use it for expensive calculations or derived data. `useCallback` caches the **function itself** — use it when you pass a function as a prop to a memoized child component so the function reference stays stable across renders.

**Q4. Why does passing a function as a prop break React.memo?**
> Every render recreates functions as new references. Even if the function logic is identical, React.memo sees a new function reference and re-renders the child. Wrapping the function in `useCallback` gives it a stable reference — React.memo then correctly skips the re-render.

**Q5. What is React.lazy and why is it useful?**
> `React.lazy` enables code splitting — it tells React to only download a component's code when it's actually needed (e.g. when the user navigates to that route). This reduces the initial bundle size and speeds up the first page load.

**Q6. What is Suspense and why is it required with React.lazy?**
> `Suspense` is a boundary component that shows a fallback UI while a lazy component is being downloaded. It's required because lazy loading is asynchronous — there's a moment when the component's code hasn't arrived yet, and React needs to know what to show during that time.

**Q7. Why should you not use array index as a key in a list?**
> When items are reordered, filtered, or added/removed, the index of each item changes. React uses the key to identify which DOM element corresponds to which item — wrong keys cause React to reuse the wrong DOM nodes, leading to UI bugs and unnecessary re-renders. Always use a unique stable ID from your data.

**Q8. What is debouncing and when would you use it in React?**
> Debouncing delays executing a function until a specified time has passed since the last call. In React, it's used for search inputs — instead of filtering or calling an API on every keystroke, you wait until the user pauses typing (e.g. 400ms). This prevents excessive renders and API calls.

**Q9. What is virtualization and when do you need it?**
> Virtualization renders only the list items currently visible in the viewport, not the entire list. Without it, a list of 10,000 items creates 10,000 DOM nodes which is very slow. With virtualization (e.g. `@tanstack/react-virtual`), only ~10–20 nodes exist in the DOM at any time. Use it when rendering more than a few hundred items.

**Q10. What is useTransition?**
> `useTransition` lets you mark a state update as non-urgent. React processes urgent updates first (like updating an input value) and defers the non-urgent ones (like filtering a large list). This keeps the UI responsive — the input doesn't feel laggy even while a slow render is happening in the background.

**Q11. Why can defining objects or arrays inline in JSX hurt performance?**
> Every render creates a new reference for inline objects and arrays — even if the data is identical. When these are passed as props to a memoized component, React.memo sees a "new" prop on every render and re-renders the child anyway, defeating the purpose of memoization. Define stable objects and arrays outside the component or wrap them in `useMemo`.

**Q12. What is the first thing you should do before optimizing a React app?**
> Measure first. Use React DevTools Profiler to identify which components are actually slow and why. Applying optimizations blindly adds complexity without benefit. The most impactful quick wins are: lazy loading routes, fixing incorrect key props, and wrapping expensive components with `React.memo`.

---

> ⏭️ Next Topic: **Testing Basics** — covered in `component_13`.
