import Head from 'next/head';
import LarissaLogo from '../../components/UI/LarissaLogo';
import Arquitetura from '../../components/UI/Arquitetura';
import MainNav from '../../components/UI/MainNav';
import Footer from '../../components/UI/Footer';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import styles from '../../styles/Acesso.module.scss';
import Project from '../../components/utils/Project';
import NewProject from '../../components/utils/NewProject';

export default function AcessoAdm({ projects }) {
  const [viewProj, setViewProj] = useState();
  const [newProject, setNewProject] = useState(false);

  const openProj = (event, proj) => {
    event.preventDefault();
    setNewProject(false);
    setViewProj(proj);
  };

  const closeProj = (event) => {
    event.preventDefault();
    setViewProj(null);
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
          <aside className={styles.menu}>
            <div className={styles.projMain}>
              <span>Projetos</span>
              <span
                className={styles.newProj}
                onClick={() => setNewProject(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z" />
                </svg>
              </span>
            </div>
            <ul>
              {projects.map((proj) => (
                <li key={proj._id} onClick={() => openProj(event, proj)}>
                  {proj.projName}
                </li>
              ))}
            </ul>
          </aside>
          <aside className={styles.session}>
            {newProject ? (
              <NewProject onDismiss={() => setNewProject(false)} />
            ) : (
              <Project project={viewProj} onDismiss={closeProj} />
            )}
          </aside>
        </article>
        <Footer />
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const projects = [
    {
      _id: 'hasdkjflhsa456lkdf',
      projName: 'Projeto Da Hannah',
      clFirstName: 'Hannah',
      clLastName: 'Fiorino',
      email: 'hannah_fiorino@coldmail.com',
      cpf_cnpj: '12345678901',
      phone: '14995959595',
      address1: 'Rua das Conchas Acústicas, 135',
      address2: 'Bairro dos Talheres',
      city: 'Camboítubiraba',
      state: 'MG',
      createdOn: new Date().toJSON(),
    },
  ];
  return {
    props: {
      projects: projects,
    },
  };
}
