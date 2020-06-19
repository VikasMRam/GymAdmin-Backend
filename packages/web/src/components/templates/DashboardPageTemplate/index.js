import React from 'react';
import { node, string, bool } from 'prop-types';
import styled from 'styled-components';
import { ifProp } from 'styled-tools';
import { generatePath } from 'react-router';

import { size, palette } from 'sly/web/components/themes';
import {
  DASHBOARD_ACCOUNT_PATH,
  FAMILY_DASHBOARD_FAVORITES_PATH,
  AGENT_DASHBOARD_FAMILIES_PATH,
  AGENT_DASHBOARD_PROFILE_PATH,
  AGENT_DASHBOARD_MESSAGES_PATH,
  ADMIN_DASHBOARD_CALLS_PATH,
  AGENT_DASHBOARD_TASKS_PATH,
  AGENT_DASHBOARD_CONTACTS_PATH,
  ADMIN_DASHBOARD_AGENTS_PATH, DASHBOARD_COMMUNITIES_PATH,
} from 'sly/web/constants/dashboardAppPaths';
import {
  CUSTOMER_ROLE,
  AGENT_ND_ROLE,
  AGENT_ADMIN_ROLE,
  PLATFORM_ADMIN_ROLE,
  PROVIDER_OD_ROLE,
} from 'sly/web/constants/roles';
import HeaderContainer from 'sly/web/containers/HeaderContainer';
import ModalContainer from 'sly/web/containers/ModalContainer';
import DashboardMenu from 'sly/web/components/molecules/DashboardMenu';
import SlyEvent from 'sly/web/services/helpers/events';

const onMenuItemClick = (menuItem) => {
  const { label } = menuItem;
  const event = {
    category: 'DashboardMenuItem',
    action: 'click',
    label,
  };
  SlyEvent.getInstance().sendEvent(event);
};

/* eslint-disable no-bitwise */
const menuItems = [
  { label: 'Favorites', icon: 'favourite-light', iconSize: 'regular', palette: 'slate', variation: 'filler', href: FAMILY_DASHBOARD_FAVORITES_PATH, role: CUSTOMER_ROLE, onClick: onMenuItemClick },
  { label: 'My Families', icon: 'users', iconSize: 'regular', palette: 'slate', variation: 'filler', href: generatePath(AGENT_DASHBOARD_FAMILIES_PATH), role: AGENT_ND_ROLE | AGENT_ADMIN_ROLE, onClick: onMenuItemClick },
  { label: 'My Account', icon: 'user', iconSize: 'regular', palette: 'slate', variation: 'filler', href: DASHBOARD_ACCOUNT_PATH, role: CUSTOMER_ROLE | PROVIDER_OD_ROLE | AGENT_ND_ROLE, onClick: onMenuItemClick },
  { label: 'My Profile', icon: 'settings', iconSize: 'regular', palette: 'slate', variation: 'filler', href: AGENT_DASHBOARD_PROFILE_PATH, role: AGENT_ND_ROLE | AGENT_ADMIN_ROLE, onClick: onMenuItemClick },
  { label: 'My Contacts', icon: 'users', iconSize: 'regular', palette: 'slate', variation: 'filler', href: AGENT_DASHBOARD_CONTACTS_PATH, role: AGENT_ADMIN_ROLE, onClick: onMenuItemClick },
  // { label: 'Messages_', icon: 'message', iconSize: 'regular', palette: 'slate', variation: 'filler', href: FAMILY_DASHBOARD_MESSAGES_PATH, role: CUSTOMER_ROLE, onClick: onMenuItemClick },
  { label: 'Communities', icon: 'house', iconSize: 'regular', palette: 'slate', variation: 'filler', href: DASHBOARD_COMMUNITIES_PATH, role: PLATFORM_ADMIN_ROLE | PROVIDER_OD_ROLE, onClick: onMenuItemClick },
  { label: 'Messages', icon: 'message', iconSize: 'regular', palette: 'slate', variation: 'filler', href: AGENT_DASHBOARD_MESSAGES_PATH, role: PLATFORM_ADMIN_ROLE, onClick: onMenuItemClick },
  { label: 'Tasks', icon: 'checkbox-fill', iconSize: 'regular', palette: 'slate', variation: 'filler', href: generatePath(AGENT_DASHBOARD_TASKS_PATH), role: AGENT_ADMIN_ROLE, onClick: onMenuItemClick },
  { label: 'Calls', icon: 'phone', iconSize: 'regular', palette: 'slate', variation: 'filler', href: ADMIN_DASHBOARD_CALLS_PATH, role: PLATFORM_ADMIN_ROLE, onClick: onMenuItemClick },
  { label: 'Agents', icon: 'user', iconSize: 'regular', palette: 'slate', variation: 'filler', href: ADMIN_DASHBOARD_AGENTS_PATH, role: PLATFORM_ADMIN_ROLE, onClick: onMenuItemClick },
];
/* eslint-enable no-bitwise */

const Header = styled.div`
  background-color: ${palette('white.base')};
  grid-area: header;
`;

const Sidebar = styled.aside`
  background-color: ${palette('white.base')};
  display:none;
  grid-area: sidebar;

  @media screen and (min-width: ${size('breakpoint.laptop')}) {
    display: block;
    width: ${size('element.xxHuge')};
    display: inherit;
  }
`;

const Body = styled.main`
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${palette('grey.background')};
  grid-area: body;

  @media screen and (min-width: ${size('breakpoint.tablet')}) {
    padding: ${size('spacing.xLarge')};
  }
`;

// min-width: 0 helps in avaoiding overflow when used with a clampped text children component like LatestMessage
const DashboardPage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;

  > :first-child {
    flex-grow: 0;
  }

  > :nth-child(n+2) {
    flex-grow: 1;
    min-width: 0;
  }

  @media screen and (min-width: ${size('breakpoint.laptop')}) {
    display: grid;
    grid-template-columns: ${size('element.xxHuge')} auto;
    grid-gap: 0;
    grid-template-rows: max-content auto;
    grid-template-areas:
      "header header"
      "sidebar body";
  }
`;

const DashboardPageTemplate = ({
  children, activeMenuItem, className,
}) => {
  const mi = menuItems.map((mi) => {
    if (mi.label === activeMenuItem) {
      mi.active = true;
      mi.variation = 'base';
    } else {
      mi.active = false;
      mi.variation = 'filler';
    }
    return mi;
  });

  return (
    <DashboardPage>
      <Header><HeaderContainer /></Header>
      <Sidebar><DashboardMenu menuItems={mi} /></Sidebar>
      <Body className={className}>{children}</Body>
      <ModalContainer />
    </DashboardPage>
  );
};

DashboardPageTemplate.propTypes = {
  children: node,
  activeMenuItem: string.isRequired,
  className: string,
};

export default DashboardPageTemplate;