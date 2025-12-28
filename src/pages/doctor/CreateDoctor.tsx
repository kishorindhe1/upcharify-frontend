// src/pages/doctors/DoctorCreate.tsx - UPDATED VERSION
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  InputNumber,
  Divider,
  message,
  Alert,
  Spin,
} from 'antd';
import { ArrowLeft, Save, User, Award, DollarSign, FileText, UserPlus } from 'lucide-react';
import { createDoctorSchema, type CreateDoctorFormData } from '@/schemas/doctor.schema';
import { SPECIALIZATIONS } from '@/types/doctor.types';
import { doctorsAPI } from '@/services/doctor.service';
import { usersAPI } from '@/services/user.service';

const { TextArea } = Input;

export const DoctorCreate: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Fetch users with role 'doctor'
  const { data: usersData, isLoading: loadingUsers } = useQuery({
    queryKey: ['users', 'doctor'],
    queryFn: () => usersAPI.getByRole('doctor'),
  });

  const users = usersData?.data || [];

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateDoctorFormData>({
    resolver: zodResolver(createDoctorSchema),
    defaultValues: {
      experienceYears: 0,
      consultationFee: 500,
    },
  });

  const onSubmit = async (data: CreateDoctorFormData) => {
    try {
      setLoading(true);
      await doctorsAPI.create(data);
      message.success('Doctor created successfully');
      navigate('/doctors');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to create doctor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button icon={<ArrowLeft size={18} />} onClick={() => navigate('/doctors')} />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Doctor</h1>
          <p className="text-sm text-gray-500 mt-1">Create a new doctor profile</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <div className="space-y-6">
            {/* USER SELECTION WITH DROPDOWN */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <User size={20} className="text-primary-600" />
                User Selection
              </h3>
              <Alert
                message="Important"
                description={
                  <div className="space-y-2">
                    <p>Select a user account to link with this doctor profile.</p>
                    <p className="text-sm">
                      If you don't see the user, you need to{' '}
                      <Button
                        type="link"
                        size="small"
                        className="p-0 h-auto"
                        onClick={() => navigate('/users/create', { state: { returnTo: '/doctors/create' } })}
                        icon={<UserPlus size={14} />}
                      >
                        create a new user
                      </Button>{' '}
                      with role "Doctor" first.
                    </p>
                  </div>
                }
                type="info"
                showIcon
                className="mb-4"
              />
              <Form.Item
                label="Select User"
                validateStatus={errors.userId ? 'error' : ''}
                help={errors.userId?.message}
                required
              >
                <Controller
                  name="userId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      placeholder="Select a user"
                      size="large"
                      showSearch
                      loading={loadingUsers}
                      filterOption={(input, option) =>
                        (option?.label?.toString().toLowerCase() ?? '').includes(input.toLowerCase())
                      }
                      options={users.map((user: any) => ({
                        value: user.id,
                        label: `${user.firstName} ${user.lastName} - ${user.email || user.phone}`,
                      }))}
                      notFoundContent={
                        loadingUsers ? (
                          <div className="text-center py-4">
                            <Spin size="small" />
                          </div>
                        ) : (
                          <div className="text-center py-4 text-gray-500">
                            <p>No users found with doctor role</p>
                            <Button
                              type="link"
                              size="small"
                              onClick={() => navigate('/users/create')}
                              icon={<UserPlus size={14} />}
                            >
                              Create New User
                            </Button>
                          </div>
                        )
                      }
                    />
                  )}
                />
              </Form.Item>
            </div>

            <Divider />

            {/* PROFESSIONAL INFORMATION */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <Award size={20} className="text-primary-600" />
                Professional Information
              </h3>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="License Number"
                    validateStatus={errors.licenseNumber ? 'error' : ''}
                    help={errors.licenseNumber?.message}
                    required
                  >
                    <Controller
                      name="licenseNumber"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="e.g., MH/DOC/12345"
                          size="large"
                        />
                      )}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Specialization"
                    validateStatus={errors.specialization ? 'error' : ''}
                    help={errors.specialization?.message}
                    required
                  >
                    <Controller
                      name="specialization"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          placeholder="Select specialization"
                          size="large"
                          showSearch
                          filterOption={(input, option) =>
                            (option?.children as string)
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                        >
                          {SPECIALIZATIONS.map((spec) => (
                            <Select.Option key={spec} value={spec}>
                              {spec}
                            </Select.Option>
                          ))}
                        </Select>
                      )}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Qualification"
                    validateStatus={errors.qualification ? 'error' : ''}
                    help={errors.qualification?.message}
                  >
                    <Controller
                      name="qualification"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="e.g., MBBS, MD (Cardiology)"
                          size="large"
                        />
                      )}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Experience (Years)"
                    validateStatus={errors.experienceYears ? 'error' : ''}
                    help={errors.experienceYears?.message}
                  >
                    <Controller
                      name="experienceYears"
                      control={control}
                      render={({ field }) => (
                        <InputNumber
                          {...field}
                          className="w-full"
                          min={0}
                          max={50}
                          size="large"
                        />
                      )}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            <Divider />

            {/* CONSULTATION DETAILS */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <DollarSign size={20} className="text-primary-600" />
                Consultation Details
              </h3>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Consultation Fee (₹)"
                    validateStatus={errors.consultationFee ? 'error' : ''}
                    help={errors.consultationFee?.message}
                  >
                    <Controller
                      name="consultationFee"
                      control={control}
                      render={({ field }) => (
                        <InputNumber
                          {...field}
                          className="w-full"
                          min={0}
                          max={100000}
                          size="large"
                          formatter={(value) =>
                            `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                          }
                          parser={(value) => value!.replace(/₹\s?|(,*)/g, '') as any}
                        />
                      )}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            <Divider />

            {/* PROFESSIONAL BIO */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <FileText size={20} className="text-primary-600" />
                Professional Bio
              </h3>
              <Form.Item
                label="Bio"
                validateStatus={errors.bio ? 'error' : ''}
                help={errors.bio?.message}
              >
                <Controller
                  name="bio"
                  control={control}
                  render={({ field }) => (
                    <TextArea
                      {...field}
                      rows={4}
                      placeholder="Professional background, expertise, achievements..."
                      maxLength={1000}
                      showCount
                    />
                  )}
                />
              </Form.Item>
            </div>

            <Alert
              message="Note"
              description="The doctor profile will be created in 'pending' status and require verification before becoming active."
              type="warning"
              showIcon
              className="mb-4"
            />

            <div className="flex justify-end gap-4 pt-4">
              <Button size="large" onClick={() => navigate('/doctors')}>
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<Save size={18} />}
                size="large"
                loading={loading}
              >
                Create Doctor
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
};