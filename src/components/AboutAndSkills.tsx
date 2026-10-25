import { useId, useState } from 'react'
import { ChevronRight, Mail, ExternalLink } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from './BrandIcons'
import type { SkillCategory } from '../types'
import { profile } from '../data/profile'
import SkillItem from './SkillItem'
import { getSearchIntent, matchesSearchTerm } from '../utils/portfolioSearch'

interface AboutAndSkillsProps {
  skillCategories: SkillCategory[]
  searchQuery?: string
  showOnlyAbout?: boolean
  showOnlySkills?: boolean
  showOnlyContact?: boolean
  onSkillClick?: (skillName: string) => void
  isContactHighlighted?: boolean
}

const skillEmojis: Record<string, string> = {
  technical: '💻',
  financial: '📈',
  tools: '🛠️',
  soft: '🤝',
}

function Portrait() {
  const [showPhoto, setShowPhoto] = useState(false)
  return (
    <button
      type="button"
      onClick={() => setShowPhoto((value) => !value)}
      aria-label={showPhoto ? 'Show illustrated portrait' : 'Show photograph of Vandan'}
      aria-pressed={showPhoto}
      className="relative shrink-0 w-28 h-28 lg:w-32 lg:h-32 rounded-xl group"
    >
      <img
        src={profile.avatar}
        alt=""
        width="112"
        height="112"
        className={`absolute -top-3 -right-3 w-36 h-36 lg:-top-4 lg:-right-4 lg:w-40 lg:h-40 object-contain transition-opacity ${showPhoto ? 'opacity-0' : 'opacity-100 group-hover:opacity-0'}`}
      />
      <span
        className={`absolute top-0 right-0 w-28 h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden border border-white/10 ring-1 ring-white/20 shadow-lg shadow-black/50 transition-all duration-300 ${showPhoto ? 'opacity-100 scale-100' : 'opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100'}`}
      >
        <img
          src={profile.photo}
          alt=""
          width="128"
          height="128"
          loading="lazy"
          className="w-full h-full object-cover scale-125 translate-x-2 -translate-y-2"
        />
      </span>
    </button>
  )
}

function Contacts({ highlighted, compact = false }: { highlighted: boolean; compact?: boolean }) {
  const links = [
    { label: 'GitHub', url: profile.github, Icon: GithubIcon, brand: 'github' },
    { label: 'LinkedIn', url: profile.linkedin, Icon: LinkedinIcon, brand: 'linkedin' },
    { label: 'Email', url: `mailto:${profile.email}`, Icon: Mail, brand: 'email' },
  ]
  return (
    <div
      data-section="contact"
      className={`${highlighted ? 'milestone-highlight rounded-xl' : ''} ${compact ? 'flex gap-2 pt-4 mt-4 border-t border-[#343b3f]' : ''}`}
    >
      {!compact && <h3 className="sidebar-heading">Connect</h3>}
      {links.map(({ label, url, Icon, brand }) => (
        <a
          key={label}
          data-brand={brand}
          data-compact={compact}
          href={url}
          target={label === 'Email' ? undefined : '_blank'}
          rel="noopener noreferrer"
          className={`contact-link ${compact ? 'flex flex-1 items-center justify-center gap-1.5 rounded-full bg-black/20 py-3 text-xs text-gray-200' : 'flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/[0.04] transition-colors'}`}
        >
          <span
            className={
              compact
                ? 'flex shrink-0 items-center justify-center'
                : 'p-2.5 rounded-lg bg-[#1d2124]'
            }
          >
            <Icon className={`contact-brand-icon ${compact ? 'w-4 h-4' : 'w-5 h-5'}`} />
          </span>
          <span className={compact ? '' : 'flex-1'}>{label}</span>
          {!compact && (
            <ExternalLink className="contact-external-icon w-4 h-4 text-gray-500 transition-colors" />
          )}
        </a>
      ))}
    </div>
  )
}

export default function AboutAndSkills({
  skillCategories,
  searchQuery = '',
  showOnlyAbout = false,
  showOnlySkills = false,
  showOnlyContact = false,
  onSkillClick,
  isContactHighlighted = false,
}: AboutAndSkillsProps) {
  const [expandedLists, setExpandedLists] = useState<Set<string>>(new Set())
  const baseId = useId()
  const combined = !showOnlyAbout && !showOnlySkills && !showOnlyContact
  const intent = getSearchIntent(searchQuery)
  const shouldFilter = intent.active && intent.terms.length > 0
  const categories = skillCategories
    .map((category) => ({
      ...category,
      skills: category.skills.filter(
        (skill) =>
          !shouldFilter || intent.terms.some((term) => matchesSearchTerm(skill.name, term)),
      ),
    }))
    .filter((category) => category.skills.length)

  const skills = (
    <div>
      {categories.length === 0 && (
        <p className="text-sm text-gray-400 py-4">No matching skills. Try another keyword.</p>
      )}
      {categories.map((category) => {
        const expanded = expandedLists.has(category.id) || shouldFilter
        const panelId = `${baseId}-${category.id}`
        return (
          <div key={category.id}>
            <button
              type="button"
              onClick={() =>
                setExpandedLists((previous) => {
                  const next = new Set(previous)
                  if (next.has(category.id)) next.delete(category.id)
                  else next.add(category.id)
                  return next
                })
              }
              aria-expanded={expanded}
              aria-controls={panelId}
              className="w-full flex items-center gap-3 text-left py-4 lg:px-4 hover:bg-white/[0.03] rounded-lg"
            >
              <span
                className="w-9 h-10 rounded-md bg-[#1e2326] flex items-center justify-center"
                aria-hidden="true"
              >
                {skillEmojis[category.icon]}
              </span>
              <span className="flex-1 text-sm font-medium">{category.name}</span>
              <ChevronRight
                className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? 'rotate-90' : ''}`}
              />
            </button>
            <div id={panelId} hidden={!expanded} className="px-2 lg:px-0 pb-2">
              {category.skills.map((skill) => (
                <SkillItem
                  key={skill.id}
                  skill={skill}
                  isActive={searchQuery.toLowerCase() === skill.name.toLowerCase()}
                  onClick={() => onSkillClick?.(skill.name)}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )

  const about = (
    <div
      data-section="about"
      className={combined ? 'px-5 pt-4 pb-5' : 'bg-[#1d2124] rounded-2xl p-4'}
    >
      <div className="flex items-center gap-3 justify-between">
        <div className="min-w-0">
          <h3 className="text-lg font-medium mb-1">{profile.name}</h3>
          <p className="text-sm text-[#a5afb5] leading-relaxed">
            {profile.disciplines}
            <br />@ {profile.school}
          </p>
          <p
            className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-[#252a2d] border border-[#394146] pl-1 pr-2.5 py-1 text-xs text-gray-300 mt-2"
            title={profile.location}
          >
            <img
              src="/images/tags/location.png"
              alt=""
              width="20"
              height="20"
              className="w-5 h-5 shrink-0 rounded-full"
            />
            <span className="truncate">{profile.location}</span>
          </p>
        </div>
        <Portrait />
      </div>
      <p className="text-sm text-[#a5afb5] leading-relaxed mt-4 pt-4 border-t border-[#2d2d2d]">
        {profile.bio}
      </p>
      {!combined && <Contacts highlighted={isContactHighlighted} compact />}
    </div>
  )

  if (showOnlySkills)
    return (
      <section aria-label="Skills">
        <h2 className="text-[22px] sm:text-2xl font-medium mb-3">Skills</h2>
        {skills}
      </section>
    )
  if (showOnlyContact) return <Contacts highlighted={isContactHighlighted} />
  if (showOnlyAbout)
    return (
      <section aria-label="About Vandan">
        <h2 className="text-[22px] sm:text-2xl font-medium mb-3">About Me</h2>
        {about}
      </section>
    )

  return (
    <aside
      aria-label="About and skills"
      className="rounded-lg border border-[#30373b] overflow-hidden"
    >
      <h2 className="sidebar-heading">About Me</h2>
      {about}
      <Contacts highlighted={isContactHighlighted} />
      <h2 className="sidebar-heading">Skills & tools</h2>
      {skills}
    </aside>
  )
}
