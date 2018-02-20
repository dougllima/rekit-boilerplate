/*
 * This is a very simple navigation tree for testing purpose.
 * It groups URLs by features.
*/

import React, { PureComponent } from 'react';

import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import $ from 'jquery';

export default class SimpleNav extends PureComponent {
  static propTypes = {
    routes: PropTypes.array.isRequired,
  };

  toggleSubMenu = e => {
    let line = $(e.target).closest('li');

    if (line.hasClass('sub-menu')) {
      $('.common-simple-nav ul > li.active > ul').slideUp(),
        $(e.target)
          .next()
          .is(':visible') ||
        $(e.target)
          .next()
          .slideDown(),
        e.stopPropagation();
    }

    $('.active').removeClass('active');

    line.toggleClass('active');
  };

  renderLinks(items, basePath) {
    return (
      <ul>
        {items.reduce((prev, item) => {
          if (item.autoIndexRoute) return prev;
          let path;
          if (/^\//.test(item.path)) {
            path = item.path;
          } else if (basePath === '/') {
            path = `/${item.path}`;
          } else {
            path = `${basePath}/${item.path}`;
          }

          if (item.childRoutes && item.childRoutes.length) {
            prev.push(
              <li className="sub-menu" key={path}>
                <a onClick={this.toggleSubMenu}>
                  {item.icon ? <i className={`fas fa-${item.icon}`} /> : null} {item.name || item.path}
                </a>
                {this.renderLinks(item.childRoutes, path)}
              </li>
            );
          } else {
            prev.push(
              <li key={path}>
                <Link to={path} onClick={this.toggleSubMenu}>
                  {item.name || item.path}
                </Link>
              </li>
            );
          }
          return prev;
        }, [])}
      </ul>
    );
  }

  render() {
    return <div className="common-simple-nav">{this.renderLinks(this.props.routes[0].childRoutes, '')}</div>;
  }
}
