import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { AuthOption } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(AuthOption);
  if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { movieId, type } = await req.json();
  const watchlist = await prisma.watchlist.create({
    data: {
      movieId,
      type,
      userId: session.user.id,
    },
  });

  return NextResponse.json(watchlist);
}

// NEW DELETE handler
export async function DELETE(req: Request) {
  const session = await getServerSession(AuthOption);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  await prisma.watchlist.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
