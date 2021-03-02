<script>
    import pricedata from "../../static/db/price.json";
</script>

<h2 class="price__title">Цены</h2>
<div class="price__holder">
    {#each pricedata as el}
        <div class="price__tarif">
            <h3 style="align-self: start;">{el.title}</h3>
            <ul style="align-self: stretch;">
                {#each el.body as element}
                    <li>{element}</li>
                {/each}
            </ul>
            <h4 style="align-self: end;">Цена : {el.price}</h4>
        </div>
    {/each}
</div>

<style>
    .price__holder {
        display: grid;
        justify-content: center;
        grid-template-columns: repeat(auto-fill, minmax(max(25vw, 300px), 1fr));
        row-gap: 5vh;
        column-gap: 2vw;
        width: 90vw;
        margin: auto;
    }
    .price__tarif {
        display: grid;
    }
    .price__title {
        font-family: Cormorant Infant;
        font-size: max(36px, 5.8vw);
        line-height: max(40px, 5.8vw);
        font-weight: 300;
        color: #ffffff;
        margin: 5vw;
    }
</style>
