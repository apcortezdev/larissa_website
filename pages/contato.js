import Head from 'next/head';
import LarissaLogo from '../components/UI/LarissaLogo';
import Arquitetura from '../components/UI/Arquitetura';
import MainNav from '../components/UI/MainNav';
import Footer from '../components/UI/Footer';
import InstagramIconLink from '../components/utils/InstagramIconLink';
import WhatsappIconLink from '../components/utils/WhatsappIconLink';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import styles from '../styles/Contato.module.scss';

export default function Contato(props) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Larissa Paschoalotto</title>
        <meta
          name="description"
          content="Escritório de Arquitetura Larissa Paschoalotto"
        />
        <link rel="icon" href="/favicon.ico" />
        <link href={'http://localhost:3000/'} rel="canonical" />
      </Head>

      <main id="top" className={styles.main}>
        <MainNav />
        <div className={styles.content}>
          <h2>Contato:</h2>
          <article className={styles.contact}>
            <section className={styles.contact_info}>
              <h3>Informações:</h3>
              <span>
                <span className={styles.contact_icon_span}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    className={styles.contact_icon}
                    viewBox="0 0 16 16"
                  >
                    <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555zM0 4.697v7.104l5.803-3.558L0 4.697zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757zm3.436-.586L16 11.801V4.697l-5.803 3.546z" />
                  </svg>
                </span>
                lpaschoalotto@email.com
              </span>
              <span className={styles.contact_whatsapp}>
                <div className={styles.contact_social_w}>
                  <WhatsappIconLink
                    link="https://bit.ly/LarissaPaschoalotto"
                    text={'(14) 9 9999-9999'}
                  />
                </div>
              </span>
              <span>
                <span className={styles.contact_icon_span}>
                  <div className={styles.contact_social_i}>
                    <InstagramIconLink link="https://www.instagram.com/arq.larissapaschoalotto/" />
                  </div>
                </span>
                arq.larissapaschoalotto
              </span>
              <span>
                <span className={styles.contact_icon_span}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    className={styles.contact_icon}
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                  </svg>
                </span>
              </span>
            </section>
            <section className={styles.contact_messanger}>
              <form className={styles.contact_form}>
                <input type="text" id="nome" placeholder="Nome" />
                <input type="text" id="phone" placeholder="Telefone" />
                <input type="email" id="email" placeholder="E-mail" />
                <textarea type="text" id="message" placeholder="Mensagem" />
              </form>
            </section>
          </article>
        </div>
        <Footer />
      </main>
    </div>
  );
}

export async function getStaticProps(context) {
  return {
    props: {},
  };
}
