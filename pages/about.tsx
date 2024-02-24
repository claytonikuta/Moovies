// pages/index.tsx

export default function Home() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center', // This vertically centers the content within the entire viewport
        alignItems: 'flex-start', // This aligns items to the start of the cross axis
        width: '90%', // This sets the width of the element
        maxWidth: '800px', // This ensures that the content does not stretch beyond 800px
        margin: '0 auto', // This centers the flex container in the middle of the viewport
        padding: '2em', // This adds some padding around the content
      }}
    >
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '1em' }}>About Moovies</h1>
      </div>
      <p style={{ fontSize: '1.2em', lineHeight: '1.6' }}>
        Welcome to Moovies, your new go-to platform for all things cinema. Powered by The Movie
        Database (TMDb), Moovies offers a comprehensive and user-friendly interface for movie
        enthusiasts and casual viewers alike.
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
      <p style={{ fontSize: '1.2em', lineHeight: '1.6' }}>
        Join us at Moovies and start exploring the world of cinema at your fingertips.
      </p>
    </div>
  );
}
