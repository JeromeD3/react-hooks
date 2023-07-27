import { useRef } from 'react'

import { useUpdateEffect } from '../../Effect/useUpdateEffect'

export const isBrowser = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

const isDocumentVisible = (): boolean =>{
  if (isBrowser) {
    return document.visibilityState !== 'hidden';
  }
  return true;
}
const listeners: any[] = [];


// 一个发布订阅模式
function subscribeReVisible(listener: any) {
  listeners.push(listener);
  return function unsubscribe() {
    const index = listeners.indexOf(listener);
    listeners.splice(index, 1);
  };
}

if (isBrowser) {
  const revalidate = () => {
    if (!isDocumentVisible()) return;
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      console.log('listener', listener)
      listener();
    }
  };
  window.addEventListener('visibilitychange', revalidate, false);
}


const usePollingPlugin = (
  fetchInstance: any,
  { pollingInterval, pollingWhenHidden = true, pollingErrorRetryCount = -1 }: any
) => {
  const timerRef = useRef<number | null>()
  const unsubscribeRef = useRef<() => void>()
  const countRef = useRef<number>(0)

  const stopPolling = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    unsubscribeRef.current?.()
  }

  useUpdateEffect(() => {
    if (!pollingInterval) {
      stopPolling()
    }
  }, [pollingInterval])

  if (!pollingInterval) {
    return {}
  }

  return {
    onBefore: () => {
      stopPolling()
    },
    onError: () => {
      countRef.current += 1
    },
    onSuccess: () => {
      countRef.current = 0
    },
    onFinally: () => {
      if (
        pollingErrorRetryCount === -1 ||
        // When an error occurs, the request is not repeated after pollingErrorRetryCount retries
        (pollingErrorRetryCount !== -1 && countRef.current <= pollingErrorRetryCount)
      ) {
        timerRef.current = setTimeout(() => {
          // if pollingWhenHidden = false && document is hidden, then stop polling and subscribe revisible
          if (!pollingWhenHidden && !isDocumentVisible()) {
            unsubscribeRef.current = subscribeReVisible(() => {
              fetchInstance.refresh()
            })
          } else {
            fetchInstance.refresh()
          }
        }, pollingInterval)
      } else {
        countRef.current = 0
      }
    },
    onCancel: () => {
      stopPolling()
    },
  }
}

export default usePollingPlugin
