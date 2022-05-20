import ViewSourceCode from "./viewSourceCode";
import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div>
        <Link href="/about">
          <a className="footer-about">About</a>
        </Link>
      </div>
    </footer>
  );
}
