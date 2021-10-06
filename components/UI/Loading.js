import PropTypes from 'prop-types';
import styles from './Loading.module.scss';

const Loading = ({ show }) => {
  if (show) {
    return (
      <div className={styles.blocker}>
        <div className={styles.content}>
          <div className={styles.lds_loader}>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    );
  }
  return <></>;
};

Loading.propTypes = {
  show: PropTypes.bool,
};
export default Loading;
