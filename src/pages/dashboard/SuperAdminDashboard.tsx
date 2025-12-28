// src/pages/dashboard/SuperAdminDashboard.tsx
import { Column, Line } from '@ant-design/plots';
import { useQuery } from '@tanstack/react-query';
import { Card, Col, Empty, Progress, Row, Spin, Statistic, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  Activity,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardStats {
  overview: {
    totalHospitals: number;
    activeHospitals: number;
    totalDoctors: number;
    totalPatients: number;
    totalAppointments: number;
    todayAppointments: number;
    totalRevenue: number;
    monthlyRevenue: number;
  };
  recentHospitals: Array<{
    id: string;
    name: string;
    city: string;
    status: string;
    createdAt: string;
  }>;
  recentAppointments: Array<{
    id: string;
    patientName: string;
    doctorName: string;
    hospitalName: string;
    date: string;
    status: string;
  }>;
  revenueData: Array<{
    month: string;
    revenue: number;
    commission: number;
  }>;
  appointmentTrends: Array<{
    date: string;
    count: number;
  }>;
}

export const SuperAdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Mock data - replace with actual API call
  const { data: dashboardData, isLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      // Replace with actual API call
      return {
        overview: {
          totalHospitals: 45,
          activeHospitals: 42,
          totalDoctors: 320,
          totalPatients: 1250,
          totalAppointments: 2890,
          todayAppointments: 67,
          totalRevenue: 4567890,
          monthlyRevenue: 456789,
        },
        recentHospitals: [
          {
            id: '1',
            name: 'Apollo Hospital',
            city: 'Mumbai',
            status: 'active',
            createdAt: '2025-12-20',
          },
          {
            id: '2',
            name: 'Fortis Hospital',
            city: 'Delhi',
            status: 'pending',
            createdAt: '2025-12-22',
          },
        ],
        recentAppointments: [
          {
            id: '1',
            patientName: 'John Doe',
            doctorName: 'Dr. Smith',
            hospitalName: 'Apollo Hospital',
            date: '2025-12-28',
            status: 'scheduled',
          },
        ],
        revenueData: [
          { month: 'Jan', revenue: 350000, commission: 42000 },
          { month: 'Feb', revenue: 380000, commission: 45600 },
          { month: 'Mar', revenue: 420000, commission: 50400 },
          { month: 'Apr', revenue: 390000, commission: 46800 },
          { month: 'May', revenue: 450000, commission: 54000 },
          { month: 'Jun', revenue: 480000, commission: 57600 },
        ],
        appointmentTrends: [
          { date: '2025-12-22', count: 45 },
          { date: '2025-12-23', count: 52 },
          { date: '2025-12-24', count: 38 },
          { date: '2025-12-25', count: 28 },
          { date: '2025-12-26', count: 55 },
          { date: '2025-12-27', count: 61 },
          { date: '2025-12-28', count: 67 },
        ],
      };
    },
  });

  const stats = dashboardData?.overview;

  const hospitalColumns: ColumnsType<any> = [
    {
      title: 'Hospital Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <a onClick={() => navigate(`/hospitals/${record.id}`)} className="text-primary-600 hover:text-primary-700">
          {text}
        </a>
      ),
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const config = {
          active: { color: 'success', text: 'Active' },
          pending: { color: 'warning', text: 'Pending' },
          inactive: { color: 'default', text: 'Inactive' },
        };
        const { color, text } = config[status as keyof typeof config] || config.pending;
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  const appointmentColumns: ColumnsType<any> = [
    {
      title: 'Patient',
      dataIndex: 'patientName',
      key: 'patientName',
    },
    {
      title: 'Doctor',
      dataIndex: 'doctorName',
      key: 'doctorName',
    },
    {
      title: 'Hospital',
      dataIndex: 'hospitalName',
      key: 'hospitalName',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const config = {
          scheduled: { color: 'blue', text: 'Scheduled' },
          completed: { color: 'success', text: 'Completed' },
          cancelled: { color: 'error', text: 'Cancelled' },
        };
        const { color, text } = config[status as keyof typeof config] || config.scheduled;
        return <Tag color={color}>{text}</Tag>;
      },
    },
  ];

  const revenueConfig = {
    data: dashboardData?.revenueData || [],
    xField: 'month',
    yField: 'revenue',
    seriesField: 'type',
    isGroup: true,
    columnStyle: {
      radius: [8, 8, 0, 0],
    },
  };

  const appointmentTrendConfig = {
    data: dashboardData?.appointmentTrends || [],
    xField: 'date',
    yField: 'count',
    smooth: true,
    point: {
      size: 5,
      shape: 'circle',
    },
    label: {
      style: {
        fill: '#aaa',
      },
    },
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Overview Stats */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Hospitals"
              value={stats?.totalHospitals}
              prefix={<Building2 size={20} className="text-primary-600" />}
              suffix={
                <div className="text-xs text-gray-500">
                  <span className="text-green-600">{stats?.activeHospitals}</span> active
                </div>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Doctors"
              value={stats?.totalDoctors}
              prefix={<Users size={20} className="text-blue-600" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Appointments"
              value={stats?.totalAppointments}
              prefix={<Calendar size={20} className="text-purple-600" />}
              suffix={
                <div className="text-xs text-gray-500">
                  <span className="text-blue-600">{stats?.todayAppointments}</span> today
                </div>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={stats?.totalRevenue}
              prefix={<DollarSign size={20} className="text-green-600" />}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
              suffix={
                <div className="text-xs text-gray-500">
                  ₹{stats?.monthlyRevenue?.toLocaleString()} this month
                </div>
              }
            />
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Revenue Trends" className="h-full">
            <Column {...revenueConfig} height={300} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Appointment Trends" className="h-full">
            <Line {...appointmentTrendConfig} height={300} />
          </Card>
        </Col>
      </Row>

      {/* Activity Stats */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Completion Rate</span>
                <CheckCircle size={16} className="text-green-600" />
              </div>
              <Progress percent={87} strokeColor="#52c41a" />
              <p className="text-xs text-gray-500">87% appointments completed</p>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Hospitals</span>
                <Activity size={16} className="text-blue-600" />
              </div>
              <Progress percent={93} strokeColor="#1890ff" />
              <p className="text-xs text-gray-500">93% hospitals active</p>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pending Reviews</span>
                <Clock size={16} className="text-orange-600" />
              </div>
              <Progress percent={12} strokeColor="#faad14" />
              <p className="text-xs text-gray-500">5 hospitals pending</p>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Platform Health</span>
                <TrendingUp size={16} className="text-green-600" />
              </div>
              <Progress percent={95} strokeColor="#52c41a" />
              <p className="text-xs text-gray-500">All systems operational</p>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            title="Recent Hospitals"
            extra={
              <a onClick={() => navigate('/hospitals')} className="text-primary-600">
                View All
              </a>
            }
          >
            {dashboardData?.recentHospitals && dashboardData.recentHospitals.length > 0 ? (
              <Table
                columns={hospitalColumns}
                dataSource={dashboardData.recentHospitals}
                rowKey="id"
                pagination={false}
                size="small"
              />
            ) : (
              <Empty description="No recent hospitals" />
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title="Recent Appointments"
            extra={
              <a onClick={() => navigate('/appointments')} className="text-primary-600">
                View All
              </a>
            }
          >
            {dashboardData?.recentAppointments && dashboardData.recentAppointments.length > 0 ? (
              <Table
                columns={appointmentColumns}
                dataSource={dashboardData.recentAppointments}
                rowKey="id"
                pagination={false}
                size="small"
              />
            ) : (
              <Empty description="No recent appointments" />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};