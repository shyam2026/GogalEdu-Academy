export async function POST(req) {
  const body = await req.json();
  console.log("Event:", body);

  return Response.json({ success: true });
}