import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_SESSAO, decodificarSessao } from "./lib/auth/cookie";

const PREFIXO_PAPEL: Record<string, string> = {
  "/igreja": "igreja",
  "/fiel": "fiel",
  "/admin": "webmaster",
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const prefixoProtegido = Object.keys(PREFIXO_PAPEL).find((p) =>
    pathname.startsWith(p),
  );
  if (!prefixoProtegido) {
    return NextResponse.next();
  }

  const raw = request.cookies.get(COOKIE_SESSAO)?.value;
  const sessao = raw ? decodificarSessao(raw) : null;

  if (!sessao || sessao.papel !== PREFIXO_PAPEL[prefixoProtegido]) {
    return NextResponse.redirect(new URL("/entrar", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/igreja/:path*", "/fiel/:path*", "/admin/:path*"],
};
