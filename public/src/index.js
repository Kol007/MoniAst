import ReactDOM from 'react-dom';
import routes from './routes';
import 'addFontAwesome';

import * as serviceWorker from './serviceWorker';

const rootEl = document.getElementById('root');
ReactDOM.render(routes, rootEl);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();
serviceWorker.unregister();

if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept();
}
