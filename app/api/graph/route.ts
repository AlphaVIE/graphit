import {
  NodeGroup,
  Restriction,
  isGraphPossible,
} from "../../lib/graphAlgorithms";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  if (req.method === "POST") {
    const body = await req.json();
    const nodeGroups: NodeGroup[] = body.nodeGroups;
    const restrictions: Restriction[] = body.restrictions;

    const result = isGraphPossible(nodeGroups, restrictions);
    if (result.possible) {
      return NextResponse.json(result.graph);
    } else {
      return NextResponse.json(
        { error: "Graph nicht möglich" },
        { status: 400 }
      );
    }
  } else {
    res.headers.set("Allow", "POST");
    return NextResponse.json(
      { error: "HTTP Methode ungültig" },
      { status: 405 }
    );
  }
}
