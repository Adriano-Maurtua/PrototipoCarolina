export type Product = {
  id: string
  name: string
  category: string
  material: string
  price: number
  stock: number
  description: string
  brand?: string
}
export type SaleItem = {
  product: Product
  quantity: number
  unitPrice?: number
  priceChangedBy?: string
  priceChangedAt?: string
}
export type Sale = {
  id: string
  date: string
  time: string
  items: SaleItem[]
  original: number
  final: number
  payment: string
  customer: string
  user: string
  status?: "registered" | "cancelled"
  cancellation?: {
    user: string
    at: string
    reason: string
  }
}
export type SessionUser = {
  username: string
  name: string
  role: "admin" | "seller"
}
export const movementTypes = {
  entry: { label: "Entrada de mercadería", sign: 1 },
  "loan-out": { label: "Salida por préstamo a otra tienda", sign: -1 },
  "loan-in": { label: "Recepción de préstamo de otra tienda", sign: 1 },
  "return-out": { label: "Devolución de préstamo entregado", sign: 1 },
  "return-in": { label: "Devolución de préstamo recibido", sign: -1 },
  "adjust-positive": { label: "Ajuste positivo de inventario", sign: 1 },
  "adjust-negative": { label: "Ajuste negativo de inventario", sign: -1 },
  sale: { label: "Salida por venta", sign: -1 },
  cancellation: { label: "Reintegro por anulación", sign: 1 },
} as const
export type MovementType = keyof typeof movementTypes
export type ManualMovementType = Exclude<MovementType, "sale" | "cancellation">
export type Movement = {
  id: string
  at: string
  productId: string
  productName: string
  type: MovementType
  quantity: number
  before: number
  after: number
  user: string
  reason: string
  store?: string
  loanId?: string
  saleId?: string
}
export type Loan = {
  id: string
  productId: string
  productName: string
  direction: "out" | "in"
  store: string
  quantity: number
  returned: number
  user: string
  at: string
}
export type Operations = {
  products: Product[]
  sales: Sale[]
  movements: Movement[]
  loans: Loan[]
}
export type MovementInput = {
  productId: string
  type: ManualMovementType
  quantity: number
  reason: string
  store?: string
  loanId?: string
}
export type TransactionResult = {
  ok: true
  state: Operations
} | {
  ok: false
  error: string
}
export const demoDate = (offset = 0) => {
  const date = new Date()
  date.setUTCDate(date.getUTCDate() + offset)
  return date.toISOString().slice(0, 10)
}
export const todayDate = demoDate()
export const formatDate = (date: string) =>
  new Date(date.length === 10 ? date + "T12:00:00" : date).toLocaleDateString(
    "es-PE",
  )
export const formatDateTime = (date: string) =>
  new Date(date).toLocaleString("es-PE", {
    dateStyle: "short",
    timeStyle: "short",
  })
export const loanStatus = (loan: Loan) =>
  loan.returned >= loan.quantity
    ? "Devuelto completamente"
    : loan.returned > 0
      ? "Devuelto parcialmente"
      : "Pendiente"
export const isAdjustment = (type: string) => type.startsWith("adjust-")
export const isReturn = (type: string) => type.startsWith("return-")
export const isLoanMovement = (type: string) =>
  type.startsWith("loan-") || isReturn(type)
const movementId = (count: number) =>
  "MOV-" + String(count + 1).padStart(5, "0")

export function registerMovement(
  state: Operations,
  input: MovementInput,
  user: SessionUser,
  at = new Date().toISOString(),
): TransactionResult {
  const product = state.products.find((item) => item.id === input.productId)
  if (!product) return { ok: false, error: "Selecciona un producto válido." }
  if (
    !Object.prototype.hasOwnProperty.call(movementTypes, input.type) ||
    input.type === "sale" as string ||
    input.type === "cancellation" as string
  )
    return {
      ok: false,
      error: "Selecciona un tipo de movimiento manual válido.",
    }
  if (isAdjustment(input.type) && user.role !== "admin")
    return {
      ok: false,
      error: "Solo la administradora puede registrar ajustes de inventario.",
    }
  if (!Number.isSafeInteger(input.quantity) || input.quantity <= 0)
    return { ok: false, error: "Ingresa una cantidad entera mayor que cero." }
  if (!input.reason.trim())
    return { ok: false, error: "Indica el motivo del movimiento." }
  const loan = state.loans.find((item) => item.id === input.loanId)
  let store = input.store?.trim()
  if (isReturn(input.type)) {
    const direction = input.type === "return-out" ? "out" : "in"
    if (
      !loan ||
      loan.productId !== product.id ||
      loan.direction !== direction ||
      loan.returned >= loan.quantity
    )
      return {
        ok: false,
        error:
          "Selecciona un préstamo pendiente del producto y del tipo correspondiente.",
      }
    if (input.quantity > loan.quantity - loan.returned)
      return {
        ok: false,
        error: "La devolución supera las unidades pendientes del préstamo.",
      }
    store = loan.store
  }
  if (isLoanMovement(input.type) && !store)
    return { ok: false, error: "Indica el nombre de la tienda relacionada." }
  const after = product.stock + movementTypes[input.type].sign * input.quantity
  if (after < 0)
    return {
      ok: false,
      error:
        "No puedes retirar más unidades que el stock disponible (" +
        product.stock +
        ").",
    }
  const id = movementId(state.movements.length)
  const loanId = input.type.startsWith("loan-")
    ? "PRE-" + String(state.loans.length + 1).padStart(4, "0")
    : loan?.id
  const movement: Movement = {
    id,
    at,
    productId: product.id,
    productName: product.name,
    type: input.type,
    quantity: input.quantity,
    before: product.stock,
    after,
    user: user.name,
    reason: input.reason.trim(),
    ...(isLoanMovement(input.type) ? { store, loanId } : {}),
  }
  let loans = state.loans
  if (input.type.startsWith("loan-"))
    loans = [
      ...loans,
      {
        id: loanId!,
        productId: product.id,
        productName: product.name,
        direction: input.type === "loan-out" ? "out" : "in",
        store: store!,
        quantity: input.quantity,
        returned: 0,
        user: user.name,
        at,
      },
    ]
  else if (isReturn(input.type))
    loans = loans.map((item) =>
      item.id === loan!.id
        ? { ...item, returned: item.returned + input.quantity }
        : item,
    )
  return {
    ok: true,
    state: {
      ...state,
      products: state.products.map((item) =>
        item.id === product.id ? { ...item, stock: after } : item,
      ),
      movements: [...state.movements, movement],
      loans,
    },
  }
}

export function registerSale(
  state: Operations,
  sale: Sale,
  user: SessionUser,
  at = new Date().toISOString(),
): TransactionResult {
  if (state.sales.some((item) => item.id === sale.id))
    return { ok: false, error: "Esta venta ya fue registrada." }
  if (!sale.items.length || !Number.isFinite(sale.final) || sale.final <= 0)
    return {
      ok: false,
      error: "Revisa los productos y el importe de la venta.",
    }
  const products = state.products.map((product) => ({ ...product }))
  const movements: Movement[] = []
  let original = 0
  let total = 0
  for (const item of sale.items) {
    const product = products.find((product) => product.id === item.product.id)
    const price = item.unitPrice ?? item.product.price
    if (
      !product ||
      !Number.isSafeInteger(item.quantity) ||
      item.quantity <= 0 ||
      item.quantity > product.stock
    )
      return {
        ok: false,
        error:
          "Stock insuficiente para " +
          item.product.name +
          ". Revisa las cantidades.",
      }
    if (!Number.isFinite(price) || price <= 0)
      return { ok: false, error: "El precio unitario debe ser mayor que cero." }
    original += item.product.price * item.quantity
    total += price * item.quantity
    const before = product.stock
    product.stock -= item.quantity
    movements.push({
      id: movementId(state.movements.length + movements.length),
      at,
      productId: product.id,
      productName: product.name,
      type: "sale",
      quantity: item.quantity,
      before,
      after: product.stock,
      user: user.name,
      reason: "Venta #" + sale.id,
      saleId: sale.id,
    })
  }
  if (
    Math.abs(sale.final - total) > 0.005 ||
    Math.abs(sale.original - original) > 0.005
  )
    return {
      ok: false,
      error: "El total cambió. Revisa los importes antes de confirmar.",
    }
  return {
    ok: true,
    state: {
      ...state,
      products,
      movements: [...state.movements, ...movements],
      sales: [
        { ...sale, user: user.name, status: "registered" },
        ...state.sales,
      ],
    },
  }
}

export function cancelSale(
  state: Operations,
  saleId: string,
  reason: string,
  user: SessionUser,
  at = new Date().toISOString(),
): TransactionResult {
  if (user.role !== "admin")
    return { ok: false, error: "Solo la administradora puede anular ventas." }
  const sale = state.sales.find((item) => item.id === saleId)
  if (!sale) return { ok: false, error: "No se encontró la venta." }
  if (sale.status === "cancelled")
    return {
      ok: false,
      error: "Esta venta ya está anulada y no puede anularse nuevamente.",
    }
  if (!reason.trim())
    return { ok: false, error: "El motivo de anulación es obligatorio." }
  const products = state.products.map((product) => ({ ...product }))
  const movements: Movement[] = []
  for (const item of sale.items) {
    const product = products.find((product) => product.id === item.product.id)
    if (!product)
      return {
        ok: false,
        error: "No se puede reintegrar un producto que no está en el catálogo.",
      }
    const before = product.stock
    product.stock += item.quantity
    movements.push({
      id: movementId(state.movements.length + movements.length),
      at,
      productId: product.id,
      productName: item.product.name,
      type: "cancellation",
      quantity: item.quantity,
      before,
      after: product.stock,
      user: user.name,
      reason: reason.trim(),
      saleId,
    })
  }
  return {
    ok: true,
    state: {
      ...state,
      products,
      movements: [...state.movements, ...movements],
      sales: state.sales.map((item) =>
        item.id === saleId
          ? {
              ...item,
              status: "cancelled",
              cancellation: { user: user.name, at, reason: reason.trim() },
            }
          : item,
      ),
    },
  }
}

export function createInitialOperations(
  products: Product[],
  sales: Sale[],
): Operations {
  const stock = new Map(
    products.map((product) => [
      product.id,
      product.stock +
        sales.reduce(
          (sum, sale) =>
            sum +
            sale.items
              .filter((item) => item.product.id === product.id)
              .reduce((count, item) => count + item.quantity, 0),
          0,
        ) +
        (product.id === "AN-001" ? 2 : product.id === "PU-008" ? -2 : 0),
    ]),
  )
  const movements: Movement[] = []
  const add = (
    product: Product,
    type: MovementType,
    quantity: number,
    at: string,
    user: string,
    reason: string,
    extra: Partial<Movement> = {},
  ) => {
    const before = stock.get(product.id) || 0
    const after = before + movementTypes[type].sign * quantity
    stock.set(product.id, after)
    movements.push({
      id: movementId(movements.length),
      at,
      productId: product.id,
      productName: product.name,
      type,
      quantity,
      before,
      after,
      user,
      reason,
      ...extra,
    })
  }
  for (const product of products) {
    const quantity = stock.get(product.id) || 0
    stock.set(product.id, 0)
    add(
      product,
      "entry",
      quantity,
      demoDate(-7) + "T09:00:00",
      "Paola",
      "Registro inicial del inventario",
    )
  }
  const lent = products.find((product) => product.id === "AN-001")!
  const received = products.find((product) => product.id === "PU-008")!
  const loans: Loan[] = [
    {
      id: "PRE-0001",
      productId: lent.id,
      productName: lent.name,
      direction: "out",
      store: "Joyería Aurora",
      quantity: 3,
      returned: 1,
      user: "Paola",
      at: demoDate(-3) + "T10:00:00",
    },
    {
      id: "PRE-0002",
      productId: received.id,
      productName: received.name,
      direction: "in",
      store: "Joyería Elena",
      quantity: 2,
      returned: 0,
      user: "Dorie",
      at: demoDate(-3) + "T11:00:00",
    },
  ]
  add(
    lent,
    "loan-out",
    3,
    loans[0].at,
    "Paola",
    "Préstamo temporal de piezas",
    { store: loans[0].store, loanId: loans[0].id },
  )
  add(
    received,
    "loan-in",
    2,
    loans[1].at,
    "Dorie",
    "Recepción temporal para exhibición",
    { store: loans[1].store, loanId: loans[1].id },
  )
  add(
    lent,
    "return-out",
    1,
    demoDate(-2) + "T09:30:00",
    "Paola",
    "Primera devolución del préstamo",
    { store: loans[0].store, loanId: loans[0].id },
  )
  const ordered = [...sales].sort((left, right) =>
    (left.date + left.time).localeCompare(right.date + right.time),
  )
  for (const sale of ordered)
    for (const item of sale.items)
      add(
        item.product,
        "sale",
        item.quantity,
        sale.date + "T" + sale.time + ":00",
        sale.user,
        "Venta #" + sale.id,
        { saleId: sale.id },
      )
  return {
    products: products.map((product) => ({
      ...product,
      brand: "Carolina Joyería",
      stock: stock.get(product.id)!,
    })),
    sales: sales.map((sale) => ({
      ...sale,
      status: "registered",
      items: sale.items.map((item, index) => {
        const changed = sale.final !== sale.original && index === sale.items.length - 1
        return {
          ...item,
          unitPrice: changed ? item.product.price + (sale.final - sale.original) / item.quantity : item.product.price,
          ...(changed ? { priceChangedBy: sale.user, priceChangedAt: sale.date + "T" + sale.time + ":00" } : {}),
        }
      }),
    })),
    movements,
    loans,
  }
}
