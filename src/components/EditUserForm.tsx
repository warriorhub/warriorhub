'use client';

import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import swal from 'sweetalert';
import { yupResolver } from '@hookform/resolvers/yup';
import { User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { EditUserSchema } from '@/lib/validationSchemas';
import { editUser } from '@/lib/dbActions';

type EditUserData = {
  id: number;
  email: string;
  role: 'USER' | 'ORGANIZER' | 'ADMIN';
};

const EditUserForm = ({ user }: { user: User }) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditUserData>({
    resolver: yupResolver(EditUserSchema),
    defaultValues: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  });

  const onSubmit = async (data: EditUserData) => {
    try {
      await editUser(data);
      await swal('Success', 'User role has been updated', 'success', { timer: 1500 });
      router.push('/admin');
      router.refresh();
    } catch (err) {
      await swal('Error', 'Failed to update user role. Please try again.', 'error');
    }
  };

  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={5}>
          <Col className="text-center">
            <h2>Edit User</h2>
          </Col>
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <input type="hidden" {...register('id', { valueAsNumber: true })} />
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <input
                    type="text"
                    {...register('email')}
                    defaultValue={user.email}
                    disabled
                    className="form-control"
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Role</Form.Label>
                  <select
                    {...register('role')}
                    className={`form-control ${errors.role ? 'is-invalid' : ''}`}
                    defaultValue={user.role}
                  >
                    <option value="USER">USER</option>
                    <option value="ORGANIZER">ORGANIZER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                  <div className="invalid-feedback">{errors.role?.message}</div>
                </Form.Group>
                <Form.Group className="form-group">
                  <Row className="pt-3">
                    <Col>
                      <Button type="submit" variant="primary">
                        Submit
                      </Button>
                    </Col>
                    <Col>
                      <Button type="button" onClick={() => reset()} variant="warning" className="float-right">
                        Reset
                      </Button>
                    </Col>
                  </Row>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditUserForm;
