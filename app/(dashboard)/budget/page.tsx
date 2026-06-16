'use client'

import { MoveRight } from 'lucide-react'
import Link from 'next/link'

export default function BudgetRedirectPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 max-w-md w-full text-center">
        <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-5">
          <MoveRight className="w-7 h-7 text-amber-600" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Module déplacé</h1>
        <p className="text-gray-500 text-sm mb-6">
          Ce module a été renommé.
        </p>
        <Link
          href="/boq"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors text-sm"
        >
          Aller vers BOQ
          <MoveRight className="w-4 h-4" />
        </Link>
        <p className="text-xs text-gray-400 mt-4">
          Budget → <span className="font-semibold text-gray-600">BOQ</span>
        </p>
      </div>
    </div>
  )
}
