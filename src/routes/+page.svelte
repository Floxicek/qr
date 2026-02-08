<script>
import { redirect } from '@sveltejs/kit';
import { base } from '$app/paths';

export const load = () => {
    // 302 (Temporary) or 301 (Permanent)
    // We use `base` to ensure it works with your repo name (e.g. /my-repo/v1)
    throw redirect(302, `${base}/v1/`); 
};
</script>