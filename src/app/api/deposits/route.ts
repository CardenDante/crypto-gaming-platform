import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';

// GET handler - Get all deposits or filter by query params
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const username = searchParams.get('username');
    const gameId = searchParams.get('gameId');
    
    const filters: any = {};
    
    if (status) {
      filters.status = status;
    }
    
    if (username) {
      filters.username = { contains: username, mode: 'insensitive' };
    }
    
    if (gameId) {
      filters.gameId = gameId;
    }
    
    const deposits = await prisma.deposit.findMany({
      where: filters,
      include: {
        game: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json(deposits);
  } catch (error) {
    console.error('Error fetching deposits:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deposits' },
      { status: 500 }
    );
  }
}

// POST handler - Create a new deposit
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { gameId, username, amount, paymentMethod } = data;
    
    // Get Bitcoin/Lightning address from system config
    const addressKey = paymentMethod === 'LIGHTNING' ? 'lightning_address' : 'btc_address';
    const addressConfig = await prisma.systemConfig.findUnique({
      where: { key: addressKey },
    });
    
    if (!addressConfig) {
      return NextResponse.json(
        { error: `${addressKey} not configured in system` },
        { status: 400 }
      );
    }
    
    // Create the deposit record
    const deposit = await prisma.deposit.create({
      data: {
        gameId,
        username,
        amount: parseFloat(amount),
        paymentMethod,
        address: addressConfig.value,
        status: 'PENDING',
      },
      include: {
        game: true,
      },
    });
    
    return NextResponse.json(deposit);
  } catch (error) {
    console.error('Error creating deposit:', error);
    return NextResponse.json(
      { error: 'Failed to create deposit' },
      { status: 500 }
    );
  }
}