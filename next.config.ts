module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/music/main',
        permanent: true,
      },
    ];
  },
};
