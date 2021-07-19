import styles from './Backdrop.module.scss';

const Backdrop = (props) => {
  return <div className={styles.backdrop} onClick={props.onDismiss} />
};

export default Backdrop;
