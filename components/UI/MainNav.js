import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import styles from './MainNav.module.scss';

export default function MainModule(props) {
  const menuItemOne = useRef();
  const [itemOneSide, setItemOneSide] = useState();
  const menuItemTwo = useRef();
  const [itemTwoSide, setItemTwoSide] = useState();
  const menuItemThree = useRef();
  const [itemThreeSide, setItemThreeSide] = useState();
  const menuItemfour = useRef();
  const [itemFourSide, setItemFourSide] = useState();

  function mouseMove(setState, target, event) {
    if (
      event.pageX - target.current.offsetLeft <
      target.current.offsetWidth / 2
    ) {
      setState('L');
    } else {
      setState('R');
    }
  }

  return (
    <nav className={styles.container}>
      <ul>
        <li
          className={[
            styles.listItem,
            itemOneSide === 'L' ? styles.left : styles.right,
          ].join(' ')}
          ref={menuItemOne}
          onMouseEnter={mouseMove.bind(this, setItemOneSide, menuItemOne)}
        >
          <Link href={{ pathname: '/' }} passHref>
            <a>home</a>
          </Link>
          <span className={styles.underline} />
        </li>
        <li
          className={[
            styles.listItem,
            itemTwoSide === 'L' ? styles.left : styles.right,
          ].join(' ')}
          ref={menuItemTwo}
          onMouseEnter={mouseMove.bind(this, setItemTwoSide, menuItemTwo)}
        >
          <Link href={{ pathname: '/' }} passHref>
            <a>Galeria</a>
          </Link>
        </li>
        <li
          className={[
            styles.listItem,
            itemThreeSide === 'L' ? styles.left : styles.right,
          ].join(' ')}
          ref={menuItemThree}
          onMouseEnter={mouseMove.bind(this, setItemThreeSide, menuItemThree)}
        >
          <Link href={{ pathname: '/' }} passHref>
            <a>Projetos</a>
          </Link>
        </li>
        <li
          className={[
            styles.listItem,
            itemFourSide === 'L' ? styles.left : styles.right,
          ].join(' ')}
          ref={menuItemfour}
          onMouseEnter={mouseMove.bind(this, setItemFourSide, menuItemfour)}
        >
          <Link href={{ pathname: '/' }} passHref>
            <a>Contato</a>
          </Link>
        </li>
      </ul>
      {/* <div className={styles.logbox}>Login</div> */}
    </nav>
  );
}
