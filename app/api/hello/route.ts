// route can define any type of request as follows:
// export async function GET(Request) {}
// export async function HEAD(Request) {}
// export async function POST(Request) {}
// export async function PUT(Request) {}
// export async function DELETE(Request) {}
//  A simple GET Example

export async function GET() {
  return new Response("Hello, this is a new API route");
}
import { NextResponse } from "next/server";

export async function POST() {
  const res = await fetch("https://data.mongodb-api.com/...");
  const data = await res.json();

  return NextResponse.json({ data });
}
