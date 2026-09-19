# React - Advanced Patterns

---

## 1. What Are Advanced Patterns?

As your React apps grow larger, you will face problems that basic `useState` and props can't solve cleanly:

- How do you make a component flexible enough to be reused in many different ways?
- How do you share logic between components without duplicating code?
- How do you build component APIs that are easy for other developers to use?

**Advanced patterns** are proven solutions to these problems. They are not new features — they are smart ways of combining the React features you already know.

```
Patterns covered in this section:
  1. Higher-Order Components (HOC)
  2. Render Props
  3. Compound Components
  4. Controlled vs Uncontrolled Components
  5. Custom Hooks as Patterns
  6. Provider Pattern
  7. Container / Presentational Pattern
  8. forwardRef
  9. Error Boundaries
 10. Portals
```

---

## 2. Higher-Order Components (HOC)

A **Higher-Order Component** is a function that takes a component and returns a **new, enhanced component**. It's a way to reuse logic across many components without repeating code.

```
HOC pattern:
  const EnhancedComponent = withSomething(OriginalComponent)
```

Think of it like a wrapper — the original component goes in, a supercharged version comes out.

### Example — withLoading HOC

Imagine you have many components that all need a loading spinner. Instead of adding the loading check inside every component, you create one HOC that adds it automatically.

```jsx
// hocs/withLoading.jsx
function withLoading(WrappedComponent) {

  // return a new component that wraps the original
  return function ComponentWithLoading({ isLoading, ...props }) {
    if (isLoading) {
      return <p>Loading...</p>   // show spinner if loading
    }
    return <WrappedComponent {...props} />  // otherwise show original
  }
}

export default withLoading
```

```jsx
// components/UserList.jsx — original component
function UserList({ users }) {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name} — {user.email}</li>
      ))}
    </ul>
  )
}

export default UserList
```

```jsx
// Usage — wrap UserList with the HOC
import withLoading from './hocs/withLoading'
import UserList    from './components/UserList'

const UserListWithLoading = withLoading(UserList)

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [users,     setUsers]     = useState([])

  return (
    // isLoading is handled by the HOC — UserList never sees it
    <UserListWithLoading
      isLoading={isLoading}
      users={users}
    />
  )
}
```

### Another HOC example — withAuth (route protection):

```jsx
// hocs/withAuth.jsx
import { Navigate } from 'react-router-dom'

function withAuth(WrappedComponent) {
  return function AuthenticatedComponent(props) {
    const isLoggedIn = localStorage.getItem('token')

    if (!isLoggedIn) {
      return <Navigate to="/login" replace />
    }

    return <WrappedComponent {...props} />
  }
}

export default withAuth
```

```jsx
// Protect any page with one line
import withAuth   from './hocs/withAuth'
import Dashboard  from './pages/Dashboard'

const ProtectedDashboard = withAuth(Dashboard)
```

### When to use HOCs:
- Adding cross-cutting concerns (loading, auth, error handling, logging)
- Wrapping many components with the same behavior
- When you can't use a custom hook (rare — but useful for class components)

> In modern React, custom hooks have mostly replaced HOCs for sharing logic. But HOCs are still widely used and appear in many libraries (like `connect()` in Redux).

---

## 3. Render Props

The **Render Props** pattern passes a **function as a prop** to a component. The component calls that function to decide what to render, giving the parent full control over the output.

```
Render Props pattern:
  <Component render={(data) => <SomeUI data={data} />} />
  or
  <Component>{(data) => <SomeUI data={data} />}</Component>  ← children as function
```

### Example — MouseTracker:

```jsx
// components/MouseTracker.jsx
import { useState } from 'react'

function MouseTracker({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  function handleMouseMove(e) {
    setPosition({ x: e.clientX, y: e.clientY })
  }

  return (
    <div onMouseMove={handleMouseMove} style={{ height: '200px', border: '1px solid gray' }}>
      {/* call the render prop with the current position */}
      {render(position)}
    </div>
  )
}

export default MouseTracker
```

```jsx
// Usage — you decide what to render with the position data
<MouseTracker
  render={({ x, y }) => (
    <p>Mouse is at: {x}, {y}</p>
  )}
/>

// Use the same component for a different UI
<MouseTracker
  render={({ x, y }) => (
    <div style={{ position: 'absolute', left: x, top: y }}>🔴</div>
  )}
/>
```

### Children as a function (more common pattern):

```jsx
// Use children instead of a render prop
function MouseTracker({ children }) {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  return (
    <div onMouseMove={e => setPosition({ x: e.clientX, y: e.clientY })}>
      {children(position)}   {/* call children as a function */}
    </div>
  )
}

// Usage
<MouseTracker>
  {({ x, y }) => <p>Position: {x}, {y}</p>}
</MouseTracker>
```

> In modern React, custom hooks have mostly replaced render props too. But you'll still see this pattern in older codebases and some libraries like React Final Form and Downshift.

---

## 4. Compound Components

The **Compound Components** pattern lets you build a group of components that work together as a unit — sharing state implicitly without prop drilling.

Think of how HTML's `<select>` and `<option>` work together — `<option>` knows it belongs to a `<select>` without you passing any props.

```jsx
// ✅ Compound component — clean API
<Tabs>
  <Tabs.List>
    <Tabs.Tab>Profile</Tabs.Tab>
    <Tabs.Tab>Settings</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel>Profile content here</Tabs.Panel>
  <Tabs.Panel>Settings content here</Tabs.Panel>
</Tabs>

// ❌ Without compound components — messy prop drilling
<Tabs
  tabs={['Profile', 'Settings']}
  panels={[<ProfileContent />, <SettingsContent />]}
  activeTab={activeTab}
  onTabChange={setActiveTab}
/>
```

### Building a Tabs compound component:

```jsx
// components/Tabs.jsx
import { createContext, useContext, useState } from 'react'

// shared context — invisible to the user of the component
const TabsContext = createContext()

// 1. Parent component — holds the shared state
function Tabs({ children, defaultIndex = 0 }) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex)

  return (
    <TabsContext.Provider value={{ activeIndex, setActiveIndex }}>
      <div>{children}</div>
    </TabsContext.Provider>
  )
}

// 2. Tab list wrapper
function TabList({ children }) {
  return <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #eee' }}>{children}</div>
}

// 3. Individual tab button
function Tab({ children, index }) {
  const { activeIndex, setActiveIndex } = useContext(TabsContext)
  const isActive = activeIndex === index

  return (
    <button
      onClick={() => setActiveIndex(index)}
      style={{
        padding:     '8px 16px',
        fontWeight:  isActive ? 'bold' : 'normal',
        borderBottom: isActive ? '2px solid blue' : 'none',
        background:  'none',
        border:      'none',
        cursor:      'pointer',
      }}
    >
      {children}
    </button>
  )
}

// 4. Panel — shows content for the active tab
function Panel({ children, index }) {
  const { activeIndex } = useContext(TabsContext)

  if (activeIndex !== index) return null  // hide if not active

  return <div style={{ padding: '16px' }}>{children}</div>
}

// attach sub-components to parent
Tabs.List  = TabList
Tabs.Tab   = Tab
Tabs.Panel = Panel

export default Tabs
```

```jsx
// Usage — clean and readable
import Tabs from './components/Tabs'

function App() {
  return (
    <Tabs defaultIndex={0}>
      <Tabs.List>
        <Tabs.Tab index={0}>Profile</Tabs.Tab>
        <Tabs.Tab index={1}>Settings</Tabs.Tab>
        <Tabs.Tab index={2}>Activity</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel index={0}>
        <p>Name: Ali Ahmed</p>
        <p>Email: ali@example.com</p>
      </Tabs.Panel>

      <Tabs.Panel index={1}>
        <p>Theme: Dark</p>
        <p>Language: English</p>
      </Tabs.Panel>

      <Tabs.Panel index={2}>
        <p>Last login: Today</p>
      </Tabs.Panel>
    </Tabs>
  )
}
```

> Compound components are great for UI component libraries — they give users maximum flexibility while keeping the internal state management hidden.

---

## 5. Controlled vs Uncontrolled Components

This pattern is about **who controls the state** of a form input — React or the DOM itself.

### Controlled Component — React controls the value

```jsx
import { useState } from 'react'

function ControlledInput() {
  const [value, setValue] = useState('')  // React holds the value

  return (
    <input
      value={value}                          // value comes from React state
      onChange={e => setValue(e.target.value)} // React updates on every keystroke
    />
  )
}
```

- React is the single source of truth
- You can read the value at any time via state
- You can validate, transform, or format the value on every keystroke
- Required for controlled form libraries like React Hook Form

### Uncontrolled Component — DOM controls the value

```jsx
import { useRef } from 'react'

function UncontrolledInput() {
  const inputRef = useRef()  // ref points to the DOM input

  function handleSubmit() {
    // read the value only when you need it (on submit)
    console.log(inputRef.current.value)
  }

  return (
    <>
      <input ref={inputRef} defaultValue="" />  {/* DOM manages the value */}
      <button onClick={handleSubmit}>Submit</button>
    </>
  )
}
```

- DOM is the source of truth — you read the value only when needed
- Less re-renders — no state update on every keystroke
- Simpler for basic forms where you don't need live validation

### Side by side comparison:

| | Controlled | Uncontrolled |
|---|---|---|
| Value stored in | React state | DOM |
| How to read value | `value` state variable | `ref.current.value` |
| Re-renders on type | Yes — every keystroke | No |
| Live validation | Easy | Harder |
| Initial value | `value=""` or `useState('')` | `defaultValue=""` |
| Best for | Complex forms, validation | Simple forms, file inputs |

---

## 6. Custom Hooks as Patterns

You already learned custom hooks in `component_07`. In the context of advanced patterns, custom hooks are the **modern replacement** for HOCs and render props — they let you share stateful logic cleanly without changing your component tree.

### Pattern — Extract complex logic into a hook:

```jsx
// hooks/useUserForm.js
import { useState } from 'react'
import axios        from 'axios'

function useUserForm() {
  const [form,     setForm]     = useState({ username: '', email: '', phone: '' })
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(null)
  const [success,  setSuccess]  = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await axios.post('/api/users', form)
      setSuccess(true)
      setForm({ username: '', email: '', phone: '' })
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return { form, loading, error, success, handleChange, handleSubmit }
}

export default useUserForm
```

```jsx
// components/UserForm.jsx — component stays clean
import useUserForm from '../hooks/useUserForm'

function UserForm() {
  const { form, loading, error, success, handleChange, handleSubmit } = useUserForm()

  return (
    <form onSubmit={handleSubmit}>
      <input name="username" value={form.username} onChange={handleChange} placeholder="Username" />
      <input name="email"    value={form.email}    onChange={handleChange} placeholder="Email" />
      <input name="phone"    value={form.phone}    onChange={handleChange} placeholder="Phone" />

      {error   && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>User created!</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Create User'}
      </button>
    </form>
  )
}

export default UserForm
```

> The component only handles UI. All the logic (state, API call, error handling) lives in the hook. This is easy to test, reuse, and maintain.

---

## 7. Provider Pattern

The **Provider Pattern** uses React Context to share data across a component tree without prop drilling. You've seen this in `component_06` (useContext) and `component_10` (Zustand). Here's how to build a clean, production-ready provider.

```jsx
// context/AuthContext.jsx
import { createContext, useContext, useState } from 'react'
import axios from 'axios'

// 1. Create the context
const AuthContext = createContext()

// 2. Create the Provider — holds all auth logic in one place
export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(false)

  async function login(email, password) {
    setLoading(true)
    try {
      const res = await axios.post('/api/login', { email, password })
      setUser(res.data.user)
      localStorage.setItem('token', res.data.token)
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    setUser(null)
    localStorage.removeItem('token')
  }

  const value = { user, loading, login, logout, isLoggedIn: !!user }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// 3. Custom hook — clean API, throws a helpful error if used outside Provider
export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside an <AuthProvider>')
  }

  return context
}
```

```jsx
// main.jsx — wrap app with Provider
import { AuthProvider } from './context/AuthContext'

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <App />
  </AuthProvider>
)
```

```jsx
// Any component — use the hook, no imports of context needed
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { user, logout, isLoggedIn } = useAuth()

  return (
    <nav>
      {isLoggedIn
        ? <>
            <span>Hi, {user.username}</span>
            <button onClick={logout}>Logout</button>
          </>
        : <a href="/login">Login</a>
      }
    </nav>
  )
}
```

---

## 8. Container / Presentational Pattern

This pattern separates components into two types:

- **Container** (Smart) — handles logic, state, API calls. No UI.
- **Presentational** (Dumb) — handles UI only. Receives everything via props. No logic.

```
Container component  →  fetches data, manages state, handles events
       ↓ passes data and handlers as props
Presentational component  →  renders the UI — pure and reusable
```

### Container — the logic layer:

```jsx
// containers/UserListContainer.jsx
import { useState, useEffect } from 'react'
import axios                   from 'axios'
import UserList                from '../components/UserList'

function UserListContainer() {
  const [users,   setUsers]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then(res  => { setUsers(res.data); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [])

  function handleDelete(userId) {
    setUsers(prev => prev.filter(u => u.id !== userId))
  }

  // pass data and handlers to the presentational component
  return (
    <UserList
      users={users}
      loading={loading}
      error={error}
      onDelete={handleDelete}
    />
  )
}

export default UserListContainer
```

### Presentational — the UI layer:

```jsx
// components/UserList.jsx — pure UI, no logic
function UserList({ users, loading, error, onDelete }) {
  if (loading) return <p>Loading users...</p>
  if (error)   return <p>Error: {error}</p>

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>
          <span>{user.name} — {user.email}</span>
          <button onClick={() => onDelete(user.id)}>Delete</button>
        </li>
      ))}
    </ul>
  )
}

export default UserList
```

### Why this matters:

- `UserList` is easy to test — just pass props, no mocking needed
- `UserList` is reusable — works with any data source
- `UserListContainer` can swap the UI without touching any logic

> In modern React, custom hooks handle much of what containers used to do. But the idea of separating logic from UI is still valuable and widely applied.

---

## 9. forwardRef — Pass a Ref to a Child Component

By default, you cannot pass a `ref` to a custom component — `ref` is special and not forwarded like regular props. `forwardRef` solves this.

```jsx
// You want to focus this input from the parent
// but ref on a custom component doesn't work by default
<CustomInput ref={inputRef} />  // ❌ ref is lost — inputRef.current is null
```

### Solution — wrap with forwardRef:

```jsx
// components/CustomInput.jsx
import { forwardRef } from 'react'

const CustomInput = forwardRef(function CustomInput({ placeholder, ...props }, ref) {
  return (
    <input
      ref={ref}             // forward the ref to the actual DOM input
      placeholder={placeholder}
      style={{ border: '1px solid gray', padding: '8px', borderRadius: '4px' }}
      {...props}
    />
  )
})

export default CustomInput
```

```jsx
// Parent — now ref works on the custom component
import { useRef } from 'react'
import CustomInput from './components/CustomInput'

function SearchPage() {
  const inputRef = useRef()

  function focusInput() {
    inputRef.current.focus()  // works! ✅
  }

  return (
    <>
      <CustomInput ref={inputRef} placeholder="Search users..." />
      <button onClick={focusInput}>Focus Input</button>
    </>
  )
}
```

> `forwardRef` is commonly needed when building reusable UI component libraries — input fields, modals, dropdowns — where the consumer needs to control focus or scroll.

---

## 10. Error Boundaries

When a JavaScript error occurs inside a React component during rendering, the whole app crashes. **Error Boundaries** catch those errors and show a fallback UI instead — like a "Something went wrong" message.

> Error Boundaries must be **class components** — there is no hook-based alternative yet. But you only write one and reuse it everywhere.

```jsx
// components/ErrorBoundary.jsx
import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, errorMessage: '' }
  }

  // called when a child component throws an error
  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error.message }
  }

  // called after the error is caught — good for logging
  componentDidCatch(error, info) {
    console.error('Error caught by boundary:', error)
    console.error('Component stack:', info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      // show fallback UI
      return (
        this.props.fallback || (
          <div style={{ padding: '16px', color: 'red' }}>
            <h2>Something went wrong.</h2>
            <p>{this.state.errorMessage}</p>
            <button onClick={() => this.setState({ hasError: false })}>
              Try Again
            </button>
          </div>
        )
      )
    }

    return this.props.children  // render children normally if no error
  }
}

export default ErrorBoundary
```

```jsx
// Usage — wrap any part of your app you want to protect
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  return (
    <div>
      <Navbar />

      {/* if Dashboard crashes, only this section shows the error — Navbar stays */}
      <ErrorBoundary fallback={<p>Dashboard failed to load.</p>}>
        <Dashboard />
      </ErrorBoundary>

      {/* wrap each route separately */}
      <ErrorBoundary>
        <UserList />
      </ErrorBoundary>
    </div>
  )
}
```

> Wrap each major section of your app in its own Error Boundary. If one section crashes, the rest of the app keeps working.

---

## 11. Portals — Render Outside the Parent DOM Node

Normally, when React renders a component, it appears **inside its parent element** in the DOM. But sometimes you need a component to **visually break out** of its parent — for example, a modal, tooltip, or dropdown that needs to appear above everything else on the page.

This is exactly what **Portals** solve.

```
Without Portal:
  <div id="root">
    <App>
      <Dashboard>
        <Modal />   ← stuck inside Dashboard's DOM node
                    ← gets clipped by overflow:hidden or z-index issues
      </Dashboard>
    </App>
  </div>

With Portal:
  <div id="root">
    <App>
      <Dashboard>   ← Modal is logically here in React tree
      </Dashboard>
    </App>
  </div>
  <div id="modal-root">
    <Modal />       ← but physically renders here — outside #root entirely ✅
  </div>
```

Even though the Modal renders in a different DOM node, it still behaves like a normal React child — events bubble up through the React tree, context works, and state is shared normally.

### Step 1 — Add a portal target in `index.html`

```html
<!-- index.html -->
<body>
  <div id="root"></div>
  <div id="modal-root"></div>   <!-- portal target -->
</body>
```

### Step 2 — Create a Portal component

```jsx
// components/Portal.jsx
import { createPortal } from 'react-dom'

function Portal({ children }) {
  const portalRoot = document.getElementById('modal-root')
  return createPortal(children, portalRoot)
}

export default Portal
```

### Step 3 — Use it to build a Modal

```jsx
// components/Modal.jsx
import { createPortal } from 'react-dom'

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null  // don't render anything if closed

  return createPortal(
    // this JSX renders inside #modal-root, not inside the parent component
    <div style={{
      position:        'fixed',
      inset:           0,                        // top/right/bottom/left: 0
      backgroundColor: 'rgba(0, 0, 0, 0.5)',    // dark overlay
      display:         'flex',
      alignItems:      'center',
      justifyContent:  'center',
      zIndex:          1000,
    }}>
      {/* Modal box */}
      <div style={{
        background:   'white',
        borderRadius: '8px',
        padding:      '24px',
        minWidth:     '400px',
        maxWidth:     '90vw',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>
            ✕
          </button>
        </div>

        {/* Content */}
        <div>{children}</div>
      </div>
    </div>,

    document.getElementById('modal-root')  // render target
  )
}

export default Modal
```

```jsx
// Usage in any component — no matter how deeply nested
import { useState } from 'react'
import Modal        from './components/Modal'

function UserCard({ name, email }) {
  const [showModal, setShowModal] = useState(false)

  return (
    <div>
      <p>{name}</p>
      <button onClick={() => setShowModal(true)}>View Details</button>

      {/* Modal renders in #modal-root — not inside UserCard's DOM node */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="User Details"
      >
        <p><strong>Name:</strong>  {name}</p>
        <p><strong>Email:</strong> {email}</p>
        <button onClick={() => setShowModal(false)}>Close</button>
      </Modal>
    </div>
  )
}

export default UserCard
```

### Common use cases for Portals:
- **Modals and dialogs** — need to sit above all other content
- **Tooltips** — need to break out of `overflow: hidden` containers
- **Dropdown menus** — same overflow problem as tooltips
- **Toast notifications** — need to appear at the edge of the screen regardless of position in the tree
- **Full-screen overlays** — loading screens, image lightboxes

### Key things to remember:

```
✅ Even though the portal renders in a different DOM node:
   - React event bubbling still works through the React component tree (not DOM tree)
   - Context values are still accessible inside the portal
   - State and props work exactly the same

✅ The portal target div (#modal-root) must exist in index.html before the portal renders
```

### Close modal on Escape key or backdrop click:

```jsx
import { useEffect } from 'react'
import { createPortal } from 'react-dom'

function Modal({ isOpen, onClose, children }) {
  // close when user presses Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000 }}
      onClick={onClose}   // close when clicking the backdrop
    >
      <div
        style={{ background: 'white', padding: '24px', margin: '100px auto', maxWidth: '500px', borderRadius: '8px' }}
        onClick={e => e.stopPropagation()}  // prevent closing when clicking inside modal
      >
        {children}
      </div>
    </div>,
    document.getElementById('modal-root')
  )
}

export default Modal
```

---



| Pattern | Problem it solves | Modern alternative |
|---|---|---|
| **HOC** | Reuse logic across components | Custom Hook |
| **Render Props** | Share stateful logic with flexible UI | Custom Hook |
| **Compound Components** | Build flexible component groups | Still the best approach |
| **Controlled Component** | Manage form input in React | Still the best approach |
| **Uncontrolled Component** | Simple forms, file inputs | Still the best approach |
| **Custom Hook** | Share stateful logic cleanly | — (this IS the modern way) |
| **Provider Pattern** | Share data without prop drilling | Zustand (for complex apps) |
| **Container/Presentational** | Separate logic from UI | Custom Hook + dumb component |
| **forwardRef** | Pass ref into custom component | Still required |
| **Error Boundary** | Catch render errors gracefully | Still required (class only) |

---

## 12. Summary

```
HOC            →  wrap a component to add behavior (withLoading, withAuth)
Render Props   →  pass a function as prop, component calls it to render
Compound       →  group of components sharing state via context (Tabs, Accordion)
Controlled     →  React owns the input value (via useState)
Uncontrolled   →  DOM owns the input value (via useRef)
Custom Hook    →  extract and reuse logic — modern replacement for HOC/render props
Provider       →  createContext + Provider + custom hook = clean global data sharing
Container      →  smart component handles logic, dumb component handles UI
forwardRef     →  forward ref from parent through to child DOM element
Error Boundary →  catch render errors, show fallback UI (class component)
```

---

## 13. Interview Questions

**Q1. What is a Higher-Order Component (HOC)?**
> A HOC is a function that takes a component and returns a new, enhanced component. It's used to add shared behavior — like a loading state, auth check, or error handling — to many components without repeating the logic. The naming convention is `withSomething`. Example: `withLoading(UserList)` returns a version of `UserList` that shows a spinner when `isLoading` is true.

**Q2. What is the Render Props pattern?**
> Render Props is a pattern where a component receives a function as a prop (or as `children`) and calls it to decide what to render. It shares stateful logic while giving the parent full control over the output. For example, a `MouseTracker` component tracks mouse position and calls `render({ x, y })` — the parent decides how to display it.

**Q3. How are HOCs and Render Props different from Custom Hooks?**
> All three share stateful logic between components. HOCs and Render Props work at the component level — they wrap components or inject UI via functions. Custom Hooks work at the logic level — they extract state and effects into a reusable function. Hooks are the modern preferred approach because they don't add wrapper components to the tree, making the component hierarchy cleaner.

**Q4. What are Compound Components?**
> Compound Components are a group of components that work together and share state implicitly via Context, without the user needing to wire up props manually. Think of `<select>` and `<option>` in HTML. The parent component holds the state in a context, and the sub-components (Tab, Panel, Item) read from it. It creates a clean, flexible component API.

**Q5. What is the difference between a Controlled and Uncontrolled component?**
> In a controlled component, React state is the source of truth — the input's value is set by `useState` and updated via `onChange`. In an uncontrolled component, the DOM manages the value — you attach a `ref` and read `ref.current.value` only when needed (like on submit). Controlled components are better for validation and complex forms. Uncontrolled components are simpler for basic forms.

**Q6. What is forwardRef and when do you need it?**
> By default, `ref` cannot be passed to a custom component — it's a reserved prop that React doesn't forward automatically. `forwardRef` is a wrapper that lets you accept a `ref` in a custom component and attach it to a DOM element inside. It's needed when building reusable input components, modals, or dropdowns where the parent needs to programmatically focus or measure the element.

**Q7. What is an Error Boundary?**
> An Error Boundary is a class component that uses `getDerivedStateFromError` and `componentDidCatch` lifecycle methods to catch JavaScript errors in its child component tree during rendering. It shows a fallback UI instead of crashing the whole app. There is no hook-based equivalent — Error Boundaries must be class components.

**Q8. What is the Container / Presentational pattern?**
> Containers (Smart components) handle all logic — data fetching, state, event handlers. Presentational components (Dumb components) receive everything via props and only render UI. This separation makes presentational components easy to test, reuse, and style without touching any logic.

**Q9. What is the Provider Pattern in React?**
> The Provider Pattern combines `createContext`, a Provider component, and a custom hook to share data globally without prop drilling. The Provider wraps the app (or a section of it) and holds the shared state. Any component inside it reads the data via the custom hook — clean, reusable, and no props needed.

**Q10. Why would you still use HOCs in modern React?**
> While custom hooks have replaced HOCs for most logic-sharing use cases, HOCs are still useful when you need to wrap a component at the JSX level — for example, authentication guards, analytics tracking wrappers, or when working with class components that can't use hooks. Many popular libraries also still expose HOC APIs.

**Q11. How do Compound Components use Context internally?**
> The parent component creates a context and provides shared state (like the active tab index) via `Context.Provider`. The child sub-components (Tab, Panel) call `useContext` to read and update that shared state. The user of the component never sees the context — they just use the clean JSX API. This is the same as useContext but encapsulated inside the component itself.

**Q12. Where should you place Error Boundaries in your app?**
> Wrap each major section independently — routes, the dashboard, the sidebar, a widget. If one section crashes, only that section shows the error — the rest of the app stays functional. Don't put one single Error Boundary at the very top wrapping everything, because then a crash in any small component shows a full-page error.

---

> ⏭️ Next Topic: **Final Project + Review** — covered in `component_15`.
