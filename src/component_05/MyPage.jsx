import { useState, useEffect, useRef } from 'react'

// ─────────────────────────────────────────────
// Example 1 — Update document title on count change
// Concept: useEffect with dependency [count]
// ─────────────────────────────────────────────
function Ex1_DocumentTitle() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    document.title = `Page - ${count}`
  }, [count])

  return (
    <div style={card}>
      <h3>Ex 1 — Document Title</h3>
      <p>Count: {count} &nbsp;(check browser tab)</p>
      <button onClick={() => setCount(count + 1)}>➕</button>
      <button onClick={() => setCount(count > 0 ? count - 1 : 0)}>➖</button>
      <button onClick={() => setCount(0)}>🔄 Reset</button>
    </div>
  )
}

// ─────────────────────────────────────────────
// Example 2 — Fetch data on mount
// Concept: useEffect with [] — runs once on mount, async inside
// ─────────────────────────────────────────────
function Ex2_FetchOnMount() {
  const [users, setUsers]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUsers() {
      const res  = await fetch('https://jsonplaceholder.typicode.com/users?_limit=5')
      const data = await res.json()
      setUsers(data)
      setLoading(false)
    }
    fetchUsers()
  }, [])  // runs once on mount

  return (
    <div style={card}>
      <h3>Ex 2 — Fetch on Mount</h3>
      {loading ? <p>Loading...</p> : (
        <ul>
          {users.map(u => <li key={u.id}>{u.name}</li>)}
        </ul>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// Example 3 — Timer with cleanup
// Concept: setInterval + cleanup function to prevent memory leak
// ─────────────────────────────────────────────
function Ex3_TimerWithCleanup() {
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!running) return  // don't start timer if not running

    const interval = setInterval(() => {
      setSeconds(prev => prev + 1)  // functional update — no stale closure
    }, 1000)

    return () => clearInterval(interval)  // cleanup — stops timer
  }, [running])  // re-runs when running changes

  return (
    <div style={card}>
      <h3>Ex 3 — Timer with Cleanup</h3>
      <p>Seconds: {seconds}</p>
      <button onClick={() => setRunning(true)}>▶ Start</button>
      <button onClick={() => setRunning(false)}>⏸ Stop</button>
      <button onClick={() => { setRunning(false); setSeconds(0) }}>🔄 Reset</button>
    </div>
  )
}

// ─────────────────────────────────────────────
// Example 4 — Window resize listener with cleanup
// Concept: addEventListener + removeEventListener in cleanup
// ─────────────────────────────────────────────
function Ex4_WindowResize() {
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)  // setup

    return () => window.removeEventListener('resize', handleResize)  // cleanup
  }, [])  // runs once — listener added on mount, removed on unmount

  return (
    <div style={card}>
      <h3>Ex 4 — Window Resize Listener</h3>
      <p>Window width: <strong>{width}px</strong></p>
      <small>Try resizing the browser window</small>
    </div>
  )
}

// ─────────────────────────────────────────────
// Example 5 — Fetch based on dependency (search)
// Concept: useEffect re-runs when dependency changes + AbortController cleanup
// ─────────────────────────────────────────────
function Ex5_FetchOnDependency() {
  const [userId, setUserId]   = useState(1)
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)

    async function fetchUser() {
      try {
        const res  = await fetch(
          `https://jsonplaceholder.typicode.com/users/${userId}`,
          { signal: controller.signal }
        )
        const data = await res.json()
        setUser(data)
        setLoading(false)
      } catch (err) {
        if (err.name === 'AbortError') return  // cancelled — ignore
      }
    }

    fetchUser()

    return () => controller.abort()  // cancel previous fetch when userId changes
  }, [userId])  // re-runs every time userId changes

  return (
    <div style={card}>
      <h3>Ex 5 — Fetch on Dependency Change</h3>
      <div style={{ marginBottom: '8px' }}>
        {[1, 2, 3, 4, 5].map(id => (
          <button
            key={id}
            onClick={() => setUserId(id)}
            style={{ marginRight: '6px', fontWeight: userId === id ? 'bold' : 'normal' }}
          >
            User {id}
          </button>
        ))}
      </div>
      {loading ? <p>Loading...</p> : (
        <div>
          <p><strong>{user?.name}</strong></p>
          <p>📧 {user?.email}</p>
          <p>🏙 {user?.address?.city}</p>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// Shared card style
// ─────────────────────────────────────────────
const card = {
  border: '1px solid #ccc',
  borderRadius: '8px',
  padding: '16px',
  marginBottom: '20px',
  maxWidth: '400px',
}

// ─────────────────────────────────────────────
// Main Page — renders all examples
// ─────────────────────────────────────────────
export default function MyPage() {
  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif' }}>
      <h2>useEffect — Practice Examples</h2>
      <Ex1_DocumentTitle />
      <Ex2_FetchOnMount />
      <Ex3_TimerWithCleanup />
      <Ex4_WindowResize />
      <Ex5_FetchOnDependency />
    </div>
  )
}
