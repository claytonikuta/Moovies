import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default {
  reactStrictMode: true,
  babel: {
    presets: [['next/babel', { 'jsc.transform.react.throwIfNamespace': false }]],
  },
};
