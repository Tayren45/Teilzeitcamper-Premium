#!/usr/bin/env bash
# Teilzeitcamper Premium — einmaliges Setup: GitHub + Vercel Production
set -euo pipefail
cd "$(dirname "$0")/.."

echo "=== 1/4 GitHub ==="
if ! gh auth status &>/dev/null; then
  echo "Bitte zuerst: gh auth login"
  exit 1
fi
if ! git remote get-url origin &>/dev/null; then
  gh repo create Teilzeitcamper-Premium --public --source=. --remote=origin \
    --description "Premium-Website für Teilzeitcamper by Lackwerk Bruderer" || true
fi
git push -u origin main

echo "=== 2/4 Vercel ==="
if ! npx vercel whoami &>/dev/null; then
  echo "Bitte zuerst: npx vercel login"
  exit 1
fi
npx vercel link --yes 2>/dev/null || npx vercel link
npx vercel env pull .env.vercel.local 2>/dev/null || true

echo "=== 3/4 Production Deploy ==="
npx vercel --prod --yes

echo "=== 4/4 Nächste Schritte (manuell in Vercel Dashboard) ==="
echo "  • Storage → Upstash Redis verbinden"
echo "  • Storage → Blob verbinden"
echo "  • Env-Variablen aus .env.example setzen (Stripe, ADMIN_KEY, …)"
echo "  • Domain teilzeitcamper.ch hinzufügen"
echo "Fertig! Siehe DEPLOY.md für Details."
