# 🤖 AI Processor for Obsidian

A powerful Obsidian plugin that processes your notes with AI (Gemini, Claude, and Perplexity) for vocabulary building, translation, content enhancement, and much more.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Obsidian](https://img.shields.io/badge/obsidian-0.15.0+-purple)

## ✨ Features

### 🎯 Processing Modes

1. **Process Markdown** - Process MD files with AI to create new enhanced versions
2. **Process TXT to MD** - Convert TXT files to structured Markdown with AI
3. **Append AI Content** - Add AI-generated content to existing Markdown files
4. **Process by Filename** - Generate content based on file names
5. **Extract Names** - Extract file names to a text file
6. **Clear Markdown** - Bulk clear content from Markdown files
7. **Remove ID Lines** - Remove `<!--ID: ...-->` comment lines
8. **Classify Files** - Auto-organize files by content analysis
9. **Vocabulary to Table** - Convert vocabulary entries to Obsidian tables

### 🤖 Supported AI Models

- **Gemini 2.0 Flash** - Fast and efficient for general tasks
- **Gemini 2.5 Flash** - Latest Gemini with improved performance
- **Gemini 2.5 Pro** - Most capable Gemini model
- **Claude Sonnet 4** - Excellent for complex reasoning and analysis
- **Perplexity Sonar Pro** - Great for research and factual content

## 📦 Installation

### Method 1: Manual Installation (Recommended for Development)

1. Download or clone this repository
2. Copy the `obsidian-ai-processor-plugin` folder to your vault's `.obsidian/plugins/` directory
3. Navigate to the plugin folder:
   ```bash
   cd /path/to/your/vault/.obsidian/plugins/obsidian-ai-processor-plugin
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Build the plugin:
   ```bash
   npm run build
   ```
6. Restart Obsidian
7. Enable the plugin in Settings → Community Plugins

### Method 2: Development Mode

For active development with hot reload:

1. Follow steps 1-4 from Method 1
2. Run in development mode:
   ```bash
   npm run dev
   ```
3. The plugin will rebuild automatically when you make changes
4. Reload Obsidian to see changes (Ctrl/Cmd + R)

## ⚙️ Configuration

1. Open Settings → Community Plugins → AI Processor
2. Add your API keys:
   - **Gemini API Key**: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - **Claude API Key**: Get from [Anthropic Console](https://console.anthropic.com/)
   - **Perplexity API Key**: Get from [Perplexity API](https://www.perplexity.ai/settings/api)
3. Choose your default AI model
4. Set a default prompt (optional)

## 🚀 Usage

### Opening the AI Processor

There are several ways to access the plugin:

1. **Ribbon Icon**: Click the brain icon (🧠) in the left sidebar
2. **Command Palette**:
   - Press `Ctrl/Cmd + P`
   - Type "AI Processor"
   - Select "Open AI Processor"
3. **Quick Process**:
   - Open any Markdown file
   - Press `Ctrl/Cmd + P`
   - Select "Process current file with AI"

### Basic Workflow

1. **Select Processing Mode**
   - Click on a mode card in the grid
   - Each mode has a specific purpose (see Features section)

2. **Select Files**
   - Click "Browse" to select a folder
   - Check the files you want to process
   - Use "Select All" for bulk processing

3. **Configure AI Settings**
   - Choose your AI model
   - Enter or modify the prompt
   - The prompt tells the AI how to process your content

4. **Process**
   - Click "Process Files"
   - Wait for completion
   - Check the output in your vault

### Example Use Cases

#### 1. Vocabulary Building

**Mode**: Process Markdown
**Model**: Gemini 2.5 Flash
**Prompt**:
```
Create a structured vocabulary entry for the following word. Include:
- Word and pronunciation
- Part of speech
- Definition
- Example sentences (2-3)
- Memory aids or mnemonics
```

#### 2. Translation

**Mode**: Process Markdown
**Model**: Claude Sonnet 4
**Prompt**:
```
Translate the following text to Vietnamese. Maintain:
- Original formatting
- Technical terms accuracy
- Natural language flow
```

#### 3. Content Enhancement

**Mode**: Append AI Content
**Model**: Perplexity Sonar Pro
**Prompt**:
```
Add a "Further Reading" section with:
- 5 related topics
- Brief explanations
- Real-world applications
```

#### 4. Note Organization

**Mode**: Classify Files
**Prompt**:
```
Analyze the content and classify into:
- Grammar
- Vocabulary
- Reading
- Writing
- Listening
```

## 📋 Commands

All commands are available via the Command Palette (`Ctrl/Cmd + P`):

- **Open AI Processor** - Open the main processing interface
- **Process current file with AI** - Quick process the active file
- **Extract file names from folder** - Create a list of file names
- **Clear markdown content** - Bulk clear MD files
- **Remove ID lines from markdown** - Clean up ID comments
- **Create MD files from TXT names** - Create empty MD files
- **Copy directory structure** - Replicate folder structure
- **Convert vocabulary to Obsidian table** - Create vocabulary tables

## 🎨 User Interface

The plugin features a modern, responsive design with:

- **Dark/Light Mode Support** - Automatically adapts to your Obsidian theme
- **Card-based Mode Selection** - Easy-to-understand visual interface
- **File Browser** - Intuitive file selection with checkboxes
- **Real-time Feedback** - Progress notifications during processing
- **Responsive Design** - Works on mobile and tablet devices

## 🔧 Advanced Features

### Vocabulary Table Format

The vocabulary converter expects entries in this format:

```markdown
EN-Words

Vocabulary: example
Pronunciation: /ɪɡˈzæmpəl/
Definition: A thing characteristic of its kind or illustrating a general rule
Part of Speech: noun
Example: This is a good example of modern architecture
Audio: [[example.mp3]]
```

Output:

| Word | Part of Speech | Definition | Pronunciation | Audio | Example |
|------|---------------|------------|---------------|-------|---------|
| example | n. | A thing characteristic of its kind... | /ɪɡˈzæmpəl/ | [[example.mp3]] | This is a good example... |

### Custom Prompts

Create specialized prompts for different tasks:

**Learning Japanese**:
```
Analyze this Japanese text and provide:
1. Kanji breakdown with readings
2. Grammar patterns used
3. JLPT level estimation
4. Cultural context
```

**Research Notes**:
```
Summarize this research paper with:
- Key findings
- Methodology
- Limitations
- Future research directions
```

**Creative Writing**:
```
Enhance this creative writing piece by:
- Improving descriptive language
- Adding sensory details
- Strengthening character development
- Suggesting plot improvements
```

## 🛠️ Development

### Project Structure

```
obsidian-ai-processor-plugin/
├── main.ts           # Main plugin code
├── manifest.json     # Plugin metadata
├── package.json      # Dependencies
├── tsconfig.json     # TypeScript config
├── esbuild.config.mjs # Build configuration
├── styles.css        # Plugin styles
├── .gitignore        # Git ignore rules
└── README.md         # This file
```

### Building from Source

```bash
# Install dependencies
npm install

# Development build (watch mode)
npm run dev

# Production build
npm run build
```

### Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Support

- **Issues**: [GitHub Issues](https://github.com/Zennykenzo4210/Learning-Toolbox/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Zennykenzo4210/Learning-Toolbox/discussions)

## 🙏 Acknowledgments

- Built with [Obsidian API](https://github.com/obsidianmd/obsidian-api)
- Inspired by the need for efficient language learning workflows
- Thanks to the Obsidian community for feedback and support

## 📝 Changelog

### Version 1.0.0 (2025-01-06)

- Initial release
- Support for Gemini, Claude, and Perplexity AI models
- 9 processing modes
- Modern, responsive UI
- Comprehensive documentation

## 🔮 Roadmap

- [ ] Batch processing with progress tracking
- [ ] Template system for common tasks
- [ ] Custom AI model configuration
- [ ] Export/import settings
- [ ] Multi-language UI support
- [ ] Integration with Obsidian Canvas
- [ ] Audio file processing
- [ ] Image analysis with vision models

---

**Made with ❤️ for the Obsidian community**
