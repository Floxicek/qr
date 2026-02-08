<script lang="ts">
    import { page } from '$app/stores';
    import { browser } from '$app/environment';
    import QRCodeStyling from 'qr-code-styling';
    import { QR_DEFAULTS } from '$lib/defaults';
    import type { Options, CornerDotType } from 'qr-code-styling';

    // --- State ---
    let qrContainer = $state<HTMLElement | null>(null);
    let qrCodeInstance = $state<QRCodeStyling | null>(null);

    // Track container dimensions for dynamic resizing
    let containerW = $state(0);
    let containerH = $state(0);

    // --- Reactive Parameters ---
    // We use derived values to safely extract params or fall back to defaults
    
    let url = $derived(browser ? $page.url.searchParams.get('url') : null);

    // Helper to safely parse numbers (so "0" doesn't become the default)
    function getNumParam(key: string, defaultVal: number): number {
        if (!browser) return defaultVal;
        const val = $page.url.searchParams.get(key);
        return val !== null ? Number(val) : defaultVal;
    }

    // Helper to safely parse strings
    function getStrParam<T extends string>(key: string, defaultVal: T): T {
        if (!browser) return defaultVal;
        return ($page.url.searchParams.get(key) as T) ?? defaultVal;
    }

    // 1. Dimensions
    // Use the container's smallest side, otherwise fall back to URL param, otherwise default constant
    let initialSize = $derived(getNumParam('size', QR_DEFAULTS.size));
    let dynamicSize = $derived(
        (containerW > 0 && containerH > 0) 
        ? Math.min(containerW, containerH) 
        : initialSize
    );

    let margin = $derived(getNumParam('margin', QR_DEFAULTS.margin));

    // 2. Colors
    let dotColor = $derived(getStrParam('dotColor', QR_DEFAULTS.dotColor));
    let bgColor = $derived(getStrParam('bgColor', QR_DEFAULTS.bgColor));
    let cornerColor = $derived(getStrParam('cornerColor', QR_DEFAULTS.cornerColor));

    // 3. Shapes
    let dotType = $derived(getStrParam('dotType', QR_DEFAULTS.dotType));
    let cornerType = $derived(getStrParam('cornerType', QR_DEFAULTS.cornerType));

    // --- Effect ---
    $effect(() => {
        if (!url || !browser) return;

        const options: Options = {
            width: dynamicSize,
            height: dynamicSize,
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
    <main bind:clientWidth={containerW} bind:clientHeight={containerH}>
        <div class="qr-wrapper" bind:this={qrContainer}></div>
    </main>
{:else}
    <div class="loading"></div>
{/if}

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        background: transparent;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
    }

    main {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .qr-wrapper {
        /* Optional: Smoothly animate size changes */
        transition: all 0.1s ease-out;
        line-height: 0;
    }
</style>