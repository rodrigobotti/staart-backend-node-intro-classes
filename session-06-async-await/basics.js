(async () => {

  const { join } = require('path')
  const {
    readFile,
    writeFile
  } = require('fs').promises

  const PackageJsonPath = join(__dirname, '..', 'package.json')

  const copyPackageJson = async () => {
    const data = await readFile(PackageJsonPath)  // Promise<Buffer>
    await writeFile('package.await.json', data)   // Promise<void>
    console.log('Terminou de copiar')

    await Promise.all([ // Promise<void[]>
      writeFile('./package.await.01.json', data),
      writeFile('./package.await.02.json', data)
    ])
    console.log('Terminou de copiar mais dois')
  }

  await copyPackageJson() // Promise<void>
  console.log('Terminou de executar a função de cópia')

  // erro muito comum: não saber a equivalencia Promise <-> async/await

  const database = ({
    query: (statement, args) =>
      Promise.resolve({})
  })

  // async/await desnecessário
  const getUserV1 = async id => {
    const user = await database.query('select * from user where id=?', [id])
    return user
  } // Promise<User>

  // async/await ainda mais desnecessário
  const getUserV2 = async id => {
    return await database.query('select * from user where id=?', [id])
  } // Promise<User>

  // bingo!
  const getUser = id =>
    database.query('select * from user where id=?', [id])
  // Promise<User>

  const {
    withPromises: {
      authenticate,
      listPosts,
      getPost,
    },
  } = require('../helpers/social-media')

  /**
   * "Retorna" o primeiro post do usuário da rede social.
   *
   * @param {string} username username do usuário
   * @param {string} password senha do usuário
   * @returns {Promise<Post>} primeiro post do usuário
   */
  const firstUserPost = async (username, password) => {
    const token = await authenticate(username, password)
    const posts = await listPosts(token)
    const firstPostId = posts[0].id
    return getPost(token, firstPostId)
    // const post = await getPost(token, firstPostId)
    // return post
  }

  try {
    const post = await firstUserPost('staart', 'nodelife')
    console.log(post)
  } catch (error) {
    console.error(error)
  } finally {
    console.log('Processo terminou')
  }

})()
