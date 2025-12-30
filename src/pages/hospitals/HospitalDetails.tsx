// src/pages/hospitals/HospitalDetails.tsx - COMPLETE VERSION
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Card,
  Button,
  Descriptions,
  Tag,
  Spin,
  Alert,
  Modal,
  message,
  Space,
  Divider,
  Row,
  Col,
  Statistic,
  Empty,
  Tooltip,
} from 'antd';
import {
  ArrowLeft,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  MapPin,
  Globe,
  Building2,
  AlertCircle,
  Bed,
  Star,
  Calendar,
  Stethoscope,
  Shield,
} from 'lucide-react';
import dayjs from 'dayjs';
import { hospitalsAPI } from '@/services/hospitalService';
import { AssignedDoctors } from './AssignedDoctors';
import { AssignDoctors } from './AssignDoctors';


const { confirm } = Modal;

export const HospitalDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch hospital data
  const { data: hospitalData, isLoading, refetch } = useQuery({
    queryKey: ['hospital', id],
    queryFn: () => hospitalsAPI.getById(id!),
    enabled: !!id,
  });

  // Fetch hospital statistics
  const { data: statsData, isLoading: loadingStats } = useQuery({
    queryKey: ['hospital-stats', id],
    queryFn: () => hospitalsAPI.getStats(id!),
    enabled: !!id,
  });

  console.log("hospitalData",hospitalData)

  const hospital = hospitalData;
  const stats = statsData?.data;

  // Verify mutation
  const verifyMutation = useMutation({
    mutationFn: () => hospitalsAPI.verify(id!),
    onSuccess: () => {
      message.success('Hospital verified successfully');
      refetch();
    },
    onError: () => {
      message.error('Failed to verify hospital');
    },
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: (status: string) => hospitalsAPI.updateStatus(id!, { status }),
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
    mutationFn: () => hospitalsAPI.delete(id!),
    onSuccess: () => {
      message.success('Hospital deleted successfully');
      navigate('/hospitals');
    },
    onError: () => {
      message.error('Failed to delete hospital');
    },
  });

  const handleVerify = () => {
    confirm({
      title: 'Verify Hospital',
      content: 'Are you sure you want to verify this hospital?',
      okText: 'Verify',
      okType: 'primary',
      onOk: () => verifyMutation.mutate(),
    });
  };

  const handleStatusChange = (status: string) => {
    confirm({
      title: 'Change Status',
      content: `Are you sure you want to change status to ${status}?`,
      onOk: () => updateStatusMutation.mutate(status),
    });
  };

  const handleDelete = () => {
    confirm({
      title: 'Delete Hospital',
      content: 'Are you sure you want to delete this hospital? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      onOk: () => deleteMutation.mutate(),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" tip="Loading hospital details..." />
      </div>
    );
  }

  if (!hospital) {
    return (
      <div className="space-y-6">
        <Alert
          message="Hospital Not Found"
          description="The hospital you're looking for doesn't exist."
          type="error"
          showIcon
        />
        <Button onClick={() => navigate('/hospitals')}>Back to Hospitals</Button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'success',
      inactive: 'default',
      suspended: 'error',
      pending: 'warning',
    };
    return colors[status] || 'default';
  };

  const canEdit = hospital.status !== 'suspended';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button icon={<ArrowLeft size={18} />} onClick={() => navigate('/hospitals')} />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hospital Details</h1>
            <p className="text-sm text-gray-500 mt-1">Complete information and statistics</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!hospital.verified && (
            <Button
              type="primary"
              icon={<CheckCircle size={18} />}
              onClick={handleVerify}
              loading={verifyMutation.isPending}
            >
              Verify Hospital
            </Button>
          )}
          <AssignDoctors hospitalId={id!} hospitalName={hospital.name} />
          {canEdit && (
            <Button
              icon={<Edit size={18} />}
              onClick={() => navigate(`/hospitals/${id}/edit`)}
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
      {!hospital.verified && (
        <Alert
          message="Verification Pending"
          description="This hospital is pending verification. Verify the hospital to activate all features."
          type="warning"
          showIcon
          icon={<AlertCircle size={20} />}
        />
      )}

      {hospital.status === 'suspended' && (
        <Alert
          message="Hospital Suspended"
          description="This hospital has been suspended and cannot accept new appointments."
          type="error"
          showIcon
        />
      )}

      {/* Main Info Card */}
      <Card>
        <div className="flex items-start gap-6">
          {/* Hospital Icon */}
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Building2 size={48} className="text-white" />
          </div>

          {/* Hospital Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{hospital.name}</h2>
                <p className="text-lg text-gray-600 mt-1 capitalize">
                  {hospital.type.replace('_', ' ')}
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <Tag color={getStatusColor(hospital.status)} className="text-sm px-3 py-1">
                    {hospital.status.toUpperCase()}
                  </Tag>
                  {hospital.verified ? (
                    <Tag color="success" icon={<CheckCircle size={14} />} className="text-sm px-3 py-1">
                      Verified
                    </Tag>
                  ) : (
                    <Tag color="warning" icon={<AlertCircle size={14} />} className="text-sm px-3 py-1">
                      Not Verified
                    </Tag>
                  )}
                  {hospital.isEmergency && (
                    <Tag color="red" className="text-sm px-3 py-1">
                      Emergency Services
                    </Tag>
                  )}
                  {hospital.is24x7 && (
                    <Tag color="blue" className="text-sm px-3 py-1">
                      24x7 Available
                    </Tag>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <Space direction="vertical" size="small">
                <Button
                  size="small"
                  onClick={() => handleStatusChange('active')}
                  disabled={hospital.status === 'active'}
                >
                  Set Active
                </Button>
                <Button
                  size="small"
                  onClick={() => handleStatusChange('inactive')}
                  disabled={hospital.status === 'inactive'}
                >
                  Set Inactive
                </Button>
                <Button
                  size="small"
                  danger
                  onClick={() => handleStatusChange('suspended')}
                  disabled={hospital.status === 'suspended'}
                >
                  Suspend
                </Button>
              </Space>
            </div>

            {/* Contact & Location */}
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="flex items-start gap-2 text-gray-600">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <div>
                  <div className="font-medium">{hospital.address}</div>
                  <div className="text-sm">{hospital.city}, {hospital.state} - {hospital.pincode}</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone size={16} />
                  <span>{hospital.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail size={16} />
                  <span>{hospital.email}</span>
                </div>
                {hospital.website && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Globe size={16} />
                    <a href={hospital.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Visit Website
                    </a>
                  </div>
                )}
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
              title="Total Beds"
              value={hospital.totalBeds}
              prefix={<Bed className="text-blue-500" size={20} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Doctors"
              value={stats?.totalDoctors || 0}
              prefix={<Stethoscope className="text-green-500" size={20} />}
              loading={loadingStats}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Appointments"
              value={stats?.totalAppointments || 0}
              prefix={<Calendar className="text-purple-500" size={20} />}
              loading={loadingStats}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Rating"
              value={hospital.rating || 0}
              precision={1}
              suffix={`/ 5 (${hospital.totalReviews || 0})`}
              prefix={<Star className="text-yellow-500" size={20} />}
            />
          </Card>
        </Col>
      </Row>

      {/* Description */}
      {hospital.description && (
        <Card title="About">
          <p className="text-gray-700 whitespace-pre-wrap">{hospital.description}</p>
        </Card>
      )}

      {/* Facilities & Services */}
      {hospital.facilities && hospital.facilities.length > 0 && (
        <Card title="Facilities & Services">
          <div className="flex flex-wrap gap-2">
            {hospital.facilities.map((facility: string) => (
              <Tag key={facility} color="blue" className="px-3 py-1">
                <CheckCircle size={14} className="inline mr-2" />
                {facility}
              </Tag>
            ))}
          </div>
        </Card>
      )}

      {/* Hospital Details */}
      <Card title="Hospital Information">
        <Descriptions column={2} bordered>
          <Descriptions.Item label="Registration Number" span={2}>
            <code className="text-sm bg-gray-100 px-2 py-1 rounded">{hospital.registrationNumber}</code>
          </Descriptions.Item>
          <Descriptions.Item label="Type">
            <Tag color="blue" className="capitalize">{hospital.type.replace('_', ' ')}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Total Beds">
            {hospital.totalBeds}
          </Descriptions.Item>
          <Descriptions.Item label="Commission Rate">
            {hospital.commissionRate}%
          </Descriptions.Item>
          <Descriptions.Item label="Emergency Services">
            {hospital.isEmergency ? (
              <Tag color="success" icon={<CheckCircle size={14} />}>Available</Tag>
            ) : (
              <Tag color="default" icon={<XCircle size={14} />}>Not Available</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="24x7 Service">
            {hospital.is24x7 ? (
              <Tag color="success" icon={<CheckCircle size={14} />}>Yes</Tag>
            ) : (
              <Tag color="default" icon={<XCircle size={14} />}>No</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={getStatusColor(hospital.status)} className="capitalize">
              {hospital.status}
            </Tag>
          </Descriptions.Item>
        </Descriptions>

        {hospital.latitude && hospital.longitude && (
          <>
            <Divider orientation="left">Location Coordinates</Divider>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Latitude">
                {hospital.latitude}
              </Descriptions.Item>
              <Descriptions.Item label="Longitude">
                {hospital.longitude}
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Card>

      {/* Assigned Doctors */}
      <AssignedDoctors hospitalId={id!} />

      {/* System Information */}
      <Card title={
        <div className="flex items-center gap-2">
          <Shield size={20} className="text-primary-600" />
          <span>System Information</span>
        </div>
      }>
        <Descriptions column={2} bordered>
          <Descriptions.Item label="Hospital ID" span={2}>
            <code className="text-xs bg-gray-100 px-2 py-1 rounded">{hospital.id}</code>
          </Descriptions.Item>
          <Descriptions.Item label="Created By">
            {hospital.createdBy || 'System'}
          </Descriptions.Item>
          <Descriptions.Item label="Verified">
            {hospital.verified ? (
              <Tag color="success" icon={<CheckCircle size={14} />}>Yes</Tag>
            ) : (
              <Tag color="warning" icon={<AlertCircle size={14} />}>No</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {dayjs(hospital.createdAt).format('DD MMM YYYY, hh:mm A')}
          </Descriptions.Item>
          <Descriptions.Item label="Last Updated">
            {dayjs(hospital.updatedAt).format('DD MMM YYYY, hh:mm A')}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};