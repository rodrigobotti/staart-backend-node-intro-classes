const {
  withPromises: {
    authenticate,
    listPosts,
    getPost,
  },
} = require('../helpers/social-media')

/*
  missão: primeiro post de usuário
  função `firstUserPost`
    deve receber as credenciais como parâmetro
    deve "devolver" o primeiro post do usuer logado
    deve "devolver" erro, se houver algum
*/

/**
 * "Retorna" o primeiro post do usuário da rede social.
 *
 * @param {string} username username do usuário
 * @param {string} password senha do usuário
 * @returns {Promise<Post>} primeiro post do usuário
 */
const firstUserPost = (username, password) =>
  authenticate(username, password)
    .then(token =>
      listPosts(token)
        .then(posts => getPost(token, posts[0].id))
    )

const listPostsContext = (token) =>
  listPosts(token)
    .then(posts => ({ posts, token }))

const getFirstPostContext = ({ token, posts }) =>
  getPost(token, posts[0].id)
    .then(post => ({ post, token }))

const firstUserPostLinear = (username, passsword) =>
  authenticate(username, passsword)
    .then(listPostsContext)
    .then(getFirstPostContext)
    .then(({ post }) => post)

/*
consumindo a função:
- credenciais
- promise chain
*/

firstUserPostLinear('staart', 'nodelife')
  .then(console.log)
  .catch(console.error)
