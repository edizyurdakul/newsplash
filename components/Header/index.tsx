import Link from "next/link";

function Header() {
  return (
    <header className="p-8">
      <nav className="flex justify-between items-center">
        <Link href="/" className="font-bold text-2xl select-none">
          NewSplash
        </Link>
        <ul className="flex space-x-4 font-medium">
          <li>
            <Link href="/about" className="hover:text-zinc-300">
              About
            </Link>
          </li>
          <li>
            <Link href="/contact" className="hover:text-zinc-300">
              Contact
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
