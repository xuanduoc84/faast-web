import React from 'react'
import {
  Container,
  Collapse,
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  NavbarToggler,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle
} from 'reactstrap'
import { Link, NavLink as RouterNavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { setDisplayName, compose } from 'recompose'
import { pick } from 'lodash'

import config from 'Config'
import { isDefaultPortfolioEmpty } from 'Selectors'
import withToggle from 'Hoc/withToggle'

import Icon from 'Components/Icon'
import FaastLogo from 'Img/faast-logo.png'

const AppNavbar = ({ disablePortfolioLinks, children, isExpanded, 
  toggleExpanded, isDropdownOpen, toggleDropdownOpen, ...props }) => (
  <Navbar {...pick(props, Object.keys(Navbar.propTypes))}>
    <Container>
      <NavbarBrand tag={Link} to='/' className='mr-auto'>
        <Icon src={FaastLogo} height='1.5rem' width='1.5rem' inline className='mx-3'/>Faast Portfolio <sup className='beta-tag'>beta</sup>
      </NavbarBrand>
      <NavbarToggler onClick={toggleExpanded} />
      <Collapse isOpen={isExpanded} navbar>
        <Nav navbar>
          {!disablePortfolioLinks && (
            <NavItem key='dashboard'>
              <NavLink className='px-1 px-lg-2' tag={RouterNavLink} to='/dashboard'>
                <i className='d-inline d-md-none d-lg-inline nav-link-icon fa fa-pie-chart'/>
                <span className='nav-link-label d-sm-inline'>Dashboard</span>
              </NavLink>
            </NavItem>
          )}
          <Dropdown nav isOpen={isDropdownOpen} size="sm" toggle={toggleDropdownOpen} setActiveFromChild>
            <DropdownToggle 
              tag={RouterNavLink} 
              to={'/assets'}
              onClick={((e) => e.preventDefault())}
              className='nav-link position-relative cursor-pointer'
              color='dark' 
              caret
              nav
            >
              <i className="d-inline d-md-none d-lg-inline nav-link-icon fa fa-align-left" aria-hidden="true"></i>
              <span className='nav-link-label d-sm-inline'>Assets</span>
            </DropdownToggle>
            <DropdownMenu className='p-0'>
              <DropdownItem tag={Link} to={'/assets'} className='text-muted py-2'>All Assets</DropdownItem>
              <DropdownItem className='m-0' divider/>
              <DropdownItem tag={Link} to={'/assets/trending'} className='text-muted py-2'>Trending</DropdownItem>
              <DropdownItem className='m-0' divider/>
              <DropdownItem tag={Link} to={'/assets/watchlist'} className='text-muted py-2'>Watchlist</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          {!disablePortfolioLinks && ([
            <NavItem key='rebalance'>
              <NavLink className='px-1 px-lg-2' tag={RouterNavLink} to='/rebalance'>
                <i className='d-inline d-md-none d-lg-inline nav-link-icon fa fa-sliders'/>
                <span className='nav-link-label d-sm-inline'>Rebalance</span>
              </NavLink>
            </NavItem>
          ])}
          <NavItem key='swap'>
            <NavLink className='px-1 px-lg-2' tag={RouterNavLink} to='/swap'>
              <i className='d-inline d-md-none d-lg-inline nav-link-icon fa fa-exchange'/>
              <span className='nav-link-label d-sm-inline'>Swap</span>
            </NavLink>
          </NavItem>
          {!disablePortfolioLinks && (
            <NavItem key='orders'>
              <NavLink className='px-1 px-lg-2' tag={RouterNavLink} to='/orders'>
                <i className='d-inline d-md-none d-lg-inline nav-link-icon fa fa-history'/>
                <span className='nav-link-label d-sm-inline'>Orders</span>
              </NavLink>
            </NavItem>
          )}
          <NavItem key='connect'>
            <NavLink className='px-1 px-lg-2' tag={RouterNavLink} to='/connect'>
              <i className='d-inline d-md-none d-lg-inline nav-link-icon fa fa-plus'/>
              <span className='nav-link-label d-sm-inline'>Add wallet</span>
            </NavLink>
          </NavItem>
        </Nav>
      </Collapse>
    </Container>
    {children}
  </Navbar>
)

AppNavbar.propTypes = {
  ...Navbar.propTypes
}

AppNavbar.defaultProps = {
  color: 'ultra-dark',
  dark: true,
  fixed: 'top',
  expand: config.navbar.expand,
}

export default compose(
  setDisplayName('AppNavBar'),
  connect(createStructuredSelector({
    disablePortfolioLinks: isDefaultPortfolioEmpty,
  }), {
  }),
  withToggle('expanded'),
  withToggle('dropdownOpen'),
)(AppNavbar)
