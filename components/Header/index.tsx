import Image from "next/image";
import Link from "next/link";
import Logo from "../../public/images/Logo.png";

function Header() {
  return (
    <header className="flex justify-between p-8">
      <Image src={Logo} alt="Newsplash Logo" />
      <nav>
        <ul className="flex space-x-4">
          <li>
            <Link href="/about">Topics</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/contact">Contact</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
