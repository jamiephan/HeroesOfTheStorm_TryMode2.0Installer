import { Container } from 'react-bootstrap';
import './App.css';
import Main from './components/Main';
import NavBar from './components/NavBar';
import { Provider as GlobalContextProvider } from './context/GlobalContext';

export default function App() {
  return (
    <GlobalContextProvider>
      <NavBar />
      <Container>
        <Main />
      </Container>
    </GlobalContextProvider>
  );
}
