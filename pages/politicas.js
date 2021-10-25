import Head from 'next/head';
import styles from '../styles/Politicas.module.scss';

export default function Galeria({ domain }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Larissa Paschoalotto</title>
        <meta
          name="description"
          content="Escritório de Arquitetura Larissa Paschoalotto"
        />
        <link rel="icon" href="/favicon.ico" />
        <link href={'http://localhost:3000/'} rel="canonical" />
      </Head>

      <main id="top" className={styles.main}>
        <article className={styles.content}>
          <p>Política de privacidade e segurança deste site:</p>
          <textarea
            defaultValue={`Esta Política de privacidade descreve como suas informações pessoais são coletadas, usadas e compartilhadas quando você visita o ${domain} ("o size").

SOBRE INFORMAÇÕES PESSOAIS QUE COLETAMOS
            
Não coletamos nenhuma informação pessoal dos visitantes que não tiverem acesso à uma conta no site. Utilizamos a tecnologia de COOKIES somente para manter a segurança dos usuários enquanto utilizam suas respectivas contas.
            
Clientes que possuem uma conta no site estão sujeitos à coleta de informações para manutenção da segurança de suas contas à cada acesso, incluindo informações de seus dispositivos, seu navegador da web, endereço de IP, fuso horário e localização geográfica.
            
SOBRE O USO DO REPOSITÓRIO ONLINE
            
Com o intuito de melhorar a comunicação e troca de documentos entre nossos arquitetos e seus clientes, mantemos um repositório online de cada projeto, disponível para acesso neste site através de uma conta pessoal disponível para cada cliente.
            
Cada cliente recebe as devidas credenciais e instruções de acesso à sua conta após a contratação de qualquer serviço de arquitetura prestado por Larissa Paschoaloltto ® Arquitetura.
            
COMO USAMOS SUAS INFORMAÇÕES PESSOAIS?
            
Todas as informações coletadas de usuário credenciados são utilizadas por este site para manter a segurança das informações trocadas entre os mesmos e o contratado.
            
Todas as informações coletadas pelo site e pelo serviço de repositório online, assim como todas as informações trocadas entre os arquitetos contratados e os clientes contratantes que utilizam este site são de cunho extritamente confidencial e qualquer acesso ilegal estará sujeito a todas as ações jurídicas cabíveis ao processo.
            
Nenhuma informação dos usuários contida ou utilizada neste site é compartilhada com terceiros. Porém, podemos estar sujeitos ao compartilhamento de suas Informações pessoais para cumprir com as leis e regulamentos cabíveis, para responder a uma intimação, mandado de busca ou outra solicitação legal de informações que recebermos, ou para proteger nossos direitos.
            
QUANTO À USO DE INFORMAÇÕES PARA PUBLICIDADE
            
Suas informações não serão, em momento algum, utilizadas por nós para fins publicitários de nossa parte nem de terceiros. Ao utilizar nossa página para entrar em contato conosco através do sistema embutido de envio de email da página ${domain}/contato também não acarreta nenhum tipo de coleta de dados além dos dados de contato fornecidos por você.
                      
SOBRE À EXCLUSÃO DOS DADOS
            
Você poderá entrar em contato com seu arquiteto à qualquer momento caso queira que suas informações sejam retiradas do site.

Ao utilizar este site, você aceita os termos de privacidade declarados acima.`}
          ></textarea>
        </article>
      </main>
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: {
      domain: process.env.APP_URL,
    },
  };
}
