// src/pages/appointments/AppointmentCalendar.tsx
import { appointmentsAPI } from '@/services/appointments.service';
import { AppointmentStatus, type Appointment } from '@/types/appointment.types';
import { useQuery } from '@tanstack/react-query';
import { Button, Card, Col, Row, Select, Tag } from 'antd';
import { ArrowLeft, List } from 'lucide-react';
import moment from 'moment';
import { useMemo, useState } from 'react';
import { Calendar, momentLocalizer, type View } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useNavigate } from 'react-router-dom';

const localizer = momentLocalizer(moment);

export const AppointmentCalendar: React.FC = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<View>('month');
  const [date, setDate] = useState(new Date());
  const [filterStatus, setFilterStatus] = useState<string>('');

  const startDate = moment(date).startOf('month').subtract(7, 'days').format('YYYY-MM-DD');
  const endDate = moment(date).endOf('month').add(7, 'days').format('YYYY-MM-DD');

  const { data } = useQuery({
    queryKey: ['appointments', 'calendar', startDate, endDate],
    queryFn: () => appointmentsAPI.getCalendarEvents({ startDate, endDate }),
  });

  const appointments = data?.data || [];

  const events = useMemo(() => {
    let filtered = appointments;
    if (filterStatus) {
      filtered = appointments.filter((apt: Appointment) => apt.status === filterStatus);
    }

    return filtered.map((apt: Appointment) => {
      const start = new Date(`${apt.appointmentDate}T${apt.startTime}`);
      const end = new Date(`${apt.appointmentDate}T${apt.endTime}`);

      return {
        id: apt.id,
        title: `${apt.patient?.firstName} ${apt.patient?.lastName} - Dr. ${apt.doctor?.user?.firstName}`,
        start,
        end,
        resource: apt,
      };
    });
  }, [appointments, filterStatus]);

  const eventStyleGetter = (event: any) => {
    const apt = event.resource as Appointment;
    const colors: Record<AppointmentStatus, string> = {
      [AppointmentStatus.SCHEDULED]: '#1890ff',
      [AppointmentStatus.CONFIRMED]: '#52c41a',
      [AppointmentStatus.IN_PROGRESS]: '#722ed1',
      [AppointmentStatus.COMPLETED]: '#52c41a',
      [AppointmentStatus.CANCELLED]: '#ff4d4f',
      [AppointmentStatus.NO_SHOW]: '#faad14',
      [AppointmentStatus.RESCHEDULED]: '#fa8c16',
    };

    return {
      style: {
        backgroundColor: colors[apt.status] || '#1890ff',
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button icon={<ArrowLeft size={18} />} onClick={() => navigate('/appointments')} />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Appointment Calendar</h1>
            <p className="text-sm text-gray-500 mt-1">View appointments in calendar</p>
          </div>
        </div>
        <Button icon={<List size={18} />} onClick={() => navigate('/appointments')}>
          List View
        </Button>
      </div>

      <Card>
        <Row gutter={16} className="mb-4">
          <Col span={6}>
            <Select
              placeholder="Filter by status"
              value={filterStatus || undefined}
              onChange={(value) => setFilterStatus(value || '')}
              allowClear
              size="large"
              className="w-full"
            >
              <Select.Option value={AppointmentStatus.SCHEDULED}>Scheduled</Select.Option>
              <Select.Option value={AppointmentStatus.CONFIRMED}>Confirmed</Select.Option>
              <Select.Option value={AppointmentStatus.IN_PROGRESS}>In Progress</Select.Option>
              <Select.Option value={AppointmentStatus.COMPLETED}>Completed</Select.Option>
              <Select.Option value={AppointmentStatus.CANCELLED}>Cancelled</Select.Option>
            </Select>
          </Col>
          <Col span={18}>
            <div className="flex gap-2 flex-wrap">
              <Tag color="#1890ff">Scheduled</Tag>
              <Tag color="#52c41a">Confirmed</Tag>
              <Tag color="#722ed1">In Progress</Tag>
              <Tag color="#52c41a">Completed</Tag>
              <Tag color="#ff4d4f">Cancelled</Tag>
              <Tag color="#faad14">No Show</Tag>
              <Tag color="#fa8c16">Rescheduled</Tag>
            </div>
          </Col>
        </Row>

        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          onSelectEvent={(event) => navigate(`/appointments/${event.id}`)}
          eventPropGetter={eventStyleGetter}
        />
      </Card>
    </div>
  );
};