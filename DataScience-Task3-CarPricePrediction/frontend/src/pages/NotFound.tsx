import { ButtonLink } from '../components/ui/button'

export default function NotFoundPage() {
  return (
    <div className="container-x py-32 text-center">
      <p className="text-sm font-semibold text-accent">404</p>
      <h1 className="mt-2 text-3xl font-semibold">Page not found</h1>
      <p className="mt-2 text-muted">The page you're looking for doesn't exist.</p>
      <ButtonLink to="/" className="mt-8">Back to home</ButtonLink>
    </div>
  )
}
