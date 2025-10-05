import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Vault from '@/models/Vault';
import { getUserFromRequest } from '@/lib/auth';

// GET - List all vault items for user
export async function GET(request: Request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const items = await Vault.find({ userId: user.userId }).sort({ createdAt: -1 });

    return NextResponse.json({ items }, { status: 200 });
  } catch (error) {
    console.error('GET vault error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new vault item
export async function POST(request: Request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { encryptedData, salt } = await request.json();

    if (!encryptedData || !salt) {
      return NextResponse.json(
        { error: 'Encrypted data and salt are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const item = await Vault.create({
      userId: user.userId,
      encryptedData,
      salt,
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    console.error('POST vault error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}