import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, Tag, Space, Button, Input, Select, Modal, message, Tooltip, Skeleton, Empty } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useQueryState, parseAsInteger, parseAsString, parseAsBoolean } from 'nuqs';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
  SearchOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  MedicineBoxOutlined,
  FilterOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { hospitalService } from '@/services/hospitalService';
import { Hospital } from '@/types';

const { Option } = Select;

const HospitalListPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Server-side filter state using nuqs
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [limit, setLimit] = useQueryState('limit', parseAsInteger.withDefault(10));
  const [search, setSearch] = useQueryState('search', parseAsString.withDefault(''));
  const [state, setState] = useQueryState('state', parseAsString);
  const [emergencyService, setEmergencyService] = useQueryState('emergency', parseAsBoolean);
  const [ambulanceService, setAmbulanceService] = useQueryState('ambulance', parseAsBoolean);

  // Fetch hospitals with server-side filters
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['hospitals', { page, limit, search, state, emergencyService, ambulanceService }],
    queryFn: () => hospitalService.getAllHospitals({
      page,
      limit,
      search: search || undefined,
      state: state || undefined,
      emergencyService: emergencyService ?? undefined,
      ambulanceService: ambulanceService ?? undefined,
    }),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: hospitalService.deleteHospital,
    onSuccess: () => {
      message.success('Hospital deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['hospitals'] });
    },
    onError: () => {
      message.error('Failed to delete hospital');
    },
  });

  const handleDelete = (id: string, name: string) => {
    Modal.confirm({
      title: 'Delete Hospital',
      content: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => deleteMutation.mutate(id),
    });
  };

  const handleClearFilters = () => {
    setSearch('');
    setState(null);
    setEmergencyService(null);
    setAmbulanceService(null);
    setPage(1);
  };

  const columns: ColumnsType<Hospital> = [
    {
      title: 'Hospital',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      width: 280,
      render: (text, record) => (
        <div className="flex items-start space-x-3 py-2">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <MedicineBoxOutlined className="text-white text-xl" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-slate-900 text-base truncate">{text}</div>
            <div className="text-xs text-slate-500 mt-0.5 font-mono">{record.licenseNumber}</div>
            {record.establishedYear && (
              <div className="text-xs text-slate-400 mt-0.5">Est. {record.establishedYear}</div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'Location',
      key: 'location',
      width: 220,
      render: (_, record) => (
        <div className="space-y-1.5">
          <div className="flex items-center text-sm text-slate-700 font-medium">
            <EnvironmentOutlined className="mr-2 text-blue-500" />
            {record.city}, {record.state}
          </div>
          <div className="text-xs text-slate-500 pl-6">{record.zipCode}</div>
        </div>
      ),
    },
    {
      title: 'Contact',
      key: 'contact',
      width: 220,
      render: (_, record) => (
        <div className="space-y-1.5">
          <div className="flex items-center text-xs text-slate-600">
            <PhoneOutlined className="mr-2 text-green-500" />
            <span className="font-medium">{record.phone}</span>
          </div>
          <div className="flex items-center text-xs text-slate-600 truncate">
            <MailOutlined className="mr-2 text-blue-500" />
            <span className="truncate">{record.email}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Bed Availability',
      key: 'beds',
      width: 180,
      align: 'center',
      render: (_, record) => {
        const percentage = (record.availableBeds / record.totalBeds) * 100;
        const getColor = () => {
          if (percentage > 50) return 'from-emerald-500 to-green-600';
          if (percentage > 20) return 'from-amber-500 to-orange-600';
          return 'from-red-500 to-rose-600';
        };
        
        return (
          <div>
            <div className="text-2xl font-bold text-slate-900">
              {record.availableBeds}<span className="text-sm text-slate-400">/{record.totalBeds}</span>
            </div>
            <div className="text-xs text-slate-500 mb-2">beds available</div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div 
                className={`bg-gradient-to-r ${getColor()} h-2 rounded-full transition-all duration-500 shadow-sm`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        );
      },
    },
    {
      title: 'Services',
      key: 'services',
      width: 160,
      render: (_, record) => (
        <div className="flex flex-col gap-1.5">
          {record.emergencyService && (
            <Tag color="red" className="text-xs font-medium m-0">
              🚨 Emergency 24/7
            </Tag>
          )}
          {record.ambulanceService && (
            <Tag color="blue" className="text-xs font-medium m-0">
              🚑 Ambulance
            </Tag>
          )}
          {!record.emergencyService && !record.ambulanceService && (
            <span className="text-xs text-slate-400">No special services</span>
          )}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      align: 'center',
      render: (status) => {
        const config = {
          ACTIVE: { color: 'success', text: 'Active', icon: '●' },
          INACTIVE: { color: 'default', text: 'Inactive', icon: '○' },
          SUSPENDED: { color: 'error', text: 'Suspended', icon: '⊗' },
        };
        const statusConfig = config[status as keyof typeof config];
        
        return (
          <Tag color={statusConfig?.color} className="font-medium">
            {statusConfig?.icon} {statusConfig?.text}
          </Tag>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 140,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button 
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/hospitals/${record.id}`)}
              className="hover:bg-blue-50 hover:text-blue-600"
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button 
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => navigate(`/hospitals/edit/${record.id}`)}
              className="hover:bg-amber-50 hover:text-amber-600"
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button 
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id, record.name)}
              className="hover:bg-red-50"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const hasActiveFilters = search || state || emergencyService !== null || ambulanceService !== null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-2">
                Hospital Management
              </h1>
              <p className="text-slate-600 text-lg">
                Manage and monitor all registered healthcare facilities
              </p>
            </div>
            <Button 
              type="primary" 
              size="large"
              icon={<PlusOutlined />}
              onClick={() => navigate('/hospitals/add')}
              className="h-12 px-6 shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-blue-600 to-indigo-600 border-0 font-semibold"
            >
              Add New Hospital
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
              <div className="text-sm text-slate-600 mb-1">Total Hospitals</div>
              <div className="text-2xl font-bold text-slate-900">
                {data?.pagination.totalItems || 0}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
              <div className="text-sm text-slate-600 mb-1">Active</div>
              <div className="text-2xl font-bold text-green-600">
                {data?.records.filter(h => h.status === 'ACTIVE').length || 0}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
              <div className="text-sm text-slate-600 mb-1">Total Beds</div>
              <div className="text-2xl font-bold text-blue-600">
                {data?.records.reduce((sum, h) => sum + h.totalBeds, 0) || 0}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
              <div className="text-sm text-slate-600 mb-1">Available Beds</div>
              <div className="text-2xl font-bold text-emerald-600">
                {data?.records.reduce((sum, h) => sum + h.availableBeds, 0) || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <FilterOutlined className="text-slate-600" />
              <span className="font-semibold text-slate-900">Filters</span>
              {hasActiveFilters && (
                <Tag color="blue" className="ml-2">Active</Tag>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                size="small"
                icon={<ReloadOutlined spin={isFetching} />}
                onClick={() => refetch()}
                disabled={isFetching}
              >
                Refresh
              </Button>
              {hasActiveFilters && (
                <Button 
                  size="small"
                  onClick={handleClearFilters}
                >
                  Clear All
                </Button>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              placeholder="Search by name, license, email..."
              prefix={<SearchOutlined className="text-slate-400" />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="large"
              allowClear
              className="rounded-lg"
            />
            
            <Select
              placeholder="Filter by State"
              size="large"
              allowClear
              value={state}
              onChange={(value) => {
                setState(value);
                setPage(1);
              }}
              className="w-full"
            >
              <Option value="Maharashtra">Maharashtra</Option>
              <Option value="Karnataka">Karnataka</Option>
              <Option value="Delhi">Delhi</Option>
              <Option value="Tamil Nadu">Tamil Nadu</Option>
              <Option value="Gujarat">Gujarat</Option>
              <Option value="Rajasthan">Rajasthan</Option>
            </Select>
            
            <Select
              placeholder="Emergency Service"
              size="large"
              allowClear
              value={emergencyService}
              onChange={(value) => {
                setEmergencyService(value);
                setPage(1);
              }}
              className="w-full"
            >
              <Option value={true}>Available</Option>
              <Option value={false}>Not Available</Option>
            </Select>
            
            <Select
              placeholder="Ambulance Service"
              size="large"
              allowClear
              value={ambulanceService}
              onChange={(value) => {
                setAmbulanceService(value);
                setPage(1);
              }}
              className="w-full"
            >
              <Option value={true}>Available</Option>
              <Option value={false}>Not Available</Option>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <Table
            columns={columns}
            dataSource={data?.records || []}
            rowKey="id"
            loading={{
              spinning: isLoading,
              indicator: <Skeleton active paragraph={{ rows: 5 }} />,
            }}
            scroll={{ x: 1400 }}
            locale={{
              emptyText: (
                <Empty
                  description={
                    <span className="text-slate-500">
                      {hasActiveFilters 
                        ? "No hospitals found matching your filters" 
                        : "No hospitals registered yet"}
                    </span>
                  }
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ),
            }}
            pagination={{
              current: page,
              pageSize: limit,
              total: data?.pagination.totalItems,
              showSizeChanger: true,
              showTotal: (total, range) => (
                <span className="text-sm text-slate-600">
                  Showing {range[0]}-{range[1]} of {total} hospitals
                </span>
              ),
              onChange: (newPage, newPageSize) => {
                setPage(newPage);
                if (newPageSize !== limit) {
                  setLimit(newPageSize);
                }
              },
              pageSizeOptions: ['10', '20', '50', '100'],
              className: 'px-6 py-4',
            }}
            className="hospital-table"
          />
        </div>
      </div>
      
      <style>{`
        .hospital-table .ant-table-thead > tr > th {
          background: linear-gradient(to bottom, #f8fafc, #f1f5f9);
          font-weight: 600;
          color: #1e293b;
          border-bottom: 2px solid #e2e8f0;
        }
        
        .hospital-table .ant-table-tbody > tr {
          transition: all 0.2s ease;
        }
        
        .hospital-table .ant-table-tbody > tr:hover {
          background: #f8fafc;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        
        .hospital-table .ant-table-cell {
          border-bottom: 1px solid #f1f5f9;
        }
      `}</style>
    </div>
  );
};

export default HospitalListPage;