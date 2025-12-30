// src/components/hospitals/AssignDoctors.tsx
import { doctorHospitalAPI } from '@/services/doctor-hospital';
import { doctorsAPI } from '@/services/doctor.service';
import { DoctorStatus, type Doctor } from '@/types/doctor.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    Button,
    Input,
    message,
    Modal,
    Select,
    Space,
    Table,
    Tag
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Building2, Search, Stethoscope, UserPlus } from 'lucide-react';
import { useState } from 'react';

interface AssignDoctorsProps {
  hospitalId: string;
  hospitalName: string;
}

interface DoctorHospital {
  doctorId: string;
  hospitalId: string;
  commissionRate: number;
  isPrimary: boolean;
  status: 'active' | 'inactive' | 'suspended';
}

export const AssignDoctors: React.FC<AssignDoctorsProps> = ({ hospitalId, hospitalName }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctors, setSelectedDoctors] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialization, setSpecialization] = useState('');

  const queryClient = useQueryClient();

  // Fetch all doctors
  const { data: doctorsData, isLoading: loadingDoctors } = useQuery({
    queryKey: ['doctors', 'all'],
    queryFn: () => doctorsAPI.list({ limit: 1000, status: DoctorStatus.ACTIVE }),
  });

  // Fetch doctors already assigned to this hospital
  const { data: assignedData, isLoading: loadingAssigned } = useQuery({
    queryKey: ['doctor-hospitals', hospitalId],
    queryFn: () => doctorHospitalAPI.getHospitalDoctors(hospitalId),
  });

  const doctors = doctorsData?.doctors || [];
  const assignedDoctorIds = assignedData?.map((d: any) => d.doctorId) || [];

  // Filter available doctors (not yet assigned)
  const availableDoctors = doctors.filter((doctor: Doctor) => {
    const isAssigned = assignedDoctorIds.includes(doctor.id);
    const matchesSearch = doctor.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpec = !specialization || doctor.specialization === specialization;
    
    return !isAssigned && matchesSearch && matchesSpec;
  });

  // Mutation to assign doctors
  const assignMutation = useMutation({
    mutationFn: async (data: DoctorHospital) => {
      return doctorHospitalAPI.assignDoctor(data);
    },
    onSuccess: () => {
      message.success('Doctor assigned successfully');
      queryClient.invalidateQueries({ queryKey: ['doctor-hospitals', hospitalId] });
      queryClient.invalidateQueries({ queryKey: ['hospital-doctors', hospitalId] });
    },
    onError: () => {
      message.error('Failed to assign doctor');
    },
  });

  const handleAssign = async () => {
    if (selectedDoctors.length === 0) {
      message.warning('Please select at least one doctor');
      return;
    }

    try {
      // Assign each selected doctor
      for (const doctorId of selectedDoctors) {
        await assignMutation.mutateAsync({
          doctorId,
          hospitalId,
          commissionRate: 10, // Default 10%
          isPrimary: false,
          status: 'active',
        });
      }
      
      setSelectedDoctors([]);
      setIsModalOpen(false);
      message.success(`${selectedDoctors.length} doctor(s) assigned successfully`);
    } catch (error) {
      // Error already handled by mutation
    }
  };

  const columns: ColumnsType<Doctor> = [
    {
      title: 'Doctor',
      key: 'doctor',
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <Stethoscope size={20} className="text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">
              Dr. {record.user?.firstName} {record.user?.lastName}
            </div>
            <div className="text-xs text-gray-500">{record.licenseNumber}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Specialization',
      dataIndex: 'specialization',
      key: 'specialization',
      render: (spec) => <Tag color="blue">{spec}</Tag>,
    },
    {
      title: 'Experience',
      dataIndex: 'experienceYears',
      key: 'experienceYears',
      render: (years) => `${years} years`,
    },
    {
      title: 'Fee',
      dataIndex: 'consultationFee',
      key: 'consultationFee',
      render: (fee) => `₹${fee}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status}
        </Tag>
      ),
    },
  ];

  const specializations = ['Cardiology', 'Orthopedics', 'Pediatrics', 'Gynecology', 'General Medicine', 'Neurology', 'Dermatology', 'ENT', 'Ophthalmology', 'Psychiatry'];

  return (
    <>
      <Button
        type="primary"
        icon={<UserPlus size={18} />}
        onClick={() => setIsModalOpen(true)}
      >
        Assign Doctors
      </Button>

      <Modal
        title={
          <div className="flex items-center gap-2">
            <Building2 size={20} className="text-blue-600" />
            <span>Assign Doctors to {hospitalName}</span>
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        width={900}
        footer={[
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>,
          <Button
            key="assign"
            type="primary"
            onClick={handleAssign}
            loading={assignMutation.isPending}
            disabled={selectedDoctors.length === 0}
          >
            Assign {selectedDoctors.length > 0 ? `(${selectedDoctors.length})` : ''} Doctor(s)
          </Button>,
        ]}
      >
        <div className="space-y-4">
          {/* Filters */}
          <Space size="middle" className="w-full">
            <Input
              placeholder="Search doctors..."
              prefix={<Search size={16} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 250 }}
              allowClear
            />
            <Select
              placeholder="Filter by specialization"
              value={specialization || undefined}
              onChange={setSpecialization}
              style={{ width: 200 }}
              allowClear
            >
              {specializations.map(spec => (
                <Select.Option key={spec} value={spec}>
                  {spec}
                </Select.Option>
              ))}
            </Select>
          </Space>

          {/* Doctors Table */}
          <Table
            columns={columns}
            dataSource={availableDoctors}
            rowKey="id"
            loading={loadingDoctors}
            pagination={{
              pageSize: 5,
              showSizeChanger: false,
              showTotal: (total) => `${total} available doctors`,
            }}
            rowSelection={{
              selectedRowKeys: selectedDoctors,
              onChange: (keys) => setSelectedDoctors(keys as string[]),
            }}
            size="small"
          />
        </div>
      </Modal>
    </>
  );
};