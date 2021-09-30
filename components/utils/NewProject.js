import PropTypes from 'prop-types';
import styles from './NewProject.module.scss';
import { Input, InputMask, SelectText } from './FormComponents';
import { useRef, useState } from 'react';
import Button from './Button';

const states = [
  { id: 'ac', text: 'AC' },
  { id: 'al', text: 'AL' },
  { id: 'ap', text: 'AP' },
  { id: 'am', text: 'AM' },
  { id: 'ba', text: 'BA' },
  { id: 'ce', text: 'CE' },
  { id: 'df', text: 'DF' },
  { id: 'es', text: 'ES' },
  { id: 'go', text: 'GO' },
  { id: 'ma', text: 'MA' },
  { id: 'mt', text: 'MT' },
  { id: 'ms', text: 'MS' },
  { id: 'mg', text: 'MG' },
  { id: 'pa', text: 'PA' },
  { id: 'pb', text: 'PB' },
  { id: 'pr', text: 'PR' },
  { id: 'pe', text: 'PE' },
  { id: 'pi', text: 'PI' },
  { id: 'rj', text: 'RJ' },
  { id: 'rn', text: 'RN' },
  { id: 'rs', text: 'RS' },
  { id: 'ro', text: 'RO' },
  { id: 'rr', text: 'RR' },
  { id: 'sc', text: 'SC' },
  { id: 'sp', text: 'SP' },
  { id: 'se', text: 'SE' },
  { id: 'to', text: 'TO' },
];

const NewProject = ({ onDismiss }) => {
  const name = useRef();
  const firstName = useRef();
  const lastName = useRef();
  const email = useRef();
  const [cpfCnpj, setCpfCnpj] = useState();
  const [phone, setPhone] = useState();
  const address1 = useRef();
  const address2 = useRef();
  const city = useRef();
  const state = useRef();

  const save = (event) => {
    event.preventDefault();
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
      class="bi bi-x-lg"
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
          <Input id="name" ref={name} placeholder="Nome do Projeto" />
        </label>
        <label htmlFor="firstName">
          <Input id="firstName" ref={firstName} placeholder="Nome do Cliente" />
        </label>
        <label htmlFor="lastName">
          <Input
            id="lastName"
            ref={lastName}
            placeholder="Sobrenome do Cliente"
          />
        </label>
        <label htmlFor="email">
          <Input id="email" ref={email} placeholder="Email" />
        </label>
        <label htmlFor="cpf_cnpj">
          <InputMask
            id="cpf_cnpj"
            placeholder="CPF ou CNPJ"
            value={cpfCnpj}
            onChange={(e) => setCpfCnpj(e.target.value)}
            mask={['999.999.999-99', '99.999.999/9999-99']}
          />
        </label>
        <label htmlFor="phone">
          <InputMask
            id="phone"
            placeholder="Telefone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            mask={['(99) 9999-9999', '(99) 9 9999-9999']}
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
            <Input id="state" ref={state} placeholder="Estado" maxLength={2} />
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
    </div>
  );
};

NewProject.propTypes = {
  onDismiss: PropTypes.func,
};

export default NewProject;
