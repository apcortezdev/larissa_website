import PropTypes from 'prop-types';
import styles from './NewProject.module.scss';
import { Input, InputMask } from './FormComponents';
import { useRef, useState } from 'react';
import Button from './Button';
import {
  validateEmail,
  validateCPF,
  validateCNPJ,
  validatePhone,
  validateState,
} from '../../util/frontValidation';
import Dialog from '../UI/Dialog';

const NewProject = ({ onDismiss }) => {
  const name = useRef();
  const [nameValid, setNameValid] = useState(true);
  const [nameValidMessage, setNameValidMessage] = useState('Campo inválido');

  const firstName = useRef();
  const [firstNameValid, setFirstNameValid] = useState(true);
  const [firstNameValidMessage, setFirstNameValidMessage] =
    useState('Campo inválido');

  const lastName = useRef();
  const [lastNameValid, setLastNameValid] = useState(true);
  const [lastNameValidMessage, setLastNameValidMessage] =
    useState('Campo inválido');

  const email = useRef();
  const [emailValid, setEmailValid] = useState(true);
  const [emailValidMessage, setEmailValidMessage] = useState('Campo inválido');

  const [cpfCnpj, setCpfCnpj] = useState('');
  const [cpfCnpjValid, setCpfCnpjValid] = useState(true);
  const [cpfCnpjValidMessage, setCpfCnpjValidMessage] =
    useState('Campo inválido');

  const [phone, setPhone] = useState('');
  const [phoneValid, setPhoneValid] = useState(true);
  const [phoneValidMessage, setPhoneValidMessage] = useState('Campo inválido');

  const address1 = useRef();
  const address2 = useRef();
  const city = useRef();

  const [state, setState] = useState('');
  const [stateValid, setStateValid] = useState(true);
  const [stateValidMessage, setStateValidMessage] = useState('Campo inválido');

  const [cep, setCep] = useState('');
  const [cepValid, setCepValid] = useState(true);
  const [cepValidMessage, setCepValidMessage] = useState('Campo inválido');

  // Dialog
  const [showDialog, setShowDialog] = useState(false);
  const [onOkFunc, setOnOkFunc] = useState(null);
  const [dialogMessage, setDialogMessage] = useState();

  const validate = () => {
    setNameValid(true);
    setFirstNameValid(true);
    setLastNameValid(true);
    setEmailValid(true);
    setCpfCnpjValid(true);
    setPhoneValid(true);
    setStateValid(true);
    setCepValid(true);

    // name
    if (name.current.value.length < 5) {
      setNameValidMessage('Obrigatório, mínimo de 5 letras');
      setNameValid(false);
      name.current.focus();
      return false;
    }

    // firstName
    if (firstName.current.value.length < 2) {
      setFirstNameValidMessage('Obrigatório, mínimo de 2 letras');
      setFirstNameValid(false);
      firstName.current.focus();
      return false;
    }

    // lastName
    if (lastName.current.value.length < 1) {
      setLastNameValidMessage('Campo obrigatório');
      setLastNameValid(false);
      lastName.current.focus();
      return false;
    }

    // email
    if (!validateEmail(email.current.value)) {
      setEmailValidMessage('Email inválido');
      setEmailValid(false);
      email.current.focus();
      return false;
    }

    // cpf/cnpj
    if (cpfCnpj.length !== 11 && cpfCnpj.length !== 14) {
      setCpfCnpjValidMessage('CPF/CNPJ inválido');
      setCpfCnpjValid(false);
      return false;
    }
    if (cpfCnpj.length === 11 && !validateCPF(cpfCnpj)) {
      setCpfCnpjValidMessage('CPF inválido ou falso');
      setCpfCnpjValid(false);
      return false;
    }
    if (cpfCnpj.length === 14 && !validateCNPJ(cpfCnpj)) {
      setCpfCnpjValidMessage('CNPJ inválido ou falso');
      setCpfCnpjValid(false);
      return false;
    }

    // phone
    if (!validatePhone(phone)) {
      setPhoneValidMessage('Telefone inválido');
      setPhoneValid(false);
      return false;
    }

    // state
    if (state.length > 0 && !validateState(state)) {
      setStateValidMessage('Inválido');
      setStateValid(false);
      return false;
    }

    // cep
    if (cep.length > 0 && cep.length < 8) {
      setCepValidMessage('Inválido');
      setCepValid(false);
      return false;
    }

    return true;
  };

  const save = async (event) => {
    event.preventDefault();
    setOnOkFunc(null);
    setDialogMessage('Salvando...');
    setShowDialog(true);
    if (validate()) {
      const response = await fetch('/api/project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project: {
            name: name.current.value,
            firstName: firstName.current.value,
            lastName: lastName.current.value,
            email: email.current.value,
            cpfCnpj: cpfCnpj,
            phone: phone,
            address1: address1.current.value,
            address2: address2.current.value,
            city: city.current.value,
            state: state,
            cep: cep,
          },
        }),
      });
      switch (response.status) {
        case 201:
          const data = await response.json();
          setDialogMessage('Salvo com Sucesso!');
          setOnOkFunc(() => () => setShowDialog(false));
          setShowDialog(true);
          break;
        case 400:
          const error = await response.json();
          setDialogMessage('Erros foram encontrados: \n' + error.message);
          setOnOkFunc(() => () => setShowDialog(false));
          setShowDialog(true);
          break;
        default:
          setDialogMessage(
            'Opa, ocorreu um erro interno. Por favor, contate o administrador. Erro: ' +
              response.status
          );
          setOnOkFunc(() => () => setShowDialog(false));
          setShowDialog(true);
          break;
      }
    } else {
      setShowDialog(false);
    }
  };

  const submit = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      <path d="M6 12.796V3.204L11.481 8 6 12.796zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753z" />
    </svg>
  );

  const cancel = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      <path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z" />
    </svg>
  );

  return (
    <div className={styles.content}>
      NOVO PROJETO
      <form onSubmit={save}>
        <label htmlFor="name">
          <Input
            id="name"
            ref={name}
            placeholder="Nome do Projeto*"
            valid={nameValid}
            validationMessage={nameValidMessage}
          />
        </label>
        <label htmlFor="firstName">
          <Input
            id="firstName"
            ref={firstName}
            placeholder="Nome do Cliente*"
            valid={firstNameValid}
            validationMessage={firstNameValidMessage}
          />
        </label>
        <label htmlFor="lastName">
          <Input
            id="lastName"
            ref={lastName}
            placeholder="Sobrenome do Cliente*"
            valid={lastNameValid}
            validationMessage={lastNameValidMessage}
          />
        </label>
        <label htmlFor="email">
          <Input
            id="email"
            ref={email}
            placeholder="Email*"
            valid={emailValid}
            validationMessage={emailValidMessage}
          />
        </label>
        <label htmlFor="cpf_cnpj">
          <InputMask
            id="cpf_cnpj"
            placeholder="CPF ou CNPJ*"
            value={cpfCnpj}
            onChange={(e) => setCpfCnpj(e.target.value)}
            mask={['999.999.999-99', '99.999.999/9999-99']}
            valid={cpfCnpjValid}
            validationMessage={cpfCnpjValidMessage}
          />
        </label>
        <label htmlFor="phone">
          <InputMask
            id="phone"
            placeholder="Telefone*"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            mask={['(99) 9999-9999', '(99) 9 9999-9999']}
            valid={phoneValid}
            validationMessage={phoneValidMessage}
          />
        </label>
        <label htmlFor="address1">
          <Input id="address1" ref={address1} placeholder="Endereço da Obra" />
        </label>
        <label htmlFor="address2">
          <Input id="address2" ref={address2} placeholder="Complemento" />
        </label>
        <span>
          <label htmlFor="city" className={styles.inputCity}>
            <Input id="city" ref={city} placeholder="Cidade" />
          </label>
          <label htmlFor="state" className={styles.inputState}>
            <InputMask
              id="state"
              placeholder="Estado"
              value={state}
              onChange={(e) => setState(e.target.value)}
              mask={['AA']}
              valid={stateValid}
              validationMessage={stateValidMessage}
            />
          </label>
          <label htmlFor="cep" className={styles.inputCep}>
            <InputMask
              id="cep"
              placeholder="CEP"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              mask={['99999-999']}
              valid={cepValid}
              validationMessage={cepValidMessage}
            />
          </label>
        </span>
        <span>
          <Button
            className={styles.button}
            onClick={onDismiss}
            style="secondary"
            icon={cancel}
          >
            Cancelar
          </Button>
          <Button className={styles.button} type="submit" icon={submit}>
            Salvar
          </Button>
        </span>
      </form>
      <Dialog show={showDialog} onOk={onOkFunc}>
        {dialogMessage}
      </Dialog>
    </div>
  );
};

NewProject.propTypes = {
  onDismiss: PropTypes.func,
};

export default NewProject;
