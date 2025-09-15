import { NextRequest, NextResponse } from "next/server";
import { getAgentsByCompany } from "@/src/server/actions/agents.actions";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenant = searchParams.get("tenant");
    const company = searchParams.get("company");

    if (!tenant) {
      return NextResponse.json({ ok: false, error: "Tenant parameter is required" }, { status: 400 });
    }

    if (!company) {
      return NextResponse.json({ ok: false, error: "Company parameter is required" }, { status: 400 });
    }

    const result = await getAgentsByCompany(tenant, company);
    
    if (result.ok) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error("API Error - GET agents by company:", error);
    return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 });
  }
}
