declare const Netlify: {
  env: {
    get(name: string): string | undefined;
  };
};

export function getRequiredEnv(name: string): string {
  const value = Netlify.env.get(name);
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getOptionalEnv(name: string): string | undefined {
  return Netlify.env.get(name) ?? undefined;
}
