import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';

// GET handler - Get all system configurations
export async function GET() {
  try {
    const configs = await prisma.systemConfig.findMany();
    
    // Convert to a key-value object for easier use on the client
    const configObject: { [key: string]: string } = {};
    configs.forEach(config => {
      configObject[config.key] = config.value;
    });
    
    return NextResponse.json(configObject);
  } catch (error) {
    console.error('Error fetching system configs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch system configurations' },
      { status: 500 }
    );
  }
}

// PATCH handler - Update system configurations
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
    
    // Update or create each configuration
    const updates = Object.entries(data).map(async ([key, value]) => {
      return prisma.systemConfig.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) }
      });
    });
    
    await Promise.all(updates);
    
    // Fetch and return updated configurations
    const updatedConfigs = await prisma.systemConfig.findMany();
    const configObject: { [key: string]: string } = {};
    updatedConfigs.forEach(config => {
      configObject[config.key] = config.value;
    });
    
    return NextResponse.json(configObject);
  } catch (error) {
    console.error('Error updating system configs:', error);
    return NextResponse.json(
      { error: 'Failed to update system configurations' },
      { status: 500 }
    );
  }
}