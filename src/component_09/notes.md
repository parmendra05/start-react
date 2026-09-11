# React - Axios & API Integration

---

## 1. What is Axios?

Axios is a **promise-based HTTP client** for JavaScript. It works in both the browser and Node.js and is the most popular way to make API calls in React apps.

```bash
npm install axios
```

### Axios vs Fetch — Why use Axios?

| Feature | Fetch | Axios |
|---|---|---|
| Built into browser | ✅ Yes | ❌ No (install needed) |
| Automatic JSON parsing | ❌ Manual `.json()` | ✅ Automatic |
| Request/Response interceptors | ❌ No | ✅ Yes |
| Automatic error on 4xx/5xx | ❌ No (must check `res.ok`) | ✅ Yes |
| Request cancellation | Verbose (AbortController) | Cleaner (CancelToken / AbortController) |
| Request timeout | Manual | Built-in `timeout` option |
| Base URL config | Manual | Built-in `baseURL` |
| Upload progress | Manual | Built-in |

---

## 2. Basic Axios Requests

```jsx
import axios from 'axios';

// GET
const response = await axios.get('https://api.example.com/users');
console.log(response.data);  // parsed JSON automatically

// POST
const response = await axios.post('https://api.example.com/users', {
  name: 'Ali',
  email: 'ali@example.com',
});

// PUT
const response = await axios.put('https://api.example.com/users/1', {
  name: 'Ali Updated',
});

// PATCH
const response = await axios.patch('https://api.example.com/users/1', {
  name: 'Ali Patched',
});

// DELETE
const response = await axios.delete('https://api.example.com/users/1');
```

### The response object:

```jsx
response.data       // the actual response body (auto-parsed JSON)
response.status     // HTTP status code (200, 201, 404, etc.)
response.statusText // "OK", "Not Found", etc.
response.headers    // response headers
response.config     // the original request config
```

---

## 3. Axios in a React Component

### GET request with useEffect:

```jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

function UserList() {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error)   return <p>Error: {error}</p>;

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name} — {user.email}</li>
      ))}
    </ul>
  );
}
```

### Using async/await (cleaner):

```jsx
useEffect(() => {
  async function fetchUsers() {
    try {
      setLoading(true);
      const res = await axios.get('https://jsonplaceholder.typicode.com/users');
      setUsers(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  fetchUsers();
}, []);
```

> You cannot make the `useEffect` callback itself `async`. Define an async function inside and call it immediately.

---

## 4. Axios Instance — Centralized Config

Instead of repeating the base URL and headers on every request, create a reusable **Axios instance**.

```jsx
// api/axiosInstance.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 10000,  // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
```

```jsx
// Usage — no need to repeat the base URL
import api from './api/axiosInstance';

const res = await api.get('/users');         // GET /users
const res = await api.get('/users/1');       // GET /users/1
const res = await api.post('/posts', data);  // POST /posts
```

---

## 5. Axios Interceptors

Interceptors run before every request is sent or after every response is received. Common uses: attach auth tokens, handle global errors, log requests.

### Request interceptor — attach auth token:

```jsx
// api/axiosInstance.js
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;  // must return config
  },
  (error) => Promise.reject(error)
);
```

### Response interceptor — handle 401 globally:

```jsx
api.interceptors.response.use(
  (response) => response,  // pass through successful responses
  (error) => {
    if (error.response?.status === 401) {
      // token expired — redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);  // still reject so components can catch it
  }
);
```

---

## 6. Error Handling

Axios throws an error for any response with status 4xx or 5xx. The error object has a useful structure.

```jsx
try {
  const res = await api.get('/users/999');
} catch (error) {
  if (error.response) {
    // Server responded with an error status
    console.log(error.response.status);   // 404
    console.log(error.response.data);     // { message: 'Not found' }
  } else if (error.request) {
    // Request was made but no response received (network error)
    console.log('Network error — no response received');
  } else {
    // Something else went wrong (config error, etc.)
    console.log('Error:', error.message);
  }
}
```

### Error structure:

```
error.response   → server responded (4xx, 5xx) — check .status and .data
error.request    → request sent but no response (offline, timeout, CORS)
error.message    → generic message string
error.config     → original request configuration
```

---

## 7. POST, PUT, PATCH, DELETE with React

### POST — Create a resource:

```jsx
import { useState } from 'react';
import api from './api/axiosInstance';

function CreatePost() {
  const [title,   setTitle]   = useState('');
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/posts', { title, userId: 1 });
      setResult(res.data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Post'}
      </button>
      {result && <p>Created: {result.title} (id: {result.id})</p>}
    </form>
  );
}
```

### DELETE — Remove a resource:

```jsx
async function handleDelete(id) {
  try {
    await api.delete(`/posts/${id}`);
    setPosts((prev) => prev.filter((post) => post.id !== id));
  } catch (err) {
    console.error('Delete failed:', err.message);
  }
}
```

---

## 8. Passing Query Parameters

```jsx
// Option 1 — inline in the URL
const res = await api.get('/posts?userId=1&_limit=5');

// Option 2 — params object (recommended — Axios encodes it for you)
const res = await api.get('/posts', {
  params: {
    userId: 1,
    _limit: 5,
  },
});
// Both produce: GET /posts?userId=1&_limit=5
```

---

## 9. Sending Headers

```jsx
// Per-request headers
const res = await api.get('/protected', {
  headers: {
    Authorization: `Bearer ${token}`,
    'X-Custom-Header': 'value',
  },
});

// Already set on the instance — no need to repeat:
api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

---

## 10. Cancelling Requests — AbortController

Cancel an in-flight request when the component unmounts or the user navigates away — prevents state updates on unmounted components.

```jsx
import { useState, useEffect } from 'react';
import api from './api/axiosInstance';

function UserDetail({ userId }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();  // create controller

    async function fetchUser() {
      try {
        const res = await api.get(`/users/${userId}`, {
          signal: controller.signal,  // attach to request
        });
        setUser(res.data);
      } catch (err) {
        if (axios.isCancel(err) || err.name === 'CanceledError') return; // ignore cancel
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();

    return () => controller.abort();  // cancel on unmount or userId change
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  return <p>{user?.name}</p>;
}
```

---

## 11. Custom useFetch Hook with Axios

Extract the fetch logic into a reusable hook.

```jsx
// hooks/useAxios.js
import { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import axios from 'axios';

function useAxios(url, params = {}) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(url, { params, signal: controller.signal });
        setData(res.data);
      } catch (err) {
        if (err.name === 'CanceledError') return;
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
}

export default useAxios;
```

```jsx
// Usage in any component
import useAxios from './hooks/useAxios';

function PostList() {
  const { data: posts, loading, error } = useAxios('/posts');

  if (loading) return <p>Loading...</p>;
  if (error)   return <p>Error: {error}</p>;

  return (
    <ul>
      {posts.map((post) => <li key={post.id}>{post.title}</li>)}
    </ul>
  );
}
```

---

## 12. Full CRUD Example

```jsx
// pages/Posts.jsx
import { useState, useEffect } from 'react';
import api from '../api/axiosInstance';

function Posts() {
  const [posts,    setPosts]    = useState([]);
  const [title,    setTitle]    = useState('');
  const [editId,   setEditId]   = useState(null);
  const [editText, setEditText] = useState('');
  const [loading,  setLoading]  = useState(true);

  // READ
  useEffect(() => {
    api.get('/posts', { params: { _limit: 5 } })
      .then((res) => { setPosts(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // CREATE
  async function handleCreate(e) {
    e.preventDefault();
    if (!title.trim()) return;
    const res = await api.post('/posts', { title, userId: 1 });
    setPosts((prev) => [res.data, ...prev]);
    setTitle('');
  }

  // UPDATE
  async function handleUpdate(id) {
    const res = await api.put(`/posts/${id}`, { title: editText, userId: 1 });
    setPosts((prev) => prev.map((p) => (p.id === id ? res.data : p)));
    setEditId(null);
  }

  // DELETE
  async function handleDelete(id) {
    await api.delete(`/posts/${id}`);
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {/* Create */}
      <form onSubmit={handleCreate}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New post title" />
        <button type="submit">Add</button>
      </form>

      {/* List */}
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            {editId === post.id ? (
              <>
                <input value={editText} onChange={(e) => setEditText(e.target.value)} />
                <button onClick={() => handleUpdate(post.id)}>Save</button>
                <button onClick={() => setEditId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span>{post.title}</span>
                <button onClick={() => { setEditId(post.id); setEditText(post.title); }}>Edit</button>
                <button onClick={() => handleDelete(post.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Posts;
```

---

## 13. Environment Variables for API URLs

Never hardcode API base URLs. Use environment variables instead.

```bash
# .env
VITE_API_BASE_URL=https://api.example.com
```

```jsx
// api/axiosInstance.js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});
```

- In Vite, all env variables must be prefixed with `VITE_` to be accessible in the browser.
- Access them via `import.meta.env.VITE_KEY`.
- Never commit `.env` files containing secrets — add them to `.gitignore`.

---

## 14. Axios & API Integration — Summary

| Concept | Detail |
|---|---|
| Install | `npm install axios` |
| Basic GET | `axios.get(url).then(res => res.data)` |
| Auto JSON | `res.data` is already parsed — no `.json()` needed |
| Axios instance | `axios.create({ baseURL, timeout, headers })` |
| Interceptors | Attach tokens, handle 401 globally |
| Error handling | `error.response` (server), `error.request` (network) |
| Query params | Pass as `{ params: { key: value } }` |
| Cancel request | `AbortController` + `signal` + `controller.abort()` in cleanup |
| Custom hook | `useAxios(url)` → `{ data, loading, error }` |
| Env variables | `VITE_API_BASE_URL` via `import.meta.env` |

---

## 15. Interview Questions

**Q1. What is Axios and why use it over the native fetch API?**
> Axios is a promise-based HTTP client. Key advantages over `fetch`: automatic JSON parsing (no `.res.json()` call), automatic errors thrown for 4xx/5xx responses (fetch resolves them as success), request/response interceptors for global token injection or error handling, built-in timeout support, and a cleaner API for query params and headers.

**Q2. How do you make a GET request with Axios in a React component?**
> Call `axios.get(url)` inside a `useEffect`. Since you can't make the effect callback async directly, define an async function inside and call it immediately. Use `try/catch` with `finally` to manage loading and error state.

**Q3. Why can't you make the useEffect callback itself async?**
> `useEffect` expects its callback to return either nothing or a cleanup function. An `async` function always returns a Promise — React doesn't know how to use a Promise as a cleanup function. The solution is to declare an async function inside the effect and invoke it immediately.

**Q4. What is an Axios instance and why create one?**
> An Axios instance is a pre-configured copy of Axios created with `axios.create({ baseURL, timeout, headers })`. It avoids repeating the base URL and common headers on every call. All requests made through the instance automatically inherit its configuration.

**Q5. What are Axios interceptors? Give a real use case.**
> Interceptors are functions that run before every request is sent (request interceptor) or after every response is received (response interceptor). A common use case: in the request interceptor, read the auth token from localStorage and attach it as an `Authorization` header automatically — so no component needs to do it manually.

**Q6. How does Axios handle HTTP errors differently from fetch?**
> With `fetch`, a 404 or 500 response is still a resolved Promise — you have to check `response.ok` manually. Axios automatically rejects the Promise for any response with status 4xx or 5xx, so your `catch` block handles server errors as well as network errors.

**Q7. What are the three cases in an Axios error object?**
> `error.response` — the server responded with an error status (4xx, 5xx); contains `.status` and `.data`. `error.request` — the request was sent but no response was received (network down, timeout, CORS). Neither property set — something went wrong before the request was sent (configuration error).

**Q8. How do you pass query parameters with Axios?**
> Pass them as a `params` object in the config: `axios.get('/posts', { params: { userId: 1, _limit: 5 } })`. Axios encodes and appends them to the URL automatically. This is cleaner than building the query string manually.

**Q9. How do you cancel an Axios request and why is it important?**
> Use `AbortController`: create one before the request, pass `signal: controller.signal` in the config, and call `controller.abort()` in the `useEffect` cleanup function. This prevents state updates on unmounted components — without it, if the component unmounts before the request finishes, calling `setState` would throw a React warning.

**Q10. How do you attach an auth token to every Axios request?**
> Two ways: (1) Set it on the instance's default headers: `api.defaults.headers.common['Authorization'] = 'Bearer token'`. (2) Use a request interceptor that reads the token from storage and attaches it before each request — better because it always reads the latest token.

**Q11. How do you handle environment-specific API base URLs in a Vite + React project?**
> Define the URL in a `.env` file as `VITE_API_BASE_URL=https://api.example.com`. In the Axios instance, read it with `import.meta.env.VITE_API_BASE_URL`. Vite only exposes variables prefixed with `VITE_` to the browser bundle. Never hardcode base URLs in source files.

**Q12. What is the pattern for a reusable data-fetching hook using Axios?**
> Create a `useAxios(url)` custom hook that maintains `data`, `loading`, and `error` state. Inside `useEffect`, create an `AbortController`, call `api.get(url, { signal })`, update state on success or error, and return the controller abort as cleanup. The hook returns `{ data, loading, error }` — any component can use it without repeating fetch logic.

**Q13. What is the difference between PUT and PATCH?**
> `PUT` replaces the entire resource with the new data sent. `PATCH` applies a partial update — only the fields sent are changed, the rest remain. Use `PATCH` when updating a single field; use `PUT` when replacing the whole object.

**Q14. How do you optimistically update the UI after a DELETE request?**
> Remove the item from state immediately before or after the request resolves — don't wait for a refetch. On success, the UI is already updated. If the request fails, restore the previous state in the `catch` block: `setPosts((prev) => prev.filter((p) => p.id !== id))` inside the success path, with a rollback in catch.

---

> ⏭️ Next Topic: **State Management (Zustand)** — covered in `component_10`.
