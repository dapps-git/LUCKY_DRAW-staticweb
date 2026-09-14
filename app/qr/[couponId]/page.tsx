'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { QrViewerPage } from '../../../src/views/QrViewerPage'

export default function Page() {
  const params = useParams()
  const couponId = (params?.couponId as string) || ''
  return <QrViewerPage couponId={couponId} />
}
