# React - State Management with Zustand

---

## 1. What is Global State and Why Do We Need It?

In React, every component has its own **local state** using `useState`. That works fine when only one component needs the data.

But what happens when **multiple components** — spread across different parts of your app — all need the same data?

```
Example: The logged-in user's name

  App
  ├── Navbar       ← needs to show the username
  ├── Sidebar      ← needs to show the username
  └── ProfilePage  ← needs to show and edit the username
```

If you store the username in `App` and pass it down as props, you end up doing this:

```
App (has username)
 └── Navbar (receives username as prop)
      └── NavUserAvatar (receives username as prop)
           └── DropdownMenu (receives username as prop)  ← only this uses it!
```

This is called **prop drilling** — passing data through many components that don't actually use it, just to get it to the one component that does. It's messy and hard to maintain.

**Global state** solves this. You store the data in one central place, and any component can read or update it directly — no prop drilling.

```
Global Store (username lives here)
  ↓ any component can read it directly
  Navbar ✅   Sidebar ✅   ProfilePage ✅
```

---

## 2. Context API — and Why It Has Limitations

You already learned about `useContext` in `component_06`. Context API is React's built-in solution for sharing state globally.

It works, but it has some real problems in practice:

### Problem 1 — Every consumer re-renders on any change

When the context value changes, **every single component** that uses that context re-renders — even if the part they care about didn't change.

```jsx
// If user.theme changes, both Navbar and ProfilePage re-render
// even if Navbar only uses user.username and doesn't care about theme
const { user } = useContext(UserContext)
```

### Problem 2 — Boilerplate is heavy

To use Context you need to:
1. Create the context with `createContext()`
2. Create a Provider component
3. Wrap your app with the Provider
4. Create a custom hook
5. Import the hook in every component

That's a lot of setup for something that should be simple.

### Problem 3 — Hard to scale

Managing multiple pieces of global state means multiple contexts, multiple providers, and deeply nested wrapper components — it gets messy fast.

```jsx
// This is real — apps end up looking like this
<AuthProvider>
  <ThemeProvider>
    <CartProvider>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </CartProvider>
  </ThemeProvider>
</AuthProvider>
```

---

## 3. What is Zustand?

**Zustand** (German for "state") is a small, fast, and simple state management library for React.

It solves all the problems above:
- ✅ Only components that use a specific piece of state re-render when it changes
- ✅ Very little boilerplate — create a store in one file, use it anywhere
- ✅ No Provider wrapping needed
- ✅ Works outside React components too (in utility functions, API calls, etc.)

```bash
npm install zustand
```

---

## 4. How Zustand Works — The Big Picture

```
1. You create a STORE — a central place that holds your state and functions to update it
2. Any component reads from the store using a hook
3. Any component updates the store by calling a function from the store
4. Only components that read the changed value re-render
```

```
┌─────────────────────────────┐
│         ZUSTAND STORE        │
│                              │
│  state:   { username: 'Ali' }│
│  actions: { setUsername() }  │
└─────────────────────────────┘
       ↑ read/update       ↑ read/update
  Navbar component    ProfilePage component
```

---

## 5. Create Your First Store

A store is just a file where you define your state and the functions (called **actions**) that update it.

```jsx
// store/useUserStore.js
import { create } from 'zustand'

const useUserStore = create((set) => ({

  // ── STATE ──────────────────────────────
  username: 'guest',
  email:    '',
  isLoggedIn: false,

  // ── ACTIONS (functions to update state) ─
  setUsername: (newUsername) => set({ username: newUsername }),

  setEmail: (newEmail) => set({ email: newEmail }),

  login: (username, email) => set({
    username,
    email,
    isLoggedIn: true
  }),

  logout: () => set({
    username:  'guest',
    email:     '',
    isLoggedIn: false
  }),

}))

export default useUserStore
```

### Breaking it down:

- `create()` — Zustand's function to create a store. You pass it a function that returns your state and actions.
- `set` — the function Zustand gives you to **update** the state. You pass it an object with the fields you want to change.
- The store itself is a **custom hook** (`useUserStore`) — you call it inside any component to access the store.

> You don't need `useState`, `useReducer`, or any Provider. Just `create()` and `set()`.

---

## 6. Read State from the Store

To read data from the store, call the hook inside your component and pick the values you need.

```jsx
// components/Navbar.jsx
import useUserStore from '../store/useUserStore'

function Navbar() {
  // read only what this component needs
  const username   = useUserStore(state => state.username)
  const isLoggedIn = useUserStore(state => state.isLoggedIn)

  return (
    <nav>
      {isLoggedIn
        ? <p>Welcome, {username}!</p>
        : <p>Please log in</p>
      }
    </nav>
  )
}

export default Navbar
```

> The selector `state => state.username` is important. It means this component will **only re-render** when `username` changes — not when `email` or `isLoggedIn` changes. This is more efficient than Context.

---

## 7. Update State from the Store

To update state, read the action function from the store and call it.

```jsx
// components/LoginForm.jsx
import { useState }  from 'react'
import useUserStore  from '../store/useUserStore'

function LoginForm() {
  const [inputUsername, setInputUsername] = useState('')
  const [inputEmail,    setInputEmail]    = useState('')

  // read the action from the store
  const login = useUserStore(state => state.login)

  function handleSubmit(e) {
    e.preventDefault()
    // call the action — this updates the global store
    login(inputUsername, inputEmail)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={inputUsername}
        onChange={e => setInputUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        value={inputEmail}
        onChange={e => setInputEmail(e.target.value)}
        placeholder="Email"
      />
      <button type="submit">Login</button>
    </form>
  )
}

export default LoginForm
```

```jsx
// components/LogoutButton.jsx
import useUserStore from '../store/useUserStore'

function LogoutButton() {
  const logout = useUserStore(state => state.logout)

  return <button onClick={logout}>Logout</button>
}

export default LogoutButton
```

---

## 8. Reading Multiple Values at Once

You can read multiple values from the store in one call using an object selector or by calling the hook multiple times.

```jsx
// Option 1 — call the hook multiple times (each watches independently)
const username   = useUserStore(state => state.username)
const email      = useUserStore(state => state.email)
const isLoggedIn = useUserStore(state => state.isLoggedIn)

// Option 2 — return an object (use shallow to avoid unnecessary re-renders)
import { useShallow } from 'zustand/react/shallow'

const { username, email, isLoggedIn } = useUserStore(
  useShallow(state => ({
    username:   state.username,
    email:      state.email,
    isLoggedIn: state.isLoggedIn,
  }))
)
```

> For beginners, Option 1 (calling the hook multiple times) is simpler and works fine. Use `useShallow` when you need to grab many values and want to keep things efficient.

---

## 9. Updating State Based on Previous State

When your new state depends on the old state (like incrementing a counter or toggling a boolean), use the **function form** of `set`.

```jsx
// store/useCounterStore.js
import { create } from 'zustand'

const useCounterStore = create((set) => ({
  count: 0,

  // use (state) => to access the current state before updating
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset:     () => set({ count: 0 }),

  incrementBy: (amount) => set((state) => ({ count: state.count + amount })),
}))

export default useCounterStore
```

```jsx
// Using the counter store
import useCounterStore from '../store/useCounterStore'

function Counter() {
  const count       = useCounterStore(state => state.count)
  const increment   = useCounterStore(state => state.increment)
  const decrement   = useCounterStore(state => state.decrement)
  const reset       = useCounterStore(state => state.reset)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  )
}

export default Counter
```

---

## 10. Working with Arrays in the Store

A very common use case — managing a list of items like a cart, todos, or notifications.

```jsx
// store/useCartStore.js
import { create } from 'zustand'

const useCartStore = create((set) => ({
  cartItems: [],

  // add a product to the cart
  addToCart: (product) => set((state) => ({
    cartItems: [...state.cartItems, product]
  })),

  // remove a product by its id
  removeFromCart: (productId) => set((state) => ({
    cartItems: state.cartItems.filter(item => item.id !== productId)
  })),

  // clear the entire cart
  clearCart: () => set({ cartItems: [] }),
}))

export default useCartStore
```

```jsx
// components/ProductCard.jsx
import useCartStore from '../store/useCartStore'

function ProductCard({ product }) {
  const addToCart = useCartStore(state => state.addToCart)

  return (
    <div>
      <p>{product.name} — ${product.price}</p>
      <button onClick={() => addToCart(product)}>Add to Cart</button>
    </div>
  )
}

export default ProductCard
```

```jsx
// components/Cart.jsx
import useCartStore from '../store/useCartStore'

function Cart() {
  const cartItems     = useCartStore(state => state.cartItems)
  const removeFromCart = useCartStore(state => state.removeFromCart)
  const clearCart      = useCartStore(state => state.clearCart)

  return (
    <div>
      <h2>Cart ({cartItems.length} items)</h2>
      <ul>
        {cartItems.map(item => (
          <li key={item.id}>
            {item.name} — ${item.price}
            <button onClick={() => removeFromCart(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <button onClick={clearCart}>Clear Cart</button>
    </div>
  )
}

export default Cart
```

---

## 11. Persist State to localStorage

By default, Zustand state is reset when the user refreshes the page. To keep state across refreshes, use the **persist** middleware — it automatically saves and restores state from `localStorage`.

```bash
# persist is built into zustand — no extra install needed
```

```jsx
// store/useAuthStore.js
import { create }   from 'zustand'
import { persist }  from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set) => ({
      // ── STATE ──────────────────
      username:    '',
      email:       '',
      token:       null,
      isLoggedIn:  false,

      // ── ACTIONS ────────────────
      login: (username, email, token) => set({
        username,
        email,
        token,
        isLoggedIn: true,
      }),

      logout: () => set({
        username:   '',
        email:      '',
        token:      null,
        isLoggedIn: false,
      }),
    }),
    {
      name: 'auth-storage',  // the key used in localStorage
    }
  )
)

export default useAuthStore
```

```jsx
// Usage is exactly the same as a regular store
import useAuthStore from '../store/useAuthStore'

function Navbar() {
  const username   = useAuthStore(state => state.username)
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)
  const logout     = useAuthStore(state => state.logout)

  return (
    <nav>
      {isLoggedIn
        ? <>
            <span>Hi, {username}</span>
            <button onClick={logout}>Logout</button>
          </>
        : <span>Not logged in</span>
      }
    </nav>
  )
}
```

> After login, if the user refreshes the page, they stay logged in — because the state is saved in `localStorage` under the key `'auth-storage'`. You can check it in your browser DevTools → Application → Local Storage.

---

## 12. Persist — Save Only Specific Fields

Sometimes you don't want to save everything to localStorage — for example, you might not want to save a loading state or error message.

Use the `partialize` option to choose what gets saved:

```jsx
const useAuthStore = create(
  persist(
    (set) => ({
      username:   '',
      email:      '',
      token:      null,
      isLoggedIn: false,
      isLoading:  false,   // ← we do NOT want to save this
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        // only these fields will be saved to localStorage
        username:   state.username,
        email:      state.email,
        token:      state.token,
        isLoggedIn: state.isLoggedIn,
        // isLoading is NOT included — it won't be saved
      }),
    }
  )
)
```

---

## 13. Reading State Outside a Component

One of Zustand's superpowers — you can read or update the store **outside** a React component. This is useful in API files, utility functions, or route guards.

```jsx
// Reading state outside a component (e.g. in an axios interceptor)
import useAuthStore from '../store/useAuthStore'

// .getState() gives you the current state without a hook
const token = useAuthStore.getState().token

// You can also call actions outside components
useAuthStore.getState().logout()
```

```jsx
// Real use case — attach token to every axios request
import axios from 'axios'
import useAuthStore from '../store/useAuthStore'

const api = axios.create({ baseURL: 'https://api.example.com' })

api.interceptors.request.use((config) => {
  // read the token from Zustand store without useHook
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

> Context API cannot do this — you can only read context values inside a React component or hook. Zustand's `.getState()` works anywhere.

---

## 14. Complete File Structure

```
src/
  store/
    useUserStore.js      ← user info (username, email, login, logout)
    useCartStore.js      ← shopping cart (cartItems, addToCart, removeFromCart)
    useCounterStore.js   ← counter example
    useAuthStore.js      ← auth with localStorage persistence
  components/
    Navbar.jsx           ← reads username, isLoggedIn from store
    LoginForm.jsx        ← calls login() action
    LogoutButton.jsx     ← calls logout() action
    Cart.jsx             ← reads cartItems, calls removeFromCart
    ProductCard.jsx      ← calls addToCart
```

---

## 15. Context API vs Zustand — Side by Side

| | Context API | Zustand |
|---|---|---|
| Built into React | ✅ Yes | ❌ Install needed |
| Boilerplate | Heavy (createContext, Provider, custom hook) | Minimal (just `create()`) |
| Provider needed | ✅ Yes — wrap your app | ❌ No Provider needed |
| Re-render behaviour | All consumers re-render on any change | Only components using the changed value re-render |
| Works outside components | ❌ No | ✅ Yes (`.getState()`) |
| Persist to localStorage | ❌ Manual setup | ✅ Built-in `persist` middleware |
| Best for | Small apps, simple shared state | Medium to large apps, complex state |

---

## 16. Zustand — Summary

| Concept | How |
|---|---|
| Install | `npm install zustand` |
| Create store | `const useStore = create((set) => ({ state, actions }))` |
| Update state | `set({ field: newValue })` |
| Update based on previous | `set(state => ({ count: state.count + 1 }))` |
| Read in component | `const value = useStore(state => state.value)` |
| Call action | `const action = useStore(state => state.action)` |
| Persist to localStorage | Wrap with `persist(...)` middleware |
| Read outside component | `useStore.getState().value` |

---

## 17. Interview Questions

**Q1. What is global state and why do we need it?**
> Global state is data that multiple components across your app need to read or update. Without it, you have to pass data down through props at every level (prop drilling). Global state lets any component access the data directly from a central store — no matter where it is in the component tree.

**Q2. What are the limitations of the Context API?**
> Three main limitations: (1) Every component that consumes a context re-renders when any part of the context value changes — even if the part it cares about didn't change. (2) It requires a lot of boilerplate — createContext, Provider, custom hook. (3) It doesn't work outside React components, making it hard to use in API files or utility functions.

**Q3. What is Zustand?**
> Zustand is a lightweight state management library for React. You create a store with `create()`, define your state and actions inside it, and use the store as a hook in any component. It has no Providers, minimal boilerplate, and only re-renders components that use the specific piece of state that changed.

**Q4. How do you create a Zustand store?**
> Call `create()` from Zustand and pass a function that returns an object with your state values and action functions. Actions use the `set()` function to update state. Export the result as a custom hook.

**Q5. What is `set()` in Zustand?**
> `set()` is the function Zustand provides to update state. You pass it an object with only the fields you want to change — the rest of the state is automatically preserved (merged). You can also pass a function `set(state => ...)` when the new value depends on the current state.

**Q6. Why is the selector important when reading from a Zustand store?**
> The selector `state => state.username` tells Zustand which specific piece of state the component cares about. Zustand only re-renders the component when that specific value changes. Without a precise selector, the component might re-render more than necessary.

**Q7. How does Zustand's `persist` middleware work?**
> Wrapping your store with `persist()` automatically saves the state to `localStorage` whenever it changes, and restores it when the page loads. You provide a `name` key for localStorage. You can use `partialize` to control which fields get saved and which don't.

**Q8. Can you use Zustand outside a React component?**
> Yes. Call `useStoreName.getState()` to read the current state anywhere — in an Axios interceptor, a utility function, or a route guard. You can also call actions via `useStoreName.getState().actionName()`. Context API cannot do this.

**Q9. How do you update an array in a Zustand store?**
> Always return a new array — never mutate the existing one. Use spread to add: `[...state.items, newItem]`. Use filter to remove: `state.items.filter(item => item.id !== id)`. Use map to update: `state.items.map(item => item.id === id ? updatedItem : item)`.

**Q10. What is the difference between `set({ count: 0 })` and `set(state => ({ count: state.count + 1 }))`?**
> The first form directly sets `count` to `0` — use this when the new value doesn't depend on the old one. The second form receives the current state as an argument — use this when the new value depends on the current value, like incrementing or toggling, to ensure you always work with the latest state.

**Q11. Do you need to wrap your app with a Provider when using Zustand?**
> No. This is one of Zustand's biggest advantages over Context API. The store is created outside the component tree and accessed directly via the hook — no Provider component needed anywhere.

**Q12. When would you choose Context API over Zustand?**
> Context API is fine for simple, infrequently-changing global values — like a theme (light/dark) or the current language. Zustand is better when you have complex state logic, many components reading the same state, or need features like persistence, devtools, or access outside components.

---

> ⏭️ Next Topic: **Tailwind CSS** — covered in `component_11`.
