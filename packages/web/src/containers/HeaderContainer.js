import React, { PureComponent } from 'react';
import { func, object, string, oneOf } from 'prop-types';
import { generatePath } from 'react-router';

import {
  CUSTOMER_ROLE,
  PROVIDER_OD_ROLE,
  AGENT_ND_ROLE,
} from 'sly/common/constants/roles';
import {
  DASHBOARD_ACCOUNT_PATH,
  AGENT_DASHBOARD_FAMILIES_PATH,
  FAMILY_DASHBOARD_FAVORITES_PATH,
  AGENT_DASHBOARD_TASKS_PATH,
  AGENT_DASHBOARD_PROFILE_PATH, DASHBOARD_COMMUNITIES_PATH,
} from 'sly/web/constants/dashboardAppPaths';
import { withAuth, normalizeResponse, query } from 'sly/web/services/api';
import { withRedirectTo } from 'sly/common/services/redirectTo';
import { withProps } from 'sly/web/services/helpers/hocs';
import { generateSearchUrl, parseURLQueryParams } from 'sly/web/services/helpers/url';
import SlyEvent from 'sly/web/services/helpers/events';
import AuthContainer from 'sly/common/services/auth/containers/AuthContainer';
import NotificationController from 'sly/web/controllers/NotificationController';
import Notifications from 'sly/web/components/organisms/Notifications';
import Header from 'sly/web/components/organisms/Header';
import ModalController from 'sly/web/controllers/ModalController';
import HowSlyWorksVideoContainer from 'sly/web/containers/HowSlyWorksVideoContainer';

const sendEvent = (category, action, label, value) => SlyEvent.getInstance().sendEvent({
  category,
  action,
  label,
  value,
});

const category = 'header';
const clickAction = 'click';
const toggleAction = 'toggle';
const headerItemLabel = 'headerItem';
const headerMenuLabel = 'headerMenu';
const logoLabel = 'logo';
const sendHeaderItemClickEvent = value => sendEvent(category, clickAction, headerItemLabel, value);

const getDefaultHeaderItems = (layout) => {
  let items = [
    { name: 'Call for help (855) 866-4515', to: 'tel:+18558664515', palette: 'primary', onClick: ({ name }) => sendHeaderItemClickEvent(name) },
  ];

  if (layout !== 'wizards') {
    items = [
      { name: 'Senior Living Resources', to: '/resources', onClick: ({ name }) => sendHeaderItemClickEvent(name) },
      { name: 'Assisted Living', to: '/assisted-living', onClick: ({ name }) => sendHeaderItemClickEvent(name) },
      ...items,
    ];
  }

  return items;
};


const smallScreenMenuItems = [
  { name: 'Homepage', to: '/', onClick: ({ name }) => sendHeaderItemClickEvent(name) },
];

const defaultMenuItems = () => {
  const menuItems = [
    {
      name: 'Senior Living Resources', to: '/resources', hideInBigScreen: true, section: 2, onClick: ({ name }) => sendHeaderItemClickEvent(name),
    },
    {
      name: 'Assisted Living', to: '/assisted-living', hideInBigScreen: true, section: 2, onClick: ({ name }) => sendHeaderItemClickEvent(name),
    },
    {
      name: 'Nursing Homes', to: '/nursing-homes', hideInBigScreen: true, section: 2, onClick: ({ name }) => sendHeaderItemClickEvent(name),
    },
    {
      name: 'Call for help (855) 866-4515', to: 'tel:+18558664515', palette: 'primary', hideInBigScreen: true, section: 2, onClick: ({ name }) => sendHeaderItemClickEvent(name),
    },
    { name: 'Contact Us', to: '/contact', section: 2, onClick: ({ name }) => sendHeaderItemClickEvent(name) },
    { name: 'About Us', to: '/about', section: 2, onClick: ({ name }) => sendHeaderItemClickEvent(name) },
  ];
  return menuItems;
};

const customerMenuItems = [
  {
    name: 'Favorites', to: FAMILY_DASHBOARD_FAVORITES_PATH, section: 1, icon: 'favourite-light', onClick: ({ name }) => sendHeaderItemClickEvent(name),
  },
];

const agentMenuItems = [
  {
    name: 'Families', to: generatePath(AGENT_DASHBOARD_FAMILIES_PATH), section: 1, icon: 'users', onClick: ({ name }) => sendHeaderItemClickEvent(name),
  },
  {
    name: 'Tasks', to: generatePath(AGENT_DASHBOARD_TASKS_PATH), section: 1, icon: 'checkbox-fill', onClick: ({ name }) => sendHeaderItemClickEvent(name),
  },
  {
    name: 'Profile', to: AGENT_DASHBOARD_PROFILE_PATH, section: 1, icon: 'settings', onClick: ({ name }) => sendHeaderItemClickEvent(name),
  },
];

const customerAndAgentMenuItems = [
  {
    name: 'Account', to: DASHBOARD_ACCOUNT_PATH, section: 1, icon: 'user', onClick: ({ name }) => sendHeaderItemClickEvent(name),
  },
];

const partnerCommunityMenuItems = [
  {
    name: 'Communities', to: generatePath(DASHBOARD_COMMUNITIES_PATH), section: 1, icon: 'house', onClick: ({ name }) => sendHeaderItemClickEvent(name),
  },
];

const loggedInMenuItems = (user) => {
  /* eslint-disable no-bitwise */
  let roleBasedItems = [];
  if (user) {
    const { roleID } = user;
    if (roleID & CUSTOMER_ROLE) {
      roleBasedItems = customerMenuItems;
    }
    if (roleID & AGENT_ND_ROLE) {
      roleBasedItems = agentMenuItems;
    }
    if (roleID & PROVIDER_OD_ROLE) {
      roleBasedItems = partnerCommunityMenuItems;
    }
    if (roleID & (CUSTOMER_ROLE | AGENT_ND_ROLE | PROVIDER_OD_ROLE)) {
      roleBasedItems = [...roleBasedItems, ...customerAndAgentMenuItems];
    }
  }

  const loginButtonText = user
    ? 'Log Out'
    : 'Log In';

  return [...roleBasedItems, { name: loginButtonText, section: 3, palette: 'primary', onClick: ({ name }) => sendHeaderItemClickEvent(name) }];
};

const loginHeaderItems = user => user
  ? [{ name: 'My Seniorly', onClick: ({ name }) => sendHeaderItemClickEvent(name) }]
  : [{ name: 'Log In', ghost: true, isButton: true, onClick: ({ name }) => sendHeaderItemClickEvent(name) },
    { name: 'Sign Up', isButton: true, onClick: ({ name }) => sendHeaderItemClickEvent(name) }];

const generateMenuItems = user => [...defaultMenuItems(user), ...loggedInMenuItems(user)];

@withAuth
@withRedirectTo
@query('getCommunity', 'getCommunity')
@withProps(({ location }) => ({
  queryParams: parseURLQueryParams(location.search),
}))

export default class HeaderContainer extends PureComponent {
  static typeHydrationId = 'HeaderContainer';
  static propTypes = {
    user: object,
    logoutUser: func,
    ensureAuthenticated: func,
    className: string,
    queryParams: object,
    location: object,
    getCommunity: func,
    redirectTo: func.isRequired,
    layout: oneOf(['default', 'wizards']),
  };

  state = {
    isDropdownOpen: false,
    community: {},
  };

  componentDidMount() {
    const { queryParams, getCommunity } = this.props;
    if (!queryParams) {
      return;
    }
    const { prop } = queryParams;
    if (!prop) {
      return;
    }
    getCommunity({ id: prop }).then((resp) => {
      const community = normalizeResponse(resp.body);
      return this.setState({
        community,
      });
    });
  }

  toggleDropdown = () => {
    const { isDropdownOpen } = this.state;
    this.setState({
      isDropdownOpen: !isDropdownOpen,
    });
    sendEvent(category, toggleAction, headerMenuLabel, !isDropdownOpen);
  };

  logout = () => {
    const { logoutUser } = this.props;
    sendEvent(category, clickAction, headerItemLabel, 'Log Out');
    return logoutUser();
  };

  onLogoClick = () => {
    sendEvent(category, clickAction, logoLabel);
  };

  handleCurrentLocation = (addresses, { latitude, longitude }) => {
    const { redirectTo } = this.props;

    if (addresses.length) {
      const path = `${generateSearchUrl(['Assisted Living'], addresses[0])}?latitude=${latitude}&longitude=${longitude}`;

      redirectTo(path);
    }
  };

  render() {
    const {
      user,
      className,
      ensureAuthenticated,
      location,
      layout,
    } = this.props;
    const { isDropdownOpen } = this.state;

    const hItems = getDefaultHeaderItems(layout);
    const lhItems = layout !== 'wizards' ? loginHeaderItems(user) : [];
    const menuItems = generateMenuItems(user);

    const logoutLeftMenuItem = menuItems.find(item => item.name === 'Log Out');
    if (logoutLeftMenuItem) {
      logoutLeftMenuItem.onClick = this.logout;
    }
    let loginItem = lhItems.find(item => item.name === 'Log In');
    if (loginItem) {
      loginItem.onClick = ({ name }) => { sendHeaderItemClickEvent(name); ensureAuthenticated(); };
    }
    loginItem = menuItems.find(item => item.name === 'Log In');
    if (loginItem) {
      loginItem.onClick = ({ name }) => { sendHeaderItemClickEvent(name); ensureAuthenticated(); };
    }
    let registerItem = lhItems.find(item => item.name === 'Sign Up');
    if (registerItem) {
      registerItem.onClick = ({ name }) => {
        sendHeaderItemClickEvent(name);
        const { community } = this.state;
        const data = { register: true };
        if (location.pathname === '/partners/communities') {
          data.provider = true;
          if (community.id) {
            data.community = { value: community.id, label: `${community.name}: ${community.address.city}, ${community.address.state}` };
          }
        }
        ensureAuthenticated(data);
      };
    }
    registerItem = menuItems.find(item => item.name === 'Sign Up');
    if (registerItem) {
      registerItem.onClick = ({ name }) => {
        sendHeaderItemClickEvent(name);
        const { community } = this.state;
        const data = { register: true };
        if (location.pathname === '/partners/communities') {
          data.provider = true;
          if (community.id) {
            data.community = { value: community.id, label: `${community.name}: ${community.address.city}, ${community.address.state}` };
          }
        }
        ensureAuthenticated(data);
      };
    }
    const mySlyMenuItem = lhItems.find(item => item.name === 'My Seniorly');
    if (mySlyMenuItem) {
      mySlyMenuItem.onClick = this.toggleDropdown;
    }

    const howItWorksItem = hItems.find(item => item.name === 'How It Works');

    const headerItems = [
      ...hItems,
      ...lhItems,
    ];

    const modalBody = (
      <HowSlyWorksVideoContainer isPlaying eventLabel="header" />
    );

    return (
      <ModalController>
        {({
          show,
        }) => (
          <NotificationController>
            {({
              messages,
              dismiss,
            }) => {
              if (howItWorksItem) {
                howItWorksItem.onClick = ({ name }) => { show(modalBody, null, 'fullScreen'); sendHeaderItemClickEvent(name); };
              }
              return (
                <>
                  <Header
                    menuOpen={isDropdownOpen}
                    onMenuIconClick={this.toggleDropdown}
                    onMenuItemClick={this.toggleDropdown}
                    onHeaderBlur={this.toggleDropdown}
                    onLogoClick={this.onLogoClick}
                    headerItems={headerItems}
                    hideMenuItemsInSmallScreen={layout !== 'wizards'}
                    menuItems={menuItems}
                    smallScreenMenuItems={smallScreenMenuItems}
                    className={className}
                    onCurrentLocation={this.handleCurrentLocation}
                    hasSearchBox={layout !== 'wizards'}
                  />
                  <AuthContainer />
                  <Notifications messages={messages} dismiss={dismiss} />
                </>
              );
            }}
          </NotificationController>
        )}
      </ModalController>
    );
  }
}
