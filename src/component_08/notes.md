# React - React Router v6

---

## 1. What is React Router?

When you build a React app, it is actually a **single HTML file**. There is only one `index.html`. So how do you make it feel like there are multiple pages — Home, About, Contact?

That's exactly what **React Router** does. It watches the URL in the browser and shows a different component depending on what the URL is — without reloading the page.

```
Without React Router:
  User clicks "About" → browser asks the server for a new page → full reload (slow ❌)

With React Router:
  User clicks "About" → React swaps the component on screen → no reload (instant ✅)
```

### Install it first:

```bash
npm install react-router-dom
```

---

## 2. All the Pieces — What Each One Does

Before we start, here is a quick overview of everything React Router gives you. Don't worry about memorizing this — you will understand each one as we go through the examples below.

| Name | What it does in simple words |
|---|---|
| `BrowserRouter` | Wraps your whole app. Without this, nothing works. It is the router itself. |
| `Routes` | A container that holds all your routes. Think of it as a switch statement — it looks at the URL and picks the right route. |
| `Route` | One single rule — "if the URL is `/about`, show the `About` component". |
| `Link` | Works like an `<a>` tag but without reloading the page. Always use this instead of `<a>`. |
| `NavLink` | Same as `Link` but it can automatically highlight itself when it is the active page. Great for navbars. |
| `Navigate` | Automatically sends the user to a different page. Used for redirects. |
| `Outlet` | A blank space inside a layout where the child page content will appear. |
| `useNavigate` | A hook that lets you navigate to a page from inside your JavaScript code (not just a click). |
| `useParams` | A hook that reads the dynamic part of a URL. For example, reads the `5` from `/users/5`. |
| `useLocation` | A hook that tells you what the current URL is and any extra data passed during navigation. |
| `useSearchParams` | A hook to read and update the query string in the URL, like `?category=shoes`. |

---

## 3. Setting Up React Router — Step by Step

### Step 1 — Wrap your app with `<BrowserRouter>` in `main.jsx`

`BrowserRouter` is the engine of React Router. It needs to wrap your entire app so that every component inside it can use routing features.

You only do this **once**, in `main.jsx`.

```jsx
import { StrictMode }    from 'react'
import { createRoot }    from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'   // import BrowserRouter
import App               from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>   {/* wrap App inside BrowserRouter */}
      <App />
    </BrowserRouter>
  </StrictMode>
)
```

> Think of `BrowserRouter` as the foundation. Everything else is built on top of it.

---

### Step 2 — Define your routes in `App.jsx`

Now you tell React Router: "when the URL is `/`, show `<Home />`. When it is `/about`, show `<About />`."

- `<Routes>` is the container — it holds all your route rules.
- `<Route>` is one single rule.
- `path` is the URL to match.
- `element` is the component to show.

```jsx
import { Routes, Route } from 'react-router-dom'
import Home     from './pages/Home'
import About    from './pages/About'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      {/* when URL is "/"      → show Home component */}
      <Route path="/"      element={<Home />}     />

      {/* when URL is "/about" → show About component */}
      <Route path="/about" element={<About />}    />

      {/* path="*" means "nothing else matched" → show 404 page */}
      <Route path="*"      element={<NotFound />} />
    </Routes>
  )
}

export default App
```

> `path="*"` is your safety net. If someone types a URL that doesn't exist, this route catches it and shows a "Page Not Found" message instead of a blank screen.

---

### Step 3 — Add navigation links with `<Link>`

Never use a regular `<a href="/about">` in React. That causes a full page reload and breaks the SPA behavior.

Instead, use `<Link to="/about">`. It looks the same to the user but navigates instantly without reloading.

```jsx
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav>
      {/* to="/about" works just like href="/about" but without page reload */}
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
    </nav>
  )
}

export default Navbar
```

> Rule of thumb: use `<Link>` everywhere you would normally use `<a href>`.

---

## 4. NavLink — Highlight the Active Page

`NavLink` is just like `Link` but it knows when it is the currently active page. This is useful in navbars — you can make the current page's link look different (bold, different color, underline, etc.).

It gives you an `isActive` value that is `true` when the current URL matches the link.

```jsx
import { NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <nav style={{ background: 'darkblue', padding: '16px', display: 'flex', gap: '24px' }}>

      {/* isActive is true when we are on the Home page */}
      <NavLink
        to="/"
        style={({ isActive }) => ({
          color: isActive ? 'yellow' : 'white',   // yellow if active, white if not
          fontSize: '18px'
        })}
      >
        Home
      </NavLink>

      <NavLink
        to="/about"
        style={({ isActive }) => ({
          color: isActive ? 'yellow' : 'white',
          fontSize: '18px'
        })}
      >
        About
      </NavLink>

    </nav>
  )
}

export default Navbar
```

> `isActive` is automatically provided by React Router — you don't set it yourself. React Router checks the current URL and sets `isActive` to `true` when the URL matches.

---

## 5. URL Parameters — useParams

Sometimes you want a dynamic URL like `/users/1`, `/users/2`, `/users/3` — where the number changes but the page is the same component.

You define this with a colon `:` in the route path. The part after `:` is the name you use to read the value.

### Step 1 — Define a dynamic route

```jsx
{/* the ":id" part is a placeholder — it can be any value */}
<Route path="/users/:id" element={<UserDetail />} />
```

### Step 2 — Read the value inside the component

```jsx
import { useParams } from 'react-router-dom'

function UserDetail() {
  // useParams reads whatever value is in the ":id" part of the URL
  const { id } = useParams()

  // if URL is /users/5 → id is "5"
  // if URL is /users/42 → id is "42"
  return <h2>Showing details for User ID: {id}</h2>
}

export default UserDetail
```

> The name you use in `useParams()` must match the name you used after `:` in the route path. So `:id` → `const { id } = useParams()`.

---

## 6. useNavigate — Go to a Page from Code

`Link` works when the user clicks something. But sometimes you need to navigate **from your code** — for example, after a form is submitted or after a login is successful.

That's what `useNavigate` is for.

```jsx
import { useNavigate } from 'react-router-dom'

function LoginForm() {
  // useNavigate gives you a function called "navigate"
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()

    // ... your login logic here ...

    // after login is done, send the user to the dashboard
    navigate('/dashboard')

    // use replace:true so the user can't press Back and return to the login page
    navigate('/dashboard', { replace: true })

    // go back one page (like pressing the browser's Back button)
    navigate(-1)
  }

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Login</button>
    </form>
  )
}

export default LoginForm
```

> Think of `navigate('/dashboard')` as the code version of clicking a `<Link to="/dashboard">`.

---

## 7. Nested Routes + Outlet — Shared Layout

Imagine every page of your app has the same navbar at the top. You don't want to copy `<Navbar />` into every single page component. Instead, you create one **Layout** component that has the navbar, and all pages render inside it.

This is done with **nested routes** and `<Outlet />`.

`<Outlet />` is just a blank placeholder that says: "put the current page's content here".

### Step 1 — Define nested routes in App.jsx

The parent route (`/`) renders the `Layout`. All child routes render inside it.

```jsx
import { Routes, Route } from 'react-router-dom'
import Layout    from './Layout'
import Home      from './pages/Home'
import About     from './pages/About'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <Routes>

      {/* Layout is the parent — it always renders */}
      <Route path="/" element={<Layout />}>

        {/* index means "show this when URL is exactly /" */}
        <Route index            element={<Home />}      />

        {/* show About when URL is "/about" */}
        <Route path="about"     element={<About />}     />

        {/* show Dashboard when URL is "/dashboard" */}
        <Route path="dashboard" element={<Dashboard />} />

      </Route>

    </Routes>
  )
}

export default App
```

### Step 2 — Create the Layout with `<Outlet />`

`<Outlet />` is where the child page will appear. The navbar stays fixed above it.

```jsx
import { Outlet, NavLink } from 'react-router-dom'

function Layout() {
  return (
    <>
      {/* This navbar is always visible on every page */}
      <nav style={{ background: 'darkblue', padding: '16px', display: 'flex', gap: '24px' }}>
        <NavLink to="/"          style={{ color: 'white', fontSize: '18px' }}>Home</NavLink>
        <NavLink to="/about"     style={{ color: 'white', fontSize: '18px' }}>About</NavLink>
        <NavLink to="/dashboard" style={{ color: 'white', fontSize: '18px' }}>Dashboard</NavLink>
      </nav>

      {/* The current page content appears here */}
      <main style={{ padding: '16px' }}>
        <Outlet />
      </main>
    </>
  )
}

export default Layout
```

### What the URL shows:
```
/            →  Layout (navbar) + Home page content
/about       →  Layout (navbar) + About page content
/dashboard   →  Layout (navbar) + Dashboard page content
```

> Without `<Outlet />`, React Router renders the Layout but has nowhere to put the child page — the page content would just disappear.

---

## 8. Protected Routes — Block Pages from Unauthenticated Users

Some pages should only be accessible if the user is logged in — like a dashboard or profile page. If someone tries to visit `/dashboard` without being logged in, they should be sent to `/login` automatically.

This is called a **Protected Route** or **Auth Guard**.

### Step 1 — Create a ProtectedRoute component

This component checks if the user is logged in.
- If **not logged in** → redirect to `/login`
- If **logged in** → show the actual page using `<Outlet />`

```jsx
// components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom'

function ProtectedRoute({ isAuthenticated }) {

  // if not logged in, send the user to the login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // if logged in, render whatever child route was requested
  return <Outlet />
}

export default ProtectedRoute
```

### Step 2 — Wrap private routes with ProtectedRoute in App.jsx

```jsx
import { useState }      from 'react'
import { Routes, Route } from 'react-router-dom'
import Login             from './pages/Login'
import Dashboard         from './pages/Dashboard'
import Profile           from './pages/Profile'
import ProtectedRoute    from './components/ProtectedRoute'

function App() {
  // in a real app this would come from context or a token check
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  return (
    <Routes>
      {/* anyone can visit /login */}
      <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />

      {/* only logged-in users can visit these routes */}
      <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile"   element={<Profile />}   />
      </Route>

    </Routes>
  )
}

export default App
```

> Notice the `<ProtectedRoute>` has no `path` — it is not a page itself. It is just a guard layer that sits in front of the private routes.

---

## 9. useLocation — Know Where You Are

`useLocation` gives you information about the **current URL**. It is useful when you want to know what page the user is on, or when you want to pass some extra data along during navigation.

```jsx
import { useLocation } from 'react-router-dom'

function MyComponent() {
  const location = useLocation()

  // location.pathname → the current URL path, e.g. "/about"
  // location.search   → the query string, e.g. "?tab=info"
  // location.state    → any extra data passed via navigate()

  return <p>You are on: {location.pathname}</p>
}

export default MyComponent
```

### Passing data from one page to another

Sometimes you want to send a small piece of information along when navigating — like telling the destination page where the user came from.

```jsx
// Page A — send data along with navigation
import { useNavigate } from 'react-router-dom'

function PageA() {
  const navigate = useNavigate()

  return (
    <button onClick={() => navigate('/profile', { state: { from: 'dashboard' } })}>
      Go to Profile
    </button>
  )
}
```

```jsx
// Page B — receive and read the data
import { useLocation } from 'react-router-dom'

function Profile() {
  const location = useLocation()

  // reads "dashboard" that was passed from Page A
  console.log(location.state?.from)

  return <p>Profile Page</p>
}
```

> This data is **not saved** — if the user refreshes the page, `location.state` will be gone. Use it only for temporary things like "where did the user come from".

---

## 10. useSearchParams — Read & Update the URL Query String

A query string is the part of the URL after the `?` — like `/products?category=shoes&page=2`. It's commonly used for filters, search terms, and pagination.

`useSearchParams` works just like `useState` but it reads from and writes to the URL instead of a variable.

```jsx
import { useSearchParams } from 'react-router-dom'

function ProductList() {
  // searchParams lets you read the query string
  // setSearchParams lets you update it
  const [searchParams, setSearchParams] = useSearchParams()

  // reads "?category=shoes" → gives you "shoes"
  // if no category in URL, default to "all"
  const category = searchParams.get('category') || 'all'

  return (
    <div>
      <p>Showing category: {category}</p>

      {/* clicking this updates the URL to /products?category=shoes */}
      <button onClick={() => setSearchParams({ category: 'shoes' })}>Shoes</button>
      <button onClick={() => setSearchParams({ category: 'bags'  })}>Bags</button>
    </div>
  )
}

export default ProductList
```

> The URL updates when you call `setSearchParams` — no page reload, and the user can share or bookmark the URL with the filter already applied.

---

## 11. Navigate Component — Redirect Directly in JSX

`<Navigate>` is used when you want to redirect the user based on a condition right inside your JSX — without needing a button click or a function call.

```jsx
import { Navigate } from 'react-router-dom'

function Home({ isLoggedIn }) {

  // if already logged in, skip the home page and go straight to dashboard
  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />
  }

  return <h1>Welcome! Please log in.</h1>
}

export default Home
```

> `<Navigate>` is the JSX version of `navigate()`. Use `<Navigate>` when you need to redirect as part of rendering. Use `useNavigate()` when you need to redirect from inside a function.

---

## 12. Complete File Structure

This is how a typical React Router project is organized:

```
src/
  main.jsx              ← Step 1: BrowserRouter goes here
  App.jsx               ← Step 2: All Routes are defined here
  Layout.jsx            ← The shared navbar + <Outlet /> placeholder
  pages/
    Home.jsx            ← Shown at "/"
    About.jsx           ← Shown at "/about"
    Dashboard.jsx       ← Shown at "/dashboard" (protected)
    Profile.jsx         ← Shown at "/profile" (protected)
    Login.jsx           ← Shown at "/login"
    NotFound.jsx        ← Shown when no route matches (404)
  components/
    ProtectedRoute.jsx  ← The auth guard component
```

---

## 13. v5 vs v6 — What Changed

If you see older React Router code online, it might look different. Here's what changed in v6:

| Old (v5) | New (v6) | What it means |
|---|---|---|
| `<Switch>` | `<Routes>` | Same idea, new name |
| `<Route component={Home}>` | `<Route element={<Home />}>` | Now you pass JSX, not a reference |
| `exact` prop was required | Not needed anymore | v6 matches exactly by default |
| `<Redirect to="/login">` | `<Navigate to="/login">` | Same thing, new name |
| `useHistory()` | `useNavigate()` | Same idea, cleaner API |
| Nested routes defined inside page components | Nested routes all defined in `App.jsx` | Easier to read and manage |

---

## 14. Full Working App.jsx — Everything Together

Here is a complete `App.jsx` that uses everything covered above:

```jsx
import { useState }      from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout            from './Layout'
import Home              from './pages/Home'
import About             from './pages/About'
import Dashboard         from './pages/Dashboard'
import Login             from './pages/Login'
import UserDetail        from './pages/UserDetail'
import NotFound          from './pages/NotFound'
import ProtectedRoute    from './components/ProtectedRoute'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  return (
    <Routes>

      {/* Layout wraps all pages — navbar is always visible */}
      <Route path="/" element={<Layout />}>

        {/* public pages — anyone can visit */}
        <Route index            element={<Home />}       />   {/* "/" */}
        <Route path="about"     element={<About />}      />   {/* "/about" */}
        <Route path="users/:id" element={<UserDetail />} />   {/* "/users/5" */}
        <Route path="login"     element={<Login onLogin={() => setIsAuthenticated(true)} />} />

        {/* private pages — only accessible when logged in */}
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route path="dashboard" element={<Dashboard />} />
        </Route>

        {/* catch-all — show 404 for unknown URLs */}
        <Route path="*" element={<NotFound />} />

      </Route>

    </Routes>
  )
}

export default App
```

---

## 15. Interview Questions

**Q1. What is React Router and why do we need it?**
> React apps are a single HTML file. React Router lets you map different URLs to different components so the app feels like it has multiple pages — without ever reloading the page. It gives you bookmarkable URLs, browser back/forward support, and instant page transitions.

**Q2. What is the difference between BrowserRouter and HashRouter?**
> `BrowserRouter` uses real URLs like `/about`. `HashRouter` uses hash-based URLs like `/#/about`. Always use `BrowserRouter` for modern apps. `HashRouter` is only a fallback for very old static hosting that can't handle URL routing.

**Q3. What is the difference between `<Routes>` and `<Route>`?**
> `<Routes>` is the container — it looks at the current URL and picks the best matching route. `<Route>` is a single rule inside it — it says "if the URL is this path, show this component".

**Q4. Why should we use `<Link>` instead of `<a href>`?**
> A regular `<a href>` causes a full page reload — the browser fetches everything from the server again. `<Link>` navigates to the new page instantly by just swapping the component, keeping the SPA fast.

**Q5. What is the difference between `Link` and `NavLink`?**
> Both navigate without reloading. `NavLink` also knows when it is the currently active page and gives you an `isActive` value so you can apply active styling — perfect for navbars.

**Q6. How do you create a dynamic route like `/users/5`?**
> Use a colon in the path: `<Route path="/users/:id" element={<UserDetail />} />`. Then inside `UserDetail`, call `const { id } = useParams()` to read the value from the URL.

**Q7. When do you use `useNavigate` instead of `<Link>`?**
> Use `useNavigate` when you need to navigate from inside a function — like after a form submission or a successful API call. `<Link>` is only for clickable elements in the UI.

**Q8. What is `<Outlet />` and why is it needed?**
> `<Outlet />` is a placeholder inside a parent layout component. When you have nested routes, the parent (Layout) always renders, and `<Outlet />` is where the child page content appears. Without it, child routes would have nowhere to render.

**Q9. What is an index route?**
> `<Route index element={<Home />} />` is the default child route. It renders when the URL matches the parent's path exactly — for example `/` — with no extra segment after it.

**Q10. How do you protect a route so only logged-in users can visit it?**
> Create a `ProtectedRoute` component that checks if the user is authenticated. If not, return `<Navigate to="/login" replace />`. If yes, return `<Outlet />`. Then wrap your private routes inside this component in `App.jsx`.

**Q11. What is the difference between `navigate('/path')` and `navigate('/path', { replace: true })`?**
> Without `replace`, the new URL is pushed to the browser's history — the user can press Back to return. With `replace: true`, the current history entry is replaced — the user cannot go back. Use `replace` after login so users can't go back to the login page.

**Q12. What is `useSearchParams` used for?**
> It reads and updates URL query parameters like `?category=shoes`. It works like `useState` but syncs with the URL — so filters and search terms are reflected in the URL and can be bookmarked or shared.

**Q13. What does `path="*"` mean?**
> It is a wildcard that matches any URL that did not match any other route. Use it as the last route to show a 404 Not Found page.

**Q14. What changed from React Router v5 to v6?**
> `<Switch>` became `<Routes>`, `component={Home}` became `element={<Home />}`, the `exact` prop is no longer needed, `<Redirect>` became `<Navigate>`, and `useHistory` became `useNavigate`. Nested routes are now defined all in one place in `App.jsx` instead of being scattered across child components.

---

> ⏭️ Next Topic: **Axios & API Integration** — covered in `component_09`.
