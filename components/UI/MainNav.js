import Link from 'next/link';
import { signin, signOut } from 'next-auth/client';
import { useSession } from 'next-auth/client';
import Backdrop from './Backdrop';
import { useEffect, useRef, useState } from 'react';
import styles from './MainNav.module.scss';
import Button from '../utils/Button';
import Dialog from '../UI/Dialog';
import { useClickOutside } from '../../hooks/useClickOutside';
import { validateEmail } from '../../util/frontValidation';
import { useRouter } from 'next/router';

const loginIco = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    viewBox="0 0 16 16"
  >
    <path
      fillRule="evenodd"
      d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z"
    />
    <path
      fillRule="evenodd"
      d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"
    />
  </svg>
);

export default function MainNav() {
  const router = useRouter();
  const [session] = useSession();
  const [permission, setPermission] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openRepo, setOpenRepo] = useState(false);
  const [checkLogin, setCheckLogin] = useState(false);

  // web menus
  const menuItemOne = useRef();
  const menuItemTwo = useRef();
  const menuItemThree = useRef();

  // mobile menus
  const [mobileToggle, setMobileToggle] = useState(false);
  const [menuHover, setMenuHover] = useState(false);
  const [menuWidth, setMenuWidth] = useState(0);
  const [menuLeft, setMenuLeft] = useState(0);

  // log box
  const logBox = useRef();
  const [logToggle, setLogToggle] = useState(false);
  useClickOutside(logBox, () => setLogToggle(false));

  // dialog
  const [show, setShow] = useState(false);
  const [onOk, setOnOk] = useState(null);
  const [onCancel, setOnCancel] = useState(null);
  const [message, setMessage] = useState('');

  // login
  const [email, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState(true);
  const [password, setPassword] = useState('');
  const [passwordValid, setPasswordValid] = useState(true);

  const getUserPermission = async () => {
    const res = await fetch(`/api/user?email=${session.user.email}`);
    const perm = await res.json();
    setPermission(perm.permission);
    return perm.permission;
  };

  useEffect(() => {
    if (checkLogin && session) {
      setCheckLogin(false);
      getUserPermission().then((perm) => {
        setLogToggle(false);
        openDrawer(perm);
      });
    }
  });

  function mouseHoverList() {
    setMenuHover((state) => !state);
  }

  function mouseHoverItem(ref) {
    setMenuWidth(ref.current.offsetWidth);
    setMenuLeft(ref.current.offsetLeft);
  }

  function mobilenav_toggle() {
    setMobileToggle((t) => !t);
  }

  const validate = () => {
    let valid = true;
    setEmailValid(true);
    setPasswordValid(true);

    // email
    if (!validateEmail(email)) {
      setEmailValid(false);
      valid = false;
    }

    // password
    if (password.length <= 0) {
      setPasswordValid(false);
      valid = false;
    }

    return valid;
  };

  async function login(event) {
    event.preventDefault();
    if (validate()) {
      setLoading(true);
      const response = await signin('credentials', {
        redirect: false,
        email: email,
        password: password,
      });
      switch (response.status) {
        case 200:
          if (response.error) {
            setNoButtons(false);
            setDiainMessage(
              'Ops, algo deu errado. Por favor, tente daqui a pouquinho!'
            );
          } else {
            setCheckLogin(true);
          }
          break;
        default:
          setNoButtons(false);
          setDialogMessage(
            'Ops, algo deu errado. Por favor, tente daqui a pouquinho!'
          );
          break;
      }
    }
  }

  async function logout(event) {
    event.preventDefault();
    signOut();
  }

  const openDrawer = (perm) => {
    if (session) {
      const p = perm || permission;
      if (p === 'adm') {
        router.push({ pathname: '/acesso' });
      } else if (p === 'cli') {
        setOpenRepo((v) => !v);
      }
      setLoading(false);
    } else {
      setEmailValid(true);
      setPasswordValid(true);
      setLogToggle((v) => !v);
    }
  };

  function recoverPass() {
    setMessage(
      'Esqueceu sua senha? Iremos lhe enviar um email para recuperação de senha.'
    );
    setOnOk(() => () => recover());
    setOnCancel(() => () => setShow(false));
    setShow(true);
  }

  async function recover() {
    setOnOk(null);
    setOnCancel(null);
    setMessage(null);
    const local = await fetch('https://geolocation-db.com/json/');
    const location = await local.json();
    const response = await fetch('/api/recover', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, log: location }),
    });
    switch (response.status) {
      case 201:
        setMessage(
          'O email foi enviado. Por favor, cheque sua caixa de mensagens.'
        );
        break;
      case 404:
        setMessage(
          'Este email não está cadastrado. Por favor, tente outro endereço ou entre em contato conosco.'
        );
        break;
      default:
        setMessage(
          'Ops, estamos com um probleminha. Por favor, tente mais tarde.'
        );
        break;
    }
    setOnOk(() => () => setShow(false));
  }

  return (
    <nav className={styles.container}>
      <div className={styles.content}>
        <div className={styles.mobilenav_icontoggle} onClick={mobilenav_toggle}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            className={styles.mobilenav__icon}
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
            />
          </svg>
        </div>
        <div
          className={[
            styles.mobilenav__menu,
            mobileToggle ? styles.mobileOn : '',
          ]
            .join(' ')
            .trim()}
        >
          <ul>
            <li>
              <Link href={{ pathname: '/' }} passHref>
                <a>home</a>
              </Link>
            </li>
            <li>
              <Link href={{ pathname: '/galeria' }} passHref>
                <a>Galeria</a>
              </Link>
            </li>
            <li>
              <Link href={{ pathname: '/contato' }} passHref>
                <a>Contato</a>
              </Link>
            </li>
          </ul>
        </div>
        <ul
          className={styles.webmenu}
          onMouseEnter={mouseHoverList}
          onMouseLeave={mouseHoverList}
        >
          <li
            ref={menuItemOne}
            onMouseEnter={mouseHoverItem.bind(this, menuItemOne)}
          >
            <Link href={{ pathname: '/' }} passHref>
              <a>home</a>
            </Link>
          </li>
          <li
            ref={menuItemTwo}
            onMouseEnter={mouseHoverItem.bind(this, menuItemTwo)}
          >
            <Link href={{ pathname: '/galeria' }} passHref>
              <a>Galeria</a>
            </Link>
          </li>
          <span
            className={styles.underline}
            style={{
              opacity: menuHover ? 1 : 0,
              width: menuWidth,
              left: menuLeft,
            }}
          />
          <li
            ref={menuItemThree}
            onMouseEnter={mouseHoverItem.bind(this, menuItemThree)}
          >
            <Link href={{ pathname: '/contato' }} passHref>
              <a>Contato</a>
            </Link>
          </li>
        </ul>
        <div className={styles.logbtn} onClick={() => openDrawer(null)}>
          {session ? 'Projeto' : 'Login'}
        </div>
        {mobileToggle && <Backdrop onDismiss={mobilenav_toggle} />}
        {logToggle && (
          <div className={styles.logBox} ref={logBox}>
            <form onSubmit={login}>
              <input
                type="email"
                id="email"
                placeholder="email"
                onChange={(e) => setEmail(e.target.value)}
                className={emailValid ? '' : styles.invalid}
              />
              <input
                type="password"
                id="password"
                placeholder="senha"
                onChange={(e) => setPassword(e.target.value)}
                className={passwordValid ? '' : styles.invalid}
              />
              {loading ? (
                <>
                  <p>esqueci minha senha</p>
                  <div className={styles.btnStatic}>Carregando...</div>
                </>
              ) : (
                <>
                  <p onClick={recoverPass}>esqueci minha senha</p>
                  <Button
                    style="primary"
                    icon={loginIco}
                    className={styles.enter}
                  >
                    Entrar
                  </Button>
                </>
              )}
            </form>
          </div>
        )}
        <div
          className={[styles.repoBox, openRepo ? styles.repoOn : ''].join(' ')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            className={styles.leftIcon}
            viewBox="0 0 16 16"
            onClick={() => openDrawer(null)}
          >
            <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
          </svg>
          {openRepo && (
            <form>
              <p>meus arquivos</p>
            </form>
          )}
          <p className={styles.logout} onClick={logout}>
            logout
          </p>
        </div>
      </div>
      <Dialog show={show} onOk={onOk} onCancel={onCancel}>
        {message || <div className={styles.loader}>Carregando</div>}
      </Dialog>
    </nav>
  );
}
