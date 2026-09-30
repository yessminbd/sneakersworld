import { useState, useEffect } from 'react'

export const useLocalList = (storageKey, defaults, getKey = (item) => String(item).toLowerCase()) => {
  const [custom, setCustom] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(custom))
    } catch { }
  }, [storageKey, custom])

  const defaultKeys = new Set(defaults.map(getKey))
  const items = [...defaults, ...custom.filter((c) => !defaultKeys.has(getKey(c)))]

  const add = (item) => setCustom((prev) => [...prev, item])

  return [items, add]
}