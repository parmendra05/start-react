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

### What is an Uncontrolled Component?
An **uncontrolled component** is an input element that manages its own value **internally through the DOM** — React does not control or track its value via state.

- Instead of using `useState` + `value` + `onChange`, you let the browser handle the input naturally.
- You access the value only when you need it (e.g. on form submit) using a **`ref`**.
- `ref` is a way to directly reference a DOM element in React.

```
Controlled:    User types → onChange → setState → React re-renders → input shows new value
Uncontrolled:  User types → DOM updates itself → React is NOT involved
```

---

### How `useRef` Works with Uncontrolled Inputs

- `useRef()` creates a **ref object** with a `.current` property.
- When you attach `ref={inputRef}` to a DOM element, `inputRef.current` points directly to that DOM node.
- You can then read `inputRef.current.value` to get the input's current value at any time.

```jsx
import { useRef } from 'react';

function App() {
  const inputRef = useRef();   // inputRef.current = undefined initially

  // After render: inputRef.current = the actual <input> DOM element

  function handleSubmit() {
    console.log(inputRef.current.value);  // reads value directly from DOM
  }

  return (
    <div>
      <input ref={inputRef} placeholder="Type something" />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
```

- No `useState`, no `onChange`, no re-renders on every keystroke.
- React only reads the value when `handleSubmit` is called.

---

### Setting a Default Value

For uncontrolled inputs, use `defaultValue` instead of `value` to set an initial value.

```jsx
// ✅ Correct for uncontrolled — sets initial value, DOM manages after that
<input ref={inputRef} defaultValue="Raju" />

// ❌ Wrong — using value without onChange makes it read-only and throws a warning
<input ref={inputRef} value="Raju" />
```

Same applies to checkboxes — use `defaultChecked` instead of `checked`:
```jsx
<input type="checkbox" ref={checkRef} defaultChecked={true} />
```

---

### Full Uncontrolled Form Example

```jsx
import { useRef } from 'react';

function LoginForm() {
  const emailRef    = useRef();
  const passwordRef = useRef();

  function handleSubmit(e) {
    e.preventDefault();

    const email    = emailRef.current.value;
    const password = passwordRef.current.value;

    if (!email || !password) {
      alert('All fields are required.');
      return;
    }

    console.log('Submitted:', { email, password });
  }

  function handleReset() {
    emailRef.current.value    = '';   // manually clear the input
    passwordRef.current.value = '';
  }

  return (
    <form onSubmit={handleSubmit}>
      <input ref={emailRef}    type="email"    placeholder="Email" />
      <input ref={passwordRef} type="password" placeholder="Password" />
      <button type="submit">Login</button>
      <button type="button" onClick={handleReset}>Reset</button>
    </form>
  );
}
```

- Values are only read on submit — no state, no re-renders during typing.
- To reset, you manually set `ref.current.value = ''` — React doesn't manage it.

---

### When to Use Uncontrolled Components

| Use Case | Recommended |
|---|---|
| Simple form, just need value on submit | ✅ Uncontrolled is fine |
| Real-time validation while typing | ❌ Use Controlled |
| Conditional rendering based on input value | ❌ Use Controlled |
| Integrating with non-React (third-party) libraries | ✅ Uncontrolled works better |
| File input (`<input type="file" />`) | ✅ Always uncontrolled — React can't control file inputs |
| Complex forms with many interdependent fields | ❌ Use Controlled |

---

### File Input — Always Uncontrolled

File inputs are a special case — React **cannot** control their value. They are always uncontrolled.

```jsx
function FileUpload() {
  const fileRef = useRef();

  function handleUpload() {
    const file = fileRef.current.files[0];  // access selected file
    console.log(file.name, file.size, file.type);
  }

  return (
    <div>
      <input type="file" ref={fileRef} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}
```

---

### Controlled vs Uncontrolled — Full Comparison

| | Controlled | Uncontrolled |
|---|---|---|
| Value managed by | React state (`useState`) | DOM itself |
| How to read value | State variable directly | `ref.current.value` |
| Re-renders on typing | ✅ Yes — on every keystroke | ❌ No — only when you read it |
| Real-time validation | ✅ Easy | ❌ Harder |
| Reset input | `setState('')` | `ref.current.value = ''` |
| Initial value | `value={...}` + `useState` | `defaultValue={...}` |
| File inputs | ❌ Not possible | ✅ Only option |
| Recommended for | Most cases | Simple forms, file inputs, 3rd party libs |
| Code complexity | Slightly more (state + onChange) | Less boilerplate |

> React officially recommends **controlled components** for most use cases because they give React full control over the form data, making validation, conditional rendering, and state management much easier.

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

## 9. Handling Textarea

In HTML, `<textarea>` uses inner content for its value. In React, it works like a regular input — use `value` and `onChange`.

```jsx
// HTML way (old)
<textarea>Hello</textarea>

// React way — controlled, same pattern as input
const [message, setMessage] = useState('');

<textarea
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  rows={4}
  placeholder="Write your message..."
/>
<p>Characters: {message.length}</p>
```

- `value` + `onChange` — same controlled pattern as `<input>`.
- Self-closing `<textarea />` is valid in JSX (unlike HTML).

---

## 10. Handling Select Dropdown

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

## 11. Handling Radio Buttons

Radio buttons work as a group — only one can be selected at a time. Use a single state variable to track which option is selected.

```jsx
const [gender, setGender] = useState('');

<div>
  <label>
    <input
      type="radio"
      value="male"
      checked={gender === 'male'}           // controlled — checked when state matches
      onChange={(e) => setGender(e.target.value)}
    />
    Male
  </label>

  <label>
    <input
      type="radio"
      value="female"
      checked={gender === 'female'}
      onChange={(e) => setGender(e.target.value)}
    />
    Female
  </label>

  <label>
    <input
      type="radio"
      value="other"
      checked={gender === 'other'}
      onChange={(e) => setGender(e.target.value)}
    />
    Other
  </label>
</div>

<p>Selected: {gender}</p>
```

- `checked={gender === 'male'}` — each radio is controlled by comparing state to its value.
- `e.target.value` — reads the `value` attribute of the selected radio button.
- All radios in a group share the **same state variable** and the **same `onChange`**.

---

## 12. Form Validation

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

## 13. Event Bubbling & stopPropagation

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

## 14. Synthetic Events & Event Delegation

### Synthetic Events
React wraps native browser events in a **SyntheticEvent** — a cross-browser wrapper that works the same way in all browsers.

- Same interface as native events (`e.target`, `e.preventDefault()`, etc.).
- No need to worry about browser differences — React handles it.

### Event Delegation (How React Attaches Events)

In plain JavaScript, event listeners are attached directly to each DOM element:
```js
button.addEventListener('click', handleClick);  // attached to the button itself
```

React uses a different approach called **event delegation**:
- React attaches **a single event listener** to the **root DOM node** (`#root`) for each event type.
- When any event fires anywhere in the app, it bubbles up to `#root`.
- React then figures out which component's handler to call.

```
User clicks button
      ↓
Event bubbles up to #root
      ↓
React's single listener at #root catches it
      ↓
React dispatches SyntheticEvent to the correct component handler
```

**Why this matters:**
- More memory efficient — one listener per event type instead of one per element.
- This is why `e.stopPropagation()` in React stops bubbling within React's tree, but the event has already reached `#root`.
- Explains why React events work consistently even on dynamically added elements.

---

React wraps native browser events in a **SyntheticEvent** — a cross-browser wrapper that works the same way in all browsers.

- You don't need to worry about browser differences.
- It has the same interface as native events (`e.target`, `e.preventDefault()`, etc.).
- React reuses synthetic event objects for performance (event pooling in older React versions).

---

## 15. Quick Reference — Events Cheat Sheet

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

## 16. Interview Questions

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

**Q16. How do you handle a textarea in React? How is it different from HTML?**
> In HTML, textarea uses inner content (`<textarea>Hello</textarea>`). In React, it uses `value` and `onChange` just like a regular input — `<textarea value={message} onChange={(e) => setMessage(e.target.value)} />`. It can also be self-closing in JSX.

**Q17. How do you handle radio buttons in React?**
> Use a single state variable for the group. Each radio has `checked={state === 'itsValue'}` and the same `onChange` handler that calls `setState(e.target.value)`. Only one can be selected at a time because only one will match the state.

**Q18. What is event delegation? How does React use it?**
> Event delegation means attaching one listener to a parent instead of individual listeners on each child. React attaches a single event listener per event type to the root `#root` DOM node. All events bubble up to it, and React dispatches the correct SyntheticEvent to the matching component handler — making it memory efficient.

---

> ⏭️ Next Topic: **useEffect Hook** — Side effects, API calls, lifecycle in functional components (covered in `component_05`).
