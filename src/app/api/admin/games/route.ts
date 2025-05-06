import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';

// GET handler - Get all games
export async function GET() {
  try {
    const games = await prisma.game.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    
    return NextResponse.json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json(
      { error: 'Failed to fetch games' },
      { status: 500 }
    );
  }
}

// POST handler - Create a new game
export async function POST(request: NextRequest) {
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
    const { name, slug, active } = data;
    
    // Check if game with this slug already exists
    const existingGame = await prisma.game.findUnique({
      where: { slug },
    });
    
    if (existingGame) {
      return NextResponse.json(
        { error: 'A game with this slug already exists' },
        { status: 400 }
      );
    }
    
    // Create the new game
    const game = await prisma.game.create({
      data: {
        name,
        slug,
        active: active ?? true,
      },
    });
    
    return NextResponse.json(game);
  } catch (error) {
    console.error('Error creating game:', error);
    return NextResponse.json(
      { error: 'Failed to create game' },
      { status: 500 }
    );
  }
}

// PATCH handler - Update a game
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
    const { id, name, slug, active } = data;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Game ID is required' },
        { status: 400 }
      );
    }
    
    // Check if another game with this slug exists
    if (slug) {
      const existingGame = await prisma.game.findFirst({
        where: {
          slug,
          id: { not: id },
        },
      });
      
      if (existingGame) {
        return NextResponse.json(
          { error: 'Another game with this slug already exists' },
          { status: 400 }
        );
      }
    }
    
    // Update the game
    const updatedGame = await prisma.game.update({
      where: { id },
      data: {
        name: name ?? undefined,
        slug: slug ?? undefined,
        active: active !== undefined ? active : undefined,
      },
    });
    
    return NextResponse.json(updatedGame);
  } catch (error) {
    console.error('Error updating game:', error);
    return NextResponse.json(
      { error: 'Failed to update game' },
      { status: 500 }
    );
  }
}

// DELETE handler - Delete a game
export async function DELETE(request: NextRequest) {
  try {
    // Check admin authentication
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Game ID is required' },
        { status: 400 }
      );
    }
    
    // Check if game has transactions
    const depositCount = await prisma.deposit.count({
      where: { gameId: id },
    });
    
    const withdrawalCount = await prisma.withdrawal.count({
      where: { gameId: id },
    });
    
    if (depositCount > 0 || withdrawalCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete game with existing transactions' },
        { status: 400 }
      );
    }
    
    // Delete the game
    await prisma.game.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting game:', error);
    return NextResponse.json(
      { error: 'Failed to delete game' },
      { status: 500 }
    );
  }
}