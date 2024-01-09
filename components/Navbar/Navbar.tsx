// components/Navbar.tsx
import Link from 'next/link';
import { Autocomplete, Group, Burger, rem } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import styles from './Navbar.module.css';

const links = [
  { link: '/', label: 'Home' },
  { link: '/about', label: 'About' },
];

export default function Navbar() {
  const [opened, { toggle }] = useDisclosure(false);

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
          <Autocomplete
            className={styles.search}
            placeholder="Search"
            leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
            data={['React', 'Angular', 'Vue', 'Next.js', 'Riot.js', 'Svelte', 'Blitz.js']}
            visibleFrom="xs"
          />
          <Group ml={10} gap={5} className={styles.links} visibleFrom="sm" style={{ marginRight: '20px' }}>
            {items}
          </Group>
        </Group>
      </div>
    </nav>
  );
}
