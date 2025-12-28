// src/pages/doctors/DoctorEdit.tsx - UPDATED VERSION
import { updateDoctorSchema, type UpdateDoctorFormData } from '@/schemas/doctor.schema';
import { doctorsAPI } from '@/services/doctor.service';
import { SPECIALIZATIONS } from '@/types/doctor.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import {
  Alert,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Spin,
  Switch,
} from 'antd';
import { ArrowLeft, Award, DollarSign, FileText, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

const { TextArea } = Input;

export const DoctorEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Fetch doctor data
  const { data: doctorData, isLoading: loadingDoctor } = useQuery({
    queryKey: ['doctors', id],
    queryFn: () => doctorsAPI.getById(id!),
    enabled: !!id,
  });

  const doctor = doctorData;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateDoctorFormData>({
    resolver: zodResolver(updateDoctorSchema),
  });

  // Populate form when doctor data is loaded
  useEffect(() => {
    if (doctor) {
      reset({
        licenseNumber: doctor.licenseNumber,
        specialization: doctor.specialization,
        qualification: doctor.qualification || '',
        experienceYears: doctor.experienceYears || 0,
        consultationFee: doctor.consultationFee || 0,
        bio: doctor.bio || '',
        available: doctor.available,
      });
    }
  }, [doctor, reset]);

  const onSubmit = async (data: UpdateDoctorFormData) => {
    try {
      setLoading(true);
      await doctorsAPI.update(id!, data);
      message.success('Doctor updated successfully');
      navigate(`/doctors/${id}`);
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to update doctor');
    } finally {
      setLoading(false);
    }
  };

  if (loadingDoctor) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" tip="Loading doctor..." />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="space-y-6">
        <Alert
          message="Doctor Not Found"
          description="The doctor you're looking for doesn't exist."
          type="error"
          showIcon
        />
        <Button onClick={() => navigate('/doctors')}>Back to Doctors</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button icon={<ArrowLeft size={18} />} onClick={() => navigate(`/doctors/${id}`)} />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Edit Doctor: {doctor.user?.firstName} {doctor.user?.lastName}
          </h1>
          <p className="text-sm text-gray-500 mt-1">Update doctor information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <div className="space-y-6">
            {/* User Info (Read-only) */}
            <Alert
              message="Linked User Account"
              description={
                <div>
                  <strong>User:</strong> {doctor.user?.firstName} {doctor.user?.lastName}
                  <br />
                  <strong>Email:</strong> {doctor.user?.email || 'N/A'}
                  <br />
                  <strong>Phone:</strong> {doctor.user?.phone}
                  <br />
                  <span className="text-xs text-gray-500 mt-2 block">
                    Note: User account cannot be changed. To update user details, go to User Management.
                  </span>
                </div>
              }
              type="info"
              showIcon
              className="mb-4"
            />

            {/* Verification Status */}
            {!doctor.verified && (
              <Alert
                message="Verification Pending"
                description="This doctor profile is pending verification. It will become active after admin approval."
                type="warning"
                showIcon
                className="mb-4"
              />
            )}

            {/* Professional Information */}
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

            {/* Consultation Details */}
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
                <Col span={12}>
                  <Form.Item
                    label="Availability"
                    validateStatus={errors.available ? 'error' : ''}
                    help={errors.available?.message}
                  >
                    <Controller
                      name="available"
                      control={control}
                      render={({ field }) => (
                        <div className="flex items-center gap-3 h-10">
                          <Switch
                            checked={field.value}
                            onChange={field.onChange}
                            size="default"
                          />
                          <span className="text-sm text-gray-600">
                            {field.value ? 'Available for appointments' : 'Not available'}
                          </span>
                        </div>
                      )}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            <Divider />

            {/* Professional Bio */}
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

            {/* Performance Stats (Read-only) */}
            <Divider />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Performance Statistics
              </h3>
              <Row gutter={16}>
                <Col span={6}>
                  <Alert
                    message="Rating"
                    description={
                      <div className="text-2xl font-bold text-yellow-600">
                        {doctor.rating?.toFixed(1) || '0.0'} ⭐
                      </div>
                    }
                    type="info"
                  />
                </Col>
                <Col span={6}>
                  <Alert
                    message="Total Reviews"
                    description={
                      <div className="text-2xl font-bold text-blue-600">
                        {doctor.totalReviews || 0}
                      </div>
                    }
                    type="info"
                  />
                </Col>
                <Col span={6}>
                  <Alert
                    message="Verification"
                    description={
                      <div className="text-sm font-semibold">
                        {doctor.verified ? (
                          <span className="text-green-600">✓ Verified</span>
                        ) : (
                          <span className="text-orange-600">⏳ Pending</span>
                        )}
                      </div>
                    }
                    type="info"
                  />
                </Col>
                <Col span={6}>
                  <Alert
                    message="Status"
                    description={
                      <div className="text-sm font-semibold">
                        {doctor.status === 'active' && <span className="text-green-600">Active</span>}
                        {doctor.status === 'inactive' && <span className="text-gray-600">Inactive</span>}
                        {doctor.status === 'suspended' && <span className="text-red-600">Suspended</span>}
                        {doctor.status === 'pending' && <span className="text-orange-600">Pending</span>}
                      </div>
                    }
                    type="info"
                  />
                </Col>
              </Row>
              <p className="text-xs text-gray-500 mt-2">
                Note: Rating, reviews, verification status, and account status are managed separately.
              </p>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button size="large" onClick={() => navigate(`/doctors/${id}`)}>
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