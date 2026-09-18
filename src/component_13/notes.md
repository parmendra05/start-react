# React - Testing Basics

---

## 1. What is Testing and Why Does It Matter?

Testing means writing code that **automatically checks** that your app works correctly. Instead of manually clicking through your app every time you make a change, tests do it for you — instantly and reliably.

```
Without tests:
  You change some code
  → You manually click through the app to check nothing is broken
  → You miss a bug
  → User finds the bug in production 😬

With tests:
  You change some code
  → Tests run automatically
  → Test fails → you see exactly what broke and where ✅
  → Fix it before it reaches users
```

### Types of tests:

```
Unit Tests       → test a single function or component in isolation
Integration Tests → test how multiple components work together
End-to-End (E2E) → test the whole app in a real browser (like a real user)
```

> For React beginners, focus on **Unit** and **Integration** tests first. They cover 80% of what you need and are much easier to write than E2E tests.

---

## 2. Testing Tools in React

The standard testing stack for React is:

| Tool | What it does |
|---|---|
| **Vitest** | Test runner — runs your test files, shows pass/fail |
| **React Testing Library (RTL)** | Renders components and lets you interact with them like a real user |
| **jest-dom** | Extra matchers like `toBeInTheDocument()`, `toHaveTextContent()` |

> Vitest is used instead of Jest in Vite + React projects because it's built for Vite and much faster. The API is almost identical to Jest.

### Install:

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

---

## 3. Setup — Configure Vitest

### Step 1 — Update `vite.config.js`

```js
// vite.config.js
import { defineConfig } from 'vite'
import react            from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',        // simulate a browser environment
    globals:     true,           // use describe/it/expect without importing them
    setupFiles:  './src/setupTests.js',  // run this file before every test
  },
})
```

### Step 2 — Create `src/setupTests.js`

```js
// src/setupTests.js
import '@testing-library/jest-dom'  // adds extra matchers like toBeInTheDocument()
```

### Step 3 — Add test script to `package.json`

```json
{
  "scripts": {
    "test":    "vitest",
    "test:run": "vitest run"   // run once without watch mode
  }
}
```

### Run tests:

```bash
npm run test        # watch mode — re-runs on file save
npm run test:run    # run once and exit
```

---

## 4. Your First Test — Testing a Function

Before testing React components, let's understand the basic structure of a test.

```js
// utils/math.js  — the function we want to test
export function add(a, b) {
  return a + b
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
```

```js
// utils/math.test.js  — the test file (same name, add .test.js)
import { describe, it, expect } from 'vitest'
import { add, capitalize }      from './math'

describe('math utils', () => {

  it('adds two numbers correctly', () => {
    expect(add(2, 3)).toBe(5)
    expect(add(0, 0)).toBe(0)
    expect(add(-1, 1)).toBe(0)
  })

  it('capitalizes the first letter of a string', () => {
    expect(capitalize('hello')).toBe('Hello')
    expect(capitalize('react')).toBe('React')
  })

})
```

### Test structure — breaking it down:

```
describe('group name', () => { ... })
  → groups related tests together (like a folder)

it('what it should do', () => { ... })   (also written as test())
  → one single test case

expect(value).toBe(expected)
  → the assertion — checks that the value matches what you expect
```

---

## 5. Common Matchers

Matchers are the `.toBe()`, `.toEqual()` etc. part — they check the value in different ways.

```js
// Equality
expect(2 + 2).toBe(4)              // strict equality (===)
expect({ a: 1 }).toEqual({ a: 1 }) // deep equality (for objects/arrays)

// Truthiness
expect(true).toBeTruthy()
expect(false).toBeFalsy()
expect(null).toBeNull()
expect(undefined).toBeUndefined()
expect('hello').toBeDefined()

// Numbers
expect(10).toBeGreaterThan(5)
expect(3).toBeLessThan(10)
expect(3.14).toBeCloseTo(3.1415, 1)  // for floating point

// Strings
expect('hello world').toContain('world')
expect('hello').toMatch(/ell/)       // regex match

// Arrays
expect([1, 2, 3]).toContain(2)
expect([1, 2, 3]).toHaveLength(3)

// Negation — add .not before any matcher
expect(2 + 2).not.toBe(5)
expect('hello').not.toContain('xyz')
```

---

## 6. Testing React Components — The Basics

React Testing Library renders your component into a fake DOM and lets you query and interact with it exactly like a real user would.

### The golden rule of RTL:

> Test what the **user sees and does** — not the internal implementation. Query by visible text, labels, and roles — not by class names or component state.

```jsx
// components/Greeting.jsx  — simple component to test
function Greeting({ username }) {
  return (
    <div>
      <h1>Hello, {username}!</h1>
      <p>Welcome back.</p>
    </div>
  )
}

export default Greeting
```

```jsx
// components/Greeting.test.jsx
import { render, screen } from '@testing-library/react'
import Greeting            from './Greeting'

describe('Greeting component', () => {

  it('renders the username', () => {
    render(<Greeting username="Ali" />)  // render the component

    // screen.getByText — find element by its visible text
    expect(screen.getByText('Hello, Ali!')).toBeInTheDocument()
  })

  it('renders the welcome message', () => {
    render(<Greeting username="Sara" />)
    expect(screen.getByText('Welcome back.')).toBeInTheDocument()
  })

})
```

### What `render` and `screen` do:

```
render(<Component />)  → puts the component into a fake DOM
screen                 → lets you query that fake DOM
screen.getByText()     → find an element by its visible text content
.toBeInTheDocument()   → checks the element exists in the DOM
```

---

## 7. Querying Elements — How to Find Things

RTL gives you several ways to find elements. The priority order is:

```
1. getByRole        → best — finds by ARIA role (button, heading, input, etc.)
2. getByLabelText   → for form inputs — finds by the <label> text
3. getByPlaceholderText → for inputs with placeholder
4. getByText        → finds by visible text content
5. getByTestId      → last resort — add data-testid to element
```

```jsx
// The component
function LoginForm() {
  return (
    <form>
      <label htmlFor="email">Email</label>
      <input id="email" type="email" placeholder="Enter your email" />

      <label htmlFor="password">Password</label>
      <input id="password" type="password" />

      <button type="submit">Sign In</button>
    </form>
  )
}
```

```jsx
// Querying it in tests
render(<LoginForm />)

// by role — most reliable
screen.getByRole('button', { name: 'Sign In' })
screen.getByRole('textbox', { name: 'Email' })

// by label text — great for inputs
screen.getByLabelText('Email')
screen.getByLabelText('Password')

// by placeholder
screen.getByPlaceholderText('Enter your email')

// by text
screen.getByText('Sign In')
```

### getBy vs queryBy vs findBy:

```
getBy...    → throws error if not found — use when element MUST exist
queryBy...  → returns null if not found — use when element MIGHT not exist
findBy...   → returns a Promise — use for elements that appear asynchronously
```

```js
// getBy — throws if missing (use for elements that should be there)
expect(screen.getByText('Hello')).toBeInTheDocument()

// queryBy — returns null (use to assert something is NOT there)
expect(screen.queryByText('Error')).not.toBeInTheDocument()

// findBy — async (use for elements that appear after loading/API call)
const element = await screen.findByText('Data loaded')
```

---

## 8. Testing User Interactions

Use `userEvent` from `@testing-library/user-event` to simulate real user interactions like typing, clicking, and submitting.

```jsx
// components/Counter.jsx
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  )
}

export default Counter
```

```jsx
// components/Counter.test.jsx
import { render, screen } from '@testing-library/react'
import userEvent           from '@testing-library/user-event'
import Counter             from './Counter'

describe('Counter component', () => {

  it('shows initial count of 0', () => {
    render(<Counter />)
    expect(screen.getByText('Count: 0')).toBeInTheDocument()
  })

  it('increments count when button is clicked', async () => {
    const user = userEvent.setup()  // always setup userEvent
    render(<Counter />)

    await user.click(screen.getByRole('button', { name: 'Increment' }))

    expect(screen.getByText('Count: 1')).toBeInTheDocument()
  })

  it('decrements count when button is clicked', async () => {
    const user = userEvent.setup()
    render(<Counter />)

    await user.click(screen.getByRole('button', { name: 'Decrement' }))

    expect(screen.getByText('Count: -1')).toBeInTheDocument()
  })

  it('resets count to 0', async () => {
    const user = userEvent.setup()
    render(<Counter />)

    await user.click(screen.getByRole('button', { name: 'Increment' }))
    await user.click(screen.getByRole('button', { name: 'Increment' }))
    await user.click(screen.getByRole('button', { name: 'Reset' }))

    expect(screen.getByText('Count: 0')).toBeInTheDocument()
  })

})
```

---

## 9. Testing Forms — Typing and Submitting

```jsx
// components/LoginForm.jsx
import { useState } from 'react'

function LoginForm({ onLogin }) {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    onLogin({ email, password })
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button type="submit">Login</button>
    </form>
  )
}

export default LoginForm
```

```jsx
// components/LoginForm.test.jsx
import { render, screen } from '@testing-library/react'
import userEvent           from '@testing-library/user-event'
import { vi }              from 'vitest'
import LoginForm           from './LoginForm'

describe('LoginForm', () => {

  it('calls onLogin with email and password on submit', async () => {
    const user    = userEvent.setup()
    const onLogin = vi.fn()  // vi.fn() creates a mock function to spy on calls

    render(<LoginForm onLogin={onLogin} />)

    // type into the email field
    await user.type(screen.getByLabelText('Email'), 'john@example.com')

    // type into the password field
    await user.type(screen.getByLabelText('Password'), 'secret123')

    // click the submit button
    await user.click(screen.getByRole('button', { name: 'Login' }))

    // check onLogin was called with the correct values
    expect(onLogin).toHaveBeenCalledTimes(1)
    expect(onLogin).toHaveBeenCalledWith({
      email:    'john@example.com',
      password: 'secret123',
    })
  })

  it('renders email and password fields', () => {
    render(<LoginForm onLogin={() => {}} />)

    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
  })

})
```

---

## 10. Testing Async Components (API Calls)

When a component fetches data, the content appears asynchronously. Use `findBy` queries (which return Promises) and mock the API call.

```jsx
// components/UserList.jsx
import { useState, useEffect } from 'react'
import axios                   from 'axios'

function UserList() {
  const [users,   setUsers]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then(res => { setUsers(res.data); setLoading(false) })
      .catch(()  => setLoading(false))
  }, [])

  if (loading) return <p>Loading...</p>

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
// components/UserList.test.jsx
import { render, screen } from '@testing-library/react'
import { vi }              from 'vitest'
import axios               from 'axios'
import UserList            from './UserList'

// mock the entire axios module
vi.mock('axios')

describe('UserList', () => {

  it('shows loading text initially then renders users', async () => {
    // tell the mock what to return when axios.get is called
    axios.get.mockResolvedValue({
      data: [
        { id: 1, name: 'Ali Ahmed',  email: 'ali@example.com'  },
        { id: 2, name: 'Sara Khan',  email: 'sara@example.com' },
      ]
    })

    render(<UserList />)

    // loading state shows first
    expect(screen.getByText('Loading...')).toBeInTheDocument()

    // wait for users to appear (findBy waits for async updates)
    expect(await screen.findByText('Ali Ahmed — ali@example.com')).toBeInTheDocument()
    expect(await screen.findByText('Sara Khan — sara@example.com')).toBeInTheDocument()

    // loading text is gone
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
  })

})
```

---

## 11. Mocking — vi.fn() and vi.mock()

Mocks replace real functions/modules with fake ones so you can:
- Control what they return
- Check if they were called
- Avoid real API calls in tests

```js
import { vi } from 'vitest'

// vi.fn() — create a mock function
const mockFn = vi.fn()

mockFn('hello')

expect(mockFn).toHaveBeenCalled()                // was it called?
expect(mockFn).toHaveBeenCalledTimes(1)          // called exactly once?
expect(mockFn).toHaveBeenCalledWith('hello')     // called with this argument?

// Make it return a specific value
const mockFn2 = vi.fn().mockReturnValue(42)
console.log(mockFn2())  // 42

// Make it return a resolved promise
const mockFn3 = vi.fn().mockResolvedValue({ data: 'success' })
```

```js
// vi.mock() — mock an entire module
vi.mock('axios')          // replaces all of axios with mocks
vi.mock('./api/service')  // mock your own module
```

```js
// Clear mocks between tests so they don't interfere with each other
afterEach(() => {
  vi.clearAllMocks()
})
```

---

## 12. jest-dom Matchers — Full List

These come from `@testing-library/jest-dom` and work on DOM elements:

```js
// Presence
expect(element).toBeInTheDocument()       // element exists in DOM
expect(element).not.toBeInTheDocument()   // element does not exist

// Visibility
expect(element).toBeVisible()             // visible to user
expect(element).toBeHidden()              // hidden (display:none, visibility:hidden)

// Content
expect(element).toHaveTextContent('Hello')          // text matches
expect(element).toHaveTextContent(/hello/i)         // text matches regex
expect(input).toHaveValue('john@example.com')       // input value
expect(checkbox).toBeChecked()                      // checkbox is checked
expect(checkbox).not.toBeChecked()

// Attributes & Classes
expect(element).toHaveAttribute('type', 'email')    // has attribute
expect(element).toHaveClass('active')               // has CSS class
expect(element).not.toHaveClass('disabled')

// Form state
expect(button).toBeDisabled()             // button/input is disabled
expect(input).toBeEnabled()              // not disabled
expect(input).toBeRequired()             // has required attribute
expect(input).toHaveFocus()              // currently focused
```

---

## 13. Test File Naming and Structure

```
src/
  components/
    UserCard.jsx
    UserCard.test.jsx        ← test file lives next to the component

  utils/
    formatDate.js
    formatDate.test.js

  pages/
    Dashboard.jsx
    Dashboard.test.jsx

  __tests__/                 ← alternative: put all tests in one folder
    UserCard.test.jsx
    Dashboard.test.jsx
```

> The convention is to name test files `ComponentName.test.jsx` and place them next to the file they test. Both `.test.js` and `.spec.js` extensions work.

### Test file structure — best practice:

```js
// 1. Imports
import { render, screen } from '@testing-library/react'
import userEvent           from '@testing-library/user-event'
import Component           from './Component'

// 2. Shared setup (if needed)
beforeEach(() => {
  // runs before each test in this file
})

afterEach(() => {
  vi.clearAllMocks()  // clean up mocks after each test
})

// 3. Test suites
describe('Component', () => {

  // 4. Individual tests
  it('renders correctly', () => { ... })
  it('handles user interaction', async () => { ... })
  it('shows error state', () => { ... })

})
```

---

## 14. What to Test — and What Not To

### Test this:
- Component renders the right content for given props
- User interactions produce the expected result (click, type, submit)
- Conditional rendering (shows error message when there's an error)
- Async behavior (loading state → data state)
- Form validation messages appear correctly

### Don't test this:
- Internal implementation details (component state values, function names)
- Third-party library behavior (React itself, axios, etc.)
- Styling details (CSS class names, colors) — these change often
- Every tiny edge case for simple components

```jsx
// ❌ testing implementation — fragile, changes when you refactor
expect(component.state.isOpen).toBe(true)

// ✅ testing behavior — tests what the user actually sees
expect(screen.getByRole('dialog')).toBeVisible()
```

---

## 15. Complete Example — Full Component with Tests

```jsx
// components/UserCard.jsx
function UserCard({ name, email, role, onDelete }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{email}</p>
      <span>{role}</span>
      <button onClick={() => onDelete(email)}>Delete</button>
    </div>
  )
}

export default UserCard
```

```jsx
// components/UserCard.test.jsx
import { render, screen } from '@testing-library/react'
import userEvent           from '@testing-library/user-event'
import { vi }              from 'vitest'
import UserCard            from './UserCard'

const defaultProps = {
  name:     'Ali Ahmed',
  email:    'ali@example.com',
  role:     'Admin',
  onDelete: vi.fn(),
}

describe('UserCard', () => {

  afterEach(() => vi.clearAllMocks())

  it('renders user name, email and role', () => {
    render(<UserCard {...defaultProps} />)

    expect(screen.getByText('Ali Ahmed')).toBeInTheDocument()
    expect(screen.getByText('ali@example.com')).toBeInTheDocument()
    expect(screen.getByText('Admin')).toBeInTheDocument()
  })

  it('renders a delete button', () => {
    render(<UserCard {...defaultProps} />)
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
  })

  it('calls onDelete with the email when delete is clicked', async () => {
    const user = userEvent.setup()
    render(<UserCard {...defaultProps} />)

    await user.click(screen.getByRole('button', { name: 'Delete' }))

    expect(defaultProps.onDelete).toHaveBeenCalledTimes(1)
    expect(defaultProps.onDelete).toHaveBeenCalledWith('ali@example.com')
  })

})
```

---

## 16. Summary

| Concept | Detail |
|---|---|
| Test runner | Vitest — runs tests, shows results |
| Render components | `render(<Component />)` from RTL |
| Find elements | `screen.getByRole`, `getByText`, `getByLabelText` |
| Async elements | `await screen.findByText(...)` |
| Check element exists | `expect(el).toBeInTheDocument()` |
| Check element missing | `expect(screen.queryByText(...)).not.toBeInTheDocument()` |
| Simulate clicks | `await user.click(element)` |
| Simulate typing | `await user.type(element, 'text')` |
| Mock a function | `vi.fn()` |
| Mock a module | `vi.mock('module-name')` |
| Mock return value | `mockFn.mockResolvedValue(data)` |
| File naming | `Component.test.jsx` next to the component |

---

## 17. Interview Questions

**Q1. What is the purpose of testing in React?**
> Testing automatically verifies that your components and functions behave correctly. It catches bugs before they reach users, gives you confidence to refactor without breaking things, and serves as living documentation of how your code is expected to behave.

**Q2. What is the difference between unit, integration, and end-to-end tests?**
> Unit tests test a single function or component in isolation. Integration tests verify how multiple components or modules work together. End-to-end tests run the whole app in a real browser and simulate a real user journey. For React apps, unit and integration tests with RTL cover most needs.

**Q3. What is React Testing Library and what is its philosophy?**
> RTL is a testing library that renders React components into a fake DOM and provides utilities to query and interact with them. Its core philosophy is to test what the user sees and does — not internal implementation details. You query by visible text, labels, and roles — the same way a real user (or a screen reader) would find elements.

**Q4. What is the difference between getBy, queryBy, and findBy queries?**
> `getBy` throws an error if the element is not found — use when the element must exist. `queryBy` returns null if not found — use when asserting that something does NOT exist. `findBy` returns a Promise and waits for the element to appear — use for elements that appear after async operations like API calls.

**Q5. Why should you prefer getByRole over getByTestId?**
> `getByRole` queries the DOM the same way assistive technologies (screen readers) do — by semantic role like `button`, `textbox`, `heading`. This makes tests more accessible and resilient. `getByTestId` requires adding `data-testid` attributes to your HTML and tests implementation details rather than user-visible behavior.

**Q6. What is userEvent and why use it over fireEvent?**
> `userEvent` simulates real user behavior — when you type, it fires keydown, keypress, keyup, and input events in the right order, just like a real browser. `fireEvent` fires a single low-level DOM event. `userEvent` is more realistic and catches more bugs.

**Q7. What is vi.fn() and what can you do with it?**
> `vi.fn()` creates a mock function — a fake function that records how it was called. You can assert it was called, how many times, and with what arguments using `toHaveBeenCalled()`, `toHaveBeenCalledTimes()`, and `toHaveBeenCalledWith()`. You can also make it return specific values with `.mockReturnValue()` or `.mockResolvedValue()`.

**Q8. How do you test a component that makes an API call?**
> Mock the API module with `vi.mock('axios')` so no real network request is made. Then tell the mock what to return with `axios.get.mockResolvedValue({ data: [...] })`. In the test, use `await screen.findByText(...)` to wait for the async data to appear in the DOM.

**Q9. What is the difference between `toBeInTheDocument()` and `toBeVisible()`?**
> `toBeInTheDocument()` checks that the element exists anywhere in the DOM — even if it's hidden. `toBeVisible()` checks that it's actually visible to the user — not hidden by `display: none`, `visibility: hidden`, or similar CSS.

**Q10. Why should you call vi.clearAllMocks() in afterEach?**
> Mock functions remember their call history across tests. If you don't clear them between tests, a mock called in test 1 will still show that call when you check it in test 2, causing false failures. `vi.clearAllMocks()` resets all mock call counts and return values after each test.

**Q11. What should you NOT test in React components?**
> Don't test internal implementation details like state variable values, method names, or CSS class names — these can change without affecting user behavior. Don't test third-party library behavior. Focus on what the user sees and what happens when they interact with the UI.

**Q12. What is a snapshot test?**
> A snapshot test renders a component and saves its output to a file. On the next run, it compares the current output to the saved snapshot — if they differ, the test fails. Snapshots are quick to create but fragile — any small UI change breaks them. They're useful for catching unexpected changes but should not replace behavioral tests.

---

> ⏭️ Next Topic: **Advanced Patterns** — covered in `component_14`.
