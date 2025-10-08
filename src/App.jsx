import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map(product => {
  const category =
    categoriesFromServer.find(
      categories => categories.id === product.categoryId,
    ) || null;

  const users =
    usersFromServer.find(user => user.id === category.ownerId) || null;

  return {
    ...product,
    category,
    users,
  };
});

export const App = () => {
  const [filterByName, setFilterByName] = useState('all');
  const [filterByCategory, setFilterByCategory] = useState([]);
  const [filterBySearch, setFilterBySearch] = useState('');

  const filterProducts = () => {
    const sorted = [...products];

    const filteredByName =
      filterByName === 'all'
        ? sorted
        : sorted.filter(product => product.users.name === filterByName);

    const filteredByCategory =
      filterByCategory.length === 0
        ? filteredByName
        : filteredByName.filter(product =>
          filterByCategory.includes(product.category.title),
        );

    const searched =
      filterBySearch === ''
        ? filteredByCategory
        : filteredByCategory.filter(product =>
          product.name.toLowerCase().includes(filterBySearch),
        );

    return searched;
  };

  const sortProducts = () => {
    
  }

  const handleFilterCategory = event => {
    event.preventDefault();
    const categoryTitle = event.currentTarget.textContent;

    setFilterByCategory(
      prev =>
        prev.includes(categoryTitle)
          ? prev.filter(title => title !== categoryTitle)
          : [...prev, categoryTitle],
      // eslint-disable-next-line function-paren-newline
    );
  };

  const handleSearch = event => {
    setFilterBySearch(event.target.value.trim().toLowerCase());
  };

  function resetAllFilters() {
    setFilterByName('all');
    setFilterByCategory([]);
    setFilterBySearch('');
  }

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={filterByName === 'all' && 'is-active'}
                onClick={() => setFilterByName('all')}
              >
                All
              </a>

              {usersFromServer.map(user => {
                return (
                  <a
                    key={user.id}
                    data-cy="FilterUser"
                    href={`#/${user.name}`}
                    className={filterByName === `${user.name}` && 'is-active'}
                    onClick={() => setFilterByName(user.name)}
                  >
                    {user.name}
                  </a>
                );
              })}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  onChange={handleSearch}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  <button
                    data-cy="ClearButton"
                    type="button"
                    className="delete"
                  />
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={
                  filterByCategory.length === 0
                    ? 'button mr-2 my-1 is-info'
                    : 'button mr-2 my-1'
                }
                onClick={event => {
                  event.preventDefault();
                  setFilterByCategory([]);
                }}
              >
                All
              </a>

              {categoriesFromServer.map(category => {
                return (
                  <a
                    key={category.id}
                    data-cy="Category"
                    className={
                      filterByCategory.includes(category.title)
                        ? 'button mr-2 my-1 is-info'
                        : 'button mr-2 my-1'
                    }
                    href={`#/${category.title}`}
                    onClick={handleFilterCategory}
                  >
                    {category.title}
                  </a>
                );
              })}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={() => resetAllFilters()}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {filterProducts().length === 0 && (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}

          <table
            data-cy="ProductTable"
            className="table is-striped is-narrow is-fullwidth"
          >
            <thead>
              <tr>
                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    ID
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Product
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-down" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Category
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-up" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    User
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>
              </tr>
            </thead>

            <tbody>
              {filterProducts().map(product => {
                return (
                  <tr data-cy="Product" key={product.id}>
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>
                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">
                      {product.category.icon} - {product.category.title}
                    </td>

                    <td
                      data-cy="ProductUser"
                      className={
                        product.users.sex === 'm'
                          ? 'has-text-link'
                          : 'has-text-danger'
                      }
                    >
                      {product.users.name}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
