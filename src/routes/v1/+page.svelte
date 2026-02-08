<script lang="ts">
	import { page } from '$app/stores';
	import QRCodeStyling from 'qr-code-styling';
	import type { 
        Options, 
        DotType, 
        CornerSquareType, 
        CornerDotType 
    } from 'qr-code-styling';

	let qrContainer = $state<HTMLElement | null>(null);
	let qrCodeInstance = $state<QRCodeStyling | null>(null);

	let url = $derived($page.url.searchParams.get('url'));
	
	let size = $derived(Number($page.url.searchParams.get('size')) || 500);
	let dotColor = $derived($page.url.searchParams.get('dotColor') || '#000000');
	let bgColor = $derived($page.url.searchParams.get('bgColor') || 'transparent');
	let dotType = $derived(($page.url.searchParams.get('dotType') as DotType) || 'rounded');
	let cornerType = $derived(($page.url.searchParams.get('cornerType') as CornerSquareType) || 'extra-rounded');
	let cornerColor = $derived($page.url.searchParams.get('cornerColor') || '#000000');
    let margin = $derived(Number($page.url.searchParams.get('margin')) || 20);

	$effect(() => {
		if (!url) return;

		const options: Options = {
			width: size,
			height: size,
			type: 'svg',
			data: url,
			image: '',
            margin: margin,
			dotsOptions: {
				color: dotColor,
				type: dotType
			},
			backgroundOptions: {
				color: bgColor,
			},
			cornersSquareOptions: {
				type: cornerType,
				color: cornerColor
			},
			cornersDotOptions: {
				type: 'dot' as CornerDotType,
				color: cornerColor
			}
		};

		if (!qrCodeInstance && qrContainer) {
			qrCodeInstance = new QRCodeStyling(options);
			qrCodeInstance.append(qrContainer);
		} 
		else if (qrCodeInstance) {
			qrCodeInstance.update(options);
		}
	});
</script>

{#if url}
	<main>
		<div class="qr-wrapper" bind:this={qrContainer}></div>
	</main>
{/if}

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		background: transparent;
		min-height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.qr-wrapper {
		/* This ensures the QR code has rounded corners visually on the slide */
		border-radius: 20px;
		overflow: hidden;
		line-height: 0; /* Prevents tiny gaps below SVG */
	}
</style>