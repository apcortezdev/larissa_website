import PropTypes from 'prop-types';
import styles from './Project.module.scss';
import { useDropzone } from 'react-dropzone';
import { useCallback, useState } from 'react';
import Dialog from '../UI/Dialog';
import Loading from '../UI/Loading';

const Project = ({ project, onChange }) => {
  // dialog
  const [show, setShowDialog] = useState(false);
  const [onOk, setOnOk] = useState(null);
  const [onCancel, setOnCancel] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [style, setStyle] = useState('');

  // file upload
  const [files, setFiles] = useState([]);
  const onDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const address = () => {
    let add = [];
    if (project.address1) add.push(project.address1);
    if (project.address2) add.push(project.address2);
    if (project.city) add.push(project.city);
    if (project.state) add.push(project.state);
    if (project.cep)
      add.push(`${project.cep.slice(0, 5)}-${project.cep.slice(5, 8)}`);
    return add;
  };

  const cancelFiles = () => {
    setFiles([]);
  };

  const sendFiles = async () => {
    if (files.length === 0) {
      setMessage('Nenhum arquivo selecionado.');
      setStyle('');
      setOnCancel(null);
      setOnOk(() => () => setShowDialog(false));
      setShowDialog(true);
      return;
    }
    setLoading(true);
    const formData = new FormData();
    let method = 'POST';

    formData.append(
      'project',
      JSON.stringify({ projId: project._id, cliEmail: project.clientEmail })
    );
    files.forEach((file) => {
      formData.append(file.name, file);
    });

    const data = await fetch('/api/files', {
      method: method,
      body: formData,
    });
    switch (data.status) {
      case 201:
        const savedProject = await data.json();
        onChange({ ...project, files: savedProject.project.files });
        setFiles([]);
        break;
      default:
        setMessage('Ops, algo deu errado. Por favor, tente daqui a pouquinho!');
        setStyle('');
        setOnOk(() => () => setShowDialog(false));
        setShowDialog(true);
        break;
    }
    setLoading(false);
  };

  const deleteFile = async (fileId, name) => {
    setLoading(true);
    const formData = new FormData();
    let method = 'PUT';

    formData.append(
      'project',
      JSON.stringify({
        projId: project._id,
        cliEmail: project.clientEmail,
        file: { _id: fileId, name },
      })
    );

    const data = await fetch('/api/files', {
      method: method,
      body: formData,
    });
    switch (data.status) {
      case 201:
        const savedProject = await data.json();
        onChange({ ...project, files: savedProject.project.files });
        break;
      default:
        setMessage('Ops, algo deu errado. Por favor, tente daqui a pouquinho!');
        setStyle('');
        setOnOk(() => () => setShowDialog(false));
        setShowDialog(true);
        break;
    }
    setLoading(false);
  };

  const discontinueDialog = () => {
    setMessage(
      <>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          fill="currentColor"
          viewBox="0 0 16 16"
          className={styles.attentionIcon}
        >
          <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z" />
          <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z" />
        </svg>
        ATENÇÃO: Arquivar um projeto irá deletar todos os arquivos adicionados à
        ele e excluir o cliente, caso este não tenha nenhum outro projeto ativo.
      </>
    );
    setStyle(styles.dialogLong);
    setOnOk(() => () => discontinue());
    setOnCancel(() => () => setShowDialog(false));
    setShowDialog(true);
  };

  const discontinue = async () => {
    setLoading(true);

    const data = await fetch('/api/project', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projId: project._id, email: project.clientEmail }),
    });

    switch (data.status) {
      case 200:
        const res = await data.json();
        if (res.deleted.client) {
          setMessage('Projeto e usuário deletados com sucesso!');
        } else {
          setMessage(
            'O Projeto foi arquivado, mas o cliente não foi deletado pois tem outro projeto!'
          );
        }
        setStyle('');
        setOnCancel(null);
        setOnOk(() => () => {
          setShowDialog(false);
          onChange();
        });
        setShowDialog(true);
        break;
      default:
        setMessage('Ops, algo deu errado. Por favor, tente daqui a pouquinho!');
        setStyle('');
        setOnCancel(null);
        setOnOk(() => () => setShowDialog(false));
        setShowDialog(true);
        break;
    }
    setLoading(false);
  };

  if (project) {
    return (
      <div className={styles.content}>
        <section className={styles.header}>
          <table>
            <tbody>
              <tr>
                <td>Projeto:</td>
                <td>{project.name}</td>
                <td>Criado Em:</td>
                <td>{new Date(project.createdOn).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td>Cliente:</td>
                <td>{`${project.clientFirstName} ${project.clientLastName}`}</td>
                <td>CPF/CNPJ:</td>
                <td>{project.clientCpfCnpj}</td>
              </tr>
              <tr>
                <td>Telefone:</td>
                <td>
                  {project.clientPhone?.length === 11
                    ? `(${project.clientPhone.slice(
                        0,
                        2
                      )}) ${project.clientPhone.slice(
                        2,
                        3
                      )} ${project.clientPhone.slice(
                        3,
                        7
                      )}-${project.clientPhone.slice(7)}`
                    : `(${project.clientPhone.slice(
                        0,
                        2
                      )}) ${project.clientPhone.slice(
                        2,
                        6
                      )}-${project.clientPhone.slice(6)}`}
                </td>
                <td>Email:</td>
                <td>{project.clientEmail}</td>
              </tr>
              <tr>
                <td>Endereço:</td>
                <td colSpan={3}>{`${address().join(', ') || '---'}`}</td>
              </tr>
            </tbody>
          </table>
        </section>
        <section className={styles.files}>
          <p>Arquivos</p>
          {project.files?.map((file) => (
            <div key={file._id}>
              {file.name}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
                onClick={() => deleteFile(file._id, file.name)}
              >
                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
              </svg>
            </div>
          ))}
        </section>
        <section>
          <div {...getRootProps({ className: styles.dropzone })}>
            <input {...getInputProps()} multiple />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M8.5 11.5a.5.5 0 0 1-1 0V7.707L6.354 8.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 7.707V11.5z" />
              <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z" />
            </svg>
            {isDragActive ? (
              <p>Solte os arquivos aqui ...</p>
            ) : (
              <p>Arraste os arquivos para cá, ou clique para selecioná-los</p>
            )}
          </div>
          <div className={styles.filesBox}>
            <ul>
              {files?.map((file) => (
                <li key={file.name}>{file.name}</li>
              ))}
            </ul>
          </div>
          <span className={styles.between}>
            <span onClick={cancelFiles}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                className={styles.fileIcon}
                viewBox="0 0 16 16"
              >
                <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zM6.854 7.146 8 8.293l1.146-1.147a.5.5 0 1 1 .708.708L8.707 9l1.147 1.146a.5.5 0 0 1-.708.708L8 9.707l-1.146 1.147a.5.5 0 0 1-.708-.708L7.293 9 6.146 7.854a.5.5 0 1 1 .708-.708z" />
              </svg>
              Cancelar
            </span>
            <span onClick={sendFiles}>
              Enviar
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                className={styles.fileIcon}
                viewBox="0 0 16 16"
              >
                <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zM6.354 9.854a.5.5 0 0 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 8.707V12.5a.5.5 0 0 1-1 0V8.707L6.354 9.854z" />
              </svg>
            </span>
          </span>
        </section>
        <section>
          <span className={styles.discontinue} onClick={discontinueDialog}>
            Arquivar Projeto
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M12.643 15C13.979 15 15 13.845 15 12.5V5H1v7.5C1 13.845 2.021 15 3.357 15h9.286zM5.5 7h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1zM.8 1a.8.8 0 0 0-.8.8V3a.8.8 0 0 0 .8.8h14.4A.8.8 0 0 0 16 3V1.8a.8.8 0 0 0-.8-.8H.8z" />
            </svg>
          </span>
        </section>
        <Dialog show={show} onOk={onOk} onCancel={onCancel} className={style}>
          {message}
        </Dialog>
        <Loading show={loading} />
      </div>
    );
  }

  return (
    <div className={styles.empty}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="80"
        height="80"
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path
          fillRule="evenodd"
          d="M14.763.075A.5.5 0 0 1 15 .5v15a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V14h-1v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V10a.5.5 0 0 1 .342-.474L6 7.64V4.5a.5.5 0 0 1 .276-.447l8-4a.5.5 0 0 1 .487.022zM6 8.694 1 10.36V15h5V8.694zM7 15h2v-1.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5V15h2V1.309l-7 3.5V15z"
        />
        <path d="M2 11h1v1H2v-1zm2 0h1v1H4v-1zm-2 2h1v1H2v-1zm2 0h1v1H4v-1zm4-4h1v1H8V9zm2 0h1v1h-1V9zm-2 2h1v1H8v-1zm2 0h1v1h-1v-1zm2-2h1v1h-1V9zm0 2h1v1h-1v-1zM8 7h1v1H8V7zm2 0h1v1h-1V7zm2 0h1v1h-1V7zM8 5h1v1H8V5zm2 0h1v1h-1V5zm2 0h1v1h-1V5zm0-2h1v1h-1V3z" />
      </svg>
      PROJETO
    </div>
  );
};

Project.propTypes = {
  project: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    clientFirstName: PropTypes.string,
    clientLastName: PropTypes.string,
    clientEmail: PropTypes.string,
    clientCpfCnpj: PropTypes.string,
    clientPhone: PropTypes.string,
    address1: PropTypes.string,
    address2: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    createdOn: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  }),
  onDismiss: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Project;
