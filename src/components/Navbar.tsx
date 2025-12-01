'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import {
  BoxArrowRight,
  Lock,
  PersonFill,
  PersonPlusFill,
} from 'react-bootstrap-icons';

const NavBar: React.FC = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';

  // Safely extract role/email ONLY when authenticated
  const role = isAuthenticated
    ? (session?.user as { role?: string })?.role
    : undefined;

  const email = isAuthenticated ? session?.user?.email : undefined;

  const getHomeUrl = () => {
    if (!isAuthenticated) return '/';
    if (role === 'ADMIN') return '/admin';
    if (role === 'ORGANIZER') return '/organizer';
    return '/userhome';
  };

  // 🔥 Show minimal safe layout while loading (prevents hydration errors)
  if (isLoading) {
    return (
      <Navbar
        expand="lg"
        className="navbar-dark"
        style={{ backgroundColor: '#024731' }}
      >
        <Container>
          <Navbar.Brand className="text-white">WarriorHub</Navbar.Brand>
        </Container>
      </Navbar>
    );
  }

  return (
    <Navbar
      expand="lg"
      className="navbar-dark"
      style={{
        backgroundColor: '#024731',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
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

        <Navbar.Toggle aria-controls="navbar" />
        <Navbar.Collapse id="navbar">
          <Nav className="me-auto">
            <Nav.Link
              href={getHomeUrl()}
              active={pathname === '/' || pathname === '/userhome'}
              className="text-white mx-2"
            >
              Home
            </Nav.Link>

            <Nav.Link
              href="/search"
              active={pathname === '/search'}
              className="text-white mx-2"
            >
              Search Events
            </Nav.Link>

            <Nav.Link
              href="/calendar"
              active={pathname === '/calendar'}
              className="text-white mx-2"
            >
              Calendar
            </Nav.Link>

            <Nav.Link
              href="/contact"
              active={pathname === '/contact'}
              className="text-white mx-2"
            >
              Help
            </Nav.Link>

            {isAuthenticated && (
              <Nav.Link
                href="/myevents"
                active={pathname === '/myevents'}
                className="text-white mx-2"
              >
                My Events
              </Nav.Link>
            )}

            {isAuthenticated && role === 'ADMIN' && (
              <Nav.Link
                href="/admin/list-events"
                active={pathname === '/admin/list-events'}
                className="text-white mx-2"
              >
                List Events
              </Nav.Link>
            )}
          </Nav>

          <Nav>
            {isAuthenticated ? (
              <NavDropdown
                id="dropdown"
                title={email || 'Account'} // prevents hydration issues
                className="text-white"
              >
                <NavDropdown.Item href="/api/auth/signout">
                  <BoxArrowRight />
                  {' '}
                  Sign Out
                </NavDropdown.Item>

                <NavDropdown.Item href="/auth/change-password">
                  <Lock />
                  {' '}
                  Change Password
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <NavDropdown id="dropdown" title="Login" className="text-white">
                <NavDropdown.Item href="/auth/signin">
                  <PersonFill />
                  {' '}
                  Sign in
                </NavDropdown.Item>

                <NavDropdown.Item href="/auth/signup">
                  <PersonPlusFill />
                  {' '}
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
