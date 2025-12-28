// src/pages/appointments/AppointmentEdit.tsx
import { updateAppointmentSchema, type UpdateAppointmentFormData } from '@/schemas/appointment.schema';
import { appointmentsAPI } from '@/services/appointments.service';
import { AppointmentType } from '@/types/appointment.types';
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
    Spin
} from 'antd';
import dayjs from 'dayjs';
import { ArrowLeft, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

const { TextArea } = Input;

export const AppointmentEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['appointments', id],
    queryFn: () => appointmentsAPI.getById(id!),
    enabled: !!id,
  });

  const appointment = data?.data;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateAppointmentFormData>({
    resolver: zodResolver(updateAppointmentSchema),
  });

  useEffect(() => {
    if (appointment) {
      reset({
        appointmentDate: new Date(appointment.appointmentDate),
        startTime: appointment.startTime,
        duration: appointment.duration,
        type: appointment.type,
        symptoms: appointment.symptoms || '',
        notes: appointment.notes || '',
      });
    }
  }, [appointment, reset]);

  const onSubmit = async (data: UpdateAppointmentFormData) => {
    try {
      setLoading(true);
      const payload = {
        ...data,
        appointmentDate: data.appointmentDate ? dayjs(data.appointmentDate).format('YYYY-MM-DD') : undefined,
      };
      await appointmentsAPI.update(id!, payload);
      message.success('Appointment updated successfully');
      navigate(`/appointments/${id}`);
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to update appointment');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="space-y-6">
        <Alert message="Appointment Not Found" type="error" showIcon />
        <Button onClick={() => navigate('/appointments')}>Back</Button>
      </div>
    );
  }

  const canEdit = !['completed', 'cancelled'].includes(appointment.status);

  if (!canEdit) {
    return (
      <div className="space-y-6">
        <Alert
          message="Cannot Edit"
          description="This appointment cannot be edited because it is already completed or cancelled."
          type="warning"
          showIcon
        />
        <Button onClick={() => navigate(`/appointments/${id}`)}>Back to Details</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button icon={<ArrowLeft size={18} />} onClick={() => navigate(`/appointments/${id}`)} />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Appointment</h1>
          <p className="text-sm text-gray-500 mt-1">Update appointment details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <div className="space-y-6">
            <Alert
              message="Patient & Doctor Information"
              description={
                <div>
                  <strong>Patient:</strong> {appointment.patient?.firstName} {appointment.patient?.lastName}
                  <br />
                  <strong>Doctor:</strong> Dr. {appointment.doctor?.user?.firstName}{' '}
                  {appointment.doctor?.user?.lastName} ({appointment.doctor?.specialization})
                  <br />
                  <strong>Hospital:</strong> {appointment.hospital?.name}
                </div>
              }
              type="info"
              showIcon
              className="mb-4"
            />

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Appointment Date"
                  validateStatus={errors.appointmentDate ? 'error' : ''}
                  help={errors.appointmentDate?.message}
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
                        disabledDate={(current) => current && current < dayjs().startOf('day')}
                      />
                    )}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Start Time (HH:mm)"
                  validateStatus={errors.startTime ? 'error' : ''}
                  help={errors.startTime?.message}
                >
                  <Controller
                    name="startTime"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="09:00" size="large" />
                    )}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
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
              <Col span={12}>
                <Form.Item
                  label="Appointment Type"
                  validateStatus={errors.type ? 'error' : ''}
                  help={errors.type?.message}
                >
                  <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                      <Radio.Group {...field} size="large">
                        <Radio.Button value={AppointmentType.IN_PERSON}>In Person</Radio.Button>
                        <Radio.Button value={AppointmentType.VIDEO}>Video</Radio.Button>
                        <Radio.Button value={AppointmentType.PHONE}>Phone</Radio.Button>
                      </Radio.Group>
                    )}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Symptoms / Reason"
              validateStatus={errors.symptoms ? 'error' : ''}
              help={errors.symptoms?.message}
            >
              <Controller
                name="symptoms"
                control={control}
                render={({ field }) => (
                  <TextArea {...field} rows={4} placeholder="Symptoms..." maxLength={1000} showCount />
                )}
              />
            </Form.Item>

            <Form.Item
              label="Notes"
              validateStatus={errors.notes ? 'error' : ''}
              help={errors.notes?.message}
            >
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextArea {...field} rows={3} placeholder="Notes..." maxLength={500} showCount />
                )}
              />
            </Form.Item>

            <div className="flex justify-end gap-4">
              <Button size="large" onClick={() => navigate(`/appointments/${id}`)}>
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