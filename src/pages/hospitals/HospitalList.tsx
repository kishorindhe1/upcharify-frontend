// src/pages/hospitals/HospitalList.tsx
import { hospitalsAPI } from '@/services/hospitalService';
import type { Hospital } from '@/types/hospital.types';
import { useQuery } from '@tanstack/react-query';
import type { MenuProps, TableProps } from 'antd';
import {
  Button,
  Card,
  Col,
  Dropdown,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  message,
} from 'antd';
import {
  AlertCircle,
  Building2,
  CheckCircle,
  Edit,
  Eye,
  MoreVertical,
  Plus,
  Search,
  Trash2,
  XCircle
} from 'lucide-react';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const { confirm } = Modal;

export const HospitalList: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  const [filters, setFilters] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(20),
    search: parseAsString.withDefault(''),
    city: parseAsString.withDefault(''),
    state: parseAsString.withDefault(''),
    type: parseAsString.withDefault(''),
    status: parseAsString.withDefault(''),
    verified: parseAsString.withDefault(''),
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['hospitals', filters],
    queryFn: () => hospitalsAPI.list(filters as any),
  });
  console.log('Hospital list data:', data?.data.hospitals);

  const hospitals = data?.data?.hospitals || [];
  const pagination = data?.data.pagination;

  const handleDelete = (id: string, name: string) => {
    confirm({
      title: 'Delete Hospital',
      content: `Are you sure you want to delete ${name}? This action cannot be undone.`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      async onOk() {
        try {
          await hospitalsAPI.delete(id);
          message.success('Hospital deleted successfully');
          refetch();
        } catch (error) {
          message.error('Failed to delete hospital');
        }
      },
    });
  };

  const handleVerify = async (id: string, name: string) => {
    try {
      await hospitalsAPI.verify(id);
      message.success(`${name} verified successfully`);
      refetch();
    } catch (error) {
      message.error('Failed to verify hospital');
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await hospitalsAPI.updateStatus(id, { status });
      message.success('Status updated successfully');
      refetch();
    } catch (error) {
      message.error('Failed to update status');
    }
  };

  const getActionMenu = (record: Hospital): MenuProps['items'] => [
    {
      key: 'view',
      icon: <Eye size={16} />,
      label: 'View Details',
      onClick: () => navigate(`/hospitals/${record.id}`),
    },
    {
      key: 'edit',
      icon: <Edit size={16} />,
      label: 'Edit',
      onClick: () => navigate(`/hospitals/${record.id}/edit`),
    },
    {
      type: 'divider',
    },
    {
      key: 'doctors',
      label: 'View Doctors',
      onClick: () => navigate(`/hospitals/${record.id}/doctors`),
    },
    {
      key: 'stats',
      label: 'View Statistics',
      onClick: () => navigate(`/hospitals/${record.id}/stats`),
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
            onClick: () => handleVerify(record.id, record.name),
          },
        ]
      : []),
    {
      key: 'status',
      label: 'Change Status',
      children: [
        {
          key: 'active',
          label: 'Active',
          onClick: () => handleStatusChange(record.id, 'active'),
        },
        {
          key: 'inactive',
          label: 'Inactive',
          onClick: () => handleStatusChange(record.id, 'inactive'),
        },
        {
          key: 'suspended',
          label: 'Suspended',
          onClick: () => handleStatusChange(record.id, 'suspended'),
        },
      ],
    },
    {
      type: 'divider',
    },
    {
      key: 'delete',
      icon: <Trash2 size={16} />,
      label: 'Delete',
      danger: true,
      onClick: () => handleDelete(record.id, record.name),
    },
  ];

  const columns: TableProps<Hospital>['columns'] = [
    {
      title: 'Hospital Name',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      width: 250,
      render: (text: string, record: Hospital) => (
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <Building2 size={20} className="text-primary-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{text}</div>
            <div className="text-xs text-gray-500 capitalize">{record.type.replace('_', ' ')}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Location',
      key: 'location',
      width: 200,
      render: (_: any, record: Hospital) => (
        <div>
          <div className="text-sm text-gray-900">{record.city}</div>
          <div className="text-xs text-gray-500">{record.state}</div>
        </div>
      ),
    },
    {
      title: 'Contact',
      key: 'contact',
      width: 180,
      render: (_: any, record: Hospital) => (
        <div>
          <div className="text-sm text-gray-900">{record.phone}</div>
          <div className="text-xs text-gray-500">{record.email}</div>
        </div>
      ),
    },
    {
      title: 'Beds',
      dataIndex: 'totalBeds',
      key: 'totalBeds',
      width: 80,
      align: 'center',
      render: (beds: number) => <span className="font-medium">{beds}</span>,
    },
    {
      title: 'Services',
      key: 'services',
      width: 120,
      align: 'center',
      render: (_: any, record: Hospital) => (
        <Space size={4} direction="vertical">
          {record.isEmergency && (
            <Tag color="red" className="m-0 text-xs">
              Emergency
            </Tag>
          )}
          {record.is24x7 && (
            <Tag color="blue" className="m-0 text-xs">
              24x7
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      align: 'center',
      render: (status: string) => {
        const config = {
          active: { color: 'success', icon: <CheckCircle size={14} /> },
          inactive: { color: 'default', icon: <XCircle size={14} /> },
          suspended: { color: 'error', icon: <AlertCircle size={14} /> },
          pending: { color: 'warning', icon: <AlertCircle size={14} /> },
        };
        const { color, icon } = config[status as keyof typeof config] || config.pending;
        return (
          <Tag color={color} icon={icon} className="capitalize">
            {status}
          </Tag>
        );
      },
    },
    {
      title: 'Verified',
      dataIndex: 'verified',
      key: 'verified',
      width: 100,
      align: 'center',
      render: (verified: boolean) => (
        <Tag color={verified ? 'success' : 'warning'} icon={verified ? <CheckCircle size={14} /> : <AlertCircle size={14} />}>
          {verified ? 'Yes' : 'No'}
        </Tag>
      ),
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      width: 100,
      align: 'center',
      render: (rating: number, record: Hospital) => (
        <div>
          <div className="font-medium text-gray-900">{rating?.toFixed(1) || 1}</div>
          <div className="text-xs text-gray-500">{record.totalReviews} reviews</div>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 80,
      align: 'center',
      render: (_: any, record: Hospital) => (
        <Dropdown menu={{ items: getActionMenu(record) }} trigger={['click']} placement="bottomRight">
          <Button type="text" icon={<MoreVertical size={16} />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hospitals</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all hospitals in the system</p>
        </div>
        <Button type="primary" icon={<Plus size={18} />} onClick={() => navigate('/hospitals/create')} size="large">
          Add Hospital
        </Button>
      </div>

      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Hospitals"
              value={pagination?.total || 0}
              prefix={<Building2 size={20} className="text-primary-600" />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Active"
              value={hospitals.filter((h: Hospital) => h.status === 'active').length}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircle size={20} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Pending Verification"
              value={hospitals.filter((h: Hospital) => !h.verified).length}
              valueStyle={{ color: '#faad14' }}
              prefix={<AlertCircle size={20} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Beds"
              value={hospitals.reduce((sum: number, h: Hospital) => sum + h.totalBeds, 0)}
              prefix={<Building2 size={20} className="text-blue-600" />}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <div className="space-y-4">
          <div className="flex items-center gap-4 flex-wrap">
            <Input
              placeholder="Search hospitals..."
              prefix={<Search size={16} />}
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value, page: 1 })}
              className="w-64"
              allowClear
            />
            <Select
              placeholder="City"
              value={filters.city || undefined}
              onChange={(value) => setFilters({ city: value || '', page: 1 })}
              className="w-40"
              allowClear
            >
              <Select.Option value="Mumbai">Mumbai</Select.Option>
              <Select.Option value="Pune">Pune</Select.Option>
              <Select.Option value="Nagpur">Nagpur</Select.Option>
              <Select.Option value="Nashik">Nashik</Select.Option>
            </Select>
            <Select
              placeholder="Type"
              value={filters.type || undefined}
              onChange={(value) => setFilters({ type: value || '', page: 1 })}
              className="w-40"
              allowClear
            >
              <Select.Option value="hospital">Hospital</Select.Option>
              <Select.Option value="clinic">Clinic</Select.Option>
              <Select.Option value="diagnostic_center">Diagnostic Center</Select.Option>
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
              placeholder="Verification"
              value={filters.verified || undefined}
              onChange={(value) => setFilters({ verified: value || '', page: 1 })}
              className="w-40"
              allowClear
            >
              <Select.Option value="true">Verified</Select.Option>
              <Select.Option value="false">Not Verified</Select.Option>
            </Select>
          </div>

          <Table
            columns={columns}
            dataSource={hospitals}
            rowKey="id"
            loading={isLoading}
            pagination={{
              current: filters.page,
              pageSize: filters.limit,
              total: pagination?.total,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} hospitals`,
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