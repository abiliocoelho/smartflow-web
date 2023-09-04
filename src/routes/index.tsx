import { Routes as Router, Route } from 'react-router-dom'

import { SignIn } from '../pages/SignIn'
import { Dashboard } from '../pages/Dashboard'
import { ProtectedRoute } from './ProtectedRoute'
import { NotFound } from '../pages/NotFound'

export function Routes() {
  return (
    <Router>
      <Route path="/" element={<SignIn />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Router>
  )
}
