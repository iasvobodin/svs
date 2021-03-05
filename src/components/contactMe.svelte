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
      <p type="Ваше имя:"><input placeholder="Напишите как вас зовут" /></p>
      <p type="Телефон:">
        <input placeholder="Как с вами можно связаться" />
      </p>
      <p type="Сообщение">
        <input placeholder="Напишете что-нибудь =)" />
      </p>
      <p>
        <label for="bday">Enter your birthday:</label>
        <input type="date" placeholder="Напишете что-нибудь =)" />
      </p>
      <button>Отправить</button>
    </form>
  </div>
</section>

<style>
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
  .form {
    width: 100%;
    /* height: 440px; */
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
    /* box-shadow: 0 0 40px -10px rgb(212, 212, 212); */
    /* margin: calc(50vh - 220px) auto; */
    padding: 15px 20px;
    box-sizing: border-box;
    /* font-family: "Montserrat", sans-serif; */
    position: relative;
  }

  input {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    background: none;
    outline: none;
    resize: none;
    border: 0;
    transition: all 0.3s;
    border-bottom: 2px solid #ffffff;
  }
  input:focus {
    border-bottom: 2px solid #cf5300;
  }
  p:before {
    content: attr(type);
    display: block;
    margin: 28px 0 0;
    font-size: 14px;
    color: #ffffff;
  }
  button {
    float: right;
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
    display: grid;
    column-gap: 5vw;
    grid-template-columns: repeat(auto-fill, minmax(max(35vw, 250px), 1fr));
    width: 95vw;
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
  .contact {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(auto-fill, minmax(max(15vw, 200px), 1fr));
    row-gap: 5vh;
  }
  @media (max-width: 600px) {
    .contact > a {
      display: grid;
    }
    .social__icon {
      place-self: center;
    }
    .contact {
      display: grid;
      width: 100%;
      grid-template-columns: repeat(6, minmax(40px, 1fr));
      row-gap: 5vh;
      margin: 3vh 0px;
    }
    .social__description {
      display: none;
    }
  }
</style>
