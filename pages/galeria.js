import Head from 'next/head';
import LarissaLogo from '../components/UI/LarissaLogo';
import Arquitetura from '../components/UI/Arquitetura';
import MainNav from '../components/UI/MainNav';
import Footer from '../components/UI/Footer';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import styles from '../styles/Galeria.module.scss';

export default function Galeria(props) {
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
