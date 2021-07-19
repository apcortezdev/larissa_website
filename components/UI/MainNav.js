import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import styles from './MainNav.module.scss';

export default function MainModule(props) {
  const menuItemOne = useRef();
  const menuItemTwo = useRef();
  const menuItemThree = useRef();

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

  return (
    <nav className={styles.container}>
      <ul
        className={styles.menu}
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
          <span className={styles.underline} />
        </li>
        <li
          ref={menuItemTwo}
          onMouseEnter={mouseHoverItem.bind(this, menuItemTwo)}
        >
          <Link href={{ pathname: '/' }} passHref>
            <a>Galeria</a>
          </Link>
        </li>
        <li
          ref={menuItemThree}
          onMouseEnter={mouseHoverItem.bind(this, menuItemThree)}
        >
          <Link href={{ pathname: '/' }} passHref>
            <a>Contato</a>
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
      </ul>
      {/* <div className={styles.logbox}>Login</div> */}
    </nav>
  );
}
