import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { handleApiError } from '@/lib/api-error'
import { z } from 'zod'

const bookingSchema = z.object({
  userId: z.string().min(1),
  eventId: z.string().optional(),
  date: z.string().datetime(),
  timeSlot: z.string().min(1),
  school: z.string().min(1).max(200),
  studentCount: z.number().int().positive().max(1000),
  notes: z.string().max(1000).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const eventId = searchParams.get('eventId')
    const status = searchParams.get('status')

    const where: any = {}
    if (userId) where.userId = userId
    if (eventId) where.eventId = eventId
    if (status) where.status = status

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            school: true,
          },
        },
        event: true,
      },
      orderBy: {
        date: 'asc',
      },
    })

    return NextResponse.json({ data: bookings })
  } catch (error) {
    const { status, message } = handleApiError(error)
    return NextResponse.json({ error: message }, { status })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validatedData = bookingSchema.parse(body)

    // Check event capacity if eventId is provided
    if (validatedData.eventId) {
      const event = await prisma.event.findUnique({
        where: { id: validatedData.eventId },
      })

      if (!event) {
        return NextResponse.json(
          { error: 'Event not found' },
          { status: 404 }
        )
      }

      const currentBookings = await prisma.booking.count({
        where: {
          eventId: validatedData.eventId,
          status: { in: ['PENDING', 'CONFIRMED'] },
        },
      })

      if (currentBookings + validatedData.studentCount > event.maxCapacity) {
        return NextResponse.json(
          { error: 'Event capacity exceeded' },
          { status: 400 }
        )
      }
    }

    const booking = await prisma.booking.create({
      data: {
        ...validatedData,
        date: new Date(validatedData.date),
      },
      include: {
        event: true,
      },
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    const { status, message } = handleApiError(error)
    return NextResponse.json({ error: message }, { status })
  }
}

