import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';

// Maximum length allowed for imageUrl (adjust based on your DB schema)
const MAX_IMAGE_URL_LENGTH = 255; // Standard VARCHAR length in most DBs

// GET handler - Get all promotions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('activeOnly') === 'true';
    
    const filters: any = {};
    if (activeOnly) {
      filters.active = true;
    }
    
    const promotions = await prisma.promotion.findMany({
      where: filters,
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json(promotions);
  } catch (error) {
    console.error('Error fetching promotions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch promotions' },
      { status: 500 }
    );
  }
}

// POST handler - Create a new promotion
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
    const { title, description, imageUrl, active } = data;
    
    // Validate imageUrl length if provided
    if (imageUrl && imageUrl.length > MAX_IMAGE_URL_LENGTH) {
      return NextResponse.json(
        { error: `Image URL must be less than ${MAX_IMAGE_URL_LENGTH} characters` },
        { status: 400 }
      );
    }
    
    // Create the promotion
    const promotion = await prisma.promotion.create({
      data: {
        title,
        description,
        imageUrl: imageUrl || null,
        active: active ?? true,
      },
    });
    
    return NextResponse.json(promotion);
  } catch (error) {
    console.error('Error creating promotion:', error);
    return NextResponse.json(
      { error: 'Failed to create promotion' },
      { status: 500 }
    );
  }
}

// PATCH handler - Update a promotion
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
    const { id, title, description, imageUrl, active } = data;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Promotion ID is required' },
        { status: 400 }
      );
    }
    
    // Validate imageUrl length if provided
    if (imageUrl !== undefined && imageUrl !== null && imageUrl.length > MAX_IMAGE_URL_LENGTH) {
      return NextResponse.json(
        { error: `Image URL must be less than ${MAX_IMAGE_URL_LENGTH} characters` },
        { status: 400 }
      );
    }
    
    // Update the promotion
    const updatedPromotion = await prisma.promotion.update({
      where: { id },
      data: {
        title: title ?? undefined,
        description: description ?? undefined,
        imageUrl: imageUrl !== undefined ? imageUrl : undefined,
        active: active !== undefined ? active : undefined,
      },
    });
    
    return NextResponse.json(updatedPromotion);
  } catch (error) {
    console.error('Error updating promotion:', error);
    return NextResponse.json(
      { error: 'Failed to update promotion' },
      { status: 500 }
    );
  }
}

// DELETE handler - Delete a promotion
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
        { error: 'Promotion ID is required' },
        { status: 400 }
      );
    }
    
    // Delete the promotion
    await prisma.promotion.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting promotion:', error);
    return NextResponse.json(
      { error: 'Failed to delete promotion' },
      { status: 500 }
    );
  }
}