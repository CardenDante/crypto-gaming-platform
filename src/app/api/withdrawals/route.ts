import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';

// GET handler - Get all withdrawals or filter by query params
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
    
    const withdrawals = await prisma.withdrawal.findMany({
      where: filters,
      include: {
        game: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json(withdrawals);
  } catch (error) {
    console.error('Error fetching withdrawals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch withdrawals' },
      { status: 500 }
    );
  }
}

// POST handler - Create a new withdrawal request
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { gameId, username, amount, walletType, walletAddress } = data;
    
    // Get network fee from system config
    const networkFeeConfig = await prisma.systemConfig.findUnique({
      where: { key: 'network_fee' },
    });
    
    const networkFee = networkFeeConfig 
      ? parseFloat(networkFeeConfig.value)
      : 0.0001;
    
    const amountFloat = parseFloat(amount);
    const netAmount = Math.max(0, amountFloat - networkFee);
    
    // Create the withdrawal record
    const withdrawal = await prisma.withdrawal.create({
      data: {
        gameId,
        username,
        amount: amountFloat,
        netAmount,
        walletType,
        walletAddress,
        status: 'PENDING',
      },
      include: {
        game: true,
      },
    });
    
    return NextResponse.json(withdrawal);
  } catch (error) {
    console.error('Error creating withdrawal:', error);
    return NextResponse.json(
      { error: 'Failed to create withdrawal request' },
      { status: 500 }
    );
  }
}