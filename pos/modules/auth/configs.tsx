"use client"

import { ReactNode, useEffect, useState } from "react"
import { refetchUserAtom } from "@/store"
import {
  configAtom,
  orderPasswordAtom,
  setConfigsAtom,
  setCurrentUserAtom,
} from "@/store/config.store"
import { useQuery } from "@apollo/client"
import { useAtom, useSetAtom } from "jotai"

import { hexToHsl } from "@/lib/utils"
import Loader from "@/components/ui/loader"
import { useToast } from "@/components/ui/use-toast"

import { queries } from "./graphql"

const Configs = ({ children }: { children: ReactNode }) => {
  const setConfigs = useSetAtom(setConfigsAtom)
  const setCurrentUser = useSetAtom(setCurrentUserAtom)
  const setConfig = useSetAtom(configAtom)
  const setOrderPassword = useSetAtom(orderPasswordAtom)
  const [loadingConfigs, setLoadingConfigs] = useState(true)
  const { onError } = useToast()
  const [fetchUser, setFetchUser] = useAtom(refetchUserAtom)

  const { loading, data, refetch } = useQuery(queries.posCurrentUser)

  const { data: config, loading: loadingConfig } = useQuery(
    queries.currentConfig
  )

  useQuery(queries.configs, {
    onCompleted: (data) => {
      setConfigs(data.posclientConfigs)
      setTimeout(() => setLoadingConfigs(false), 20)
    },
    onError: (error) => {
      onError(error)
      setTimeout(() => setLoadingConfigs(false), 20)
    },
  })

  useEffect(() => {
    if (fetchUser) {
      refetch()
      setFetchUser(false)
    }
  }, [fetchUser, refetch, setFetchUser])

  useEffect(() => {
    setCurrentUser(data?.posCurrentUser)
  }, [data, setCurrentUser])

  useEffect(() => {
    const { uiOptions, orderPassword, ...restConfig } =
      (config || {}).currentConfig || {}

    if (restConfig) {
      setConfig(restConfig)
    }
    setOrderPassword(orderPassword)

    const { primary } = uiOptions?.colors || {}

    if (primary) {
      document.documentElement.style.setProperty(
        "--primary",
        hexToHsl(primary || "#4f33af")
      )
    }
  }, [config, setConfig, setOrderPassword])

  if (loading || loadingConfig || loadingConfigs)
    return <Loader className="h-screen" />

  return <>{children}</>
}

export default Configs
