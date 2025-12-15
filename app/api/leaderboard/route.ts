import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const leaderboard = await prisma.leaderboard.findMany({
      orderBy: {
        points: 'desc',
      },
      take: 100,
    })
    return NextResponse.json(leaderboard)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 })
  }
}

