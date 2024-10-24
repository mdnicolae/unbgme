import Image from 'next/image';
import Link from 'next/link';
import logo from 'public/logo.svg';
import linkedinLogo from 'public/images/linkedin.svg';
import bmcLogo from 'public/images/bmc.svg';

export function Header() {
    return (
        <nav className="flex flex-col sm:flex-row items-center justify-between w-full py-4 px-4 sm:px-8 lg:px-16">
            {/* Logo */}
            <div className="flex justify-center sm:justify-start w-full sm:w-auto mb-4 sm:mb-0">
                <Link href="/">
                    <Image src={logo} alt="unbg.me logo" width={120} height={40} />
                </Link>
            </div>

            {/* Social Links */}
            <div className="flex flex-row justify-center gap-4">
                <Link
                    href="https://buymeacoffee.com/mdnicolae"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image src={bmcLogo} alt="BuyMeACoffee Logo" className="w-7 h-7" />
                </Link>
                <Link
                    href="https://www.linkedin.com/in/m-nicolae/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image src={linkedinLogo} alt="Linkedin Logo" className="w-7 h-7" />
                </Link>
            </div>
        </nav>
    );
}
