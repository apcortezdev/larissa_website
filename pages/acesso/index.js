import Head from 'next/head';
import { getSession, signOut } from 'next-auth/client';
import { useState } from 'react';
import styles from '../../styles/Acesso.module.scss';
import Project from '../../components/utils/Project';
import NewProject from '../../components/utils/NewProject';
import { getProjects } from '../../data/project';
import { getUserByEmail } from '../../data/user';

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

  function logout(event) {
    event.preventDefault();
    signOut();
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Larissa Paschoalotto</title>
        <meta
          name="description"
          content="Escritório de Arquitetura Larissa Paschoalotto"
        />
        <link rel="icon" href="/favicon.ico" />
        <link href={'http://localhost:3000/acesso'} rel="canonical" />
      </Head>
      <main id="top" className={styles.main}>
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
                <li key={proj._id} onClick={(event) => openProj(event, proj)}>
                  {proj.name}
                </li>
              ))}
            </ul>
            <div className={styles.exit} onClick={logout}>
              <span>Sair</span>
            </div>
          </aside>
          <aside className={styles.session}>
            {newProject ? (
              <NewProject
                onDismiss={() => setNewProject(false)}
                onNew={() => {}}
              />
            ) : (
              <Project project={viewProj} onDismiss={closeProj} />
            )}
          </aside>
        </article>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  const user = await getUserByEmail(session.user.email);

  if (user.permission !== process.env.PERM_ADM) {
    return {
      notFound: true,
    };
  }

  const projects = await getProjects();

  return {
    props: {
      projects: JSON.parse(JSON.stringify(projects)),
      session: session,
    },
  };
}
