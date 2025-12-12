import { getServerSession } from 'next-auth';
import { Col, Container, Row, Table } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import { adminProtectedPage } from '@/lib/page-protection';
import authOptions from '@/lib/authOptions';
import UserItemAdmin from '@/components/UserItemAdmin';

const AdminPage = async () => {
  const session = await getServerSession(authOptions);
  adminProtectedPage(
    session as {
      user: { email: string; id: string; randomKey: string };
    } | null,
  );

  const users = await prisma.user.findMany({});

  const admins = users.filter((u) => u.role === 'ADMIN');
  const organizers = users.filter((u) => u.role === 'ORGANIZER');
  const regularUsers = users.filter((u) => u.role === 'USER');

  const renderTable = (
    title: string,
    list: typeof users,
    headerLabel: string,
  ) => (
    <div className="mb-5">
      <h2 className="mb-3">{title}</h2>

      <Table striped bordered hover className="fixed-table">
        <thead>
          <tr>
            <th style={{ width: '30%' }}>{headerLabel}</th>
            <th style={{ width: '30%' }}>Email</th>
            <th style={{ width: '20%' }}>Role</th>
            <th style={{ width: '20%' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {list.map((user) => (
            <UserItemAdmin key={user.id} {...user} />
          ))}
        </tbody>
      </Table>
    </div>
  );

  return (
    <main>
      <Container id="list" fluid className="py-3">

        <h1 className="fw-bold text-center">Account List</h1>

        <Row>
          <Col>

            {/* Admin Table — custom header label */}
            {renderTable('Admins', admins, 'Admin')}

            {/* Organizer Table */}
            {renderTable('Organizers', organizers, 'Organization')}

            {/* User Table — custom header label */}
            {renderTable('Users', regularUsers, 'User')}

          </Col>
        </Row>
      </Container>

      {/* Force all tables to have equal column widths */}
      <style>
        {`
        .fixed-table th,
        .fixed-table td {
          width: 25%;
          white-space: nowrap;
        }
      `}
      </style>
    </main>
  );
};

export default AdminPage;
