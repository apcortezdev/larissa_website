import Head from 'next/head';
import Image from 'next/image';
import Arquitetura from '../components/UI/Arquitetura';
import LarissaLogo from '../components/UI/LarissaLogo';
import styles from '../styles/Home.module.scss';

export default function Home({ url }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Larissa Paschoalotto</title>
        <meta
          name="description"
          content="Escritório de Arquitetura Larissa Paschoalotto"
        />
        <link rel="icon" href="/favicon.ico" />
        <link href={url} rel="canonical" />
      </Head>
      <main id="top" className={styles.main}>
        <section className={styles.sectionOne}>
          <div className={styles.logoMain}>
            <LarissaLogo animated color="#151515" />{' '}
          </div>
          <div className={styles.logoSub}>
            <Arquitetura />
          </div>
        </section>
        <section className={styles.sectionTwo}>
          <section className={[styles.session, styles.row].join(' ')}>
            <div className={styles.aside}>
              <h1>
                o espaço é o
                <br />
                reflexo de
                <br />
                quem o habita
              </h1>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>
            <div className={styles.picture}>
              <Image
                src="/images/galery/LarissaPaschoalotto_galery09.jpeg"
                alt="Projeto Sala de Jantar"
                objectFit="cover"
                loading="lazy"
                layout="fill"
              />
            </div>
          </section>
          <section className={[styles.session, styles.rowReverse].join(' ')}>
            <div className={styles.aside}>
              <h1>
                o ambiente
                <br />
                estimula
                <br />a alma
              </h1>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>
            <div className={styles.picture}>
              <Image
                src="/images/galery/LarissaPaschoalotto_galery03.jpeg"
                alt="Projeto Sala de Jantar"
                objectFit="cover"
                loading="lazy"
                layout="fill"
              />
            </div>
          </section>
          <section className={[styles.session, styles.row].join(' ')}>
            <div className={styles.aside}>
              <h1>
                sua casa
                <br />
                seu refúgio
              </h1>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur.
              </p>
            </div>
            <div className={styles.picture}>
              <Image
                src="/images/galery/LarissaPaschoalotto_galery25.jpeg"
                alt="Projeto Sala de Jantar"
                objectFit="cover"
                loading="lazy"
                layout="fill"
              />
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}

export async function getStaticProps(context) {
  return {
    props: {
      url: process.env.APP_URL,
    },
  };
}
