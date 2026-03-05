# React App Architektur - SSW Trading Demo

Eine React-Anwendung von innen nach aussen erklaert.
Fuer Henning als Referenz und als Praesentationsmaterial.

---

## 1. Der Einstiegspunkt: Wie startet eine React-App?

```
Browser laedt index.html
  -> index.html hat ein <div id="root"></div>
  -> index.html laedt main.tsx (via Vite)
    -> main.tsx rendert <App /> in das root-div
```

```
index.html          Leere HTML-Huelle mit <div id="root">
  main.tsx          Einstiegspunkt: mountet React in den DOM
    App.tsx         Root-Component: verdrahtet alles
```

**Rails-Analogie:** `index.html` = `application.html.erb`, `main.tsx` = `application.js`, `App.tsx` = `routes.rb` + `application_controller.rb`

### main.tsx (5 Zeilen die zaehlen)
```tsx
initMonitoring()                              // Sentry starten
createRoot(document.getElementById("root")!)  // DOM-Element finden
  .render(<App />)                            // React-Baum reinhaengen
```

### App.tsx (die Verdrahtung)
```tsx
<QueryClientProvider>     // API-Cache fuer die ganze App
  <BrowserRouter>         // URL-basiertes Routing aktivieren
    <AuthProvider>        // Auth-State fuer die ganze App
      <Routes>            // URL -> Component Mapping
        /login  -> LoginPage
        /       -> ProtectedRoute -> Layout
          /           -> DashboardPage
          /trades     -> TradesPage
          /trades/new -> TradeForm
      </Routes>
    </AuthProvider>
  </BrowserRouter>
</QueryClientProvider>
```

**Kernkonzept: Provider-Pattern**
React nutzt "Provider" um Daten an alle Kinder-Components weiterzugeben,
ohne sie durch jede Ebene durchreichen zu muessen.

```
QueryClientProvider  -> Jeder Component kann API-Calls machen
  AuthProvider       -> Jeder Component kann user/login/logout nutzen
    SidebarProvider  -> Jeder Component kennt den Sidebar-State
```

Das ist wie Dependency Injection, nur deklarativ im JSX-Baum.

---

## 2. Die Schichten der Anwendung

```
┌─────────────────────────────────────────────────┐
│                    Browser                       │
├─────────────────────────────────────────────────┤
│  Pages            Was der User sieht             │
│  DashboardPage    (eine Route = eine Page)       │
│  TradesPage                                      │
│  LoginPage                                       │
├─────────────────────────────────────────────────┤
│  Components       Wiederverwendbare UI-Bausteine │
│  Layout           (Sidebar + Content-Area)       │
│  TradeForm        (Formular mit Validierung)     │
│  app-sidebar      (Navigation)                   │
├─────────────────────────────────────────────────┤
│  UI Components    Design-System (shadcn/ui)      │
│  Button, Card,    (Kopiert ins Projekt,          │
│  Table, Input,     nicht als Dependency)         │
│  Dialog, Badge                                   │
├─────────────────────────────────────────────────┤
│  Hooks            Logik ohne UI                  │
│  useTrades()      (API-Calls + Caching)          │
│  useAuth()        (Login-State)                  │
│  use-mobile       (Responsive Detection)         │
├─────────────────────────────────────────────────┤
│  API Layer        Kommunikation mit Backend      │
│  client.ts        (Axios + JWT Interceptor)      │
│  types.ts         (TypeScript Interfaces)        │
│  mock-handlers    (Simuliertes Java-Backend)     │
├─────────────────────────────────────────────────┤
│  Infrastructure   Build, Test, Deploy            │
│  Vite             (Bundler + Dev Server)         │
│  Vitest           (Test Runner)                  │
│  Docker/Nginx     (Production Deployment)        │
│  Sentry           (Error Monitoring)             │
└─────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────┐
│  Java Backend (Spring Boot)                      │
│  REST API auf /api/*                             │
└─────────────────────────────────────────────────┘
```

---

## 3. Datei fuer Datei erklaert

### Schicht 1: Pages (src/pages/)

**Was:** Eine Page = eine Route. Der User navigiert zu einer URL, React zeigt die passende Page.

| Datei | Route | Aufgabe |
|-------|-------|---------|
| `LoginPage.tsx` | `/login` | Login-Formular, ruft useAuth().login() auf |
| `DashboardPage.tsx` | `/` | KPI-Cards + Tabellen, ruft useTrades() + usePositions() auf |
| `TradesPage.tsx` | `/trades` | Trade-Liste mit Cancel-Dialog, ruft useTrades() auf |

**Rails-Analogie:** Eine Page = ein Controller-Action + View kombiniert.

**Pattern:** Pages holen Daten via Hooks und geben sie an UI-Components weiter.
```tsx
function DashboardPage() {
  const { data: trades } = useTrades()    // Daten holen (wie @trades in Rails)
  return <Table>{trades.map(...)}</Table>  // Rendern
}
```

### Schicht 2: Components (src/components/)

**Was:** Wiederverwendbare UI-Bausteine. Bekommen Daten als Props, haben eigene Logik.

| Datei | Aufgabe |
|-------|---------|
| `Layout.tsx` | Sidebar + Header + Content-Area. Nutzt `<Outlet />` fuer verschachtelte Routes |
| `TradeForm.tsx` | Komplexes Formular mit Validierung, dynamischen Feldern, API-Submit |
| `app-sidebar.tsx` | Navigation: Definiert Menue-Struktur, nutzt shadcn Sidebar |
| `nav-main.tsx` | Sidebar-Navigation mit aufklappbaren Gruppen |
| `nav-user.tsx` | User-Dropdown unten in der Sidebar |
| `team-switcher.tsx` | Team/Org-Selector oben in der Sidebar |

**Rails-Analogie:** Components = Partials, aber mit eingebauter Logik.

**Schluessel-Konzept: Outlet**
```tsx
// Layout.tsx
<SidebarProvider>
  <AppSidebar />        // Links: Navigation
  <SidebarInset>
    <header>...</header>
    <Outlet />           // Hier wird die aktuelle Page eingesetzt
  </SidebarInset>        // DashboardPage ODER TradesPage ODER TradeForm
</SidebarProvider>
```
Outlet ist wie `yield` in einem Rails Layout.

### Schicht 3: UI Components (src/components/ui/)

**Was:** Das Design-System. shadcn/ui kopiert diese Dateien in dein Projekt.

| Component | Nutzen |
|-----------|--------|
| `button.tsx` | Button mit Varianten (primary, outline, ghost, destructive) |
| `card.tsx` | Card/CardHeader/CardContent/CardTitle Container |
| `table.tsx` | Gestylte Tabelle |
| `input.tsx` | Text-Input mit konsistentem Styling |
| `select.tsx` | Custom Dropdown (Radix UI basiert, barrierefreit) |
| `dialog.tsx` | Modal/Popup (z.B. "Trade wirklich canceln?") |
| `badge.tsx` | Status-Labels (OPEN, FILLED, BUY, SELL) |
| `sidebar.tsx` | Komplettes Sidebar-System mit Collapse, Mobile, etc. |

**Wichtig:** Diese Dateien gehoeren DIR, nicht einer Library.
Du kannst sie aendern, erweitern, loeschen. Kein npm update bricht was.

**Rails-Analogie:** Wie ViewComponents oder ein eigenes Design-System in app/components/.

### Schicht 4: Hooks (src/hooks/)

**Was:** Wiederverwendbare Logik OHNE UI. Ein Hook ist eine Funktion die State und Seiteneffekte kapselt.

| Hook | Aufgabe |
|------|---------|
| `useTrades()` | GET /api/trades - gibt { data, isLoading, error } zurueck |
| `useCreateTrade()` | POST /api/trades - gibt { mutate, isPending } zurueck |
| `useCancelTrade()` | PATCH /api/trades/:id/cancel |
| `usePositions()` | GET /api/positions |
| `use-mobile` | Erkennt ob Mobile-Viewport (fuer responsive Sidebar) |

**Rails-Analogie:** Hooks = Service Objects / Query Objects.

**Pattern: Custom Hook**
```tsx
// Definition
function useTrades() {
  return useQuery({
    queryKey: ["trades"],              // Cache-Key
    queryFn: () => api.get("/trades"), // API-Call
  })
}

// Nutzung in jeder Page/Component
function TradesPage() {
  const { data, isLoading } = useTrades()
  // TanStack Query kuemmert sich um:
  // - Caching (gleicher Call wird nicht doppelt gemacht)
  // - Loading State
  // - Error State
  // - Automatic Refetch bei Window Focus
  // - Retry bei Fehler
}
```

### Schicht 5: API Layer (src/api/)

**Was:** Alles was mit dem Java-Backend kommuniziert.

| Datei | Aufgabe |
|-------|---------|
| `client.ts` | Axios-Instanz mit Base-URL und JWT-Interceptor |
| `types.ts` | TypeScript Interfaces fuer API-Daten (Trade, Position, User) |
| `mock-data.ts` | Testdaten fuer die Demo |
| `mock-handlers.ts` | Simuliertes Backend (wird spaeter durch echte API ersetzt) |

**client.ts - der wichtigste Teil:**
```tsx
const api = axios.create({ baseURL: "/api" })

// JEDER Request bekommt automatisch den JWT-Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Bei 401 -> automatisch zum Login
api.interceptors.response.use(response => response, (error) => {
  if (error.response?.status === 401) {
    window.location.href = "/login"
  }
})
```

**Rails-Analogie:** `client.ts` = HTTP-Client wie Faraday. `types.ts` = ActiveRecord Model Attribute. `mock-handlers.ts` = Seeds + FactoryBot.

### Schicht 6: Auth (src/auth/)

**Was:** Authentifizierung als eigene Schicht.

| Datei | Aufgabe |
|-------|---------|
| `AuthContext.tsx` | Login/Logout State + Provider fuer die ganze App |
| `ProtectedRoute.tsx` | Wrapper: Nicht eingeloggt? -> Redirect zu /login |

**Pattern: Context + Provider**
```tsx
// AuthContext stellt bereit:
const { user, login, logout, isAuthenticated } = useAuth()

// ProtectedRoute nutzt es:
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" />
  return children
}
```

**Rails-Analogie:** `AuthContext` = Devise current_user. `ProtectedRoute` = before_action :authenticate_user!

---

## 4. Datenfluss: Was passiert wenn ein User einen Trade anlegt?

```
1. User fuellt Formular aus
   TradeForm.tsx: React Hook Form trackt jeden Feldwert

2. User klickt "Submit Trade"
   handleSubmit() -> Zod validiert alle Felder
   Fehler? -> Fehlermeldungen erscheinen sofort, kein API-Call

3. Validierung OK -> API-Call
   useCreateTrade().mutate(data)
   -> TanStack Query ruft mockApi.trades.create(data) auf
   -> In Production: api.post("/trades", data)
   -> isPending = true -> Button zeigt "Submitting..."

4. Server antwortet
   Erfolg:
   -> TanStack Query invalidiert den "trades" Cache
   -> Alle Components die useTrades() nutzen laden automatisch neu
   -> navigate("/trades") -> User sieht die Trade-Liste

   Fehler (422):
   -> setError() setzt Server-Fehler auf die Formularfelder
   -> User sieht "Symbol unbekannt" etc.

   Fehler (401):
   -> Axios Interceptor faengt es ab
   -> Redirect zu /login
```

```
User Input -> React Hook Form -> Zod Validation -> TanStack Query -> Axios -> Java API
                                                         |
                                                    Cache Update
                                                         |
                                                  Auto-Rerender
                                                  aller Components
                                                  die diese Daten nutzen
```

---

## 5. Formulare im Detail (der Kern fuer SSW)

### Drei Formular-Patterns in TradeForm.tsx:

**A) Zod Schema = Validierung + Types**
```tsx
const schema = z.object({
  symbol: z.string().min(1, "Pflicht"),      // Client-Validierung
  quantity: z.number().min(1),
})
type FormData = z.infer<typeof schema>        // TypeScript Type gratis
```
Eine Definition, zwei Nutzen. Kein Auseinanderdriften.

**B) Dynamische Felder (Field Array)**
```tsx
const { fields, append, remove } = useFieldArray({ name: "legs" })
// fields = [{id, symbol, qty, price}, ...]
// append() = Zeile hinzufuegen
// remove(index) = Zeile entfernen
```
User kann beliebig viele "Legs" zu einem Trade hinzufuegen.
React Hook Form tracked jeden Wert performant.

**C) Bedingte Felder (Conditional)**
```tsx
const tradeType = watch("type")              // Live-Wert beobachten
{tradeType === "SELL" && <Input name="reason" />}  // Nur bei SELL sichtbar
```
Felder erscheinen/verschwinden basierend auf anderen Feldwerten.

---

## 6. State Management: Wo lebt welcher State?

| State-Art | Wo | Tool | Beispiel |
|-----------|-----|------|----------|
| **Server State** | Backend | TanStack Query | Trades, Positions |
| **Form State** | Formular | React Hook Form | Feld-Werte, Validierung |
| **Auth State** | App-weit | React Context | User, Token |
| **UI State** | Component | useState | Sidebar open, Dialog open |
| **URL State** | Browser | React Router | Aktuelle Seite, Trade-ID |

**Kein Redux. Kein MobX. Kein Zustand.**
Fuer ein Formular-lastiges internes Tool reicht diese Aufteilung.

---

## 7. Vergleich: Rails vs. React Architektur

| Konzept | Rails | React (diese App) |
|---------|-------|-------------------|
| Routing | `routes.rb` | `App.tsx` Routes |
| Layout | `application.html.erb` + `yield` | `Layout.tsx` + `<Outlet />` |
| Controller | `TradesController` | `TradesPage.tsx` |
| View | `trades/index.html.erb` | JSX in der Page |
| Partial | `_trade.html.erb` | Component (z.B. TradeRow) |
| Model | `Trade < ActiveRecord` | `types.ts` Interface + API Hook |
| Validierung | `validates :symbol` | Zod Schema |
| Auth | Devise + `before_action` | AuthContext + ProtectedRoute |
| Asset Pipeline | Propshaft/Sprockets | Vite |
| Tests | Minitest/RSpec | Vitest + Testing Library |
| Deployment | Puma + Nginx | Nginx (statische Files) |

**Groesster Unterschied:**
Rails rendert HTML auf dem Server. React rendert im Browser.
Das Backend (Java) liefert nur JSON. Das Frontend ist eine eigenstaendige App.

---

## 8. Dateistruktur auf einen Blick

```
src/
├── main.tsx                    # Einstiegspunkt
├── App.tsx                     # Routing + Provider-Setup
├── index.css                   # Tailwind + shadcn Theme
├── monitoring.ts               # Sentry Setup
│
├── api/                        # Backend-Kommunikation
│   ├── client.ts               # Axios mit JWT
│   ├── types.ts                # TypeScript Interfaces
│   ├── mock-data.ts            # Demo-Daten
│   └── mock-handlers.ts        # Simuliertes Backend
│
├── auth/                       # Authentifizierung
│   ├── AuthContext.tsx          # Login State (React Context)
│   └── ProtectedRoute.tsx      # Route Guard
│
├── hooks/                      # Wiederverwendbare Logik
│   ├── useTrades.ts            # API: Trades CRUD
│   └── use-mobile.ts           # Responsive Detection
│
├── pages/                      # Eine Datei pro Route
│   ├── DashboardPage.tsx       # /
│   ├── TradesPage.tsx          # /trades
│   └── LoginPage.tsx           # /login
│
├── components/                 # UI-Bausteine
│   ├── Layout.tsx              # Sidebar + Content
│   ├── TradeForm.tsx           # /trades/new
│   ├── app-sidebar.tsx         # Navigation
│   ├── nav-main.tsx            # Sidebar Menue
│   ├── nav-user.tsx            # User Dropdown
│   ├── team-switcher.tsx       # Org Selector
│   └── ui/                     # shadcn/ui Design System
│       ├── button.tsx          #   (18 Components)
│       ├── card.tsx
│       ├── table.tsx
│       └── ...
│
├── lib/
│   └── utils.ts                # cn() Helper fuer CSS-Klassen
│
└── test/                       # Tests
    ├── setup.ts                # Test-Config
    ├── auth.test.tsx           # Auth-Tests
    └── TradeForm.test.tsx      # Formular-Tests
```
