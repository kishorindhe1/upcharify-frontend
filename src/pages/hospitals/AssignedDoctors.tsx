// src/components/hospitals/AssignedDoctors.tsx
import { doctorHospitalAPI } from '@/services/doctor-hospital';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Card,
  Dropdown,
  InputNumber,
  MenuProps,
  message,
  Modal,
  Space,
  Table,
  Tag,
  Tooltip
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import {
  CheckCircle,
  Edit,
  MoreVertical,
  Star,
  Stethoscope,
  Trash2,
  XCircle
} from 'lucide-react';
import { useState } from 'react';

interface AssignedDoctorsProps {
  hospitalId: string;
}

interface DoctorHospitalAssignment {
  id: string;
  doctorId: string;
  hospitalId: string;
  commissionRate: number;
  isPrimary: boolean;
  status: 'active' | 'inactive' | 'suspended';
  joinedAt: string;
  leftAt?: string;
  doctor: {
    id: string;
    licenseNumber: string;
    specialization: string;
    experienceYears: number;
    consultationFee: number;
    user: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
    };
  };
}

export const AssignedDoctors: React.FC<AssignedDoctorsProps> = ({ hospitalId }) => {
  const [editingDoctor, setEditingDoctor] = useState<string | null>(null);
  const [commissionRate, setCommissionRate] = useState<number>(10);
  const queryClient = useQueryClient();

  // Fetch assigned doctors
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['doctor-hospitals', hospitalId],
    queryFn: () => doctorHospitalAPI.getHospitalDoctors(hospitalId),
  });

  const assignments = data || [];

  // Update commission mutation
  const updateCommissionMutation = useMutation({
    mutationFn: async ({ doctorId, rate }: { doctorId: string; rate: number }) => {
      return doctorHospitalAPI.updateCommission(doctorId, hospitalId, rate);
    },
    onSuccess: () => {
      message.success('Commission rate updated');
      queryClient.invalidateQueries({ queryKey: ['doctor-hospitals', hospitalId] });
      setEditingDoctor(null);
    },
    onError: () => {
      message.error('Failed to update commission');
    },
  });

  // Set primary mutation
  const setPrimaryMutation = useMutation({
    mutationFn: async (doctorId: string) => {
      return doctorHospitalAPI.setPrimaryHospital(doctorId, hospitalId);
    },
    onSuccess: () => {
      message.success('Primary hospital set');
      queryClient.invalidateQueries({ queryKey: ['doctor-hospitals', hospitalId] });
    },
    onError: () => {
      message.error('Failed to set primary hospital');
    },
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ doctorId, status }: { doctorId: string; status: string }) => {
      return doctorHospitalAPI.updateStatus(doctorId, hospitalId, status);
    },
    onSuccess: () => {
      message.success('Status updated');
      queryClient.invalidateQueries({ queryKey: ['doctor-hospitals', hospitalId] });
    },
    onError: () => {
      message.error('Failed to update status');
    },
  });

  // Remove doctor mutation
  const removeMutation = useMutation({
    mutationFn: async (doctorId: string) => {
      return doctorHospitalAPI.removeDoctor(doctorId, hospitalId);
    },
    onSuccess: () => {
      message.success('Doctor removed from hospital');
      queryClient.invalidateQueries({ queryKey: ['doctor-hospitals', hospitalId] });
    },
    onError: () => {
      message.error('Failed to remove doctor');
    },
  });

  const handleRemove = (doctorId: string, doctorName: string) => {
    Modal.confirm({
      title: 'Remove Doctor',
      content: `Are you sure you want to remove Dr. ${doctorName} from this hospital?`,
      okText: 'Remove',
      okType: 'danger',
      onOk: () => removeMutation.mutate(doctorId),
    });
  };

  const handleCommissionUpdate = (doctorId: string) => {
    if (commissionRate < 0 || commissionRate > 100) {
      message.error('Commission rate must be between 0 and 100');
      return;
    }
    updateCommissionMutation.mutate({ doctorId, rate: commissionRate });
  };

  const getActionMenu = (record: DoctorHospitalAssignment): MenuProps['items'] => [
    {
      key: 'primary',
      icon: <Star size={16} />,
      label: record.isPrimary ? 'Primary Hospital' : 'Set as Primary',
      disabled: record.isPrimary,
      onClick: () => setPrimaryMutation.mutate(record.doctorId),
    },
    {
      type: 'divider',
    },
    {
      key: 'active',
      icon: <CheckCircle size={16} />,
      label: 'Set Active',
      disabled: record.status === 'active',
      onClick: () => updateStatusMutation.mutate({ doctorId: record.doctorId, status: 'active' }),
    },
    {
      key: 'inactive',
      icon: <XCircle size={16} />,
      label: 'Set Inactive',
      disabled: record.status === 'inactive',
      onClick: () => updateStatusMutation.mutate({ doctorId: record.doctorId, status: 'inactive' }),
    },
    {
      type: 'divider',
    },
    {
      key: 'remove',
      icon: <Trash2 size={16} />,
      label: 'Remove',
      danger: true,
      onClick: () => handleRemove(
        record.doctorId, 
        `${record.doctor.user.firstName} ${record.doctor.user.lastName}`
      ),
    },
  ];

  const columns: ColumnsType<DoctorHospitalAssignment> = [
    {
      title: 'Doctor',
      key: 'doctor',
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <Stethoscope size={20} className="text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900 flex items-center gap-2">
              Dr. {record.doctor.user.firstName} {record.doctor.user.lastName}
              {record.isPrimary && (
                <Tooltip title="Primary Hospital">
                  <Star size={14} className="text-yellow-500" fill="currentColor" />
                </Tooltip>
              )}
            </div>
            <div className="text-xs text-gray-500">{record.doctor.licenseNumber}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Specialization',
      dataIndex: ['doctor', 'specialization'],
      key: 'specialization',
      render: (spec) => <Tag color="blue">{spec}</Tag>,
    },
    {
      title: 'Experience',
      dataIndex: ['doctor', 'experienceYears'],
      key: 'experienceYears',
      render: (years) => `${years} years`,
    },
    {
      title: 'Consultation Fee',
      dataIndex: ['doctor', 'consultationFee'],
      key: 'consultationFee',
      render: (fee) => `₹${fee}`,
    },
    {
      title: 'Commission Rate',
      key: 'commissionRate',
      render: (_, record) => (
        <div className="flex items-center gap-2">
          {editingDoctor === record.doctorId ? (
            <Space.Compact>
              <InputNumber
                min={0}
                max={100}
                defaultValue={record.commissionRate}
                onChange={(value) => setCommissionRate(value || 0)}
                suffix="%"
                size="small"
                style={{ width: 80 }}
              />
              <Button
                type="primary"
                size="small"
                onClick={() => handleCommissionUpdate(record.doctorId)}
                loading={updateCommissionMutation.isPending}
              >
                Save
              </Button>
              <Button
                size="small"
                onClick={() => setEditingDoctor(null)}
              >
                Cancel
              </Button>
            </Space.Compact>
          ) : (
            <>
              <span className="font-medium">{record.commissionRate}%</span>
              <Button
                type="link"
                size="small"
                icon={<Edit size={14} />}
                onClick={() => {
                  setEditingDoctor(record.doctorId);
                  setCommissionRate(record.commissionRate);
                }}
              />
            </>
          )}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const config = {
          active: { color: 'success', text: 'Active' },
          inactive: { color: 'default', text: 'Inactive' },
          suspended: { color: 'error', text: 'Suspended' },
        };
        const { color, text } = config[status as keyof typeof config];
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Joined Date',
      dataIndex: 'joinedAt',
      key: 'joinedAt',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 80,
      render: (_, record) => (
        <Dropdown menu={{ items: getActionMenu(record) }} trigger={['click']}>
          <Button type="text" icon={<MoreVertical size={16} />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <Card 
      title={
        <div className="flex items-center gap-2">
          <Stethoscope size={20} />
          <span>Assigned Doctors ({assignments.length})</span>
        </div>
      }
    >
      <Table
        columns={columns}
        dataSource={assignments}
        rowKey="id"
        loading={isLoading}
        pagination={{
          pageSize: 10,
          showTotal: (total) => `Total ${total} doctors`,
        }}
        scroll={{ x: 1200 }}
      />
    </Card>
  );
};