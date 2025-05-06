import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';

// Update transaction status (for both deposits and withdrawals)
export async function PATCH(request: NextRequest) {
  try {
    // Check admin authentication
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const data = await request.json();
    const { id, type, status, txId, notes } = data;
    
    if (!id || !type || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Update deposit or withdrawal based on type
    if (type === 'deposit') {
      const updated = await prisma.deposit.update({
        where: { id },
        data: {
          status,
          txId: txId || undefined,
          notes: notes || undefined,
        },
        include: {
          game: true,
        },
      });
      
      return NextResponse.json(updated);
    } else if (type === 'withdrawal') {
      const updated = await prisma.withdrawal.update({
        where: { id },
        data: {
          status,
          txId: txId || undefined,
          notes: notes || undefined,
        },
        include: {
          game: true,
        },
      });
      
      return NextResponse.json(updated);
    } else {
      return NextResponse.json(
        { error: 'Invalid transaction type' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json(
      { error: 'Failed to update transaction' },
      { status: 500 }
    );
  }
}