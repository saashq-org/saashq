import React, { useEffect, useState } from "react"
import {
  activeOrderIdAtom,
  customerAtom,
  customerTypeAtom,
} from "@/store/order.store"
import { customerPopoverAtom } from "@/store/ui.store"
import { useQuery } from "@apollo/client"
import { useAtom, useAtomValue } from "jotai"
import { Check, ChevronsUpDown, XIcon } from "lucide-react"

import {
  Customer as CustomerT,
  CustomerType as CustomerTypeT,
} from "@/types/customer.types"
import useKeyEvent from "@/lib/useKeyEvent"
import { cn, getCustomerLabel } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { Kbd } from "@/components/ui/kbd"
import Loader from "@/components/ui/loader"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"

import useOrderCU from "../orders/hooks/useOrderCU"
import CustomerType from "./CustomerType"
import { queries } from "./graphql"

const placeHolder = (type: CustomerTypeT) => {
  if (type === "company") return "Байгууллага"
  if (type === "user") return "Ажилтан"
  return "Хэрэглэгч"
}
const Customer = () => {
  const _id = useAtomValue(activeOrderIdAtom)
  const [open, setOpen] = useAtom(customerPopoverAtom)
  const [customer, setCustomer] = useAtom(customerAtom)
  const [customerType, setCustomerType] = useAtom(customerTypeAtom)
  const [value, setValue] = React.useState("")
  const [searchValue, setSearchValue] = useState("")
  const { orderCU, loading: loadingCU } = useOrderCU()
  useKeyEvent(() => setOpen(true), "F9")

  const { loading, data } = useQuery(queries.poscCustomers, {
    fetchPolicy: "network-only",
    variables: {
      searchValue: value,
      type: customerType,
    },
    skip: !searchValue,
  })

  const { poscCustomers } = data || {}
  
  useEffect(() => {
    const timeOutId = setTimeout(() => setSearchValue(value), 500)
    return () => clearTimeout(timeOutId)
  }, [value, setSearchValue])

  const handleSelect = (cus: CustomerT) => {
    setCustomer(cus._id === customer?._id ? null : cus)
    setOpen(false)
    _id && setTimeout(orderCU, 100)
  }

  const handleClean = () => {
    setCustomer(null)
    setCustomerType("")
  }

  return (
    <>
      <div className="flex items-center gap-1 relative">
        <CustomerType className="h-5 w-5" />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between px-2"
            >
              {!!customer ? (
                getCustomerLabel(customer)
              ) : (
                <span>
                  {`${placeHolder(customerType)} сонгох`}{" "}
                  <Kbd className="bg-neutral-200/70 px-1">F9</Kbd>
                </span>
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          {!!customer && (
            <Button
              variant="secondary"
              className="h-5 w-5 p-0.5 rounded-full absolute right-2 top-1/2 -translate-y-1/2"
              onClick={handleClean}
            >
              <XIcon className="h-4 w-4" />
            </Button>
          )}
          <PopoverContent className="w-[var(--radix-popper-anchor-width)] p-0">
            <Command shouldFilter={false}>
              <CommandInput
                placeholder={`${placeHolder(customerType)} хайх`}
                onValueChange={(value) => setValue(value)}
                value={value}
              />
              <CommandEmpty>
                {loading
                  ? "Хайж байна..."
                  : `${placeHolder(customerType)} олдсонгүй`}
              </CommandEmpty>
              {!!(poscCustomers || []).length && (
                <CommandGroup>
                  <ScrollArea className="h-[300px]">
                    {(poscCustomers || []).map((cus: CustomerT) => (
                      <CommandItem
                        key={cus._id + "_" + value}
                        onSelect={() => handleSelect(cus)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            customer?._id === cus._id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {getCustomerLabel(cus)}
                      </CommandItem>
                    ))}{" "}
                  </ScrollArea>
                </CommandGroup>
              )}
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      {loadingCU && <Loader className="absolute inset-0 bg-white/50" />}
    </>
  )
}

export default Customer
