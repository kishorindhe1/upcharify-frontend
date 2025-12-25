import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Input, InputNumber, Select, Button, message, Card, Skeleton, Alert, Switch } from 'antd';
import { userSchema, UserFormData } from '@/utils/userValidation';
import { userService } from '@/services/userService';
import { UserRole, UserStatus, Gender } from '@/types/userTypes';
import { 
  ArrowLeftOutlined, 
  SaveOutlined,
  PhoneOutlined,
  EditOutlined,
  InfoCircleOutlined,
  LockOutlined
} from '@ant-design/icons';

const { Option } = Select;

const EditUserPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  
  const { control, handleSubmit, formState: { errors }, watch, reset } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  // Fetch user data
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', id],
    queryFn: () => userService.getUserById(id!),
    enabled: !!id,
  });

  // Update form when data is loaded
  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        email: user.email,
        age: user.age,
        gender: user.gender,
        bloodGroup: user.bloodGroup as "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | undefined,
        avatar: user.avatar,
        role: user.role,
        status: user.status,
        phoneVerified: user.phoneVerified,
        emailVerified: user.emailVerified,
      });
    }
  }, [user, reset]);

  const updateMutation = useMutation({
    mutationFn: (data: UserFormData) => userService.updateUser(id!, data),
    onSuccess: () => {
      message.success({
        content: 'User updated successfully!',
        duration: 3,
      });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', id] });
      navigate('/users');
    },
    onError: (error: any) => {
      message.error({
        content: error.response?.data?.message || 'Failed to update user',
        duration: 4,
      });
    },
  });

  const onSubmit = (data: UserFormData) => {
    updateMutation.mutate(data);
  };

  const selectedRole = watch('role');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-6">
        <div className="max-w-5xl mx-auto">
          <Skeleton active paragraph={{ rows: 20 }} />
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-6">
        <div className="max-w-5xl mx-auto">
          <Alert
            message="Error"
            description="Failed to load user data. Please try again."
            type="error"
            showIcon
            action={
              <Button onClick={() => navigate('/users')}>
                Back to List
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  const fullName = user.firstName && user.lastName 
    ? `${user.firstName} ${user.lastName}`
    : user.name || 'Unknown User';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button 
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/users')}
            size="large"
            className="mb-4 hover:bg-white shadow-sm"
          >
            Back to Users
          </Button>
          
          <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-8 shadow-xl text-white">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <EditOutlined className="text-4xl text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Edit User</h1>
                <p className="text-violet-100 text-lg">
                  Update information for {fullName}
                </p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            {/* Personal Information */}
            <Card 
              className="shadow-lg rounded-2xl border-0"
              title={
                <div className="flex items-center space-x-2 py-2">
                  <InfoCircleOutlined className="text-purple-600 text-xl" />
                  <span className="text-xl font-bold text-slate-900">Personal Information</span>
                </div>
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="firstName"
                    control={control}
                    render={({ field }) => (
                      <Input 
                        {...field} 
                        size="large" 
                        placeholder="John"
                        className="rounded-lg"
                        status={errors.firstName ? 'error' : ''}
                      />
                    )}
                  />
                  {errors.firstName && (
                    <p className="mt-2 text-sm text-red-500 flex items-center">
                      <span className="mr-1">⚠</span> {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="lastName"
                    control={control}
                    render={({ field }) => (
                      <Input 
                        {...field} 
                        size="large" 
                        placeholder="Doe"
                        className="rounded-lg"
                        status={errors.lastName ? 'error' : ''}
                      />
                    )}
                  />
                  {errors.lastName && (
                    <p className="mt-2 text-sm text-red-500 flex items-center">
                      <span className="mr-1">⚠</span> {errors.lastName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Age
                  </label>
                  <Controller
                    name="age"
                    control={control}
                    render={({ field }) => (
                      <InputNumber 
                        {...field} 
                        size="large" 
                        className="w-full rounded-lg" 
                        min={1} 
                        max={150}
                        placeholder="25"
                        status={errors.age ? 'error' : ''}
                      />
                    )}
                  />
                  {errors.age && (
                    <p className="mt-2 text-sm text-red-500 flex items-center">
                      <span className="mr-1">⚠</span> {errors.age.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Gender
                  </label>
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <Select 
                        {...field} 
                        size="large"
                        className="w-full"
                        placeholder="Select gender"
                        status={errors.gender ? 'error' : ''}
                      >
                        <Option value={Gender.MALE}>👨 Male</Option>
                        <Option value={Gender.FEMALE}>👩 Female</Option>
                        <Option value={Gender.OTHER}>👤 Other</Option>
                      </Select>
                    )}
                  />
                  {errors.gender && (
                    <p className="mt-2 text-sm text-red-500 flex items-center">
                      <span className="mr-1">⚠</span> {errors.gender.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Blood Group
                  </label>
                  <Controller
                    name="bloodGroup"
                    control={control}
                    render={({ field }) => (
                      <Select 
                        {...field} 
                        size="large"
                        className="w-full"
                        placeholder="Select blood group"
                        status={errors.bloodGroup ? 'error' : ''}
                      >
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                          <Option key={bg} value={bg}>{bg}</Option>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.bloodGroup && (
                    <p className="mt-2 text-sm text-red-500 flex items-center">
                      <span className="mr-1">⚠</span> {errors.bloodGroup.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Avatar URL
                  </label>
                  <Controller
                    name="avatar"
                    control={control}
                    render={({ field }) => (
                      <Input 
                        {...field} 
                        size="large" 
                        placeholder="https://example.com/avatar.jpg"
                        className="rounded-lg"
                        status={errors.avatar ? 'error' : ''}
                      />
                    )}
                  />
                </div>
              </div>
            </Card>

            {/* Contact Information */}
            <Card 
              className="shadow-lg rounded-2xl border-0"
              title={
                <div className="flex items-center space-x-2 py-2">
                  <PhoneOutlined className="text-green-600 text-xl" />
                  <span className="text-xl font-bold text-slate-900">Contact Information</span>
                </div>
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <Input 
                        {...field} 
                        size="large" 
                        placeholder="+919876543210"
                        className="rounded-lg"
                        status={errors.phone ? 'error' : ''}
                        disabled
                      />
                    )}
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    Phone number cannot be changed
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email Address
                  </label>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <Input 
                        {...field} 
                        type="email" 
                        size="large" 
                        placeholder="john.doe@example.com"
                        className="rounded-lg"
                        status={errors.email ? 'error' : ''}
                      />
                    )}
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-500 flex items-center">
                      <span className="mr-1">⚠</span> {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-900 mb-1">✓ Phone Verified</div>
                      <div className="text-xs text-slate-600">Mark phone as verified</div>
                    </div>
                    <Controller
                      name="phoneVerified"
                      control={control}
                      render={({ field }) => (
                        <Switch 
                          {...field} 
                          checked={field.value} 
                          size="default"
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-900 mb-1">✓ Email Verified</div>
                      <div className="text-xs text-slate-600">Mark email as verified</div>
                    </div>
                    <Controller
                      name="emailVerified"
                      control={control}
                      render={({ field }) => (
                        <Switch 
                          {...field} 
                          checked={field.value} 
                          size="default"
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Account Settings */}
            <Card 
              className="shadow-lg rounded-2xl border-0"
              title={
                <div className="flex items-center space-x-2 py-2">
                  <LockOutlined className="text-orange-600 text-xl" />
                  <span className="text-xl font-bold text-slate-900">Account Settings</span>
                </div>
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                      <Select 
                        {...field} 
                        size="large"
                        className="w-full"
                        status={errors.role ? 'error' : ''}
                      >
                        
<Option value={UserRole.HOSPITAL_ADMIN}>🏥 Hospital Admin</Option>
      <Option value={UserRole.DOCTOR}>👨‍⚕️ Doctor</Option>
      <Option value={UserRole.NURSE}>👩‍⚕️ Nurse</Option>
      <Option value={UserRole.PHARMACIST}>💊 Pharmacist</Option>
      <Option value={UserRole.LAB_TECHNICIAN}>🧪 Lab Technician</Option>
      <Option value={UserRole.RADIOLOGIST}>📈 Radiologist</Option>
      <Option value={UserRole.RECEPTIONIST}>🖥️ Receptionist / Front Desk</Option>
      <Option value={UserRole.FRONT_DESK}>📋 Front Desk</Option>
      <Option value={UserRole.BILLING_STAFF}>💳 Billing Staff</Option>
      <Option value={UserRole.PATIENT}>👤 Patient</Option>
      <Option value={UserRole.RECIPIENT}>🤲 Recipient</Option>
      <Option value={UserRole.CAREGIVER}>🧑‍🤝‍🧑 Caregiver</Option>
      <Option value={UserRole.IT_SUPPORT}>🛠️ IT Support</Option>
      <Option value={UserRole.AUDITOR}>🔍 Auditor</Option>                        
                      </Select>
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select 
                        {...field} 
                        size="large"
                        className="w-full"
                        status={errors.status ? 'error' : ''}
                      >
                        <Option value={UserStatus.ACTIVE}>✓ Active</Option>
                        <Option value={UserStatus.INACTIVE}>○ Inactive</Option>
                        <Option value={UserStatus.SUSPENDED}>🔒 Suspended</Option>
                        <Option value={UserStatus.PENDING_VERIFICATION}>⏳ Pending</Option>
                      </Select>
                    )}
                  />
                </div>

                {selectedRole && (
                  <div className="md:col-span-2 bg-purple-50 border border-purple-200 rounded-xl p-4">
                    <h4 className="font-semibold text-purple-900 mb-2">Role Permissions</h4>
                    <div className="text-sm text-purple-700">
                      {selectedRole === UserRole.HOSPITAL_ADMIN && '🏥 Hospital management access'}
                      {selectedRole === UserRole.DOCTOR && '⚕️ Medical access'}
                      {selectedRole === UserRole.PATIENT && '🤒 Patient access'}
                      {selectedRole === UserRole.RECIPIENT && '💉 Recipient access'}

                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-4">
              <Button 
                size="large" 
                onClick={() => navigate('/users')}
                className="px-8 h-12 rounded-lg"
              >
                Cancel
              </Button>
              <Button 
                type="primary" 
                size="large"
                htmlType="submit"
                loading={updateMutation.isPending}
                icon={<SaveOutlined />}
                className="px-8 h-12 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 border-0 shadow-lg hover:shadow-xl"
              >
                {updateMutation.isPending ? 'Updating...' : 'Update User'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserPage;