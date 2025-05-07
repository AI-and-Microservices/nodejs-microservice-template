#!/bin/bash

# --- Parse version argument ---
for i in "$@"
do
case $i in
    -v=*|--version=*)
    VERSION="${i#*=}"
    shift
    ;;
    *)
    echo "Usage: ./genkey.sh -v=version"
    exit 1
    ;;
esac
done

# --- Check version provided ---
if [ -z "$VERSION" ]; then
  echo "❌ Error: version not provided. Use -v=version"
  exit 1
fi

# --- Get absolute path of the script ---
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# --- Create keys directory relative to script ---
KEY_DIR="${SCRIPT_DIR}/../keys"
mkdir -p "$KEY_DIR"

PRIVATE_KEY="$KEY_DIR/${VERSION}_private.pem"
PUBLIC_KEY="$KEY_DIR/${VERSION}_public.pem"

# --- Check if key already exists ---
if [ -f "$PRIVATE_KEY" ] || [ -f "$PUBLIC_KEY" ]; then
  echo "❌ Error: Key files for version '$VERSION' already exist."
  echo "Files: $PRIVATE_KEY, $PUBLIC_KEY"
  exit 1
fi

# --- Generate RSA key pair ---
echo "🔐 Generating RSA key pair for version '$VERSION'..."

openssl genpkey -algorithm RSA -out "$PRIVATE_KEY" -pkeyopt rsa_keygen_bits:2048
openssl rsa -pubout -in "$PRIVATE_KEY" -out "$PUBLIC_KEY"

echo "✅ Keys generated:"
echo "   Private: $PRIVATE_KEY"
echo "   Public : $PUBLIC_KEY"