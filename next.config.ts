import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Evita que `next dev` reescreva CLAUDE.md sozinho a cada boot — o arquivo
  // é gerido manualmente (ver CLAUDE.md e CLAUDE.local.md na raiz).
  agentRules: false,
};

export default nextConfig;
