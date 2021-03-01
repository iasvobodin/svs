<script>
    import pricedata from "../../static/db/price.json";
</script>

<h2 class="price__title">Цены</h2>
<div class="price__holder">
    {#each pricedata as el}
        <div class="price__tarif">
            {el.title}
        </div>
    {/each}
</div>

<style>
    .price__title {
        font-family: Cormorant Infant;
        font-size: max(36px, 4.8vw);
        line-height: max(40px, 5.2vw);
        font-weight: 300;
        color: #ffffff;
    }
</style>
