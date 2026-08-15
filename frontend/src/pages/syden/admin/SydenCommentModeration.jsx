export default function SydenCommentModeration() {
  return (
    <div className="bg-[var(--bg)] min-h-screen px-4 py-12 text-[var(--text)]">
      <div className="max-w-6xl mx-auto rounded-3xl bg-white p-10 shadow-2xl">
        <h1 className="text-4xl font-bold mb-6">Comment Moderation</h1>
        <div className="space-y-4">
          {['Comment removed by user', 'Comment awaiting review', 'Reply approved'].map((text, index) => (
            <div key={index} className="rounded-3xl border border-gray-200 p-6">
              <p className="text-sm text-gray-500">{text}</p>
              <button className="mt-4 rounded-full bg-[#E2725B] px-6 py-3 text-white font-semibold">Review</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
