// Endpoint d'intégration K'BIO NEXUS → appli archi (Nassib).
// Quand un projet K'BIO a besoin d'une partie architecture, Nexus appelle cet endpoint :
// crée un projet architectural. Protégé par ARCHI_WEBHOOK_SECRET.
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SECRET = process.env.ARCHI_WEBHOOK_SECRET
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY

export async function POST(req: NextRequest) {
  if (SECRET && req.headers.get('x-webhook-secret') !== SECRET) {
    return NextResponse.json({ error: 'secret invalide' }, { status: 401 })
  }
  if (!URL || !SERVICE) {
    return NextResponse.json({ error: 'Supabase service role non configuré (SUPABASE_SERVICE_ROLE_KEY).' }, { status: 501 })
  }

  let body: { project_code?: string; project_name?: string; country?: string; client_name?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'JSON invalide' }, { status: 400 })
  }

  const nom = (body.project_name || "Projet K'BIO").trim()
  const code = (body.project_code || '').trim()

  const sb = createClient(URL, SERVICE, { auth: { persistSession: false } })
  const { data, error } = await sb
    .from('projets')
    .insert({
      nom,
      localisation: body.country ?? null,
      maitre_ouvrage: body.client_name ?? null,
      statut: 'En préparation',
      description: `Projet architectural généré par K'BIO NEXUS${code ? ` (${code})` : ''}.`,
    })
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(
    { ok: true, projectId: data.id, detail: `Projet architectural créé dans Nassib${code ? ` (${code})` : ''}.` },
    { status: 201 },
  )
}
