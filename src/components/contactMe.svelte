<script>
  import pricedata from "../../static/db/price.json";
</script>

<h2>Контакты</h2>
<div class="contact__image">
  <img
    src="https://raw.githubusercontent.com/iasvobodin/svs/images/static/image/webp/1920/19-06-15-08-53-52.webp"
    alt=""
  />
</div>
<section class="footer">
  <div class="left">
    <h3 class="contact_title">
      Свяжитеcь со мной любым удобным способом, или оставьте заявку
    </h3>
    <div class="contact">
      <a target="_blank" href="https://vk.com/svobodinaphoto"
        ><img class="social__icon" src="icons/vk.svg" alt="vk" /></a
      >
      <p class="social__description">Группа vk</p>
      <a target="_blank" href="https://www.instagram.com/svobodinaphoto/"
        ><img
          class="social__icon"
          src="icons/instagram.svg"
          alt="instagram"
        /></a
      >
      <p class="social__description">Instagram</p>
      <a target="_blank" href="https://t.me/svobodinaphoto"
        ><img class="social__icon" src="icons/telegram.svg" alt="telegram" /></a
      >
      <p class="social__description">Написать в Telegram</p>
      <a target="_blank" href="https://wa.me/%2B79514616243"
        ><img class="social__icon" src="icons/whatsapp.svg" alt="whatsapp" /></a
      >
      <p class="social__description">Написать в WhatsApp</p>
      <a target="_blank" href="viber://chat?number=79514616243"
        ><img class="social__icon" src="icons/viber.svg" alt="viber" /></a
      >
      <p class="social__description">Написать в Viber</p>
      <a target="_blank" href="tel:+79514616243"
        ><img
          class="social__icon"
          src="icons/telephone.svg"
          alt="telephone"
        /></a
      >
      <p class="social__description">Позвонить</p>
    </div>
  </div>
  <div class="right">
    <form class="form">
      <h3>Оставить заявку</h3>
      <div class="form__holder">
        <div class="form__right">
          <label
            >Ваше имя:
            <input type="text" />
          </label>
          <!-- <p type="Ваше имя:"><input /></p> -->
          <label
            >Телефон:
            <input type="tel" />
          </label>
          <!-- <p type="Телефон:">
            <input type="tel" />
          </p> -->
        </div>
        <div class="form__left">
          <label for="bday"
            >Дата съёмки:
            <input type="date" />
          </label>
          <label
            >Тип съёмки:
            <select>
              {#each pricedata as el}
                <option>{el.title}</option>
              {/each}
            </select>
          </label>
          <!-- <p type="Тип съёмки:">
           
          </p> -->
        </div>
      </div>

      <label
        >Сообщение
        <textarea id="" cols="30" rows="3" />
      </label>
      <button>Отправить</button>
    </form>
  </div>
</section>

<style>
  .form__holder {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(max(25vw, 240px), 1fr));
    column-gap: 3vw;
  }
  .contact__image {
    width: 100%;
    height: 50vh;
    margin-bottom: 5vh;
  }
  .contact__image > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 0% 35%;
  }
  .contact_title {
    width: 90%;
    margin: auto;
    margin-bottom: 3vh;
    text-align: center;
  }
  .form > h3 {
    text-align: center;
  }
  .form {
    width: 100%;
    height: auto;
    border-radius: 5px;
    margin: auto;
    background-image: linear-gradient(
        283deg,
        rgba(228, 228, 228, 0.04) 0%,
        rgba(228, 228, 228, 0.04) 30%,
        rgba(50, 138, 87, 0.04) 30%,
        rgba(50, 138, 87, 0.04) 49%,
        rgba(9, 5, 41, 0.04) 49%,
        rgba(9, 5, 41, 0.04) 100%
      ),
      linear-gradient(
        297deg,
        rgba(228, 228, 228, 0.04) 0%,
        rgba(228, 228, 228, 0.04) 20%,
        rgba(50, 138, 87, 0.04) 20%,
        rgba(50, 138, 87, 0.04) 60%,
        rgba(9, 5, 41, 0.04) 60%,
        rgba(9, 5, 41, 0.04) 100%
      ),
      linear-gradient(
        242deg,
        rgba(228, 228, 228, 0.04) 0%,
        rgba(228, 228, 228, 0.04) 29%,
        rgba(50, 138, 87, 0.04) 29%,
        rgba(50, 138, 87, 0.04) 48%,
        rgba(9, 5, 41, 0.04) 48%,
        rgba(9, 5, 41, 0.04) 100%
      ),
      linear-gradient(90deg, rgb(16, 0, 16), rgb(16, 0, 16));
    padding: 2.5vw;
    box-sizing: border-box;
    position: relative;
  }
  textarea,
  select,
  input {
    color: lavenderblush;
    font-family: Cormorant Infant;
    font-weight: 300;
    font-size: 20px;
    width: 100%;
    box-sizing: border-box;
    background: none;
    outline: none;
    resize: none;
    border: 0;
    transition: all 0.3s;
    border-bottom: 1px solid #ffffff;
  }
  select,
  input {
    height: 50px;
  }

  input:focus,
  select:focus,
  textarea:focus {
    border-bottom: 2px solid #b8009f;
  }
  input {
    padding: 10px;
  }
  label:before {
    content: attr(type);
    display: block;
    margin: 28px 0 0;
    font-size: 14px;
    color: #ffffff;
  }
  button {
    padding: 8px 12px;
    margin: 8px 0 0;
    /* font-family: "Montserrat", sans-serif; */
    border-radius: 3px;
    border: 2px solid #ffffff;
    background: 0;
    color: #ffffff;
    cursor: pointer;
    transition: all 0.3s;
  }
  button:hover {
    background: #78788c;
    color: #fff;
  }

  .footer {
    margin: auto;
    margin-top: 7vh;
    /* display: grid; */
    column-gap: 5vw;
    grid-template-columns: repeat(auto-fill, minmax(max(35vw, 250px), 1fr));
    width: min(1000px, 95vw);
    justify-content: center;
  }
  a {
    text-decoration: none;
    text-decoration-line: none;
    /* text-align: center; */
    /* place-self: center; */
  }
  .social__icon {
    width: 35px;
    height: 35px;
    margin: 5px;
  }
  .contact > a {
    place-self: center;
  }
  .contact {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(6, minmax(40px, 1fr));
  }
  @media (max-width: 300px) {
    .social__icon {
      width: 25px;
      height: 25px;
      margin: 5px;
    }
  }
  .social__description {
    /* display: none; */
  }
</style>
