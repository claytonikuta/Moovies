// components/Navbar.tsx
import Link from 'next/link';
import { useState } from 'react';
import {
  Autocomplete,
  Group,
  rem,
  Button,
  Popover,
  ButtonProps,
  Burger,
  Transition,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import { signOut, signIn, useSession } from 'next-auth/react';
import Head from 'next/head';
import GoogleIcon from './GoogleIcon'; // Update the import statement
import styles from './Navbar.module.css';

const alwaysVisibleLinks = [
  { link: '/', label: 'Home' },
  { link: '/about', label: 'About' },
];

const authenticatedLinks = [
  { link: '/favourites', label: 'Favourites' },
  { link: '/watchlist', label: 'Watch List' },
  { link: '/watched', label: 'Watched' },
];

const HEADER_HEIGHT = 56;

export function GoogleButton(props: ButtonProps & React.ComponentPropsWithoutRef<'button'>) {
  return <Button leftSection={<GoogleIcon />} variant="default" {...props} />;
}

export default function Navbar() {
  const { status } = useSession();
  const [opened, setOpened] = useState(false);
  const isLargeScreen = useMediaQuery('(min-width: 1024px)'); // This will return true if the screen width is 1024px or larger

  const toggleBurgerMenu = () => setOpened((o) => !o);

  const links =
    status === 'authenticated'
      ? [...alwaysVisibleLinks, ...authenticatedLinks]
      : alwaysVisibleLinks;

  const items = links.map((link) => (
    <Link
      style={{ paddingTop: '15px', paddingBottom: '15px' }}
      href={link.link}
      key={link.label}
      className={styles.link}
    >
      {link.label}
    </Link>
  ));

  return (
    <nav className={styles.navbar}>
      <Link href="/">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/Moovies-Logo.svg" alt="Logo" className={styles.logo} />
          <h2 style={{ marginLeft: '10px', color: 'white' }}>Moovies</h2>
        </div>
      </Link>
      {!isLargeScreen && (
        <Burger opened={opened} onClick={toggleBurgerMenu} className={styles.burgerButton} />
      )}
      <Transition mounted={opened} transition="slide-left" duration={400} timingFunction="ease">
        {(transitionStyles) => (
          <div
            style={{
              ...transitionStyles, // Spread the transition styles
              boxSizing: 'border-box',
              position: 'fixed',
              top: `${HEADER_HEIGHT}px`, // Template literal correctly used
              right: '10px', // Slightly off the right edge of the page
              width: 'calc(100% - 20px)', // Full width minus the offset on both sides
              maxWidth: '250px', // You can enforce a maxWidth if you want
              background: '#333',
              zIndex: 500,
              display: 'flex',
              flexDirection: 'column',
              padding: '20px',
              borderRadius: '5px',
              border: '0.5px solid #666',
              boxShadow: '-2px 0 8px rgba(0,0,0,0.1)',
              maxHeight: `calc(100vh - ${HEADER_HEIGHT}px - 20px)`, // Template literal correctly used
              overflowY: 'auto', // Makes it scrollable if content height exceeds maximum height
            }}
          >
            <Autocomplete
              className={styles.search}
              placeholder="Search"
              leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
              data={['']}
              visibleFrom="xs"
              style={{
                width: '100%',
                alignSelf: 'center',
                marginRight: '0px',
                marginBottom: '5px',
              }}
            />
            {items.map((item) => (
              <div key={`mobile-${item.key}`}>{item}</div>
            ))}
            {status === 'authenticated' ? (
              <Button
                color="red"
                onClick={() => {
                  signOut();
                }}
                style={{ marginTop: '5px' }}
              >
                Log Out
              </Button>
            ) : (
              <Popover zIndex={600} width={200} position="bottom-end" withArrow shadow="md">
                <Popover.Target>
                  <Button style={{ marginTop: '5px' }}>Login</Button>
                </Popover.Target>
                <Popover.Dropdown>
                  <GoogleButton
                    onClick={() => {
                      signIn('google', { callbackUrl: window.location.origin });
                    }}
                  >
                    Sign In / Register
                  </GoogleButton>
                </Popover.Dropdown>
              </Popover>
            )}
          </div>
        )}
      </Transition>
      {opened && (
        <div
          onClick={toggleBurgerMenu}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              // Close the menu if 'Escape' is pressed
              toggleBurgerMenu();
            }
          }}
          role="button" // Add a role to indicate interactiveness
          tabIndex={0} // Add tabIndex to make the div focusable
          aria-label="Close menu" // Add an aria-label for screen readers
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.3)',
            zIndex: 400,
          }}
        />
      )}
      {isLargeScreen && (
        <div>
          <Group>
            <Group
              ml={10}
              gap={5}
              className={styles.links}
              visibleFrom="sm"
              style={{ marginRight: '20px', fontSize: '18px' }}
            >
              {items}
            </Group>
            <Autocomplete
              className={styles.search}
              placeholder="Search"
              leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
              data={['']}
              visibleFrom="xs"
            />
            {status === 'authenticated' ? (
              <Button
                color="red"
                onClick={() => {
                  signOut();
                }}
                style={{ marginRight: '20px' }}
              >
                Log Out
              </Button>
            ) : (
              <Popover width={200} position="bottom-end" withArrow shadow="md">
                <Popover.Target>
                  <Button style={{ marginRight: '20px' }}>Login</Button>
                </Popover.Target>
                <Popover.Dropdown>
                  <GoogleButton
                    onClick={() => {
                      signIn('google', { callbackUrl: window.location.origin });
                    }}
                  >
                    Sign In / Register
                  </GoogleButton>
                </Popover.Dropdown>
              </Popover>
            )}
          </Group>
        </div>
      )}
      <Head>
        <style>
          {`
          a {
            text-decoration: none;
          }
        `}
        </style>
      </Head>
    </nav>
  );
}
