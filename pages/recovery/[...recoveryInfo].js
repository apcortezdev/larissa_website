import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Button from '../../components/utils/Button';
import Dialog from '../../components/UI/Dialog';
import Loading from '../../components/UI/Loading';
import { getUserById } from '../../data/user';
import styles from '../../styles/RecoveryPage.module.scss';
import {
  validatePasswordLength,
  validatePasswordStrength,
} from '../../validation/frontValidation';

export default function RecoveryPage({ valid, email, userId, recoveryToken }) {
  const submitIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      <path d="M6 12.796V3.204L11.481 8 6 12.796zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753z" />
    </svg>
  );

  // dialog
  const [show, setShowDialog] = useState(false);
  const [onOk, setOnOk] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordValid, setPasswordValid] = useState(true);
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const router = useRouter();

  const save = async (e) => {
    e.preventDefault();
    if (!validatePasswordLength(password)) {
      setErrorMessage('*Senha deve ter pelo menos 6 caracteres');
      setPasswordValid(false);
      return;
    }
    if (!validatePasswordStrength(password)) {
      setErrorMessage('*Senha deve conter números e letras');
      setPasswordValid(false);
      return;
    }
    if (password !== passwordConfirmation) {
      setErrorMessage('*As senhas estão diferentes');
      setPasswordValid(false);
      return;
    }

    setLoading(true);

    const recover = await fetch('/api/recover/resetAuth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: userId,
        email: email,
        recoveryToken: recoveryToken,
        newPassword: password,
      }),
    });

    switch (recover.status) {
      case 201:
        setMessage('Sua senha foi alterada com sucesso.');
        setOnOk(() => () => {
          router.replace('/');
        });
        setShowDialog(true);
        break;
      default:
        setMessage('Ops, ocorreu um erro interno. Por favor, tente mais tarde');
        setOnOk(() => () => setShowDialog(false));
        setShowDialog(true);
        break;
    }
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Larissa Paschoalotto</title>
        <meta
          name="description"
          content="Escritório de Arquitetura Larissa Paschoalotto - Recuperação de senha"
        />
        <link rel="icon" href="/favicon.ico" />
        <link href={'http://localhost:3000/'} rel="canonical" />
      </Head>
      <main id="top" className={styles.main}>
        <article className={styles.content}>
          {valid ? (
            <form onSubmit={save}>
              <h3>Alterar Senha</h3>
              <input type="text" id="email" placeholder={email} disabled />
              <input
                type="password"
                id="password"
                placeholder="Nova Senha"
                value={password}
                onChange={(e) => {
                  setPasswordValid(true);
                  setPassword(e.target.value);
                }}
                className={passwordValid ? '' : styles.invalid}
              />
              <input
                type="password"
                id="passwordConf"
                placeholder="Confirmar Senha"
                value={passwordConfirmation}
                onChange={(e) => {
                  setPasswordValid(true);
                  setPasswordConfirmation(e.target.value);
                }}
                className={passwordValid ? '' : styles.invalid}
              />
              <p className={styles.error}>{errorMessage}</p>
              <Button className={styles.button} type="submit" icon={submitIcon}>
                Salvar
              </Button>
            </form>
          ) : (
            <p>Desculpe, esle link para alteração de senha está expirado.</p>
          )}
        </article>
      </main>
      <Dialog show={show} onOk={onOk}>
        {message}
      </Dialog>
      <Loading show={loading} />
    </div>
  );
}

export async function getServerSideProps(context) {
  let user;
  try {
    user = await getUserById(context.params.recoveryInfo[0]);
  } catch (err) {
    console.log('HERE1');
    return {
      notFound: true,
    };
  }

  if (!user) {
    console.log('HERE2');
    return {
      notFound: true,
    };
  }

  const recovery = user.recoveryLogs[user.recoveryLogs.length - 1];

  if (
    recovery.recoveryToken !== context.params.recoveryInfo[1] ||
    !!recovery.recoveredOn
  ) {
    return {
      notFound: true,
    };
  }

  const date = new Date();
  const exp = new Date(recovery.exp);

  if (date.getTime() < exp.getTime()) {
    return {
      props: {
        valid: true,
        email: user.email,
        userId: user._id.toString(),
        recoveryToken: recovery.recoveryToken,
      },
    };
  }
  const oldMoreThan2Days = new Date(exp);
  oldMoreThan2Days.setTime(exp.getTime() + 48 * 60 * 60 * 1000);
  if (
    date.getTime() >= exp.getTime() &&
    date.getTime() < oldMoreThan2Days.getTime()
  ) {
    return {
      props: {
        valid: false,
      },
    };
  }
  return {
    notFound: true,
  };
}
