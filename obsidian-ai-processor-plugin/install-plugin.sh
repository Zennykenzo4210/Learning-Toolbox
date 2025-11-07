#!/bin/bash

echo "🚀 AI Processor Plugin Installer"
echo "================================"
echo ""

# Yêu cầu nhập đường dẫn vault
read -p "Nhập đường dẫn đến Obsidian vault của bạn: " VAULT_PATH

# Kiểm tra vault path có tồn tại không
if [ ! -d "$VAULT_PATH" ]; then
  echo "❌ Lỗi: Vault path không tồn tại: $VAULT_PATH"
  exit 1
fi

# Tạo thư mục plugins nếu chưa có
PLUGINS_DIR="$VAULT_PATH/.obsidian/plugins"
if [ ! -d "$PLUGINS_DIR" ]; then
  echo "📁 Tạo thư mục plugins..."
  mkdir -p "$PLUGINS_DIR"
fi

# Tạo thư mục ai-processor
AI_PROCESSOR_DIR="$PLUGINS_DIR/ai-processor"
if [ -d "$AI_PROCESSOR_DIR" ]; then
  echo "⚠️  Thư mục ai-processor đã tồn tại. Ghi đè? (y/n)"
  read -p "> " OVERWRITE
  if [ "$OVERWRITE" != "y" ]; then
    echo "❌ Đã hủy cài đặt"
    exit 0
  fi
  rm -rf "$AI_PROCESSOR_DIR"
fi

echo "📁 Tạo thư mục plugin..."
mkdir -p "$AI_PROCESSOR_DIR"

# Copy files
echo "📋 Copy files..."
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cp "$SCRIPT_DIR/main.js" "$AI_PROCESSOR_DIR/"
cp "$SCRIPT_DIR/manifest.json" "$AI_PROCESSOR_DIR/"
cp "$SCRIPT_DIR/styles.css" "$AI_PROCESSOR_DIR/"

# Kiểm tra
if [ -f "$AI_PROCESSOR_DIR/main.js" ] && \
   [ -f "$AI_PROCESSOR_DIR/manifest.json" ] && \
   [ -f "$AI_PROCESSOR_DIR/styles.css" ]; then
  echo ""
  echo "✅ Cài đặt thành công!"
  echo ""
  echo "📍 Plugin được cài tại: $AI_PROCESSOR_DIR"
  echo ""
  echo "📊 Files đã copy:"
  ls -lh "$AI_PROCESSOR_DIR"
  echo ""
  echo "🔄 Bước tiếp theo:"
  echo "   1. Mở Obsidian"
  echo "   2. Vào Settings → Community plugins"
  echo "   3. Bật 'Turn on community plugins' (nếu chưa bật)"
  echo "   4. Click nút Reload (icon refresh)"
  echo "   5. Tìm và bật 'AI Processor for Learning'"
  echo "   6. Vào Settings → AI Processor để cấu hình API keys"
  echo ""
  echo "🧠 Để sử dụng:"
  echo "   - Click icon brain (🧠) trên thanh bên trái"
  echo "   - Hoặc: Ctrl/Cmd + P → gõ 'AI Processor'"
  echo ""
else
  echo "❌ Lỗi: Copy files không thành công"
  echo "Kiểm tra xem các files sau có tồn tại không:"
  echo "  - $SCRIPT_DIR/main.js"
  echo "  - $SCRIPT_DIR/manifest.json"
  echo "  - $SCRIPT_DIR/styles.css"
  exit 1
fi
