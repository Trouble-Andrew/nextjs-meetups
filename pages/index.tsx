import { MongoClient } from 'mongodb';
import Head from 'next/head';
import MeetupList from '../components/meetups/MeetupList';
import { DATABASE_URL } from '../constants';
import { MeetupData } from '../interfaces';

interface HomePageProps {
  meetups: MeetupData[];
}

function HomePage(props: HomePageProps) {
  return (
    <>
      <Head>
        <title>Meetups</title>
        <meta
          name="description"
          content="Browse  a huge list of highly active React meetups"
        />
      </Head>
      <MeetupList meetups={props.meetups} />
    </>
  );
}

// export async function getServerSideProps(context: { req: any; res: any }) {
//   const req = context.req;
//   const res = context.res;
//   // fetch data from API

//   return {
//     props: {
//       meetups: MEETUPS,
//     },
//   };
// }

export async function getStaticProps() {
  // fetch data from API

  const client = await MongoClient.connect(DATABASE_URL);
  const db = client.db();
  const meetupsCollection = db.collection('meetups');

  const meetups = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.data.title,
        address: meetup.data.address,
        image: meetup.data.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 1,
  };
}

export default HomePage;
