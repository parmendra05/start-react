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

`children` is a **special built-in prop** that React automatically provides — you don't pass it like a normal prop. It represents whatever JSX you place **between the opening and closing tags** of a component.

### How it works:
```jsx
// Without children — self-closing, nothing inside
<Card />

// With children — content placed between tags
<Card>
  <h2>Hello</h2>
  <p>This is inside the card.</p>
</Card>
```

React automatically passes everything between `<Card>` and `</Card>` as `props.children` to the component.

### Receiving and rendering children:
```jsx
function Card({ children }) {
  return <div className="card">{children}</div>;
}
```

- `children` can be a single element, multiple elements, plain text, or even another component.
- You render it just like any other prop using `{children}` inside JSX.

### Real-world examples:

**Example 1 — Layout / Wrapper component:**
```jsx
function PageLayout({ children }) {
  return (
    <div>
      <header>My App</header>
      <main>{children}</main>       {/* page content goes here */}
      <footer>Footer</footer>
    </div>
  );
}

// Usage
<PageLayout>
  <h1>Welcome to Dashboard</h1>
  <p>Here is your data.</p>
</PageLayout>
```

**Example 2 — Button with custom label:**
```jsx
function Button({ children, onClick }) {
  return <button onClick={onClick}>{children}</button>;
}

// Usage — children is just text here
<Button onClick={handleSave}>Save Changes</Button>
<Button onClick={handleDelete}>Delete</Button>
```

**Example 3 — children can be checked:**
```jsx
function Card({ children }) {
  return (
    <div className="card">
      {children ? children : <p>No content provided.</p>}
    </div>
  );
}
```

### Key Points:
- `children` is **automatically** provided by React — you never pass it explicitly like `children={...}`.
- It is just a regular prop under the hood — you can also access it as `props.children`.
- Very useful for building **reusable wrapper, layout, and container components**.
- `children` can be: text, a single element, multiple elements, or another component.

```
Parent passes JSX between tags
           ↓
   React sets props.children
           ↓
  Child renders {children}
```

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

## 10. Renaming Props While Destructuring

You can rename a prop to a different variable name while destructuring — useful when the prop name conflicts with an existing variable or you want a clearer local name.

```jsx
// Rename: firstName is received as prop, used as name locally
function UserCard({ firstName: name, age: userAge }) {
  return (
    <div>
      <h2>{name}</h2>      {/* using renamed variable */}
      <p>{userAge}</p>
    </div>
  );
}

// Usage — still pass the original prop name
<UserCard firstName="Raju" age={25} />
```

- Syntax: `{ propName: localName }` — left side is the prop name, right side is the local variable name.
- The parent still passes `firstName` — only the variable name inside the component changes.

---

## 11. Nested Props — Passing Objects & Accessing Them

When you pass an object as a prop, you access its fields using dot notation inside the component.

```jsx
// Passing an object as a prop
<UserCard
  user={{ name: "Raju", age: 25, city: "Hyderabad" }}
/>

// Receiving and accessing nested fields
function UserCard({ user }) {
  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.age}</p>
      <p>{user.city}</p>
    </div>
  );
}
```

### Destructuring nested object props:
```jsx
// Destructure the nested object directly in the parameter
function UserCard({ user: { name, age, city } }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{age}</p>
      <p>{city}</p>
    </div>
  );
}
```

- Cleaner — no need to write `user.name`, `user.age` everywhere.
- Works the same as regular JS destructuring.

---

## 12. Callback Props — Child to Parent Communication

Props flow **only downward** (parent → child). But what if a child needs to send data **back up** to the parent?

The answer is **callback props** — the parent passes a function as a prop, the child calls it when something happens.

```
Parent defines function → passes it as prop → Child calls it → Parent receives data
```

### Example — Child sends data up to Parent:
```jsx
function Parent() {
  function handleNameReceived(name) {
    console.log('Child sent:', name);  // receives data from child
  }

  return <Child onNameSubmit={handleNameReceived} />;
  //            ↑ passing function as prop
}

function Child({ onNameSubmit }) {
  return (
    <button onClick={() => onNameSubmit('Raju')}>
      Send Name to Parent
    </button>
    //              ↑ child calls the function, passes data up
  );
}
```

### Real example — input in child, state in parent:
```jsx
function Parent() {
  const [message, setMessage] = useState('');

  return (
    <div>
      <p>Message from child: {message}</p>
      <Child onMessageChange={setMessage} />
    </div>
  );
}

function Child({ onMessageChange }) {
  return (
    <input
      onChange={(e) => onMessageChange(e.target.value)}
      placeholder="Type something"
    />
  );
}
```

- Parent owns the state (`message`).
- Child receives `onMessageChange` as a prop and calls it on every keystroke.
- Parent's state updates — UI re-renders with the new value.
- This is the standard React pattern for **lifting state up**.

---

## 13. The `key` Prop — In Depth

`key` is a **special reserved prop** in React — it is not accessible inside the component like regular props. React uses it internally.

### Why React needs `key`:
When rendering a list, React needs to track which item is which across re-renders. Without `key`, React can't tell if an item was added, removed, or just moved — leading to wrong re-renders and UI bugs.

```jsx
// ❌ No key — React warns and may render incorrectly
{users.map((user) => (
  <UserCard name={user.name} />
))}

// ✅ With key — React tracks each item correctly
{users.map((user) => (
  <UserCard key={user.id} name={user.name} />
))}
```

### Rules for `key`:
- Must be **unique among siblings** — not globally unique, just within the same list.
- Should be **stable** — same item should always have the same key across renders.
- Use a **unique id** from your data — not the array index if the list can change.

### Why not use array index as key:
```jsx
// ⚠️ Avoid — index as key causes bugs when list order changes
{users.map((user, index) => (
  <UserCard key={index} name={user.name} />
))}
```

- If you add an item to the beginning, all indexes shift — React thinks every item changed.
- This causes unnecessary re-renders and can break component state.

```jsx
// ✅ Use a stable unique id
{users.map((user) => (
  <UserCard key={user.id} name={user.name} />
))}
```

### Key is NOT accessible as a prop:
```jsx
function UserCard({ key, name }) {
  console.log(key);  // ⚠️ undefined — key is reserved, React doesn't pass it
}

// If you need the id inside the component, pass it separately
<UserCard key={user.id} id={user.id} name={user.name} />
```

---

## 14. Rendering Lists with Props

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

## 15. PropTypes — Type Checking for Props

### What is PropTypes?
PropTypes is a **built-in type checking library** for React props. It validates that the correct data types are passed to a component and warns you in the browser console during development if something is wrong.

### Why use PropTypes?
- Catches bugs early — wrong data type passed? You get a clear warning.
- Acts as **documentation** — anyone reading the component knows exactly what props it expects.
- Helps in team projects where multiple developers use the same components.

### Installation:
```bash
npm install prop-types
```

### Basic Usage:
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

// Define propTypes on the component
UserCard.propTypes = {
  name: PropTypes.string.isRequired,  // must be a string AND required
  age:  PropTypes.number.isRequired,  // must be a number AND required
};
```

### All Common PropTypes:
| PropType | Validates |
|---|---|
| `PropTypes.string` | String value |
| `PropTypes.number` | Number value |
| `PropTypes.bool` | Boolean (true/false) |
| `PropTypes.array` | Array |
| `PropTypes.object` | Object |
| `PropTypes.func` | Function |
| `PropTypes.node` | Anything renderable (string, number, JSX) |
| `PropTypes.element` | A React element (`<Component />`) |
| `PropTypes.any` | Any data type |

### `.isRequired`:
- Add `.isRequired` to any type to make the prop **mandatory**.
- If the prop is missing, React shows a warning in the console.
```jsx
UserCard.propTypes = {
  name: PropTypes.string.isRequired,   // required
  age:  PropTypes.number,              // optional — no warning if missing
};
```

### Default Values with PropTypes:
- Use `defaultProps` to set fallback values for optional props.
```jsx
UserCard.defaultProps = {
  age: 18,   // used if age prop is not passed
};
```

### PropTypes for Arrays & Objects:
```jsx
UserCard.propTypes = {
  scores:  PropTypes.arrayOf(PropTypes.number),   // array of numbers
  address: PropTypes.shape({                       // object with specific shape
    city:  PropTypes.string,
    pin:   PropTypes.string,
  }),
};
```

### PropTypes for children:
```jsx
Card.propTypes = {
  children: PropTypes.node.isRequired,   // anything renderable, required
};
```

### Full Example:
```jsx
import PropTypes from 'prop-types';

function UserCard({ name, age, isActive, scores }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>Age: {age}</p>
      <p>Status: {isActive ? 'Active' : 'Inactive'}</p>
      <p>Scores: {scores.join(', ')}</p>
    </div>
  );
}

UserCard.propTypes = {
  name:     PropTypes.string.isRequired,
  age:      PropTypes.number.isRequired,
  isActive: PropTypes.bool,
  scores:   PropTypes.arrayOf(PropTypes.number),
};

UserCard.defaultProps = {
  isActive: true,
  scores:   [],
};
```

### PropTypes vs TypeScript:
| | PropTypes | TypeScript |
|---|---|---|
| When it checks | Runtime (in browser) | Compile time (before running) |
| Setup needed | `npm install prop-types` | TypeScript project setup |
| Error visibility | Console warning | Code editor error |
| Used in | `.jsx` projects | `.tsx` projects |
| Recommended for | Beginners / JS projects | Production / large projects |

> PropTypes only run in **development mode** — they are stripped out in production builds, so there is no performance impact.

---

## 16. Key Rules of Props

| Rule | Detail |
|---|---|
| Read-only | Never modify props inside the child component |
| Any data type | Strings, numbers, booleans, arrays, objects, functions |
| Default values | Set in function parameters `= defaultValue` |
| One-way flow | Parent → Child only |
| `children` | Special prop for nested JSX content |

---

## 17. Props vs State (Quick Preview)

| | Props | State |
|---|---|---|
| Who controls it? | Parent component | The component itself |
| Mutable? | ❌ No (read-only) | ✅ Yes |
| Purpose | Pass data into a component | Manage data inside a component |
| Hook used | None | `useState` |

> Full details on **State** → covered in `component_03`.

---

## 18. Interview Questions

**Q1. What are props in React?**
> Props are read-only inputs passed from a parent component to a child component, similar to function arguments. They make components dynamic and reusable.

**Q2. Can a child component modify its props?**
> No. Props are immutable (read-only). A child component should never modify the props it receives. For mutable data, use state.

**Q3. What is the difference between props and state?**
> Props are passed from parent to child and are read-only. State is managed within the component itself and can be changed using `useState`.

**Q4. What are default props? How do you define them?**
> There are two ways. First, directly in the function parameters: `function Person({ name = "Raju" })` — this is the modern recommended way. Second, using `defaultProps` object on the component: `Person.defaultProps = { name: "Raju" }` — this is the older approach but still valid.

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

**Q16. What are callback props? How does a child communicate with a parent?**
> Since props only flow downward, a child communicates with a parent by calling a function passed as a prop. The parent defines the function, passes it as a prop, and the child calls it with data — this is called the callback prop pattern or "lifting state up".

**Q17. How do you rename a prop while destructuring?**
> Use the syntax `{ propName: localName }` in the destructuring. Example: `function UserCard({ firstName: name })` — the parent passes `firstName`, but inside the component it's used as `name`.

**Q18. Why should you avoid using array index as a `key` in lists?**
> When the list order changes (items added, removed, or reordered), indexes shift — React thinks every item changed and re-renders all of them. This causes performance issues and can break component state. Always use a stable unique id instead.

**Q19. Can you access `key` inside a component as a prop?**
> No. `key` is a reserved prop used internally by React and is never passed to the component. If you need the id value inside the component, pass it as a separate prop: `<UserCard key={user.id} id={user.id} />`.

**Q20. What is "lifting state up" in React?**
> Lifting state up means moving state to the closest common parent component so it can be shared between sibling components. The parent holds the state and passes it down via props, and children communicate back up via callback props.

---

> ⏭️ Next Topic: **useState Hook** — Managing state inside components (covered in `component_03`).
