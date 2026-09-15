# React - Fetch API, Axios & API Integration

---

## 1. What is an API Call?

When your React app needs data — like a list of users, posts, or products — it has to **ask a server** for that data. This is called making an **API call** (or HTTP request).

```
React App  →  sends a request  →  Server (API)
React App  ←  receives data    ←  Server (API)
```

The data usually comes back as **JSON** — a simple text format that looks like a JavaScript object.

There are a few ways to make API calls in React:
1. **Fetch API** — built into the browser, no install needed
2. **Axios** — a popular library, easier to use than fetch
3. **Other options** — React Query, SWR (covered at the end)

---

## 2. What is the Fetch API?

`fetch` is built into every modern browser. You don't need to install anything. It is the most basic way to make HTTP requests in JavaScript.

### Simplest GET request:

```js
fetch('https://jsonplaceholder.typicode.com/posts')
  .then(res => res.json())       // step 1: convert response to JSON
  .then(data => console.log(data)) // step 2: use the data
```

> `fetch` does NOT automatically convert the response to JSON. You always have to call `.json()` on the response first. This is the most common beginner mistake.

---

## 3. Fetch API — Step by Step

Here is exactly what happens when you call `fetch`:

```
Step 1: fetch(url)         → sends the request to the server
Step 2: .then(res => ...)  → response arrives (but data is still not readable yet)
Step 3: res.json()         → converts the raw response body into a JavaScript object
Step 4: .then(data => ...) → now you can use the actual data
```

### Example — GET request with fetch:

```js
fetch('https://jsonplaceholder.typicode.com/users')
  .then(res => {
    console.log(res.status)  // 200 (HTTP status code)
    return res.json()        // must call .json() to get the actual data
  })
  .then(data => {
    console.log(data)        // array of users
  })
  .catch(err => {
    console.log('Error:', err.message)
  })
```

### Same example with async/await (easier to read):

```js
async function getUsers() {
  try {
    const res  = await fetch('https://jsonplaceholder.typicode.com/users')
    const data = await res.json()   // always await .json() separately
    console.log(data)
  } catch (err) {
    console.log('Error:', err.message)
  }
}
```

---

## 4. Fetch API — Important Gotcha (Error Handling)

This is something beginners often miss. `fetch` does **not** throw an error for HTTP errors like 404 or 500. It only throws if there is a **network failure** (no internet, server unreachable).

```js
// ❌ This will NOT go to catch even if server returns 404
fetch('https://jsonplaceholder.typicode.com/users/99999')
  .then(res => res.json())
  .then(data => console.log(data))  // still runs even on 404!
  .catch(err => console.log(err))   // only runs if there's no internet
```

### ✅ Correct way — always check `res.ok`:

```js
fetch('https://jsonplaceholder.typicode.com/users/99999')
  .then(res => {
    if (!res.ok) {
      throw new Error('Request failed with status: ' + res.status)
    }
    return res.json()
  })
  .then(data => console.log(data))
  .catch(err => console.log('Error:', err.message))
```

> `res.ok` is `true` when the status code is between 200–299. Always check it when using fetch.

---

## 5. Using Fetch with useEffect in React

In React, you make API calls inside `useEffect` — because you want the data to load **after** the component appears on screen.

### Basic pattern:

```jsx
import { useState, useEffect } from 'react'

function UserList() {
  const [users,   setUsers]   = useState([])   // store the data here
  const [loading, setLoading] = useState(true) // show spinner while loading
  const [error,   setError]   = useState(null) // store any error message

  useEffect(() => {

    // define async function inside useEffect
    async function fetchUsers() {
      try {
        const res = await fetch('https://jsonplaceholder.typicode.com/users')

        if (!res.ok) throw new Error('Failed to fetch users')

        const data = await res.json()
        setUsers(data)

      } catch (err) {
        setError(err.message)

      } finally {
        setLoading(false)  // always stop loading, whether success or error
      }
    }

    fetchUsers()  // call the function

  }, [])  // [] means run only once when the component first loads

  if (loading) return <p>Loading...</p>
  if (error)   return <p>Error: {error}</p>

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

> You cannot write `useEffect(async () => { ... })` — useEffect does not support async callbacks directly. Always define a separate async function inside and call it.

---

## 6. Fetch — POST, PUT, DELETE

By default, `fetch` does a GET request. For other methods, you pass a second argument with options.

### POST — Send data to the server:

```js
async function createPost() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',                           // specify the method
    headers: { 'Content-Type': 'application/json' }, // tell server you're sending JSON
    body: JSON.stringify({                    // convert JS object to JSON string
      username: 'john_doe',
      email: 'john@example.com',
      role: 'user'
    })
  })

  const data = await res.json()
  console.log(data)  // { id: 101, username: 'john_doe', email: 'john@example.com', ... }
}
```

### PUT — Update existing data:

```js
const res = await fetch('https://jsonplaceholder.typicode.com/posts/1', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'john_doe', email: 'john_new@example.com' })
})
```

### DELETE — Remove data:

```js
const res = await fetch('https://jsonplaceholder.typicode.com/posts/1', {
  method: 'DELETE'
})
// no need to call .json() on DELETE — usually returns empty body
```

---

## 7. Fetch — Full Example in a React Component

```jsx
import { useState, useEffect } from 'react'

function Posts() {
  const [posts,   setPosts]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  // READ — fetch posts when component loads
  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5')
        if (!res.ok) throw new Error('Could not load posts')
        const data = await res.json()
        setPosts(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  // DELETE — remove a post
  async function handleDelete(id) {
    await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
      method: 'DELETE'
    })
    // remove from local state so UI updates immediately
    setPosts(prev => prev.filter(post => post.id !== id))
  }

  if (loading) return <p>Loading posts...</p>
  if (error)   return <p>Error: {error}</p>

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>
          {user.username} — {user.email}
          <button onClick={() => handleDelete(user.id)}>Delete</button>
        </li>
      ))}
    </ul>
  )
}

export default Posts
```

---

## 8. What is Axios?

Axios is a **library** that makes HTTP requests easier than the built-in `fetch`. You need to install it first.

```bash
npm install axios
```

The main advantages of Axios over fetch:

| Feature | fetch (built-in) | axios (library) |
|---|---|---|
| Needs install | ❌ No | ✅ Yes |
| Auto JSON parsing | ❌ You call `.json()` manually | ✅ Done automatically |
| Error on 404/500 | ❌ You check `res.ok` manually | ✅ Throws automatically |
| Request timeout | ❌ Manual setup | ✅ Built-in option |
| Send headers easily | ❌ Verbose | ✅ Simple config |
| Base URL config | ❌ Manual | ✅ Built-in `baseURL` |
| Interceptors | ❌ Not available | ✅ Available |

---

## 9. Axios — Basic Syntax

```jsx
import axios from 'axios'

// GET — read data
const res = await axios.get('https://jsonplaceholder.typicode.com/posts')
console.log(res.data)  // the data is inside res.data (already parsed JSON)

// POST — send data
const res = await axios.post('https://jsonplaceholder.typicode.com/users', {
  username: 'john_doe',
  email: 'john@example.com',
  phone: '123-456-7890'
})
console.log(res.data)

// PUT — replace data
const res = await axios.put('https://jsonplaceholder.typicode.com/users/1', {
  username: 'john_updated',
  email: 'john_updated@example.com',
  phone: '999-999-9999'
})

// PATCH — update part of data (only the fields you send will change)
const res = await axios.patch('https://jsonplaceholder.typicode.com/users/1', {
  email: 'newemail@example.com'   // only email is updated, name/phone stay the same
})

// DELETE — remove data
await axios.delete('https://jsonplaceholder.typicode.com/posts/1')
```

> With Axios you never call `.json()`. The response data is already parsed and available at `res.data`.

---

## 10. Axios with useEffect — GET Request

```jsx
import { useState, useEffect } from 'react'
import axios from 'axios'

function UserList() {
  const [users,   setUsers]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await axios.get('https://jsonplaceholder.typicode.com/users')
        setUsers(res.data)  // res.data is already the array — no .json() needed
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  if (loading) return <p>Loading...</p>
  if (error)   return <p>Error: {error}</p>

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

---

## 11. Axios — POST Example (Submit a Form)

```jsx
import { useState } from 'react'
import axios from 'axios'

function CreateUser() {
  const [username, setUsername] = useState('')
  const [email,    setEmail]    = useState('')
  const [phone,    setPhone]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [result,   setResult]   = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    try {
      // send the form data to the server
      const res = await axios.post('https://jsonplaceholder.typicode.com/users', {
        username: username,
        email: email,
        phone: phone
      })
      setResult(res.data)  // server returns the created object with an id
    } catch (err) {
      console.error('Failed to create user:', err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
      <input value={email}    onChange={e => setEmail(e.target.value)}    placeholder="Email" />
      <input value={phone}    onChange={e => setPhone(e.target.value)}    placeholder="Phone" />
      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Create User'}
      </button>

      {result && <p>✅ Created user with ID: {result.id}</p>}
    </form>
  )
}

export default CreateUser
```

---

## 12. Axios Instance — Avoid Repeating the Base URL

When you call the same API many times, you don't want to type the full URL every time. Create an **Axios instance** once with the base URL, and reuse it everywhere.

```jsx
// src/api/axiosInstance.js
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com', // base URL for all requests
  timeout: 10000,  // cancel request if it takes more than 10 seconds
})

export default api
```

```jsx
// Now in any component — just use the short path
import api from './api/axiosInstance'

const res = await api.get('/users')      // → https://jsonplaceholder.typicode.com/users
const res = await api.get('/users/1')    // → https://jsonplaceholder.typicode.com/users/1
const res = await api.post('/posts', {}) // → https://jsonplaceholder.typicode.com/posts
```

> Think of the Axios instance like a "preset" for your requests — set it up once, use it everywhere.

---

## 13. Axios — Error Handling

Axios automatically throws an error for any 4xx or 5xx response. The error object has three useful properties:

```jsx
try {
  const res = await api.get('/users/99999')
} catch (err) {

  if (err.response) {
    // Server replied but with an error (404, 500, etc.)
    console.log(err.response.status)  // 404
    console.log(err.response.data)    // error message from server
  }
  else if (err.request) {
    // Request was sent but no reply came back (no internet, server down)
    console.log('No response from server')
  }
  else {
    // Something went wrong before the request was sent
    console.log('Error:', err.message)
  }
}
```

---

## 14. Axios — Full CRUD Example

```jsx
import { useState, useEffect } from 'react'
import api from './api/axiosInstance'

function Users() {
  const [users,       setUsers]       = useState([])
  const [username,    setUsername]    = useState('')
  const [editId,      setEditId]      = useState(null)
  const [editEmail,   setEditEmail]   = useState('')
  const [loading,     setLoading]     = useState(true)

  // READ
  useEffect(() => {
    async function load() {
      const res = await api.get('/users')
      setUsers(res.data)
      setLoading(false)
    }
    load()
  }, [])

  // CREATE
  async function handleCreate(e) {
    e.preventDefault()
    if (!username.trim()) return
    const res = await api.post('/users', { username, email: `${username}@example.com` })
    setUsers(prev => [res.data, ...prev])
    setUsername('')
  }

  // UPDATE
  async function handleUpdate(id) {
    const res = await api.put(`/users/${id}`, { email: editEmail })
    setUsers(prev => prev.map(u => u.id === id ? { ...u, email: editEmail } : u))
    setEditId(null)
  }

  // DELETE
  async function handleDelete(id) {
    await api.delete(`/users/${id}`)
    setUsers(prev => prev.filter(u => u.id !== id))
  }

  if (loading) return <p>Loading...</p>

  return (
    <div>
      {/* Create form */}
      <form onSubmit={handleCreate}>
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="New username" />
        <button type="submit">Add User</button>
      </form>

      {/* User list */}
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {editId === user.id ? (
              <>
                <input value={editEmail} onChange={e => setEditEmail(e.target.value)} placeholder="New email" />
                <button onClick={() => handleUpdate(user.id)}>Save</button>
                <button onClick={() => setEditId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span>{user.name} — {user.email}</span>
                <button onClick={() => { setEditId(user.id); setEditEmail(user.email) }}>Edit</button>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Users
```

---

## 15. Other Options to Fetch APIs

Fetch and Axios are great, but there are even more powerful tools built specifically for React. Here's an overview:

---

### Option 3 — React Query (TanStack Query)

React Query is the most popular data-fetching library for React. It handles loading, caching, refetching, and error states automatically — things you have to do manually with fetch/axios.

```bash
npm install @tanstack/react-query
```

```jsx
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

function UserList() {
  // useQuery handles loading, error, and data automatically
  const { data, isLoading, isError } = useQuery({
    queryKey: ['users'],  // unique key for caching
    queryFn: () => axios.get('https://jsonplaceholder.typicode.com/users').then(res => res.data)
  })

  if (isLoading) return <p>Loading...</p>
  if (isError)   return <p>Something went wrong</p>

  return (
    <ul>
      {data.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  )
}
```

**When to use:** Medium to large apps where you need caching, background refetching, and pagination without writing boilerplate.

---

### Option 4 — SWR (by Vercel)

SWR is a lightweight alternative to React Query. The name stands for **Stale While Revalidate** — it shows cached (old) data immediately, then fetches fresh data in the background.

```bash
npm install swr
```

```jsx
import useSWR from 'swr'

// fetcher is just a function that calls fetch and returns the data
const fetcher = url => fetch(url).then(res => res.json())

function UserList() {
  const { data, error, isLoading } = useSWR(
    'https://jsonplaceholder.typicode.com/users',
    fetcher
  )

  if (isLoading) return <p>Loading...</p>
  if (error)     return <p>Error loading users</p>

  return (
    <ul>
      {data.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  )
}
```

**When to use:** Small to medium apps where you want simple data fetching with caching but don't need the full power of React Query.

---

### Quick Comparison — All Options

| | fetch | axios | React Query | SWR |
|---|---|---|---|---|
| Install needed | ❌ No | ✅ Yes | ✅ Yes | ✅ Yes |
| Auto JSON parse | ❌ No | ✅ Yes | depends on fetcher | depends on fetcher |
| Caching | ❌ No | ❌ No | ✅ Yes | ✅ Yes |
| Auto refetch | ❌ No | ❌ No | ✅ Yes | ✅ Yes |
| Loading/error state | Manual | Manual | ✅ Automatic | ✅ Automatic |
| Best for | Learning basics | Most projects | Large apps | Simple caching |

---

## 16. fetch vs Axios — Side by Side

Same GET request written both ways so you can see the difference clearly:

```jsx
// ── Using fetch ──────────────────────────────────────
useEffect(() => {
  fetch('https://jsonplaceholder.typicode.com/posts/1')
    .then(res => {
      if (!res.ok) throw new Error('Failed')  // must check manually
      return res.json()                        // must call .json()
    })
    .then(data => setPost(data))
    .catch(err => setError(err.message))
}, [])


// ── Using axios ──────────────────────────────────────
useEffect(() => {
  axios.get('https://jsonplaceholder.typicode.com/posts/1')
    .then(res => setPost(res.data))  // res.data is already parsed
    .catch(err => setError(err.message))  // auto throws on 404/500
}, [])
```

Axios is shorter and handles errors more reliably — that's why most developers prefer it.

---

## 17. Summary

| Concept | Key point |
|---|---|
| `fetch` | Built-in, always need `.json()`, no auto error on 404/500, check `res.ok` |
| `axios` | Install needed, auto JSON, auto error on 4xx/5xx, cleaner syntax |
| `useEffect + fetch/axios` | Make API calls after component loads, use `[]` to run once |
| Axios instance | `axios.create({ baseURL })` — avoids repeating the URL |
| Error handling | `err.response` (server error), `err.request` (no response), `err.message` |
| React Query | Best for large apps — handles caching, loading, refetching automatically |
| SWR | Lightweight caching — simpler than React Query |

---

## 18. Interview Questions

**Q1. What is the Fetch API? Is it built into React?**
> `fetch` is a built-in browser API for making HTTP requests — it's part of JavaScript itself, not React. You don't need to install anything. You just call `fetch(url)` and handle the Promise it returns.

**Q2. Why do you need to call `.json()` on a fetch response?**
> `fetch` returns a Response object, not the actual data. The response body is a stream that hasn't been read yet. Calling `.json()` reads the stream and parses it into a JavaScript object. It also returns a Promise, so you need to `await` it or chain another `.then()`.

**Q3. Why doesn't fetch throw an error on a 404 response?**
> `fetch` only rejects (throws) on network failures — like no internet or the server being unreachable. A 404 or 500 response is still a valid HTTP response, so fetch considers it a success. You must check `res.ok` (or `res.status`) manually and throw your own error if needed.

**Q4. Why do you put API calls inside useEffect?**
> Because you want the data to load after the component renders. Putting it outside would run during every render. `useEffect` with an empty `[]` dependency array runs once after the first render — the right time to fetch initial data.

**Q5. Why can't you make the useEffect callback async?**
> `useEffect` must return either nothing or a cleanup function. An `async` function always returns a Promise, not a cleanup function — React doesn't know what to do with it. The fix is to define a separate async function inside the effect and call it immediately.

**Q6. What is Axios and how is it different from fetch?**
> Axios is a third-party HTTP library. Key differences: it automatically parses JSON (no `.json()` call), it automatically throws errors for 4xx/5xx responses (no `res.ok` check), it supports request/response interceptors, and it has a built-in timeout option. Fetch has none of these out of the box.

**Q7. What is an Axios instance and why would you create one?**
> An Axios instance is a custom copy of Axios with pre-set configuration like `baseURL`, `timeout`, or default headers. You create it with `axios.create({...})`. It means you only write the base URL once — every request through the instance automatically uses it.

**Q8. What are the three types of Axios errors?**
> `err.response` — server responded but with an error status (4xx, 5xx). `err.request` — request was sent but no response came back (network down, timeout). Neither — something went wrong before the request was even sent (bad config, wrong URL format).

**Q9. What is React Query and when would you use it?**
> React Query is a data-fetching library that automatically handles caching, loading state, error state, background refetching, and pagination. Use it when your app has many API calls and you don't want to write the same loading/error/state logic in every component.

**Q10. What is the difference between React Query and SWR?**
> Both handle caching and background refetching. React Query is more feature-rich — better for complex apps with mutations, pagination, and optimistic updates. SWR is lighter and simpler — better for apps that mainly need GET requests with caching.

**Q11. What is `res.ok` in fetch?**
> `res.ok` is a boolean that is `true` when the HTTP status code is between 200 and 299 (success). If it is `false`, it means the server returned an error like 404 or 500. You should always check `res.ok` before calling `res.json()` when using fetch.

**Q12. What does `params` do in an Axios request?**
> It lets you pass query parameters as a JavaScript object. Axios automatically encodes them and appends them to the URL. For example `axios.get('/users', { params: { role: 'admin' } })` becomes `/users?role=admin`. This is cleaner than building the query string manually.

---

> ⏭️ Next Topic: **State Management (Zustand)** — covered in `component_10`.
