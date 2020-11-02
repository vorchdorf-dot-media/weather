module.exports = {
  mongodbMemoryServerOptions: {
    autoStart: false,
    binary: {
      skipMD5: true,
      version: '4.2.10',
    },
    debug: true,
    instance: {
      dbName: 'testdb',
    },
  },
};
