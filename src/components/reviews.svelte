<script>
    import reviews from "../../static/db/reviews.json";
</script>

<div class="reviews__holder">
    <h2 class="review__title">Отзывы</h2>
    <div class="cont">
        {#each reviews as review}
            <div class="review">
                <div class="review__decription">
                    <h5 class="review__name">{review.name}</h5>
                    <p class="review__body">{review.body}</p>
                </div>
                <div class="ava">
                    <img src="/image/rev/{review.id}.jpg" alt="ava" />
                </div>
            </div>
        {/each}
    </div>
</div>

<style>
    .review__title {
        font-family: Cormorant Infant;
        font-size: max(36px, 4.8vw);
        line-height: max(40px, 5.2vw);
        font-weight: 300;
        color: #ffffff;
    }
    .reviews__holder {
        position: relative;
        width: 90vw;
        height: auto;
        margin: auto;
        margin-top: 7vh;
        margin-bottom: 7vh;
    }
    .cont {
        display: grid;
        /* grid-auto-flow: column; */
        grid-auto-columns: min(90vw, 600px);
        grid-template-columns: repeat(auto-fill, minmax(600px, 1fr));
        /* grid-template-columns: repeat(auto-fill, min(90vw, 600px)); */
        column-gap: 2vw;
        row-gap: 2vw;
        left: 0;
    }
    @media (max-width: 1200px) {
        .reviews__holder {
            overflow: auto;
            width: 100vw;
            min-height: 300px;
        }
        .cont {
            display: grid;
            grid-auto-flow: column;
            grid-auto-columns: min(90vw, 600px);
            grid-template-columns: repeat(auto-fill, min(90vw, 600px));
            column-gap: 2vw;
            left: 0;
        }
    }
    .review {
        height: 300px;
        box-shadow: -3rem 0 3rem -2rem #000;
        border-radius: 5px;
        /* margin-left: 15px; */
        background: linear-gradient(85deg, #434343, #262626);
        background-image: linear-gradient(
            85deg,
            rgb(67, 67, 67),
            rgb(38, 38, 38)
        );
        display: grid;
        grid-template-columns: 150px 1fr;
    }
    .review__decription {
        background-image: repeating-linear-gradient(
                112.5deg,
                rgb(0, 0, 0) 0px,
                rgb(0, 0, 0) 14px,
                transparent 14px,
                transparent 15px
            ),
            repeating-linear-gradient(
                22.5deg,
                rgb(0, 0, 0) 0px,
                rgb(0, 0, 0) 14px,
                transparent 14px,
                transparent 15px
            ),
            linear-gradient(
                150deg,
                hsl(146, 54%, 44%),
                hsl(218, 54%, 44%),
                hsl(290, 54%, 44%),
                hsl(2, 54%, 44%),
                hsl(74, 54%, 44%)
            );
        border-radius: 0 5px 5px 0;
        display: grid;
        height: 300px;
        overflow: auto;
    }
    /* .review:hover > .review__body {
    -webkit-line-clamp: 15;
  } */

    /* .review:hover {
    position: absolute;
    width: 50vw;
    height: 50vh;
    transform: translate(-50% -50%);
  } */
    .review__name {
        /* white-space: pre-wrap; */
        /* grid-area: 1/1; */
        align-self: stretch;
        justify-self: center;
        font-family: Cormorant Infant;
        padding: 5px;
        margin: 0;
        text-align: center;
        font-size: calc(16px + 1vw);
        line-height: calc(16px + 1.2vw);
        font-weight: 300;
        color: #ffffff;
    }
    .ava {
        /* box-shadow: 5px 5px 5px 0px #292929; */
        /* filter: grayscale(100%); */
        grid-area: 1/1;
        overflow: hidden;
        border-radius: 5px 0px 0px 5px;
        width: 150px;
        height: 300px;
    }
    .ava > img {
        height: 100%;
        width: 100%;
        object-fit: cover;
        object-position: center;
    }
    .arrow {
        align-self: end;
        justify-self: end;
        margin-right: 2%;
        margin-bottom: 2%;
        width: 25px;
    }
    .review__body {
        /* justify-self: end; */
        /* width: 75%; */
        align-self: stretch;
        margin: 0;
        padding: 15px;
        /* display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden; */
        font-family: Comfortaa, Sentinel SSm A, Sentinel SSm B, system-ui,
            -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial,
            sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol;
        font-weight: 150;
        /* font-family: Comfortaa; */
        color: white;
        font-size: clamp(12px, calc(0.7rem + 0.35vw), 24px);
        line-height: 1.7;
        white-space: pre-wrap;
        /* padding: 10px; */
    }
</style>
