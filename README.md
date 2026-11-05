# Help Study Abroad Admin Portal

A responsive admin portal built with Next.js App Router, Material UI, NextAuth credentials authentication, and Zustand. User and product data comes from the [DummyJSON public API](https://dummyjson.com/).

## Features

- DummyJSON credentials login through a NextAuth Credentials provider.
- Server protected dashboard, user, and product routes.
- User search, API pagination, responsive table/card layouts, and full user profile pages.
- Product search, category filter, API pagination, responsive product grid, image gallery, specifications, and reviews.
- Zustand stores own the async auth, user, and product state.
- Five minute in-memory cache for successful user/product list and detail results, plus product categories. Cache keys include the search/filter and pagination parameters, so returning to a page avoids another request while data is fresh.
- Search input is debounced; list requests use API-side `limit` and `skip` pagination.

## Requirements

- Node.js 20.9 or newer
- npm

## Setup

From the `frontend` directory:

```bash
npm install
```

Create `.env.local` from the example file and set a random Auth.js secret:

```bash
cp .env.example .env.local
```

Generate a secret with:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64'))"
```

Put the generated value in `.env.local` as `AUTH_SECRET=...`. No API URL or DummyJSON key is required.

Start the development server:

```bash
npm run dev
```

Open <http://localhost:3000>.

## Demo login

Use the DummyJSON demo account:

```text
Username: emilys
Password: emilyspass
```

DummyJSON's auth endpoint accepts a username and password, so this project uses its seeded test account rather than a custom email login.

## Project structure

```text
src/
  app/
    (admin)/             Protected dashboard, users, and products routes
    api/auth/[...nextauth]/ NextAuth route handler
    login/                Public admin login page
  components/             MUI shell, list views, and detail views
  lib/                    DummyJSON fetch helper
  store/                  Zustand auth, users, and products stores
  auth.ts                 NextAuth credentials configuration
```

## State and authentication

NextAuth validates credentials against `POST https://dummyjson.com/auth/login` and keeps the signed-in session in its JWT session cookie. A client sync component copies the user and access token into the Zustand auth store. Zustand persists the profile for display and keeps the bearer token in memory only; the server checks the NextAuth session before rendering the protected route group.

Zustand was chosen for its small footprint and simple async actions. Keeping data and request/loading/error state together avoids Redux reducer and provider boilerplate for an app of this size.

## Data endpoints

- `GET /users?limit=10&skip=...`
- `GET /users/search?q=...&limit=10&skip=...`
- `GET /users/{id}`
- `GET /products?limit=10&skip=...`
- `GET /products/search?q=...&limit=10&skip=...`
- `GET /products/category/{category}?limit=10&skip=...`
- `GET /products/category-list`
- `GET /products/{id}`

## Commands

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Submission status

Pending: create a public GitHub repository, push this project, and add the repository link here.
