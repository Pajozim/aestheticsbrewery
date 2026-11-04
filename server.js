// server.ts
Bun.serve({
  port: 3044,
  async fetch(req) {
    const url = new URL(req.url);
    // If the root path is requested, return index.html
    const path = url.pathname === "/" ? "/index.html" : url.pathname;
    const file = Bun.file("." + path);

    // Check if the file exists
    if (!(await file.exists())) {
      return new Response("Not found", { status: 404 });
    }
    return new Response(file);
  },
});

console.log("Server running at http://localhost:3044/");