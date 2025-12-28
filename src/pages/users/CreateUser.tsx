// src/pages/users/UserCreate.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
  Alert,
} from 'antd';
import { ArrowLeft, Save, User as UserIcon, Mail, Phone, Lock } from 'lucide-react';
import dayjs from 'dayjs';
import { CreateUserFormData, createUserSchema } from '@/schemas/user.schema';
import { Gender, UserRole } from '@/types/user.types';
import { usersAPI } from '@/services/user.service';

export const UserCreate: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      role: UserRole.PATIENT,
    },
  });

  const selectedRole = watch('role');
  const requiresAuth = selectedRole !== UserRole.PATIENT;

  const onSubmit = async (data: CreateUserFormData) => {
    try {
      setLoading(true);
      
      // Format date
      const payload = {
        ...data,
        dateOfBirth: data.dateOfBirth ? dayjs(data.dateOfBirth).format('YYYY-MM-DD') : undefined,
        gender: data.gender === null ? undefined : data.gender,
        hospitalId: data.hospitalId === null ? undefined : data.hospitalId,
      };

      await usersAPI.create(payload);
      message.success('User created successfully');
      navigate('/users');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button icon={<ArrowLeft size={18} />} onClick={() => navigate('/users')} />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New User</h1>
          <p className="text-sm text-gray-500 mt-1">Create a new user account</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <div className="space-y-6">
            {/* Role Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <UserIcon size={20} className="text-primary-600" />
                User Type
              </h3>
              <Form.Item
                label="Role"
                validateStatus={errors.role ? 'error' : ''}
                help={errors.role?.message}
                required
              >
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} size="large" placeholder="Select role">
                      <Select.Option value={UserRole.PATIENT}>Patient</Select.Option>
                      <Select.Option value={UserRole.DOCTOR}>Doctor</Select.Option>
                      <Select.Option value={UserRole.HOSPITAL_ADMIN}>Hospital Admin</Select.Option>
                      <Select.Option value={UserRole.SUPER_ADMIN}>Super Admin</Select.Option>
                    </Select>
                  )}
                />
              </Form.Item>

              {requiresAuth && (
                <Alert
                  message="Authentication Required"
                  description="Doctors, Hospital Admins, and Super Admins require email and password for login."
                  type="info"
                  showIcon
                  className="mb-4"
                />
              )}
            </div>

            <Divider />

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
                    required={requiresAuth}
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

            {/* Password (only for non-patients) */}
            {requiresAuth && (
              <>
                <Divider />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                    <Lock size={20} className="text-primary-600" />
                    Security
                  </h3>
                  <Form.Item
                    label="Password"
                    validateStatus={errors.password ? 'error' : ''}
                    help={errors.password?.message}
                    required
                  >
                    <Controller
                      name="password"
                      control={control}
                      render={({ field }) => (
                        <Input.Password
                          {...field}
                          placeholder="Enter password"
                          size="large"
                        />
                      )}
                    />
                  </Form.Item>
                  <Alert
                    message="Password Requirements"
                    description="At least 8 characters with uppercase, lowercase, number, and special character"
                    type="warning"
                    showIcon
                  />
                </div>
              </>
            )}

            <div className="flex justify-end gap-4 pt-4">
              <Button size="large" onClick={() => navigate('/users')}>
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<Save size={18} />}
                size="large"
                loading={loading}
              >
                Create User
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
};