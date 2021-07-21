import styles from './Button.module.scss';

export default function Button({ children, ...rest }) {
  return (
    <button className={styles.button} {...rest}>
      <span className={styles.textspace}>{children}</span>
      <span className={styles.iconspace}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          className={styles.icon}
          viewBox="0 0 16 16"
        >
          <path d="M6 12.796V3.204L11.481 8 6 12.796zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753z" />
        </svg>
      </span>
    </button>
  );
}
