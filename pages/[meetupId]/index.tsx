import { MongoClient, ObjectId } from 'mongodb';
import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import MeetupDetail from '../../components/meetups/MeetupDetail';
import { DATABASE_URL } from '../../constants';
import { MeetupData } from '../../interfaces';

interface MeetupDetailsProps {
  meetupData: MeetupData;
}

function MeetupDetails(props: MeetupDetailsProps) {
  return (
    <>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description} />
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const client = await MongoClient.connect(DATABASE_URL);
  const db = client.db();

  const meetupsCollection = db.collection('meetups');

  const meetups = await meetupsCollection.find({}).toArray();

  client.close();

  return {
    fallback: false,
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  // fetch data for a single meetup

  const meetupId = context.params?.meetupId as string;

  const client = await MongoClient.connect(DATABASE_URL);
  const db = client.db();

  const meetupsCollection = db.collection('meetups');

  const selectedMeetup = await meetupsCollection.findOne({
    _id: new ObjectId(meetupId),
  });

  client.close();

  if (!selectedMeetup) {
    return {
      props: {
        meetupData: {},
      },
    };
  }
  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.data.title,
        address: selectedMeetup.data.address,
        image: selectedMeetup.data.image,
        description: selectedMeetup.data.description,
      },
    },
  };
};

export default MeetupDetails;
