// src/pages/appointments/AppointmentList.tsx
import { appointmentsAPI } from '@/services/appointments.service';
import {
    AppointmentStatus,
    AppointmentType,
    PaymentStatus,
    type Appointment
} from '@/types/appointment.types';
import { useQuery } from '@tanstack/react-query';
import type { MenuProps } from 'antd';
import {
    Avatar,
    Button,
    Card,
    Col,
    Dropdown,
    Input,
    message,
    Modal,
    Row,
    Select,
    Space,
    Statistic,
    Table,
    Tag,
} from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import dayjs from 'dayjs';
import {
    Activity,
    Calendar,
    CalendarCheck,
    Check,
    Clock,
    DollarSign,
    Edit,
    Eye,
    MoreVertical,
    Phone,
    Plus,
    Search,
    User,
    Video,
    X,
} from 'lucide-react';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { useNavigate } from 'react-router-dom';

const { confirm } = Modal;

export const AppointmentList: React.FC = () => {
  const navigate = useNavigate();
  
  const [queryParams, setQueryParams] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(10),
    search: parseAsString.withDefault(''),
    status: parseAsString.withDefault(''),
    type: parseAsString.withDefault(''),
    paymentStatus: parseAsString.withDefault(''),
  });

  // Fetch appointments
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['appointments', queryParams],
    queryFn: () =>
      appointmentsAPI.list({
        ...queryParams,
        status: Object.values(AppointmentStatus).includes(queryParams.status as AppointmentStatus)
          ? (queryParams.status as AppointmentStatus)
          : undefined,
        type: Object.values(AppointmentType).includes(queryParams.type as AppointmentType)
          ? (queryParams.type as AppointmentType)
          : undefined,
        paymentStatus: Object.values(PaymentStatus).includes(queryParams.paymentStatus as PaymentStatus)
          ? (queryParams.paymentStatus as PaymentStatus)
          : undefined,
      }),
  });

  // Fetch statistics
  const { data: statsData } = useQuery({
    queryKey: ['appointments', 'stats'],
    queryFn: () => appointmentsAPI.getStats(),
  });

  const appointments = data?.data?.appointments || [];
  const pagination = data?.data?.pagination;
  const stats = statsData?.data;

  const handleCancel = (appointment: Appointment) => {
    confirm({
      title: 'Cancel Appointment',
      content: 'Are you sure you want to cancel this appointment?',
      okText: 'Yes, Cancel',
      okType: 'danger',
      onOk: async () => {
        try {
          await appointmentsAPI.cancel(appointment.id, {
            reason: 'Cancelled by admin',
            cancelledBy: 'admin',
          });
          message.success('Appointment cancelled successfully');
          refetch();
        } catch (error: any) {
          message.error(error.response?.data?.message || 'Failed to cancel appointment');
        }
      },
    });
  };

  const handleConfirm = async (id: string) => {
    try {
      await appointmentsAPI.confirm(id);
      message.success('Appointment confirmed');
      refetch();
    } catch (error: any) {
      message.error('Failed to confirm appointment');
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await appointmentsAPI.complete(id, {});
      message.success('Appointment marked as completed');
      refetch();
    } catch (error: any) {
      message.error('Failed to complete appointment');
    }
  };

  const getActionMenu = (appointment: Appointment): MenuProps['items'] => [
    {
      key: 'view',
      icon: <Eye size={16} />,
      label: 'View Details',
      onClick: () => navigate(`/appointments/${appointment.id}`),
    },
    {
      key: 'edit',
      icon: <Edit size={16} />,
      label: 'Edit',
      onClick: () => navigate(`/appointments/${appointment.id}/edit`),
      disabled: ['completed', 'cancelled'].includes(appointment.status),
    },
    {
      type: 'divider',
    },
    {
      key: 'confirm',
      icon: <Check size={16} />,
      label: 'Confirm',
      onClick: () => handleConfirm(appointment.id),
      disabled: appointment.status !== AppointmentStatus.SCHEDULED,
    },
    {
      key: 'complete',
      icon: <Check size={16} />,
      label: 'Mark Complete',
      onClick: () => handleComplete(appointment.id),
      disabled: !['confirmed', 'in_progress'].includes(appointment.status),
    },
    {
      type: 'divider',
    },
    {
      key: 'cancel',
      icon: <X size={16} />,
      label: 'Cancel',
      danger: true,
      onClick: () => handleCancel(appointment),
      disabled: ['completed', 'cancelled'].includes(appointment.status),
    },
  ];

  const getStatusConfig = (status: AppointmentStatus) => {
    const configs = {
      [AppointmentStatus.SCHEDULED]: { color: 'blue', label: 'Scheduled' },
      [AppointmentStatus.CONFIRMED]: { color: 'green', label: 'Confirmed' },
      [AppointmentStatus.IN_PROGRESS]: { color: 'purple', label: 'In Progress' },
      [AppointmentStatus.COMPLETED]: { color: 'success', label: 'Completed' },
      [AppointmentStatus.CANCELLED]: { color: 'error', label: 'Cancelled' },
      [AppointmentStatus.NO_SHOW]: { color: 'warning', label: 'No Show' },
      [AppointmentStatus.RESCHEDULED]: { color: 'orange', label: 'Rescheduled' },
    };
    return configs[status] || { color: 'default', label: status };
  };

  const getTypeIcon = (type: AppointmentType) => {
    switch (type) {
      case AppointmentType.VIDEO:
        return <Video size={14} />;
      case AppointmentType.PHONE:
        return <Phone size={14} />;
      default:
        return <User size={14} />;
    }
  };

  const columns: ColumnsType<Appointment> = [
    {
      title: 'Patient',
      key: 'patient',
      width: 200,
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar
            size={40}
            src={record.patient?.profilePicture}
            className="bg-gradient-to-r from-blue-500 to-purple-600"
            icon={<User size={20} />}
          />
          <div>
            <div className="font-medium text-gray-900">
              {record.patient?.firstName} {record.patient?.lastName}
            </div>
            <div className="text-xs text-gray-500">{record.patient?.phone}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Doctor',
      key: 'doctor',
      width: 200,
      render: (_, record) => (
        <div>
          <div className="font-medium text-gray-900">
            Dr. {record.doctor?.user?.firstName} {record.doctor?.user?.lastName}
          </div>
          <div className="text-xs text-gray-500">{record.doctor?.specialization}</div>
        </div>
      ),
    },
    {
      title: 'Date & Time',
      key: 'datetime',
      width: 180,
      render: (_, record) => (
        <div>
          <div className="flex items-center gap-2 text-sm font-medium">
            <Calendar size={14} className="text-gray-400" />
            {dayjs(record.appointmentDate).format('DD MMM YYYY')}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
            <Clock size={12} />
            {record.startTime} - {record.endTime}
          </div>
        </div>
      ),
      sorter: true,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: AppointmentType) => (
        <div className="flex items-center gap-2">
          {getTypeIcon(type)}
          <span className="capitalize text-sm">{type.replace('_', ' ')}</span>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: AppointmentStatus) => {
        const config = getStatusConfig(status);
        return <Tag color={config.color}>{config.label}</Tag>;
      },
    },
    {
      title: 'Payment',
      key: 'payment',
      width: 120,
      render: (_, record) => (
        <div>
          <div className="font-medium text-sm">₹{record.consultationFee}</div>
          <Tag
            color={
              record.paymentStatus === PaymentStatus.PAID
                ? 'success'
                : record.paymentStatus === PaymentStatus.FAILED
                ? 'error'
                : 'warning'
            }
            className="text-xs mt-1"
          >
            {record.paymentStatus}
          </Tag>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 80,
      fixed: 'right',
      render: (_, record) => (
        <Dropdown menu={{ items: getActionMenu(record) }} trigger={['click']}>
          <Button type="text" icon={<MoreVertical size={16} />} />
        </Dropdown>
      ),
    },
  ];

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setQueryParams({
      page: pagination.current || 1,
      limit: pagination.pageSize || 10,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all appointments</p>
        </div>
        <div className="flex gap-2">
          <Button
            icon={<Calendar size={18} />}
            onClick={() => navigate('/appointments/calendar')}
          >
            Calendar View
          </Button>
          <Button
            type="primary"
            icon={<Plus size={18} />}
            onClick={() => navigate('/appointments/create')}
            size="large"
          >
            Book Appointment
          </Button>
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <Row gutter={16}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Appointments"
                value={stats.totalAppointments}
                prefix={<CalendarCheck className="text-blue-500" size={20} />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Today"
                value={stats.todayAppointments}
                prefix={<Clock className="text-green-500" size={20} />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Upcoming"
                value={stats.upcomingAppointments}
                prefix={<Activity className="text-purple-500" size={20} />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Revenue (Collected)"
                value={stats.revenue.collected}
                prefix={<DollarSign className="text-orange-500" size={20} />}
                valueStyle={{ color: '#fa8c16' }}
                formatter={(value) => `₹${value}`}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Filters */}
      <Card>
        <Space className="w-full" direction="vertical" size="middle">
          <Row gutter={16}>
            <Col xs={24} sm={12} md={6}>
              <Input
                placeholder="Search patient/doctor"
                prefix={<Search size={16} />}
                value={queryParams.search}
                onChange={(e) => setQueryParams({ search: e.target.value, page: 1 })}
                allowClear
                size="large"
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                placeholder="Filter by status"
                value={queryParams.status || undefined}
                onChange={(value) => setQueryParams({ status: value || '', page: 1 })}
                allowClear
                size="large"
                className="w-full"
              >
                <Select.Option value={AppointmentStatus.SCHEDULED}>Scheduled</Select.Option>
                <Select.Option value={AppointmentStatus.CONFIRMED}>Confirmed</Select.Option>
                <Select.Option value={AppointmentStatus.IN_PROGRESS}>In Progress</Select.Option>
                <Select.Option value={AppointmentStatus.COMPLETED}>Completed</Select.Option>
                <Select.Option value={AppointmentStatus.CANCELLED}>Cancelled</Select.Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                placeholder="Filter by type"
                value={queryParams.type || undefined}
                onChange={(value) => setQueryParams({ type: value || '', page: 1 })}
                allowClear
                size="large"
                className="w-full"
              >
                <Select.Option value={AppointmentType.IN_PERSON}>In Person</Select.Option>
                <Select.Option value={AppointmentType.VIDEO}>Video</Select.Option>
                <Select.Option value={AppointmentType.PHONE}>Phone</Select.Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                placeholder="Payment status"
                value={queryParams.paymentStatus || undefined}
                onChange={(value) => setQueryParams({ paymentStatus: value || '', page: 1 })}
                allowClear
                size="large"
                className="w-full"
              >
                <Select.Option value={PaymentStatus.PENDING}>Pending</Select.Option>
                <Select.Option value={PaymentStatus.PAID}>Paid</Select.Option>
                <Select.Option value={PaymentStatus.FAILED}>Failed</Select.Option>
              </Select>
            </Col>
          </Row>
        </Space>
      </Card>

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={appointments}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: pagination?.page || 1,
            pageSize: pagination?.limit || 10,
            total: pagination?.total || 0,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} appointments`,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          onChange={handleTableChange}
          scroll={{ x: 1400 }}
        />
      </Card>
    </div>
  );
};