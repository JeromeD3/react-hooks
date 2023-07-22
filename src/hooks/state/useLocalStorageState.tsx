import { createUseStorageState } from './createUseStorageState'

const isBrowser = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
)

const useLocalStorageState = createUseStorageState(() => (isBrowser ? localStorage : undefined))

export default useLocalStorageState
