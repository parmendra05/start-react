# React - Props (Properties)

---

## 1. What are Props?

Props (short for **Properties**) are the way to pass data from a **parent component** to a **child component**.

- Think of props like **function arguments** — you pass values in, the component uses them.
- Props are **read-only** — a child component can never modify the props it receives.
- Props make components **dynamic and reusable**.

```
Parent Component  →  passes props  →  Child Component
```

---

## 2. Passing & Receiving Props

### Passing props (from Parent)
```jsx
<UserCard name="Raju" age={25} />
```

### Receiving props (in Child)
```jsx
// Method 1 — Destructuring (clean & recommended ✅)
function UserCard({ name, age }) {
  return (
    <div>
      <h2>Name: {name}</h2>
      <p>Age: {age}</p>
    </div>
  );
}

// Method 2 — props object
function UserCard(props) {
  return <h2>Name: {props.name}</h2>;
}

// Method 3 — any name works (info, data, anything)
function UserCard(info) {
  return <h2>Name: {info.name}</h2>;
}

function UserCard(data) {
  return <h2>Name: {data.name}</h2>;
}
```

> `props` is just a parameter name — React doesn't enforce it. The community uses `props` by convention so everyone reading your code understands it instantly. When destructuring `{ name, age }`, the parameter name doesn't matter at all — which is why **destructuring is the cleanest approach**. ✅

---

## 3. Your Existing Code Explained

```jsx
// UserCard.jsx

export default function UserCard({ name, age }) {
  return (
    <div>
      <h2>Name : {name}</h2>
      <p>Age : {age}</p>
    </div>
  );
}
```

- `UserCard` is the **child component**.
- `name` and `age` are props passed in from wherever `<UserCard />` is used.
- `{}` in JSX renders the prop value dynamically.

### How to use it in App.jsx:
```jsx
import UserCard from './component_02/UserCard';

function App() {
  return (
    <div>
      <UserCard name="Raju" age={25} />
      <UserCard name="Priya" age={22} />
      <UserCard name="Arjun" age={28} />
    </div>
  );
}
```

- Same component, **different data** — this is the power of props.

---

## 4. Default Props

If a prop is not passed by the parent, you can define a **default value**.

```jsx
// Your existing Person component in UserCard.jsx
export function Person({ firstName = "Raju", lastname = "K" }) {
  return (
    <div>
      <h3>Name : {firstName} {lastname}</h3>
    </div>
  );
}
```

- If `<Person />` is used without any props → renders "Raju K"
- If `<Person firstName="Priya" />` → renders "Priya K" (lastname uses default)

---

## 5. Passing Different Data Types as Props

```jsx
<UserProfile
  name="Raju"           // string
  age={25}              // number  — use {} for non-string values
  isActive={true}       // boolean
  scores={[90, 85, 92]} // array
  address={{ city: "Hyderabad", pin: "500001" }}  // object
  onClick={handleClick} // function
/>
```

> Strings can use `""` directly. Everything else (numbers, booleans, arrays, objects, functions) must be wrapped in `{}`.

---

## 6. Props are One-Way (Unidirectional Data Flow)

```
App (Parent)
  └── UserCard (Child)   ← props flow DOWN only
```

- Data flows **only from parent → child**, never the other way.
- This makes the app **predictable and easy to debug**.
- If a child needs to send data up, that's done via **callback functions** (advanced topic).

---

## 7. `children` Prop

React has a special built-in prop called `children` — it represents whatever you put **between the opening and closing tags** of a component.

```jsx
function Card({ children }) {
  return <div className="card">{children}</div>;
}

// Usage
<Card>
  <h2>Hello</h2>
  <p>This is inside the card.</p>
</Card>
```

- Anything between `<Card>` and `</Card>` becomes `children`.
- Very useful for building **wrapper/layout components**.

---

## 8. Prop Drilling

Prop drilling is when you pass props through **multiple levels** of components just to get data to a deeply nested child.

```
App  →  Parent  →  Child  →  GrandChild  (needs the data)
```

```jsx
function App() {
  const user = "Raju";
  return <Parent user={user} />;
}

function Parent({ user }) {
  return <Child user={user} />;   // just passing it down, doesn't use it
}

function Child({ user }) {
  return <h2>Hello, {user}</h2>;  // finally used here
}
```

- `Parent` doesn't need `user` itself — it just passes it down. This is **prop drilling**.
- It works fine for 2–3 levels but becomes messy for deeply nested trees.
- Solution for deep drilling → **Context API** or **state management** (advanced topics).

---

## 9. Spread Operator with Props

If you have an object, you can spread all its properties as props at once using `{...object}`.

```jsx
const userDetails = { name: "Raju", age: 25 };

// Without spread — verbose
<UserCard name={userDetails.name} age={userDetails.age} />

// With spread — clean ✅
<UserCard {...userDetails} />
```

- Both are exactly the same — spread just saves repetition.
- Useful when you already have data in an object and want to pass all fields as props.

---

## 10. Rendering Lists with Props

One of the most common real-world uses of props — rendering a list of items using `.map()`.

```jsx
const users = [
  { id: 1, name: "Raju",  age: 25 },
  { id: 2, name: "Priya", age: 22 },
  { id: 3, name: "Arjun", age: 28 },
];

function App() {
  return (
    <div>
      {users.map((user) => (
        <UserCard key={user.id} name={user.name} age={user.age} />
      ))}
    </div>
  );
}
```

- `.map()` loops over the array and renders a `<UserCard />` for each item.
- The `key` prop is **required** when rendering lists — React uses it to track which items changed.
- `key` must be **unique** among siblings (use an id, not the array index if possible).

> ⚠️ Missing `key` will cause a React warning and can lead to rendering bugs.

---

## 11. PropTypes — Type Checking for Props

PropTypes let you **validate** the type of props a component receives. If wrong type is passed, React shows a warning in the console.

```bash
npm install prop-types
```

```jsx
import PropTypes from 'prop-types';

function UserCard({ name, age }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{age}</p>
    </div>
  );
}

UserCard.propTypes = {
  name: PropTypes.string.isRequired,  // must be a string, required
  age:  PropTypes.number.isRequired,  // must be a number, required
};
```

- `.isRequired` — warns if the prop is not passed at all.
- Common types: `PropTypes.string`, `PropTypes.number`, `PropTypes.bool`, `PropTypes.array`, `PropTypes.object`, `PropTypes.func`.
- PropTypes only run in **development mode** — no impact on production.
- In TypeScript projects, PropTypes are not needed (TypeScript handles type checking).

---

## 12. Key Rules of Props

| Rule | Detail |
|---|---|
| Read-only | Never modify props inside the child component |
| Any data type | Strings, numbers, booleans, arrays, objects, functions |
| Default values | Set in function parameters `= defaultValue` |
| One-way flow | Parent → Child only |
| `children` | Special prop for nested JSX content |

---

## 13. Props vs State (Quick Preview)

| | Props | State |
|---|---|---|
| Who controls it? | Parent component | The component itself |
| Mutable? | ❌ No (read-only) | ✅ Yes |
| Purpose | Pass data into a component | Manage data inside a component |
| Hook used | None | `useState` |

> Full details on **State** → covered in `component_03`.

---

## 14. Interview Questions

**Q1. What are props in React?**
> Props are read-only inputs passed from a parent component to a child component, similar to function arguments. They make components dynamic and reusable.

**Q2. Can a child component modify its props?**
> No. Props are immutable (read-only). A child component should never modify the props it receives. For mutable data, use state.

**Q3. What is the difference between props and state?**
> Props are passed from parent to child and are read-only. State is managed within the component itself and can be changed using `useState`.

**Q4. What are default props? How do you define them?**
> Default props are fallback values used when a prop is not passed by the parent. They are defined directly in the function parameters: `function Person({ name = "Raju" })`.

**Q5. What is unidirectional data flow in React?**
> Data in React flows only from parent to child via props, never the other way. This one-way flow makes the app predictable and easier to debug.

**Q6. What is the `children` prop?**
> `children` is a special built-in prop that contains whatever JSX is placed between a component's opening and closing tags. It's used to build wrapper or layout components.

**Q7. How do you pass a number or boolean as a prop?**
> Use curly braces `{}`. Example: `<Card count={5} isActive={true} />`. Without `{}`, everything is treated as a string.

**Q8. What is the difference between passing props using `{}` destructuring vs `props` object?**
> Both work the same way. Destructuring (`{ name, age }`) is cleaner and more readable. The `props` object approach (`props.name`) is more explicit but verbose.

**Q9. Can you pass a function as a prop?**
> Yes. Functions are commonly passed as props to allow child components to communicate back to the parent (callback pattern). Example: `<Button onClick={handleClick} />`.

**Q10. Why are props important for reusability?**
> Props allow the same component to render different content based on the data passed in. For example, one `UserCard` component can display hundreds of different users just by passing different props each time.

**Q11. What is prop drilling? What is the problem with it?**
> Prop drilling is passing props through multiple intermediate components just to reach a deeply nested child. It works but becomes hard to maintain as the component tree grows. Solutions include Context API or state management libraries.

**Q12. What is the spread operator used for with props?**
> It allows passing all properties of an object as individual props at once. Example: `<UserCard {...userDetails} />` is the same as writing each prop manually.

**Q13. Why is the `key` prop important when rendering lists?**
> React uses `key` to identify which items in a list have changed, been added, or removed. Without it, React may re-render incorrectly and will show a console warning.

**Q14. What are PropTypes? Why are they used?**
> PropTypes is a library for runtime type-checking of props. It warns in the console during development if a wrong type or missing required prop is passed to a component.

**Q15. Can you name the parameter anything instead of `props`?**
> Yes. `props` is just a JavaScript function parameter name. You can use `info`, `data`, or anything else. However, `props` is the community convention. When using destructuring `{ name, age }`, the parameter name is irrelevant.

---

> ⏭️ Next Topic: **useState Hook** — Managing state inside components (covered in `component_03`).
