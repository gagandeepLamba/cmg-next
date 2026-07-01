import { NextRequest, NextResponse } from 'next/server'
import { Appointments } from '@/models'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const appointment = await Appointments.findByPk(id, {
      include: [
        {
          association: 'lead',
          attributes: ['id', 'fname', 'lname', 'phone', 'email']
        },
        {
          association: 'counselor',
          attributes: ['id', 'name']
        }
      ]
    })

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(appointment)
  } catch (error) {
    console.error('Error fetching appointment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()

    const appointment = await Appointments.findByPk(id)

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      )
    }

    await appointment.update(normalizeAppointmentPayload(data))

    // Reload with associations
    const updatedAppointment = await Appointments.findByPk(id, {
      include: [
        {
          association: 'lead',
          attributes: ['id', 'fname', 'lname', 'phone', 'email']
        },
        {
          association: 'counselor',
          attributes: ['id', 'name']
        }
      ]
    })

    return NextResponse.json(updatedAppointment)
  } catch (error) {
    console.error('Error updating appointment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function normalizeAppointmentPayload(data: Record<string, any>) {
  const normalized = { ...data };

  if (normalized.leadId !== undefined && normalized.leadid === undefined) normalized.leadid = normalized.leadId;
  if (normalized.counselorId !== undefined && normalized.counsilorid === undefined) normalized.counsilorid = normalized.counselorId;
  if (normalized.employeeId !== undefined && normalized.counsilorid === undefined) normalized.counsilorid = normalized.employeeId;
  if (normalized.appointtime || normalized.time) normalized.appointtime = normalizeTime(normalized.appointtime || normalized.time);
  if (normalized.booked !== undefined) normalized.booked = Number(normalized.booked);
  if (normalized.done !== undefined) normalized.done = Number(normalized.done);
  if (normalized.not_done !== undefined) normalized.not_done = Number(normalized.not_done);
  if (normalized.second_done !== undefined) normalized.second_done = Number(normalized.second_done);

  delete normalized.leadId;
  delete normalized.counselorId;
  delete normalized.employeeId;
  delete normalized.time;

  return normalized;
}

function normalizeTime(value: unknown): string {
  const time = String(value || '09:00').trim();
  if (/^\d{2}:\d{2}:\d{2}$/.test(time)) return time;
  if (/^\d{2}:\d{2}$/.test(time)) return `${time}:00`;
  return '09:00:00';
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const appointment = await Appointments.findByPk(id)

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      )
    }

    await appointment.destroy()

    return NextResponse.json({ message: 'Appointment deleted successfully' })
  } catch (error) {
    console.error('Error deleting appointment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
