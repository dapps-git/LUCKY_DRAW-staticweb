'use client'

import React, { type ReactNode } from 'react'
import { AppProvider } from '../src/context/AppContext'

export function Providers({ children }: { children: ReactNode }) {
  return <AppProvider>{children}</AppProvider>
}
