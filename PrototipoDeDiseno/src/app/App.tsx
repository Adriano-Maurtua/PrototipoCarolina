import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useId,
  Children,
  isValidElement,
  useState,
  type ReactNode,
  type FormEvent,
} from "react"
import {
  createHashRouter,
  RouterProvider,
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
  Navigate,
  useBlocker,
  useBeforeUnload,
  useSearchParams,
} from "react-router"
import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Banknote,
  CalendarDays,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  CreditCard,
  Eye,
  Gem,
  History,
  House,
  LogOut,
  Minus,
  MoreHorizontal,
  Package,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Trash2,
  Users,
  Wallet,
  X,
  Tags,
  Bookmark,
  Pencil,
  LockKeyhole,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react"
import logo from "../imports/image.png"
import {
  movementTypes,
  registerMovement,
  registerSale,
  cancelSale,
  createInitialOperations,
  loanStatus,
  isAdjustment,
  isLoanMovement,
  isReturn,
  todayDate,
  demoDate,
  formatDate,
  formatDateTime,
  type Product,
  type Sale,
  type SessionUser,
  type Movement,
  type Loan,
  type MovementInput,
  type ManualMovementType,
  type TransactionResult,
} from "./operations"

type CatalogItem = {
  id: string
  name: string
  description: string
}

const profiles: SessionUser[] = [
  { username: "paola", name: "Paola", role: "admin" },
  { username: "dorie", name: "Dorie", role: "seller" },
]
const AuthContext = createContext<{
  user: SessionUser | null
  setUser: React.Dispatch<React.SetStateAction<SessionUser | null>>
} | null>(null)
const useAuth = () => useContext(AuthContext)!
type Customer = {
  id: string
  name: string
  phone: string
  purchases: number
}

type Cart = Record<string, number>
type PriceOverride = {
  unitPrice: number
  changedBy: string
  changedAt: string
}
const money = (value: number) =>
  `S/ ${value.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
const initialProducts: Product[] = [
  {
    id: "AN-001",
    name: "Anillo plata 925",
    category: "Anillos",
    material: "Plata 925",
    price: 120,
    stock: 4,
    description:
      "Anillo de plata 925 con acabado pulido. Diseño clásico y delicado.",
  },
  {
    id: "CO-012",
    name: "Collar corazón",
    category: "Collares",
    material: "Plata 925",
    price: 180,
    stock: 2,
    description: "Cadena fina de plata con dije en forma de corazón.",
  },
  {
    id: "PU-008",
    name: "Pulsera eslabones",
    category: "Pulseras",
    material: "Acero inoxidable",
    price: 85,
    stock: 6,
    description: "Pulsera de eslabones con cierre de seguridad.",
  },
  {
    id: "AR-003",
    name: "Aretes perla",
    category: "Aretes",
    material: "Plata y perla",
    price: 95,
    stock: 1,
    description: "Par de aretes de plata con perlas cultivadas.",
  },
  {
    id: "AN-014",
    name: "Anillo solitario",
    category: "Anillos",
    material: "Plata 925",
    price: 150,
    stock: 3,
    description: "Anillo de plata con una delicada piedra de zirconia.",
  },
  {
    id: "CO-006",
    name: "Cadena fina dorada",
    category: "Collares",
    material: "Acero bañado en oro",
    price: 110,
    stock: 2,
    description: "Cadena fina dorada, de 45 centímetros.",
  },
  {
    id: "PU-015",
    name: "Pulsera doble",
    category: "Pulseras",
    material: "Plata 925",
    price: 140,
    stock: 8,
    description: "Pulsera de dos cadenas de plata.",
  },
  {
    id: "OT-002",
    name: "Dije estrella",
    category: "Otros",
    material: "Plata 925",
    price: 50,
    stock: 5,
    description: "Dije pequeño en forma de estrella.",
  },
]
const initialCustomers: Customer[] = [
  { id: "1", name: "María Fernández", phone: "987 654 321", purchases: 5 },
  { id: "2", name: "Lucía Torres", phone: "956 789 123", purchases: 3 },
  { id: "3", name: "Ana Rodríguez", phone: "912 345 678", purchases: 2 },
  { id: "4", name: "Patricia Morales", phone: "998 765 432", purchases: 4 },
]
const initialSales: Sale[] = [
  {
    id: "00125",
    date: demoDate(),
    time: "12:45",
    items: [
      { product: initialProducts[0], quantity: 1 },
      { product: initialProducts[1], quantity: 1 },
      { product: initialProducts[7], quantity: 1 },
    ],
    original: 350,
    final: 330,
    payment: "Yape",
    customer: "María Fernández",
    user: "Paola",
  },
  {
    id: "00124",
    date: demoDate(),
    time: "12:10",
    items: [{ product: initialProducts[2], quantity: 1 }],
    original: 85,
    final: 85,
    payment: "Efectivo",
    customer: "",
    user: "Paola",
  },
  {
    id: "00123",
    date: demoDate(),
    time: "11:32",
    items: [{ product: initialProducts[3], quantity: 2 }],
    original: 190,
    final: 180,
    payment: "Tarjeta",
    customer: "Lucía Torres",
    user: "Paola",
  },
  {
    id: "00122",
    date: demoDate(),
    time: "10:56",
    items: [{ product: initialProducts[4], quantity: 1 }],
    original: 150,
    final: 150,
    payment: "Plin",
    customer: "Ana Rodríguez",
    user: "Paola",
  },
  {
    id: "00121",
    date: demoDate(-1),
    time: "17:20",
    items: [{ product: initialProducts[5], quantity: 1 }],
    original: 110,
    final: 100,
    payment: "Efectivo",
    customer: "Patricia Morales",
    user: "Paola",
  },
  {
    id: "00120",
    date: demoDate(-2),
    time: "16:05",
    items: [{ product: initialProducts[6], quantity: 2 }],
    original: 280,
    final: 260,
    payment: "Transferencia",
    customer: "María Fernández",
    user: "Paola",
  },
]
const categories = [
  "Todos",
  "Anillos",
  "Collares",
  "Pulseras",
  "Aretes",
  "Otros",
]
const payments = [
  "Efectivo",
  "Yape",
  "Plin",
  "Transferencia",
  "Tarjeta",
  "Otro",
]
const fieldClass =
  "min-h-12 w-full rounded-lg border border-input bg-white px-3.5 py-3 text-sm transition focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/15 aria-invalid:border-destructive aria-invalid:focus:ring-destructive/15 placeholder:text-muted-foreground/75"

type AppState = {
  movements: Movement[]
  loans: Loan[]
  recordMovement: (input: MovementInput) => string | null
  completeSale: (sale: Sale) => string | null
  voidSale: (id: string, reason: string) => string | null
  cartPrices: Record<string, PriceOverride>
  setCartPrices: React.Dispatch<React.SetStateAction<Record<string, PriceOverride>>>
  categoryList: CatalogItem[]
  setCategoryList: React.Dispatch<React.SetStateAction<CatalogItem[]>>
  brands: CatalogItem[]
  setBrands: React.Dispatch<React.SetStateAction<CatalogItem[]>>
  products: Product[]
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>
  customers: Customer[]
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>
  sales: Sale[]
  cart: Cart
  setCart: React.Dispatch<React.SetStateAction<Cart>>
  lastSale: Sale | null
  setLastSale: React.Dispatch<React.SetStateAction<Sale | null>>
  notify: (message: string) => void
}
const AppContext = createContext<AppState | null>(null)
function useApp() {
  return useContext(AppContext)!
}

function Brand({ small = false }: { small?: boolean }) {
  return (
    <img
      src={logo}
      alt="Carolina Joyería"
      className={small ? "h-14 w-32 object-cover" : "h-20 w-48 object-cover"}
    />
  )
}
function Button({
  children,
  onClick,
  secondary = false,
  disabled = false,
  className = "",
  type = "button",
  danger = false,
}: {
  children: ReactNode
  onClick?: () => void
  secondary?: boolean
  disabled?: boolean
  className?: string
  type?: "button" | "submit"
  danger?: boolean
}) {
  const modalClose = useContext(ModalCloseContext)
  return (
    <button
      type={type}
      onClick={
        secondary && children === "Cancelar" && modalClose
          ? modalClose
          : onClick
      }
      disabled={disabled}
      className={`inline-flex min-h-12 items-center justify-center gap-2.5 rounded-lg px-5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${
        danger
          ? "border border-destructive/30 bg-[#f4eae6] text-destructive hover:bg-[#ecd9d2]"
          : secondary
            ? "border border-border bg-white text-foreground hover:bg-muted"
            : "bg-primary text-white hover:bg-primary/90"
      } ${className}`}
    >
      {children}
    </button>
  )
}
function Card({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={`rounded-2xl border border-border bg-card shadow-[0_2px_5px_rgba(25,25,20,0.015)] ${className}`}
    >
      {children}
    </section>
  )
}
function StockBadge({ stock }: { stock: number }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ${
        stock === 0
          ? "bg-[#f4eae6] text-destructive"
          : stock <= 2
          ? "bg-[#f1ece3] text-[#887151]"
          : "bg-accent text-accent-foreground"
      }`}
    >
      <span
        className={`size-1 rounded-full ${
          stock === 0 ? "bg-destructive" : stock <= 2 ? "bg-[#a58b59]" : "bg-[#7a8667]"
        }`}
      />
      {stock === 0 ? "Agotado" : stock <= 2 ? "Stock bajo" : "Disponible"}
    </span>
  )
}
function SearchInput({
  value,
  onChange,
  placeholder = "Buscar por nombre o código...",
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  return (
    <div className="relative w-full">
      <Search
        className="pointer-events-none absolute left-3.5 top-4 size-4 text-muted-foreground"
        strokeWidth={1.6}
      />
      <input
        aria-label={placeholder}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`${fieldClass} pl-10`}
      />
    </div>
  )
}
function Field({
  label,
  children,
  optional = false,
}: {
  label: string
  children: ReactNode
  optional?: boolean
}) {
  const inputId = useId()
  const labelRef = useRef<HTMLLabelElement>(null)
  const required = (nodes: ReactNode): boolean =>
    Children.toArray(nodes).some(
      (node) =>
        isValidElement<{
          required?: boolean
          children?: ReactNode
        }>(node) &&
        (Boolean(node.props.required) || required(node.props.children)),
    )
  useEffect(() => {
    const control =
      labelRef.current?.querySelector<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
        "input, select, textarea",
      )
    if (control && labelRef.current) {
      if (!control.id) control.id = inputId
      labelRef.current.htmlFor = control.id
      if (!control.hasAttribute("aria-label"))
        control.setAttribute("aria-labelledby", inputId + "-label")
    }
  })
  return (
    <label ref={labelRef} htmlFor={inputId} className="block">
      <span className="mb-2 block text-sm font-medium">
        <span id={inputId + "-label"}>{label}</span>
        {required(children) && (
          <span
            aria-hidden="true"
            title="Campo obligatorio"
            className="ml-1 text-[#887151]"
          >
            *
          </span>
        )}
        {optional && (
          <span className="ml-1.5 font-normal text-muted-foreground">
            (opcional)
          </span>
        )}
      </span>
      {children}
    </label>
  )
}
function Empty({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children?: ReactNode
}) {
  return (
    <div className="py-16 text-center">
      <Package
        className="mx-auto mb-4 size-8 text-muted-foreground"
        strokeWidth={1}
      />
      <h3 className="text-base font-medium">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
      <div className="mt-6">{children}</div>
    </div>
  )
}
function PageTitle({
  title,
  subtitle,
  action,
  back,
  eyebrow,
}: {
  title: string
  subtitle?: string
  action?: ReactNode
  back?: string
  eyebrow?: string
}) {
  return (
    <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
      <div>
        {back && (
          <Link
            to={back}
            className="mb-4 inline-flex min-h-8 items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={15} />
            Volver
          </Link>
        )}
        {eyebrow && (
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.17em] text-muted-foreground">
            {eyebrow}
          </p>
        )}
        <h1 className="text-[28px] font-semibold tracking-[-0.02em] leading-tight md:text-[32px]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  )
}

const mainNav: {
  path: string
  label: string
  icon: LucideIcon
}[] = [
  { path: "/", label: "Inicio", icon: House },
  { path: "/productos", label: "Productos", icon: Gem },
  { path: "/venta", label: "Nueva venta", icon: Plus },
  { path: "/historial", label: "Historial de ventas", icon: History },
  { path: "/clientes", label: "Clientes", icon: Users },
  { path: "/inventario", label: "Inventario", icon: Package },
]
function Sidebar() {
  const { user } = useAuth()
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[232px] flex-col overflow-y-auto border-r border-border bg-white lg:flex">
      <Link
        to="/"
        aria-label="Carolina Joyería, inicio"
        className="mx-auto mb-5 mt-6"
      >
        <Brand />
      </Link>
      <div className="mx-5 mb-6 flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2.5">
        <span className="text-xs font-medium">Gestión de tienda</span>
        <span className="rounded bg-white px-1.5 py-0.5 text-xs text-muted-foreground">
          INTERNO
        </span>
      </div>
      <div className="px-4">
        <p className="mb-3 px-3 text-xs font-medium uppercase tracking-[0.17em] text-muted-foreground">
          Principal
        </p>
        <nav className="space-y-1">
          {mainNav.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/"}
              className={({ isActive }) =>
                "flex min-h-[46px] items-center gap-3 rounded-lg px-3 text-sm transition " +
                (isActive
                  ? "bg-primary font-medium text-white shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground")
              }
            >
              <Icon size={17} strokeWidth={1.6} />
              {label}
              {path === "/venta" && (
                <span aria-hidden="true" className="ml-auto rounded border border-current/15 px-1.5 py-0.5 text-xs">
                  +
                </span>
              )}
            </NavLink>
          ))}
        </nav>
        {user?.role === "admin" && (
          <>
            <p className="mb-2 mt-7 px-3 text-xs font-medium uppercase tracking-[0.17em] text-muted-foreground">
              Administración
            </p>
            <nav className="space-y-1">
              {[
                { path: "/categorias", label: "Categorías", icon: Tags },
                { path: "/marcas", label: "Marcas", icon: Bookmark },
              ].map(({ path, label, icon: Icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) =>
                    "flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm " +
                    (isActive
                      ? "bg-primary text-white"
                      : "text-muted-foreground hover:bg-muted")
                  }
                >
                  <Icon size={17} strokeWidth={1.5} />
                  {label}
                </NavLink>
              ))}
            </nav>
          </>
        )}
      </div>
      <div className="mt-auto px-4 pb-5 pt-6">
        <NavLink
          to="/configuracion"
          className="flex min-h-11 items-center gap-3 px-3 text-sm text-muted-foreground hover:text-foreground"
        >
          <Settings2 size={17} strokeWidth={1.5} />
          Configuración
        </NavLink>
        <Link
          to="/salir"
          className="flex min-h-11 items-center gap-3 px-3 text-sm text-muted-foreground hover:text-foreground"
        >
          <LogOut size={17} strokeWidth={1.5} />
          Cerrar sesión
        </Link>
        <div className="mt-4 flex items-center gap-2 border-t border-border px-3 pt-5">
          <ShieldCheck size={14} className="text-[#a68b63]" />
          <div>
            <p className="text-xs font-medium">{user?.name}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {user?.role === "admin" ? "Administradora" : "Vendedora"}
            </p>
          </div>
          <span className="ml-auto size-1.5 rounded-full bg-[#92997e]" />
        </div>
      </div>
    </aside>
  )
}
function BottomNavigation() {
  const location = useLocation()
  const links = [
    { path: "/", label: "Inicio", icon: House },
    { path: "/productos", label: "Productos", icon: Gem },
    { path: "/venta", label: "Venta", icon: Plus },
    { path: "/historial", label: "Historial", icon: History },
    { path: "/mas", label: "Más", icon: MoreHorizontal },
  ]
  return (
    <nav
      aria-label="Navegación principal"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white pb-[max(14px,env(safe-area-inset-bottom))] pt-2 lg:hidden"
    >
      <div className="mx-auto grid max-w-lg grid-cols-5">
        {links.map(({ path, label, icon: Icon }) => {
          const active =
            path === "/"
              ? location.pathname === "/"
              : path === "/mas"
                ? [
                    "/mas",
                    "/clientes",
                    "/inventario",
                    "/configuracion",
                    "/categorias",
                    "/marcas",
                  ].some((item) => location.pathname.startsWith(item))
                : location.pathname.startsWith(path)
          return (
            <Link
              key={path}
              to={path}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-[52px] flex-col items-center justify-center gap-1 text-xs ${
                active
                  ? "font-semibold text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              <span
                className={`flex h-7 w-11 items-center justify-center rounded-md ${
                  path === "/venta"
                    ? "bg-primary text-white"
                    : active
                      ? "bg-secondary"
                      : ""
                }`}
              >
                <Icon size={19} strokeWidth={1.6} />
              </span>
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
function Header() {
  const { user } = useAuth()
  const location = useLocation()
  const section =
    [
      ...mainNav,
      { path: "/categorias", label: "Categorías" },
      { path: "/marcas", label: "Marcas" },
      { path: "/configuracion", label: "Configuración" },
    ].find(
      (item) => item.path !== "/" && location.pathname.startsWith(item.path),
    )?.label || "Inicio"
  return (
    <header className="flex items-center justify-between border-b border-border bg-white px-5 pb-4 pt-[max(56px,env(safe-area-inset-top))] lg:h-[76px] lg:px-9 lg:py-0">
      <Link to="/" className="lg:hidden">
        <Brand small />
      </Link>
      <div className="hidden items-center gap-3 text-sm lg:flex">
        <span className="text-muted-foreground">Carolina Joyería</span>
        <ChevronRight size={12} className="text-muted-foreground/60" />
        <span className="font-medium">{section}</span>
      </div>
      <div className="flex items-center gap-6">
        <div className="hidden items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground xl:flex">
          <span className="size-1.5 rounded-full bg-[#92997e]" />
          Tienda abierta
        </div>
        <Link to="/configuracion" className="flex min-h-11 items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold">{user?.name}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {user?.role === "admin" ? "Administradora" : "Vendedora"}
            </p>
          </div>
          <ChevronDown size={13} className="text-muted-foreground" />
        </Link>
      </div>
    </header>
  )
}
function Shell() {
  const { user } = useAuth()
  const [operations, setOperations] = useState(() =>
    createInitialOperations(initialProducts, initialSales),
  )
  const operationsRef = useRef(operations)
  const { products, sales, movements, loans } = operations
  const setProducts: AppState["setProducts"] = (update) => {
    const current = operationsRef.current
    const next = {
      ...current,
      products:
        typeof update === "function" ? update(current.products) : update,
    }
    operationsRef.current = next
    setOperations(next)
  }
  const [categoryList, setCategoryList] = useState<CatalogItem[]>(
    categories.slice(1).map((name, index) => ({
      id: "CAT-" + String(index + 1).padStart(3, "0"),
      name,
      description: "Categoría de " + name.toLowerCase(),
    })),
  )
  const [brands, setBrands] = useState<CatalogItem[]>([
    { id: "MAR-001", name: "Carolina Joyería", description: "Marca propia" },
    {
      id: "MAR-002",
      name: "Genérica",
      description: "Productos sin marca comercial",
    },
  ])
  const [customers, setCustomers] = useState(initialCustomers)
  const [cart, setCart] = useState<Cart>({})
  const [cartPrices, setCartPrices] = useState<Record<string, PriceOverride>>(
    {},
  )
  const [lastSale, setLastSale] = useState<Sale | null>(null)
  const [toast, setToast] = useState("")
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  )
  const location = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [location.pathname])
  useEffect(() => () => clearTimeout(toastTimer.current), [])
  const notify = (message: string) => {
    clearTimeout(toastTimer.current)
    setToast(message)
    toastTimer.current = setTimeout(() => setToast(""), 3500)
  }
  const commit = (result: TransactionResult) => {
    if (!result.ok) return result.error
    operationsRef.current = result.state
    setOperations(result.state)
    return null
  }
  const recordMovement: AppState["recordMovement"] = (input) =>
    user
      ? commit(registerMovement(operationsRef.current, input, user))
      : "Inicia sesión para registrar movimientos."
  const completeSale: AppState["completeSale"] = (sale) =>
    user
      ? commit(registerSale(operationsRef.current, sale, user))
      : "Inicia sesión para registrar la venta."
  const voidSale: AppState["voidSale"] = (id, reason) => {
    if (!user) return "Inicia sesión para anular ventas."
    const sale = operationsRef.current.sales.find((item) => item.id === id)
    const error = commit(cancelSale(operationsRef.current, id, reason, user))
    if (!error && sale?.customer)
      setCustomers((current) =>
        current.map((customer) =>
          customer.name === sale.customer
            ? { ...customer, purchases: Math.max(0, customer.purchases - 1) }
            : customer,
        ),
      )
    return error
  }
  if (!user) return <Navigate to="/login" replace />
  return (
    <AppContext.Provider
      value={{
        movements,
        loans,
        recordMovement,
        completeSale,
        voidSale,
        cartPrices,
        setCartPrices,
        categoryList,
        setCategoryList,
        brands,
        setBrands,
        products,
        setProducts,
        customers,
        setCustomers,
        sales,
        cart,
        setCart,
        lastSale,
        setLastSale,
        notify,
      }}
    >
      <div className="min-h-dvh">
        <Sidebar />
        <div className="lg:ml-[232px]">
          <Header />
          <main
            id="main"
            className="mx-auto max-w-[1460px] px-5 pb-[125px] pt-7 sm:px-8 lg:px-9 lg:pb-10 lg:pt-8"
          >
            <Outlet />
          </main>
        </div>
        <BottomNavigation />
        {toast && (
          <div
            role="status"
            className="fixed bottom-48 left-1/2 z-50 flex w-max max-w-[90vw] -translate-x-1/2 items-center gap-3 rounded-lg border border-border bg-primary px-5 py-4 text-sm text-white shadow-lg lg:bottom-8"
          >
            <Check size={18} />
            {toast}
          </div>
        )}
      </div>
    </AppContext.Provider>
  )
}

function Dashboard() {
  const { products, sales } = useApp()
  const { user } = useAuth()
  const lowStock = products.filter((product) => product.stock <= 2)
  const today = sales.filter(
    (sale) => sale.date === todayDate && sale.status !== "cancelled",
  )
  const income = today.reduce((sum, sale) => sum + sale.final, 0)
  const units = today.reduce(
    (sum, sale) =>
      sum + sale.items.reduce((count, item) => count + item.quantity, 0),
    0,
  )
  const actions = [
    {
      label: "Nueva venta",
      description: "Registrar una operación",
      path: "/venta",
      icon: Plus,
    },
    {
      label: "Registrar producto",
      description: "Agregar al catálogo",
      path: "/productos/nuevo",
      icon: Gem,
    },
    {
      label: "Inventario",
      description: "Consultar existencias",
      path: "/inventario",
      icon: Package,
    },
    {
      label: "Historial de ventas",
      description: "Consultar operaciones",
      path: "/historial",
      icon: History,
    },
  ]
  return (
    <>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Gestión de tienda / Inicio
          </p>
          <h1 className="text-[30px] font-semibold tracking-[-0.025em] md:text-[32px]">
            Panel de control
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Bienvenida, {user?.name}. Resumen de la actividad de hoy.
          </p>
        </div>
        <div className="flex items-center gap-2.5 rounded-lg border border-border bg-white px-4 py-3 text-xs">
          <CalendarDays size={15} strokeWidth={1.5} />
          {new Date(todayDate + "T12:00:00").toLocaleDateString("es-PE", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
          <span className="ml-1 rounded bg-secondary px-2 py-0.5 text-xs">
            HOY
          </span>
        </div>
      </div>
      <div className="grid gap-4 xl:grid-cols-[2.8fr_1fr]">
        <section className="overflow-hidden rounded-2xl bg-[#20201f] px-5 py-6 text-white sm:px-7">
          <div className="mb-7 flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-[0.17em] text-[#c4b79f]">
              Actividad diaria
            </p>
            <span className="flex items-center gap-1.5 text-xs text-white/50">
              <Clock3 size={12} />
              {new Date(todayDate + "T12:00:00")
                .toLocaleDateString("es-PE", { day: "numeric", month: "short" })
                .toUpperCase()}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-y-6 sm:grid-cols-[1.5fr_1fr_1fr]">
            <Link
              to="/historial"
              aria-label="Ver ingresos del día en el historial de ventas"
              className="group col-span-2 rounded-lg border-b border-white/10 pb-5 transition hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c4b79f] sm:col-span-1 sm:border-b-0 sm:border-r sm:pb-0"
            >
              <p className="mb-3 flex items-center gap-2 text-xs text-white/55 group-hover:text-white">
                Ingresos del día
                <ArrowUpRight size={13} />
              </p>
              <p className="text-[36px] font-medium leading-none tracking-[-0.035em] sm:text-[40px]">
                <span className="mr-1.5 text-[20px] text-[#c4b79f]">S/</span>
                {income.toLocaleString("es-PE", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="mt-4 text-xs text-white/50">
                Importe final de ventas registradas
              </p>
            </Link>
            <Link
              to="/historial"
              aria-label="Ver ventas de hoy en el historial de ventas"
              className="group rounded-lg border-r border-white/10 transition hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c4b79f] sm:pl-7"
            >
              <p className="mb-3 flex items-center gap-2 text-xs text-white/55 group-hover:text-white">
                Ventas de hoy
                <ArrowUpRight size={13} />
              </p>
              <p className="text-[36px] font-medium leading-none tracking-[-0.035em]">
                {String(today.length).padStart(2, "0")}
              </p>
              <p className="mt-4 text-xs text-white/50">
                Operaciones registradas
              </p>
            </Link>
            <div className="pl-5 sm:pl-7">
              <p className="mb-3 text-xs text-white/55">Productos vendidos</p>
              <p className="text-[36px] font-medium leading-none tracking-[-0.035em]">
                {String(units).padStart(2, "0")}
              </p>
              <p className="mt-4 text-xs text-white/50">Unidades vendidas</p>
            </div>
          </div>
        </section>
        <Link
          to="/inventario"
          className="group flex items-center justify-between gap-5 rounded-2xl border border-[#e5ddd0] bg-[#f0ece5] px-6 py-5 xl:block"
        >
          <div>
            <div className="mb-4 flex items-center justify-between gap-8">
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#887657]">
                Control de stock
              </p>
              <Package size={17} strokeWidth={1.4} className="text-[#a58b64]" />
            </div>
            <p className="text-[36px] font-medium leading-none tracking-[-0.035em]">
              {String(lowStock.length).padStart(2, "0")}
            </p>
            <p className="mt-3 text-xs text-[#887657]">
              Productos con stock bajo
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium xl:mt-5">
            Revisar inventario
            <ArrowUpRight
              size={15}
              className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </div>
        </Link>
      </div>
      <div className="mb-3 mt-7 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Accesos rápidos</h2>
        <span className="text-xs text-muted-foreground">Operaciones</span>
      </div>
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {actions.map(({ label, description, path, icon: Icon }, index) => (
          <Link
            key={path}
            to={path}
            className="group rounded-xl border border-border bg-white px-4 py-5 transition hover:-translate-y-0.5 hover:border-[#b9ad96] hover:shadow-md"
          >
            <div className="mb-5 flex items-center justify-between">
              <span
                className={
                  index === 0
                    ? "flex size-9 items-center justify-center rounded-lg bg-primary text-white"
                    : "flex size-9 items-center justify-center rounded-lg bg-muted text-[#8a7b60]"
                }
              >
                <Icon size={17} strokeWidth={1.5} />
              </span>
              <ArrowUpRight
                size={14}
                className="text-muted-foreground/70 transition group-hover:text-foreground"
              />
            </div>
            <h3 className="text-sm font-semibold">{label}</h3>
            <p className="mt-1.5 text-xs text-muted-foreground">
              {description}
            </p>
          </Link>
        ))}
      </div>
      <div className="mt-7 grid items-start gap-5 xl:grid-cols-[1.8fr_1fr]">
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between gap-3 px-5 py-5">
            <div>
              <h2 className="text-lg font-semibold">Ventas recientes</h2>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Últimas operaciones registradas
              </p>
            </div>
            <Link
              to="/historial"
              className="flex min-h-11 items-center gap-2 text-xs font-medium"
            >
              Ver historial
              <ArrowUpRight size={14} />
            </Link>
          </div>
          <SalesTable sales={sales.slice(0, 4)} compact />
          <div className="flex items-center gap-2 border-t border-border bg-muted/35 px-5 py-3.5 text-xs text-muted-foreground">
            <ShieldCheck size={13} />
            {today.length} ventas registradas hoy
          </div>
        </Card>
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-5 py-5">
            <div>
              <h2 className="text-lg font-semibold">Inventario</h2>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Productos que requieren reposición
              </p>
            </div>
            <span className="rounded-md bg-[#f0ece5] px-2 py-1 text-xs text-[#887657]">
              {lowStock.length}
            </span>
          </div>
          <div className="px-5">
            {lowStock.map((product) => (
              <Link
                key={product.id}
                to={"/productos/" + product.id}
                className="flex min-h-[78px] items-center justify-between gap-3 border-b border-border last:border-0"
              >
                <div>
                  <p className="text-sm font-medium">{product.name}</p>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    {product.id} · {product.category}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {product.stock}{" "}
                    {product.stock === 1 ? "unidad" : "unidades"}
                  </p>
                  <p className="mt-1.5 text-xs text-[#957b52]">Stock bajo</p>
                </div>
              </Link>
            ))}
          </div>
          <Link
            to="/inventario"
            className="mx-5 mb-5 mt-3 flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border text-xs font-medium transition hover:bg-muted"
          >
            Ver inventario
            <ArrowRight size={14} />
          </Link>
        </Card>
      </div>
      <footer className="mt-7 flex items-center justify-between gap-4 border-t border-border pt-5 text-xs text-muted-foreground">
        <span>Carolina Joyería · Sistema interno</span>
        <span className="flex items-center gap-1.5">
          <LockKeyhole size={11} />
          {user?.role === "admin"
            ? "Acceso de administración"
            : "Acceso de ventas"}
        </span>
      </footer>
    </>
  )
}
function PaymentBadge({ payment }: { payment: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-[#f3f1ec] px-2 py-1 text-xs text-[#7f7667]">
      {payment === "Efectivo" ? (
        <Banknote size={11} />
      ) : payment === "Tarjeta" ? (
        <CreditCard size={11} />
      ) : (
        <Wallet size={11} />
      )}
      {payment}
    </span>
  )
}
function SaleStatus({ sale }: { sale: Sale }) {
  return (
    <span
      className={
        "inline-flex rounded-md px-2 py-1 text-sm font-medium " +
        (sale.status === "cancelled"
          ? "bg-[#f4eae6] text-destructive"
          : "bg-accent text-accent-foreground")
      }
    >
      {sale.status === "cancelled" ? "Anulada" : "Registrada"}
    </span>
  )
}
function CancelSaleDialog({ sale, close }: {
  sale: Sale
  close: () => void
}) {
  const { voidSale, notify } = useApp()
  const { user } = useAuth()
  const [reason, setReason] = useState("")
  const [error, setError] = useState("")
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const failure = voidSale(sale.id, reason)
    if (failure) {
      setError(failure)
      return
    }
    notify("Venta anulada. Unidades reintegradas al inventario.")
    close()
  }
  return (
    <Modal title="¿Anular esta venta?" close={close} wide>
      <form onSubmit={submit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4 rounded-xl bg-muted p-4">
          {[
            ["Venta", "#" + sale.id],
            ["Fecha", formatDate(sale.date) + " · " + sale.time],
            ["Registrada por", sale.user],
            ["Método de pago", sale.payment],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="mt-1.5 text-sm font-medium">{value}</p>
            </div>
          ))}
        </div>
        <div className="divide-y divide-border">
          {sale.items.map((item) => (
            <div
              key={item.product.id}
              className="flex justify-between gap-3 py-3 text-sm"
            >
              <span>{item.product.name}</span>
              <strong>
                {item.quantity} {item.quantity === 1 ? "unidad" : "unidades"}
              </strong>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-base font-semibold">
          <span>Importe total</span>
          <span>{money(sale.final)}</span>
        </div>
        <div className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-[#f6efea] p-4">
          <AlertTriangle
            size={19}
            className="mt-0.5 shrink-0 text-destructive"
          />
          <p className="text-sm leading-relaxed">
            La venta permanecerá en el historial como anulada. Su importe dejará
            de contar en los indicadores y las unidades se reintegrarán al
            inventario. Esta operación no se puede repetir.
          </p>
        </div>
        <Field label="Motivo de anulación">
          <textarea
            required
            aria-label="Motivo de anulación"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            className={fieldClass + " min-h-24"}
            placeholder="Explica por qué se anula esta venta"
          />
        </Field>
        <p className="text-sm text-muted-foreground">
          Responsable de la anulación: {user?.name}
        </p>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <div className="flex flex-wrap gap-3 border-t border-border pt-5">
          <Button secondary onClick={close}>
            Cancelar
          </Button>
          <Button
            danger
            type="submit"
            disabled={
              user?.role !== "admin" ||
              sale.status === "cancelled" ||
              !reason.trim()
            }
            className="ml-auto"
          >
            Confirmar anulación
          </Button>
        </div>
      </form>
    </Modal>
  )
}
function SaleActions({ sale }: { sale: Sale }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<"menu" | "cancel" | null>(null)
  return (
    <>
      <button
        aria-label={"Acciones de venta #" + sale.id}
        onClick={() => setMode("menu")}
        className="flex size-11 items-center justify-center rounded-lg hover:bg-muted"
      >
        <MoreHorizontal size={19} />
      </button>
      {mode === "menu" && (
        <Modal title={"Venta #" + sale.id} close={() => setMode(null)}>
          <div className="space-y-3">
            <SaleStatus sale={sale} />
            <Button
              secondary
              className="w-full"
              onClick={() => {
                setMode(null)
                navigate("/historial/" + sale.id)
              }}
            >
              <Eye size={16} />
              Ver detalle
            </Button>
            {sale.status !== "cancelled" && (
              <>
                <Button
                  danger
                  className="w-full"
                  disabled={user?.role !== "admin"}
                  onClick={() => setMode("cancel")}
                >
                  <X size={16} />
                  Anular venta
                </Button>
                {user?.role !== "admin" && (
                  <p className="flex items-start gap-2 text-sm text-muted-foreground">
                    <LockKeyhole size={16} className="mt-0.5 shrink-0" />
                    Solo la administradora puede anular ventas. Solicita su
                    autorización.
                  </p>
                )}
              </>
            )}
          </div>
        </Modal>
      )}
      {mode === "cancel" && (
        <CancelSaleDialog sale={sale} close={() => setMode(null)} />
      )}
    </>
  )
}
function SalesTable({
  sales,
  compact = false,
}: {
  sales: Sale[]
  compact?: boolean
}) {
  return (
    <>
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full text-left text-sm">
          <thead className="border-y border-border bg-muted/60 text-sm text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-medium">Venta</th>
              <th className="px-3 py-3 font-medium">
                {compact ? "Hora" : "Fecha y hora"}
              </th>
              {!compact && <th className="px-3 py-3 font-medium">Productos</th>}
              <th className="px-3 py-3 font-medium">Total final</th>
              <th className="px-3 py-3 font-medium">Pago</th>
              <th className="px-3 py-3 font-medium">Estado</th>
              <th className="px-3 py-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr
                key={sale.id}
                className="border-b border-border last:border-0 hover:bg-muted/30"
              >
                <td className="px-5 py-5 font-medium">
                  <Link to={"/historial/" + sale.id} className="py-3">
                    #{sale.id}
                  </Link>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-muted-foreground">
                  {!compact && (
                    <span className="mr-2">{formatDate(sale.date)}</span>
                  )}
                  {sale.time}
                </td>
                {!compact && (
                  <td className="px-3 py-4">
                    {sale.items.reduce((sum, item) => sum + item.quantity, 0)}
                  </td>
                )}
                <td
                  className={
                    "whitespace-nowrap px-3 py-4 font-medium " +
                    (sale.status === "cancelled"
                      ? "text-muted-foreground line-through"
                      : "")
                  }
                >
                  {money(sale.final)}
                </td>
                <td className="px-3 py-4">
                  <PaymentBadge payment={sale.payment} />
                </td>
                <td className="px-3 py-4">
                  <SaleStatus sale={sale} />
                </td>
                <td className="px-3">
                  <SaleActions sale={sale} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="divide-y divide-border lg:hidden">
        {sales.map((sale) => (
          <div key={sale.id} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <Link to={"/historial/" + sale.id}>
                <p className="text-sm font-semibold">Venta #{sale.id}</p>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {formatDate(sale.date)} · {sale.time} ·{" "}
                  {sale.items.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                  unidades
                </p>
              </Link>
              <SaleActions sale={sale} />
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                <SaleStatus sale={sale} />
                <PaymentBadge payment={sale.payment} />
              </div>
              <Link
                to={"/historial/" + sale.id}
                className={
                  "min-h-11 py-2 text-base font-semibold " +
                  (sale.status === "cancelled"
                    ? "text-muted-foreground line-through"
                    : "")
                }
              >
                {money(sale.final)}
              </Link>
            </div>
          </div>
        ))}
      </div>
      {!sales.length && (
        <Empty
          title="No hay ventas para estos filtros"
          description="Modifica el rango de fechas, el estado o la búsqueda para consultar otras operaciones."
        />
      )}
    </>
  )
}

function Products() {
  const { products, categoryList } = useApp()
  const categories = ["Todos", ...categoryList.map((item) => item.name)]
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("Todos")
  const filtered = products.filter(
    (product) =>
      (category === "Todos" || product.category === category) &&
      `${product.name} ${product.id} ${product.brand || ""}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  )
  return (
    <>
      <PageTitle
        title="Productos"
        subtitle="Catálogo de productos, precios y existencias."
        action={
          <Link to="/productos/nuevo">
            <Button>
              <Plus size={16} />
              Nuevo producto
            </Button>
          </Link>
        }
      />
      <Card className="overflow-hidden">
        <div className="p-5">
          <div className="max-w-lg">
            <SearchInput value={query} onChange={setQuery} />
          </div>
          <div className="mt-4 flex gap-1 overflow-x-auto pb-1">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`min-h-11 shrink-0 rounded-lg px-4 text-sm transition ${
                  category === item
                    ? "bg-primary text-white"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left text-sm">
            <thead className="border-y border-border bg-muted/60 text-xs text-muted-foreground">
              <tr>
                {[
                  "Código",
                  "Producto",
                  "Categoría",
                  "Marca",
                  "Stock",
                  "Precio",
                  "Acciones",
                ].map((label) => (
                  <th key={label} className="px-5 py-3 font-normal">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-border last:border-0 hover:bg-muted/40"
                >
                  <td className="px-5 py-5 text-muted-foreground">
                    {product.id}
                  </td>
                  <td className="px-5 py-5 font-medium">{product.name}</td>
                  <td className="px-5 py-5 text-muted-foreground">
                    {product.category}
                  </td>
                  <td className="px-5 py-5 text-muted-foreground">
                    {product.brand || "Sin marca"}
                  </td>
                  <td className="px-5 py-5">
                    <span className="mr-2">{product.stock}</span>
                    <StockBadge stock={product.stock} />
                  </td>
                  <td className="whitespace-nowrap px-5 py-5 font-medium">
                    {money(product.price)}
                  </td>
                  <td className="px-5">
                    <div className="flex gap-4">
                      <Link
                        to={`/productos/${product.id}`}
                        className="py-3 text-sm"
                      >
                        Ver
                      </Link>
                      <Link
                        to={`/productos/${product.id}/editar`}
                        className="py-3 text-sm text-muted-foreground"
                      >
                        Editar
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="divide-y divide-border md:hidden">
          {filtered.map((product) => (
            <div key={product.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">
                    {product.id} · {product.category}
                  </p>
                  <h3 className="mt-1.5 text-sm font-medium">{product.name}</h3>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    {product.brand || "Sin marca"}
                  </p>
                </div>
                <StockBadge stock={product.stock} />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-base font-semibold">
                    {money(product.price)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Stock: {product.stock} unidades
                  </p>
                </div>
                <div className="flex gap-3">
                  <Link
                    to={`/productos/${product.id}`}
                    className="flex min-h-11 items-center rounded-lg border border-border px-4 text-sm"
                  >
                    Ver
                  </Link>
                  <Link
                    to={`/productos/${product.id}/editar`}
                    className="flex min-h-11 items-center px-2 text-sm text-muted-foreground"
                  >
                    Editar
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <Empty
            title="No encontramos productos"
            description="Prueba con otro nombre, código o categoría."
          />
        )}
        <div className="border-t border-border px-5 py-4 text-xs text-muted-foreground">
          {filtered.length} productos en tu catálogo
        </div>
      </Card>
    </>
  )
}
function ProductForm() {
  const { id } = useParams()
  const {
    products,
    setProducts,
    categoryList,
    brands,
    recordMovement,
    notify,
  } = useApp()
  const navigate = useNavigate()
  const product = products.find((item) => item.id === id)
  const [error, setError] = useState("")
  const dirty = useRef(false)
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      dirty.current && currentLocation.pathname !== nextLocation.pathname,
  )
  useBeforeUnload((event) => {
    if (dirty.current) {
      event.preventDefault()
      event.returnValue = ""
    }
  })
  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const code = String(data.get("code")).trim().toUpperCase()
    if (products.some((item) => item.id === code && item.id !== id)) {
      setError("Este código ya está registrado. Utiliza un código diferente.")
      return
    }
    const next: Product = {
      id: code,
      name: String(data.get("name")).trim(),
      category: String(data.get("category")),
      description: String(data.get("description")).trim(),
      material: String(data.get("material")).trim(),
      brand: String(data.get("brand")),
      price: Number(data.get("price")),
      stock: product ? product.stock : Number(data.get("stock")),
    }
    if (
      !next.name ||
      !next.material ||
      !Number.isFinite(next.price) ||
      next.price <= 0 ||
      !Number.isSafeInteger(next.stock) ||
      next.stock < 0
    ) {
      setError("Revisa los campos obligatorios, el precio y el stock.")
      return
    }
    setProducts((current) =>
      product
        ? current.map((item) => (item.id === id ? next : item))
        : [...current, { ...next, stock: 0 }],
    )
    if (!product && next.stock > 0) {
      const failure = recordMovement({
        productId: code,
        type: "entry",
        quantity: next.stock,
        reason: "Stock inicial al registrar el producto",
      })
      if (failure) {
        setError(failure)
        return
      }
    }
    notify(product ? "Producto actualizado" : "Producto guardado correctamente")
    dirty.current = false
    navigate(`/productos/${code}`)
  }
  if (id && !product) return <Navigate to="/productos" replace />
  return (
    <div className="max-w-3xl">
      <PageTitle
        title={product ? "Editar producto" : "Registrar producto"}
        subtitle="Completa la información del producto."
        back={product ? `/productos/${id}` : "/productos"}
      />
      <Card className="p-5 sm:p-7">
        <form
          onSubmit={save}
          onChangeCapture={() => {
            dirty.current = true
          }}
          className="space-y-6"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Código del producto">
              <input
                className={fieldClass}
                name="code"
                readOnly={Boolean(product)}
                pattern="[A-Za-z0-9-]+"
                placeholder="Ej. AN-001"
                defaultValue={product?.id}
                required
              />
            </Field>
            <Field label="Categoría">
              <select
                className={fieldClass}
                name="category"
                aria-label="Categoría"
                defaultValue={product?.category || ""}
                required
              >
                <option value="" disabled>
                  Selecciona una categoría
                </option>
                {categoryList.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Nombre">
            <input
              className={fieldClass}
              name="name"
              placeholder="Ej. Anillo plata 925"
              defaultValue={product?.name}
              required
            />
          </Field>
          <Field label="Marca" optional>
            <select
              className={fieldClass}
              name="brand"
              aria-label="Marca"
              defaultValue={product?.brand || ""}
            >
              <option value="">Sin marca</option>
              {brands.map((item) => (
                <option key={item.id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Material">
            <input
              className={fieldClass}
              name="material"
              placeholder="Ej. Plata 925"
              defaultValue={product?.material}
              required
            />
          </Field>
          <div className="grid grid-cols-2 gap-5">
            <Field label="Precio (S/)">
              <input
                className={fieldClass}
                name="price"
                type="number"
                inputMode="decimal"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                defaultValue={product?.price}
                required
              />
            </Field>
            <Field label="Stock">
              <input
                className={fieldClass}
                name="stock"
                readOnly={Boolean(product)}
                type="number"
                inputMode="numeric"
                min="0"
                step="1"
                placeholder="0"
                defaultValue={product?.stock}
                required
              />
            </Field>
          </div>
          {product && (
            <p className="text-sm text-muted-foreground">
              El código identifica el historial del producto. Para cambiar sus
              existencias, utiliza{" "}
              <Link
                className="underline underline-offset-4"
                to={"/productos/" + product.id}
              >
                Registrar movimiento
              </Link>
              .
            </p>
          )}
          <Field label="Descripción" optional>
            <textarea
              className={`${fieldClass} min-h-28 resize-y`}
              name="description"
              placeholder="Descripción del producto..."
              defaultValue={product?.description}
            />
          </Field>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
            <Button
              secondary
              onClick={() =>
                navigate(product ? `/productos/${id}` : "/productos")
              }
            >
              Cancelar
            </Button>
            <Button type="submit">
              <Check size={16} />
              Guardar producto
            </Button>
          </div>
        </form>
      </Card>
      {blocker.state === "blocked" && (
        <Modal title="¿Descartar los cambios?" close={() => blocker.reset()}>
          <p className="text-sm text-muted-foreground">
            El producto tiene cambios sin guardar. Puedes continuar editando o
            salir y descartarlos.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button secondary onClick={() => blocker.reset()}>
              Continuar editando
            </Button>
            <Button
              danger
              onClick={() => {
                dirty.current = false
                blocker.proceed()
              }}
            >
              Descartar cambios
            </Button>
          </div>
        </Modal>
      )}
    </div>
  )
}
const ModalCloseContext = createContext<(() => void) | null>(null)
function Modal({
  title,
  children,
  close,
  wide = false,
}: {
  title: string
  children: ReactNode
  close: () => void
  wide?: boolean
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [dirty, setDirty] = useState(false)
  const [discard, setDiscard] = useState(false)
  const requestClose = () => {
    if (dirty) setDiscard(true)
    else close()
  }
  useEffect(() => {
    const dialog = dialogRef.current
    dialog?.showModal()
    return () => dialog?.close()
  }, [])
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (dirty) {
        event.preventDefault()
        event.returnValue = ""
      }
    }
    window.addEventListener("beforeunload", warn)
    return () => window.removeEventListener("beforeunload", warn)
  }, [dirty])
  return (
    <dialog
      ref={dialogRef}
      onCancel={(event) => {
        event.preventDefault()
        requestClose()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          const bounds = event.currentTarget.getBoundingClientRect()
          if (
            event.clientX < bounds.left ||
            event.clientX > bounds.right ||
            event.clientY < bounds.top ||
            event.clientY > bounds.bottom
          )
            requestClose()
        }
      }}
      onChangeCapture={() => setDirty(true)}
      className={
        "fixed inset-x-0 top-[max(60px,env(safe-area-inset-top))] bottom-[max(28px,env(safe-area-inset-bottom))] m-auto max-h-[calc(100dvh_-_max(60px,env(safe-area-inset-top))_-_max(28px,env(safe-area-inset-bottom)))] w-[calc(100%_-_32px)] overflow-y-auto rounded-2xl border border-border bg-white p-5 text-foreground shadow-xl backdrop:bg-black/35 sm:p-6 " +
        (wide ? "max-w-2xl" : "max-w-lg")
      }
    >
      <div className="mb-6 flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">{title}</h2>
        <button
          onClick={requestClose}
          aria-label="Cerrar"
          className="flex size-11 shrink-0 items-center justify-center rounded-lg hover:bg-muted"
        >
          <X size={18} />
        </button>
      </div>
      {discard && (
        <div
          role="alert"
          className="mb-6 rounded-xl border border-[#decfba] bg-[#f5efe6] p-4"
        >
          <p className="text-sm font-medium">Hay cambios sin guardar.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Si cierras el formulario, perderás estos cambios.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button secondary onClick={() => setDiscard(false)}>
              Continuar editando
            </Button>
            <Button danger onClick={close}>
              Descartar cambios
            </Button>
          </div>
        </div>
      )}
      <ModalCloseContext.Provider value={requestClose}>
        {children}
      </ModalCloseContext.Provider>
    </dialog>
  )
}
function ProductDetail() {
  const { id } = useParams()
  const { products } = useApp()
  const product = products.find((item) => item.id === id)
  const [movement, setMovement] = useState(false)
  if (!product) return <Navigate to="/productos" replace />
  return (
    <div className="max-w-3xl">
      <PageTitle
        title="Detalle de producto"
        subtitle="Información general y existencias."
        back="/productos"
      />
      <Card className="p-6 sm:p-8">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">{product.id}</p>
            <h2 className="mt-3 text-2xl font-semibold">{product.name}</h2>
          </div>
          <StockBadge stock={product.stock} />
        </div>
        <div className="my-8 grid grid-cols-2 gap-6 border-y border-border py-7">
          {[
            ["Categoría", product.category],
            ["Marca", product.brand || "Sin marca"],
            ["Material", product.material],
            ["Precio de catálogo", money(product.price)],
            ["Stock disponible", product.stock + " unidades"],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="mt-2 text-base font-medium">{value}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">Descripción</p>
        <p className="mt-3 text-sm leading-relaxed">
          {product.description || "Sin descripción adicional."}
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link to={"/productos/" + id + "/editar"}>
            <Button className="w-full">Editar producto</Button>
          </Link>
          <Button secondary onClick={() => setMovement(true)}>
            <Package size={16} />
            Registrar movimiento
          </Button>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Toda modificación de stock requiere un movimiento con motivo y
          responsable.
        </p>
      </Card>
      {movement && (
        <MovementForm productId={product.id} close={() => setMovement(false)} />
      )}
    </div>
  )
}

function SaleSteps({ step }: { step: number }) {
  return (
    <div className="mb-7 flex items-center gap-2 sm:gap-3">
      {["Seleccionar", "Productos", "Confirmar"].map((label, index) => (
        <div key={label} className="flex flex-1 items-center gap-2">
          <span
            className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs ${
              index + 1 <= step
                ? "bg-primary text-white"
                : "border border-border bg-white text-muted-foreground"
            }`}
          >
            {index + 1 < step ? <Check size={12} /> : index + 1}
          </span>
          <span
            className={`text-xs ${
              index + 1 === step ? "font-medium" : "text-muted-foreground"
            }`}
          >
            {label}
          </span>
          {index < 2 && <span className="ml-auto h-px w-3 bg-border sm:w-12" />}
        </div>
      ))}
    </div>
  )
}
function SaleFooter({
  children,
  note,
}: {
  children: ReactNode
  note?: ReactNode
}) {
  return (
    <div className="fixed inset-x-0 bottom-[calc(60px+max(14px,env(safe-area-inset-bottom)))] z-20 border-t border-border bg-white px-5 py-3 lg:static lg:mt-7 lg:rounded-xl lg:border lg:p-5">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">{note}</div>
        {children}
      </div>
    </div>
  )
}
function useCart() {
  const { products, cart, cartPrices } = useApp()
  const items = products
    .filter((product) => cart[product.id] > 0)
    .map((product) => ({
      product,
      quantity: cart[product.id],
      unitPrice: cartPrices[product.id]?.unitPrice ?? product.price,
      ...(cartPrices[product.id]
        ? {
            priceChangedBy: cartPrices[product.id].changedBy,
            priceChangedAt: cartPrices[product.id].changedAt,
          }
        : {}),
    }))
  return {
    items,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    original: items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    ),
    total: items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
  }
}
function SaleSelect() {
  const { products, cart, setCart, setCartPrices, notify } = useApp()
  const { count, total } = useCart()
  const [query, setQuery] = useState("")
  const navigate = useNavigate()
  const filtered = products.filter(
    (product) =>
      product.stock > 0 &&
      `${product.name} ${product.id}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  )
  const add = (product: Product) => {
    setCart((current) => ({
      ...current,
      [product.id]: (current[product.id] || 0) + 1,
    }))
    notify(`${product.name} agregado`)
  }
  const changeQuantity = (product: Product, next: number) => {
    if (next <= 0) {
      setCart((current) => {
        const updated = { ...current }
        delete updated[product.id]
        return updated
      })
      setCartPrices((current) => {
        const updated = { ...current }
        delete updated[product.id]
        return updated
      })
      notify(`${product.name} retirado de la venta`)
      return
    }
    setCart((current) => ({ ...current, [product.id]: next }))
  }
  return (
    <div className="mx-auto max-w-3xl pb-24 lg:pb-0">
      <PageTitle
        title="Nueva venta"
        subtitle="Busca y agrega los productos de la venta."
      />
      <SaleSteps step={1} />
      <SearchInput
        value={query}
        onChange={setQuery}
        placeholder="Buscar producto por nombre o código"
      />
      <p className="mb-3 mt-5 text-xs uppercase tracking-[0.12em] text-muted-foreground">
        Productos disponibles · {filtered.length}
      </p>
      <div className="space-y-3">
        {filtered.map((product) => (
          <Card
            key={product.id}
            className="flex items-center justify-between gap-3 p-4 sm:p-5"
          >
            <div>
              <p className="text-xs text-muted-foreground">
                {product.id} · {product.category}
              </p>
              <h3 className="mt-1.5 text-sm font-medium">{product.name}</h3>
              <div className="mt-2.5 flex items-center gap-3">
                <span className="text-sm font-semibold">
                  {money(product.price)}
                </span>
                <span className="text-xs text-muted-foreground">
                  Stock: {product.stock}
                </span>
              </div>
            </div>
            {cart[product.id] ? (
              <div className="shrink-0 text-right">
                <QuantitySelector
                  quantity={cart[product.id]}
                  max={product.stock}
                  allowZero
                  onChange={(next) => changeQuantity(product, next)}
                />
                <p className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.1em] text-accent-foreground">
                  En venta
                </p>
              </div>
            ) : (
              <Button
                secondary
                onClick={() => add(product)}
                className="shrink-0 px-3 text-sm"
              >
                <Plus size={14} />
                Agregar
              </Button>
            )}
          </Card>
        ))}
      </div>
      {filtered.length === 0 && (
        <Empty
          title="No encontramos productos"
          description="Prueba con otro nombre o código."
        />
      )}
      <SaleFooter
        note={
          <>
            {count} {count === 1 ? "pieza" : "piezas"}
            <strong className="mt-1 block text-sm text-foreground">
              {money(total)}
            </strong>
          </>
        }
      >
        <Button
          disabled={count === 0}
          onClick={() => navigate("/venta/productos")}
        >
          Continuar
          <ArrowRight size={16} />
        </Button>
      </SaleFooter>
    </div>
  )
}
function QuantitySelector({
  quantity,
  max,
  onChange,
  allowZero = false,
}: {
  quantity: number
  max: number
  onChange: (next: number) => void
  allowZero?: boolean
}) {
  return (
    <div className="inline-flex items-center rounded-lg border border-border bg-white">
      <button
        aria-label="Disminuir cantidad"
        disabled={quantity <= (allowZero ? 0 : 1)}
        onClick={() => onChange(quantity - 1)}
        className="flex size-11 items-center justify-center disabled:opacity-30"
      >
        <Minus size={15} />
      </button>
      <span className="min-w-7 text-center text-sm font-medium">
        {quantity}
      </span>
      <button
        aria-label="Aumentar cantidad"
        disabled={quantity >= max}
        onClick={() => onChange(quantity + 1)}
        className="flex size-11 items-center justify-center disabled:opacity-30"
      >
        <Plus size={15} />
      </button>
    </div>
  )
}
function PriceEditor({
  product,
  quantity,
  close,
}: {
  product: Product
  quantity: number
  close: () => void
}) {
  const { cartPrices, setCartPrices, notify } = useApp()
  const { user } = useAuth()
  const [value, setValue] = useState(
    (cartPrices[product.id]?.unitPrice ?? product.price).toFixed(2),
  )
  const [error, setError] = useState("")
  const amount = Number(value)
  const valid = value !== "" && Number.isFinite(amount) && amount > 0
  const difference = amount - product.price
  const apply = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!valid) {
      setError("Ingresa un precio mayor que cero.")
      return
    }
    setCartPrices((current) => {
      const next = { ...current }
      if (amount === product.price) delete next[product.id]
      else
        next[product.id] = {
          unitPrice: amount,
          changedBy: user!.name,
          changedAt: new Date().toISOString(),
        }
      return next
    })
    notify("Precio aplicado únicamente a esta venta.")
    close()
  }
  return (
    <Modal title="Editar precio" close={close}>
      <form onSubmit={apply} className="space-y-5">
        <div>
          <h3 className="text-base font-semibold">{product.name}</h3>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {product.id} · Precio unitario para {quantity}{" "}
            {quantity === 1 ? "unidad" : "unidades"}
          </p>
        </div>
        <div className="flex justify-between rounded-lg bg-muted p-4 text-sm">
          <span>Precio original por unidad</span>
          <strong>{money(product.price)}</strong>
        </div>
        <Field label="Nuevo precio unitario (S/)">
          <input
            aria-label="Nuevo precio unitario"
            aria-invalid={value !== "" && !valid}
            required
            autoFocus
            type="number"
            inputMode="decimal"
            min="0.01"
            step="0.01"
            className={fieldClass}
            value={value}
            onChange={(event) => {
              setValue(event.target.value)
              setError("")
            }}
          />
        </Field>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Diferencia por unidad</span>
          <strong>
            {valid
              ? (difference < 0 ? "− " : difference > 0 ? "+ " : "") +
                money(Math.abs(difference))
              : "—"}
          </strong>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Este precio se aplicará a todas las unidades de este producto en la
          venta actual. No modifica el catálogo. Responsable:{" "}
          <strong>{user?.name}</strong>.
        </p>
        {(error || (value !== "" && !valid)) && (
          <p role="alert" className="text-sm text-destructive">
            {error || "El precio unitario debe ser mayor que cero."}
          </p>
        )}
        <div className="flex gap-3 border-t border-border pt-5">
          <Button secondary onClick={close}>
            Cancelar
          </Button>
          <Button type="submit" disabled={!valid} className="ml-auto">
            Aplicar precio
          </Button>
        </div>
      </form>
    </Modal>
  )
}
function SaleProducts() {
  const { setCart, setCartPrices } = useApp()
  const { items, count, total, original } = useCart()
  const navigate = useNavigate()
  const [editing, setEditing] = useState<string | null>(null)
  const item = items.find((item) => item.product.id === editing)
  const remove = (id: string) => {
    setCart((current) => {
      const next = { ...current }
      delete next[id]
      return next
    })
    setCartPrices((current) => {
      const next = { ...current }
      delete next[id]
      return next
    })
  }
  return (
    <div className="mx-auto max-w-3xl pb-24 lg:pb-0">
      <PageTitle
        title="Productos de la venta"
        subtitle="Revisa cantidades y precios unitarios antes de cobrar."
        back="/venta"
      />
      <SaleSteps step={2} />
      {!items.length ? (
        <Card>
          <Empty
            title="Aún no has agregado productos"
            description="Busca un producto para comenzar la venta."
          >
            <Button onClick={() => navigate("/venta")}>
              Agregar productos
            </Button>
          </Empty>
        </Card>
      ) : (
        <div className="space-y-4">
          {items.map(({ product, quantity, unitPrice, priceChangedBy }) => (
            <Card key={product.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">{product.id}</p>
                  <h3 className="mt-1.5 text-base font-semibold">
                    {product.name}
                  </h3>
                </div>
                <button
                  onClick={() => remove(product.id)}
                  className="flex min-h-11 items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive"
                >
                  <Trash2 size={15} />
                  Eliminar
                </button>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Precio unitario
                  </p>
                  <p className="mt-1 text-lg font-semibold">
                    {money(unitPrice)}
                  </p>
                  {priceChangedBy && (
                    <>
                      <span className="mt-2 inline-flex rounded-md bg-accent px-2 py-1 text-sm text-accent-foreground">
                        Precio modificado
                      </span>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Original: {money(product.price)} · {priceChangedBy}
                      </p>
                    </>
                  )}
                </div>
                <Button
                  secondary
                  onClick={() => setEditing(product.id)}
                  className="px-3"
                >
                  <Pencil size={15} />
                  Editar precio
                </Button>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                <QuantitySelector
                  quantity={quantity}
                  max={product.stock}
                  onChange={(next) =>
                    setCart((current) => ({ ...current, [product.id]: next }))
                  }
                />
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    Subtotal · {quantity} × {money(unitPrice)}
                  </p>
                  <p className="mt-1 text-lg font-semibold">
                    {money(unitPrice * quantity)}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      <Button
        secondary
        className="mt-5 w-full"
        onClick={() => navigate("/venta")}
      >
        <Plus size={16} />
        Seguir agregando productos
      </Button>
      {items.length > 0 && (
        <Card className="mt-5 p-5">
          <SaleSummary original={original} final={total} count={count} />
        </Card>
      )}
      <SaleFooter
        note={
          <>
            {count} {count === 1 ? "producto" : "productos"}
            <strong className="mt-1 block text-base text-foreground">
              {money(total)}
            </strong>
          </>
        }
      >
        <Button disabled={!count} onClick={() => navigate("/venta/confirmar")}>
          Revisar venta
          <ArrowRight size={16} />
        </Button>
      </SaleFooter>
      {item && (
        <PriceEditor
          product={item.product}
          quantity={item.quantity}
          close={() => setEditing(null)}
        />
      )}
    </div>
  )
}
function SaleSummary({
  original,
  final,
  count,
}: {
  original: number
  final: number
  count: number
}) {
  return (
    <div className="space-y-3 text-sm">
      <div className="flex justify-between text-muted-foreground">
        <span>Productos</span>
        <span>
          {count} {count === 1 ? "pieza" : "piezas"}
        </span>
      </div>
      <div className="flex justify-between text-muted-foreground">
        <span>Precio original</span>
        <span>{money(original)}</span>
      </div>
      <div className="flex justify-between border-t border-border pt-4 text-sm font-semibold">
        <span>Precio final</span>
        <span>{money(final)}</span>
      </div>
    </div>
  )
}
function SaleConfirm() {
  const { user } = useAuth()
  const { customers, setLastSale, setCustomers, sales, completeSale, notify } =
    useApp()
  const { items, count, total, original } = useCart()
  const [payment, setPayment] = useState("Efectivo")
  const [customer, setCustomer] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()
  if (!items.length) return <Navigate to="/venta" replace />
  const confirm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const now = new Date()
    const next: Sale = {
      id: String(
        Math.max(...sales.map((sale) => Number(sale.id)), 0) + 1,
      ).padStart(5, "0"),
      date: todayDate,
      time: now.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      items,
      original,
      final: total,
      payment,
      customer,
      user: user!.name,
      status: "registered",
    }
    const failure = completeSale(next)
    if (failure) {
      setError(failure)
      return
    }
    setLastSale(next)
    if (customer)
      setCustomers((current) =>
        current.map((person) =>
          person.name === customer
            ? { ...person, purchases: person.purchases + 1 }
            : person,
        ),
      )
    notify("Venta registrada y salida de inventario generada.")
    navigate("/venta/completada")
  }
  return (
    <div className="mx-auto max-w-3xl pb-24 lg:pb-0">
      <PageTitle
        title="Confirmar venta"
        subtitle="Verifica los productos, el importe y el método de pago."
        back="/venta/productos"
      />
      <SaleSteps step={3} />
      <form onSubmit={confirm}>
        <Card className="p-5 sm:p-7">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Resumen de productos</h2>
            <Link
              to="/venta/productos"
              className="flex min-h-11 items-center gap-2 text-sm"
            >
              <Pencil size={14} />
              Editar precios
            </Link>
          </div>
          <div className="divide-y divide-border">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex justify-between gap-4 py-4"
              >
                <div>
                  <p className="text-sm font-medium">{item.product.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.quantity} × {money(item.unitPrice)} por unidad
                  </p>
                  {item.priceChangedBy && (
                    <p className="mt-2 text-sm text-accent-foreground">
                      Precio modificado · {item.priceChangedBy}
                    </p>
                  )}
                </div>
                <strong className="whitespace-nowrap text-sm">
                  {money(item.quantity * item.unitPrice)}
                </strong>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-muted p-5">
            <SaleSummary original={original} final={total} count={count} />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            El importe final corresponde a los precios unitarios de esta venta.
            El catálogo conserva sus precios originales.
          </p>
        </Card>
        <Card className="mt-4 p-5 sm:p-7">
          <h2 className="mb-4 text-lg font-semibold">Método de pago</h2>
          <div
            role="group"
            aria-label="Método de pago"
            className="grid grid-cols-2 gap-2 sm:grid-cols-3"
          >
            {payments.map((item, index) => {
              const Icon =
                index === 0
                  ? Banknote
                  : index === 4
                    ? CreditCard
                    : index === 5
                      ? MoreHorizontal
                      : index === 3
                        ? ArrowDownLeft
                        : Smartphone
              return (
                <button
                  key={item}
                  type="button"
                  aria-pressed={payment === item}
                  onClick={() => setPayment(item)}
                  className={
                    "flex min-h-12 items-center justify-center gap-2 rounded-lg border text-sm " +
                    (payment === item
                      ? "border-primary bg-secondary font-medium"
                      : "border-border hover:bg-muted")
                  }
                >
                  <Icon size={16} strokeWidth={1.5} />
                  {item}
                  {payment === item && <Check size={13} />}
                </button>
              )
            })}
          </div>
          <div className="mt-6">
            <Field label="Cliente" optional>
              <select
                className={fieldClass}
                aria-label="Cliente"
                value={customer}
                onChange={(event) => setCustomer(event.target.value)}
              >
                <option value="">Sin cliente registrado</option>
                {customers.map((person) => (
                  <option key={person.id} value={person.name}>
                    {person.name}
                  </option>
                ))}
              </select>
            </Field>
            <p className="mt-2 text-sm text-muted-foreground">
              Registrar un cliente no es obligatorio.
            </p>
          </div>
        </Card>
        {error && (
          <p role="alert" className="mt-4 text-sm text-destructive">
            {error}
          </p>
        )}
        <SaleFooter
          note={
            <>
              Total a cobrar
              <strong className="mt-1 block text-lg text-foreground">
                {money(total)}
              </strong>
            </>
          }
        >
          <Button type="submit">
            <Check size={16} />
            Confirmar venta
          </Button>
        </SaleFooter>
      </form>
    </div>
  )
}
function SaleSuccess() {
  const { lastSale, setCart, setCartPrices } = useApp()
  const navigate = useNavigate()
  useEffect(() => {
    setCart({})
    setCartPrices({})
  }, [setCart, setCartPrices])
  if (!lastSale) return <Navigate to="/venta" replace />
  return (
    <div className="mx-auto max-w-xl py-5">
      <div className="text-center">
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full border border-[#dbe1cf] bg-accent">
          <CheckCheck
            size={27}
            strokeWidth={1.4}
            className="text-accent-foreground"
          />
        </div>
        <p className="mb-2 text-xs uppercase tracking-[0.15em] text-muted-foreground">
          Operación completada
        </p>
        <h1 className="font-serif text-[32px] font-medium leading-tight">
          Venta registrada
          <br />
          correctamente
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          La operación se ha registrado en el historial.
        </p>
      </div>
      <Card className="mt-8 p-6">
        <div className="mb-6 flex justify-between border-b border-border pb-5">
          <span className="text-sm font-medium">Venta #{lastSale.id}</span>
          <span className="text-sm text-muted-foreground">
            Hoy · {lastSale.time}
          </span>
        </div>
        <SaleSummary
          original={lastSale.original}
          final={lastSale.final}
          count={lastSale.items.reduce((sum, item) => sum + item.quantity, 0)}
        />
        <div className="mt-5 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Método de pago</span>
          <PaymentBadge payment={lastSale.payment} />
        </div>
      </Card>
      <div className="mt-6 space-y-3">
        <Button className="w-full" onClick={() => navigate("/venta")}>
          <Plus size={16} />
          Nueva venta
        </Button>
        <Button
          secondary
          className="w-full"
          onClick={() => navigate(`/historial/${lastSale.id}`)}
        >
          Ver detalle de venta
          <ArrowRight size={15} />
        </Button>
        <Link
          to="/"
          className="flex min-h-12 items-center justify-center text-sm text-muted-foreground"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}

function SalesHistory() {
  const { sales } = useApp()
  const location = useLocation()
  const customer = new URLSearchParams(location.search).get("cliente")
  const [query, setQuery] = useState("")
  const [period, setPeriod] = useState(customer ? "Este mes" : "Hoy")
  const [statusFilter, setStatusFilter] = useState("all")
  const [from, setFrom] = useState(todayDate.slice(0, 7) + "-01")
  const [to, setTo] = useState(todayDate)
  const startOfWeek = new Date(todayDate + "T12:00:00Z")
  startOfWeek.setUTCDate(
    startOfWeek.getUTCDate() - ((startOfWeek.getUTCDay() + 6) % 7),
  )
  const weekStart = startOfWeek.toISOString().slice(0, 10)
  const filtered = sales.filter(
    (sale) =>
      (!customer || sale.customer === customer) &&
      (statusFilter === "all" ||
        (sale.status || "registered") === statusFilter) &&
      `${sale.id} ${sale.customer} ${sale.payment}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (period === "Hoy"
        ? sale.date === todayDate
        : period === "Esta semana"
          ? sale.date >= weekStart
          : period === "Este mes"
            ? sale.date.startsWith(todayDate.slice(0, 7))
            : sale.date >= from && sale.date <= to),
  )
  return (
    <>
      <PageTitle
        title="Historial de ventas"
        subtitle={
          customer
            ? `Compras de ${customer}`
            : "Consulta y filtra las operaciones registradas."
        }
        action={
          <Link to="/venta">
            <Button>
              <Plus size={16} />
              Nueva venta
            </Button>
          </Link>
        }
      />
      <Card className="overflow-hidden">
        <div className="p-5">
          <div className="max-w-lg">
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Buscar venta, cliente o método de pago..."
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {["Hoy", "Esta semana", "Este mes", "Personalizado"].map((item) => (
              <button
                key={item}
                onClick={() => setPeriod(item)}
                className={`min-h-11 rounded-lg px-4 text-sm ${
                  period === item
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="mt-4 max-w-xs">
            <Field label="Estado de venta">
              <select
                aria-label="Estado de venta"
                className={fieldClass}
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="all">Todos los estados</option>
                <option value="registered">Registrada</option>
                <option value="cancelled">Anulada</option>
              </select>
            </Field>
          </div>
          {period === "Personalizado" && (
            <div className="mt-4 grid max-w-lg grid-cols-2 gap-3">
              <Field label="Desde">
                <input
                  type="date"
                  className={fieldClass}
                  value={from}
                  onChange={(event) => setFrom(event.target.value)}
                />
              </Field>
              <Field label="Hasta">
                <input
                  type="date"
                  className={fieldClass}
                  value={to}
                  onChange={(event) => setTo(event.target.value)}
                  min={from}
                />
              </Field>
            </div>
          )}
        </div>
        <SalesTable sales={filtered} />
        <div className="flex justify-between border-t border-border px-5 py-4 text-sm">
          <span className="text-muted-foreground">
            {filtered.length} ventas
          </span>
          <span className="font-medium">
            Total válido:{" "}
            {money(
              filtered
                .filter((sale) => sale.status !== "cancelled")
                .reduce((sum, sale) => sum + sale.final, 0),
            )}
          </span>
        </div>
      </Card>
    </>
  )
}
function SaleDetail() {
  const { id } = useParams()
  const { sales } = useApp()
  const { user } = useAuth()
  const sale = sales.find((item) => item.id === id)
  const [cancel, setCancel] = useState(false)
  if (!sale) return <Navigate to="/historial" replace />
  return (
    <div className="mx-auto max-w-3xl">
      <PageTitle
        title="Detalle de venta"
        subtitle={"Venta #" + sale.id}
        back="/historial"
        action={
          sale.status !== "cancelled" && user?.role === "admin" ? (
            <Button danger onClick={() => setCancel(true)}>
              Anular venta
            </Button>
          ) : undefined
        }
      />
      {sale.cancellation && (
        <section className="mb-5 rounded-xl border border-destructive/20 bg-[#f6efea] p-5">
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle size={18} className="text-destructive" />
            <h2 className="text-lg font-semibold">Venta anulada</h2>
          </div>
          <p className="text-sm">
            Anulada por <strong>{sale.cancellation.user}</strong> ·{" "}
            {formatDateTime(sale.cancellation.at)}
          </p>
          <p className="mt-3 text-sm leading-relaxed">
            Motivo: {sale.cancellation.reason}
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            El importe no cuenta en los indicadores. Las unidades fueron
            reintegradas al inventario.
          </p>
        </section>
      )}
      <Card className="p-5 sm:p-7">
        <div className="mb-6 flex items-center justify-between border-b border-border pb-5">
          <h2 className="text-lg font-semibold">Productos</h2>
          <SaleStatus sale={sale} />
        </div>
        <div className="divide-y divide-border">
          {sale.items.map((item) => (
            <div
              key={item.product.id}
              className="flex justify-between gap-3 py-4 first:pt-0"
            >
              <div>
                <p className="text-base font-medium">{item.product.name}</p>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {item.product.id} · {item.quantity} ×{" "}
                  {money(item.unitPrice ?? item.product.price)} por unidad
                </p>
                {item.priceChangedBy && (
                  <div className="mt-2">
                    <span className="rounded-md bg-accent px-2 py-1 text-sm text-accent-foreground">
                      Precio modificado
                    </span>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Original: {money(item.product.price)} por unidad ·
                      Modificado por {item.priceChangedBy}
                      {item.priceChangedAt
                        ? " · " + formatDateTime(item.priceChangedAt)
                        : ""}
                    </p>
                  </div>
                )}
              </div>
              <strong className="whitespace-nowrap text-sm">
                {money((item.unitPrice ?? item.product.price) * item.quantity)}
              </strong>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-lg bg-muted p-5">
          <SaleSummary
            original={sale.original}
            final={sale.final}
            count={sale.items.reduce((sum, item) => sum + item.quantity, 0)}
          />
        </div>
        <div className="mt-7 grid grid-cols-2 gap-6">
          {[
            ["Método de pago", sale.payment],
            ["Fecha y hora", formatDate(sale.date) + " · " + sale.time],
            ["Registrada por", sale.user],
            ["Cliente", sale.customer || "Sin cliente registrado"],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="mt-2 text-sm font-medium">{value}</p>
            </div>
          ))}
        </div>
      </Card>
      {sale.status !== "cancelled" && user?.role !== "admin" && (
        <p className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
          <LockKeyhole size={16} className="mt-0.5 shrink-0" />
          La anulación de ventas está reservada a la administradora.
        </p>
      )}
      <div className="mt-5 flex flex-wrap gap-5">
        <Link
          to="/historial"
          className="inline-flex min-h-12 items-center gap-2 text-sm"
        >
          <ArrowLeft size={15} />
          Volver al historial
        </Link>
        <Link
          to="/inventario?tab=movimientos"
          className="inline-flex min-h-12 items-center gap-2 text-sm"
        >
          <Package size={16} />
          Consultar movimientos
        </Link>
      </div>
      {cancel && (
        <CancelSaleDialog sale={sale} close={() => setCancel(false)} />
      )}
    </div>
  )
}
function MovementForm({
  productId = "",
  loanId = "",
  close,
}: {
  productId?: string
  loanId?: string
  close: () => void
}) {
  const { products, loans, recordMovement, notify } = useApp()
  const { user } = useAuth()
  const loanPreset = loans.find((item) => item.id === loanId)
  const [selectedId, setSelectedId] = useState(
    loanPreset?.productId || productId,
  )
  const [query, setQuery] = useState("")
  const [type, setType] = useState<ManualMovementType>(
    loanPreset
      ? loanPreset.direction === "out"
        ? "return-out"
        : "return-in"
      : "entry",
  )
  const [relatedLoan, setRelatedLoan] = useState(loanId)
  const [quantity, setQuantity] = useState("")
  const [reason, setReason] = useState("")
  const [store, setStore] = useState(loanPreset?.store || "")
  const [review, setReview] = useState(false)
  const [error, setError] = useState("")
  const product = products.find((item) => item.id === selectedId)
  const loan = loans.find((item) => item.id === relatedLoan)
  const eligibleLoans = loans.filter(
    (item) =>
      item.productId === selectedId &&
      item.direction === (type === "return-out" ? "out" : "in") &&
      item.returned < item.quantity,
  )
  const amount = Number(quantity)
  const delta = Number.isSafeInteger(amount) && amount > 0 ? movementTypes[type].sign * amount : 0
  const result = (product?.stock || 0) + delta
  const options = products.filter(
    (item) =>
      item.id === selectedId ||
      (item.name + " " + item.id).toLowerCase().includes(query.toLowerCase()),
  )
  const validate = () => {
    if (!product) return "Selecciona un producto."
    if (isAdjustment(type) && user?.role !== "admin")
      return "Solo la administradora puede registrar ajustes de inventario."
    if (!Number.isSafeInteger(amount) || amount <= 0)
      return "Ingresa una cantidad entera mayor que cero."
    if (!reason.trim()) return "El motivo es obligatorio."
    if (
      isReturn(type) &&
      (!loan || !eligibleLoans.some((item) => item.id === loan.id))
    )
      return "Selecciona un préstamo pendiente."
    if (isReturn(type) && loan && amount > loan.quantity - loan.returned)
      return (
        "La devolución supera las " +
        (loan.quantity - loan.returned) +
        " unidades pendientes."
      )
    if (isLoanMovement(type) && !(isReturn(type) ? loan?.store : store)?.trim())
      return "Indica la tienda relacionada."
    if (result < 0)
      return (
        "Stock insuficiente. Solo hay " +
        product.stock +
        " unidades disponibles."
      )
    return ""
  }
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const validation = validate()
    if (validation) {
      setError(validation)
      setReview(false)
      return
    }
    if (!review) {
      setError("")
      setReview(true)
      return
    }
    const failure = recordMovement({
      productId: selectedId,
      type,
      quantity: amount,
      reason,
      store: isReturn(type) ? loan?.store : store,
      loanId: isReturn(type) ? relatedLoan : undefined,
    })
    if (failure) {
      setError(failure)
      setReview(false)
      return
    }
    notify("Movimiento registrado. Stock actualizado.")
    close()
  }
  return (
    <Modal
      title={review ? "Confirmar movimiento" : "Nuevo movimiento"}
      close={close}
      wide
    >
      <form onSubmit={submit} className="space-y-5">
        {!review ? (
          <>
            <div>
              <Field label="Buscar producto">
                <SearchInput
                  value={query}
                  onChange={setQuery}
                  placeholder="Buscar por nombre o código"
                />
              </Field>
              <div className="mt-3">
                <Field label="Producto">
                  <select
                    aria-label="Producto"
                    required
                    className={fieldClass}
                    value={selectedId}
                    onChange={(event) => {
                      setSelectedId(event.target.value)
                      setRelatedLoan("")
                      setError("")
                    }}
                  >
                    <option value="">Selecciona un producto</option>
                    {options.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.id} · {item.name}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </div>
            <Field label="Tipo de movimiento">
              <select
                aria-label="Tipo de movimiento"
                required
                className={fieldClass}
                value={type}
                onChange={(event) => {
                  setType(event.target.value as ManualMovementType)
                  setRelatedLoan("")
                  setError("")
                }}
              >
                {Object.entries(movementTypes)
                  .filter(([key]) => key !== "sale" && key !== "cancellation")
                  .map(([key, config]) => (
                    <option
                      key={key}
                      value={key}
                      disabled={isAdjustment(key) && user?.role !== "admin"}
                    >
                      {config.label}
                      {isAdjustment(key) && user?.role !== "admin"
                        ? " (solo administradora)"
                        : ""}
                    </option>
                  ))}
              </select>
            </Field>
            {user?.role !== "admin" && (
              <p className="flex items-start gap-2 text-sm text-muted-foreground">
                <LockKeyhole size={16} className="mt-0.5 shrink-0" />
                Los ajustes por diferencias o pérdidas requieren una
                administradora.
              </p>
            )}
            {isReturn(type) && (
              <>
                <Field label="Préstamo relacionado">
                  <select
                    aria-label="Préstamo relacionado"
                    required
                    className={fieldClass}
                    value={relatedLoan}
                    onChange={(event) => setRelatedLoan(event.target.value)}
                  >
                    <option value="">Selecciona un préstamo pendiente</option>
                    {eligibleLoans.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.id} · {item.store} ·{" "}
                        {item.quantity - item.returned} pendientes
                      </option>
                    ))}
                  </select>
                </Field>
                {loan && (
                  <p className="rounded-lg bg-muted p-3 text-sm">
                    Cantidad todavía no devuelta:{" "}
                    <strong>{loan.quantity - loan.returned} unidades</strong>
                  </p>
                )}
                {eligibleLoans.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No existen préstamos pendientes de este tipo para el
                    producto seleccionado.
                  </p>
                )}
              </>
            )}
            {isLoanMovement(type) && (
              <Field label="Tienda relacionada">
                <input
                  required
                  className={fieldClass}
                  value={isReturn(type) ? loan?.store || "" : store}
                  readOnly={isReturn(type)}
                  onChange={(event) => setStore(event.target.value)}
                  placeholder="Nombre de la joyería externa"
                />
              </Field>
            )}
            <Field label="Cantidad">
              <input
                required
                aria-label="Cantidad"
                aria-invalid={quantity !== "" && (!Number.isSafeInteger(amount) || amount <= 0 || result < 0 || (isReturn(type) && Boolean(loan) && amount > loan!.quantity - loan!.returned))}
                type="number"
                inputMode="numeric"
                min="1"
                step="1"
                className={fieldClass}
                value={quantity}
                onChange={(event) => {
                  setQuantity(event.target.value)
                  setError("")
                }}
                placeholder="Número de unidades"
              />
            </Field>
            <Field label="Motivo u observaciones">
              <textarea
                required
                aria-label="Motivo u observaciones"
                className={fieldClass + " min-h-24 resize-y"}
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder="Explica la razón de este movimiento"
              />
            </Field>
          </>
        ) : (
          <div className="space-y-4 rounded-xl border border-border p-4">
            <p className="text-base font-semibold">{product?.name}</p>
            <p className="text-sm text-muted-foreground">
              {product?.id} · {movementTypes[type].label}
            </p>
            {isLoanMovement(type) && (
              <p className="text-sm">
                Tienda: <strong>{isReturn(type) ? loan?.store : store}</strong>
              </p>
            )}
            {isReturn(type) && (
              <p className="text-sm">
                Préstamo: {relatedLoan} · Quedarán{" "}
                {(loan?.quantity || 0) - (loan?.returned || 0) - amount}{" "}
                unidades pendientes
              </p>
            )}
            <p className="text-sm leading-relaxed">Motivo: {reason}</p>
            <p className="text-sm text-muted-foreground">
              Responsable: {user?.name}
            </p>
          </div>
        )}
        <div className="grid grid-cols-3 gap-2 rounded-xl bg-muted p-4">
          {[
            ["Stock actual", product?.stock || 0],
            ["Movimiento", (delta > 0 ? "+" : "") + delta],
            ["Stock resultante", result],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {label}
              </p>
              <p
                className={
                  "mt-2 text-xl font-semibold " +
                  (label === "Stock resultante" && result < 0
                    ? "text-destructive"
                    : "")
                }
              >
                {value}
              </p>
            </div>
          ))}
        </div>
        {product && result >= 0 && result <= 2 && amount > 0 && (
          <p className="text-sm text-[#887151]">
            El producto quedará {result === 0 ? "agotado" : "con stock bajo"}.
          </p>
        )}
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <div className="flex flex-wrap gap-3 border-t border-border pt-5">
          <Button secondary onClick={close}>
            Cancelar
          </Button>
          {review && (
            <Button secondary onClick={() => setReview(false)}>
              Volver a editar
            </Button>
          )}
          <Button type="submit" className="ml-auto">
            {review ? "Registrar movimiento" : "Revisar movimiento"}
            <Check size={16} />
          </Button>
        </div>
      </form>
    </Modal>
  )
}
function MovementDetails({
  movement,
  close,
}: {
  movement: Movement
  close: () => void
}) {
  return (
    <Modal title="Detalle del movimiento" close={close} wide>
      <p className="mb-5 text-sm text-muted-foreground">{movement.id}</p>
      <div className="grid gap-5 sm:grid-cols-2">
        {[
          ["Producto", movement.productName],
          ["Código", movement.productId],
          ["Tipo de operación", movementTypes[movement.type].label],
          ["Fecha y hora", formatDateTime(movement.at)],
          [
            "Cantidad",
            (movementTypes[movement.type].sign > 0 ? "+" : "−") +
              movement.quantity,
          ],
          ["Usuario responsable", movement.user],
          ["Stock anterior", movement.before],
          ["Stock posterior", movement.after],
          ...(movement.store ? [["Tienda relacionada", movement.store]] : []),
          ...(movement.loanId
            ? [["Préstamo relacionado", movement.loanId]]
            : []),
        ].map(([label, value]) => (
          <div key={label}>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-1.5 text-sm font-medium">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-xl bg-muted p-4">
        <p className="text-sm text-muted-foreground">Motivo</p>
        <p className="mt-2 text-sm leading-relaxed">{movement.reason}</p>
      </div>
      {movement.saleId && (
        <Link
          to={"/historial/" + movement.saleId}
          className="mt-5 flex min-h-12 items-center gap-2 text-sm font-medium"
        >
          Ver venta #{movement.saleId}
          <ArrowRight size={16} />
        </Link>
      )}
      <p className="mt-5 text-sm text-muted-foreground">
        Registro histórico. Los movimientos no pueden editarse ni eliminarse.
      </p>
    </Modal>
  )
}
function Inventory() {
  const { products, movements, loans } = useApp()
  const [searchParams, setSearchParams] = useSearchParams()
  const params = searchParams.get("tab") === "movimientos" ? "movements" : "stock"
  const setParams = (value: string) => setSearchParams(current => {
    const next = new URLSearchParams(current)
    if (value === "movements") next.set("tab", "movimientos")
    else next.delete("tab")
    return next
  }, { replace: true })
  const [query, setQuery] = useState("")
  const [onlyLow, setOnlyLow] = useState(false)
  const [productFilter, setProductFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [userFilter, setUserFilter] = useState("")
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [showLoans, setShowLoans] = useState(false)
  const [loanState, setLoanState] = useState("pending")
  const [form, setForm] = useState<{
    productId?: string
    loanId?: string
  } | null>(null)
  const [detail, setDetail] = useState<Movement | null>(null)
  const filtered = products.filter(
    (product) =>
      (!onlyLow || product.stock <= 2) &&
      (product.name + " " + product.id + " " + product.category)
        .toLowerCase()
        .includes(query.toLowerCase()),
  )
  const history = [...movements]
    .reverse()
    .filter(
      (item) =>
        (!productFilter || item.productId === productFilter) &&
        (!typeFilter || item.type === typeFilter) &&
        (!userFilter || item.user === userFilter) &&
        (!from || item.at.slice(0, 10) >= from) &&
        (!to || item.at.slice(0, 10) <= to),
    )
  const visibleLoans = loans.filter(
    (loan) =>
      (loanState === "all" || loan.returned < loan.quantity) &&
      (!productFilter || loan.productId === productFilter) &&
      (!userFilter || loan.user === userFilter) &&
      (!from || loan.at.slice(0, 10) >= from) &&
      (!to || loan.at.slice(0, 10) <= to) &&
      (!typeFilter || (typeFilter === "loan-out" && loan.direction === "out") || (typeFilter === "loan-in" && loan.direction === "in") || (typeFilter === "return-out" && loan.direction === "out" && loan.returned > 0) || (typeFilter === "return-in" && loan.direction === "in" && loan.returned > 0)),
  )
  const pending = loans.filter((loan) => loan.returned < loan.quantity)
  return (
    <>
      <PageTitle
        title="Inventario"
        subtitle="Control de existencias, movimientos y préstamos."
        action={
          <Button onClick={() => setForm({})}>
            <Plus size={16} />
            Nuevo movimiento
          </Button>
        }
      />
      <div
        role="tablist"
        aria-label="Inventario"
        className="mb-6 flex gap-2 border-b border-border pb-3"
      >
        {[
          ["stock", "Stock actual"],
          ["movements", "Movimientos de inventario"],
        ].map(([value, label]) => (
          <button
            key={value}
            role="tab"
            aria-selected={params === value}
            onClick={() => setParams(value)}
            className={
              "min-h-12 rounded-lg px-4 text-sm font-medium " +
              (params === value
                ? "bg-primary text-white"
                : "text-muted-foreground hover:bg-muted")
            }
          >
            {label}
          </button>
        ))}
      </div>
      {params === "stock" ? (
        <>
          <div className="mb-5 grid grid-cols-3 gap-3">
            {[
              ["Productos", products.length],
              ["Unidades", products.reduce((sum, item) => sum + item.stock, 0)],
              [
                "Stock bajo o agotado",
                products.filter((item) => item.stock <= 2).length,
              ],
            ].map(([label, value]) => (
              <Card key={label} className="p-4">
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="mt-3 text-2xl font-semibold">{value}</p>
              </Card>
            ))}
          </div>
          <Card className="overflow-hidden">
            <div className="flex flex-col gap-4 p-5 sm:flex-row">
              <SearchInput value={query} onChange={setQuery} />
              <button
                aria-pressed={onlyLow}
                onClick={() => setOnlyLow(!onlyLow)}
                className={
                  "min-h-12 shrink-0 rounded-lg border px-4 text-sm " +
                  (onlyLow
                    ? "border-primary bg-primary text-white"
                    : "border-border")
                }
              >
                Solo stock bajo / agotado
              </button>
            </div>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead className="border-y border-border bg-muted/60 text-sm text-muted-foreground">
                  <tr>
                    {[
                      "Código",
                      "Producto",
                      "Categoría",
                      "Stock actual",
                      "Estado",
                      "Acciones",
                    ].map((label) => (
                      <th key={label} className="px-5 py-3 font-medium">
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-border last:border-0"
                    >
                      <td className="px-5 py-5 text-muted-foreground">
                        {product.id}
                      </td>
                      <td className="px-5 py-5 font-medium">
                        <Link to={"/productos/" + product.id}>
                          {product.name}
                        </Link>
                      </td>
                      <td className="px-5 py-5 text-muted-foreground">
                        {product.category}
                      </td>
                      <td className="px-5 py-5">{product.stock}</td>
                      <td className="px-5 py-5">
                        <StockBadge stock={product.stock} />
                      </td>
                      <td className="px-5">
                        <Button
                          secondary
                          onClick={() => setForm({ productId: product.id })}
                          className="whitespace-nowrap px-3"
                        >
                          Registrar movimiento
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="divide-y divide-border md:hidden">
              {filtered.map((product) => (
                <div key={product.id} className="p-5">
                  <div className="flex justify-between gap-3">
                    <div>
                      <Link
                        to={"/productos/" + product.id}
                        className="text-base font-medium"
                      >
                        {product.name}
                      </Link>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {product.id} · {product.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-semibold">{product.stock}</p>
                      <p className="text-sm text-muted-foreground">unidades</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <StockBadge stock={product.stock} />
                    <Button
                      secondary
                      onClick={() => setForm({ productId: product.id })}
                      className="px-3 text-sm"
                    >
                      Registrar movimiento
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            {filtered.length === 0 && (
              <Empty
                title={
                  onlyLow
                    ? "No hay productos con stock bajo"
                    : "No se encontraron productos"
                }
                description={
                  onlyLow
                    ? "Todos los productos tienen más de dos unidades disponibles."
                    : "Prueba con otro nombre, código o categoría."
                }
              />
            )}
          </Card>
        </>
      ) : (
        <>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#e5ddd0] bg-[#f0ece5] p-4">
            <div>
              <p className="text-sm font-semibold">Préstamos entre joyerías</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {pending.length} pendientes de devolución. No se registran como
                ventas.
              </p>
            </div>
            <Button secondary onClick={() => setShowLoans(!showLoans)}>
              {showLoans ? "Ver movimientos" : "Consultar préstamos"}
              <ArrowRight size={15} />
            </Button>
          </div>
          <Card className="overflow-hidden">
            <div className="grid gap-4 border-b border-border p-5 sm:grid-cols-2 xl:grid-cols-5">
              <Field label="Producto">
                <select
                  aria-label="Filtrar producto"
                  className={fieldClass}
                  value={productFilter}
                  onChange={(event) => setProductFilter(event.target.value)}
                >
                  <option value="">Todos los productos</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.id} · {product.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Tipo de movimiento">
                <select
                  aria-label="Filtrar tipo de movimiento"
                  className={fieldClass}
                  value={typeFilter}
                  onChange={(event) => setTypeFilter(event.target.value)}
                >
                  <option value="">Todos los tipos</option>
                  {Object.entries(movementTypes).map(([value, config]) => (
                    <option key={value} value={value}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Usuario responsable">
                <select
                  aria-label="Filtrar usuario"
                  className={fieldClass}
                  value={userFilter}
                  onChange={(event) => setUserFilter(event.target.value)}
                >
                  <option value="">Todos los usuarios</option>
                  {[...new Set(movements.map((item) => item.user))].map(
                    (name) => (
                      <option key={name}>{name}</option>
                    ),
                  )}
                </select>
              </Field>
              <Field label="Desde">
                <input
                  aria-label="Movimientos desde"
                  type="date"
                  className={fieldClass}
                  value={from}
                  onChange={(event) => setFrom(event.target.value)}
                />
              </Field>
              <Field label="Hasta">
                <input
                  aria-label="Movimientos hasta"
                  type="date"
                  className={fieldClass}
                  value={to}
                  min={from}
                  onChange={(event) => setTo(event.target.value)}
                />
              </Field>
              <button
                onClick={() => {
                  setProductFilter("")
                  setTypeFilter("")
                  setUserFilter("")
                  setFrom("")
                  setTo("")
                }}
                className="min-h-11 text-left text-sm underline underline-offset-4"
              >
                Limpiar filtros
              </button>
            </div>
            {showLoans ? (
              <div className="p-5">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold">Préstamos</h2>
                  <select
                    aria-label="Estado de préstamos"
                    className={fieldClass + " sm:max-w-52"}
                    value={loanState}
                    onChange={(event) => setLoanState(event.target.value)}
                  >
                    <option value="pending">Pendientes / parciales</option>
                    <option value="all">Todos los préstamos</option>
                  </select>
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  {visibleLoans.map((loan) => (
                    <section
                      key={loan.id}
                      className="rounded-xl border border-border p-4"
                    >
                      <div className="flex flex-wrap justify-between gap-2">
                        <p className="text-sm font-semibold">{loan.store}</p>
                        <span className="rounded-md bg-accent px-2 py-1 text-sm text-accent-foreground">
                          {loanStatus(loan)}
                        </span>
                      </div>
                      <p className="mt-3 text-sm font-medium">
                        {loan.productName}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {loan.productId} · {loan.id} ·{" "}
                        {loan.direction === "out"
                          ? "Préstamo entregado"
                          : "Préstamo recibido"}
                      </p>
                      <div className="my-4 grid grid-cols-3 gap-2 text-sm">
                        {[
                          ["Prestadas", loan.quantity],
                          ["Devueltas", loan.returned],
                          ["Pendientes", loan.quantity - loan.returned],
                        ].map(([label, value]) => (
                          <div key={label}>
                            <p className="text-sm text-muted-foreground">
                              {label}
                            </p>
                            <p className="mt-1 font-semibold">{value}</p>
                          </div>
                        ))}
                      </div>
                      <p className="mb-3 text-sm text-muted-foreground">
                        {loan.user} · {formatDateTime(loan.at)}
                      </p>
                      {loan.returned < loan.quantity && (
                        <Button
                          secondary
                          className="w-full"
                          onClick={() => setForm({ loanId: loan.id })}
                        >
                          Registrar devolución
                        </Button>
                      )}
                    </section>
                  ))}
                </div>
                {visibleLoans.length === 0 && (
                  <Empty
                    title="No existen préstamos pendientes"
                    description="Los préstamos que registres aparecerán aquí para consultar y registrar sus devoluciones."
                  />
                )}
              </div>
            ) : (
              <>
                <div className="hidden overflow-x-auto lg:block">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-border bg-muted/60 text-sm text-muted-foreground">
                      <tr>
                        {[
                          "Fecha y hora",
                          "Producto / código",
                          "Tipo",
                          "Cantidad",
                          "Usuario",
                          "Motivo",
                          "Acción",
                        ].map((label) => (
                          <th key={label} className="px-4 py-3 font-medium">
                            {label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((item) => (
                        <tr
                          key={item.id}
                          className="border-b border-border last:border-0"
                        >
                          <td className="whitespace-nowrap px-4 py-4">
                            {formatDateTime(item.at)}
                          </td>
                          <td className="px-4 py-4">
                            <p className="font-medium">{item.productName}</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {item.productId}
                            </p>
                          </td>
                          <td className="min-w-40 px-4 py-4">
                            <span
                              className={
                                "rounded-md px-2 py-1 text-sm " +
                                (movementTypes[item.type].sign > 0
                                  ? "bg-accent text-accent-foreground"
                                  : "bg-secondary text-secondary-foreground")
                              }
                            >
                              {movementTypes[item.type].sign > 0
                                ? "Entrada"
                                : "Salida"}
                            </span>
                            <p className="mt-2 text-sm">
                              {movementTypes[item.type].label}
                            </p>
                          </td>
                          <td className="px-4 py-4 font-semibold">
                            {movementTypes[item.type].sign > 0 ? "+" : "−"}
                            {item.quantity}
                          </td>
                          <td className="px-4 py-4">{item.user}</td>
                          <td className="max-w-44 px-4 py-4 text-sm text-muted-foreground">
                            {item.reason}
                          </td>
                          <td className="px-4">
                            <button
                              onClick={() => setDetail(item)}
                              className="min-h-11 text-sm font-medium"
                            >
                              Ver detalle
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="divide-y divide-border lg:hidden">
                  {history.map((item) => (
                    <div key={item.id} className="p-5">
                      <div className="flex justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold">
                            {item.productName}
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {item.productId} · {formatDateTime(item.at)}
                          </p>
                        </div>
                        <strong className="text-xl">
                          {movementTypes[item.type].sign > 0 ? "+" : "−"}
                          {item.quantity}
                        </strong>
                      </div>
                      <p className="mt-3 text-sm">
                        {movementTypes[item.type].label}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {item.user} · {item.reason}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="rounded-md bg-muted px-2 py-1 text-sm">
                          {movementTypes[item.type].sign > 0
                            ? "Entrada"
                            : "Salida"}
                        </span>
                        <button
                          onClick={() => setDetail(item)}
                          className="min-h-11 text-sm font-medium"
                        >
                          Ver detalle
                          <ChevronRight className="ml-1 inline" size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {history.length === 0 && (
                  <Empty
                    title="No existen movimientos para estos filtros"
                    description="Registra un movimiento o modifica el producto, tipo, usuario o rango de fechas."
                  />
                )}
                <p className="border-t border-border px-5 py-4 text-sm text-muted-foreground">
                  {history.length} movimientos · Historial de solo consulta
                </p>
              </>
            )}
          </Card>
        </>
      )}
      {form && <MovementForm {...form} close={() => setForm(null)} />}{" "}
      {detail && (
        <MovementDetails movement={detail} close={() => setDetail(null)} />
      )}
    </>
  )
}
function Customers() {
  const { customers, setCustomers, notify } = useApp()
  const [query, setQuery] = useState("")
  const [editing, setEditing] = useState<Customer | "new" | null>(null)
  const [error, setError] = useState("")
  useEffect(() => { setError("") }, [editing])
  const filtered = customers.filter((customer) =>
    `${customer.name} ${customer.phone}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  )
  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const existing = typeof editing === "object" ? editing : null
    const next = {
      id: existing?.id || String(Date.now()),
      name: String(data.get("name")).trim(),
      phone: String(data.get("phone")).trim(),
      purchases: existing?.purchases || 0,
    }
    if (!next.name || !next.phone) { setError("Completa el nombre y el teléfono del cliente."); return }
    setCustomers((current) =>
      existing
        ? current.map((customer) =>
            customer.id === existing.id ? next : customer,
          )
        : [...current, next],
    )
    setEditing(null)
    notify(
      existing ? "Cliente actualizado" : "Cliente registrado correctamente",
    )
  }
  return (
    <>
      <PageTitle
        title="Clientes"
        subtitle="Registro de clientes e historial de compras."
        action={
          <Button onClick={() => setEditing("new")}>
            <Plus size={16} />
            Registrar cliente
          </Button>
        }
      />
      <Card className="overflow-hidden">
        <div className="max-w-lg p-5">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Buscar por nombre o teléfono..."
          />
        </div>
        <div className="hidden md:block">
          <table className="w-full text-left text-sm">
            <thead className="border-y border-border bg-muted/60 text-xs text-muted-foreground">
              <tr>
                {["Nombre", "Teléfono", "Compras", "Acciones"].map((label) => (
                  <th key={label} className="px-5 py-3 font-normal">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-5 py-5 font-medium">{customer.name}</td>
                  <td className="px-5 py-5 text-muted-foreground">
                    {customer.phone}
                  </td>
                  <td className="px-5 py-5">{customer.purchases}</td>
                  <td className="px-5">
                    <div className="flex items-center gap-5">
                      <button
                        onClick={() => setEditing(customer)}
                        className="min-h-11 text-sm"
                      >
                        Editar
                      </button>
                      <Link
                        to={`/historial?cliente=${encodeURIComponent(customer.name)}`}
                        className="py-3 text-sm text-muted-foreground"
                      >
                        Ver historial
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="divide-y divide-border md:hidden">
          {filtered.map((customer) => (
            <div key={customer.id} className="p-5">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium">{customer.name}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {customer.phone}
                  </p>
                </div>
                <span className="text-sm text-muted-foreground">
                  {customer.purchases} compras
                </span>
              </div>
              <div className="mt-3 flex gap-5">
                <button
                  onClick={() => setEditing(customer)}
                  className="min-h-11 text-sm"
                >
                  Editar cliente
                </button>
                <Link
                  to={`/historial?cliente=${encodeURIComponent(customer.name)}`}
                  className="flex min-h-11 items-center text-sm text-muted-foreground"
                >
                  Ver historial
                  <ArrowUpRight size={13} className="ml-2" />
                </Link>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <Empty
            title="No encontramos clientes"
            description="Prueba con otro nombre o número de teléfono."
          />
        )}
      </Card>
      {editing && (
        <Modal
          title={editing === "new" ? "Registrar cliente" : "Editar cliente"}
          close={() => setEditing(null)}
        >
          <form onSubmit={save} className="space-y-5">
            <Field label="Nombre">
              <input
                name="name"
                className={fieldClass}
                required
                autoFocus
                placeholder="Nombre completo"
                defaultValue={editing === "new" ? "" : editing.name}
              />
            </Field>
            <Field label="Teléfono">
              <input
                name="phone"
                type="tel"
                inputMode="tel"
                className={fieldClass}
                required
                placeholder="987 654 321"
                defaultValue={editing === "new" ? "" : editing.phone}
              />
            </Field>
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
            <div className="flex gap-3"><Button secondary onClick={() => setEditing(null)}>Cancelar</Button><Button type="submit" className="flex-1">Guardar cliente</Button></div>
          </form>
        </Modal>
      )}
    </>
  )
}
function CatalogManager({ kind }: { kind: "categories" | "brands" }) {
  const { user } = useAuth()
  const {
    categoryList,
    setCategoryList,
    brands,
    setBrands,
    products,
    setProducts,
    notify,
  } = useApp()
  const isCategory = kind === "categories"
  const title = isCategory ? "Categorías" : "Marcas"
  const singular = isCategory ? "categoría" : "marca"
  const collection = isCategory ? categoryList : brands
  const setCollection = isCategory ? setCategoryList : setBrands
  const [query, setQuery] = useState("")
  const [mode, setMode] = useState<"new" | "edit" | "detail" | "delete" | null>(
    null,
  )
  const [selected, setSelected] = useState<CatalogItem | null>(null)
  const [error, setError] = useState("")
  const countProducts = (name: string) =>
    products.filter(
      (product) => (isCategory ? product.category : product.brand) === name,
    ).length
  const filtered = collection.filter((item) =>
    (item.name + " " + item.id).toLowerCase().includes(query.toLowerCase()),
  )
  const open = (
    nextMode: "new" | "edit" | "detail" | "delete",
    item: CatalogItem | null = null,
  ) => {
    setSelected(item)
    setMode(nextMode)
    setError("")
  }
  const close = () => {
    setMode(null)
    setSelected(null)
    setError("")
  }
  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get("name")).trim()
    if (!name) {
      setError("Ingresa un nombre válido.")
      return
    }
    if (
      collection.some(
        (item) =>
          item.id !== selected?.id &&
          item.name.localeCompare(name, "es", { sensitivity: "base" }) === 0,
      )
    ) {
      setError("Ya existe una " + singular + " con este nombre.")
      return
    }
    const next: CatalogItem = {
      id:
        selected?.id ||
        (isCategory ? "CAT-" : "MAR-") + Date.now().toString().slice(-6),
      name,
      description: String(data.get("description")).trim(),
    }
    setCollection((current) =>
      selected
        ? current.map((item) => (item.id === selected.id ? next : item))
        : [...current, next],
    )
    if (selected)
      setProducts((current) =>
        current.map((product) =>
          (isCategory ? product.category : product.brand) === selected.name
            ? { ...product, [isCategory ? "category" : "brand"]: name }
            : product,
        ),
      )
    notify(
      (isCategory ? "Categoría" : "Marca") +
        (selected ? " actualizada" : " registrada"),
    )
    close()
  }
  const remove = () => {
    if (!selected || countProducts(selected.name) > 0) return
    setCollection((current) =>
      current.filter((item) => item.id !== selected.id),
    )
    notify((isCategory ? "Categoría" : "Marca") + " eliminada")
    close()
  }
  if (user?.role !== "admin") return <Navigate to="/" replace />
  return (
    <>
      <PageTitle
        title={title}
        eyebrow="Administración / Catálogo"
        subtitle={
          isCategory
            ? "Organiza los productos por tipo de joya."
            : "Administra las marcas de tu catálogo."
        }
        action={
          <Button onClick={() => open("new")}>
            <Plus size={16} />
            {isCategory ? "Nueva categoría" : "Nueva marca"}
          </Button>
        }
      />
      <Card className="overflow-hidden">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:max-w-md">
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder={"Buscar " + title.toLowerCase() + "..."}
            />
          </div>
          <span className="shrink-0 text-sm text-muted-foreground">
            {collection.length} {title.toLowerCase()} registradas
          </span>
        </div>
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left text-sm">
            <thead className="border-y border-border bg-muted/60 text-xs text-muted-foreground">
              <tr>
                {["Nombre", "Descripción", "Productos", "Acciones"].map(
                  (label) => (
                    <th key={label} className="px-5 py-3 font-normal">
                      {label}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-border last:border-0 hover:bg-muted/35"
                >
                  <td className="px-5 py-5">
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 items-center justify-center rounded-lg border border-border bg-background">
                        {isCategory ? (
                          <Tags size={16} strokeWidth={1.5} />
                        ) : (
                          <Bookmark size={16} strokeWidth={1.5} />
                        )}
                      </span>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {item.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="max-w-xs px-5 py-5 text-muted-foreground">
                    {item.description || "Sin descripción"}
                  </td>
                  <td className="px-5">
                    <span className="rounded-md border border-border bg-muted/40 px-2.5 py-1 text-xs">
                      {countProducts(item.name)}
                    </span>
                  </td>
                  <td className="px-5">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => open("detail", item)}
                        className="flex min-h-11 items-center gap-1.5 text-xs"
                      >
                        <Eye size={13} />
                        Ver
                      </button>
                      <button
                        onClick={() => open("edit", item)}
                        className="flex min-h-11 items-center gap-1.5 text-xs"
                      >
                        <Pencil size={13} />
                        Editar
                      </button>
                      <button
                        onClick={() => open("delete", item)}
                        className="flex min-h-11 items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 size={13} />
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="divide-y divide-border md:hidden">
          {filtered.map((item) => (
            <div key={item.id} className="p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">{item.name}</p>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    {item.id}
                  </p>
                </div>
                <span className="rounded-md bg-muted px-2.5 py-1.5 text-xs">
                  {countProducts(item.name)} productos
                </span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                {item.description || "Sin descripción"}
              </p>
              <div className="mt-4 flex gap-2">
                <Button
                  secondary
                  onClick={() => open("detail", item)}
                  className="px-3 text-xs"
                >
                  Ver
                </Button>
                <Button
                  secondary
                  onClick={() => open("edit", item)}
                  className="px-3 text-xs"
                >
                  <Pencil size={13} />
                  Editar
                </Button>
                <button
                  onClick={() => open("delete", item)}
                  className="ml-auto flex min-h-12 items-center gap-1.5 px-2 text-xs text-muted-foreground"
                >
                  <Trash2 size={13} />
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <Empty
            title={"Sin " + title.toLowerCase()}
            description="Registra un nuevo elemento o modifica la búsqueda."
          />
        )}
      </Card>
      {mode && (
        <Modal
          title={
            mode === "new"
              ? isCategory
                ? "Nueva categoría"
                : "Nueva marca"
              : mode === "edit"
                ? "Editar " + singular
                : mode === "detail"
                  ? "Detalle de " + singular
                  : "Eliminar " + singular
          }
          close={close}
        >
          {(mode === "new" || mode === "edit") && (
            <form onSubmit={save} className="space-y-5">
              <Field label="Nombre">
                <input
                  className={fieldClass}
                  name="name"
                  autoFocus
                  required
                  maxLength={60}
                  defaultValue={selected?.name || ""}
                  placeholder={
                    isCategory ? "Ej. Anillos" : "Nombre de la marca"
                  }
                />
              </Field>
              <Field label="Descripción" optional>
                <textarea
                  className={fieldClass + " min-h-24 resize-y"}
                  name="description"
                  maxLength={200}
                  defaultValue={selected?.description || ""}
                  placeholder="Descripción breve"
                />
              </Field>
              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}
              <div className="flex gap-3">
                <Button secondary onClick={close} className="flex-1">
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1">
                  Guardar {singular}
                </Button>
              </div>
            </form>
          )}
          {mode === "detail" && selected && (
            <>
              <p className="mb-2 text-xs text-muted-foreground">
                {selected.id}
              </p>
              <h3 className="text-xl font-semibold">{selected.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {selected.description || "Sin descripción"}
              </p>
              <div className="my-6 flex justify-between border-y border-border py-4 text-sm">
                <span className="text-muted-foreground">
                  Productos asociados
                </span>
                <strong>{countProducts(selected.name)}</strong>
              </div>
              <Button className="w-full" onClick={() => open("edit", selected)}>
                <Pencil size={15} />
                Editar {singular}
              </Button>
            </>
          )}
          {mode === "delete" && selected && (
            <>
              <p className="text-sm leading-relaxed">
                ¿Eliminar <strong>{selected.name}</strong>?
              </p>
              <p className="mb-6 mt-3 text-sm leading-relaxed text-muted-foreground">
                {countProducts(selected.name) > 0
                  ? "Este registro tiene productos asociados. Reasigna esos productos antes de eliminarlo."
                  : "Esta acción eliminará el registro del catálogo."}
              </p>
              <div className="flex gap-3">
                <Button secondary onClick={close} className="flex-1">
                  Cancelar
                </Button>
                <Button
                  disabled={countProducts(selected.name) > 0}
                  onClick={remove}
                  className="flex-1"
                >
                  Eliminar {singular}
                </Button>
              </div>
            </>
          )}
        </Modal>
      )}
    </>
  )
}
function CategoriesPage() {
  return <CatalogManager kind="categories" />
}
function BrandsPage() {
  return <CatalogManager kind="brands" />
}
function More() {
  const { user } = useAuth()
  const entries = [
    {
      path: "/clientes",
      label: "Clientes",
      description: "Datos e historial de compras",
      icon: Users,
    },
    {
      path: "/inventario",
      label: "Inventario",
      description: "Stock y reposición de productos",
      icon: Package,
    },
    ...(user?.role === "admin"
      ? [
          {
            path: "/categorias",
            label: "Categorías",
            description: "Administración de categorías",
            icon: Tags,
          },
          {
            path: "/marcas",
            label: "Marcas",
            description: "Administración de marcas",
            icon: Bookmark,
          },
        ]
      : []),
    {
      path: "/configuracion",
      label: "Configuración",
      description: "Información de la tienda y tu perfil",
      icon: Settings2,
    },
    {
      path: "/salir",
      label: "Cerrar sesión",
      description: "Finalizar la sesión actual",
      icon: LogOut,
    },
  ]
  return (
    <>
      <PageTitle
        title="Más"
        subtitle="Secciones y administración del sistema."
      />
      <Card className="divide-y divide-border">
        {entries.map(({ path, label, description, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            className="flex min-h-20 items-center gap-4 p-5"
          >
            <span className="flex size-10 items-center justify-center rounded-lg bg-muted">
              <Icon size={19} strokeWidth={1.5} />
            </span>
            <div>
              <p className="text-sm font-medium">{label}</p>
              <p className="mt-1.5 text-xs text-muted-foreground">
                {description}
              </p>
            </div>
            <ChevronRight size={16} className="ml-auto text-muted-foreground" />
          </Link>
        ))}
      </Card>
    </>
  )
}
function Configuration() {
  const { user } = useAuth()
  return (
    <div className="max-w-3xl">
      <PageTitle
        title="Configuración"
        subtitle="Información del negocio y de la sesión actual."
      />
      <Card className="p-6">
        <h2 className="mb-6 text-sm font-semibold">Información general</h2>
        <div className="space-y-5">
          {[
            ["Negocio", "Carolina Joyería"],
            ["Usuario", user?.name],
            ["Rol", user?.role === "admin" ? "Administradora" : "Vendedora"],
            ["Moneda", "Soles peruanos (S/)"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex justify-between gap-4 border-b border-border pb-4 text-sm"
            >
              <span className="text-muted-foreground">{label}</span>
              <span className="font-medium">{value}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 flex gap-3 rounded-lg bg-muted p-4">
          <CircleHelp size={18} className="shrink-0 text-muted-foreground" />
          <p className="text-xs leading-relaxed text-muted-foreground">
            Prototipo con datos de ejemplo. Los cambios se mantienen durante la
            sesión y se restablecen al recargar o cerrar sesión.
          </p>
        </div>
        <Link
          to="/salir"
          className="mt-6 inline-flex min-h-12 items-center gap-2 text-sm"
        >
          <LogOut size={16} />
          Cerrar sesión
        </Link>
      </Card>
    </div>
  )
}
function Login() {
  const { setUser } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const profile = profiles.find(
      (item) => item.username === username.trim().toLowerCase(),
    )
    if (!profile) {
      setError("Usuario no reconocido. Utiliza paola o dorie.")
      return
    }
    setUser(profile)
    navigate("/", { replace: true })
  }
  return (
    <main className="grid min-h-dvh bg-white lg:grid-cols-[1.05fr_1fr]">
      <section className="relative hidden min-h-dvh overflow-hidden bg-[#050706] lg:block">
        <img
          src="https://images.unsplash.com/photo-1719862056514-0cdacd9142b5?auto=format&fit=max&w=1600&q=90"
          alt="Collar de diamantes y perla con colgante sobre fondo negro"
          className="absolute inset-0 h-full w-full object-contain object-center"
          fetchPriority="high"
        />
      </section>
      <section className="flex min-h-dvh flex-col items-center justify-center px-6 pb-[max(28px,env(safe-area-inset-bottom))] pt-[max(56px,env(safe-area-inset-top))] sm:px-12 lg:px-16 lg:py-10">
        <div className="w-full max-w-[390px]">
          <div className="mb-8 flex justify-center">
            <img
              src={logo}
              alt="Carolina Joyería"
              className="h-28 w-64 object-cover"
            />
          </div>
          <div className="mb-7">
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.17em] text-[#9c8562]">
              Acceso al sistema
            </p>
            <h1 className="text-[30px] font-semibold tracking-[-0.02em]">
              Iniciar sesión
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Ingresa tu usuario y contraseña.
            </p>
          </div>
          <form onSubmit={submit} className="space-y-5">
            <Field label="Usuario">
              <input
                autoComplete="username"
                className={fieldClass}
                value={username}
                onChange={(event) => {
                  setUsername(event.target.value)
                  setError("")
                }}
                placeholder="Ingresa tu usuario"
                required
              />
            </Field>
            <Field label="Contraseña">
              <div className="relative">
                <input
                  name="password"
                  autoComplete="current-password"
                  type={showPassword ? "text" : "password"}
                  className={fieldClass + " pr-12"}
                  placeholder="Contraseña de acceso"
                  required
                />
                <button
                  type="button"
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-1 top-1 flex size-10 items-center justify-center text-muted-foreground"
                >
                  <Eye size={16} />
                </button>
              </div>
            </Field>
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full min-h-[52px]">
              Ingresar al sistema
              <ArrowRight size={16} />
            </Button>
          </form>
          <div className="mt-6 flex items-start gap-2.5 rounded-lg bg-background p-3.5">
            <CircleHelp size={14} className="mt-0.5 shrink-0 text-[#9b8460]" />
            <p className="text-xs leading-relaxed text-muted-foreground">
              Acceso de demostración. Usuarios:{" "}
              <strong className="font-medium text-foreground">paola</strong> y{" "}
              <strong className="font-medium text-foreground">dorie</strong>.
              Utiliza cualquier contraseña para explorar el prototipo.
            </p>
          </div>
          <div className="mt-7 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <LockKeyhole size={11} />
            Sistema interno · Personal autorizado
          </div>
        </div>
      </section>
    </main>
  )
}
function Logout() {
  const { setUser } = useAuth()
  useEffect(() => {
    setUser(null)
  }, [setUser])
  return <Navigate to="/login" replace />
}

const router = createHashRouter([
  { path: "/login", Component: Login },
  { path: "/salir", Component: Logout },
  {
    Component: Shell,
    children: [
      { index: true, Component: Dashboard },
      { path: "productos", Component: Products },
      { path: "productos/nuevo", Component: ProductForm },
      { path: "productos/:id", Component: ProductDetail },
      { path: "productos/:id/editar", Component: ProductForm },
      { path: "venta", Component: SaleSelect },
      { path: "venta/productos", Component: SaleProducts },
      { path: "venta/confirmar", Component: SaleConfirm },
      { path: "venta/completada", Component: SaleSuccess },
      { path: "historial", Component: SalesHistory },
      { path: "historial/:id", Component: SaleDetail },
      { path: "inventario", Component: Inventory },
      { path: "clientes", Component: Customers },
      { path: "mas", Component: More },
      { path: "configuracion", Component: Configuration },
      { path: "categorias", Component: CategoriesPage },
      { path: "marcas", Component: BrandsPage },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
])
export default function App() {
  const [user, setUser] = useState<SessionUser | null>(null)
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <RouterProvider router={router} />
    </AuthContext.Provider>
  )
}
