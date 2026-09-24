import BriefcaseIcon from '@iconify-react/majesticons/briefcase'
import { Link } from 'react-router-dom'
import Button from './Button'

export default function AppHeader() {
  return (
    <header className="border-b border-[#dfe3dd]">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between border-x border-[#dfe3dd] bg-white px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5 text-lg font-semibold text-[#173f35]">
          <span className="grid size-9 place-items-center rounded-md bg-[#173f35] text-white">
            <BriefcaseIcon aria-hidden="true" width="19" height="19" />
          </span>
          JobRater
        </Link>
        <Button variant="primary">Add an offer</Button>
      </div>
    </header>
  )
}
