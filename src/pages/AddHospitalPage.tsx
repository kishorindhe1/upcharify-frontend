import { hospitalService } from '@/services/hospitalService';
import { HospitalFormData, hospitalSchema } from '@/utils/validation';
import {
  ArrowLeftOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
  MedicineBoxOutlined,
  SaveOutlined
} from '@ant-design/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Button, Card, Divider, Input, InputNumber, message, Switch } from 'antd';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;

const AddHospitalPage: React.FC = () => {
  const navigate = useNavigate();
  
  const { control, handleSubmit, formState: { errors }, watch } = useForm<HospitalFormData>({
    resolver: zodResolver(hospitalSchema),
    defaultValues: {
      emergencyService: true,
      ambulanceService: true,
      country: 'India',
    },
  });

  const createMutation = useMutation({
    mutationFn: hospitalService.createHospital,
    onSuccess: () => {
      message.success({
        content: 'Hospital registered successfully!',
        duration: 3,
      });
      navigate('/hospitals');
    },
    onError: (error: any) => {
      message.error({
        content: error.response?.data?.message || 'Failed to register hospital',
        duration: 4,
      });
    },
  });

  const onSubmit = (data: HospitalFormData) => {
    createMutation.mutate(data);
  };

  const totalBeds = watch('totalBeds');
  const availableBeds = watch('availableBeds');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button 
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/hospitals')}
            size="large"
            className="mb-4 hover:bg-white shadow-sm"
          >
            Back to Hospitals
          </Button>
          
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 shadow-xl text-white">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <MedicineBoxOutlined className="text-4xl text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Register New Hospital</h1>
                <p className="text-blue-100 text-lg">
                  Add a new healthcare facility to the management system
                </p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            {/* Basic Information */}
            <Card 
              className="shadow-lg rounded-2xl border-0"
              title={
                <div className="flex items-center space-x-2 py-2">
                  <InfoCircleOutlined className="text-blue-600 text-xl" />
                  <span className="text-xl font-bold text-slate-900">Basic Information</span>
                </div>
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Hospital Name <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <Input 
                        {...field} 
                        size="large" 
                        placeholder="e.g., Apollo Hospital"
                        className="rounded-lg"
                        status={errors.name ? 'error' : ''}
                      />
                    )}
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-500 flex items-center">
                      <span className="mr-1">⚠</span> {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    License Number <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="licenseNumber"
                    control={control}
                    render={({ field }) => (
                      <Input 
                        {...field} 
                        size="large" 
                        placeholder="e.g., KA-HOSP-2023-001234"
                        className="rounded-lg font-mono"
                        status={errors.licenseNumber ? 'error' : ''}
                      />
                    )}
                  />
                  {errors.licenseNumber && (
                    <p className="mt-2 text-sm text-red-500 flex items-center">
                      <span className="mr-1">⚠</span> {errors.licenseNumber.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Established Year <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="establishedYear"
                    control={control}
                    render={({ field }) => (
                      <InputNumber 
                        {...field} 
                        size="large" 
                        className="w-full rounded-lg" 
                        min={1800} 
                        max={new Date().getFullYear()}
                        placeholder="e.g., 1995"
                        status={errors.establishedYear ? 'error' : ''}
                      />
                    )}
                  />
                  {errors.establishedYear && (
                    <p className="mt-2 text-sm text-red-500 flex items-center">
                      <span className="mr-1">⚠</span> {errors.establishedYear.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <Input 
                        {...field} 
                        type="email" 
                        size="large" 
                        placeholder="contact@hospital.com"
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
                        placeholder="9876543210"
                        className="rounded-lg"
                        maxLength={10}
                        status={errors.phone ? 'error' : ''}
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
                    Website <span className="text-slate-400 text-xs">(Optional)</span>
                  </label>
                  <Controller
                    name="website"
                    control={control}
                    render={({ field }) => (
                      <Input 
                        {...field} 
                        size="large" 
                        placeholder="https://www.hospital.com"
                        className="rounded-lg"
                        status={errors.website ? 'error' : ''}
                      />
                    )}
                  />
                  {errors.website && (
                    <p className="mt-2 text-sm text-red-500 flex items-center">
                      <span className="mr-1">⚠</span> {errors.website.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Description <span className="text-slate-400 text-xs">(Optional)</span>
                  </label>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <TextArea 
                        {...field} 
                        rows={4} 
                        placeholder="Brief description about the hospital, specialties, accreditations..."
                        className="rounded-lg"
                        status={errors.description ? 'error' : ''}
                        showCount
                        maxLength={500}
                      />
                    )}
                  />
                  {errors.description && (
                    <p className="mt-2 text-sm text-red-500 flex items-center">
                      <span className="mr-1">⚠</span> {errors.description.message}
                    </p>
                  )}
                </div>
              </div>
            </Card>

            {/* Location Details */}
            <Card 
              className="shadow-lg rounded-2xl border-0"
              title={
                <div className="flex items-center space-x-2 py-2">
                  <EnvironmentOutlined className="text-green-600 text-xl" />
                  <span className="text-xl font-bold text-slate-900">Location Details</span>
                </div>
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="address"
                    control={control}
                    render={({ field }) => (
                      <Input 
                        {...field} 
                        size="large" 
                        placeholder="123 MG Road, Near Central Mall"
                        className="rounded-lg"
                        status={errors.address ? 'error' : ''}
                      />
                    )}
                  />
                  {errors.address && (
                    <p className="mt-2 text-sm text-red-500 flex items-center">
                      <span className="mr-1">⚠</span> {errors.address.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="city"
                    control={control}
                    render={({ field }) => (
                      <Input 
                        {...field} 
                        size="large" 
                        placeholder="e.g., Bengaluru"
                        className="rounded-lg"
                        status={errors.city ? 'error' : ''}
                      />
                    )}
                  />
                  {errors.city && (
                    <p className="mt-2 text-sm text-red-500 flex items-center">
                      <span className="mr-1">⚠</span> {errors.city.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    State <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="state"
                    control={control}
                    render={({ field }) => (
                      <Input 
                        {...field} 
                        size="large" 
                        placeholder="e.g., Karnataka"
                        className="rounded-lg"
                        status={errors.state ? 'error' : ''}
                      />
                    )}
                  />
                  {errors.state && (
                    <p className="mt-2 text-sm text-red-500 flex items-center">
                      <span className="mr-1">⚠</span> {errors.state.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="country"
                    control={control}
                    render={({ field }) => (
                      <Input 
                        {...field} 
                        size="large" 
                        placeholder="India"
                        className="rounded-lg"
                        status={errors.country ? 'error' : ''}
                      />
                    )}
                  />
                  {errors.country && (
                    <p className="mt-2 text-sm text-red-500 flex items-center">
                      <span className="mr-1">⚠</span> {errors.country.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    ZIP Code <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="zipCode"
                    control={control}
                    render={({ field }) => (
                      <Input 
                        {...field} 
                        size="large" 
                        placeholder="560001"
                        className="rounded-lg"
                        maxLength={6}
                        status={errors.zipCode ? 'error' : ''}
                      />
                    )}
                  />
                  {errors.zipCode && (
                    <p className="mt-2 text-sm text-red-500 flex items-center">
                      <span className="mr-1">⚠</span> {errors.zipCode.message}
                    </p>
                  )}
                </div>

                <Divider className="md:col-span-2 my-2">
                  <span className="text-slate-500 text-sm">GPS Coordinates</span>
                </Divider>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Latitude <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="latitude"
                    control={control}
                    render={({ field }) => (
                      <InputNumber 
                        {...field} 
                        size="large" 
                        className="w-full rounded-lg" 
                        step={0.0001} 
                        placeholder="12.9716"
                        status={errors.latitude ? 'error' : ''}
                      />
                    )}
                  />
                  {errors.latitude && (
                    <p className="mt-2 text-sm text-red-500 flex items-center">
                      <span className="mr-1">⚠</span> {errors.latitude.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Longitude <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="longitude"
                    control={control}
                    render={({ field }) => (
                      <InputNumber 
                        {...field} 
                        size="large" 
                        className="w-full rounded-lg" 
                        step={0.0001} 
                        placeholder="77.5946"
                        status={errors.longitude ? 'error' : ''}
                      />
                    )}
                  />
                  {errors.longitude && (
                    <p className="mt-2 text-sm text-red-500 flex items-center">
                      <span className="mr-1">⚠</span> {errors.longitude.message}
                    </p>
                  )}
                </div>
              </div>
            </Card>

            {/* Facility Details */}
            <Card 
              className="shadow-lg rounded-2xl border-0"
              title={
                <div className="flex items-center space-x-2 py-2">
                  <MedicineBoxOutlined className="text-purple-600 text-xl" />
                  <span className="text-xl font-bold text-slate-900">Facility Details</span>
                </div>
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Total Beds <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="totalBeds"
                    control={control}
                    render={({ field }) => (
                      <InputNumber 
                        {...field} 
                        size="large" 
                        className="w-full rounded-lg" 
                        min={1} 
                        placeholder="250"
                        status={errors.totalBeds ? 'error' : ''}
                      />
                    )}
                  />
                  {errors.totalBeds && (
                    <p className="mt-2 text-sm text-red-500 flex items-center">
                      <span className="mr-1">⚠</span> {errors.totalBeds.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Available Beds <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="availableBeds"
                    control={control}
                    render={({ field }) => (
                      <InputNumber 
                        {...field} 
                        size="large" 
                        className="w-full rounded-lg" 
                        min={0} 
                        placeholder="75"
                        status={errors.availableBeds ? 'error' : ''}
                      />
                    )}
                  />
                  {errors.availableBeds && (
                    <p className="mt-2 text-sm text-red-500 flex items-center">
                      <span className="mr-1">⚠</span> {errors.availableBeds.message}
                    </p>
                  )}
                </div>

                {totalBeds && availableBeds !== undefined && (
                  <div className="md:col-span-2">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">Bed Occupancy</span>
                        <span className="text-sm font-bold text-blue-600">
                          {((availableBeds / totalBeds) * 100).toFixed(1)}% Available
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all"
                          style={{ width: `${(availableBeds / totalBeds) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                <Divider className="md:col-span-2 my-2">
                  <span className="text-slate-500 text-sm">Additional Services</span>
                </Divider>

                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-5 border border-red-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-900 mb-1 flex items-center">
                        🚨 Emergency Service
                      </div>
                      <div className="text-xs text-slate-600">24/7 emergency care</div>
                    </div>
                    <Controller
                      name="emergencyService"
                      control={control}
                      render={({ field }) => (
                        <Switch 
                          {...field} 
                          checked={field.value} 
                          size="default"
                          className="bg-slate-300"
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-900 mb-1 flex items-center">
                        🚑 Ambulance Service
                      </div>
                      <div className="text-xs text-slate-600">Emergency ambulance available</div>
                    </div>
                    <Controller
                      name="ambulanceService"
                      control={control}
                      render={({ field }) => (
                        <Switch 
                          {...field} 
                          checked={field.value} 
                          size="default"
                          className="bg-slate-300"
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-4">
              <Button 
                size="large" 
                onClick={() => navigate('/hospitals')}
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
                className="px-8 h-12 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 border-0 shadow-lg hover:shadow-xl"
              >
                {createMutation.isPending ? 'Registering...' : 'Register Hospital'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHospitalPage;