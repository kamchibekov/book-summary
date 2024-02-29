import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { defaultTheme, Provider, ProgressCircle, Flex, InlineAlert, Heading, Content } from '@adobe/react-spectrum';
import { BrowserRouter, useNavigate, Routes, Route } from 'react-router-dom';
import { getAuth, User } from "firebase/auth"
import RegisterPage from "./pages/register"
import Dashboard from "./pages/dashboard"
import URL from './routes';
import { ToastContainer } from '@react-spectrum/toast'

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

  // Font-family to consider - "Comic Sans MS", Impact, Handlee, fantasy
  // Opacity can be 0.9 to lower eye strain

  return (
    <Provider theme={defaultTheme} router={{ navigate }} height="100vh">
      <ToastContainer />

      {loading &&
        <Flex direction="column" height="100vh" justifyContent="center" alignItems="center">
          <ProgressCircle aria-label="Loading…" isIndeterminate size="L" />
        </Flex>}

      {!loading && <Routes>
        {<Route path={URL.Dashboard} element={user ? <Dashboard user={user} /> : <RegisterPage />} />}
      </Routes>}
    </Provider>
  );
}

/*
{<Flex direction="column" height="100vh" justifyContent="center" alignItems="center">
        <InlineAlert variant="negative">
          <Heading>Unable to process log in</Heading>
          <Content>
            There was an error logging you in. Please check that your account on google is verified and try again.
          </Content>
        </InlineAlert>
      </Flex>}
*/

const rootElement = document.getElementById('root') || document.createElement('div');
const root = createRoot(rootElement);

root.render(<BrowserRouter basename= "/book-summary">
  <App />
</BrowserRouter>);