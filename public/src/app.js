import { render } from 'react-dom';
import routes from './routes';

const rootEl = document.getElementById('root');

render(routes, rootEl);

if (module.hot) {
  module.hot.accept('./routes', () => {
    const NextApp = require('./routes').default;
    render(<NextApp />, rootEl);
  });
}
