// src/pages/users/UserList.tsx
import { usersAPI } from '@/services/user.service';
import { UserRole, UserStatus, type User } from '@/types/user.types';
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
import {
    Activity,
    Edit,
    Eye,
    Mail,
    MoreVertical,
    Phone as PhoneIcon,
    Plus,
    Search,
    Trash2,
    UserCheck,
    UserCog,
    User as UserIcon,
    Users,
    UserX
} from 'lucide-react';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { useNavigate } from 'react-router-dom';

const { confirm } = Modal;

export const UserList: React.FC = () => {
  const navigate = useNavigate();
  
  const [queryParams, setQueryParams] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(10),
    search: parseAsString.withDefault(''),
    role: parseAsString.withDefault(''),
    status: parseAsString.withDefault(''),
  });

  // Fetch users
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['users', queryParams],
    queryFn: () =>
      usersAPI.list({
        ...queryParams,
        role: Object.values(UserRole).includes(queryParams.role as UserRole)
          ? (queryParams.role as UserRole)
          : undefined,
        status: Object.values(UserStatus).includes(queryParams.status as UserStatus)
          ? (queryParams.status as UserStatus)
          : undefined,
      }),
  });

  // Fetch statistics
  const { data: statsData } = useQuery({
    queryKey: ['users', 'stats'],
    queryFn: () => usersAPI.getStats(),
  });

  const users = data?.data?.users || [];
  const pagination = data?.data?.pagination;
  const stats = statsData?.data;

  const handleDelete = (user: User) => {
    confirm({
      title: 'Delete User',
      content: `Are you sure you want to delete ${user.firstName} ${user.lastName}?`,
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          await usersAPI.delete(user.id);
          message.success('User deleted successfully');
          refetch();
        } catch (error: any) {
          message.error(error.response?.data?.message || 'Failed to delete user');
        }
      },
    });
  };

  const handleStatusChange = (user: User, newStatus: UserStatus) => {
    confirm({
      title: 'Update User Status',
      content: `Change status of ${user.firstName} ${user.lastName} to ${newStatus}?`,
      onOk: async () => {
        try {
          await usersAPI.updateStatus(user.id, { status: newStatus });
          message.success('Status updated successfully');
          refetch();
        } catch (error: any) {
          message.error(error.response?.data?.message || 'Failed to update status');
        }
      },
    });
  };

  const getActionMenu = (user: User): MenuProps['items'] => [
    {
      key: 'view',
      icon: <Eye size={16} />,
      label: 'View Details',
      onClick: () => navigate(`/users/${user.id}`),
    },
    {
      key: 'edit',
      icon: <Edit size={16} />,
      label: 'Edit',
      onClick: () => navigate(`/users/${user.id}/edit`),
    },
    {
      type: 'divider',
    },
    {
      key: 'verify-email',
      icon: <Mail size={16} />,
      label: 'Verify Email',
      disabled: user.emailVerified,
      onClick: async () => {
        try {
          await usersAPI.verifyEmail(user.id);
          message.success('Email verified');
          refetch();
        } catch (error: any) {
          message.error('Failed to verify email');
        }
      },
    },
    {
      key: 'verify-phone',
      icon: <PhoneIcon size={16} />,
      label: 'Verify Phone',
      disabled: user.phoneVerified,
      onClick: async () => {
        try {
          await usersAPI.verifyPhone(user.id);
          message.success('Phone verified');
          refetch();
        } catch (error: any) {
          message.error('Failed to verify phone');
        }
      },
    },
    {
      type: 'divider',
    },
    ...(user.status === UserStatus.ACTIVE
      ? [
          {
            key: 'suspend',
            icon: <UserX size={16} />,
            label: 'Suspend',
            onClick: () => handleStatusChange(user, UserStatus.SUSPENDED),
          },
        ]
      : []),
    ...(user.status === UserStatus.SUSPENDED
      ? [
          {
            key: 'activate',
            icon: <UserCheck size={16} />,
            label: 'Activate',
            onClick: () => handleStatusChange(user, UserStatus.ACTIVE),
          },
        ]
      : []),
    {
      type: 'divider',
    },
    {
      key: 'delete',
      icon: <Trash2 size={16} />,
      label: 'Delete',
      danger: true,
      onClick: () => handleDelete(user),
    },
  ];

  const columns: ColumnsType<User> = [
    {
      title: 'User',
      key: 'user',
      width: 250,
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar
            size={40}
            src={record.profilePicture}
            className="bg-gradient-to-r from-blue-500 to-purple-600"
            icon={<UserIcon size={20} />}
          />
          <div>
            <div className="font-medium text-gray-900">
              {record.firstName} {record.lastName}
            </div>
            <div className="text-xs text-gray-500">{record.email || record.phone}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      width: 150,
      render: (role: UserRole) => {
        const roleConfig: Record<UserRole, { color: string; label: string }> = {
          [UserRole.SUPER_ADMIN]: { color: 'red', label: 'Super Admin' },
          [UserRole.HOSPITAL_ADMIN]: { color: 'orange', label: 'Hospital Admin' },
          [UserRole.DOCTOR]: { color: 'blue', label: 'Doctor' },
          [UserRole.PATIENT]: { color: 'green', label: 'Patient' },
        };
        const config = roleConfig[role];
        return <Tag color={config.color}>{config.label}</Tag>;
      },
    },
    {
      title: 'Contact',
      key: 'contact',
      width: 200,
      render: (_, record) => (
        <div className="space-y-1">
          {record.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail size={14} className="text-gray-400" />
              <span className="text-gray-600">{record.email}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm">
            <PhoneIcon size={14} className="text-gray-400" />
            <span className="text-gray-600">{record.phone}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Verification',
      key: 'verification',
      width: 150,
      render: (_, record) => (
        <div className="space-y-1">
          <Tag color={record.emailVerified ? 'success' : 'default'} className="text-xs">
            {record.emailVerified ? '✓' : '✗'} Email
          </Tag>
          <Tag color={record.phoneVerified ? 'success' : 'default'} className="text-xs">
            {record.phoneVerified ? '✓' : '✗'} Phone
          </Tag>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: UserStatus) => {
        const statusConfig: Record<UserStatus, { color: string }> = {
          [UserStatus.ACTIVE]: { color: 'success' },
          [UserStatus.INACTIVE]: { color: 'default' },
          [UserStatus.SUSPENDED]: { color: 'error' },
          [UserStatus.PENDING]: { color: 'warning' },
        };
        return (
          <Tag color={statusConfig[status].color}>
            {status.toUpperCase()}
          </Tag>
        );
      },
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
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all system users</p>
        </div>
        <Button
          type="primary"
          icon={<Plus size={18} />}
          onClick={() => navigate('/users/create')}
          size="large"
        >
          Add User
        </Button>
      </div>

      {/* Statistics */}
      {stats && (
        <Row gutter={16}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Users"
                value={stats.totalUsers}
                prefix={<Users className="text-blue-500" size={20} />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Active Users"
                value={stats.activeUsers}
                prefix={<Activity className="text-green-500" size={20} />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Doctors"
                value={stats.usersByRole.doctor}
                prefix={<UserCog className="text-purple-500" size={20} />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Patients"
                value={stats.usersByRole.patient}
                prefix={<UserIcon className="text-orange-500" size={20} />}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Filters */}
      <Card>
        <Space className="w-full" direction="vertical" size="middle">
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8}>
              <Input
                placeholder="Search by name, email, or phone"
                prefix={<Search size={16} />}
                value={queryParams.search}
                onChange={(e) => setQueryParams({ search: e.target.value, page: 1 })}
                allowClear
                size="large"
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Select
                placeholder="Filter by role"
                value={queryParams.role || undefined}
                onChange={(value) => setQueryParams({ role: value || '', page: 1 })}
                allowClear
                size="large"
                className="w-full"
              >
                <Select.Option value={UserRole.PATIENT}>Patient</Select.Option>
                <Select.Option value={UserRole.DOCTOR}>Doctor</Select.Option>
                <Select.Option value={UserRole.HOSPITAL_ADMIN}>Hospital Admin</Select.Option>
                <Select.Option value={UserRole.SUPER_ADMIN}>Super Admin</Select.Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Select
                placeholder="Filter by status"
                value={queryParams.status || undefined}
                onChange={(value) => setQueryParams({ status: value || '', page: 1 })}
                allowClear
                size="large"
                className="w-full"
              >
                <Select.Option value={UserStatus.ACTIVE}>Active</Select.Option>
                <Select.Option value={UserStatus.INACTIVE}>Inactive</Select.Option>
                <Select.Option value={UserStatus.SUSPENDED}>Suspended</Select.Option>
                <Select.Option value={UserStatus.PENDING}>Pending</Select.Option>
              </Select>
            </Col>
          </Row>
        </Space>
      </Card>

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: pagination?.page || 1,
            pageSize: pagination?.limit || 10,
            total: pagination?.total || 0,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} users`,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  );
};