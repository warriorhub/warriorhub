/* eslint-disable react/jsx-indent, @typescript-eslint/indent */

'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { BoxArrowRight, Lock, PersonFill, PersonPlusFill } from 'react-bootstrap-icons';

const NavBar: React.FC = () => {
  const { data: session } = useSession();
  const currentUser = session?.user?.email;
  const userWithRole = session?.user as { email: string; randomKey: string };
  const role = userWithRole?.randomKey;
  const pathName = usePathname();
  return (
    <Navbar
      expand="lg"
      className="navbar-dark"
      style={{
        backgroundColor: '#024731',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <Container>
        <Navbar.Brand
          href="/"
          className="text-white"
          style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            letterSpacing: '0.5px',
          }}
        >
          WarriorHub
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto justify-content-start">
            <Nav.Link
              id="home-nav"
              href="/"
              key="home"
              active={pathName === '/'}
              className="text-white mx-2"
              style={{ fontSize: '1rem', fontWeight: '400' }}
            >
              Home
            </Nav.Link>
            <Nav.Link
              id="search-events-nav"
              href="/search"
              key="search"
              active={pathName === '/search'}
              className="text-white mx-2"
              style={{ fontSize: '1rem', fontWeight: '400' }}
            >
              Search Events
            </Nav.Link>
            <Nav.Link
              id="help-nav"
              href="/contact"
              key="contact"
              active={pathName === '/contact'}
              className="text-white mx-2"
              style={{ fontSize: '1rem', fontWeight: '400' }}
            >
              Help
            </Nav.Link>
            {currentUser && (
              <Nav.Link
                id="my-events-nav"
                href="/myevents"
                key="myevents"
                active={pathName === '/myevents'}
                className="text-white mx-2"
                style={{ fontSize: '1rem', fontWeight: '400' }}
              >
                My Events
              </Nav.Link>
            )}
            {currentUser && role === 'ADMIN' && (
              <Nav.Link
                id="admin-stuff-nav"
                href="/admin"
                key="admin"
                active={pathName === '/admin'}
                className="text-white mx-2"
                style={{ fontSize: '1rem', fontWeight: '400' }}
              >
                Admin
              </Nav.Link>
            )}
          </Nav>
          <Nav>
            {session ? (
              <NavDropdown id="login-dropdown" title={currentUser} className="text-white">
                <NavDropdown.Item id="login-dropdown-sign-out" href="/api/auth/signout">
                  <BoxArrowRight />
                   Sign Out
                </NavDropdown.Item>
                <NavDropdown.Item id="login-dropdown-change-password" href="/auth/change-password">
                  <Lock />
                   Change Password
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <NavDropdown id="login-dropdown" title="Login" className="text-white">
                <NavDropdown.Item id="login-dropdown-sign-in" href="/auth/signin">
                  <PersonFill />
                   Sign in
                </NavDropdown.Item>
                <NavDropdown.Item id="login-dropdown-sign-up" href="/auth/signup">
                  <PersonPlusFill />
                   Sign up
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
