import styles from './styles.module.scss';
import Link from 'next/link';
import Button from '../../utils/Button';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../context/appContext';

const CookieWindow = () => {
  const { showPrivacy, acceptCookies, rejectCookies } = useContext(AppContext);

  const onReject = (e) => {
    e.preventDefault();
    rejectCookies();
  };
  const onAccept = (e) => {
    e.preventDefault();
    acceptCookies();
  };

  if (showPrivacy) {
    return (
      <div className={styles.container}>
        <p>
          Este site utiliza cookies para proporcionar a melhor experiência boa e segura para você. Para saber mais, basta acessar nossa{' '}
          <Link href="/politicas">
            <a rel="noreferrer noopener" target={'_blank'}>
              Política de Privacidade
            </a>
          </Link>
        </p>
        <section className={styles.buttonSection}>
          <Button style="secondary" animate={false} onClick={onReject}>
            Rejeitar
          </Button>
          <Button style="primary" animate={false} onClick={onAccept}>
            Aceitar
          </Button>
        </section>
      </div>
    );
  }
  return null;
};

export default CookieWindow;
