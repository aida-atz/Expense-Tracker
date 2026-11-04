# Expense Tracker — Node.js & Express.js

A learning project for building an expense-tracking backend with **Node.js**, **Express.js**, and server-rendered views. The project is being developed step by step while following the Node.js course, with each topic applied to a practical expense-tracking example.

> **Project status:** Learning / in development. Transactions are currently stored **in memory**, not in a database.

## What I've Built So Far

### 1. Node.js fundamentals

- Worked with the native Node.js HTTP server and request/response lifecycle.
- Practiced routing based on HTTP methods and URL paths.
- Handled incoming form data and request bodies.
- Used CommonJS modules (`require()` and `module.exports`) to organize code.
- Worked with Node.js path and filesystem concepts for serving files.
- Set up npm scripts and used **nodemon** for local development.
- Practiced debugging with VS Code and Node.js breakpoints.

### 2. Express.js basics

- Created an Express application and started a local server.
- Used middleware with `app.use()` and learned how middleware order affects requests.
- Used `next()` to pass control to subsequent middleware.
- Defined routes using `app.get()` and `app.post()`.
- Parsed HTML form submissions with `express.urlencoded({ extended: false })`.
- Organized transaction endpoints using `express.Router()`.
- Implemented a fallback **404 page**.
- Served static resources such as CSS through `express.static()`.
- Served HTML pages using `res.sendFile()` and reusable paths with Node.js `path` utilities.

### 3. Transaction handling

- Created a form to submit a transaction's **amount** and **category**.
- Accepted transactions through `POST /transactions`.
- Stored submitted transactions in a shared, module-level JavaScript array.
- Returned all saved transactions as JSON using `GET /transactions` and `res.json()`.
- Learned the difference between submitting data with POST and retrieving it with GET.
- Practiced debugging data flow between routes with `console.log()`.

**Current transaction format:**

```json
{
  "amount": "20",
  "category": "Food"
}
```

> Values from a standard URL-encoded form, including `amount`, are initially received as strings. Data is lost whenever the server process restarts. The in-memory array is shared across requests and is not user-specific.

### 4. Dynamic HTML with Pug

- Installed and configured the **Pug** template engine using `app.set("view engine", "pug")`.
- Rendered templates with `res.render()`.
- Passed dynamic values, including `pageTitle` and transaction data, from Express routes to templates.
- Rendered transaction lists with Pug's `each` loop.
- Displayed an empty-state message using conditional rendering.
- Converted the Add Transaction form from HTML into Pug.
- Created a reusable **`layout.pug`** with `extends` and `block content`.
- Added a shared navigation menu and CSS across Pug pages.
- Implemented page-aware navigation using `activePage` and conditional `active` classes.
- Used a dynamic browser page title and heading via `pageTitle`.

## Application Routes

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/` | Show the home page. |
| `GET` | `/add-transaction` | Display the transaction submission form. |
| `POST` | `/transactions` | Receive and store a transaction in memory. |
| `GET` | `/transactions` | Return stored transactions as JSON. |
| `GET` | `/transactions/view` | Render a Pug page showing stored transactions. |
| `GET` | `/budgets` | Show a basic placeholder response for monthly budgets. |
| `GET` | `/test-pug` | Practice rendering an introductory Pug template. |

An unmatched request is handled by the fallback **404** middleware.

> Some routes (such as `/test-pug` and `/budgets`) are learning/demo endpoints rather than completed production features.

## Project Structure

The main files and folders used in the exercises are organized approximately as follows:

```text
expense-tracker/
├── server.cjs
├── routes/
│   └── transactions.cjs
├── utils/
│   └── path.cjs
├── views/
│   ├── layout.pug
│   ├── add-transaction.pug
│   ├── transactions.pug
│   ├── home.html            # Original HTML home view
│   ├── 404.html
│   └── test.pug             # Learning/demo template
├── public/
│   └── css/
│       ├── main.css
│       └── 404.css
├── package.json
└── README.md
```

> The home page may have been migrated to `home.pug` during the Pug exercises. Keep whichever file exists in your current repository and update this tree to match.

## Technologies Used

- **Node.js** — JavaScript runtime and core server concepts.
- **Express.js** — routing, middleware, and HTTP responses.
- **Pug** — server-side HTML templating and reusable layouts.
- **HTML / CSS** — forms, navigation, and page styling.
- **npm / nodemon** — dependency management and development workflow.
- **CommonJS** — modular project organization with `.cjs` files.

## Getting Started

### Prerequisites

- Node.js and npm installed.

### Installation

```bash
git clone <your-repository-url>
cd <your-project-folder>
npm install
```

### Run locally

If your `package.json` defines a development script:

```bash
npm run dev
```

Otherwise, start the server directly:

```bash
node server.cjs
```

Then visit:

- `http://localhost:3000/`
- `http://localhost:3000/add-transaction`
- `http://localhost:3000/transactions`
- `http://localhost:3000/transactions/view`

## How to Test the Current Flow

1. Open `/add-transaction` in the browser.
2. Enter an amount and a category, then submit the form.
3. Open `/transactions` to inspect the JSON response.
4. Open `/transactions/view` to see the transactions rendered as HTML with Pug.
5. Restart the server and notice that the stored transactions disappear, because there is no database yet.

## Important Concepts Learned

- **Middleware execution order:** Express handles requests through a sequence of matching middleware and route handlers.
- **One response per request:** Sending a response with `res.send()` or `res.json()` finishes that response; sending another response afterward causes an error.
- **JSON vs. rendered HTML:** `res.json()` returns API data, while `res.render()` generates HTML from a template.
- **Shared in-memory state:** A module-level array can persist across requests while the server runs, but is cleared on restart and is shared across users.
- **Template inheritance:** Pug's `extends` and `block` help avoid repeating HTML structures across pages.
- **Dynamic navigation:** Express passes `activePage`; the template conditionally adds an `active` CSS class to the current page link.

## Next Steps

These are **planned**, not completed features:

- Learn **Handlebars** and **EJS**, and compare them with Pug.
- Add input validation and meaningful error handling.
- Replace in-memory storage with a persistent database.
- Build out the monthly budgets feature.
- Consider separating API routes from server-rendered pages as the application grows.
- Add automated tests.
- Later, connect the backend to a separate frontend application.

## Notes

This repository is an educational project. It is not yet a production-ready expense tracker: it has no persistent storage, user authentication, or user-specific transaction isolation.
