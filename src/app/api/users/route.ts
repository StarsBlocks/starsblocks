import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/lib/types";

// GET /api/users - Get all users
export async function GET() {
  const { db } = await connectToDatabase();
  const users = await db.collection<User>("users").find().toArray();
  return NextResponse.json(users);
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  const { db } = await connectToDatabase();
  const body = await request.json();

  if (!body.email || !body.password || !body.name) {
    return NextResponse.json(
      { error: "Faltan campos requeridos" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(body.password, 10);

  const user: User = {
    wallet: body.wallet,
    email: body.email,
    password: hashedPassword,
    name: body.name,
    role: body.role || "user",
    createdAt: new Date(),
  };

  const result = await db.collection<User>("users").insertOne(user);
  const { password, ...userWithoutPassword } = user;
  return NextResponse.json(
    { ...userWithoutPassword, _id: result.insertedId },
    { status: 201 }
  );
}
