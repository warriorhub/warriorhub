'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { BoxArrowRight, Lock, PersonFill, PersonPlusFill } from 'react-bootstrap-icons';

const NavBar: React.FC = () => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';

  // Type assertion for role
  const role = (session?.user as { role?: string })?.role ?? 'USER';
  const currentUser = session?.user?.email ?? 'unknown@example.com';

  const pathName = usePathname();
  if (isLoading) return null;

  // Helper function to determine home page URL based on role
  const getHomeUrl = () => {
    if (!isAuthenticated) return '/';
    if (role === 'ADMIN') return '/admin';
    if (role === 'ORGANIZER') return '/organizer';
    return '/userhome';
  };

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
          style={{ fontSize: '1.5rem', fontWeight: '600', letterSpacing: '0.5px' }}
        >
          WarriorHub
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto justify-content-start">
            <Nav.Link
              href={getHomeUrl()}
              active={pathName === '/' || pathName === '/userhome' || (role === 'ADMIN' && pathName === '/admin')}
              className="text-white mx-2"
              style={{ fontSize: '1rem', fontWeight: '400' }}
            >
              Home
            </Nav.Link>
            <Nav.Link
              href="/search"
              active={pathName === '/search'}
              className="text-white mx-2"
              style={{ fontSize: '1rem', fontWeight: '400' }}
            >
              Search Events
            </Nav.Link>
            <Nav.Link
              href="/calendar"
              active={pathName === '/calendar'}
              className="text-white mx-2"
              style={{ fontSize: '1rem', fontWeight: '400' }}
            >
              Calendar
            </Nav.Link>
            <Nav.Link
              href="/contact"
              active={pathName === '/contact'}
              className="text-white mx-2"
              style={{ fontSize: '1rem', fontWeight: '400' }}
            >
              Help
            </Nav.Link>
            {isAuthenticated && (
              <Nav.Link
                href="/myevents"
                active={pathName === '/myevents'}
                className="text-white mx-2"
                style={{ fontSize: '1rem', fontWeight: '400' }}
              >
                My Events
              </Nav.Link>
            )}
            {isAuthenticated && role === 'ADMIN' && (
              <Nav.Link
                href="/admin/list-events"
                active={pathName === '/admin/list-events'}
                className="text-white mx-2"
                style={{ fontSize: '1rem', fontWeight: '400' }}
              >
                List Events
              </Nav.Link>
            )}
          </Nav>
          <Nav>
            {!isLoading && (
              isAuthenticated ? (
                <NavDropdown id="login-dropdown" title={currentUser} className="text-white">
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
                <NavDropdown id="login-dropdown" title="Login" className="text-white">
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
              )
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
