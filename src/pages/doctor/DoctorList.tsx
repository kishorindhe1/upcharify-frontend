// src/pages/doctors/DoctorList.tsx
import { doctorsAPI } from '@/services/doctor.service';
import type { Doctor, DoctorStatus } from '@/types/doctor.types';
import { SPECIALIZATIONS } from '@/types/doctor.types';
import { useQuery } from '@tanstack/react-query';
import type { MenuProps, TableProps } from 'antd';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Dropdown,
  Input,
  Modal,
  Row,
  Select,
  Statistic,
  Table,
  Tag,
  message
} from 'antd';
import {
  Ban,
  CheckCircle,
  Edit,
  Eye,
  MoreVertical,
  Plus,
  Search,
  Star,
  Trash2,
  TrendingUp,
  User,
  UserCheck,
  Users,
  XCircle,
} from 'lucide-react';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const { confirm } = Modal;

export const DoctorList: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  const [filters, setFilters] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(20),
    // search: parseAsString.withDefault(''),
    // specialization: parseAsString.withDefault(''),
    verified: parseAsString.withDefault(''),
    status: parseAsString.withDefault(''),
    available: parseAsString.withDefault(''),
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['doctors', filters],
    queryFn: () => doctorsAPI.list({
      ...filters,
      verified: filters.verified ? filters.verified === 'true' : undefined,
      available: filters.available ? filters.available === 'true' : undefined,
      status: filters.status
        ? (['active', 'inactive', 'suspended', 'pending'].includes(filters.status)
            ? (filters.status as DoctorStatus)
            : undefined)
        : undefined,
    }),
  });

  const doctors = data?.doctors || [];
  const pagination = data?.pagination;

  const handleDelete = (id: string, name: string) => {
    confirm({
      title: 'Delete Doctor',
      content: `Are you sure you want to delete Dr. ${name}? This action cannot be undone.`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      async onOk() {
        try {
          await doctorsAPI.delete(id);
          message.success('Doctor deleted successfully');
          refetch();
        } catch (error: any) {
          message.error(error.response?.data?.message || 'Failed to delete doctor');
        }
      },
    });
  };

  const handleVerify = async (id: string, name: string) => {
    try {
      await doctorsAPI.verify(id, { verified: true });
      message.success(`Dr. ${name} verified successfully`);
      refetch();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to verify doctor');
    }
  };

  const handleStatusChange = async (id: string, status: DoctorStatus, name: string) => {
    try {
      await doctorsAPI.updateStatus(id, { status });
      message.success(`Dr. ${name} status updated to ${status}`);
      refetch();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const getActionMenu = (record: Doctor): MenuProps['items'] => [
    {
      key: 'view',
      icon: <Eye size={16} />,
      label: 'View Details',
      onClick: () => navigate(`/doctors/${record.id}`),
    },
    {
      key: 'edit',
      icon: <Edit size={16} />,
      label: 'Edit',
      onClick: () => navigate(`/doctors/${record.id}/edit`),
    },
    {
      type: 'divider',
    },
    ...(!record.verified
      ? [
          {
            key: 'verify',
            icon: <CheckCircle size={16} />,
            label: 'Verify',
            onClick: () =>
              handleVerify(record.id, `${record.user?.firstName} ${record.user?.lastName}`),
          },
          {
            key: 'reject',
            icon: <XCircle size={16} />,
            label: 'Reject',
            onClick: () => navigate(`/doctors/${record.id}/reject`),
          },
        ]
      : []),
    ...(record.status === 'active'
      ? [
          {
            key: 'suspend',
            icon: <Ban size={16} />,
            label: 'Suspend',
            onClick: () =>
              handleStatusChange(record.id, 'suspended' as DoctorStatus, `${record.user?.firstName} ${record.user?.lastName}`),
          },
        ]
      : [
          {
            key: 'activate',
            icon: <CheckCircle size={16} />,
            label: 'Activate',
            onClick: () =>
              handleStatusChange(record.id, 'active' as DoctorStatus, `${record.user?.firstName} ${record.user?.lastName}`),
          },
        ]),
    {
      type: 'divider',
    },
    {
      key: 'delete',
      icon: <Trash2 size={16} />,
      label: 'Delete',
      danger: true,
      onClick: () =>
        handleDelete(record.id, `${record.user?.firstName} ${record.user?.lastName}`),
    },
  ];

  const columns: TableProps<Doctor>['columns'] = [
    {
      title: 'Doctor',
      key: 'doctor',
      fixed: 'left',
      width: 280,
      render: (_: any, record: Doctor) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={record.user?.profilePicture}
            icon={<User size={16} />}
            size={48}
            className="flex-shrink-0"
          />
          <div>
            <div className="font-medium text-gray-900 flex items-center gap-2">
              Dr. {record.user?.firstName} {record.user?.lastName}
              {record.verified && <CheckCircle size={14} className="text-green-600" />}
            </div>
            <div className="text-xs text-gray-500">{record.licenseNumber}</div>
            <div className="text-xs text-gray-600">{record.specialization}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Contact',
      key: 'contact',
      width: 200,
      render: (_: any, record: Doctor) => (
        <div className="space-y-1">
          <div className="text-sm text-gray-900">{record.user?.email || 'N/A'}</div>
          <div className="text-sm text-gray-600">{record.user?.phone}</div>
        </div>
      ),
    },
    {
      title: 'Experience',
      dataIndex: 'experienceYears',
      key: 'experienceYears',
      width: 100,
      align: 'center',
      render: (years: number) => (
        <span className="text-sm font-medium">{years || 0} yrs</span>
      ),
    },
    {
      title: 'Fee',
      dataIndex: 'consultationFee',
      key: 'consultationFee',
      width: 120,
      align: 'right',
      render: (fee: number) => (
        <span className="text-sm font-medium text-green-600">
          ₹{fee?.toLocaleString() || 0}
        </span>
      ),
    },
    {
      title: 'Rating',
      key: 'rating',
      width: 100,
      align: 'center',
      render: (_: any, record: Doctor) => (
        <div className="flex items-center justify-center gap-1">
          <Star size={14} className="text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-medium">{record.rating || '0.0'}</span>
          <span className="text-xs text-gray-500">({record.totalReviews || 0})</span>
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      width: 120,
      render: (_: any, record: Doctor) => (
        <div className="flex flex-col gap-1">
          <Tag
            color={
              record.status === 'active'
                ? 'success'
                : record.status === 'pending'
                ? 'warning'
                : record.status === 'suspended'
                ? 'error'
                : 'default'
            }
            className="capitalize w-fit"
          >
            {record.status}
          </Tag>
          {!record.verified && <Tag color="orange" className="w-fit">Unverified</Tag>}
          <Badge
            status={record.available ? 'success' : 'default'}
            text={record.available ? 'Available' : 'Unavailable'}
            className="text-xs"
          />
        </div>
      ),
    },
    {
      title: 'Joined',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 80,
      align: 'center',
      render: (_: any, record: Doctor) => (
        <Dropdown
          menu={{ items: getActionMenu(record) }}
          trigger={['click']}
          placement="bottomRight"
        >
          <Button type="text" icon={<MoreVertical size={16} />} />
        </Dropdown>
      ),
    },
  ];
 console.log('Doctors Data:', doctors);
  // Calculate statistics
  const stats = {
    total: pagination?.total || 0,
    verified: doctors.filter((d) => d.verified).length,
    pending: doctors.filter((d) => d.status === 'pending').length,
    available: doctors.filter((d) => d.available).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Doctors</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all doctors in the system</p>
        </div>
        <Button
          type="primary"
          icon={<Plus size={18} />}
          onClick={() => navigate('/doctors/create')}
          size="large"
        >
          Add Doctor
        </Button>
      </div>

      <Row gutter={16}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Doctors"
              value={stats.total}
              prefix={<Users size={20} className="text-primary-600" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Verified"
              value={stats.verified}
              prefix={<UserCheck size={20} className="text-green-600" />}
              valueStyle={{ color: '#059669' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Pending"
              value={stats.pending}
              prefix={<User size={20} className="text-orange-600" />}
              valueStyle={{ color: '#ea580c' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Available"
              value={stats.available}
              prefix={<TrendingUp size={20} className="text-blue-600" />}
              valueStyle={{ color: '#2563eb' }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <div className="space-y-4">
          <div className="flex items-center gap-4 flex-wrap">
            <Input
              placeholder="Search doctors..."
              prefix={<Search size={16} />}
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value, page: 1 })}
              className="w-64"
              allowClear
            />
            <Select
              placeholder="Specialization"
              value={filters.specialization || undefined}
              onChange={(value) => setFilters({ specialization: value || '', page: 1 })}
              className="w-48"
              allowClear
            >
              {SPECIALIZATIONS.map((spec) => (
                <Select.Option key={spec} value={spec}>
                  {spec}
                </Select.Option>
              ))}
            </Select>
            <Select
              placeholder="Verification"
              value={filters.verified || undefined}
              onChange={(value) => setFilters({ verified: value || '', page: 1 })}
              className="w-40"
              allowClear
            >
              <Select.Option value="true">Verified</Select.Option>
              <Select.Option value="false">Unverified</Select.Option>
            </Select>
            <Select
              placeholder="Status"
              value={filters.status || undefined}
              onChange={(value) => setFilters({ status: value || '', page: 1 })}
              className="w-40"
              allowClear
            >
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="inactive">Inactive</Select.Option>
              <Select.Option value="suspended">Suspended</Select.Option>
              <Select.Option value="pending">Pending</Select.Option>
            </Select>
            <Select
              placeholder="Availability"
              value={filters.available || undefined}
              onChange={(value) => setFilters({ available: value || '', page: 1 })}
              className="w-40"
              allowClear
            >
              <Select.Option value="true">Available</Select.Option>
              <Select.Option value="false">Unavailable</Select.Option>
            </Select>
          </div>

          <Table
            columns={columns}
            dataSource={doctors}
            rowKey="id"
            loading={isLoading}
            pagination={{
              current: filters.page,
              pageSize: filters.limit,
              total: pagination?.total,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} doctors`,
              onChange: (page, pageSize) => setFilters({ page, limit: pageSize }),
            }}
            scroll={{ x: 1400 }}
            rowSelection={{
              selectedRowKeys,
              onChange: (keys) => setSelectedRowKeys(keys as string[]),
            }}
          />
        </div>
      </Card>
    </div>
  );
};