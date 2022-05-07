import { useContext } from 'react';
import { Navbar, Nav, NavDropdown, Container, Button } from 'react-bootstrap';
import GlobalContext from 'renderer/context/GlobalContext';
import logoImage from '../../../assets/icon.png';
import OpenFolderButton from './OpenFolderButton';
import CloseAppButton from './shared/CloseAppButton';
import ElectronLink from './shared/ElectronLink';

export default function NavBar() {
  const { state } = useContext(GlobalContext);

  return (
    <Navbar
      bg="dark"
      variant="dark"
      style={{ '-webkit-app-region': 'drag' }}
      className="navbar"
    >
      <Container>
        <Navbar.Brand>
          <div className="d-inline-block align-top logo-image" />
          {state?.settings?.appName
            ? state?.settings?.appName
            : 'Try Mode 2.0 Installer'}
        </Navbar.Brand>
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <NavDropdown
              title="Links"
              id="navbarScrollingDropdown"
              style={{ '-webkit-app-region': 'no-drag' }}
              menuVariant="dark"
            >
              <NavDropdown.Item
                href="#"
                onClick={() =>
                  window.open(
                    'https://github.com/jamiephan/HeroesOfTheStorm_TryMode2.0Installer',
                    '_blank'
                  )
                }
              >
                Source Code
              </NavDropdown.Item>
              <NavDropdown.Item
                href="#"
                onClick={() =>
                  window.open(
                    'https://github.com/jamiephan/HeroesOfTheStorm_TryMode2.0Installer/releases/latest',
                    '_blank'
                  )
                }
              >
                Get latest version
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item
                href="#"
                onClick={() =>
                  window.open('https://github.com/jamiephan', '_blank')
                }
              >
                My GitHub
              </NavDropdown.Item>
              <NavDropdown.Item
                href="#"
                onClick={() => window.open('https://jamiephan.net', '_blank')}
              >
                My Website
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          {state?.settings?.heroesPath && (
            <OpenFolderButton
              style={{ '-webkit-app-region': 'no-drag', marginRight: '10px' }}
              path={state?.settings?.heroesPath}
            >
              Open Heroes Folder
            </OpenFolderButton>
          )}
          <CloseAppButton style={{ '-webkit-app-region': 'no-drag' }}>
            Close
          </CloseAppButton>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
