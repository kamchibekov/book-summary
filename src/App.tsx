import React, { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { defaultTheme, Provider, ProgressCircle, Flex } from '@adobe/react-spectrum';
import { BrowserRouter, useNavigate, Routes, Route } from 'react-router-dom';
import { getAuth, User } from "firebase/auth"
import RegisterPage from "./pages/register"
import Dashboard from "./pages/dashboard"
import URL from './routes';

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = getAuth().onAuthStateChanged((user) => {
      // If user is authenticated, the 'user' parameter will contain user information
      // Otherwise, it will be null
      setUser(user);
      setLoading(false);
    });

    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, []);
  return (
    <Provider theme={defaultTheme} router={{ navigate }} height="100vh">
      {loading ?
        <Flex direction="column" height="100vh" justifyContent="center" alignItems="center">
          <ProgressCircle aria-label="Loading…" isIndeterminate size="L" />
        </Flex>
        :
        <Routes>
          <Route path={URL.Register} element={<RegisterPage user={user} />} />
          <Route path={URL.Dashboard} element={<Dashboard user={user} />} />
        </Routes>}
    </Provider>
  );
}

const rootElement = document.getElementById('root') || document.createElement('div');
const root = createRoot(rootElement);

root.render(<BrowserRouter>
  <StrictMode>
    <App />
  </StrictMode>
</BrowserRouter>);