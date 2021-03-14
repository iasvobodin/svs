<!-- <script context="module" ✂prettier:content✂="CiAgICBleHBvcnQgYXN5bmMgZnVuY3Rpb24gcHJlbG9hZCh7IHBhcmFtcyB9KSB7CiAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgdGhpcy5mZXRjaChgL2RiLyR7cGFyYW1zLnR5cGV9Lmpzb25gKTsKICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzLmpzb24oKTsKICAgICAgICByZXR1cm4geyBkYXRhIH07CiAgICB9Cg==">{}</script> -->
<script>
    import { photoseries } from "store.js";
    import { goto, stores, start } from "@sapper/app";

    const { page } = stores();

    console.log($page.params.type);
</script>
