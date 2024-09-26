// import "@/styles/globals.css";
// import type { AppProps } from "next/app";

// export default function App({ Component, pageProps }: AppProps) {
//   return <Component {...pageProps} />;
// }
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Sidebar from "@/components/Sidebar"; // Import Sidebar component
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Check if the current route is "/login" or "/" (index page)
  const isLoginOrHomePage = router.pathname === "/login" || router.pathname === "/";

  return (
    <div style={{ display: "flex" }}>
      {!isLoginOrHomePage && <Sidebar />} {/* Sidebar hidden on login and index pages */}
      <main style={{ marginLeft: !isLoginOrHomePage ? "250px" : "0", padding: "20px", width: "100%" }}>
        <Component {...pageProps} />
      </main>
    </div>
  );
}
