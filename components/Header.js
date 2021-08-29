import { Menu } from 'semantic-ui-react';
import Link from 'next/link';

const Header = () => {
  return (
    <Menu
      style={{
        marginTop: 10,
      }}
    >
      <Link href="/">
        <Menu.Item>KickStarter Ethereum</Menu.Item>
      </Link>
      <Menu.Menu position="right">
        <Link href="/">
          <Menu.Item>Campaigns</Menu.Item>
        </Link>
        <Link href="/campaigns/new">
          <Menu.Item>+</Menu.Item>
        </Link>
      </Menu.Menu>
    </Menu>
  );
};

export default Header;
