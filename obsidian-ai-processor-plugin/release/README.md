# 🎯 Pre-built Release - Ready to Use

Đây là bản build sẵn sàng của AI Processor plugin. Bạn không cần build từ source, chỉ cần copy 3 files vào Obsidian.

## 📦 Files trong folder này:

- ✅ `main.js` - Plugin code đã được compiled (34KB)
- ✅ `manifest.json` - Plugin metadata
- ✅ `styles.css` - Plugin styles

## 🚀 Cài đặt nhanh (2 phút):

### Bước 1: Tìm thư mục plugins của Obsidian

```
Windows:    C:\Users\[YourName]\[VaultName]\.obsidian\plugins\
macOS:      /Users/[YourName]/[VaultName]/.obsidian/plugins/
Linux:      /home/[YourName]/[VaultName]/.obsidian/plugins/
```

### Bước 2: Tạo thư mục cho plugin

Tạo folder mới tên `ai-processor` trong thư mục `plugins`:

```
[VaultName]/.obsidian/plugins/ai-processor/
```

### Bước 3: Copy 3 files

Copy **TẤT CẢ 3 FILES** từ folder `release` này vào folder `ai-processor` vừa tạo:

```
ai-processor/
├── main.js          ← Copy từ release/
├── manifest.json    ← Copy từ release/
└── styles.css       ← Copy từ release/
```

### Bước 4: Bật plugin trong Obsidian

1. Mở Obsidian
2. Settings → Community plugins
3. Bật "Turn on community plugins" (nếu chưa bật)
4. Click nút **Reload** (icon refresh)
5. Tìm "AI Processor for Learning"
6. Toggle sang **ON**

### Bước 5: Cấu hình API Key

1. Settings → AI Processor
2. Thêm Gemini API key: https://makersuite.google.com/app/apikey (MIỄN PHÍ)
3. Chọn model: Gemini 2.0 Flash
4. Save

## ✅ Xong! Cách sử dụng:

- Click icon 🧠 (brain) trên sidebar trái
- Hoặc: `Ctrl/Cmd + P` → gõ "AI Processor"

## 🐛 Troubleshooting:

**Plugin không hiện trong list?**
- Kiểm tra đã copy đủ 3 files chưa
- Restart Obsidian
- Click Reload trong Community plugins

**Không bật được plugin?**
- Mở Developer Console: `Ctrl/Cmd + Shift + I`
- Xem tab Console có lỗi gì không
- Đảm bảo Obsidian version ≥ 0.15.0

**Icon không hiện?**
- Dùng Command Palette: `Ctrl/Cmd + P` → "Open AI Processor"

## 📖 Hướng dẫn đầy đủ:

Xem [QUICK_START.md](../QUICK_START.md) để biết thêm chi tiết.

---

**Version:** 1.0.0
**Build date:** 2025-01-07
**File size:** 34KB (main.js)
