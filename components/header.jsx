import Image from 'next/image';
import Link from 'next/link';
import logo from 'public/logo.svg';
import linkedinLogo from 'public/images/linkedin.svg';
import bmcLogo from 'public/images/bmc.svg';
import instagramLogo from 'public/images/instagram.svg';

const navItems = [
    // { linkText: 'Home', href: '/' },
    // { linkText: 'Revalidation', href: '/revalidation' },
    // { linkText: 'Image CDN', href: '/image-cdn' },
    // { linkText: 'Edge Function', href: '/edge' },
    // { linkText: 'Blobs', href: '/blobs' },
    // { linkText: 'Classics', href: '/classics' }
];

export function Header() {
    return (
        <nav className="flex flex-wrap items-center gap-4">
            <Link href="/">
                <Image src={logo} alt="unbg.me logo" />
            </Link>
            {!!navItems?.length && (
                <ul className="flex flex-wrap gap-x-4 gap-y-1">
                    {navItems.map((item, index) => (
                        <li key={index}>
                            <Link
                                href={item.href}
                                className="inline-block px-1.5 py-1 transition hover:opacity-80 sm:px-3 sm:py-2"
                            >
                                {item.linkText}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
            <div className="flex flex-col items-center sm:flex-row sm:justify-end flex-grow lg:mr-1">
                <Link
                    href="https://buymeacoffee.com/mdnicolae"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image src={bmcLogo} alt="BuyMeACoffee Logo" className="w-7 h-7 mb-2 sm:mb-0 sm:mr-7" />
                </Link>
                <Link
                    href="https://www.linkedin.com/in/m-nicolae/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image src={linkedinLogo} alt="Linkedin Logo" className="w-7 h-7 mb-2 sm:mb-0 sm:mr-7" />
                </Link>
                <Link
                    href="https://www.instagram.com/m.d.nicolae/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image src={instagramLogo} alt="Instagram Logo" className="w-7 h-7" />
                </Link>
            </div>
        </nav>
    );
}
