# React - Tailwind CSS

---

## 1. What is Tailwind CSS?

Tailwind CSS is a **utility-first CSS framework**. Instead of writing CSS in a separate file, you apply small pre-built classes directly in your HTML/JSX.

```
Traditional CSS approach:
  → you write a class name in JSX
  → you go to a CSS file and write the styles there

Tailwind approach:
  → you write the styles directly as class names in JSX
  → no separate CSS file needed
```

### Example — same button, two approaches:

```jsx
// ── Traditional CSS ──────────────────────────
// Button.css
.btn {
  background-color: blue;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 16px;
}

// Button.jsx
<button className="btn">Click Me</button>


// ── Tailwind CSS ─────────────────────────────
// No CSS file needed!
<button className="bg-blue-500 text-white px-4 py-2 rounded-md text-base">
  Click Me
</button>
```

> At first the long class names look strange, but after a short time it feels much faster — you never have to switch between files to style something.

---

## 2. Install Tailwind in a Vite + React Project

```bash
npm install tailwindcss @tailwindcss/vite
```

### Step 1 — Update `vite.config.js`

```js
// vite.config.js
import { defineConfig } from 'vite'
import react            from '@vitejs/plugin-react'
import tailwindcss      from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),   // add tailwind plugin here
  ],
})
```

### Step 2 — Add Tailwind to your main CSS file

Open `src/index.css` and replace everything with just this one line:

```css
/* src/index.css */
@import "tailwindcss";
```

### Step 3 — Make sure index.css is imported in main.jsx

```jsx
// src/main.jsx
import './index.css'   // this should already be there
```

That's it — Tailwind is ready to use. ✅

---

## 3. How Tailwind Classes Work

Every Tailwind class maps directly to one CSS property. Once you learn the pattern, you can guess most class names.

### Spacing (padding & margin):

```
p-4    → padding: 1rem (16px)
px-4   → padding-left & padding-right: 1rem   (x = horizontal)
py-2   → padding-top & padding-bottom: 0.5rem (y = vertical)
pt-2   → padding-top: 0.5rem                  (t = top)
pb-2   → padding-bottom: 0.5rem               (b = bottom)
pl-2   → padding-left: 0.5rem                 (l = left)
pr-2   → padding-right: 0.5rem                (r = right)

m-4    → margin: 1rem
mx-auto → margin-left & margin-right: auto    (center horizontally)
mt-4   → margin-top: 1rem
mb-4   → margin-bottom: 1rem
```

### Sizing:

```
w-full    → width: 100%
w-1/2     → width: 50%
w-64      → width: 16rem (256px)
h-screen  → height: 100vh
h-16      → height: 4rem (64px)
max-w-md  → max-width: 28rem
```

### Colors:

Tailwind has a full color palette. The format is `property-color-shade`.

```
bg-blue-500     → background-color: blue (medium shade)
bg-blue-100     → background-color: blue (very light)
bg-blue-900     → background-color: blue (very dark)
text-white      → color: white
text-gray-700   → color: dark gray
text-red-500    → color: red
border-gray-300 → border-color: light gray
```

### Typography:

```
text-sm       → font-size: 0.875rem (14px)
text-base     → font-size: 1rem (16px)
text-lg       → font-size: 1.125rem (18px)
text-xl       → font-size: 1.25rem (20px)
text-2xl      → font-size: 1.5rem (24px)
font-normal   → font-weight: 400
font-medium   → font-weight: 500
font-bold     → font-weight: 700
text-center   → text-align: center
text-left     → text-align: left
uppercase     → text-transform: uppercase
```

### Borders & Rounded Corners:

```
border          → border: 1px solid
border-2        → border: 2px solid
border-gray-300 → border-color: gray-300
rounded         → border-radius: 0.25rem
rounded-md      → border-radius: 0.375rem
rounded-lg      → border-radius: 0.5rem
rounded-full    → border-radius: 9999px (circle / pill shape)
```

### Display & Layout:

```
block           → display: block
inline          → display: inline
hidden          → display: none
flex            → display: flex
grid            → display: grid
```

---

## 4. Flexbox with Tailwind

Tailwind makes flexbox very easy to use.

```jsx
{/* horizontal row, centered vertically, spaced out */}
<div className="flex items-center justify-between gap-4">
  <p>Left</p>
  <p>Right</p>
</div>

{/* vertical column, centered */}
<div className="flex flex-col items-center gap-4">
  <p>Top</p>
  <p>Bottom</p>
</div>
```

### Flexbox classes:

```
flex              → display: flex
flex-row          → flex-direction: row (default)
flex-col          → flex-direction: column
items-center      → align-items: center
items-start       → align-items: flex-start
items-end         → align-items: flex-end
justify-center    → justify-content: center
justify-between   → justify-content: space-between
justify-end       → justify-content: flex-end
gap-4             → gap: 1rem (space between children)
flex-wrap         → flex-wrap: wrap
flex-1            → flex: 1 (take up remaining space)
```

---

## 5. Grid with Tailwind

```jsx
{/* 3 column grid with gap */}
<div className="grid grid-cols-3 gap-6">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
</div>

{/* 2 columns on small, 4 columns on large */}
<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
  ...
</div>
```

### Grid classes:

```
grid              → display: grid
grid-cols-1       → grid-template-columns: repeat(1, 1fr)
grid-cols-2       → 2 equal columns
grid-cols-3       → 3 equal columns
grid-cols-4       → 4 equal columns
col-span-2        → grid-column: span 2
gap-4             → gap: 1rem
gap-x-4           → column-gap: 1rem
gap-y-4           → row-gap: 1rem
```

---

## 6. Responsive Design

Tailwind uses **breakpoint prefixes** to apply styles at specific screen sizes. You write the breakpoint name followed by `:` before the class.

```
sm:   → min-width: 640px   (small screens and up)
md:   → min-width: 768px   (medium screens and up)
lg:   → min-width: 1024px  (large screens and up)
xl:   → min-width: 1280px  (extra large and up)
```

Tailwind is **mobile-first** — classes without a prefix apply to all screen sizes. Prefixed classes override them at larger sizes.

```jsx
{/* small: full width, medium: half width, large: one-third */}
<div className="w-full md:w-1/2 lg:w-1/3">
  Content
</div>

{/* 1 column on mobile, 2 on tablet, 3 on desktop */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
</div>

{/* hide on mobile, show on medium and above */}
<p className="hidden md:block">Only visible on tablet and up</p>

{/* text size changes with screen size */}
<h1 className="text-xl md:text-3xl lg:text-5xl font-bold">
  Hello World
</h1>
```

---

## 7. Hover, Focus, and State Variants

Add `hover:`, `focus:`, `active:` before any class to apply it only in that state.

```jsx
{/* button that changes color on hover */}
<button className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded">
  Hover Me
</button>

{/* input that shows a blue border on focus */}
<input
  className="border border-gray-300 focus:border-blue-500 focus:outline-none px-3 py-2 rounded"
  placeholder="Type here..."
/>

{/* scale up on hover */}
<div className="hover:scale-105 transition-transform duration-200">
  Card
</div>
```

### Common state variants:

```
hover:bg-blue-700    → background changes on hover
focus:border-blue-500 → border changes on focus
active:bg-blue-800   → background changes when clicked
disabled:opacity-50  → reduce opacity when disabled
```

---

## 8. Transitions and Animations

```jsx
{/* smooth color transition on hover */}
<button className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors duration-300">
  Smooth Hover
</button>

{/* fade in/scale on hover */}
<div className="opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-200">
  Hover me
</div>
```

### Transition classes:

```
transition            → transition all properties
transition-colors     → transition only color changes
transition-transform  → transition only transform changes
duration-150          → 150ms
duration-300          → 300ms
duration-500          → 500ms
ease-in               → slow start
ease-out              → slow end
ease-in-out           → slow start and end
```

---

## 9. Dark Mode

Tailwind supports dark mode using the `dark:` prefix. Enable it by adding `dark` class to your `<html>` element.

```jsx
{/* these styles apply only in dark mode */}
<div className="bg-white text-black dark:bg-gray-900 dark:text-white p-4">
  This adapts to dark mode
</div>
```

```jsx
// Toggle dark mode by adding/removing "dark" class on <html>
function DarkModeToggle() {
  function toggleDark() {
    document.documentElement.classList.toggle('dark')
  }

  return (
    <button
      onClick={toggleDark}
      className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded"
    >
      Toggle Dark Mode
    </button>
  )
}

export default DarkModeToggle
```

---

## 10. Real Component Examples

### Navbar:

```jsx
function Navbar() {
  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
      <h1 className="text-xl font-bold">MyApp</h1>

      <div className="flex gap-6">
        <a href="/"        className="hover:text-blue-400 transition-colors">Home</a>
        <a href="/about"   className="hover:text-blue-400 transition-colors">About</a>
        <a href="/contact" className="hover:text-blue-400 transition-colors">Contact</a>
      </div>
    </nav>
  )
}
```

---

### User Card:

```jsx
function UserCard({ name, email, role }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 max-w-sm">
      {/* Avatar circle */}
      <div className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-bold mb-4">
        {name.charAt(0).toUpperCase()}
      </div>

      <h2 className="text-lg font-semibold text-gray-800">{name}</h2>
      <p className="text-sm text-gray-500">{email}</p>

      <span className="inline-block mt-3 bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
        {role}
      </span>
    </div>
  )
}
```

---

### Input Field:

```jsx
function InputField({ label, placeholder }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        placeholder={placeholder}
        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
    </div>
  )
}
```

---

### Button Variants:

```jsx
function Buttons() {
  return (
    <div className="flex gap-4">
      {/* Primary */}
      <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg transition-colors">
        Primary
      </button>

      {/* Secondary */}
      <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-5 py-2 rounded-lg transition-colors">
        Secondary
      </button>

      {/* Danger */}
      <button className="bg-red-500 hover:bg-red-600 text-white font-medium px-5 py-2 rounded-lg transition-colors">
        Delete
      </button>

      {/* Outline */}
      <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium px-5 py-2 rounded-lg transition-colors">
        Outline
      </button>
    </div>
  )
}
```

---

### Login Form:

```jsx
function LoginForm() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md">

        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login</h2>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="john@example.com"
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors mt-2">
            Sign In
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-600 hover:underline">Sign up</a>
        </p>

      </div>
    </div>
  )
}

export default LoginForm
```

---

## 11. Conditional Classes in React (Dynamic Styling)

Sometimes you need to apply a class based on a condition — like making a button look different when it's active or disabled.

```jsx
function StatusBadge({ status }) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${
        status === 'active'   ? 'bg-green-100 text-green-700' :
        status === 'inactive' ? 'bg-red-100   text-red-700'   :
                                'bg-gray-100  text-gray-700'
      }`}
    >
      {status}
    </span>
  )
}
```

### Using the `clsx` library (cleaner for complex conditions):

```bash
npm install clsx
```

```jsx
import clsx from 'clsx'

function Button({ variant = 'primary', disabled, children }) {
  return (
    <button
      disabled={disabled}
      className={clsx(
        'px-4 py-2 rounded-lg font-medium transition-colors',  // always applied
        variant === 'primary'   && 'bg-blue-600 hover:bg-blue-700 text-white',
        variant === 'secondary' && 'bg-gray-100 hover:bg-gray-200 text-gray-800',
        variant === 'danger'    && 'bg-red-500  hover:bg-red-600  text-white',
        disabled                && 'opacity-50 cursor-not-allowed',
      )}
    >
      {children}
    </button>
  )
}

export default Button
```

> `clsx` cleanly handles conditional classes without messy template literal strings.

---

## 12. Tailwind — Quick Cheatsheet

### Spacing scale (Tailwind uses 4px = 1 unit):
```
1  = 4px     2  = 8px     3  = 12px    4  = 16px
5  = 20px    6  = 24px    8  = 32px    10 = 40px
12 = 48px    16 = 64px    20 = 80px    24 = 96px
```

### Most used classes at a glance:
```
Layout:     flex, grid, block, hidden, container, mx-auto
Flex:       flex-col, items-center, justify-between, justify-center, gap-4, flex-1
Grid:       grid-cols-2, grid-cols-3, col-span-2, gap-4
Spacing:    p-4, px-6, py-3, m-4, mt-2, mb-4, gap-4
Sizing:     w-full, w-1/2, h-screen, h-16, max-w-md, max-w-lg
Colors:     bg-blue-500, text-white, text-gray-700, border-gray-300
Text:       text-sm, text-lg, text-2xl, font-bold, font-medium, text-center
Borders:    border, border-2, rounded, rounded-lg, rounded-full
Shadows:    shadow, shadow-md, shadow-lg
States:     hover:bg-blue-700, focus:border-blue-500, active:bg-blue-800
Responsive: sm:, md:, lg:, xl:
Transition: transition-colors, duration-300, ease-in-out
Dark mode:  dark:bg-gray-900, dark:text-white
```

---

## 13. Tailwind vs Traditional CSS vs CSS Modules

| | Traditional CSS | CSS Modules | Tailwind CSS |
|---|---|---|---|
| Where styles live | Separate `.css` file | Separate `.module.css` file | Directly in JSX className |
| Naming classes | You name everything | You name everything | Pre-named utility classes |
| Risk of name conflicts | High | None (scoped) | None (utility classes) |
| Switching files | Constantly | Constantly | Never |
| Learning curve | Low | Low | Medium (memorize classes) |
| Consistency | Depends on developer | Depends on developer | Built-in design system |
| Best for | Small projects | Component libraries | Most React projects |

---

## 14. Interview Questions

**Q1. What is Tailwind CSS and how is it different from regular CSS?**
> Tailwind is a utility-first CSS framework where you apply small single-purpose classes directly in your JSX instead of writing CSS in a separate file. Regular CSS requires you to name classes and write their styles separately. Tailwind eliminates that context-switching — you style everything in one place.

**Q2. What does "utility-first" mean?**
> It means every class does exactly one thing — `text-center` centers text, `bg-blue-500` sets a background color, `p-4` adds padding. You compose styles by combining many small classes instead of writing one large custom class.

**Q3. How do you install Tailwind in a Vite + React project?**
> Install with `npm install tailwindcss @tailwindcss/vite`, add the Tailwind plugin to `vite.config.js`, and add `@import "tailwindcss"` to your main CSS file. No config file needed with the latest version.

**Q4. What is the Tailwind spacing scale?**
> Tailwind's spacing scale is based on 4px increments. `p-1` = 4px, `p-2` = 8px, `p-4` = 16px, `p-8` = 32px, and so on. This creates visual consistency across your whole app.

**Q5. How does responsive design work in Tailwind?**
> Tailwind is mobile-first. Classes without a prefix apply to all sizes. Breakpoint prefixes (`sm:`, `md:`, `lg:`, `xl:`) apply styles at that screen size and above. For example `grid-cols-1 md:grid-cols-3` means 1 column on mobile and 3 columns on medium screens and up.

**Q6. How do you apply hover styles in Tailwind?**
> Add `hover:` before any class — for example `hover:bg-blue-700`. It applies that class only when the user hovers over the element. Same pattern for other states: `focus:`, `active:`, `disabled:`.

**Q7. How do you handle conditional classes in React with Tailwind?**
> You can use template literals with a ternary: `` className={`base-class ${condition ? 'class-a' : 'class-b'}`} ``. For complex conditions, use the `clsx` library which lets you pass objects and arrays of classes more cleanly.

**Q8. What is the `dark:` prefix in Tailwind?**
> The `dark:` prefix applies a class only when dark mode is active. Dark mode is enabled by adding the `dark` class to the `<html>` element. For example `bg-white dark:bg-gray-900` gives a white background normally and dark background in dark mode.

**Q9. What is the difference between `px-4` and `p-4` in Tailwind?**
> `p-4` adds padding on all four sides. `px-4` adds padding only on the left and right (horizontal axis). Similarly `py-4` adds padding only on top and bottom. `pt`, `pb`, `pl`, `pr` target individual sides.

**Q10. What is `mx-auto` used for?**
> `mx-auto` sets `margin-left: auto` and `margin-right: auto` — this centers a block element horizontally inside its parent. It's commonly used with `max-w-md` or similar width classes to create a centered container.

**Q11. What is `clsx` and why would you use it with Tailwind?**
> `clsx` is a small utility that builds a className string from an array of conditions. It's cleaner than long template literals when you have many conditional classes. You pass strings that are always applied and `condition && 'class'` pairs for conditional ones — `clsx` filters out any false values.

**Q12. What is a major advantage of Tailwind over writing custom CSS?**
> No naming — you never have to invent class names like `.card-header-wrapper`. No file switching — styles live next to the JSX. Built-in design system — the color palette, spacing scale, and type scale are all consistent by default. And unused styles are automatically removed from the production bundle, keeping file sizes small.

---

> ⏭️ Next Topic: **Performance Optimization** — covered in `component_12`.
