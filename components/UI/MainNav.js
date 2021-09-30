import Link from 'next/link';
import Backdrop from './Backdrop';
import { useEffect, useRef, useState } from 'react';
import styles from './MainNav.module.scss';
import Button from '../utils/Button';
import Dialog from '../UI/Dialog';
import { useClickOutside } from '../../hooks/useClickOutside';

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

export default function MainModule() {
  // web menus
  const menuItemOne = useRef();
  const menuItemTwo = useRef();
  const menuItemThree = useRef();

  // mobile menus
  const [mobileToggle, setMobileToggle] = useState(false);
  const [menuHover, setMenuHover] = useState(false);
  const [menuWidth, setMenuWidth] = useState(0);
  const [menuLeft, setMenuLeft] = useState(0);

  // log bos
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
  const [password, setPassword] = useState('');

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

  function log(event) {
    event.preventDefault();
  }

  function recoverPass() {
    setMessage(
      'Esqueceu sua senha? Iremos lhe enviar um email para recuperação de senha'
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
        <div className={styles.logbtn} onClick={() => setLogToggle((v) => !v)}>
          Login
        </div>
        {mobileToggle && <Backdrop onDismiss={mobilenav_toggle} />}
        {logToggle && (
          <div className={styles.logBox} ref={logBox}>
            <form onSubmit={log}>
              <input
                type="email"
                id="email"
                placeholder="email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                id="password"
                placeholder="senha"
                onChange={(e) => setPassword(e.target.value)}
              />
              <p onClick={recoverPass}>esqueci minha senha</p>
              <Button style="primary" icon={loginIco} className={styles.enter}>
                Entrar
              </Button>
            </form>
          </div>
        )}
      </div>
      <Dialog show={show} onOk={onOk} onCancel={onCancel}>
        {message || <div className={styles.loader}>Carregando</div>}
      </Dialog>
    </nav>
  );
}
