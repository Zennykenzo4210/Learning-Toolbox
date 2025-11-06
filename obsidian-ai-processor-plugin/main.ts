import {
	App,
	Plugin,
	PluginSettingTab,
	Setting,
	Modal,
	Notice,
	TFile,
	TFolder,
	normalizePath,
	requestUrl,
	RequestUrlParam
} from 'obsidian';

// ==================== INTERFACES ====================

interface AIProcessorSettings {
	geminiApiKey: string;
	gemini25FlashApiKey: string;
	gemini25ProApiKey: string;
	claudeApiKey: string;
	perplexityApiKey: string;
	defaultModel: 'gemini' | 'gemini-2.5-flash' | 'gemini-2.5-pro' | 'claude' | 'perplexity';
	defaultPrompt: string;
}

const DEFAULT_SETTINGS: AIProcessorSettings = {
	geminiApiKey: '',
	gemini25FlashApiKey: '',
	gemini25ProApiKey: '',
	claudeApiKey: '',
	perplexityApiKey: '',
	defaultModel: 'gemini',
	defaultPrompt: 'Process the following content:'
};

interface ProcessingOptions {
	mode: 'convert' | 'append' | 'markdown_with_filename' | 'csv_to_md' | 'classify';
	model: string;
	prompt: string;
	files: TFile[];
	outputFolder?: string;
	txtContent?: string;
}

// ==================== MAIN PLUGIN CLASS ====================

export default class AIProcessorPlugin extends Plugin {
	settings: AIProcessorSettings;

	async onload() {
		await this.loadSettings();

		// Add ribbon icon
		this.addRibbonIcon('brain', 'AI Processor', () => {
			new ProcessorModal(this.app, this).open();
		});

		// Add commands
		this.addCommand({
			id: 'open-ai-processor',
			name: 'Open AI Processor',
			callback: () => {
				new ProcessorModal(this.app, this).open();
			}
		});

		this.addCommand({
			id: 'process-current-file',
			name: 'Process current file with AI',
			callback: () => {
				const file = this.app.workspace.getActiveFile();
				if (file && file.extension === 'md') {
					new QuickProcessModal(this.app, this, file).open();
				} else {
					new Notice('No markdown file is currently open');
				}
			}
		});

		this.addCommand({
			id: 'extract-file-names',
			name: 'Extract file names from folder',
			callback: () => {
				new ExtractNamesModal(this.app, this).open();
			}
		});

		this.addCommand({
			id: 'clear-markdown-content',
			name: 'Clear markdown content',
			callback: () => {
				new ClearMarkdownModal(this.app, this).open();
			}
		});

		this.addCommand({
			id: 'remove-id-lines',
			name: 'Remove ID lines from markdown',
			callback: () => {
				new RemoveIDLinesModal(this.app, this).open();
			}
		});

		this.addCommand({
			id: 'create-md-from-txt-names',
			name: 'Create MD files from TXT names',
			callback: () => {
				new CreateMDFromTXTModal(this.app, this).open();
			}
		});

		this.addCommand({
			id: 'copy-directory-structure',
			name: 'Copy directory structure',
			callback: () => {
				new CopyDirStructureModal(this.app, this).open();
			}
		});

		this.addCommand({
			id: 'vocabulary-to-table',
			name: 'Convert vocabulary to Obsidian table',
			callback: () => {
				new VocabToTableModal(this.app, this).open();
			}
		});

		// Add settings tab
		this.addSettingTab(new AIProcessorSettingTab(this.app, this));
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	// ==================== AI API METHODS ====================

	async processWithAI(content: string, prompt: string, model: string): Promise<string> {
		switch (model) {
			case 'gemini':
				return await this.processWithGemini(content, prompt);
			case 'gemini-2.5-flash':
				return await this.processWithGemini25Flash(content, prompt);
			case 'gemini-2.5-pro':
				return await this.processWithGemini25Pro(content, prompt);
			case 'claude':
				return await this.processWithClaude(content, prompt);
			case 'perplexity':
				return await this.processWithPerplexity(content, prompt);
			default:
				throw new Error('Unknown model: ' + model);
		}
	}

	async processWithFilename(filename: string, prompt: string, model: string): Promise<string> {
		const content = `Tên file: ${filename}`;
		return await this.processWithAI(content, prompt, model);
	}

	private async processWithGemini(content: string, prompt: string): Promise<string> {
		if (!this.settings.geminiApiKey) {
			throw new Error('Gemini API key not configured');
		}

		const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.settings.geminiApiKey}`;

		const response = await requestUrl({
			url: url,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				contents: [{
					parts: [{
						text: `${prompt}\n\n${content}`
					}]
				}]
			})
		});

		if (response.status === 200) {
			const result = response.json;
			return result.candidates?.[0]?.content?.parts?.[0]?.text || '';
		} else {
			throw new Error(`Gemini API error: ${response.text}`);
		}
	}

	private async processWithGemini25Flash(content: string, prompt: string): Promise<string> {
		if (!this.settings.gemini25FlashApiKey) {
			throw new Error('Gemini 2.5 Flash API key not configured');
		}

		const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.settings.gemini25FlashApiKey}`;

		const response = await requestUrl({
			url: url,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				contents: [{
					parts: [{
						text: `${prompt}\n\n${content}`
					}]
				}]
			})
		});

		if (response.status === 200) {
			const result = response.json;
			return result.candidates?.[0]?.content?.parts?.[0]?.text || '';
		} else {
			throw new Error(`Gemini 2.5 Flash API error: ${response.text}`);
		}
	}

	private async processWithGemini25Pro(content: string, prompt: string): Promise<string> {
		if (!this.settings.gemini25ProApiKey) {
			throw new Error('Gemini 2.5 Pro API key not configured');
		}

		const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${this.settings.gemini25ProApiKey}`;

		const response = await requestUrl({
			url: url,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				contents: [{
					parts: [{
						text: `${prompt}\n\n${content}`
					}]
				}]
			})
		});

		if (response.status === 200) {
			const result = response.json;
			return result.candidates?.[0]?.content?.parts?.[0]?.text || '';
		} else {
			throw new Error(`Gemini 2.5 Pro API error: ${response.text}`);
		}
	}

	private async processWithClaude(content: string, prompt: string): Promise<string> {
		if (!this.settings.claudeApiKey) {
			throw new Error('Claude API key not configured');
		}

		const response = await requestUrl({
			url: 'https://api.anthropic.com/v1/messages',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': this.settings.claudeApiKey,
				'anthropic-version': '2023-06-01'
			},
			body: JSON.stringify({
				model: 'claude-sonnet-4-20250514',
				max_tokens: 20000,
				temperature: 1,
				messages: [{
					role: 'user',
					content: `${prompt}\n\n${content}`
				}]
			})
		});

		if (response.status === 200) {
			const result = response.json;
			return result.content?.[0]?.text || '';
		} else {
			throw new Error(`Claude API error: ${response.text}`);
		}
	}

	private async processWithPerplexity(content: string, prompt: string): Promise<string> {
		if (!this.settings.perplexityApiKey) {
			throw new Error('Perplexity API key not configured');
		}

		const response = await requestUrl({
			url: 'https://api.perplexity.ai/chat/completions',
			method: 'POST',
			headers: {
				'accept': 'application/json',
				'content-type': 'application/json',
				'Authorization': `Bearer ${this.settings.perplexityApiKey}`
			},
			body: JSON.stringify({
				model: 'sonar-pro',
				messages: [
					{
						role: 'system',
						content: 'Bạn là một chuyên gia ngôn ngữ học với kinh nghiệm xây dựng hệ thống từ vựng và phương pháp ghi nhớ hiệu quả.'
					},
					{
						role: 'user',
						content: `${prompt}\n\n${content}`
					}
				]
			})
		});

		if (response.status === 200) {
			const result = response.json;
			return result.choices?.[0]?.message?.content || '';
		} else {
			throw new Error(`Perplexity API error: ${response.text}`);
		}
	}
}

// ==================== SETTINGS TAB ====================

class AIProcessorSettingTab extends PluginSettingTab {
	plugin: AIProcessorPlugin;

	constructor(app: App, plugin: AIProcessorPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl('h2', { text: '🤖 AI Processor Settings' });

		// API Keys Section
		containerEl.createEl('h3', { text: '🔑 API Keys' });

		new Setting(containerEl)
			.setName('Gemini API Key')
			.setDesc('Enter your Google Gemini API key')
			.addText(text => text
				.setPlaceholder('Enter API key')
				.setValue(this.plugin.settings.geminiApiKey)
				.onChange(async (value) => {
					this.plugin.settings.geminiApiKey = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Gemini 2.5 Flash API Key')
			.setDesc('Enter your Google Gemini 2.5 Flash API key')
			.addText(text => text
				.setPlaceholder('Enter API key')
				.setValue(this.plugin.settings.gemini25FlashApiKey)
				.onChange(async (value) => {
					this.plugin.settings.gemini25FlashApiKey = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Gemini 2.5 Pro API Key')
			.setDesc('Enter your Google Gemini 2.5 Pro API key')
			.addText(text => text
				.setPlaceholder('Enter API key')
				.setValue(this.plugin.settings.gemini25ProApiKey)
				.onChange(async (value) => {
					this.plugin.settings.gemini25ProApiKey = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Claude API Key')
			.setDesc('Enter your Anthropic Claude API key')
			.addText(text => text
				.setPlaceholder('Enter API key')
				.setValue(this.plugin.settings.claudeApiKey)
				.onChange(async (value) => {
					this.plugin.settings.claudeApiKey = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Perplexity API Key')
			.setDesc('Enter your Perplexity API key')
			.addText(text => text
				.setPlaceholder('Enter API key')
				.setValue(this.plugin.settings.perplexityApiKey)
				.onChange(async (value) => {
					this.plugin.settings.perplexityApiKey = value;
					await this.plugin.saveSettings();
				}));

		// Default Settings Section
		containerEl.createEl('h3', { text: '⚙️ Default Settings' });

		new Setting(containerEl)
			.setName('Default AI Model')
			.setDesc('Choose the default AI model for processing')
			.addDropdown(dropdown => dropdown
				.addOption('gemini', 'Gemini 2.0 Flash')
				.addOption('gemini-2.5-flash', 'Gemini 2.5 Flash')
				.addOption('gemini-2.5-pro', 'Gemini 2.5 Pro')
				.addOption('claude', 'Claude Sonnet 4')
				.addOption('perplexity', 'Perplexity Sonar Pro')
				.setValue(this.plugin.settings.defaultModel)
				.onChange(async (value: any) => {
					this.plugin.settings.defaultModel = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Default Prompt')
			.setDesc('Set a default prompt for AI processing')
			.addTextArea(text => text
				.setPlaceholder('Enter default prompt')
				.setValue(this.plugin.settings.defaultPrompt)
				.onChange(async (value) => {
					this.plugin.settings.defaultPrompt = value;
					await this.plugin.saveSettings();
				}));

		// Help Section
		containerEl.createEl('h3', { text: '📖 Help' });
		const helpDiv = containerEl.createDiv('ai-processor-help');
		helpDiv.innerHTML = `
			<p><strong>How to use:</strong></p>
			<ul>
				<li>Click the brain icon in the left ribbon to open the AI Processor</li>
				<li>Use commands from the command palette (Ctrl/Cmd + P)</li>
				<li>Configure your API keys above to start processing</li>
			</ul>
			<p><strong>Available Models:</strong></p>
			<ul>
				<li><strong>Gemini 2.0 Flash:</strong> Fast and efficient for general tasks</li>
				<li><strong>Gemini 2.5 Flash:</strong> Latest Gemini with improved performance</li>
				<li><strong>Gemini 2.5 Pro:</strong> Most capable Gemini model</li>
				<li><strong>Claude Sonnet 4:</strong> Excellent for complex reasoning</li>
				<li><strong>Perplexity Sonar Pro:</strong> Great for research and factual content</li>
			</ul>
		`;
	}
}

// ==================== PROCESSOR MODAL ====================

class ProcessorModal extends Modal {
	plugin: AIProcessorPlugin;
	selectedMode: string = 'convert-md';
	selectedModel: string;
	prompt: string;
	selectedFiles: TFile[] = [];
	currentFolder: TFolder | null = null;

	constructor(app: App, plugin: AIProcessorPlugin) {
		super(app);
		this.plugin = plugin;
		this.selectedModel = plugin.settings.defaultModel;
		this.prompt = plugin.settings.defaultPrompt;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();
		contentEl.addClass('ai-processor-modal');

		contentEl.createEl('h2', { text: '🤖 AI Processor' });

		// Mode Selection
		const modeSection = contentEl.createDiv('processor-section');
		modeSection.createEl('h3', { text: '📋 Processing Mode' });

		const modeGrid = modeSection.createDiv('mode-grid');

		const modes = [
			{ id: 'convert-md', icon: '🔄', name: 'Process Markdown', desc: 'Process MD files with AI' },
			{ id: 'convert-txt', icon: '📝', name: 'Process TXT to MD', desc: 'Convert TXT to Markdown' },
			{ id: 'append-ai', icon: '➕', name: 'Append AI Content', desc: 'Add AI content to MD' },
			{ id: 'md-filename', icon: '🏷️', name: 'Process by Filename', desc: 'Use filename as context' },
			{ id: 'extract-names', icon: '📋', name: 'Extract Names', desc: 'Extract file names to TXT' },
			{ id: 'clear-md', icon: '🧹', name: 'Clear Markdown', desc: 'Clear MD content' },
			{ id: 'remove-id', icon: '🗑️', name: 'Remove ID Lines', desc: 'Remove ID comments' },
			{ id: 'classify', icon: '📁', name: 'Classify Files', desc: 'Sort files by content' },
			{ id: 'vocab-table', icon: '📚', name: 'Vocab to Table', desc: 'Convert to Obsidian table' },
		];

		modes.forEach(mode => {
			const modeCard = modeGrid.createDiv('mode-card');
			if (mode.id === this.selectedMode) {
				modeCard.addClass('selected');
			}
			modeCard.innerHTML = `
				<div class="mode-icon">${mode.icon}</div>
				<div class="mode-name">${mode.name}</div>
				<div class="mode-desc">${mode.desc}</div>
			`;
			modeCard.addEventListener('click', () => {
				modeGrid.querySelectorAll('.mode-card').forEach(c => c.removeClass('selected'));
				modeCard.addClass('selected');
				this.selectedMode = mode.id;
				this.updateUIForMode();
			});
		});

		// File Selection
		const fileSection = contentEl.createDiv('processor-section');
		fileSection.createEl('h3', { text: '📂 Select Files' });

		const folderSelector = fileSection.createDiv('folder-selector');
		const folderInput = folderSelector.createEl('input', {
			type: 'text',
			placeholder: 'Select a folder...',
			attr: { readonly: 'true' }
		});

		const selectFolderBtn = folderSelector.createEl('button', { text: '📁 Browse' });
		selectFolderBtn.addEventListener('click', () => {
			new FolderSelectorModal(this.app, (folder) => {
				this.currentFolder = folder;
				folderInput.value = folder.path;
				this.loadFilesFromFolder(folder, fileListDiv);
			}).open();
		});

		const fileListDiv = fileSection.createDiv('file-list');

		// AI Settings
		const aiSection = contentEl.createDiv('processor-section');
		aiSection.createEl('h3', { text: '🤖 AI Settings' });

		const modelSelect = aiSection.createEl('select', { cls: 'ai-model-select' });
		const models = [
			{ value: 'gemini', label: 'Gemini 2.0 Flash' },
			{ value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
			{ value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
			{ value: 'claude', label: 'Claude Sonnet 4' },
			{ value: 'perplexity', label: 'Perplexity Sonar Pro' }
		];
		models.forEach(m => {
			const option = modelSelect.createEl('option', {
				value: m.value,
				text: m.label
			});
			if (m.value === this.selectedModel) {
				option.selected = true;
			}
		});
		modelSelect.addEventListener('change', () => {
			this.selectedModel = modelSelect.value;
		});

		const promptLabel = aiSection.createEl('label', { text: 'Prompt:' });
		const promptArea = aiSection.createEl('textarea', {
			cls: 'ai-prompt-area',
			placeholder: 'Enter your prompt here...'
		});
		promptArea.value = this.prompt;
		promptArea.addEventListener('input', () => {
			this.prompt = promptArea.value;
		});

		// Action Buttons
		const actionSection = contentEl.createDiv('processor-section action-section');

		const processBtn = actionSection.createEl('button', {
			cls: 'mod-cta process-btn',
			text: '▶️ Process Files'
		});
		processBtn.addEventListener('click', async () => {
			await this.processFiles();
		});

		const cancelBtn = actionSection.createEl('button', {
			text: '❌ Cancel'
		});
		cancelBtn.addEventListener('click', () => {
			this.close();
		});

		// Initialize UI
		this.updateUIForMode();
	}

	updateUIForMode() {
		// Update UI based on selected mode
		// This method can be extended to show/hide elements based on mode
	}

	loadFilesFromFolder(folder: TFolder, container: HTMLElement) {
		container.empty();

		const files = folder.children.filter(f => f instanceof TFile) as TFile[];

		if (files.length === 0) {
			container.createEl('p', { text: 'No files in this folder', cls: 'no-files' });
			return;
		}

		const selectAllDiv = container.createDiv('select-all-div');
		const selectAllCheckbox = selectAllDiv.createEl('input', { type: 'checkbox' });
		selectAllDiv.createEl('label', { text: 'Select All' });
		selectAllCheckbox.addEventListener('change', () => {
			const checkboxes = container.querySelectorAll('.file-item input[type="checkbox"]');
			checkboxes.forEach((cb: HTMLInputElement) => {
				cb.checked = selectAllCheckbox.checked;
			});
			this.updateSelectedFiles(files, selectAllCheckbox.checked);
		});

		files.forEach(file => {
			const fileItem = container.createDiv('file-item');
			const checkbox = fileItem.createEl('input', { type: 'checkbox' });
			fileItem.createEl('label', { text: file.name });

			checkbox.addEventListener('change', () => {
				if (checkbox.checked) {
					this.selectedFiles.push(file);
				} else {
					this.selectedFiles = this.selectedFiles.filter(f => f !== file);
				}
			});
		});
	}

	updateSelectedFiles(files: TFile[], selected: boolean) {
		if (selected) {
			this.selectedFiles = [...files];
		} else {
			this.selectedFiles = [];
		}
	}

	async processFiles() {
		if (this.selectedFiles.length === 0) {
			new Notice('Please select at least one file');
			return;
		}

		if (!this.prompt.trim()) {
			new Notice('Please enter a prompt');
			return;
		}

		new Notice(`Processing ${this.selectedFiles.length} files...`);

		try {
			let processedCount = 0;

			for (const file of this.selectedFiles) {
				const content = await this.app.vault.read(file);

				let processedContent: string;

				if (this.selectedMode === 'md-filename') {
					processedContent = await this.plugin.processWithFilename(
						file.basename,
						this.prompt,
						this.selectedModel
					);
					await this.app.vault.modify(file, processedContent);
				} else if (this.selectedMode === 'append-ai') {
					processedContent = await this.plugin.processWithAI(
						content,
						this.prompt,
						this.selectedModel
					);
					await this.app.vault.modify(file, content + '\n\n' + processedContent);
				} else {
					processedContent = await this.plugin.processWithAI(
						content,
						this.prompt,
						this.selectedModel
					);

					// Create new file with processed content
					const newFileName = file.basename + '_processed.md';
					const newPath = normalizePath(file.parent?.path + '/' + newFileName);
					await this.app.vault.create(newPath, processedContent);
				}

				processedCount++;
				new Notice(`Processed ${processedCount}/${this.selectedFiles.length} files`);
			}

			new Notice(`✅ Successfully processed ${processedCount} files!`);
			this.close();

		} catch (error) {
			new Notice(`❌ Error: ${error.message}`);
			console.error('Processing error:', error);
		}
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

// ==================== QUICK PROCESS MODAL ====================

class QuickProcessModal extends Modal {
	plugin: AIProcessorPlugin;
	file: TFile;

	constructor(app: App, plugin: AIProcessorPlugin, file: TFile) {
		super(app);
		this.plugin = plugin;
		this.file = file;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();
		contentEl.addClass('quick-process-modal');

		contentEl.createEl('h2', { text: `🚀 Quick Process: ${this.file.name}` });

		const promptArea = contentEl.createEl('textarea', {
			cls: 'quick-prompt-area',
			placeholder: 'Enter prompt...'
		});
		promptArea.value = this.plugin.settings.defaultPrompt;

		const modelSelect = contentEl.createEl('select', { cls: 'quick-model-select' });
		const models = [
			{ value: 'gemini', label: 'Gemini 2.0 Flash' },
			{ value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
			{ value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
			{ value: 'claude', label: 'Claude Sonnet 4' },
			{ value: 'perplexity', label: 'Perplexity Sonar Pro' }
		];
		models.forEach(m => {
			const option = modelSelect.createEl('option', { value: m.value, text: m.label });
			if (m.value === this.plugin.settings.defaultModel) {
				option.selected = true;
			}
		});

		const btnContainer = contentEl.createDiv('btn-container');

		const processBtn = btnContainer.createEl('button', {
			cls: 'mod-cta',
			text: '▶️ Process'
		});

		processBtn.addEventListener('click', async () => {
			const content = await this.app.vault.read(this.file);
			const prompt = promptArea.value;
			const model = modelSelect.value;

			try {
				new Notice('Processing...');
				const result = await this.plugin.processWithAI(content, prompt, model);

				const newFileName = this.file.basename + '_processed.md';
				const newPath = normalizePath(this.file.parent?.path + '/' + newFileName);
				await this.app.vault.create(newPath, result);

				new Notice('✅ Processing complete!');
				this.close();
			} catch (error) {
				new Notice(`❌ Error: ${error.message}`);
			}
		});

		const cancelBtn = btnContainer.createEl('button', { text: 'Cancel' });
		cancelBtn.addEventListener('click', () => this.close());
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

// ==================== FOLDER SELECTOR MODAL ====================

class FolderSelectorModal extends Modal {
	onSelectFolder: (folder: TFolder) => void;

	constructor(app: App, onSelectFolder: (folder: TFolder) => void) {
		super(app);
		this.onSelectFolder = onSelectFolder;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();
		contentEl.createEl('h2', { text: '📁 Select Folder' });

		const folders = this.getAllFolders();

		folders.forEach(folder => {
			const folderItem = contentEl.createDiv('folder-item');
			folderItem.textContent = folder.path || '/';
			folderItem.addEventListener('click', () => {
				this.onSelectFolder(folder);
				this.close();
			});
		});
	}

	getAllFolders(): TFolder[] {
		const folders: TFolder[] = [];
		const root = this.app.vault.getRoot();

		const traverse = (folder: TFolder) => {
			folders.push(folder);
			folder.children.forEach(child => {
				if (child instanceof TFolder) {
					traverse(child);
				}
			});
		};

		traverse(root);
		return folders;
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

// ==================== UTILITY MODALS ====================

class ExtractNamesModal extends Modal {
	plugin: AIProcessorPlugin;

	constructor(app: App, plugin: AIProcessorPlugin) {
		super(app);
		this.plugin = plugin;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();
		contentEl.createEl('h2', { text: '📋 Extract File Names' });

		contentEl.createEl('p', { text: 'Select a folder to extract file names from:' });

		const selectBtn = contentEl.createEl('button', {
			cls: 'mod-cta',
			text: '📁 Select Folder'
		});

		selectBtn.addEventListener('click', () => {
			new FolderSelectorModal(this.app, async (folder) => {
				const files = folder.children.filter(f => f instanceof TFile) as TFile[];
				const fileNames = files.map(f => f.basename).join('\n');

				const outputPath = normalizePath(folder.path + '/extracted_names.txt');
				await this.app.vault.create(outputPath, fileNames);

				new Notice(`✅ Extracted ${files.length} file names!`);
				this.close();
			}).open();
		});
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

class ClearMarkdownModal extends Modal {
	plugin: AIProcessorPlugin;

	constructor(app: App, plugin: AIProcessorPlugin) {
		super(app);
		this.plugin = plugin;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();
		contentEl.createEl('h2', { text: '🧹 Clear Markdown Content' });

		contentEl.createEl('p', {
			text: '⚠️ This will clear all content from markdown files in the selected folder!',
			cls: 'warning-text'
		});

		const selectBtn = contentEl.createEl('button', {
			cls: 'mod-warning',
			text: '📁 Select Folder'
		});

		selectBtn.addEventListener('click', () => {
			new FolderSelectorModal(this.app, async (folder) => {
				const files = folder.children.filter(f =>
					f instanceof TFile && f.extension === 'md'
				) as TFile[];

				for (const file of files) {
					await this.app.vault.modify(file, '');
				}

				new Notice(`✅ Cleared ${files.length} markdown files!`);
				this.close();
			}).open();
		});
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

class RemoveIDLinesModal extends Modal {
	plugin: AIProcessorPlugin;

	constructor(app: App, plugin: AIProcessorPlugin) {
		super(app);
		this.plugin = plugin;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();
		contentEl.createEl('h2', { text: '🗑️ Remove ID Lines' });

		contentEl.createEl('p', { text: 'Remove <!--ID: ...--> lines from markdown files' });

		const selectBtn = contentEl.createEl('button', {
			cls: 'mod-cta',
			text: '📁 Select Folder'
		});

		selectBtn.addEventListener('click', () => {
			new FolderSelectorModal(this.app, async (folder) => {
				const files = folder.children.filter(f =>
					f instanceof TFile && f.extension === 'md'
				) as TFile[];

				let processedCount = 0;
				for (const file of files) {
					const content = await this.app.vault.read(file);
					const newContent = content.replace(/^<!--ID: .+-->\s*$/gm, '');

					if (content !== newContent) {
						await this.app.vault.modify(file, newContent);
						processedCount++;
					}
				}

				new Notice(`✅ Removed ID lines from ${processedCount} files!`);
				this.close();
			}).open();
		});
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

class CreateMDFromTXTModal extends Modal {
	plugin: AIProcessorPlugin;

	constructor(app: App, plugin: AIProcessorPlugin) {
		super(app);
		this.plugin = plugin;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();
		contentEl.createEl('h2', { text: '📄 Create MD from TXT Names' });

		contentEl.createEl('p', { text: 'Create empty markdown files named after TXT files' });

		const selectBtn = contentEl.createEl('button', {
			cls: 'mod-cta',
			text: '📁 Select Folder'
		});

		selectBtn.addEventListener('click', () => {
			new FolderSelectorModal(this.app, async (folder) => {
				const txtFiles = folder.children.filter(f =>
					f instanceof TFile && f.extension === 'txt'
				) as TFile[];

				let createdCount = 0;
				for (const file of txtFiles) {
					const mdPath = normalizePath(folder.path + '/' + file.basename + '.md');

					if (!await this.app.vault.adapter.exists(mdPath)) {
						await this.app.vault.create(mdPath, '');
						createdCount++;
					}
				}

				new Notice(`✅ Created ${createdCount} markdown files!`);
				this.close();
			}).open();
		});
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

class CopyDirStructureModal extends Modal {
	plugin: AIProcessorPlugin;

	constructor(app: App, plugin: AIProcessorPlugin) {
		super(app);
		this.plugin = plugin;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();
		contentEl.createEl('h2', { text: '📁 Copy Directory Structure' });

		contentEl.createEl('p', { text: 'This feature requires manual folder selection' });
		contentEl.createEl('p', {
			text: 'Use the file explorer to copy folder structures',
			cls: 'muted'
		});
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

class VocabToTableModal extends Modal {
	plugin: AIProcessorPlugin;

	constructor(app: App, plugin: AIProcessorPlugin) {
		super(app);
		this.plugin = plugin;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();
		contentEl.createEl('h2', { text: '📚 Convert Vocabulary to Table' });

		contentEl.createEl('p', { text: 'Select files containing vocabulary entries:' });

		const selectBtn = contentEl.createEl('button', {
			cls: 'mod-cta',
			text: '📁 Select Folder'
		});

		selectBtn.addEventListener('click', () => {
			new FolderSelectorModal(this.app, async (folder) => {
				const files = folder.children.filter(f =>
					f instanceof TFile && f.extension === 'md'
				) as TFile[];

				let allEntries: any[] = [];

				for (const file of files) {
					const content = await this.app.vault.read(file);
					const entries = this.parseVocabularyEntries(content);
					allEntries = allEntries.concat(entries);
				}

				const table = this.createObsidianTable(allEntries);
				const outputPath = normalizePath(folder.path + '/vocabulary_table.md');

				const header = `# Vocabulary Table\n\n**Files processed:** ${files.length}\n**Total entries:** ${allEntries.length}\n\n---\n\n`;
				await this.app.vault.create(outputPath, header + table);

				new Notice(`✅ Created vocabulary table with ${allEntries.length} entries!`);
				this.close();
			}).open();
		});
	}

	parseVocabularyEntries(text: string): any[] {
		const entries: any[] = [];
		const parts = text.split(/\n(?=EN-Words)/);

		for (const part of parts) {
			if (!part.trim()) continue;

			const entry: any = {};

			const vocabMatch = part.match(/Vocabulary:\s*(.+)/);
			if (vocabMatch) entry.vocabulary = vocabMatch[1].trim();

			const pronunciationMatch = part.match(/Pronunciation:\s*(.+)/);
			if (pronunciationMatch) entry.pronunciation = pronunciationMatch[1].trim();

			const definitionMatch = part.match(/Definition:\s*(.+)/);
			if (definitionMatch) entry.definition = definitionMatch[1].trim();

			const exampleMatch = part.match(/Example:\s*(.+)/);
			if (exampleMatch) entry.example = exampleMatch[1].trim();

			const audioMatch = part.match(/Audio:\s*(!?\[\[.+?\]\])/);
			if (audioMatch) entry.audio = audioMatch[1].trim();

			const posMatch = part.match(/Part of Speech:\s*(.+)/);
			if (posMatch) entry.partOfSpeech = posMatch[1].trim();

			if (entry.vocabulary) {
				entries.push(entry);
			}
		}

		return entries;
	}

	createObsidianTable(entries: any[]): string {
		let table = '| Word | Part of Speech | Definition | Pronunciation | Audio | Example |\n';
		table += '|------|---------------|------------|---------------|-------|---------|\n';

		for (const entry of entries) {
			const vocab = (entry.vocabulary || '').replace(/\|/g, '\\|');
			let pos = entry.partOfSpeech || '';
			if (pos.toLowerCase().includes('adjective')) pos = 'adj.';
			else if (pos.toLowerCase().includes('noun')) pos = 'n.';
			else if (pos.toLowerCase().includes('verb')) pos = 'v.';
			else if (pos.toLowerCase().includes('adverb')) pos = 'adv.';
			else pos = pos.split(',')[0];

			let definition = (entry.definition || '').replace(/\|/g, '\\|');
			if (definition.length > 60) definition = definition.substring(0, 60) + '...';

			const pronunciation = (entry.pronunciation || '').replace(/\|/g, '\\|');
			const audio = (entry.audio || '').replace(/\|/g, '\\|');
			const example = (entry.example || '').replace(/\|/g, '\\|');

			table += `| ${vocab} | ${pos} | ${definition} | ${pronunciation} | ${audio} | ${example} |\n`;
		}

		return table;
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
