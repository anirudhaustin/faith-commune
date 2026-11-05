import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Vite dev server API middleware for local development
function localApiPlugin() {
  return {
    name: 'local-api-middleware',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (req.url && req.url.startsWith('/api/ops')) {
          try {
            // Dynamically import handler
            const { default: handler } = await import('./api/ops.js');
            const url = new URL(req.url, 'http://localhost:5173');
            const query: Record<string, string> = {};
            url.searchParams.forEach((val, key) => { query[key] = val; });

            let body: any = null;
            if (req.method === 'POST' || req.method === 'PUT') {
              const buffers: any[] = [];
              for await (const chunk of req) {
                buffers.push(chunk);
              }
              const data = Buffer.concat(buffers).toString();
              if (data) {
                try { body = JSON.parse(data); } catch { body = data; }
              }
            }

            const mockReq: any = {
              method: req.method,
              query,
              body,
              headers: req.headers
            };

            const mockRes: any = {
              statusCode: 200,
              setHeader(name: string, value: string) {
                res.setHeader(name, value);
                return this;
              },
              status(code: number) {
                this.statusCode = code;
                return this;
              },
              json(data: any) {
                res.statusCode = this.statusCode;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
                return this;
              },
              end(data?: any) {
                res.statusCode = this.statusCode;
                res.end(data);
                return this;
              }
            };

            await handler(mockReq, mockRes);
            return;
          } catch (e: any) {
            console.error('Local API Error:', e);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: e.message }));
            return;
          }
        }
        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    localApiPlugin(),
  ],
});
