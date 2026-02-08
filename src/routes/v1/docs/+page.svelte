<script lang="ts">
	import { base } from '$app/paths';
	
	// --- State ---
	let targetUrl = $state('https://github.com');
	let size = $state(500);
	let margin = $state(20);
	
	// Colors
	let dotColor = $state('#000000');
	let cornerColor = $state('#000000');
	
	// Background Logic
	let isBgTransparent = $state(true);
	let bgHex = $state('#ffffff');
	let bgColor = $derived(isBgTransparent ? 'transparent' : bgHex);

	// Shapes
	let dotType = $state('rounded');
	let cornerType = $state('extra-rounded');

	// --- Derived URLs ---
	let origin = $state('');
	
	$effect(() => {
		// Get the current window origin (e.g., https://user.github.io)
		origin = window.location.origin;
	});

	let embedUrl = $derived.by(() => {
		const params = new URLSearchParams();
		params.set('url', targetUrl);
		params.set('size', size.toString());
		params.set('margin', margin.toString());
		params.set('dotColor', dotColor);
		params.set('bgColor', bgColor);
		params.set('dotType', dotType);
		params.set('cornerType', cornerType);
		params.set('cornerColor', cornerColor);
		
		return `${origin}${base}/v1/?${params.toString()}`;
	});

	let iframeCode = $derived(
		`<iframe src="${embedUrl}" width="${size}" height="${size}" scrolling="no" frameborder="0" style="border:0; overflow:hidden;"></iframe>`
	);

	// --- Helpers ---
	function copy(text: string) {
		navigator.clipboard.writeText(text);
		// Simple visual feedback could be added here
		alert('Copied to clipboard!');
	}
</script>

<div class="page-wrapper">
	<header>
		<div class="header-content">
			<h1>QR Generator Docs</h1>
			<p>Configure your QR code below and copy the link for Slides.com</p>
		</div>
	</header>

	<div class="main-grid">
		<section class="controls panel">
			<h2>Configuration</h2>
			
			<div class="group">
				<label for="url">Target URL</label>
				<input type="text" id="url" bind:value={targetUrl} placeholder="https://..." />
			</div>

			<div class="group">
				<h3>Dimensions</h3>
				<div class="row">
					<div class="field">
						<label for="size">Size (px)</label>
						<input type="number" id="size" bind:value={size} min="100" max="2000" step="50" />
					</div>
					<div class="field">
						<label for="margin">Margin (px)</label>
						<input type="number" id="margin" bind:value={margin} min="0" max="100" step="5" />
					</div>
				</div>
			</div>

			<div class="group">
				<h3>Colors</h3>
				<div class="row">
					<div class="field">
						<label for="dotColor">Dots</label>
						<div class="color-wrapper">
							<input type="color" id="dotColor" bind:value={dotColor} />
							<span>{dotColor}</span>
						</div>
					</div>
					<div class="field">
						<label for="cornerColor">Corners</label>
						<div class="color-wrapper">
							<input type="color" id="cornerColor" bind:value={cornerColor} />
							<span>{cornerColor}</span>
						</div>
					</div>
				</div>
				
				<div class="field mt-2">
					<label for="bgCheck">Background</label>
					<div class="bg-control">
						<label class="checkbox-label">
							<input type="checkbox" id="bgCheck" bind:checked={isBgTransparent} />
							<span>Transparent</span>
						</label>
						
						{#if !isBgTransparent}
							<div class="color-wrapper grow">
								<input type="color" bind:value={bgHex} />
								<span>{bgHex}</span>
							</div>
						{/if}
					</div>
				</div>
			</div>

			<div class="group">
				<h3>Style</h3>
				<div class="row">
					<div class="field">
						<label for="dotType">Dot Shape</label>
						<select id="dotType" bind:value={dotType}>
							<option value="rounded">Rounded</option>
							<option value="dots">Dots</option>
							<option value="classy">Classy</option>
							<option value="classy-rounded">Classy Rounded</option>
							<option value="square">Square</option>
						</select>
					</div>
					<div class="field">
						<label for="cornerType">Corner Shape</label>
						<select id="cornerType" bind:value={cornerType}>
							<option value="extra-rounded">Extra Rounded</option>
							<option value="square">Square</option>
							<option value="dot">Dot</option>
						</select>
					</div>
				</div>
			</div>
		</section>

		<section class="preview-column">
			<div class="panel sticky-panel">
				<h2>Preview</h2>
				<div class="preview-box">
					<iframe 
						src={embedUrl} 
						title="QR Code Preview"
						width={size}
						height={size}
						class="preview-iframe"
					></iframe>
				</div>

				<div class="output-group">
					<label for="share-link">Embed URL (for Slides.com)</label>
					<div class="copy-row">
						<input type="text" readonly value={embedUrl} />
						<button onclick={() => copy(embedUrl)}>Copy</button>
					</div>
				</div>

				<div class="output-group">
					<label for="iframe-code">Full Iframe Code</label>
					<div class="copy-row">
						<input type="text" readonly value={iframeCode} />
						<button onclick={() => copy(iframeCode)}>Copy</button>
					</div>
				</div>
			</div>
		</section>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		background: #f8fafc;
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
		color: #1e293b;
	}

	.page-wrapper {
		max-width: 1200px;
		margin: 0 auto;
		padding: 20px;
	}

	header {
		margin-bottom: 30px;
		text-align: center;
	}

	h1 { font-size: 2rem; margin: 0 0 10px; color: #0f172a; }
	p { color: #64748b; margin: 0; }
	h2 { font-size: 1.25rem; margin: 0 0 20px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; }
	h3 { font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; margin: 0 0 10px; }

	.main-grid {
		display: grid;
		grid-template-columns: 350px 1fr;
		gap: 30px;
		align-items: start;
	}

	.panel {
		background: white;
		border-radius: 12px;
		padding: 24px;
		box-shadow: 0 1px 3px rgba(0,0,0,0.1);
		border: 1px solid #e2e8f0;
	}

	.sticky-panel {
		position: sticky;
		top: 20px;
	}

	/* Controls */
	.group { margin-bottom: 24px; }
	.group:last-child { margin-bottom: 0; }
	
	.row { display: flex; gap: 15px; }
	.field { flex: 1; display: flex; flex-direction: column; gap: 5px; }
	.mt-2 { margin-top: 10px; }

	label { font-size: 0.85rem; font-weight: 600; color: #475569; }

	input[type="text"], input[type="number"], select {
		padding: 8px 12px;
		border: 1px solid #cbd5e1;
		border-radius: 6px;
		font-size: 0.95rem;
		width: 100%;
		box-sizing: border-box;
	}

	/* Color inputs styling */
	.color-wrapper {
		display: flex;
		align-items: center;
		gap: 8px;
		border: 1px solid #cbd5e1;
		padding: 4px;
		border-radius: 6px;
		background: white;
	}
	
	.color-wrapper input[type="color"] {
		border: none;
		width: 30px;
		height: 30px;
		padding: 0;
		background: none;
		cursor: pointer;
		border-radius: 4px;
	}
	
	.color-wrapper span {
		font-family: monospace;
		font-size: 0.85rem;
		color: #64748b;
	}

	/* Background Control */
	.bg-control {
		display: flex;
		gap: 15px;
		align-items: center;
		min-height: 40px;
	}
	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 6px;
		cursor: pointer;
		font-weight: normal;
	}
	.grow { flex: 1; }

	/* Preview Area */
	.preview-box {
		background-color: #e2e8f0;
		/* Checkboard pattern for transparency */
		background-image: 
			linear-gradient(45deg, #cbd5e1 25%, transparent 25%), 
			linear-gradient(-45deg, #cbd5e1 25%, transparent 25%), 
			linear-gradient(45deg, transparent 75%, #cbd5e1 75%), 
			linear-gradient(-45deg, transparent 75%, #cbd5e1 75%);
		background-size: 20px 20px;
		background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
		
		border-radius: 8px;
		overflow: auto; /* Scroll if QR is huge */
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 20px;
		min-height: 300px;
		margin-bottom: 30px;
	}

	.preview-iframe {
		border: none;
		/* Add a shadow to the iframe itself so we can see white-on-white */
		box-shadow: 0 4px 20px rgba(0,0,0,0.1); 
		background: transparent;
	}

	/* Output Section */
	.output-group { margin-bottom: 15px; }
	.copy-row { display: flex; gap: 8px; margin-top: 5px; }
	.copy-row input { 
		background: #f1f5f9; 
		color: #475569; 
		font-family: monospace;
		font-size: 0.8rem;
	}
	button {
		background: #2563eb;
		color: white;
		border: none;
		padding: 0 16px;
		border-radius: 6px;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.2s;
	}
	button:hover { background: #1d4ed8; }

	@media (max-width: 800px) {
		.main-grid { grid-template-columns: 1fr; }
	}
</style>