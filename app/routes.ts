import { type RouteConfig, index, route } from '@react-router/dev/routes'

export default [
  index('routes/home.tsx'),
  route('events', 'routes/events.tsx'),
  route('api/comment', 'routes/api/comment.tsx'),
] satisfies RouteConfig
