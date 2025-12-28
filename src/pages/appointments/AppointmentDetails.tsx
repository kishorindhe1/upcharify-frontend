// src/pages/appointments/AppointmentDetails.tsx
import { appointmentsAPI } from '@/services/appointments.service';
import { AppointmentStatus, AppointmentType, PaymentStatus } from '@/types/appointment.types';
import { useQuery } from '@tanstack/react-query';
import {
    Alert,
    Avatar,
    Button,
    Card,
    Col,
    Descriptions,
    message,
    Modal,
    Row,
    Spin,
    Tag
} from 'antd';
import dayjs from 'dayjs';
import {
    ArrowLeft,
    Building,
    Calendar,
    Check,
    Clock,
    DollarSign,
    Edit,
    Phone,
    User,
    Video,
    X
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const { confirm } = Modal;

export const AppointmentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['appointments', id],
    queryFn: () => appointmentsAPI.getById(id!),
    enabled: !!id,
  });

  const appointment = data?.data;

  const handleConfirm = async () => {
    try {
      await appointmentsAPI.confirm(id!);
      message.success('Appointment confirmed');
      refetch();
    } catch (error: any) {
      message.error('Failed to confirm appointment');
    }
  };

  const handleComplete = () => {
    Modal.info({
      title: 'Complete Appointment',
      content: 'Navigate to edit page to add diagnosis and prescription',
      onOk: () => navigate(`/appointments/${id}/edit`),
    });
  };

  const handleCancel = () => {
    confirm({
      title: 'Cancel Appointment',
      content: 'Are you sure you want to cancel this appointment?',
      okText: 'Yes, Cancel',
      okType: 'danger',
      onOk: async () => {
        try {
          await appointmentsAPI.cancel(id!, {
            reason: 'Cancelled by admin',
            cancelledBy: 'admin',
          });
          message.success('Appointment cancelled');
          refetch();
        } catch (error: any) {
          message.error('Failed to cancel appointment');
        }
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" tip="Loading appointment..." />
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="space-y-6">
        <Alert message="Appointment Not Found" type="error" showIcon />
        <Button onClick={() => navigate('/appointments')}>Back to Appointments</Button>
      </div>
    );
  }

  const getStatusColor = (status: AppointmentStatus) => {
    const colors = {
      [AppointmentStatus.SCHEDULED]: 'blue',
      [AppointmentStatus.CONFIRMED]: 'green',
      [AppointmentStatus.IN_PROGRESS]: 'purple',
      [AppointmentStatus.COMPLETED]: 'success',
      [AppointmentStatus.CANCELLED]: 'error',
      [AppointmentStatus.NO_SHOW]: 'warning',
      [AppointmentStatus.RESCHEDULED]: 'orange',
    };
    return colors[status];
  };

  const getTypeIcon = (type: AppointmentType) => {
    switch (type) {
      case AppointmentType.VIDEO: return <Video size={16} />;
      case AppointmentType.PHONE: return <Phone size={16} />;
      default: return <Building size={16} />;
    }
  };

  const canEdit = !['completed', 'cancelled'].includes(appointment.status);
  const canConfirm = appointment.status === AppointmentStatus.SCHEDULED;
  const canComplete = ['confirmed', 'in_progress'].includes(appointment.status);
  const canCancel = !['completed', 'cancelled'].includes(appointment.status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button icon={<ArrowLeft size={18} />} onClick={() => navigate('/appointments')} />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Appointment Details</h1>
            <p className="text-sm text-gray-500 mt-1">View appointment information</p>
          </div>
        </div>
        <div className="flex gap-2">
          {canEdit && (
            <Button
              type="primary"
              icon={<Edit size={18} />}
              onClick={() => navigate(`/appointments/${id}/edit`)}
            >
              Edit
            </Button>
          )}
          {canConfirm && (
            <Button icon={<Check size={18} />} onClick={handleConfirm}>
              Confirm
            </Button>
          )}
          {canComplete && (
            <Button icon={<Check size={18} />} onClick={handleComplete}>
              Complete
            </Button>
          )}
          {canCancel && (
            <Button danger icon={<X size={18} />} onClick={handleCancel}>
              Cancel
            </Button>
          )}
        </div>
      </div>

      {/* Status & Type */}
      <Card>
        <Row gutter={16}>
          <Col span={8}>
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-2">Status</div>
              <Tag color={getStatusColor(appointment.status)} className="text-lg px-4 py-1">
                {appointment.status.toUpperCase()}
              </Tag>
            </div>
          </Col>
          <Col span={8}>
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-2">Type</div>
              <div className="flex items-center justify-center gap-2 text-lg">
                {getTypeIcon(appointment.type)}
                <span className="capitalize">{appointment.type.replace('_', ' ')}</span>
              </div>
            </div>
          </Col>
          <Col span={8}>
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-2">Payment</div>
              <Tag
                color={
                  appointment.paymentStatus === PaymentStatus.PAID
                    ? 'success'
                    : appointment.paymentStatus === PaymentStatus.FAILED
                    ? 'error'
                    : 'warning'
                }
                className="text-lg px-4 py-1"
              >
                ₹{appointment.consultationFee} - {appointment.paymentStatus}
              </Tag>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Patient, Doctor, Hospital Info */}
      <Row gutter={16}>
        <Col span={8}>
          <Card title="Patient Information">
            <div className="flex items-center gap-3 mb-4">
              <Avatar size={60} src={appointment.patient?.profilePicture} icon={<User size={24} />} />
              <div>
                <div className="font-semibold text-lg">
                  {appointment.patient?.firstName} {appointment.patient?.lastName}
                </div>
              </div>
            </div>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Phone">{appointment.patient?.phone}</Descriptions.Item>
              {appointment.patient?.email && (
                <Descriptions.Item label="Email">{appointment.patient?.email}</Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Doctor Information">
            <div className="flex items-center gap-3 mb-4">
              <Avatar
                size={60}
                src={appointment.doctor?.user?.profilePicture}
                icon={<User size={24} />}
              />
              <div>
                <div className="font-semibold text-lg">
                  Dr. {appointment.doctor?.user?.firstName} {appointment.doctor?.user?.lastName}
                </div>
                <div className="text-sm text-gray-500">{appointment.doctor?.specialization}</div>
              </div>
            </div>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Phone">{appointment.doctor?.user?.phone}</Descriptions.Item>
              {appointment.doctor?.user?.email && (
                <Descriptions.Item label="Email">{appointment.doctor?.user?.email}</Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Hospital Information">
            <div className="mb-4">
              <div className="font-semibold text-lg">{appointment.hospital?.name}</div>
              <div className="text-sm text-gray-500 mt-1">{appointment.hospital?.address}</div>
            </div>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Phone">{appointment.hospital?.phone}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>

      {/* Appointment Details */}
      <Card title="Appointment Details">
        <Descriptions column={2} bordered>
          <Descriptions.Item label="Appointment ID" span={2}>
            <code className="text-xs bg-gray-100 px-2 py-1 rounded">{appointment.id}</code>
          </Descriptions.Item>
          <Descriptions.Item label="Date">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              {dayjs(appointment.appointmentDate).format('DD MMMM YYYY')}
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="Time">
            <div className="flex items-center gap-2">
              <Clock size={16} />
              {appointment.startTime} - {appointment.endTime}
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="Duration">{appointment.duration} minutes</Descriptions.Item>
          <Descriptions.Item label="Consultation Fee">
            <div className="flex items-center gap-2">
              <DollarSign size={16} />
              ₹{appointment.consultationFee}
            </div>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Medical Information */}
      {(appointment.symptoms || appointment.diagnosis || appointment.prescription) && (
        <Card title="Medical Information">
          <Descriptions column={1} bordered>
            {appointment.symptoms && (
              <Descriptions.Item label="Symptoms">{appointment.symptoms}</Descriptions.Item>
            )}
            {appointment.diagnosis && (
              <Descriptions.Item label="Diagnosis">{appointment.diagnosis}</Descriptions.Item>
            )}
            {appointment.prescription && (
              <Descriptions.Item label="Prescription">{appointment.prescription}</Descriptions.Item>
            )}
            {appointment.notes && (
              <Descriptions.Item label="Notes">{appointment.notes}</Descriptions.Item>
            )}
          </Descriptions>
        </Card>
      )}

      {/* Cancellation Info */}
      {appointment.status === AppointmentStatus.CANCELLED && appointment.cancellationReason && (
        <Card title="Cancellation Information">
          <Alert
            message={`Cancelled by ${appointment.cancelledBy}`}
            description={appointment.cancellationReason}
            type="error"
            showIcon
          />
        </Card>
      )}
    </div>
  );
};