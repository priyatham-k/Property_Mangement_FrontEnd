import { BrowserRouter as Router } from 'react-router-dom';

import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'

import './App.scss';
import AppRoutes from './routes';
import { AuthProvider } from './contexts/AuthContext';



function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <AppRoutes />

        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
library.add(fab, fas, far)
