import { createContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

export const AppContext = createContext();

export function AppProvider(props) {
  const [cookies, setCookies, removeCookies] = useCookies([]);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const acceptCookies = () => {
    setCookies(
      '@larissa:access',
      { access: 'visitor' },
      {
        sameSite: 'strict',
      }
    );
    setShowPrivacy(false);
  };

  const rejectCookies = () => {
    removeCookies('@larissa:access', {
      sameSite: 'strict',
    });
    setShowPrivacy(false);
  };

  useEffect(() => {
    if (cookies) {
      if (!cookies['@larissa:access']) {
        setShowPrivacy(true);
      }
    }
  }, []);

  return (
    <AppContext.Provider value={{ showPrivacy, acceptCookies, rejectCookies }}>
      {props.children}
    </AppContext.Provider>
  );
}
