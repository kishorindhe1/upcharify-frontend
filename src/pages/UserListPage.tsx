import { userService } from '@/services/userService';
import { Gender, MasterUser, UserRole, UserStatus } from '@/types/userTypes';
import {
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    FilterFilled,
    LockOutlined,
    MoreOutlined,
    PlusOutlined,
    ReloadOutlined,
    UnlockOutlined,
    UserOutlined
} from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    Avatar,
    Badge,
    Button,
    Dropdown,
    Input,
    message,
    Modal,
    Select,
    Space,
    Table,
    Tag,
    Tooltip,
} from 'antd';
import type { TablePaginationConfig } from 'antd/es/table';
import {
    parseAsInteger,
    parseAsString,
    parseAsStringEnum,
    useQueryState,
} from 'nuqs';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const { Search } = Input;
const { Option } = Select;

const UserListPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Server-side filter states
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [limit, setLimit] = useQueryState('limit', parseAsInteger.withDefault(20));
  const [search, setSearch] = useQueryState('search', parseAsString.withDefault(''));
  const [role, setRole] = useQueryState('role', parseAsStringEnum<UserRole>(Object.values(UserRole)).withDefault(null));
  const [status, setStatus] = useQueryState('status', parseAsStringEnum<UserStatus>(Object.values(UserStatus)).withDefault(null));
  const [gender, setGender] = useQueryState('gender', parseAsStringEnum<Gender>(Object.values(Gender)).withDefault(null));

  // Fetch users with all server-side params
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['users', { page, limit, search, role, status, gender }],
    queryFn: () =>
      userService.getAllUsers({
        page,
        limit,
        search: search || undefined,
        role: role || undefined,
        status: status || undefined,
        gender: gender || undefined,
      }),
    keepPreviousData: true,
  });

  const deleteMutation = useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () => {
      message.success('User deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: () => message.error('Failed to delete user'),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: UserStatus }) =>
      userService.updateUserStatus(id, status),
    onSuccess: () => {
      message.success('Status updated');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const handleDelete = (id: string, name: string) => {
    Modal.confirm({
      title: 'Delete User',
      content: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
      okText: 'Delete',
      okType: 'danger',
      onOk: () => deleteMutation.mutate(id),
    });
  };

  const handleStatusToggle = (id: string, current: UserStatus) => {
    const newStatus =
      current === UserStatus.SUSPENDED ? UserStatus.ACTIVE : UserStatus.SUSPENDED;
    updateStatusMutation.mutate({ id, status: newStatus });
  };

  const handleClearFilters = () => {
    setSearch('');
    setRole(null);
    setStatus(null);
    setGender(null);
    setPage(1);
  };

  const hasActiveFilters = !!(search || role || status || gender);

  const columns = [
    {
      title: 'Name',
      key: 'name',
      render: (_: any, record: MasterUser) => (
        <Space>
          <Avatar src={record.avatar} icon={<UserOutlined />} size="default" />
          <div>
            <div className="font-medium">
              {record.firstName
                ? `${record.firstName} ${record.lastName || ''}`.trim()
                : record.name || 'Unnamed User'}
            </div>
            <div className="text-xs text-gray-500">{record.phone}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email: string) => <span className="text-gray-600">{email || '-'}</span>,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: UserRole) => {
        const colors: Record<UserRole, string> = {
          [UserRole.HOSPITAL_ADMIN]: 'blue',
          [UserRole.DOCTOR]: 'green',
          [UserRole.PATIENT]: 'geekblue',
          [UserRole.RECIPIENT]: 'orange',
        };
        return <Tag color={colors[role]}>{role.replace('_', ' ')}</Tag>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: UserStatus) => (
        <Badge
          status={
            status === UserStatus.ACTIVE
              ? 'success'
              : status === UserStatus.SUSPENDED
              ? 'error'
              : status === UserStatus.PENDING_VERIFICATION
              ? 'warning'
              : 'default'
          }
          text={status.replace('_', ' ')}
        />
      ),
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender: Gender) => gender || '-',
      width: 100,
      align: 'center' as const,
    },
    {
      title: 'Last Login',
      dataIndex: 'lastLoginAt',
      key: 'lastLoginAt',
      render: (date: string) =>
        date ? new Date(date).toLocaleDateString() : <span className="text-gray-400">Never</span>,
      width: 140,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      align: 'center' as const,
      render: (_: any, record: MasterUser) => (
        <Space size="small">
          <Tooltip title="View">
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={() => navigate(`/users/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => navigate(`/users/edit/${record.id}`)}
            />
          </Tooltip>
          <Dropdown
            menu={{
              items: [
                {
                  key: 'toggle',
                  label: record.status === UserStatus.SUSPENDED ? 'Activate' : 'Suspend',
                  icon: record.status === UserStatus.SUSPENDED ? <UnlockOutlined /> : <LockOutlined />,
                  onClick: () => handleStatusToggle(record.id, record.status),
                },
                { type: 'divider' as const },
                {
                  key: 'delete',
                  label: 'Delete',
                  danger: true,
                  icon: <DeleteOutlined />,
                  onClick: () =>
                    handleDelete(
                      record.id,
                      record.firstName
                        ? `${record.firstName} ${record.lastName || ''}`.trim()
                        : record.phone
                    ),
                },
              ],
            }}
            trigger={['click']}
          >
            <Button icon={<MoreOutlined />} size="small" />
          </Dropdown>
        </Space>
      ),
    },
  ];

  const pagination: TablePaginationConfig = {
    current: page,
    pageSize: limit,
    total: data?.pagination?.totalItems || 0,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50', '100'],
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} users`,
    onChange: (newPage, newPageSize) => {
      setPage(newPage);
      if (newPageSize !== limit) setLimit(newPageSize);
    },
  };

  return (
    <div className="p-6 max-w-full mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-1">Manage user accounts and permissions</p>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => navigate('/users/add')}
        >
          Add User
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Global Search */}
          <Search
            placeholder="Search by name, email, or phone..."
            allowClear
            size="large"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onSearch={(value) => {
              setSearch(value.trim());
              setPage(1);
            }}
            style={{ width: '100%', maxWidth: 400 }}
            loading={isFetching && !!search}
          />

          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            <Select
              placeholder="All Roles"
              size="large"
              allowClear
              value={role}
              onChange={(value) => {
                setRole(value);
                setPage(1);
              }}
              style={{ width: 180 }}
            >
              <Option value={UserRole.HOSPITAL_ADMIN}>Hospital Admin</Option>
              <Option value={UserRole.DOCTOR}>Doctor</Option>
              <Option value={UserRole.PATIENT}>Patient</Option>
              <Option value={UserRole.RECIPIENT}>Recipient</Option>
            </Select>

            <Select
              placeholder="All Statuses"
              size="large"
              allowClear
              value={status}
              onChange={(value) => {
                setStatus(value);
                setPage(1);
              }}
              style={{ width: 180 }}
            >
              <Option value={UserStatus.ACTIVE}>Active</Option>
              <Option value={UserStatus.INACTIVE}>Inactive</Option>
              <Option value={UserStatus.SUSPENDED}>Suspended</Option>
              <Option value={UserStatus.PENDING_VERIFICATION}>Pending</Option>
            </Select>

            <Select
              placeholder="All Genders"
              size="large"
              allowClear
              value={gender}
              onChange={(value) => {
                setGender(value);
                setPage(1);
              }}
              style={{ width: 140 }}
            >
              <Option value={Gender.MALE}>Male</Option>
              <Option value={Gender.FEMALE}>Female</Option>
              <Option value={Gender.OTHER}>Other</Option>
            </Select>

            {/* Active Filters Indicator & Clear */}
            {hasActiveFilters && (
              <Space>
                <Tag color="blue" icon={<FilterFilled />}>
                  Filters Active
                </Tag>
                <Button size="small" onClick={handleClearFilters}>
                  Clear All
                </Button>
              </Space>
            )}
          </div>

          {/* Refresh */}
          <div className="ml-auto">
            <Button
              icon={<ReloadOutlined spin={isFetching} />}
              onClick={() => queryClient.invalidateQueries({ queryKey: ['users'] })}
            >
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <Table
          columns={columns}
          dataSource={data?.records || []}
          rowKey="id"
          loading={isLoading}
          pagination={pagination}
          scroll={{ x: 1100 }}
        />
      </div>
    </div>
  );
};

export default UserListPage;