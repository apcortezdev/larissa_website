import '../styles/globals.scss';
import { Provider } from 'next-auth/client';
import MainNav from '../components/UI/MainNav';
import Footer from '../components/UI/Footer';
import CookieWindow from '../components/UI/Cookies';
import { AppProvider } from '../context/appContext';

function MyApp({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <AppProvider>
        <MainNav />
        <Component {...pageProps} />
        <CookieWindow />
        <Footer />
      </AppProvider>
    </Provider>
  );
}

export default MyApp;
