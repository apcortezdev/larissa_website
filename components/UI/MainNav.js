import Link from 'next/link';
import Backdrop from './Backdrop';
import { useEffect, useRef, useState } from 'react';
import styles from './MainNav.module.scss';

export default function MainModule() {
  const menuItemOne = useRef();
  const menuItemTwo = useRef();
  const menuItemThree = useRef();

  const [mobileToggle, setMobileToggle] = useState(false);
  const [menuHover, setMenuHover] = useState(false);
  const [menuWidth, setMenuWidth] = useState(0);
  const [menuLeft, setMenuLeft] = useState(0);

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
        <div className={styles.logbox}>Login</div>
        {mobileToggle && <Backdrop onDismiss={mobilenav_toggle} />}
      </div>
    </nav>
  );
}
