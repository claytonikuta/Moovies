// components/Navbar.tsx
import Link from 'next/link';
import { Autocomplete, Group, Burger, rem, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import { signOut, signIn, useSession } from 'next-auth/react';
import styles from './Navbar.module.css';

const links = [
  { link: '/', label: 'Home' },
  { link: '/about', label: 'About' },
  { link: '/favourites', label: 'Favourites' },
  { link: '/watchlist', label: 'Watch List' },
  { link: '/watched', label: 'Watched' },
];

export default function Navbar() {
  const [opened, { toggle }] = useDisclosure(false);
  const { status } = useSession();

  const items = links.map((link) => (
    <Link href={link.link} key={link.label} className={styles.link}>
      {link.label}
    </Link>
  ));

  return (
    <nav className={styles.navbar}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src="/Moovies-Logo.svg" alt="Logo" className={styles.logo} />
        <h2 style={{ marginLeft: '10px' }}>Moovies</h2>
      </div>
      <div>
        <Group>
          <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
        </Group>

        <Group>
          <Group ml={10} gap={5} className={styles.links} visibleFrom="sm" style={{ marginRight: '20px', fontSize: '18px' }}>
            {items}
          </Group>
          <Autocomplete
            className={styles.search}
            placeholder="Search"
            leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
            data={['']}
            visibleFrom="xs"
          />
          {(status === 'authenticated') ?
              <Button color="red" onClick={() => { signOut(); }} style={{ marginRight: '20px' }}>Sign Out</Button>
          :
              <Button color="blue" onClick={() => { signIn('google', { callbackUrl: window.location.origin }); }} style={{ marginRight: '20px' }}>Sign In / Register</Button>
          }
        </Group>
      </div>
    </nav>
  );
}
