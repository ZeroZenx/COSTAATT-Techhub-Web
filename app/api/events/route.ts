import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { handleApiError } from '@/lib/api-error'
import { z } from 'zod'

const eventSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  type: z.enum(['WORKSHOP', 'DEMO', 'TOUR', 'VENDOR_SESSION', 'CHALLENGE']),
  vendorId: z.string().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  maxCapacity: z.number().int().positive().max(1000),
  location: z.string().min(1).max(200),
  imageUrl: z.string().url().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    const events = await prisma.event.findMany({
      include: {
        vendor: true,
      },
      orderBy: {
        startDate: 'asc',
      },
      take: Math.min(limit, 100),
      skip: offset,
    })

    const total = await prisma.event.count()

    return NextResponse.json({
      data: events,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    })
  } catch (error) {
    const { status, message } = handleApiError(error)
    return NextResponse.json({ error: message }, { status })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validatedData = eventSchema.parse(body)
    
    // Check if end date is after start date
    if (new Date(validatedData.endDate) <= new Date(validatedData.startDate)) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      )
    }

    const event = await prisma.event.create({
      data: {
        ...validatedData,
        startDate: new Date(validatedData.startDate),
        endDate: new Date(validatedData.endDate),
      },
    })

    return NextResponse.json(event, { status: 201 })
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

