import { User } from '@prisma/client';
import Link from 'next/link';

/* Renders a single row in the User Admin table. See list/page.tsx. */
const UserItemAdmin = ({ organization, id, email, role }: User) => (
  <tr>
    <td>{organization ?? 'N/A'}</td>
    <td>{email}</td>
    <td>{role}</td>
    <td>
      <Link href={`/admin/edit/${id}`}>Edit</Link>
    </td>
  </tr>
);

export default UserItemAdmin;
