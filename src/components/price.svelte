<script>
    import pricedata from "../../static/db/price.json";
</script>

<h2 class="price__title">Цены</h2>
<div class="price__image">
    <img
        src="https://raw.githubusercontent.com/iasvobodin/svs/images/static/image/webp/1024/19-03-02-20-58-27.webp"
        alt=""
    />
</div>
<div class="price__holder">
    {#each pricedata as el}
        <div class="price__tarif">
            <h3>{el.title}</h3>
            <ul style="align-self: stretch;">
                {#each el.body as element}
                    <li>{element}</li>
                {/each}
            </ul>
            <h4 style="align-self: end;justify-self: center;">
                Цена : {el.price}
            </h4>
        </div>
    {/each}
</div>

<style>
    .price__holder {
        display: grid;
        justify-content: center;
        grid-template-columns: repeat(auto-fill, minmax(max(25vw, 250px), 1fr));
        row-gap: 5vh;
        column-gap: 2vw;
        width: 90vw;
        margin: auto;
    }
    .price__image {
        width: 100%;
        height: 50vh;
        margin-bottom: 5vh;
    }
    .price__image > img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: 50% 40%;
    }
    .price__tarif {
        position: relative;
        display: grid;
        border-radius: 5px;
        padding: 5px;
        background-image: radial-gradient(
                circle at 99% 33%,
                hsla(235, 0%, 48%, 0.03) 0%,
                hsla(235, 0%, 48%, 0.03) 37%,
                transparent 37%,
                transparent 100%
            ),
            radial-gradient(
                circle at 46% 16%,
                hsla(235, 0%, 48%, 0.03) 0%,
                hsla(235, 0%, 48%, 0.03) 43%,
                transparent 43%,
                transparent 100%
            ),
            radial-gradient(
                circle at 99% 25%,
                hsla(235, 0%, 48%, 0.03) 0%,
                hsla(235, 0%, 48%, 0.03) 22%,
                transparent 22%,
                transparent 100%
            ),
            radial-gradient(
                circle at 57% 88%,
                hsla(235, 0%, 48%, 0.03) 0%,
                hsla(235, 0%, 48%, 0.03) 86%,
                transparent 86%,
                transparent 100%
            ),
            radial-gradient(
                circle at 82% 78%,
                hsla(235, 0%, 48%, 0.03) 0%,
                hsla(235, 0%, 48%, 0.03) 22%,
                transparent 22%,
                transparent 100%
            ),
            linear-gradient(90deg, rgb(0, 0, 0), rgb(0, 0, 0));
        box-shadow: 100px 100px 1px -99px rgba(255, 255, 255, 0.171);
    }
    .price__tarif > h3 {
        align-self: start;
        justify-self: center;
        white-space: pre-wrap;
    }
    .price__tarif > ul {
        align-self: stretch;
        margin-top: 5vh;
        margin-bottom: 5vh;
    }
    /* .price__tarif::before {
    content: "";
    background: white;
    position: relative;
    width: calc(100% + 6px);
    height: calc(100% + 6px);
    z-index: 2;
  } */
    .price__title {
        font-family: Cormorant Infant;
        font-size: max(36px, 5.8vw);
        line-height: max(40px, 5.8vw);
        font-weight: 300;
        color: #ffffff;
        margin: 5vw;
    }
</style>
