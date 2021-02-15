import { Component, For } from 'solid-js'
import usePageData from '../hooks/use-metadata'
import { SEARCH_FUNCTIONS, SERVICES } from '../services'
import css from './app.module.css'
import ServiceLink from './service-link'

const App: Component = () => {
  const pageData = usePageData()

  return (
    <div className={css.app}>
      <For each={SERVICES}>
        {(service) => (
          <ServiceLink
            service={service}
            pageData={pageData}
            search={SEARCH_FUNCTIONS[service]}
          />
        )}
      </For>
    </div>
  )
}

export default App
