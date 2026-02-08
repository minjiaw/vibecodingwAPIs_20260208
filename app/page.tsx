import Link from "next/link";
import styles from './styles/home.module.css';
import { bricolageGrotesque, ibmPlexMono } from './fonts';

export default function Home() {
  // Add your prototypes to this array
  const prototypes = [
    {
      title: 'Getting started',
      description: 'How to create a prototype',
      path: '/prototypes/example'
    },
    {
      title: 'Skye',
      description: 'Weather app with ethereal design',
      path: '/prototypes/skye'
    }
    // Add your new prototypes here like this:
    // {
    //   title: 'Your new prototype',
    //   description: 'A short description of what this prototype does',
    //   path: '/prototypes/my-new-prototype'
    // },
  ];

  return (
    <div className={`${styles.container} ${ibmPlexMono.className}`}>
      <header className={styles.header}>
        <h1 className={bricolageGrotesque.className}>Vibe Coding with APIs</h1>
      </header>

      <main>
        <section className={styles.grid}>
          {/* Goes through the prototypes list (array) to create cards */}
          {prototypes.map((prototype, index) => (
            <Link
              key={index}
              href={prototype.path}
              className={styles.card}
            >
              <h3 className={bricolageGrotesque.className}>{prototype.title}</h3>
              <p>{prototype.description}</p>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
