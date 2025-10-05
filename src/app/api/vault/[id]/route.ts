import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Vault from '@/models/Vault';
import { getUserFromRequest } from '@/lib/auth';

// PUT - Update vault item
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { encryptedData, salt } = await request.json();

    if (!encryptedData || !salt) {
      return NextResponse.json(
        { error: 'Encrypted data and salt are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const item = await Vault.findOneAndUpdate(
      { _id: id, userId: user.userId },
      { encryptedData, salt },
      { new: true }
    );

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({ item }, { status: 200 });
  } catch (error) {
    console.error('PUT vault error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete vault item
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const item = await Vault.findOneAndDelete({
      _id: id,
      userId: user.userId,
    });

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Item deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('DELETE vault error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}