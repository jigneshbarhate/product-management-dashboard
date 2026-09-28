# Product Management Dashboard

A responsive, high-performance React application built for managing product inventory. The application fetches live data from the **DummyJSON API**, provides instant search, category filtering, sorting, client-side pagination, detailed product views, and a validated product addition form that persists items to global state.

---

## 🚀 Project Overview

The **Product Management Dashboard** is built following modern React best practices using standard JavaScript (ES6+), Tailwind CSS v4, and Zustand state management. It provides a dual layout design—a structured data table for desktop viewports and a card-based layout for mobile and tablet devices (responsive down to 360px width).

---

## 🛠️ Technology Choices

| Technology | Purpose | Rationale |
| :--- | :--- | :--- |
| **React 19** | UI Library | Component-driven declarative UI development. |
| **Vite** | Build Tool & Dev Server | Fast HMR (Hot Module Replacement) and optimized production bundle builds. |
| **JavaScript (ES6+)** | Language | Lightweight, straightforward execution without TypeScript transpilation overhead. |
| **Tailwind CSS v4** | Utility-first Styling | Clean, responsive design system with utilities for responsive breakpoints. |
| **React Router DOM v7** | Single-Page Routing | Client-side routing with support for `React.lazy()` route code splitting. |
| **Zustand** | Global State Management | Lightweight, centralized store for search, filters, sorting, and local product state. |
| **Lucide React** | Icons | Crisp, accessible vector icons for actions, states, and UI controls. |

---

## 💡 Why Zustand Was Selected

Zustand was chosen over alternative state management solutions (such as Redux Toolkit or Context API) for the following reasons:

1. **Minimal Boilerplate**: Unlike Redux, Zustand requires no reducers, actions, action types, or boilerplate wrapper providers in `<App />`.
2. **High Performance**: Zustand allows components to subscribe selectively to specific slice selectors, eliminating unnecessary re-renders across unmounted or unrelated components.
3. **Clean Store API**: Defining actions and state mutations directly inside `create()` makes state logic straightforward to trace and update.
4. **Simple Integration**: Easily accessed inside both functional components and utility hooks without requiring provider wrapping.

---

## ⚡ Performance Optimizations

The application implements two critical performance features:

### 1. Route Lazy Loading (`React.lazy` & `Suspense`)
All major pages (`ProductsPage`, `ProductDetailsPage`, and `AddProductPage`) are dynamically imported using `React.lazy()` inside `src/routes/AppRoutes.jsx`. 
- **Benefit**: Reduces the initial JavaScript bundle size loaded on first application visit.
- **Implementation**: Wrapped with `<Suspense fallback={<LoadingState />}>` to display a smooth fallback loader during dynamic chunk fetches.

### 2. Debounced Search (500ms)
The search input in `src/components/SearchBar.jsx` uses a custom `useDebounce` hook (`src/hooks/useDebounce.js`) with a **500ms delay**.
- **Benefit**: Prevents heavy filter and store re-computation on every single keystroke while typing in the search box.
- **Implementation**: User input updates local input state instantly for zero-latency typing feedback, while the global Zustand store search state updates only after 500ms of user typing inactivity.

---

## 📁 Folder Structure

```
src/
├── components/
│   ├── ProductCard.jsx       # Mobile/Tablet card layout
│   ├── ProductTable.jsx      # Desktop table layout
│   ├── ProductFilters.jsx    # Category filter & Price/Rating sorting
│   ├── SearchBar.jsx         # Debounced product search input
│   ├── Pagination.jsx        # Client-side pagination controls (10 items/page)
│   ├── LoadingState.jsx      # Skeleton & spinner loading state
│   ├── ErrorState.jsx        # Error display & retry trigger
│   ├── EmptyState.jsx        # No results feedback & reset trigger
│   └── ProductForm.jsx       # Validated product creation form
├── pages/
│   ├── ProductsPage.jsx       # Product listing page (/ route)
│   ├── ProductDetailsPage.jsx # Product details view (/products/:id route)
│   └── AddProductPage.jsx     # Add product page (/products/add route)
├── services/
│   └── productService.js     # API integration layer for DummyJSON
├── store/
│   └── productStore.js       # Zustand global state store
├── hooks/
│   └── useDebounce.js        # Debounce custom hook (500ms)
├── utils/
│   └── formatters.js         # Currency, rating, stock status helper functions
├── layouts/
│   └── MainLayout.jsx        # Sticky header, content container & footer
├── routes/
│   └── AppRoutes.jsx         # Lazy route setup with Suspense
├── App.jsx                   # Root App wrapper with BrowserRouter
└── main.jsx                  # Application entry point
```

---

## 📥 Setup & Installation Instructions

Follow these steps to run the application locally:

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm (v9.0.0 or higher)

### Installation Commands

1. **Clone or Navigate to the Workspace Directory**:
   ```bash
   cd "c:/Users/Lenovo/product management dashboard"
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173` (or the local URL printed in terminal).

4. **Build for Production**:
   ```bash
   npm run build
   ```

5. **Preview Production Build**:
   ```bash
   npm run preview
   ```

---

## 📌 Assumptions

1. **DummyJSON API Behavior**: 
   - `POST https://dummyjson.com/products/add` simulates product creation on the server and returns a dummy object with a generated `id`. Since DummyJSON does not permanently store added items on their remote database, the application automatically prepends newly added products to the local Zustand store so they persist throughout the browser session.
2. **Category Generation**:
   - Categories are dynamically collected from both API products and newly added local products to ensure dropdown filters always reflect all available categories.
3. **Pagination**:
   - Pagination operates on client-side filtered results with a fixed page size of **10 products per page**.

---

## ⚠️ Known Limitations

1. **DummyJSON Server Persistence**: 
   - Products created via `/products/add` exist in the client-side Zustand store during the session. Refreshing the browser will re-fetch initial data from DummyJSON API.
2. **API Product Rate Limits / Availability**: 
   - Network availability relies on `dummyjson.com`. The application includes a full `ErrorState` with a **Retry** button if the remote server fails to respond.

---

