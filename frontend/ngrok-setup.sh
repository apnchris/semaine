#!/bin/bash

# Helper script to set up ngrok for local webhook testing
# Usage: ./ngrok-setup.sh

echo "🚀 Setting up ngrok for local webhook testing..."
echo ""

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo "❌ ngrok is not installed!"
    echo ""
    echo "Install it with one of these methods:"
    echo "  - Homebrew: brew install ngrok/ngrok/ngrok"
    echo "  - Download: https://ngrok.com/download"
    echo ""
    exit 1
fi

echo "✅ ngrok is installed"
echo ""
echo "📋 Next steps:"
echo ""
echo "1. Make sure your Next.js dev server is running:"
echo "   cd frontend && npm run dev"
echo ""
echo "2. In this terminal, run:"
echo "   ngrok http 3000"
echo ""
echo "3. Copy the HTTPS URL (e.g., https://abc123.ngrok-free.app)"
echo ""
echo "4. Update your Shopify webhook URL to:"
echo "   https://YOUR-NGROK-URL.ngrok-free.app/api/shopify-sync"
echo ""
echo "5. Test by updating a product in Shopify or clicking 'Sync Now'"
echo ""
echo "💡 Tip: Keep ngrok running while testing. The URL will stay the same as long as ngrok is running."
echo ""
