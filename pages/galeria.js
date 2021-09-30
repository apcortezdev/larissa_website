import Head from 'next/head';
import LarissaLogo from '../components/UI/LarissaLogo';
import Arquitetura from '../components/UI/Arquitetura';
import MainNav from '../components/UI/MainNav';
import Footer from '../components/UI/Footer';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import styles from '../styles/Galeria.module.scss';
import { getGaleryPics } from '../data/web_pics';

const DisplayImage = ({ pic, display, onDismiss }) => {
  return (
    <div
      className={styles.img_dialog}
      style={{ display: display ? 'block' : 'none' }}
    >
      {pic ? (
        <>
          <div className={styles.img}>
            <Image
              src={pic.src}
              alt={pic.alt}
              loading="lazy"
              objectFit="contain"
              layout="fill"
            />
          </div>
          <div className={styles.closeIcon} onClick={onDismiss}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
            </svg>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default function Galeria(props) {
  const galery = getGaleryPics();
  const [imageCase, setImageCase] = useState();
  const [display, setDisplay] = useState(false);

  const openImage = (event, pic) => {
    event.preventDefault();
    setImageCase(pic);
    setDisplay(true);
  };

  const closeImage = (event) => {
    event.preventDefault();
    setDisplay(false);
    setImageCase(null);
  };

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
        <article className={styles.content}>
          <section className={styles.galery}>
            {galery.map((pic) => (
              <div
                className={styles.galery_item}
                key={pic.src}
                style={{ gridRow: 'span ' + pic.grow }}
                onClick={(event) => openImage(event, pic)}
              >
                <Image
                  src={pic.src}
                  alt={pic.alt}
                  loading="lazy"
                  objectFit="cover"
                  layout="fill"
                  // placeholder="blur"
                />
                <div className={styles.img_info}>
                  <span>{pic.name}</span>
                </div>
              </div>
            ))}
          </section>
        </article>
        <Footer />
      </main>
      <DisplayImage pic={imageCase} display={display} onDismiss={closeImage} />
    </div>
  );
}

export async function getStaticProps(context) {
  return {
    props: {},
  };
}
