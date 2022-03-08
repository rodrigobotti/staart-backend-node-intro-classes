const AuthToken = 'super_secret_and_secure_token'
const AuthUsername = 'staart'
const AuthPassword = 'nodelife'

const Posts = [
  {
    id: 1,
    title: 'Aula muito legal de Node.JS',
    content: `Assisti um curso muito legal de Node.JS na plataforma Staart.
    Mas pelos exemplos passados acho que o professor é meio doido.`,
  },
  {
    id: 2,
    title: 'Doloribus ut facere ea adipisci.',
    content: 'Similique quisquam reprehenderit. Hic odit maxime laudantium omnis aperiam earum ut odit. Error voluptas recusandae laborum. Dicta cum quis quidem laborum. Laudantium unde tempore et sed sunt.'
  },
  {
    id: 3,
    title: 'Sed laborum nam.',
    content: 'Numquam et sunt sit distinctio omnis voluptatem ea veniam. Rerum aperiam ut aperiam. Sunt reprehenderit et labore voluptate voluptate temporibus molestiae. Dolor sed deserunt et recusandae esse cumque consequatur. Magnam facilis sed quas ea nostrum et.'
  },
  {
    id: 4,
    title: 'Quam maiores doloribus hic et est sed.',
    content: 'Exercitationem ipsam eos minima deserunt tenetur culpa. Voluptatem quis ea mollitia esse. Adipisci quis odit at labore aliquid libero ex. Sequi nobis ea quia dignissimos nobis voluptatum eos voluptas. Veritatis repudiandae repudiandae veritatis est at earum suscipit.'
  },
  {
    id: 5,
    title: 'Nobis molestiae assumenda modi sed sit culpa quis iste et.',
    content: 'Ab eligendi perspiciatis eum atque optio qui fugiat. Laborum quia eum et temporibus qui iure consequatur aut. Alias a ipsam dolor aut repudiandae et libero. Voluptatum maxime sequi voluptas ad aspernatur. Id unde alias tenetur qui sunt voluptatum maxime suscipit.'
  },
  {
    id: 6,
    title: 'Consequuntur quia illo autem sequi dicta aut aliquid.',
    content: 'Sed tenetur ex. Eaque laborum et officiis. Natus dolor qui quibusdam. Dolore tempore facere laudantium praesentium provident voluptatem dolores. Id sit reprehenderit.'
  },
  {
    id: 7,
    title: 'Ut omnis sed et et dolores quis placeat sed.',
    content: 'Aliquam corrupti numquam dolorem praesentium voluptatem debitis molestiae dolor distinctio. Aut et eum dicta labore. Eos sequi amet natus ad. Provident nostrum ipsam laboriosam. Tempora nesciunt eius aut magnam facilis consectetur enim possimus.'
  },
  {
    id: 8,
    title: 'Laudantium et sed voluptas.',
    content: 'Delectus perferendis dolores tenetur sequi et iste provident. Harum porro voluptas officiis. Quod et ea aut asperiores sed rerum. Laudantium aut minima nostrum incidunt. Consequatur dolores at dicta molestiae.'
  },
  {
    id: 9,
    title: 'Fugit eum voluptatibus laboriosam.',
    content: 'Omnis ut molestias ratione sit autem doloribus. Quod ut ut nobis. Aut vel ut. Vitae repudiandae eveniet. Labore et quis in dolores necessitatibus pariatur nisi.'
  },
  {
    id: 10,
    title: 'Dicta soluta error vel magni minima sunt.',
    content: 'Eos aut exercitationem enim alias ipsum. Soluta corporis ullam doloribus natus ut. Molestiae impedit quia voluptates est iste. Eligendi et voluptas delectus quisquam architecto quae ut. Eaque perferendis in rerum et recusandae autem fugit.'
  },
]

const findPost = id =>
  Posts.find(({ id: storyId }) => storyId === id)

const checkCredentials = (username, password) =>
  username === AuthUsername && password === AuthPassword

const checkToken = token => token === AuthToken

/** @typedef {{id:number, title:string, content:string}} Post */

const withCallbacks = (() => {
  /**
   * Autentica o usuário na rede social.
   *
   * @param {string} username username do usuário
   * @param {string} password senha do usuário
   * @param {(error: Error, token: string) => void} cb callback error-first com token de autenticação
   * @returns {void}
   */
  const authenticate = (username, password, cb) =>
    setTimeout(() =>
      checkCredentials(username, password)
        ? cb(null, AuthToken)
        : cb(Error('Invalid credentials'), null)
      , 500)

  /**
   * Lista todos os posts do usuário autententicado.
   *
   * @param {string} token token do usuário autenticado
   * @param {(error: Error, posts: Post[]) => void} cb callback error-first com lista de posts
   * @returns {void}
   */
  const listPosts = (token, cb) =>
    setTimeout(() =>
      checkToken(token)
        ? cb(null, Posts)
        : cb(Error('Invalid access token'), null)
      , 500)

  const findPostAsync = (id, cb) => {
    const found = findPost(id)
    return found
      ? cb(null, found)
      : cb(Error(`Story with id=${id} not found`), null)
  }

  /**
   * Obtem o post identificado pelo id.
   *
   * @param {string} token token do usuário autenticado
   * @param {number} id id do post
   * @param {(error: Error, post: Post) => void} cb callback error-first com o post
   * @returns {void}
   */
  const getPost = (token, id, cb) =>
    setTimeout(() =>
      checkToken(token)
        ? findPostAsync(id, cb)
        : cb(Error('Invalid access token'), null)
      , 500)

  return {
    authenticate,
    listPosts,
    getPost,
  }

})()

const withPromises = (() => {
  const delay = time =>
    new Promise(resolve =>
      setTimeout(resolve, time))

  /**
   * Autentica o usuário na rede social.
   *
   * @param {string} username username do usário
   * @param {string} password senha do usuário
   * @returns {Promise<string>} token de autenticação
   */
  const authenticate = (username, password) =>
    delay(500)
      .then(() =>
        checkCredentials(username, password)
          ? AuthToken
          : Promise.reject(Error('Invalid credentials'))
      )

  const validateToken = token =>
    checkToken(token)
      ? Promise.resolve(token)
      : Promise.reject(Error('Invalid token'))

  /**
   * Lista todos os posts do usuário autententicado.
   *
   * @param {string} token token do usuário autenticado
   * @returns {Promise<Post[]>} lista de posts
   */
  const listPosts = token =>
    validateToken(token)
      .then(() => delay(500))
      .then(() => Posts)

  const findPostAsync = id =>
    Promise.resolve(
      findPost(id) ?? Promise.reject(Error(`Post with id=${id} not found`))
    )

  /**
   * Obtem o post identificado pelo id.
   *
   * @param {string} token token do usuário autenticado
   * @param {number} id id do post
   * @returns {Promise<Post>} post
   */
  const getPost = (token, id) =>
    validateToken(token)
      .then(() => delay(500))
      .then(() => findPostAsync(id))

  return {
    authenticate,
    listPosts,
    getPost
  }
})()

module.exports = {
  withCallbacks,
  withPromises,
}
