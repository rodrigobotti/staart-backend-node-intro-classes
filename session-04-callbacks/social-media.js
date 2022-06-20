const {
  withCallbacks: {
    authenticate,
    listPosts,
    getPost,
  }
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
 * @param {(error: Error, post: Post) => void} callback callback error-first. Recebe o primeiro post do usuário ou erro.
 */
const firstUserPost = (username, password, callback) => {
  // PS: lembrar de converter pra early-return durante a aula
  authenticate(username, password, (authErr, token) => {
    if (authErr) {
      console.error('> Erro de autenticação')
      callback(authErr)

    } else {
        console.log('> Autenticado com sucesso')
        listPosts(token, (listError, storyList) => {

        if (listError) {
          console.error('>> Erro ao listar os posts')
          callback(listError)

        } else {
          console.log(`>> ${storyList.length} posts listados com sucesso`)

          const postId = storyList[0].id
          getPost(token, postId, (storyError, firstStory) => {

            if (storyError) {
              console.error(`>>> Erro ao buscar post com id ${postId}`)
              callback(storyError)

            } else {
              console.log(`>>> Post ${postId} obtido com sucesso`)
              callback(null, firstStory)
            }
          })
        }
      })
    }
  })
}

/*
consumindo a função:
- credenciais
- callback error-first
*/
firstUserPost('staart', 'nodelife', (error, firstPost) => {
  if (error) {
    console.error(error)
  } else {
    console.log('>>>>', firstPost)
  }
})
