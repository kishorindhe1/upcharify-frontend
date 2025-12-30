// src/pages/doctors/DoctorDetails.tsx - COMPLETE VERSION
import { doctorHospitalAPI } from '@/services/doctor-hospital';
import { doctorsAPI } from '@/services/doctor.service';
import { DoctorStatus } from '@/types/doctor.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    Alert,
    Avatar,
    Button,
    Card,
    Col,
    Descriptions,
    Divider,
    Empty,
    List,
    message,
    Modal,
    Row,
    Space,
    Spin,
    Statistic,
    Tag,
    Tooltip,
} from 'antd';
import dayjs from 'dayjs';
import {
    AlertCircle,
    ArrowLeft,
    Award,
    Briefcase,
    Building2,
    CheckCircle,
    DollarSign,
    Edit,
    FileText,
    Mail,
    Phone,
    Shield,
    Star,
    Trash2,
    User,
    XCircle
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const { confirm } = Modal;

export const DoctorDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch doctor data
  const { data: doctorData, isLoading, refetch } = useQuery({
    queryKey: ['doctors', id],
    queryFn: () => doctorsAPI.getById(id!),
    enabled: !!id,
  });

  // Fetch doctor's hospitals
  const { data: hospitalsData, isLoading: loadingHospitals } = useQuery({
    queryKey: ['doctor-hospitals', id],
    queryFn: () => doctorHospitalAPI.getDoctorHospitals(id!),
    enabled: !!id,
  });

  const doctor = doctorData;
  const hospitals = hospitalsData || [];

  // Verify mutation
  const verifyMutation = useMutation({
    mutationFn: () => doctorsAPI.verify(id!, { verified: true }),
    onSuccess: () => {
      message.success('Doctor verified successfully');
      refetch();
    },
    onError: () => {
      message.error('Failed to verify doctor');
    },
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: (status: DoctorStatus) => doctorsAPI.updateStatus(id!, { status }),
    onSuccess: () => {
      message.success('Status updated successfully');
      refetch();
    },
    onError: () => {
      message.error('Failed to update status');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: () => doctorsAPI.delete(id!),
    onSuccess: () => {
      message.success('Doctor deleted successfully');
      navigate('/doctors');
    },
    onError: () => {
      message.error('Failed to delete doctor');
    },
  });

  const handleVerify = () => {
    confirm({
      title: 'Verify Doctor',
      content: 'Are you sure you want to verify this doctor?',
      okText: 'Verify',
      okType: 'primary',
      onOk: () => verifyMutation.mutate(),
    });
  };

  const handleStatusChange = (status: DoctorStatus) => {
    confirm({
      title: 'Change Status',
      content: `Are you sure you want to change status to ${status}?`,
      onOk: () => updateStatusMutation.mutate(status),
    });
  };

  const handleDelete = () => {
    confirm({
      title: 'Delete Doctor',
      content: 'Are you sure you want to delete this doctor? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      onOk: () => deleteMutation.mutate(),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" tip="Loading doctor details..." />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="space-y-6">
        <Alert
          message="Doctor Not Found"
          description="The doctor you're looking for doesn't exist."
          type="error"
          showIcon
        />
        <Button onClick={() => navigate('/doctors')}>Back to Doctors</Button>
      </div>
    );
  }

  const getStatusColor = (status: DoctorStatus) => {
    const colors = {
      [DoctorStatus.ACTIVE]: 'success',
      [DoctorStatus.INACTIVE]: 'default',
      [DoctorStatus.SUSPENDED]: 'error',
      [DoctorStatus.PENDING]: 'warning',
    };
    return colors[status];
  };

  const canEdit = doctor.status !== DoctorStatus.SUSPENDED;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button icon={<ArrowLeft size={18} />} onClick={() => navigate('/doctors')} />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Doctor Details</h1>
            <p className="text-sm text-gray-500 mt-1">Complete information</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!doctor.verified && (
            <Button
              type="primary"
              icon={<CheckCircle size={18} />}
              onClick={handleVerify}
              loading={verifyMutation.isPending}
            >
              Verify Doctor
            </Button>
          )}
          {canEdit && (
            <Button
              icon={<Edit size={18} />}
              onClick={() => navigate(`/doctors/${id}/edit`)}
            >
              Edit
            </Button>
          )}
          <Button
            danger
            icon={<Trash2 size={18} />}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Status Alerts */}
      {!doctor.verified && (
        <Alert
          message="Verification Pending"
          description="This doctor profile is pending verification. Verify the doctor to activate the account."
          type="warning"
          showIcon
          icon={<AlertCircle size={20} />}
        />
      )}

      {doctor.status === DoctorStatus.SUSPENDED && (
        <Alert
          message="Account Suspended"
          description="This doctor account has been suspended."
          type="error"
          showIcon
        />
      )}

      {/* Profile Card */}
      <Card>
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <Avatar
            size={120}
            src={doctor.user?.profilePicture}
            icon={<User size={40} />}
            className="bg-gradient-to-r from-blue-500 to-purple-600 flex-shrink-0"
          />

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Dr. {doctor.user?.firstName} {doctor.user?.lastName}
                </h2>
                <p className="text-lg text-gray-600 mt-1">{doctor.specialization}</p>
                <div className="flex items-center gap-4 mt-2">
                  <Tag color={getStatusColor(doctor.status)} className="text-sm px-3 py-1">
                    {doctor.status.toUpperCase()}
                  </Tag>
                  {doctor.verified ? (
                    <Tag color="success" icon={<CheckCircle size={14} />} className="text-sm px-3 py-1">
                      Verified
                    </Tag>
                  ) : (
                    <Tag color="warning" icon={<AlertCircle size={14} />} className="text-sm px-3 py-1">
                      Not Verified
                    </Tag>
                  )}
                  {doctor.available ? (
                    <Tag color="green" className="text-sm px-3 py-1">
                      Available
                    </Tag>
                  ) : (
                    <Tag color="red" className="text-sm px-3 py-1">
                      Unavailable
                    </Tag>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <Space direction="vertical" size="small">
                <Button
                  size="small"
                  onClick={() => handleStatusChange(DoctorStatus.ACTIVE)}
                  disabled={doctor.status === DoctorStatus.ACTIVE}
                >
                  Set Active
                </Button>
                <Button
                  size="small"
                  onClick={() => handleStatusChange(DoctorStatus.INACTIVE)}
                  disabled={doctor.status === DoctorStatus.INACTIVE}
                >
                  Set Inactive
                </Button>
                <Button
                  size="small"
                  danger
                  onClick={() => handleStatusChange(DoctorStatus.SUSPENDED)}
                  disabled={doctor.status === DoctorStatus.SUSPENDED}
                >
                  Suspend
                </Button>
              </Space>
            </div>

            {/* Contact Info */}
            <div className="mt-4 flex items-center gap-6">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail size={16} />
                <span>{doctor.user?.email || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone size={16} />
                <span>{doctor.user?.phone}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Statistics */}
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Experience"
              value={doctor.experienceYears}
              suffix="years"
              prefix={<Briefcase className="text-blue-500" size={20} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Consultation Fee"
              value={doctor.consultationFee}
              prefix={<DollarSign className="text-green-500" size={20} />}
              formatter={(value) => `₹${value}`}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Rating"
              value={doctor.rating || 0}
              precision={1}
              suffix="/ 5"
              prefix={<Star className="text-yellow-500" size={20} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Reviews"
              value={doctor.totalReviews || 0}
              prefix={<FileText className="text-purple-500" size={20} />}
            />
          </Card>
        </Col>
      </Row>

      {/* Professional Information */}
      <Card title={
        <div className="flex items-center gap-2">
          <Award size={20} className="text-primary-600" />
          <span>Professional Information</span>
        </div>
      }>
        <Descriptions column={2} bordered>
          <Descriptions.Item label="License Number" span={1}>
            <code className="text-sm bg-gray-100 px-2 py-1 rounded">{doctor.licenseNumber}</code>
          </Descriptions.Item>
          <Descriptions.Item label="Specialization" span={1}>
            <Tag color="blue">{doctor.specialization}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Qualification" span={2}>
            {doctor.qualification || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Experience" span={1}>
            {doctor.experienceYears} years
          </Descriptions.Item>
          <Descriptions.Item label="Consultation Fee" span={1}>
            ₹{doctor.consultationFee}
          </Descriptions.Item>
        </Descriptions>

        {doctor.bio && (
          <>
            <Divider orientation="left">Professional Bio</Divider>
            <p className="text-gray-700 whitespace-pre-wrap">{doctor.bio}</p>
          </>
        )}
      </Card>

      {/* Associated Hospitals */}
      <Card 
        title={
          <div className="flex items-center gap-2">
            <Building2 size={20} className="text-primary-600" />
            <span>Associated Hospitals ({hospitals?.length})</span>
          </div>
        }
        loading={loadingHospitals}
      >
        {hospitals?.length === 0 ? (
          <Empty description="No hospitals assigned yet" />
        ) : (
          <List
            dataSource={hospitals}
            renderItem={(item: any) => (
              <List.Item
                actions={[
                  <Tag color="blue" key="commission">
                    <DollarSign size={12} className="inline mr-1" />
                    {item.commissionRate}% commission
                  </Tag>,
                  <Tag 
                    color={item.status === 'active' ? 'success' : 'default'} 
                    key="status"
                  >
                    {item.status}
                  </Tag>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Building2 size={24} className="text-blue-600" />
                    </div>
                  }
                  title={
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{item.hospital.name}</span>
                      {item.isPrimary && (
                        <Tooltip title="Primary Hospital">
                          <Star size={16} className="text-yellow-500" fill="currentColor" />
                        </Tooltip>
                      )}
                    </div>
                  }
                  description={
                    <Space direction="vertical" size={0}>
                      <span className="text-gray-600">{item.hospital.address}</span>
                      <span className="text-gray-500 text-sm">
                        {item.hospital.city}, {item.hospital.state}
                      </span>
                      <span className="text-gray-400 text-xs">
                        Joined: {dayjs(item.joinedAt).format('DD MMM YYYY')}
                      </span>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>

      {/* User Account Information */}
      <Card title={
        <div className="flex items-center gap-2">
          <Shield size={20} className="text-primary-600" />
          <span>Account Information</span>
        </div>
      }>
        <Descriptions column={2} bordered>
          <Descriptions.Item label="User ID" span={2}>
            <code className="text-xs bg-gray-100 px-2 py-1 rounded">{doctor.userId}</code>
          </Descriptions.Item>
          <Descriptions.Item label="Email Verified" span={1}>
            {doctor.user?.emailVerified ? (
              <Tag color="success" icon={<CheckCircle size={14} />}>Verified</Tag>
            ) : (
              <Tag color="warning" icon={<XCircle size={14} />}>Not Verified</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Phone Verified" span={1}>
            {doctor.user?.phoneVerified ? (
              <Tag color="success" icon={<CheckCircle size={14} />}>Verified</Tag>
            ) : (
              <Tag color="warning" icon={<XCircle size={14} />}>Not Verified</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Account Created" span={1}>
            {dayjs(doctor.createdAt).format('DD MMM YYYY, hh:mm A')}
          </Descriptions.Item>
          <Descriptions.Item label="Last Updated" span={1}>
            {dayjs(doctor.updatedAt).format('DD MMM YYYY, hh:mm A')}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};