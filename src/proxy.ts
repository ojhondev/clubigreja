import { NextResponse, type NextRequest } from "next/server";

const PREFIXO_PAPEL: Record<string, string> = {
  "/igreja": "igreja",
  "/fiel": "fiel",
  "/admin": "superadmin",
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const prefixoProtegido = Object.keys(PREFIXO_PAPEL).find((p) => pathname.startsWith(p));
  if (!prefixoProtegido) {
    return NextResponse.next();
  }

  const raw = request.cookies.get("cig_sessao")?.value;
  if (!raw) {
    return NextResponse.redirect(new URL("/entrar", request.url));
  }

  try {
    const sessao = JSON.parse(raw) as { papel: string };
    if (sessao.papel !== PREFIXO_PAPEL[prefixoProtegido]) {
      return NextResponse.redirect(new URL("/entrar", request.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/entrar", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/igreja/:path*", "/fiel/:path*", "/admin/:path*"],
};
