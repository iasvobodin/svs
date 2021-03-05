<script>
    import reviews from "../../static/db/reviews.json";

    let reviewsSlice = reviews.slice(0, 2);
    let toogleButton = true;
</script>

<div class="reviews__holder">
    <h2 class="review__title">Отзывы</h2>
    <div class="review__image">
        <img
            src="https://raw.githubusercontent.com/iasvobodin/svs/images/static/image/webp/1440/20-07-03-19-19-22.webp"
            alt=""
        />
    </div>
    <div class="cont">
        {#each reviewsSlice as review}
            <div class="review">
                <div class="ava">
                    <img src="/image/rev/{review.id}.jpg" alt="ava" />
                </div>
                <div class="review__decription">
                    <h5 class="review__name">{review.name}</h5>
                    <p class="review__body">{review.body}</p>
                </div>
            </div>
        {/each}
    </div>
    <div class="more__reviews">
        {#if toogleButton}
            <p class="more__reviews__title">Больше отзывов</p>
            <svg
                on:click={() => {
                    reviewsSlice = reviews;
                    toogleButton = !toogleButton;
                }}
                class="button"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                version="1.1"
                x="0px"
                y="0px"
                viewBox="0 0 490.4 490.4"
                xml:space="preserve"
            >
                <defs>
                    <linearGradient
                        spreadMethod="pad"
                        id="gradient"
                        x1="80%"
                        y1="116%"
                        x2="0%"
                        y2="0%"
                    >
                        <stop
                            offset="0"
                            style="stop-color:rgb(5, 0, 210);stop-opacity:1;"
                        />
                        <stop
                            offset="22%"
                            style="stop-color:rgb(5, 0, 210);stop-opacity:1;"
                        />
                        <stop
                            offset="75%"
                            style="stop-color:rgb(171, 0, 84);stop-opacity:1;"
                        />
                        <stop
                            offset="100%"
                            style="stop-color:rgb(215, 106, 0);stop-opacity:1;"
                        />
                    </linearGradient>
                </defs>
                <g>
                    <path
                        fill="url(#gradient)"
                        d="M490.4,245.2C490.4,110,380.4,0,245.2,0S0,110,0,245.2s110,245.2,245.2,245.2S490.4,380.4,490.4,245.2z M24.5,245.2    c0-121.7,99-220.7,220.7-220.7s220.7,99,220.7,220.7s-99,220.7-220.7,220.7S24.5,366.9,24.5,245.2z"
                    />
                    <path
                        fill="url(#gradient)"
                        d="M253.9,360.4l68.9-68.9c4.8-4.8,4.8-12.5,0-17.3s-12.5-4.8-17.3,0l-48,48V138.7c0-6.8-5.5-12.3-12.3-12.3    s-12.3,5.5-12.3,12.3v183.4l-48-48c-4.8-4.8-12.5-4.8-17.3,0s-4.8,12.5,0,17.3l68.9,68.9c2.4,2.4,5.5,3.6,8.7,3.6    S251.5,362.8,253.9,360.4z"
                    />
                </g>
            </svg>
        {:else}
            <p class="more__reviews__title">Меньше отзывов</p>
            <svg
                on:click={() => {
                    reviewsSlice = reviews.slice(0, 2);
                    toogleButton = !toogleButton;
                }}
                class="button reverse__button"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                version="1.1"
                x="0px"
                y="0px"
                viewBox="0 0 490.4 490.4"
                xml:space="preserve"
            >
                <defs>
                    <linearGradient
                        spreadMethod="pad"
                        id="gradient"
                        x1="80%"
                        y1="116%"
                        x2="0%"
                        y2="0%"
                    >
                        <stop
                            offset="0"
                            style="stop-color:rgb(5, 0, 210);stop-opacity:1;"
                        />
                        <stop
                            offset="22%"
                            style="stop-color:rgb(5, 0, 210);stop-opacity:1;"
                        />
                        <stop
                            offset="75%"
                            style="stop-color:rgb(171, 0, 84);stop-opacity:1;"
                        />
                        <stop
                            offset="100%"
                            style="stop-color:rgb(215, 106, 0);stop-opacity:1;"
                        />
                    </linearGradient>
                </defs>
                <g>
                    <path
                        fill="url(#gradient)"
                        d="M490.4,245.2C490.4,110,380.4,0,245.2,0S0,110,0,245.2s110,245.2,245.2,245.2S490.4,380.4,490.4,245.2z M24.5,245.2    c0-121.7,99-220.7,220.7-220.7s220.7,99,220.7,220.7s-99,220.7-220.7,220.7S24.5,366.9,24.5,245.2z"
                    />
                    <path
                        fill="url(#gradient)"
                        d="M253.9,360.4l68.9-68.9c4.8-4.8,4.8-12.5,0-17.3s-12.5-4.8-17.3,0l-48,48V138.7c0-6.8-5.5-12.3-12.3-12.3    s-12.3,5.5-12.3,12.3v183.4l-48-48c-4.8-4.8-12.5-4.8-17.3,0s-4.8,12.5,0,17.3l68.9,68.9c2.4,2.4,5.5,3.6,8.7,3.6    S251.5,362.8,253.9,360.4z"
                    />
                </g>
            </svg>
        {/if}
    </div>
</div>

<style>
    :root {
        --card__height: 350px;
    }
    .review__image {
        width: 100%;
        height: 50vh;
        margin-bottom: 5vh;
    }
    .review__image > img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: 50% 90%;
    }
    .button {
        width: 40px;
        height: 40px;
        /* fill: white; */
        cursor: pointer;
    }
    .reverse__button {
        transform: rotate(180deg);
    }
    .more__reviews {
        display: flex;
        align-items: center;
        margin-top: 1vw;
        margin-right: 2vw;
        justify-content: flex-end;
    }
    .more__reviews__title {
        font-family: Cormorant Infant;
        margin: 0;
        margin-left: 1vw;
        margin-right: 1vw;
        font-size: calc(16px + 1vw);
        line-height: calc(16px + 1.2vw);
        font-weight: 300;
        color: #ffffff;
    }
    .review__title {
        font-family: Cormorant Infant;
        font-size: max(36px, 5.8vw);
        line-height: max(40px, 5.8vw);
        font-weight: 300;
        color: #ffffff;
        margin: 5vw;
    }
    .reviews__holder {
        position: relative;

        height: auto;
        margin: auto;
        /* margin: 7vh; */
    }
    .cont {
        display: grid;
        justify-content: center;
        grid-template-columns: repeat(auto-fill, minmax(max(40vw, 250px), 1fr));
        width: 95%;
        margin: auto;
        grid-gap: 3vh;
    }
    .review {
        /* height: var(--card__height); */
        box-shadow: -3rem 0 3rem -2rem #000;
        border-radius: 5px;
        display: grid;
        grid-template-columns: minmax(30px, 200px) minmax(250px, 120ch);
    }
    .review__body:before {
        content: "";
        z-index: -1;
        border-radius: 5px;
        background: linear-gradient(
            120deg,
            #8d3b00,
            #5c0101 41.07%,
            #070047 76.05%
        );
        position: absolute;
        top: -3px;
        left: -3px;
        width: calc(100% + 6px);
        height: calc(100% + 6px);
    }
    .review__decription {
        position: relative;
        background: black;
        /* background-image: repeating-linear-gradient(
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
      ); */
        border-radius: 5px;
        display: grid;
        /* grid-template-rows: 0.5fr 2fr; */
        /* grid-template-columns: minmax(200px, 120ch); */
        /* height: var(--card__height); */
        /* overflow: auto; */
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
        align-self: start;
        justify-self: center;
        font-family: Cormorant Infant;
        padding: 5px;
        margin: 0;
        text-align: center;
        font-size: calc(20px + 1vw);
        line-height: calc(20px + 1.2vw);
        font-weight: 300;
        color: #ffffff;
    }

    .ava {
        /* box-shadow: 5px 5px 5px 0px #292929; */
        /* filter: grayscale(100%); */
        /* grid-area: 1/1; */
        /* align-self: start; */
        place-self: center;
        overflow: hidden;
        border-radius: 5px 5px 5px 5px;
        width: min(150px, 100%);
        height: min(300px, 100%);
    }
    .ava > img {
        height: 100%;
        width: 100%;
        object-fit: contain;
        object-position: top;
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
        place-self: stretch;
        margin: 0;
        padding: 1vw;
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
        font-size: clamp(12px, calc(0.7rem + 0.25vw), 24px);
        line-height: clamp(18px, calc(1.2rem + 0.35vw), 32px);
        white-space: pre-wrap;
        /* padding: 10px; */
    }
    @media (max-width: 1200px) {
        .ava {
            display: none;
        }
        .review {
            height: auto;
            grid-template-columns: minmax(250px, 120ch);
        }
        .review__decription {
            height: auto;
        }
    }
</style>
