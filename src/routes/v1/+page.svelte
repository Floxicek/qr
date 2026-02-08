<script lang="ts">
    import { page } from '$app/stores';
    import { browser } from '$app/environment'; // <--- 1. Import browser check
    import QRCodeStyling from 'qr-code-styling';
    import type { 
        Options, 
        DotType, 
        CornerSquareType, 
        CornerDotType 
    } from 'qr-code-styling';

    let qrContainer = $state<HTMLElement | null>(null);
    let qrCodeInstance = $state<QRCodeStyling | null>(null);


    let url = $derived(browser ? $page.url.searchParams.get('url') : null);
    
    let size = $derived(browser ? (Number($page.url.searchParams.get('size')) || 500) : 500);
    let dotColor = $derived(browser ? ($page.url.searchParams.get('dotColor') || '#000000') : '#000000');
    let bgColor = $derived(browser ? ($page.url.searchParams.get('bgColor') || 'transparent') : 'transparent');
    
    let dotType = $derived(browser ? (($page.url.searchParams.get('dotType') as DotType) || 'rounded') : 'rounded');
    let cornerType = $derived(browser ? (($page.url.searchParams.get('cornerType') as CornerSquareType) || 'extra-rounded') : 'extra-rounded');
    let cornerColor = $derived(browser ? ($page.url.searchParams.get('cornerColor') || '#000000') : '#000000');
    let margin = $derived(browser ? (Number($page.url.searchParams.get('margin')) || 20) : 20);

    $effect(() => {
        // This effect will only run in the browser when `url` becomes available
        if (!url || !browser) return;

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
{:else}
    <p style="opacity: 0;">Loading...</p>
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
        border-radius: 20px;
        overflow: hidden;
        line-height: 0; 
    }
</style>