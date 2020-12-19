<script>
    import { afterUpdate } from "svelte";
    export let page;
    afterUpdate(() => {
        console.log(page, "hellow frome canvas");
    });
</script>
