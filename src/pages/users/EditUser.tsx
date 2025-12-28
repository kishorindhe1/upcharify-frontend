// src/pages/users/UserEdit.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  DatePicker,
  Divider,
  message,
  Spin,
  Alert,
} from 'antd';
import { ArrowLeft, Save, User as UserIcon, Mail, Phone } from 'lucide-react';
import dayjs from 'dayjs';
import { updateUserSchema, type UpdateUserFormData } from '@/schemas/user.schema';
import { Gender } from '@/types/user.types';
import { usersAPI } from '@/services/user.service';

export const UserEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Fetch user data
  const { data: userData, isLoading: loadingUser } = useQuery({
    queryKey: ['users', id],
    queryFn: () => usersAPI.getById(id!),
    enabled: !!id,
  });

  const user = userData?.data;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
  });

  // Populate form when user data is loaded
  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email || '',
        phone: user.phone,
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : undefined,
        gender: user.gender || undefined,
        profilePicture: user.profilePicture || '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: UpdateUserFormData) => {
    try {
      setLoading(true);

      // Format date and ensure gender is never null
      const payload = {
        ...data,
        dateOfBirth: data.dateOfBirth ? dayjs(data.dateOfBirth).format('YYYY-MM-DD') : undefined,
        gender: data.gender === null ? undefined : data.gender,
        profilePicture: data.profilePicture === null ? undefined : data.profilePicture,
      };

      await usersAPI.update(id!, payload);
      message.success('User updated successfully');
      navigate(`/users/${id}`);
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  if (loadingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" tip="Loading user..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <Alert
          message="User Not Found"
          description="The user you're looking for doesn't exist."
          type="error"
          showIcon
        />
        <Button onClick={() => navigate('/users')}>Back to Users</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button icon={<ArrowLeft size={18} />} onClick={() => navigate(`/users/${id}`)} />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Edit User: {user.firstName} {user.lastName}
          </h1>
          <p className="text-sm text-gray-500 mt-1">Update user information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <div className="space-y-6">
            {/* User Role Info (Read-only) */}
            <Alert
              message="User Role"
              description={
                <div>
                  <strong>Role:</strong> {user.role.replace('_', ' ').toUpperCase()}
                  <br />
                  <span className="text-xs text-gray-500">
                    Note: User role cannot be changed. Email and password are managed separately.
                  </span>
                </div>
              }
              type="info"
              showIcon
              className="mb-4"
            />

            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Personal Information
              </h3>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="First Name"
                    validateStatus={errors.firstName ? 'error' : ''}
                    help={errors.firstName?.message}
                    required
                  >
                    <Controller
                      name="firstName"
                      control={control}
                      render={({ field }) => (
                        <Input {...field} placeholder="Enter first name" size="large" />
                      )}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Last Name"
                    validateStatus={errors.lastName ? 'error' : ''}
                    help={errors.lastName?.message}
                    required
                  >
                    <Controller
                      name="lastName"
                      control={control}
                      render={({ field }) => (
                        <Input {...field} placeholder="Enter last name" size="large" />
                      )}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Date of Birth"
                    validateStatus={errors.dateOfBirth ? 'error' : ''}
                    help={errors.dateOfBirth?.message}
                  >
                    <Controller
                      name="dateOfBirth"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          value={field.value ? dayjs(field.value) : null}
                          onChange={(date) => field.onChange(date?.toDate())}
                          placeholder="Select date of birth"
                          size="large"
                          className="w-full"
                          format="DD/MM/YYYY"
                          disabledDate={(current) => current && current > dayjs().endOf('day')}
                        />
                      )}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Gender"
                    validateStatus={errors.gender ? 'error' : ''}
                    help={errors.gender?.message}
                  >
                    <Controller
                      name="gender"
                      control={control}
                      render={({ field }) => (
                        <Select {...field} placeholder="Select gender" size="large" allowClear>
                          <Select.Option value={Gender.MALE}>Male</Select.Option>
                          <Select.Option value={Gender.FEMALE}>Female</Select.Option>
                          <Select.Option value={Gender.OTHER}>Other</Select.Option>
                        </Select>
                      )}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            <Divider />

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <Phone size={20} className="text-primary-600" />
                Contact Information
              </h3>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Phone Number"
                    validateStatus={errors.phone ? 'error' : ''}
                    help={errors.phone?.message}
                    required
                  >
                    <Controller
                      name="phone"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="+91XXXXXXXXXX"
                          size="large"
                          prefix={<Phone size={16} />}
                        />
                      )}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Email"
                    validateStatus={errors.email ? 'error' : ''}
                    help={errors.email?.message}
                  >
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="email@example.com"
                          size="large"
                          prefix={<Mail size={16} />}
                        />
                      )}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            <Divider />

            {/* Profile Picture */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <UserIcon size={20} className="text-primary-600" />
                Profile Picture
              </h3>
              <Form.Item
                label="Profile Picture URL"
                validateStatus={errors.profilePicture ? 'error' : ''}
                help={errors.profilePicture?.message}
              >
                <Controller
                  name="profilePicture"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      placeholder="https://example.com/image.jpg"
                      size="large"
                    />
                  )}
                />
              </Form.Item>
              <Alert
                message="Profile Picture Upload"
                description="Direct file upload coming soon. For now, please provide an image URL."
                type="info"
                showIcon
                className="text-xs"
              />
            </div>

            {/* Verification Status (Read-only) */}
            <Divider />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Verification Status
              </h3>
              <Row gutter={16}>
                <Col span={12}>
                  <Alert
                    message="Email Verification"
                    description={user.emailVerified ? 'Email is verified ✓' : 'Email not verified ✗'}
                    type={user.emailVerified ? 'success' : 'warning'}
                    showIcon
                  />
                </Col>
                <Col span={12}>
                  <Alert
                    message="Phone Verification"
                    description={user.phoneVerified ? 'Phone is verified ✓' : 'Phone not verified ✗'}
                    type={user.phoneVerified ? 'success' : 'warning'}
                    showIcon
                  />
                </Col>
              </Row>
              <p className="text-xs text-gray-500 mt-2">
                Use the verification actions from the user details page or list page.
              </p>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button size="large" onClick={() => navigate(`/users/${id}`)}>
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<Save size={18} />}
                size="large"
                loading={loading}
                disabled={!isDirty}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
};