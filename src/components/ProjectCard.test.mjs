import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { moduleUrl } from '../../tests/load-typescript.mjs'

const { default: ProjectCard } = await import(
  moduleUrl(new URL('./ProjectCard.tsx', import.meta.url))
)
const { portfolioProjects } = await import(
  moduleUrl(new URL('../data/portfolioData.ts', import.meta.url))
)

test('each project destination appears once in both collapsed and expanded cards', () => {
  for (const project of portfolioProjects) {
    for (const isExpanded of [false, true]) {
      const markup = renderToStaticMarkup(createElement(ProjectCard, { project, isExpanded }))
      const destinations = [...markup.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map((match) => match[1])
      assert.deepEqual(
        destinations.sort(),
        [project.githubUrl, project.liveUrl].filter(Boolean).sort(),
        `${project.name}: ${isExpanded ? 'expanded' : 'collapsed'} has duplicate or missing destinations`,
      )
      assert.ok(markup.includes(`aria-expanded="${isExpanded}"`))
    }
  }
})
