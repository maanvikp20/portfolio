// Applies to /admin and /admin/login: keep both out of search results.
export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return children;
}
