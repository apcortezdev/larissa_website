import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import styles from './Dialog.module.scss';

const Dialog = ({ className, show, onOk, onCancel, children }) => {
  if (show) {
    return (
      <div className={styles.page}>
        <div className={[className || '', styles.dialogBox].join(' ')}>
          <div className={styles.message}>{children}</div>
          {(onOk || onCancel) && (
            <span>
              {onCancel && (
                <div
                  className={[styles.btn, styles.btnAccent].join(' ')}
                  onClick={onCancel}
                >
                  Cancelar
                </div>
              )}
              {onOk && (
                <div
                  className={[styles.btn, styles.btnPrimary].join(' ')}
                  onClick={onOk}
                >
                  Ok
                </div>
              )}
            </span>
          )}
        </div>
      </div>
    );
  }

  return <></>;
};

Dialog.propTypes = {
  show: PropTypes.bool,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
  className: PropTypes.string,
};

export default Dialog;
