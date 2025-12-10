import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, userType } = body;

    if (!email || !userType) {
      return NextResponse.json(
        { error: "Email and user type are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate user type
    const normalizedType = userType.toUpperCase();
    if (!["CANDIDATE", "EMPLOYER"].includes(normalizedType)) {
      return NextResponse.json(
        { error: "Invalid user type" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase();

    // Check if email already exists
    const existing = db.waitlist.findByEmail(normalizedEmail);

    if (existing) {
      return NextResponse.json(
        { message: "You're already on the waitlist!", alreadyExists: true },
        { status: 200 }
      );
    }

    // Create waitlist entry
    const entry = db.waitlist.create({
      email: normalizedEmail,
      userType: normalizedType as "CANDIDATE" | "EMPLOYER",
    });

    // TODO: Send confirmation email via Resend/SendGrid

    return NextResponse.json(
      {
        message: "Successfully joined the waitlist!",
        id: entry.id
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Waitlist signup error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const count = db.waitlist.count();
    return NextResponse.json({ count });
  } catch (error) {
    console.error("Waitlist count error:", error);
    return NextResponse.json({ count: 0 });
  }
}
