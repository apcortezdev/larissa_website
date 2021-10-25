import styles from './Button.module.scss';
import PropTypes from 'prop-types';

export default function Button({ className, style, children, icon, animate = true, ...rest }) {
  return (
    <button
      className={[
        styles.button,
        style === 'secondary' ? styles.secondary : styles.primary,
        animate ? styles.animate : '',
        className,
      ].join(' ')}
      {...rest}
    >
      <span className={styles.textspace}>{children}</span>
      <span className={styles.iconspace}>
        {icon}
      </span>
    </button>
  );
}

Button.propTypes = {
  className: PropTypes.string,
  style: PropTypes.oneOf(['primary', 'secondary']),
  icon: PropTypes.node,
};
