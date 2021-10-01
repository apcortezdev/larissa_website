import React, { useEffect, useReducer, useRef, useState } from 'react';
import { useClickOutside } from '../../hooks/useClickOutside';
import styles from './FormComponents.module.scss';
import PropTypes from 'prop-types';

//Input type text w/ MASK
export const unmasker = (text) => {
  // Remove mask from text
  return text.replace(/[^a-z0-9]/gi, '');
};

const asUnmasked = (text) => {
  // Returns the unmasked template for the text
  // e.g: FT-4566 to AA9999
  return text.replace(/[a-z]/gi, 'A').replace(/[0-9]/gi, '9');
};

export const masker = (text, mask) => {
  // Mask the text acording to the mask parameter
  /* Rules:
      S - text and numbers
      A - only text
      9 - only numbers
  */
  const maskedText = text;
  const maskToUse = mask.toLowerCase();
  let finalText = '';
  let i_mask = 0;

  if (maskedText.length > 0) {
    if (maskToUse.length > 0) {
      for (
        let i_text = 0;
        i_text < maskedText.length && i_text < unmasker(maskToUse).length;
        i_text++
      ) {
        if (i_mask >= maskToUse.length) {
          break;
        }
        while (
          maskToUse[i_mask] !== 's' &&
          maskToUse[i_mask] !== 'a' &&
          maskToUse[i_mask] !== '9' &&
          i_mask < maskToUse.length
        ) {
          finalText = finalText.concat(maskToUse[i_mask]);
          i_mask++;
        }

        switch (maskToUse[i_mask]) {
          case 's':
            if (/[a-z0-9]/i.test(maskedText[i_text])) {
              finalText = finalText.concat(maskedText[i_text]);
              break;
            }
            return finalText;
          case 'a':
            if (/[a-zA-Z]/.test(maskedText[i_text])) {
              finalText = finalText.concat(maskedText[i_text]);
              break;
            }
            return finalText;
          case '9':
            if (/[0-9]/.test(maskedText[i_text])) {
              finalText = finalText.concat(maskedText[i_text]);
              break;
            }
            return finalText;
          default:
            return finalText;
        }
        i_mask++;
      }
    } else {
      return text;
    }
  }

  return finalText;
};

const maskReducer = (state, action) => {
  if (action.type === 'INITIAL') {
    const sortedMasks = !!action.masks
      ? action.masks.sort((a, b) => unmasker(a).length - unmasker(b).length)
      : false;

    // Set mask by pattern
    let activeMask = !!sortedMasks
      ? sortedMasks.find((m) =>
          unmasker(m).startsWith(asUnmasked(action.value || ''))
        )
      : false;
    activeMask = typeof activeMask === 'undefined' ? false : activeMask;

    const maskedValue = action.value
      ? !!activeMask
        ? masker(action.value, activeMask)
        : action.value
      : '';

    const longerLength = !!sortedMasks
      ? sortedMasks[sortedMasks.length - 1].length
      : '';
    return {
      masks: sortedMasks,
      activeMask: activeMask,
      maskedValue: maskedValue,
      length: longerLength,
    };
  } else {
    const unmasked = unmasker(action.value);
    let newActiveMask = !!state.masks
      ? state.masks.find((m) => unmasker(m).startsWith(asUnmasked(unmasked)))
      : false;

    newActiveMask =
      typeof newActiveMask === 'undefined' ? state.activeMask : newActiveMask;

    const newMaskedValue = !!newActiveMask
      ? masker(unmasked, newActiveMask)
      : action.value;

    return {
      masks: state.masks,
      activeMask: newActiveMask,
      maskedValue: newMaskedValue,
      length: state.length,
    };
  }
};

export const InputMask = (props) => {
  const {
    className,
    valid,
    validationMessage,
    mask,
    value,
    onChange,
    id,
    onBlur,
    type,
    tip,
    ...rest
  } = props;
  const isValid = valid != null ? valid : true;

  const [maskState, dispatchMask] = useReducer(maskReducer, {
    masks: false,
    activeMask: false,
    maskedValue: '',
  });

  useEffect(() => {
    dispatchMask({ type: 'INITIAL', masks: mask, value: value });
  }, []);

  const onChangeValue = (event) => {
    dispatchMask({ value: event.target.value });
    if (!!onChange) {
      if (!!maskState.activeMask) {
        const e = {
          ...event,
          target: {
            ...event.target,
            value: unmasker(event.target.value),
          },
        };
        onChange(e);
      } else {
        onChange(event);
      }
    }
  };

  const onBlurValue = (event) => {
    if (onBlur) {
      const e = {
        ...event,
        target: {
          ...event.target,
          value: unmasker(event.target.value),
        },
      };
      onBlur(e);
    }
  };

  return (
    <span id={`STP_${id}`} className={styles.inputLine}>
      <input
        className={[
          styles.inputText,
          className || '',
          !isValid && styles.inputText_invalid,
        ]
          .join(' ')
          .trim()}
        onChange={onChangeValue}
        id={id}
        {...rest}
        maxLength={maskState.length}
        onBlur={onBlurValue}
        value={maskState.maskedValue}
        type={type}
      />
      <span className={styles.validationMessage}>
        {isValid || (validationMessage ? validationMessage : 'Campo inválido')}
      </span>
      {!!tip && <span className={styles.tooltip}>{tip}</span>}
    </span>
  );
};

InputMask.propTypes = {
  className: PropTypes.string,
  valid: PropTypes.bool,
  validationMessage: PropTypes.string,
  mask: PropTypes.array,
  value: PropTypes.string,
  onChange: PropTypes.func,
  id: PropTypes.string,
  onBlur: PropTypes.func,
  type: PropTypes.string,
  ref: PropTypes.object,
  tip: PropTypes.string,
};

// Input type text
export const Input = React.forwardRef((props, ref) => {
  const { className, valid, validationMessage, id, tip, ...rest } = props;
  const isValid = valid != null ? valid : true;

  return (
    <span id={`IPT_${id}`} className={styles.inputLine}>
      {ref ? (
        <input
          ref={ref}
          className={[
            styles.inputText,
            className || '',
            !isValid ? styles.inputText_invalid : '',
          ]
            .join(' ')
            .trim()}
          id={id}
          {...rest}
        />
      ) : (
        <input
          className={[
            styles.inputText,
            className || '',
            !isValid ? styles.inputText_invalid : '',
          ]
            .join(' ')
            .trim()}
          id={id}
          {...rest}
        />
      )}
      <span className={styles.validationMessage}>
        {isValid || (validationMessage?.length > 0 ? validationMessage : 'Campo inválido')}
      </span>
      {!!tip && <span className={styles.tooltip}>{tip}</span>}
    </span>
  );
});

Input.propTypes = {
  className: PropTypes.string,
  valid: PropTypes.bool,
  validationMessage: PropTypes.string,
  id: PropTypes.string,
  type: PropTypes.string,
  tip: PropTypes.string,
};

// Input type file
export const InputFile = (props) => {
  const { className, valid, validationMessage, id, type, tip, ...rest } = props;
  const isValid = valid != null ? valid : true;

  return (
    <span id={`IPF_${id}`} className={styles.inputLine}>
      <input
        className={[
          styles.inputFile,
          className || '',
          !isValid && styles.inputText_invalid,
        ]
          .join(' ')
          .trim()}
        id={id}
        {...rest}
        type="file"
      />
    </span>
  );
};

Input.propTypes = {
  className: PropTypes.string,
  valid: PropTypes.bool,
  id: PropTypes.string,
  type: PropTypes.string,
};

// Input type radio
export const InputRadio = (props) => {
  const { className, type, tip, ...rest } = props;

  return (
    <div className={styles.radio_container}>
      <input
        className={[styles.radio_input, !!className ? className : '']
          .join(' ')
          .trim()}
        type="radio"
        {...rest}
      />
      <span className={styles.radio_checkmark} />
      {!!tip && <span className={styles.tooltip}>{tip}</span>}
    </div>
  );
};

InputRadio.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  tip: PropTypes.string,
};

// Input type checkbox
export const InputCheck = (props) => {
  const { className, valid, validationMessage, id, type, tip, ...rest } = props;
  const isValid = valid != null ? valid : true;

  return (
    <span id={`IPT_${id}`} className={styles.inputLine_check}>
      <input
        className={[
          styles.inputText,
          className || '',
          !isValid && styles.inputText_invalid,
        ]
          .join(' ')
          .trim()}
        id={id}
        {...rest}
        type="checkbox"
      />
      <span className={styles.validationMessage}>
        {isValid || (validationMessage ? validationMessage : 'Campo inválido')}
      </span>
      {!!tip && <span className={styles.tooltip}>{tip}</span>}
    </span>
  );
};

InputCheck.propTypes = {
  className: PropTypes.string,
  valid: PropTypes.bool,
  validationMessage: PropTypes.string,
  id: PropTypes.string,
  type: PropTypes.string,
  tip: PropTypes.string,
};

//Textarea
export const Textarea = ({ className, valid, validationMessage, ...rest }) => {
  const isValid = valid != null ? valid : true;
  return (
    <span className={styles.inputLine}>
      <textarea
        className={[
          styles.inputText,
          className ? className : '',
          !isValid && styles.inputText_invalid,
        ]
          .join(' ')
          .trim()}
        {...rest}
      />
      <span className={styles.validationMessage}>
        {isValid || (validationMessage ? validationMessage : 'Campo inválido')}
      </span>
    </span>
  );
};

Textarea.propTypes = {
  className: PropTypes.string,
  valid: PropTypes.bool,
  validationMessage: PropTypes.string,
};