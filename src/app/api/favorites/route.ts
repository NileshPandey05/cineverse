import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { AuthOption } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(AuthOption);
  if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { movieId, type } = await req.json();
  const fav = await prisma.favorite.create({
    data: {
      movieId,
      type,
      userId: session.user.id,
    },
  });

  return NextResponse.json(fav);
}

export async function DELETE(req: Request) {
  const session = await getServerSession(AuthOption);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  await prisma.favorite.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
