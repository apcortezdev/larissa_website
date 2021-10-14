import { useCallback } from 'react';
import Link from 'next/link';
import { signin, signOut } from 'next-auth/client';
import { useSession } from 'next-auth/client';
import { useDropzone } from 'react-dropzone';
import Backdrop from './Backdrop';
import { useEffect, useRef, useState } from 'react';
import styles from './MainNav.module.scss';
import Button from '../utils/Button';
import Dialog from '../UI/Dialog';
import { useClickOutside } from '../../hooks/useClickOutside';
import {
  validateEmail,
  validatePasswordLength,
  validatePasswordStrength,
} from '../../validation/frontValidation';
import { useRouter } from 'next/router';
import Loading from './Loading';

const loginIco = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    viewBox="0 0 16 16"
  >
    <path
      fillRule="evenodd"
      d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z"
    />
    <path
      fillRule="evenodd"
      d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"
    />
  </svg>
);

export default function MainNav() {
  const router = useRouter();
  const [session] = useSession();
  const [projects, setProjects] = useState([]);
  const [activeProj, setActiveProj] = useState({});
  const [loading, setLoading] = useState(false);
  const [openRepo, setOpenRepo] = useState(false);

  // web menus
  const menuItemOne = useRef();
  const menuItemTwo = useRef();
  const menuItemThree = useRef();

  // mobile menus
  const [mobileToggle, setMobileToggle] = useState(false);
  const [menuHover, setMenuHover] = useState(false);
  const [menuWidth, setMenuWidth] = useState(0);
  const [menuLeft, setMenuLeft] = useState(0);

  // log box
  const logBox = useRef();
  const [logToggle, setLogToggle] = useState(false);
  const [email, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState(true);
  const [password, setPassword] = useState('');
  const [passwordConf, setPasswordConf] = useState('');
  const [passwordValid, setPasswordValid] = useState(true);
  const [logErrorMessage, setLogErrorMessage] = useState('');
  useClickOutside(logBox, () => setLogToggle(false));

  // dialog
  const [show, setShowDialog] = useState(false);
  const [onOk, setOnOk] = useState(null);
  const [onCancel, setOnCancel] = useState(null);
  const [message, setMessage] = useState('');

  function mouseHoverList() {
    setMenuHover((state) => !state);
  }

  function mouseHoverItem(ref) {
    setMenuWidth(ref.current.offsetWidth);
    setMenuLeft(ref.current.offsetLeft);
  }

  function mobilenav_toggle() {
    setMobileToggle((t) => !t);
  }

  const validate = () => {
    let valid = true;
    setEmailValid(true);
    setPasswordValid(true);

    // email
    if (!validateEmail(email)) {
      setEmailValid(false);
      valid = false;
    }

    // password
    if (password.length <= 0) {
      setPasswordValid(false);
      valid = false;
    }

    if (session) {
      if (session.user.firstAccess) {
        if (!validatePasswordLength(password)) {
          setPasswordValid(false);
          setLogErrorMessage('a senha tem q ter pelo menos 6 caracteres');
          return false;
        }
        if (!validatePasswordStrength(password)) {
          setPasswordValid(false);
          setLogErrorMessage('a senha tem q ter letras e números');
          return false;
        }
        if (password !== passwordConf) {
          setPasswordValid(false);
          setLogErrorMessage('as senhas precisam ser iguais');
          return false;
        }
      }
    }

    return valid;
  };

  async function login(event) {
    if (event) event.preventDefault();
    setLoading(true);
    setOnOk(() => () => setShowDialog(false));
    if (validate()) {
      let response;
      if (session && session.user.firstAccess) {
        response = await fetch('/api/auth/first_access/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: session.user.email,
            newPassword: password,
          }),
        });
      } else {
        response = await signin('credentials', {
          redirect: false,
          email: email,
          password: password,
        });
      }
      switch (response.status) {
        case 200:
          if (response.error) {
            if (
              response.error === 'Not found' ||
              response.error === 'Incorrect password'
            ) {
              setMessage('Endereço de email ou senha incorretos.');
              setShowDialog(true);
            } else {
              setMessage(
                'Ops, algo deu errado. Por favor, tente daqui a pouquinho!'
              );
              setShowDialog(true);
            }
          }
          break;
        case 201:
          session.user.firstAccess = false;
          break;
        default:
          setMessage(
            'Ops, algo deu errado. Por favor, tente daqui a pouquinho!'
          );
          setShowDialog(true);
          break;
      }
    }
    setLoading(false);
  }

  async function logout(event) {
    if (event) event.preventDefault();
    signOut();
  }

  const openDrawer = async () => {
    if (session) {
      if (session.user.perms === 'adm') {
        router.push({ pathname: '/acesso' });
      } else {
        setLogToggle(false);
        setLoading(true);
        if (projects.length === 0) {
          const projs = await getUserProjects();
          if (!projs) {
            setMessage(
              'Opa, estamos com um probleminha. Por favor, tente mais tarde.'
            );
            setOnCancel(null);
            setOnOk(() => () => logout());
            setShowDialog(true);
            setLoading(false);
            return;
          }
        }
        setEmail(session.user.email);
        setPassword('');
        setPasswordConf('');
        setOpenRepo((v) => !v);
        setLoading(false);
      }
    } else {
      setEmailValid(true);
      setPasswordValid(true);
      setLogToggle((v) => !v);
    }
  };

  const setActiveProject = (project) => {
    setActiveProj(project);
  };

  const getUserProjects = async () => {
    if (!session.user.email) return false;
    const res = await fetch(`/api/project?email=${session.user.email}`);
    const data = await res.json();
    if (data.projects) {
      setProjects(data.projects);
      setActiveProj(data.projects[0]);
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (projects.length === 0 && session && logToggle) {
      openDrawer();
    }
  });

  // file upload
  const [files, setFiles] = useState([]);
  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    if (fileRejections.length > 0) {
      setMessage(
        'Erro: os arquivos precisam ter no máximo 1Mb de tamanho cada.'
      );
      setOnOk(() => () => setShowDialog(false));
      setShowDialog(true);
    } else {
      setFiles(acceptedFiles);
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 1000000,
  });

  const cancelFiles = () => {
    setFiles([]);
  };

  const sendFiles = async () => {
    setOnCancel(null);
    setOnOk(() => () => setShowDialog(false));
    if (files.length === 0) {
      setMessage('Nenhum arquivo selecionado.');
      setShowDialog(true);
      return;
    }
    setLoading(true);
    const method = 'POST';

    const proms = [];
    files.forEach((file) => {
      const formData = new FormData();
      formData.append('projId', activeProj._id);
      formData.append('file', file);
      proms.push(
        fetch('/api/files/setFile', {
          method: method,
          headers: { 
            'project-id': activeProj._id,
            'client-email': session.user.email
          },
          body: formData,
        })
      );
    });

    const allFetch = Promise.all(proms);

    try {
      const results = await allFetch;
      const datas = [];
      const error = false;
      results.forEach((result) => {
        if (result.status === 201) datas.push(result.json());
        else error = true;
      });
      Promise.all(datas)
        .then((saves) => {
          const fileList = [...activeProj.files];
          saves.forEach((save) => {
            if (save.statusCode === '201') {
              fileList.push(save.project.newFile);
            }
          });
          setFiles([]);
          setActiveProj(prj => ({ ...prj, files: fileList }));
          if (error) {
            setMessage(
              'Alguns arquivos não foram salvos pois contêm erros. Por favor, verifique a lista de arquivos.'
            );
            setShowDialog(true);
          }
        })
        .catch(() => {
          setMessage(
            'Ops, algo deu errado. Por favor, atualize a página e tente daqui a pouquinho!'
          );
          setShowDialog(true);
        });
    } catch (err) {
      setMessage(
        'Ops, algo deu errado. Alguns arquivos não foram salvos pois contêm erros. Por favor, verifique a lista de arquivos.'
      );
      // setOnOk(() => () => reload());
      setShowDialog(true);
    }
    setLoading(false);
  };

  const deleteFile = async (fileId, index) => {
    setLoading(true);
    let method = 'DELETE';

    const data = await fetch('/api/files/removeFile', {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projId: activeProj._id,
        fileId: fileId,
      }),
    });
    switch (data.status) {
      case 201:
        const files = [...activeProj.files];
        files.splice(index, 1);
        setActiveProj((prj) => ({
          ...prj,
          files: files,
        }));
        setProjects((prjs) => {
          const newList = [...prjs];
          newList[newList.findIndex((p) => p._id === activeProj._id)].files =
            files;
          return newList;
        });
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

  const getFile = async (event, key) => {
    if (event) event.preventDefault();
    const data = await fetch(`/api/files/${activeProj._id}/${key}`);
    const result = await data.json();
    window.open(result.url);
  };

  function recoverPass() {
    setMessage(
      'Esqueceu sua senha? Iremos lhe enviar um email para recuperação de senha.'
    );
    setOnOk(() => () => recover());
    setOnCancel(() => () => setShowDialog(false));
    setShowDialog(true);
  }

  async function recover() {
    setEmailValid(true);
    if (!validateEmail(email)) {
      setEmailValid(false);
      setMessage('Por favor, preencha o campo email corretamente.');
      setOnOk(() => () => setShowDialog(false));
      setOnCancel(null);
      setShowDialog(true);
      return;
    }
    setLoading(true);
    setOnOk(null);
    setOnCancel(null);
    setMessage('Por favor, aguarde....');
    const local = await fetch('https://geolocation-db.com/json/');
    const location = await local.json();
    const response = await fetch('/api/recover', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, log: location }),
    });
    switch (response.status) {
      case 201:
        setMessage(
          'O email foi enviado. Por favor, cheque sua caixa de mensagens.'
        );
        break;
      case 404:
        setMessage(
          'Este email não está cadastrado. Por favor, tente outro endereço ou entre em contato conosco pelo telefone.'
        );
        break;
      default:
        setMessage(
          'Ops, estamos com um probleminha. Por favor, tente mais tarde.'
        );
        break;
    }
    setOnOk(() => () => setShowDialog(false));
    setLoading(false);
  }

  return (
    <nav className={styles.container}>
      <div className={styles.content}>
        <div className={styles.mobilenav_icontoggle} onClick={mobilenav_toggle}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            className={styles.mobilenav__icon}
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
            />
          </svg>
        </div>
        <div
          className={[
            styles.mobilenav__menu,
            mobileToggle ? styles.mobileOn : '',
          ]
            .join(' ')
            .trim()}
        >
          <ul>
            <li>
              <Link href={{ pathname: '/' }} passHref>
                <a>home</a>
              </Link>
            </li>
            <li>
              <Link href={{ pathname: '/galeria' }} passHref>
                <a>Galeria</a>
              </Link>
            </li>
            <li>
              <Link href={{ pathname: '/contato' }} passHref>
                <a>Contato</a>
              </Link>
            </li>
          </ul>
        </div>
        <ul
          className={styles.webmenu}
          onMouseEnter={mouseHoverList}
          onMouseLeave={mouseHoverList}
        >
          <li
            ref={menuItemOne}
            onMouseEnter={mouseHoverItem.bind(this, menuItemOne)}
          >
            <Link href={{ pathname: '/' }} passHref>
              <a>home</a>
            </Link>
          </li>
          <li
            ref={menuItemTwo}
            onMouseEnter={mouseHoverItem.bind(this, menuItemTwo)}
          >
            <Link href={{ pathname: '/galeria' }} passHref>
              <a>Galeria</a>
            </Link>
          </li>
          <span
            className={styles.underline}
            style={{
              opacity: menuHover ? 1 : 0,
              width: menuWidth,
              left: menuLeft,
            }}
          />
          <li
            ref={menuItemThree}
            onMouseEnter={mouseHoverItem.bind(this, menuItemThree)}
          >
            <Link href={{ pathname: '/contato' }} passHref>
              <a>Contato</a>
            </Link>
          </li>
        </ul>
        <div className={styles.logbtn} onClick={() => openDrawer(null)}>
          {session ? 'Repositório' : 'Login'}
        </div>
        {mobileToggle && <Backdrop onDismiss={mobilenav_toggle} />}
        {logToggle && (
          <div className={styles.logBox} ref={logBox}>
            <form className={styles.logForm} onSubmit={login}>
              <input
                type="email"
                id="email"
                placeholder="email"
                onChange={(e) => setEmail(e.target.value)}
                className={emailValid ? '' : styles.invalid}
              />
              <input
                type="password"
                id="password"
                placeholder="senha"
                onChange={(e) => setPassword(e.target.value)}
                className={passwordValid ? '' : styles.invalid}
              />
              {loading ? (
                <>
                  <p>esqueci minha senha</p>
                  <div className={styles.btnStatic}>Carregando...</div>
                </>
              ) : (
                <>
                  <p onClick={recoverPass}>esqueci minha senha</p>
                  <Button
                    style="primary"
                    icon={loginIco}
                    className={styles.enter}
                  >
                    Entrar
                  </Button>
                </>
              )}
            </form>
          </div>
        )}
        <div
          className={[styles.repoBox, openRepo ? styles.repoOn : ''].join(' ')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            className={styles.leftIcon}
            viewBox="0 0 16 16"
            onClick={() => openDrawer(null)}
          >
            <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
          </svg>
          {openRepo && session && (
            <>
              {session.user.firstAccess ? (
                <div className={styles.firstAccess}>
                  <p>Olá! Muito obrigada por acessar minha plataforma!</p>
                  <p>
                    Como este é seu primeiro acesso, por favor, crie uma senha
                    para seu login
                  </p>
                  <p>{'=)'}</p>
                  <form className={styles.logForm} onSubmit={login}>
                    <input
                      type="email"
                      id="email"
                      placeholder="email"
                      onChange={(e) => setEmail(e.target.value)}
                      className={emailValid ? '' : styles.invalid}
                      value={email}
                      disabled
                    />
                    <input
                      type="password"
                      id="password"
                      placeholder="nova senha"
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                      className={passwordValid ? '' : styles.invalid}
                    />
                    <input
                      type="password"
                      id="passwordConf"
                      placeholder="confirmar senha"
                      onChange={(e) => setPasswordConf(e.target.value)}
                      className={passwordValid ? '' : styles.invalid}
                      value={passwordConf}
                    />
                    <p className={styles.error}>{logErrorMessage}</p>
                    {loading ? (
                      <div className={styles.btnStatic}>Carregando...</div>
                    ) : (
                      <Button
                        style="primary"
                        icon={loginIco}
                        className={styles.enter}
                      >
                        Entrar
                      </Button>
                    )}
                  </form>
                </div>
              ) : (
                <div>
                  <div className={styles.projectTabs}>
                    {projects.map((project, index) => (
                      <div
                        key={project._id}
                        onClick={() => setActiveProject(project)}
                        className={
                          project._id === activeProj?._id
                            ? styles.activeTab
                            : ''
                        }
                      >
                        {index + 1}
                      </div>
                    ))}
                    <div key="space"></div>
                  </div>
                  <form>
                    <p>Projeto: {activeProj?.name}</p>
                    <p>arquivos:</p>
                    <div className={styles.filesBox}>
                      {activeProj?.files.length > 0 ? (
                        activeProj?.files.map((file, index) => (
                          <div key={file.name}>
                            <p onClick={(e) => getFile(e, file.key)}>
                              {file.name}
                            </p>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              viewBox="0 0 16 16"
                              onClick={() => deleteFile(file._id, index)}
                            >
                              <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                            </svg>
                          </div>
                        ))
                      ) : (
                        <div className={styles.empty}>Vazio</div>
                      )}
                    </div>
                    <p>adicionar arquivos:</p>
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
                        <p>
                          Arraste os arquivos para cá, ou clique para
                          selecioná-los
                        </p>
                      )}
                    </div>
                    <div
                      className={[styles.filesBox, styles.filesBox2].join(' ')}
                    >
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
                  </form>
                </div>
              )}
            </>
          )}
          <p className={styles.logout} onClick={logout}>
            sair
          </p>
        </div>
      </div>
      <Dialog show={show} onOk={onOk} onCancel={onCancel}>
        {message}
      </Dialog>
      <Loading show={loading} />
    </nav>
  );
}
