# React - Event Handling & Forms

---

## 1. What is Event Handling?

An **event** is any user interaction — clicking a button, typing in an input, submitting a form, hovering over an element, etc.

In React, you handle events directly on JSX elements using **camelCase event attributes**.

| HTML (old way) | React (JSX way) |
|---|---|
| `onclick` | `onClick` |
| `onchange` | `onChange` |
| `onsubmit` | `onSubmit` |
| `onkeydown` | `onKeyDown` |
| `onmouseover` | `onMouseOver` |

---

## 2. Basic Event Handling

```jsx
function App() {
  function handleClick() {
    alert('Button clicked!');
  }

  return <button onClick={handleClick}>Click Me</button>;
}
```

### Important Rules:
- Pass the **function reference**, not a function call.
```jsx
onClick={handleClick}    // ✅ correct — passes reference
onClick={handleClick()}  // ❌ wrong  — calls immediately on render
```
- Use arrow functions when you need to pass arguments:
```jsx
onClick={() => handleClick(id)}   // ✅ correct way to pass arguments
```

---

## 3. The Event Object (e)

Every event handler automatically receives an **event object** as its first argument. It contains details about the event.

```jsx
function handleClick(e) {
  console.log(e);              // full event object
  console.log(e.target);       // the element that triggered the event
  console.log(e.target.value); // value of an input field
  console.log(e.type);         // "click", "change", "submit", etc.
}

<button onClick={handleClick}>Click</button>
```

### Most Used Event Object Properties:
| Property | Description |
|---|---|
| `e.target` | The DOM element that triggered the event |
| `e.target.value` | Current value of an input/select/textarea |
| `e.target.name` | The `name` attribute of the input |
| `e.target.checked` | Checked state of a checkbox |
| `e.preventDefault()` | Prevents default browser behavior (e.g. form submit reload) |
| `e.stopPropagation()` | Stops event from bubbling up to parent elements |

---

## 4. Common Events in React

### onClick — Button / Any Element
```jsx
<button onClick={() => console.log('clicked')}>Click</button>
```

### onChange — Input / Select / Textarea
```jsx
<input onChange={(e) => console.log(e.target.value)} />
```

### onSubmit — Form
```jsx
<form onSubmit={(e) => {
  e.preventDefault();   // stops page reload
  console.log('form submitted');
}}>
  <button type="submit">Submit</button>
</form>
```

### onFocus & onBlur — Input Focus
```jsx
<input
  onFocus={() => console.log('input focused')}
  onBlur={() => console.log('input lost focus')}
/>
```

### onMouseEnter & onMouseLeave — Hover
```jsx
<div
  onMouseEnter={() => console.log('mouse entered')}
  onMouseLeave={() => console.log('mouse left')}
>
  Hover over me
</div>
```

### onKeyDown / onKeyUp — Keyboard
```jsx
<input onKeyDown={(e) => console.log(e.key)} />  // logs "Enter", "a", "Backspace" etc.
```

---

## 5. Controlled Components (Most Important Concept)

A **controlled component** is an input whose value is controlled by React state.

```
User types → onChange fires → setState called → state updates → input re-renders with new value
```

```jsx
import { useState } from 'react';

function App() {
  const [name, setName] = useState('');

  return (
    <div>
      <input
        value={name}                          // controlled by state
        onChange={(e) => setName(e.target.value)}  // updates state on every keystroke
      />
      <p>You typed: {name}</p>
    </div>
  );
}
```

- `value={name}` — React controls what's shown in the input.
- `onChange` — updates state on every keystroke.
- The input always reflects the state — **single source of truth**.

---

## 6. Uncontrolled Components

An **uncontrolled component** lets the DOM handle its own state. You read the value using a `ref` instead of state.

```jsx
import { useRef } from 'react';

function App() {
  const inputRef = useRef();

  function handleSubmit() {
    console.log(inputRef.current.value);  // read value directly from DOM
  }

  return (
    <div>
      <input ref={inputRef} />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
```

| | Controlled | Uncontrolled |
|---|---|---|
| Value managed by | React state | DOM itself |
| How to read value | `state variable` | `ref.current.value` |
| Recommended | ✅ Yes (most cases) | For simple/quick cases |

---

## 7. Handling a Full Form

```jsx
import { useState } from 'react';

function RegistrationForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(formData);  // { name: '...', email: '...', password: '...' }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
      />
      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <input
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
      />
      <button type="submit">Register</button>
    </form>
  );
}
```

### Key Technique — `[e.target.name]` (Computed Property):
```jsx
setFormData({ ...formData, [e.target.name]: e.target.value });
```
- `e.target.name` reads the `name` attribute of the input that changed.
- `[e.target.name]` dynamically sets the key in the object.
- One `handleChange` function handles **all inputs** — no need to write separate handlers.

---

## 8. Handling Checkbox

```jsx
const [isAgreed, setIsAgreed] = useState(false);

<input
  type="checkbox"
  checked={isAgreed}
  onChange={(e) => setIsAgreed(e.target.checked)}  // use e.target.checked, not e.target.value
/>
<label>I agree to terms</label>
```

---

## 9. Handling Select Dropdown

```jsx
const [city, setCity] = useState('');

<select value={city} onChange={(e) => setCity(e.target.value)}>
  <option value="">-- Select City --</option>
  <option value="hyderabad">Hyderabad</option>
  <option value="mumbai">Mumbai</option>
  <option value="delhi">Delhi</option>
</select>

<p>Selected: {city}</p>
```

---

## 10. Form Validation

```jsx
function LoginForm() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  function handleSubmit(e) {
    e.preventDefault();

    if (!email || !password) {
      setError('All fields are required.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setError('');
    console.log('Form submitted:', { email, password });
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input value={email}    onChange={(e) => setEmail(e.target.value)}    placeholder="Email" />
      <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
      <button type="submit">Login</button>
    </form>
  );
}
```

---

## 11. Event Bubbling & stopPropagation

**Event bubbling** means when an event fires on a child, it also fires on all its parent elements.

```jsx
function App() {
  return (
    <div onClick={() => console.log('DIV clicked')}>
      <button onClick={(e) => {
        e.stopPropagation();          // stops event from reaching the div
        console.log('Button clicked');
      }}>
        Click Me
      </button>
    </div>
  );
}

// Without stopPropagation → logs: "Button clicked" then "DIV clicked"
// With stopPropagation    → logs: "Button clicked" only
```

---

## 12. Synthetic Events

React wraps native browser events in a **SyntheticEvent** — a cross-browser wrapper that works the same way in all browsers.

- You don't need to worry about browser differences.
- It has the same interface as native events (`e.target`, `e.preventDefault()`, etc.).
- React reuses synthetic event objects for performance (event pooling in older React versions).

---

## 13. Quick Reference — Events Cheat Sheet

| Event | Used On | Key Property |
|---|---|---|
| `onClick` | Any element | `e.target` |
| `onChange` | input, select, textarea | `e.target.value` |
| `onSubmit` | form | `e.preventDefault()` |
| `onFocus` | input | `e.target` |
| `onBlur` | input | `e.target` |
| `onKeyDown` | input | `e.key` |
| `onMouseEnter` | Any element | `e.target` |
| `onMouseLeave` | Any element | `e.target` |
| `onDoubleClick` | Any element | `e.target` |
| `onChange` (checkbox) | input[checkbox] | `e.target.checked` |

---

## 14. Interview Questions

**Q1. How is event handling different in React vs plain HTML?**
> In HTML, events are lowercase strings (`onclick`, `onchange`). In React, they are camelCase (`onClick`, `onChange`) and accept a function reference, not a string.

**Q2. What is the event object in React? What are its commonly used properties?**
> The event object (`e`) is automatically passed to every event handler. Commonly used: `e.target`, `e.target.value`, `e.target.name`, `e.target.checked`, `e.preventDefault()`, `e.stopPropagation()`.

**Q3. What is `e.preventDefault()` and when do you use it?**
> It prevents the default browser behavior. Most commonly used on form `onSubmit` to stop the page from reloading when a form is submitted.

**Q4. What is a controlled component?**
> A controlled component is an input whose value is driven by React state. The `value` prop is set to a state variable and `onChange` updates that state — making React the single source of truth.

**Q5. What is the difference between controlled and uncontrolled components?**
> Controlled: value managed by React state, read via state variable. Uncontrolled: value managed by the DOM, read via `ref.current.value`. Controlled is recommended for most cases.

**Q6. Why do we use `e.target.name` in a form with multiple inputs?**
> It allows one `handleChange` function to handle all inputs. `e.target.name` reads the `name` attribute of the changed input, and `[e.target.name]` dynamically updates the correct key in the state object.

**Q7. What is the difference between `e.target.value` and `e.target.checked`?**
> `e.target.value` is used for text inputs, selects, and textareas. `e.target.checked` is used for checkboxes and radio buttons to get their boolean checked state.

**Q8. What is event bubbling? How do you stop it?**
> Event bubbling means an event fired on a child element propagates up to all parent elements. Use `e.stopPropagation()` inside the child's handler to prevent it from reaching parent handlers.

**Q9. Why should you pass a function reference to onClick, not a function call?**
> `onClick={handleClick}` passes the function to be called when clicked. `onClick={handleClick()}` calls the function immediately during render, not on click — causing unintended behavior.

**Q10. What is a SyntheticEvent in React?**
> React wraps native browser events in a SyntheticEvent — a cross-browser compatible wrapper with the same interface as native events. It ensures consistent behavior across all browsers.

**Q11. How do you handle a select dropdown in React?**
> Use a controlled component — bind `value` to state and update it with `onChange`: `<select value={city} onChange={(e) => setCity(e.target.value)}>`.

**Q12. How do you do basic form validation in React?**
> Inside the `onSubmit` handler, check the state values before processing. If validation fails, call `e.preventDefault()`, set an error state, and display it in the UI.

**Q13. How do you pass an argument to an event handler?**
> Wrap it in an arrow function: `onClick={() => handleClick(id)}`. This ensures the function is only called when the event fires, not during render.

**Q14. What is the `onBlur` event used for?**
> `onBlur` fires when an input loses focus. It's commonly used to trigger validation after the user finishes typing in a field, rather than on every keystroke.

**Q15. Can you use `onChange` on a select element in React?**
> Yes. `onChange` on a `<select>` fires whenever the selected option changes, and `e.target.value` gives the value of the newly selected option — same pattern as a text input.

---

> ⏭️ Next Topic: **useEffect Hook** — Side effects, API calls, lifecycle in functional components (covered in `component_05`).
