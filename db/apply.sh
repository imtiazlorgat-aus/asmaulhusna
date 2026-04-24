#!/usr/bin/env bash
# Apply all migration and seed files to a Postgres database.
#
# Usage:
#   DATABASE_URL=postgres://localhost:5432/asmaulhusna ./db/apply.sh
#   DATABASE_URL=postgres://localhost:5432/asmaulhusna ./db/apply.sh migrations
#   DATABASE_URL=postgres://localhost:5432/asmaulhusna ./db/apply.sh seeds
#
# With no argument, applies migrations then seeds.

set -euo pipefail

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "Error: DATABASE_URL is not set." >&2
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODE="${1:-all}"

run_folder() {
  local folder="$1"
  if [[ ! -d "${SCRIPT_DIR}/${folder}" ]]; then
    echo "Folder not found: ${folder}" >&2
    exit 1
  fi

  echo "==> Applying ${folder}/"
  # Sort lexically so the 001_, 002_ prefixes drive order.
  for file in $(ls -1 "${SCRIPT_DIR}/${folder}"/*.sql | sort); do
    echo "  - $(basename "${file}")"
    psql "${DATABASE_URL}" -v ON_ERROR_STOP=1 -q -f "${file}"
  done
}

case "${MODE}" in
  migrations) run_folder migrations ;;
  seeds)      run_folder seeds ;;
  all)        run_folder migrations; run_folder seeds ;;
  *)
    echo "Usage: $0 [migrations|seeds|all]" >&2
    exit 1
    ;;
esac

echo "Done."
