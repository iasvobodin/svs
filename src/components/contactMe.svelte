<h2>Контакты</h2>
<section class="footer">
  <div class="left">
    <h4 class="contact_title">
      Свяжитель со мной любым удобным для вас способом
    </h4>
    <div class="contact">
      <a target="_blank" href="https://vk.com/svobodinaphoto"
        ><img class="social__icon" src="icons/vk.svg" alt="vk" />Группа vk</a
      >
      <a target="_blank" href="https://www.instagram.com/svobodinaphoto/"
        ><img
          class="social__icon"
          src="icons/instagram.svg"
          alt="instagram"
        />Instagram</a
      >
      <a target="_blank" href="https://t.me/svobodinaphoto"
        ><img
          class="social__icon"
          src="icons/telegram.svg"
          alt="telegram"
        />Написать в Telegram</a
      >
      <a target="_blank" href="https://wa.me/%2B79514616243"
        ><img
          class="social__icon"
          src="icons/whatsapp.svg"
          alt="whatsapp"
        />Написать в WhatsApp</a
      >
      <a target="_blank" href="viber://chat?number=79514616243"
        ><img class="social__icon" src="icons/viber.svg" alt="viber" />Написать
        в Viber</a
      >
      <a target="_blank" href="tel:+79514616243"
        ><img
          class="social__icon"
          src="icons/telephone.svg"
          alt="telephone"
        />Позвонить</a
      >
    </div>
  </div>
  <div class="right">
    <h4 class="contact_title">Или оставьте заявку.</h4>
    <form class="form">
      <h4>Оставить заявку</h4>
      <p type="Ваше имя:"><input placeholder="Напишите как вас зовут" /></p>
      <p type="Телефон:">
        <input placeholder="Как с вами можно связаться" />
      </p>
      <p type="Сообщение">
        <input placeholder="Напишете что-нибудь =)" />
      </p>
      <button>Отправить</button>
    </form>
  </div>
</section>

<style>
  .contact_title {
    width: 50%;
    margin: auto;
    margin-bottom: 3vh;
    text-align: center;
  }
  .form {
    width: 100%;
    height: 440px;
    background-image: repeating-linear-gradient(
        90deg,
        rgba(33, 33, 33, 0.43) 0px,
        rgba(33, 33, 33, 0.43) 2px,
        transparent 2px,
        transparent 4px
      ),
      linear-gradient(90deg, rgb(33, 33, 33), transparent),
      linear-gradient(0deg, rgb(33, 33, 33), transparent),
      linear-gradient(90deg, rgb(175, 175, 175), rgb(175, 175, 175));
    border-radius: 5px;
    margin: auto;
    /* box-shadow: 0 0 40px -10px rgb(212, 212, 212); */
    /* margin: calc(50vh - 220px) auto; */
    padding: 20px 30px;
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
    grid-template-columns: repeat(auto-fill, minmax(max(35vw, 400px), 1fr));
    width: 90vw;
    justify-content: center;
  }
  a {
    text-decoration: none;
    text-decoration-line: none;
    /* text-align: center; */
    /* place-self: center; */
  }
  .social__icon {
    width: 25px;
    height: 25px;
    margin: 5px;
  }
  .contact {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(auto-fill, minmax(max(15vw, 200px), 1fr));
    row-gap: 5vh;
  }
</style>
