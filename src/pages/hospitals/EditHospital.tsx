// src/pages/hospitals/HospitalEdit.tsx
import { updateHospitalSchema, type UpdateHospitalFormData } from '@/schemas/Hospital.schema';
import { hospitalsAPI } from '@/services/hospitalService';
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
  Tag,
} from 'antd';
import { ArrowLeft, Building2, Mail, MapPin, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

const { TextArea } = Input;

const FACILITIES = [
  '24x7 Emergency',
  'ICU',
  'NICU',
  'PICU',
  'Operation Theatres',
  'Cardiac ICU',
  'Neuro ICU',
  'Cardiac Cathlab',
  'MRI',
  'CT Scan',
  'PET Scan',
  'Digital X-Ray',
  'Ultrasound',
  'Mammography',
  'Blood Bank',
  'Pharmacy',
  'Pathology Lab',
  'Dialysis Unit',
  'Physiotherapy',
  'Ambulance Service',
];

export const HospitalEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);

  const { data: hospitalData, isLoading: isLoadingHospital } = useQuery({
    queryKey: ['hospital', id],
    queryFn: () => hospitalsAPI.getById(id!),
    enabled: !!id,
  });

  const hospital = hospitalData?.data;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateHospitalFormData>({
    resolver: zodResolver(updateHospitalSchema),
  });

  useEffect(() => {
    if (hospital) {
      reset({
        name: hospital.name,
        type: hospital.type,
        email: hospital.email,
        phone: hospital.phone,
        address: hospital.address,
        city: hospital.city,
        state: hospital.state,
        pincode: hospital.pincode,
        latitude: hospital.latitude,
        longitude: hospital.longitude,
        website: hospital.website || '',
        description: hospital.description || '',
        totalBeds: hospital.totalBeds,
        isEmergency: hospital.isEmergency,
        is24x7: hospital.is24x7,
        commissionRate: hospital.commissionRate,
      });
      setSelectedFacilities(hospital.facilities || []);
    }
  }, [hospital, reset]);

  const onSubmit = async (data: UpdateHospitalFormData) => {
    try {
      setLoading(true);
      const payload = {
        ...data,
        type: data.type as any,
        facilities: selectedFacilities,
      };
      await hospitalsAPI.update(id!, payload);
      message.success('Hospital updated successfully');
      navigate(`/hospitals/${id}`);
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to update hospital');
    } finally {
      setLoading(false);
    }
  };

  if (isLoadingHospital) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spin size="large" />
      </div>
    );
  }

  if (!hospital) {
    return (
      <Card>
        <Alert
          message="Hospital Not Found"
          description="The hospital you're trying to edit does not exist."
          type="error"
          showIcon
        />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button icon={<ArrowLeft size={18} />} onClick={() => navigate(`/hospitals/${id}`)} />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Hospital</h1>
            <p className="text-sm text-gray-500 mt-1">{hospital.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Tag color={hospital.verified ? 'success' : 'warning'}>
            {hospital.verified ? 'Verified' : 'Not Verified'}
          </Tag>
          <Tag color={hospital.status === 'active' ? 'success' : 'default'} className="capitalize">
            {hospital.status}
          </Tag>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <Building2 size={20} className="text-primary-600" />
                Basic Information
              </h3>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Hospital Name"
                    validateStatus={errors.name ? 'error' : ''}
                    help={errors.name?.message}
                  >
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => <Input {...field} placeholder="Enter hospital name" size="large" />}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Hospital Type"
                    validateStatus={errors.type ? 'error' : ''}
                    help={errors.type?.message}
                  >
                    <Controller
                      name="type"
                      control={control}
                      render={({ field }) => (
                        <Select {...field} placeholder="Select hospital type" size="large">
                          <Select.Option value="hospital">Hospital</Select.Option>
                          <Select.Option value="clinic">Clinic</Select.Option>
                          <Select.Option value="diagnostic_center">Diagnostic Center</Select.Option>
                        </Select>
                      )}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="Description" validateStatus={errors.description ? 'error' : ''} help={errors.description?.message}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => <TextArea {...field} rows={4} placeholder="Enter hospital description" />}
                />
              </Form.Item>
            </div>

            <Divider />

            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <Mail size={20} className="text-primary-600" />
                Contact Information
              </h3>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Email" validateStatus={errors.email ? 'error' : ''} help={errors.email?.message}>
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => <Input {...field} placeholder="hospital@example.com" size="large" />}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Phone" validateStatus={errors.phone ? 'error' : ''} help={errors.phone?.message}>
                    <Controller
                      name="phone"
                      control={control}
                      render={({ field }) => <Input {...field} placeholder="+91XXXXXXXXXX" size="large" />}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="Website" validateStatus={errors.website ? 'error' : ''} help={errors.website?.message}>
                <Controller
                  name="website"
                  control={control}
                  render={({ field }) => <Input {...field} placeholder="https://example.com" size="large" />}
                />
              </Form.Item>
            </div>

            <Divider />

            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <MapPin size={20} className="text-primary-600" />
                Location Details
              </h3>
              <Form.Item label="Address" validateStatus={errors.address ? 'error' : ''} help={errors.address?.message}>
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => <TextArea {...field} rows={2} placeholder="Enter complete address" />}
                />
              </Form.Item>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="City" validateStatus={errors.city ? 'error' : ''} help={errors.city?.message}>
                    <Controller
                      name="city"
                      control={control}
                      render={({ field }) => <Input {...field} placeholder="Enter city" size="large" />}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="State" validateStatus={errors.state ? 'error' : ''} help={errors.state?.message}>
                    <Controller
                      name="state"
                      control={control}
                      render={({ field }) => <Input {...field} placeholder="Enter state" size="large" />}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Pincode" validateStatus={errors.pincode ? 'error' : ''} help={errors.pincode?.message}>
                    <Controller
                      name="pincode"
                      control={control}
                      render={({ field }) => <Input {...field} placeholder="XXXXXX" size="large" maxLength={6} />}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Latitude" validateStatus={errors.latitude ? 'error' : ''} help={errors.latitude?.message}>
                    <Controller
                      name="latitude"
                      control={control}
                      render={({ field }) => <InputNumber {...field} className="w-full" placeholder="19.0760" size="large" />}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Longitude" validateStatus={errors.longitude ? 'error' : ''} help={errors.longitude?.message}>
                    <Controller
                      name="longitude"
                      control={control}
                      render={({ field }) => <InputNumber {...field} className="w-full" placeholder="72.8777" size="large" />}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            <Divider />

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Facilities & Services</h3>
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {FACILITIES.map((facility) => (
                    <Tag.CheckableTag
                      key={facility}
                      checked={selectedFacilities.includes(facility)}
                      onChange={(checked) => {
                        if (checked) {
                          setSelectedFacilities([...selectedFacilities, facility]);
                        } else {
                          setSelectedFacilities(selectedFacilities.filter((f) => f !== facility));
                        }
                      }}
                      className="px-3 py-1 text-sm"
                    >
                      {facility}
                    </Tag.CheckableTag>
                  ))}
                </div>
              </div>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="Total Beds" validateStatus={errors.totalBeds ? 'error' : ''} help={errors.totalBeds?.message}>
                    <Controller
                      name="totalBeds"
                      control={control}
                      render={({ field }) => <InputNumber {...field} className="w-full" min={0} size="large" />}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Emergency Services">
                    <Controller
                      name="isEmergency"
                      control={control}
                      render={({ field }) => (
                        <Switch checked={field.value} onChange={field.onChange} checkedChildren="Yes" unCheckedChildren="No" />
                      )}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="24x7 Service">
                    <Controller
                      name="is24x7"
                      control={control}
                      render={({ field }) => (
                        <Switch checked={field.value} onChange={field.onChange} checkedChildren="Yes" unCheckedChildren="No" />
                      )}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            <Divider />

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Commission Rate (%)"
                  validateStatus={errors.commissionRate ? 'error' : ''}
                  help={errors.commissionRate?.message}
                >
                  <Controller
                    name="commissionRate"
                    control={control}
                    render={({ field }) => <InputNumber {...field} className="w-full" min={0} max={100} size="large" />}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Alert
              message="Note"
              description="Changes will be saved immediately. Make sure all information is correct before submitting."
              type="info"
              showIcon
              className="mb-4"
            />

            <div className="flex justify-end gap-4 pt-4">
              <Button size="large" onClick={() => navigate(`/hospitals/${id}`)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" icon={<Save size={18} />} size="large" loading={loading}>
                Save Changes
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
};