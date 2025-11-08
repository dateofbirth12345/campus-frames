import { StoryCard } from '../StoryCard';

export default function StoryCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      <StoryCard
        id="1"
        title="How I Overcame Test Anxiety"
        excerpt="For years, I would freeze during exams. My mind would go blank and my hands would shake. But with help from our school counselor and some simple breathing techniques..."
        category="Overcoming Anxiety"
        author="Anonymous Student"
        likes={45}
        publishedAt="2 days ago"
        onLike={() => console.log('Liked')}
        onShare={() => console.log('Shared')}
        onView={() => console.log('Viewed')}
      />
      <StoryCard
        id="2"
        title="Finding My Voice: Standing Up to Peer Pressure"
        excerpt="I used to think saying no would make me lose friends. This is the story of how I learned that real friends respect your boundaries..."
        category="Peer Pressure"
        author="Maya K."
        likes={67}
        publishedAt="5 days ago"
        onLike={() => console.log('Liked')}
        onShare={() => console.log('Shared')}
        onView={() => console.log('Viewed')}
      />
      <StoryCard
        id="3"
        title="Small Steps to Big Changes"
        excerpt="Mental health isn't about dramatic transformations. It's about the small daily choices that add up. Here's what worked for me..."
        category="Self Care"
        author="Jordan M."
        likes={89}
        publishedAt="1 week ago"
        onLike={() => console.log('Liked')}
        onShare={() => console.log('Shared')}
        onView={() => console.log('Viewed')}
      />
    </div>
  );
}
