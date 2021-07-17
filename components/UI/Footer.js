import LarissaLogo from './LarissaLogo';
import styles from './Footer.module.scss';

const Footer = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <LarissaLogo color="#F5F4F4" />
      </div>
    </div>
  );
};

export default Footer;
