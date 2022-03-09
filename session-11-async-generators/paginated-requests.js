const { delay } = require('../helpers')

const google = (() => {
  const linksPerPage = 10
  const links = [
    'http://janick.org',
    'https://tyrese.info',
    'http://rowena.net',
    'https://marlin.com',
    'http://whitney.name',
    'http://elvie.com',
    'http://maureen.net',
    'http://wilburn.info',
    'http://irma.com',
    'https://esmeralda.org',
    'https://emily.org',
    'http://ubaldo.net',
    'http://reanna.net',
    'http://elisabeth.biz',
    'https://larry.net',
    'https://viola.com',
    'https://perry.com',
    'http://milford.name',
    'http://kristopher.name',
    'http://hillard.biz',
    'https://cordia.name',
    'https://johanna.name',
    'http://dion.info',
    'https://melissa.org',
    'https://ed.com',
    'https://bethel.net',
    'https://stephan.info',
    'https://henderson.biz',
    'http://emil.com',
    'http://israel.org',
    'http://greyson.name',
    'http://annabell.info',
    'https://viva.net',
    'http://misael.info',
    'http://clemens.info',
    'http://jolie.biz',
    'http://connie.name',
    'https://omer.org',
    'https://madisyn.biz',
    'https://mikayla.org',
    'https://cicero.info',
    'https://cameron.biz',
    'https://rogers.org',
    'http://abigail.org',
    'http://rae.name',
    'http://blaise.net',
    'http://guiseppe.info',
    'http://maria.com',
    'http://casimir.com',
    'https://nia.org',
    'http://lewis.info',
    'http://malika.org',
    'http://toy.name',
    'https://name.net',
    'https://jimmy.com',
  ]

  const search = async (query, page = 1) => {
    await delay(500)
    const offset = (page - 1) * linksPerPage
    return {
      links: links.slice(offset, offset + linksPerPage),
      total: links.length,
    }
  }

  return {
    search,
  }
})()

// missão: async generator getAllLinksUntil que:
// emite todos os links de todas as páginas até o limite

async function* getAllLinksUntil (query, lastPage) {
  let page = 1
  let fetchedLinks = 0
  let keepGoing = true

  while (keepGoing) {
    const { links, total } = await google.search(query, page)
    fetchedLinks += links.length
    page++
    keepGoing = page <= lastPage && fetchedLinks < total
    for (const link of links) {
      yield link
    }
  }
}

const main = async () => {
  const lastPage = 2 // 20 links
  // const lastPage = 300 // 55 links
  const query = 'nodejs'
  let index = 1

  for await(const link of getAllLinksUntil(query, lastPage)) {
    console.log(`${query} -> [${index++}] ${link}`)
  }
}

main()
