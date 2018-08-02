import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import Component from './component'

ReactDOM.render(
  <Provider store={store}>
    <Component />
  </Provider>,
  document.getElementById('app')
);
