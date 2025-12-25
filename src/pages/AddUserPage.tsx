// src/pages/users/AddUserPage.tsx
import { hospitalService, userService } from "@/services/userService";
import { Gender, ShiftType, UserRole, UserStatus, isStaffRole } from "@/types/userTypes";
import { UserFormData, userSchema } from "@/utils/userValidation";
import {
  ArrowLeftOutlined,
  HospitalOutlined,
  InfoCircleOutlined,
  LockOutlined,
  PhoneOutlined,
  SaveOutlined,
  UserOutlined
} from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Alert,
  Button,
  Card,
  DatePicker,
  Input,
  InputNumber,
  Select,
  Switch,
  message,
} from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;
const { Option } = Select;

const AddUserPage: React.FC = () => {
  const navigate = useNavigate();
  const [showHospitalAssignment, setShowHospitalAssignment] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: UserRole.PATIENT,
      status: UserStatus.PENDING_VERIFICATION,
      phoneVerified: false,
      emailVerified: false,
      dateOfBirth: dayjs().subtract(25, 'years').format('YYYY-MM-DD'),
    },
  });

  // Fetch hospitals for dropdown
  const { data: hospitals = [], isLoading: hospitalsLoading } = useQuery({
    queryKey: ['hospitals'],
    queryFn: hospitalService.getAllHospitals,
  });

  // Fetch departments when hospital is selected
  const selectedHospitalId = watch('hospitalAssignment.hospitalId');
  const { data: departments = [], isLoading: departmentsLoading } = useQuery({
    queryKey: ['departments', selectedHospitalId],
    queryFn: () => hospitalService.getDepartmentsByHospital(selectedHospitalId!),
    enabled: !!selectedHospitalId,
  });

  const createMutation = useMutation({
    mutationFn: userService.createUser,
    onSuccess: () => {
      message.success({
        content: "User created successfully!",
        duration: 3,
      });
      navigate("/users");
    },
    onError: (error: any) => {
      message.error({
        content: error.response?.data?.message || "Failed to create user",
        duration: 4,
      });
    },
  });

  const onSubmit = (data: UserFormData) => {
    console.log('Submitting data:', data);
    createMutation.mutate(data);
  };

  const selectedRole = watch("role");

  // Show/hide hospital assignment based on role
  useEffect(() => {
    const shouldShow = isStaffRole(selectedRole);
    setShowHospitalAssignment(shouldShow);
    
    if (!shouldShow) {
      setValue('hospitalAssignment', undefined);
    } else {
      if (!watch('hospitalAssignment')) {
        setValue('hospitalAssignment', {
          hospitalId: '',
          isPrimary: true,
        });
      }
    }
  }, [selectedRole, setValue, watch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/users")}
            size="large"
            className="mb-4 hover:bg-white shadow-sm"
          >
            Back to Users
          </Button>

          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 shadow-xl text-white">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <UserOutlined className="text-4xl text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Add New User</h1>
                <p className="text-purple-100 text-lg">
                  Create a new user account in the system
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
                  <span className="text-xl font-bold text-slate-900">
                    Personal Information
                  </span>
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
                        status={errors.firstName ? "error" : ""}
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
                        status={errors.lastName ? "error" : ""}
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
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="dateOfBirth"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(date) => field.onChange(date ? date.format('YYYY-MM-DD') : '')}
                        size="large"
                        className="w-full rounded-lg"
                        format="YYYY-MM-DD"
                        placeholder="Select date of birth"
                        status={errors.dateOfBirth ? "error" : ""}
                      />
                    )}
                  />
                  {errors.dateOfBirth && (
                    <p className="mt-2 text-sm text-red-500 flex items-center">
                      <span className="mr-1">⚠</span> {errors.dateOfBirth.message}
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
                        status={errors.gender ? "error" : ""}
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
                        status={errors.bloodGroup ? "error" : ""}
                      >
                        <Option value="A+">A+</Option>
                        <Option value="A-">A-</Option>
                        <Option value="B+">B+</Option>
                        <Option value="B-">B-</Option>
                        <Option value="AB+">AB+</Option>
                        <Option value="AB-">AB-</Option>
                        <Option value="O+">O+</Option>
                        <Option value="O-">O-</Option>
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
                        status={errors.avatar ? "error" : ""}
                      />
                    )}
                  />
                  {errors.avatar && (
                    <p className="mt-2 text-sm text-red-500 flex items-center">
                      <span className="mr-1">⚠</span> {errors.avatar.message}
                    </p>
                  )}
                </div>
              </div>
            </Card>

            {/* Contact Information */}
            <Card
              className="shadow-lg rounded-2xl border-0"
              title={
                <div className="flex items-center space-x-2 py-2">
                  <PhoneOutlined className="text-green-600 text-xl" />
                  <span className="text-xl font-bold text-slate-900">
                    Contact Information
                  </span>
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
                        status={errors.phone ? "error" : ""}
                      />
                    )}
                  />
                  {errors.phone && (
                    <p className="mt-2 text-sm text-red-500 flex items-center">
                      <span className="mr-1">⚠</span> {errors.phone.message}
                    </p>
                  )}
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
                        status={errors.email ? "error" : ""}
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
                      <div className="font-semibold text-slate-900 mb-1 flex items-center">
                        ✓ Phone Verified
                      </div>
                      <div className="text-xs text-slate-600">
                        Mark phone as verified
                      </div>
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
                      <div className="font-semibold text-slate-900 mb-1 flex items-center">
                        ✓ Email Verified
                      </div>
                      <div className="text-xs text-slate-600">
                        Mark email as verified
                      </div>
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
                  <span className="text-xl font-bold text-slate-900">
                    Account Settings
                  </span>
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
                        placeholder="Select role"
                        status={errors.role ? "error" : ""}
                      >
                        <Option value={UserRole.HOSPITAL_ADMIN}>🏥 Hospital Admin</Option>
                        <Option value={UserRole.DOCTOR}>👨‍⚕️ Doctor</Option>
                        <Option value={UserRole.NURSE}>👩‍⚕️ Nurse</Option>
                        <Option value={UserRole.PHARMACIST}>💊 Pharmacist</Option>
                        <Option value={UserRole.LAB_TECHNICIAN}>🧪 Lab Technician</Option>
                        <Option value={UserRole.RADIOLOGIST}>📈 Radiologist</Option>
                        <Option value={UserRole.RECEPTIONIST}>🖥️ Receptionist</Option>
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
                  {errors.role && (
                    <p className="mt-2 text-sm text-red-500 flex items-center">
                      <span className="mr-1">⚠</span> {errors.role.message}
                    </p>
                  )}
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
                        placeholder="Select status"
                        status={errors.status ? "error" : ""}
                      >
                        <Option value={UserStatus.ACTIVE}>✓ Active</Option>
                        <Option value={UserStatus.INACTIVE}>○ Inactive</Option>
                        <Option value={UserStatus.SUSPENDED}>🔒 Suspended</Option>
                        <Option value={UserStatus.PENDING_VERIFICATION}>⏳ Pending Verification</Option>
                      </Select>
                    )}
                  />
                  {errors.status && (
                    <p className="mt-2 text-sm text-red-500 flex items-center">
                      <span className="mr-1">⚠</span> {errors.status.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Password{" "}
                    <span className="text-slate-400 text-xs">
                      (Optional - will be auto-generated if left empty)
                    </span>
                  </label>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <Input.Password
                        {...field}
                        size="large"
                        placeholder="Enter password (optional)"
                        className="rounded-lg"
                        status={errors.password ? "error" : ""}
                      />
                    )}
                  />
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-500 flex items-center">
                      <span className="mr-1">⚠</span> {errors.password.message}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-slate-500">
                    If no password is provided, a random password will be generated and sent to the user
                  </p>
                </div>

                {selectedRole && (
                  <div className="md:col-span-2 bg-purple-50 border border-purple-200 rounded-xl p-4">
                    <h4 className="font-semibold text-purple-900 mb-2">
                      Role Permissions
                    </h4>
                    <div className="text-sm text-purple-700">
                      {selectedRole === UserRole.HOSPITAL_ADMIN &&
                        "🏥 Hospital management - can manage hospital data, doctors, and appointments"}
                      {selectedRole === UserRole.DOCTOR &&
                        "⚕️ Medical access - can view patients, manage appointments, and update medical records"}
                      {selectedRole === UserRole.PATIENT &&
                        "🤒 Patient access - can view own medical records and book appointments"}
                      {isStaffRole(selectedRole) && selectedRole !== UserRole.DOCTOR &&
                        `👨‍💼 Staff access - can perform duties related to ${selectedRole} role`}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Hospital Assignment - Only for Staff Roles */}
            {showHospitalAssignment && (
              <Card
                className="shadow-lg rounded-2xl border-0 border-2 border-orange-200"
                title={
                  <div className="flex items-center space-x-2 py-2">
                    {/* <HospitalOutlined className="text-orange-600 text-xl" /> */}
                    <span className="text-xl font-bold text-slate-900">
                      Hospital Assignment
                    </span>
                    <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-semibold">
                      Required for Staff
                    </span>
                  </div>
                }
              >
                <Alert
                  message="Hospital assignment is required for all staff roles"
                  description="Please select a hospital and provide role-specific information."
                  type="info"
                  showIcon
                  className="mb-6"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Hospital Selection */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Hospital <span className="text-red-500">*</span>
                    </label>
                    <Controller
                      name="hospitalAssignment.hospitalId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          size="large"
                          className="w-full"
                          placeholder="Select hospital"
                          loading={hospitalsLoading}
                          showSearch
                          filterOption={(input, option) =>
                            (option?.children as string)?.toLowerCase().includes(input.toLowerCase())
                          }
                          status={errors.hospitalAssignment?.hospitalId ? "error" : ""}
                        >
                          {hospitals.map((hospital: any) => (
                            <Option key={hospital.id} value={hospital.id}>
                              🏥 {hospital.name} - {hospital.city}
                            </Option>
                          ))}
                        </Select>
                      )}
                    />
                    {errors.hospitalAssignment?.hospitalId && (
                      <p className="mt-2 text-sm text-red-500 flex items-center">
                        <span className="mr-1">⚠</span> {errors.hospitalAssignment.hospitalId.message}
                      </p>
                    )}
                  </div>

                  {/* Department Selection */}
                  {selectedHospitalId && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Department
                      </label>
                      <Controller
                        name="hospitalAssignment.departmentId"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            size="large"
                            className="w-full"
                            placeholder="Select department (optional)"
                            loading={departmentsLoading}
                            allowClear
                            showSearch
                            filterOption={(input, option) =>
                              (option?.children as string)?.toLowerCase().includes(input.toLowerCase())
                            }
                          >
                            {departments.map((dept: any) => (
                              <Option key={dept.id} value={dept.id}>
                                {dept.name}
                              </Option>
                            ))}
                          </Select>
                        )}
                      />
                    </div>
                  )}

                  {/* Doctor-Specific Fields */}
                  {selectedRole === UserRole.DOCTOR && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Specialization <span className="text-red-500">*</span>
                        </label>
                        <Controller
                          name="hospitalAssignment.specialization"
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              size="large"
                              placeholder="e.g., Cardiology"
                              className="rounded-lg"
                              status={errors.hospitalAssignment?.specialization ? "error" : ""}
                            />
                          )}
                        />
                        {errors.hospitalAssignment?.specialization && (
                          <p className="mt-2 text-sm text-red-500 flex items-center">
                            <span className="mr-1">⚠</span> {errors.hospitalAssignment.specialization.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          License Number <span className="text-red-500">*</span>
                        </label>
                        <Controller
                          name="hospitalAssignment.licenseNumber"
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              size="large"
                              placeholder="e.g., MED12345"
                              className="rounded-lg"
                              status={errors.hospitalAssignment?.licenseNumber ? "error" : ""}
                            />
                          )}
                        />
                        {errors.hospitalAssignment?.licenseNumber && (
                          <p className="mt-2 text-sm text-red-500 flex items-center">
                            <span className="mr-1">⚠</span> {errors.hospitalAssignment.licenseNumber.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Qualification
                        </label>
                        <Controller
                          name="hospitalAssignment.qualification"
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              size="large"
                              placeholder="e.g., MBBS, MD"
                              className="rounded-lg"
                            />
                          )}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Experience (Years)
                        </label>
                        <Controller
                          name="hospitalAssignment.experienceYears"
                          control={control}
                          render={({ field }) => (
                            <InputNumber
                              {...field}
                              size="large"
                              className="w-full rounded-lg"
                              min={0}
                              max={70}
                              placeholder="10"
                            />
                          )}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Consultation Fee (₹)
                        </label>
                        <Controller
                          name="hospitalAssignment.consultationFee"
                          control={control}
                          render={({ field }) => (
                            <InputNumber
                              {...field}
                              size="large"
                              className="w-full rounded-lg"
                              min={0}
                              placeholder="500"
                              formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                              parser={value => value!.replace(/₹\s?|(,*)/g, '')}
                            />
                          )}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Employee ID
                        </label>
                        <Controller
                          name="hospitalAssignment.employeeId"
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              size="large"
                              placeholder="EMP-001"
                              className="rounded-lg"
                            />
                          )}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Bio
                        </label>
                        <Controller
                          name="hospitalAssignment.bio"
                          control={control}
                          render={({ field }) => (
                            <TextArea
                              {...field}
                              rows={3}
                              placeholder="Brief professional bio..."
                              className="rounded-lg"
                            />
                          )}
                        />
                      </div>
                    </>
                  )}

                  {/* Nurse-Specific Fields */}
                  {selectedRole === UserRole.NURSE && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Nursing License Number <span className="text-red-500">*</span>
                        </label>
                        <Controller
                          name="hospitalAssignment.nursingLicenseNumber"
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              size="large"
                              placeholder="e.g., RN-12345"
                              className="rounded-lg"
                              status={errors.hospitalAssignment?.nursingLicenseNumber ? "error" : ""}
                            />
                          )}
                        />
                        {errors.hospitalAssignment?.nursingLicenseNumber && (
                          <p className="mt-2 text-sm text-red-500 flex items-center">
                            <span className="mr-1">⚠</span> {errors.hospitalAssignment.nursingLicenseNumber.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Shift
                        </label>
                        <Controller
                          name="hospitalAssignment.shift"
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              size="large"
                              className="w-full"
                              placeholder="Select shift"
                            >
                              <Option value={ShiftType.MORNING}>🌅 Morning</Option>
                              <Option value={ShiftType.EVENING}>🌆 Evening</Option>
                              <Option value={ShiftType.NIGHT}>🌙 Night</Option>
                              <Option value={ShiftType.ROTATING}>🔄 Rotating</Option>
                            </Select>
                          )}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Employee ID
                        </label>
                        <Controller
                          name="hospitalAssignment.employeeId"
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              size="large"
                              placeholder="EMP-002"
                              className="rounded-lg"
                            />
                          )}
                        />
                      </div>
                    </>
                  )}

                  {/* Pharmacist-Specific Fields */}
                  {selectedRole === UserRole.PHARMACIST && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Pharmacist License Number <span className="text-red-500">*</span>
                        </label>
                        <Controller
                          name="hospitalAssignment.pharmacistLicenseNumber"
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              size="large"
                              placeholder="e.g., PH-12345"
                              className="rounded-lg"
                              status={errors.hospitalAssignment?.pharmacistLicenseNumber ? "error" : ""}
                            />
                          )}
                        />
                        {errors.hospitalAssignment?.pharmacistLicenseNumber && (
                          <p className="mt-2 text-sm text-red-500 flex items-center">
                            <span className="mr-1">⚠</span> {errors.hospitalAssignment.pharmacistLicenseNumber.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Employee ID
                        </label>
                        <Controller
                          name="hospitalAssignment.employeeId"
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              size="large"
                              placeholder="EMP-003"
                              className="rounded-lg"
                            />
                          )}
                        />
                      </div>
                    </>
                  )}

                  {/* Lab Technician-Specific Fields */}
                  {selectedRole === UserRole.LAB_TECHNICIAN && (
                    <>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Lab Certifications
                        </label>
                        <Controller
                          name="hospitalAssignment.labCertifications"
                          control={control}
                          render={({ field }) => (
                            <TextArea
                              {...field}
                              rows={2}
                              placeholder="List certifications..."
                              className="rounded-lg"
                            />
                          )}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Employee ID
                        </label>
                        <Controller
                          name="hospitalAssignment.employeeId"
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              size="large"
                              placeholder="EMP-004"
                              className="rounded-lg"
                            />
                          )}
                        />
                      </div>
                    </>
                  )}

                  {/* Other Staff Roles */}
                  {(selectedRole === UserRole.RECEPTIONIST || 
                    selectedRole === UserRole.FRONT_DESK ||
                    selectedRole === UserRole.BILLING_STAFF ||
                    selectedRole === UserRole.RADIOLOGIST) && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Employee ID
                      </label>
                      <Controller
                        name="hospitalAssignment.employeeId"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            size="large"
                            placeholder="EMP-XXX"
                            className="rounded-lg"
                          />
                        )}
                      />
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-4">
              <Button
                size="large"
                onClick={() => navigate("/users")}
                className="px-8 h-12 rounded-lg"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                loading={createMutation.isPending}
                icon={<SaveOutlined />}
                className="px-8 h-12 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 border-0 shadow-lg hover:shadow-xl"
              >
                {createMutation.isPending ? "Creating..." : "Create User"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserPage;