import { NavLink } from "@mantine/core";
import type { NavItem } from "../types";
import { useLocation, useNavigate } from "react-router-dom";
import classes from "../App.module.css";

interface Props {
  link: NavItem;
  parentPath?: string;
}

function NavLinkGroup({ link, parentPath }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const renderNavItem = (item: NavItem, parentPath?: string) => {
    const fullPath = parentPath ? `${parentPath}/${item.path}` : item.path;

    if (item.children) {
      return (
        <NavLink
          className={classes.navLink}
          active={location.pathname === fullPath}
          bdrs={5}
          key={item.label}
          label={item.label}
          leftSection={<item.icon size={16} />}
        >
          {item.children.map((child) => renderNavItem(child, fullPath))}
        </NavLink>
      );
    }

    return (
      <NavLink
        className={classes.navLink}
        bdrs={5}
        key={item.label}
        active={location.pathname === fullPath}
        label={item.label}
        leftSection={<item.icon size={16} />}
        onClick={() => navigate(fullPath)}
      />
    );
  };

  return renderNavItem(link, parentPath);
}

export default NavLinkGroup;
