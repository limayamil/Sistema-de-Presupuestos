import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ClientProvider } from './context/ClientContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ClientsPage from './pages/ClientsPage';
import NewClientPage from './pages/NewClientPage';
import EditClientPage from './pages/EditClientPage';
import ClientNotesPage from './pages/ClientNotesPage';
import ReportsPage from './pages/ReportsPage';
import ExportPage from './pages/ExportPage';

function App() {
  return (
    <ClientProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/clients/new" element={<NewClientPage />} />
            <Route path="/clients/edit/:id" element={<EditClientPage />} />
            <Route path="/clients/:id/notes" element={<ClientNotesPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/export" element={<ExportPage />} />
          </Routes>
        </Layout>
      </Router>
    </ClientProvider>
  );
}

export default App;