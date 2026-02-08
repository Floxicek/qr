<script lang="ts">
    import { page } from '$app/stores';
    import { browser } from '$app/environment';
    import QRCodeStyling from 'qr-code-styling';
    import type { 
        Options, 
        DotType, 
        CornerSquareType, 
        CornerDotType 
    } from 'qr-code-styling';

    let qrContainer = $state<HTMLElement | null>(null);
    let qrCodeInstance = $state<QRCodeStyling | null>(null);

    // Track the container dimensions
    let containerW = $state(0);
    let containerH = $state(0);

    let url = $derived(browser ? $page.url.searchParams.get('url') : null);
    
    // Fallback size only if container is 0 (e.g. server-side)
    let initialSize = $derived(browser ? (Number($page.url.searchParams.get('size')) || 500) : 500);

    // Calculate the square size based on the smallest dimension of the window/iframe
    let dynamicSize = $derived(
        (containerW > 0 && containerH > 0) 
        ? Math.min(containerW, containerH) 
        : initialSize
    );

    let dotColor = $derived(browser ? ($page.url.searchParams.get('dotColor') || '#000000') : '#000000');
    let bgColor = $derived(browser ? ($page.url.searchParams.get('bgColor') || 'transparent') : 'transparent');
    let dotType = $derived(browser ? (($page.url.searchParams.get('dotType') as DotType) || 'rounded') : 'rounded');
    let cornerType = $derived(browser ? (($page.url.searchParams.get('cornerType') as CornerSquareType) || 'extra-rounded') : 'extra-rounded');
    let cornerColor = $derived(browser ? ($page.url.searchParams.get('cornerColor') || '#000000') : '#000000');
    let margin = $derived(browser ? (Number($page.url.searchParams.get('margin')) || 20) : 20);

    $effect(() => {
        if (!url || !browser) return;

        const options: Options = {
            width: dynamicSize,   // Use the calculated dynamic size
            height: dynamicSize,  // Keep it square
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
    <p style="opacity: 0;">Loading...</p>
{/if}

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        background: transparent;
        /* Ensure body fills the iframe */
        width: 100vw;
        height: 100vh;
        overflow: hidden; /* Prevent scrollbars during resize */
    }

    main {
        /* Main acts as the measuring container */
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .qr-wrapper {
        border-radius: 20px;
        overflow: hidden;
        line-height: 0;
        /* Optional: Smooth transition when resizing */
        transition: all 0.1s ease-out; 
    }
</style>