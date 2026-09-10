# React - React Router v6

---

## 1. What is React Router?

React Router is the standard **client-side routing** library for React. It lets you build **Single Page Applications (SPAs)** where navigation between pages happens in the browser — without a full page reload from the server.

```
Traditional Multi-Page App:
  Click link → browser requests new page from server → full reload ❌ (slow)

React SPA with React Router:
  Click link → React renders a different component → no reload ✅ (instant)
```

### Install React Router v6:

```bash
npm install react-router-dom
```

---

## 2. Core Concepts

| Concept | Role |
|---|---|
| `BrowserRouter` | Wraps the app — enables routing using the browser's URL |
| `Routes` | Container that holds all `Route` definitions |
| `Route` | Maps a URL path to a component |
| `Link` | Renders an `<a>` tag that navigates without reload |
| `NavLink` | Like `Link` but adds an active class when the route matches |
| `useNavigate` | Hook to programmatically navigate |
| `useParams` | Hook to read URL parameters (`:id`) |
| `useLocation` | Hook to read the current URL location object |
| `Outlet` | Renders nested child routes inside a parent layout |

---

## 3. Basic Setup

Wrap your entire app in `<BrowserRouter>` — usually in `main.jsx`.

```jsx
// main.jsx
import { StrictMode } from 'react';
import { createRoot }  from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
```

---

## 4. Defining Routes

Use `<Routes>` and `<Route>` inside your `App.jsx` to map paths to components.

```jsx
// App.jsx
import { Routes, Route } from 'react-router-dom';
import Home    from './pages/Home';
import About   from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/"        element={<Home />}     />
      <Route path="/about"   element={<About />}    />
      <Route path="/contact" element={<Contact />}  />
      <Route path="*"        element={<NotFound />} />
    </Routes>
  );
}

export default App;
```

- `path="/"` — matches the root URL
- `path="*"` — wildcard, catches all unmatched paths (404 page)
- `element` — the JSX component to render for that path

---

## 5. Link and NavLink

Use `<Link>` instead of `<a href>` to navigate without a page reload.

```jsx
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/contact">Contact</Link>
    </nav>
  );
}
```

### NavLink — adds active styling automatically:

```jsx
import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <NavLink
        to="/"
        style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}
      >
        Home
      </NavLink>

      <NavLink
        to="/about"
        className={({ isActive }) => isActive ? 'active-link' : ''}
      >
        About
      </NavLink>
    </nav>
  );
}
```

- `isActive` is `true` when the current URL matches the `to` path.
- Both `style` and `className` accept a function that receives `{ isActive }`.

---

## 6. URL Parameters — useParams

Define dynamic segments in the path with `:paramName`, then read them with `useParams`.

```jsx
// Route definition
<Route path="/users/:id" element={<UserDetail />} />
```

```jsx
// UserDetail.jsx
import { useParams } from 'react-router-dom';

function UserDetail() {
  const { id } = useParams();  // reads ":id" from the URL

  return <p>Showing details for user ID: {id}</p>;
}
```

### Multiple params:

```jsx
<Route path="/posts/:category/:postId" element={<Post />} />

// In the component:
const { category, postId } = useParams();
```

---

## 7. useNavigate — Programmatic Navigation

Use `useNavigate` to navigate from JavaScript code (e.g. after form submission, after login).

```jsx
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    // ... login logic
    navigate('/dashboard');       // go to /dashboard
  }

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Login</button>
    </form>
  );
}
```

### Navigate options:

```jsx
navigate('/dashboard');            // push — adds to history
navigate('/dashboard', { replace: true });  // replace — no back button entry
navigate(-1);                      // go back one step (like browser back)
navigate(1);                       // go forward one step
navigate(-2);                      // go back two steps
```

---

## 8. useLocation — Reading the Current URL

`useLocation` returns the current location object with `pathname`, `search`, and `state`.

```jsx
import { useLocation } from 'react-router-dom';

function CurrentPage() {
  const location = useLocation();

  return (
    <div>
      <p>Path: {location.pathname}</p>
      <p>Query: {location.search}</p>
    </div>
  );
}
```

### Reading query strings:

```
URL: /search?query=react&page=2
```

```jsx
import { useLocation } from 'react-router-dom';

function SearchResults() {
  const location  = useLocation();
  const params    = new URLSearchParams(location.search);
  const query     = params.get('query');  // "react"
  const page      = params.get('page');   // "2"

  return <p>Searching for: {query} — Page {page}</p>;
}
```

### Pass state between routes:

```jsx
// Navigate with state
navigate('/profile', { state: { from: 'dashboard' } });

// Read state on arrival
const location = useLocation();
console.log(location.state.from);  // "dashboard"
```

---

## 9. Nested Routes & Outlet

Nested routes let a parent component define a **shared layout** (navbar, sidebar) while child routes render inside it via `<Outlet />`.

```jsx
// App.jsx
import { Routes, Route } from 'react-router-dom';
import Layout    from './layouts/Layout';
import Home      from './pages/Home';
import About     from './pages/About';
import Dashboard from './pages/Dashboard';
import Settings  from './pages/Settings';

function App() {
  return (
    <Routes>
      {/* Parent route — renders Layout */}
      <Route path="/" element={<Layout />}>
        {/* Index route — renders at "/" */}
        <Route index element={<Home />} />
        <Route path="about"     element={<About />}     />

        {/* Nested under /dashboard */}
        <Route path="dashboard" element={<Dashboard />}>
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>
    </Routes>
  );
}
```

```jsx
// layouts/Layout.jsx
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

function Layout() {
  return (
    <div>
      <Navbar />           {/* always visible */}
      <main>
        <Outlet />         {/* child route renders here */}
      </main>
    </div>
  );
}

export default Layout;
```

### URL mapping:
```
/            → Layout + Home
/about       → Layout + About
/dashboard   → Layout + Dashboard
/dashboard/settings → Layout + Dashboard + Settings
```

### Index route:

```jsx
<Route index element={<Home />} />
```

An **index route** renders at the parent's path (no extra segment). It's the default child when no other child matches.

---

## 10. Protected Routes (Auth Guard)

Redirect unauthenticated users away from private routes.

```jsx
// components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute({ isAuthenticated }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;  // renders the child route if authenticated
}

export default ProtectedRoute;
```

```jsx
// App.jsx
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Login     from './pages/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />

      {/* All routes inside here are protected */}
      <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile"   element={<Profile />}   />
      </Route>
    </Routes>
  );
}
```

- `<Navigate to="/login" replace />` — redirects and replaces the history entry so the user can't click back to the protected page.
- `<Outlet />` — renders the matched child route when access is granted.

---

## 11. Navigate Component — Declarative Redirect

`<Navigate>` is the declarative version of `useNavigate` — use it in JSX when you want to redirect based on a condition.

```jsx
import { Navigate } from 'react-router-dom';

function Home({ isLoggedIn }) {
  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }
  return <h1>Welcome! Please log in.</h1>;
}
```

---

## 12. useSearchParams — Query String Management

`useSearchParams` works like `useState` but for URL query parameters.

```jsx
import { useSearchParams } from 'react-router-dom';

function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get('category') || 'all';
  const page     = Number(searchParams.get('page')) || 1;

  function handleCategoryChange(newCategory) {
    setSearchParams({ category: newCategory, page: 1 });
    // URL becomes: /products?category=shoes&page=1
  }

  return (
    <div>
      <button onClick={() => handleCategoryChange('shoes')}>Shoes</button>
      <button onClick={() => handleCategoryChange('bags')}>Bags</button>
      <p>Category: {category} | Page: {page}</p>
    </div>
  );
}
```

---

## 13. Full App Example — Putting It All Together

```
src/
  main.jsx
  App.jsx
  layouts/
    Layout.jsx
  pages/
    Home.jsx
    About.jsx
    UserList.jsx
    UserDetail.jsx
    Login.jsx
    Dashboard.jsx
    NotFound.jsx
  components/
    ProtectedRoute.jsx
```

```jsx
// App.jsx
import { Routes, Route } from 'react-router-dom';
import Layout         from './layouts/Layout';
import Home           from './pages/Home';
import About          from './pages/About';
import UserList       from './pages/UserList';
import UserDetail     from './pages/UserDetail';
import Login          from './pages/Login';
import Dashboard      from './pages/Dashboard';
import NotFound       from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import { useState }   from 'react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index            element={<Home />}           />
        <Route path="about"     element={<About />}          />
        <Route path="users"     element={<UserList />}       />
        <Route path="users/:id" element={<UserDetail />}     />
        <Route path="login"     element={<Login onLogin={() => setIsAuthenticated(true)} />} />

        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route path="dashboard" element={<Dashboard />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
```

```jsx
// layouts/Layout.jsx
import { Outlet }  from 'react-router-dom';
import { NavLink } from 'react-router-dom';

function Layout() {
  return (
    <>
      <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', background: '#eee' }}>
        <NavLink to="/"          end>Home</NavLink>
        <NavLink to="/about"        >About</NavLink>
        <NavLink to="/users"        >Users</NavLink>
        <NavLink to="/dashboard"    >Dashboard</NavLink>
      </nav>
      <main style={{ padding: '1rem' }}>
        <Outlet />
      </main>
    </>
  );
}

export default Layout;
```

```jsx
// pages/UserDetail.jsx
import { useParams, useNavigate } from 'react-router-dom';

function UserDetail() {
  const { id }    = useParams();
  const navigate  = useNavigate();

  return (
    <div>
      <h2>User #{id}</h2>
      <button onClick={() => navigate(-1)}>← Back</button>
    </div>
  );
}

export default UserDetail;
```

---

## 14. v5 vs v6 — Key Differences

| Feature | v5 | v6 |
|---|---|---|
| Route rendering | `<Route component={X}>` or `render` prop | `<Route element={<X />}>` |
| Wrapping routes | `<Switch>` | `<Routes>` |
| Exact matching | `exact` prop required | Exact by default |
| Nested routes | Defined inside child components | Defined in one place in `App` |
| Redirect | `<Redirect>` | `<Navigate>` |
| `useHistory` | `useHistory()` | `useNavigate()` |
| Relative paths | Manual | Automatic in nested routes |

---

## 15. React Router v6 — Summary

| Hook / Component | What it does |
|---|---|
| `<BrowserRouter>` | Enables routing, wraps the app |
| `<Routes>` | Container for all `Route` definitions |
| `<Route path element>` | Maps a path to a component |
| `<Link to>` | Navigation without page reload |
| `<NavLink to>` | Link with active state styling |
| `<Outlet />` | Renders matched child route in a layout |
| `<Navigate to>` | Declarative redirect |
| `useNavigate()` | Programmatic navigation |
| `useParams()` | Read URL dynamic params (`:id`) |
| `useLocation()` | Read current URL, pathname, state |
| `useSearchParams()` | Read/write URL query parameters |

---

## 16. Interview Questions

**Q1. What is React Router and why is it needed in a React app?**
> React Router is a client-side routing library that maps URLs to components without reloading the page. It's needed because React renders a single HTML file — React Router simulates multi-page navigation inside the browser, enabling bookmarkable URLs, browser back/forward, and deep linking.

**Q2. What is the difference between BrowserRouter and HashRouter?**
> `BrowserRouter` uses the HTML5 History API — URLs look like `/about`. `HashRouter` uses the URL hash — URLs look like `/#/about`. `BrowserRouter` is standard for modern apps. `HashRouter` is a fallback for environments where the server can't handle deep links (static file hosts without config).

**Q3. How do you define routes in React Router v6?**
> Wrap all routes in `<Routes>`, then add `<Route path="..." element={<Component />} />` for each path. The `element` prop takes a JSX element. `<Routes>` is required — it replaces v5's `<Switch>` and selects the best matching route.

**Q4. What is the difference between Link and NavLink?**
> Both render an anchor tag that navigates without a reload. `NavLink` additionally provides an `isActive` boolean in its `className` and `style` props, letting you add active styling to the currently matched navigation link.

**Q5. How do you read a URL parameter like /users/:id?**
> Define the route with a colon: `<Route path="/users/:id" element={<UserDetail />} />`. Inside `UserDetail`, call `const { id } = useParams()` to read the value.

**Q6. What is useNavigate and when would you use it over Link?**
> `useNavigate` returns a function for programmatic navigation — use it when you need to navigate as a result of logic, not a click (e.g., after form submission, after a successful API call, after a timer). `Link` is for UI navigation elements that users click directly.

**Q7. What is the Outlet component?**
> `<Outlet />` is a placeholder in a parent layout component where the matched child route renders. It enables nested routing — the parent defines shared UI (navbar, sidebar) and `<Outlet />` is where the child page content appears.

**Q8. What is an index route?**
> An index route renders at the parent's exact path with no extra URL segment. It's defined with `<Route index element={<Home />} />` and acts as the default child route when no other child matches.

**Q9. How do you implement a protected route in React Router v6?**
> Create a component that checks authentication and returns `<Navigate to="/login" replace />` if not authenticated, or `<Outlet />` if authenticated. Wrap protected routes inside this component in your `<Routes>` definition — no child route renders unless auth passes.

**Q10. What is the difference between navigate('/path') and navigate('/path', { replace: true })?**
> Without `replace`, the new route is pushed onto the browser history stack — the user can navigate back. With `replace: true`, the current entry is replaced — the user cannot go back to the previous page. Use `replace` for redirects after login or form submissions where going back would be confusing.

**Q11. How do you read query parameters in React Router v6?**
> Use `useSearchParams()` which returns `[searchParams, setSearchParams]`. Read values with `searchParams.get('key')` and update them with `setSearchParams({ key: value })` — this updates the URL without a reload.

**Q12. What are the major differences between React Router v5 and v6?**
> v6 replaces `<Switch>` with `<Routes>`, uses `element={<Component />}` instead of `component={Component}`, matches routes exactly by default (no `exact` prop needed), uses `<Navigate>` instead of `<Redirect>`, and replaces `useHistory` with `useNavigate`. Nested routes are also now defined centrally in one place rather than inside child components.

**Q13. How do you pass data between routes?**
> Use `navigate('/path', { state: { key: value } })` to attach state to navigation. Read it with `useLocation().state` on the destination route. This data lives in browser history and is lost on refresh — use it for temporary navigation context, not persistent data.

**Q14. What does the path="*" route do?**
> It's a wildcard that matches any URL not matched by any other route. Typically used to render a 404 Not Found page.

---

> ⏭️ Next Topic: **Axios & API Integration** — covered in `component_09`.
