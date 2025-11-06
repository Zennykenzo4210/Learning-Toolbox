# 📥 Installation Guide

## Quick Start (5 minutes)

### Step 1: Download the Plugin

**Option A: Clone from Git** (Recommended)
```bash
cd /path/to/your/vault/.obsidian/plugins/
git clone https://github.com/Zennykenzo4210/Learning-Toolbox.git
cd Learning-Toolbox/obsidian-ai-processor-plugin
```

**Option B: Download ZIP**
1. Download the ZIP file from GitHub
2. Extract to `/path/to/your/vault/.obsidian/plugins/ai-processor/`

### Step 2: Install Dependencies

```bash
npm install
```

If you don't have npm installed, install Node.js first:
- **Windows**: Download from [nodejs.org](https://nodejs.org/)
- **Mac**: `brew install node`
- **Linux**: `sudo apt install nodejs npm`

### Step 3: Build the Plugin

```bash
npm run build
```

This will create:
- `main.js` - The compiled plugin code
- `styles.css` - Already included
- `manifest.json` - Already included

### Step 4: Enable in Obsidian

1. Open Obsidian
2. Go to **Settings** → **Community Plugins**
3. Click **Turn on community plugins** (if not already on)
4. Click the **Reload** button to refresh the plugins list
5. Find **AI Processor for Learning** in the list
6. Toggle it **ON**

### Step 5: Configure API Keys

1. Go to **Settings** → **AI Processor**
2. Add your API keys:

**Get Gemini API Key (Free)**
- Visit: https://makersuite.google.com/app/apikey
- Click "Create API Key"
- Copy and paste into Obsidian

**Get Claude API Key (Paid)**
- Visit: https://console.anthropic.com/
- Create account and add credits
- Generate API key
- Copy and paste into Obsidian

**Get Perplexity API Key (Paid)**
- Visit: https://www.perplexity.ai/settings/api
- Create account
- Generate API key
- Copy and paste into Obsidian

### Step 6: Test the Plugin

1. Click the **brain icon** 🧠 in the left sidebar
2. Select **Process Markdown** mode
3. Choose a folder with some test files
4. Enter a simple prompt: "Summarize this content"
5. Click **Process Files**

## Troubleshooting

### Plugin doesn't appear in list

**Solution**:
1. Make sure the folder is in the correct location:
   ```
   YourVault/
   └── .obsidian/
       └── plugins/
           └── ai-processor/
               ├── main.js
               ├── manifest.json
               └── styles.css
   ```
2. Restart Obsidian
3. Check if community plugins are enabled

### Build fails

**Error: npm not found**
```bash
# Install Node.js first
# Then try again:
npm install
npm run build
```

**Error: EACCES permission denied**
```bash
# On Mac/Linux:
sudo npm install
# Or fix npm permissions (recommended):
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

**Error: Cannot find module**
```bash
# Delete node_modules and reinstall:
rm -rf node_modules
npm install
npm run build
```

### Plugin loads but doesn't work

1. **Check API Keys**: Go to Settings → AI Processor → Verify keys are entered
2. **Check Console**:
   - Open Developer Tools (Ctrl/Cmd + Shift + I)
   - Look for error messages in Console tab
3. **Try Different Model**: Some models may have rate limits or be temporarily unavailable

### API Errors

**"API key not configured"**
- Add your API key in Settings → AI Processor

**"Rate limit exceeded"**
- Wait a few minutes and try again
- Consider upgrading your API plan
- Use a different model

**"Invalid API key"**
- Verify the key is copied correctly (no extra spaces)
- Check if the key is still valid in the API provider's dashboard
- Regenerate the key if needed

## Development Mode

For plugin development with hot reload:

```bash
# Run in watch mode
npm run dev
```

Changes will be automatically compiled. Just reload Obsidian (Ctrl/Cmd + R) to see updates.

## Updating the Plugin

### From Git
```bash
cd /path/to/vault/.obsidian/plugins/ai-processor
git pull
npm install
npm run build
```

### Manual Update
1. Download the latest version
2. Replace the old files
3. Run `npm install` and `npm run build`
4. Restart Obsidian

## Uninstalling

1. Go to **Settings** → **Community Plugins**
2. Toggle **AI Processor** OFF
3. Click the **X** button to uninstall
4. Or manually delete the folder:
   ```bash
   rm -rf /path/to/vault/.obsidian/plugins/ai-processor
   ```

## System Requirements

- **Obsidian**: v0.15.0 or higher
- **Node.js**: v16 or higher
- **npm**: v7 or higher
- **Internet connection** for API calls
- **API Keys** for at least one AI provider

## Support

Need help? Check:
- 📖 [Full Documentation](README.md)
- 🐛 [Report Issues](https://github.com/Zennykenzo4210/Learning-Toolbox/issues)
- 💬 [Discussions](https://github.com/Zennykenzo4210/Learning-Toolbox/discussions)

---

**Ready to start?** → [User Guide](README.md#usage)
