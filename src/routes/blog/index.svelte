<!--<script context="module" ✂prettier:content✂="CiAgZXhwb3J0IGZ1bmN0aW9uIHByZWxvYWQoKSB7CiAgICByZXR1cm4gdGhpcy5mZXRjaChgL2RiL1Bob3Rvc2VyaWVzLmpzb25gKQogICAgICAudGhlbigocikgPT4gci5qc29uKCkpCiAgICAgIC50aGVuKChwaG90b3NlcmllcykgPT4gewogICAgICAgIHJldHVybiB7IHBob3Rvc2VyaWVzIH07CiAgICAgIH0pOwogIH0K" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=">{}</script>-->
<script>
  import { fly } from "svelte/transition";
  import { leaveIndex } from "store.js";
</script>

<p
  style="height: 0px; margin: 0px"
  transition:fly
  on:outrostart={() => leaveIndex.set(true)} />
