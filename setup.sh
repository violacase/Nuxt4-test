#!/usr/bin/env bash
# =============================================================================
# setup.sh — Nuxt 4 Scaffold: Interactive Project Setup
# =============================================================================
# Run once after cloning to configure this project for local development.
# Handles: .env creation, package.json naming, .claude/mcp.json, npm install,
# and the initial Drizzle migration.
#
# Usage:  bash setup.sh
# =============================================================================

set -eo pipefail

# ── Colors (disabled when stdout is not a TTY) ────────────────────────────────
if [[ -t 1 ]]; then
  BOLD='\033[1m'; DIM='\033[2m'; RESET='\033[0m'
  GRN='\033[0;32m'; YEL='\033[1;33m'; BLU='\033[0;34m'
  CYN='\033[0;36m'; RED='\033[0;31m'; WHT='\033[0;37m'
else
  BOLD=''; DIM=''; RESET=''; GRN=''; YEL=''; BLU=''; CYN=''; RED=''; WHT=''
fi

# ── Print helpers ─────────────────────────────────────────────────────────────

banner() {
  printf '\n'
  printf "  ${BLU}${BOLD}╔══════════════════════════════════════════════════════╗${RESET}\n"
  printf "  ${BLU}${BOLD}║       Nuxt 4 Scaffold — Project Setup                ║${RESET}\n"
  printf "  ${BLU}${BOLD}╚══════════════════════════════════════════════════════╝${RESET}\n"
  printf '\n'
  printf "  ${DIM}Press Enter to accept the default shown in [brackets].${RESET}\n"
  printf "  ${DIM}OAuth keys are optional — press Enter to skip them.${RESET}\n"
  printf '\n'
}

section() {
  printf '\n'
  printf "  ${CYN}${BOLD}──  %s${RESET}\n" "$1"
  printf '\n'
}

ok()     { printf "  ${GRN}✓${RESET}  %s\n"      "$1"; }
info()   { printf "  ${BLU}→${RESET}  %s\n"      "$1"; }
warn()   { printf "  ${YEL}⚠${RESET}  %s\n"      "$1"; }
abort()  { printf "  ${RED}✗${RESET}  %s\n" "$1" >&2; exit 1; }
blank()  { printf '\n'; }

# ── Input helpers ─────────────────────────────────────────────────────────────
# These write to ANSWER rather than using subshells, keeping TTY interaction
# clean when ask() is called from inside conditions or loops.

ANSWER=''

ask() {
  # ask "Label" ["default"]  →  sets $ANSWER
  local label="$1" default="${2:-}"
  if [[ -n "$default" ]]; then
    printf "      ${BOLD}%s${RESET} ${DIM}[%s]${RESET}: " "$label" "$default"
  else
    printf "      ${BOLD}%s${RESET}: " "$label"
  fi
  read -r ANSWER
  ANSWER="${ANSWER:-$default}"
}

ask_secret() {
  # ask_secret "Label"  →  sets $ANSWER (input hidden, no echo)
  printf "      ${BOLD}%s${RESET}: " "$1"
  read -rs ANSWER
  printf '\n'
}

confirm() {
  # confirm "Question" ["y"|"n"]  →  returns 0 for yes, 1 for no
  local label="$1" default="${2:-y}"
  local hint; [[ "$default" == "y" ]] && hint="Y/n" || hint="y/N"
  printf "  ${BOLD}%s${RESET} ${DIM}[%s]${RESET}: " "$label" "$hint"
  local ans; read -r ans
  ans="${ans:-$default}"
  [[ "${ans,,}" == "y" ]]
}

# ── Utilities ─────────────────────────────────────────────────────────────────

slugify() {
  # Lowercase, spaces and underscores to hyphens, strip everything else
  local result
  result=$(printf '%s' "$1" \
    | tr '[:upper:]' '[:lower:]' \
    | tr ' _' '-' \
    | tr -cd 'a-z0-9-' \
    | sed 's/^-*//;s/-*$//')
  printf '%s' "${result:-my-nuxt-app}"
}

gen_password() {
  node -e "process.stdout.write(require('crypto').randomBytes(32).toString('base64url'))"
}

# ── Preflight checks ──────────────────────────────────────────────────────────

preflight() {
  [[ -f "nuxt.config.ts" && -f "package.json" ]] \
    || abort "Run this script from the project root (where nuxt.config.ts lives)."

  command -v node >/dev/null 2>&1 \
    || abort "Node.js is not installed or not in PATH."

  local node_major
  node_major=$(node -e "process.stdout.write(String(process.versions.node.split('.')[0]))")
  (( node_major >= 22 )) \
    || abort "Node.js 22+ is required. Found: $(node --version). Please upgrade."
}

# ── File writers ──────────────────────────────────────────────────────────────

write_env() {
  {
    printf '# ─── Database ──────────────────────────────────────────────────\n'
    printf 'DATABASE_URL=%s\n'                    "$DB_URL"
    printf '\n'
    printf '# ─── Nuxt Auth Utils ───────────────────────────────────────────\n'
    printf '# Min 32 characters — used to encrypt sessions\n'
    printf 'NUXT_SESSION_PASSWORD=%s\n'           "$SESSION_PASSWORD"
    printf '\n'
    printf '# ─── OAuth Providers ───────────────────────────────────────────\n'
    printf 'NUXT_OAUTH_GITHUB_CLIENT_ID=%s\n'     "$GITHUB_ID"
    printf 'NUXT_OAUTH_GITHUB_CLIENT_SECRET=%s\n' "$GITHUB_SECRET"
    printf '\n'
    printf 'NUXT_OAUTH_GOOGLE_CLIENT_ID=%s\n'     "$GOOGLE_ID"
    printf 'NUXT_OAUTH_GOOGLE_CLIENT_SECRET=%s\n' "$GOOGLE_SECRET"
    printf '\n'
    printf '# ─── App ───────────────────────────────────────────────────────\n'
    printf 'NUXT_PUBLIC_APP_NAME=%s\n'            "$APP_NAME"
  } > .env
}

update_package_name() {
  PROJECT_SLUG="$PROJECT_SLUG" node << 'EOF'
const fs = require('fs')
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
pkg.name = process.env.PROJECT_SLUG
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n')
EOF
}

update_mcp_url() {
  DB_URL="$DB_URL" node << 'EOF'
const fs = require('fs')
const mcp = JSON.parse(fs.readFileSync('.claude/mcp.json', 'utf8'))
mcp.mcpServers.postgres.args[2] = process.env.DB_URL
fs.writeFileSync('.claude/mcp.json', JSON.stringify(mcp, null, 2) + '\n')
EOF
}

# ── Main ──────────────────────────────────────────────────────────────────────

main() {
  banner
  preflight

  # ── Guard: .env already exists ──────────────────────────────────────────────
  local do_write_env=true
  if [[ -f ".env" ]]; then
    warn ".env already exists."
    if ! confirm "Overwrite it with new values?" "n"; then
      do_write_env=false
      info "Keeping existing .env — other steps will still apply."
    fi
  fi

  # ── Inputs: Project ─────────────────────────────────────────────────────────
  section "Project"

  ask "Project slug  (used in package.json)" "my-nuxt-app"
  PROJECT_SLUG=$(slugify "$ANSWER")
  printf "      ${DIM}→ normalised to: %s${RESET}\n" "$PROJECT_SLUG"

  ask "Display name  (NUXT_PUBLIC_APP_NAME)" "My App"
  APP_NAME="$ANSWER"

  # ── Inputs: Database ─────────────────────────────────────────────────────────
  section "Database"

  ask "PostgreSQL connection URL" \
    "postgresql://postgres:postgres@localhost:5432/${PROJECT_SLUG}"
  DB_URL="$ANSWER"

  # ── Inputs: Security ─────────────────────────────────────────────────────────
  section "Security"

  SESSION_PASSWORD=$(gen_password)
  ok "Session password auto-generated  ${DIM}(32 random bytes, base64url)${RESET}"
  printf "      ${DIM}Rotate anytime by editing NUXT_SESSION_PASSWORD in .env${RESET}\n"

  # ── Inputs: GitHub OAuth ─────────────────────────────────────────────────────
  section "OAuth — GitHub  ${DIM}(optional — press Enter to skip)${RESET}"

  ask "Client ID" ""
  GITHUB_ID="$ANSWER"

  if [[ -n "$GITHUB_ID" ]]; then
    ask_secret "Client Secret"
    GITHUB_SECRET="$ANSWER"
  else
    GITHUB_SECRET=""
    info "Skipped"
  fi

  # ── Inputs: Google OAuth ─────────────────────────────────────────────────────
  section "OAuth — Google  ${DIM}(optional — press Enter to skip)${RESET}"

  ask "Client ID" ""
  GOOGLE_ID="$ANSWER"

  if [[ -n "$GOOGLE_ID" ]]; then
    ask_secret "Client Secret"
    GOOGLE_SECRET="$ANSWER"
  else
    GOOGLE_SECRET=""
    info "Skipped"
  fi

  # ── Confirm ──────────────────────────────────────────────────────────────────
  blank
  printf "  ${BOLD}Summary of changes to apply:${RESET}\n"
  blank
  printf "  ${WHT}%-22s${RESET} %s\n"  "package.json name"  "$PROJECT_SLUG"
  printf "  ${WHT}%-22s${RESET} %s\n"  "display name"       "$APP_NAME"
  printf "  ${WHT}%-22s${RESET} %s\n"  "DATABASE_URL"       "$DB_URL"
  printf "  ${WHT}%-22s${RESET} %s\n"  "session password"   "(auto-generated)"
  [[ -n "$GITHUB_ID" ]] && printf "  ${WHT}%-22s${RESET} %s\n" "GitHub OAuth" "Client ID set"
  [[ -n "$GOOGLE_ID" ]] && printf "  ${WHT}%-22s${RESET} %s\n" "Google OAuth" "Client ID set"
  blank

  if ! confirm "Apply these changes?" "y"; then
    warn "Cancelled — no files were modified."
    exit 0
  fi

  # ── Apply: Files ─────────────────────────────────────────────────────────────
  section "Writing files"

  if $do_write_env; then
    write_env
    ok ".env created"
  else
    info ".env skipped (keeping existing file)"
  fi

  update_package_name
  ok "package.json  →  name set to \"${PROJECT_SLUG}\""

  update_mcp_url
  ok ".claude/mcp.json  →  Postgres URL updated"

  # ── Apply: npm install ───────────────────────────────────────────────────────
  section "Installing dependencies"

  if confirm "Run npm install now?" "y"; then
    blank
    npm install
    blank
    ok "Dependencies installed"
  else
    info "Skipped — run npm install when ready"
  fi

  # ── Apply: Database migration ────────────────────────────────────────────────
  section "Database migration"

  printf "  ${DIM}This generates the SQL migration and creates the users table.${RESET}\n"
  printf "  ${DIM}Skip if your database isn't running yet.${RESET}\n"
  blank

  if confirm "Is Postgres running and reachable at the URL above?" "y"; then
    blank
    info "npm run db:generate"
    npm run db:generate
    blank
    info "npm run db:migrate"
    npm run db:migrate
    blank
    ok "Migration applied — users table is ready"
  else
    warn "Skipped. Run these when the database is ready:"
    printf "      ${DIM}npm run db:generate${RESET}\n"
    printf "      ${DIM}npm run db:migrate${RESET}\n"
  fi

  # ── Done ─────────────────────────────────────────────────────────────────────
  blank
  printf "  ${GRN}${BOLD}╔══════════════════════════════════════════════════════╗${RESET}\n"
  printf "  ${GRN}${BOLD}║  ✓  Setup complete — ready to develop                ║${RESET}\n"
  printf "  ${GRN}${BOLD}╚══════════════════════════════════════════════════════╝${RESET}\n"
  blank
  printf "  Start both processes in separate terminals:\n"
  blank
  printf "  ${CYN}npm run dev${RESET}               ${DIM}# Nuxt dev server${RESET}\n"
  printf "  ${CYN}npm run codegen:watch${RESET}     ${DIM}# GQL type generation (watch mode)${RESET}\n"
  blank
  printf "  Add shadcn-vue components as you need them:\n"
  blank
  printf "  ${CYN}npx shadcn-vue@latest add button${RESET}\n"
  printf "  ${CYN}npx shadcn-vue@latest add dialog input card${RESET}\n"
  blank
}

main "$@"
