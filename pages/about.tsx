// pages/index.tsx

export default function Home() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: '90%',
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2em',
      }}
    >
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '1em' }}>About Moovies</h1>
      </div>
      <p style={{ fontSize: '1.2em', lineHeight: '1.6' }}>
        Welcome to Moovies, your new go-to platform for all things cinema. Moovies offers a
        comprehensive and user-friendly interface for movie enthusiasts and casual viewers alike.
      </p>
      <p style={{ fontSize: '1.2em', lineHeight: '1.6' }}>
        Built with Next.js, a leading React framework, and MongoDB, a flexible, scalable NoSQL
        database, Moovies provides a seamless and responsive user experience.
      </p>
      <p style={{ fontSize: '1.2em', lineHeight: '1.6' }}>
        With Moovies, you can easily add any movie to your favourites, watchlist, or watched lists.
        Whether you&apos;re planning a movie night, looking for recommendations, or just want to
        keep track of films you&apos;ve watched, Moovies has you covered.
      </p>
      <p style={{ textAlign: 'center', fontSize: '1.2em', lineHeight: '1.6', fontStyle: 'italic' }}>
        This product uses the TMDb API but is not endorsed or certified by TMDb.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '10px' }}>
        <img src="/tmdb-logo.svg" alt="TMDb Logo" style={{ width: '10%' }} />
      </div>
    </div>
  );
}
