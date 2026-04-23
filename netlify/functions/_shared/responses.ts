export function jsonResponse(body: unknown, status = 200): Response {
  return Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}

export function htmlResponse(title: string, body: string, status = 200): Response {
  return new Response(
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <style>
      body {
        margin: 0;
        font-family: Inter, system-ui, sans-serif;
        background: #eff6ff;
        color: #0f172a;
      }
      .shell {
        max-width: 40rem;
        margin: 0 auto;
        padding: 3rem 1.25rem;
      }
      .card {
        background: #ffffff;
        border: 1px solid #bfdbfe;
        border-radius: 1rem;
        box-shadow: 0 14px 32px rgba(15, 23, 42, 0.08);
        padding: 1.5rem;
      }
      h1 {
        margin: 0 0 0.75rem;
        font-size: 1.75rem;
      }
      p {
        line-height: 1.6;
        margin: 0.75rem 0 0;
      }
      a {
        color: #1d4ed8;
      }
    </style>
  </head>
  <body>
    <main class="shell">
      <section class="card">
        <h1>${title}</h1>
        ${body}
      </section>
    </main>
  </body>
</html>`,
    {
      status,
      headers: {
        'Cache-Control': 'no-store',
        'Content-Type': 'text/html; charset=utf-8',
      },
    },
  );
}
