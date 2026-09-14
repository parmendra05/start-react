# React - React Router v6

---

## 1. What is React Router?

React Router enables **client-side navigation** in React SPAs — clicking a link swaps the component on screen without a full page reload from the server.

```bash
npm install react-router-dom
```

---

## 2. All Hooks & Components — Quick Reference

| Name | Type | What it does |
|---|---|---|
| `BrowserRouter` | Component | Wraps the whole app, enables routing |
| `Routes` | Component | Container — holds all `Route` definitions |
| `Route` | Component | Maps a URL path to a component |
| `Link` | Component | Navigate without page reload |
| `NavLink` | Component | Like `Link` + adds active styling |
| `Navigate` | Component | Declarative redirect (in JSX) |
| `Outlet` | Component | Placeholder where child routes render |
| `useNavigate` | Hook | Programmatic navigation from code |
| `useParams` | Hook | Read dynamic URL segments (`:id`) |
| `useLocation` | Hook | Read current URL, pathname, state |
| `useSearchParams` | Hook | Read / write URL query parameters |

---

## 3. Step-by-Step Setup

### Step 1 — Wrap app in BrowserRouter (`main.jsx`)

```jsx
import { StrictMode }    from 'react';
import { createRoot }    from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App               from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
```

### Step 2 — Define routes (`App.jsx`)

```jsx
import { Routes, Route } from 'react-router-dom';
import Home     from './pages/Home';
import About    from './pages/About';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/"      element={<Home />}     />
      <Route path="/about" element={<About />}    />
      <Route path="*"      element={<NotFound />} />  {/* 404 */}
    </Routes>
  );
}

export default App;
```

### Step 3 — Add navigation (`Navbar.jsx`)

```jsx
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
    </nav>
  );
}

export default Navbar;
```

That's the minimum working setup. ✅

---

## 4. Link vs NavLink

```jsx
import { Link, NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      {/* Link — basic navigation */}
      <Link to="/about">About</Link>

      {/* NavLink — highlights the active link automatically via className */}
      <NavLink
        to="/about"
        className={({ isActive }) => (isActive ? 'active' : '')}
      >
        About
      </NavLink>

      {/* NavLink — active styling via inline style */}
      <NavLink
        to="/about"
        style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}
      >
        About
      </NavLink>
    </nav>
  );
}

export default Navbar;
```

> Use `NavLink` for navbars. Use `Link` everywhere else.

---

## 5. URL Parameters — useParams

Dynamic path segments using `:paramName`.

```jsx
// App.jsx — define the route with a dynamic segment
<Route path="/users/:id" element={<UserDetail />} />
```

```jsx
// pages/UserDetail.jsx — read the param inside the component
import { useParams } from 'react-router-dom';

function UserDetail() {
  const { id } = useParams();  // reads ":id" from the URL
  return <h2>User ID: {id}</h2>;
}

export default UserDetail;
```

Multiple params:
```jsx
// Route
<Route path="/posts/:category/:postId" element={<Post />} />

// Component
const { category, postId } = useParams();
```

---

## 6. useNavigate — Navigate from Code

Use this when navigation happens after logic, not a direct click.

```jsx
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    // ... login logic
    navigate('/dashboard');                     // push to history
    navigate('/dashboard', { replace: true });  // replace — no back button
    navigate(-1);                               // go back one step
    navigate(1);                                // go forward one step
  }

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Login</button>
    </form>
  );
}

export default LoginForm;
```

> `replace: true` — use after login/logout so the user can't navigate back to the login page.

---

## 7. Nested Routes + Outlet (Shared Layout)

This is how you build a persistent navbar/sidebar with different page content.

### Step 1 — Define nested routes in App.jsx

```jsx
import { Routes, Route } from 'react-router-dom';
import Layout    from './Layout';
import Home      from './pages/Home';
import About     from './pages/About';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Routes>
      {/* parent — Layout always renders */}
      <Route path="/" element={<Layout />}>
        <Route index            element={<Home />}      />  {/* → "/" */}
        <Route path="about"     element={<About />}     />  {/* → "/about" */}
        <Route path="dashboard" element={<Dashboard />} />  {/* → "/dashboard" */}
      </Route>
    </Routes>
  );
}

export default App;
```

### Step 2 — Add `<Outlet />` in the Layout

```jsx
import { Outlet, NavLink } from 'react-router-dom';

function Layout() {
  return (
    <>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/dashboard">Dashboard</NavLink>
      </nav>

      <main>
        <Outlet />  {/* matched child route renders here */}
      </main>
    </>
  );
}

export default Layout;
```

### URL mapping:
```
/            →  Layout + Home
/about       →  Layout + About
/dashboard   →  Layout + Dashboard
```

> `<Route index>` is the default child — renders at the parent path `/` with no extra segment.

---

## 8. Protected Routes (Auth Guard)

Redirect unauthenticated users before they see a private page.

### Step 1 — Create ProtectedRoute component

```jsx
// components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute({ isAuthenticated }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;  // redirect to login
  }
  return <Outlet />;  // allow access — render child route
}

export default ProtectedRoute;
```

### Step 2 — Wrap private routes in App.jsx

```jsx
import { useState }      from 'react';
import { Routes, Route } from 'react-router-dom';
import Login             from './pages/Login';
import Dashboard         from './pages/Dashboard';
import Profile           from './pages/Profile';
import ProtectedRoute    from './components/ProtectedRoute';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />

      {/* All routes below are protected */}
      <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile"   element={<Profile />}   />
      </Route>
    </Routes>
  );
}

export default App;
```

---

## 9. useLocation — Read Current URL

```jsx
import { useLocation } from 'react-router-dom';

function MyComponent() {
  const location = useLocation();

  console.log(location.pathname);  // "/about"
  console.log(location.search);   // "?tab=info"
  console.log(location.state);    // data passed via navigate()

  return <p>Current path: {location.pathname}</p>;
}

export default MyComponent;
```

### Pass state between routes:

```jsx
// Send — in a component that uses useNavigate
import { useNavigate } from 'react-router-dom';

function GoToProfile() {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate('/profile', { state: { from: 'dashboard' } })}>
      Go to Profile
    </button>
  );
}
```

```jsx
// Receive — in the destination component
import { useLocation } from 'react-router-dom';

function Profile() {
  const location = useLocation();
  console.log(location.state?.from);  // "dashboard"
  return <p>Profile Page</p>;
}
```

> State is lost on page refresh — use only for temporary navigation context.

---

## 10. useSearchParams — URL Query Strings

Works like `useState` but syncs with the URL.

```jsx
import { useSearchParams } from 'react-router-dom';

function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get('category') || 'all';

  return (
    <div>
      <button onClick={() => setSearchParams({ category: 'shoes' })}>Shoes</button>
      <button onClick={() => setSearchParams({ category: 'bags'  })}>Bags</button>
      <p>Showing: {category}</p>
      {/* URL becomes: /products?category=shoes */}
    </div>
  );
}

export default ProductList;
```

---

## 11. Navigate Component — Redirect in JSX

Use `<Navigate>` when you need to redirect based on a condition inside JSX (not from a function).

```jsx
import { Navigate } from 'react-router-dom';

function Home({ isLoggedIn }) {
  if (isLoggedIn) return <Navigate to="/dashboard" replace />;
  return <h1>Please log in</h1>;
}

export default Home;
```

---

## 12. Complete File Structure

```
src/
  main.jsx              ← BrowserRouter lives here
  App.jsx               ← all Routes defined here
  Layout.jsx            ← shared navbar + <Outlet />
  pages/
    Home.jsx
    About.jsx
    Dashboard.jsx
    Profile.jsx
    Login.jsx
    NotFound.jsx
  components/
    ProtectedRoute.jsx
```

---

## 13. v5 vs v6 — Key Differences

| v5 | v6 |
|---|---|
| `<Switch>` | `<Routes>` |
| `<Route component={X}>` | `<Route element={<X />}>` |
| `exact` prop required | Exact by default ✅ |
| `<Redirect>` | `<Navigate>` |
| `useHistory()` | `useNavigate()` |
| Nested routes in child components | Nested routes centralized in App ✅ |

---

## 14. Everything in One Place — Full App.jsx

```jsx
import { useState }      from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout            from './Layout';
import Home              from './pages/Home';
import About             from './pages/About';
import Dashboard         from './pages/Dashboard';
import Login             from './pages/Login';
import UserDetail        from './pages/UserDetail';
import NotFound          from './pages/NotFound';
import ProtectedRoute    from './components/ProtectedRoute';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index            element={<Home />}       />
        <Route path="about"     element={<About />}      />
        <Route path="users/:id" element={<UserDetail />} />
        <Route path="login"     element={<Login onLogin={() => setIsAuthenticated(true)} />} />

        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route path="dashboard" element={<Dashboard />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
```

---

## 15. Interview Questions

**Q1. What is React Router? Why is it needed?**
> React renders a single HTML file. React Router maps URLs to components so the app behaves like a multi-page site — with bookmarkable URLs, browser back/forward, and instant navigation — all without server requests.

**Q2. What is the difference between BrowserRouter and HashRouter?**
> `BrowserRouter` uses the HTML5 History API — URLs look like `/about`. `HashRouter` uses the hash — URLs look like `/#/about`. Use `BrowserRouter` for modern apps. `HashRouter` is a fallback for static hosts that can't handle deep links.

**Q3. What replaced `<Switch>` in v6?**
> `<Routes>`. It also picks the best match automatically — no more `exact` prop needed.

**Q4. What is the difference between Link and NavLink?**
> Both navigate without a page reload. `NavLink` also provides an `isActive` boolean so you can style the currently active link — useful in navbars.

**Q5. How do you read a URL param like `/users/:id`?**
> Define the route as `<Route path="/users/:id" element={<UserDetail />} />` then call `const { id } = useParams()` inside the component.

**Q6. When do you use useNavigate instead of Link?**
> When navigation is triggered by logic — after a form submit, API call, or timer — not by a direct user click. `Link` is for visible clickable elements.

**Q7. What is `<Outlet />`?**
> A placeholder inside a layout component where the matched child route renders. It's how nested routing works — the parent keeps the shared UI (navbar) while `<Outlet />` swaps the page content.

**Q8. What is an index route?**
> `<Route index element={<Home />} />` — renders at the parent's exact path (e.g. `/`) with no extra segment. It's the default child when no other child matches.

**Q9. How do you build a protected route?**
> Create a component that returns `<Navigate to="/login" replace />` if not authenticated, or `<Outlet />` if authenticated. Wrap private routes inside it with no `path` prop — it acts as a guard layer.

**Q10. What is the difference between `navigate('/path')` and `navigate('/path', { replace: true })`?**
> Without `replace`, the route is pushed to history — user can go back. With `replace: true`, the current entry is replaced — user can't go back. Use `replace` after login or logout.

**Q11. How do you read and update URL query params?**
> Use `useSearchParams()` → `[searchParams, setSearchParams]`. Read with `searchParams.get('key')`, update with `setSearchParams({ key: value })`. The URL updates without a reload.

**Q12. How do you pass data between routes?**
> `navigate('/path', { state: { key: value } })` then read with `useLocation().state` on the destination. Lost on refresh — for temporary context only.

**Q13. What does `path="*"` do?**
> Matches any URL that didn't match any other route. Used for 404 Not Found pages.

**Q14. What are the main differences between v5 and v6?**
> `<Switch>` → `<Routes>`, `component={}` → `element={}`, `exact` no longer needed, `<Redirect>` → `<Navigate>`, `useHistory` → `useNavigate`, and nested routes are now defined centrally in one file instead of scattered across child components.

---

> ⏭️ Next Topic: **Axios & API Integration** — covered in `component_09`.
