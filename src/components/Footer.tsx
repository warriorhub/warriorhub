import { Col, Container } from 'react-bootstrap';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer = () => (
  <footer className="mt-auto py-3 footer-dark">
    <Container>
      <Col className="text-center">
        The WarriorHub Project
        <br />
        University of Hawaii
        <br />
        Honolulu, HI 96822
        <br />
        <a href="https://warriorhub.github.io/">GitHub Project Page</a>
      </Col>
    </Container>
  </footer>
);

export default Footer;
