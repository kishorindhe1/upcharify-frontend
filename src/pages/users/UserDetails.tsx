// src/pages/users/UserDetails.tsx
import { usersAPI } from '@/services/user.service';
import { UserRole, UserStatus } from '@/types/user.types';
import { useQuery } from '@tanstack/react-query';
import {
    Alert,
    Avatar,
    Button,
    Card,
    Descriptions,
    Modal,
    Spin,
    Tag,
    message
} from 'antd';
import dayjs from 'dayjs';
import {
    ArrowLeft,
    Calendar,
    CheckCircle,
    Clock,
    Edit,
    Mail,
    Phone as PhoneIcon,
    Shield,
    Trash2,
    User as UserIcon,
    XCircle,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const { confirm } = Modal;

export const UserDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch user data
  const { data: userData, isLoading, refetch } = useQuery({
    queryKey: ['users', id],
    queryFn: () => usersAPI.getById(id!),
    enabled: !!id,
  });

  const user = userData?.data;

  const handleDelete = () => {
    if (!user) return;

    confirm({
      title: 'Delete User',
      content: `Are you sure you want to delete ${user.firstName} ${user.lastName}? This action cannot be undone.`,
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          await usersAPI.delete(user.id);
          message.success('User deleted successfully');
          navigate('/users');
        } catch (error: any) {
          message.error(error.response?.data?.message || 'Failed to delete user');
        }
      },
    });
  };

  const handleVerifyEmail = async () => {
    if (!user) return;
    try {
      await usersAPI.verifyEmail(user.id);
      message.success('Email verified successfully');
      refetch();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to verify email');
    }
  };

  const handleVerifyPhone = async () => {
    if (!user) return;
    try {
      await usersAPI.verifyPhone(user.id);
      message.success('Phone verified successfully');
      refetch();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to verify phone');
    }
  };

  const handleStatusChange = (newStatus: UserStatus) => {
    if (!user) return;

    confirm({
      title: 'Update User Status',
      content: `Change user status to ${newStatus.toUpperCase()}?`,
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" tip="Loading user details..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <Alert
          message="User Not Found"
          description="The user you're looking for doesn't exist."
          type="error"
          showIcon
        />
        <Button onClick={() => navigate('/users')}>Back to Users</Button>
      </div>
    );
  }

  const getRoleColor = (role: UserRole) => {
    const colors: Record<UserRole, string> = {
      [UserRole.SUPER_ADMIN]: 'red',
      [UserRole.HOSPITAL_ADMIN]: 'orange',
      [UserRole.DOCTOR]: 'blue',
      [UserRole.PATIENT]: 'green',
    };
    return colors[role];
  };

  const getStatusColor = (status: UserStatus) => {
    const colors: Record<UserStatus, string> = {
      [UserStatus.ACTIVE]: 'success',
      [UserStatus.INACTIVE]: 'default',
      [UserStatus.SUSPENDED]: 'error',
      [UserStatus.PENDING]: 'warning',
    };
    return colors[status];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button icon={<ArrowLeft size={18} />} onClick={() => navigate('/users')} />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Details</h1>
            <p className="text-sm text-gray-500 mt-1">View and manage user information</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            type="primary"
            icon={<Edit size={18} />}
            onClick={() => navigate(`/users/${id}/edit`)}
          >
            Edit User
          </Button>
          <Button danger icon={<Trash2 size={18} />} onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>

      {/* Profile Card */}
      <Card>
        <div className="flex items-center gap-6">
          <Avatar
            size={100}
            src={user.profilePicture}
            icon={<UserIcon size={40} />}
            className="bg-gradient-to-r from-blue-500 to-purple-600"
          />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">
              {user.firstName} {user.lastName}
            </h2>
            <div className="flex items-center gap-3 mt-2">
              <Tag color={getRoleColor(user.role)}>
                {user.role.replace('_', ' ').toUpperCase()}
              </Tag>
              <Tag color={getStatusColor(user.status)}>{user.status.toUpperCase()}</Tag>
            </div>
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
              {user.email && (
                <div className="flex items-center gap-2">
                  <Mail size={16} />
                  <span>{user.email}</span>
                  {user.emailVerified ? (
                    <CheckCircle size={16} className="text-green-500" />
                  ) : (
                    <XCircle size={16} className="text-gray-400" />
                  )}
                </div>
              )}
              <div className="flex items-center gap-2">
                <PhoneIcon size={16} />
                <span>{user.phone}</span>
                {user.phoneVerified ? (
                  <CheckCircle size={16} className="text-green-500" />
                ) : (
                  <XCircle size={16} className="text-gray-400" />
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card title="Quick Actions">
        <div className="flex flex-wrap gap-2">
          {!user.emailVerified && user.email && (
            <Button onClick={handleVerifyEmail} icon={<Mail size={16} />}>
              Verify Email
            </Button>
          )}
          {!user.phoneVerified && (
            <Button onClick={handleVerifyPhone} icon={<PhoneIcon size={16} />}>
              Verify Phone
            </Button>
          )}
          {user.status === UserStatus.ACTIVE && (
            <Button
              onClick={() => handleStatusChange(UserStatus.SUSPENDED)}
              danger
            >
              Suspend User
            </Button>
          )}
          {user.status === UserStatus.SUSPENDED && (
            <Button
              onClick={() => handleStatusChange(UserStatus.ACTIVE)}
              type="primary"
            >
              Activate User
            </Button>
          )}
        </div>
      </Card>

      {/* User Information */}
      <Card title="Personal Information">
        <Descriptions column={2} bordered>
          <Descriptions.Item label="User ID" span={2}>
            <code className="text-xs bg-gray-100 px-2 py-1 rounded">{user.id}</code>
          </Descriptions.Item>
          <Descriptions.Item label="First Name">{user.firstName}</Descriptions.Item>
          <Descriptions.Item label="Last Name">{user.lastName}</Descriptions.Item>
          <Descriptions.Item label="Date of Birth">
            {user.dateOfBirth ? dayjs(user.dateOfBirth).format('DD MMM YYYY') : 'Not set'}
          </Descriptions.Item>
          <Descriptions.Item label="Gender">
            {user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'Not set'}
          </Descriptions.Item>
          <Descriptions.Item label="Email" span={2}>
            <div className="flex items-center gap-2">
              {user.email || 'Not set'}
              {user.email && (
                user.emailVerified ? (
                  <Tag color="success" icon={<CheckCircle size={12} />}>
                    Verified
                  </Tag>
                ) : (
                  <Tag color="warning" icon={<XCircle size={12} />}>
                    Not Verified
                  </Tag>
                )
              )}
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="Phone" span={2}>
            <div className="flex items-center gap-2">
              {user.phone}
              {user.phoneVerified ? (
                <Tag color="success" icon={<CheckCircle size={12} />}>
                  Verified
                </Tag>
              ) : (
                <Tag color="warning" icon={<XCircle size={12} />}>
                  Not Verified
                </Tag>
              )}
            </div>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Account Information */}
      <Card title="Account Information">
        <Descriptions column={2} bordered>
          <Descriptions.Item label="Role">
            <Tag color={getRoleColor(user.role)} icon={<Shield size={14} />}>
              {user.role.replace('_', ' ').toUpperCase()}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={getStatusColor(user.status)}>
              {user.status.toUpperCase()}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-gray-400" />
              {dayjs(user.createdAt).format('DD MMM YYYY, hh:mm A')}
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="Last Updated">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-gray-400" />
              {dayjs(user.updatedAt).format('DD MMM YYYY, hh:mm A')}
            </div>
          </Descriptions.Item>
          {user.hospitalId && (
            <Descriptions.Item label="Hospital ID" span={2}>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                {user.hospitalId}
              </code>
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      {/* Profile Picture */}
      {user.profilePicture && (
        <Card title="Profile Picture">
          <div className="flex items-start gap-4">
            <img
              src={user.profilePicture}
              alt={`${user.firstName} ${user.lastName}`}
              className="w-32 h-32 rounded-lg object-cover"
            />
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-2">Image URL:</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded block break-all">
                {user.profilePicture}
              </code>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};