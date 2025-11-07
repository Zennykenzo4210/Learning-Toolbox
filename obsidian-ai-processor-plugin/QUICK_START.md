# 🚀 Quick Start - Cài đặt Plugin trong 3 Phút

## Bước 1: Tìm thư mục plugins của Obsidian vault

### Windows:
```
C:\Users\[YourName]\[VaultName]\.obsidian\plugins\
```

### macOS:
```
/Users/[YourName]/[VaultName]/.obsidian/plugins/
```

### Linux:
```
/home/[YourName]/[VaultName]/.obsidian/plugins/
```

**Lưu ý**: Nếu thư mục `plugins` chưa có, hãy tạo nó.

## Bước 2: Copy plugin vào Obsidian

### Option A: Copy thủ công

1. Mở thư mục plugin hiện tại:
   ```
   /home/user/Learning-Toolbox/obsidian-ai-processor-plugin
   ```

2. Copy **3 files sau** vào thư mục plugins của vault:
   - `main.js` ✅
   - `manifest.json` ✅
   - `styles.css` ✅

3. Cấu trúc thư mục cuối cùng sẽ như sau:
   ```
   YourVault/
   └── .obsidian/
       └── plugins/
           └── ai-processor/          ← Tạo folder này
               ├── main.js            ← Copy file
               ├── manifest.json      ← Copy file
               └── styles.css         ← Copy file
   ```

### Option B: Sử dụng script tự động (Khuyến nghị)

Chạy script bên dưới (xem phần "Script Tự Động")

## Bước 3: Bật plugin trong Obsidian

1. Mở Obsidian
2. Vào **Settings** (⚙️) → **Community plugins**
3. Nếu thấy cảnh báo "Restricted mode", click **Turn on community plugins**
4. Click nút **Reload** (icon refresh) để tải lại danh sách plugins
5. Tìm **"AI Processor for Learning"** trong danh sách
6. Toggle sang **ON** (màu xanh)

### ❓ Nếu không thấy plugin trong danh sách:

#### Kiểm tra 1: Thư mục đúng chưa?
```bash
# Chạy lệnh này để kiểm tra
ls -la /path/to/vault/.obsidian/plugins/ai-processor/
```

Phải thấy 3 files: `main.js`, `manifest.json`, `styles.css`

#### Kiểm tra 2: File manifest.json có đúng không?
```bash
cat /path/to/vault/.obsidian/plugins/ai-processor/manifest.json
```

Phải hiển thị JSON với `"id": "ai-processor"`

#### Kiểm tra 3: Community plugins đã bật chưa?
- Settings → Community plugins
- Đảm bảo "Restricted mode" is OFF

#### Kiểm tra 4: Restart Obsidian
- Đóng Obsidian hoàn toàn
- Mở lại
- Vào Settings → Community plugins → Reload

## Bước 4: Cấu hình API Keys

1. Vào **Settings** → **AI Processor**
2. Thêm API key cho ít nhất một model:

### Gemini (Miễn phí - Khuyến nghị cho người mới):
- Truy cập: https://makersuite.google.com/app/apikey
- Đăng nhập Google
- Click **"Create API Key"**
- Copy key và paste vào Obsidian

### Claude (Trả phí):
- Truy cập: https://console.anthropic.com/
- Tạo tài khoản và nạp tiền
- Tạo API key
- Copy và paste vào Obsidian

### Perplexity (Trả phí):
- Truy cập: https://www.perplexity.ai/settings/api
- Tạo tài khoản
- Tạo API key
- Copy và paste vào Obsidian

3. Chọn **Default Model** (khuyến nghị: Gemini 2.0 Flash)
4. Click **Save**

## Bước 5: Test Plugin

1. Click icon **🧠 (brain)** trên thanh bên trái Obsidian
2. Hoặc press `Ctrl/Cmd + P` → gõ "AI Processor" → Enter
3. Nếu thấy giao diện plugin → **Thành công!** 🎉

### Test nhanh:
1. Tạo một file MD mới với nội dung: "Hello World"
2. Mở file đó
3. Press `Ctrl/Cmd + P`
4. Chọn "Process current file with AI"
5. Nhập prompt: "Translate to Vietnamese"
6. Click Process
7. Kiểm tra file mới được tạo

## 🔧 Troubleshooting

### Lỗi: "Failed to load plugin"

**Nguyên nhân**: File main.js bị lỗi hoặc thiếu dependencies

**Giải pháp**:
1. Kiểm tra file main.js có tồn tại không:
   ```bash
   ls -lh /path/to/vault/.obsidian/plugins/ai-processor/main.js
   ```
2. File phải có size khoảng 34KB
3. Nếu không có hoặc size = 0, rebuild plugin:
   ```bash
   cd /home/user/Learning-Toolbox/obsidian-ai-processor-plugin
   npm run build
   # Sau đó copy lại main.js vào vault
   ```

### Lỗi: "Plugin not found in list"

**Giải pháp**:
1. Đảm bảo folder name là `ai-processor` (không có dấu gạch ngang ở đầu/cuối)
2. Restart Obsidian hoàn toàn
3. Click Reload trong Community plugins
4. Kiểm tra manifest.json có đúng format JSON không

### Lỗi: "API key not configured"

**Giải pháp**:
1. Vào Settings → AI Processor
2. Thêm API key
3. Click Save
4. Thử lại

### Lỗi: Plugin bật được nhưng không có icon

**Giải pháp**:
- Obsidian phiên bản cũ có thể không hiển thị ribbon icon
- Sử dụng Command Palette thay thế: `Ctrl/Cmd + P` → "Open AI Processor"

## 📧 Cần trợ giúp?

Nếu vẫn không được, hãy kiểm tra:
1. **Console log**: Mở Developer Console (`Ctrl/Cmd + Shift + I`) và xem có lỗi gì
2. **Obsidian version**: Plugin yêu cầu Obsidian ≥ v0.15.0
3. **Node.js version**: Nếu bạn build từ source, cần Node.js ≥ v16

---

## 🤖 Script Tự Động

Tạo file `install-plugin.sh`:

```bash
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
cp main.js "$AI_PROCESSOR_DIR/"
cp manifest.json "$AI_PROCESSOR_DIR/"
cp styles.css "$AI_PROCESSOR_DIR/"

# Kiểm tra
if [ -f "$AI_PROCESSOR_DIR/main.js" ] && \
   [ -f "$AI_PROCESSOR_DIR/manifest.json" ] && \
   [ -f "$AI_PROCESSOR_DIR/styles.css" ]; then
  echo ""
  echo "✅ Cài đặt thành công!"
  echo ""
  echo "📍 Plugin được cài tại: $AI_PROCESSOR_DIR"
  echo ""
  echo "🔄 Bước tiếp theo:"
  echo "   1. Mở Obsidian"
  echo "   2. Vào Settings → Community plugins"
  echo "   3. Click Reload"
  echo "   4. Bật 'AI Processor for Learning'"
  echo "   5. Cấu hình API keys"
  echo ""
else
  echo "❌ Lỗi: Copy files không thành công"
  exit 1
fi
```

### Cách sử dụng script:

```bash
# 1. Tạo file script
cd /home/user/Learning-Toolbox/obsidian-ai-processor-plugin
nano install-plugin.sh

# 2. Copy nội dung script ở trên vào file
# 3. Lưu file (Ctrl+O, Enter, Ctrl+X)

# 4. Cho phép chạy script
chmod +x install-plugin.sh

# 5. Chạy script
./install-plugin.sh

# 6. Nhập đường dẫn vault khi được hỏi
# Ví dụ: /home/user/Documents/MyVault
```

---

**Happy Learning! 🚀📚**
