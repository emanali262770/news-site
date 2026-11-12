# Christian Monitor News frontend

React/Vite frontend connected to the single-admin news API through Axios.

## Run locally

1. Install dependencies: `npm install`.
2. Copy `.env.example` to `.env.local` and set `VITE_API_URL` to the backend origin (without `/api`). It defaults to `http://localhost:5000`.
3. Set the backend's `FRONTEND_ORIGIN` to the exact Vite origin, normally `http://localhost:5173`. Allow credentialed CORS and the `X-CSRF-Token` header.
4. Start the backend, then run `npm run dev`. If Vite chooses another port, update the backend origin setting.
5. Log in using the admin account created on the backend. There are no frontend demo credentials or signup flow.

Restart Vite after changing environment variables. For production use HTTPS and the backend's secure session-cookie configuration; frontend and backend origins must be configured consistently.

## API behavior

- `src/lib/api.js`: Axios requests with cookies, in-memory CSRF token, login token rotation, 204 responses, and consistent errors. A 403 refreshes CSRF but does not repeat the mutation automatically.
- `src/context/AuthContext.jsx`: initial session check, login/logout and expired-session handling. Server failures offer retry instead of redirecting to login.
- `src/context/PostsContext.jsx`: API categories and post mutation invalidation. There is no local post store or seeded news.
- `src/hooks/useApiResource.js`: aborts superseded requests and prevents stale responses from rendering.
- `src/hooks/usePostList.js`: server pagination, category/search filters and homepage selection.

Admin uploads accept JPG/PNG/WebP up to 1 MiB. The form sends only editable fields; image IDs are retained when editing. Publishing, updating and deleting refresh affected API data. Article content is rendered as plain text.

All public posts, category labels, related articles and admin table records come from the backend. Empty/error states never substitute sample articles. The theme preference is the only application data stored in localStorage; old demo post storage is no longer read.

Contact submission and newsletter APIs are not supplied in the backend contract. Those features show an unavailable state rather than pretend to submit data. Branding and informational page copy remain part of the frontend.

## Checks

- `npm run build`: production build.
- `npm test`: Axios contract tests covering CSRF/session behavior, multipart upload, 204 deletion, errors, cancellation and article normalization.

The automated API tests use a controlled Axios adapter. Browser cookie/CORS behavior and successful admin CRUD require a running backend and its real admin account.
