import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Card, Button, Statistic, Row, Col } from 'antd';
import {
  MedicineBoxOutlined,
  UserOutlined,
  HeartOutlined,
  TrophyOutlined,
} from '@ant-design/icons';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  return (
    <div className="p-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">
          Welcome back, <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">{user?.name}</span>!
        </h1>
        <p className="text-slate-600 text-lg">Here's what's happening in your hospital network today</p>
      </div>

      {/* Stats Grid */}
      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} sm={12} lg={6}>
          <div className="medical-card hover:scale-105 transition-transform cursor-pointer" onClick={() => navigate('/hospitals')}>
            <Statistic
              title="Total Hospitals"
              value={48}
              prefix={<MedicineBoxOutlined className="text-teal-600" />}
              valueStyle={{ color: '#0f766e' }}
            />
            <div className="mt-2 text-xs text-slate-500">+3 this month</div>
          </div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <div className="medical-card border-l-purple-500 hover:scale-105 transition-transform cursor-pointer">
            <Statistic
              title="Active Patients"
              value={1284}
              prefix={<UserOutlined className="text-purple-600" />}
              valueStyle={{ color: '#7c3aed' }}
            />
            <div className="mt-2 text-xs text-slate-500">+12% from last week</div>
          </div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <div className="medical-card border-l-orange-500 hover:scale-105 transition-transform cursor-pointer">
            <Statistic
              title="Available Beds"
              value={2341}
              prefix={<HeartOutlined className="text-orange-600" />}
              valueStyle={{ color: '#ea580c' }}
            />
            <div className="mt-2 text-xs text-slate-500">67% occupancy</div>
          </div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <div className="medical-card border-l-cyan-500 hover:scale-105 transition-transform cursor-pointer">
            <Statistic
              title="Success Rate"
              value={96.8}
              suffix="%"
              prefix={<TrophyOutlined className="text-cyan-600" />}
              valueStyle={{ color: '#0891b2' }}
            />
            <div className="mt-2 text-xs text-slate-500">Above industry avg</div>
          </div>
        </Col>
      </Row>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card 
          hoverable
          className="shadow-lg border-t-4 border-teal-500"
          onClick={() => navigate('/hospitals/add')}
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
              <MedicineBoxOutlined className="text-2xl text-teal-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Add Hospital</h3>
              <p className="text-sm text-slate-600">Register a new facility</p>
            </div>
          </div>
        </Card>

        <Card 
          hoverable
          className="shadow-lg border-t-4 border-purple-500"
          onClick={() => navigate('/hospitals')}
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-slate-800">View All Hospitals</h3>
              <p className="text-sm text-slate-600">Manage existing facilities</p>
            </div>
          </div>
        </Card>

        <Card 
          hoverable
          className="shadow-lg border-t-4 border-cyan-500"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Analytics</h3>
              <p className="text-sm text-slate-600">View detailed reports</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card title="Recent Activity" className="shadow-lg">
        <div className="space-y-4">
          {[
            { hospital: 'City Care Hospital', action: 'Bed availability updated', time: '2 minutes ago', color: 'teal' },
            { hospital: 'Metro Health Center', action: 'New patient admitted', time: '15 minutes ago', color: 'purple' },
            { hospital: 'Downtown Medical', action: 'Emergency service activated', time: '1 hour ago', color: 'orange' },
            { hospital: 'Central Hospital', action: 'Staff roster updated', time: '3 hours ago', color: 'cyan' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
              <div className="flex items-center space-x-4">
                <div className={`w-2 h-2 bg-${activity.color}-500 rounded-full`}></div>
                <div>
                  <p className="font-semibold text-slate-800">{activity.hospital}</p>
                  <p className="text-sm text-slate-600">{activity.action}</p>
                </div>
              </div>
              <p className="text-xs text-slate-500">{activity.time}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;
