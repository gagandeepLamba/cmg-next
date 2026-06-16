'use client';

import { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Image as ImageIcon,
  Plus,
  X,
  Edit,
  Trash2,
  Upload,
  Eye,
  Download,
  Bell,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search
} from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  attendees: string[];
  images: string[];
  type: 'meeting' | 'appointment' | 'task' | 'reminder' | 'other';
  priority: 'low' | 'medium' | 'high';
  status: 'scheduled' | 'completed' | 'cancelled';
  createdBy: string;
  createdAt: string;
}

interface EventFormData {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  attendees: string[];
  type: Event['type'];
  priority: Event['priority'];
  images: File[];
}

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [events, setEvents] = useState<Event[]>([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(showEventModal ? null : null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    attendees: [],
    type: 'meeting',
    priority: 'medium',
    images: []
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const [apptRes, fuRes] = await Promise.all([
        fetch('/api/appointments?limit=500'),
        fetch('/api/follow-up-reminders'),
      ]);

      const apptData = apptRes.ok ? await apptRes.json() : { appointments: [] };
      const fuData = fuRes.ok ? await fuRes.json() : { reminders: [] };

      const appointmentEvents: Event[] = (apptData.appointments || []).map((a: any): Event => {
        const leadName = `${a.fname || ''} ${a.lname || ''}`.trim() || (a.leadid ? `Lead #${a.leadid}` : 'Walk-in');
        const time = String(a.appointtime || '09:00').slice(0, 5);
        let status: Event['status'] = 'scheduled';
        if (Number(a.done) === 1) status = 'completed';
        else if (Number(a.not_done) === 1) status = 'cancelled';
        return {
          id: `appt-${a.id}`,
          title: `Appointment: ${leadName}`,
          description: a.screenshot || '',
          date: a.date || '',
          startTime: time,
          endTime: time,
          location: a.branchName || '',
          attendees: [leadName, a.counselorName || ''].filter(Boolean),
          images: [],
          type: 'appointment',
          priority: 'medium',
          status,
          createdBy: a.counselorName || '',
          createdAt: '',
        };
      });

      const followUpEvents: Event[] = (fuData.reminders || []).map((r: any): Event => {
        const leadName = `${r.fname || ''} ${r.lname || ''}`.trim() || `Lead #${r.lead_id}`;
        const dt = new Date(r.reminder_date);
        const date = dt.toISOString().split('T')[0];
        const time = dt.toTimeString().slice(0, 5);
        let status: Event['status'] = 'scheduled';
        if (r.status === 'completed') status = 'completed';
        else if (r.status === 'cancelled') status = 'cancelled';
        const priority: Event['priority'] =
          r.priority === 'high' ? 'high' : r.priority === 'low' ? 'low' : 'medium';
        return {
          id: `fu-${r.id}`,
          title: `Follow-up: ${leadName}`,
          description: r.message || '',
          date,
          startTime: time,
          endTime: time,
          location: '',
          attendees: [leadName, r.employeeName || ''].filter(Boolean),
          images: [],
          type: 'reminder',
          priority,
          status,
          createdBy: r.employeeName || '',
          createdAt: r.created_at || '',
        };
      });

      setEvents([...appointmentEvents, ...followUpEvents]);
    } catch {
      setEvents([]);
    }
  };

  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setFormData({
      title: '',
      description: '',
      date: currentDate.toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '10:00',
      location: '',
      attendees: [],
      type: 'meeting',
      priority: 'medium',
      images: []
    });
    setShowEventModal(true);
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      location: event.location,
      attendees: event.attendees,
      type: event.type,
      priority: event.priority,
      images: []
    });
    setShowEventModal(true);
  };

  const handleSaveEvent = async () => {
    try {
      // Upload images first
      const uploadedImages = await uploadImages(formData.images);
      
      const eventData: Event = {
        id: selectedEvent?.id || Date.now().toString(),
        ...formData,
        images: uploadedImages,
        status: 'scheduled',
        createdBy: 'Current User',
        createdAt: new Date().toISOString()
      };

      if (selectedEvent) {
        // Update existing event
        setEvents(events.map(e => e.id === selectedEvent.id ? eventData : e));
      } else {
        // Create new event
        setEvents([...events, eventData]);
      }

      setShowEventModal(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleDeleteEvent = (eventId: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(e => e.id !== eventId));
    }
  };

  const uploadImages = async (files: File[]): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    
    for (const file of files) {
      // Simulate upload - in production, this would upload to your storage service
      await new Promise(resolve => setTimeout(resolve, 1000));
      const url = `/api/placeholder/${file.name}`;
      uploadedUrls.push(url);
    }
    
    return uploadedUrls;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData({ ...formData, images: [...formData.images, ...files] });
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => {
      if (event.date !== dateStr) return false;
      if (filterType !== 'all' && event.type !== filterType) return false;
      if (searchTerm && !event.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    });
  };

  const getTypeColor = (type: Event['type']) => {
    switch (type) {
      case 'meeting': return 'bg-blue-100 text-blue-800';
      case 'appointment': return 'bg-green-100 text-green-800';
      case 'task': return 'bg-purple-100 text-purple-800';
      case 'reminder': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventBgColor = (type: Event['type']) => {
    switch (type) {
      case 'appointment': return '#3B82F6';
      case 'reminder': return '#10B981';
      case 'meeting': return '#6366F1';
      case 'task': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const getPriorityColor = (priority: Event['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Calendar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold text-gray-900">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 rounded-lg text-sm ${
                viewMode === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded-lg text-sm ${
                viewMode === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1 rounded-lg text-sm ${
                viewMode === 'day' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              Day
            </button>
            <button
              onClick={handleCreateEvent}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Event
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="p-4">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-700 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="h-24"></div>;
              }

              const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
              const dayEvents = getEventsForDate(date);
              const isToday = date.toDateString() === new Date().toDateString();

              return (
                <div
                  key={day}
                  className={`h-24 border border-gray-200 rounded-lg p-2 hover:bg-gray-50 cursor-pointer ${
                    isToday ? 'bg-blue-50 border-blue-500' : ''
                  }`}
                >
                  <div className="text-sm font-medium text-gray-900 mb-1">{day}</div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        className="text-xs p-1 rounded truncate cursor-pointer hover:opacity-80"
                        style={{ backgroundColor: getEventBgColor(event.type), color: 'white' }}
                        onClick={() => handleEditEvent(event)}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="appointment">Appointments</option>
            <option value="reminder">Follow-ups</option>
            <option value="meeting">Meetings</option>
            <option value="task">Tasks</option>
          </select>
        </div>
      </div>

      {/* Calendar View */}
      {renderMonthView()}

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedEvent ? 'Edit Event' : 'Create Event'}
                </h3>
                <button
                  onClick={() => setShowEventModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter event title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as Event['type'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="meeting">Meeting</option>
                    <option value="appointment">Appointment</option>
                    <option value="task">Task</option>
                    <option value="reminder">Reminder</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as Event['priority'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter location"
                  />
                </div>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Time *</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Time *</label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter event description"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reference Images</label>
                <div className="space-y-2">
                  {formData.images.map((image, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        <ImageIcon className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{image.name}</span>
                      </div>
                      <button
                        onClick={() => removeImage(index)}
                        className="p-1 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  
                  <div className="flex items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-lg">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">Click to upload images</span>
                      <span className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowEventModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEvent}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {selectedEvent ? 'Update' : 'Create'} Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedImage}
              alt="Event reference image"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
