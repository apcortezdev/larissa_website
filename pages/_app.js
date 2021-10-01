import '../styles/globals.scss';
import { Provider } from 'next-auth/client';
import MainNav from '../components/UI/MainNav';
import Footer from '../components/UI/Footer';

function MyApp({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <MainNav />
      <Component {...pageProps} />
      <Footer />
    </Provider>
  );
}

export default MyApp;
