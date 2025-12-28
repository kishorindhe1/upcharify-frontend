// src/pages/appointments/AppointmentCreate.tsx
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import {
    Alert,
    Button,
    Card,
    Col,
    DatePicker,
    Form,
    Input,
    InputNumber,
    message,
    Radio,
    Row,
    Select,
    Spin,
    Steps
} from 'antd';
import dayjs from 'dayjs';
import { ArrowLeft, Calendar, FileText, Save, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { createAppointmentSchema, type CreateAppointmentFormData } from '@/schemas/appointment.schema';
import { appointmentsAPI } from '@/services/appointments.service';
import { doctorsAPI } from '@/services/doctor.service';
import { hospitalsAPI } from '@/services/hospitalService';
import { usersAPI } from '@/services/user.service';
import { AppointmentType } from '@/types/appointment.types';
import { DoctorStatus } from '@/types/doctor.types';
import { HospitalStatus } from '@/types/hospital.types';

const { TextArea } = Input;

export const AppointmentCreate: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [selectedHospital, setSelectedHospital] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);

  // Fetch patients
  const { data: patientsData, isLoading: loadingPatients } = useQuery({
    queryKey: ['users', 'patient'],
    queryFn: () => usersAPI.getByRole('patient'),
  });

  // Fetch doctors
  const { data: doctorsData, isLoading: loadingDoctors } = useQuery({
    queryKey: ['doctors', 'list'],
    queryFn: () => doctorsAPI.list({ limit: 100, status: DoctorStatus.ACTIVE }),
  });

  // Fetch hospitals
  const { data: hospitalsData, isLoading: loadingHospitals } = useQuery({
    queryKey: ['hospitals', 'list'],
    queryFn: () => hospitalsAPI.list({ limit: 100, status: HospitalStatus.ACTIVE }),
  });

  // Fetch availability when doctor, hospital, and date are selected
  const { data: availabilityData, isLoading: loadingAvailability } = useQuery({
    queryKey: ['availability', selectedDoctor, selectedHospital, selectedDate?.format('YYYY-MM-DD')],
    queryFn: () =>
      appointmentsAPI.getDoctorAvailability(
        selectedDoctor,
        selectedHospital,
        selectedDate!.format('YYYY-MM-DD')
      ),
    enabled: !!selectedDoctor && !!selectedHospital && !!selectedDate,
  });

  const patients = patientsData?.data || [];
  const doctors = doctorsData?.doctors || [];
  const hospitals = hospitalsData?.data?.hospitals || [];
  const availableSlots = availabilityData?.data?.slots || [];

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateAppointmentFormData>({
    resolver: zodResolver(createAppointmentSchema),
    defaultValues: {
      type: AppointmentType.IN_PERSON,
      duration: 30,
    },
  });

  const watchedDoctorId = watch('doctorId');
  const watchedHospitalId = watch('hospitalId');
  const watchedDate = watch('appointmentDate');

  // Update local state when form values change
  useEffect(() => {
    if (watchedDoctorId) setSelectedDoctor(watchedDoctorId);
  }, [watchedDoctorId]);

  useEffect(() => {
    if (watchedHospitalId) setSelectedHospital(watchedHospitalId);
  }, [watchedHospitalId]);

  useEffect(() => {
    if (watchedDate) setSelectedDate(dayjs(watchedDate));
  }, [watchedDate]);

  const onSubmit = async (data: CreateAppointmentFormData) => {
    try {
      setLoading(true);
      
      const payload = {
        ...data,
        appointmentDate: dayjs(data.appointmentDate).format('YYYY-MM-DD'),
      };

      await appointmentsAPI.create(payload);
      message.success('Appointment booked successfully');
      navigate('/appointments');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { title: 'Patient & Doctor', icon: <User size={20} /> },
    { title: 'Date & Time', icon: <Calendar size={20} /> },
    { title: 'Details', icon: <FileText size={20} /> },
  ];

  const canProceedToStep = (step: number) => {
    const patientId = watch('patientId');
    const doctorId = watch('doctorId');
    const hospitalId = watch('hospitalId');
    const appointmentDate = watch('appointmentDate');
    const startTime = watch('startTime');

    if (step === 1) {
      return patientId && doctorId && hospitalId;
    }
    if (step === 2) {
      return appointmentDate && startTime;
    }
    return true;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button icon={<ArrowLeft size={18} />} onClick={() => navigate('/appointments')} />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Book New Appointment</h1>
          <p className="text-sm text-gray-500 mt-1">Schedule a consultation</p>
        </div>
      </div>

      {/* Steps */}
      <Card>
        <Steps current={currentStep} items={steps} />
      </Card>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: Patient & Doctor Selection */}
        {currentStep === 0 && (
          <Card>
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Select Patient & Doctor</h3>
              
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    label="Patient"
                    validateStatus={errors.patientId ? 'error' : ''}
                    help={errors.patientId?.message}
                    required
                  >
                    <Controller
                      name="patientId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          placeholder="Select patient"
                          size="large"
                          showSearch
                          loading={loadingPatients}
                          filterOption={(input, option) =>
                            (option?.label?.toString().toLowerCase() ?? '').includes(input.toLowerCase())
                          }
                          options={patients.map((patient: any) => ({
                            value: patient.id,
                            label: `${patient.firstName} ${patient.lastName} - ${patient.phone}`,
                          }))}
                        />
                      )}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Doctor"
                    validateStatus={errors.doctorId ? 'error' : ''}
                    help={errors.doctorId?.message}
                    required
                  >
                    <Controller
                      name="doctorId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          placeholder="Select doctor"
                          size="large"
                          showSearch
                          loading={loadingDoctors}
                          filterOption={(input, option) =>
                            (option?.label?.toString().toLowerCase() ?? '').includes(input.toLowerCase())
                          }
                          options={doctors.map((doctor: any) => ({
                            value: doctor.id,
                            label: `Dr. ${doctor.user?.firstName} ${doctor.user?.lastName} - ${doctor.specialization}`,
                          }))}
                        />
                      )}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Hospital"
                    validateStatus={errors.hospitalId ? 'error' : ''}
                    help={errors.hospitalId?.message}
                    required
                  >
                    <Controller
                      name="hospitalId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          placeholder="Select hospital"
                          size="large"
                          showSearch
                          loading={loadingHospitals}
                          filterOption={(input, option) =>
                            (option?.label?.toString().toLowerCase() ?? '').includes(input.toLowerCase())
                          }
                          options={hospitals.map((hospital: any) => ({
                            value: hospital.id,
                            label: `${hospital.name} - ${hospital.city}`,
                          }))}
                        />
                      )}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <div className="flex justify-end">
                <Button
                  type="primary"
                  size="large"
                  onClick={() => setCurrentStep(1)}
                  disabled={!canProceedToStep(1)}
                >
                  Next: Date & Time
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Step 2: Date & Time Selection */}
        {currentStep === 1 && (
          <Card>
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Choose Date & Time</h3>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Appointment Date"
                    validateStatus={errors.appointmentDate ? 'error' : ''}
                    help={errors.appointmentDate?.message}
                    required
                  >
                    <Controller
                      name="appointmentDate"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          value={field.value ? dayjs(field.value) : null}
                          onChange={(date) => field.onChange(date?.toDate())}
                          size="large"
                          className="w-full"
                          format="DD/MM/YYYY"
                          disabledDate={(current) =>
                            current && current < dayjs().startOf('day')
                          }
                        />
                      )}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Duration (minutes)"
                    validateStatus={errors.duration ? 'error' : ''}
                    help={errors.duration?.message}
                  >
                    <Controller
                      name="duration"
                      control={control}
                      render={({ field }) => (
                        <InputNumber
                          {...field}
                          className="w-full"
                          min={15}
                          max={240}
                          step={15}
                          size="large"
                        />
                      )}
                    />
                  </Form.Item>
                </Col>
              </Row>

              {loadingAvailability && (
                <div className="text-center py-4">
                  <Spin tip="Loading available slots..." />
                </div>
              )}

              {!loadingAvailability && availableSlots.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Time Slots *
                  </label>
                  <Controller
                    name="startTime"
                    control={control}
                    render={({ field }) => (
                      <div className="grid grid-cols-6 gap-2">
                        {availableSlots
                          .filter(slot => slot.available)
                          .map((slot) => (
                            <Button
                              key={slot.startTime}
                              type={field.value === slot.startTime ? 'primary' : 'default'}
                              onClick={() => field.onChange(slot.startTime)}
                              className="w-full"
                            >
                              {slot.startTime}
                            </Button>
                          ))}
                      </div>
                    )}
                  />
                  {errors.startTime && (
                    <div className="text-red-500 text-sm mt-1">{errors.startTime.message}</div>
                  )}
                </div>
              )}

              {!loadingAvailability && selectedDate && selectedDoctor && selectedHospital && availableSlots.length === 0 && (
                <Alert
                  message="No Available Slots"
                  description="There are no available slots for the selected date. Please choose another date."
                  type="warning"
                  showIcon
                />
              )}

              <div className="flex justify-between">
                <Button size="large" onClick={() => setCurrentStep(0)}>
                  Previous
                </Button>
                <Button
                  type="primary"
                  size="large"
                  onClick={() => setCurrentStep(2)}
                  disabled={!canProceedToStep(2)}
                >
                  Next: Details
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Step 3: Appointment Details */}
        {currentStep === 2 && (
          <Card>
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Appointment Details</h3>
              
              <Form.Item
                label="Appointment Type"
                validateStatus={errors.type ? 'error' : ''}
                help={errors.type?.message}
                required
              >
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Radio.Group {...field} size="large">
                      <Radio.Button value={AppointmentType.IN_PERSON}>In Person</Radio.Button>
                      <Radio.Button value={AppointmentType.VIDEO}>Video Call</Radio.Button>
                      <Radio.Button value={AppointmentType.PHONE}>Phone Call</Radio.Button>
                    </Radio.Group>
                  )}
                />
              </Form.Item>

              <Form.Item
                label="Symptoms / Reason for Visit"
                validateStatus={errors.symptoms ? 'error' : ''}
                help={errors.symptoms?.message}
              >
                <Controller
                  name="symptoms"
                  control={control}
                  render={({ field }) => (
                    <TextArea
                      {...field}
                      rows={4}
                      placeholder="Describe symptoms or reason for appointment..."
                      maxLength={1000}
                      showCount
                    />
                  )}
                />
              </Form.Item>

              <Form.Item
                label="Additional Notes"
                validateStatus={errors.notes ? 'error' : ''}
                help={errors.notes?.message}
              >
                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <TextArea
                      {...field}
                      rows={3}
                      placeholder="Any additional information..."
                      maxLength={500}
                      showCount
                    />
                  )}
                />
              </Form.Item>

              <Alert
                message="Confirmation Required"
                description="After booking, the appointment will be in 'Scheduled' status and will need to be confirmed by the hospital or doctor."
                type="info"
                showIcon
              />

              <div className="flex justify-between">
                <Button size="large" onClick={() => setCurrentStep(1)}>
                  Previous
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<Save size={18} />}
                  size="large"
                  loading={loading}
                >
                  Book Appointment
                </Button>
              </div>
            </div>
          </Card>
        )}
      </form>
    </div>
  );
};