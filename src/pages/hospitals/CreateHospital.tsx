// src/pages/hospitals/HospitalCreate.tsx
import { hospitalsAPI } from '@/services/hospitalService';
import { createHospitalSchema, type CreateHospitalFormData } from '@/schemas/Hospital.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Button,
    Card,
    Col,
    Collapse,
    Divider,
    Form,
    Input,
    InputNumber,
    message,
    Row,
    Select,
    Switch,
    Tag
} from 'antd';
import { ArrowLeft, Building2, Mail, MapPin, Save } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;
const { Panel } = Collapse;

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

export const HospitalCreate: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateHospitalFormData>({
    resolver: zodResolver(createHospitalSchema),
    defaultValues: {
      country: 'India',
      isEmergency: false,
      is24x7: false,
      commissionRate: 12,
    },
  });

  const onSubmit = async (data: CreateHospitalFormData) => {
    try {
      setLoading(true);
      // Ensure the type is cast to HospitalType
      const payload = {
        ...data,
        facilities: selectedFacilities,
        type: data.type as any, // Replace 'any' with 'HospitalType' if imported
      };
      await hospitalsAPI.create(payload);
      message.success('Hospital created successfully');
      navigate('/hospitals');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to create hospital');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button icon={<ArrowLeft size={18} />} onClick={() => navigate('/hospitals')} />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Hospital</h1>
            <p className="text-sm text-gray-500 mt-1">Create a new hospital in the system</p>
          </div>
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
                    required
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
                    required
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
                  <Form.Item label="Email" validateStatus={errors.email ? 'error' : ''} help={errors.email?.message} required>
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => <Input {...field} placeholder="hospital@example.com" size="large" />}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Phone" validateStatus={errors.phone ? 'error' : ''} help={errors.phone?.message} required>
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
              <Form.Item label="Address" validateStatus={errors.address ? 'error' : ''} help={errors.address?.message} required>
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => <TextArea {...field} rows={2} placeholder="Enter complete address" />}
                />
              </Form.Item>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="City" validateStatus={errors.city ? 'error' : ''} help={errors.city?.message} required>
                    <Controller
                      name="city"
                      control={control}
                      render={({ field }) => <Input {...field} placeholder="Enter city" size="large" />}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="State" validateStatus={errors.state ? 'error' : ''} help={errors.state?.message} required>
                    <Controller
                      name="state"
                      control={control}
                      render={({ field }) => <Input {...field} placeholder="Enter state" size="large" />}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Pincode" validateStatus={errors.pincode ? 'error' : ''} help={errors.pincode?.message} required>
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

            <Collapse>
              <Panel header="Hospital Admin Details (Optional)" key="admin">
                <div className="space-y-4">
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label="Admin Email"
                        validateStatus={errors.adminEmail ? 'error' : ''}
                        help={errors.adminEmail?.message}
                      >
                        <Controller
                          name="adminEmail"
                          control={control}
                          render={({ field }) => <Input {...field} placeholder="admin@example.com" size="large" />}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Admin Phone"
                        validateStatus={errors.adminPhone ? 'error' : ''}
                        help={errors.adminPhone?.message}
                      >
                        <Controller
                          name="adminPhone"
                          control={control}
                          render={({ field }) => <Input {...field} placeholder="+91XXXXXXXXXX" size="large" />}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label="First Name"
                        validateStatus={errors.adminFirstName ? 'error' : ''}
                        help={errors.adminFirstName?.message}
                      >
                        <Controller
                          name="adminFirstName"
                          control={control}
                          render={({ field }) => <Input {...field} placeholder="Enter first name" size="large" />}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Last Name"
                        validateStatus={errors.adminLastName ? 'error' : ''}
                        help={errors.adminLastName?.message}
                      >
                        <Controller
                          name="adminLastName"
                          control={control}
                          render={({ field }) => <Input {...field} placeholder="Enter last name" size="large" />}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    label="Password"
                    validateStatus={errors.adminPassword ? 'error' : ''}
                    help={errors.adminPassword?.message}
                  >
                    <Controller
                      name="adminPassword"
                      control={control}
                      render={({ field }) => <Input.Password {...field} placeholder="Enter password" size="large" />}
                    />
                  </Form.Item>
                </div>
              </Panel>
            </Collapse>

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

            <div className="flex justify-end gap-4 pt-4">
              <Button size="large" onClick={() => navigate('/hospitals')}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" icon={<Save size={18} />} size="large" loading={loading}>
                Create Hospital
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
};