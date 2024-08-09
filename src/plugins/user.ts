// const fp = require('fastify-plugin')

// function myPlugin(instance: any, options: any, done: any) {

//     // decorate the fastify instance with a custom function called myPluginFunc
//     instance.decorate('myPluginFunc', (input: string) => {
//         return input.toUpperCase()
//     })

//     done()
// }

// module.exports = fp(myPlugin, {
//     fastify: '3.x',
//     name: 'my-plugin' // this is used by fastify-plugin to derive the property name
// })