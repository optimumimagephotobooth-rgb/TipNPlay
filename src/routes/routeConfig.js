import Home from '../pages/Home'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import CreateEvent from '../pages/CreateEvent'
import DJDashboard from '../pages/DJDashboard'
import TipPage from '../pages/TipPage'
import Profile from '../pages/Profile'
import LiveStreamSetup from '../pages/LiveStreamSetup'
import NotFound from '../pages/NotFound'

const routeDefinitions = [
  {
    path: '/',
    Component: Home,
    navLabel: 'Home',
  },
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/signup',
    Component: Signup,
  },
  {
    path: '/create-event',
    Component: CreateEvent,
    requiresAuth: true,
    navLabel: 'Create Event',
  },
  {
    path: '/dj-dashboard',
    Component: DJDashboard,
    requiresAuth: true,
    navLabel: 'Dashboard',
  },
  {
    path: '/profile',
    Component: Profile,
    requiresAuth: true,
    navLabel: 'Profile',
  },
  {
    path: '/live-stream-setup',
    Component: LiveStreamSetup,
    requiresAuth: true,
  },
  {
    path: '/tip/:eventId',
    Component: TipPage,
  },
  {
    path: '*',
    Component: NotFound,
  },
]

export const navLinks = routeDefinitions
  .filter((route) => Boolean(route.navLabel))
  .map(({ path, navLabel, requiresAuth }) => ({
    path,
    label: navLabel,
    requiresAuth: Boolean(requiresAuth),
  }))

export default routeDefinitions

