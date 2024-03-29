import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

import {
  IAddToCartInput,
  IOrderItemStatus,
  OrderItem,
  OrderItemInput,
} from "@/types/order.types"
import { ORDER_STATUSES } from "@/lib/constants"

import { banFractionsAtom, orderPasswordAtom } from "./config.store"

interface IUpdateItem {
  _id: string
  count?: number
  isTake?: boolean
  description?: string
  attachment?: { url?: string } | null
  fromAdd?: boolean
  allowed?: boolean
}

export const changeCartItem = (
  product: IUpdateItem,
  cart: OrderItem[],
  banFractions?: boolean
): OrderItem[] => {
  const { _id, count, fromAdd, allowed, ...rest } = product

  const fieldKeys = Object.keys(rest)
  if (fieldKeys.length) {
    for (let key = 0; key < fieldKeys.length; key++) {
      const value = rest[fieldKeys[key] as keyof typeof rest]
      if (typeof value !== "undefined") {
        return cart.map((item) =>
          item._id === _id ? { ...item, [fieldKeys[key]]: value } : item
        )
      }
    }
  }

  if (typeof count !== "undefined") {
    const exceptCurrent = cart.filter((item) => item._id !== _id)

    const validCount = banFractions ? Math.floor(count) : count

    if (validCount === (banFractions ? 0 : -1)) return exceptCurrent

    if (!fromAdd) {
      return cart.map((item) =>
        item._id === _id ? { ...item, count: validCount } : item
      )
    }

    const currentItem =
      cart.find((item) => item._id === _id) || ({} as OrderItem)

    return [{ ...currentItem, count: validCount }, ...exceptCurrent]
  }

  return cart
}

export const addToCart = (
  product: IAddToCartInput,
  cart: OrderItem[]
): OrderItem[] => {
  const prevItem = cart.find(
    ({
      productId,
      status,
      manufacturedDate,
      isTake,
      description,
      attachment,
    }) =>
      productId === product._id &&
      status === ORDER_STATUSES.NEW &&
      manufacturedDate == product.manufacturedDate &&
      !isTake &&
      !description &&
      !attachment
  )

  if (prevItem) {
    const { _id, count } = prevItem
    return changeCartItem({ _id, count: count + 1, fromAdd: true }, cart)
  }

  const { unitPrice, _id, name, attachment } = product

  const cartItem = {
    _id: Math.random().toString(),
    productId: _id,
    count: 1,
    unitPrice,
    productName: name,
    status: ORDER_STATUSES.NEW as IOrderItemStatus,
    productImgUrl: attachment?.url,
  }

  return [cartItem, ...cart]
}

// Atoms
// cart
export const cartAtom = atomWithStorage<OrderItem[]>("cart", [])
export const cartChangedAtom = atomWithStorage<boolean>("cartChanged", false)

export const orderItemInput = atom<OrderItemInput[]>((get) =>
  get(cartAtom).map(
    ({
      _id,
      productId,
      count,
      unitPrice,
      isPackage,
      isTake,
      status,
      manufacturedDate,
      description,
      attachment,
    }) => ({
      _id,
      productId,
      count,
      unitPrice,
      isPackage,
      isTake,
      status,
      manufacturedDate,
      description,
      attachment,
    })
  )
)
export const requirePasswordAtom = atom<IUpdateItem | null>(null)
export const totalAmountAtom = atom<number>((get) =>
  (get(cartAtom) || []).reduce(
    (total, item) => total + (item?.count || 0) * (item.unitPrice || 0),
    0
  )
)
export const addToCartAtom = atom(
  () => "",
  (get, set, update: IAddToCartInput) => {
    set(cartChangedAtom, true)
    set(cartAtom, addToCart(update, get(cartAtom)))
  }
)
export const updateCartAtom = atom(
  () => "",
  (get, set, update: IUpdateItem) => {
    if (
      !!get(orderPasswordAtom) &&
      !update.allowed &&
      update.count === (get(banFractionsAtom) ? 0 : -1)
    ) {
      set(requirePasswordAtom, update)
      return
    }
    set(cartChangedAtom, true)
    set(
      cartAtom,
      changeCartItem(update, get(cartAtom), !!get(banFractionsAtom))
    )
  }
)
export const setCartAtom = atom(
  () => "",
  (get, set, update: OrderItem[]) => {
    set(cartAtom, update)
  }
)
